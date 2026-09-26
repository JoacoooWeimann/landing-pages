/**
 * Menú con pestañas generado a partir del objeto MENU.
 */
import { MENU } from "./config.js";
import { formatPrice } from "../../shared/js/utils.js";

const tabs = document.getElementById("tabs");
const menuList = document.getElementById("menuList");

function renderTabs(active) {
  // Object.keys(MENU) -> ["Cafetería", "Pastelería", "Brunch"]
  tabs.innerHTML = Object.keys(MENU)
    .map((cat) => `<button class="tab" role="tab" aria-selected="${cat === active}" data-cat="${cat}">${cat}</button>`)
    .join("");
}

function renderItems(category) {
  menuList.innerHTML = MENU[category].map((item) => `
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
  renderItems(category);
}

export function initMenu() {
  tabs.addEventListener("click", (event) => {
    const tab = event.target.closest(".tab");
    if (tab) selectCategory(tab.dataset.cat);
  });
  selectCategory(Object.keys(MENU)[0]); // arranca en la primera categoría
}
