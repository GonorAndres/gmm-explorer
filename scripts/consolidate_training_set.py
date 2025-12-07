"""
Consolida los 10 archivos CSV de clasificación en training_set.csv
con metadatos de frecuencia y cobertura.
"""
import pandas as pd
from pathlib import Path

# Rutas
BASE_DIR = Path(__file__).parent.parent
PHASE1_DIR = BASE_DIR / "data/phase1"
LABELED_DIR = BASE_DIR / "data/labeled"
OUTPUT_DIR = BASE_DIR / "outputs/phase1"
SINIESTROS_FILE = BASE_DIR / "data/consolidated/siniestros.parquet"

# Crear directorios si no existen
LABELED_DIR.mkdir(parents=True, exist_ok=True)
OUTPUT_DIR.mkdir(parents=True, exist_ok=True)

print("=" * 80)
print("CONSOLIDACIÓN DE TRAINING SET - FASE 1")
print("=" * 80)

# 1. Cargar siniestros para obtener frecuencias
print("\n[1/5] Cargando datos de siniestros...")
df_siniestros = pd.read_parquet(SINIESTROS_FILE)
total_siniestros = df_siniestros['NUM_SINIESTROS'].sum()

# Calcular frecuencia y % cobertura por causa
causa_stats = df_siniestros.groupby('CAUSA').agg({
    'NUM_SINIESTROS': 'sum'
}).reset_index()
causa_stats.columns = ['causa', 'frecuencia']
causa_stats['pct_cobertura'] = (causa_stats['frecuencia'] / total_siniestros * 100).round(4)

print(f"   Total siniestros: {total_siniestros:,}")
print(f"   Causas únicas: {len(causa_stats):,}")

# 2. Cargar y combinar todos los batches
print("\n[2/5] Cargando archivos de clasificación...")
batch_files = sorted(PHASE1_DIR.glob("clasificados_batch_*.csv"))
print(f"   Archivos encontrados: {len(batch_files)}")

dfs = []
for batch_file in batch_files:
    df_batch = pd.read_csv(batch_file)
    print(f"   - {batch_file.name}: {len(df_batch)} causas")
    dfs.append(df_batch)

df_clasificados = pd.concat(dfs, ignore_index=True)
print(f"\n   Total causas clasificadas: {len(df_clasificados):,}")

# 3. Unir con estadísticas de frecuencia
print("\n[3/5] Agregando metadatos de frecuencia...")
df_training = df_clasificados.merge(
    causa_stats,
    on='causa',
    how='left'
)

# 4. Determinar origen (top_500 vs sample_1000)
print("\n[4/5] Determinando origen de cada causa...")

# Cargar listas originales
df_top500 = pd.read_csv(PHASE1_DIR / "top_500_causas.csv")
df_sample = pd.read_csv(PHASE1_DIR / "sample_1000_causas.csv")

top_500_set = set(df_top500['causa'].values)
sample_1000_set = set(df_sample['causa'].values)

def get_origen(causa):
    if causa in top_500_set:
        return 'top_500'
    elif causa in sample_1000_set:
        return 'sample_1000'
    else:
        return 'unknown'

df_training['origen'] = df_training['causa'].apply(get_origen)

# 5. Ordenar columnas y guardar
print("\n[5/5] Guardando training_set.csv...")
df_training = df_training[[
    'causa',
    'nivel',
    'justificacion_medica',
    'cie10',
    'confianza',
    'frecuencia',
    'pct_cobertura',
    'origen'
]]

# Ordenar por frecuencia descendente
df_training = df_training.sort_values('frecuencia', ascending=False).reset_index(drop=True)

output_file = LABELED_DIR / "training_set.csv"
df_training.to_csv(output_file, index=False)
print(f"   Archivo guardado: {output_file}")

# Generar reporte de clasificación
print("\n" + "=" * 80)
print("REPORTE DE CLASIFICACIÓN")
print("=" * 80)

reporte_lines = []

# Distribución por nivel
nivel_dist = df_training['nivel'].value_counts().sort_index()
reporte_lines.append("\n--- DISTRIBUCIÓN POR NIVEL ---")
for nivel in [1, 2, 3]:
    count = nivel_dist.get(nivel, 0)
    pct = count / len(df_training) * 100
    reporte_lines.append(f"Nivel {nivel}: {count:,} causas ({pct:.1f}%)")

# Distribución por confianza
conf_dist = df_training['confianza'].value_counts()
reporte_lines.append("\n--- DISTRIBUCIÓN POR CONFIANZA ---")
for conf in ['alta', 'media', 'baja']:
    count = conf_dist.get(conf, 0)
    pct = count / len(df_training) * 100
    reporte_lines.append(f"{conf.capitalize()}: {count:,} causas ({pct:.1f}%)")

# Distribución por origen
origen_dist = df_training['origen'].value_counts()
reporte_lines.append("\n--- DISTRIBUCIÓN POR ORIGEN ---")
for origen in ['top_500', 'sample_1000', 'unknown']:
    count = origen_dist.get(origen, 0)
    pct = count / len(df_training) * 100
    reporte_lines.append(f"{origen}: {count:,} causas ({pct:.1f}%)")

# Cobertura total
cobertura_total = df_training['pct_cobertura'].sum()
reporte_lines.append("\n--- COBERTURA ---")
reporte_lines.append(f"% de siniestros cubiertos: {cobertura_total:.2f}%")
reporte_lines.append(f"Causas clasificadas: {len(df_training):,} de {len(causa_stats):,} totales")

# Top 10 causas más frecuentes
reporte_lines.append("\n--- TOP 10 CAUSAS CLASIFICADAS ---")
for idx, row in df_training.head(10).iterrows():
    reporte_lines.append(
        f"Nivel {row['nivel']} | {row['frecuencia']:,} ({row['pct_cobertura']:.2f}%) | {row['causa'][:60]}"
    )

# Imprimir y guardar reporte
reporte_text = "\n".join(reporte_lines)
print(reporte_text)

reporte_file = OUTPUT_DIR / "reporte_clasificacion.txt"
with open(reporte_file, 'w', encoding='utf-8') as f:
    f.write("REPORTE DE CLASIFICACIÓN - FASE 1\n")
    f.write("=" * 80 + "\n")
    f.write(f"\nArchivo: {output_file}\n")
    f.write(f"Fecha: {pd.Timestamp.now().strftime('%Y-%m-%d %H:%M:%S')}\n")
    f.write(reporte_text)

print(f"\n   Reporte guardado: {reporte_file}")
print("\n" + "=" * 80)
print("✓ CONSOLIDACIÓN COMPLETADA")
print("=" * 80)
