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

async function fetchVegetables() {
  try{
    const response = await fetch("./json/vegetabls.json");
    const vegetables = await response.json();
    Vebgrid.innerHTML = "";
   if(vegCount) vegCount.textContent = vegetables.length;

  //  Создаем карточки для каждого овоща
  Vebgrid.innerHTML= vegetables.map(veg=>`<div class="veg-card">
                <img src="${veg.image}" alt="${veg.name}">
                <div class="card-info">
                    <h3>${veg.name}</h3>
                    <p style="color: #666; font-size: 0.8rem;">${veg.weight}</p>
                    <div style="display: flex; justify-content: space-between; align-items: center; margin-top: 10px;">
                        <span class="price">$${veg.price.toFixed(2)}</span>
                        <button class="add-btn">Add +</button>
                    </div>
                </div>
            </div>`).join("");
  }catch(error){
    console.error("Ошибка при загрузке овощей:", error);
  }
}

fetchVegetables();