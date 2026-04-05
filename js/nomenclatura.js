// =============================================================================
// nomenclatura.js — Motor de nomenclatura inorgánica (sistemática, Stock, tradicional)
// =============================================================================

import {
  PREFIJOS_GRIEGOS,
  ELEMENTOS,
  TIPOS_COMPUESTO,
  DIFICULTAD,
  OXOACIDOS
} from './datos.js';

// =============================================================================
// UTILIDADES INTERNAS
// =============================================================================

/**
 * Máximo común divisor (algoritmo de Euclides)
 */
function mcd(a, b) {
  a = Math.abs(a);
  b = Math.abs(b);
  while (b) {
    [a, b] = [b, a % b];
  }
  return a;
}

/**
 * Convierte un número entero a numeral romano (1-10)
 */
function aRomano(n) {
  const romanos = { 1: 'I', 2: 'II', 3: 'III', 4: 'IV', 5: 'V', 6: 'VI', 7: 'VII', 8: 'VIII', 9: 'IX', 10: 'X' };
  return romanos[n] || String(n);
}

/**
 * Selecciona un elemento aleatorio de un array
 */
function elegirAleatorio(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

/**
 * Obtiene el prefijo griego para un número.
 * Si esPrimerElemento es true, se omite "mono" (convención sistemática).
 */
function obtenerPrefijo(n, esPrimerElemento = false) {
  if (n === 1 && esPrimerElemento) return '';
  return PREFIJOS_GRIEGOS[n] || '';
}

/**
 * Aplica elisión: "mono" + "óxido" → "monóxido", no "monoóxido"
 * Regla: solo se elide cuando el prefijo termina en 'a' u 'o' y el nombre empieza con vocal.
 * "tri" + "óxido" → "trióxido" (sin elisión, 'i' no se elide)
 * "tetra" + "óxido" → "tetróxido" (elisión de 'a')
 */
function aplicarElision(prefijo, nombre) {
  if (!prefijo) return nombre;
  const vocalesFinalesPrefijo = 'ao';  // solo 'a' y 'o' se eliden
  const vocalesInicioNombre = 'aeiouáéíóú';
  const ultimaLetraPrefijo = prefijo[prefijo.length - 1];
  const primeraLetraNombre = nombre[0];
  if (vocalesFinalesPrefijo.includes(ultimaLetraPrefijo) && vocalesInicioNombre.includes(primeraLetraNombre)) {
    return prefijo.slice(0, -1) + nombre;
  }
  return prefijo + nombre;
}

/**
 * Cruza valencias y simplifica subíndices usando MCD.
 * Dados valencia del catión (+) y del anión (-), devuelve [subíndiceCatión, subíndiceAnión].
 */
function cruzarValencias(valPos, valNeg) {
  const pos = Math.abs(valPos);
  const neg = Math.abs(valNeg);
  const divisor = mcd(pos, neg);
  return [neg / divisor, pos / divisor];
}

/**
 * Construye la fórmula en texto plano dados los componentes.
 * Ejemplo: construirFormula('Fe', 2, 'O', 3) → "Fe2O3"
 * Los subíndices de 1 se omiten.
 */
function construirFormula(elem1, sub1, elem2, sub2) {
  const s1 = sub1 > 1 ? String(sub1) : '';
  const s2 = sub2 > 1 ? String(sub2) : '';
  return `${elem1}${s1}${elem2}${s2}`;
}

/**
 * Obtiene todos los símbolos de metales disponibles
 */
function obtenerMetales() {
  return Object.keys(ELEMENTOS).filter(s => ELEMENTOS[s].tipo === 'metal');
}

/**
 * Obtiene todos los símbolos de no metales disponibles (excluye H y O según contexto)
 */
function obtenerNoMetales() {
  return Object.keys(ELEMENTOS).filter(s => ELEMENTOS[s].tipo === 'no_metal');
}

/**
 * Filtra elementos según la dificultad
 */
function filtrarPorDificultad(dificultad) {
  const config = DIFICULTAD[dificultad] || DIFICULTAD.DIFICIL;
  const metales = config.metales
    ? config.metales.filter(s => ELEMENTOS[s] && ELEMENTOS[s].tipo === 'metal')
    : obtenerMetales();
  const noMetales = config.noMetales
    ? config.noMetales.filter(s => ELEMENTOS[s] && ELEMENTOS[s].tipo === 'no_metal')
    : obtenerNoMetales();
  return { metales, noMetales };
}

/**
 * Obtiene el nombre tradicional del ácido correspondiente al anhídrido de un no metal.
 * Usa la propiedad raizOxoacido del elemento.
 */
function obtenerNombreAnhidrido(simbolo, valencia) {
  const elem = ELEMENTOS[simbolo];
  if (elem && elem.raizOxoacido && elem.raizOxoacido[valencia]) {
    return elem.raizOxoacido[valencia];
  }
  return null;
}

/**
 * Raíz del no metal para la nomenclatura sistemática IUPAC de oxoácidos.
 * Se usa con el sufijo "-ato" para formar el nombre del anión.
 * Ejemplo: S → "sulf" → "sulfato", P → "fosf" → "fosfato"
 */
function obtenerRaizSistematicaOxoacido(simbolo) {
  const mapa = {
    'C': 'carbon', 'N': 'nitr', 'S': 'sulf', 'Cl': 'clor',
    'Br': 'brom', 'I': 'yod', 'P': 'fosf', 'B': 'bor',
    'Si': 'silic', 'Se': 'selen', 'Te': 'telur', 'Mn': 'mangan',
    'Cr': 'crom'
  };
  return mapa[simbolo] || simbolo.toLowerCase();
}


// =============================================================================
// CONVERSIÓN DE FÓRMULA A HTML
// =============================================================================

/**
 * Convierte una fórmula de texto plano a HTML con subíndices.
 * Ejemplos:
 *   "Fe2O3"    → "Fe<sub>2</sub>O<sub>3</sub>"
 *   "Ca(OH)2"  → "Ca(OH)<sub>2</sub>"
 *   "H2SO4"    → "H<sub>2</sub>SO<sub>4</sub>"
 *   "H2Cr2O7"  → "H<sub>2</sub>Cr<sub>2</sub>O<sub>7</sub>"
 */
export function formulaAHTML(formula) {
  // Reemplazar cada dígito (o grupo de dígitos) que siga a una letra o cierre de paréntesis
  return formula.replace(/([A-Za-z\)])(\d+)/g, '$1<sub>$2</sub>');
}


