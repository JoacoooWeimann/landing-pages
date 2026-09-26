/**
 * Cartel "Abierto / Cerrado" según el día y la hora actuales.
 */
import { CONFIG } from "./config.js";

const statusEl = document.getElementById("openStatus");

// Función "pura": recibe una fecha y devuelve un resultado, sin tocar el DOM.
// Por eso es fácil de probar: isOpenAt(new Date("2026-09-27T22:00")).isOpen -> false
export function isOpenAt(date) {
  const [open, close] = CONFIG.hours[date.getDay()];
  const hour = date.getHours() + date.getMinutes() / 60; // 14:30 -> 14.5
  return { isOpen: hour >= open && hour < close, open, close };
}

function update() {
  const { isOpen, open, close } = isOpenAt(new Date());
  statusEl.className = `status ${isOpen ? "open" : "closed"}`;
  statusEl.textContent = isOpen ? `Abierto · cierra a las ${close}:00` : `Cerrado · abre a las ${open}:00`;
}

export function initStatus() {
  update();
  setInterval(update, 60 * 1000); // se revisa cada minuto
}
