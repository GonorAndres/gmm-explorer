/**
 * Constantes y etiquetas en español para el dashboard GMM
 *
 * Todos los textos de la UI están centralizados aquí para
 * mantener consistencia y facilitar traducciones futuras.
 */

// ============================================
// NIVELES DE CLASIFICACIÓN
// ============================================

export const NIVEL_LABELS: Record<number, string> = {
  1: 'Ambulatorio (L1)',
  2: 'Hospitalario (L2)',
  3: 'Alta Especialidad (L3)',
}

export const NIVEL_DESCRIPCIONES: Record<number, string> = {
  1: 'Consultas, laboratorio, dental, prevención',
  2: 'Cirugías programadas, hospitalizaciones ≤5 días',
  3: 'Oncología, UCI, cardiovascular, trasplantes',
}

export const NIVEL_COLORS: Record<number, string> = {
  1: '#22c55e', // verde - Ambulatorio
  2: '#eab308', // amarillo - Hospitalario
  3: '#ef4444', // rojo - Alta Especialidad
}

export const NIVEL_COLORS_LIGHT: Record<number, string> = {
  1: '#86efac',
  2: '#fde047',
  3: '#fca5a5',
}

// ============================================
// NAVEGACIÓN
// ============================================

export const NAV_ITEMS = [
  {
    titulo: 'Explorador de Siniestros',
    href: '/siniestros',
    icono: 'FileSearch',
  },
  {
    titulo: 'Explorador de Pólizas',
    href: '/polizas',
    icono: 'FileText',
  },
  {
    titulo: 'Metodología',
    href: '/metodologia',
    icono: 'BookOpen',
  },
  {
    titulo: 'Tarificador',
    href: '/tarificador',
    icono: 'Calculator',
  },
  {
    titulo: 'Contexto',
    href: '/contexto',
    icono: 'FileText',
  },
]

// ============================================
// ETIQUETAS DE UI
// ============================================

export const UI_LABELS = {
  // Filtros
  filtros: {
    titulo: 'Filtros',
    edad: 'Edad',
    anio: 'Año',
    sexo: 'Sexo',
    nivel: 'Nivel',
    monto: 'Monto',
    causa: 'Causa',
    aplicar: 'Aplicar Filtros',
    limpiar: 'Limpiar',
  },

  // Opciones de sexo
  sexo: {
    todos: 'Todos',
    masculino: 'Masculino',
    femenino: 'Femenino',
  },

  // Tarjetas de resumen
  tarjetas: {
    totalSiniestros: 'Total Siniestros',
    montoTotal: 'Monto Total',
    montoPromedio: 'Monto Promedio',
    distribucion: 'Distribución por Nivel',
  },

  // Tabla
  tabla: {
    columnas: {
      anio: 'Año',
      edad: 'Edad',
      sexo: 'Sexo',
      nivel: 'Nivel',
      numSiniestros: 'Siniestros',
      monto: 'Monto',
      severidad: 'Severidad',
    },
    sinDatos: 'No hay datos para los filtros seleccionados',
    cargando: 'Cargando datos...',
  },

  // Gráficos
  graficos: {
    frecuenciaPorEdad: 'Frecuencia por Edad',
    severidadPorEdad: 'Severidad por Edad',
    primaPorEdad: 'Prima de Riesgo por Edad',
    distribucionNivel: 'Distribución por Nivel',
  },

  // Páginas
  paginas: {
    siniestros: {
      titulo: 'Explorador de Siniestros',
      subtitulo: 'Análisis de siniestros GMM por nivel, edad y período',
    },
    polizas: {
      titulo: 'Explorador de Pólizas',
      subtitulo: 'Análisis del portafolio de pólizas',
    },
    metodologia: {
      titulo: 'Metodología',
      subtitulo: 'Documentación del proceso de clasificación y tarificación',
    },
    tarificador: {
      titulo: 'Tarificador',
      subtitulo: 'Calculadora de primas para nuevas pólizas',
    },
  },
}

// ============================================
// FORMATEO
// ============================================

/**
 * Formatea un número como moneda mexicana
 * @param valor Número a formatear
 * @param decimales Número de decimales (default: 0)
 */
export function formatearMoneda(valor: number, decimales = 0): string {
  return new Intl.NumberFormat('es-MX', {
    style: 'currency',
    currency: 'MXN',
    minimumFractionDigits: decimales,
    maximumFractionDigits: decimales,
  }).format(valor)
}

/**
 * Formatea un número con separadores de miles
 * @param valor Número a formatear
 */
export function formatearNumero(valor: number): string {
  return new Intl.NumberFormat('es-MX').format(valor)
}

/**
 * Formatea un porcentaje
 * @param valor Valor decimal (0.15 = 15%)
 * @param decimales Decimales a mostrar
 */
export function formatearPorcentaje(valor: number, decimales = 1): string {
  return `${(valor * 100).toFixed(decimales)}%`
}

/**
 * Formatea frecuencia actuarial (como porcentaje pequeño)
 * @param valor Frecuencia (ej: 0.0147)
 */
export function formatearFrecuencia(valor: number): string {
  return `${(valor * 100).toFixed(2)}%`
}

/**
 * Abrevia números grandes (K, M, B)
 * @param valor Número a abreviar
 */
export function abreviarNumero(valor: number): string {
  if (valor >= 1e9) {
    return `${(valor / 1e9).toFixed(1)}B`
  }
  if (valor >= 1e6) {
    return `${(valor / 1e6).toFixed(1)}M`
  }
  if (valor >= 1e3) {
    return `${(valor / 1e3).toFixed(1)}K`
  }
  return valor.toString()
}

// ============================================
// CONFIGURACIÓN DE GRÁFICOS
// ============================================

export const CHART_CONFIG = {
  // Colores por nivel para gráficos
  coloresSeries: [
    NIVEL_COLORS[1],
    NIVEL_COLORS[2],
    NIVEL_COLORS[3],
  ],

  // Configuración común de Recharts
  margen: { top: 20, right: 30, left: 20, bottom: 5 },

  // Formato de tooltip
  tooltipStyle: {
    backgroundColor: '#ffffff',
    border: '1px solid #e5e7eb',
    borderRadius: '8px',
    padding: '12px',
  },
}
