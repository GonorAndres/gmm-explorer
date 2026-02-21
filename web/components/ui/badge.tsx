import * as React from 'react'
import { cva, type VariantProps } from 'class-variance-authority'

import { cn } from '@/lib/utils'

/**
 * Variantes del badge.
 * - default: gris oscuro (uso general)
 * - nivel1: esmeralda (ambulatorio/prevencion)
 * - nivel2: ambar (hospital/cirugia programada)
 * - nivel3: rosa (alta especialidad/emergencias)
 * - outline: solo borde, sin fondo
 */
const badgeVariants = cva(
  'inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-slate-950 focus:ring-offset-2',
  {
    variants: {
      variant: {
        default:
          'border-transparent bg-slate-900 text-white hover:bg-slate-900/80',
        nivel1:
          'border-transparent bg-emerald-100 text-emerald-800 hover:bg-emerald-100/80',
        nivel2:
          'border-transparent bg-amber-100 text-amber-800 hover:bg-amber-100/80',
        nivel3:
          'border-transparent bg-rose-100 text-rose-800 hover:bg-rose-100/80',
        outline: 'text-slate-950 border-slate-200',
      },
    },
    defaultVariants: {
      variant: 'default',
    },
  }
)

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

/**
 * Componente badge para etiquetas y estados.
 * Soporta variantes por nivel de clasificacion actuarial.
 */
function Badge({ className, variant, ...props }: BadgeProps) {
  return (
    <div className={cn(badgeVariants({ variant }), className)} {...props} />
  )
}

export { Badge, badgeVariants }
