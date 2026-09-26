/**
 * Renderizado: convierte datos (productos y carrito) en HTML.
 * Este módulo no modifica el carrito, solo lo lee y lo dibuja.
 */
import { PRODUCTS, DEFAULT_SIZES, getProduct } from "./config.js";
import * as cart from "./cart.js"; // importa todo lo exportado bajo el nombre "cart"
import { formatPrice } from "../../shared/js/utils.js";

const grid = document.getElementById("productGrid");
const cartItems = document.getElementById("cartItems");
const cartCount = document.getElementById("cartCount");
const cartTotal = document.getElementById("cartTotal");
const checkoutBtn = document.getElementById("checkout");

export function renderProducts(category = "todo") {
  const list = category === "todo" ? PRODUCTS : PRODUCTS.filter((p) => p.category === category);

  grid.innerHTML = list.map((p) => {
    const sizes = p.sizes || DEFAULT_SIZES;
    return `
      <article class="product" data-id="${p.id}">
        <div class="product-img" style="background:${p.color}">
          ${p.tag ? `<span class="product-tag">${p.tag}</span>` : ""}
          <i class="fa-solid ${p.icon}"></i>
        </div>
        <div class="product-body">
          <h3 class="product-name">${p.name}</h3>
          <p class="product-price">${formatPrice(p.price)}</p>
          <div class="sizes">
            ${sizes.map((s, i) => `<button class="size ${i === 0 ? "selected" : ""}" data-size="${s}">${s}</button>`).join("")}
          </div>
          <button class="add-btn">Agregar al carrito</button>
        </div>
      </article>`;
  }).join("");
}

export function renderCart() {
  cartCount.textContent = cart.getCount();
  cartTotal.textContent = formatPrice(cart.getTotal());
  checkoutBtn.disabled = cart.isEmpty();

  if (cart.isEmpty()) {
    cartItems.innerHTML = `<li class="cart-empty">Tu carrito está vacío.</li>`;
    return;
  }

  cartItems.innerHTML = cart.getItems().map((item, index) => {
    const p = getProduct(item.id);
    return `
      <li class="cart-item">
        <div><strong>${p.name}</strong><br><small>Talle ${item.size} · ${formatPrice(p.price)}</small></div>
        <strong>${formatPrice(p.price * item.qty)}</strong>
        <div class="qty">
          <button data-index="${index}" data-delta="-1" aria-label="Restar">−</button>
          <span>${item.qty}</span>
          <button data-index="${index}" data-delta="1" aria-label="Sumar">+</button>
        </div>
      </li>`;
  }).join("");
}
