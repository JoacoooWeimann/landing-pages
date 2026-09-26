/**
 * Renderizado de servicios: convierte el array SERVICES en HTML.
 */
import { SERVICES } from "./config.js";
import { formatPrice } from "../../shared/js/utils.js";

export function renderServices() {
  const grid = document.getElementById("servicesGrid");
  const select = document.getElementById("userService");

  grid.innerHTML = SERVICES.map((s) => `
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

  select.innerHTML = SERVICES
    .map((s) => `<option value="${s.name}">${s.name} (${formatPrice(s.price)})</option>`)
    .join("");
}
