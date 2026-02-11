const salesGrid = document.getElementById("sales-products-grid");

async function loadSales() {
  if (!salesGrid) return;

  try {
    const response = await fetch("../json/vegetabls.json");
    const allProducts = await response.json();

    // Фильтруем только те товары, у которых есть oldPrice
    const saleItems = allProducts.filter((p) => p.oldPrice);

    salesGrid.innerHTML = saleItems
      .map(
        (product) => `
            <div class="veg-card on-sale clickable-card" data-id="${product.id}">
                <div class="discount_badge">-${Math.round((1 - product.price / product.oldPrice) * 100)}%</div>
                <img src="${product.image}" alt="${product.name}">
                <div class="card-info">
                    <h3>${product.name}</h3>
                    <div class="price-block">
                        <span class="old-price">${product.oldPrice.toFixed(2)}</span>
                        <span class="current-price">${product.price.toFixed(2)}</span>
                    </div>
                    <button class="add-btn">В КОРЗИНУ</button>
                </div>
            </div>
        `,
      )
      .join("");
  } catch (error) {
    console.error("Ошибка:", error);
  }
}

loadSales();


