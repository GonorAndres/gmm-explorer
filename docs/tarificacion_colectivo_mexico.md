# Metodologia de Tarificacion para Seguros de Gastos Medicos Mayores (GMM) Colectivos en Mexico

## Referencia Tecnica para el Calculo de Primas por Nivel de Complejidad y Banda de Edad

---

## 1. Marco Regulatorio

### 1.1 Ley de Instituciones de Seguros y Fianzas (LISF)

La LISF es el marco legal principal que regula la actividad aseguradora en Mexico. Establece los requisitos para la constitucion, organizacion y funcionamiento de las instituciones de seguros.

**Articulo 201 - Requisitos de la Nota Tecnica:**

Los productos de seguros deben integrarse por:
- Nota tecnica
- Documentacion contractual
- Dictamen de congruencia

La nota tecnica debe expresar:
- a) Descripcion de la cobertura y riesgos asegurados
- b) Procedimientos actuariales para determinacion de primas y extraprimas
- c) Justificacion tecnica de la suficiencia de las primas
- d) Procedimientos actuariales para estimacion de reservas tecnicas

**Fuente:** [Ley de Instituciones de Seguros y de Fianzas - CNSF](https://lisfcusf.cnsf.gob.mx/LISF)

### 1.2 Circular Unica de Seguros y Fianzas (CUSF)

La CUSF es el cuerpo normativo que contiene las disposiciones derivadas de la LISF. Sistematiza la regulacion y homologa la terminologia.

**Capitulos relevantes para GMM:**
- Capitulo 15.3: Del contralor medico
- Capitulo 15.4: De los expedientes clinicos
- Capitulo 15.5: Del control de utilizacion de servicios medicos
- Capitulo 15.6: De la mejora continua en prestacion de servicios
- Capitulo 15.7: De las bases tecnicas y documentacion contractual
- Capitulo 15.8: De la comercializacion de seguros de salud

**Fuente:** [CNSF Interactiva - CUSF](https://lisfcusf.cnsf.gob.mx/CUSF/CUSF4_5)

### 1.3 Cambios Normativos Recientes

- Las aseguradoras **no pueden emitir polizas con sumas aseguradas ilimitadas**
- Las tarifas deben basarse en **edad alcanzada** (no por quinquenio)
- Se requiere **dictamen de congruencia** firmado por actuario y area juridica

**Fuente:** [CNSF - Circular Unica de Seguros y Fianzas](https://www.gob.mx/cnsf/documentos/circular-unica-de-seguros-y-fianzas)

---

## 2. Reservas Tecnicas Aplicables

### 2.1 Reserva de Riesgos en Curso

**Proposito:** Cubrir el valor esperado de obligaciones futuras derivadas del pago de siniestros, beneficios, valores garantizados y dividendos.

**Metodologia de Valuacion:**
- La mejor estimacion es igual al valor esperado de los flujos futuros
- Se entiende como la media ponderada por probabilidad de dichos flujos
- Se considera el valor temporal del dinero con curvas de tasas libres de riesgo

**Principios:**
- Valuacion prudente, confiable y objetiva
- Basada en informacion oportuna, confiable, homogenea y suficiente
- Empleo de metodos actuariales y tecnicas estadisticas
- Proyeccion de flujos futuros en terminos brutos durante toda la vigencia

**Reporte Regulatorio:**
Las instituciones deben presentar el RR-3 (Reporte Regulatorio sobre Reservas Tecnicas) de forma trimestral y anual ante la CNSF.

**Fuente:** [CNSF - Reporte Regulatorio Reservas Tecnicas](https://www.gob.mx/cnsf/acciones-y-programas/reporte-regulatorio-sobre-reservas-tecnicas-reserva-de-riesgos-en-curso-entrega-anual)

### 2.2 Calculo para GMM

Para la constitucion de reservas de riesgos en curso en GMM:

```
Reserva RRC = Primas No Devengadas - Proporcion de Costo de Adquisicion
```

Se pueden emplear tablas de morbilidad de acuerdo a las caracteristicas del riesgo y que mejor se ajuste a la experiencia de la institucion o colectividad asegurada.

---

## 3. Metodologia de Prima de Riesgo

### 3.1 Formula Fundamental

La prima de riesgo para seguros de GMM se calcula como:

```
Prima de Riesgo = Frecuencia × Severidad
```

Donde:
- **Frecuencia (Morbilidad)**: Probabilidad de que un asegurado presente un siniestro
- **Severidad (Costo Medio)**: Monto promedio de los siniestros

### 3.2 Calculo de Frecuencia (Morbilidad)

La tasa de morbilidad por edad y sexo se calcula como:

```
M(x,y) = NS(x,y) / NE(x,y)
```

Donde:
- **M(x,y)** = Morbilidad para edad x y sexo y
- **NS(x,y)** = Numero total de siniestros ocurridos a personas de edad x y sexo y
- **NE(x,y)** = Numero total de personas expuestas de edad x y sexo y

### 3.3 Calculo de Severidad (Costo Medio)

```
SP(x,y) = Monto Total Siniestros(x,y) / Numero Siniestros(x,y)
```

Donde:
- **SP(x,y)** = Siniestro promedio para edad x y sexo y

### 3.4 Prima Pura de Riesgo

```
Prima Pura(x,y) = M(x,y) × SP(x,y)
```

### 3.5 Prima de Tarifa

La prima de tarifa incorpora los recargos necesarios:

```
Prima Tarifa = Prima Pura + Gastos de Administracion + Gastos de Adquisicion + Margen de Utilidad + Recargo de Seguridad
```

O expresado como:

```
Prima Tarifa = Prima Pura / (1 - Factor de Gastos - Factor de Comisiones - Margen de Utilidad)
```

**Fuente:** [Nota Tecnica Referencial GMM - AMIS](https://www.gob.mx/cms/uploads/attachment/file/81303/Nota_t_cnica_GMM_ind_AMIS.pdf)

---

## 4. Variables de Tarificacion GMM Colectivo

### 4.1 Edad del Asegurado (Factor Principal)

La edad es el factor mas importante en la tarificacion de GMM. A mayor edad, mayor probabilidad de enfermedad y mayores costos de atencion.

**Metodologia de Ajuste por Edad:**
- La morbilidad ajustada se calcula mediante regresiones
- Para edades 20-59 y 80+: ajuste por regresion
- Para edades 0-19 y 60-79: incremento de 0.05 a la morbilidad base

**Limites de Contratacion:**
- Edad maxima de ingreso: generalmente 60-65 anos
- Algunas aseguradoras aceptan hasta 70 anos con condiciones
- Edad maxima de renovacion: hasta 69-75 anos segun aseguradora

### 4.2 Genero

**Situacion Regulatoria:**
- No existe prohibicion explicita del uso de genero en tarificacion de GMM
- La Ley Federal para Prevenir y Eliminar la Discriminacion establece limitaciones
- Se permite el uso cuando esta justificado actuarialmente

**Diferencias por Sexo:**
- Mujeres 25-50 anos: mayor frecuencia por maternidad y procedimientos ginecologicos
- Hombres: mayor incidencia de enfermedades cardiovasculares
- Mujeres: mayor incidencia de colelitiasis y colecistitis
- Las polizas femeninas suelen tener primas mas altas en edades reproductivas

### 4.3 Suma Asegurada / Nivel de Cobertura

Relacion directa con la prima: mayor suma asegurada = mayor prima

**Rangos tipicos en Mexico:**
- Nivel basico: $5 - $10 millones de pesos
- Nivel medio: $10 - $30 millones de pesos
- Nivel alto: $30 - $50 millones de pesos
- Nivel premium: $50 - $100+ millones de pesos

**Nota:** Actualmente prohibidas las sumas aseguradas ilimitadas por regulacion de CNSF.

### 4.4 Deducible y Coaseguro

**Deducible:**
- Cantidad a partir de la cual la aseguradora comienza a pagar
- Rango tipico: $5,000 - $100,000+ pesos
- Relacion inversa con prima: mayor deducible = menor prima

**Coaseguro:**
- Porcentaje que paga el asegurado despues del deducible
- Rango tipico: 5% - 30% (mas comun: 10%)
- Relacion inversa con prima: mayor coaseguro = menor prima

**Tope de Coaseguro:**
- Limite maximo de pago por coaseguro en un siniestro
- Proteccion contra gastos catastroficos

**Efecto en Tarifa:**
```
Factor Deducible Alto = Reduccion del 10-30% en prima
Factor Coaseguro 20% vs 10% = Reduccion del 5-15% en prima
```

### 4.5 Red Medica

**Red Cerrada:**
- Solo atencion con proveedores convenidos
- Primas mas bajas (15-30% menor)
- Control de costos por tabulador negociado

**Red Abierta:**
- Libre eleccion de proveedores
- Primas mas altas
- Mayor flexibilidad para el asegurado

**Tabulador:**
- Lista de tarifas maximas por procedimiento
- Si el proveedor cobra mas, el asegurado paga la diferencia

### 4.6 Tamano del Grupo

**Minimo para Colectivos:**
- 5 personas (si son accionistas)
- 10 personas (colaboradores generales)

**Efecto del Tamano:**
- Grupos grandes (100+): descuentos del 10-25%
- Tarificacion por experiencia vs tarificacion manual (ver seccion 5)

---

## 5. Teoria de Credibilidad: Experiencia vs Manual

### 5.1 Concepto

La teoria de credibilidad busca el equilibrio entre:
- **Experiencia Individual**: Siniestralidad historica del grupo especifico
- **Experiencia Colectiva (Manual)**: Estadisticas generales del mercado

### 5.2 Formula de Credibilidad

```
Prima Final = Z × Prima Experiencia + (1 - Z) × Prima Manual
```

Donde:
- **Z** = Factor de credibilidad (0 a 1)
- **Prima Experiencia** = Prima basada en siniestralidad del grupo
- **Prima Manual** = Prima basada en tablas de mercado

### 5.3 Determinacion del Factor Z

El factor de credibilidad Z depende de:
- Numero de expuestos en el grupo
- Anos de experiencia siniestral
- Estabilidad de la siniestralidad historica

**Regla General:**
- Grupos pequenos (< 50 vidas): Z cercano a 0 (usa prima manual)
- Grupos medianos (50-200 vidas): Z entre 0.3 y 0.7
- Grupos grandes (200+ vidas): Z cercano a 1 (usa experiencia)

**Modelo de Buhlmann:**
```
Z = n / (n + k)
```

Donde:
- n = numero de periodos de observacion
- k = constante que depende de la variabilidad del riesgo

**Fuente:** [Teoria de la Credibilidad y su aplicacion a los seguros colectivos](https://diposit.ub.edu/dspace/handle/2445/42124)

---

## 6. Estructura de Primas por Edad

### 6.1 Curva Tipica de Siniestralidad

La siniestralidad en GMM sigue un patron caracteristico por edad:

| Rango de Edad | Comportamiento de la Siniestralidad |
|---------------|-------------------------------------|
| 0-5 anos | Alta (enfermedades pediatricas) |
| 6-19 anos | Baja (minimo historico) |
| 20-30 anos | Baja a moderada |
| 31-40 anos | Moderada (inicio de incremento) |
| 41-50 anos | Moderada-Alta (45% de reclamos en 40-59) |
| 51-60 anos | Alta |
| 61-70 anos | Muy alta |
| 70+ anos | Extremadamente alta |

### 6.2 Relatividades por Edad (Estimacion)

Tomando como base la edad 30 (factor 1.00):

| Banda de Edad | Factor Relativo Estimado |
|---------------|--------------------------|
| 0-4 | 1.30 - 1.50 |
| 5-9 | 0.70 - 0.80 |
| 10-14 | 0.60 - 0.70 |
| 15-19 | 0.65 - 0.75 |
| 20-24 | 0.75 - 0.85 |
| 25-29 | 0.90 - 1.00 |
| 30-34 | 1.00 (base) |
| 35-39 | 1.15 - 1.25 |
| 40-44 | 1.35 - 1.50 |
| 45-49 | 1.60 - 1.80 |
| 50-54 | 1.90 - 2.20 |
| 55-59 | 2.30 - 2.70 |
| 60-64 | 2.80 - 3.40 |
| 65-69 | 3.50 - 4.20 |
| 70+ | 4.50 - 6.00+ |

**Nota:** Estos factores son estimaciones basadas en informacion del mercado. Cada aseguradora tiene sus propias tablas de relatividades basadas en su experiencia.

### 6.3 Costos Referenciales por Edad (2024)

Segun datos de CONDUSEF y mercado:

| Perfil | Rango de Prima Anual |
|--------|---------------------|
| Menor de 30 anos | $10,000 - $23,000 |
| 35 anos | $17,000 - $44,000 |
| 45 anos | Hasta $45,000 |
| Familia 3 personas | $44,000 - $101,000 |

**Fuente:** [CONDUSEF - Simulador GMM](https://phpapps.condusef.gob.mx/condusef_gastosmedicosGMM/index.php)

---

## 7. Severidad por Tipo de Padecimiento

### 7.1 Costo Promedio General (2024)

El costo promedio de todos los padecimientos es de **$117,600 pesos**.

### 7.2 Severidad por Padecimiento

| Padecimiento | Costo Promedio | % Siniestralidad |
|--------------|----------------|------------------|
| Hemorragias intracraneales | $368,000 | - |
| Enfermedades pediatricas | $291,000 | - |
| Canceres y tumores | $285,000 | 27.4% |
| Enfermedades sistema inmune/sanguineo | $276,000 | - |
| Enfermedades sistema circulatorio | Variable | 11% |
| Sistema osteomuscular | Variable | 16% |

### 7.3 Estadisticas del Sector (2024)

- **Siniestros pagados:** $122,279 millones de pesos
- **Crecimiento vs 2023:** +15.4%
- **Principal padecimiento (monto):** Cancer y tumores ($24.4 mil millones)
- **Crecimiento 5 anos (2019-2024):** +106%

**Fuente:** [AMIS - Siniestros Medicos 2024](https://sitio.amis.com.mx/aseguradoras-pagaron-122278-mdp-por-siniestros-medicos-durante-2024)

---

## 8. Clasificacion por Nivel de Complejidad

Para este proyecto, se utiliza la siguiente clasificacion de niveles:

### 8.1 Nivel 1: Ambulatorio / Prevencion

**Caracteristicas:**
- Consultas medicas generales y de especialidad
- Estudios de laboratorio y gabinete
- Procedimientos dentales
- Gastroenteritis y padecimientos menores
- Tratamientos ambulatorios

**Perfil de Siniestralidad:**
- Alta frecuencia
- Baja severidad
- Costo promedio: $5,000 - $30,000

### 8.2 Nivel 2: Hospitalario / Cirugia Programada

**Caracteristicas:**
- Cesareas y partos
- Colecistectomia (vesicula)
- Apendicectomia
- Fracturas que requieren cirugia
- Hospitalizaciones <= 5 dias

**Perfil de Siniestralidad:**
- Frecuencia media
- Severidad media-alta
- Costo promedio: $50,000 - $150,000

### 8.3 Nivel 3: Alta Especialidad / Emergencias

**Caracteristicas:**
- Cancer y tumores
- UCI / Terapia intensiva
- Infartos y enfermedades cardiovasculares
- Trasplantes
- Hemorragias intracraneales
- Hospitalizaciones prolongadas

**Perfil de Siniestralidad:**
- Baja frecuencia
- Muy alta severidad
- Costo promedio: $200,000 - $500,000+

### 8.4 Calculo de Prima por Nivel

```
Prima Nivel i = Frecuencia_i × Severidad_i × Factor_Edad × Factor_Ajuste
```

Donde:
- **Frecuencia_i** = Numero de siniestros nivel i / Total expuestos
- **Severidad_i** = Monto total nivel i / Numero siniestros nivel i
- **Factor_Edad** = Relatividad segun banda de edad
- **Factor_Ajuste** = Ajustes por deducible, coaseguro, red, etc.

---

## 9. Ajustes y Recargos

### 9.1 Inflacion Medica

La inflacion medica en Mexico ha sido significativamente superior a la inflacion general:
- Alza en seguros medicos: 4 veces mayor que la inflacion general (2024)
- Se recomienda ajuste anual basado en indices de Banco de Mexico para servicios medicos

### 9.2 Recargos Tipicos

| Concepto | Rango Tipico |
|----------|--------------|
| Gastos de administracion | 8% - 15% |
| Gastos de adquisicion (comisiones) | 15% - 25% |
| Margen de utilidad | 5% - 10% |
| Recargo de seguridad | 3% - 8% |

### 9.3 Factor Total de Recargo

```
Factor Total = 1 / (1 - Suma de Porcentajes)
```

Ejemplo:
- Gastos Admin: 12%
- Comisiones: 20%
- Utilidad: 8%
- Seguridad: 5%
- Total: 45%

```
Factor = 1 / (1 - 0.45) = 1.818
Prima Tarifa = Prima Pura × 1.818
```

---

## 10. Fuentes de Datos

### 10.1 Fuentes Oficiales

1. **CNSF (Comision Nacional de Seguros y Fianzas)**
   - Estadisticas del sector asegurador
   - Anuarios estadisticos
   - Informacion de mercado por ramo
   - [Portal CNSF](https://www.cnsf.gob.mx)

2. **AMIS (Asociacion Mexicana de Instituciones de Seguros)**
   - Nota tecnica referencial GMM
   - Estadisticas de siniestralidad
   - Informes del sector
   - [Portal AMIS](https://sitio.amis.com.mx)

3. **CONDUSEF**
   - Simulador de GMM
   - Comparativos de mercado
   - Informacion al consumidor
   - [Simulador GMM](https://phpapps.condusef.gob.mx/condusef_gastosmedicosGMM/index.php)

### 10.2 Fuentes Internas del Proyecto

Para este proyecto se utilizan los datos de la CNSF:

**Ubicacion:** `data/raw/` y `data/processed/`

**Archivos:**
- Siniestros 2020-2024: informacion de reclamos por edad, monto, causa
- Emision (Polizas) 2020-2024: datos de exposicion para calculo de frecuencia

---

## 11. Implementacion para el Proyecto

### 11.1 Proceso de Calculo

1. **Consolidar datos de siniestros y polizas** (Phase 0)
2. **Clasificar siniestros por nivel de complejidad** (Phases 1-2)
3. **Calcular frecuencia por nivel y banda de edad**
4. **Calcular severidad por nivel y banda de edad**
5. **Aplicar factores de ajuste**
6. **Generar tablas de primas**

### 11.2 Estructura de Salida

Archivo: `outputs/tarificacion/primas_por_nivel.csv`

Columnas sugeridas:
- banda_edad
- nivel_complejidad
- frecuencia
- severidad
- prima_pura
- factor_ajuste
- prima_tarifa

### 11.3 Bandas de Edad Recomendadas

Para el proyecto se sugieren las siguientes bandas:

| Codigo | Banda de Edad |
|--------|---------------|
| B1 | 0-17 |
| B2 | 18-24 |
| B3 | 25-29 |
| B4 | 30-34 |
| B5 | 35-39 |
| B6 | 40-44 |
| B7 | 45-49 |
| B8 | 50-54 |
| B9 | 55-59 |
| B10 | 60-64 |
| B11 | 65-70 |

---

## 12. Referencias

1. CNSF. (2024). Circular Unica de Seguros y Fianzas. [https://lisfcusf.cnsf.gob.mx/](https://lisfcusf.cnsf.gob.mx/)

2. AMIS. (2002). Nota tecnica referencial para los seguros de Gastos Medicos Mayores Individual. [https://www.gob.mx/cms/uploads/attachment/file/81303/Nota_t_cnica_GMM_ind_AMIS.pdf](https://www.gob.mx/cms/uploads/attachment/file/81303/Nota_t_cnica_GMM_ind_AMIS.pdf)

3. Camara de Diputados. (2024). Ley de Instituciones de Seguros y de Fianzas. [https://www.diputados.gob.mx/LeyesBiblio/pdf/LISF.pdf](https://www.diputados.gob.mx/LeyesBiblio/pdf/LISF.pdf)

4. CNSF. (2024). Desempeno Oportuno del Sector Asegurador y Afianzador 1T 2024. [https://www.gob.mx/cms/uploads/attachment/file/918064/Desempe_o_Oportuno_del_Sector_1T_2024__1_.pdf](https://www.gob.mx/cms/uploads/attachment/file/918064/Desempe_o_Oportuno_del_Sector_1T_2024__1_.pdf)

5. AMIS. (2025). Aseguradoras pagaron 122,278 MDP por siniestros medicos durante 2024. [https://sitio.amis.com.mx/aseguradoras-pagaron-122278-mdp-por-siniestros-medicos-durante-2024](https://sitio.amis.com.mx/aseguradoras-pagaron-122278-mdp-por-siniestros-medicos-durante-2024)

6. CONDUSEF. (2016). Simulador de Gastos Medicos Mayores. [https://phpapps.condusef.gob.mx/condusef_gastosmedicosGMM/index.php](https://phpapps.condusef.gob.mx/condusef_gastosmedicosGMM/index.php)

7. Perez Arroba, M.A. (2003). La Teoria de la Credibilidad y su aplicacion a los seguros colectivos. Universidad de Barcelona. [https://diposit.ub.edu/dspace/handle/2445/42124](https://diposit.ub.edu/dspace/handle/2445/42124)

8. Fundacion MAPFRE. (2009). Teoria de la Credibilidad: Desarrollo y Aplicaciones en Primas de Seguros. [https://documentacion.fundacionmapfre.org/documentacion/es/media/group/1061694.do](https://documentacion.fundacionmapfre.org/documentacion/es/media/group/1061694.do)

---

*Documento elaborado como referencia tecnica para el proyecto de clasificacion de siniestros GMM y calculo de prima de riesgo.*

*Ultima actualizacion: Diciembre 2024*
