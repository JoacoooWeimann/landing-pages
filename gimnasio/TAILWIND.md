# Guía de Tailwind CSS (desde CSS y Bootstrap)

Esta guía explica Tailwind usando como ejemplo la landing del gimnasio. Está pensada para alguien que ya sabe **CSS** y **Bootstrap**, así que casi todo se explica comparando con eso.

---

## 1. Qué es Tailwind

Tailwind es un framework de CSS, igual que Bootstrap, pero con otra filosofía:

| | Bootstrap | Tailwind |
|---|---|---|
| Enfoque | **Componentes**: `.card`, `.navbar`, `.btn` ya diseñados | **Utilidades**: una clase = una propiedad CSS |
| Aspecto por defecto | Se nota "cara de Bootstrap" | No trae diseño: vos lo armás |
| Personalizar | Sobrescribir estilos o usar Sass | Combinar clases y `tailwind.config` |
| JS incluido | Sí (modales, dropdowns, carrusel) | No, solo CSS |

Bootstrap **ya tiene** clases utilitarias (`mb-3`, `d-flex`, `text-center`, `fw-bold`). Tailwind lleva esa idea al extremo: **todo** es utilidad.

**Ejemplo, el mismo botón en los tres enfoques:**

```html
<!-- CSS puro -->
<a class="btn-cta">Reservar</a>
<style>
  .btn-cta { background: #c6f432; color: #09090b; font-weight: 600;
             padding: 12px 24px; border-radius: 9999px; }
  .btn-cta:hover { filter: brightness(0.9); }
</style>

<!-- Bootstrap -->
<a class="btn btn-success rounded-pill px-4 py-2 fw-semibold">Reservar</a>

<!-- Tailwind -->
<a class="bg-lime-brand text-zinc-950 font-semibold px-6 py-3 rounded-full hover:brightness-90">Reservar</a>
```

---

## 2. Cómo está instalado en este proyecto

```html
<script src="https://cdn.tailwindcss.com"></script>
```

Este es el **Play CDN**: un script que lee tu HTML, detecta las clases que usás y genera el CSS en el navegador. Incluso detecta las clases que se agregan después con JavaScript (como las tarjetas de `js/plans.js`).

- ✅ Cero instalación: ideal para aprender.
- ❌ Más lento y pesado. Tailwind lo desaconseja para sitios en producción.

**En un proyecto profesional** se instala con npm (acá entra Node) y se **compila**: Tailwind revisa tus archivos y genera un `.css` final con *solo* las clases que usaste (suele pesar menos de 10 KB). Cuando lleguemos a Vite o Node, lo migramos así.

---

## 3. La escala de espaciado

Tailwind usa una escala donde **1 unidad = 0.25rem = 4px**:

| Clase | Valor | Bootstrap parecido |
|---|---|---|
| `p-1` | 4px | `p-1` |
| `p-2` | 8px | `p-2` |
| `p-4` | 16px | `p-3` |
| `p-6` | 24px | `p-4` |
| `p-8` | 32px | — |
| `p-12` | 48px | `p-5` |

⚠️ Los números **no** coinciden con Bootstrap: `p-4` en Tailwind es 16px y en Bootstrap es 24px.

**Direcciones** (iguales para `p`adding y `m`argin):

| Clase | Significa | Bootstrap |
|---|---|---|
| `px-4` | izquierda y derecha (eje x) | `px-3` |
| `py-3` | arriba y abajo (eje y) | `py-2` |
| `pt-2`, `pb-2`, `pl-2`, `pr-2` | top, bottom, left, right | `pt-`, `pb-`, `ps-`, `pe-` |
| `mt-10` | margin-top 40px | — |
| `mx-auto` | centrar horizontalmente | `mx-auto` |
| `gap-4` | separación en flex/grid | `gap-3` |
| `space-y-2` | margen vertical entre hijos | — |

---

## 4. Colores

Formato: `{propiedad}-{color}-{intensidad}`

