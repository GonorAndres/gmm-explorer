#!/usr/bin/env python3
"""
Script de preparación de datos para el frontend del explorador GMM.

Transforma los datos de siniestros (1.97M filas) y pólizas en archivos JSON
agregados y optimizados para el dashboard web.

Archivos generados:
- siniestros-agregados.json: Agregación por (ANIO, EDAD, SEXO, NIVEL)
- primas-nivel-edad.json: Matriz de primas por nivel, edad y sexo
- resumen-general.json: Estadísticas globales para tarjetas
- polizas-agregadas.json: Pólizas por (ANIO, EDAD, SEXO)
- polizas-resumen-anual.json: Resumen anual de pólizas
- polizas-por-banda.json: Pólizas agrupadas por banda de edad

Autor: Sistema GMM CNSF
Fecha: 2025-12-06
"""

import pandas as pd
import json
from pathlib import Path
from datetime import datetime

# Rutas base
BASE_DIR = Path(__file__).resolve().parent.parent.parent
DATA_DIR = BASE_DIR / 'data'
OUTPUT_DIR = Path(__file__).resolve().parent.parent / 'data'

# Constantes de niveles (español)
NIVEL_LABELS = {
    1: 'Ambulatorio',
    2: 'Hospitalario',
    3: 'Alta Especialidad'
}

# Factores de inflación médica (ajuste a pesos 2024)
INFLACION_MEDICA = {
    2020: 1.41,
    2021: 1.30,
    2022: 1.20,
    2023: 1.10,
    2024: 1.00
}

# Sexos válidos
SEXOS_VALIDOS = ['Masculino', 'Femenino']

# Bandas de edad para agrupación
BANDAS_EDAD = [
    (25, 34, '25-34'),
    (35, 44, '35-44'),
    (45, 54, '45-54'),
    (55, 64, '55-64'),
    (65, 70, '65-70'),
]


def cargar_siniestros():
    """Carga los siniestros consolidados."""
    print("Cargando siniestros.parquet...")
    df = pd.read_parquet(DATA_DIR / 'consolidated' / 'siniestros.parquet')
    print(f"   {len(df):,} filas cargadas")
    return df


def cargar_polizas():
    """Carga las pólizas consolidadas."""
    print("Cargando polizas.parquet...")
    df = pd.read_parquet(DATA_DIR / 'consolidated' / 'polizas.parquet')
    print(f"   {len(df):,} filas cargadas")
    return df


def cargar_clasificacion():
    """Carga el mapeo de causas a niveles."""
    print("Cargando clasificacion de causas...")
    df = pd.read_csv(DATA_DIR / 'classified' / 'all_causes_classified.csv')
    print(f"   {len(df):,} causas clasificadas")
    return df


def cargar_primas():
    """Carga las primas por nivel, edad y sexo (generadas en Fase 3)."""
    print("Cargando primas por nivel, edad y sexo...")
    primas_path = BASE_DIR / 'outputs' / 'tarificacion' / 'primas_por_nivel_edad.csv'
    df = pd.read_csv(primas_path)
    print(f"   {len(df):,} registros de primas")
    return df


def preparar_siniestros_agregados(siniestros, clasificacion):
    """
    Agrega siniestros por (ANIO, EDAD, SEXO, NIVEL) para el dashboard.
    Reduce 1.97M filas a ~5K filas agregadas.
    """
    print("\nPreparando siniestros agregados...")

    # Filtrar edades válidas y sexo válido
    df = siniestros[
        (siniestros['EDAD'] >= 25) &
        (siniestros['EDAD'] <= 70) &
        (siniestros['SEXO'].isin(SEXOS_VALIDOS))
    ].copy()
    print(f"   - Filas con edad 25-70, sexo valido: {len(df):,}")

    # Crear mapeo de causa a nivel
    causa_nivel = dict(zip(clasificacion['causa'], clasificacion['nivel']))

    # Asignar nivel (default 1 si no se encuentra)
    df['NIVEL'] = df['CAUSA'].map(causa_nivel).fillna(1).astype(int)

    # Ajustar monto por inflación
    df['MONTO_AJUSTADO'] = df['MONTO_PAGADO'] * df['ANIO'].map(INFLACION_MEDICA)

    # Agregar por (ANIO, EDAD, SEXO, NIVEL)
    agregado = df.groupby(['ANIO', 'EDAD', 'SEXO', 'NIVEL']).agg({
        'NUM_SINIESTROS': 'sum',
        'MONTO_PAGADO': 'sum',
        'MONTO_AJUSTADO': 'sum'
    }).reset_index()

    # Calcular severidad promedio
    agregado['SEVERIDAD'] = agregado['MONTO_AJUSTADO'] / agregado['NUM_SINIESTROS']

    # Renombrar para JSON
    agregado.columns = ['anio', 'edad', 'sexo', 'nivel', 'num_siniestros',
                        'monto_original', 'monto_ajustado', 'severidad']

    # Redondear valores numéricos
    agregado['monto_original'] = agregado['monto_original'].round(0)
    agregado['monto_ajustado'] = agregado['monto_ajustado'].round(0)
    agregado['severidad'] = agregado['severidad'].round(0)

    print(f"   Agregado a {len(agregado):,} filas")
    return agregado


