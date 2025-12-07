'use client'

import { useState, useMemo } from 'react'
import {
  Calculator,
  User,
  DollarSign,
  Calendar,
  TrendingUp,
  Info,
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
import {
  UI_LABELS,
  NIVEL_LABELS,
  NIVEL_COLORS,
  NIVEL_DESCRIPCIONES,
  formatearMoneda,
  formatearFrecuencia,
} from '@/lib/constants'

// Importar datos de primas
import primasData from '@/data/primas-nivel-edad.json'

// Tipos
interface PrimaNivelEdad {
  nivel: number
  edad: number
  frecuencia: number
  severidad: number
  prima_anual: number
  prima_mensual: number
  descripcion: string
}

// Constantes
const RECARGO_MENSUAL = 0.055 // 5.5% recargo por pago mensual
const EDAD_MIN = 25
const EDAD_MAX = 70

/**
 * Tarificador interactivo de primas GMM
 * Calcula la prima de riesgo basada en edad del asegurado
 */
export default function TarificadorPage() {
  const [edad, setEdad] = useState(35)
  const [modalidadPago, setModalidadPago] = useState<'anual' | 'mensual'>('anual')

  // Datos tipados
  const primas = primasData as PrimaNivelEdad[]

  // Calcular prima por nivel para la edad seleccionada
  const primasPorNivel = useMemo(() => {
    return [1, 2, 3].map((nivel) => {
      const data = primas.find((p) => p.nivel === nivel && p.edad === edad)
      return {
        nivel,
        label: NIVEL_LABELS[nivel],
        descripcion: NIVEL_DESCRIPCIONES[nivel],
        color: NIVEL_COLORS[nivel as 1 | 2 | 3],
        frecuencia: data?.frecuencia || 0,
        severidad: data?.severidad || 0,
        prima_anual: data?.prima_anual || 0,
        prima_mensual: data?.prima_mensual || 0,
      }
    })
  }, [primas, edad])

  // Calcular totales
  const totales = useMemo(() => {
    const primaAnualTotal = primasPorNivel.reduce((sum, p) => sum + p.prima_anual, 0)
    const primaMensualBase = primaAnualTotal / 12
    const primaMensualConRecargo = primaMensualBase * (1 + RECARGO_MENSUAL)

    return {
      primaAnualTotal,
      primaMensualBase,
      primaMensualConRecargo,
      recargoMensual: primaMensualConRecargo - primaMensualBase,
    }
  }, [primasPorNivel])

  // Prima a mostrar según modalidad
  const primaActual = modalidadPago === 'anual'
    ? totales.primaAnualTotal
    : totales.primaMensualConRecargo

  // Datos para gráfico de barras
  const datosGrafico = primasPorNivel.map((p) => ({
    name: p.label,
    prima: modalidadPago === 'anual' ? p.prima_anual : p.prima_anual / 12 * (1 + RECARGO_MENSUAL),
    fill: p.color,
  }))

  return (
    <div className="p-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">
          {UI_LABELS.paginas.tarificador.titulo}
        </h1>
        <p className="text-gray-500 mt-1">
          {UI_LABELS.paginas.tarificador.subtitulo}
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Panel de entrada */}
        <div className="lg:col-span-1 space-y-6">
          {/* Selector de Edad */}
          <div className="card">
            <div className="card-header">
              <div className="flex items-center gap-2">
                <User className="w-5 h-5 text-blue-600" />
                <span className="font-semibold">Datos del Asegurado</span>
              </div>
            </div>
            <div className="card-body space-y-6">
              {/* Edad */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Edad del Asegurado
                </label>
                <div className="flex items-center gap-4">
                  <input
                    type="range"
                    min={EDAD_MIN}
                    max={EDAD_MAX}
                    value={edad}
                    onChange={(e) => setEdad(parseInt(e.target.value))}
                    className="flex-1 accent-blue-600"
                  />
                  <div className="w-20">
                    <input
                      type="number"
                      min={EDAD_MIN}
                      max={EDAD_MAX}
                      value={edad}
                      onChange={(e) => {
                        const val = parseInt(e.target.value)
                        if (val >= EDAD_MIN && val <= EDAD_MAX) {
                          setEdad(val)
                        }
                      }}
                      className="w-full text-center font-bold text-lg"
                    />
                  </div>
                </div>
                <p className="text-xs text-gray-500 mt-1">
                  Rango permitido: {EDAD_MIN} - {EDAD_MAX} años
                </p>
              </div>

              {/* Modalidad de Pago */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Modalidad de Pago
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    onClick={() => setModalidadPago('anual')}
                    className={cn(
                      'px-4 py-3 rounded-lg border-2 transition-all text-center',
                      modalidadPago === 'anual'
                        ? 'border-blue-500 bg-blue-50 text-blue-700'
                        : 'border-gray-200 text-gray-600 hover:bg-gray-50'
                    )}
                  >
                    <Calendar className="w-5 h-5 mx-auto mb-1" />
                    <span className="text-sm font-medium">Anual</span>
                    <p className="text-xs text-gray-500 mt-0.5">Sin recargo</p>
                  </button>
                  <button
                    onClick={() => setModalidadPago('mensual')}
                    className={cn(
                      'px-4 py-3 rounded-lg border-2 transition-all text-center',
                      modalidadPago === 'mensual'
                        ? 'border-blue-500 bg-blue-50 text-blue-700'
                        : 'border-gray-200 text-gray-600 hover:bg-gray-50'
                    )}
                  >
                    <Calendar className="w-5 h-5 mx-auto mb-1" />
                    <span className="text-sm font-medium">Mensual</span>
                    <p className="text-xs text-gray-500 mt-0.5">+{(RECARGO_MENSUAL * 100).toFixed(1)}% recargo</p>
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Resultado Principal */}
          <div className="card bg-gradient-to-br from-blue-600 to-blue-700 text-white">
            <div className="card-body">
              <div className="flex items-center gap-2 mb-4">
                <Calculator className="w-6 h-6" />
                <span className="font-semibold">Prima de Riesgo</span>
              </div>
              <div className="text-center py-4">
                <p className="text-4xl font-bold">
                  {formatearMoneda(primaActual, 2)}
                </p>
                <p className="text-blue-100 mt-1">
                  {modalidadPago === 'anual' ? 'Prima anual' : 'Prima mensual'}
                </p>
              </div>
              {modalidadPago === 'mensual' && (
                <div className="mt-4 pt-4 border-t border-blue-500/30">
                  <div className="flex justify-between text-sm">
                    <span className="text-blue-100">Prima base mensual:</span>
                    <span>{formatearMoneda(totales.primaMensualBase, 2)}</span>
                  </div>
                  <div className="flex justify-between text-sm mt-1">
                    <span className="text-blue-100">Recargo ({(RECARGO_MENSUAL * 100).toFixed(1)}%):</span>
                    <span>+{formatearMoneda(totales.recargoMensual, 2)}</span>
                  </div>
                </div>
              )}
              {modalidadPago === 'anual' && (
                <div className="mt-4 pt-4 border-t border-blue-500/30 text-sm text-blue-100">
                  <p>Equivalente mensual: {formatearMoneda(totales.primaAnualTotal / 12, 2)}/mes</p>
                </div>
              )}
            </div>
          </div>

          {/* Primas individuales por nivel */}
          <div className="grid grid-cols-3 gap-2">
            {primasPorNivel.map((p) => (
              <div
                key={p.nivel}
                className="card border-l-4"
                style={{ borderLeftColor: p.color }}
              >
                <div className="card-body py-3 px-3">
                  <p className="text-xs text-gray-500 font-medium truncate">
                    {p.label.split(':')[0]}
                  </p>
                  <p className="text-sm font-bold text-gray-900">
                    {formatearMoneda(
                      modalidadPago === 'anual'
                        ? p.prima_anual
                        : p.prima_anual / 12 * (1 + RECARGO_MENSUAL),
                      0
                    )}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Panel de desglose */}
        <div className="lg:col-span-2 space-y-6">
          {/* Gráfico de barras */}
          <div className="card">
            <div className="card-header">
              <h3 className="font-semibold text-gray-900">Desglose por Nivel</h3>
              <p className="text-sm text-gray-500">
                Prima {modalidadPago === 'anual' ? 'anual' : 'mensual'} por tipo de cobertura
              </p>
            </div>
            <div className="card-body">
              <ResponsiveContainer width="100%" height={200}>
                <BarChart data={datosGrafico} layout="vertical">
                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" horizontal={false} />
                  <XAxis
                    type="number"
                    tick={{ fontSize: 12 }}
                    tickLine={false}
                    tickFormatter={(v) => formatearMoneda(v)}
                  />
                  <YAxis
                    type="category"
                    dataKey="name"
                    tick={{ fontSize: 12 }}
                    tickLine={false}
                    width={150}
                  />
                  <Tooltip
                    formatter={(value: number) => [formatearMoneda(value, 2), 'Prima']}
                    cursor={{ fill: '#f3f4f6' }}
                  />
                  <Bar dataKey="prima" radius={[0, 4, 4, 0]}>
                    {datosGrafico.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.fill} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Tabla detallada */}
          <div className="card">
            <div className="card-header">
              <h3 className="font-semibold text-gray-900">Detalle Actuarial</h3>
              <p className="text-sm text-gray-500">
                Frecuencia × Severidad = Prima de Riesgo
              </p>
            </div>
            <div className="overflow-x-auto">
              <table>
                <thead>
                  <tr>
                    <th>Nivel</th>
                    <th className="text-right">Frecuencia</th>
                    <th className="text-right">Severidad</th>
                    <th className="text-right">Prima Anual</th>
                    <th className="text-right">% del Total</th>
                  </tr>
                </thead>
                <tbody>
                  {primasPorNivel.map((p) => (
                    <tr key={p.nivel} className="hover:bg-gray-50">
                      <td>
                        <div className="flex items-center gap-2">
                          <div
                            className="w-3 h-3 rounded-full"
                            style={{ backgroundColor: p.color }}
                          />
                          <div>
                            <span className="font-medium">{p.label}</span>
                            <p className="text-xs text-gray-500">{p.descripcion}</p>
                          </div>
                        </div>
                      </td>
                      <td className="text-right font-mono">
                        {formatearFrecuencia(p.frecuencia)}
                      </td>
                      <td className="text-right">
                        {formatearMoneda(p.severidad)}
                      </td>
                      <td className="text-right font-semibold">
                        {formatearMoneda(p.prima_anual, 2)}
                      </td>
                      <td className="text-right text-gray-500">
                        {((p.prima_anual / totales.primaAnualTotal) * 100).toFixed(1)}%
                      </td>
                    </tr>
                  ))}
                  {/* Total row */}
                  <tr className="bg-gray-50 font-semibold">
                    <td>
                      <span className="text-gray-900">TOTAL</span>
                    </td>
                    <td className="text-right">-</td>
                    <td className="text-right">-</td>
                    <td className="text-right text-blue-600">
                      {formatearMoneda(totales.primaAnualTotal, 2)}
                    </td>
                    <td className="text-right">100%</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          {/* Nota metodológica */}
          <div className="card bg-amber-50 border-amber-200">
            <div className="card-body">
              <div className="flex gap-3">
                <Info className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
                <div className="text-sm text-amber-800">
                  <p className="font-semibold mb-1">Nota Metodológica</p>
                  <ul className="list-disc list-inside space-y-1 text-amber-700">
                    <li>Prima de riesgo = Frecuencia × Severidad (metodología actuarial estándar)</li>
                    <li>Datos basados en experiencia 2020-2024 del sector GMM Colectivo</li>
                    <li>Montos ajustados por inflación médica a valores 2024</li>
                    <li>Esta es la prima pura de riesgo, sin gastos de administración ni margen</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
