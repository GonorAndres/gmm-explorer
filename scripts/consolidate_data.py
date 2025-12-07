"""
consolidate_data.py
Consolida los datos de siniestros y emisión de 2020-2024 en archivos parquet unificados.

Transformaciones:
- 2021-2024: Convierte de formato largo a ancho (agrupa por perfil de siniestro)
- 2020: Renombra columnas, calcula MONTO_PAGADO, agrega columnas faltantes como NULL

Salida:
- data/consolidated/siniestros.parquet
- data/consolidated/polizas.parquet
- outputs/reporte_calidad_datos.txt
"""

import pandas as pd
import numpy as np
from pathlib import Path

# Rutas
BASE_DIR = Path(__file__).parent.parent
DATA_PROCESSED = BASE_DIR / "data" / "processed"
DATA_CONSOLIDATED = BASE_DIR / "data" / "consolidated"
OUTPUTS = BASE_DIR / "outputs"

# Asegurar que existan los directorios
DATA_CONSOLIDATED.mkdir(parents=True, exist_ok=True)
OUTPUTS.mkdir(parents=True, exist_ok=True)


def transformar_siniestros_2021_2024(year: int) -> pd.DataFrame:
    """
    Transforma siniestros de formato largo a ancho.
    Agrupa por perfil de siniestro y suma montos.
    """
    print(f"  Procesando siniestros {year}...")
    df = pd.read_parquet(DATA_PROCESSED / f"{year}_siniestros.parquet")

    # Columnas de agrupación (perfil del siniestro)
    grupo_cols = [
        'EDAD', 'SEXO', 'ENTIDAD', 'CAUSA DEL SINIESTRO',
        'MONEDA', 'TIPO DE SEGURO', 'SUBTIPO', 'TPO DE PAGO'
    ]

    # Agregación: MAX para conteo (evita sobrecontar), SUM para montos
    agg_dict = {
        'NUMERO DE SINIESTROS': 'max',
        'MONTO RECLAMADO': 'sum',
        'MONTO DE DEDUCIBLE': 'sum',
        'MONTO DE COASEGURO': 'sum',
        'MONTO PAGADO': 'sum',
        'MONTO DE REASEGURO': 'sum'
    }

    # Agregar NUMERO DE RECLAMACIONES si existe (2022-2023)
    if 'NUMERO DE RECLAMACIONES' in df.columns:
        agg_dict['NUMERO DE RECLAMACIONES'] = 'max'

    df_wide = df.groupby(grupo_cols, as_index=False).agg(agg_dict)

    # Renombrar columnas para consistencia
    df_wide = df_wide.rename(columns={
        'CAUSA DEL SINIESTRO': 'CAUSA',
        'NUMERO DE SINIESTROS': 'NUM_SINIESTROS',
        'MONTO RECLAMADO': 'MONTO_RECLAMADO',
        'MONTO DE DEDUCIBLE': 'MONTO_DEDUCIBLE',
        'MONTO DE COASEGURO': 'MONTO_COASEGURO',
        'MONTO PAGADO': 'MONTO_PAGADO',
        'MONTO DE REASEGURO': 'MONTO_REASEGURO'
    })

    # Agregar columna de año
    df_wide['ANIO'] = year

    # Agregar NUM_RECLAMACIONES si no existe
    if 'NUMERO DE RECLAMACIONES' in df_wide.columns:
        df_wide = df_wide.rename(columns={'NUMERO DE RECLAMACIONES': 'NUM_RECLAMACIONES'})
    else:
        df_wide['NUM_RECLAMACIONES'] = np.nan

    print(f"    Filas originales: {len(df):,} → Filas consolidadas: {len(df_wide):,}")
    return df_wide


