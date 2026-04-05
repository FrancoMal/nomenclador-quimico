// =============================================================================
// app.js — Main app controller (all DOM interactions)
// =============================================================================

import { Juego } from './juego.js';
import { TIPOS_COMPUESTO } from './nomenclatura.js';

// =============================================================================
// STATE
// =============================================================================

/** @type {Juego|null} */
let juego = null;

/** Whether we are currently waiting for "next question" (feedback is shown) */
let esperandoSiguiente = false;

/** The quiz option the user selected (for highlighting) */
let opcionSeleccionada = null;

// =============================================================================
// DOM REFERENCES
// =============================================================================

const $ = (sel) => document.querySelector(sel);
const $$ = (sel) => document.querySelectorAll(sel);

// Screens
const pantallaInicio = $('#pantalla-inicio');
const pantallaJuego = $('#pantalla-juego');
const modalResultados = $('#modal-resultados');

// Start screen
const btnConfigToggle = $('#btn-config-toggle');
const configPanel = $('#config-panel');
const btnDarkMode = $('#btn-dark-mode');

// Game screen
const btnVolver = $('#btn-volver');
const modoActual = $('#modo-actual');
const statAciertos = $('#stat-aciertos');
const statErrores = $('#stat-errores');
const statRacha = $('#stat-racha');
const textoPregunta = $('#texto-pregunta');
const respuestaTexto = $('#respuesta-texto');
const respuestaQuiz = $('#respuesta-quiz');
const inputRespuesta = $('#input-respuesta');
const btnComprobar = $('#btn-comprobar');
const sistemaNombre = $('#sistema-nombre');
const helperChars = $('#helper-chars');
const zonaFeedback = $('#zona-feedback');
const feedbackResultado = $('#feedback-resultado');
const feedbackCorreccion = $('#feedback-correccion');
const btnSiguiente = $('#btn-siguiente');
const preguntaNum = $('#pregunta-num');

// Results modal
const resTotal = $('#res-total');
const resAciertos = $('#res-aciertos');
const resErrores = $('#res-errores');
const resPorcentaje = $('#res-porcentaje');
const resRacha = $('#res-racha');
const btnModalInicio = $('#btn-modal-inicio');
const btnModalReplay = $('#btn-modal-replay');

// =============================================================================
// CHECKBOX VALUE → TIPOS_COMPUESTO MAPPING
// =============================================================================

const CHECKBOX_TO_TIPO = {
  'oxidos-basicos': TIPOS_COMPUESTO.OXIDO_BASICO,
  'oxidos-acidos': TIPOS_COMPUESTO.OXIDO_ACIDO,
  'hidruros': TIPOS_COMPUESTO.HIDRURO_METALICO,
  'hidracidos': TIPOS_COMPUESTO.HIDRACIDO,
  'hidroxidos': TIPOS_COMPUESTO.HIDROXIDO,
  'sales-binarias': TIPOS_COMPUESTO.SAL_BINARIA,
  'oxoacidos': TIPOS_COMPUESTO.OXOACIDO
};

const NOMBRES_SISTEMA = {
  'sistematica': 'Sistemática',
  'stock': 'Stock',
  'tradicional': 'Tradicional',
  'aleatorio': 'Aleatorio',
  'todas': 'Todas'
};

// =============================================================================
// UNICODE SUBSCRIPT NORMALIZATION
// =============================================================================

const SUBSCRIPT_MAP = {
  '\u2080': '0', '\u2081': '1', '\u2082': '2', '\u2083': '3',
  '\u2084': '4', '\u2085': '5', '\u2086': '6', '\u2087': '7',
  '\u2088': '8', '\u2089': '9'
};

/**
 * Normalize formula input: convert unicode subscripts to regular digits,
 * trim whitespace, and collapse multiple spaces.
 */
function normalizarFormula(input) {
  let resultado = input;
  for (const [sub, digit] of Object.entries(SUBSCRIPT_MAP)) {
    resultado = resultado.split(sub).join(digit);
  }
  return resultado.trim().replace(/\s+/g, ' ');
}

// =============================================================================
// SCREEN NAVIGATION
// =============================================================================

/**
 * Hide all .screen elements, then show the one with the given id.
 */
function mostrarPantalla(id) {
  $$('.screen').forEach((screen) => {
    screen.classList.remove('visible');
    screen.classList.add('hidden');
  });
  const target = $(`#${id}`);
  if (target) {
    target.classList.remove('hidden');
    target.classList.add('visible');
  }
}

// =============================================================================
// CONFIGURATION
// =============================================================================

/**
 * Read the current configuration from the UI.
 */
