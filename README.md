# Landing Pages para Comercios

🔗 **Demo:** https://weimann-landing.netlify.app/

Colección de 4 landing pages para distintos rubros, pensadas como demos para ofrecer a negocios reales. Cada una usa un **enfoque de estilos distinto** para practicar (y mostrar en el portafolio) varias formas de trabajar.

| Proyecto | Rubro | Estilos | Integraciones |
|---|---|---|---|
| [`barberia/`](barberia/) | Barbería | Bootstrap 5 | Turnos por WhatsApp, Google Maps, botón flotante |
| [`tienda-ropa/`](tienda-ropa/) | Tienda de ropa | CSS puro | Carrito con `localStorage`, pedido por WhatsApp, Netlify Forms (con `fetch`) |
| [`cafeteria/`](cafeteria/) | Cafetería | CSS puro + Grid | Netlify Forms (sin JS), Google Maps, estado abierto/cerrado |
| [`gimnasio/`](gimnasio/) | Gimnasio | Tailwind CSS ([guía](gimnasio/TAILWIND.md)) | Calculadora de IMC, planes mensual/anual, animaciones al scrollear |

Todas usan **JavaScript con módulos** (`import` / `export`). Ver la [sección 3](#3-módulos-de-javascript-import--export).

Cada carpeta tiene su propio `README.md` que explica su código en detalle.

---

## 1. Qué es una landing page

Una **landing page** es una página de una sola pantalla larga cuyo objetivo es que el visitante haga **una acción concreta**: reservar un turno, comprar, dejar su email. Por eso todas siguen la misma estructura:

1. **Hero**: la primera pantalla. Título grande + frase + botón de acción (CTA, *call to action*).
2. **Oferta**: servicios, productos, menú o planes.
3. **Confianza**: beneficios, reseñas, preguntas frecuentes.
4. **Conversión**: el formulario o botón final (WhatsApp, reserva, compra).
5. **Contacto**: dirección, horarios, mapa, redes.

---

## 2. Estructura de archivos

```
landing-page/
├── index.html        ← Página principal: el "hub" que enlaza a las 4 landings
├── netlify.toml      ← Configuración para publicar en Netlify
├── .gitignore        ← Archivos que Git debe ignorar
├── README.md         ← Este archivo
├── shared/
│   └── js/utils.js   ← Funciones que usan TODAS las landings (precio, WhatsApp, fecha)
├── barberia/
│   ├── index.html    ← Estructura (contenido)
│   ├── styles.css    ← Presentación (cómo se ve)
│   ├── js/           ← Comportamiento (qué hace), dividido en módulos
│   │   ├── main.js   ← Punto de entrada: el único que carga el HTML
│   │   ├── config.js ← Datos del negocio
│   │   └── ...       ← Un archivo por funcionalidad
│   └── README.md
├── tienda-ropa/      (misma estructura)
├── cafeteria/        (+ gracias.html, página post-formulario)
└── gimnasio/         (+ TAILWIND.md, guía de Tailwind)
```

### Por qué separar HTML, CSS y JS

Es el principio de **separación de responsabilidades**:

- **HTML** = *qué hay* en la página (títulos, formularios, secciones).
- **CSS** = *cómo se ve* (colores, tamaños, disposición).
- **JS** = *qué hace* (reaccionar a clics, calcular, guardar datos).

Tenerlos en archivos separados hace que el código sea más fácil de leer, de reutilizar y que el navegador pueda guardar en caché el CSS/JS.

### Por qué cada página se llama `index.html`

Cuando visitás `misitio.com/barberia/`, el servidor busca automáticamente el archivo `index.html` dentro de esa carpeta. Así las URLs quedan limpias, sin `.html` al final.

---

## 3. Módulos de JavaScript (`import` / `export`)

### El problema que resuelven
Con un solo `app.js` de 200 líneas todo está mezclado: datos, dibujo del HTML, eventos, localStorage... Y si querés usar la misma función (por ejemplo `formatPrice`) en otra página, tenés que copiarla y pegarla: si después encontrás un bug, lo tenés que arreglar en 4 lugares.

Con módulos, **cada archivo tiene una responsabilidad** y comparte solo lo que decide compartir.

### Cómo se usan

**1. Exportar** (hacer algo visible para otros archivos):

```js
// shared/js/utils.js
export function formatPrice(value) { ... }   // exportado: se puede importar
function helperPrivado() { ... }              // NO exportado: solo existe en este archivo
```

**2. Importar** (traer lo que otro archivo exportó):

```js
// barberia/js/services.js
import { formatPrice } from "../../shared/js/utils.js";
import { SERVICES } from "./config.js";
```

- La ruta es **relativa al archivo que importa**: `./` = misma carpeta, `../` = subir una carpeta.
- Hay que poner la extensión `.js` (en el navegador es obligatoria).
- Las llaves `{ }` indican qué cosas traer por nombre.

**3. Importar todo junto** con un "apodo":

```js
import * as cart from "./cart.js";
cart.addItem(3, "L");   // todo lo exportado queda dentro del objeto "cart"
cart.getTotal();
```

**4. Cargarlo en el HTML** con `type="module"`, y **solo el punto de entrada**:

```html
<script type="module" src="js/main.js"></script>
```

`main.js` importa el resto, y el navegador va descargando cada archivo según lo necesita.

### Qué cambia al usar `type="module"`

| | Script clásico | Módulo |
|---|---|---|
| Variables de nivel superior | Quedan **globales** (en `window`) y pueden chocar entre archivos | **Privadas** del archivo |
| Cuándo se ejecuta | Apenas se lee (por eso iba al final del `<body>`) | Cuando el HTML terminó de cargar (como `defer`) |
| `import` / `export` | ❌ | ✅ |
| Abrir con doble clic (`file://`) | ✅ Funciona | ❌ **No funciona**: el navegador lo bloquea por seguridad (CORS) |

> ⚠️ **Por eso ahora hace falta un servidor local** para ver las páginas (ver sección 5). Si abrís el HTML con doble clic, la página se ve pero nada del JS funciona, y en la consola (F12) aparece un error de CORS.

### Cómo están organizados los módulos

Todas las landings siguen el mismo patrón:

- **`config.js`**: datos y configuración del negocio (número, productos, precios). Solo `export const`.
- **Un módulo por funcionalidad** (`booking.js`, `cart.js`, `menu.js`, `bmi.js`...). Cada uno:
  - busca **sus propios** elementos del DOM (privados),
  - exporta una función `initAlgo()` que lo activa.
- **`main.js`**: importa todo y llama a los `init` en orden. Leyéndolo entendés qué hace la página sin ver detalles.
- **`shared/js/utils.js`**: lo que usan varias landings.

Separar **datos**, **lógica** y **presentación** (por ejemplo, en la tienda: `cart.js` solo maneja datos, `render.js` solo dibuja) es la base de cómo funcionan React, Vue y el backend con Node.

### Conexión con Node
Node usa exactamente la misma sintaxis (`import` / `export`), así que lo que practicás acá lo vas a usar tal cual en el backend. (En Node también existe la sintaxis vieja, `require()` / `module.exports`, que vas a ver en tutoriales más antiguos).

---

## 4. Conceptos que se repiten en todos los proyectos

### Datos separados del HTML
En vez de escribir cada servicio/producto a mano en el HTML, están en un **array de objetos** en `js/config.js`:

```js
const SERVICES = [
  { name: "Corte Clásico", price: 10000 },
  { name: "Barba", price: 7000 },
];
```

Y una función los convierte en HTML con `.map()` + template strings. **Ventaja:** para cambiar un precio o agregar un producto se toca una sola línea, y el formulario, la lista y el carrito se actualizan solos. Así funcionan también React, Vue, etc., así que es buena práctica para lo que viene.

### Objeto `CONFIG`
En cada `js/config.js` hay un objeto con lo que cambia de cliente a cliente (número de WhatsApp, horarios). `Object.freeze()` impide modificarlo por error durante la ejecución.

### Referencias al DOM al inicio de cada módulo
Cada módulo busca sus elementos (`document.getElementById(...)`) **una sola vez**, arriba de todo, y los guarda en constantes. Es más ordenado y más rápido que buscarlos cada vez que se usan.

### Integración con WhatsApp (sin API)
WhatsApp permite abrir un chat con un mensaje prearmado usando un simple link:

```
https://wa.me/5491112345678?text=Hola%20quiero%20un%20turno
```

- El número va con código de país (54), el 9 de celular en Argentina, y sin `+`, espacios ni guiones.
- El texto se codifica con `encodeURIComponent()` para que espacios, tildes y saltos de línea viajen bien en la URL.
- `*texto*` se ve en **negrita** dentro de WhatsApp.

> ⚠️ Todos los proyectos usan un número de ejemplo (`5491112345678`). Cambialo en el `CONFIG` de cada `js/config.js`.

Las funciones `buildWhatsAppUrl()` y `openWhatsApp()` están en `shared/js/utils.js` y las usan las 4 landings.

### Google Maps embebido (sin API key)
Un `<iframe>` con esta URL muestra un mapa sin registrarse en Google:

```html
<iframe src="https://maps.google.com/maps?q=DIRECCIÓN&output=embed" loading="lazy"></iframe>
```

`loading="lazy"` hace que el mapa se cargue recién cuando el usuario llega a esa parte, para que la página abra más rápido.

### Netlify Forms (formularios sin backend)
Normalmente, para recibir los datos de un formulario necesitás un servidor. Netlify lo resuelve: al publicar, **lee tu HTML**, encuentra los `<form>` con el atributo `data-netlify="true"` y guarda los envíos en su panel (Site → Forms). Incluso te puede mandar un email por cada envío. Gratis hasta 100 envíos por mes.

- `name="reservas"`: nombre con el que aparece en el panel.
- `<input type="hidden" name="form-name" value="reservas">`: obligatorio si enviás el form con JavaScript.
- `netlify-honeypot="bot-field"`: campo trampa invisible. Un humano no lo ve y lo deja vacío; un bot lo completa y Netlify descarta ese envío como spam.

La **cafetería** lo usa sin JS (el navegador envía y redirige a `gracias.html`), y la **tienda** con `fetch` (se queda en la página y muestra un mensaje). Así ves las dos formas.

> Los formularios de Netlify **solo funcionan publicados en Netlify**, no abriendo el archivo en tu compu.

### Diseño responsive
Todas las páginas se adaptan al celular usando:
- `<meta name="viewport" ...>` en el `<head>`: sin esto, el celular muestra la versión de escritorio achicada.
- `@media (max-width: 720px) { ... }`: reglas CSS que solo aplican en pantallas chicas.
- `clamp(min, ideal, max)`: tamaños de letra que crecen con la pantalla sin pasarse.
- `grid-template-columns: repeat(auto-fill, minmax(230px, 1fr))`: la grilla decide sola cuántas columnas entran.

### Accesibilidad básica
- `<label for="id">` asociado a cada input: al tocar el texto se enfoca el campo, y los lectores de pantalla lo leen.
- `aria-label` en botones que solo tienen un ícono (ej: el carrito).
- `alt`/`title` en iframes e imágenes.
- `prefers-reduced-motion`: se desactivan animaciones si el usuario lo pidió en su sistema.

### CDN
Bootstrap, Tailwind, Font Awesome y Google Fonts se cargan desde un **CDN** (*Content Delivery Network*): servidores externos rápidos que ya los tienen alojados. No hay que descargar nada ni usar `npm`.

---

## 5. Cómo verlo en tu compu

Como usamos módulos, **hace falta un servidor local** (abrir con doble clic no funciona, ver sección 3):

```bash
cd landing-page
python3 -m http.server 8000
# abrir http://localhost:8000
```

O en VS Code, la extensión **Live Server** (clic derecho → "Open with Live Server"), que además recarga la página sola al guardar.

---

## 6. Git y GitHub

```bash
git init                      # convierte la carpeta en un repositorio
git add .                     # prepara todos los archivos para el commit
git commit -m "mensaje"       # guarda una "foto" del proyecto con un mensaje
git push                      # sube los commits a GitHub
```

Flujo diario después de hacer cambios:

```bash
git status                    # ver qué archivos cambiaron
git add .
git commit -m "Agrega sección de reseñas a la barbería"
git push
```

**Buenos mensajes de commit:** en imperativo y que digan *qué* cambió ("Agrega", "Corrige", "Actualiza"). Un historial prolijo también suma en el portafolio.

`.gitignore` lista archivos que no deben subirse (configuraciones del editor, archivos del sistema, etc.).

---

## 7. Publicar en Netlify

**Opción recomendada: conectar GitHub (deploy continuo)**

1. Entrar a [app.netlify.com](https://app.netlify.com) e iniciar sesión con GitHub.
2. **Add new site → Import an existing project → GitHub** y elegir el repo `landing-pages`.
3. Dejar el *build command* vacío y *publish directory* en `.` (ya lo configura `netlify.toml`).
4. **Deploy**. En un minuto tenés una URL tipo `https://nombre-random.netlify.app`.
5. En *Site configuration → Change site name* podés elegir un nombre más lindo.

Desde ese momento, **cada `git push` publica automáticamente** la nueva versión.

Para activar los formularios: *Site configuration → Forms → Enable form detection*, y hacer un nuevo deploy.

### `netlify.toml`
Archivo de configuración que Netlify lee al publicar. Define qué carpeta publicar y agrega **cabeceras de seguridad** HTTP (por ejemplo, `X-Frame-Options` impide que otro sitio muestre el tuyo dentro de un iframe para engañar usuarios).

---

## 8. Ideas para seguir practicando

- [ ] Reemplazar los íconos por fotos reales (carpeta `img/`, formato `.webp`, atributo `loading="lazy"`).
- [ ] Agregar una sección de reseñas con un carrusel.
- [ ] Modo claro/oscuro con un botón en alguna página.
- [ ] Pasar el catálogo de la tienda a un archivo `productos.json` y cargarlo con `fetch()`.
- [ ] Mover más funciones repetidas a `shared/js/` (por ejemplo, el toast o la validación de fechas).
- [ ] Nuevos rubros: veterinaria, estudio de tatuajes, inmobiliaria, consultorio.
- [ ] Medir la página con **Lighthouse** (F12 → pestaña Lighthouse) y mejorar el puntaje.
