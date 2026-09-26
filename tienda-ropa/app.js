/**
 * NÓMADA: catálogo con filtros, carrito persistente (localStorage)
 * y envío del pedido por WhatsApp.
 */

const CONFIG = Object.freeze({
  whatsappNumber: "5491112345678",
  storageKey: "nomada-cart", // nombre con el que se guarda el carrito en el navegador
});

// Catálogo. En un proyecto real esto vendría de una API o un JSON.
// "color" se usa como fondo de la tarjeta en lugar de una foto.
const PRODUCTS = [
  { id: 1, name: "Remera Oversize Arena", category: "remeras", price: 18500, icon: "fa-shirt", color: "#e9d5b5", tag: "Nuevo" },
  { id: 2, name: "Remera Básica Negra", category: "remeras", price: 14000, icon: "fa-shirt", color: "#cfcfcf" },
  { id: 3, name: "Buzo Canguro Terracota", category: "buzos", price: 42000, icon: "fa-shirt", color: "#f4b183", tag: "Top ventas" },
  { id: 4, name: "Buzo Cuello Redondo Gris", category: "buzos", price: 38000, icon: "fa-shirt", color: "#d9d9d9" },
  { id: 5, name: "Cargo Verde Oliva", category: "pantalones", price: 45000, icon: "fa-person", color: "#c8cfa8" },
  { id: 6, name: "Jean Recto Azul", category: "pantalones", price: 48000, icon: "fa-person", color: "#b7c7de" },
  { id: 7, name: "Gorra Bordada", category: "accesorios", price: 12000, icon: "fa-hat-cowboy", color: "#efe3cf", sizes: ["U"] },
  { id: 8, name: "Tote Bag Canvas", category: "accesorios", price: 9500, icon: "fa-bag-shopping", color: "#e6dccb", sizes: ["U"] },
];
const DEFAULT_SIZES = ["S", "M", "L", "XL"];

const DOM = {
  grid: document.getElementById("productGrid"),
  filters: document.getElementById("filters"),
  cart: document.getElementById("cart"),
  overlay: document.getElementById("overlay"),
  cartOpen: document.getElementById("cartOpen"),
  cartClose: document.getElementById("cartClose"),
  cartItems: document.getElementById("cartItems"),
  cartCount: document.getElementById("cartCount"),
  cartTotal: document.getElementById("cartTotal"),
  checkout: document.getElementById("checkout"),
  toast: document.getElementById("toast"),
  newsletterForm: document.getElementById("newsletterForm"),
  newsletterMsg: document.getElementById("newsletterMsg"),
  year: document.getElementById("year"),
};

const formatPrice = (value) =>
  value.toLocaleString("es-AR", { style: "currency", currency: "ARS", maximumFractionDigits: 0 });

/* ---------- Estado del carrito ---------- */
// El carrito es un array de { id, size, qty }. Se lee de localStorage al cargar
// para que no se pierda si el usuario recarga o vuelve otro día.
let cart = loadCart();

function loadCart() {
  try {
    return JSON.parse(localStorage.getItem(CONFIG.storageKey)) || [];
  } catch {
    return []; // si el JSON está roto o el storage bloqueado, empezamos vacío
  }
}

function saveCart() {
  try {
    localStorage.setItem(CONFIG.storageKey, JSON.stringify(cart));
  } catch {
    /* sin storage disponible: el carrito funciona igual, pero no persiste */
  }
}

function addToCart(id, size) {
  const existing = cart.find((item) => item.id === id && item.size === size);
  if (existing) existing.qty++;
  else cart.push({ id, size, qty: 1 });
  updateCart();
}

function changeQty(index, delta) {
  cart[index].qty += delta;
  if (cart[index].qty <= 0) cart.splice(index, 1);
  updateCart();
}

// Cada vez que el carrito cambia: guardar y volver a dibujar
function updateCart() {
  saveCart();
  renderCart();
}