function leerConfiguracion() {
  // Difficulty
  const btnDif = $('.btn-group__item.active[data-difficulty]');
  const dificultad = btnDif ? btnDif.dataset.difficulty.toUpperCase() : 'MEDIO';

  // Nomenclature system
  const btnSis = $('.btn-group__item.active[data-system]');
  const sistemaNomenclatura = btnSis ? btnSis.dataset.system : 'aleatorio';

  // Compound types
  const checkboxes = $$('input[name="tipo-compuesto"]:checked');
  const tiposCompuestos = [];
  checkboxes.forEach((cb) => {
    const tipo = CHECKBOX_TO_TIPO[cb.value];
    if (tipo) {
      tiposCompuestos.push(tipo);
    }
  });

  // If none selected, default to all
  if (tiposCompuestos.length === 0) {
    tiposCompuestos.push(...Object.values(TIPOS_COMPUESTO));
  }

  return { dificultad, sistemaNomenclatura, tiposCompuestos };
}

// =============================================================================
// CONFIG PANEL TOGGLE
// =============================================================================

function toggleConfigPanel() {
  const expanded = btnConfigToggle.getAttribute('aria-expanded') === 'true';
  const nuevoEstado = !expanded;

  btnConfigToggle.setAttribute('aria-expanded', String(nuevoEstado));
  configPanel.setAttribute('aria-hidden', String(!nuevoEstado));

  if (nuevoEstado) {
    configPanel.style.maxHeight = configPanel.scrollHeight + 'px';
  } else {
    configPanel.style.maxHeight = '0';
  }
}

// =============================================================================
// BUTTON GROUP MANAGEMENT
// =============================================================================

/**
 * Handle click on a button group item: deactivate siblings, activate clicked.
 */
function activarBotonGrupo(btn) {
  const group = btn.closest('.btn-group');
  if (!group) return;

  group.querySelectorAll('.btn-group__item').forEach((item) => {
    item.classList.remove('active');
    item.setAttribute('aria-checked', 'false');
  });

  btn.classList.add('active');
  btn.setAttribute('aria-checked', 'true');
}

// =============================================================================
// DARK MODE
// =============================================================================

function aplicarDarkMode(activo) {
  document.body.classList.toggle('dark-mode', activo);
  localStorage.setItem('darkMode', activo ? 'true' : 'false');
}

function toggleDarkMode() {
  const activo = document.body.classList.contains('dark-mode');
  aplicarDarkMode(!activo);
}

function cargarPreferenciaDarkMode() {
  const pref = localStorage.getItem('darkMode');
  if (pref === 'true') {
    aplicarDarkMode(true);
  }
}

// =============================================================================
// STATS DISPLAY
// =============================================================================

function actualizarStats() {
  if (!juego) return;
  const stats = juego.getEstadisticas();
  statAciertos.textContent = stats.aciertos;
  statErrores.textContent = stats.errores;
  statRacha.textContent = stats.racha;
}

// =============================================================================
// GAME FLOW
// =============================================================================

/**
 * Start a game with the given mode.
 */
function iniciarJuego(modo) {
  const config = leerConfiguracion();
  config.modo = modo;

  juego = new Juego(config);

  // Show game screen
  mostrarPantalla('pantalla-juego');

  // Set mode title
  modoActual.textContent = juego.nombreModo;

  // Show/hide text vs quiz answer areas
  if (juego.esQuiz) {
    respuestaTexto.classList.add('hidden');
    respuestaQuiz.classList.remove('hidden');
  } else {
    respuestaTexto.classList.remove('hidden');
    respuestaQuiz.classList.add('hidden');
  }

  // Show/hide special character buttons (only for formula input in text mode)
  if (!juego.esQuiz && juego.esFormulaInput) {
    helperChars.classList.remove('hidden');
  } else {
    helperChars.classList.add('hidden');
  }

  // Reset stats display
  actualizarStats();

  // Load first question
  cargarPregunta();
}

/**
 * Load a new question into the UI.
 */
