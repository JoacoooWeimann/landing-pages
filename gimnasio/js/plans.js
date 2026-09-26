/**
 * Tarjetas de planes con toggle mensual / anual.
 * Las clases de Tailwind que se generan acá también funcionan:
 * el CDN de Tailwind vigila el DOM y crea el CSS de las clases nuevas.
 */
import { CONFIG, PLANS } from "./config.js";
import { formatPrice, buildWhatsAppUrl } from "../../shared/js/utils.js";

const container = document.getElementById("plans");
const toggle = document.getElementById("billingToggle");

function render() {
  const annual = toggle.checked;

  container.innerHTML = PLANS.map((plan) => {
    const price = annual ? plan.monthly * (1 - CONFIG.annualDiscount) : plan.monthly;
    const cardClass = plan.featured
      ? "border-lime-brand md:-translate-y-3" // destacado: borde verde y un poco más arriba
      : "border-zinc-800";
    const buttonClass = plan.featured
      ? "bg-lime-brand text-zinc-950"
      : "border border-zinc-700 hover:border-zinc-400";
    const message = `¡Hola! Quiero info del plan ${plan.name} (${annual ? "anual" : "mensual"}).`;

    return `
      <article class="rounded-2xl border ${cardClass} bg-zinc-950 p-6 flex flex-col">
        ${plan.featured ? '<span class="self-start text-xs font-semibold bg-lime-brand text-zinc-950 px-3 py-1 rounded-full mb-3">MÁS ELEGIDO</span>' : ""}
        <h3 class="font-display text-2xl uppercase">${plan.name}</h3>
        <p class="mt-4"><span class="font-display text-4xl">${formatPrice(price)}</span><span class="text-zinc-500"> /mes</span></p>
        <p class="text-xs text-zinc-500 h-4">${annual ? `Pagando ${formatPrice(price * 12)} al año` : ""}</p>
        <ul class="mt-6 space-y-2 text-sm text-zinc-300 flex-1">
          ${plan.features.map((f) => `<li><i class="fa-solid fa-check text-lime-brand mr-2"></i>${f}</li>`).join("")}
        </ul>
        <a href="${buildWhatsAppUrl(CONFIG.whatsappNumber, message)}" target="_blank" rel="noopener"
           class="mt-6 text-center font-semibold py-3 rounded-xl ${buttonClass}">
          Elegir ${plan.name}
        </a>
      </article>`;
  }).join("");
}

export function initPlans() {
  toggle.addEventListener("change", render);
  render();
}
