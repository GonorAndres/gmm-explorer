/**
 * Contenido educativo y de exploración guiada en español
 * Centraliza todos los textos de tooltips, paneles de insight y callouts
 */

// ============================================
// TOOLTIPS - Texto breve para iconos de info
// ============================================

export const TOOLTIPS = {
  siniestros: {
    frecuencia:
      'La frecuencia mide la probabilidad de que un asegurado presente un siniestro. Se calcula como el número de siniestros entre el número de asegurados expuestos.',
    severidad:
      'La severidad es el costo promedio de cada siniestro. Se calcula dividiendo el monto total pagado entre el número de siniestros.',
    nivel:
      'Los niveles clasifican la complejidad médica: Nivel 1 (ambulatorio/consultas), Nivel 2 (hospitalización/cirugía), Nivel 3 (alta especialidad/oncología).',
    montoAjustado:
      'Los montos están ajustados por inflación médica a pesos de 2024 para hacer comparables los datos de diferentes años.',
  },

  polizas: {
    asegurados:
      'Número total de personas cubiertas por pólizas GMM Colectivo en el periodo seleccionado. Representa la exposición al riesgo.',
    primaEmitida:
      'Monto total cobrado por las aseguradoras a los contratantes de pólizas. Es el ingreso bruto del negocio de seguros.',
    primaPromedio:
      'Prima emitida dividida entre número de asegurados. Indica cuánto paga en promedio cada asegurado por su cobertura.',
    edadDistribucion:
      'La distribución por edad muestra cómo se concentra la población asegurada. Edades mayores implican mayor riesgo y primas más altas.',
  },

  tarificador: {
    primaRiesgo:
      'La prima de riesgo (o prima pura) es el costo esperado de siniestros para un asegurado. Se calcula como Frecuencia x Severidad.',
    primaTarifa:
      'La prima de tarifa es el precio final que se cobra al asegurado. Incluye la prima de riesgo más gastos de administración (20%), adquisición (10%) y utilidad (10%).',
    formulaPrima:
      'Prima de Riesgo = Frecuencia x Severidad. La frecuencia es la probabilidad de siniestro y la severidad es el costo promedio cuando ocurre.',
    recargoMensual:
      'El pago mensual tiene un recargo porque la aseguradora deja de recibir el valor del dinero en el tiempo. Se calcula con una anualidad anticipada al 10% anual.',
    factorEdad:
      'A mayor edad, mayor riesgo de enfermedades y hospitalizaciones, lo que incrementa tanto la frecuencia como la severidad de los siniestros.',
    sexo:
      'El sexo es una variable de tarificación porque hombres y mujeres tienen patrones de siniestralidad diferentes (ej: maternidad, enfermedades cardiovasculares).',
  },
}

// ============================================
// PANELES DE INSIGHT - Contenido expandible
// ============================================

export const INSIGHT_PANELS = {
  siniestros: {
    distribucionNivel: {
      titulo: '¿Por qué importa la distribución por nivel?',
      contenido:
        'La distribución por nivel revela la estructura de costos del portafolio. Nivel 1 (ambulatorio) tiene alta frecuencia pero bajo costo, mientras que Nivel 3 (alta especialidad) tiene pocos casos pero costos muy elevados. Una aseguradora saludable tiene la mayoría de siniestros en Nivel 1, con Nivel 3 representando menos del 15% de los casos pero potencialmente más del 25% del monto total.',
    },
    curvaFrecuencia: {
      titulo: '¿Cómo leer la curva de frecuencia?',
      contenido:
        'La curva de frecuencia por edad muestra la probabilidad de siniestro para cada edad. Observa cómo la frecuencia aumenta con la edad, especialmente en Nivel 3 (alta especialidad). Esto refleja el deterioro natural de la salud: a mayor edad, mayor probabilidad de enfermedades graves como cáncer, problemas cardiovasculares o enfermedades crónicas.',
    },
  },

  polizas: {
    estructuraPortafolio: {
      titulo: '¿Qué nos dice la estructura del portafolio?',
      contenido:
        'La composición por edad y sexo del portafolio determina el perfil de riesgo agregado. Un portafolio con mayor proporción de asegurados jóvenes tendrá menor siniestralidad esperada. La distribución por sexo también importa: las mujeres en edad reproductiva tienen mayor frecuencia (maternidad), mientras que los hombres de edad avanzada tienen mayor severidad (cardiovascular).',
    },
  },

  tarificador: {
    comoPrima: {
      titulo: '¿Cómo se calcula tu prima?',
      contenido:
        'Tu prima se calcula en tres pasos: (1) Se determina la frecuencia esperada de siniestros para tu edad y sexo en cada nivel de atención. (2) Se multiplica por la severidad (costo promedio) de cada nivel. (3) Se suman las tres primas parciales para obtener tu prima de riesgo total. La prima de tarifa agrega gastos administrativos (20%), de adquisición (10%) y margen de utilidad (10%).',
    },
    factoresPrecio: {
      titulo: 'Factores que afectan el precio',
      contenido:
        'Los principales factores que determinan tu prima son: (1) Edad - el factor más importante, la prima puede ser hasta 7x mayor a los 70 que a los 25 años. (2) Sexo - diferencias en patrones de morbilidad. (3) Nivel de cobertura - cada nivel tiene frecuencia y severidad distintas. En la práctica, las aseguradoras también consideran región geográfica, historial médico y tipo de empresa.',
    },
  },
}

