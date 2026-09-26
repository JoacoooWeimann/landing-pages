# NÓMADA · Tienda de ropa

Landing tipo e-commerce: catálogo con filtros y talles, **carrito que se guarda en el navegador** y pedido final por WhatsApp. Newsletter con Netlify Forms.

**Tecnologías:** HTML, CSS puro (sin frameworks), JavaScript, Google Fonts, Font Awesome.

## Archivos

| Archivo | Para qué sirve |
|---|---|
| `index.html` | Estructura: barra promo, header con carrito, hero, catálogo, "nosotros", newsletter, carrito lateral. |
| `styles.css` | Todo el diseño escrito a mano, organizado por secciones. |
| `js/main.js` | Punto de entrada: conecta los clics del usuario con los demás módulos. |
| `js/config.js` | Número de WhatsApp, catálogo de productos y `getProduct()`. |
| `js/cart.js` | **Estado** del carrito + `localStorage`. Solo datos, nada de HTML. |
| `js/render.js` | Dibuja la grilla de productos y el contenido del carrito. |
| `js/ui.js` | Abrir/cerrar el carrito lateral y el aviso "toast". |
| `js/newsletter.js` | Envío del formulario a Netlify Forms con `fetch`. |

## CSS puro: técnicas usadas

- **Variables CSS** (`--ink`, `--accent`...) en `:root`: cambiás un color en un solo lugar.
- **`box-sizing: border-box`**: el padding y el borde se incluyen dentro del ancho declarado. Casi todos los proyectos lo usan.
- **`width: min(1120px, 100% - 2rem)`**: contenedor que nunca pasa de 1120px y siempre deja 1rem de margen a cada lado.
- **CSS Grid con `auto-fill` + `minmax`**: la grilla de productos decide sola si van 4, 3, 2 o 1 columnas.
- **`aspect-ratio: 4 / 5`**: las "fotos" mantienen proporción sin importar el ancho.
- **`position: sticky`**: el header queda fijo arriba al scrollear.
- **Carrito deslizable**: está siempre en la página pero corrido fuera de la pantalla con `transform: translateX(100%)`. Al agregarle la clase `.open`, vuelve a `translateX(0)` y `transition` lo anima.

## Cómo funciona el JavaScript (módulos)

```
main.js ──► config.js      (datos)
   ├──────► cart.js        (estado)       ──► config.js
   ├──────► render.js      (presentación) ──► config.js, cart.js, shared/utils.js
   ├──────► ui.js          (interfaz)
   ├──────► newsletter.js
   └──────► shared/utils.js
```

Esta es la landing donde más se nota lo que ganás separando en módulos: **datos**, **estado**, **presentación** y **eventos** están en archivos distintos. Si mañana el carrito se guardara en un servidor en vez de en `localStorage`, solo cambiarías `cart.js`.

### El catálogo (`config.js` + `render.js`)
`PRODUCTS` es un array de objetos. `renderProducts(category)` filtra con `.filter()` y dibuja las tarjetas. El `color` de cada producto se usa como fondo en lugar de una foto (ver "Ideas" en el README general).

### Delegación de eventos (`main.js`)
En lugar de poner un `addEventListener` en cada botón (que además se borran cada vez que se re-dibuja la grilla), hay **uno solo en el contenedor**:

```js
grid.addEventListener("click", (event) => {
  const card = event.target.closest(".product"); // ¿en qué tarjeta se hizo clic?
  if (event.target.matches(".add-btn")) { ... }
});
```

Esto funciona porque los eventos "burbujean" (*event bubbling*): un clic en un botón también llega a todos sus contenedores.

### `data-*` attributes
`data-id="3"`, `data-size="L"`, `data-category="buzos"` guardan información en el HTML que JS lee con `element.dataset.id`, `dataset.size`, etc.

### El carrito y `localStorage` (`cart.js`)
- **Encapsulamiento:** el array `items` **no se exporta**. Desde afuera no se puede hacer `items.push(...)` por error; solo se puede modificar con las funciones exportadas (`addItem`, `changeQty`). `getItems()` devuelve una **copia** (`[...items]`) por el mismo motivo.
- `main.js` lo importa con `import * as cart from "./cart.js"`, así se lee `cart.addItem(...)`, `cart.getTotal()`: queda claro de dónde viene cada función.
- El carrito es un array: `[{ id: 3, size: "L", qty: 2 }, ...]`. Solo guarda el `id`, no el precio: el precio siempre se busca en `PRODUCTS`, así si cambia no queda desactualizado.
- **`localStorage`** es un pequeño almacenamiento del navegador que **sobrevive a recargas y a cerrar la pestaña**. Solo guarda texto, por eso:
  - `JSON.stringify(items)` convierte el array en texto para guardarlo.
  - `JSON.parse(texto)` lo vuelve a convertir en array al leerlo.
- Se envuelve en `try/catch` porque en modo incógnito o con cookies bloqueadas puede fallar; en ese caso la tienda funciona igual, solo que no recuerda el carrito.
- Cada función que modifica el carrito llama a `save()` al final, y `main.js` llama a `renderCart()` después. Así los datos, lo guardado y la pantalla nunca quedan desincronizados.
- **`reduce()`** suma cantidades y totales: `items.reduce((sum, item) => sum + item.qty, 0)`.

### Newsletter con `fetch` + `async/await` (`newsletter.js`)
`handleSubmit` envía el formulario a Netlify sin recargar la página:
- `new FormData(form)` junta todos los campos.
- `new URLSearchParams(...)` los convierte al formato `email=hola%40mail.com&form-name=newsletter`.
- `await fetch("/", { method: "POST", ... })` espera la respuesta. Si falla, cae en el `catch` y muestra un error.

### Toast (`ui.js`)
El mensaje "Agregado al carrito ✓" aparece agregando la clase `.show` y se oculta solo con `setTimeout` a los 2 segundos. `clearTimeout` reinicia el contador si se agregan varios productos seguidos. La variable `toastTimer` es "del módulo": se mantiene entre llamadas, pero no es global.
