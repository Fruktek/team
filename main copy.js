// Пример товара
const product = {
    id: 101,
    title: "Пуховик зимний мужской",
    price: 2200,
    description: "Теплый зимний пуховик с капюшоном. Материал: полиэстер, подкладка: флис.",
    image: "https://via.placeholder.com/500x500?text=Пуховик"
};

let cart = [];

// Заполнение страницы
document.addEventListener("DOMContentLoaded", () => {
    document.getElementById("product-title").textContent = product.title;
    document.getElementById("product-price").textContent = product.price + " грн.";
    document.getElementById("product-description").textContent = product.description;
    document.querySelector(".product-image img").src = product.image;

    // Счётчик корзины
    updateCartCount();
});

// Добавить в корзину
document.querySelector(".add-to-cart-btn").addEventListener("click", () => {
    cart.push(product);
    updateCartCount();
    alert("Товар добавлен в корзину!");
});

function updateCartCount() {
    document.querySelector(".cart-count").textContent = cart.length;
}
