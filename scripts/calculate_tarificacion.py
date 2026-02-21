"""
calculate_tarificacion.py
Fase 3: Cálculo actuarial de primas de riesgo para seguros GMM (Gastos Médicos Mayores).

Metodología:
    Prima de Riesgo = Frecuencia × Severidad
    Prima de Tarifa = Prima de Riesgo / (1 - G.Admin - G.Adq - Utilidad)

    - Frecuencia (Morbilidad): M(x, nivel, sexo) = NS(x, nivel, sexo) / NE(x, sexo)
      Donde NS = número de siniestros, NE = número de expuestos

    - Severidad (Costo Medio): SP(x, nivel, sexo) = Monto Total / Número de Siniestros

Ajustes aplicados:
    - Inflación médica: Montos ajustados a pesos de 2024
    - Credibilidad: Bandera para celdas con >= 30 siniestros
    - Dimensión sexo: Cálculos segmentados por Masculino/Femenino

Salidas:
    - outputs/tarificacion/primas_por_nivel.csv (6 filas: 3 niveles × 2 sexos)
    - outputs/tarificacion/primas_por_nivel_edad.csv (276 filas: 3 niveles × 46 edades × 2 sexos)
    - outputs/tarificacion/reporte_tarificacion.txt (diagnóstico)

Fuente metodológica: docs/tarificacion_colectivo_mexico.md
"""

import pandas as pd
import numpy as np
from pathlib import Path
from datetime import datetime

# =============================================================================
# CONFIGURACIÓN
# =============================================================================

# Rutas
BASE_DIR = Path(__file__).parent.parent
DATA_CONSOLIDATED = BASE_DIR / "data" / "consolidated"
DATA_CLASSIFIED = BASE_DIR / "data" / "classified"
OUTPUT_DIR = BASE_DIR / "outputs" / "tarificacion"

# Asegurar que exista el directorio de salida
OUTPUT_DIR.mkdir(parents=True, exist_ok=True)

# Constantes actuariales
EDAD_MIN = 25
EDAD_MAX = 70
MIN_SINIESTROS_CREDIBILIDAD = 30

# Factores de inflación médica para ajustar a pesos 2024
# Basado en inflación de servicios médicos de Banxico (~8-10% anual)
INFLACION_MEDICA = {
    2020: 1.41,  # ~8.5% compuesto en 4 años
    2021: 1.30,  # ~9% compuesto en 3 años
    2022: 1.20,  # ~9.5% compuesto en 2 años
    2023: 1.10,  # ~10% en 1 año
    2024: 1.00   # año base
}

# Descripciones de niveles de complejidad
NIVEL_DESCRIPCION = {
    1: "Ambulatorio",
    2: "Hospitalario",
    3: "Alta Especialidad"
}

# =============================================================================
# CONFIGURACIÓN DE PRIMA MENSUAL 2025
# =============================================================================
# Tasa de descuento anual 2025 (basada en TIIE/Cetes ~10%)
TASA_DESCUENTO_ANUAL_2025 = 0.10

def calcular_factor_mensual(tasa_anual: float) -> float:
    """
    Calcula el factor para convertir prima anual a mensual considerando
    el valor del dinero en el tiempo (anualidad anticipada).

    Fórmula: Factor = i / (12 × (1 - (1 + i/12)^(-12)))

    Args:
        tasa_anual: Tasa de descuento anual (ej: 0.10 para 10%)

    Returns:
        Factor multiplicador para obtener prima mensual
    """
    i = tasa_anual
    tasa_mensual = i / 12
    # Factor de anualidad ordinaria
    factor = i / (12 * (1 - (1 + tasa_mensual) ** (-12)))
    return factor

# Factor precalculado para 2025
FACTOR_MENSUAL_2025 = calcular_factor_mensual(TASA_DESCUENTO_ANUAL_2025)

# =============================================================================
# CONFIGURACIÓN DE PRIMA DE TARIFA
# =============================================================================
# Gastos y utilidad para convertir prima de riesgo a prima de tarifa
# Prima Tarifa = Prima Riesgo / (1 - G.Admin - G.Adq - Utilidad)
GASTOS_ADMINISTRACION = 0.20  # 20%
GASTOS_ADQUISICION = 0.10     # 10%
MARGEN_UTILIDAD = 0.10        # 10%
FACTOR_RETENCION = 1 - GASTOS_ADMINISTRACION - GASTOS_ADQUISICION - MARGEN_UTILIDAD  # 0.60

# Sexos válidos para segmentación
SEXOS_VALIDOS = ['Masculino', 'Femenino']

# =============================================================================
# FUNCIONES DE CARGA
# =============================================================================

