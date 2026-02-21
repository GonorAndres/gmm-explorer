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
  nivel_probabilidad?: number
  origen?: 'manual' | 'claude' | 'modelo'
  explicacion?: string
}

/**
 * Explicación de causa médica para el Explorador de Causas
 */
export interface ExplicacionCausa {
  causa: string
  nivel: number
  nivel_nombre: string
  explicacion: string
}

/**
 * Metadata de clasificación (antes vs después)
 */
export interface ClasificacionMetadata {
  rf_accuracy: number
  rf_f1_macro: number
  rf_low_confidence_pct: number
  claude_accuracy: number
  claude_avg_confidence: number
  claude_low_confidence_pct: number
  total_causas: number
  causas_reclasificadas: number
  ejemplos_correccion: EjemploCorreccion[]
}

/**
 * Ejemplo de corrección de clasificación
 */
export interface EjemploCorreccion {
  causa: string
  nivel_rf: number
  nivel_claude: number
  nivel_manual?: number
  justificacion: string
}

/**
 * Prima de riesgo por nivel, edad y sexo
 * Generado en Fase 3 (tarificación actuarial)
 */
export interface PrimaNivelEdad {
  nivel: number
  edad: number
  sexo: string
  frecuencia: number
  severidad: number
  prima_anual: number
  prima_tarifa: number
  prima_mensual: number
  prima_tarifa_mensual: number
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
 * Distribución por sexo
 */
export interface DistribucionSexo {
  sexo: string
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
  por_sexo: DistribucionSexo[]
  anios_disponibles: number[]
  rango_edad: {
    min: number
    max: number
  }
  generado: string
}

// ============================================
// TIPOS DE PÓLIZAS
// ============================================

/**
 * Póliza agregada por (año, edad, sexo)
 */
export interface PolizaAgregada {
  anio: number
  edad: number
  sexo: string
  num_asegurados: number
  prima_emitida: number
  suma_asegurada: number
  prima_promedio: number
}

/**
 * Resumen anual de pólizas
 */
export interface ResumenAnual {
  anio: number
  num_asegurados: number
  prima_emitida: number
  suma_asegurada: number
}

/**
 * Pólizas agrupadas por banda de edad
 */
export interface PolizaPorBanda {
  banda_edad: string
  num_asegurados: number
  prima_emitida: number
  pct_asegurados: number
}

// ============================================
// TIPOS DE FILTROS
// ============================================

/**
 * Estado de los filtros del explorador de siniestros
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
 * Estado de los filtros del explorador de pólizas
 */
export interface FiltrosPolizas {
  anios: number[]
  edadMin: number
  edadMax: number
  sexo: 'Todos' | 'Masculino' | 'Femenino'
}

/**
 * Valores por defecto para filtros de siniestros
 */
export const FILTROS_SINIESTROS_DEFAULT: FiltrosSiniestros = {
  anios: [2020, 2021, 2022, 2023, 2024],
  edadMin: 25,
  edadMax: 70,
  sexo: 'Todos',
  niveles: [1, 2, 3],
  montoMin: 0,
  montoMax: 1000000,
}

/**
 * Valores por defecto para filtros de pólizas
 */
export const FILTROS_POLIZAS_DEFAULT: FiltrosPolizas = {
  anios: [2020, 2021, 2022, 2023, 2024],
  edadMin: 25,
  edadMax: 70,
  sexo: 'Todos',
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