// =============================================================================
// GENERADORES DE COMPUESTOS POR TIPO
// =============================================================================

/**
 * Genera un óxido básico (metal + O)
 */
function generarOxidoBasico(metalesDisponibles) {
  const simbolo = elegirAleatorio(metalesDisponibles);
  const metal = ELEMENTOS[simbolo];
  const valencia = elegirAleatorio(metal.valencias);

  // Cruzar valencias: metal^(+valencia) + O^(-2)
  const [subMetal, subOxigeno] = cruzarValencias(valencia, -2);

  const formula = construirFormula(simbolo, subMetal, 'O', subOxigeno);
  const formulaHTML = formulaAHTML(formula);

  // --- Nomenclatura sistemática ---
  const prefijoOxigeno = obtenerPrefijo(subOxigeno, false);
  const prefijoMetal = obtenerPrefijo(subMetal, true);
  const parteOxido = aplicarElision(prefijoOxigeno, 'óxido');
  const parteMetal = prefijoMetal ? aplicarElision(prefijoMetal, metal.nombre) : metal.nombre;
  const sistematica = `${parteOxido} de ${parteMetal}`;

  // --- Nomenclatura Stock ---
  const tieneMultiplesValencias = metal.valencias.length > 1;
  const stock = tieneMultiplesValencias
    ? `óxido de ${metal.nombre}(${aRomano(valencia)})`
    : `óxido de ${metal.nombre}`;

  // --- Nomenclatura tradicional ---
  const nombreTrad = metal.nombreTradicional[valencia];
  const tradicional = `óxido ${nombreTrad}`;

  return {
    formula,
    formulaHTML,
    tipo: TIPOS_COMPUESTO.OXIDO_BASICO,
    nombres: { sistematica, stock, tradicional }
  };
}

