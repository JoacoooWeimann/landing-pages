/**
 * Punto de entrada: conecta los eventos del usuario con los módulos.
 *
 *   config.js     → datos (productos, número de WhatsApp)
 *   cart.js       → estado del carrito + localStorage
 *   render.js     → dibuja productos y carrito
 *   ui.js         → abrir/cerrar carrito, toast
 *   newsletter.js → formulario con Netlify Forms
 */
import { CONFIG, getProduct } from "./config.js";
import * as cart from "./cart.js";
import { renderProducts, renderCart } from "./render.js";
import { openCart, closeCart, showToast } from "./ui.js";
import { initNewsletter } from "./newsletter.js";
import { formatPrice, openWhatsApp, setCurrentYear } from "../../shared/js/utils.js";

const grid = document.getElementById("productGrid");
const filters = document.getElementById("filters");
const cartItems = document.getElementById("cartItems");

/* ---------- Catálogo ---------- */
// Delegación de eventos: un solo listener en el contenedor en vez de uno por botón.
// Funciona también con los botones que se crean después con innerHTML.
grid.addEventListener("click", (event) => {
  const card = event.target.closest(".product");
  if (!card) return;

  if (event.target.matches(".size")) {
    card.querySelectorAll(".size").forEach((b) => b.classList.remove("selected"));
    event.target.classList.add("selected");
  }

  if (event.target.matches(".add-btn")) {
    const size = card.querySelector(".size.selected").dataset.size;
    cart.addItem(Number(card.dataset.id), size);
    renderCart();
    showToast("Agregado al carrito ✓");
  }
});

filters.addEventListener("click", (event) => {
  const chip = event.target.closest(".chip");
  if (!chip) return;
  filters.querySelectorAll(".chip").forEach((c) => c.classList.remove("active"));
  chip.classList.add("active");
  renderProducts(chip.dataset.category);
});

/* ---------- Carrito ---------- */
cartItems.addEventListener("click", (event) => {
  const btn = event.target.closest("button[data-index]");
  if (!btn) return;
  cart.changeQty(Number(btn.dataset.index), Number(btn.dataset.delta));
  renderCart();
});

document.getElementById("cartOpen").addEventListener("click", openCart);
document.getElementById("cartClose").addEventListener("click", closeCart);
document.getElementById("overlay").addEventListener("click", closeCart);
document.addEventListener("keydown", (e) => e.key === "Escape" && closeCart());

document.getElementById("checkout").addEventListener("click", () => {
  const lines = cart.getItems().map((item) => {
    const p = getProduct(item.id);
    return `• ${item.qty}x ${p.name} (talle ${item.size}) — ${formatPrice(p.price * item.qty)}`;
  });
  const message =
    `¡Hola NÓMADA! Quiero hacer este pedido:\n\n${lines.join("\n")}\n\n` +
    `*Total: ${formatPrice(cart.getTotal())}*`;
  openWhatsApp(CONFIG.whatsappNumber, message);
});

/* ---------- Arranque ---------- */
initNewsletter();
renderProducts();
renderCart(); // muestra lo que haya quedado guardado en localStorage
setCurrentYear();