def cargar_datos() -> tuple:
    """
    Carga los datos de siniestros, pólizas y clasificación.

    Returns:
        tuple: (df_siniestros, df_polizas, df_clasificacion)
    """
    print("\n" + "=" * 70)
    print("PASO 1: CARGA DE DATOS")
    print("=" * 70)

    # Siniestros
    ruta_siniestros = DATA_CONSOLIDATED / "siniestros.parquet"
    df_siniestros = pd.read_parquet(ruta_siniestros)
    print(f"  ✓ Siniestros: {len(df_siniestros):,} filas")

    # Pólizas
    ruta_polizas = DATA_CONSOLIDATED / "polizas.parquet"
    df_polizas = pd.read_parquet(ruta_polizas)
    print(f"  ✓ Pólizas: {len(df_polizas):,} filas")

    # Clasificación de causas
    ruta_clasificacion = DATA_CLASSIFIED / "all_causes_classified.csv"
    df_clasificacion = pd.read_csv(ruta_clasificacion)
    print(f"  ✓ Clasificación: {len(df_clasificacion):,} causas únicas")

    return df_siniestros, df_polizas, df_clasificacion


# =============================================================================
# FUNCIONES DE PREPARACIÓN
# =============================================================================

def preparar_datos(df_siniestros: pd.DataFrame,
                   df_polizas: pd.DataFrame,
                   df_clasificacion: pd.DataFrame) -> tuple:
    """
    Prepara los datos para el cálculo actuarial:
    1. Convierte edad de pólizas a entero
    2. Filtra rango de edades 25-70
    3. Une clasificación de nivel a siniestros
    4. Aplica ajuste por inflación

    Returns:
        tuple: (df_siniestros_prep, df_polizas_prep, estadisticas)
    """
    print("\n" + "=" * 70)
    print("PASO 2: PREPARACIÓN DE DATOS")
    print("=" * 70)

    stats = {}

    # --- 2.1 Convertir edad de pólizas a entero ---
    print("\n  2.1 Conversión de edad en pólizas...")
    df_polizas = df_polizas.copy()
    df_polizas['EDAD_INT'] = pd.to_numeric(df_polizas['EDAD'], errors='coerce')

    edades_invalidas = df_polizas['EDAD_INT'].isna().sum()
    stats['edades_polizas_invalidas'] = edades_invalidas
    print(f"      Edades no convertibles: {edades_invalidas:,}")

    # --- 2.2 Filtrar rango de edades y sexo válido ---
    print(f"\n  2.2 Filtrado de edades ({EDAD_MIN}-{EDAD_MAX}) y sexo válido...")

    # Siniestros
    filas_antes_sin = len(df_siniestros)
    df_siniestros = df_siniestros[
        (df_siniestros['EDAD'] >= EDAD_MIN) &
        (df_siniestros['EDAD'] <= EDAD_MAX) &
        (df_siniestros['SEXO'].isin(SEXOS_VALIDOS))
    ].copy()
    filas_despues_sin = len(df_siniestros)
    stats['siniestros_filtrados'] = filas_antes_sin - filas_despues_sin
    print(f"      Siniestros: {filas_antes_sin:,} → {filas_despues_sin:,} " +
          f"(excluidos: {filas_antes_sin - filas_despues_sin:,})")

    # Pólizas: filtrar edades y sexo válido
    filas_antes_pol = len(df_polizas)
    df_polizas = df_polizas[
        (df_polizas['EDAD_INT'] >= EDAD_MIN) &
        (df_polizas['EDAD_INT'] <= EDAD_MAX) &
        (df_polizas['SEXO'].isin(SEXOS_VALIDOS))
    ].copy()
    filas_despues_pol = len(df_polizas)
    stats['polizas_filtradas'] = filas_antes_pol - filas_despues_pol
    print(f"      Pólizas: {filas_antes_pol:,} → {filas_despues_pol:,} " +
          f"(excluidas: {filas_antes_pol - filas_despues_pol:,})")

    # --- 2.3 Unir clasificación de nivel ---
    print("\n  2.3 Asignación de nivel de complejidad...")

    # Crear diccionario causa -> nivel
    mapa_nivel = df_clasificacion.set_index('causa')['nivel'].to_dict()

    # Asignar nivel
    df_siniestros['NIVEL'] = df_siniestros['CAUSA'].map(mapa_nivel)

    # Verificar causas sin clasificar
    sin_clasificar = df_siniestros['NIVEL'].isna()
    causas_sin_clasificar = df_siniestros.loc[sin_clasificar, 'CAUSA'].nunique()
    siniestros_sin_clasificar = sin_clasificar.sum()
    stats['causas_sin_clasificar'] = causas_sin_clasificar
    stats['siniestros_sin_clasificar'] = siniestros_sin_clasificar

    cobertura_pct = (1 - siniestros_sin_clasificar / len(df_siniestros)) * 100
    stats['cobertura_clasificacion'] = cobertura_pct

    print(f"      Causas sin clasificar: {causas_sin_clasificar:,}")
    print(f"      Siniestros sin clasificar: {siniestros_sin_clasificar:,}")
    print(f"      Cobertura de clasificación: {cobertura_pct:.1f}%")

    # Excluir siniestros sin clasificar
    df_siniestros = df_siniestros[~sin_clasificar].copy()
    df_siniestros['NIVEL'] = df_siniestros['NIVEL'].astype(int)

    # --- 2.4 Ajuste por inflación ---
    print("\n  2.4 Ajuste por inflación médica...")
    print("      Factores aplicados:")
    for anio, factor in sorted(INFLACION_MEDICA.items()):
        print(f"        {anio}: ×{factor:.2f}")

    # Filtrar montos negativos (posibles devoluciones)
    montos_negativos = (df_siniestros['MONTO_PAGADO'] < 0).sum()
    stats['montos_negativos'] = montos_negativos
    if montos_negativos > 0:
        print(f"      Montos negativos excluidos: {montos_negativos:,}")
        df_siniestros = df_siniestros[df_siniestros['MONTO_PAGADO'] >= 0].copy()

    # Aplicar factor de inflación
    df_siniestros['FACTOR_INFLACION'] = df_siniestros['ANIO'].map(INFLACION_MEDICA)
    df_siniestros['MONTO_AJUSTADO'] = (
        df_siniestros['MONTO_PAGADO'] * df_siniestros['FACTOR_INFLACION']
    )

    monto_original = df_siniestros['MONTO_PAGADO'].sum()
    monto_ajustado = df_siniestros['MONTO_AJUSTADO'].sum()
    stats['monto_original_total'] = monto_original
    stats['monto_ajustado_total'] = monto_ajustado
    print(f"\n      Monto total original: ${monto_original:,.0f}")
    print(f"      Monto total ajustado (2024): ${monto_ajustado:,.0f}")
    print(f"      Incremento por inflación: +{((monto_ajustado/monto_original)-1)*100:.1f}%")

    return df_siniestros, df_polizas, stats