def transformar_siniestros_2020() -> pd.DataFrame:
    """
    Transforma siniestros 2020 para que coincida con el esquema 2021-2024.
    Calcula MONTO_PAGADO = SUM(montos itemizados) - DEDUCIBLE - COASEGURO
    """
    print("  Procesando siniestros 2020...")
    df = pd.read_parquet(DATA_PROCESSED / "2020_siniestros.parquet")

    # Calcular MONTO_PAGADO (suma de montos itemizados menos deducciones)
    montos_itemizados = [
        'MONTO HONORARIOS MEDICOS',
        'MONTO GASTOS HOSPITALARIOS',
        'MONTO MEDICAMENTOS',
        'MONTO ESTUDIOS AUXILIARES',
        'OTROS GASTOS DEL SINIESTRO'
    ]

    df['MONTO_TOTAL_ITEMIZADO'] = df[montos_itemizados].sum(axis=1)
    df['MONTO_PAGADO'] = df['MONTO_TOTAL_ITEMIZADO'] - df['DEDUCIBLE'] - df['COASEGURO']

    # MONTO_RECLAMADO no existe en 2020, usamos el total itemizado como aproximación
    df['MONTO_RECLAMADO'] = df['MONTO_TOTAL_ITEMIZADO']

    # Crear DataFrame con esquema unificado
    df_transformed = pd.DataFrame({
        'EDAD': df['EDAD'],
        'SEXO': df['SEXO'],
        'ENTIDAD': df['ENTIDAD_ORIGEN'],
        'CAUSA': df['SIN_CAUSA'],
        'MONEDA': df['MONEDA'],
        'TIPO DE SEGURO': np.nan,  # No disponible en 2020
        'SUBTIPO': np.nan,  # No disponible en 2020
        'TPO DE PAGO': np.nan,  # No disponible en 2020
        'NUM_SINIESTROS': df['NUM SINIESTROS'],
        'NUM_RECLAMACIONES': df['NUM RECLAMACIONES'],
        'MONTO_RECLAMADO': df['MONTO_RECLAMADO'],
        'MONTO_DEDUCIBLE': df['DEDUCIBLE'],
        'MONTO_COASEGURO': df['COASEGURO'],
        'MONTO_PAGADO': df['MONTO_PAGADO'],
        'MONTO_REASEGURO': np.nan,  # No disponible en 2020
        'ANIO': 2020
    })

    print(f"    Filas: {len(df_transformed):,}")
    return df_transformed


def transformar_emision_2021_2024(year: int) -> pd.DataFrame:
    """
    Transforma emisión 2021-2024 a esquema unificado.
    """
    print(f"  Procesando emisión {year}...")
    df = pd.read_parquet(DATA_PROCESSED / f"{year}_emision.parquet")

    # Convertir PRIMA EMITIDA a numérico si es string (2024)
    if df['PRIMA EMITIDA'].dtype == 'object':
        df['PRIMA EMITIDA'] = pd.to_numeric(df['PRIMA EMITIDA'], errors='coerce')

    df_transformed = pd.DataFrame({
        'EDAD': df['EDAD'],
        'SEXO': df['SEXO'],
        'ENTIDAD': df['ENTIDAD'],
        'MONEDA': df['MONEDA'],
        'COBERTURA': df['COBERTURA'],
        'TIPO DE SEGURO': df['TIPO DE SEGURO'],
        'FORMA DE VENTA': df['FORMA DE VENTA'],
        'SUBTIPO': df['SUBTIPO'],
        'NUM_ASEGURADOS': df['NUMERO DE ASEGURADOS'],
        'PRIMA_EMITIDA': df['PRIMA EMITIDA'],
        'PRIMA_DEVENGADA': df['PRIMA DEVENGADA'],
        'SUMA_ASEGURADA': df['SUMA ASEGURADA'],
        'ANIO': year
    })

    print(f"    Filas: {len(df_transformed):,}")
    return df_transformed


