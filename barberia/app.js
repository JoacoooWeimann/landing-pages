/**
 * LA TRIBU Barber Studio: sistema de reservas por WhatsApp.
 * Organizado en módulos pequeños, cada uno con una única responsabilidad.
 */

// 1. Configuración del negocio: lo único que hay que tocar para otro cliente
const CONFIG = Object.freeze({
  whatsappNumber: "5491112345678", // código país + área + número, sin "+" ni espacios
  closedDays: [0, 1], // 0 = domingo, 1 = lunes (formato de Date.getDay())
});

// 2. Datos: los servicios viven en un array, el HTML se genera a partir de acá
const SERVICES = [
  { name: "Corte Clásico / Fade", description: "Lavado, asesoramiento y peinado con cera.", price: 10000 },
  { name: "Perfilado de Barba", description: "Toalla caliente, navaja tradicional y aceites.", price: 7000 },
  { name: "Combo Completo", description: "Corte + barba. Renovación total.", price: 15000 },
  { name: "Corte Infantil", description: "Paciencia, dedicación y el mejor estilo.", price: 8500 },
];

// 3. Referencias al DOM, buscadas una sola vez
const DOM = {
  servicesGrid: document.getElementById("servicesGrid"),
  form: document.getElementById("bookingForm"),
  name: document.getElementById("userName"),
  service: document.getElementById("userService"),
  date: document.getElementById("bookingDate"),
  time: document.getElementById("bookingTime"),
  dateError: document.getElementById("dateError"),
  waFloat: document.getElementById("waFloat"),
  year: document.getElementById("year"),
};

// Formatea números como moneda argentina: 10000 -> "$ 10.000"
const formatPrice = (value) =>
  value.toLocaleString("es-AR", { style: "currency", currency: "ARS", maximumFractionDigits: 0 });

const buildWhatsAppUrl = (message) =>
  `https://wa.me/${CONFIG.whatsappNumber}?text=${encodeURIComponent(message)}`;

// 4. Renderizado: convierte los datos en HTML
function renderServices() {
  DOM.servicesGrid.innerHTML = SERVICES.map((s) => `
    <div class="col-md-5">
      <div class="card bg-dark border-secondary h-100 p-3 service-card">
        <div class="d-flex justify-content-between align-items-center">
          <div>
            <h5 class="card-title fw-bold text-white mb-1">${s.name}</h5>
            <p class="card-text text-secondary small mb-0">${s.description}</p>
          </div>
          <span class="text-gold fw-bold fs-5 ps-3">${formatPrice(s.price)}</span>
        </div>
      </div>
    </div>`).join("");

  DOM.service.innerHTML = SERVICES
    .map((s) => `<option value="${s.name}">${s.name} (${formatPrice(s.price)})</option>`)
    .join("");
}

// 5. Fechas: no se puede reservar en el pasado ni en días cerrados
function toIsoDate(date) {
  // toISOString usa UTC y puede devolver "mañana" de noche; esto usa la hora local
  const offset = date.getTimezoneOffset() * 60000;
  return new Date(date - offset).toISOString().split("T")[0];
}

function initDatePicker() {
  const today = new Date();
  DOM.date.min = toIsoDate(today);
  DOM.date.value = toIsoDate(today);
}

function isClosedDay(isoDate) {
  // "T12:00" evita que la zona horaria corra la fecha al día anterior
  const day = new Date(`${isoDate}T12:00`).getDay();
  return CONFIG.closedDays.includes(day);
}

// 6. Envío del formulario
function handleSubmit(event) {
  event.preventDefault(); // evita que el form recargue la página

  if (isClosedDay(DOM.date.value)) {
    DOM.dateError.hidden = false;
    DOM.date.focus();
    return;
  }
  DOM.dateError.hidden = true;

  const [year, month, day] = DOM.date.value.split("-");
  const message =
    `¡Hola! Me gustaría solicitar un turno en la barbería:\n\n` +
    `• *Nombre:* ${DOM.name.value.trim()}\n` +
    `• *Servicio:* ${DOM.service.value}\n` +
    `• *Fecha:* ${day}/${month}/${year}\n` +
    `• *Horario preferido:* ${DOM.time.value}\n\n` +
    `¿Tienen lugar disponible? ¡Gracias!`;

  window.open(buildWhatsAppUrl(message), "_blank", "noopener");
}

// 7. Arranque
function init() {
  renderServices();
  initDatePicker();
  DOM.form.addEventListener("submit", handleSubmit);
  DOM.date.addEventListener("change", () => (DOM.dateError.hidden = true));
  DOM.waFloat.href = buildWhatsAppUrl("¡Hola! Quería hacer una consulta.");
  DOM.year.textContent = new Date().getFullYear();
}

init();
