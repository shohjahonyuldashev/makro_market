// app/app.js

// Функция для появления категорий по очереди
function animateCategories() {
  const cards = document.querySelectorAll(".cards_cate .card");

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry, index) => {
        if (entry.isIntersecting) {
          // Добавляем задержку для каждой следующей карточки
          setTimeout(() => {
            entry.target.style.opacity = "1";
            entry.target.style.transform = "translateY(0)";
          }, index * 100);
        }
      });
    },
    { threshold: 0.2 },
  );

  cards.forEach((card) => {
    card.style.opacity = "0";
    card.style.transform = "translateY(20px)";
    card.style.transition = "all 0.5s ease-out";
    observer.observe(card);
  });
}

// Запускаем после загрузки DOM
document.addEventListener("DOMContentLoaded", animateCategories);

const container = document.getElementById("featured-products");

async function loadProducts() {
  try {
    const response = await fetch("../json/products.json");
    if (!response.ok) throw new Error("Ошибка сети");
    const products = await response.json();
    container.innerHTML = "";
    products.forEach((product, index) => {
      const card = document.createElement("div");
      card.className = "card";
      card.setAttribute("data-aos", "fade-up");
      card.setAttribute("data-aos-delay", index * 100);

      // Внутри loadProducts измени строку с media:
      const media = product.lottie
        ? `<lottie-player src="${product.lottie}" background="transparent" speed="1" style="width: 100%; height: 200px;" loop autoplay></lottie-player>`
        : `<img src="${product.image}" alt="${product.name}" style="width: 100%; height: 200px; object-fit: contain;">`;
      card.innerHTML = `${media} <div class="text">
                    <span>${product.category}</span>
                    <h3>${product.name}</h3>
                    <p>${product.price}</p>
                    <button class="add-btn">+</button>
                </div>`;
      container.appendChild(card);
    });
    AOS.refresh();
  } catch (error) {
    console.log("Ошибка", error);
  }
}

loadProducts();

const Vebgrid = document.getElementById("vegetables-grid");
const vegCount = document.getElementById("veg-count");
const API = "../json/vegetabls.json";
let allproducts = [];

async function fetchVegetables() {
  const renderEmptyMessage = () => {
    if (vegCount) vegCount.textContent = "0";
    Vebgrid.innerHTML = `
      <div style="
        grid-column: 1 / -1; 
        display: flex; 
        flex-direction: column; 
        align-items: center; 
        justify-content: center; 
        min-height: 70vh; 
        width: 100%; 
        background: #1a1a1a; 
        border-radius: 20px;
        border: 2px dashed #333;
        font-family: 'Inter', sans-serif;
        color: #fff;
        text-align: center;
    ">
        <div style="
            font-size: 6rem; 
            filter: drop-shadow(0 0 20px rgba(255, 206, 86, 0.2));
            margin-bottom: 20px;
            animation: float 3s ease-in-out infinite;
        ">🍌</div>
        
        <h2 style="font-size: 2rem; margin: 0 0 10px; color: #eee;">Упс! Корзина пуста</h2>
        <p style="color: #666; font-size: 1.1rem; max-width: 300px; line-height: 1.5;">
            JSON файл «приболел» или товары закончились на складе.
        </p>
        
        <style>
            @keyframes float {
                0%, 100% { transform: translateY(0); }
                50% { transform: translateY(-20px); }
            }
        </style>
    </div>`;
  };

  try {
    const response = await fetch(API);
    const vegetables = await response.json();
    Vebgrid.innerHTML = "";

    allproducts = vegetables;

    renderCards(allproducts);

    if (vegCount) vegCount.textContent = vegetables.length;

    if (!response.ok) {
      renderEmptyMessage();
      return;
    }

    if (!vegetables || vegetables.length === 0) {
      renderEmptyMessage();
      return;
    }

    renderCards(allproducts);
  } catch (error) {
    console.error("Критическая ошибка:", error);
    renderEmptyMessage();
  }
}

function renderCards(data) {
  if (vegCount) vegCount.textContent = data.length;
  Vebgrid.innerHTML = data
    .map(
      (veg) => `
        <div class="veg-card">
            <img src="${veg.image}" alt="${veg.name}">
            <div class="card-info">
                <h3>${veg.name}</h3>
                <p style="color: #666; font-size: 0.8rem;">${veg.weight}</p>
                <div style="display: flex; justify-content: space-between; align-items: center; margin-top: 10px;">
                    <span class="price">$${veg.price.toFixed(2)}</span>
                    <button class="add-btn">Add +</button>
                </div>
            </div>
        </div>`,
    )
    .join("");
}

document.querySelectorAll(".filter-btn").forEach((btn) => {
  btn.addEventListener("click", () => {
    const category = btn.getAttribute("data-category");

    document
      .querySelectorAll(".filter-btn")
      .forEach((b) => b.classList.remove("active"));
    btn.classList.add("active");

    if (category === "all") {
      renderCards(allproducts);
    } else {
      const filtered = allproducts.filter((veg) => veg.category === category);
      renderCards(filtered);
    }
  });
});

fetchVegetables();
