# LA TRIBU · Barbería

Landing para una barbería con lista de servicios y **reserva de turnos por WhatsApp**.

**Tecnologías:** HTML, Bootstrap 5, Font Awesome, JavaScript.

## Archivos

| Archivo | Para qué sirve |
|---|---|
| `index.html` | Estructura: navbar, hero, servicios, formulario de turnos, contacto y mapa. |
| `styles.css` | Colores propios (dorado, verde WhatsApp) y detalles que Bootstrap no trae. |
| `js/main.js` | Punto de entrada: importa los módulos y los arranca. |
| `js/config.js` | Número de WhatsApp, días cerrados y la lista de servicios. |
| `js/services.js` | Dibuja las tarjetas de servicios y las opciones del `<select>`. |
| `js/booking.js` | Formulario: valida la fecha y arma el mensaje de WhatsApp. |
| `../shared/js/utils.js` | Funciones compartidas: `formatPrice`, `openWhatsApp`, `todayIso`... |

## Bootstrap: qué es y cómo se usa

Bootstrap es un **framework de CSS**: trae miles de clases ya hechas. En vez de escribir CSS, ponés clases en el HTML:

```html
<div class="container">         <!-- ancho máximo centrado -->
  <div class="row g-3">         <!-- fila con separación (gap) de 3 -->
    <div class="col-md-5">      <!-- en pantallas medianas o más, ocupa 5 de 12 columnas -->
```

- **Grilla de 12 columnas:** `col-md-6` = mitad de ancho desde tablets en adelante. En celular, ocupa todo el ancho.
- **Utilidades:** `mb-3` (margin-bottom), `p-4` (padding), `text-center`, `d-flex` (display flex), `gap-2`, `fw-bold` (font-weight).
- `data-bs-theme="dark"` en `<html>` activa el modo oscuro de Bootstrap en todos los componentes.

`styles.css` se carga **después** de Bootstrap para poder sobrescribir sus estilos (en CSS, a igual especificidad, gana lo último).

> 📝 La versión original usaba clases como `fw-black`, `items-center` y `min-vh-screen`, que son de **Tailwind**, no de Bootstrap, por eso no hacían nada. Se reemplazaron por `fw-bolder`, `align-items-center` y `min-vh-100`.

## Cómo funciona el JavaScript (módulos)

Cómo se conectan los archivos (la flecha significa "importa de"):

```
main.js ──► config.js
   ├──────► services.js ──► config.js, shared/utils.js
   ├──────► booking.js  ──► config.js, shared/utils.js
   └──────► shared/utils.js
```

1. **`config.js`** exporta `CONFIG` (número de WhatsApp y días cerrados: `0` = domingo, `1` = lunes, como devuelve `Date.getDay()`) y `SERVICES`, el array con los servicios. De ese array salen **las tarjetas y las opciones del `<select>`**: un solo lugar para cambiar precios.
2. **`services.js` → `renderServices()`** recorre el array con `.map()`, arma HTML con template strings (comillas invertidas `` ` ``) y lo inserta con `innerHTML`. Usa `formatPrice()` del módulo compartido, que muestra `$ 10.000` con formato argentino (`toLocaleString("es-AR", ...)`).
3. **`booking.js`** busca sus propios elementos del formulario (son privados: no se exportan) y exporta solo `initBooking()`, que:
   - pone `min` en el `<input type="date">` para impedir días pasados. Usa `todayIso()`, que corrige un error clásico: `toISOString()` devuelve la fecha en **UTC**, así que en Argentina (UTC-3) después de las 21 h decía que "hoy" era mañana;
   - con `isClosedDay()`, avisa si se elige domingo o lunes;
   - en `handleSubmit()`, llama a `event.preventDefault()` para que el form no recargue la página, arma el mensaje y llama a `openWhatsApp()`.
4. **`main.js`** llama a `renderServices()` **antes** que a `initBooking()`, porque el formulario necesita que las opciones del `<select>` ya existan. El orden de los `init` importa.

## Para adaptarla a otro cliente

- Cambiar `whatsappNumber` y `closedDays` en `js/config.js`.
- Editar el array `SERVICES` en el mismo archivo.
- Cambiar la dirección en el `src` del `<iframe>` del mapa.
- Cambiar `--gold` en `styles.css` para otra paleta.