function cargarPregunta() {
  if (!juego) return;

  esperandoSiguiente = false;
  opcionSeleccionada = null;

  const datos = juego.nuevaPregunta();

  if (!datos) {
    textoPregunta.innerHTML = '<em>No se pudo generar un compuesto. Intenta cambiar la configuración.</em>';
    return;
  }

  // Display question (use innerHTML for formulas with <sub> tags)
  // For "todas" mode in nombre→formula, pregunta has \n separators
  if (datos.pregunta.includes('\n')) {
    textoPregunta.innerHTML = datos.pregunta.replace(/\n/g, '<br>');
  } else {
    textoPregunta.innerHTML = datos.pregunta;
  }

  // Update system name
  sistemaNombre.textContent = NOMBRES_SISTEMA[datos.sistema] || datos.sistema;

  // Update question counter
  const stats = juego.getEstadisticas();
  preguntaNum.textContent = stats.total + 1;

  // Clear previous input and feedback
  inputRespuesta.value = '';
  zonaFeedback.classList.add('hidden');
  feedbackResultado.textContent = '';
  feedbackCorreccion.innerHTML = '';
  feedbackResultado.classList.remove('correct-animation', 'wrong-animation');

  // Enable input
  inputRespuesta.disabled = false;
  btnComprobar.disabled = false;

  if (juego.esQuiz) {
    // Populate quiz buttons
    const botonesQuiz = $$('.opcion-quiz');
    botonesQuiz.forEach((btn, i) => {
      // Reset state
      btn.classList.remove('correct', 'wrong');
      btn.disabled = false;

      if (datos.opciones && datos.opciones[i] != null) {
        // For quiz-nombre mode, options are formula HTML strings
        if (juego.modo === 'quiz-nombre') {
          btn.innerHTML = datos.opciones[i];
        } else {
          btn.textContent = datos.opciones[i];
        }
        btn.dataset.value = datos.opciones[i];
      } else {
        btn.textContent = '';
        btn.dataset.value = '';
      }
    });
  } else {
    // Focus text input
    inputRespuesta.focus();
  }
}

/**
 * Check the user's answer.
 */
function comprobar() {
  if (!juego || esperandoSiguiente) return;

  let respuestaUsuario;

  if (juego.esQuiz) {
    // For quiz, we need a selected option
    if (opcionSeleccionada === null) return;
    respuestaUsuario = opcionSeleccionada;
  } else {
    respuestaUsuario = inputRespuesta.value.trim();
    if (!respuestaUsuario) return;

    // For formula input, normalize unicode subscripts
    if (juego.esFormulaInput) {
      respuestaUsuario = normalizarFormula(respuestaUsuario);
    }
  }

  const resultado = juego.verificar(respuestaUsuario);

  // Show feedback
  zonaFeedback.classList.remove('hidden');

  // Build reference text showing all 3 names (for "todas" mode)
  const esTodas = juego.sistemaActual === 'todas';
  let referenciaHTML = '';
  if (esTodas && juego.compuestoActual) {
    const n = juego.compuestoActual.nombres;
    referenciaHTML = '<br><small><b>Sist:</b> ' + n.sistematica + ' · <b>Stock:</b> ' + n.stock + ' · <b>Trad:</b> ' + n.tradicional + '</small>';
  }

  if (resultado.correcto) {
    feedbackResultado.textContent = '✅ ¡Correcto!';
    feedbackResultado.classList.add('correct-animation');
    feedbackCorreccion.innerHTML = referenciaHTML;
  } else {
    feedbackResultado.textContent = '❌ Incorrecto';
    feedbackResultado.classList.add('wrong-animation');

    // Show correct answer
    if (juego.esFormulaInput && resultado.respuestaCorrectaHTML) {
      feedbackCorreccion.innerHTML =
        'La respuesta correcta es: <strong>' + resultado.respuestaCorrectaHTML + '</strong>' +
        ' (' + resultado.respuestaCorrecta + ')';
    } else if (juego.esFormulaInput) {
      feedbackCorreccion.innerHTML =
        'La respuesta correcta es: <strong>' + resultado.respuestaCorrecta + '</strong>';
    } else {
      feedbackCorreccion.innerHTML =
        'La respuesta correcta es: <strong>' + resultado.respuestaCorrecta + '</strong>' + referenciaHTML;
    }
  }

  // Update stats
  actualizarStats();

  // For quiz: highlight correct and wrong buttons
  if (juego.esQuiz) {
    const botonesQuiz = $$('.opcion-quiz');
    botonesQuiz.forEach((btn) => {
      btn.disabled = true;

      const valorBtn = btn.dataset.value;

      // Determine correct value for comparison
      let esCorrecta;
      if (juego.modo === 'quiz-nombre') {
        esCorrecta = valorBtn === juego.compuestoActual.formulaHTML;
      } else {
        esCorrecta = valorBtn === resultado.respuestaCorrecta;
      }

      if (esCorrecta) {
        btn.classList.add('correct');
      } else if (valorBtn === opcionSeleccionada) {
        btn.classList.add('wrong');
      }
    });
  }

  // Disable text input until next question
  inputRespuesta.disabled = true;
  btnComprobar.disabled = true;

  esperandoSiguiente = true;

  // Focus the "next" button for keyboard flow
  btnSiguiente.focus();
}

/**
 * Advance to next question.
 */
function siguiente() {
  if (!esperandoSiguiente) return;
  cargarPregunta();
}

// =============================================================================
// SPECIAL CHARACTER INSERTION
// =============================================================================

/**
 * Insert a character at the cursor position in the input field.
 */
