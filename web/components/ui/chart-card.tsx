import { cn } from '@/lib/utils'

interface ChartCardProps {
  titulo: string
  subtitulo?: string
  children: React.ReactNode
  className?: string
}

/**
 * Wrapper para gráficos con card + header + body
 * Reemplaza 5+ wrappers duplicados de chart
 */
export function ChartCard({ titulo, subtitulo, children, className }: ChartCardProps) {
  return (
    <div className={cn('bg-white rounded-xl border border-slate-200 shadow-sm', className)}>
      <div className="px-6 py-4 border-b border-slate-100">
        <h3 className="font-semibold text-slate-900">{titulo}</h3>
        {subtitulo && (
          <p className="text-sm text-slate-500">{subtitulo}</p>
        )}
      </div>
      <div className="p-6">
        {children}
      </div>
    </div>
  )
}
