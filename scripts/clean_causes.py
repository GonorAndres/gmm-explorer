"""
clean_causes.py
Limpia y normaliza las causas de siniestros para reducir duplicados.

Estrategia:
1. Normalizar texto (mayúsculas, espacios, puntuación)
2. Remover acentos para comparación
3. Buscar coincidencias por prefijo (causas truncadas de 2020)
4. Fuzzy matching para el resto
5. Generar CSV de mapeo para revisión

Uso:
    python scripts/clean_causes.py              # Genera mapeo
    python scripts/clean_causes.py --apply      # Aplica correcciones después de revisión
"""

import pandas as pd
import numpy as np
import unicodedata
import re
from pathlib import Path
from difflib import SequenceMatcher
import sys

# Rutas
BASE_DIR = Path(__file__).parent.parent
DATA_CONSOLIDATED = BASE_DIR / "data" / "consolidated"
DATA_CLEANING = BASE_DIR / "data" / "cleaning"
OUTPUTS = BASE_DIR / "outputs"

# Asegurar que existan los directorios
DATA_CLEANING.mkdir(parents=True, exist_ok=True)
OUTPUTS.mkdir(parents=True, exist_ok=True)


def normalizar_texto(texto: str) -> str:
    """
    Normaliza texto: mayúsculas, espacios simples, sin espacios al inicio/fin.
    """
    if pd.isna(texto):
        return texto
    texto = str(texto).upper().strip()
    texto = re.sub(r'\s+', ' ', texto)  # Múltiples espacios a uno
    return texto


def remover_acentos(texto: str) -> str:
    """
    Remueve acentos para comparación.
    CARDIOMIOPATÍA → CARDIOMIOPATIA
    """
    if pd.isna(texto):
        return texto
    # Normalizar a forma NFD (separar caracteres y acentos)
    texto_nfd = unicodedata.normalize('NFD', texto)
    # Filtrar solo caracteres ASCII (remover acentos)
    texto_sin_acentos = ''.join(c for c in texto_nfd if unicodedata.category(c) != 'Mn')
    return texto_sin_acentos


def similitud(a: str, b: str) -> float:
    """
    Calcula similitud entre dos strings (0-1).
    """
    return SequenceMatcher(None, a, b).ratio()


def get_first_word(texto: str) -> str:
    """
    Obtiene la primera palabra del texto para blocking.
    """
    if pd.isna(texto) or not texto:
        return ""
    return texto.split()[0] if texto.split() else ""


def build_blocking_index(causas: set) -> dict:
    """
    Construye un índice por primera palabra para búsqueda eficiente.
    Reduce comparaciones de O(n²) a O(n*k) donde k << n.
    """
    index = {}
    for causa in causas:
        first_word = get_first_word(causa)
        if first_word not in index:
            index[first_word] = []
        index[first_word].append(causa)
    return index


def es_prefijo(truncado: str, completo: str, min_len: int = 20) -> bool:
    """
    Verifica si 'truncado' es un prefijo de 'completo'.
    Solo considera si truncado tiene al menos min_len caracteres.
    """
    if len(truncado) < min_len:
        return False
    return completo.startswith(truncado)


