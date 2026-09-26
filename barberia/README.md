# LA TRIBU · Barbería

Landing para una barbería con lista de servicios y **reserva de turnos por WhatsApp**.

**Tecnologías:** HTML, Bootstrap 5, Font Awesome, JavaScript.

## Archivos

| Archivo | Para qué sirve |
|---|---|
| `index.html` | Estructura: navbar, hero, servicios, formulario de turnos, contacto y mapa. |
| `styles.css` | Colores propios (dorado, verde WhatsApp) y detalles que Bootstrap no trae. |
| `app.js` | Genera los servicios, valida la fecha y arma el mensaje de WhatsApp. |

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

## Cómo funciona `app.js`

1. **`CONFIG`**: número de WhatsApp y días cerrados (`0` = domingo, `1` = lunes, como devuelve `Date.getDay()`).
2. **`SERVICES`**: array con los servicios. De acá salen **las tarjetas y las opciones del `<select>`**: un solo lugar para cambiar precios.
3. **`renderServices()`**: recorre el array con `.map()`, arma HTML con template strings (comillas invertidas `` ` ``) y lo inserta con `innerHTML`.
4. **`formatPrice()`**: usa `toLocaleString("es-AR", { style: "currency", currency: "ARS" })` para mostrar `$ 10.000` con el formato argentino.
5. **Fechas**:
   - `min` en el `<input type="date">` impide elegir días pasados.
   - `toIsoDate()` corrige un error clásico: `toISOString()` devuelve la fecha en **UTC**, así que en Argentina (UTC-3) después de las 21 h te decía que "hoy" era mañana.
   - `isClosedDay()` avisa si se elige domingo o lunes.
6. **`handleSubmit()`**: `event.preventDefault()` evita que el form recargue la página; después arma el mensaje y abre WhatsApp con `window.open()`.

## Para adaptarla a otro cliente

- Cambiar `whatsappNumber` y `closedDays` en `CONFIG`.
- Editar el array `SERVICES`.
- Cambiar la dirección en el `src` del `<iframe>` del mapa.
- Cambiar `--gold` en `styles.css` para otra paleta.
