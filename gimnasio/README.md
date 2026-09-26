# FORJA · Gimnasio

Landing para un gimnasio con **planes con toggle mensual/anual**, **calculadora de IMC**, **contadores animados**, **animaciones al hacer scroll** y reserva de clase de prueba por WhatsApp.

**Tecnologías:** HTML, Tailwind CSS (CDN), JavaScript, Google Fonts (Oswald + Inter), Font Awesome.

> 📘 **¿Primera vez con Tailwind?** Leé [`TAILWIND.md`](TAILWIND.md): una guía completa que explica cada clase usada acá comparándola con CSS y Bootstrap. El `index.html` también tiene comentarios en los lugares clave.

## Archivos

| Archivo | Para qué sirve |
|---|---|
| `index.html` | Estructura con clases de Tailwind y la configuración de colores de la marca. |
| `styles.css` | Lo que es más cómodo en CSS normal: el switch, el FAQ y las animaciones. |
| `TAILWIND.md` | Guía de Tailwind desde cero. |
| `js/main.js` | Punto de entrada + formulario de clase de prueba. |
| `js/config.js` | Número de WhatsApp, descuento anual y planes. |
| `js/plans.js` | Tarjetas de planes y toggle mensual/anual. |
| `js/bmi.js` | Calculadora de IMC. |
| `js/animations.js` | Contadores y animaciones al hacer scroll. |

## Tailwind en resumen (la guía completa está en `TAILWIND.md`)

Tailwind es un framework **"utility-first"**: no trae componentes armados (como la tarjeta o el navbar de Bootstrap) sino **una clase por cada propiedad CSS**, y el diseño se arma combinándolas:

```html
<a class="bg-lime-brand text-zinc-950 font-semibold px-6 py-3 rounded-full hover:brightness-90">
```

| Clase | CSS equivalente |
|---|---|
| `px-6` | `padding-left/right: 1.5rem` |
| `rounded-full` | `border-radius: 9999px` |
| `md:grid-cols-3` | desde 768px: 3 columnas |
| `hover:brightness-90` | al pasar el mouse, oscurece |
| `bg-zinc-950/80` | fondo con 80 % de opacidad |

- Los prefijos `sm:`, `md:`, `lg:` son **breakpoints**: Tailwind es *mobile-first*, lo que no tiene prefijo aplica a celular, y el prefijo agrega cambios para pantallas más grandes.
- `tailwind.config` (en el `<head>`) agrega el color de marca `lime-brand` y la fuente `font-display`.
- **Importante:** el CDN de Tailwind es para prototipos. En un proyecto profesional se instala con `npm` y se "compila", generando un CSS con solo las clases que usás (mucho más liviano).

## Cómo funciona el JavaScript (módulos)

```
main.js ──► config.js
   ├──────► plans.js      ──► config.js, shared/utils.js
   ├──────► bmi.js
   ├──────► animations.js
   └──────► shared/utils.js
```

`bmi.js` y `animations.js` no importan nada: son independientes. Podrías copiarlos a otro proyecto y funcionarían igual (siempre que el HTML tenga los mismos `id`/clases).

### Planes mensual / anual (`plans.js`)
- El switch es un `<input type="checkbox">` real, oculto con `sr-only` (sigue siendo accesible con teclado). El CSS dibuja el interruptor con `.peer:checked + .toggle`: el selector `+` apunta al elemento **inmediatamente siguiente**.
- Al cambiar (`change`), `render()` recalcula: `precio * (1 - 0.2)` si es anual.
- Cada botón "Elegir" es un link de WhatsApp con el plan en el mensaje.

### Calculadora de IMC (`bmi.js`)
`IMC = peso / altura²` (altura en metros). `calculateBmi()` y `getBmiCategory()` son **funciones puras** exportadas (reciben datos y devuelven un resultado, sin tocar el DOM). `getBmiCategory()` devuelve la categoría y un color. `toFixed(1)` redondea a un decimal.

### Contadores animados con `requestAnimationFrame` (`animations.js`)
En lugar de `setInterval`, se usa `requestAnimationFrame`: el navegador ejecuta la función justo antes de dibujar cada frame (~60 por segundo), así la animación es fluida y se pausa si la pestaña no está visible.

`1 - (1 - progress)^3` es una **función de easing**: el número sube rápido al principio y frena al llegar al final, más natural que una velocidad constante.

### Animaciones al scrollear con `IntersectionObserver` (`animations.js`)
Los elementos con clase `.reveal` empiezan invisibles y corridos hacia abajo (CSS). El `IntersectionObserver` avisa cuando un elemento entra en pantalla (`threshold: 0.2` = cuando se ve el 20 %) y ahí se le agrega `.visible`, que dispara la `transition`.

Es mucho más eficiente que escuchar el evento `scroll`, que se dispara cientos de veces por segundo. `observer.unobserve()` hace que cada animación ocurra una sola vez.

`@media (prefers-reduced-motion: reduce)` desactiva todo esto para personas que configuraron su sistema para reducir el movimiento (por mareos, por ejemplo).

## FAQ sin JavaScript
`<details>` + `<summary>` es un acordeón **nativo de HTML**: se abre y cierra solo. Con CSS se oculta el triangulito por defecto y se agrega un `+` que rota 45° (se convierte en `×`) cuando `details[open]`.
