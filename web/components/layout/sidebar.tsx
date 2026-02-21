'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
  FileSearch,
  FileText,
  BookOpen,
  Calculator,
  Activity,
  Github,
  Menu,
  X,
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
 * Sidebar de navegación -- estilo corporativo navy
 */
export function Sidebar() {
  const pathname = usePathname()
  const [isOpen, setIsOpen] = useState(false)

  const toggleSidebar = () => setIsOpen(!isOpen)
  const closeSidebar = () => setIsOpen(false)

  return (
    <>
      {/* Botón hamburguesa - Solo visible en móvil */}
      <button
        onClick={toggleSidebar}
        className="lg:hidden fixed top-4 left-4 z-50 p-2 bg-slate-800 rounded-lg shadow-md hover:bg-slate-700 transition-colors"
        aria-label="Abrir menu"
      >
        {isOpen ? (
          <X className="w-6 h-6 text-white" />
        ) : (
          <Menu className="w-6 h-6 text-white" />
        )}
      </button>

      {/* Overlay - Solo visible en móvil cuando está abierto */}
      {isOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-black/50 z-40"
          onClick={closeSidebar}
        />
      )}

      {/* Sidebar */}
      <aside
        className={cn(
          'w-64 bg-slate-900 h-screen flex flex-col z-40',
          'lg:sticky lg:top-0 lg:translate-x-0',
          'fixed top-0 left-0 transition-transform duration-300 ease-in-out',
          isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        )}
      >
        {/* Logo y título */}
        <div className="p-6 border-b border-slate-700/50">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
              <Activity className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="font-bold text-white">Explorador GMM</h1>
              <p className="text-xs text-slate-400">AAR 2026-1 -- UNAM</p>
            </div>
          </div>
        </div>

        {/* Navegación */}
        <nav className="flex-1 p-4 overflow-y-auto scrollbar-thin">
          <p className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider mb-3 px-3">
            Modulos
          </p>
          <ul className="space-y-1">
            {NAV_ITEMS.map((item) => {
              const Icono = ICONOS[item.icono] || FileSearch
              const isActive = pathname === item.href ||
                (item.href !== '/' && pathname?.startsWith(item.href))

              return (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    onClick={closeSidebar}
                    className={cn(
                      'flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-colors',
                      isActive
                        ? 'bg-blue-600/20 text-blue-300 font-medium'
                        : 'text-slate-400 hover:bg-slate-800 hover:text-slate-200'
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
        <div className="p-4 border-t border-slate-700/50 space-y-3">
          <div className="bg-slate-800/60 rounded-lg p-3">
            <p className="text-xs text-slate-500">Datos CNSF 2020-2024</p>
            <p className="text-[10px] text-slate-600 mt-0.5">
              Gastos Medicos Mayores Colectivo
            </p>
          </div>
          <div className="bg-amber-900/20 rounded-lg p-2.5 flex items-center gap-2">
            <div className="w-5 h-5 bg-amber-600/30 rounded flex items-center justify-center flex-shrink-0">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-3 h-3 text-amber-400">
                <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83" />
              </svg>
            </div>
            <div>
              <p className="text-[10px] text-amber-400/80 font-medium">Powered by Claude</p>
              <p className="text-[9px] text-slate-600">Clasificacion con IA</p>
            </div>
          </div>
          <a
            href="https://github.com/GonorAndres/gmm-explorer"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 text-xs text-slate-500 hover:text-slate-300 transition-colors px-1"
          >
            <Github className="w-4 h-4" />
            <span>Ver en GitHub</span>
          </a>
        </div>
      </aside>
    </>
  )
}
