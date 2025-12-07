"""
Fase 2: Entrenamiento del modelo de clasificación de causas médicas.
Usa TF-IDF + RandomForest para clasificar causas en niveles 1, 2 o 3.
"""
import pandas as pd
import numpy as np
import json
from pathlib import Path
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.ensemble import RandomForestClassifier
from sklearn.model_selection import train_test_split, cross_val_score
from sklearn.metrics import (
    accuracy_score,
    f1_score,
    classification_report,
    confusion_matrix
)
import joblib
import warnings
warnings.filterwarnings('ignore')

# Rutas
BASE_DIR = Path(__file__).parent.parent
TRAINING_FILE = BASE_DIR / "data/labeled/training_set.csv"
MODEL_DIR = BASE_DIR / "outputs/model"
REPORT_DIR = BASE_DIR / "outputs/phase2"

# Crear directorios
MODEL_DIR.mkdir(parents=True, exist_ok=True)
REPORT_DIR.mkdir(parents=True, exist_ok=True)

print("=" * 80)
print("FASE 2: ENTRENAMIENTO DEL MODELO DE CLASIFICACIÓN")
print("=" * 80)

# 1. Cargar datos
print("\n[1/6] Cargando training set...")
df = pd.read_csv(TRAINING_FILE)
print(f"   Total registros: {len(df):,}")
print(f"   Distribución por nivel:")
for nivel in [1, 2, 3]:
    count = (df['nivel'] == nivel).sum()
    pct = count / len(df) * 100
    print(f"     Nivel {nivel}: {count} ({pct:.1f}%)")

# 2. Preparar datos
print("\n[2/6] Preparando datos...")

# Usar solo registros de alta confianza para entrenamiento
df_alta = df[df['confianza'] == 'alta'].copy()
df_otras = df[df['confianza'] != 'alta'].copy()

print(f"   Registros alta confianza: {len(df_alta)}")
print(f"   Registros media/baja confianza: {len(df_otras)}")

X = df_alta['causa'].values
y = df_alta['nivel'].values

# Split estratificado
X_train, X_test, y_train, y_test = train_test_split(
    X, y,
    test_size=0.2,
    stratify=y,
    random_state=42
)

print(f"   Train: {len(X_train)} | Test: {len(X_test)}")

# 3. Vectorización TF-IDF
print("\n[3/6] Vectorización TF-IDF...")
vectorizer = TfidfVectorizer(
    ngram_range=(1, 3),       # unigramas, bigramas, trigramas
    max_features=5000,         # limitar vocabulario
    min_df=2,                  # ignorar términos muy raros
    sublinear_tf=True,         # aplicar escala logarítmica
    strip_accents='unicode',   # normalizar acentos
    lowercase=True
)

X_train_tfidf = vectorizer.fit_transform(X_train)
X_test_tfidf = vectorizer.transform(X_test)

print(f"   Vocabulario: {len(vectorizer.vocabulary_):,} términos")
print(f"   Matriz train: {X_train_tfidf.shape}")
print(f"   Matriz test: {X_test_tfidf.shape}")

# 4. Entrenar modelo
print("\n[4/6] Entrenando RandomForest...")
modelo = RandomForestClassifier(
    n_estimators=200,
    max_depth=None,
    min_samples_split=5,
    min_samples_leaf=2,
    class_weight='balanced',  # manejar desbalance de clases
    n_jobs=-1,
    random_state=42
)

modelo.fit(X_train_tfidf, y_train)
print("   Modelo entrenado.")

# Cross-validation
print("\n   Validación cruzada (5-fold)...")
cv_scores = cross_val_score(modelo, X_train_tfidf, y_train, cv=5, scoring='f1_macro')
print(f"   F1-macro CV: {cv_scores.mean():.4f} (+/- {cv_scores.std():.4f})")

# 5. Evaluar modelo
print("\n[5/6] Evaluando modelo...")

y_pred = modelo.predict(X_test_tfidf)
y_pred_proba = modelo.predict_proba(X_test_tfidf)

