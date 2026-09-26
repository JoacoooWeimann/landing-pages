/**
 * Punto de entrada de FORJA Gym.
 */
import { CONFIG } from "./config.js";
import { initPlans } from "./plans.js";
import { initBmi } from "./bmi.js";
import { initAnimations } from "./animations.js";
import { openWhatsApp, setCurrentYear } from "../../shared/js/utils.js";

initPlans();
initBmi();
initAnimations();

// Clase de prueba: es tan corto que no justifica un módulo propio
document.getElementById("trialForm").addEventListener("submit", (event) => {
  event.preventDefault();
  const name = document.getElementById("trialName").value.trim();
  const activity = document.getElementById("trialActivity").value;
  openWhatsApp(CONFIG.whatsappNumber, `¡Hola FORJA! Soy ${name} y quiero reservar mi clase de prueba de ${activity}.`);
});

setCurrentYear();
