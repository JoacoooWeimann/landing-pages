/**
 * Calculadora de IMC (Índice de Masa Corporal).
 */

const form = document.getElementById("bmiForm");
const weightInput = document.getElementById("weight");
const heightInput = document.getElementById("height");
const result = document.getElementById("bmiResult");
const valueEl = document.getElementById("bmiValue");
const labelEl = document.getElementById("bmiLabel");

// Funciones puras exportadas: se pueden reutilizar o probar por separado
// IMC = peso (kg) / altura (m)²
export const calculateBmi = (weightKg, heightCm) => weightKg / (heightCm / 100) ** 2;

export function getBmiCategory(bmi) {
  if (bmi < 18.5) return { label: "Bajo peso", color: "#60a5fa" };
  if (bmi < 25) return { label: "Peso saludable", color: "#c6f432" };
  if (bmi < 30) return { label: "Sobrepeso", color: "#fbbf24" };
  return { label: "Obesidad", color: "#f87171" };
}

function handleSubmit(event) {
  event.preventDefault();
  const bmi = calculateBmi(Number(weightInput.value), Number(heightInput.value));
  const { label, color } = getBmiCategory(bmi);

  valueEl.textContent = bmi.toFixed(1);
  labelEl.textContent = label;
  labelEl.style.color = color;
  result.classList.remove("hidden"); // "hidden" es una clase de Tailwind (display: none)
}

export function initBmi() {
  form.addEventListener("submit", handleSubmit);
}
