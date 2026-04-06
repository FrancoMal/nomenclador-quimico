// =============================================================================
// datos.js — Datos completos de elementos y compuestos para nomenclatura
// =============================================================================

/**
 * Prefijos griegos usados en nomenclatura sistemática (IUPAC)
 */
export const PREFIJOS_GRIEGOS = {
  1: 'mono', 2: 'di', 3: 'tri', 4: 'tetra', 5: 'penta',
  6: 'hexa', 7: 'hepta', 8: 'octa', 9: 'nona', 10: 'deca'
};

/**
 * Base de datos de elementos químicos con toda la información necesaria
 * para generar nombres en los tres sistemas de nomenclatura.
 *
 * Cada entrada contiene:
 * - nombre: nombre en español
 * - simbolo: símbolo químico
 * - valencias: valencias positivas para formación de compuestos
 * - valenciasNegativas: valencias negativas (si aplica)
 * - tipo: 'metal' | 'no_metal' | 'semimetal'
 * - nombreTradicional: objeto { valencia: nombre tradicional }
 * - raizAcida: raíz para nomenclatura de ácidos y sales (no metales)
 * - raizOxoacido: objeto { valencia: nombre del ácido tradicional } (no metales que forman oxoácidos)
 */
export const ELEMENTOS = {
  // =========================================================================
  // METALES CON UNA SOLA VALENCIA
  // =========================================================================
  Li: {
    nombre: 'litio',
    simbolo: 'Li',
    valencias: [1],
    tipo: 'metal',
    nombreTradicional: { 1: 'lítico' }
  },
  Na: {
    nombre: 'sodio',
    simbolo: 'Na',
    valencias: [1],
    tipo: 'metal',
    nombreTradicional: { 1: 'sódico' }
  },
  K: {
    nombre: 'potasio',
    simbolo: 'K',
    valencias: [1],
    tipo: 'metal',
    nombreTradicional: { 1: 'potásico' }
  },
  Rb: {
    nombre: 'rubidio',
    simbolo: 'Rb',
    valencias: [1],
    tipo: 'metal',
    nombreTradicional: { 1: 'rubídico' }
  },
  Cs: {
    nombre: 'cesio',
    simbolo: 'Cs',
    valencias: [1],
    tipo: 'metal',
    nombreTradicional: { 1: 'césico' }
  },
  Ag: {
    nombre: 'plata',
    simbolo: 'Ag',
    valencias: [1],
    tipo: 'metal',
    nombreTradicional: { 1: 'argéntico' }
  },
  Ca: {
    nombre: 'calcio',
    simbolo: 'Ca',
    valencias: [2],
    tipo: 'metal',
    nombreTradicional: { 2: 'cálcico' }
  },
  Mg: {
    nombre: 'magnesio',
    simbolo: 'Mg',
    valencias: [2],
    tipo: 'metal',
    nombreTradicional: { 2: 'magnésico' }
  },
  Ba: {
    nombre: 'bario',
    simbolo: 'Ba',
    valencias: [2],
    tipo: 'metal',
    nombreTradicional: { 2: 'bárico' }
  },
  Sr: {
    nombre: 'estroncio',
    simbolo: 'Sr',
    valencias: [2],
    tipo: 'metal',
    nombreTradicional: { 2: 'estróntico' }
  },
  Zn: {
    nombre: 'zinc',
    simbolo: 'Zn',
    valencias: [2],
    tipo: 'metal',
    nombreTradicional: { 2: 'cínquico' }
  },
  Al: {
    nombre: 'aluminio',
    simbolo: 'Al',
    valencias: [3],
    tipo: 'metal',
    nombreTradicional: { 3: 'alumínico' }
  },

  // =========================================================================
  // METALES CON DOS O MÁS VALENCIAS
  // =========================================================================
  Fe: {
    nombre: 'hierro',
    simbolo: 'Fe',
    valencias: [2, 3],
    tipo: 'metal',
    nombreTradicional: { 2: 'ferroso', 3: 'férrico' }
  },
  Cu: {
    nombre: 'cobre',
    simbolo: 'Cu',
    valencias: [1, 2],
    tipo: 'metal',
    nombreTradicional: { 1: 'cuproso', 2: 'cúprico' }
  },
  Co: {
    nombre: 'cobalto',
    simbolo: 'Co',
    valencias: [2, 3],
    tipo: 'metal',
    nombreTradicional: { 2: 'cobaltoso', 3: 'cobáltico' }
  },
  Ni: {
    nombre: 'níquel',
    simbolo: 'Ni',
    valencias: [2, 3],
    tipo: 'metal',
    nombreTradicional: { 2: 'niqueloso', 3: 'niquélico' }
  },
  Sn: {
    nombre: 'estaño',
    simbolo: 'Sn',
    valencias: [2, 4],
    tipo: 'metal',
    nombreTradicional: { 2: 'estannoso', 4: 'estánnico' }
  },
  Pb: {
    nombre: 'plomo',
    simbolo: 'Pb',
    valencias: [2, 4],
    tipo: 'metal',
    nombreTradicional: { 2: 'plumboso', 4: 'plúmbico' }
  },
  Hg: {
    nombre: 'mercurio',
    simbolo: 'Hg',
    valencias: [1, 2],
    tipo: 'metal',
    nombreTradicional: { 1: 'mercurioso', 2: 'mercúrico' }
  },
  Pt: {
    nombre: 'platino',
    simbolo: 'Pt',
    valencias: [2, 4],
    tipo: 'metal',
    nombreTradicional: { 2: 'platinoso', 4: 'platínico' }
  },
  Au: {
    nombre: 'oro',
    simbolo: 'Au',
    valencias: [1, 3],
    tipo: 'metal',
    nombreTradicional: { 1: 'auroso', 3: 'áurico' }
  },
  Mn: {
    nombre: 'manganeso',
    simbolo: 'Mn',
    valencias: [2, 3, 4, 7],
    tipo: 'metal',
    nombreTradicional: { 2: 'hipomanganoso', 3: 'manganoso', 4: 'mangánico', 7: 'permangánico' }
  },
  Cr: {
    nombre: 'cromo',
    simbolo: 'Cr',
    valencias: [2, 3, 6],
    tipo: 'metal',
    nombreTradicional: { 2: 'hipocromoso', 3: 'cromoso', 6: 'crómico' }
  },

  // =========================================================================
  // NO METALES
  // =========================================================================
  H: {
    nombre: 'hidrógeno',
    simbolo: 'H',
    valencias: [1],
    valenciasNegativas: [-1],
    tipo: 'no_metal'
  },
  F: {
    nombre: 'flúor',
    simbolo: 'F',
    valencias: [],
    valenciasNegativas: [-1],
    tipo: 'no_metal',
    raizAcida: 'fluor'
  },
  Cl: {
    nombre: 'cloro',
    simbolo: 'Cl',
    valencias: [1, 3, 5, 7],
    valenciasNegativas: [-1],
    tipo: 'no_metal',
    raizAcida: 'clor',
    raizOxoacido: { 1: 'hipocloroso', 3: 'cloroso', 5: 'clórico', 7: 'perclórico' }
  },
  Br: {
    nombre: 'bromo',
    simbolo: 'Br',
    valencias: [1, 3, 5, 7],
    valenciasNegativas: [-1],
    tipo: 'no_metal',
    raizAcida: 'brom',
    raizOxoacido: { 1: 'hipobromoso', 3: 'bromoso', 5: 'brómico', 7: 'perbrómico' }
  },
  I: {
    nombre: 'yodo',
    simbolo: 'I',
    valencias: [1, 3, 5, 7],
    valenciasNegativas: [-1],
    tipo: 'no_metal',
    raizAcida: 'yod',
    raizOxoacido: { 1: 'hipoyodoso', 3: 'yodoso', 5: 'yódico', 7: 'peryódico' }
  },
  O: {
    nombre: 'oxígeno',
    simbolo: 'O',
    valencias: [],
    valenciasNegativas: [-2],
    tipo: 'no_metal'
  },
  S: {
    nombre: 'azufre',
    simbolo: 'S',
    valencias: [2, 4, 6],
    valenciasNegativas: [-2],
    tipo: 'no_metal',
    raizAcida: 'sulf',
    raizOxoacido: { 2: 'hiposulfuroso', 4: 'sulfuroso', 6: 'sulfúrico' }
  },
  Se: {
    nombre: 'selenio',
    simbolo: 'Se',
    valencias: [2, 4, 6],
    valenciasNegativas: [-2],
    tipo: 'no_metal',
    raizAcida: 'selen',
    raizOxoacido: { 2: 'hiposelenioso', 4: 'selenioso', 6: 'selénico' }
  },
  Te: {
    nombre: 'teluro',
    simbolo: 'Te',
    valencias: [2, 4, 6],
    valenciasNegativas: [-2],
    tipo: 'no_metal',
    raizAcida: 'telur',
    raizOxoacido: { 2: 'hipoteluroso', 4: 'teluroso', 6: 'telúrico' }
  },
  N: {
    nombre: 'nitrógeno',
    simbolo: 'N',
    valencias: [1, 2, 3, 4, 5],
    valenciasNegativas: [-3],
    tipo: 'no_metal',
    raizAcida: 'nitr',
    raizOxoacido: { 1: 'hiponitroso', 3: 'nitroso', 5: 'nítrico' }
  },
  P: {
    nombre: 'fósforo',
    simbolo: 'P',
    valencias: [3, 5],
    valenciasNegativas: [-3],
    tipo: 'no_metal',
    raizAcida: 'fosfor',
    raizOxoacido: { 1: 'hipofosforoso', 3: 'fosforoso', 5: 'fosfórico' }
  },
  C: {
    nombre: 'carbono',
    simbolo: 'C',
    valencias: [2, 4],
    valenciasNegativas: [-4],
    tipo: 'no_metal',
    raizAcida: 'carbon',
    raizOxoacido: { 2: 'carbonoso', 4: 'carbónico' }
  },
  Si: {
    nombre: 'silicio',
    simbolo: 'Si',
    valencias: [4],
    valenciasNegativas: [-4],
    tipo: 'no_metal',
    raizAcida: 'silic',
    raizOxoacido: { 4: 'silícico' }
  },
  B: {
    nombre: 'boro',
    simbolo: 'B',
    valencias: [3],
    valenciasNegativas: [-3],
    tipo: 'no_metal',
    raizAcida: 'bor',
    raizOxoacido: { 3: 'bórico' }
  }
};

