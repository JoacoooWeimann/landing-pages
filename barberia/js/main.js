/**
 * Punto de entrada: el único archivo que carga el HTML.
 * Importa cada módulo y los arranca en orden. Leyendo este archivo
 * se entiende qué hace la página sin entrar en detalles.
 */
import { CONFIG } from "./config.js";
import { renderServices } from "./services.js";
import { initBooking } from "./booking.js";
import { buildWhatsAppUrl, setCurrentYear } from "../../shared/js/utils.js";

renderServices(); // primero, porque booking usa las opciones del <select>
initBooking();

document.getElementById("waFloat").href =
  buildWhatsAppUrl(CONFIG.whatsappNumber, "¡Hola! Quería hacer una consulta.");
setCurrentYear();