# =============================================================================
# FUNCIONES DE CÁLCULO ACTUARIAL
# =============================================================================

def calcular_exposicion(df_polizas: pd.DataFrame) -> pd.DataFrame:
    """
    Calcula el número de asegurados expuestos por edad y sexo.

    La exposición es el denominador en el cálculo de frecuencia.

    Returns:
        DataFrame con columnas: [edad, sexo, expuestos]
    """
    print("\n" + "=" * 70)
    print("PASO 3: CÁLCULO DE EXPOSICIÓN")
    print("=" * 70)

    exposicion = df_polizas.groupby(['EDAD_INT', 'SEXO']).agg({
        'NUM_ASEGURADOS': 'sum'
    }).reset_index()

    exposicion.columns = ['edad', 'sexo', 'expuestos']

    print(f"  Celdas edad×sexo con datos: {len(exposicion)}")
    print(f"  Total expuestos (5 años): {exposicion['expuestos'].sum():,}")
    print(f"  Promedio anual expuestos: {exposicion['expuestos'].sum() / 5:,.0f}")

    # Desglose por sexo
    for sexo in SEXOS_VALIDOS:
        exp_sexo = exposicion[exposicion['sexo'] == sexo]['expuestos'].sum()
        print(f"    {sexo}: {exp_sexo:,}")

    # Verificar edades faltantes
    edades_esperadas = set(range(EDAD_MIN, EDAD_MAX + 1))
    edades_presentes = set(exposicion['edad'].astype(int))
    edades_faltantes = edades_esperadas - edades_presentes

    if edades_faltantes:
        print(f"  ⚠ Edades sin exposición: {sorted(edades_faltantes)}")

    return exposicion


