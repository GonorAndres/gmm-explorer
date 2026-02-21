'use client'

import { useState, useMemo } from 'react'
import {
  Calculator,
  User,
  Calendar,
  HelpCircle,
} from 'lucide-react'
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from 'recharts'
import { cn } from '@/lib/utils'
import { PageHeader } from '@/components/ui/page-header'
import { ChartCard } from '@/components/ui/chart-card'
import { InsightPanel } from '@/components/ui/insight-panel'
import {
  TooltipProvider,
  Tooltip as UITooltip,
  TooltipTrigger,
  TooltipContent,
} from '@/components/ui/tooltip'
import {
  UI_LABELS,
  NIVEL_LABELS,
  NIVEL_COLORS,
  NIVEL_DESCRIPCIONES,
  formatearMoneda,
  formatearFrecuencia,
} from '@/lib/constants'
import { TOOLTIPS, INSIGHT_PANELS } from '@/lib/content'
import type { PrimaNivelEdad } from '@/types'

import primasData from '@/data/primas-nivel-edad.json'

const RECARGO_MENSUAL = 0.055
const EDAD_MIN = 25
const EDAD_MAX = 70

function InfoTip({ texto }: { texto: string }) {
  return (
    <UITooltip>
      <TooltipTrigger asChild>
        <HelpCircle className="w-3.5 h-3.5 text-slate-400 cursor-help inline ml-1" />
      </TooltipTrigger>
      <TooltipContent side="top" className="max-w-xs">
        <p>{texto}</p>
      </TooltipContent>
    </UITooltip>
  )
}

