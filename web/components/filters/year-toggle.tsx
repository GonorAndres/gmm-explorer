'use client'

import { cn } from '@/lib/utils'

interface YearToggleProps {
  anios: number[]
  seleccionados: number[]
  onChange: (anio: number) => void
}

/**
 * Botones toggle de año
 */
export function YearToggle({ anios, seleccionados, onChange }: YearToggleProps) {
  return (
    <div className="flex flex-wrap gap-2">
      {anios.map((anio) => (
        <button
          key={anio}
          onClick={() => onChange(anio)}
          className={cn(
            'px-3 py-1.5 text-sm rounded-lg border transition-colors',
            seleccionados.includes(anio)
              ? 'bg-blue-50 border-blue-200 text-blue-700 font-medium'
              : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
          )}
        >
          {anio}
        </button>
      ))}
    </div>
  )
}
