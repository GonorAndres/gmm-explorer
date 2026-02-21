'use client'

import { useState, useMemo } from 'react'
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
  Users,
  Search,
  XCircle,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { PageHeader } from '@/components/ui/page-header'
import { InsightPanel } from '@/components/ui/insight-panel'
import { ClaudeBadge } from '@/components/ui/claude-badge'
import { CALLOUTS, CLAUDE_CONTENT, INSIGHT_PANELS_CLAUDE } from '@/lib/content'
import {
  NIVEL_LABELS,
  NIVEL_COLORS,
  NIVEL_DESCRIPCIONES,
} from '@/lib/constants'
import type { ExplicacionCausa, ClasificacionMetadata } from '@/types'

// Datos estaticos de clasificacion
import clasificacionMeta from '@/data/clasificacion-metadata.json'
import explicacionesData from '@/data/explicaciones-causas.json'

const metadata = clasificacionMeta as ClasificacionMetadata
const explicacionesCausas = explicacionesData as ExplicacionCausa[]

/**
 * Pagina de Metodologia
 * Documenta el proceso completo de clasificacion y tarificacion GMM
 * Incluye showcase de mejora con Claude y Explorador de Causas
 */
export default function MetodologiaPage() {
  return (
    <div className="p-8 max-w-6xl mx-auto">
      {/* Header */}
      <PageHeader
        titulo="Metodologia"
        subtitulo="Sistema de Clasificacion de Siniestros GMM y Calculo de Prima de Riesgo"
        icono={BookOpen}
      />

      {/* Resumen Ejecutivo */}
      <section className="mb-10">
        <div className="card bg-gradient-to-br from-slate-800 to-slate-900 text-white">
          <div className="card-body">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 bg-white/20 rounded-lg flex items-center justify-center flex-shrink-0">
                <BookOpen className="w-6 h-6" />
              </div>
              <div>
                <h2 className="text-xl font-bold mb-2">Resumen Ejecutivo</h2>
                <p className="text-slate-300 leading-relaxed">
                  Este proyecto implementa un sistema de clasificacion de siniestros de Gastos Medicos Mayores (GMM)
                  en tres niveles de complejidad, utilizando datos de la CNSF del periodo 2020-2024.
                  La metodologia actuarial aplicada calcula la <strong className="text-white">prima de riesgo</strong> como
                  el producto de <strong className="text-white">frecuencia x severidad</strong>, segmentada por nivel de
                  atencion y edad del asegurado.
                </p>
                <div className="mt-3">
                  <ClaudeBadge variante="compact" className="text-amber-300" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Flujo del Proceso */}
      <section className="mb-10">
        <h2 className="text-xl font-bold text-slate-900 mb-4 flex items-center gap-2">
          <Activity className="w-5 h-5 text-blue-600" />
          Flujo del Proceso
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {[
            { paso: 1, titulo: 'Consolidacion', descripcion: 'Unificacion de datos de siniestros y polizas 2020-2024', icono: Database, color: 'bg-purple-100 text-purple-700' },
            { paso: 2, titulo: 'Clasificacion', descripcion: 'Causas medicas clasificadas con Claude AI en 3 niveles', icono: Brain, color: 'bg-amber-100 text-amber-700' },
            { paso: 3, titulo: 'Calculo Actuarial', descripcion: 'Frecuencia x Severidad por nivel y edad', icono: Calculator, color: 'bg-green-100 text-green-700' },
            { paso: 4, titulo: 'Tarificacion', descripcion: 'Tabla de primas por nivel y edad (25-70 anos)', icono: TrendingUp, color: 'bg-blue-100 text-blue-700' },
          ].map((item, index) => (
            <div key={item.paso} className="relative">
              <div className="card h-full">
                <div className="card-body">
                  <div className={cn('w-10 h-10 rounded-lg flex items-center justify-center mb-3', item.color)}>
                    <item.icono className="w-5 h-5" />
                  </div>
                  <div className="text-xs font-semibold text-slate-400 mb-1">FASE {item.paso}</div>
                  <h3 className="font-semibold text-slate-900 mb-2">{item.titulo}</h3>
                  <p className="text-sm text-slate-600">{item.descripcion}</p>
                </div>
              </div>
              {index < 3 && (
                <div className="hidden md:flex absolute top-1/2 -right-2 transform -translate-y-1/2 z-10">
                  <ArrowRight className="w-4 h-4 text-slate-300" />
                </div>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* InsightPanel #1 */}
      <section className="mb-10">
        <InsightPanel titulo="Sabias que...? Concentracion de costos en Nivel 3">
          <p>{CALLOUTS.sabiasQue[0]}</p>
        </InsightPanel>
      </section>

      {/* El Corazon del Proyecto */}
      <section className="mb-10">
        <div className="card bg-gradient-to-br from-blue-800 via-blue-700 to-blue-600 text-white overflow-hidden relative">
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -translate-y-32 translate-x-32" />
          <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/5 rounded-full translate-y-24 -translate-x-24" />
          <div className="card-body relative">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
                <Sparkles className="w-6 h-6" />
              </div>
              <div>
                <h2 className="text-2xl font-bold">El Corazon del Proyecto</h2>
                <p className="text-white/80">Fase 2: Clasificacion de Causas Medicas con Claude AI</p>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 text-center">
                <p className="text-3xl font-bold">9,409</p>
                <p className="text-sm text-white/80">Causas medicas unicas</p>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 text-center">
                <ArrowRight className="w-6 h-6 mx-auto text-white/60" />
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 text-center">
                <p className="text-3xl font-bold">3</p>
                <p className="text-sm text-white/80">Niveles de clasificacion</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* El Reto */}
      <section className="mb-10">
        <h2 className="text-xl font-bold text-slate-900 mb-4 flex items-center gap-2">
          <AlertTriangle className="w-5 h-5 text-amber-500" />
          El Reto: Por que es dificil clasificar?
        </h2>
        <div className="card">
          <div className="card-body">
            <p className="text-slate-600 mb-6">
              Clasificar <strong>9,409 causas medicas unicas</strong> en 3 niveles de complejidad es un desafio
              significativo. Sin formacion medica especializada, interpretar terminos clinicos, codigos CIE-10
              y abreviaturas resulta practicamente imposible.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
              <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-center">
                <p className="text-2xl font-bold text-red-600 mb-1">9,409</p>
                <p className="text-sm text-red-700">Causas medicas unicas</p>
              </div>
              <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 text-center">
                <p className="text-2xl font-bold text-amber-600 mb-1">Jerga</p>
                <p className="text-sm text-amber-700">Terminologia medica especializada</p>
              </div>
              <div className="bg-orange-50 border border-orange-200 rounded-lg p-4 text-center">
                <p className="text-2xl font-bold text-orange-600 mb-1">Errores</p>
                <p className="text-sm text-orange-700">Abreviaturas y typos</p>
              </div>
              <div className="bg-purple-50 border border-purple-200 rounded-lg p-4 text-center">
                <p className="text-2xl font-bold text-purple-600 mb-1">CIE-10</p>
                <p className="text-sm text-purple-700">Codigos internacionales</p>
              </div>
            </div>
            <div className="bg-slate-50 rounded-lg p-4">
              <h4 className="font-semibold text-slate-900 mb-2">Ejemplos del desafio:</h4>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-sm">
                <div className="bg-white rounded p-3 border">
                  <p className="font-mono text-xs text-slate-500 mb-1">COLECISTECTOMIA LAPAROSCOPICA</p>
                  <p className="text-slate-700">Que es? Es grave?</p>
                </div>
                <div className="bg-white rounded p-3 border">
                  <p className="font-mono text-xs text-slate-500 mb-1">TU MALIGNO DE COLON</p>
                  <p className="text-slate-700">Cancer? Nivel 3?</p>
                </div>
                <div className="bg-white rounded p-3 border">
                  <p className="font-mono text-xs text-slate-500 mb-1">GASTROENT VIRAL NE</p>
                  <p className="text-slate-700">Que significa &quot;NE&quot;?</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Proceso Tecnico de Clasificacion */}
      <section className="mb-10">
        <h2 className="text-xl font-bold text-slate-900 mb-4 flex items-center gap-2">
          <Brain className="w-5 h-5 text-purple-600" />
          Proceso Tecnico de Clasificacion
        </h2>

        {/* Fase 1: Clasificacion Manual */}
        <div className="card mb-6">
          <div className="card-header bg-gradient-to-r from-blue-50 to-indigo-50">
            <h3 className="font-semibold text-slate-900 flex items-center gap-2">
              <Users className="w-5 h-5 text-blue-600" />
              Fase 1: Clasificacion Manual con Conocimiento Medico
            </h3>
          </div>
          <div className="card-body">
            <p className="text-slate-600 mb-4">
              La base del modelo es un conjunto de <strong>1,500 causas medicas etiquetadas manualmente</strong>,
              utilizando criterios CIE-10 y conocimiento medico especializado para asignar niveles de complejidad.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              <div className="bg-blue-50 rounded-lg p-4">
                <div className="flex items-center gap-2 mb-2">
                  <Target className="w-5 h-5 text-blue-600" />
                  <span className="font-semibold text-blue-900">Top 500 por frecuencia</span>
                </div>
                <p className="text-sm text-blue-700">
                  Las 500 causas mas frecuentes, representando ~85% de todos los siniestros.
                </p>
              </div>
              <div className="bg-indigo-50 rounded-lg p-4">
                <div className="flex items-center gap-2 mb-2">
                  <Target className="w-5 h-5 text-indigo-600" />
                  <span className="font-semibold text-indigo-900">Muestra aleatoria de 1,000</span>
                </div>
                <p className="text-sm text-indigo-700">
                  1,000 causas adicionales seleccionadas aleatoriamente para representatividad.
                </p>
              </div>
            </div>
            {/* Criterios CIE-10 */}
            <div className="bg-slate-50 rounded-lg p-4">
              <h4 className="font-semibold text-slate-900 mb-3">Criterios de Clasificacion (CIE-10)</h4>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                <div className="bg-green-50 rounded-lg p-3">
                  <div className="flex items-center gap-2 mb-1">
                    <div className="w-3 h-3 rounded-full bg-green-500" />
                    <span className="font-medium text-green-900 text-sm">Nivel 1 - Ambulatorio</span>
                  </div>
                  <p className="text-xs text-green-700">Z00-Z13 (examenes), R10-R19 (sintomas GI), consultas, laboratorio</p>
                </div>
                <div className="bg-yellow-50 rounded-lg p-3">
                  <div className="flex items-center gap-2 mb-1">
                    <div className="w-3 h-3 rounded-full bg-yellow-500" />
                    <span className="font-medium text-yellow-900 text-sm">Nivel 2 - Hospitalario</span>
                  </div>
                  <p className="text-xs text-yellow-700">O80-O84 (partos), K80-K87 (vesicula), hospitalizaciones 1-5 dias</p>
                </div>
                <div className="bg-red-50 rounded-lg p-3">
                  <div className="flex items-center gap-2 mb-1">
                    <div className="w-3 h-3 rounded-full bg-red-500" />
                    <span className="font-medium text-red-900 text-sm">Nivel 3 - Alta Especialidad</span>
                  </div>
                  <p className="text-xs text-red-700">C00-C97 (oncologia), I20-I25 (cardiovascular), UCI, trasplantes</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Fase 2: El Problema con ML Tradicional */}
        <div className="card mb-6 border-red-200">
          <div className="card-header bg-gradient-to-r from-red-50 to-orange-50">
            <h3 className="font-semibold text-slate-900 flex items-center gap-2">
              <XCircle className="w-5 h-5 text-red-500" />
              El Problema: Random Forest (ML Tradicional)
            </h3>
          </div>
          <div className="card-body">
            <p className="text-slate-600 mb-4">
              {CLAUDE_CONTENT.problemaML.contenido}
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
              <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-center">
                <p className="text-3xl font-bold text-red-600">{Math.round(metadata.rf_accuracy)}%</p>
                <p className="text-sm text-red-700">Precision del modelo</p>
              </div>
              <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-center">
                <p className="text-3xl font-bold text-red-600">{Math.round(metadata.rf_low_confidence_pct)}%</p>
                <p className="text-sm text-red-700">Causas con baja confianza</p>
              </div>
              <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-center">
                <p className="text-3xl font-bold text-red-600">F1: {metadata.rf_f1_macro.toFixed(1)}%</p>
                <p className="text-sm text-red-700">F1-macro (promedio)</p>
              </div>
            </div>
            <div className="bg-red-50 rounded-lg p-4">
              <div className="flex gap-2">
                <AlertTriangle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm text-red-800 font-medium mb-1">Impacto en primas:</p>
                  <p className="text-sm text-red-700">
                    Con solo 59% de precision, el 41% de las causas podian estar mal clasificadas.
                    Esto distorsiona directamente el calculo de primas por nivel, afectando la suficiencia actuarial.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Fase 2b: La Solucion -- Claude */}
        <div className="card mb-6 border-amber-200">
          <div className="card-header bg-gradient-to-r from-amber-50 to-orange-50">
            <h3 className="font-semibold text-slate-900 flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-amber-600" />
              La Solucion: Claude AI
              <ClaudeBadge variante="inline" />
            </h3>
          </div>
          <div className="card-body">
            <p className="text-slate-600 mb-4">
              {CLAUDE_CONTENT.solucionClaude.contenido}
            </p>
            <div className="bg-gradient-to-r from-amber-50 to-orange-50 rounded-xl p-6 mb-6">
              <h4 className="font-semibold text-amber-900 mb-3">Como funciona Claude vs Random Forest?</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="text-center">
                  <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-2">
                    <TreeDeciduous className="w-6 h-6 text-red-600" />
                  </div>
                  <p className="font-medium text-red-900 mb-1">Random Forest</p>
                  <p className="text-xs text-red-700">Aprende patrones estadisticos de texto de 1,500 ejemplos. No entiende medicina.</p>
                </div>
                <div className="text-center">
                  <div className="w-12 h-12 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-2">
                    <Brain className="w-6 h-6 text-amber-600" />
                  </div>
                  <p className="font-medium text-amber-900 mb-1">Claude (LLM)</p>
                  <p className="text-xs text-amber-700">Comprende terminologia medica, codigos CIE-10 y razona sobre severidad clinica.</p>
                </div>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 text-center">
                <Brain className="w-8 h-8 text-amber-600 mx-auto mb-2" />
                <p className="font-semibold text-amber-900">Conocimiento Medico</p>
                <p className="text-sm text-amber-700">Entiende que &quot;COLECISTECTOMIA&quot; = cirugia de vesicula</p>
              </div>
              <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 text-center">
                <Zap className="w-8 h-8 text-amber-600 mx-auto mb-2" />
                <p className="font-semibold text-amber-900">Sin Entrenamiento</p>
                <p className="text-sm text-amber-700">No requiere datos de entrenamiento adicionales</p>
              </div>
              <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 text-center">
                <CheckCircle2 className="w-8 h-8 text-amber-600 mx-auto mb-2" />
                <p className="font-semibold text-amber-900">Alta Confianza</p>
                <p className="text-sm text-amber-700">Solo {Math.round(metadata.claude_low_confidence_pct)}% de causas con baja confianza</p>
              </div>
            </div>
          </div>
        </div>

        {/* Resultados: Antes vs Despues */}
        <div className="card mb-6">
          <div className="card-header bg-gradient-to-r from-green-50 to-emerald-50">
            <h3 className="font-semibold text-slate-900 flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-green-600" />
              Resultados: Antes vs Despues
            </h3>
          </div>
          <div className="card-body">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              {/* Antes */}
              <div className="bg-red-50 rounded-xl p-6 border border-red-200">
                <div className="flex items-center gap-2 mb-4">
                  <div className="w-8 h-8 bg-red-100 rounded-full flex items-center justify-center">
                    <XCircle className="w-5 h-5 text-red-600" />
                  </div>
                  <h4 className="font-semibold text-red-900">Antes (Random Forest)</h4>
                </div>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-red-700">Precision</span>
                    <span className="font-bold text-red-600">{Math.round(metadata.rf_accuracy)}%</span>
                  </div>
                  <div className="w-full bg-red-200 rounded-full h-2">
                    <div className="bg-red-500 h-2 rounded-full" style={{ width: `${metadata.rf_accuracy}%` }} />
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-red-700">Causas baja confianza</span>
                    <span className="font-bold text-red-600">{Math.round(metadata.rf_low_confidence_pct)}%</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-red-700">F1-macro</span>
                    <span className="font-bold text-red-600">{metadata.rf_f1_macro.toFixed(1)}%</span>
                  </div>
                </div>
              </div>
              {/* Despues */}
              <div className="bg-green-50 rounded-xl p-6 border border-green-200">
                <div className="flex items-center gap-2 mb-4">
                  <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                    <CheckCircle2 className="w-5 h-5 text-green-600" />
                  </div>
                  <h4 className="font-semibold text-green-900">Despues (Claude AI)</h4>
                </div>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-green-700">Precision</span>
                    <span className="font-bold text-green-600">{Math.round(metadata.claude_accuracy)}%</span>
                  </div>
                  <div className="w-full bg-green-200 rounded-full h-2">
                    <div className="bg-green-500 h-2 rounded-full" style={{ width: `${metadata.claude_accuracy}%` }} />
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-green-700">Causas baja confianza</span>
                    <span className="font-bold text-green-600">{Math.round(metadata.claude_low_confidence_pct)}%</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-green-700">Confianza promedio</span>
                    <span className="font-bold text-green-600">{Math.round(metadata.claude_avg_confidence)}%</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Ejemplos de Correcciones */}
            {metadata.ejemplos_correccion && metadata.ejemplos_correccion.length > 0 && (
              <div className="bg-slate-50 rounded-lg p-4">
                <h4 className="font-semibold text-slate-900 mb-3">Ejemplos de Correcciones</h4>
                <div className="space-y-3">
                  {metadata.ejemplos_correccion.map((ej, i) => (
                    <div key={i} className="bg-white rounded-lg p-3 border">
                      <p className="font-mono text-xs text-slate-500 mb-2">{ej.causa}</p>
                      <div className="flex items-center gap-3 text-sm">
                        <span className="px-2 py-0.5 rounded text-xs font-medium" style={{
                          backgroundColor: `${NIVEL_COLORS[ej.nivel_rf]}20`,
                          color: NIVEL_COLORS[ej.nivel_rf]
                        }}>
                          RF: L{ej.nivel_rf}
                        </span>
                        <ArrowRight className="w-4 h-4 text-slate-400" />
                        <span className="px-2 py-0.5 rounded text-xs font-medium" style={{
                          backgroundColor: `${NIVEL_COLORS[ej.nivel_claude]}20`,
                          color: NIVEL_COLORS[ej.nivel_claude]
                        }}>
                          Claude: L{ej.nivel_claude}
                        </span>
                      </div>
                      <p className="text-xs text-slate-600 mt-1">{ej.justificacion}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* InsightPanel -- Por que un LLM supera al RF */}
        <div className="mb-6">
          <InsightPanel titulo={INSIGHT_PANELS_CLAUDE.porqueLLM.titulo}>
            <p>{INSIGHT_PANELS_CLAUDE.porqueLLM.contenido}</p>
          </InsightPanel>
        </div>

        {/* Resultado: Distribucion por Nivel */}
        <div className="card">
          <div className="card-header">
            <h3 className="font-semibold text-slate-900 flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-amber-500" />
              Resultado: Distribucion por Nivel
            </h3>
          </div>
          <div className="card-body">
            <p className="text-sm text-slate-600 mb-4">
              La clasificacion con Claude confirma las expectativas actuariales del comportamiento de siniestros:
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {[
                { label: 'L1', nombre: 'Muchos siniestros pequenos', sub: 'Alta frecuencia, baja severidad', stat: '~60% de siniestros, ~10% del monto', bg: 'bg-green-100', text: 'text-green-700', statColor: 'text-green-600' },
                { label: 'L2', nombre: 'Moderados y frecuentes', sub: 'Frecuencia media, costo medio-alto', stat: '~35% de siniestros, ~83.3% del monto', bg: 'bg-yellow-100', text: 'text-yellow-700', statColor: 'text-yellow-600' },
                { label: 'L3', nombre: 'Pocos siniestros costosos', sub: 'Baja frecuencia, alta severidad', stat: '~5% de siniestros, ~6.7% del monto', bg: 'bg-red-100', text: 'text-red-700', statColor: 'text-red-600' },
              ].map((item) => (
                <div key={item.label} className="bg-slate-50 rounded-lg p-4 text-center">
                  <div className={cn('w-10 h-10 rounded-full flex items-center justify-center mx-auto mb-2', item.bg)}>
                    <span className={cn('font-bold', item.text)}>{item.label}</span>
                  </div>
                  <p className="font-semibold text-slate-900">{item.nombre}</p>
                  <p className="text-sm text-slate-500 mt-1">{item.sub}</p>
                  <p className={cn('text-xs mt-2', item.statColor)}>{item.stat}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Explorador de Causas */}
      {explicacionesCausas.length > 0 && (
        <section className="mb-10">
          <ExploradorCausas causas={explicacionesCausas} />
        </section>
      )}

      {/* Fuente de Datos */}
      <section className="mb-10">
        <h2 className="text-xl font-bold text-slate-900 mb-4 flex items-center gap-2">
          <Database className="w-5 h-5 text-blue-600" />
          Fuente de Datos
        </h2>
        <div className="card">
          <div className="card-body">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="font-semibold text-slate-900 mb-3">Comision Nacional de Seguros y Fianzas (CNSF)</h3>
                <p className="text-sm text-slate-600 mb-4">
                  Los datos provienen de las bases del sector asegurador reportadas a la CNSF,
                  del ramo de Gastos Medicos Mayores Colectivo.
                </p>
                <div className="space-y-2">
                  {['Periodo: 2020 - 2024', '~1.97 millones de registros de siniestros', '+9,400 causas medicas unicas', '95+ millones de asegurados expuestos'].map((text) => (
                    <div key={text} className="flex items-center gap-2 text-sm">
                      <CheckCircle2 className="w-4 h-4 text-green-500" />
                      <span>{text}</span>
                    </div>
                  ))}
                </div>
              </div>
              <div className="bg-slate-50 rounded-lg p-4">
                <h4 className="font-medium text-slate-900 mb-3">Variables Utilizadas</h4>
                <div className="grid grid-cols-2 gap-2 text-sm">
                  {[
                    { var: 'EDAD', desc: 'Edad del asegurado' },
                    { var: 'SEXO', desc: 'Genero' },
                    { var: 'CAUSA', desc: 'Diagnostico medico' },
                    { var: 'MONTO', desc: 'Costo del siniestro' },
                    { var: 'ANO', desc: 'Ano de ocurrencia' },
                    { var: 'EXPUESTOS', desc: 'Asegurados en riesgo' },
                  ].map((v) => (
                    <div key={v.var} className="bg-white p-2 rounded border">
                      <span className="font-mono text-xs text-blue-600">{v.var}</span>
                      <p className="text-slate-600 text-xs">{v.desc}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Niveles de Clasificacion */}
      <section className="mb-10">
        <h2 className="text-xl font-bold text-slate-900 mb-4 flex items-center gap-2">
          <Stethoscope className="w-5 h-5 text-blue-600" />
          Niveles de Clasificacion
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            {
              nivel: 1, titulo: NIVEL_LABELS[1], descripcion: NIVEL_DESCRIPCIONES[1], color: NIVEL_COLORS[1],
              caracteristicas: ['Alta frecuencia, baja severidad', 'Consultas medicas generales', 'Estudios de laboratorio', 'Procedimientos dentales', 'Gastroenteritis y padecimientos menores'],
              costoPromedio: '$5,000 - $30,000',
            },
            {
              nivel: 2, titulo: NIVEL_LABELS[2], descripcion: NIVEL_DESCRIPCIONES[2], color: NIVEL_COLORS[2],
              caracteristicas: ['Frecuencia media, severidad media-alta', 'Cesareas y partos', 'Colecistectomia (vesicula)', 'Apendicectomia', 'Hospitalizaciones <=5 dias'],
              costoPromedio: '$50,000 - $150,000',
            },
            {
              nivel: 3, titulo: NIVEL_LABELS[3], descripcion: NIVEL_DESCRIPCIONES[3], color: NIVEL_COLORS[3],
              caracteristicas: ['Baja frecuencia, muy alta severidad', 'Cancer y tumores', 'UCI / Terapia intensiva', 'Infartos y enfermedades cardiovasculares', 'Trasplantes'],
              costoPromedio: '$200,000 - $500,000+',
            },
          ].map((nivel) => (
            <div key={nivel.nivel} className="card">
              <div className="h-2 rounded-t-lg" style={{ backgroundColor: nivel.color }} />
              <div className="card-body">
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-8 h-8 rounded-full flex items-center justify-center text-white font-bold text-sm" style={{ backgroundColor: nivel.color }}>
                    {nivel.nivel}
                  </div>
                  <h3 className="font-semibold text-slate-900">{nivel.titulo}</h3>
                </div>
                <p className="text-sm text-slate-600 mb-4">{nivel.descripcion}</p>
                <ul className="space-y-1.5 mb-4">
                  {nivel.caracteristicas.map((carac, i) => (
                    <li key={i} className="text-xs text-slate-600 flex items-start gap-2">
                      <CheckCircle2 className="w-3.5 h-3.5 mt-0.5 flex-shrink-0" style={{ color: nivel.color }} />
                      <span>{carac}</span>
                    </li>
                  ))}
                </ul>
                <div className="bg-slate-50 rounded-lg p-3 text-center">
                  <span className="text-xs text-slate-500">Costo promedio</span>
                  <p className="font-semibold text-slate-900">{nivel.costoPromedio}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Metodologia Actuarial */}
      <section className="mb-10">
        <h2 className="text-xl font-bold text-slate-900 mb-4 flex items-center gap-2">
          <Calculator className="w-5 h-5 text-blue-600" />
          Metodologia Actuarial
        </h2>
        <div className="card">
          <div className="card-body">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div>
                <h3 className="font-semibold text-slate-900 mb-4">Formula Fundamental</h3>
                <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-6 text-center mb-4">
                  <p className="text-lg font-mono text-slate-600 mb-2">Prima de Riesgo =</p>
                  <p className="text-2xl font-bold text-blue-700">Frecuencia x Severidad</p>
                </div>
                <div className="space-y-3">
                  <div className="bg-slate-50 rounded-lg p-4">
                    <div className="flex items-center gap-2 mb-1">
                      <div className="w-6 h-6 bg-blue-100 rounded flex items-center justify-center">
                        <span className="text-xs font-bold text-blue-700">f</span>
                      </div>
                      <span className="font-medium text-slate-900">Frecuencia (Morbilidad)</span>
                    </div>
                    <p className="text-sm text-slate-600 ml-8">Numero de siniestros / Asegurados expuestos</p>
                  </div>
                  <div className="bg-slate-50 rounded-lg p-4">
                    <div className="flex items-center gap-2 mb-1">
                      <div className="w-6 h-6 bg-green-100 rounded flex items-center justify-center">
                        <span className="text-xs font-bold text-green-700">S</span>
                      </div>
                      <span className="font-medium text-slate-900">Severidad (Costo Medio)</span>
                    </div>
                    <p className="text-sm text-slate-600 ml-8">Monto total / Numero de siniestros</p>
                  </div>
                </div>
              </div>
              <div>
                <h3 className="font-semibold text-slate-900 mb-4">Calculo por Nivel y Edad</h3>
                <div className="bg-slate-900 rounded-xl p-6 font-mono text-sm">
                  <div className="text-slate-400 mb-3"># Para cada nivel i y edad x:</div>
                  <div className="space-y-2 text-green-400">
                    <p>frecuencia<sub>i,x</sub> = siniestros<sub>i,x</sub> / expuestos<sub>x</sub></p>
                    <p>severidad<sub>i,x</sub> = monto_total<sub>i,x</sub> / siniestros<sub>i,x</sub></p>
                    <p className="text-yellow-400 pt-2 border-t border-slate-700">
                      prima<sub>i,x</sub> = frecuencia<sub>i,x</sub> x severidad<sub>i,x</sub>
                    </p>
                  </div>
                  <div className="mt-4 pt-4 border-t border-slate-700 text-slate-400">
                    <p># Prima total por edad:</p>
                    <p className="text-blue-400">prima_total<sub>x</sub> = S prima<sub>i,x</sub></p>
                  </div>
                </div>
                <p className="text-xs text-slate-500 mt-3">
                  * Se calcula para cada edad individual de 25 a 70 anos
                </p>
              </div>
            </div>

            {/* Cross-link al Tarificador */}
            <div className="mt-6 pt-6 border-t border-slate-200">
              <a
                href="/tarificador"
                className="inline-flex items-center gap-2 text-sm font-medium text-blue-600 hover:text-blue-800 transition-colors"
              >
                Ver esto en accion en el Tarificador
                <ArrowRight className="w-4 h-4" />
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* InsightPanel #3 */}
      <section className="mb-10">
        <InsightPanel titulo="Sabias que...? Factor de riesgo por edad">
          <p>{CALLOUTS.sabiasQue[1]}</p>
        </InsightPanel>
      </section>

      {/* Marco Regulatorio */}
      <section className="mb-10">
        <h2 className="text-xl font-bold text-slate-900 mb-4 flex items-center gap-2">
          <FileText className="w-5 h-5 text-blue-600" />
          Marco Regulatorio
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="card">
            <div className="card-body">
              <h3 className="font-semibold text-slate-900 mb-3">LISF - Ley de Instituciones de Seguros y Fianzas</h3>
              <p className="text-sm text-slate-600 mb-4">
                Marco legal principal que regula la actividad aseguradora en Mexico.
                El Articulo 201 establece los requisitos de la Nota Tecnica.
              </p>
              <div className="bg-amber-50 border border-amber-200 rounded-lg p-3">
                <div className="flex gap-2">
                  <AlertTriangle className="w-4 h-4 text-amber-600 flex-shrink-0 mt-0.5" />
                  <p className="text-xs text-amber-800">
                    Los productos de seguros requieren nota tecnica con justificacion actuarial de la suficiencia de primas.
                  </p>
                </div>
              </div>
            </div>
          </div>
          <div className="card">
            <div className="card-body">
              <h3 className="font-semibold text-slate-900 mb-3">CUSF - Circular Unica de Seguros y Fianzas</h3>
              <p className="text-sm text-slate-600 mb-4">
                Disposiciones derivadas de la LISF. Regula especificamente los seguros de salud en los Capitulos 15.3 al 15.8.
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
                  Este sistema calcula la <strong>prima pura de riesgo</strong>, que representa unicamente el costo
                  esperado de siniestros. La prima de tarifa comercial incluye recargos adicionales:
                </p>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  {[
                    { concepto: 'Gastos de administracion', rango: '8% - 15%' },
                    { concepto: 'Gastos de adquisicion', rango: '15% - 25%' },
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
        <h2 className="text-xl font-bold text-slate-900 mb-4 flex items-center gap-2">
          <ExternalLink className="w-5 h-5 text-blue-600" />
          Referencias
        </h2>
        <div className="card">
          <div className="card-body">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {[
                { titulo: 'CNSF - Circular Unica de Seguros y Fianzas', url: 'https://lisfcusf.cnsf.gob.mx/' },
                { titulo: 'AMIS - Nota tecnica referencial GMM', url: 'https://www.gob.mx/cms/uploads/attachment/file/81303/Nota_t_cnica_GMM_ind_AMIS.pdf' },
                { titulo: 'CONDUSEF - Simulador de GMM', url: 'https://phpapps.condusef.gob.mx/condusef_gastosmedicosGMM/' },
                { titulo: 'CNSF - Estadisticas del sector', url: 'https://www.cnsf.gob.mx' },
              ].map((ref) => (
                <a
                  key={ref.titulo}
                  href={ref.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 p-3 bg-slate-50 rounded-lg hover:bg-slate-100 transition-colors group"
                >
                  <div className="w-8 h-8 bg-blue-100 rounded flex items-center justify-center group-hover:bg-blue-200 transition-colors">
                    <ExternalLink className="w-4 h-4 text-blue-600" />
                  </div>
                  <span className="text-sm text-slate-700 group-hover:text-blue-600 transition-colors">
                    {ref.titulo}
                  </span>
                </a>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <div className="mt-10 pt-6 border-t border-slate-200 text-center text-sm text-slate-500">
        <p>Sistema de Clasificacion y Tarificacion GMM - Datos CNSF 2020-2024</p>
        <p className="mt-1">Proyecto Actuarial - AAR 2026-01 | Clasificacion con Claude AI</p>
      </div>
    </div>
  )
}


/**
 * Componente Explorador de Causas
 * Busqueda y filtrado estatico sobre las top 100 causas con explicaciones
 */
function ExploradorCausas({ causas }: { causas: ExplicacionCausa[] }) {
  const [busqueda, setBusqueda] = useState('')
  const [nivelFiltro, setNivelFiltro] = useState<number | null>(null)

  const causasFiltradas = useMemo(() => {
    return causas.filter((c) => {
      const matchBusqueda = !busqueda || c.causa.toLowerCase().includes(busqueda.toLowerCase())
      const matchNivel = nivelFiltro === null || c.nivel === nivelFiltro
      return matchBusqueda && matchNivel
    })
  }, [causas, busqueda, nivelFiltro])

  return (
    <>
      <h2 className="text-xl font-bold text-slate-900 mb-4 flex items-center gap-2">
        <Search className="w-5 h-5 text-blue-600" />
        Explorador de Causas
      </h2>
      <div className="card">
        <div className="card-body">
          <p className="text-sm text-slate-600 mb-4">
            Explora las causas medicas mas frecuentes con sus clasificaciones y explicaciones generadas por Claude.
          </p>

          {/* Filtros */}
          <div className="flex flex-col sm:flex-row gap-3 mb-4">
            <div className="relative flex-1">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder="Buscar causa medica..."
                value={busqueda}
                onChange={(e) => setBusqueda(e.target.value)}
                className="w-full pl-9 pr-4 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
              />
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => setNivelFiltro(null)}
                className={cn(
                  'px-3 py-2 text-xs font-medium rounded-lg border transition-colors',
                  nivelFiltro === null
                    ? 'bg-slate-900 text-white border-slate-900'
                    : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
                )}
              >
                Todos
              </button>
              {[1, 2, 3].map((n) => (
                <button
                  key={n}
                  onClick={() => setNivelFiltro(nivelFiltro === n ? null : n)}
                  className={cn(
                    'px-3 py-2 text-xs font-medium rounded-lg border transition-colors',
                    nivelFiltro === n
                      ? 'text-white border-transparent'
                      : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
                  )}
                  style={nivelFiltro === n ? { backgroundColor: NIVEL_COLORS[n] } : {}}
                >
                  L{n}
                </button>
              ))}
            </div>
          </div>

          {/* Resultados */}
          <div className="space-y-2 max-h-96 overflow-y-auto">
            {causasFiltradas.length === 0 && (
              <p className="text-sm text-slate-400 text-center py-8">No se encontraron causas con ese criterio.</p>
            )}
            {causasFiltradas.slice(0, 50).map((c, i) => (
              <div key={i} className="flex items-start gap-3 p-3 bg-slate-50 rounded-lg hover:bg-slate-100 transition-colors">
                <div
                  className="w-7 h-7 rounded-full flex items-center justify-center text-white text-xs font-bold flex-shrink-0 mt-0.5"
                  style={{ backgroundColor: NIVEL_COLORS[c.nivel] }}
                >
                  {c.nivel}
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-medium text-slate-900 truncate">{c.causa}</p>
                  <p className="text-xs text-slate-500 mt-0.5">{c.nivel_nombre}</p>
                  <p className="text-xs text-slate-600 mt-1">{c.explicacion}</p>
                </div>
              </div>
            ))}
            {causasFiltradas.length > 50 && (
              <p className="text-xs text-slate-400 text-center py-2">
                Mostrando 50 de {causasFiltradas.length} resultados. Usa el buscador para refinar.
              </p>
            )}
          </div>
        </div>
      </div>
    </>
  )
}