def preparar_primas_json(primas):
    """
    Prepara la matriz de primas para visualización.
    Ahora incluye sexo, prima_tarifa y prima_tarifa_mensual.
    """
    print("\nPreparando primas para JSON...")

    # Seleccionar columnas relevantes
    df = primas[['nivel', 'edad', 'sexo', 'frecuencia', 'severidad',
                 'prima_riesgo', 'prima_tarifa', 'prima_mensual',
                 'prima_tarifa_mensual']].copy()

    # Agregar descripción del nivel
    df['descripcion'] = df['nivel'].map(NIVEL_LABELS)

    # Renombrar para consistencia frontend
    df = df.rename(columns={
        'prima_riesgo': 'prima_anual',
        'prima_mensual': 'prima_mensual',
    })

    # Redondear
    df['severidad'] = df['severidad'].round(0)
    df['prima_anual'] = df['prima_anual'].round(2)
    df['prima_tarifa'] = df['prima_tarifa'].round(2)
    df['prima_mensual'] = df['prima_mensual'].round(2)
    df['prima_tarifa_mensual'] = df['prima_tarifa_mensual'].round(2)

    # Manejar NaN -> 0 para serialización JSON
    df = df.fillna(0)

    print(f"   {len(df):,} registros de primas preparados")
    return df


def calcular_resumen_general(siniestros, clasificacion):
    """
    Calcula estadísticas globales para las tarjetas del dashboard.
    Incluye desglose por sexo.
    """
    print("\nCalculando resumen general...")

    # Filtrar edades válidas y sexo válido
    df = siniestros[
        (siniestros['EDAD'] >= 25) &
        (siniestros['EDAD'] <= 70) &
        (siniestros['SEXO'].isin(SEXOS_VALIDOS))
    ].copy()

    # Mapear niveles
    causa_nivel = dict(zip(clasificacion['causa'], clasificacion['nivel']))
    df['NIVEL'] = df['CAUSA'].map(causa_nivel).fillna(1).astype(int)

    # Ajustar por inflación
    df['MONTO_AJUSTADO'] = df['MONTO_PAGADO'] * df['ANIO'].map(INFLACION_MEDICA)

    # Totales
    total_siniestros = int(df['NUM_SINIESTROS'].sum())
    monto_total = float(df['MONTO_AJUSTADO'].sum())
    monto_promedio = monto_total / total_siniestros if total_siniestros > 0 else 0

    # Por nivel
    por_nivel = df.groupby('NIVEL').agg({
        'NUM_SINIESTROS': 'sum',
        'MONTO_AJUSTADO': 'sum'
    }).reset_index()

    distribucion_nivel = []
    for _, row in por_nivel.iterrows():
        nivel = int(row['NIVEL'])
        distribucion_nivel.append({
            'nivel': nivel,
            'descripcion': NIVEL_LABELS.get(nivel, 'Desconocido'),
            'siniestros': int(row['NUM_SINIESTROS']),
            'monto': float(row['MONTO_AJUSTADO']),
            'pct_siniestros': round(row['NUM_SINIESTROS'] / total_siniestros * 100, 1),
            'pct_monto': round(row['MONTO_AJUSTADO'] / monto_total * 100, 1)
        })

    # Por sexo
    por_sexo = df.groupby('SEXO').agg({
        'NUM_SINIESTROS': 'sum',
        'MONTO_AJUSTADO': 'sum'
    }).reset_index()

    distribucion_sexo = []
    for _, row in por_sexo.iterrows():
        distribucion_sexo.append({
            'sexo': row['SEXO'],
            'siniestros': int(row['NUM_SINIESTROS']),
            'monto': float(row['MONTO_AJUSTADO']),
            'pct_siniestros': round(row['NUM_SINIESTROS'] / total_siniestros * 100, 1),
            'pct_monto': round(row['MONTO_AJUSTADO'] / monto_total * 100, 1)
        })

    # Años disponibles
    anios = sorted(df['ANIO'].unique().tolist())

    # Rango de edades
    edad_min = int(df['EDAD'].min())
    edad_max = int(df['EDAD'].max())

    resumen = {
        'total_siniestros': total_siniestros,
        'monto_total': round(monto_total, 0),
        'monto_promedio': round(monto_promedio, 0),
        'distribucion_nivel': distribucion_nivel,
        'por_sexo': distribucion_sexo,
        'anios_disponibles': anios,
        'rango_edad': {'min': edad_min, 'max': edad_max},
        'generado': datetime.now().isoformat()
    }

    print(f"   Resumen calculado: {total_siniestros:,} siniestros, ${monto_total:,.0f} MXN")
    return resumen


