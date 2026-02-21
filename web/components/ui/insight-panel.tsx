'use client'

import { useState } from 'react'
import { ChevronRight, Lightbulb } from 'lucide-react'
import { cn } from '@/lib/utils'
import type { LucideIcon } from 'lucide-react'

interface InsightPanelProps {
  titulo: string
  children: React.ReactNode
  icono?: LucideIcon
  defaultAbierto?: boolean
}

/**
 * Panel colapsable de explicacion contextual
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
    <div className={cn(
      'border rounded-xl overflow-hidden transition-colors duration-200',
      abierto
        ? 'bg-blue-50/70 border-blue-200'
        : 'bg-blue-50/50 border-blue-100 hover:border-blue-200 hover:bg-blue-50/80'
    )}>
      <button
        onClick={() => setAbierto(!abierto)}
        className="w-full flex items-center gap-3 px-5 py-4 text-left group cursor-pointer"
      >
        <div className={cn(
          'w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 transition-colors duration-200',
          abierto ? 'bg-blue-200' : 'bg-blue-100 group-hover:bg-blue-200'
        )}>
          <Icono className="w-4 h-4 text-blue-700" />
        </div>
        <span className="font-medium text-slate-800 flex-1 text-sm">{titulo}</span>
        {!abierto && (
          <span className="text-xs text-blue-600/70 font-medium mr-1 hidden sm:inline">
            Ver mas
          </span>
        )}
        <ChevronRight
          className={cn(
            'w-4 h-4 text-blue-500 transition-transform duration-200 flex-shrink-0',
            abierto && 'rotate-90'
          )}
        />
      </button>
      <div className={cn(
        'grid transition-all duration-200 ease-in-out',
        abierto ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'
      )}>
        <div className="overflow-hidden">
          <div className="px-5 pb-4 pt-0 text-sm text-slate-600 leading-relaxed">
            <div className="pl-11">{children}</div>
          </div>
        </div>
      </div>
    </div>
  )
}
