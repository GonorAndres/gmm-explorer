'use client'

import { useMemo, useCallback } from 'react'
import { FileSearch, BarChart3, DollarSign, TrendingUp, HelpCircle } from 'lucide-react'
import { PageHeader } from '@/components/ui/page-header'
import { MetricCard } from '@/components/ui/metric-card'
import { DistributionCard } from '@/components/ui/distribution-card'
import { ChartCard } from '@/components/ui/chart-card'
import { InsightPanel } from '@/components/ui/insight-panel'
import { FilterBar } from '@/components/filters/filter-bar'
import { NivelLineChart } from '@/components/charts/nivel-line-chart'
import { DonutChart } from '@/components/charts/donut-chart'
import { Tooltip, TooltipTrigger, TooltipContent, TooltipProvider } from '@/components/ui/tooltip'
import { useFilters } from '@/lib/hooks/use-filters'
import { TOOLTIPS, INSIGHT_PANELS } from '@/lib/content'
import {
  UI_LABELS,
  NIVEL_LABELS,
  NIVEL_COLORS,
  formatearMoneda,
  formatearNumero,
  abreviarNumero,
} from '@/lib/constants'
import type { SiniestroAgregado, PrimaNivelEdad, FiltrosSiniestros } from '@/types'
import { FILTROS_SINIESTROS_DEFAULT } from '@/types'

import siniestrosData from '@/data/siniestros-agregados.json'
import primasData from '@/data/primas-nivel-edad.json'

