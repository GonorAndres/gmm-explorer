"""
Fase 2: Clasifica todas las causas usando el modelo entrenado.
Combina causas clasificadas manualmente (Fase 1) con predicciones del modelo.
"""
import pandas as pd
import numpy as np
import json
from pathlib import Path
import joblib

# Rutas
BASE_DIR = Path(__file__).parent.parent
SINIESTROS_FILE = BASE_DIR / "data/consolidated/siniestros.parquet"
TRAINING_FILE = BASE_DIR / "data/labeled/training_set.csv"
MODEL_DIR = BASE_DIR / "outputs/model"
CLASSIFIED_DIR = BASE_DIR / "data/classified"
REPORT_DIR = BASE_DIR / "outputs/phase2"

# Crear directorios
CLASSIFIED_DIR.mkdir(parents=True, exist_ok=True)
REPORT_DIR.mkdir(parents=True, exist_ok=True)

print("=" * 80)
print("FASE 2: CLASIFICACIÓN DE TODAS LAS CAUSAS")
print("=" * 80)

# 1. Cargar modelo y vectorizador
print("\n[1/5] Cargando modelo...")
modelo = joblib.load(MODEL_DIR / "clasificador.joblib")
vectorizer = joblib.load(MODEL_DIR / "vectorizer.joblib")
print("   ✓ Modelo y vectorizador cargados")

# 2. Cargar datos
print("\n[2/5] Cargando datos...")

# Training set (causas ya clasificadas manualmente)
df_manual = pd.read_csv(TRAINING_FILE)
causas_manuales = set(df_manual['causa'].values)
print(f"   Causas clasificadas manualmente: {len(causas_manuales):,}")

# Todas las causas únicas de siniestros
df_siniestros = pd.read_parquet(SINIESTROS_FILE)
causa_stats = df_siniestros.groupby('CAUSA').agg({
    'NUM_SINIESTROS': 'sum'
}).reset_index()
causa_stats.columns = ['causa', 'frecuencia']

total_causas = len(causa_stats)
print(f"   Total causas únicas: {total_causas:,}")

# Causas pendientes de clasificar
causas_pendientes = causa_stats[~causa_stats['causa'].isin(causas_manuales)].copy()
print(f"   Causas a clasificar con modelo: {len(causas_pendientes):,}")

# 3. Clasificar causas pendientes
print("\n[3/5] Clasificando causas con modelo...")

if len(causas_pendientes) > 0:
    X_pendientes = causas_pendientes['causa'].values
    X_tfidf = vectorizer.transform(X_pendientes)

    # Predicciones y probabilidades
    y_pred = modelo.predict(X_tfidf)
    y_proba = modelo.predict_proba(X_tfidf)

    # Obtener probabilidad máxima (confianza del modelo)
    max_proba = y_proba.max(axis=1)

    causas_pendientes['nivel'] = y_pred
    causas_pendientes['nivel_probabilidad'] = max_proba
    causas_pendientes['origen'] = 'modelo'

    print(f"   ✓ {len(causas_pendientes):,} causas clasificadas")

    # Distribución de predicciones
    print(f"\n   Distribución de predicciones:")
    for nivel in [1, 2, 3]:
        count = (y_pred == nivel).sum()
        pct = count / len(y_pred) * 100
        print(f"     Nivel {nivel}: {count:,} ({pct:.1f}%)")

    # Distribución de confianza
    print(f"\n   Distribución de confianza del modelo:")
    bins = [0, 0.4, 0.6, 0.8, 1.0]
    labels = ['Baja (<40%)', 'Media (40-60%)', 'Alta (60-80%)', 'Muy alta (>80%)']
    for i in range(len(bins)-1):
        count = ((max_proba >= bins[i]) & (max_proba < bins[i+1])).sum()
        pct = count / len(max_proba) * 100
        print(f"     {labels[i]}: {count:,} ({pct:.1f}%)")
else:
    print("   No hay causas pendientes de clasificar")

# 4. Combinar con clasificación manual
print("\n[4/5] Combinando clasificaciones...")

# Preparar datos manuales
df_manual_final = df_manual[['causa', 'nivel', 'frecuencia']].copy()
df_manual_final['nivel_probabilidad'] = 1.0  # 100% confianza para manuales
df_manual_final['origen'] = 'manual'

# Combinar
if len(causas_pendientes) > 0:
    df_modelo = causas_pendientes[['causa', 'nivel', 'frecuencia', 'nivel_probabilidad', 'origen']]
    df_all = pd.concat([df_manual_final, df_modelo], ignore_index=True)
else:
    df_all = df_manual_final

# Ordenar por frecuencia
df_all = df_all.sort_values('frecuencia', ascending=False).reset_index(drop=True)

print(f"   Total causas clasificadas: {len(df_all):,}")
print(f"   Manuales: {(df_all['origen'] == 'manual').sum():,}")
print(f"   Modelo: {(df_all['origen'] == 'modelo').sum():,}")

