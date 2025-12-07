'use client'

import { useState, useMemo } from 'react'
import {
  Users,
  DollarSign,
  TrendingUp,
  Filter,
  RefreshCw,
  PieChart as PieChartIcon,
} from 'lucide-react'
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from 'recharts'
import { cn } from '@/lib/utils'
import {
  UI_LABELS,
  formatearMoneda,
  formatearNumero,
  abreviarNumero,
} from '@/lib/constants'

// Importar datos JSON
import polizasData from '@/data/polizas-agregadas.json'
import resumenAnualData from '@/data/polizas-resumen-anual.json'
import polizasPorBandaData from '@/data/polizas-por-banda.json'

// Tipos
interface PolizaAgregada {
  anio: number
  edad: number
  sexo: string
  num_asegurados: number
  prima_emitida: number
  suma_asegurada: number
  prima_promedio: number
}

interface ResumenAnual {
  anio: number
  num_asegurados: number
  prima_emitida: number
  suma_asegurada: number
}

interface PolizaPorBanda {
  banda_edad: string
  num_asegurados: number
  prima_emitida: number
  pct_asegurados: number
}

interface FiltrosPolizas {
  anios: number[]
  edadMin: number
  edadMax: number
  sexo: 'Todos' | 'Masculino' | 'Femenino'
}

// Colores para gráficos
const COLORS = {
  masculino: '#3b82f6',
  femenino: '#ec4899',
  bandas: ['#22c55e', '#84cc16', '#eab308', '#f97316', '#ef4444'],
}

/**
 * Página del explorador de pólizas
 * Análisis del portafolio de asegurados GMM
 */