def calcular_metricas_por_nivel_edad(df_siniestros: pd.DataFrame,
                                      df_exposicion: pd.DataFrame) -> pd.DataFrame:
    """
    Calcula frecuencia, severidad, prima de riesgo y prima de tarifa por nivel, edad y sexo.

    Fórmulas:
        - Frecuencia = NUM_SINIESTROS / EXPUESTOS
        - Severidad = MONTO_AJUSTADO / NUM_SINIESTROS
        - Prima de Riesgo = Frecuencia × Severidad
        - Prima de Tarifa = Prima de Riesgo / Factor de Retención

    Returns:
        DataFrame con métricas actuariales por nivel, edad y sexo
    """
    print("\n" + "=" * 70)
    print("PASO 4: CÁLCULO DE MÉTRICAS ACTUARIALES")
    print("=" * 70)

    # Agregar siniestros por edad, nivel y sexo
    print("\n  4.1 Agregación de siniestros por edad, nivel y sexo...")
    metricas = df_siniestros.groupby(['EDAD', 'NIVEL', 'SEXO']).agg({
        'NUM_SINIESTROS': 'sum',
        'MONTO_AJUSTADO': 'sum'
    }).reset_index()

    metricas.columns = ['edad', 'nivel', 'sexo', 'num_siniestros', 'monto_total']

    # Unir con exposición
    print("  4.2 Unión con datos de exposición...")
    metricas = metricas.merge(
        df_exposicion,
        on=['edad', 'sexo'],
        how='left'
    )

    # Calcular frecuencia (morbilidad)
    print("  4.3 Cálculo de frecuencia (morbilidad)...")
    metricas['frecuencia'] = metricas['num_siniestros'] / metricas['expuestos']

    # Calcular severidad (costo medio)
    print("  4.4 Cálculo de severidad (costo medio)...")
    metricas['severidad'] = metricas['monto_total'] / metricas['num_siniestros']

    # Calcular prima de riesgo
    print("  4.5 Cálculo de prima de riesgo...")
    metricas['prima_riesgo'] = metricas['frecuencia'] * metricas['severidad']

    # Calcular prima de tarifa
    print(f"  4.6 Cálculo de prima de tarifa (factor retención: {FACTOR_RETENCION:.2f})...")
    metricas['prima_tarifa'] = metricas['prima_riesgo'] / FACTOR_RETENCION

    # Agregar bandera de credibilidad
    print(f"  4.7 Bandera de credibilidad (mín. {MIN_SINIESTROS_CREDIBILIDAD} siniestros)...")
    metricas['credible'] = metricas['num_siniestros'] >= MIN_SINIESTROS_CREDIBILIDAD

    celdas_credibles = metricas['credible'].sum()
    celdas_totales = len(metricas)
    print(f"      Celdas credibles: {celdas_credibles}/{celdas_totales} " +
          f"({celdas_credibles/celdas_totales*100:.1f}%)")

    # Agregar descripción de nivel
    metricas['descripcion'] = metricas['nivel'].map(NIVEL_DESCRIPCION)

    return metricas


# =============================================================================
# FUNCIONES DE GENERACIÓN DE SALIDAS
# =============================================================================

def generar_primas_por_nivel(metricas: pd.DataFrame,
                              df_exposicion: pd.DataFrame) -> pd.DataFrame:
    """
    Genera tabla resumen de primas por nivel de complejidad y sexo.

    Returns:
        DataFrame con 6 filas (3 niveles × 2 sexos)
    """
    print("\n" + "=" * 70)
    print("PASO 5: GENERACIÓN DE PRIMAS POR NIVEL Y SEXO")
    print("=" * 70)

    # Agregar por nivel y sexo
    por_nivel = metricas.groupby(['nivel', 'sexo']).agg({
        'num_siniestros': 'sum',
        'monto_total': 'sum'
    }).reset_index()

    # Exposición por sexo
    exp_por_sexo = df_exposicion.groupby('sexo')['expuestos'].sum().to_dict()
    por_nivel['expuestos'] = por_nivel['sexo'].map(exp_por_sexo)

    # Calcular métricas agregadas
    por_nivel['frecuencia'] = por_nivel['num_siniestros'] / por_nivel['expuestos']
    por_nivel['severidad'] = por_nivel['monto_total'] / por_nivel['num_siniestros']
    por_nivel['prima_riesgo'] = por_nivel['frecuencia'] * por_nivel['severidad']
    por_nivel['prima_tarifa'] = por_nivel['prima_riesgo'] / FACTOR_RETENCION

    # Porcentajes (dentro de cada sexo)
    for sexo in SEXOS_VALIDOS:
        mask = por_nivel['sexo'] == sexo
        total_sin_sexo = por_nivel.loc[mask, 'num_siniestros'].sum()
        total_monto_sexo = por_nivel.loc[mask, 'monto_total'].sum()
        por_nivel.loc[mask, 'pct_siniestros'] = por_nivel.loc[mask, 'num_siniestros'] / total_sin_sexo * 100
        por_nivel.loc[mask, 'pct_monto'] = por_nivel.loc[mask, 'monto_total'] / total_monto_sexo * 100

    # Agregar descripción
    por_nivel['descripcion'] = por_nivel['nivel'].map(NIVEL_DESCRIPCION)

    # Calcular primas mensuales y de tarifa mensual
    por_nivel['prima_mensual'] = por_nivel['prima_riesgo'] * FACTOR_MENSUAL_2025
    por_nivel['prima_tarifa_mensual'] = por_nivel['prima_tarifa'] * FACTOR_MENSUAL_2025

    # Reordenar columnas
    columnas = [
        'nivel', 'sexo', 'descripcion', 'num_siniestros', 'monto_total', 'expuestos',
        'frecuencia', 'severidad', 'prima_riesgo', 'prima_tarifa',
        'prima_mensual', 'prima_tarifa_mensual',
        'pct_siniestros', 'pct_monto'
    ]
    por_nivel = por_nivel[columnas].sort_values(['nivel', 'sexo'])

    # Mostrar resumen
    print("\n  Resumen por nivel y sexo:")
    print("  " + "-" * 110)
    print(f"  {'Nivel':<20} {'Sexo':<12} {'Frecuencia':>10} {'Severidad':>12} {'P.Riesgo':>12} {'P.Tarifa':>12}")
    print("  " + "-" * 110)
    for _, row in por_nivel.iterrows():
        print(f"  {row['descripcion']:<20} {row['sexo']:<12} {row['frecuencia']:>10.4f} " +
              f"${row['severidad']:>11,.0f} ${row['prima_riesgo']:>11,.0f} ${row['prima_tarifa']:>11,.0f}")
    print("  " + "-" * 110)
    print(f"\n  Factor retención: {FACTOR_RETENCION:.2f} (1 - {GASTOS_ADMINISTRACION} - {GASTOS_ADQUISICION} - {MARGEN_UTILIDAD})")

    return por_nivel