def transformar_emision_2020() -> pd.DataFrame:
    """
    Transforma emisión 2020 a esquema unificado.
    """
    print("  Procesando emisión 2020...")
    df = pd.read_parquet(DATA_PROCESSED / "2020_emision.parquet")

    # Convertir EDAD de int a string para consistencia con 2021-2024
    df['EDAD_STR'] = df['EDAD'].astype(str)

    # Combinar primas y sumas aseguradas de beneficios
    df['PRIMA_TOTAL'] = df['PRIMA BENEFICIO_1'].fillna(0) + df['PRIMA BENEFICIO_2'].fillna(0)
    df['SA_TOTAL'] = df['SA_BENEFICIO_1'].fillna(0) + df['SA_BENEFICIO_2'].fillna(0)

    df_transformed = pd.DataFrame({
        'EDAD': df['EDAD_STR'],
        'SEXO': df['SEXO'],
        'ENTIDAD': df['ENTIDAD_ORIGEN'],
        'MONEDA': df['MONEDA'],
        'COBERTURA': np.nan,  # No disponible en 2020
        'TIPO DE SEGURO': np.nan,  # No disponible en 2020
        'FORMA DE VENTA': df['FORMA_VENTA'],
        'SUBTIPO': np.nan,  # No disponible en 2020
        'NUM_ASEGURADOS': df['NUM_ASEG'],
        'PRIMA_EMITIDA': df['PRIMA_TOTAL'],
        'PRIMA_DEVENGADA': np.nan,  # No disponible en 2020
        'SUMA_ASEGURADA': df['SA_TOTAL'],
        'ANIO': 2020
    })

    print(f"    Filas: {len(df_transformed):,}")
    return df_transformed


def generar_reporte_calidad(df_siniestros: pd.DataFrame, df_polizas: pd.DataFrame):
    """
    Genera reporte de calidad de datos consolidados.
    """
    reporte = []
    reporte.append("=" * 70)
    reporte.append("REPORTE DE CALIDAD - DATOS CONSOLIDADOS")
    reporte.append("=" * 70)

    # Siniestros
    reporte.append("\n" + "-" * 40)
    reporte.append("SINIESTROS CONSOLIDADOS")
    reporte.append("-" * 40)
    reporte.append(f"Total filas: {len(df_siniestros):,}")
    reporte.append(f"Total siniestros (suma NUM_SINIESTROS): {df_siniestros['NUM_SINIESTROS'].sum():,.0f}")
    reporte.append(f"Total MONTO_PAGADO: ${df_siniestros['MONTO_PAGADO'].sum():,.2f}")

    reporte.append("\nPor año:")
    for year in sorted(df_siniestros['ANIO'].unique()):
        df_year = df_siniestros[df_siniestros['ANIO'] == year]
        reporte.append(f"  {year}: {len(df_year):,} filas, {df_year['NUM_SINIESTROS'].sum():,.0f} siniestros, ${df_year['MONTO_PAGADO'].sum():,.2f}")

    reporte.append("\nCausas únicas por año:")
    for year in sorted(df_siniestros['ANIO'].unique()):
        n_causas = df_siniestros[df_siniestros['ANIO'] == year]['CAUSA'].nunique()
        reporte.append(f"  {year}: {n_causas:,} causas únicas")

    reporte.append("\nValores nulos por columna:")
    for col in df_siniestros.columns:
        null_count = df_siniestros[col].isna().sum()
        null_pct = null_count / len(df_siniestros) * 100
        if null_count > 0:
            reporte.append(f"  {col}: {null_count:,} ({null_pct:.1f}%)")

    # Pólizas
    reporte.append("\n" + "-" * 40)
    reporte.append("POLIZAS CONSOLIDADAS")
    reporte.append("-" * 40)
    reporte.append(f"Total filas: {len(df_polizas):,}")
    reporte.append(f"Total asegurados (suma NUM_ASEGURADOS): {df_polizas['NUM_ASEGURADOS'].sum():,.0f}")
    reporte.append(f"Total PRIMA_EMITIDA: ${df_polizas['PRIMA_EMITIDA'].sum():,.2f}")

    reporte.append("\nPor año:")
    for year in sorted(df_polizas['ANIO'].unique()):
        df_year = df_polizas[df_polizas['ANIO'] == year]
        reporte.append(f"  {year}: {len(df_year):,} filas, {df_year['NUM_ASEGURADOS'].sum():,.0f} asegurados, ${df_year['PRIMA_EMITIDA'].sum():,.2f}")

    reporte.append("\nValores nulos por columna:")
    for col in df_polizas.columns:
        null_count = df_polizas[col].isna().sum()
        null_pct = null_count / len(df_polizas) * 100
        if null_count > 0:
            reporte.append(f"  {col}: {null_count:,} ({null_pct:.1f}%)")

    reporte.append("\n" + "=" * 70)
    reporte.append("FIN DEL REPORTE")
    reporte.append("=" * 70)

    return "\n".join(reporte)


