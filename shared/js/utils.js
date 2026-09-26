/**
 * Funciones compartidas por todas las landings.
 *
 * Cada función tiene "export" adelante: eso la hace visible para otros archivos,
 * que la traen con:  import { formatPrice } from "../../shared/js/utils.js";
 * Lo que NO se exporta queda privado a este archivo.
 */

/** Formatea un número como pesos argentinos: 10000 -> "$ 10.000" */
export function formatPrice(value) {
  return value.toLocaleString("es-AR", {
    style: "currency",
    currency: "ARS",
    maximumFractionDigits: 0,
  });
}

/** Arma un link de WhatsApp con un mensaje ya escrito. */
export function buildWhatsAppUrl(phoneNumber, message) {
  return `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;
}

/** Abre WhatsApp en una pestaña nueva con el mensaje. */
export function openWhatsApp(phoneNumber, message) {
  window.open(buildWhatsAppUrl(phoneNumber, message), "_blank", "noopener");
}

/**
 * Devuelve la fecha de hoy en formato "AAAA-MM-DD" (el que usa <input type="date">).
 * No se usa directamente toISOString() porque devuelve la fecha en UTC:
 * en Argentina (UTC-3), después de las 21 h diría que hoy es mañana.
 */
export function todayIso() {
  const now = new Date();
  const offsetMs = now.getTimezoneOffset() * 60 * 1000;
  return new Date(now - offsetMs).toISOString().split("T")[0];
}

/** Escribe el año actual en el elemento indicado (para el © del footer). */
export function setCurrentYear(elementId = "year") {
  const el = document.getElementById(elementId);
  if (el) el.textContent = new Date().getFullYear();
}
