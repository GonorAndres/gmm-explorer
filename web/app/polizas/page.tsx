'use client'

import { useMemo } from 'react'
import { FileText, Users, DollarSign, TrendingUp } from 'lucide-react'
import {
  LineChart, Line, BarChart, Bar, XAxis, YAxis,
  CartesianGrid, Tooltip, Legend, ResponsiveContainer,
} from 'recharts'
import { UI_LABELS, formatearMoneda, formatearNumero, abreviarNumero } from '@/lib/constants'
import { INSIGHT_PANELS } from '@/lib/content'
import { useFilters } from '@/lib/hooks/use-filters'
import { PageHeader } from '@/components/ui/page-header'
import { MetricCard } from '@/components/ui/metric-card'
import { DistributionCard } from '@/components/ui/distribution-card'
import { ChartCard } from '@/components/ui/chart-card'
import { InsightPanel } from '@/components/ui/insight-panel'
import { FilterBar } from '@/components/filters/filter-bar'
import { DonutChart } from '@/components/charts/donut-chart'
import type { PolizaAgregada, ResumenAnual, PolizaPorBanda, FiltrosPolizas } from '@/types'
import { FILTROS_POLIZAS_DEFAULT } from '@/types'

import polizasData from '@/data/polizas-agregadas.json'
import resumenAnualData from '@/data/polizas-resumen-anual.json'
import polizasPorBandaData from '@/data/polizas-por-banda.json'

const COLORS = {
  masculino: '#2563eb',
  femenino: '#db2777',
  bandas: ['#22c55e', '#84cc16', '#eab308', '#f97316', '#ef4444'],
}

