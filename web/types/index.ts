/**
 * Tipos TypeScript para el explorador de siniestros GMM
 *
 * Define las interfaces para los datos pre-procesados que se cargan
 * desde los archivos JSON generados por prepare-data.py
 */

// ============================================
// TIPOS PRINCIPALES DE DATOS
// ============================================

/**
 * Siniestro agregado por (año, edad, sexo, nivel)
 * Usado para la tabla y visualizaciones
 */
export interface SiniestroAgregado {
  anio: number
  edad: number
  sexo: string
  nivel: number
  num_siniestros: number
  monto_original: number
  monto_ajustado: number
  severidad: number
}

/**
 * Causa médica con su clasificación
 * Usado para el dropdown de búsqueda
 */
export interface CausaClasificada {
  causa: string
  nivel: number
  frecuencia: number
}

/**
 * Prima de riesgo por nivel y edad
 * Generado en Fase 3 (tarificación actuarial)
 */
export interface PrimaNivelEdad {
  nivel: number
  edad: number
  frecuencia: number
  severidad: number
  prima_anual: number
  prima_mensual: number
  descripcion: string
}

/**
 * Distribución por nivel (para pie chart)
 */
export interface DistribucionNivel {
  nivel: number
  descripcion: string
  siniestros: number
  monto: number
  pct_siniestros: number
  pct_monto: number
}

/**
 * Resumen general del dashboard
 * Estadísticas globales para las tarjetas
 */
export interface ResumenGeneral {
  total_siniestros: number
  monto_total: number
  monto_promedio: number
  distribucion_nivel: DistribucionNivel[]
  anios_disponibles: number[]
  rango_edad: {
    min: number
    max: number
  }
  generado: string
}

// ============================================
// TIPOS DE FILTROS
// ============================================

/**
 * Estado de los filtros del explorador
 */
export interface FiltrosSiniestros {
  anios: number[]
  edadMin: number
  edadMax: number
  sexo: 'Todos' | 'Masculino' | 'Femenino'
  niveles: number[]
  montoMin: number
  montoMax: number
  causa?: string
}

/**
 * Valores por defecto para filtros
 */
export const FILTROS_DEFAULT: FiltrosSiniestros = {
  anios: [2020, 2021, 2022, 2023, 2024],
  edadMin: 25,
  edadMax: 70,
  sexo: 'Todos',
  niveles: [1, 2, 3],
  montoMin: 0,
  montoMax: 1000000,
}

// ============================================
// TIPOS DE UI
// ============================================

/**
 * Elemento de navegación del sidebar
 */
export interface NavItem {
  titulo: string
  href: string
  icono: string
  activo?: boolean
}

/**
 * Tarjeta de resumen en el dashboard
 */
export interface TarjetaResumen {
  titulo: string
  valor: string | number
  subtitulo?: string
  variacion?: number
  icono?: string
}

// ============================================
// TIPOS DE GRÁFICOS
// ============================================

/**
 * Punto de datos para gráficos de línea (frecuencia/severidad por edad)
 */
export interface PuntoGrafico {
  edad: number
  nivel1?: number
  nivel2?: number
  nivel3?: number
}

/**
 * Sector de gráfico de pie
 */
export interface SectorPie {
  name: string
  value: number
  fill: string
}