# Calcular cobertura
total_siniestros = df_siniestros['NUM_SINIESTROS'].sum()
cobertura = df_all['frecuencia'].sum() / total_siniestros * 100
print(f"\n   Cobertura de siniestros: {cobertura:.2f}%")

# 5. Guardar resultados y generar reporte
print("\n[5/5] Guardando resultados...")

# CSV principal
output_file = CLASSIFIED_DIR / "all_causes_classified.csv"
df_all.to_csv(output_file, index=False)
print(f"   ✓ {output_file}")

# Causas de baja confianza (para revisión manual opcional)
df_low_conf = df_all[(df_all['origen'] == 'modelo') & (df_all['nivel_probabilidad'] < 0.5)]
if len(df_low_conf) > 0:
    low_conf_file = CLASSIFIED_DIR / "causas_baja_confianza.csv"
    df_low_conf.to_csv(low_conf_file, index=False)
    print(f"   ✓ {low_conf_file} ({len(df_low_conf)} causas)")

# Generar reporte
print("\n" + "=" * 80)
print("REPORTE DE CLASIFICACIÓN - FASE 2")
print("=" * 80)

reporte_lines = []

reporte_lines.append("\n=== RESUMEN GENERAL ===")
reporte_lines.append(f"Total causas únicas: {len(df_all):,}")
reporte_lines.append(f"Clasificadas manualmente (Fase 1): {(df_all['origen'] == 'manual').sum():,}")
reporte_lines.append(f"Clasificadas por modelo (Fase 2): {(df_all['origen'] == 'modelo').sum():,}")
reporte_lines.append(f"Cobertura de siniestros: {cobertura:.2f}%")

reporte_lines.append("\n=== DISTRIBUCIÓN POR NIVEL ===")
nivel_dist = df_all.groupby('nivel').agg({
    'causa': 'count',
    'frecuencia': 'sum'
}).reset_index()
nivel_dist.columns = ['nivel', 'num_causas', 'num_siniestros']

for _, row in nivel_dist.iterrows():
    pct_causas = row['num_causas'] / len(df_all) * 100
    pct_siniestros = row['num_siniestros'] / total_siniestros * 100
    reporte_lines.append(
        f"Nivel {int(row['nivel'])}: {row['num_causas']:,} causas ({pct_causas:.1f}%) | "
        f"{int(row['num_siniestros']):,} siniestros ({pct_siniestros:.1f}%)"
    )

reporte_lines.append("\n=== CONFIANZA DEL MODELO ===")
df_modelo_only = df_all[df_all['origen'] == 'modelo']
if len(df_modelo_only) > 0:
    alta_conf = (df_modelo_only['nivel_probabilidad'] >= 0.6).sum()
    media_conf = ((df_modelo_only['nivel_probabilidad'] >= 0.4) & (df_modelo_only['nivel_probabilidad'] < 0.6)).sum()
    baja_conf = (df_modelo_only['nivel_probabilidad'] < 0.4).sum()
    reporte_lines.append(f"Alta (≥60%): {alta_conf:,} causas ({alta_conf/len(df_modelo_only)*100:.1f}%)")
    reporte_lines.append(f"Media (40-60%): {media_conf:,} causas ({media_conf/len(df_modelo_only)*100:.1f}%)")
    reporte_lines.append(f"Baja (<40%): {baja_conf:,} causas ({baja_conf/len(df_modelo_only)*100:.1f}%)")

reporte_lines.append("\n=== TOP 10 CAUSAS POR NIVEL ===")
for nivel in [1, 2, 3]:
    df_nivel = df_all[df_all['nivel'] == nivel].head(5)
    reporte_lines.append(f"\nNivel {nivel}:")
    for _, row in df_nivel.iterrows():
        conf = f"{row['nivel_probabilidad']*100:.0f}%" if row['origen'] == 'modelo' else 'manual'
        reporte_lines.append(f"  [{conf}] {int(row['frecuencia']):,}: {row['causa'][:60]}")

# Imprimir y guardar reporte
reporte_text = "\n".join(reporte_lines)
print(reporte_text)

reporte_file = REPORT_DIR / "reporte_modelo.txt"
with open(reporte_file, 'w', encoding='utf-8') as f:
    f.write("REPORTE DE CLASIFICACIÓN - FASE 2\n")
    f.write("=" * 80 + "\n")
    f.write(f"Fecha: {pd.Timestamp.now().strftime('%Y-%m-%d %H:%M:%S')}\n")
    f.write(reporte_text)

print(f"\n   ✓ Reporte: {reporte_file}")

print("\n" + "=" * 80)
print("✓ CLASIFICACIÓN COMPLETADA - TODAS LAS CAUSAS CLASIFICADAS")
print("=" * 80)
