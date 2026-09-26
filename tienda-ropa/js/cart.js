/**
 * Estado del carrito: SOLO datos, nada de HTML.
 *
 * El array `items` es privado (no se exporta): nadie de afuera puede
 * modificarlo directamente, solo a través de las funciones exportadas.
 * Esto se llama "encapsulamiento" y evita errores difíciles de rastrear.
 */
import { CONFIG, getProduct } from "./config.js";

// Cada ítem: { id, size, qty }. No se guarda el precio: siempre se busca en
// PRODUCTS, así si cambia un precio el carrito no queda desactualizado.
let items = load();

function load() {
  try {
    return JSON.parse(localStorage.getItem(CONFIG.storageKey)) || [];
  } catch {
    return []; // JSON roto o storage bloqueado: empezamos vacío
  }
}

function save() {
  try {
    localStorage.setItem(CONFIG.storageKey, JSON.stringify(items));
  } catch {
    /* sin storage disponible: el carrito funciona igual, pero no persiste */
  }
}

// Devuelve una copia para que nadie modifique el array original desde afuera
export const getItems = () => [...items];

export const isEmpty = () => items.length === 0;

export const getCount = () => items.reduce((sum, item) => sum + item.qty, 0);

export const getTotal = () =>
  items.reduce((sum, item) => sum + getProduct(item.id).price * item.qty, 0);

export function addItem(id, size) {
  const existing = items.find((item) => item.id === id && item.size === size);
  if (existing) existing.qty++;
  else items.push({ id, size, qty: 1 });
  save();
}

export function changeQty(index, delta) {
  items[index].qty += delta;
  if (items[index].qty <= 0) items.splice(index, 1);
  save();
}
