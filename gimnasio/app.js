/**
 * FORJA Gym: planes con toggle mensual/anual, calculadora de IMC,
 * contadores animados, animaciones al scrollear y reserva por WhatsApp.
 */

const CONFIG = Object.freeze({
  whatsappNumber: "5491112345678",
  annualDiscount: 0.2, // 20 %
});

const PLANS = [
  { name: "Básico", monthly: 25000, features: ["Musculación libre", "Horario 8 a 16 h", "App de rutinas"] },
  { name: "Full", monthly: 35000, featured: true, features: ["Todo el Básico", "Acceso 24/7", "Clases grupales ilimitadas", "Evaluación mensual"] },
  { name: "Premium", monthly: 52000, features: ["Todo el Full", "4 sesiones con personal trainer", "Plan nutricional", "Lockers y toallas"] },
];

const DOM = {
  plans: document.getElementById("plans"),
  billingToggle: document.getElementById("billingToggle"),
  bmiForm: document.getElementById("bmiForm"),
  weight: document.getElementById("weight"),
  height: document.getElementById("height"),
  bmiResult: document.getElementById("bmiResult"),
  bmiValue: document.getElementById("bmiValue"),
  bmiLabel: document.getElementById("bmiLabel"),
  trialForm: document.getElementById("trialForm"),
  trialName: document.getElementById("trialName"),
  trialActivity: document.getElementById("trialActivity"),
  year: document.getElementById("year"),
};

const formatPrice = (value) =>
  value.toLocaleString("es-AR", { style: "currency", currency: "ARS", maximumFractionDigits: 0 });

const waUrl = (message) => `https://wa.me/${CONFIG.whatsappNumber}?text=${encodeURIComponent(message)}`;

/* ---------- Planes ---------- */
function renderPlans() {
  const annual = DOM.billingToggle.checked;

  DOM.plans.innerHTML = PLANS.map((plan) => {
    const price = annual ? plan.monthly * (1 - CONFIG.annualDiscount) : plan.monthly;
    const cardClass = plan.featured
      ? "border-lime-brand bg-zinc-950 md:-translate-y-3"
      : "border-zinc-800 bg-zinc-950";
    const message = `¡Hola! Quiero info del plan ${plan.name} (${annual ? "anual" : "mensual"}).`;

    return `
      <article class="rounded-2xl border ${cardClass} p-6 flex flex-col">
        ${plan.featured ? '<span class="self-start text-xs font-semibold bg-lime-brand text-zinc-950 px-3 py-1 rounded-full mb-3">MÁS ELEGIDO</span>' : ""}
        <h3 class="font-display text-2xl uppercase">${plan.name}</h3>
        <p class="mt-4"><span class="font-display text-4xl">${formatPrice(price)}</span><span class="text-zinc-500"> /mes</span></p>
        <p class="text-xs text-zinc-500 h-4">${annual ? `Pagando ${formatPrice(price * 12)} al año` : ""}</p>
        <ul class="mt-6 space-y-2 text-sm text-zinc-300 flex-1">
          ${plan.features.map((f) => `<li><i class="fa-solid fa-check text-lime-brand mr-2"></i>${f}</li>`).join("")}
        </ul>
        <a href="${waUrl(message)}" target="_blank" rel="noopener"
           class="mt-6 text-center font-semibold py-3 rounded-xl ${plan.featured ? "bg-lime-brand text-zinc-950" : "border border-zinc-700 hover:border-zinc-400"}">
          Elegir ${plan.name}
        </a>
      </article>`;
  }).join("");
}

/* ---------- Calculadora de IMC ---------- */
// IMC = peso (kg) / altura (m)²
function getBmiCategory(bmi) {
  if (bmi < 18.5) return { label: "Bajo peso", color: "#60a5fa" };
  if (bmi < 25) return { label: "Peso saludable", color: "#c6f432" };
  if (bmi < 30) return { label: "Sobrepeso", color: "#fbbf24" };
  return { label: "Obesidad", color: "#f87171" };
}

function handleBmi(event) {
  event.preventDefault();
  const weight = Number(DOM.weight.value);
  const heightM = Number(DOM.height.value) / 100;
  const bmi = weight / (heightM * heightM);
  const { label, color } = getBmiCategory(bmi);

  DOM.bmiValue.textContent = bmi.toFixed(1);
  DOM.bmiLabel.textContent = label;
  DOM.bmiLabel.style.color = color;
  DOM.bmiResult.classList.remove("hidden");
}

/* ---------- Contadores animados ---------- */
function animateCounter(el) {
  const target = Number(el.dataset.target);
  const duration = 1500;
  const start = performance.now();

  // requestAnimationFrame: el navegador llama a esta función en cada frame (~60 por segundo)
  function frame(now) {
    const progress = Math.min((now - start) / duration, 1);
    const eased = 1 - Math.pow(1 - progress, 3); // arranca rápido y frena al final
    el.textContent = Math.round(target * eased).toLocaleString("es-AR");
    if (progress < 1) requestAnimationFrame(frame);
  }
  requestAnimationFrame(frame);
}

/* ---------- Animación al hacer scroll ---------- */
// IntersectionObserver avisa cuando un elemento entra en la pantalla,
// mucho más eficiente que escuchar el evento "scroll".
const observer = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (!entry.isIntersecting) return;
    if (entry.target.classList.contains("counter")) animateCounter(entry.target);
    else entry.target.classList.add("visible");
    observer.unobserve(entry.target); // animar una sola vez
  });
}, { threshold: 0.2 });

document.querySelectorAll(".reveal, .counter").forEach((el) => observer.observe(el));

/* ---------- Clase de prueba por WhatsApp ---------- */
function handleTrial(event) {
  event.preventDefault();
  const message = `¡Hola FORJA! Soy ${DOM.trialName.value.trim()} y quiero reservar mi clase de prueba de ${DOM.trialActivity.value}.`;
  window.open(waUrl(message), "_blank", "noopener");
}

/* ---------- Arranque ---------- */
DOM.billingToggle.addEventListener("change", renderPlans);
DOM.bmiForm.addEventListener("submit", handleBmi);
DOM.trialForm.addEventListener("submit", handleTrial);
DOM.year.textContent = new Date().getFullYear();
renderPlans();
