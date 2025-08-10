// Загружаем товары с API
async function fetchProducts() {
    try {
        const res = await fetch("https://fakestoreapi.com/products?limit=4"); // пример API
        if (!res.ok) throw new Error("Ошибка загрузки товаров");
        const products = await res.json();
        renderProducts(products);
    } catch (err) {
        console.error(err);
        alert("Не удалось загрузить товары");
    }
}

// Рендер списка товаров
function renderProducts(products) {
    const container = document.getElementById("product-list");
    container.innerHTML = "";

    products.forEach(product => {
        const item = document.createElement("div");
        item.classList.add("product");
        item.innerHTML = `
            <img src="${product.image}" alt="${product.title}" width="150">
            <h3>${product.title}</h3>
            <p>${product.price} грн.</p>
            <button data-id="${product.id}">Добавить в корзину</button>
        `;
        container.appendChild(item);
    });

    // Навешиваем обработчики кнопок
    document.querySelectorAll(".product button").forEach(btn => {
        btn.addEventListener("click", () => {
            const productId = btn.dataset.id;
            const product = products.find(p => p.id == productId);
            addToCart(product);
        });
    });
}

// Получение корзины из localStorage
function getCart() {
    return JSON.parse(localStorage.getItem("cart")) || [];
}

// Сохранение корзины
function saveCart(cart) {
    localStorage.setItem("cart", JSON.stringify(cart));
}

// Добавление товара в корзину
function addToCart(product) {
    const cart = getCart();
    cart.push(product);
    saveCart(cart);
    updateCartCount();
    alert("Товар добавлен в корзину!");
}

// Обновление счётчика корзины
function updateCartCount() {
    document.querySelector(".cart-count").textContent = getCart().length;
}

// Инициализация
document.addEventListener("DOMContentLoaded", () => {
    fetchProducts();
    updateCartCount();
});