export default function TarificadorPage() {
  const [edad, setEdad] = useState(35)
  const [sexo, setSexo] = useState<'Todos' | 'Masculino' | 'Femenino'>('Todos')
  const [modalidadPago, setModalidadPago] = useState<'anual' | 'mensual'>('anual')

  const primas = primasData as PrimaNivelEdad[]

  const primasPorNivel = useMemo(() => {
    return [1, 2, 3].map((nivel) => {
      const datosSexo = primas.filter((p) => p.nivel === nivel && p.edad === edad)
      let data: PrimaNivelEdad | undefined

      if (sexo === 'Todos') {
        // Promedio ponderado de ambos sexos
        const masc = datosSexo.find((p) => p.sexo === 'Masculino')
        const fem = datosSexo.find((p) => p.sexo === 'Femenino')
        if (masc && fem) {
          data = {
            ...masc,
            frecuencia: (masc.frecuencia + fem.frecuencia) / 2,
            severidad: (masc.severidad + fem.severidad) / 2,
            prima_anual: (masc.prima_anual + fem.prima_anual) / 2,
            prima_tarifa: (masc.prima_tarifa + fem.prima_tarifa) / 2,
            prima_mensual: (masc.prima_mensual + fem.prima_mensual) / 2,
            prima_tarifa_mensual: (masc.prima_tarifa_mensual + fem.prima_tarifa_mensual) / 2,
          }
        } else {
          data = masc || fem
        }
      } else {
        data = datosSexo.find((p) => p.sexo === sexo)
      }

      return {
        nivel,
        label: NIVEL_LABELS[nivel],
        descripcion: NIVEL_DESCRIPCIONES[nivel],
        color: NIVEL_COLORS[nivel as 1 | 2 | 3],
        frecuencia: data?.frecuencia || 0,
        severidad: data?.severidad || 0,
        prima_anual: data?.prima_anual || 0,
        prima_tarifa: data?.prima_tarifa || 0,
        prima_mensual: data?.prima_mensual || 0,
        prima_tarifa_mensual: data?.prima_tarifa_mensual || 0,
      }
    })
  }, [primas, edad, sexo])

  const totales = useMemo(() => {
    const primaAnualTotal = primasPorNivel.reduce((sum, p) => sum + p.prima_anual, 0)
    const primaTarifaTotal = primasPorNivel.reduce((sum, p) => sum + p.prima_tarifa, 0)
    const primaMensualBase = primaAnualTotal / 12
    const primaMensualConRecargo = primaMensualBase * (1 + RECARGO_MENSUAL)
    const primaTarifaMensualBase = primaTarifaTotal / 12
    const primaTarifaMensualConRecargo = primaTarifaMensualBase * (1 + RECARGO_MENSUAL)

    return {
      primaAnualTotal,
      primaTarifaTotal,
      primaMensualBase,
      primaMensualConRecargo,
      primaTarifaMensualConRecargo,
      recargoMensual: primaMensualConRecargo - primaMensualBase,
    }
  }, [primasPorNivel])

  const primaRiesgoActual = modalidadPago === 'anual'
    ? totales.primaAnualTotal
    : totales.primaMensualConRecargo

  const primaTarifaActual = modalidadPago === 'anual'
    ? totales.primaTarifaTotal
    : totales.primaTarifaMensualConRecargo

  const datosGrafico = primasPorNivel.map((p) => ({
    name: p.label,
    riesgo: modalidadPago === 'anual' ? p.prima_anual : p.prima_anual / 12 * (1 + RECARGO_MENSUAL),
    tarifa: modalidadPago === 'anual' ? p.prima_tarifa : p.prima_tarifa / 12 * (1 + RECARGO_MENSUAL),
    fill: p.color,
  }))

  return (
    <TooltipProvider>
      <div className="p-6 sm:p-8">
        <PageHeader
          titulo={UI_LABELS.paginas.tarificador.titulo}
          subtitulo={UI_LABELS.paginas.tarificador.subtitulo}
          icono={Calculator}
        />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Panel de entrada */}
          <div className="lg:col-span-1 space-y-6">
            {/* Datos del Asegurado */}
            <div className="bg-white rounded-xl border border-slate-200 shadow-sm">
              <div className="px-6 py-4 border-b border-slate-100">
                <div className="flex items-center gap-2">
                  <User className="w-5 h-5 text-blue-700" />
                  <span className="font-semibold text-slate-800">Datos del Asegurado</span>
                </div>
              </div>
              <div className="p-6 space-y-5">
                {/* Edad */}
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Edad
                    <InfoTip texto={TOOLTIPS.tarificador.factorEdad} />
                  </label>
                  <div className="flex items-center gap-4">
                    <input
                      type="range"
                      min={EDAD_MIN}
                      max={EDAD_MAX}
                      value={edad}
                      onChange={(e) => setEdad(parseInt(e.target.value))}
                      className="flex-1 accent-blue-700"
                    />
                    <input
                      type="number"
                      min={EDAD_MIN}
                      max={EDAD_MAX}
                      value={edad}
                      onChange={(e) => {
                        const val = parseInt(e.target.value)
                        if (val >= EDAD_MIN && val <= EDAD_MAX) setEdad(val)
                      }}
                      className="w-20 text-center font-bold text-lg border border-slate-300 rounded-lg px-2 py-1"
                    />
                  </div>
                  <p className="text-xs text-slate-400 mt-1">Rango: {EDAD_MIN} - {EDAD_MAX} años</p>
                </div>

                {/* Sexo */}
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Sexo
                    <InfoTip texto={TOOLTIPS.tarificador.sexo} />
                  </label>
                  <div className="grid grid-cols-3 gap-2">
                    {(['Todos', 'Masculino', 'Femenino'] as const).map((s) => (
                      <button
                        key={s}
                        onClick={() => setSexo(s)}
                        className={cn(
                          'px-3 py-2 rounded-lg border text-sm transition-colors',
                          sexo === s
                            ? 'border-blue-500 bg-blue-50 text-blue-700 font-medium'
                            : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                        )}
                      >
                        {s}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Modalidad de Pago */}
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Modalidad de Pago
                    <InfoTip texto={TOOLTIPS.tarificador.recargoMensual} />
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      onClick={() => setModalidadPago('anual')}
                      className={cn(
                        'px-4 py-3 rounded-lg border-2 transition-all text-center',
                        modalidadPago === 'anual'
                          ? 'border-blue-500 bg-blue-50 text-blue-700'
                          : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                      )}
                    >
                      <Calendar className="w-5 h-5 mx-auto mb-1" />
                      <span className="text-sm font-medium">Anual</span>
                      <p className="text-xs text-slate-500 mt-0.5">Sin recargo</p>
                    </button>
                    <button
                      onClick={() => setModalidadPago('mensual')}
                      className={cn(
                        'px-4 py-3 rounded-lg border-2 transition-all text-center',
                        modalidadPago === 'mensual'
                          ? 'border-blue-500 bg-blue-50 text-blue-700'
                          : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                      )}
                    >
                      <Calendar className="w-5 h-5 mx-auto mb-1" />
                      <span className="text-sm font-medium">Mensual</span>
                      <p className="text-xs text-slate-500 mt-0.5">+{(RECARGO_MENSUAL * 100).toFixed(1)}%</p>
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Resultado: Prima de Riesgo */}
            <div className="bg-gradient-to-br from-slate-800 to-slate-900 text-white rounded-xl shadow-sm">
              <div className="p-6">
                <div className="flex items-center gap-2 mb-4">
                  <Calculator className="w-5 h-5" />
                  <span className="font-semibold text-sm">Prima de Riesgo</span>
                  <InfoTip texto={TOOLTIPS.tarificador.primaRiesgo} />
                </div>
                <div className="text-center py-3">
                  <p className="text-3xl font-bold">{formatearMoneda(primaRiesgoActual, 2)}</p>
                  <p className="text-slate-300 text-sm mt-1">
                    {modalidadPago === 'anual' ? 'Prima anual pura' : 'Prima mensual pura'}
                  </p>
                </div>
              </div>
            </div>

            {/* Resultado: Prima de Tarifa */}
            <div className="bg-gradient-to-br from-blue-700 to-blue-800 text-white rounded-xl shadow-sm">
              <div className="p-6">
                <div className="flex items-center gap-2 mb-4">
                  <Calculator className="w-5 h-5" />
                  <span className="font-semibold text-sm">Prima de Tarifa</span>
                  <InfoTip texto={TOOLTIPS.tarificador.primaTarifa} />
                </div>
                <div className="text-center py-3">
                  <p className="text-3xl font-bold">{formatearMoneda(primaTarifaActual, 2)}</p>
                  <p className="text-blue-200 text-sm mt-1">
                    {modalidadPago === 'anual' ? 'Prima anual comercial' : 'Prima mensual comercial'}
                  </p>
                </div>
                <div className="mt-3 pt-3 border-t border-blue-600/30 text-xs text-blue-200 space-y-1">
                  <div className="flex justify-between">
                    <span>G. Administración (20%)</span>
                    <span>+ G. Adquisición (10%)</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Utilidad (10%)</span>
                    <span>Factor: /0.60</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Mini cards por nivel */}
            <div className="grid grid-cols-3 gap-2">
              {primasPorNivel.map((p) => (
                <div
                  key={p.nivel}
                  className="bg-white rounded-xl border border-slate-200 shadow-sm border-l-4 py-3 px-3"
                  style={{ borderLeftColor: p.color }}
                >
                  <p className="text-xs text-slate-500 font-medium truncate">
                    {p.label.split(' (')[0]}
                  </p>
                  <p className="text-sm font-bold text-slate-900">
                    {formatearMoneda(
                      modalidadPago === 'anual' ? p.prima_tarifa : p.prima_tarifa / 12 * (1 + RECARGO_MENSUAL),
                      0
                    )}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Panel de desglose */}
          <div className="lg:col-span-2 space-y-6">
            {/* Gráfico de barras */}
            <ChartCard
              titulo="Desglose por Nivel"
              subtitulo={`Prima ${modalidadPago === 'anual' ? 'anual' : 'mensual'} -- Riesgo vs Tarifa`}
            >
              <ResponsiveContainer width="100%" height={200}>
                <BarChart data={datosGrafico} layout="vertical">
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" horizontal={false} />
                  <XAxis
                    type="number"
                    tick={{ fontSize: 12, fill: '#64748b' }}
                    tickLine={false}
                    tickFormatter={(v) => formatearMoneda(v)}
                  />
                  <YAxis
                    type="category"
                    dataKey="name"
                    tick={{ fontSize: 12, fill: '#64748b' }}
                    tickLine={false}
                    width={150}
                  />
                  <Tooltip
                    formatter={(value: number, name: string) => [formatearMoneda(value, 2), name === 'riesgo' ? 'Prima Riesgo' : 'Prima Tarifa']}
                    cursor={{ fill: '#f1f5f9' }}
                  />
                  <Bar dataKey="riesgo" name="Prima Riesgo" radius={[0, 4, 4, 0]}>
                    {datosGrafico.map((entry, index) => (
                      <Cell key={`cell-r-${index}`} fill={entry.fill} fillOpacity={0.6} />
                    ))}
                  </Bar>
                  <Bar dataKey="tarifa" name="Prima Tarifa" radius={[0, 4, 4, 0]}>
                    {datosGrafico.map((entry, index) => (
                      <Cell key={`cell-t-${index}`} fill={entry.fill} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </ChartCard>

            {/* Tabla detallada */}
            <ChartCard
              titulo="Detalle Actuarial"
              subtitulo="Frecuencia x Severidad = Prima de Riesgo / Factor = Prima de Tarifa"
            >
              <div className="overflow-x-auto">
                <table>
                  <thead>
                    <tr>
                      <th>Nivel</th>
                      <th className="text-right">Frecuencia</th>
                      <th className="text-right">Severidad</th>
                      <th className="text-right">P. Riesgo</th>
                      <th className="text-right">P. Tarifa</th>
                      <th className="text-right">% Total</th>
                    </tr>
                  </thead>
                  <tbody>
                    {primasPorNivel.map((p) => (
                      <tr key={p.nivel} className="hover:bg-slate-50">
                        <td>
                          <div className="flex items-center gap-2">
                            <div
                              className="w-3 h-3 rounded-full"
                              style={{ backgroundColor: p.color }}
                            />
                            <div>
                              <span className="font-medium">{p.label}</span>
                              <p className="text-xs text-slate-500">{p.descripcion}</p>
                            </div>
                          </div>
                        </td>
                        <td className="text-right font-mono">{formatearFrecuencia(p.frecuencia)}</td>
                        <td className="text-right">{formatearMoneda(p.severidad)}</td>
                        <td className="text-right">{formatearMoneda(p.prima_anual, 2)}</td>
                        <td className="text-right font-semibold">{formatearMoneda(p.prima_tarifa, 2)}</td>
                        <td className="text-right text-slate-500">
                          {totales.primaTarifaTotal > 0 ? ((p.prima_tarifa / totales.primaTarifaTotal) * 100).toFixed(1) : 0}%
                        </td>
                      </tr>
                    ))}
                    <tr className="bg-slate-50 font-semibold">
                      <td><span className="text-slate-900">TOTAL</span></td>
                      <td className="text-right">-</td>
                      <td className="text-right">-</td>
                      <td className="text-right">{formatearMoneda(totales.primaAnualTotal, 2)}</td>
                      <td className="text-right text-blue-700">{formatearMoneda(totales.primaTarifaTotal, 2)}</td>
                      <td className="text-right">100%</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </ChartCard>

            {/* Insight Panels */}
            <div className="space-y-3">
              <InsightPanel titulo={INSIGHT_PANELS.tarificador.comoPrima.titulo}>
                <p>{INSIGHT_PANELS.tarificador.comoPrima.contenido}</p>
              </InsightPanel>
              <InsightPanel titulo={INSIGHT_PANELS.tarificador.factoresPrecio.titulo}>
                <p>{INSIGHT_PANELS.tarificador.factoresPrecio.contenido}</p>
              </InsightPanel>
            </div>

            {/* Nota metodológica */}
            <div className="bg-amber-50/50 border border-amber-200 rounded-xl p-5">
              <div className="flex gap-3">
                <div className="w-8 h-8 bg-amber-100 rounded-lg flex items-center justify-center flex-shrink-0">
                  <HelpCircle className="w-4 h-4 text-amber-600" />
                </div>
                <div className="text-sm text-amber-800">
                  <p className="font-semibold mb-1">Nota Metodológica</p>
                  <ul className="list-disc list-inside space-y-1 text-amber-700 text-xs">
                    <li>Prima de riesgo = Frecuencia x Severidad (metodología actuarial estándar)</li>
                    <li>Prima de tarifa = Prima de riesgo / (1 - 0.20 - 0.10 - 0.10)</li>
                    <li>Datos basados en experiencia 2020-2024 del sector GMM Colectivo</li>
                    <li>Montos ajustados por inflación médica a valores 2024</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </TooltipProvider>
  )
}
