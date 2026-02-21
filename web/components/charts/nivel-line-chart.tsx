'use client'

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts'
import { NIVEL_LABELS, NIVEL_COLORS, CHART_CONFIG } from '@/lib/constants'

interface NivelLineChartProps {
  data: Record<string, number>[]
  dataKeyPrefix: string
  yAxisFormatter: (v: number) => string
  tooltipFormatter: (value: number, name: string) => [string, string]
  height?: number
}

/**
 * Gráfico de líneas por nivel (3 series: ambulatorio, hospitalario, alta especialidad)
 * Reutilizado en frecuencia, severidad y prima por edad
 */
export function NivelLineChart({
  data,
  dataKeyPrefix,
  yAxisFormatter,
  tooltipFormatter,
  height = 300,
}: NivelLineChartProps) {
  return (
    <ResponsiveContainer width="100%" height={height}>
      <LineChart data={data} margin={CHART_CONFIG.margen}>
        <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
        <XAxis
          dataKey="edad"
          tick={{ fontSize: 12, fill: '#64748b' }}
          tickLine={false}
        />
        <YAxis
          tick={{ fontSize: 12, fill: '#64748b' }}
          tickLine={false}
          tickFormatter={yAxisFormatter}
        />
        <Tooltip
          formatter={tooltipFormatter}
          labelFormatter={(label) => `Edad: ${label}`}
          contentStyle={CHART_CONFIG.tooltipStyle}
        />
        <Legend />
        {[1, 2, 3].map((nivel) => (
          <Line
            key={nivel}
            type="monotone"
            dataKey={`${dataKeyPrefix}${nivel}`}
            name={NIVEL_LABELS[nivel]}
            stroke={NIVEL_COLORS[nivel]}
            strokeWidth={2}
            dot={false}
          />
        ))}
      </LineChart>
    </ResponsiveContainer>
  )
}