def generar_primas_por_nivel_edad(metricas: pd.DataFrame) -> pd.DataFrame:
    """
    Genera matriz completa de primas por nivel, edad y sexo.

    Returns:
        DataFrame con 276 filas (3 niveles × 46 edades × 2 sexos)
    """
    print("\n" + "=" * 70)
    print("PASO 6: GENERACIÓN DE MATRIZ NIVEL × EDAD × SEXO")
    print("=" * 70)

    # Crear todas las combinaciones de edad, nivel y sexo
    from itertools import product
    edades = list(range(EDAD_MIN, EDAD_MAX + 1))
    niveles = [1, 2, 3]
    sexos = SEXOS_VALIDOS

    combinaciones = pd.DataFrame(
        list(product(edades, niveles, sexos)),
        columns=['edad', 'nivel', 'sexo']
    )

    # Unir con métricas calculadas
    matriz = combinaciones.merge(
        metricas[['edad', 'nivel', 'sexo', 'num_siniestros', 'expuestos',
                  'frecuencia', 'monto_total', 'severidad', 'prima_riesgo',
                  'prima_tarifa', 'credible']],
        on=['edad', 'nivel', 'sexo'],
        how='left'
    )

    # Rellenar valores faltantes
    matriz['num_siniestros'] = matriz['num_siniestros'].fillna(0).astype(int)
    matriz['monto_total'] = matriz['monto_total'].fillna(0)
    matriz['frecuencia'] = matriz['frecuencia'].fillna(0)
    matriz['credible'] = matriz['credible'].fillna(False)
    # Severidad, prima_riesgo, prima_tarifa quedan como NaN si no hay siniestros

    # Agregar descripción
    matriz['descripcion'] = matriz['nivel'].map(NIVEL_DESCRIPCION)

    # Calcular primas mensuales
    matriz['prima_mensual'] = matriz['prima_riesgo'] * FACTOR_MENSUAL_2025
    matriz['prima_tarifa_mensual'] = matriz['prima_tarifa'] * FACTOR_MENSUAL_2025

    # Reordenar columnas
    columnas = [
        'edad', 'nivel', 'sexo', 'descripcion', 'num_siniestros', 'expuestos',
        'frecuencia', 'monto_total', 'severidad',
        'prima_riesgo', 'prima_tarifa', 'prima_mensual', 'prima_tarifa_mensual',
        'credible'
    ]
    matriz = matriz[columnas].sort_values(['edad', 'nivel', 'sexo'])

    # Estadísticas
    celdas_con_datos = (matriz['num_siniestros'] > 0).sum()
    celdas_totales = len(matriz)
    print(f"  Celdas totales: {celdas_totales}")
    print(f"  Celdas con datos: {celdas_con_datos} ({celdas_con_datos/celdas_totales*100:.1f}%)")
    print(f"  Celdas credibles: {matriz['credible'].sum()}")

    return matriz


# =============================================================================
# VALIDACIÓN Y REPORTE
# =============================================================================

