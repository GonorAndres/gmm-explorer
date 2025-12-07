'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
  FileSearch,
  FileText,
  BookOpen,
  Calculator,
  Activity,
  Github,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { NAV_ITEMS } from '@/lib/constants'

/**
 * Mapeo de nombres de iconos a componentes de Lucide
 */
const ICONOS: Record<string, React.ElementType> = {
  FileSearch,
  FileText,
  BookOpen,
  Calculator,
}

/**
 * Sidebar de navegación principal
 *
 * Muestra los 5 módulos del sistema:
 * - Explorador de Siniestros
 * - Explorador de Pólizas
 * - Metodología
 * - Tarificador
 * - Contexto (Nota Técnica)
 */
export function Sidebar() {
  const pathname = usePathname()

  return (
    <aside className="w-64 bg-white border-r border-gray-200 h-screen flex flex-col sticky top-0">
      {/* Logo y título */}
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
            <Activity className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="font-bold text-gray-900">Explorador GMM</h1>
            <p className="text-xs text-gray-500">Proyecto Escolar • AAR 2026-1</p>
          </div>
        </div>
      </div>

      {/* Navegación */}
      <nav className="flex-1 p-4">
        <ul className="space-y-1">
          {NAV_ITEMS.map((item) => {
            const Icono = ICONOS[item.icono] || FileSearch
            const isActive = pathname === item.href ||
              (item.href !== '/' && pathname?.startsWith(item.href))

            return (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className={cn(
                    'flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors',
                    isActive
                      ? 'bg-blue-50 text-blue-700 border border-blue-200'
                      : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                  )}
                >
                  <Icono className="w-5 h-5" />
                  <span>{item.titulo}</span>
                </Link>
              </li>
            )
          })}
        </ul>
      </nav>

      {/* Footer del sidebar */}
      <div className="p-4 border-t border-gray-200 space-y-3">
        <div className="bg-gray-50 rounded-lg p-4">
          <p className="text-xs text-gray-500 mb-2">Versión 1.0</p>
          <p className="text-xs text-gray-400">
            Sistema de clasificación y tarificación de siniestros GMM
          </p>
        </div>
        <a
          href="https://github.com/GonorAndres"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-2 text-xs text-gray-500 hover:text-gray-700 transition-colors"
        >
          <Github className="w-4 h-4" />
          <span>Sugerencias y aportaciones</span>
        </a>
      </div>
    </aside>
  )
}
