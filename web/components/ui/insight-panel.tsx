'use client'

import { useState } from 'react'
import { ChevronDown, Lightbulb } from 'lucide-react'
import { cn } from '@/lib/utils'
import type { LucideIcon } from 'lucide-react'

interface InsightPanelProps {
  titulo: string
  children: React.ReactNode
  icono?: LucideIcon
  defaultAbierto?: boolean
}

/**
 * Panel colapsable de explicación contextual
 * Usado para contenido educativo en español a lo largo de la app
 */
export function InsightPanel({
  titulo,
  children,
  icono: Icono = Lightbulb,
  defaultAbierto = false,
}: InsightPanelProps) {
  const [abierto, setAbierto] = useState(defaultAbierto)

  return (
    <div className="bg-blue-50/50 border border-blue-100 rounded-xl overflow-hidden">
      <button
        onClick={() => setAbierto(!abierto)}
        className="w-full flex items-center gap-3 px-5 py-4 text-left hover:bg-blue-50/80 transition-colors"
      >
        <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
          <Icono className="w-4 h-4 text-blue-700" />
        </div>
        <span className="font-medium text-slate-800 flex-1 text-sm">{titulo}</span>
        <ChevronDown
          className={cn(
            'w-4 h-4 text-slate-400 transition-transform duration-200',
            abierto && 'rotate-180'
          )}
        />
      </button>
      {abierto && (
        <div className="px-5 pb-4 pt-0 text-sm text-slate-600 leading-relaxed">
          <div className="pl-11">{children}</div>
        </div>
      )}
    </div>
  )
}