function insertarCaracter(char) {
  const start = inputRespuesta.selectionStart;
  const end = inputRespuesta.selectionEnd;
  const valor = inputRespuesta.value;

  inputRespuesta.value = valor.slice(0, start) + char + valor.slice(end);

  // Move cursor after inserted character
  const nuevaPos = start + char.length;
  inputRespuesta.setSelectionRange(nuevaPos, nuevaPos);
  inputRespuesta.focus();
}

// =============================================================================
// RESULTS MODAL
// =============================================================================

function mostrarResultados() {
  if (!juego) return;

  const stats = juego.getEstadisticas();
  resTotal.textContent = stats.total;
  resAciertos.textContent = stats.aciertos;
  resErrores.textContent = stats.errores;
  resPorcentaje.textContent = stats.porcentaje + '%';
  resRacha.textContent = stats.mejorRacha;

  modalResultados.classList.remove('hidden');
}

function ocultarResultados() {
  modalResultados.classList.add('hidden');
}

function volverAlInicio() {
  ocultarResultados();
  mostrarPantalla('pantalla-inicio');
  juego = null;
}

function jugarDeNuevo() {
  if (!juego) return;
  juego.reset();
  ocultarResultados();
  actualizarStats();
  cargarPregunta();
}

// =============================================================================
// BACK BUTTON
// =============================================================================

function manejarVolver() {
  if (!juego) {
    mostrarPantalla('pantalla-inicio');
    return;
  }

  const stats = juego.getEstadisticas();
  if (stats.total > 0) {
    mostrarResultados();
  } else {
    mostrarPantalla('pantalla-inicio');
    juego = null;
  }
}

// =============================================================================
// KEYBOARD SUPPORT
// =============================================================================

function manejarTeclaInput(e) {
  if (e.key === 'Enter') {
    e.preventDefault();
    e.stopPropagation();
    if (esperandoSiguiente) {
      siguiente();
    } else {
      comprobar();
    }
  }
}

function manejarTeclaGlobal(e) {
  // Only handle Enter when feedback is visible and we are waiting for next
  if (e.key === 'Enter' && esperandoSiguiente) {
    // Don't double-trigger if focus is on the input (handled there)
    if (document.activeElement === inputRespuesta) return;
    e.preventDefault();
    siguiente();
  }
}

// =============================================================================
// EVENT LISTENERS SETUP
// =============================================================================

function init() {
  // Dark mode preference
  cargarPreferenciaDarkMode();

  // Dark mode toggle
  if (btnDarkMode) {
    btnDarkMode.addEventListener('click', toggleDarkMode);
  }

  // Config panel toggle
  if (btnConfigToggle) {
    btnConfigToggle.addEventListener('click', toggleConfigPanel);
  }

  // Button groups (event delegation on all btn-group containers)
  document.addEventListener('click', (e) => {
    const btn = e.target.closest('.btn-group__item');
    if (btn) {
      activarBotonGrupo(btn);
    }
  });

  // Mode card clicks → start game
  $$('.mode-card').forEach((card) => {
    card.addEventListener('click', () => {
      const modo = card.dataset.mode;
      if (modo) {
        iniciarJuego(modo);
      }
    });
  });

  // Check button
  if (btnComprobar) {
    btnComprobar.addEventListener('click', comprobar);
  }

  // Next button
  if (btnSiguiente) {
    btnSiguiente.addEventListener('click', siguiente);
  }

  // Back button
  if (btnVolver) {
    btnVolver.addEventListener('click', manejarVolver);
  }

  // Text input keyboard
  if (inputRespuesta) {
    inputRespuesta.addEventListener('keydown', manejarTeclaInput);
  }

  // Global Enter key for advancing after feedback
  document.addEventListener('keydown', manejarTeclaGlobal);

  // Special character buttons (event delegation)
  if (helperChars) {
    helperChars.addEventListener('click', (e) => {
      const btn = e.target.closest('.char-btn');
      if (btn && btn.dataset.char) {
        insertarCaracter(btn.dataset.char);
      }
    });
  }

  // Quiz option buttons (event delegation)
  if (respuestaQuiz) {
    respuestaQuiz.addEventListener('click', (e) => {
      const btn = e.target.closest('.opcion-quiz');
      if (!btn || btn.disabled) return;

      // Store selected value and immediately check
      opcionSeleccionada = btn.dataset.value;
      comprobar();
    });
  }

  // Results modal buttons
  if (btnModalInicio) {
    btnModalInicio.addEventListener('click', volverAlInicio);
  }

  if (btnModalReplay) {
    btnModalReplay.addEventListener('click', jugarDeNuevo);
  }

  // Close modal on overlay click (clicking outside the modal content)
  if (modalResultados) {
    modalResultados.addEventListener('click', (e) => {
      if (e.target === modalResultados) {
        volverAlInicio();
      }
    });
  }
}

// =============================================================================
// INITIALIZE
// =============================================================================

init();
