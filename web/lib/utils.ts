import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

/**
 * Combina clases de Tailwind de forma inteligente
 * Resuelve conflictos y elimina duplicados
 *
 * @example
 * cn('px-4 py-2', 'px-6') // => 'py-2 px-6'
 * cn('bg-red-500', isActive && 'bg-blue-500') // => 'bg-blue-500' si isActive
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
