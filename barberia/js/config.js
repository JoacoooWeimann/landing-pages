/**
 * Configuración y datos del negocio.
 * Para adaptar la landing a otra barbería, casi todo se cambia acá.
 */

export const CONFIG = Object.freeze({
  whatsappNumber: "5491112345678", // código país + área + número, sin "+" ni espacios
  closedDays: [0, 1], // 0 = domingo, 1 = lunes (formato de Date.getDay())
});

// De este array salen las tarjetas de servicios Y las opciones del formulario
export const SERVICES = [
  { name: "Corte Clásico / Fade", description: "Lavado, asesoramiento y peinado con cera.", price: 10000 },
  { name: "Perfilado de Barba", description: "Toalla caliente, navaja tradicional y aceites.", price: 7000 },
  { name: "Combo Completo", description: "Corte + barba. Renovación total.", price: 15000 },
  { name: "Corte Infantil", description: "Paciencia, dedicación y el mejor estilo.", price: 8500 },
];
