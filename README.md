# 🏥 GMM Explorer

**Sistema de Clasificación y Tarificación de Siniestros de Gastos Médicos Mayores (GMM)**

Proyecto académico para la asignatura **Análisis Actuarial del Riesgo (AAR 2026-1)** de la Facultad de Ciencias, UNAM.

![Next.js](https://img.shields.io/badge/Next.js-14-black?logo=next.js)
![Python](https://img.shields.io/badge/Python-3.10+-blue?logo=python)
![License](https://img.shields.io/badge/License-Academic-green)

---

## 📋 Descripción

Sistema integral que implementa la metodología actuarial para el cálculo de primas de seguros de Gastos Médicos Mayores:

```
Prima de Riesgo = Frecuencia × Severidad
Prima de Tarifa = Prima de Riesgo / (1 - Gastos - Utilidad)
```

### Características principales:
- 🔍 **Explorador de Siniestros**: Visualización y filtrado de 5.1M+ reclamaciones
- 📊 **Clasificación por Niveles**: ML con Random Forest (3 niveles hospitalarios)
- 💰 **Tarificador Interactivo**: Cálculo de primas por edad (25-70 años)
- 📖 **Metodología Documentada**: Proceso técnico completo

---

## 🗂️ Estructura del Proyecto

```
├── data/
│   ├── raw/                 # Excel CNSF 2020-2024 (no incluidos - ver abajo)
│   ├── processed/           # Parquet por año
│   ├── consolidated/        # Datos consolidados
│   ├── labeled/             # Training set clasificado
│   └── classified/          # Causas clasificadas
├── scripts/
│   ├── consolidate_data.py      # Consolidación de datos
│   ├── train_model.py           # Entrenamiento Random Forest
│   └── calculate_tarificacion.py # Cálculo de primas
├── outputs/
│   ├── model/               # Modelo entrenado (.joblib)
│   └── tarificacion/        # Tablas de primas
├── web/                     # Aplicación Next.js
│   ├── app/                 # Páginas (App Router)
│   ├── components/          # Componentes React
│   └── data/                # JSON para visualización
└── docs/                    # Documentación adicional
```

---

## 🚀 Instalación

### Prerrequisitos
- Python 3.10+
- Node.js 18+
- npm o yarn

### 1. Clonar el repositorio
```bash
git clone https://github.com/GonorAndres/gmm-explorer.git
cd gmm-explorer
```

### 2. Configurar entorno Python
```bash
# Crear entorno virtual
python -m venv venv

# Activar entorno
# Windows:
venv\Scripts\activate
# Linux/Mac:
source venv/bin/activate

# Instalar dependencias
pip install -r requirements.txt
```

### 3. Configurar aplicación web
```bash
cd web
npm install
```

### 4. Obtener datos (no incluidos en el repo)
Los archivos de datos originales de la CNSF no están incluidos debido a su tamaño (~316MB). Contacta al equipo o descarga de la fuente oficial.

Archivos requeridos en `data/raw/`:
- `2020_GM_Colectivo_Bases.xlsx`
- `2021_GM_Colectivo_Bases.xlsx`
- `2022_GM_Colectivo_Bases.xlsx`
- `2023_GM_Colectivo_Bases.xlsx`
- `2024_GM_Colectivo_Bases.xlsx`

---

## 💻 Uso

### Ejecutar scripts de procesamiento
```bash
# 1. Consolidar datos
python scripts/consolidate_data.py

# 2. Entrenar modelo
python scripts/train_model.py

# 3. Calcular primas
python scripts/calculate_tarificacion.py
```

### Ejecutar aplicación web
```bash
cd web
npm run dev
```

Abrir [http://localhost:3000](http://localhost:3000) en el navegador.

---

## 📊 Metodología

### Niveles de Clasificación
| Nivel | Descripción | Ejemplos |
|-------|-------------|----------|
| 1 | Ambulatorio/Prevención | Consultas, laboratorio, dental |
| 2 | Hospital/Cirugía programada | Cesáreas, apendicitis, fracturas |
| 3 | Alta especialidad/Emergencias | Cáncer, UCI, trasplantes |

### Modelo de Machine Learning
- **Algoritmo**: Random Forest (100 árboles)
- **Features**: TF-IDF sobre descripción de causas médicas
- **Entrenamiento**: 1,500 causas clasificadas manualmente
- **Precisión**: ~59% accuracy (F1-macro: 58.8%)

---

## 👥 Equipo

| Integrante | GitHub |
|------------|--------|
| Fernández Cordero Ximena | |
| García Páez Daniela | |
| González Contreras Andrea Lisset | |
| González Ortega Andrés | [@GonorAndres](https://github.com/GonorAndres) |
| Mérida Sánchez Valeria Taydeé | |
| Santana Mendoza Elias | |

**Profesora**: Blanca Dulce Miriam Benítez Pérez
**Ayudantes**: Diana Pérez Xicohtécatl, Alejandro Pérez Muñoz

---

## 📄 Licencia

Proyecto académico - UNAM Facultad de Ciencias - AAR 2026-1

---

## 🔗 Enlaces

- [Documentos del Proyecto](https://drive.google.com/drive/folders/1yzJir1d1bAjj4I2PlRus5MduM4K4d3NK?usp=drive_link)
- [Sugerencias y Aportaciones](https://github.com/GonorAndres)
