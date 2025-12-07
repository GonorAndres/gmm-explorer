'use client'

import {
  BookOpen,
  Database,
  Brain,
  Calculator,
  TrendingUp,
  FileText,
  Activity,
  Stethoscope,
  AlertTriangle,
  CheckCircle2,
  ArrowRight,
  ExternalLink,
  Target,
  Zap,
  Sparkles,
  TreeDeciduous,
  Clock,
  Users,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import {
  UI_LABELS,
  NIVEL_LABELS,
  NIVEL_COLORS,
  NIVEL_DESCRIPCIONES,
} from '@/lib/constants'

/**
 * Página de Metodología
 * Documenta el proceso completo de clasificación y tarificación GMM
 */
export default function MetodologiaPage() {
  return (
    <div className="p-8 max-w-6xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">
          {UI_LABELS.paginas.metodologia.titulo}
        </h1>
        <p className="text-gray-500 mt-1">
          Sistema de Clasificación de Siniestros GMM y Cálculo de Prima de Riesgo
        </p>
      </div>

      {/* Resumen Ejecutivo */}
      <section className="mb-10">
        <div className="card bg-gradient-to-br from-blue-600 to-blue-700 text-white">
          <div className="card-body">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 bg-white/20 rounded-lg flex items-center justify-center flex-shrink-0">
                <BookOpen className="w-6 h-6" />
              </div>
              <div>
                <h2 className="text-xl font-bold mb-2">Resumen Ejecutivo</h2>
                <p className="text-blue-100 leading-relaxed">
                  Este proyecto implementa un sistema de clasificación de siniestros de Gastos Médicos Mayores (GMM)
                  en tres niveles de complejidad, utilizando datos de la CNSF del período 2020-2024.
                  La metodología actuarial aplicada calcula la <strong className="text-white">prima de riesgo</strong> como
                  el producto de <strong className="text-white">frecuencia × severidad</strong>, segmentada por nivel de
                  atención y edad del asegurado.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Flujo del Proceso */}
      <section className="mb-10">
        <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
          <Activity className="w-5 h-5 text-blue-600" />
          Flujo del Proceso
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {[
            {
              paso: 1,
              titulo: 'Consolidación',
              descripcion: 'Unificación de datos de siniestros y pólizas 2020-2024',
              icono: Database,
              color: 'bg-purple-100 text-purple-700',
            },
            {
              paso: 2,
              titulo: 'Clasificación',
              descripcion: 'Etiquetado de causas médicas en 3 niveles de complejidad',
              icono: Brain,
              color: 'bg-blue-100 text-blue-700',
            },
            {
              paso: 3,
              titulo: 'Cálculo Actuarial',
              descripcion: 'Frecuencia × Severidad por nivel y edad',
              icono: Calculator,
              color: 'bg-green-100 text-green-700',
            },
            {
              paso: 4,
              titulo: 'Tarificación',
              descripcion: 'Tabla de primas por nivel y edad (25-70 años)',
              icono: TrendingUp,
              color: 'bg-amber-100 text-amber-700',
            },
          ].map((item, index) => (
            <div key={item.paso} className="relative">
              <div className="card h-full">
                <div className="card-body">
                  <div className={cn('w-10 h-10 rounded-lg flex items-center justify-center mb-3', item.color)}>
                    <item.icono className="w-5 h-5" />
                  </div>
                  <div className="text-xs font-semibold text-gray-400 mb-1">FASE {item.paso}</div>
                  <h3 className="font-semibold text-gray-900 mb-2">{item.titulo}</h3>
                  <p className="text-sm text-gray-600">{item.descripcion}</p>
                </div>
              </div>
              {index < 3 && (
                <div className="hidden md:flex absolute top-1/2 -right-2 transform -translate-y-1/2 z-10">
                  <ArrowRight className="w-4 h-4 text-gray-300" />
                </div>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* ========================================== */}
      {/* EL CORAZÓN DEL PROYECTO: CLASIFICACIÓN */}
      {/* ========================================== */}
      <section className="mb-10">
        <div className="card bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-600 text-white overflow-hidden relative">
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -translate-y-32 translate-x-32" />
          <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/5 rounded-full translate-y-24 -translate-x-24" />
          <div className="card-body relative">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
                <Sparkles className="w-6 h-6" />
              </div>
              <div>
                <h2 className="text-2xl font-bold">El Corazón del Proyecto</h2>
                <p className="text-white/80">Fase 2: Clasificación de Causas Médicas</p>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 text-center">
                <p className="text-3xl font-bold">9,409</p>
                <p className="text-sm text-white/80">Causas médicas únicas</p>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 text-center">
                <ArrowRight className="w-6 h-6 mx-auto text-white/60" />
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 text-center">
                <p className="text-3xl font-bold">3</p>
                <p className="text-sm text-white/80">Niveles de clasificación</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* El Reto: ¿Por qué es difícil clasificar? */}
      <section className="mb-10">
        <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
          <AlertTriangle className="w-5 h-5 text-amber-500" />
          El Reto: ¿Por qué es difícil clasificar?
        </h2>

        <div className="card">
          <div className="card-body">
            <p className="text-gray-600 mb-6">
              Clasificar <strong>9,409 causas médicas únicas</strong> en 3 niveles de complejidad es un desafío
              significativo. Sin formación médica especializada, interpretar términos clínicos, códigos CIE-10
              y abreviaturas resulta prácticamente imposible.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
              <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-center">
                <p className="text-2xl font-bold text-red-600 mb-1">9,409</p>
                <p className="text-sm text-red-700">Causas médicas únicas</p>
              </div>
              <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 text-center">
                <p className="text-2xl font-bold text-amber-600 mb-1">Jerga</p>
                <p className="text-sm text-amber-700">Terminología médica especializada</p>
              </div>
              <div className="bg-orange-50 border border-orange-200 rounded-lg p-4 text-center">
                <p className="text-2xl font-bold text-orange-600 mb-1">Errores</p>
                <p className="text-sm text-orange-700">Abreviaturas y typos</p>
              </div>
              <div className="bg-purple-50 border border-purple-200 rounded-lg p-4 text-center">
                <p className="text-2xl font-bold text-purple-600 mb-1">CIE-10</p>
                <p className="text-sm text-purple-700">Códigos internacionales</p>
              </div>
            </div>

            <div className="bg-gray-50 rounded-lg p-4">
              <h4 className="font-semibold text-gray-900 mb-2">Ejemplos del desafío:</h4>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-sm">
                <div className="bg-white rounded p-3 border">
                  <p className="font-mono text-xs text-gray-500 mb-1">COLECISTECTOMIA LAPAROSCOPICA</p>
                  <p className="text-gray-700">¿Qué es? ¿Es grave?</p>
                </div>
                <div className="bg-white rounded p-3 border">
                  <p className="font-mono text-xs text-gray-500 mb-1">TU MALIGNO DE COLON</p>
                  <p className="text-gray-700">¿Cáncer? ¿Nivel 3?</p>
                </div>
                <div className="bg-white rounded p-3 border">
                  <p className="font-mono text-xs text-gray-500 mb-1">GASTROENT VIRAL NE</p>
                  <p className="text-gray-700">¿Qué significa "NE"?</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Proceso Técnico de Clasificación */}
      <section className="mb-10">
        <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
          <Brain className="w-5 h-5 text-purple-600" />
          Proceso Técnico de Clasificación
        </h2>

        {/* Fase 1: Clasificación Manual */}
        <div className="card mb-6">
          <div className="card-header bg-gradient-to-r from-blue-50 to-indigo-50">
            <h3 className="font-semibold text-gray-900 flex items-center gap-2">
              <Users className="w-5 h-5 text-blue-600" />
              Fase 1: Clasificación Manual con Conocimiento Médico
            </h3>
          </div>
          <div className="card-body">
            <p className="text-gray-600 mb-4">
              La base del modelo es un conjunto de <strong>1,500 causas médicas etiquetadas manualmente</strong>,
              utilizando criterios CIE-10 y conocimiento médico especializado para asignar niveles de complejidad.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              <div className="bg-blue-50 rounded-lg p-4">
                <div className="flex items-center gap-2 mb-2">
                  <Target className="w-5 h-5 text-blue-600" />
                  <span className="font-semibold text-blue-900">Top 500 por frecuencia</span>
                </div>
                <p className="text-sm text-blue-700">
                  Las 500 causas más frecuentes, representando ~85% de todos los siniestros.
                  Prioridad máxima para asegurar cobertura del modelo.
                </p>
              </div>
              <div className="bg-indigo-50 rounded-lg p-4">
                <div className="flex items-center gap-2 mb-2">
                  <Target className="w-5 h-5 text-indigo-600" />
                  <span className="font-semibold text-indigo-900">Muestra aleatoria de 1,000</span>
                </div>
                <p className="text-sm text-indigo-700">
                  1,000 causas adicionales seleccionadas aleatoriamente para asegurar
                  representatividad de casos menos frecuentes.
                </p>
              </div>
            </div>

            {/* Criterios CIE-10 */}
            <div className="bg-gray-50 rounded-lg p-4">
              <h4 className="font-semibold text-gray-900 mb-3">Criterios de Clasificación (CIE-10)</h4>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                <div className="bg-green-50 rounded-lg p-3">
                  <div className="flex items-center gap-2 mb-1">
                    <div className="w-3 h-3 rounded-full bg-green-500" />
                    <span className="font-medium text-green-900 text-sm">Nivel 1 - Ambulatorio</span>
                  </div>
                  <p className="text-xs text-green-700">
                    Z00-Z13 (exámenes), R10-R19 (síntomas GI), consultas, laboratorio
                  </p>
                </div>
                <div className="bg-yellow-50 rounded-lg p-3">
                  <div className="flex items-center gap-2 mb-1">
                    <div className="w-3 h-3 rounded-full bg-yellow-500" />
                    <span className="font-medium text-yellow-900 text-sm">Nivel 2 - Hospitalario</span>
                  </div>
                  <p className="text-xs text-yellow-700">
                    O80-O84 (partos), K80-K87 (vesícula), hospitalizaciones 1-5 días
                  </p>
                </div>
                <div className="bg-red-50 rounded-lg p-3">
                  <div className="flex items-center gap-2 mb-1">
                    <div className="w-3 h-3 rounded-full bg-red-500" />
                    <span className="font-medium text-red-900 text-sm">Nivel 3 - Alta Especialidad</span>
                  </div>
                  <p className="text-xs text-red-700">
                    C00-C97 (oncología), I20-I25 (cardiovascular), UCI, trasplantes
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Fase 2: Random Forest */}
        <div className="card mb-6">
          <div className="card-header bg-gradient-to-r from-green-50 to-emerald-50">
            <h3 className="font-semibold text-gray-900 flex items-center gap-2">
              <TreeDeciduous className="w-5 h-5 text-green-600" />
              Fase 2: Random Forest - Aprendizaje Automático
            </h3>
          </div>
          <div className="card-body">
            <p className="text-gray-600 mb-4">
              Con las 1,500 causas etiquetadas, entrenamos un modelo <strong>Random Forest</strong> que
              aprende los patrones textuales y puede clasificar automáticamente las 7,909 causas restantes.
            </p>

            {/* Explicación intuitiva */}
            <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl p-6 mb-6">
              <h4 className="font-semibold text-green-900 mb-3">¿Cómo funciona? (Explicación intuitiva)</h4>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="text-center">
                  <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-2">
                    <TreeDeciduous className="w-6 h-6 text-green-600" />
                  </div>
                  <p className="font-medium text-green-900">100 "expertos"</p>
                  <p className="text-xs text-green-700 mt-1">
                    El modelo crea 100 árboles de decisión, cada uno un &quot;experto&quot; que aprende reglas diferentes
                  </p>
                </div>
                <div className="text-center">
                  <div className="w-12 h-12 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-2">
                    <Brain className="w-6 h-6 text-emerald-600" />
                  </div>
                  <p className="font-medium text-emerald-900">Votan juntos</p>
                  <p className="text-xs text-emerald-700 mt-1">
                    Para cada causa nueva, todos los árboles &quot;votan&quot; y la clasificación final es la más votada
                  </p>
                </div>
                <div className="text-center">
                  <div className="w-12 h-12 bg-teal-100 rounded-full flex items-center justify-center mx-auto mb-2">
                    <CheckCircle2 className="w-6 h-6 text-teal-600" />
                  </div>
                  <p className="font-medium text-teal-900">Consenso robusto</p>
                  <p className="text-xs text-teal-700 mt-1">
                    El consenso de muchos expertos es más confiable que la opinión de uno solo
                  </p>
                </div>
              </div>
            </div>

            {/* Beneficios del ML */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-purple-50 border border-purple-200 rounded-lg p-4 text-center">
                <Clock className="w-8 h-8 text-purple-600 mx-auto mb-2" />
                <p className="font-semibold text-purple-900">Velocidad</p>
                <p className="text-sm text-purple-700">
                  Clasifica 7,909 causas en <strong>segundos</strong> vs. semanas de trabajo manual
                </p>
              </div>
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 text-center">
                <Zap className="w-8 h-8 text-blue-600 mx-auto mb-2" />
                <p className="font-semibold text-blue-900">Consistencia</p>
                <p className="text-sm text-blue-700">
                  Aplica los mismos criterios a todas las causas, sin fatiga ni variabilidad humana
                </p>
              </div>
              <div className="bg-green-50 border border-green-200 rounded-lg p-4 text-center">
                <TrendingUp className="w-8 h-8 text-green-600 mx-auto mb-2" />
                <p className="font-semibold text-green-900">Escalabilidad</p>
                <p className="text-sm text-green-700">
                  El modelo puede reutilizarse para clasificar nuevas causas en años futuros
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Validación Estadística */}
        <div className="card">
          <div className="card-header">
            <h3 className="font-semibold text-gray-900 flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-amber-500" />
              Resultado: Distribución por Nivel
            </h3>
          </div>
          <div className="card-body">
            <p className="text-sm text-gray-600 mb-4">
              La clasificación final confirma las expectativas actuariales del comportamiento de siniestros:
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-gray-50 rounded-lg p-4 text-center">
                <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-2">
                  <span className="font-bold text-green-700">L1</span>
                </div>
                <p className="font-semibold text-gray-900">Muchos siniestros pequeños</p>
                <p className="text-sm text-gray-500 mt-1">Alta frecuencia, baja severidad</p>
                <p className="text-xs text-green-600 mt-2">~60% de siniestros, ~10% del monto</p>
              </div>
              <div className="bg-gray-50 rounded-lg p-4 text-center">
                <div className="w-10 h-10 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-2">
                  <span className="font-bold text-yellow-700">L2</span>
                </div>
                <p className="font-semibold text-gray-900">Moderados y frecuentes</p>
                <p className="text-sm text-gray-500 mt-1">Frecuencia media, costo medio-alto</p>
                <p className="text-xs text-yellow-600 mt-2">~35% de siniestros, ~83.3% del monto</p>
              </div>
              <div className="bg-gray-50 rounded-lg p-4 text-center">
                <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-2">
                  <span className="font-bold text-red-700">L3</span>
                </div>
                <p className="font-semibold text-gray-900">Pocos siniestros costosos</p>
                <p className="text-sm text-gray-500 mt-1">Baja frecuencia, alta severidad</p>
                <p className="text-xs text-red-600 mt-2">~5% de siniestros, ~6.7% del monto</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Fuente de Datos */}
      <section className="mb-10">
        <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
          <Database className="w-5 h-5 text-blue-600" />
          Fuente de Datos
        </h2>
        <div className="card">
          <div className="card-body">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="font-semibold text-gray-900 mb-3">Comisión Nacional de Seguros y Fianzas (CNSF)</h3>
                <p className="text-sm text-gray-600 mb-4">
                  Los datos utilizados provienen de las bases de información del sector asegurador
                  reportadas a la CNSF, específicamente del ramo de Gastos Médicos Mayores Colectivo.
                </p>
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-sm">
                    <CheckCircle2 className="w-4 h-4 text-green-500" />
                    <span>Período: 2020 - 2024</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <CheckCircle2 className="w-4 h-4 text-green-500" />
                    <span>~1.97 millones de registros de siniestros</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <CheckCircle2 className="w-4 h-4 text-green-500" />
                    <span>+9,400 causas médicas únicas</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <CheckCircle2 className="w-4 h-4 text-green-500" />
                    <span>95+ millones de asegurados expuestos</span>
                  </div>
                </div>
              </div>
              <div className="bg-gray-50 rounded-lg p-4">
                <h4 className="font-medium text-gray-900 mb-3">Variables Utilizadas</h4>
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <div className="bg-white p-2 rounded border">
                    <span className="font-mono text-xs text-blue-600">EDAD</span>
                    <p className="text-gray-600 text-xs">Edad del asegurado</p>
                  </div>
                  <div className="bg-white p-2 rounded border">
                    <span className="font-mono text-xs text-blue-600">SEXO</span>
                    <p className="text-gray-600 text-xs">Género</p>
                  </div>
                  <div className="bg-white p-2 rounded border">
                    <span className="font-mono text-xs text-blue-600">CAUSA</span>
                    <p className="text-gray-600 text-xs">Diagnóstico médico</p>
                  </div>
                  <div className="bg-white p-2 rounded border">
                    <span className="font-mono text-xs text-blue-600">MONTO</span>
                    <p className="text-gray-600 text-xs">Costo del siniestro</p>
                  </div>
                  <div className="bg-white p-2 rounded border">
                    <span className="font-mono text-xs text-blue-600">AÑO</span>
                    <p className="text-gray-600 text-xs">Año de ocurrencia</p>
                  </div>
                  <div className="bg-white p-2 rounded border">
                    <span className="font-mono text-xs text-blue-600">EXPUESTOS</span>
                    <p className="text-gray-600 text-xs">Asegurados en riesgo</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Niveles de Clasificación */}
      <section className="mb-10">
        <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
          <Stethoscope className="w-5 h-5 text-blue-600" />
          Niveles de Clasificación
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            {
              nivel: 1,
              titulo: NIVEL_LABELS[1],
              descripcion: NIVEL_DESCRIPCIONES[1],
              color: NIVEL_COLORS[1],
              caracteristicas: [
                'Alta frecuencia, baja severidad',
                'Consultas médicas generales',
                'Estudios de laboratorio',
                'Procedimientos dentales',
                'Gastroenteritis y padecimientos menores',
              ],
              costoPromedio: '$5,000 - $30,000',
            },
            {
              nivel: 2,
              titulo: NIVEL_LABELS[2],
              descripcion: NIVEL_DESCRIPCIONES[2],
              color: NIVEL_COLORS[2],
              caracteristicas: [
                'Frecuencia media, severidad media-alta',
                'Cesáreas y partos',
                'Colecistectomía (vesícula)',
                'Apendicectomía',
                'Hospitalizaciones ≤5 días',
              ],
              costoPromedio: '$50,000 - $150,000',
            },
            {
              nivel: 3,
              titulo: NIVEL_LABELS[3],
              descripcion: NIVEL_DESCRIPCIONES[3],
              color: NIVEL_COLORS[3],
              caracteristicas: [
                'Baja frecuencia, muy alta severidad',
                'Cáncer y tumores',
                'UCI / Terapia intensiva',
                'Infartos y enfermedades cardiovasculares',
                'Trasplantes',
              ],
              costoPromedio: '$200,000 - $500,000+',
            },
          ].map((nivel) => (
            <div key={nivel.nivel} className="card">
              <div
                className="h-2 rounded-t-lg"
                style={{ backgroundColor: nivel.color }}
              />
              <div className="card-body">
                <div className="flex items-center gap-2 mb-2">
                  <div
                    className="w-8 h-8 rounded-full flex items-center justify-center text-white font-bold text-sm"
                    style={{ backgroundColor: nivel.color }}
                  >
                    {nivel.nivel}
                  </div>
                  <h3 className="font-semibold text-gray-900">{nivel.titulo}</h3>
                </div>
                <p className="text-sm text-gray-600 mb-4">{nivel.descripcion}</p>
                <ul className="space-y-1.5 mb-4">
                  {nivel.caracteristicas.map((carac, i) => (
                    <li key={i} className="text-xs text-gray-600 flex items-start gap-2">
                      <CheckCircle2 className="w-3.5 h-3.5 mt-0.5 flex-shrink-0" style={{ color: nivel.color }} />
                      <span>{carac}</span>
                    </li>
                  ))}
                </ul>
                <div className="bg-gray-50 rounded-lg p-3 text-center">
                  <span className="text-xs text-gray-500">Costo promedio</span>
                  <p className="font-semibold text-gray-900">{nivel.costoPromedio}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Metodología Actuarial */}
      <section className="mb-10">
        <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
          <Calculator className="w-5 h-5 text-blue-600" />
          Metodología Actuarial
        </h2>
        <div className="card">
          <div className="card-body">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Fórmula principal */}
              <div>
                <h3 className="font-semibold text-gray-900 mb-4">Fórmula Fundamental</h3>
                <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-6 text-center mb-4">
                  <p className="text-lg font-mono text-gray-600 mb-2">Prima de Riesgo =</p>
                  <p className="text-2xl font-bold text-blue-700">
                    Frecuencia × Severidad
                  </p>
                </div>
                <div className="space-y-3">
                  <div className="bg-gray-50 rounded-lg p-4">
                    <div className="flex items-center gap-2 mb-1">
                      <div className="w-6 h-6 bg-blue-100 rounded flex items-center justify-center">
                        <span className="text-xs font-bold text-blue-700">f</span>
                      </div>
                      <span className="font-medium text-gray-900">Frecuencia (Morbilidad)</span>
                    </div>
                    <p className="text-sm text-gray-600 ml-8">
                      Probabilidad de siniestro = Número de siniestros / Asegurados expuestos
                    </p>
                  </div>
                  <div className="bg-gray-50 rounded-lg p-4">
                    <div className="flex items-center gap-2 mb-1">
                      <div className="w-6 h-6 bg-green-100 rounded flex items-center justify-center">
                        <span className="text-xs font-bold text-green-700">S</span>
                      </div>
                      <span className="font-medium text-gray-900">Severidad (Costo Medio)</span>
                    </div>
                    <p className="text-sm text-gray-600 ml-8">
                      Costo promedio por siniestro = Monto total / Número de siniestros
                    </p>
                  </div>
                </div>
              </div>

              {/* Cálculo por nivel */}
              <div>
                <h3 className="font-semibold text-gray-900 mb-4">Cálculo por Nivel y Edad</h3>
                <div className="bg-gray-900 rounded-xl p-6 font-mono text-sm">
                  <div className="text-gray-400 mb-3"># Para cada nivel i y edad x:</div>
                  <div className="space-y-2 text-green-400">
                    <p>frecuencia<sub>i,x</sub> = siniestros<sub>i,x</sub> / expuestos<sub>x</sub></p>
                    <p>severidad<sub>i,x</sub> = monto_total<sub>i,x</sub> / siniestros<sub>i,x</sub></p>
                    <p className="text-yellow-400 pt-2 border-t border-gray-700">
                      prima<sub>i,x</sub> = frecuencia<sub>i,x</sub> × severidad<sub>i,x</sub>
                    </p>
                  </div>
                  <div className="mt-4 pt-4 border-t border-gray-700 text-gray-400">
                    <p># Prima total por edad:</p>
                    <p className="text-blue-400">prima_total<sub>x</sub> = Σ prima<sub>i,x</sub></p>
                  </div>
                </div>
                <p className="text-xs text-gray-500 mt-3">
                  * Se calcula para cada edad individual de 25 a 70 años
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Marco Regulatorio */}
      <section className="mb-10">
        <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
          <FileText className="w-5 h-5 text-blue-600" />
          Marco Regulatorio
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="card">
            <div className="card-body">
              <h3 className="font-semibold text-gray-900 mb-3">LISF - Ley de Instituciones de Seguros y Fianzas</h3>
              <p className="text-sm text-gray-600 mb-4">
                Marco legal principal que regula la actividad aseguradora en México.
                El Artículo 201 establece los requisitos de la Nota Técnica.
              </p>
              <div className="bg-amber-50 border border-amber-200 rounded-lg p-3">
                <div className="flex gap-2">
                  <AlertTriangle className="w-4 h-4 text-amber-600 flex-shrink-0 mt-0.5" />
                  <p className="text-xs text-amber-800">
                    Los productos de seguros requieren nota técnica con justificación actuarial
                    de la suficiencia de primas.
                  </p>
                </div>
              </div>
            </div>
          </div>
          <div className="card">
            <div className="card-body">
              <h3 className="font-semibold text-gray-900 mb-3">CUSF - Circular Única de Seguros y Fianzas</h3>
              <p className="text-sm text-gray-600 mb-4">
                Disposiciones derivadas de la LISF. Regula específicamente los seguros de
                salud en los Capítulos 15.3 al 15.8.
              </p>
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                <div className="flex gap-2">
                  <CheckCircle2 className="w-4 h-4 text-blue-600 flex-shrink-0 mt-0.5" />
                  <p className="text-xs text-blue-800">
                    Las tarifas deben basarse en edad alcanzada (no por quinquenio).
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Nota sobre Prima de Tarifa */}
      <section className="mb-10">
        <div className="card bg-amber-50 border-amber-200">
          <div className="card-body">
            <div className="flex gap-4">
              <div className="w-10 h-10 bg-amber-100 rounded-lg flex items-center justify-center flex-shrink-0">
                <AlertTriangle className="w-5 h-5 text-amber-600" />
              </div>
              <div>
                <h3 className="font-semibold text-amber-900 mb-2">Nota Importante: Prima de Riesgo vs Prima de Tarifa</h3>
                <p className="text-sm text-amber-800 mb-3">
                  Este sistema calcula la <strong>prima pura de riesgo</strong>, que representa únicamente el costo
                  esperado de siniestros. La prima de tarifa comercial incluye recargos adicionales:
                </p>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  {[
                    { concepto: 'Gastos de administración', rango: '8% - 15%' },
                    { concepto: 'Gastos de adquisición', rango: '15% - 25%' },
                    { concepto: 'Margen de utilidad', rango: '5% - 10%' },
                    { concepto: 'Recargo de seguridad', rango: '3% - 8%' },
                  ].map((item) => (
                    <div key={item.concepto} className="bg-white rounded-lg p-2 text-center">
                      <p className="text-xs text-amber-700 mb-1">{item.concepto}</p>
                      <p className="text-sm font-semibold text-amber-900">{item.rango}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Referencias */}
      <section>
        <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
          <ExternalLink className="w-5 h-5 text-blue-600" />
          Referencias
        </h2>
        <div className="card">
          <div className="card-body">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {[
                {
                  titulo: 'CNSF - Circular Única de Seguros y Fianzas',
                  url: 'https://lisfcusf.cnsf.gob.mx/',
                },
                {
                  titulo: 'AMIS - Nota técnica referencial GMM',
                  url: 'https://www.gob.mx/cms/uploads/attachment/file/81303/Nota_t_cnica_GMM_ind_AMIS.pdf',
                },
                {
                  titulo: 'CONDUSEF - Simulador de GMM',
                  url: 'https://phpapps.condusef.gob.mx/condusef_gastosmedicosGMM/',
                },
                {
                  titulo: 'CNSF - Estadísticas del sector',
                  url: 'https://www.cnsf.gob.mx',
                },
              ].map((ref) => (
                <a
                  key={ref.titulo}
                  href={ref.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors group"
                >
                  <div className="w-8 h-8 bg-blue-100 rounded flex items-center justify-center group-hover:bg-blue-200 transition-colors">
                    <ExternalLink className="w-4 h-4 text-blue-600" />
                  </div>
                  <span className="text-sm text-gray-700 group-hover:text-blue-600 transition-colors">
                    {ref.titulo}
                  </span>
                </a>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <div className="mt-10 pt-6 border-t border-gray-200 text-center text-sm text-gray-500">
        <p>Sistema de Clasificación y Tarificación GMM • Datos CNSF 2020-2024</p>
        <p className="mt-1">Proyecto Actuarial - AAR 2026-01</p>
      </div>
    </div>
  )
}