/**
 * Tipos de compuestos inorgánicos soportados
 */
export const TIPOS_COMPUESTO = {
  OXIDO_BASICO: 'oxido_basico',         // Metal + O
  OXIDO_ACIDO: 'oxido_acido',           // No metal + O
  HIDRURO_METALICO: 'hidruro_metalico', // Metal + H
  HIDRACIDO: 'hidracido',               // H + (F,Cl,Br,I,S,Se,Te)
  HIDROXIDO: 'hidroxido',               // Metal + OH
  SAL_BINARIA: 'sal_binaria',           // Metal + No metal
  OXOACIDO: 'oxoacido',                 // H + No metal + O
  HIDRURO_NO_METALICO: 'hidruro_no_metalico', // H + no metal (estado gaseoso)
  OXOSAL: 'oxosal',                     // Metal + No metal + O (sal ternaria)
  OXOSAL_ACIDA: 'oxosal_acida'          // Metal + H + No metal + O (sal cuaternaria)
};

/**
 * Configuración de dificultad para la práctica
 */
export const DIFICULTAD = {
  FACIL: {
    nombre: 'Fácil',
    metales: ['Na', 'K', 'Ca', 'Mg', 'Al', 'Li', 'Ba', 'Ag', 'Zn'],
    noMetales: ['O', 'Cl', 'S', 'F', 'Br', 'N'],
    tipos: ['oxido_basico', 'oxido_acido', 'hidruro_metalico', 'hidracido', 'hidroxido', 'hidruro_no_metalico']
  },
  MEDIO: {
    nombre: 'Medio',
    metales: ['Na', 'K', 'Ca', 'Mg', 'Al', 'Fe', 'Cu', 'Ag', 'Zn', 'Ba', 'Pb', 'Sn'],
    noMetales: ['O', 'Cl', 'S', 'F', 'Br', 'I', 'N', 'P'],
    tipos: ['oxido_basico', 'oxido_acido', 'hidruro_metalico', 'hidracido', 'hidroxido', 'sal_binaria', 'hidruro_no_metalico', 'oxosal']
  },
  DIFICIL: {
    nombre: 'Difícil',
    metales: null,   // todos
    noMetales: null,  // todos
    tipos: null       // todos, incluye oxoácidos
  }
};