def validar_resultados(primas_nivel: pd.DataFrame,
                        primas_matriz: pd.DataFrame) -> dict:
    """
    Ejecuta validaciones de coherencia en los resultados.

    Returns:
        dict con resultados de validación
    """
    print("\n" + "=" * 70)
    print("PASO 7: VALIDACIÓN DE RESULTADOS")
    print("=" * 70)

    validaciones = {}
    errores = []

    # 7.1 Frecuencia en rango razonable (0 a 0.5)
    print("\n  7.1 Validación de frecuencia...")
    freq_max = primas_matriz['frecuencia'].max()
    freq_min = primas_matriz['frecuencia'].min()
    validaciones['frecuencia_max'] = freq_max
    validaciones['frecuencia_min'] = freq_min

    if freq_max > 0.5:
        errores.append(f"Frecuencia máxima muy alta: {freq_max:.4f}")
    if freq_min < 0:
        errores.append(f"Frecuencia negativa detectada: {freq_min:.4f}")
    print(f"      Rango: [{freq_min:.4f}, {freq_max:.4f}] (esperado: [0, 0.5])")

    # 7.2 Severidad en rangos esperados por nivel
    print("\n  7.2 Validación de severidad por nivel...")
    rangos_severidad = {
        1: (5_000, 100_000),      # Ambulatorio
        2: (50_000, 300_000),     # Hospitalario
        3: (150_000, 1_500_000)   # Alta Especialidad
    }

    for nivel in [1, 2, 3]:
        sev_avg = primas_nivel[primas_nivel['nivel'] == nivel]['severidad'].mean()
        min_esp, max_esp = rangos_severidad[nivel]
        status = "✓" if min_esp <= sev_avg <= max_esp else "⚠"
        print(f"      Nivel {nivel}: ${sev_avg:,.0f} (esperado: ${min_esp:,}-${max_esp:,}) {status}")

        if sev_avg < min_esp * 0.5 or sev_avg > max_esp * 2:
            errores.append(f"Severidad nivel {nivel} fuera de rango: ${sev_avg:,.0f}")

    # 7.3 Valores NaN/Inf
    print("\n  7.3 Validación de valores especiales...")
    nan_count = primas_matriz[['frecuencia', 'prima_riesgo']].isna().sum().sum()
    inf_count = np.isinf(primas_matriz[['frecuencia', 'severidad', 'prima_riesgo']].select_dtypes(include=[np.number])).sum().sum()
    validaciones['nan_count'] = nan_count
    validaciones['inf_count'] = inf_count
    print(f"      NaN en métricas clave: {nan_count}")
    print(f"      Inf en métricas clave: {inf_count}")

    # 7.4 Suma de porcentajes (por sexo, cada uno debe sumar 100%)
    print("\n  7.4 Validación de porcentajes...")
    for sexo in SEXOS_VALIDOS:
        mask = primas_nivel['sexo'] == sexo
        suma_pct_sin = primas_nivel.loc[mask, 'pct_siniestros'].sum()
        suma_pct_monto = primas_nivel.loc[mask, 'pct_monto'].sum()
        print(f"      {sexo} - % siniestros: {suma_pct_sin:.2f}%, % monto: {suma_pct_monto:.2f}%")
    validaciones['pct_por_sexo_ok'] = True

    # Resumen
    validaciones['errores'] = errores
    if errores:
        print(f"\n  ⚠ ADVERTENCIAS: {len(errores)}")
        for e in errores:
            print(f"      - {e}")
    else:
        print("\n  ✓ Todas las validaciones pasaron correctamente")

    return validaciones


