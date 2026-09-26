# Café Aroma · Cafetería

Landing para una cafetería con **menú por pestañas**, cartel de **abierto/cerrado en tiempo real**, **reserva de mesa con Netlify Forms** y mapa.

**Tecnologías:** HTML, CSS puro (Grid), JavaScript, Google Fonts (Fraunces + DM Sans), Font Awesome.

## Archivos

| Archivo | Para qué sirve |
|---|---|
| `index.html` | Estructura: header con estado, hero, menú, beneficios, formulario de reserva, mapa y datos. |
| `gracias.html` | Página a la que Netlify redirige después de enviar la reserva. |
| `styles.css` | Diseño cálido, tipografía serif en títulos, grillas y versión móvil. |
| `js/main.js` | Punto de entrada: arranca el menú y el estado, y limita la fecha de reserva. |
| `js/config.js` | Número de WhatsApp, horarios por día y el menú completo. |
| `js/menu.js` | Pestañas y lista de platos. |
| `js/status.js` | Cartel "Abierto / Cerrado". |

## Formulario con Netlify Forms (sin JavaScript)

```html
<form name="reservas" method="POST" action="/cafeteria/gracias.html" data-netlify="true" netlify-honeypot="bot-field">
```

- `method="POST"`: los datos viajan en el cuerpo del pedido, no en la URL.
- `action`: a dónde ir después de enviar. Netlify guarda los datos y redirige ahí.
- Los atributos `name` de cada `input` (`nombre`, `email`, `fecha`...) son los nombres de las columnas que vas a ver en el panel de Netlify.
- Validación del navegador gratis: `required`, `type="email"`, `min`/`max` en números. El navegador no deja enviar si algo está mal.

Comparalo con la **tienda de ropa**, que envía su formulario con `fetch` y no cambia de página.

## Cómo funciona el JavaScript (módulos)

```
main.js ──► config.js
   ├──────► menu.js   ──► config.js, shared/utils.js
   ├──────► status.js ──► config.js
   └──────► shared/utils.js
```

El formulario de reservas **no tiene módulo** porque no necesita JS: lo maneja Netlify.

### Menú con pestañas (`menu.js`)
`MENU` (en `config.js`) es un **objeto** cuyas claves son las categorías:

```js
const MENU = {
  "Cafetería": [ {...}, {...} ],
  "Pastelería": [ ... ],
};
```

- `Object.keys(MENU)` devuelve `["Cafetería", "Pastelería", "Brunch"]` → con eso se crean las pestañas. Agregar una categoría nueva al objeto agrega una pestaña sola.
- La pestaña activa se marca con `aria-selected="true"`, y el CSS la estiliza con el selector `.tab[aria-selected="true"]`. Así el mismo atributo sirve para accesibilidad **y** para el diseño.

### Abierto / Cerrado (`status.js`)
```js
const [open, close] = CONFIG.hours[now.getDay()];   // desestructuración de arrays
const hour = now.getHours() + now.getMinutes() / 60; // 14:30 → 14.5
const isOpen = hour >= open && hour < close;
```

La lógica está en `isOpenAt(date)`, una **función pura**: recibe una fecha y devuelve un resultado, sin tocar el DOM. Está exportada para poder reutilizarla o probarla por separado, por ejemplo desde la consola o, más adelante, con tests: `isOpenAt(new Date("2026-09-27T22:00"))`.

`setInterval(update, 60 * 1000)` lo recalcula cada minuto por si alguien deja la página abierta a la hora de cierre.

## CSS: detalles interesantes

- `.menu-item .price { margin-left: auto; }` empuja el precio a la derecha dentro de un flex.
- `grid-template-columns: 1.2fr 1fr`: `fr` = fracción del espacio disponible.
- El "logo" circular de la taza es un `radial-gradient` + sombra: sin imágenes.
- `.status::before { content: "● "; }` agrega el puntito de color con CSS, sin tocar el HTML.
- En móvil, `order: -1` pone la ilustración arriba del texto sin cambiar el HTML.