/**
 * Genera un óxido ácido / anhídrido (no metal + O)
 */
function generarOxidoAcido(noMetalesDisponibles) {
  // Filtrar no metales que tienen valencias positivas (excluir O, H, F)
  const candidatos = noMetalesDisponibles.filter(s => {
    const e = ELEMENTOS[s];
    return e && s !== 'O' && s !== 'H' && s !== 'F' && e.valencias && e.valencias.length > 0;
  });
  if (candidatos.length === 0) return null;

  const simbolo = elegirAleatorio(candidatos);
  const elem = ELEMENTOS[simbolo];
  const valencia = elegirAleatorio(elem.valencias);

  // Cruzar valencias: noMetal^(+valencia) + O^(-2)
  const [subNoMetal, subOxigeno] = cruzarValencias(valencia, -2);

  const formula = construirFormula(simbolo, subNoMetal, 'O', subOxigeno);
  const formulaHTML = formulaAHTML(formula);

  // --- Nomenclatura sistemática ---
  const prefijoOxigeno = obtenerPrefijo(subOxigeno, false);
  const prefijoNoMetal = obtenerPrefijo(subNoMetal, true);
  const parteOxido = aplicarElision(prefijoOxigeno, 'óxido');
  const parteNoMetal = prefijoNoMetal ? aplicarElision(prefijoNoMetal, elem.nombre) : elem.nombre;
  const sistematica = `${parteOxido} de ${parteNoMetal}`;

  // --- Nomenclatura Stock ---
  const tieneMultiplesValencias = elem.valencias.length > 1;
  const stock = tieneMultiplesValencias
    ? `óxido de ${elem.nombre}(${aRomano(valencia)})`
    : `óxido de ${elem.nombre}`;

  // --- Nomenclatura tradicional (anhídrido) ---
  const nombreAnhidrido = obtenerNombreAnhidrido(simbolo, valencia);
  const tradicional = nombreAnhidrido
    ? `anhídrido ${nombreAnhidrido}`
    : `anhídrido de ${elem.nombre}`;

  return {
    formula,
    formulaHTML,
    tipo: TIPOS_COMPUESTO.OXIDO_ACIDO,
    nombres: { sistematica, stock, tradicional }
  };
}

/**
 * Genera un hidruro metálico (metal + H)
 */
function generarHidruroMetalico(metalesDisponibles) {
  const simbolo = elegirAleatorio(metalesDisponibles);
  const metal = ELEMENTOS[simbolo];
  const valencia = elegirAleatorio(metal.valencias);

  // Metal^(+valencia) + H^(-1) → subíndices: 1 metal, valencia hidrógenos
  const subHidrogeno = valencia; // siempre valencia/1 simplificado
  const formula = construirFormula(simbolo, 1, 'H', subHidrogeno);
  const formulaHTML = formulaAHTML(formula);

  // --- Nomenclatura sistemática ---
  const prefijoH = obtenerPrefijo(subHidrogeno, false);
  const parteHidruro = aplicarElision(prefijoH, 'hidruro');
  const sistematica = `${parteHidruro} de ${metal.nombre}`;

  // --- Nomenclatura Stock ---
  const tieneMultiplesValencias = metal.valencias.length > 1;
  const stock = tieneMultiplesValencias
    ? `hidruro de ${metal.nombre}(${aRomano(valencia)})`
    : `hidruro de ${metal.nombre}`;

  // --- Nomenclatura tradicional ---
  const nombreTrad = metal.nombreTradicional[valencia];
  const tradicional = `hidruro ${nombreTrad}`;

  return {
    formula,
    formulaHTML,
    tipo: TIPOS_COMPUESTO.HIDRURO_METALICO,
    nombres: { sistematica, stock, tradicional }
  };
}

