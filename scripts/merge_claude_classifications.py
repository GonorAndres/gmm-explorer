"""
Merges Claude subagent classification outputs with manual labels.
Produces updated all_causes_classified.csv and validation report.

Usage:
    python scripts/merge_claude_classifications.py
    python scripts/merge_claude_classifications.py --batch-dir /ruta/a/outputs/gmm_classification
"""
import argparse
import pandas as pd
import numpy as np
from pathlib import Path
import glob

parser = argparse.ArgumentParser(description="Merge Claude batch classifications")
parser.add_argument(
    "--batch-dir",
    type=Path,
    default=Path(__file__).parent.parent.parent / "subagents_outputs" / "gmm_classification",
    help="Directorio con archivos batch_output_*.csv de subagentes Claude",
)
args = parser.parse_args()

# Rutas
BASE_DIR = Path(__file__).parent.parent
BATCH_DIR = args.batch_dir
TRAINING_FILE = BASE_DIR / "data/labeled/training_set.csv"
ORIGINAL_FILE = BASE_DIR / "data/classified/all_causes_classified.csv"
OUTPUT_FILE = BASE_DIR / "data/classified/all_causes_classified.csv"
LOW_CONF_FILE = BASE_DIR / "data/classified/causas_baja_confianza.csv"
REPORT_FILE = BATCH_DIR / "merge_report.md"

print("=" * 70)
print("MERGE: Clasificaciones Claude + Etiquetas Manuales")
print("=" * 70)

# 1. Cargar clasificaciones originales (para frecuencias)
print("\n[1/6] Cargando datos originales...")
df_original = pd.read_csv(ORIGINAL_FILE)
print(f"  Causas totales originales: {len(df_original):,}")

# Crear mapa de causa -> frecuencia
freq_map = df_original.set_index('causa')['frecuencia'].to_dict()

# 2. Cargar etiquetas manuales
print("\n[2/6] Cargando etiquetas manuales...")
df_manual = pd.read_csv(TRAINING_FILE)
manual_causas = set(df_manual['causa'].values)
print(f"  Causas manuales: {len(df_manual):,}")

# Preparar manual con formato final
df_manual_final = df_manual[['causa', 'nivel', 'frecuencia']].copy()
df_manual_final['nivel_probabilidad'] = 1.0
df_manual_final['origen'] = 'manual'

# 3. Cargar y concatenar todas las salidas de batch
print("\n[3/6] Cargando clasificaciones de Claude...")
batch_files = sorted(glob.glob(str(BATCH_DIR / "batch_output_*.csv")))
print(f"  Archivos de batch encontrados: {len(batch_files)}")

dfs_claude = []
for bf in batch_files:
    try:
        df_batch = pd.read_csv(bf)
        print(f"    {Path(bf).name}: {len(df_batch):,} causas")
        dfs_claude.append(df_batch)
    except Exception as e:
        print(f"    ERROR leyendo {bf}: {e}")

if not dfs_claude:
    print("ERROR: No se encontraron archivos de clasificacion!")
    exit(1)

df_claude = pd.concat(dfs_claude, ignore_index=True)
print(f"  Total causas Claude: {len(df_claude):,}")

# Verificar columnas esperadas
expected_cols = {'causa', 'nivel', 'confianza'}
actual_cols = set(df_claude.columns)
if not expected_cols.issubset(actual_cols):
    print(f"  WARN: Columnas esperadas {expected_cols}, encontradas {actual_cols}")
    # Try to adapt
    if 'confidence' in actual_cols:
        df_claude = df_claude.rename(columns={'confidence': 'confianza'})

# 4. Deduplicar (en caso de solapamiento entre batches)
print("\n[4/6] Deduplicando y limpiando...")
len_antes = len(df_claude)
df_claude = df_claude.drop_duplicates(subset='causa', keep='first')
len_despues = len(df_claude)
if len_antes != len_despues:
    print(f"  Duplicados eliminados: {len_antes - len_despues}")

# Excluir causas que ya estan en manual (no sobreescribir)
df_claude = df_claude[~df_claude['causa'].isin(manual_causas)]
print(f"  Causas Claude (sin solapamiento manual): {len(df_claude):,}")

# 5. Preparar formato final
print("\n[5/6] Preparando formato final...")
df_claude_final = pd.DataFrame({
    'causa': df_claude['causa'],
    'nivel': df_claude['nivel'].astype(int),
    'frecuencia': df_claude['causa'].map(freq_map).fillna(0),
    'nivel_probabilidad': df_claude['confianza'].astype(float),
    'origen': 'claude'
})

# Combinar
df_all = pd.concat([df_manual_final, df_claude_final], ignore_index=True)
df_all = df_all.sort_values('frecuencia', ascending=False).reset_index(drop=True)