- **Propiedad:** `bg` (fondo), `text` (texto), `border` (borde).
- **Color:** `zinc`, `red`, `blue`, `lime`, etc. [Paleta completa](https://tailwindcss.com/docs/colors).
- **Intensidad:** de `50` (muy claro) a `950` (muy oscuro).

```html
<body class="bg-zinc-950 text-zinc-100">   <!-- fondo casi negro, texto casi blanco -->
<p class="text-zinc-400">                   <!-- gris medio para textos secundarios -->
<div class="border border-zinc-800">        <!-- "border" = 1px sólido; "border-zinc-800" = color -->
```

**Opacidad con `/`:** `bg-zinc-950/80` = fondo zinc-950 al 80 %. `bg-white/80` = blanco semitransparente.

**Color propio de la marca:** en el `<head>` está este bloque:

```js
tailwind.config = {
  theme: {
    extend: {
      colors: { lime: { brand: "#c6f432" } },
      fontFamily: { display: ["Oswald", "sans-serif"] },
    },
  },
};
```

`extend` **agrega** opciones sin borrar las que ya trae Tailwind. Después de esto existen `bg-lime-brand`, `text-lime-brand`, `border-lime-brand` y `font-display`. Es el equivalente a crear una variable CSS `--brand` en `:root`.

---

## 5. Tipografía

| Clase | CSS |
|---|---|
| `text-sm` / `text-lg` / `text-4xl` / `text-7xl` | tamaño de letra (de 14px a 72px) |
| `font-semibold` / `font-bold` | `font-weight: 600` / `700` |
| `uppercase` | `text-transform: uppercase` |
| `tracking-wide` | `letter-spacing` un poco más ancho |
| `tracking-[0.2em]` | valor **arbitrario**: exactamente 0.2em |
| `leading-none` | `line-height: 1` |
| `font-display` | fuente propia (Oswald, definida en config) |
| `font-[Inter]` | valor arbitrario: `font-family: Inter` |
| `antialiased` | suaviza el renderizado de la fuente |

**Valores arbitrarios `[ ]`:** cuando la escala no tiene el valor que necesitás, lo escribís entre corchetes: `w-[337px]`, `bg-[#ff0000]`, `mt-[13px]`. Útil, pero si lo usás mucho es señal de que conviene agregarlo al config.

---

## 6. Flexbox y Grid

**Flex** (casi igual que Bootstrap):

| Tailwind | Bootstrap | CSS |
|---|---|---|
| `flex` | `d-flex` | `display: flex` |
| `flex-col` | `flex-column` | `flex-direction: column` |
| `items-center` | `align-items-center` | `align-items: center` |
| `justify-between` | `justify-content-between` | `justify-content: space-between` |
| `flex-wrap` | `flex-wrap` | `flex-wrap: wrap` |
| `flex-1` | `flex-fill` | `flex: 1` |

(Por eso la barbería original tenía `items-center` y no funcionaba: es de Tailwind, no de Bootstrap.)

**Grid** (Bootstrap usa su sistema de `row`/`col`; Tailwind usa CSS Grid real):

```html
<!-- Tailwind -->
<div class="grid sm:grid-cols-2 lg:grid-cols-4 gap-4"> ... </div>

<!-- Bootstrap equivalente -->
<div class="row g-3">
  <div class="col-sm-6 col-lg-3"> ... </div>
</div>
```

En Tailwind decidís las columnas **en el contenedor**; en Bootstrap, **en cada hijo**.

---

## 7. Responsive: breakpoints y *mobile first*

Tailwind es **mobile first**: una clase sin prefijo aplica **siempre** (empezando por el celular), y los prefijos agregan cambios **desde** ese ancho hacia arriba.

| Prefijo | Desde | Bootstrap |
|---|---|---|
| (ninguno) | 0px | (ninguno) |
| `sm:` | 640px | `-sm-` (576px) |
| `md:` | 768px | `-md-` (768px) |
| `lg:` | 1024px | `-lg-` (992px) |
| `xl:` | 1280px | `-xl-` (1200px) |

Ejemplos del gimnasio:

```html
<nav class="hidden md:flex">           <!-- oculto en celular, visible (flex) desde 768px -->
<h1 class="text-5xl md:text-7xl">      <!-- 48px en celular, 72px desde tablet -->
<form class="flex flex-col sm:flex-row"> <!-- apilado en celular, en fila desde 640px -->
```

Bootstrap: `d-none d-md-flex`. Misma idea, otra sintaxis.

---

## 8. Estados: hover, focus y más

Se ponen como prefijo, igual que los breakpoints:

```html
<a class="text-zinc-400 hover:text-white">                  <!-- blanco al pasar el mouse -->
<article class="border-zinc-800 hover:border-lime-brand transition">
<input class="bg-white/80 focus:bg-white">                  <!-- más opaco al enfocarlo -->
```

`transition` agrega una transición suave (150ms) a los cambios de color, opacidad, etc.

Se pueden combinar: `md:hover:bg-red-500` (hover, solo en pantallas medianas o más).

**`peer`:** permite que un elemento reaccione al estado del **hermano anterior**. En el gimnasio, el checkbox tiene `peer` y el switch visual que le sigue cambia cuando está marcado. Esa parte está hecha en `styles.css` con el selector CSS `.peer:checked + .toggle`, para que veas el CSS que hay detrás.

---

## 9. Otras clases usadas en el proyecto

| Clase | Qué hace |
|---|---|
| `sticky top-0 z-50` | header fijo arriba, por encima del contenido |
| `backdrop-blur` | desenfoca lo que queda detrás (efecto vidrio) |
| `max-w-6xl` | ancho máximo 72rem (1152px), como `.container` |
| `rounded-2xl` / `rounded-full` | esquinas redondeadas / píldora o círculo |
| `overflow-hidden` | oculta lo que se sale del contenedor |
| `relative` / `absolute` | posicionamiento |
| `self-start` | `align-self: flex-start` |
| `h-16` | height 64px |
| `hidden` | `display: none` (lo usa `js/bmi.js` para mostrar el resultado) |
| `sr-only` | oculto visualmente pero accesible (como `visually-hidden` en Bootstrap) |
| `select-none` | no se puede seleccionar el texto |
| `hover:brightness-90` | oscurece un 10 % al pasar el mouse |
| `md:-translate-y-3` | el `-` adelante hace el valor negativo: sube 12px |

---

## 10. Cuándo sí y cuándo no escribir CSS propio

Aunque se use Tailwind, **no está prohibido escribir CSS**. En `gimnasio/styles.css` hay CSS normal para:

- El **switch** mensual/anual (pseudo-elemento `::after` y su animación).
- El **FAQ** (ocultar el triángulo nativo de `<details>` y rotar el `+`).
- Las **animaciones de scroll** (`.reveal` / `.visible`).
- `prefers-reduced-motion`.

La regla práctica: si algo se resuelve con 3 o 4 clases, Tailwind; si necesita pseudo-elementos, animaciones o selectores complejos, CSS propio.

---

## 11. Pros y contras (para opinar en una entrevista)

**A favor:**
- No tenés que inventar nombres de clases (`.card-plan-destacado-v2`...).
- El estilo está a la vista en el HTML: no hay que saltar entre archivos.
- El CSS final es chico (cuando se compila).
- Muy pedido en ofertas de trabajo, sobre todo junto a React.

**En contra:**
- El HTML queda largo y cuesta leerlo al principio.
- Hay que aprender los nombres de las clases (VS Code ayuda: extensión **Tailwind CSS IntelliSense**, que autocompleta y muestra el CSS de cada clase al pasar el mouse).
- Sin un componente (React, etc.), si repetís la misma tarjeta 4 veces repetís las clases 4 veces. En este proyecto eso se evita generando las tarjetas de planes desde JS.

---

## 12. Ejercicios para practicar

1. Cambiá el color de marca en `tailwind.config` por `#38bdf8` y fijate cómo cambia todo.
2. En las tarjetas de "Actividades", hacé que en `md:` haya 2 columnas y en `xl:` 4.
3. Agregá una sección de "Horarios" con una tabla, usando solo clases de Tailwind.
4. Pasá el botón "Clase gratis" del navbar a Bootstrap mentalmente: ¿qué clases usarías?
5. Referencia oficial: [tailwindcss.com/docs](https://tailwindcss.com/docs). Tiene un buscador: escribís la propiedad CSS (ej: "letter-spacing") y te muestra la clase.
