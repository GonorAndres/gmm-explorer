'use client'

import { cn } from '@/lib/utils'

interface ClaudeBadgeProps {
  className?: string
  variante?: 'default' | 'compact' | 'inline'
}

/**
 * Badge "Clasificado con Claude" reutilizable
 * Estilo sutil que se integra con el design system existente
 */
export function ClaudeBadge({ className, variante = 'default' }: ClaudeBadgeProps) {
  if (variante === 'inline') {
    return (
      <span
        className={cn(
          'inline-flex items-center gap-1 text-xs font-medium text-amber-700 bg-amber-50 px-2 py-0.5 rounded-full border border-amber-200',
          className
        )}
      >
        <ClaudeIcon className="w-3 h-3" />
        Claude
      </span>
    )
  }

  if (variante === 'compact') {
    return (
      <div
        className={cn(
          'inline-flex items-center gap-1.5 text-xs text-slate-500',
          className
        )}
      >
        <ClaudeIcon className="w-3.5 h-3.5 text-amber-600" />
        <span>Clasificado con Claude</span>
      </div>
    )
  }

  return (
    <div
      className={cn(
        'inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-200/60',
        className
      )}
    >
      <ClaudeIcon className="w-4 h-4 text-amber-600" />
      <span className="text-sm font-medium text-amber-800">
        Clasificado con Claude
      </span>
    </div>
  )
}

/**
 * Icono simplificado de Claude (asterisco estilizado)
 */
function ClaudeIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83" />
    </svg>
  )
}
