'use client'

import { cn } from '@/lib/utils'
import { NIVEL_LABELS } from '@/lib/constants'

interface NivelToggleProps {
  seleccionados: number[]
  onChange: (nivel: number) => void
}

const NIVEL_STYLES: Record<number, string> = {
  1: 'bg-emerald-50 border-emerald-200 text-emerald-700',
  2: 'bg-amber-50 border-amber-200 text-amber-700',
  3: 'bg-rose-50 border-rose-200 text-rose-700',
}

/**
 * Botones toggle de nivel de clasificación
 */
export function NivelToggle({ seleccionados, onChange }: NivelToggleProps) {
  return (
    <div className="flex flex-wrap gap-2">
      {[1, 2, 3].map((nivel) => (
        <button
          key={nivel}
          onClick={() => onChange(nivel)}
          className={cn(
            'px-3 py-1.5 text-sm rounded-lg border transition-colors',
            seleccionados.includes(nivel)
              ? NIVEL_STYLES[nivel]
              : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
          )}
        >
          {NIVEL_LABELS[nivel]}
        </button>
      ))}
    </div>
  )
}