/**
 * Genera un hidrácido (H + halógeno/calcógeno)
 */
function generarHidracido(noMetalesDisponibles) {
  // Solo F, Cl, Br, I (val -1) y S, Se, Te (val -2)
  const permitidos = ['F', 'Cl', 'Br', 'I', 'S', 'Se', 'Te'];
  const candidatos = noMetalesDisponibles.filter(s => permitidos.includes(s));
  if (candidatos.length === 0) return null;

  const simbolo = elegirAleatorio(candidatos);
  const elem = ELEMENTOS[simbolo];
  const valNegativa = elem.valenciasNegativas[0]; // -1 o -2

  // H^(+1) + X^(valNeg)
  const subH = Math.abs(valNegativa);   // 1 para halógenos, 2 para calcógenos
  const subX = 1;

  const formula = construirFormula('H', subH, simbolo, subX);
  const formulaHTML = formulaAHTML(formula);

  const raiz = elem.raizAcida;

  // --- Nomenclatura sistemática ---
  const sistematica = `${raiz}uro de hidrógeno`;

  // --- Nomenclatura tradicional ---
  const tradicional = `ácido ${raiz}hídrico`;

  // --- Stock (igual que sistemática para hidrácidos) ---
  const stock = sistematica;

  return {
    formula,
    formulaHTML,
    tipo: TIPOS_COMPUESTO.HIDRACIDO,
    nombres: { sistematica, stock, tradicional }
  };
}

/**
 * Genera un hidróxido (metal + OH)
 */
function generarHidroxido(metalesDisponibles) {
  const simbolo = elegirAleatorio(metalesDisponibles);
  const metal = ELEMENTOS[simbolo];
  const valencia = elegirAleatorio(metal.valencias);

  const subOH = valencia;

  // Fórmula: Si subOH > 1 → Metal(OH)n, si es 1 → MetalOH
  let formula, formulaHTML;
  if (subOH > 1) {
    formula = `${simbolo}(OH)${subOH}`;
    formulaHTML = `${simbolo}(OH)<sub>${subOH}</sub>`;
  } else {
    formula = `${simbolo}OH`;
    formulaHTML = `${simbolo}OH`;
  }

  // --- Nomenclatura sistemática ---
  const prefijoOH = obtenerPrefijo(subOH, false);
  const parteHidroxido = aplicarElision(prefijoOH, 'hidróxido');
  const sistematica = `${parteHidroxido} de ${metal.nombre}`;

  // --- Nomenclatura Stock ---
  const tieneMultiplesValencias = metal.valencias.length > 1;
  const stock = tieneMultiplesValencias
    ? `hidróxido de ${metal.nombre}(${aRomano(valencia)})`
    : `hidróxido de ${metal.nombre}`;

  // --- Nomenclatura tradicional ---
  const nombreTrad = metal.nombreTradicional[valencia];
  const tradicional = `hidróxido ${nombreTrad}`;

  return {
    formula,
    formulaHTML,
    tipo: TIPOS_COMPUESTO.HIDROXIDO,
    nombres: { sistematica, stock, tradicional }
  };
}

/**
 * Genera una sal binaria (metal + no metal)
 */
