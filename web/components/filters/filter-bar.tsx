'use client'

import { Filter, RefreshCw } from 'lucide-react'
import { UI_LABELS } from '@/lib/constants'
import { YearToggle } from './year-toggle'
import { NivelToggle } from './nivel-toggle'

interface FilterBarConfig {
  mostrarNivel?: boolean
  mostrarMonto?: boolean
}

interface FilterBarProps {
  anios: number[]
  edadMin: number
  edadMax: number
  sexo: 'Todos' | 'Masculino' | 'Femenino'
  niveles?: number[]
  onToggleAnio: (anio: number) => void
  onEdadMinChange: (val: number) => void
  onEdadMaxChange: (val: number) => void
  onSexoChange: (sexo: 'Todos' | 'Masculino' | 'Femenino') => void
  onToggleNivel?: (nivel: number) => void
  onReset: () => void
  config?: FilterBarConfig
}

/**
 * Barra de filtros reutilizable para siniestros y pólizas
 */
export function FilterBar({
  anios,
  edadMin,
  edadMax,
  sexo,
  niveles = [1, 2, 3],
  onToggleAnio,
  onEdadMinChange,
  onEdadMaxChange,
  onSexoChange,
  onToggleNivel,
  onReset,
  config = { mostrarNivel: true },
}: FilterBarProps) {
  return (
    <div className="bg-white rounded-xl border border-slate-200 shadow-sm mb-8">
      <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Filter className="w-5 h-5 text-slate-400" />
          <span className="font-semibold text-slate-700">{UI_LABELS.filtros.titulo}</span>
        </div>
        <button
          onClick={onReset}
          className="flex items-center gap-1 text-sm text-slate-500 hover:text-slate-700 transition-colors"
        >
          <RefreshCw className="w-4 h-4" />
          {UI_LABELS.filtros.limpiar}
        </button>
      </div>
      <div className="p-6">
        {/* Primera fila: Año y Edad */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              {UI_LABELS.filtros.anio}
            </label>
            <YearToggle
              anios={[2020, 2021, 2022, 2023, 2024]}
              seleccionados={anios}
              onChange={onToggleAnio}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              {UI_LABELS.filtros.edad}: {edadMin} - {edadMax}
            </label>
            <div className="flex items-center gap-4 pr-4">
              <input
                type="range"
                min="25"
                max="70"
                value={edadMin}
                onChange={(e) =>
                  onEdadMinChange(Math.min(parseInt(e.target.value), edadMax - 1))
                }
                className="flex-1 accent-blue-700"
              />
              <input
                type="range"
                min="25"
                max="70"
                value={edadMax}
                onChange={(e) =>
                  onEdadMaxChange(Math.max(parseInt(e.target.value), edadMin + 1))
                }
                className="flex-1 accent-blue-700"
              />
            </div>
          </div>
        </div>

        {/* Segunda fila: Sexo y Nivel */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              {UI_LABELS.filtros.sexo}
            </label>
            <select
              value={sexo}
              onChange={(e) =>
                onSexoChange(e.target.value as 'Todos' | 'Masculino' | 'Femenino')
              }
              className="w-full max-w-xs bg-white border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="Todos">{UI_LABELS.sexo.todos}</option>
              <option value="Masculino">{UI_LABELS.sexo.masculino}</option>
              <option value="Femenino">{UI_LABELS.sexo.femenino}</option>
            </select>
          </div>

          {config.mostrarNivel && onToggleNivel && (
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                {UI_LABELS.filtros.nivel}
              </label>
              <NivelToggle
                seleccionados={niveles}
                onChange={onToggleNivel}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