# =============================================================================
# NUEVAS FUNCIONES: PÓLIZAS
# =============================================================================

def preparar_polizas_agregadas(polizas_df):
    """
    Agrega pólizas por (ANIO, EDAD, SEXO).
    Calcula num_asegurados, prima_emitida, suma_asegurada, prima_promedio.
    """
    print("\nPreparando polizas agregadas...")

    df = polizas_df.copy()

    # Convertir edad a entero
    df['EDAD_INT'] = pd.to_numeric(df['EDAD'], errors='coerce')

    # Filtrar edad válida y sexo válido
    df = df[
        (df['EDAD_INT'] >= 25) &
        (df['EDAD_INT'] <= 70) &
        (df['SEXO'].isin(SEXOS_VALIDOS))
    ].copy()

    # Agregar por (ANIO, EDAD, SEXO)
    agregado = df.groupby(['ANIO', 'EDAD_INT', 'SEXO']).agg({
        'NUM_ASEGURADOS': 'sum',
        'PRIMA_EMITIDA': 'sum',
        'SUMA_ASEGURADA': 'sum'
    }).reset_index()

    # Calcular prima promedio
    agregado['PRIMA_PROMEDIO'] = agregado['PRIMA_EMITIDA'] / agregado['NUM_ASEGURADOS']

    # Renombrar
    agregado.columns = ['anio', 'edad', 'sexo', 'num_asegurados',
                        'prima_emitida', 'suma_asegurada', 'prima_promedio']

    # Redondear
    agregado['prima_emitida'] = agregado['prima_emitida'].round(0)
    agregado['suma_asegurada'] = agregado['suma_asegurada'].round(0)
    agregado['prima_promedio'] = agregado['prima_promedio'].round(0)

    print(f"   {len(agregado):,} filas de polizas agregadas")
    return agregado


def preparar_resumen_anual_polizas(polizas_df):
    """
    Resumen anual de pólizas: total asegurados, prima emitida, suma asegurada.
    """
    print("\nPreparando resumen anual de polizas...")

    df = polizas_df.copy()
    df['EDAD_INT'] = pd.to_numeric(df['EDAD'], errors='coerce')

    df = df[
        (df['EDAD_INT'] >= 25) &
        (df['EDAD_INT'] <= 70) &
        (df['SEXO'].isin(SEXOS_VALIDOS))
    ].copy()

    resumen = df.groupby('ANIO').agg({
        'NUM_ASEGURADOS': 'sum',
        'PRIMA_EMITIDA': 'sum',
        'SUMA_ASEGURADA': 'sum'
    }).reset_index()

    resumen.columns = ['anio', 'num_asegurados', 'prima_emitida', 'suma_asegurada']
    resumen['prima_emitida'] = resumen['prima_emitida'].round(0)
    resumen['suma_asegurada'] = resumen['suma_asegurada'].round(0)

    print(f"   {len(resumen):,} registros anuales")
    return resumen