function generarSalBinaria(metalesDisponibles, noMetalesDisponibles) {
  // No metales con valencia negativa, excluir O y H
  const candidatosNoMetal = noMetalesDisponibles.filter(s => {
    const e = ELEMENTOS[s];
    return e && s !== 'O' && s !== 'H' && e.valenciasNegativas && e.valenciasNegativas.length > 0;
  });
  if (candidatosNoMetal.length === 0) return null;

  const simMetal = elegirAleatorio(metalesDisponibles);
  const simNoMetal = elegirAleatorio(candidatosNoMetal);
  const metal = ELEMENTOS[simMetal];
  const noMetal = ELEMENTOS[simNoMetal];

  const valMetal = elegirAleatorio(metal.valencias);
  const valNoMetal = noMetal.valenciasNegativas[0]; // valor negativo

  const [subMetal, subNoMetal] = cruzarValencias(valMetal, valNoMetal);

  const formula = construirFormula(simMetal, subMetal, simNoMetal, subNoMetal);
  const formulaHTML = formulaAHTML(formula);

  const raiz = noMetal.raizAcida;

  // --- Nomenclatura sistemática ---
  const prefijoNM = obtenerPrefijo(subNoMetal, false);
  const prefijoM = obtenerPrefijo(subMetal, true);
  const parteNoMetal = aplicarElision(prefijoNM, `${raiz}uro`);
  const parteMetal = prefijoM ? aplicarElision(prefijoM, metal.nombre) : metal.nombre;
  const sistematica = `${parteNoMetal} de ${parteMetal}`;

  // --- Nomenclatura Stock ---
  const tieneMultiplesValencias = metal.valencias.length > 1;
  const stock = tieneMultiplesValencias
    ? `${raiz}uro de ${metal.nombre}(${aRomano(valMetal)})`
    : `${raiz}uro de ${metal.nombre}`;

  // --- Nomenclatura tradicional ---
  const nombreTrad = metal.nombreTradicional[valMetal];
  const tradicional = `${raiz}uro ${nombreTrad}`;

  return {
    formula,
    formulaHTML,
    tipo: TIPOS_COMPUESTO.SAL_BINARIA,
    nombres: { sistematica, stock, tradicional }
  };
}

/**
 * Genera un oxoácido a partir de la lista curada
 */
function generarOxoacido(noMetalesDisponibles, dificultad) {
  // Filtrar oxoácidos según no metales disponibles en la dificultad
  const permitidos = noMetalesDisponibles || obtenerNoMetales();
  // Para Mn y Cr (metales que forman oxoácidos), incluirlos siempre en difícil
  const config = DIFICULTAD[dificultad] || DIFICULTAD.DIFICIL;
  const metalesOxo = (config.metales === null)
    ? ['Mn', 'Cr']
    : config.metales.filter(s => ['Mn', 'Cr'].includes(s));

  const elementosPermitidos = [...permitidos, ...metalesOxo];

  const candidatos = OXOACIDOS.filter(acido => elementosPermitidos.includes(acido.noMetal));
  if (candidatos.length === 0) return null;

  const acido = elegirAleatorio(candidatos);
  const formulaHTML = formulaAHTML(acido.formula);

  // --- Nomenclatura tradicional ---
  const tradicional = acido.tradicional;

  // --- Stock (igual que tradicional para oxoácidos) ---
  const stock = tradicional;

  // --- Nomenclatura sistemática (IUPAC) ---
  // Patrón: [prefijo]oxo[raíz]ato([valencia romana]) de [prefijo]hidrógeno
  // Nota: en IUPAC no se aplica elisión en el prefijo de "oxo" (tetraoxo, no tetroxo)
  const raiz = obtenerRaizSistematicaOxoacido(acido.noMetal);
  const prefijoOxo = obtenerPrefijo(acido.o, false);

  // Caso especial: ácido dicrómico (H2Cr2O7)
  let parteAnion;
  if (acido.esDicromico) {
    // heptaoxodicromato(VI)
    parteAnion = `${prefijoOxo}oxodi${raiz}ato(${aRomano(acido.valencia)})`;
  } else {
    parteAnion = `${prefijoOxo}oxo${raiz}ato(${aRomano(acido.valencia)})`;
  }

  const prefijoH = obtenerPrefijo(acido.h, true);
  const parteHidrogeno = prefijoH
    ? `${prefijoH}hidrógeno`
    : 'hidrógeno';

  const sistematica = `${parteAnion} de ${parteHidrogeno}`;

  return {
    formula: acido.formula,
    formulaHTML,
    tipo: TIPOS_COMPUESTO.OXOACIDO,
    nombres: { sistematica, stock, tradicional }
  };
}


