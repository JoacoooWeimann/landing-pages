/**
 * Café Aroma: menú con pestañas generado desde datos
 * e indicador de "Abierto / Cerrado" según el horario real.
 */

const CONFIG = Object.freeze({
  whatsappNumber: "5491112345678",
  // Horarios por día de la semana (0 = domingo). Formato 24 h: [apertura, cierre]
  hours: {
    0: [9, 21], 1: [8, 20], 2: [8, 20], 3: [8, 20], 4: [8, 20], 5: [8, 20], 6: [9, 21],
  },
});

// Menú agrupado por categoría. Agregar un plato = agregar un objeto.
const MENU = {
  "Cafetería": [
    { name: "Espresso", desc: "Blend de la casa, notas a chocolate.", price: 2800 },
    { name: "Flat White", desc: "Doble espresso con leche texturizada.", price: 4200 },
    { name: "Latte Avellanas", desc: "Con syrup casero de avellanas.", price: 4800 },
    { name: "Cold Brew", desc: "Infusión en frío por 18 horas.", price: 4500, veg: true },
    { name: "Filtrado V60", desc: "Origen del día, preguntá al barista.", price: 5000, veg: true },
  ],
  "Pastelería": [
    { name: "Medialunas (x2)", desc: "De manteca, horneadas cada mañana.", price: 2600 },
    { name: "Budín de limón", desc: "Con glaseado y semillas de amapola.", price: 3500 },
    { name: "Cookie vegana", desc: "Avena, chips de chocolate amargo.", price: 2900, veg: true },
    { name: "Cheesecake frutos rojos", desc: "Base crocante y coulis casero.", price: 5600 },
  ],
  "Brunch": [
    { name: "Tostón de palta", desc: "Pan de masa madre, palta, huevo poché.", price: 8900 },
    { name: "Bowl de yogur", desc: "Granola casera, frutas de estación y miel.", price: 6800 },
    { name: "Brunch completo", desc: "Café + jugo + tostón + dulce del día.", price: 14500 },
  ],
};

const DOM = {
  tabs: document.getElementById("tabs"),
  menuList: document.getElementById("menuList"),
  status: document.getElementById("openStatus"),
  fecha: document.getElementById("fecha"),
  waLink: document.getElementById("waLink"),
  year: document.getElementById("year"),
};

const formatPrice = (value) =>
  value.toLocaleString("es-AR", { style: "currency", currency: "ARS", maximumFractionDigits: 0 });

/* ---------- Menú con pestañas ---------- */
function renderTabs(active) {
  DOM.tabs.innerHTML = Object.keys(MENU)
    .map((cat) => `<button class="tab" role="tab" aria-selected="${cat === active}" data-cat="${cat}">${cat}</button>`)
    .join("");
}

function renderMenu(category) {
  DOM.menuList.innerHTML = MENU[category].map((item) => `
    <div class="menu-item">
      <div>
        <h3>${item.name}${item.veg ? '<span class="veg">VEGANO</span>' : ""}</h3>
        <p>${item.desc}</p>
      </div>
      <span class="price">${formatPrice(item.price)}</span>
    </div>`).join("");
}

function selectCategory(category) {
  renderTabs(category);
  renderMenu(category);
}

DOM.tabs.addEventListener("click", (event) => {
  const tab = event.target.closest(".tab");
  if (tab) selectCategory(tab.dataset.cat);
});

/* ---------- Abierto / Cerrado ---------- */
function updateOpenStatus() {
  const now = new Date();
  const [open, close] = CONFIG.hours[now.getDay()];
  const hour = now.getHours() + now.getMinutes() / 60; // ej: 14:30 -> 14.5
  const isOpen = hour >= open && hour < close;

  DOM.status.className = `status ${isOpen ? "open" : "closed"}`;
  DOM.status.textContent = isOpen ? `Abierto · cierra a las ${close}:00` : `Cerrado · abre a las ${open}:00`;
}

/* ---------- Arranque ---------- */
selectCategory(Object.keys(MENU)[0]);
updateOpenStatus();
setInterval(updateOpenStatus, 60 * 1000); // se revisa cada minuto

// No permitir reservar fechas pasadas (fecha local, no UTC)
const today = new Date();
DOM.fecha.min = new Date(today - today.getTimezoneOffset() * 60000).toISOString().split("T")[0];

DOM.waLink.href = `https://wa.me/${CONFIG.whatsappNumber}?text=${encodeURIComponent("¡Hola! Quería consultar por una reserva grupal.")}`;
DOM.year.textContent = today.getFullYear();
