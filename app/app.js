// app/app.js

const shopBtn = document.querySelector(".section button");
const cartIcon = document.querySelector(".g"); // Твоя иконка корзины

// Анимация иконки корзины при наведении на кнопку "Shop Now"
shopBtn.addEventListener("mouseenter", () => {
  cartIcon.style.transform = "scale(1.3) rotate(-10deg)";
  cartIcon.style.transition = "0.3s";
  cartIcon.style.color = "#2fa84f";
});

shopBtn.addEventListener("mouseleave", () => {
  cartIcon.style.transform = "scale(1) rotate(0)";
  cartIcon.style.color = "white";
});

// Эффект печатающегося текста для поиска
const searchInput = document.querySelector(".input");
searchInput.addEventListener("focus", () => {
  searchInput.style.width = "720px"; // Немного расширяем при фокусе
  searchInput.style.transition = "0.4s ease";
});

searchInput.addEventListener("blur", () => {
  searchInput.style.width = "680px";
});

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