// =============================================================================
// FUNCIÓN PRINCIPAL DE GENERACIÓN
// =============================================================================

/**
 * Genera un compuesto del tipo y dificultad indicados.
 *
 * @param {string} tipo - Uno de los valores de TIPOS_COMPUESTO
 * @param {string} dificultad - 'FACIL', 'MEDIO' o 'DIFICIL'
 * @returns {object|null} Objeto con formula, formulaHTML, tipo y nombres
 */
export function generarCompuesto(tipo, dificultad = 'MEDIO') {
  const { metales, noMetales } = filtrarPorDificultad(dificultad);

  switch (tipo) {
    case TIPOS_COMPUESTO.OXIDO_BASICO:
      return generarOxidoBasico(metales);

    case TIPOS_COMPUESTO.OXIDO_ACIDO:
      return generarOxidoAcido(noMetales);

    case TIPOS_COMPUESTO.HIDRURO_METALICO:
      return generarHidruroMetalico(metales);

    case TIPOS_COMPUESTO.HIDRACIDO:
      return generarHidracido(noMetales);

    case TIPOS_COMPUESTO.HIDROXIDO:
      return generarHidroxido(metales);

    case TIPOS_COMPUESTO.SAL_BINARIA:
      return generarSalBinaria(metales, noMetales);

    case TIPOS_COMPUESTO.OXOACIDO:
      return generarOxoacido(noMetales, dificultad);

    default:
      console.warn(`Tipo de compuesto desconocido: ${tipo}`);
      return null;
  }
}


// =============================================================================
// GENERACIÓN ALEATORIA CON OPCIONES
// =============================================================================

/**
 * Genera un compuesto aleatorio según las opciones proporcionadas.
 *
 * @param {object} opciones
 * @param {string[]} [opciones.tipos] - Tipos de compuesto permitidos
 * @param {string[]} [opciones.metales] - Símbolos de metales permitidos
 * @param {string[]} [opciones.noMetales] - Símbolos de no metales permitidos
 * @param {string} [opciones.dificultad] - 'FACIL', 'MEDIO' o 'DIFICIL'
 * @returns {object|null}
 */
export function generarCompuestoAleatorio(opciones = {}) {
  const dificultad = opciones.dificultad || 'MEDIO';
  const config = DIFICULTAD[dificultad] || DIFICULTAD.DIFICIL;

  const tiposDisponibles = opciones.tipos
    || config.tipos
    || Object.values(TIPOS_COMPUESTO);

  const tipo = elegirAleatorio(tiposDisponibles);
  return generarCompuesto(tipo, dificultad);
}


// =============================================================================
// VERIFICACIÓN DE RESPUESTAS
// =============================================================================

/**
 * Normaliza un texto para comparación flexible:
 * - minúsculas
 * - sin espacios extras
 * - normaliza acentos (acepta con o sin tilde)
 * - elimina caracteres especiales innecesarios
 */
function normalizarTexto(texto) {
  return texto
    .toLowerCase()
    .trim()
    .replace(/\s+/g, ' ')           // múltiples espacios → uno solo
    .normalize('NFD')                // descomponer acentos
    .replace(/[\u0300-\u036f]/g, '') // eliminar marcas diacríticas
    .replace(/[()]/g, '')            // eliminar paréntesis (para fórmulas)
    .replace(/<[^>]*>/g, '');        // eliminar etiquetas HTML
}

/**
 * Verifica si la respuesta del usuario coincide con la respuesta correcta.
 * Tolerante a diferencias de acentos y mayúsculas.
 *
 * @param {string} entrada - Respuesta del usuario
 * @param {string} correcta - Respuesta correcta
 * @returns {boolean}
 */
export function verificarRespuesta(entrada, correcta) {
  if (!entrada || !correcta) return false;
  return normalizarTexto(entrada) === normalizarTexto(correcta);
}


// =============================================================================
// GENERACIÓN DE DISTRACTORES
// =============================================================================

