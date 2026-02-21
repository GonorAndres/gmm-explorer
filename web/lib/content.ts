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
      'La frecuencia mide la probabilidad de que un asegurado presente un siniestro. Se calcula como el numero de siniestros entre el numero de asegurados expuestos.',
    severidad:
      'La severidad es el costo promedio de cada siniestro. Se calcula dividiendo el monto total pagado entre el numero de siniestros.',
    nivel:
      'Los niveles clasifican la complejidad medica: Nivel 1 (ambulatorio/consultas), Nivel 2 (hospitalizacion/cirugia), Nivel 3 (alta especialidad/oncologia).',
    montoAjustado:
      'Los montos estan ajustados por inflacion medica a pesos de 2024 para hacer comparables los datos de diferentes años.',
  },

  polizas: {
    asegurados:
      'Numero total de personas cubiertas por polizas GMM Colectivo en el periodo seleccionado. Representa la exposicion al riesgo.',
    primaEmitida:
      'Monto total cobrado por las aseguradoras a los contratantes de polizas. Es el ingreso bruto del negocio de seguros.',
    primaPromedio:
      'Prima emitida dividida entre numero de asegurados. Indica cuanto paga en promedio cada asegurado por su cobertura.',
    edadDistribucion:
      'La distribucion por edad muestra como se concentra la poblacion asegurada. Edades mayores implican mayor riesgo y primas mas altas.',
  },

  tarificador: {
    primaRiesgo:
      'La prima de riesgo (o prima pura) es el costo esperado de siniestros para un asegurado. Se calcula como Frecuencia x Severidad.',
    primaTarifa:
      'La prima de tarifa es el precio final que se cobra al asegurado. Incluye la prima de riesgo mas gastos de administracion (20%), adquisicion (10%) y utilidad (10%).',
    formulaPrima:
      'Prima de Riesgo = Frecuencia x Severidad. La frecuencia es la probabilidad de siniestro y la severidad es el costo promedio cuando ocurre.',
    recargoMensual:
      'El pago mensual tiene un recargo porque la aseguradora deja de recibir el valor del dinero en el tiempo. Se calcula con una anualidad anticipada al 10% anual.',
    factorEdad:
      'A mayor edad, mayor riesgo de enfermedades y hospitalizaciones, lo que incrementa tanto la frecuencia como la severidad de los siniestros.',
    sexo:
      'El sexo es una variable de tarificacion porque hombres y mujeres tienen patrones de siniestralidad diferentes (ej: maternidad, enfermedades cardiovasculares).',
  },
}

// ============================================
// PANELES DE INSIGHT - Contenido expandible
// ============================================

export const INSIGHT_PANELS = {
  siniestros: {
    distribucionNivel: {
      titulo: 'Por que importa la distribucion por nivel?',
      contenido:
        'La distribucion por nivel revela la estructura de costos del portafolio. Nivel 1 (ambulatorio) tiene alta frecuencia pero bajo costo, mientras que Nivel 3 (alta especialidad) tiene pocos casos pero costos muy elevados. Una aseguradora saludable tiene la mayoria de siniestros en Nivel 1, con Nivel 3 representando menos del 15% de los casos pero potencialmente mas del 25% del monto total.',
    },
    curvaFrecuencia: {
      titulo: 'Como leer la curva de frecuencia',
      contenido:
        'La curva de frecuencia por edad muestra la probabilidad de siniestro para cada edad. Observa como la frecuencia aumenta con la edad, especialmente en Nivel 3 (alta especialidad). Esto refleja el deterioro natural de la salud: a mayor edad, mayor probabilidad de enfermedades graves como cancer, problemas cardiovasculares o enfermedades cronicas.',
    },
  },

  polizas: {
    estructuraPortafolio: {
      titulo: 'Que nos dice la estructura del portafolio?',
      contenido:
        'La composicion por edad y sexo del portafolio determina el perfil de riesgo agregado. Un portafolio con mayor proporcion de asegurados jovenes tendra menor siniestralidad esperada. La distribucion por sexo tambien importa: las mujeres en edad reproductiva tienen mayor frecuencia (maternidad), mientras que los hombres de edad avanzada tienen mayor severidad (cardiovascular).',
    },
  },

  tarificador: {
    comoPrima: {
      titulo: 'Como se calcula tu prima?',
      contenido:
        'Tu prima se calcula en tres pasos: (1) Se determina la frecuencia esperada de siniestros para tu edad y sexo en cada nivel de atencion. (2) Se multiplica por la severidad (costo promedio) de cada nivel. (3) Se suman las tres primas parciales para obtener tu prima de riesgo total. La prima de tarifa agrega gastos administrativos (20%), de adquisicion (10%) y margen de utilidad (10%).',
    },
    factoresPrecio: {
      titulo: 'Factores que afectan el precio',
      contenido:
        'Los principales factores que determinan tu prima son: (1) Edad - el factor mas importante, la prima puede ser hasta 7x mayor a los 70 que a los 25 años. (2) Sexo - diferencias en patrones de morbilidad. (3) Nivel de cobertura - cada nivel tiene frecuencia y severidad distintas. En la practica, las aseguradoras tambien consideran region geografica, historial medico y tipo de empresa.',
    },
  },
}

// ============================================
// CALLOUTS - Para página de metodología
// ============================================

export const CALLOUTS = {
  sabiasQue: [
    'El 13.4% de los siniestros (Nivel 3) representa el 25.2% del monto total pagado. Pocos casos costosos dominan el gasto.',
    'Un asegurado de 70 años tiene un factor de riesgo 7.4 veces mayor que uno de 25 años.',
    'La inflacion medica en Mexico supera consistentemente a la inflacion general, lo que presiona las primas al alza cada año.',
    'El modelo Random Forest clasifica 9,409 causas medicas unicas en solo segundos, una tarea que tomaria semanas de trabajo manual.',
  ],
}
