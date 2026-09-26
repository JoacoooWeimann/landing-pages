/**
 * Configuración y planes del gimnasio.
 */

export const CONFIG = Object.freeze({
  whatsappNumber: "5491112345678",
  annualDiscount: 0.2, // 20 %
});

export const PLANS = [
  { name: "Básico", monthly: 25000, features: ["Musculación libre", "Horario 8 a 16 h", "App de rutinas"] },
  { name: "Full", monthly: 35000, featured: true, features: ["Todo el Básico", "Acceso 24/7", "Clases grupales ilimitadas", "Evaluación mensual"] },
  { name: "Premium", monthly: 52000, features: ["Todo el Full", "4 sesiones con personal trainer", "Plan nutricional", "Lockers y toallas"] },
];
