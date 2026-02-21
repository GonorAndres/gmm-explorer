'use client'

import { useState, useCallback } from 'react'

interface FiltrosBase {
  anios: number[]
  edadMin: number
  edadMax: number
  sexo: 'Todos' | 'Masculino' | 'Femenino'
}

/**
 * Hook compartido para lógica de filtros
 * Usado en siniestros y pólizas
 */
export function useFilters<T extends FiltrosBase>(defaultFiltros: T) {
  const [filtros, setFiltros] = useState<T>(defaultFiltros)

  const toggleAnio = useCallback((anio: number) => {
    setFiltros((prev) => ({
      ...prev,
      anios: prev.anios.includes(anio)
        ? prev.anios.filter((a) => a !== anio)
        : [...prev.anios, anio],
    }))
  }, [])

  const setEdadMin = useCallback((val: number) => {
    setFiltros((prev) => ({ ...prev, edadMin: val }))
  }, [])

  const setEdadMax = useCallback((val: number) => {
    setFiltros((prev) => ({ ...prev, edadMax: val }))
  }, [])

  const setSexo = useCallback((sexo: 'Todos' | 'Masculino' | 'Femenino') => {
    setFiltros((prev) => ({ ...prev, sexo }))
  }, [])

  const resetFiltros = useCallback(() => {
    setFiltros(defaultFiltros)
  }, [defaultFiltros])

  return {
    filtros,
    setFiltros,
    toggleAnio,
    setEdadMin,
    setEdadMax,
    setSexo,
    resetFiltros,
  }
}
