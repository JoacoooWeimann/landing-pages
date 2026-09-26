# NÓMADA · Tienda de ropa

Landing tipo e-commerce: catálogo con filtros y talles, **carrito que se guarda en el navegador** y pedido final por WhatsApp. Newsletter con Netlify Forms.

**Tecnologías:** HTML, CSS puro (sin frameworks), JavaScript, Google Fonts, Font Awesome.

## Archivos

| Archivo | Para qué sirve |
|---|---|
| `index.html` | Estructura: barra promo, header con carrito, hero, catálogo, "nosotros", newsletter, carrito lateral. |
| `styles.css` | Todo el diseño escrito a mano, organizado por secciones. |
| `app.js` | Catálogo, filtros, lógica del carrito, `localStorage`, WhatsApp y newsletter. |

## CSS puro: técnicas usadas

- **Variables CSS** (`--ink`, `--accent`...) en `:root`: cambiás un color en un solo lugar.
- **`box-sizing: border-box`**: el padding y el borde se incluyen dentro del ancho declarado. Casi todos los proyectos lo usan.
- **`width: min(1120px, 100% - 2rem)`**: contenedor que nunca pasa de 1120px y siempre deja 1rem de margen a cada lado.
- **CSS Grid con `auto-fill` + `minmax`**: la grilla de productos decide sola si van 4, 3, 2 o 1 columnas.
- **`aspect-ratio: 4 / 5`**: las "fotos" mantienen proporción sin importar el ancho.
- **`position: sticky`**: el header queda fijo arriba al scrollear.
- **Carrito deslizable**: está siempre en la página pero corrido fuera de la pantalla con `transform: translateX(100%)`. Al agregarle la clase `.open`, vuelve a `translateX(0)` y `transition` lo anima.

## Cómo funciona `app.js`

### El catálogo
`PRODUCTS` es un array de objetos. `renderProducts(category)` filtra con `.filter()` y dibuja las tarjetas. El `color` de cada producto se usa como fondo en lugar de una foto (ver "Ideas" en el README general).

### Delegación de eventos
En lugar de poner un `addEventListener` en cada botón (que además se borran cada vez que se re-dibuja la grilla), hay **uno solo en el contenedor**:

```js
DOM.grid.addEventListener("click", (event) => {
  const card = event.target.closest(".product"); // ¿en qué tarjeta se hizo clic?
  if (event.target.matches(".add-btn")) { ... }
});
```

Esto funciona porque los eventos "burbujean" (*event bubbling*): un clic en un botón también llega a todos sus contenedores.

### `data-*` attributes
`data-id="3"`, `data-size="L"`, `data-category="buzos"` guardan información en el HTML que JS lee con `element.dataset.id`, `dataset.size`, etc.

### El carrito y `localStorage`
- El carrito es un array: `[{ id: 3, size: "L", qty: 2 }, ...]`. Solo guarda el `id`, no el precio: el precio siempre se busca en `PRODUCTS`, así si cambia no queda desactualizado.
- **`localStorage`** es un pequeño almacenamiento del navegador que **sobrevive a recargas y a cerrar la pestaña**. Solo guarda texto, por eso:
  - `JSON.stringify(cart)` convierte el array en texto para guardarlo.
  - `JSON.parse(texto)` lo vuelve a convertir en array al leerlo.
- Se envuelve en `try/catch` porque en modo incógnito o con cookies bloqueadas puede fallar; en ese caso la tienda funciona igual, solo que no recuerda el carrito.
- **`updateCart()`**: cada cambio → guardar + volver a dibujar. Un único punto de actualización evita que la pantalla y los datos queden desincronizados.
- **`reduce()`** suma cantidades y totales: `cart.reduce((sum, item) => sum + item.qty, 0)`.

### Newsletter con `fetch` + `async/await`
`handleNewsletter` envía el formulario a Netlify sin recargar la página:
- `new FormData(form)` junta todos los campos.
- `new URLSearchParams(...)` los convierte al formato `email=hola%40mail.com&form-name=newsletter`.
- `await fetch("/", { method: "POST", ... })` espera la respuesta. Si falla, cae en el `catch` y muestra un error.

### Toast
El mensaje "Agregado al carrito ✓" aparece agregando la clase `.show` y se oculta solo con `setTimeout` a los 2 segundos. `clearTimeout` reinicia el contador si se agregan varios productos seguidos.