/* ---------- Renderizado ---------- */
function renderProducts(category = "todo") {
  const list = category === "todo" ? PRODUCTS : PRODUCTS.filter((p) => p.category === category);

  DOM.grid.innerHTML = list.map((p) => {
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

function renderCart() {
  const totalItems = cart.reduce((sum, item) => sum + item.qty, 0);
  const totalPrice = cart.reduce((sum, item) => sum + getProduct(item.id).price * item.qty, 0);

  DOM.cartCount.textContent = totalItems;
  DOM.cartTotal.textContent = formatPrice(totalPrice);
  DOM.checkout.disabled = cart.length === 0;

  if (cart.length === 0) {
    DOM.cartItems.innerHTML = `<li class="cart-empty">Tu carrito está vacío.</li>`;
    return;
  }

  DOM.cartItems.innerHTML = cart.map((item, index) => {
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

const getProduct = (id) => PRODUCTS.find((p) => p.id === id);

/* ---------- UI ---------- */
function openCart() {
  DOM.cart.classList.add("open");
  DOM.cart.setAttribute("aria-hidden", "false");
  DOM.overlay.hidden = false;
}

function closeCart() {
  DOM.cart.classList.remove("open");
  DOM.cart.setAttribute("aria-hidden", "true");
  DOM.overlay.hidden = true;
}

let toastTimer;
function showToast(text) {
  DOM.toast.textContent = text;
  DOM.toast.classList.add("show");
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => DOM.toast.classList.remove("show"), 2000);
}

function checkout() {
  const lines = cart.map((item) => {
    const p = getProduct(item.id);
    return `• ${item.qty}x ${p.name} (talle ${item.size}) — ${formatPrice(p.price * item.qty)}`;
  });
  const total = cart.reduce((sum, item) => sum + getProduct(item.id).price * item.qty, 0);
  const message = `¡Hola NÓMADA! Quiero hacer este pedido:\n\n${lines.join("\n")}\n\n*Total: ${formatPrice(total)}*`;
  window.open(`https://wa.me/${CONFIG.whatsappNumber}?text=${encodeURIComponent(message)}`, "_blank", "noopener");
}

/* ---------- Newsletter con Netlify Forms ---------- */
async function handleNewsletter(event) {
  event.preventDefault();
  const formData = new FormData(DOM.newsletterForm);

  try {
    // Netlify recibe los forms como POST url-encoded a cualquier ruta del sitio
    const response = await fetch("/", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams(formData).toString(),
    });
    if (!response.ok) throw new Error(response.status);
    DOM.newsletterMsg.textContent = "¡Listo! Te vamos a escribir con las novedades.";
    DOM.newsletterForm.reset();
  } catch {
    DOM.newsletterMsg.textContent = "No pudimos registrar tu email. (Recordá: esto solo funciona publicado en Netlify).";
  }
  DOM.newsletterMsg.hidden = false;
}

/* ---------- Eventos ---------- */
// Delegación de eventos: un solo listener en el contenedor en vez de uno por botón.
// Sirve también para elementos que se crean después con innerHTML.
DOM.grid.addEventListener("click", (event) => {
  const card = event.target.closest(".product");
  if (!card) return;

  if (event.target.matches(".size")) {
    card.querySelectorAll(".size").forEach((b) => b.classList.remove("selected"));
    event.target.classList.add("selected");
  }

  if (event.target.matches(".add-btn")) {
    const size = card.querySelector(".size.selected").dataset.size;
    addToCart(Number(card.dataset.id), size);
    showToast("Agregado al carrito ✓");
  }
});

DOM.filters.addEventListener("click", (event) => {
  const chip = event.target.closest(".chip");
  if (!chip) return;
  DOM.filters.querySelectorAll(".chip").forEach((c) => c.classList.remove("active"));
  chip.classList.add("active");
  renderProducts(chip.dataset.category);
});

DOM.cartItems.addEventListener("click", (event) => {
  const btn = event.target.closest("button[data-index]");
  if (btn) changeQty(Number(btn.dataset.index), Number(btn.dataset.delta));
});

DOM.cartOpen.addEventListener("click", openCart);
DOM.cartClose.addEventListener("click", closeCart);
DOM.overlay.addEventListener("click", closeCart);
document.addEventListener("keydown", (e) => e.key === "Escape" && closeCart());
DOM.checkout.addEventListener("click", checkout);
DOM.newsletterForm.addEventListener("submit", handleNewsletter);

/* ---------- Arranque ---------- */
DOM.year.textContent = new Date().getFullYear();
renderProducts();
renderCart();