def main():
    print("=" * 70)
    print("CONSOLIDACIÓN DE DATOS GMM")
    print("=" * 70)

    # Consolidar siniestros
    print("\n[1/3] Consolidando siniestros...")
    siniestros_dfs = []

    # 2020 (esquema diferente)
    siniestros_dfs.append(transformar_siniestros_2020())

    # 2021-2024 (mismo esquema, formato largo → ancho)
    for year in [2021, 2022, 2023, 2024]:
        siniestros_dfs.append(transformar_siniestros_2021_2024(year))

    df_siniestros = pd.concat(siniestros_dfs, ignore_index=True)

    # Ordenar columnas
    cols_siniestros = [
        'ANIO', 'EDAD', 'SEXO', 'ENTIDAD', 'CAUSA', 'MONEDA',
        'TIPO DE SEGURO', 'SUBTIPO', 'TPO DE PAGO',
        'NUM_SINIESTROS', 'NUM_RECLAMACIONES',
        'MONTO_RECLAMADO', 'MONTO_DEDUCIBLE', 'MONTO_COASEGURO',
        'MONTO_PAGADO', 'MONTO_REASEGURO'
    ]
    df_siniestros = df_siniestros[cols_siniestros]

    # Guardar siniestros
    output_siniestros = DATA_CONSOLIDATED / "siniestros.parquet"
    df_siniestros.to_parquet(output_siniestros, index=False)
    print(f"\n  ✓ Guardado: {output_siniestros}")
    print(f"    Total filas: {len(df_siniestros):,}")

    # Consolidar emisión/pólizas
    print("\n[2/3] Consolidando pólizas (emisión)...")
    polizas_dfs = []

    # 2020
    polizas_dfs.append(transformar_emision_2020())

    # 2021-2024
    for year in [2021, 2022, 2023, 2024]:
        polizas_dfs.append(transformar_emision_2021_2024(year))

    df_polizas = pd.concat(polizas_dfs, ignore_index=True)

    # Ordenar columnas
    cols_polizas = [
        'ANIO', 'EDAD', 'SEXO', 'ENTIDAD', 'MONEDA',
        'COBERTURA', 'TIPO DE SEGURO', 'FORMA DE VENTA', 'SUBTIPO',
        'NUM_ASEGURADOS', 'PRIMA_EMITIDA', 'PRIMA_DEVENGADA', 'SUMA_ASEGURADA'
    ]
    df_polizas = df_polizas[cols_polizas]

    # Guardar pólizas
    output_polizas = DATA_CONSOLIDATED / "polizas.parquet"
    df_polizas.to_parquet(output_polizas, index=False)
    print(f"\n  ✓ Guardado: {output_polizas}")
    print(f"    Total filas: {len(df_polizas):,}")

    # Generar reporte de calidad
    print("\n[3/3] Generando reporte de calidad...")
    reporte = generar_reporte_calidad(df_siniestros, df_polizas)

    output_reporte = OUTPUTS / "reporte_calidad_datos.txt"
    with open(output_reporte, 'w', encoding='utf-8') as f:
        f.write(reporte)
    print(f"\n  ✓ Guardado: {output_reporte}")

    # Mostrar reporte
    print("\n" + reporte)

    print("\n" + "=" * 70)
    print("CONSOLIDACIÓN COMPLETADA")
    print("=" * 70)


if __name__ == "__main__":
    main()