print(f"  Total causas combinadas: {len(df_all):,}")
print(f"    Manuales: {(df_all['origen'] == 'manual').sum():,}")
print(f"    Claude: {(df_all['origen'] == 'claude').sum():,}")

# 6. Validacion contra etiquetas manuales
print("\n[6/6] Validacion...")

# Verificar cuantas causas faltantes
causas_originales_modelo = set(df_original[df_original['origen'] == 'modelo']['causa'])
causas_claude = set(df_claude_final['causa'])
faltantes = causas_originales_modelo - causas_claude
if faltantes:
    print(f"  WARN: {len(faltantes)} causas del modelo original no clasificadas por Claude")
    # Agregar las faltantes con clasificacion original
    df_faltantes = df_original[df_original['causa'].isin(faltantes)].copy()
    df_faltantes['origen'] = 'modelo'  # mantener como modelo
    df_all = pd.concat([df_all, df_faltantes[['causa', 'nivel', 'frecuencia', 'nivel_probabilidad', 'origen']]], ignore_index=True)
    df_all = df_all.sort_values('frecuencia', ascending=False).reset_index(drop=True)
    print(f"  Causas faltantes agregadas con clasificacion original")
    print(f"  Total final: {len(df_all):,}")

# Distribucion por nivel
print("\n  Distribucion por nivel:")
for nivel in [1, 2, 3]:
    count = (df_all['nivel'] == nivel).sum()
    pct = count / len(df_all) * 100
    print(f"    Nivel {nivel}: {count:,} ({pct:.1f}%)")

# Confianza promedio Claude
df_claude_only = df_all[df_all['origen'] == 'claude']
if len(df_claude_only) > 0:
    avg_conf = df_claude_only['nivel_probabilidad'].mean()
    low_conf = (df_claude_only['nivel_probabilidad'] < 0.6).sum()
    low_conf_pct = low_conf / len(df_claude_only) * 100
    print(f"\n  Confianza promedio Claude: {avg_conf:.2%}")
    print(f"  Causas baja confianza (<60%): {low_conf:,} ({low_conf_pct:.1f}%)")

# Comparar contra clasificacion anterior del modelo RF
df_rf = df_original[df_original['origen'] == 'modelo'].set_index('causa')['nivel']
df_cl = df_claude_final.set_index('causa')['nivel']
overlap = df_rf.index.intersection(df_cl.index)
if len(overlap) > 0:
    acuerdo = (df_rf[overlap] == df_cl[overlap]).sum()
    desacuerdo = len(overlap) - acuerdo
    pct_acuerdo = acuerdo / len(overlap) * 100
    print(f"\n  Comparacion RF vs Claude ({len(overlap):,} causas comunes):")
    print(f"    Acuerdo: {acuerdo:,} ({pct_acuerdo:.1f}%)")
    print(f"    Desacuerdo: {desacuerdo:,} ({100-pct_acuerdo:.1f}%)")

    # Cambios por direccion
    for rf_nivel in [1, 2, 3]:
        for cl_nivel in [1, 2, 3]:
            if rf_nivel != cl_nivel:
                count = ((df_rf[overlap] == rf_nivel) & (df_cl[overlap] == cl_nivel)).sum()
                if count > 0:
                    print(f"    L{rf_nivel} -> L{cl_nivel}: {count:,}")

# Guardar
print("\n  Guardando resultados...")
df_all.to_csv(OUTPUT_FILE, index=False)
print(f"  -> {OUTPUT_FILE}")

# Causas baja confianza
df_low = df_all[(df_all['origen'] != 'manual') & (df_all['nivel_probabilidad'] < 0.6)]
df_low.to_csv(LOW_CONF_FILE, index=False)
print(f"  -> {LOW_CONF_FILE} ({len(df_low):,} causas)")

# Generar reporte
report_lines = [
    "# Reporte de Merge: Clasificaciones Claude",
    "",
    f"- Total causas: {len(df_all):,}",
    f"- Manuales: {(df_all['origen'] == 'manual').sum():,}",
    f"- Claude: {(df_all['origen'] == 'claude').sum():,}",
]
if len(df_claude_only) > 0:
    report_lines.extend([
        f"- Confianza promedio Claude: {avg_conf:.2%}",
        f"- Baja confianza: {low_conf:,} ({low_conf_pct:.1f}%)",
    ])
if len(overlap) > 0:
    report_lines.extend([
        f"- Acuerdo RF vs Claude: {pct_acuerdo:.1f}%",
        f"- Desacuerdo: {desacuerdo:,} causas reclasificadas",
    ])

with open(REPORT_FILE, 'w') as f:
    f.write('\n'.join(report_lines))
print(f"  -> {REPORT_FILE}")

print("\n" + "=" * 70)
print("MERGE COMPLETADO")
print("=" * 70)
