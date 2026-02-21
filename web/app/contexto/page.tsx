'use client'

import {
  FileText,
  Users,
  Calendar,
  Building2,
  BookOpen,
  DollarSign,
  TrendingUp,
  Shield,
  Scale,
  FileCheck,
  Link2,
  Calculator,
  Heart,
  Activity,
  Percent,
  GraduationCap,
  ExternalLink,
  Sparkles,
  CheckCircle2,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { PageHeader } from '@/components/ui/page-header'
import { UI_LABELS } from '@/lib/constants'

const seccionesDocumento = [
  { numero: 1, titulo: 'Introducción', descripcion: 'Presentación del proyecto, objetivos y alcance del sistema de clasificación GMM', icono: BookOpen, color: 'bg-blue-100 text-blue-700' },
  { numero: 2, titulo: 'Características del Producto', descripcion: 'Definición del GMM Colectivo: cobertura, exclusiones, suma asegurada, coaseguro y deducible', icono: Shield, color: 'bg-emerald-100 text-emerald-700' },
  { numero: 3, titulo: 'Hipótesis Financieras y Demográficas', descripcion: 'Inflación médica (13.5%), población objetivo (25-70 años), sector empresarial', icono: TrendingUp, color: 'bg-purple-100 text-purple-700' },
  { numero: 4, titulo: 'Procedimientos Técnicos', descripcion: 'Metodología de clasificación en 3 niveles, cálculo de frecuencia y severidad', icono: Calculator, color: 'bg-amber-100 text-amber-700' },
  { numero: 5, titulo: 'Análisis', descripcion: 'Resultados del modelo: distribución por nivel, curvas de frecuencia y severidad por edad', icono: Activity, color: 'bg-pink-100 text-pink-700' },
  { numero: 6, titulo: 'Participación de Utilidades', descripcion: 'Esquema de dividendos y bonificaciones para asegurados con baja siniestralidad', icono: Percent, color: 'bg-cyan-100 text-cyan-700' },
  { numero: 7, titulo: 'Reservas', descripcion: 'Reservas técnicas: IBNR, siniestros pendientes, reserva de riesgos en curso', icono: DollarSign, color: 'bg-emerald-100 text-emerald-700' },
  { numero: 8, titulo: 'Valores Garantizados', descripcion: 'Compromisos contractuales y beneficios garantizados del producto', icono: FileCheck, color: 'bg-orange-100 text-orange-700' },
  { numero: 9, titulo: 'Gobernanza', descripcion: 'Estructura de gestión, roles y responsabilidades del equipo actuarial', icono: Users, color: 'bg-indigo-100 text-indigo-700' },
  { numero: 10, titulo: 'Anexos', descripcion: 'Tablas de primas por edad, glosario de términos, clasificación detallada CIE-10', icono: Link2, color: 'bg-rose-100 text-rose-700' },
  { numero: 11, titulo: 'Referencias', descripcion: 'Fuentes bibliográficas, normativa CNSF, LISF y estándares actuariales', icono: FileText, color: 'bg-slate-100 text-slate-700' },
]

const autores = [
  'Fernandez Cordero Ximena',
  'Garcia Paez Daniela',
  'Gonzalez Contreras Andrea Lisset',
  'Gonzalez Ortega Andres',
  'Merida Sanchez Valeria Taydee',
  'Santana Mendoza Elias',
]

export default function ContextoPage() {
  return (
    <div className="p-6 sm:p-8 max-w-6xl mx-auto">
      <PageHeader
        titulo={UI_LABELS.paginas.contexto.titulo}
        subtitulo={UI_LABELS.paginas.contexto.subtitulo}
        icono={FileText}
      />

      {/* Información del Documento */}
      <section className="mb-10">
        <div className="bg-gradient-to-br from-slate-800 to-slate-900 text-white rounded-xl shadow-sm overflow-hidden relative">
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -translate-y-32 translate-x-32" />
          <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/5 rounded-full translate-y-24 -translate-x-24" />
          <div className="p-6 sm:p-8 relative">
            <div className="flex items-center gap-4 mb-6 pb-6 border-b border-white/20">
              <div className="w-14 h-14 bg-white/10 rounded-xl flex items-center justify-center">
                <Building2 className="w-7 h-7" />
              </div>
              <div>
                <h2 className="text-xl font-bold">Universidad Nacional Autónoma de México</h2>
                <p className="text-white/80">Facultad de Ciencias</p>
              </div>
            </div>

            <div className="mb-6">
              <p className="text-sm text-white/60 mb-1">Documento</p>
              <h3 className="text-2xl font-bold">Nota Técnica</h3>
              <p className="text-lg text-white/90 mt-1">Cálculo de Prima por Nivel Hospitalario</p>
            </div>

            <a
              href="https://drive.google.com/drive/folders/1yzJir1d1bAjj4I2PlRus5MduM4K4d3NK?usp=drive_link"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 bg-white/20 hover:bg-white/30 text-white px-4 py-2 rounded-lg transition-colors text-sm font-medium mb-6"
            >
              <ExternalLink className="w-4 h-4" />
              Ver documentos del proyecto
            </a>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {[
                { icono: BookOpen, label: 'Asignatura', valor: 'Administración Actuarial del Riesgo', sub: 'Semestre 2026-1' },
                { icono: GraduationCap, label: 'Profesores', valor: 'Blanca Dulce Miriam Benítez Pérez', sub: 'Diana Pérez Xicohtécatl -- Alejandro Pérez Muñoz' },
                { icono: Calendar, label: 'Fecha', valor: '3 de diciembre de 2025', sub: 'Versión Final' },
                { icono: FileText, label: 'Extensión', valor: '25 páginas', sub: '11 secciones' },
              ].map((item) => (
                <div key={item.label} className="bg-white/10 rounded-xl p-4">
                  <div className="flex items-center gap-2 text-white/60 mb-1">
                    <item.icono className="w-4 h-4" />
                    <span className="text-sm">{item.label}</span>
                  </div>
                  <p className="font-semibold">{item.valor}</p>
                  <p className="text-sm text-white/70">{item.sub}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Autores */}
      <section className="mb-10">
        <h2 className="text-xl font-bold text-slate-900 mb-4 flex items-center gap-2">
          <Users className="w-5 h-5 text-blue-700" />
          Integrantes del Proyecto
        </h2>
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6">
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {autores.map((autor, index) => (
              <div key={autor} className="flex items-center gap-3 bg-slate-50 rounded-lg p-3">
                <div className="w-10 h-10 bg-gradient-to-br from-slate-700 to-blue-700 rounded-full flex items-center justify-center text-white font-semibold text-sm">
                  {['X', 'D', 'L', 'A', 'T', 'E'][index]}
                </div>
                <div>
                  <p className="text-sm font-medium text-slate-900">{autor}</p>
                  <p className="text-xs text-slate-500">Actuaría</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Versión 2.0 */}
      <section className="mb-10">
        <h2 className="text-xl font-bold text-slate-900 mb-4 flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-amber-600" />
          Versión 2.0: Mejora con Inteligencia Artificial
        </h2>
        <div className="bg-gradient-to-br from-amber-50 to-orange-50 border border-amber-200 rounded-xl shadow-sm overflow-hidden">
          <div className="p-6">
            <p className="text-sm text-slate-700 mb-4">
              El proyecto original (v1) fue desarrollado como trabajo en equipo para la materia de
              Administración Actuarial del Riesgo: pipeline de datos, clasificación con Random Forest,
              nota técnica y aplicación web.
            </p>
            <div className="bg-white/80 rounded-lg p-4 mb-4 border border-amber-100">
              <p className="text-sm text-slate-700">
                En la <strong className="text-amber-900">Versión 2.0</strong>, mejoré el sistema de clasificación
                utilizando <strong className="text-amber-900">Claude AI (LLM)</strong>, elevando la precisión
                de clasificación de causas médicas de <strong className="text-red-600">59%</strong> a{' '}
                <strong className="text-green-600">~95%</strong>. Esta mejora la implementé de manera individual
                como extensión del proyecto original.
                {' -- '}<strong className="text-slate-900">Andrés González Ortega</strong>
              </p>
            </div>
            <h4 className="font-semibold text-slate-900 text-sm mb-3">Adiciones de la Versión 2.0:</h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {[
                'Reclasificación de 7,909 causas médicas con Claude AI',
                'Primas actuariales actualizadas con nueva clasificación',
                'Explorador interactivo de causas con explicaciones',
                'Showcase de metodología de clasificación con IA',
              ].map((item) => (
                <div key={item} className="flex items-start gap-2 text-sm">
                  <CheckCircle2 className="w-4 h-4 text-amber-600 flex-shrink-0 mt-0.5" />
                  <span className="text-slate-700">{item}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Cifras Clave */}
      <section className="mb-10">
        <h2 className="text-xl font-bold text-slate-900 mb-4 flex items-center gap-2">
          <TrendingUp className="w-5 h-5 text-blue-700" />
          Cifras Clave del Documento
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { valor: '95.9M', etiqueta: 'Asegurados-año', descripcion: 'Exposición total 2020-2024' },
            { valor: '5.1M', etiqueta: 'Siniestros', descripcion: 'Reclamaciones analizadas' },
            { valor: '13.5%', etiqueta: 'Inflación médica', descripcion: 'Proyección 2026' },
            { valor: '$5,447', etiqueta: 'Prima técnica', descripcion: 'Promedio anual MXN' },
          ].map((stat) => (
            <div key={stat.etiqueta} className="bg-white rounded-xl border border-slate-200 shadow-sm p-5 text-center">
              <p className="text-3xl font-bold text-blue-700">{stat.valor}</p>
              <p className="font-medium text-slate-900">{stat.etiqueta}</p>
              <p className="text-xs text-slate-500 mt-1">{stat.descripcion}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Fórmulas Principales */}
      <section className="mb-10">
        <h2 className="text-xl font-bold text-slate-900 mb-4 flex items-center gap-2">
          <Calculator className="w-5 h-5 text-blue-700" />
          Fórmulas del Documento
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white rounded-xl border border-slate-200 shadow-sm">
            <div className="px-6 py-4 border-b border-slate-100">
              <h3 className="font-semibold text-slate-900">Prima de Riesgo (PR)</h3>
            </div>
            <div className="p-6">
              <div className="bg-gradient-to-r from-slate-50 to-blue-50 rounded-xl p-6 text-center mb-4">
                <p className="text-2xl font-mono font-bold text-slate-800">PR = Frecuencia x Severidad</p>
              </div>
              <p className="text-sm text-slate-600">
                La prima pura de riesgo representa el costo esperado de siniestros,
                calculada para cada combinación de nivel (1, 2, 3), edad (25-70) y sexo.
              </p>
            </div>
          </div>

          <div className="bg-white rounded-xl border border-slate-200 shadow-sm">
            <div className="px-6 py-4 border-b border-slate-100">
              <h3 className="font-semibold text-slate-900">Prima de Tarifa (PT)</h3>
            </div>
            <div className="p-6">
              <div className="bg-gradient-to-r from-slate-50 to-emerald-50 rounded-xl p-6 text-center mb-4">
                <p className="text-lg font-mono font-bold text-slate-800">
                  PT = PR / (1 - G.Admin - G.Adq - Utilidad)
                </p>
                <p className="text-base font-mono text-emerald-700 mt-2">
                  PT = PR / (1 - 0.20 - 0.10 - 0.10) = PR / 0.60
                </p>
              </div>
              <div className="grid grid-cols-3 gap-2 mb-4">
                <div className="bg-blue-50 rounded-lg p-3 text-center">
                  <p className="text-xs text-blue-600 font-medium">G. Administración</p>
                  <p className="text-lg font-bold text-blue-700">20%</p>
                </div>
                <div className="bg-purple-50 rounded-lg p-3 text-center">
                  <p className="text-xs text-purple-600 font-medium">G. Adquisición</p>
                  <p className="text-lg font-bold text-purple-700">10%</p>
                </div>
                <div className="bg-amber-50 rounded-lg p-3 text-center">
                  <p className="text-xs text-amber-600 font-medium">Utilidad</p>
                  <p className="text-lg font-bold text-amber-700">10%</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Factor de edad */}
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm mt-6">
          <div className="px-6 py-4 border-b border-slate-100">
            <h3 className="font-semibold text-slate-900">Factor de Ajuste por Edad</h3>
          </div>
          <div className="p-6">
            <p className="text-sm text-slate-600 mb-4">
              El documento define factores de ajuste que modifican la prima base según la edad del asegurado:
            </p>
            <div className="flex items-center justify-between bg-slate-50 rounded-xl p-4">
              <div className="text-center">
                <p className="text-xs text-slate-500 mb-1">Edad 25 años</p>
                <p className="text-2xl font-bold text-emerald-600">0.49</p>
                <p className="text-xs text-slate-400">Factor más bajo</p>
              </div>
              <div className="flex-1 mx-4">
                <div className="h-2 bg-gradient-to-r from-emerald-500 via-amber-500 to-rose-500 rounded-full" />
                <p className="text-xs text-center text-slate-500 mt-2">Incremento progresivo con la edad</p>
              </div>
              <div className="text-center">
                <p className="text-xs text-slate-500 mb-1">Edad 70 años</p>
                <p className="text-2xl font-bold text-rose-600">3.64</p>
                <p className="text-xs text-slate-400">Factor más alto</p>
              </div>
            </div>
            <p className="text-xs text-slate-500 mt-4 text-center">
              Un asegurado de 70 años tiene un factor 7.4x mayor que uno de 25 años
            </p>
          </div>
        </div>
      </section>

      {/* Contenido del Documento */}
      <section className="mb-10">
        <h2 className="text-xl font-bold text-slate-900 mb-4 flex items-center gap-2">
          <FileText className="w-5 h-5 text-blue-700" />
          Contenido del Documento
        </h2>
        <p className="text-slate-600 mb-6">
          La Nota Técnica se estructura en 11 secciones que documentan completamente
          el proceso de clasificación y tarificación:
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {seccionesDocumento.map((seccion) => (
            <div key={seccion.numero} className="bg-white rounded-xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
              <div className="p-5">
                <div className="flex items-start gap-3">
                  <div className={cn('w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0', seccion.color)}>
                    <seccion.icono className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-xs font-semibold text-slate-400">SECCIÓN {seccion.numero}</span>
                    <h3 className="font-semibold text-slate-900 text-sm">{seccion.titulo}</h3>
                    <p className="text-xs text-slate-500 mt-1">{seccion.descripcion}</p>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Hipótesis */}
      <section className="mb-10">
        <h2 className="text-xl font-bold text-slate-900 mb-4 flex items-center gap-2">
          <Heart className="w-5 h-5 text-blue-700" />
          Hipótesis Principales
        </h2>
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="font-semibold text-slate-900 mb-3">Hipótesis Demográficas</h3>
              <ul className="space-y-2">
                {[
                  { label: 'Población objetivo:', texto: 'Adultos de 25 a 70 años' },
                  { label: 'Segmento:', texto: 'Sector empresarial formal' },
                  { label: 'Tipo de póliza:', texto: 'GMM Colectivo' },
                ].map((item) => (
                  <li key={item.label} className="flex items-start gap-2 text-sm">
                    <div className="w-2 h-2 bg-blue-500 rounded-full mt-1.5 flex-shrink-0" />
                    <span><strong>{item.label}</strong> {item.texto}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h3 className="font-semibold text-slate-900 mb-3">Hipótesis Financieras</h3>
              <ul className="space-y-2">
                {[
                  { label: 'Inflación médica 2026:', texto: '13.5% anual' },
                  { label: 'Moneda:', texto: 'Pesos mexicanos (MXN)' },
                  { label: 'Ajuste anual:', texto: 'Por inflación médica observada' },
                ].map((item) => (
                  <li key={item.label} className="flex items-start gap-2 text-sm">
                    <div className="w-2 h-2 bg-emerald-500 rounded-full mt-1.5 flex-shrink-0" />
                    <span><strong>{item.label}</strong> {item.texto}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Marco Regulatorio */}
      <section className="mb-10">
        <h2 className="text-xl font-bold text-slate-900 mb-4 flex items-center gap-2">
          <Scale className="w-5 h-5 text-blue-700" />
          Marco Regulatorio
        </h2>
        <div className="bg-blue-50/50 border border-blue-200 rounded-xl p-6">
          <p className="text-sm text-blue-800 mb-4">
            La Nota Técnica se elaboró siguiendo los lineamientos establecidos por:
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {[
              { sigla: 'LISF', texto: 'Ley de Instituciones de Seguros y Fianzas - Art. 201' },
              { sigla: 'CUSF', texto: 'Circular Única de Seguros y Fianzas - Capítulos 15.3-15.8' },
              { sigla: 'CNSF', texto: 'Comisión Nacional de Seguros y Fianzas - Estándares' },
            ].map((item) => (
              <div key={item.sigla} className="bg-white rounded-lg p-4">
                <h4 className="font-semibold text-blue-900 mb-1">{item.sigla}</h4>
                <p className="text-xs text-blue-700">{item.texto}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <div className="mt-10 pt-6 border-t border-slate-200 text-center text-sm text-slate-500">
        <p>Resumen del documento: Nota Técnica - Cálculo de Prima por Nivel Hospitalario</p>
        <p className="mt-1">UNAM -- Facultad de Ciencias -- AAR 2026-01</p>
      </div>
    </div>
  )
}
