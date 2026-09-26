/**
 * Configuración, horarios y menú de la cafetería.
 */

export const CONFIG = Object.freeze({
  whatsappNumber: "5491112345678",
  // Horarios por día de la semana (0 = domingo). Formato 24 h: [apertura, cierre]
  hours: {
    0: [9, 21], 1: [8, 20], 2: [8, 20], 3: [8, 20], 4: [8, 20], 5: [8, 20], 6: [9, 21],
  },
});

// Cada clave del objeto es una pestaña. Agregar una categoría = agregar una clave.
export const MENU = {
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