def generar_reporte(stats_prep: dict,
                    primas_nivel: pd.DataFrame,
                    primas_matriz: pd.DataFrame,
                    validaciones: dict) -> str:
    """
    Genera reporte de diagnóstico en texto.

    Returns:
        str con el contenido del reporte
    """
    print("\n" + "=" * 70)
    print("PASO 8: GENERACIÓN DE REPORTE")
    print("=" * 70)

    lineas = []
    lineas.append("=" * 70)
    lineas.append("REPORTE DE TARIFICACIÓN GMM - FASE 3")
    lineas.append(f"Generado: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}")
    lineas.append("=" * 70)

    # Resumen de datos
    lineas.append("\n1. RESUMEN DE DATOS DE ENTRADA")
    lineas.append("-" * 40)
    lineas.append(f"   Cobertura de clasificación: {stats_prep.get('cobertura_clasificacion', 0):.1f}%")
    lineas.append(f"   Causas sin clasificar: {stats_prep.get('causas_sin_clasificar', 0):,}")
    lineas.append(f"   Siniestros excluidos (edad): {stats_prep.get('siniestros_filtrados', 0):,}")
    lineas.append(f"   Pólizas excluidas (edad): {stats_prep.get('polizas_filtradas', 0):,}")

    # Ajuste de inflación
    lineas.append("\n2. AJUSTE POR INFLACIÓN MÉDICA")
    lineas.append("-" * 40)
    lineas.append(f"   Monto original total: ${stats_prep.get('monto_original_total', 0):,.0f}")
    lineas.append(f"   Monto ajustado (2024): ${stats_prep.get('monto_ajustado_total', 0):,.0f}")
    incremento = ((stats_prep.get('monto_ajustado_total', 1) /
                   stats_prep.get('monto_original_total', 1)) - 1) * 100
    lineas.append(f"   Incremento por inflación: +{incremento:.1f}%")

    # Resultados por nivel y sexo
    lineas.append("\n3. PRIMAS DE RIESGO POR NIVEL Y SEXO (ANUALES)")
    lineas.append("-" * 40)
    lineas.append(f"   {'Nivel':<20} {'Sexo':<12} {'Frecuencia':>10} {'Severidad':>14} {'P.Riesgo':>12} {'P.Tarifa':>12}")
    lineas.append("   " + "-" * 80)
    for _, row in primas_nivel.iterrows():
        lineas.append(f"   {row['descripcion']:<20} {row['sexo']:<12} {row['frecuencia']:>10.4f} " +
                     f"${row['severidad']:>13,.0f} ${row['prima_riesgo']:>11,.0f} ${row['prima_tarifa']:>11,.0f}")

    lineas.append("   " + "-" * 80)
    lineas.append(f"\n   Factor retención: {FACTOR_RETENCION:.2f} " +
                  f"(1 - {GASTOS_ADMINISTRACION} - {GASTOS_ADQUISICION} - {MARGEN_UTILIDAD})")

    # Primas Mensuales 2025
    lineas.append("\n4. PRIMAS MENSUALES 2025 (CON FACTOR DE DESCUENTO)")
    lineas.append("-" * 40)
    lineas.append(f"   Tasa de descuento anual: {TASA_DESCUENTO_ANUAL_2025*100:.1f}%")
    lineas.append(f"   Factor de conversión mensual: {FACTOR_MENSUAL_2025:.6f}")
    lineas.append("")
    lineas.append(f"   {'Nivel':<20} {'Sexo':<12} {'P.Riesgo Mens':>14} {'P.Tarifa Mens':>14}")
    lineas.append("   " + "-" * 60)
    for _, row in primas_nivel.iterrows():
        lineas.append(f"   {row['descripcion']:<20} {row['sexo']:<12} ${row['prima_mensual']:>13,.2f} ${row['prima_tarifa_mensual']:>13,.2f}")
    lineas.append("   " + "-" * 60)

    # Estadísticas de la matriz
    lineas.append("\n5. MATRIZ NIVEL × EDAD × SEXO (25-70)")
    lineas.append("-" * 40)
    celdas_totales = len(primas_matriz)
    celdas_con_datos = (primas_matriz['num_siniestros'] > 0).sum()
    celdas_credibles = primas_matriz['credible'].sum()
    lineas.append(f"   Celdas totales: {celdas_totales} (3 niveles × 46 edades × 2 sexos)")
    lineas.append(f"   Celdas con datos: {celdas_con_datos} ({celdas_con_datos/celdas_totales*100:.1f}%)")
    lineas.append(f"   Celdas credibles (≥30 sin.): {celdas_credibles} ({celdas_credibles/celdas_totales*100:.1f}%)")

    # Rango de primas
    lineas.append("\n   Rango de primas de riesgo por nivel:")
    for nivel in [1, 2, 3]:
        datos_nivel = primas_matriz[(primas_matriz['nivel'] == nivel) &
                                     (primas_matriz['prima_riesgo'].notna())]
        if len(datos_nivel) > 0:
            prima_min = datos_nivel['prima_riesgo'].min()
            prima_max = datos_nivel['prima_riesgo'].max()
            lineas.append(f"   - {NIVEL_DESCRIPCION[nivel]}: ${prima_min:,.0f} - ${prima_max:,.0f}")

    # Validaciones
    lineas.append("\n6. VALIDACIONES")
    lineas.append("-" * 40)
    errores = validaciones.get('errores', [])
    if errores:
        lineas.append(f"   ⚠ {len(errores)} advertencia(s) detectada(s):")
        for e in errores:
            lineas.append(f"      - {e}")
    else:
        lineas.append("   ✓ Todas las validaciones pasaron correctamente")

    # Archivos generados
    lineas.append("\n7. ARCHIVOS GENERADOS")
    lineas.append("-" * 40)
    lineas.append(f"   - {OUTPUT_DIR}/primas_por_nivel.csv")
    lineas.append(f"   - {OUTPUT_DIR}/primas_por_nivel_edad.csv")
    lineas.append(f"   - {OUTPUT_DIR}/reporte_tarificacion.txt")

    lineas.append("\n" + "=" * 70)
    lineas.append("FIN DEL REPORTE")
    lineas.append("=" * 70)

    return "\n".join(lineas)


