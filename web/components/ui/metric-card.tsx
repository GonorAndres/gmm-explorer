import type { LucideIcon } from 'lucide-react'
import { cn } from '@/lib/utils'

interface MetricCardProps {
  etiqueta: string
  valor: string
  icono: LucideIcon
  colorIcono?: string
  subtitulo?: string
}

/**
 * Tarjeta de métrica individual
 * Reemplaza los 6+ cards de resumen duplicados
 */
export function MetricCard({
  etiqueta,
  valor,
  icono: Icono,
  colorIcono = 'bg-blue-50 text-blue-600',
  subtitulo,
}: MetricCardProps) {
  const [bgColor, textColor] = colorIcono.split(' ')

  return (
    <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-slate-500">{etiqueta}</p>
          <p className="text-2xl font-bold text-slate-900 mt-1">{valor}</p>
          {subtitulo && (
            <p className="text-xs text-slate-400 mt-1">{subtitulo}</p>
          )}
        </div>
        <div className={cn('w-12 h-12 rounded-lg flex items-center justify-center', bgColor)}>
          <Icono className={cn('w-6 h-6', textColor)} />
        </div>
      </div>
    </div>
  )
}
