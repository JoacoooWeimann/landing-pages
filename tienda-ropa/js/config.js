/**
 * Configuración y catálogo de la tienda.
 */

export const CONFIG = Object.freeze({
  whatsappNumber: "5491112345678",
  storageKey: "nomada-cart", // nombre con el que se guarda el carrito en el navegador
});

export const DEFAULT_SIZES = ["S", "M", "L", "XL"];

// En un proyecto real esto vendría de una API o de un JSON.
// "color" se usa como fondo de la tarjeta en lugar de una foto.
export const PRODUCTS = [
  { id: 1, name: "Remera Oversize Arena", category: "remeras", price: 18500, icon: "fa-shirt", color: "#e9d5b5", tag: "Nuevo" },
  { id: 2, name: "Remera Básica Negra", category: "remeras", price: 14000, icon: "fa-shirt", color: "#cfcfcf" },
  { id: 3, name: "Buzo Canguro Terracota", category: "buzos", price: 42000, icon: "fa-shirt", color: "#f4b183", tag: "Top ventas" },
  { id: 4, name: "Buzo Cuello Redondo Gris", category: "buzos", price: 38000, icon: "fa-shirt", color: "#d9d9d9" },
  { id: 5, name: "Cargo Verde Oliva", category: "pantalones", price: 45000, icon: "fa-person", color: "#c8cfa8" },
  { id: 6, name: "Jean Recto Azul", category: "pantalones", price: 48000, icon: "fa-person", color: "#b7c7de" },
  { id: 7, name: "Gorra Bordada", category: "accesorios", price: 12000, icon: "fa-hat-cowboy", color: "#efe3cf", sizes: ["U"] },
  { id: 8, name: "Tote Bag Canvas", category: "accesorios", price: 9500, icon: "fa-bag-shopping", color: "#e6dccb", sizes: ["U"] },
];

export const getProduct = (id) => PRODUCTS.find((p) => p.id === id);
