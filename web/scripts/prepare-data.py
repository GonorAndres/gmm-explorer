#!/usr/bin/env python3
"""
Script de preparación de datos para el frontend del explorador de siniestros.

Este script transforma los datos de siniestros (1.97M filas) en archivos JSON
agregados y optimizados para el dashboard web.

Archivos generados:
- siniestros-agregados.json: Agregación por (ANIO, EDAD, SEXO, NIVEL)
- clasificacion.json: Mapeo de causas a niveles para dropdown
- primas-nivel-edad.json: Matriz de primas por nivel y edad
- resumen-general.json: Estadísticas globales para tarjetas

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


def cargar_siniestros():
    """Carga los siniestros consolidados."""
    print("📂 Cargando siniestros.parquet...")
    df = pd.read_parquet(DATA_DIR / 'consolidated' / 'siniestros.parquet')
    print(f"   ✓ {len(df):,} filas cargadas")
    return df


def cargar_clasificacion():
    """Carga el mapeo de causas a niveles."""
    print("📂 Cargando clasificación de causas...")
    df = pd.read_csv(DATA_DIR / 'classified' / 'all_causes_classified.csv')
    print(f"   ✓ {len(df):,} causas clasificadas")
    return df


def cargar_primas():
    """Carga las primas por nivel y edad (generadas en Fase 3)."""
    print("📂 Cargando primas por nivel y edad...")
    primas_path = BASE_DIR / 'outputs' / 'tarificacion' / 'primas_por_nivel_edad.csv'
    df = pd.read_csv(primas_path)
    print(f"   ✓ {len(df):,} registros de primas")
    return df


def preparar_siniestros_agregados(siniestros, clasificacion):
    """
    Agrega siniestros por (ANIO, EDAD, SEXO, NIVEL) para el dashboard.

    Reduce 1.97M filas a ~5K filas agregadas, optimizado para filtros
    interactivos sin necesidad de API backend.
    """
    print("\n🔧 Preparando siniestros agregados...")

    # Filtrar edades válidas para tarificación (25-70)
    df = siniestros[(siniestros['EDAD'] >= 25) & (siniestros['EDAD'] <= 70)].copy()
    print(f"   - Filas con edad 25-70: {len(df):,}")

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

    print(f"   ✓ Agregado a {len(agregado):,} filas")
    return agregado


def preparar_clasificacion_dropdown(clasificacion):
    """
    Prepara el listado de causas para el dropdown de búsqueda.
    Incluye nivel y frecuencia para ordenamiento.
    """
    print("\n🔧 Preparando clasificación para dropdown...")

    df = clasificacion[['causa', 'nivel', 'frecuencia']].copy()
    df.columns = ['causa', 'nivel', 'frecuencia']
    df = df.sort_values('frecuencia', ascending=False)

    print(f"   ✓ {len(df):,} causas preparadas")
    return df


def preparar_primas_json(primas):
    """
    Prepara la matriz de primas para visualización.
    Estructura: [{edad, nivel, descripcion, frecuencia, severidad, prima_anual, prima_mensual}]
    """
    print("\n🔧 Preparando primas para JSON...")

    # Seleccionar columnas relevantes
    df = primas[['nivel', 'edad', 'frecuencia', 'severidad',
                 'prima_riesgo', 'prima_mensual']].copy()

    # Agregar descripción del nivel
    df['descripcion'] = df['nivel'].map(NIVEL_LABELS)

    # Renombrar
    df.columns = ['nivel', 'edad', 'frecuencia', 'severidad',
                  'prima_anual', 'prima_mensual', 'descripcion']

    # Redondear
    df['severidad'] = df['severidad'].round(0)
    df['prima_anual'] = df['prima_anual'].round(2)
    df['prima_mensual'] = df['prima_mensual'].round(2)

    print(f"   ✓ {len(df):,} registros de primas preparados")
    return df


def calcular_resumen_general(siniestros, clasificacion):
    """
    Calcula estadísticas globales para las tarjetas del dashboard.
    """
    print("\n🔧 Calculando resumen general...")

    # Filtrar edades válidas
    df = siniestros[(siniestros['EDAD'] >= 25) & (siniestros['EDAD'] <= 70)].copy()

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
        'anios_disponibles': anios,
        'rango_edad': {'min': edad_min, 'max': edad_max},
        'generado': datetime.now().isoformat()
    }

    print(f"   ✓ Resumen calculado: {total_siniestros:,} siniestros, ${monto_total:,.0f} MXN")
    return resumen


def guardar_json(data, filename):
    """Guarda datos como JSON con formato legible."""
    filepath = OUTPUT_DIR / filename
    with open(filepath, 'w', encoding='utf-8') as f:
        if isinstance(data, pd.DataFrame):
            json.dump(data.to_dict(orient='records'), f, ensure_ascii=False, indent=2)
        else:
            json.dump(data, f, ensure_ascii=False, indent=2)
    print(f"   📁 Guardado: {filepath}")


def main():
    """Ejecuta la preparación completa de datos."""
    print("=" * 60)
    print("PREPARACIÓN DE DATOS PARA FRONTEND")
    print(f"Fecha: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}")
    print("=" * 60)

    # Crear directorio de salida
    OUTPUT_DIR.mkdir(parents=True, exist_ok=True)

    # Cargar datos fuente
    siniestros = cargar_siniestros()
    clasificacion = cargar_clasificacion()
    primas = cargar_primas()

    # Preparar y guardar cada archivo
    print("\n" + "=" * 60)
    print("GENERANDO ARCHIVOS JSON")
    print("=" * 60)

    # 1. Siniestros agregados (~5K filas)
    agregados = preparar_siniestros_agregados(siniestros, clasificacion)
    guardar_json(agregados, 'siniestros-agregados.json')

    # 2. Clasificación para dropdown (9K causas)
    clasificacion_dropdown = preparar_clasificacion_dropdown(clasificacion)
    guardar_json(clasificacion_dropdown, 'clasificacion.json')

    # 3. Primas por nivel y edad (138 registros)
    primas_json = preparar_primas_json(primas)
    guardar_json(primas_json, 'primas-nivel-edad.json')

    # 4. Resumen general
    resumen = calcular_resumen_general(siniestros, clasificacion)
    guardar_json(resumen, 'resumen-general.json')

    # Resumen final
    print("\n" + "=" * 60)
    print("✅ PREPARACIÓN COMPLETADA")
    print("=" * 60)
    print("\nArchivos generados:")
    for f in OUTPUT_DIR.glob('*.json'):
        size = f.stat().st_size / 1024
        print(f"   - {f.name}: {size:.1f} KB")


if __name__ == '__main__':
    main()
