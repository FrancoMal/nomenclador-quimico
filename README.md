# Nomenclador Químico

App web para practicar nomenclatura química inorgánica. Sin backend, sin dependencias — corre 100% en el navegador.

**[Probar online](https://francomal.github.io/nomenclador-quimico/)**

## Modos de juego

| Modo | Descripción |
|------|-------------|
| Fórmula → Nombre | Aparece la fórmula, escribís el nombre |
| Nombre → Fórmula | Aparece el nombre, escribís la fórmula |
| Quiz Fórmula → Nombre | Elegís el nombre correcto entre 4 opciones |
| Quiz Nombre → Fórmula | Elegís la fórmula correcta entre 4 opciones |

## Tipos de compuestos

- Óxidos básicos (Fe₂O₃)
- Óxidos ácidos (CO₂)
- Hidruros metálicos (NaH)
- Hidrácidos (HCl)
- Hidróxidos (NaOH)
- Sales binarias (NaCl)
- Oxoácidos (H₂SO₄)

## Sistemas de nomenclatura

- **Sistemática (IUPAC)**: prefijos griegos (dióxido de carbono)
- **Stock**: números romanos (óxido de hierro(III))
- **Tradicional**: sufijos -oso/-ico (óxido férrico)
- **Aleatorio**: elige un sistema al azar por pregunta
- **Todas**: acepta cualquiera de los 3 sistemas y muestra los 3 como referencia

## Configuración

- 3 niveles de dificultad (Fácil, Medio, Difícil)
- Filtro por tipo de compuesto
- Tolerante a mayúsculas/minúsculas y tildes
- Modo oscuro

## Stack

HTML + CSS + JavaScript vanilla. Sin frameworks, sin build step.

```
├── index.html
├── css/styles.css
└── js/
    ├── datos.js          # Elementos y datos químicos
    ├── nomenclatura.js   # Motor de nomenclatura
    ├── juego.js          # Lógica de juego
    └── app.js            # Controlador DOM
```

## Contacto

Reportar errores: franmalfe@gmail.com
