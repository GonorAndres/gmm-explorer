'use client'

import { useCallback } from 'react'
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

const EDAD_MIN = 25
const EDAD_MAX = 70

/**
 * Barra de filtros reutilizable para siniestros y polizas
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
  const rango = EDAD_MAX - EDAD_MIN
  const pctMin = ((edadMin - EDAD_MIN) / rango) * 100
  const pctMax = ((edadMax - EDAD_MIN) / rango) * 100

  const handleMinSlider = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      onEdadMinChange(Math.min(parseInt(e.target.value), edadMax - 1))
    },
    [edadMax, onEdadMinChange]
  )

  const handleMaxSlider = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      onEdadMaxChange(Math.max(parseInt(e.target.value), edadMin + 1))
    },
    [edadMin, onEdadMaxChange]
  )

  const handleMinInput = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const val = parseInt(e.target.value)
      if (!isNaN(val) && val >= EDAD_MIN && val < edadMax) {
        onEdadMinChange(val)
      }
    },
    [edadMax, onEdadMinChange]
  )

  const handleMaxInput = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const val = parseInt(e.target.value)
      if (!isNaN(val) && val <= EDAD_MAX && val > edadMin) {
        onEdadMaxChange(val)
      }
    },
    [edadMin, onEdadMaxChange]
  )

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
        {/* Primera fila: Ano y Edad */}
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
            <label className="block text-sm font-medium text-slate-700 mb-3">
              {UI_LABELS.filtros.edad}
            </label>
            <div className="flex items-center gap-2 mb-3">
              <div className="flex items-center gap-1.5">
                <span className="text-xs text-slate-500">De</span>
                <input
                  type="number"
                  min={EDAD_MIN}
                  max={edadMax - 1}
                  value={edadMin}
                  onChange={handleMinInput}
                  className="w-14 text-center text-sm font-semibold text-blue-700 bg-blue-50 border border-slate-200 rounded-lg px-1 py-1.5 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                />
              </div>
              <span className="text-xs text-slate-400">--</span>
              <div className="flex items-center gap-1.5">
                <span className="text-xs text-slate-500">a</span>
                <input
                  type="number"
                  min={edadMin + 1}
                  max={EDAD_MAX}
                  value={edadMax}
                  onChange={handleMaxInput}
                  className="w-14 text-center text-sm font-semibold text-blue-700 bg-blue-50 border border-slate-200 rounded-lg px-1 py-1.5 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                />
              </div>
              <span className="text-xs text-slate-500">años</span>
            </div>
            <div className="relative h-10 flex items-center px-2">
              {/* Track background */}
              <div className="absolute left-2 right-2 h-1 bg-slate-200 rounded-full" />
              {/* Filled track between thumbs */}
              <div
                className="absolute h-1 bg-blue-600 rounded-full"
                style={{
                  left: `calc(${pctMin}% + ${(1 - pctMin / 100) * 8}px)`,
                  right: `calc(${100 - pctMax}% + ${(pctMax / 100) * 8}px)`,
                }}
              />
              {/* Min thumb */}
              <input
                type="range"
                min={EDAD_MIN}
                max={EDAD_MAX}
                value={edadMin}
                onChange={handleMinSlider}
                className="range-thumb absolute inset-x-0 w-full h-full appearance-none bg-transparent pointer-events-none"
                style={{ zIndex: edadMin > EDAD_MAX - 5 ? 5 : 3 }}
              />
              {/* Max thumb */}
              <input
                type="range"
                min={EDAD_MIN}
                max={EDAD_MAX}
                value={edadMax}
                onChange={handleMaxSlider}
                className="range-thumb absolute inset-x-0 w-full h-full appearance-none bg-transparent pointer-events-none"
                style={{ zIndex: 4 }}
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