acc = accuracy_score(y_test, y_pred)
f1_macro = f1_score(y_test, y_pred, average='macro')
f1_weighted = f1_score(y_test, y_pred, average='weighted')

print(f"\n   === MÉTRICAS EN TEST SET ===")
print(f"   Accuracy:    {acc:.4f}")
print(f"   F1-macro:    {f1_macro:.4f}")
print(f"   F1-weighted: {f1_weighted:.4f}")

print(f"\n   === REPORTE POR CLASE ===")
print(classification_report(y_test, y_pred, target_names=['Nivel 1', 'Nivel 2', 'Nivel 3']))

# Matriz de confusión
cm = confusion_matrix(y_test, y_pred)
print(f"   === MATRIZ DE CONFUSIÓN ===")
print(f"            Pred 1  Pred 2  Pred 3")
for i, row in enumerate(cm):
    print(f"   Real {i+1}:    {row[0]:4d}    {row[1]:4d}    {row[2]:4d}")

# Evaluar también en registros de media/baja confianza
if len(df_otras) > 0:
    print(f"\n   === EVALUACIÓN EN REGISTROS MEDIA/BAJA CONFIANZA ===")
    X_otras_tfidf = vectorizer.transform(df_otras['causa'].values)
    y_otras_pred = modelo.predict(X_otras_tfidf)
    y_otras_real = df_otras['nivel'].values
    acc_otras = accuracy_score(y_otras_real, y_otras_pred)
    print(f"   Accuracy: {acc_otras:.4f} ({len(df_otras)} registros)")

# Feature importance - top términos por clase
print(f"\n   === TOP TÉRMINOS POR NIVEL ===")
feature_names = vectorizer.get_feature_names_out()
importances = modelo.feature_importances_

# Para cada clase, encontrar términos más predictivos
for nivel in [1, 2, 3]:
    # Obtener índices de muestras de este nivel
    idx_nivel = np.where(y_train == nivel)[0]
    if len(idx_nivel) > 0:
        # Promedio TF-IDF para esta clase
        mean_tfidf = np.asarray(X_train_tfidf[idx_nivel].mean(axis=0)).flatten()
        # Ponderar por importancia
        weighted = mean_tfidf * importances
        top_idx = weighted.argsort()[-5:][::-1]
        top_terms = [feature_names[i] for i in top_idx]
        print(f"   Nivel {nivel}: {', '.join(top_terms)}")

# 6. Guardar artefactos
print("\n[6/6] Guardando artefactos...")

# Modelo y vectorizador
joblib.dump(modelo, MODEL_DIR / "clasificador.joblib")
joblib.dump(vectorizer, MODEL_DIR / "vectorizer.joblib")
print(f"   ✓ Modelo: {MODEL_DIR / 'clasificador.joblib'}")
print(f"   ✓ Vectorizer: {MODEL_DIR / 'vectorizer.joblib'}")

# Métricas en JSON
metrics = {
    'accuracy': float(acc),
    'f1_macro': float(f1_macro),
    'f1_weighted': float(f1_weighted),
    'cv_f1_macro_mean': float(cv_scores.mean()),
    'cv_f1_macro_std': float(cv_scores.std()),
    'train_size': int(len(X_train)),
    'test_size': int(len(X_test)),
    'vocabulary_size': int(len(vectorizer.vocabulary_)),
    'confusion_matrix': cm.tolist(),
    'classification_report': classification_report(y_test, y_pred, output_dict=True)
}

with open(MODEL_DIR / "metrics.json", 'w', encoding='utf-8') as f:
    json.dump(metrics, f, indent=2, ensure_ascii=False)
print(f"   ✓ Métricas: {MODEL_DIR / 'metrics.json'}")

print("\n" + "=" * 80)
print("✓ ENTRENAMIENTO COMPLETADO")
print("=" * 80)
print(f"\nResumen:")
print(f"  - Accuracy: {acc:.2%}")
print(f"  - F1-macro: {f1_macro:.2%}")
print(f"  - Modelo listo para clasificar {9371 - 1500:,} causas restantes")