/**
 * Lista curada de oxoácidos comunes con sus fórmulas, composición y nombres
 */
export const OXOACIDOS = [
  // Ácidos del carbono
  { formula: 'H2CO3', h: 2, noMetal: 'C', o: 3, valencia: 4, tradicional: 'ácido carbónico', nombreSal: 'carbonato' },

  // Ácidos del nitrógeno
  { formula: 'HNO2', h: 1, noMetal: 'N', o: 2, valencia: 3, tradicional: 'ácido nitroso', nombreSal: 'nitrito' },
  { formula: 'HNO3', h: 1, noMetal: 'N', o: 3, valencia: 5, tradicional: 'ácido nítrico', nombreSal: 'nitrato' },

  // Ácidos del azufre
  { formula: 'H2SO2', h: 2, noMetal: 'S', o: 2, valencia: 2, tradicional: 'ácido hiposulfuroso', nombreSal: 'hiposulfito' },
  { formula: 'H2SO3', h: 2, noMetal: 'S', o: 3, valencia: 4, tradicional: 'ácido sulfuroso', nombreSal: 'sulfito' },
  { formula: 'H2SO4', h: 2, noMetal: 'S', o: 4, valencia: 6, tradicional: 'ácido sulfúrico', nombreSal: 'sulfato' },

  // Ácidos del cloro
  { formula: 'HClO', h: 1, noMetal: 'Cl', o: 1, valencia: 1, tradicional: 'ácido hipocloroso', nombreSal: 'hipoclorito' },
  { formula: 'HClO2', h: 1, noMetal: 'Cl', o: 2, valencia: 3, tradicional: 'ácido cloroso', nombreSal: 'clorito' },
  { formula: 'HClO3', h: 1, noMetal: 'Cl', o: 3, valencia: 5, tradicional: 'ácido clórico', nombreSal: 'clorato' },
  { formula: 'HClO4', h: 1, noMetal: 'Cl', o: 4, valencia: 7, tradicional: 'ácido perclórico', nombreSal: 'perclorato' },

  // Ácidos del bromo
  { formula: 'HBrO', h: 1, noMetal: 'Br', o: 1, valencia: 1, tradicional: 'ácido hipobromoso', nombreSal: 'hipobromito' },
  { formula: 'HBrO2', h: 1, noMetal: 'Br', o: 2, valencia: 3, tradicional: 'ácido bromoso', nombreSal: 'bromito' },
  { formula: 'HBrO3', h: 1, noMetal: 'Br', o: 3, valencia: 5, tradicional: 'ácido brómico', nombreSal: 'bromato' },
  { formula: 'HBrO4', h: 1, noMetal: 'Br', o: 4, valencia: 7, tradicional: 'ácido perbrómico', nombreSal: 'perbromato' },

  // Ácidos del yodo
  { formula: 'HIO', h: 1, noMetal: 'I', o: 1, valencia: 1, tradicional: 'ácido hipoyodoso', nombreSal: 'hipoyodito' },
  { formula: 'HIO3', h: 1, noMetal: 'I', o: 3, valencia: 5, tradicional: 'ácido yódico', nombreSal: 'yodato' },
  { formula: 'HIO4', h: 1, noMetal: 'I', o: 4, valencia: 7, tradicional: 'ácido peryódico', nombreSal: 'peryodato' },

  // Ácidos del fósforo
  { formula: 'H3PO3', h: 3, noMetal: 'P', o: 3, valencia: 3, tradicional: 'ácido fosforoso', nombreSal: 'fosfito' },
  { formula: 'H3PO4', h: 3, noMetal: 'P', o: 4, valencia: 5, tradicional: 'ácido fosfórico', nombreSal: 'fosfato' },

  // Ácidos del boro
  { formula: 'H3BO3', h: 3, noMetal: 'B', o: 3, valencia: 3, tradicional: 'ácido bórico', nombreSal: 'borato' },

  // Ácidos del silicio
  { formula: 'H2SiO3', h: 2, noMetal: 'Si', o: 3, valencia: 4, tradicional: 'ácido silícico', nombreSal: 'silicato' },

  // Ácidos del selenio
  { formula: 'H2SeO3', h: 2, noMetal: 'Se', o: 3, valencia: 4, tradicional: 'ácido selenioso', nombreSal: 'selenito' },
  { formula: 'H2SeO4', h: 2, noMetal: 'Se', o: 4, valencia: 6, tradicional: 'ácido selénico', nombreSal: 'selenato' },

  // Ácidos del teluro
  { formula: 'H2TeO3', h: 2, noMetal: 'Te', o: 3, valencia: 4, tradicional: 'ácido teluroso', nombreSal: 'telurito' },
  { formula: 'H2TeO4', h: 2, noMetal: 'Te', o: 4, valencia: 6, tradicional: 'ácido telúrico', nombreSal: 'telurato' },

  // Ácidos del manganeso (casos especiales — metal que forma oxoácidos)
  { formula: 'H2MnO4', h: 2, noMetal: 'Mn', o: 4, valencia: 6, tradicional: 'ácido mangánico', nombreSal: 'manganato' },
  { formula: 'HMnO4', h: 1, noMetal: 'Mn', o: 4, valencia: 7, tradicional: 'ácido permangánico', nombreSal: 'permanganato' },

  // Ácidos del cromo (casos especiales — metal que forma oxoácidos)
  { formula: 'H2CrO4', h: 2, noMetal: 'Cr', o: 4, valencia: 6, tradicional: 'ácido crómico', nombreSal: 'cromato' },
  { formula: 'H2Cr2O7', h: 2, noMetal: 'Cr', o: 7, valencia: 6, tradicional: 'ácido dicrómico', esDicromico: true, nombreSal: 'dicromato' }
];