export default function PolizasPage() {
  const { filtros, toggleAnio, setEdadMin, setEdadMax, setSexo, resetFiltros } =
    useFilters<FiltrosPolizas>(FILTROS_POLIZAS_DEFAULT)

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

  // Metricas
  const metricas = useMemo(() => {
    const totalAsegurados = datosFiltrados.reduce((s, p) => s + p.num_asegurados, 0)
    const primaTotal = datosFiltrados.reduce((s, p) => s + p.prima_emitida, 0)
    const primaPromedio = totalAsegurados > 0 ? primaTotal / totalAsegurados : 0

    const porSexo = ['Masculino', 'Femenino'].map((sexo) => {
      const aseg = datosFiltrados.filter((p) => p.sexo === sexo)
        .reduce((s, p) => s + p.num_asegurados, 0)
      return {
        nombre: sexo,
        color: sexo === 'Masculino' ? COLORS.masculino : COLORS.femenino,
        valor: aseg,
        pct: totalAsegurados > 0 ? (aseg / totalAsegurados) * 100 : 0,
      }
    })

    const porSexoDonut = porSexo.map((s) => ({
      name: s.nombre, value: s.valor, fill: s.color,
    }))

    return { totalAsegurados, primaTotal, primaPromedio, porSexo, porSexoDonut }
  }, [datosFiltrados])

  // Asegurados por edad y sexo
  const datosPorEdad = useMemo(() => {
    const edades = Array.from({ length: 46 }, (_, i) => i + 25)
    return edades.map((edad) => {
      const de = datosFiltrados.filter((p) => p.edad === edad)
      const masculino = de.filter((p) => p.sexo === 'Masculino').reduce((s, p) => s + p.num_asegurados, 0)
      const femenino = de.filter((p) => p.sexo === 'Femenino').reduce((s, p) => s + p.num_asegurados, 0)
      return { edad, masculino, femenino }
    })
  }, [datosFiltrados])

  // Evolucion anual
  const evolucionAnual = useMemo(() => {
    return resumenAnual
      .filter((r) => filtros.anios.includes(r.anio))
      .map((r) => ({
        ...r,
        prima_millones: r.prima_emitida / 1e6,
        asegurados_millones: r.num_asegurados / 1e6,
      }))
  }, [resumenAnual, filtros.anios])

  return (
    <div className="p-8">
      <PageHeader
        titulo={UI_LABELS.paginas.polizas.titulo}
        subtitulo={UI_LABELS.paginas.polizas.subtitulo}
        icono={FileText}
      />

      <FilterBar
        anios={filtros.anios}
        edadMin={filtros.edadMin}
        edadMax={filtros.edadMax}
        sexo={filtros.sexo}
        onToggleAnio={toggleAnio}
        onEdadMinChange={setEdadMin}
        onEdadMaxChange={setEdadMax}
        onSexoChange={setSexo}
        onReset={resetFiltros}
        config={{ mostrarNivel: false }}
      />

      {/* Tarjetas de metricas */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <MetricCard etiqueta="Total Asegurados" valor={abreviarNumero(metricas.totalAsegurados)} icono={Users} />
        <MetricCard etiqueta="Prima Emitida Total" valor={`$${abreviarNumero(metricas.primaTotal)}`} icono={DollarSign} colorIcono="bg-green-50 text-green-600" />
        <MetricCard etiqueta="Prima Promedio" valor={formatearMoneda(metricas.primaPromedio)} icono={TrendingUp} colorIcono="bg-purple-50 text-purple-600" />
        <DistributionCard etiqueta="Distribucion por Sexo" items={metricas.porSexo} />
      </div>

      {/* Graficos */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        <ChartCard titulo="Asegurados por Edad" subtitulo="Distribucion por sexo y edad">
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={datosPorEdad}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis dataKey="edad" tick={{ fontSize: 10 }} tickLine={false} interval={4} />
              <YAxis tick={{ fontSize: 12 }} tickLine={false} tickFormatter={(v) => abreviarNumero(v)} />
              <Tooltip formatter={(value: number, name: string) => [formatearNumero(value), name]} labelFormatter={(l) => `Edad: ${l}`} />
              <Legend />
              <Bar dataKey="masculino" name="Masculino" stackId="a" fill={COLORS.masculino} />
              <Bar dataKey="femenino" name="Femenino" stackId="a" fill={COLORS.femenino} />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>

        <ChartCard titulo="Distribucion por Sexo" subtitulo="Proporcion de asegurados">
          <DonutChart data={metricas.porSexoDonut} />
        </ChartCard>

        <ChartCard titulo="Evolucion Anual" subtitulo="Prima emitida y asegurados por ano" className="lg:col-span-2">
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={evolucionAnual}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis dataKey="anio" tick={{ fontSize: 12 }} tickLine={false} />
              <YAxis yAxisId="left" tick={{ fontSize: 12 }} tickLine={false} tickFormatter={(v) => `${v.toFixed(0)}M`} />
              <YAxis yAxisId="right" orientation="right" tick={{ fontSize: 12 }} tickLine={false} tickFormatter={(v) => `$${v.toFixed(0)}M`} />
              <Tooltip formatter={(value: number, name: string) => {
                if (name === 'Asegurados (M)') return [`${value.toFixed(2)}M`, name]
                return [`$${value.toFixed(0)}M`, name]
              }} />
              <Legend />
              <Line yAxisId="left" type="monotone" dataKey="asegurados_millones" name="Asegurados (M)" stroke={COLORS.masculino} strokeWidth={2} dot={{ r: 4 }} />
              <Line yAxisId="right" type="monotone" dataKey="prima_millones" name="Prima (M)" stroke={COLORS.femenino} strokeWidth={2} dot={{ r: 4 }} />
            </LineChart>
          </ResponsiveContainer>
        </ChartCard>
      </div>

      {/* Panel de insight */}
      <div className="mb-8">
        <InsightPanel titulo={INSIGHT_PANELS.polizas.estructuraPortafolio.titulo}>
          <p>{INSIGHT_PANELS.polizas.estructuraPortafolio.contenido}</p>
        </InsightPanel>
      </div>

      {/* Tabla por banda de edad */}
      <ChartCard titulo="Datos por Banda de Edad" subtitulo="Distribucion del portafolio">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr>
                <th className="text-left text-sm font-medium text-slate-500 pb-3">Banda de Edad</th>
                <th className="text-right text-sm font-medium text-slate-500 pb-3">Asegurados</th>
                <th className="text-right text-sm font-medium text-slate-500 pb-3">% del Total</th>
                <th className="text-right text-sm font-medium text-slate-500 pb-3">Prima Emitida</th>
              </tr>
            </thead>
            <tbody>
              {polizasPorBanda.map((row, i) => (
                <tr key={i} className="border-t border-slate-100 hover:bg-slate-50">
                  <td className="py-3 text-sm">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full flex-shrink-0" style={{ backgroundColor: COLORS.bandas[i] }} />
                      {row.banda_edad}
                    </div>
                  </td>
                  <td className="py-3 text-sm text-right">{formatearNumero(row.num_asegurados)}</td>
                  <td className="py-3 text-sm text-right">{row.pct_asegurados}%</td>
                  <td className="py-3 text-sm text-right">{formatearMoneda(row.prima_emitida)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </ChartCard>
    </div>
  )
}
