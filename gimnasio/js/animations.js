/**
 * Animaciones: contadores que suben y elementos que aparecen al scrollear.
 */

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

export function initAnimations() {
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
}