def generar_mapeo():
    """
    Genera el archivo causa_mapping.csv con sugerencias de corrección.
    """
    print("=" * 70)
    print("GENERANDO MAPEO DE CAUSAS")
    print("=" * 70)

    # Cargar datos
    print("\n[1/6] Cargando datos consolidados...")
    df = pd.read_parquet(DATA_CONSOLIDATED / "siniestros.parquet")
    print(f"  Filas totales: {len(df):,}")

    # Calcular estadísticas por causa
    print("\n[2/6] Calculando estadísticas por causa...")
    causa_stats = df.groupby('CAUSA').agg({
        'NUM_SINIESTROS': 'sum',
        'ANIO': lambda x: ','.join(map(str, sorted(x.unique())))
    }).reset_index()
    causa_stats.columns = ['causa_original', 'frecuencia', 'anios']
    causa_stats['num_anios'] = causa_stats['anios'].apply(lambda x: len(x.split(',')))

    print(f"  Causas únicas: {len(causa_stats):,}")

    # Normalizar texto
    print("\n[3/6] Normalizando texto...")
    causa_stats['causa_normalizada'] = causa_stats['causa_original'].apply(normalizar_texto)
    causa_stats['causa_sin_acentos'] = causa_stats['causa_normalizada'].apply(remover_acentos)

    # Separar causas de múltiples años (referencia) vs un solo año (a corregir)
    multi_year = causa_stats[causa_stats['num_anios'] > 1].copy()
    single_year = causa_stats[causa_stats['num_anios'] == 1].copy()

    print(f"  Causas multi-año (referencia): {len(multi_year):,}")
    print(f"  Causas de 1 año (a revisar): {len(single_year):,}")

    # Crear diccionario de referencia
    ref_causas = set(multi_year['causa_normalizada'].unique())
    ref_sin_acentos = {remover_acentos(c): c for c in ref_causas}

    # Construir índice de blocking para fuzzy matching eficiente
    print("  Construyendo índice de blocking...")
    ref_sin_acentos_set = set(ref_sin_acentos.keys())
    blocking_index = build_blocking_index(ref_sin_acentos_set)

    # Procesar mapeo
    print("\n[4/6] Buscando coincidencias...")
    mapping_rows = []

    # Primero: causas multi-año (sin cambios)
    for _, row in multi_year.iterrows():
        mapping_rows.append({
            'causa_original': row['causa_original'],
            'causa_corregida': row['causa_normalizada'],
            'tipo_correccion': 'sin_cambio',
            'similitud': 1.0,
            'frecuencia': row['frecuencia'],
            'anios': row['anios'],
            'num_anios': row['num_anios']
        })

    # Segundo: causas de un solo año
    n_truncado = 0
    n_acento = 0
    n_typo = 0
    n_sin_match = 0

    for idx, row in single_year.iterrows():
        causa_orig = row['causa_original']
        causa_norm = row['causa_normalizada']
        causa_sin_ac = row['causa_sin_acentos']

        mejor_match = None
        mejor_sim = 0
        tipo = 'sin_cambio'

        # 1. Verificar si es idéntica después de normalizar
        if causa_norm in ref_causas:
            mejor_match = causa_norm
            mejor_sim = 1.0
            tipo = 'normalizacion'

        # 2. Verificar coincidencia por acentos
        elif causa_sin_ac in ref_sin_acentos:
            mejor_match = ref_sin_acentos[causa_sin_ac]
            mejor_sim = 0.99
            tipo = 'acento'
            n_acento += 1

        # 3. Verificar si es prefijo truncado (principalmente 2020)
        else:
            for ref in ref_causas:
                if es_prefijo(causa_norm, ref):
                    sim = len(causa_norm) / len(ref)
                    if sim > mejor_sim:
                        mejor_match = ref
                        mejor_sim = sim
                        tipo = 'truncado'

            if tipo == 'truncado':
                n_truncado += 1

        # 4. Fuzzy matching para el resto (usando blocking por primera palabra)
        if mejor_match is None:
            first_word = get_first_word(causa_sin_ac)
            # Solo comparar con causas que tienen la misma primera palabra
            candidates = blocking_index.get(first_word, [])

            for ref_sin_ac in candidates:
                # Filtro de longitud: skip si diferencia >25%
                len_ratio = len(causa_sin_ac) / len(ref_sin_ac) if len(ref_sin_ac) > 0 else 0
                if len_ratio < 0.75 or len_ratio > 1.33:
                    continue

                sim = similitud(causa_sin_ac, ref_sin_ac)
                if sim > mejor_sim and sim >= 0.90:
                    mejor_match = ref_sin_acentos[ref_sin_ac]  # Obtener versión con acentos
                    mejor_sim = sim
                    tipo = 'typo'

            if tipo == 'typo':
                n_typo += 1

        # 5. Sin coincidencia encontrada
        if mejor_match is None:
            mejor_match = causa_norm
            mejor_sim = 1.0
            tipo = 'sin_cambio'
            n_sin_match += 1

        mapping_rows.append({
            'causa_original': causa_orig,
            'causa_corregida': mejor_match,
            'tipo_correccion': tipo,
            'similitud': round(mejor_sim, 4),
            'frecuencia': row['frecuencia'],
            'anios': row['anios'],
            'num_anios': row['num_anios']
        })

        # Progreso
        if (idx + 1) % 1000 == 0:
            print(f"  Procesadas {idx + 1:,} causas...")

    print(f"\n  Resultados de matching:")
    print(f"    - Truncado (2020): {n_truncado:,}")
    print(f"    - Acentos: {n_acento:,}")
    print(f"    - Typos: {n_typo:,}")
    print(f"    - Sin match: {n_sin_match:,}")

    # Crear DataFrame de mapeo
    print("\n[5/6] Generando archivo de mapeo...")
    df_mapping = pd.DataFrame(mapping_rows)

    # Ordenar por frecuencia (más impacto primero)
    df_mapping = df_mapping.sort_values('frecuencia', ascending=False)

    # Guardar CSV
    output_path = DATA_CLEANING / "causa_mapping.csv"
    df_mapping.to_csv(output_path, index=False, encoding='utf-8-sig')
    print(f"  ✓ Guardado: {output_path}")

    # Estadísticas finales
    print("\n[6/6] Resumen del mapeo:")
    print(f"  Total causas: {len(df_mapping):,}")
    print(f"  Causas con corrección sugerida: {(df_mapping['tipo_correccion'] != 'sin_cambio').sum():,}")

    causas_unicas_despues = df_mapping['causa_corregida'].nunique()
    print(f"\n  Causas únicas ANTES: {len(df_mapping):,}")
    print(f"  Causas únicas DESPUÉS (estimado): {causas_unicas_despues:,}")
    print(f"  Reducción: {len(df_mapping) - causas_unicas_despues:,} ({(1 - causas_unicas_despues/len(df_mapping))*100:.1f}%)")

    # Distribución por tipo
    print("\n  Distribución por tipo de corrección:")
    for tipo, count in df_mapping['tipo_correccion'].value_counts().items():
        print(f"    - {tipo}: {count:,}")

    print("\n" + "=" * 70)
    print("MAPEO GENERADO")
    print("=" * 70)
    print(f"\nRevisa el archivo: {output_path}")
    print("Después de revisar, ejecuta: python scripts/clean_causes.py --apply")


