# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

# Project: GMM Claims Classification & Risk Pricing - CNSF

## Overview
Classification system for Major Medical Expense (GMM) claims and actuarial risk premium calculation.
Methodology: Risk Premium = Frequency × Severity

## Language Rules
- **Interaction**: English
- **All outputs** (code comments, CSV headers, web UI, documentation): **Spanish**

## Data Sources

### Raw Data (Excel)
Location: `data/raw/`
```
2020_GM_Colectivo_Bases.xlsx  (31 MB) - DIFFERENT FORMAT
2021_GM_Colectivo_Bases.xlsx  (73 MB)
2022_GM_Colectivo_Bases.xlsx  (75 MB)
2023_GM_Colectivo_Bases.xlsx  (77 MB)
2024_GM_Colectivo_Bases.xlsx  (65 MB)
```
⚠️ **IMPORTANT**: 2020 file has different schema. Validate and transform before consolidation.

### Processed Data (Parquet)
Location: `data/processed/`
```
2020_emision.parquet    2020_siniestros.parquet
2021_emision.parquet    2021_siniestros.parquet
2022_emision.parquet    2022_siniestros.parquet
2023_emision.parquet    2023_siniestros.parquet
2024_emision.parquet    2024_siniestros.parquet
```

### Key Variables
- **Siniestros**: edad, monto, causa, año
- **Emisión (Pólizas)**: exposure data for frequency calculation

## Classification Levels

| Nivel | Descripción | Ejemplos |
|-------|-------------|----------|
| 1 | Ambulatorio/prevención | Consultas, gastroenteritis, dental, laboratorio |
| 2 | Hospital/cirugía programada | Cesáreas, vesícula, apendicitis, fracturas |
| 3 | Alta especialidad/emergencias | Cáncer, UCI, infartos, trasplantes |

## Project Structure
```
├── .claude/
│   └── agents.json              # Subagent config
├── data/
│   ├── raw/                     # Original Excel files
│   ├── processed/               # Parquet by year
│   ├── consolidated/            # siniestros.parquet, polizas.parquet
│   └── labeled/                 # training_set.csv (1,500 records)
├── scripts/
│   ├── consolidate_data.py
│   ├── extract_top_causes.py
│   ├── classify_causes.py
│   └── train_model.py
├── outputs/
│   ├── model/
│   └── tarificacion/
└── web/
    └── (Next.js app)
```

## Project Phases

### PHASE 0: Setup & Consolidation
1. Validate 2020 schema vs 2021-2024
2. Transform 2020 to match standard schema
3. Consolidate all siniestros → `consolidated/siniestros.parquet`
4. Consolidate all emisión → `consolidated/polizas.parquet`
5. Generate data quality report

### PHASE 1: Manual Classification (1,500 records)
1. Extract top 500 causes by claim frequency
2. Classify using subagent → `top_500_labeled.csv`
3. Random sample 1,000 from remaining causes
4. Classify using subagent → `sample_1000_labeled.csv`
5. Consolidate → `training_set.csv`

### PHASE 2: Classification Model
1. Feature engineering on causes
2. Train model (sklearn)
3. Evaluate metrics
4. Classify all remaining causes
5. Output: `outputs/model/`, `classified/all_causes.csv`

### PHASE 3: Actuarial Calculation
1. Join classified claims with policies
2. Calculate frequency by level (claims/exposed)
3. Calculate severity by level (average amount)
4. Risk premium = frequency × severity
5. **Calculate premium by level AND individual ages (25-70 years)**
   - Individual ages: 25, 26, 27, ... 70 (46 individual age rates)
   - Collective insurance (GMM Colectivo) focus
   - Reference: `docs/tarificacion_colectivo_mexico.md`
6. Output:
   - `outputs/tarificacion/primas_por_nivel.csv`
   - `outputs/tarificacion/primas_por_nivel_edad.csv` (matrix: 3 niveles × 46 edades)

### PHASE 4: Frontend - Claims Explorer
1. Setup Next.js + Tailwind + shadcn/ui
2. Claims explorer with filters (edad, monto, causa, año)
3. Classification tab (distribution by level)
4. Frequency/severity visualizations

### PHASE 5: Frontend - Policies & Pricing
1. Policy explorer page
2. Interactive pricing calculator
   - Input: new policy characteristics
   - Output: estimated premium

### PHASE 6: Methodology & Deploy
1. Executive methodology page (full process explanation)
2. Final design review
3. Deploy to Vercel

## Subagent Configuration

File: `.claude/agents.json`
```json
{
  "clasificador-medico": {
    "description": "Medical expert for GMM claims classification (Mexico)",
    "prompt": "Eres un médico especialista con experiencia en sistemas de salud mexicanos (IMSS, ISSSTE, sector privado). Dominas CIE-10 y nomenclatura médica mexicana.\n\nCLASIFICA en:\n- Nivel 1: Ambulatorio (consultas, laboratorio, dental)\n- Nivel 2: Hospitalario (cirugías programadas, hospitalizaciones ≤5 días)\n- Nivel 3: Alta especialidad (oncología, UCI, cardiovascular, trasplantes)\n\nCONFIANZA:\n- alta: diagnóstico claro, mapeo directo\n- media: diagnóstico genérico, requiere inferencia\n- baja: texto ambiguo, abreviado, no identificable\n\nRESPONDE EN JSON:\n{\"causa\": \"\", \"nivel\": 1|2|3, \"justificacion_medica\": \"\", \"cie10\": \"\", \"confianza\": \"alta|media|baja\"}",
    "tools": ["Read", "Grep", "WebSearch"],
    "model": "sonnet"
  }
}
```

## Workflow Rules
- One phase = one context session
- After completing phase: save outputs → `/clear`
- Reference this CLAUDE.md + previous phase outputs when starting new phase
- Use `/compact` with specific instructions if context gets long mid-phase

## Code Standards
- Variables and comments: Spanish
- Document classification logic explicitly
- Clean, executive-style visualizations
- Use shadcn/ui for filter components

## Commands
```bash
# Data processing
python scripts/consolidate_data.py
python scripts/extract_top_causes.py
python scripts/classify_causes.py
python scripts/train_model.py

# Frontend
cd web && npm run dev          # Local
vercel deploy                  # Production
```

## Web Pages (4 total)
1. **Explorador Siniestros**: Filters + classification tab
2. **Explorador Pólizas**: Portfolio analysis
3. **Metodología**: Executive project explanation
4. **Tarificador**: Calculate premium for new policy