/**
 * Genera opciones incorrectas pero plausibles para el modo quiz.
 *
 * @param {object} compuestoCorrecto - El compuesto generado (con formula, nombres, tipo)
 * @param {string} campo - 'formula' o 'nombre' (qué tipo de distractor generar)
 * @param {number} cantidad - Número de distractores a generar (por defecto 3)
 * @returns {string[]} Array de distractores (texto plano o HTML según campo)
 */
export function generarDistractores(compuestoCorrecto, campo, cantidad = 3) {
  const distractores = new Set();
  const tipo = compuestoCorrecto.tipo;
  let intentos = 0;
  const maxIntentos = cantidad * 15; // prevenir bucle infinito

  while (distractores.size < cantidad && intentos < maxIntentos) {
    intentos++;
    const candidato = generarCompuesto(tipo, 'DIFICIL');
    if (!candidato) continue;

    let valorCorrecto, valorCandidato;

    if (campo === 'formula') {
      valorCorrecto = compuestoCorrecto.formulaHTML;
      valorCandidato = candidato.formulaHTML;
    } else {
      // Para nombres, elegir aleatoriamente entre los tres sistemas
      const sistemas = ['sistematica', 'stock', 'tradicional'];
      const sistema = elegirAleatorio(sistemas);
      valorCorrecto = compuestoCorrecto.nombres[sistema] || compuestoCorrecto.nombres.sistematica;
      valorCandidato = candidato.nombres[sistema] || candidato.nombres.sistematica;
    }

    // Asegurarse de que el distractor es diferente de la respuesta correcta
    if (valorCandidato && normalizarTexto(valorCandidato) !== normalizarTexto(valorCorrecto)) {
      // También verificar que no es duplicado de otro distractor
      const normalizado = normalizarTexto(valorCandidato);
      const yaExiste = [...distractores].some(d => normalizarTexto(d) === normalizado);
      if (!yaExiste) {
        distractores.add(valorCandidato);
      }
    }
  }

  // Si no se pudieron generar suficientes, rellenar con variaciones genéricas
  if (distractores.size < cantidad) {
    const rellenos = generarDistractoresDeRespaldo(compuestoCorrecto, campo, cantidad - distractores.size);
    rellenos.forEach(r => distractores.add(r));
  }

  return [...distractores].slice(0, cantidad);
}

/**
 * Genera distractores de respaldo cuando no se puede generar suficientes del mismo tipo.
 * Intenta con otros tipos de compuesto para ofrecer variedad.
 */
function generarDistractoresDeRespaldo(compuestoCorrecto, campo, cantidad) {
  const todos = Object.values(TIPOS_COMPUESTO);
  const otrosTipos = todos.filter(t => t !== compuestoCorrecto.tipo);
  const resultados = [];
  let intentos = 0;

  while (resultados.length < cantidad && intentos < cantidad * 10) {
    intentos++;
    const tipoAlt = elegirAleatorio(otrosTipos);
    const candidato = generarCompuesto(tipoAlt, 'DIFICIL');
    if (!candidato) continue;

    const valor = campo === 'formula'
      ? candidato.formulaHTML
      : candidato.nombres.sistematica;

    if (valor) {
      const normalizado = normalizarTexto(valor);
      const yaExiste = resultados.some(r => normalizarTexto(r) === normalizado);
      const esIgualAlCorrecto = campo === 'formula'
        ? normalizarTexto(valor) === normalizarTexto(compuestoCorrecto.formulaHTML)
        : normalizarTexto(valor) === normalizarTexto(compuestoCorrecto.nombres.sistematica);

      if (!yaExiste && !esIgualAlCorrecto) {
        resultados.push(valor);
      }
    }
  }

  return resultados;
}


// =============================================================================
// RE-EXPORTACIONES PARA CONVENIENCIA
// =============================================================================

export {
  PREFIJOS_GRIEGOS,
  ELEMENTOS,
  TIPOS_COMPUESTO,
  DIFICULTAD,
  OXOACIDOS
} from './datos.js';
