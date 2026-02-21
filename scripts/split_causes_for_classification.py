"""
Splits model-predicted causes into batch files for Claude subagent classification.
Each batch file contains causes to be classified by a separate subagent.
"""
import pandas as pd
from pathlib import Path
import math

# Rutas
BASE_DIR = Path(__file__).parent.parent
INPUT_FILE = BASE_DIR / "data/classified/all_causes_classified.csv"
OUTPUT_DIR = Path("/home/andtega349/subagents_outputs/gmm_classification")

NUM_BATCHES = 8  # Smaller batches for subagent context window limits

# Cargar datos
df = pd.read_csv(INPUT_FILE)
print(f"Total causas: {len(df):,}")
print(f"Manuales: {(df['origen'] == 'manual').sum():,}")
print(f"Modelo: {(df['origen'] == 'modelo').sum():,}")

# Filtrar solo causas del modelo (las que necesitan reclasificacion)
df_modelo = df[df['origen'] == 'modelo'].copy()
df_modelo = df_modelo.sort_values('frecuencia', ascending=False).reset_index(drop=True)

total = len(df_modelo)
batch_size = math.ceil(total / NUM_BATCHES)

print(f"\nDividiendo {total:,} causas en {NUM_BATCHES} lotes de ~{batch_size:,}")

OUTPUT_DIR.mkdir(parents=True, exist_ok=True)

for i in range(NUM_BATCHES):
    start = i * batch_size
    end = min((i + 1) * batch_size, total)
    batch = df_modelo.iloc[start:end]

    output_file = OUTPUT_DIR / f"batch_input_{i+1}.csv"
    batch[['causa', 'frecuencia']].to_csv(output_file, index=False)
    print(f"  Lote {i+1}: filas {start}-{end-1} ({len(batch):,} causas) -> {output_file.name}")

# Also save the manual causes for reference
df_manual = df[df['origen'] == 'manual'].copy()
df_manual.to_csv(OUTPUT_DIR / "causas_manuales.csv", index=False)
print(f"\nCausas manuales guardadas: {len(df_manual):,}")

print("\nListo para clasificacion con subagentes.")
