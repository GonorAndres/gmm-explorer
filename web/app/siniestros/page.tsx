'use client'

import { useState, useEffect, useMemo } from 'react'
import {
  BarChart3,
  TrendingUp,
  DollarSign,
  Activity,
  Filter,
  RefreshCw,
} from 'lucide-react'
import {
  LineChart,
  Line,
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
  NIVEL_LABELS,
  NIVEL_COLORS,
  formatearMoneda,
  formatearNumero,
  formatearFrecuencia,
  abreviarNumero,
} from '@/lib/constants'
import type {
  SiniestroAgregado,
  ResumenGeneral,
  PrimaNivelEdad,
  FiltrosSiniestros,
} from '@/types'

// Importar datos JSON estáticamente
import siniestrosData from '@/data/siniestros-agregados.json'
import resumenData from '@/data/resumen-general.json'
import primasData from '@/data/primas-nivel-edad.json'

/**
 * Página principal del explorador de siniestros
 *
 * Muestra:
 * - Tarjetas de resumen (total, monto, promedio, distribución)
 * - Filtros interactivos (edad, año, sexo, nivel)
 * - Tabla de datos agregados
 * - Gráficos de frecuencia, severidad y distribución
 */
export default function SiniestrosPage() {
  // Estado de filtros
  const [filtros, setFiltros] = useState<FiltrosSiniestros>({
    anios: [2020, 2021, 2022, 2023, 2024],
    edadMin: 25,
    edadMax: 70,
    sexo: 'Todos',
    niveles: [1, 2, 3],
    montoMin: 0,
    montoMax: 10000000,
  })

  // Datos tipados
  const siniestros = siniestrosData as SiniestroAgregado[]
  const resumen = resumenData as ResumenGeneral
  const primas = primasData as PrimaNivelEdad[]

  // Filtrar datos según selección
  const datosFiltrados = useMemo(() => {
    return siniestros.filter((s) => {
      if (!filtros.anios.includes(s.anio)) return false
      if (s.edad < filtros.edadMin || s.edad > filtros.edadMax) return false
      if (filtros.sexo !== 'Todos' && s.sexo !== filtros.sexo) return false
      if (!filtros.niveles.includes(s.nivel)) return false
      return true
    })
  }, [siniestros, filtros])

  // Calcular métricas filtradas
  const metricas = useMemo(() => {
    const totalSiniestros = datosFiltrados.reduce((sum, s) => sum + s.num_siniestros, 0)
    const montoTotal = datosFiltrados.reduce((sum, s) => sum + s.monto_ajustado, 0)
    const montoPromedio = totalSiniestros > 0 ? montoTotal / totalSiniestros : 0

    // Distribución por nivel
    const porNivel = [1, 2, 3].map((nivel) => {
      const datos = datosFiltrados.filter((s) => s.nivel === nivel)
      const siniestros = datos.reduce((sum, s) => sum + s.num_siniestros, 0)
      const monto = datos.reduce((sum, s) => sum + s.monto_ajustado, 0)
      return {
        nivel,
        descripcion: NIVEL_LABELS[nivel],
        siniestros,
        monto,
        pct: totalSiniestros > 0 ? (siniestros / totalSiniestros) * 100 : 0,
      }
    })

    return { totalSiniestros, montoTotal, montoPromedio, porNivel }
  }, [datosFiltrados])

  // Datos para gráfico de líneas (frecuencia por edad)
  const datosGraficoEdad = useMemo(() => {
    const edades = Array.from({ length: 46 }, (_, i) => i + 25)
    return edades.map((edad) => {
      const punto: Record<string, number> = { edad }
      ;[1, 2, 3].forEach((nivel) => {
        const prima = primas.find((p) => p.edad === edad && p.nivel === nivel)
        punto[`frecuencia${nivel}`] = prima ? prima.frecuencia * 100 : 0
        punto[`severidad${nivel}`] = prima ? prima.severidad : 0
        punto[`prima${nivel}`] = prima ? prima.prima_anual : 0
      })
      return punto
    })
  }, [primas])

  // Datos para pie chart
  const datosPie = metricas.porNivel.map((n) => ({
    name: n.descripcion,
    value: n.siniestros,
    fill: NIVEL_COLORS[n.nivel as 1 | 2 | 3],
  }))

  // Toggle de año
  const toggleAnio = (anio: number) => {
    setFiltros((prev) => ({
      ...prev,
      anios: prev.anios.includes(anio)
        ? prev.anios.filter((a) => a !== anio)
        : [...prev.anios, anio],
    }))
  }

  // Toggle de nivel
  const toggleNivel = (nivel: number) => {
    setFiltros((prev) => ({
      ...prev,
      niveles: prev.niveles.includes(nivel)
        ? prev.niveles.filter((n) => n !== nivel)
        : [...prev.niveles, nivel],
    }))
  }

  return (
    <div className="p-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">
          {UI_LABELS.paginas.siniestros.titulo}
        </h1>
        <p className="text-gray-500 mt-1">
          {UI_LABELS.paginas.siniestros.subtitulo}
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
                niveles: [1, 2, 3],
                montoMin: 0,
                montoMax: 10000000,
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

            {/* Filtro de Edad - más espacio */}
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

          {/* Segunda fila: Sexo y Nivel */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Filtro de Sexo */}
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

            {/* Filtro de Nivel */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {UI_LABELS.filtros.nivel}
              </label>
              <div className="flex flex-wrap gap-2">
                {[1, 2, 3].map((nivel) => (
                  <button
                    key={nivel}
                    onClick={() => toggleNivel(nivel)}
                    className={cn(
                      'px-3 py-1.5 text-sm rounded-lg border transition-colors',
                      filtros.niveles.includes(nivel)
                        ? nivel === 1
                          ? 'bg-green-50 border-green-200 text-green-700'
                          : nivel === 2
                          ? 'bg-yellow-50 border-yellow-200 text-yellow-700'
                          : 'bg-red-50 border-red-200 text-red-700'
                        : 'bg-white border-gray-200 text-gray-600 hover:bg-gray-50'
                    )}
                  >
                    {NIVEL_LABELS[nivel]}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Tarjetas de Resumen */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        {/* Total Siniestros */}
        <div className="card card-body">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">
                {UI_LABELS.tarjetas.totalSiniestros}
              </p>
              <p className="text-2xl font-bold text-gray-900 mt-1">
                {formatearNumero(metricas.totalSiniestros)}
              </p>
            </div>
            <div className="w-12 h-12 bg-blue-50 rounded-lg flex items-center justify-center">
              <BarChart3 className="w-6 h-6 text-blue-600" />
            </div>
          </div>
        </div>

        {/* Monto Total */}
        <div className="card card-body">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">
                {UI_LABELS.tarjetas.montoTotal}
              </p>
              <p className="text-2xl font-bold text-gray-900 mt-1">
                ${abreviarNumero(metricas.montoTotal)}
              </p>
            </div>
            <div className="w-12 h-12 bg-green-50 rounded-lg flex items-center justify-center">
              <DollarSign className="w-6 h-6 text-green-600" />
            </div>
          </div>
        </div>

        {/* Monto Promedio */}
        <div className="card card-body">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">
                {UI_LABELS.tarjetas.montoPromedio}
              </p>
              <p className="text-2xl font-bold text-gray-900 mt-1">
                {formatearMoneda(metricas.montoPromedio)}
              </p>
            </div>
            <div className="w-12 h-12 bg-purple-50 rounded-lg flex items-center justify-center">
              <TrendingUp className="w-6 h-6 text-purple-600" />
            </div>
          </div>
        </div>

        {/* Distribución por Nivel */}
        <div className="card card-body">
          <p className="text-sm text-gray-500 mb-3">
            {UI_LABELS.tarjetas.distribucion}
          </p>
          <div className="space-y-2">
            {metricas.porNivel.map((n) => (
              <div key={n.nivel} className="flex items-center gap-2">
                <div
                  className="w-3 h-3 rounded-full"
                  style={{ backgroundColor: NIVEL_COLORS[n.nivel as 1 | 2 | 3] }}
                />
                <span className="text-xs text-gray-600 flex-1">
                  {n.descripcion}
                </span>
                <span className="text-xs font-medium text-gray-900">
                  {n.pct.toFixed(1)}%
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Gráficos */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        {/* Frecuencia por Edad */}
        <div className="card">
          <div className="card-header">
            <h3 className="font-semibold text-gray-900">
              {UI_LABELS.graficos.frecuenciaPorEdad}
            </h3>
            <p className="text-sm text-gray-500">Porcentaje de siniestralidad por nivel</p>
          </div>
          <div className="card-body">
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={datosGraficoEdad}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis
                  dataKey="edad"
                  tick={{ fontSize: 12 }}
                  tickLine={false}
                />
                <YAxis
                  tick={{ fontSize: 12 }}
                  tickLine={false}
                  tickFormatter={(v) => `${v.toFixed(1)}%`}
                />
                <Tooltip
                  formatter={(value: number, name: string) => [`${value.toFixed(2)}%`, name]}
                  labelFormatter={(label) => `Edad: ${label}`}
                />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="frecuencia1"
                  name={NIVEL_LABELS[1]}
                  stroke={NIVEL_COLORS[1]}
                  strokeWidth={2}
                  dot={false}
                />
                <Line
                  type="monotone"
                  dataKey="frecuencia2"
                  name={NIVEL_LABELS[2]}
                  stroke={NIVEL_COLORS[2]}
                  strokeWidth={2}
                  dot={false}
                />
                <Line
                  type="monotone"
                  dataKey="frecuencia3"
                  name={NIVEL_LABELS[3]}
                  stroke={NIVEL_COLORS[3]}
                  strokeWidth={2}
                  dot={false}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Distribución por Nivel (Pie) */}
        <div className="card">
          <div className="card-header">
            <h3 className="font-semibold text-gray-900">
              {UI_LABELS.graficos.distribucionNivel}
            </h3>
            <p className="text-sm text-gray-500">Siniestros por clasificación</p>
          </div>
          <div className="card-body">
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={datosPie}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  paddingAngle={2}
                  dataKey="value"
                  label={({ name, percent }) =>
                    `${name}: ${(percent * 100).toFixed(1)}%`
                  }
                >
                  {datosPie.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.fill} />
                  ))}
                </Pie>
                <Tooltip formatter={(value: number) => formatearNumero(value)} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Prima de Riesgo por Edad */}
        <div className="card lg:col-span-2">
          <div className="card-header">
            <h3 className="font-semibold text-gray-900">
              {UI_LABELS.graficos.primaPorEdad}
            </h3>
            <p className="text-sm text-gray-500">Prima anual en pesos mexicanos</p>
          </div>
          <div className="card-body">
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={datosGraficoEdad}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis
                  dataKey="edad"
                  tick={{ fontSize: 12 }}
                  tickLine={false}
                />
                <YAxis
                  tick={{ fontSize: 12 }}
                  tickLine={false}
                  tickFormatter={(v) => `$${abreviarNumero(v)}`}
                />
                <Tooltip
                  formatter={(value: number, name: string) => [formatearMoneda(value), name]}
                  labelFormatter={(label) => `Edad: ${label}`}
                />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="prima1"
                  name={NIVEL_LABELS[1]}
                  stroke={NIVEL_COLORS[1]}
                  strokeWidth={2}
                  dot={false}
                />
                <Line
                  type="monotone"
                  dataKey="prima2"
                  name={NIVEL_LABELS[2]}
                  stroke={NIVEL_COLORS[2]}
                  strokeWidth={2}
                  dot={false}
                />
                <Line
                  type="monotone"
                  dataKey="prima3"
                  name={NIVEL_LABELS[3]}
                  stroke={NIVEL_COLORS[3]}
                  strokeWidth={2}
                  dot={false}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Tabla de datos */}
      <div className="card">
        <div className="card-header">
          <h3 className="font-semibold text-gray-900">Datos Agregados</h3>
          <p className="text-sm text-gray-500">
            Mostrando {Math.min(datosFiltrados.length, 50)} de {datosFiltrados.length} registros
          </p>
        </div>
        <div className="overflow-x-auto">
          <table>
            <thead>
              <tr>
                <th>{UI_LABELS.tabla.columnas.anio}</th>
                <th>{UI_LABELS.tabla.columnas.edad}</th>
                <th>{UI_LABELS.tabla.columnas.sexo}</th>
                <th>{UI_LABELS.tabla.columnas.nivel}</th>
                <th className="text-right">{UI_LABELS.tabla.columnas.numSiniestros}</th>
                <th className="text-right">{UI_LABELS.tabla.columnas.monto}</th>
                <th className="text-right">{UI_LABELS.tabla.columnas.severidad}</th>
              </tr>
            </thead>
            <tbody>
              {datosFiltrados.slice(0, 50).map((row, i) => (
                <tr key={i} className="hover:bg-gray-50">
                  <td>{row.anio}</td>
                  <td>{row.edad}</td>
                  <td>{row.sexo}</td>
                  <td>
                    <span className={`badge-nivel-${row.nivel}`}>
                      {NIVEL_LABELS[row.nivel]}
                    </span>
                  </td>
                  <td className="text-right">{formatearNumero(row.num_siniestros)}</td>
                  <td className="text-right">{formatearMoneda(row.monto_ajustado)}</td>
                  <td className="text-right">{formatearMoneda(row.severidad)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
