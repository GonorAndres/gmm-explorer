# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

GMM Explorer -- academic actuarial system for classifying Major Medical Expense (GMM) claims and calculating risk premiums from CNSF data (2020-2024). Built for AAR 2026-1 at UNAM Facultad de Ciencias.

Core formula: `Prima de Riesgo = Frecuencia x Severidad`

## Language Rules

- **Interaction**: English
- **All code outputs** (comments, CSV headers, web UI text, variable names): **Spanish**

## Commands

```bash
# Python data pipeline (run from project root)
python scripts/consolidate_data.py              # Raw parquet -> consolidated
python scripts/clean_causes.py                  # Optional: normalize cause names
python scripts/consolidate_training_set.py      # Merge classification batches -> training_set.csv
python scripts/split_causes_for_classification.py  # Split causes into batches for Claude subagents
python scripts/merge_claude_classifications.py  # Merge Claude batch outputs -> all_causes_classified.csv
python scripts/calculate_tarificacion.py        # Actuarial premium calculation

# Legacy RF pipeline (superseded by Claude AI -- kept for reference)
# python scripts/train_model.py               # TF-IDF + Random Forest (59% accuracy)
# python scripts/classify_all_causes.py       # Apply RF model to all 9,409 causes

# Generate frontend JSON from pipeline outputs
python web/scripts/prepare-data.py

# Frontend (Next.js)
cd web && npm install
cd web && npm run dev        # Dev server at localhost:3000
cd web && npm run build      # Production build
cd web && npm run lint        # ESLint
```

## Architecture

### Data Pipeline

```
data/raw/*.xlsx (not in repo, ~316MB)
  -> data/processed/*.parquet (10 files: {year}_{emision,siniestros})
    -> data/consolidated/{siniestros,polizas}.parquet
      -> data/labeled/training_set.csv (1,500 manually classified causes)
        -> [Claude subagents via split_causes_for_classification.py]
          -> data/classified/all_causes_classified.csv (9,409 causes)
            -> outputs/tarificacion/primas_por_nivel_edad.csv (3 levels x 46 ages x 2 sexes)
              -> web/data/*.json (8 files consumed by frontend)
```

### Frontend (Next.js 14 App Router)

All pages are client components with local state only (useState/useMemo). No API routes -- all data is statically imported from `web/data/*.json`.

**5 routes:**
- `/siniestros` -- Claims explorer with filters (year, age, sex, level), charts (Recharts), paginated table
- `/polizas` -- Policy explorer with stacked bar/pie/line charts
- `/tarificador` -- Interactive premium calculator (age input -> premium by level)
- `/metodologia` -- Static methodology documentation + classification model comparison
- `/contexto` -- Nota Tecnica summary with team info
- `/` redirects to `/siniestros`

**Key frontend files:**
- `web/lib/constants.ts` -- Shared constants: nivel labels/colors, nav items, UI labels, formatting utilities
- `web/lib/content.ts` -- Centralized Spanish educational content (TOOLTIPS, INSIGHT_PANELS, CALLOUTS)
- `web/types/index.ts` -- TypeScript interfaces for all data shapes + default filter constants
- `web/app/globals.css` -- shadcn/ui CSS variables + custom component classes
- `web/components/layout/sidebar.tsx` -- Responsive sidebar (navy corporate style)
- `web/components/ui/` -- Reusable components: PageHeader, MetricCard, ChartCard, DistributionCard, InsightPanel + shadcn/ui primitives
- `web/components/filters/` -- FilterBar, YearToggle, NivelToggle
- `web/components/charts/` -- NivelLineChart, DonutChart
- `web/lib/hooks/use-filters.ts` -- Shared filter state hook

**Data files (`web/data/`):**
| File | Used by | Source |
|------|---------|--------|
| `siniestros-agregados.json` | /siniestros | prepare-data.py |
| `resumen-general.json` | /siniestros | prepare-data.py |
| `primas-nivel-edad.json` | /siniestros, /tarificador | prepare-data.py |
| `polizas-agregadas.json` | /polizas | prepare-data.py |
| `polizas-resumen-anual.json` | /polizas | prepare-data.py |
| `polizas-por-banda.json` | /polizas | prepare-data.py |
| `clasificacion-metadata.json` | /metodologia | static (hand-crafted) |
| `explicaciones-causas.json` | /metodologia | static (hand-crafted) |

### Classification Levels

