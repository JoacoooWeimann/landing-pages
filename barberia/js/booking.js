/**
 * Formulario de turnos: valida la fecha y arma el mensaje de WhatsApp.
 */
import { CONFIG } from "./config.js";
import { openWhatsApp, todayIso } from "../../shared/js/utils.js";

// Referencias al DOM. Son privadas: no se exportan, solo las usa este módulo.
const form = document.getElementById("bookingForm");
const nameInput = document.getElementById("userName");
const serviceSelect = document.getElementById("userService");
const dateInput = document.getElementById("bookingDate");
const timeSelect = document.getElementById("bookingTime");
const dateError = document.getElementById("dateError");

function isClosedDay(isoDate) {
  // "T12:00" evita que la zona horaria corra la fecha al día anterior
  const day = new Date(`${isoDate}T12:00`).getDay();
  return CONFIG.closedDays.includes(day);
}

function handleSubmit(event) {
  event.preventDefault(); // evita que el form recargue la página

  if (isClosedDay(dateInput.value)) {
    dateError.hidden = false;
    dateInput.focus();
    return;
  }
  dateError.hidden = true;

  const [year, month, day] = dateInput.value.split("-");
  const message =
    `¡Hola! Me gustaría solicitar un turno en la barbería:\n\n` +
    `• *Nombre:* ${nameInput.value.trim()}\n` +
    `• *Servicio:* ${serviceSelect.value}\n` +
    `• *Fecha:* ${day}/${month}/${year}\n` +
    `• *Horario preferido:* ${timeSelect.value}\n\n` +
    `¿Tienen lugar disponible? ¡Gracias!`;

  openWhatsApp(CONFIG.whatsappNumber, message);
}

// Lo único que este módulo expone: una función para activarlo
export function initBooking() {
  dateInput.min = todayIso(); // no se puede reservar en el pasado
  dateInput.value = todayIso();
  dateInput.addEventListener("change", () => (dateError.hidden = true));
  form.addEventListener("submit", handleSubmit);
}