// ============================================
// CALLOUTS - Para página de metodología
// ============================================

export const CALLOUTS = {
  descubrimientos: [
    'El 13.4% de los siniestros (Nivel 3) representa el 25.2% del monto total pagado. Pocos casos costosos dominan el gasto.',
    'Un asegurado de 70 años tiene un factor de riesgo 7.4 veces mayor que uno de 25 años.',
    'La inflación médica en México supera consistentemente a la inflación general, lo que presiona las primas al alza cada año.',
    'Claude clasificó 7,909 causas médicas con alta confianza, superando significativamente al Random Forest que solo alcanzaba 59% de precisión.',
  ],
}

// ============================================
// CONTENIDO DE SECCIÓN CLAUDE
// ============================================

export const CLAUDE_CONTENT = {
  problemaML: {
    titulo: 'El Problema con ML Tradicional',
    contenido:
      'El modelo Random Forest (TF-IDF + 200 árboles) alcanzó solo ~59% de precisión (F1-macro: 58.8%) al clasificar causas médicas. Esto se debe a que el modelo aprende patrones estadísticos de texto, pero no comprende realmente el significado médico. Un modelo de ML no sabe que "COLECISTECTOMÍA" es una cirugía de vesícula ni que "TUMOR MALIGNO" implica cáncer.',
  },
  solucionClaude: {
    titulo: 'La Solución: Claude AI',
    contenido:
      'Claude es un modelo de lenguaje grande (LLM) que comprende terminología médica, códigos CIE-10 y el contexto clínico de cada diagnóstico. A diferencia del Random Forest que solo ve patrones de texto, Claude entiende que "APENDICITIS AGUDA CON PERITONITIS" requiere cirugía de emergencia (Nivel 3), no ambulatorio.',
  },
  porqueLLM: {
    titulo: '¿Por qué un LLM supera al Random Forest?',
    contenido:
      'Un LLM como Claude tiene conocimiento médico incorporado en su entrenamiento. Puede interpretar abreviaturas (NE = No Especificada), entender jerarquías de gravedad, y reconocer que términos como "SEPSIS" o "INSUFICIENCIA RENAL" implican alta especialidad. El Random Forest solo puede aprender de los 1,500 ejemplos etiquetados, mientras que Claude aprovecha todo su conocimiento pre-entrenado.',
  },
}

export const INSIGHT_PANELS_CLAUDE = {
  porqueLLM: {
    titulo: '¿Por qué un LLM supera al Random Forest?',
    contenido:
      'El Random Forest aprende correlaciones estadísticas entre palabras y niveles a partir de 1,500 ejemplos. Si una palabra nueva no apareció en el entrenamiento, el modelo no puede clasificarla bien. Claude, en cambio, comprende el significado médico de cada término -- sabe que "neoplasia" significa cáncer, que "colecistectomía" es cirugía de vesícula, y que "sepsis" es una emergencia. Esta comprensión semántica es la diferencia entre 59% y >90% de precisión.',
  },
}
