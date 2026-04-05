// =============================================================================
// juego.js — Game logic class (pure logic, no DOM)
// =============================================================================

import {
  generarCompuestoAleatorio,
  verificarRespuesta,
  generarDistractores,
  TIPOS_COMPUESTO
} from './nomenclatura.js';

// =============================================================================
// UTILITIES
// =============================================================================

/**
 * Shuffle an array in place using Fisher-Yates algorithm.
 * Returns the same array reference.
 */
function barajar(arr) {
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

/**
 * Pick a random element from an array.
 */
function elegirAleatorio(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

const SISTEMAS = ['sistematica', 'stock', 'tradicional'];

const NOMBRES_MODO = {
  'formula-nombre': 'Fórmula → Nombre',
  'nombre-formula': 'Nombre → Fórmula',
  'quiz-formula': 'Quiz: Fórmula → Nombre',
  'quiz-nombre': 'Quiz: Nombre → Fórmula'
};

// =============================================================================
// JUEGO CLASS
// =============================================================================

export class Juego {
  /**
   * @param {object} config
   * @param {string} config.modo - 'formula-nombre' | 'nombre-formula' | 'quiz-formula' | 'quiz-nombre'
   * @param {string} config.dificultad - 'FACIL' | 'MEDIO' | 'DIFICIL'
   * @param {string} config.sistemaNomenclatura - 'sistematica' | 'stock' | 'tradicional' | 'aleatorio'
   * @param {string[]} config.tiposCompuestos - array of TIPOS_COMPUESTO values
   */
  constructor(config) {
    this.modo = config.modo;
    this.dificultad = config.dificultad;
    this.sistemaNomenclatura = config.sistemaNomenclatura;
    this.tiposCompuestos = config.tiposCompuestos;
    this.nombreModo = NOMBRES_MODO[this.modo] || this.modo;

    // Current question state
    this.preguntaActual = null;
    this.respuestaCorrecta = null;
    this.respuestaCorrectaHTML = null;
    this.compuestoActual = null;
    this.sistemaActual = null;

    // Stats
    this.aciertos = 0;
    this.errores = 0;
    this.total = 0;
    this.racha = 0;
    this.mejorRacha = 0;

    // Lock to prevent double-checking
    this.respondida = false;
  }

  /**
   * Generate a new question and return question data.
   * @returns {object|null} Question data or null on failure
   */
  nuevaPregunta() {
    this.respondida = false;

    // Generate compound with retries
    let compuesto = null;
    for (let i = 0; i < 5; i++) {
      compuesto = generarCompuestoAleatorio({
        tipos: this.tiposCompuestos,
        dificultad: this.dificultad
      });
      if (compuesto) break;
    }

    if (!compuesto) {
      return null;
    }

    this.compuestoActual = compuesto;

    // Determine nomenclature system for this question
    let sistema = this.sistemaNomenclatura;
    const esTodas = sistema === 'todas';
    if (sistema === 'aleatorio' || sistema === 'todas') {
      sistema = elegirAleatorio(SISTEMAS);
    }
    this.sistemaActual = esTodas ? 'todas' : sistema;

    const nombre = compuesto.nombres[sistema];
    let pregunta;
    let respuestaCorrecta;
    let respuestaCorrectaHTML = null;
    let opciones = null;

    // Build formatted string with all 3 names for "todas" mode
    const todosLosNombres = esTodas
      ? `Sist: ${compuesto.nombres.sistematica}\nStock: ${compuesto.nombres.stock}\nTrad: ${compuesto.nombres.tradicional}`
      : null;

    switch (this.modo) {
      case 'formula-nombre':
        // Show formula, user types the name
        pregunta = compuesto.formulaHTML;
        respuestaCorrecta = nombre;
        break;

      case 'nombre-formula':
        // Show name, user types the formula
        pregunta = esTodas ? todosLosNombres : nombre;
        respuestaCorrecta = compuesto.formula;
        break;

      case 'quiz-formula': {
        // Show formula, user picks the correct name from 4 options
        pregunta = compuesto.formulaHTML;
        respuestaCorrecta = nombre;
        const distractoresNombre = generarDistractores(compuesto, 'nombre', 3);
        opciones = barajar([respuestaCorrecta, ...distractoresNombre]);
        break;
      }

      case 'quiz-nombre': {
        // Show name, user picks the correct formula from 4 options
        pregunta = esTodas ? todosLosNombres : nombre;
        respuestaCorrecta = compuesto.formula;
        respuestaCorrectaHTML = compuesto.formulaHTML;
        const distractoresFormula = generarDistractores(compuesto, 'formula', 3);
        // distractores for 'formula' come as HTML strings
        opciones = barajar([compuesto.formulaHTML, ...distractoresFormula]);
        break;
      }

      default:
        return null;
    }

    this.respuestaCorrecta = respuestaCorrecta;
    this.respuestaCorrectaHTML = respuestaCorrectaHTML;
    this.preguntaActual = pregunta;

    return {
      pregunta,
      respuestaCorrecta,
      sistema: this.sistemaActual,
      compuesto,
      opciones
    };
  }

  /**
   * Verify the user's answer.
   * @param {string} respuesta - The user's answer
   * @returns {object} { correcto, respuestaCorrecta, respuestaCorrectaHTML }
   */
  verificar(respuesta) {
    if (this.respondida) {
      return {
        correcto: false,
        respuestaCorrecta: this.respuestaCorrecta,
        respuestaCorrectaHTML: this.respuestaCorrectaHTML
      };
    }

    this.respondida = true;
    let correcto;

    if (this.esQuiz) {
      // For quiz modes, compare directly
      // For quiz-nombre the options and correct answer are HTML strings
      if (this.modo === 'quiz-nombre') {
        correcto = respuesta === this.compuestoActual.formulaHTML;
      } else {
        correcto = verificarRespuesta(respuesta, this.respuestaCorrecta);
      }
    } else if (this.sistemaActual === 'todas' && this.modo === 'formula-nombre') {
      // In "todas" mode for formula→nombre, accept any of the 3 system names
      const nombres = this.compuestoActual.nombres;
      correcto = verificarRespuesta(respuesta, nombres.sistematica)
        || verificarRespuesta(respuesta, nombres.stock)
        || verificarRespuesta(respuesta, nombres.tradicional);
    } else {
      correcto = verificarRespuesta(respuesta, this.respuestaCorrecta);
    }

    // Update stats
    this.total++;
    if (correcto) {
      this.aciertos++;
      this.racha++;
      if (this.racha > this.mejorRacha) {
        this.mejorRacha = this.racha;
      }
    } else {
      this.errores++;
      this.racha = 0;
    }

    return {
      correcto,
      respuestaCorrecta: this.respuestaCorrecta,
      respuestaCorrectaHTML: this.respuestaCorrectaHTML
    };
  }

  /**
   * Get current game statistics.
   * @returns {object}
   */
  getEstadisticas() {
    const porcentaje = this.total > 0
      ? Math.round((this.aciertos / this.total) * 100)
      : 0;

    return {
      aciertos: this.aciertos,
      errores: this.errores,
      total: this.total,
      racha: this.racha,
      mejorRacha: this.mejorRacha,
      porcentaje
    };
  }

  /**
   * Reset all stats, keep configuration.
   */
  reset() {
    this.aciertos = 0;
    this.errores = 0;
    this.total = 0;
    this.racha = 0;
    this.mejorRacha = 0;
    this.respondida = false;
    this.preguntaActual = null;
    this.respuestaCorrecta = null;
    this.respuestaCorrectaHTML = null;
    this.compuestoActual = null;
    this.sistemaActual = null;
  }

  /**
   * Whether the current mode is a quiz (multiple choice).
   */
  get esQuiz() {
    return this.modo.startsWith('quiz-');
  }

  /**
   * Whether the user's answer is a formula (needs special char buttons).
   */
  get esFormulaInput() {
    return this.modo === 'nombre-formula' || this.modo === 'quiz-nombre';
  }
}
