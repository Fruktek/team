const products = [
    { id: 1, title: "Куртка мужская", price: 1200, category: "Мужское", image: "https://img.joomcdn.net/91d5fbe421f97bda06a4137e6f0b0560796aeb40_original.jpeg" },
    { id: 2, title: "Платье женское", price: 950, category: "Женское", image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQVVNiAS8lm5IiaHKT_8Wi5mT9vM4cfOAHXdg&s" },
    { id: 3, title: "Футболка детская", price: 400, category: "Детское", image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRJ-LlUj9eq6H2ZSw6G9Cmqt9MjtgWcC7ZjUQ&s" },
    { id: 4, title: "Джинсы мужские", price: 1100, category: "Мужское", image: "https://s.62.ua/section/promonewsintext/upload/images/promo/intext/000/056/302/1_66fe87983914d.jpg" },
    { id: 5, title: "Юбка женская", price: 800, category: "Женское", image: "https://odezhda-optom.kz/image/cache/data/30-06-2023/w400151-800x800.jpg" },
];

let cart = [];

// Отображение товаров
function displayProducts(filter = "Все") {
    const grid = document.getElementById("product-grid");
    grid.innerHTML = "";

    const filtered = filter === "Все" ? products : products.filter(p => p.category === filter);

    filtered.forEach(product => {
        const card = document.createElement("div");
        card.className = "product-card";

        card.innerHTML = `
            <div class="product-image">
                <img src="${product.image}" alt="${product.title}">
            </div>
            <div class="product-info">
                <h3 class="product-title">${product.title}</h3>
                <p class="product-price">${product.price} грн.</p>
                <button class="add-to-cart" data-id="${product.id}">Добавить в корзину</button>
            </div>
        `;
        grid.appendChild(card);
    });
}

// Обновление корзины
function updateCartUI() {
    const cartItemsEl = document.getElementById("cart-items");
    const cartCountEl = document.querySelector(".cart-count");
    const cartTotalEl = document.getElementById("cart-total");

    cartItemsEl.innerHTML = "";
    let total = 0;

    cart.forEach(item => {
        total += item.price;

        const itemEl = document.createElement("div");
        itemEl.className = "cart-item";
        itemEl.innerHTML = `
            <p>${item.title}</p>
            <p>${item.price} грн.</p>
        `;
        cartItemsEl.appendChild(itemEl);
    });

    cartCountEl.textContent = cart.length;
    cartTotalEl.textContent = total;
}

// Обработка добавления в корзину
document.addEventListener("click", (e) => {
    if (e.target.classList.contains("add-to-cart")) {
        const id = parseInt(e.target.getAttribute("data-id"));
        const product = products.find(p => p.id === id);
        cart.push(product);
        updateCartUI();
    }

    if (e.target.classList.contains("filter-btn")) {
        document.querySelectorAll(".filter-btn").forEach(btn => btn.classList.remove("active"));
        e.target.classList.add("active");
        displayProducts(e.target.textContent);
    }

    if (e.target.classList.contains("cart-icon") || e.target.closest(".cart-icon")) {
        document.getElementById("cart-modal").style.display = "block";
    }

    if (e.target.classList.contains("close-cart")) {
        document.getElementById("cart-modal").style.display = "none";
    }
});

// Инициализация
document.addEventListener("DOMContentLoaded", () => {
    displayProducts();
    updateCartUI();
});

