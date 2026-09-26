/**
 * Newsletter: envía el formulario a Netlify Forms con fetch, sin recargar la página.
 * Solo funciona con el sitio publicado en Netlify.
 */

const form = document.getElementById("newsletterForm");
const message = document.getElementById("newsletterMsg");

async function handleSubmit(event) {
  event.preventDefault();

  try {
    // Netlify recibe los forms como POST "url-encoded" a cualquier ruta del sitio
    const response = await fetch("/", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams(new FormData(form)).toString(),
    });
    if (!response.ok) throw new Error(`Error ${response.status}`);
    message.textContent = "¡Listo! Te vamos a escribir con las novedades.";
    form.reset();
  } catch {
    message.textContent = "No pudimos registrar tu email. (Recordá: esto solo funciona publicado en Netlify).";
  }
  message.hidden = false;
}

export function initNewsletter() {
  form.addEventListener("submit", handleSubmit);
}
