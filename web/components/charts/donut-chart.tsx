'use client'

import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
} from 'recharts'
import { formatearNumero } from '@/lib/constants'

interface DonutData {
  name: string
  value: number
  fill: string
}

interface DonutChartProps {
  data: DonutData[]
  height?: number
}

/**
 * Gráfico de dona reutilizable
 * Usado en distribución por nivel y por sexo
 */
export function DonutChart({ data, height = 300 }: DonutChartProps) {
  return (
    <ResponsiveContainer width="100%" height={height}>
      <PieChart>
        <Pie
          data={data}
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
          {data.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={entry.fill} />
          ))}
        </Pie>
        <Tooltip formatter={(value: number) => formatearNumero(value)} />
      </PieChart>
    </ResponsiveContainer>
  )
}