# =============================================================================
# FUNCIÓN PRINCIPAL
# =============================================================================

def main():
    """
    Ejecuta el pipeline completo de cálculo actuarial.
    """
    print("\n" + "=" * 70)
    print("FASE 3: CÁLCULO ACTUARIAL DE PRIMAS DE RIESGO GMM")
    print("=" * 70)
    print(f"Metodología: Prima de Riesgo = Frecuencia × Severidad")
    print(f"Rango de edades: {EDAD_MIN}-{EDAD_MAX} años")
    print(f"Ajuste de inflación: Sí (a pesos 2024)")

    # 1. Cargar datos
    df_siniestros, df_polizas, df_clasificacion = cargar_datos()

    # 2. Preparar datos
    df_siniestros_prep, df_polizas_prep, stats_prep = preparar_datos(
        df_siniestros, df_polizas, df_clasificacion
    )

    # 3. Calcular exposición
    df_exposicion = calcular_exposicion(df_polizas_prep)

    # 4. Calcular métricas actuariales
    metricas = calcular_metricas_por_nivel_edad(df_siniestros_prep, df_exposicion)

    # 5. Generar tabla por nivel
    primas_nivel = generar_primas_por_nivel(metricas, df_exposicion)

    # 6. Generar matriz nivel × edad
    primas_matriz = generar_primas_por_nivel_edad(metricas)

    # 7. Validar resultados
    validaciones = validar_resultados(primas_nivel, primas_matriz)

    # 8. Generar reporte
    reporte = generar_reporte(stats_prep, primas_nivel, primas_matriz, validaciones)

    # 9. Guardar archivos
    print("\n" + "=" * 70)
    print("PASO 9: GUARDADO DE ARCHIVOS")
    print("=" * 70)

    # Primas por nivel
    ruta_nivel = OUTPUT_DIR / "primas_por_nivel.csv"
    primas_nivel.to_csv(ruta_nivel, index=False)
    print(f"  ✓ {ruta_nivel}")

    # Primas por nivel y edad
    ruta_matriz = OUTPUT_DIR / "primas_por_nivel_edad.csv"
    primas_matriz.to_csv(ruta_matriz, index=False)
    print(f"  ✓ {ruta_matriz}")

    # Reporte
    ruta_reporte = OUTPUT_DIR / "reporte_tarificacion.txt"
    with open(ruta_reporte, 'w', encoding='utf-8') as f:
        f.write(reporte)
    print(f"  ✓ {ruta_reporte}")

    # Resumen final
    print("\n" + "=" * 70)
    print("FASE 3 COMPLETADA EXITOSAMENTE")
    print("=" * 70)
    print(f"\nArchivos generados en: {OUTPUT_DIR}/")
    print(f"  - primas_por_nivel.csv ({len(primas_nivel)} filas)")
    print(f"  - primas_por_nivel_edad.csv ({len(primas_matriz)} filas)")
    print(f"  - reporte_tarificacion.txt")

    # Mostrar resumen de primas por sexo
    print("\nRESUMEN DE PRIMAS DE RIESGO Y TARIFA:")
    print("-" * 90)
    print(f"  {'Nivel':<20} {'Sexo':<12} {'P.Riesgo':>12} {'P.Tarifa':>12} {'P.Mens Riesgo':>14}")
    print("-" * 90)
    for _, row in primas_nivel.iterrows():
        print(f"  {row['descripcion']:<20} {row['sexo']:<12} "
              f"${row['prima_riesgo']:>11,.2f} ${row['prima_tarifa']:>11,.2f} ${row['prima_mensual']:>13,.2f}")

    print("-" * 90)
    print(f"\n  Factor retención: {FACTOR_RETENCION:.2f}")
    print(f"  Factor mensual 2025 (tasa {TASA_DESCUENTO_ANUAL_2025*100:.0f}%): {FACTOR_MENSUAL_2025:.6f}")
    print(f"  Recargo por pago mensual: ~{(FACTOR_MENSUAL_2025*12 - 1)*100:.1f}%")

    return primas_nivel, primas_matriz


if __name__ == "__main__":
    main()
