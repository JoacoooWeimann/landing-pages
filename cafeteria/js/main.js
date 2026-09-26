/**
 * Punto de entrada de Café Aroma.
 * El formulario de reservas no necesita JS: lo maneja Netlify Forms.
 */
import { CONFIG } from "./config.js";
import { initMenu } from "./menu.js";
import { initStatus } from "./status.js";
import { buildWhatsAppUrl, todayIso, setCurrentYear } from "../../shared/js/utils.js";

initMenu();
initStatus();

// No permitir reservar fechas pasadas
document.getElementById("fecha").min = todayIso();

document.getElementById("waLink").href =
  buildWhatsAppUrl(CONFIG.whatsappNumber, "¡Hola! Quería consultar por una reserva grupal.");
setCurrentYear();
