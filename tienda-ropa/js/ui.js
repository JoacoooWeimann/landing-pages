/**
 * Piezas de interfaz: abrir/cerrar el carrito lateral y el aviso "toast".
 */

const cartPanel = document.getElementById("cart");
const overlay = document.getElementById("overlay");
const toast = document.getElementById("toast");

export function openCart() {
  cartPanel.classList.add("open");
  cartPanel.setAttribute("aria-hidden", "false");
  overlay.hidden = false;
}

export function closeCart() {
  cartPanel.classList.remove("open");
  cartPanel.setAttribute("aria-hidden", "true");
  overlay.hidden = true;
}

// Variable del módulo: sobrevive entre llamadas a showToast, pero no es global
let toastTimer;

export function showToast(text) {
  toast.textContent = text;
  toast.classList.add("show");
  clearTimeout(toastTimer); // si se agregan varios seguidos, reinicia el contador
  toastTimer = setTimeout(() => toast.classList.remove("show"), 2000);
}