def preparar_polizas_por_banda(polizas_df):
    """
    Agrupa pólizas por bandas de edad: 25-34, 35-44, 45-54, 55-64, 65-70.
    """
    print("\nPreparando polizas por banda de edad...")

    df = polizas_df.copy()
    df['EDAD_INT'] = pd.to_numeric(df['EDAD'], errors='coerce')

    df = df[
        (df['EDAD_INT'] >= 25) &
        (df['EDAD_INT'] <= 70) &
        (df['SEXO'].isin(SEXOS_VALIDOS))
    ].copy()

    total_asegurados = df['NUM_ASEGURADOS'].sum()

    resultado = []
    for edad_min, edad_max, etiqueta in BANDAS_EDAD:
        banda = df[(df['EDAD_INT'] >= edad_min) & (df['EDAD_INT'] <= edad_max)]
        num_aseg = int(banda['NUM_ASEGURADOS'].sum())
        prima_em = float(banda['PRIMA_EMITIDA'].sum())
        resultado.append({
            'banda_edad': etiqueta,
            'num_asegurados': num_aseg,
            'prima_emitida': round(prima_em, 0),
            'pct_asegurados': round(num_aseg / total_asegurados * 100, 1) if total_asegurados > 0 else 0
        })

    print(f"   {len(resultado)} bandas de edad")
    return resultado


def guardar_json(data, filename):
    """Guarda datos como JSON con formato legible."""
    filepath = OUTPUT_DIR / filename
    with open(filepath, 'w', encoding='utf-8') as f:
        if isinstance(data, pd.DataFrame):
            json.dump(data.to_dict(orient='records'), f, ensure_ascii=False, indent=2)
        else:
            json.dump(data, f, ensure_ascii=False, indent=2)
    size_kb = filepath.stat().st_size / 1024
    print(f"   Guardado: {filepath.name} ({size_kb:.1f} KB)")


def main():
    """Ejecuta la preparación completa de datos."""
    print("=" * 60)
    print("PREPARACION DE DATOS PARA FRONTEND")
    print(f"Fecha: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}")
    print("=" * 60)

    # Crear directorio de salida
    OUTPUT_DIR.mkdir(parents=True, exist_ok=True)

    # Cargar datos fuente
    siniestros = cargar_siniestros()
    polizas = cargar_polizas()
    clasificacion = cargar_clasificacion()
    primas = cargar_primas()

    # Preparar y guardar cada archivo
    print("\n" + "=" * 60)
    print("GENERANDO ARCHIVOS JSON")
    print("=" * 60)

    # 1. Siniestros agregados (~5K filas)
    agregados = preparar_siniestros_agregados(siniestros, clasificacion)
    guardar_json(agregados, 'siniestros-agregados.json')

    # 2. Primas por nivel, edad y sexo (276 registros)
    primas_json = preparar_primas_json(primas)
    guardar_json(primas_json, 'primas-nivel-edad.json')

    # 3. Resumen general
    resumen = calcular_resumen_general(siniestros, clasificacion)
    guardar_json(resumen, 'resumen-general.json')

    # 4. Pólizas agregadas
    polizas_agg = preparar_polizas_agregadas(polizas)
    guardar_json(polizas_agg, 'polizas-agregadas.json')

    # 5. Resumen anual de pólizas
    resumen_anual = preparar_resumen_anual_polizas(polizas)
    guardar_json(resumen_anual, 'polizas-resumen-anual.json')

    # 6. Pólizas por banda de edad
    por_banda = preparar_polizas_por_banda(polizas)
    guardar_json(por_banda, 'polizas-por-banda.json')

    # Resumen final
    print("\n" + "=" * 60)
    print("PREPARACION COMPLETADA")
    print("=" * 60)
    print("\nArchivos generados:")
    for f in sorted(OUTPUT_DIR.glob('*.json')):
        size = f.stat().st_size / 1024
        print(f"   - {f.name}: {size:.1f} KB")


if __name__ == '__main__':
    main()