export default function SiniestrosPage() {
  const siniestros = siniestrosData as SiniestroAgregado[]
  const primas = primasData as PrimaNivelEdad[]

  const { filtros, setFiltros, toggleAnio, setEdadMin, setEdadMax, setSexo, resetFiltros } =
    useFilters<FiltrosSiniestros>(FILTROS_SINIESTROS_DEFAULT)

  const toggleNivel = useCallback(
    (nivel: number) => {
      setFiltros((prev) => ({
        ...prev,
        niveles: prev.niveles.includes(nivel)
          ? prev.niveles.filter((n) => n !== nivel)
          : [...prev.niveles, nivel],
      }))
    },
    [setFiltros]
  )

  // Filtrar datos segun seleccion
  const datosFiltrados = useMemo(() => {
    return siniestros.filter((s) => {
      if (!filtros.anios.includes(s.anio)) return false
      if (s.edad < filtros.edadMin || s.edad > filtros.edadMax) return false
      if (filtros.sexo !== 'Todos' && s.sexo !== filtros.sexo) return false
      if (!filtros.niveles.includes(s.nivel)) return false
      return true
    })
  }, [siniestros, filtros])

  // Calcular metricas filtradas
  const metricas = useMemo(() => {
    const totalSiniestros = datosFiltrados.reduce((sum, s) => sum + s.num_siniestros, 0)
    const montoTotal = datosFiltrados.reduce((sum, s) => sum + s.monto_ajustado, 0)
    const montoPromedio = totalSiniestros > 0 ? montoTotal / totalSiniestros : 0

    const porNivel = [1, 2, 3].map((nivel) => {
      const datos = datosFiltrados.filter((s) => s.nivel === nivel)
      const sin = datos.reduce((sum, s) => sum + s.num_siniestros, 0)
      return {
        nombre: NIVEL_LABELS[nivel],
        color: NIVEL_COLORS[nivel as 1 | 2 | 3],
        valor: sin,
        pct: totalSiniestros > 0 ? (sin / totalSiniestros) * 100 : 0,
      }
    })

    return { totalSiniestros, montoTotal, montoPromedio, porNivel }
  }, [datosFiltrados])

  // Datos para graficos de lineas (promediar sexos para vista "Todos")
  const datosGraficoEdad = useMemo(() => {
    const edades = Array.from({ length: 46 }, (_, i) => i + 25)
    return edades.map((edad) => {
      const punto: Record<string, number> = { edad }
      ;[1, 2, 3].forEach((nivel) => {
        const primasNivel = primas.filter((p) => p.edad === edad && p.nivel === nivel)
        if (primasNivel.length > 0) {
          const avgFrec = primasNivel.reduce((s, p) => s + p.frecuencia, 0) / primasNivel.length
          const avgSev = primasNivel.reduce((s, p) => s + p.severidad, 0) / primasNivel.length
          const avgPrima = primasNivel.reduce((s, p) => s + p.prima_anual, 0) / primasNivel.length
          punto[`frecuencia${nivel}`] = avgFrec * 100
          punto[`severidad${nivel}`] = avgSev
          punto[`prima${nivel}`] = avgPrima
        } else {
          punto[`frecuencia${nivel}`] = 0
          punto[`severidad${nivel}`] = 0
          punto[`prima${nivel}`] = 0
        }
      })
      return punto
    })
  }, [primas])

  // Datos para pie chart
  const datosPie = metricas.porNivel.map((n) => ({
    name: n.nombre,
    value: n.valor,
    fill: n.color,
  }))

  // Helper para tooltip con icono de ayuda
  const InfoTip = ({ texto }: { texto: string }) => (
    <Tooltip>
      <TooltipTrigger asChild>
        <HelpCircle className="w-4 h-4 text-slate-400 inline-block ml-1 cursor-help" />
      </TooltipTrigger>
      <TooltipContent className="max-w-xs text-xs">{texto}</TooltipContent>
    </Tooltip>
  )

  return (
    <TooltipProvider>
      <div className="p-8">
        <PageHeader
          titulo={UI_LABELS.paginas.siniestros.titulo}
          subtitulo={UI_LABELS.paginas.siniestros.subtitulo}
          icono={FileSearch}
        />

        <FilterBar
          anios={filtros.anios}
          edadMin={filtros.edadMin}
          edadMax={filtros.edadMax}
          sexo={filtros.sexo}
          niveles={filtros.niveles}
          onToggleAnio={toggleAnio}
          onEdadMinChange={setEdadMin}
          onEdadMaxChange={setEdadMax}
          onSexoChange={setSexo}
          onToggleNivel={toggleNivel}
          onReset={resetFiltros}
          config={{ mostrarNivel: true }}
        />

        {/* Tarjetas de resumen */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="relative">
            <MetricCard
              etiqueta={UI_LABELS.tarjetas.totalSiniestros}
              valor={formatearNumero(metricas.totalSiniestros)}
              icono={BarChart3}
            />
            <span className="absolute top-3 right-3"><InfoTip texto={TOOLTIPS.siniestros.frecuencia} /></span>
          </div>
          <div className="relative">
            <MetricCard
              etiqueta={UI_LABELS.tarjetas.montoTotal}
              valor={`$${abreviarNumero(metricas.montoTotal)}`}
              icono={DollarSign}
              colorIcono="bg-green-50 text-green-600"
            />
            <span className="absolute top-3 right-3"><InfoTip texto={TOOLTIPS.siniestros.montoAjustado} /></span>
          </div>
          <div className="relative">
            <MetricCard
              etiqueta={UI_LABELS.tarjetas.montoPromedio}
              valor={formatearMoneda(metricas.montoPromedio)}
              icono={TrendingUp}
              colorIcono="bg-purple-50 text-purple-600"
            />
            <span className="absolute top-3 right-3"><InfoTip texto={TOOLTIPS.siniestros.severidad} /></span>
          </div>
          <DistributionCard
            etiqueta={UI_LABELS.tarjetas.distribucion}
            items={metricas.porNivel}
          />
        </div>

        {/* Graficos */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          <ChartCard
            titulo={UI_LABELS.graficos.frecuenciaPorEdad}
            subtitulo="Porcentaje de siniestralidad por nivel"
          >
            <NivelLineChart
              data={datosGraficoEdad}
              dataKeyPrefix="frecuencia"
              yAxisFormatter={(v) => `${v.toFixed(1)}%`}
              tooltipFormatter={(value: number, name: string) => [`${value.toFixed(2)}%`, name]}
            />
          </ChartCard>

          <ChartCard
            titulo={UI_LABELS.graficos.distribucionNivel}
            subtitulo="Siniestros por clasificación"
          >
            <DonutChart data={datosPie} />
          </ChartCard>

          <ChartCard
            titulo={UI_LABELS.graficos.primaPorEdad}
            subtitulo="Prima anual en pesos mexicanos"
            className="lg:col-span-2"
          >
            <NivelLineChart
              data={datosGraficoEdad}
              dataKeyPrefix="prima"
              yAxisFormatter={(v) => `$${abreviarNumero(v)}`}
              tooltipFormatter={(value: number, name: string) => [formatearMoneda(value), name]}
            />
          </ChartCard>
        </div>

        {/* Paneles de insight */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <InsightPanel titulo={INSIGHT_PANELS.siniestros.distribucionNivel.titulo}>
            <p>{INSIGHT_PANELS.siniestros.distribucionNivel.contenido}</p>
          </InsightPanel>
          <InsightPanel titulo={INSIGHT_PANELS.siniestros.curvaFrecuencia.titulo}>
            <p>{INSIGHT_PANELS.siniestros.curvaFrecuencia.contenido}</p>
          </InsightPanel>
        </div>

        {/* Tabla de datos */}
        <ChartCard titulo="Datos Agregados" subtitulo={`Mostrando ${Math.min(datosFiltrados.length, 50)} de ${datosFiltrados.length} registros`}>
          <div className="-mx-6 -mb-6 overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-slate-100 bg-slate-50">
                  {[UI_LABELS.tabla.columnas.anio, UI_LABELS.tabla.columnas.edad, UI_LABELS.tabla.columnas.sexo, UI_LABELS.tabla.columnas.nivel].map((col) => (
                    <th key={col} className="px-4 py-3 text-left text-xs font-medium text-slate-500 uppercase">{col}</th>
                  ))}
                  {[UI_LABELS.tabla.columnas.numSiniestros, UI_LABELS.tabla.columnas.monto, UI_LABELS.tabla.columnas.severidad].map((col) => (
                    <th key={col} className="px-4 py-3 text-right text-xs font-medium text-slate-500 uppercase">{col}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {datosFiltrados.slice(0, 50).map((row, i) => (
                  <tr key={i} className="border-b border-slate-50 hover:bg-slate-50">
                    <td className="px-4 py-3 text-slate-700">{row.anio}</td>
                    <td className="px-4 py-3 text-slate-700">{row.edad}</td>
                    <td className="px-4 py-3 text-slate-700">{row.sexo}</td>
                    <td className="px-4 py-3">
                      <span className={`badge-nivel-${row.nivel}`}>{NIVEL_LABELS[row.nivel]}</span>
                    </td>
                    <td className="px-4 py-3 text-right text-slate-700">{formatearNumero(row.num_siniestros)}</td>
                    <td className="px-4 py-3 text-right text-slate-700">{formatearMoneda(row.monto_ajustado)}</td>
                    <td className="px-4 py-3 text-right text-slate-700">{formatearMoneda(row.severidad)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </ChartCard>
      </div>
    </TooltipProvider>
  )
}