def aplicar_correcciones():
    """
    Aplica las correcciones del archivo causa_mapping.csv (después de revisión).
    """
    print("=" * 70)
    print("APLICANDO CORRECCIONES DE CAUSAS")
    print("=" * 70)

    mapping_path = DATA_CLEANING / "causa_mapping.csv"
    if not mapping_path.exists():
        print(f"ERROR: No se encontró el archivo de mapeo: {mapping_path}")
        print("Primero ejecuta: python scripts/clean_causes.py")
        return

    # Cargar mapeo
    print("\n[1/4] Cargando mapeo...")
    df_mapping = pd.read_csv(mapping_path)
    print(f"  Filas en mapeo: {len(df_mapping):,}")

    # Crear diccionario de mapeo
    mapeo = dict(zip(df_mapping['causa_original'], df_mapping['causa_corregida']))

    # Cargar datos
    print("\n[2/4] Cargando datos consolidados...")
    df = pd.read_parquet(DATA_CONSOLIDATED / "siniestros.parquet")
    causas_antes = df['CAUSA'].nunique()
    print(f"  Causas únicas antes: {causas_antes:,}")

    # Aplicar correcciones
    print("\n[3/4] Aplicando correcciones...")
    df['CAUSA_ORIGINAL'] = df['CAUSA']  # Guardar original
    df['CAUSA'] = df['CAUSA'].map(mapeo).fillna(df['CAUSA'])

    causas_despues = df['CAUSA'].nunique()
    print(f"  Causas únicas después: {causas_despues:,}")
    print(f"  Reducción: {causas_antes - causas_despues:,} ({(1 - causas_despues/causas_antes)*100:.1f}%)")

    # Guardar
    print("\n[4/4] Guardando datos corregidos...")
    output_path = DATA_CONSOLIDATED / "siniestros.parquet"
    df.to_parquet(output_path, index=False)
    print(f"  ✓ Guardado: {output_path}")

    # Generar reporte
    generar_reporte_limpieza(causas_antes, causas_despues, df_mapping)

    print("\n" + "=" * 70)
    print("CORRECCIONES APLICADAS")
    print("=" * 70)


def generar_reporte_limpieza(causas_antes: int, causas_despues: int, df_mapping: pd.DataFrame):
    """
    Genera reporte de limpieza de causas.
    """
    reporte = []
    reporte.append("=" * 70)
    reporte.append("REPORTE DE LIMPIEZA DE CAUSAS")
    reporte.append("=" * 70)

    reporte.append(f"\nCausas únicas ANTES: {causas_antes:,}")
    reporte.append(f"Causas únicas DESPUÉS: {causas_despues:,}")
    reporte.append(f"Reducción: {causas_antes - causas_despues:,} ({(1 - causas_despues/causas_antes)*100:.1f}%)")

    reporte.append("\n" + "-" * 40)
    reporte.append("CORRECCIONES POR TIPO")
    reporte.append("-" * 40)

    for tipo, count in df_mapping['tipo_correccion'].value_counts().items():
        siniestros = df_mapping[df_mapping['tipo_correccion'] == tipo]['frecuencia'].sum()
        reporte.append(f"  {tipo}: {count:,} causas ({siniestros:,.0f} siniestros)")

    reporte.append("\n" + "-" * 40)
    reporte.append("TOP 20 CORRECCIONES POR IMPACTO")
    reporte.append("-" * 40)

    correcciones = df_mapping[df_mapping['tipo_correccion'] != 'sin_cambio'].head(20)
    for _, row in correcciones.iterrows():
        reporte.append(f"  [{row['tipo_correccion']}] {row['frecuencia']:,.0f} siniestros")
        reporte.append(f"    ANTES: {row['causa_original'][:60]}...")
        reporte.append(f"    DESPUÉS: {row['causa_corregida'][:60]}...")

    reporte.append("\n" + "=" * 70)
    reporte.append("FIN DEL REPORTE")
    reporte.append("=" * 70)

    # Guardar
    output_path = OUTPUTS / "reporte_limpieza_causas.txt"
    with open(output_path, 'w', encoding='utf-8') as f:
        f.write('\n'.join(reporte))
    print(f"\n  ✓ Reporte guardado: {output_path}")


def main():
    if len(sys.argv) > 1 and sys.argv[1] == '--apply':
        aplicar_correcciones()
    else:
        generar_mapeo()


if __name__ == "__main__":
    main()