export default function PolizasPage() {
  const [filtros, setFiltros] = useState<FiltrosPolizas>({
    anios: [2020, 2021, 2022, 2023, 2024],
    edadMin: 25,
    edadMax: 70,
    sexo: 'Todos',
  })

  // Datos tipados
  const polizas = polizasData as PolizaAgregada[]
  const resumenAnual = resumenAnualData as ResumenAnual[]
  const polizasPorBanda = polizasPorBandaData as PolizaPorBanda[]

  // Filtrar datos
  const datosFiltrados = useMemo(() => {
    return polizas.filter((p) => {
      if (!filtros.anios.includes(p.anio)) return false
      if (p.edad < filtros.edadMin || p.edad > filtros.edadMax) return false
      if (filtros.sexo !== 'Todos' && p.sexo !== filtros.sexo) return false
      return true
    })
  }, [polizas, filtros])

  // Métricas
  const metricas = useMemo(() => {
    const totalAsegurados = datosFiltrados.reduce((sum, p) => sum + p.num_asegurados, 0)
    const primaTotal = datosFiltrados.reduce((sum, p) => sum + p.prima_emitida, 0)
    const primaPromedio = totalAsegurados > 0 ? primaTotal / totalAsegurados : 0

    // Por sexo
    const porSexo = ['Masculino', 'Femenino'].map((sexo) => {
      const datos = datosFiltrados.filter((p) => p.sexo === sexo)
      const asegurados = datos.reduce((sum, p) => sum + p.num_asegurados, 0)
      return {
        name: sexo,
        value: asegurados,
        pct: totalAsegurados > 0 ? (asegurados / totalAsegurados) * 100 : 0,
        fill: sexo === 'Masculino' ? COLORS.masculino : COLORS.femenino,
      }
    })

    return { totalAsegurados, primaTotal, primaPromedio, porSexo }
  }, [datosFiltrados])

  // Datos para gráfico de asegurados por edad
  const datosPorEdad = useMemo(() => {
    const edades = Array.from({ length: 46 }, (_, i) => i + 25)
    return edades.map((edad) => {
      const datosEdad = datosFiltrados.filter((p) => p.edad === edad)
      const masculino = datosEdad
        .filter((p) => p.sexo === 'Masculino')
        .reduce((sum, p) => sum + p.num_asegurados, 0)
      const femenino = datosEdad
        .filter((p) => p.sexo === 'Femenino')
        .reduce((sum, p) => sum + p.num_asegurados, 0)
      return { edad, masculino, femenino, total: masculino + femenino }
    })
  }, [datosFiltrados])

  // Datos para evolución anual (filtrado)
  const evolucionAnual = useMemo(() => {
    return resumenAnual
      .filter((r) => filtros.anios.includes(r.anio))
      .map((r) => ({
        ...r,
        prima_millones: r.prima_emitida / 1e6,
        asegurados_millones: r.num_asegurados / 1e6,
      }))
  }, [resumenAnual, filtros.anios])

  // Toggle año
  const toggleAnio = (anio: number) => {
    setFiltros((prev) => ({
      ...prev,
      anios: prev.anios.includes(anio)
        ? prev.anios.filter((a) => a !== anio)
        : [...prev.anios, anio],
    }))
  }

  return (
    <div className="p-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">
          {UI_LABELS.paginas.polizas.titulo}
        </h1>
        <p className="text-gray-500 mt-1">
          {UI_LABELS.paginas.polizas.subtitulo}
        </p>
      </div>

      {/* Filtros */}
      <div className="card mb-8">
        <div className="card-header flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Filter className="w-5 h-5 text-gray-500" />
            <span className="font-semibold">{UI_LABELS.filtros.titulo}</span>
          </div>
          <button
            onClick={() =>
              setFiltros({
                anios: [2020, 2021, 2022, 2023, 2024],
                edadMin: 25,
                edadMax: 70,
                sexo: 'Todos',
              })
            }
            className="flex items-center gap-1 text-sm text-gray-500 hover:text-gray-700"
          >
            <RefreshCw className="w-4 h-4" />
            {UI_LABELS.filtros.limpiar}
          </button>
        </div>
        <div className="card-body">
          {/* Primera fila: Año y Edad */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            {/* Filtro de Años */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {UI_LABELS.filtros.anio}
              </label>
              <div className="flex flex-wrap gap-2">
                {[2020, 2021, 2022, 2023, 2024].map((anio) => (
                  <button
                    key={anio}
                    onClick={() => toggleAnio(anio)}
                    className={cn(
                      'px-3 py-1.5 text-sm rounded-lg border transition-colors',
                      filtros.anios.includes(anio)
                        ? 'bg-blue-50 border-blue-200 text-blue-700'
                        : 'bg-white border-gray-200 text-gray-600 hover:bg-gray-50'
                    )}
                  >
                    {anio}
                  </button>
                ))}
              </div>
            </div>

            {/* Filtro de Edad */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {UI_LABELS.filtros.edad}: {filtros.edadMin} - {filtros.edadMax}
              </label>
              <div className="flex items-center gap-4 pr-4">
                <input
                  type="range"
                  min="25"
                  max="70"
                  value={filtros.edadMin}
                  onChange={(e) =>
                    setFiltros((prev) => ({
                      ...prev,
                      edadMin: Math.min(parseInt(e.target.value), prev.edadMax - 1),
                    }))
                  }
                  className="flex-1 accent-blue-600"
                />
                <input
                  type="range"
                  min="25"
                  max="70"
                  value={filtros.edadMax}
                  onChange={(e) =>
                    setFiltros((prev) => ({
                      ...prev,
                      edadMax: Math.max(parseInt(e.target.value), prev.edadMin + 1),
                    }))
                  }
                  className="flex-1 accent-blue-600"
                />
              </div>
            </div>
          </div>

          {/* Segunda fila: Sexo */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {UI_LABELS.filtros.sexo}
              </label>
              <select
                value={filtros.sexo}
                onChange={(e) =>
                  setFiltros((prev) => ({
                    ...prev,
                    sexo: e.target.value as 'Todos' | 'Masculino' | 'Femenino',
                  }))
                }
                className="w-full max-w-xs"
              >
                <option value="Todos">{UI_LABELS.sexo.todos}</option>
                <option value="Masculino">{UI_LABELS.sexo.masculino}</option>
                <option value="Femenino">{UI_LABELS.sexo.femenino}</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Tarjetas de Resumen */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        {/* Total Asegurados */}
        <div className="card card-body">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Total Asegurados</p>
              <p className="text-2xl font-bold text-gray-900 mt-1">
                {abreviarNumero(metricas.totalAsegurados)}
              </p>
            </div>
            <div className="w-12 h-12 bg-blue-50 rounded-lg flex items-center justify-center">
              <Users className="w-6 h-6 text-blue-600" />
            </div>
          </div>
        </div>

        {/* Prima Total */}
        <div className="card card-body">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Prima Emitida Total</p>
              <p className="text-2xl font-bold text-gray-900 mt-1">
                ${abreviarNumero(metricas.primaTotal)}
              </p>
            </div>
            <div className="w-12 h-12 bg-green-50 rounded-lg flex items-center justify-center">
              <DollarSign className="w-6 h-6 text-green-600" />
            </div>
          </div>
        </div>

        {/* Prima Promedio */}
        <div className="card card-body">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Prima Promedio</p>
              <p className="text-2xl font-bold text-gray-900 mt-1">
                {formatearMoneda(metricas.primaPromedio)}
              </p>
            </div>
            <div className="w-12 h-12 bg-purple-50 rounded-lg flex items-center justify-center">
              <TrendingUp className="w-6 h-6 text-purple-600" />
            </div>
          </div>
        </div>

        {/* Distribución por Sexo */}
        <div className="card card-body">
          <p className="text-sm text-gray-500 mb-3">Distribución por Sexo</p>
          <div className="space-y-2">
            {metricas.porSexo.map((s) => (
              <div key={s.name} className="flex items-center gap-2">
                <div
                  className="w-3 h-3 rounded-full"
                  style={{ backgroundColor: s.fill }}
                />
                <span className="text-xs text-gray-600 flex-1">{s.name}</span>
                <span className="text-xs font-medium text-gray-900">
                  {s.pct.toFixed(1)}%
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Gráficos */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        {/* Asegurados por Edad */}
        <div className="card">
          <div className="card-header">
            <h3 className="font-semibold text-gray-900">Asegurados por Edad</h3>
            <p className="text-sm text-gray-500">Distribución por sexo y edad</p>
          </div>
          <div className="card-body">
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={datosPorEdad}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis
                  dataKey="edad"
                  tick={{ fontSize: 10 }}
                  tickLine={false}
                  interval={4}
                />
                <YAxis
                  tick={{ fontSize: 12 }}
                  tickLine={false}
                  tickFormatter={(v) => abreviarNumero(v)}
                />
                <Tooltip
                  formatter={(value: number, name: string) => [formatearNumero(value), name]}
                  labelFormatter={(label) => `Edad: ${label}`}
                />
                <Legend />
                <Bar
                  dataKey="masculino"
                  name="Masculino"
                  stackId="a"
                  fill={COLORS.masculino}
                />
                <Bar
                  dataKey="femenino"
                  name="Femenino"
                  stackId="a"
                  fill={COLORS.femenino}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Distribución por Sexo (Pie) */}
        <div className="card">
          <div className="card-header">
            <h3 className="font-semibold text-gray-900">Distribución por Sexo</h3>
            <p className="text-sm text-gray-500">Proporción de asegurados</p>
          </div>
          <div className="card-body">
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={metricas.porSexo}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  paddingAngle={2}
                  dataKey="value"
                  label={({ name, pct }) => `${name}: ${pct.toFixed(1)}%`}
                >
                  {metricas.porSexo.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.fill} />
                  ))}
                </Pie>
                <Tooltip formatter={(value: number) => formatearNumero(value)} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Evolución Anual */}
        <div className="card lg:col-span-2">
          <div className="card-header">
            <h3 className="font-semibold text-gray-900">Evolución Anual</h3>
            <p className="text-sm text-gray-500">Prima emitida y asegurados por año</p>
          </div>
          <div className="card-body">
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={evolucionAnual}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis dataKey="anio" tick={{ fontSize: 12 }} tickLine={false} />
                <YAxis
                  yAxisId="left"
                  tick={{ fontSize: 12 }}
                  tickLine={false}
                  tickFormatter={(v) => `${v.toFixed(0)}M`}
                />
                <YAxis
                  yAxisId="right"
                  orientation="right"
                  tick={{ fontSize: 12 }}
                  tickLine={false}
                  tickFormatter={(v) => `$${v.toFixed(0)}M`}
                />
                <Tooltip
                  formatter={(value: number, name: string) => {
                    if (name === 'Asegurados (M)') return [`${value.toFixed(2)}M`, name]
                    return [`$${value.toFixed(0)}M`, name]
                  }}
                />
                <Legend />
                <Line
                  yAxisId="left"
                  type="monotone"
                  dataKey="asegurados_millones"
                  name="Asegurados (M)"
                  stroke={COLORS.masculino}
                  strokeWidth={2}
                  dot={{ r: 4 }}
                />
                <Line
                  yAxisId="right"
                  type="monotone"
                  dataKey="prima_millones"
                  name="Prima (M)"
                  stroke={COLORS.femenino}
                  strokeWidth={2}
                  dot={{ r: 4 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Tabla de datos */}
      <div className="card">
        <div className="card-header">
          <h3 className="font-semibold text-gray-900">Datos por Banda de Edad</h3>
          <p className="text-sm text-gray-500">Distribución del portafolio</p>
        </div>
        <div className="overflow-x-auto">
          <table>
            <thead>
              <tr>
                <th>Banda de Edad</th>
                <th className="text-right">Asegurados</th>
                <th className="text-right">% del Total</th>
                <th className="text-right">Prima Emitida</th>
              </tr>
            </thead>
            <tbody>
              {polizasPorBanda.map((row, i) => (
                <tr key={i} className="hover:bg-gray-50">
                  <td>
                    <div className="flex items-center gap-2">
                      <div
                        className="w-3 h-3 rounded-full"
                        style={{ backgroundColor: COLORS.bandas[i] }}
                      />
                      {row.banda_edad}
                    </div>
                  </td>
                  <td className="text-right">{formatearNumero(row.num_asegurados)}</td>
                  <td className="text-right">{row.pct_asegurados}%</td>
                  <td className="text-right">{formatearMoneda(row.prima_emitida)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