| Nivel | Descripcion | Ejemplos |
|-------|-------------|----------|
| 1 | Ambulatorio/prevencion | Consultas, laboratorio, dental |
| 2 | Hospital/cirugia programada | Cesareas, vesicula, fracturas |
| 3 | Alta especialidad/emergencias | Cancer, UCI, infartos, trasplantes |

### Classification Model

- **Current**: Claude AI (LLM-based classification) -- 7,909 causes classified with high confidence
- **Previous**: TF-IDF + Random Forest (59% accuracy, replaced)
- 1,500 causes classified manually (gold standard)
- 7,909 causes classified by Claude Code subagents (origen='claude')
- Average confidence: 82%, low confidence causes: ~0%
- Reclassified 3,892 causes from RF model; agreement with manual labels ~95%
- Claude understands medical terminology, CIE-10 codes, and clinical context

### Actuarial Calculation

- Age range: 25-70 (46 individual ages)
- Inflation adjustment factors: {2020: 1.41, 2021: 1.30, 2022: 1.20, 2023: 1.10, 2024: 1.00}
- Monthly premium factor uses TIIE 10% annual rate
- Credibility threshold: minimum 30 claims per cell
- Gastos/Utilidad: Prima Tarifa = Prima Riesgo / (1 - 0.20 - 0.10 - 0.10)
- Reference doc: `docs/tarificacion_colectivo_mexico.md`

### Analytics

PostHog tracking is active, inlined in `web/app/layout.tsx`. The key is read from `NEXT_PUBLIC_POSTHOG_KEY`; the script only loads if the env var is set, so running locally without analytics is safe. Copy `web/.env.example` -> `web/.env.local` and fill in the key for prod or local tracking.

Two details that are load-bearing and easy to undo by accident:

- **Events post to `https://gmm.gonor.me/ingest`, not `us.i.posthog.com`.** The same-origin proxy is what keeps adblockers from dropping both the events and the lazily-loaded session-replay recorder. Pointing `api_host` back at PostHog directly silently loses traffic.
- **`posthog.register()` tags every event with `app_id: 'gmm-explorer'`.** The whole portfolio reports into one PostHog project (`362213`), so `$host` cannot separate sites -- this app answers on its custom domain, its `*.vercel.app` address, and per-deploy preview hosts. `app_id` is the only reliable separator; without it this site's traffic is unattributable.

**Known defect:** the snippet still sets `capture_pageview: true`. This is a client-routed Next.js app, so router navigation goes uncaptured -- a session logs one pageview at the entry route and counts as a bounce. The fix is `capture_pageview: 'history_change'`. Note that adding a `defaults` preset does not override an explicit `capture_pageview`.

### Domain

The canonical host is `https://gmm.gonor.me`. `gmm-explorer.vercel.app` is the URL Vercel created with the project; the custom domain is a CNAME on top, not a replacement, so both kept answering and split the traffic and search ranking.

`web/next.config.mjs` now returns a permanent redirect from the provider host to the canonical one. It matches the **exact** apex host rather than a `*.vercel.app` suffix, deliberately: preview deployments live at `<project>-<hash>-<scope>.vercel.app`, and a suffix match would redirect those too and make previews untestable. Do not "simplify" that condition.

Never delete the Vercel URL to solve a duplicate -- it is the real deployment target the custom domain resolves to, and it is already indexed. Redirect it.

## 2020 Data Schema Warning

The 2020 Excel/parquet files have a different schema from 2021-2024. `consolidate_data.py` handles this by computing `MONTO_PAGADO` from itemized components and adding NULL columns for missing fields. Any new script touching raw data must account for this.

## Code Standards

- Spanish for all user-facing text, variable names, and comments
- Executive-style visualizations (clean, minimal)
- Tailwind CSS with custom nivel color tokens (`nivel.ambulatorio`, `nivel.hospitalario`, `nivel.especialidad`)
- Use the `cn()` utility from `web/lib/utils.ts` for conditional class merging

### UI Design System

- shadcn/ui primitives (Button, Card, Select, Slider, Tabs, Tooltip, Badge, Dialog, Separator)
- Corporate/insurance palette: navy (slate-800/900), blue-700 accent, cool gray surfaces
- Nivel semantic colors: emerald-600 (ambulatorio), amber-600 (hospitalario), rose-600 (especialidad)
- Guided exploration: tooltips and collapsible InsightPanels on every data page

## Known Issues

- No tests exist for Python scripts or React components
- `docs/nota_tecnica_final.pdf` is a tracked binary -- run `git rm --cached docs/nota_tecnica_final.pdf` and commit to untrack it (rule already added to .gitignore)
