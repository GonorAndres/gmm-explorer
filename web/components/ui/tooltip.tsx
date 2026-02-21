'use client'

import * as React from 'react'
import * as TooltipPrimitive from '@radix-ui/react-tooltip'

import { cn } from '@/lib/utils'

/**
 * Proveedor global de tooltips.
 * Envuelve la aplicacion para habilitar tooltips en todos los componentes hijos.
 */
const TooltipProvider = TooltipPrimitive.Provider

/**
 * Contenedor raiz del tooltip.
 * Gestiona el estado abierto/cerrado del tooltip.
 */
const Tooltip = TooltipPrimitive.Root

/**
 * Elemento que activa la aparicion del tooltip al interactuar.
 */
const TooltipTrigger = TooltipPrimitive.Trigger

/**
 * Contenido del tooltip con estilos corporativos.
 * Se posiciona automaticamente y aparece con animacion.
 */
const TooltipContent = React.forwardRef<
  React.ElementRef<typeof TooltipPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof TooltipPrimitive.Content>
>(({ className, sideOffset = 4, ...props }, ref) => (
  <TooltipPrimitive.Content
    ref={ref}
    sideOffset={sideOffset}
    className={cn(
      'z-50 overflow-hidden rounded-md bg-slate-900 px-3 py-1.5 text-sm text-white shadow-md',
      'animate-in fade-in-0 zoom-in-95',
      'data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95',
      'data-[side=bottom]:slide-in-from-top-2',
      'data-[side=left]:slide-in-from-right-2',
      'data-[side=right]:slide-in-from-left-2',
      'data-[side=top]:slide-in-from-bottom-2',
      className
    )}
    {...props}
  />
))
TooltipContent.displayName = TooltipPrimitive.Content.displayName

export { Tooltip, TooltipTrigger, TooltipContent, TooltipProvider }
