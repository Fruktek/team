// Демо-дані товарів
const PRODUCTS = [
    {id:1, title:"Худі Essential", brand:"UrbanWay", category:"Чоловіче", price:1299, oldPrice:1599, popular:true, image:"https://sixtynine.com.ua/wp-content/uploads/2024/02/chorne-hudi-oversize-logo-classic-800x800.jpg"},
    {id:2, title:"Кросівки AirRun", brand:"FlyStep", category:"Взуття", price:2599, oldPrice:0, popular:true, image:"https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTFuOzTZ2u5KJBxsmgvHbAPBwKJyLF31ogTdA&s"},
    {id:3, title:"Сукня Summer Light", brand:"Belle", category:"Жіноче", price:1899, oldPrice:2199, popular:true, image:"https://img.kwcdn.com/product/fancy/3354c053-a613-4b00-9c06-eeec24fb0afe.jpg?imageMogr2/auto-orient%7CimageView2/2/w/800/q/70/format/webp"},
    {id:4, title:"Джинси Classic", brand:"Denim&Co", category:"Чоловіче", price:1499, oldPrice:0, popular:false, image:"https://static.ftshp.digital/img/p/1/1/9/9/7/0/1/1199701-full_product.jpg"},
    {id:5, title:"Футболка Basic", brand:"Plainly", category:"Жіноче", price:599, oldPrice:799, popular:false, image:"https://kopo.ua/image/catalog/%20%D0%B1%D0%B0%D0%B7%D0%BE%D0%B2%D1%96/%D0%9C%D0%B5%D0%BB%D0%B0%D0%BD%D0%B6/287.jpg"},
    {id:6, title:"Кросівки Street", brand:"FlyStep", category:"Взуття", price:2199, oldPrice:2599, popular:false, image:"https://visionstreetwear.com/cdn/shop/files/VS-ACC305-ARMY-FRONT.jpg?v=1746815230"},
    {id:7, title:"Куртка Parka", brand:"Nord", category:"Чоловіче", price:3299, oldPrice:0, popular:true, image:"https://braggart.ua/image/cache/product/12/12_a2a93ec2a78e4ad89bcc23f815375a70-640x960.jpg"},
    {id:8, title:"Светр Cozy", brand:"Belle", category:"Жіноче", price:1199, oldPrice:1399, popular:false, image:"https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQYJ9Rj-_rHccQKRT3rHJaiuxM7djLsoUxszA&s"},
    {id:9, title:"Куртка Kids", brand:"MiniMe", category:"Дитяче", price:999, oldPrice:1299, popular:false, image:"https://megasport.ua/api/s3/images/megasport-dev/products/3555570144/65267166ce2cf-6389105.jpeg"},
    {id:10, title:"Кросівки Kids", brand:"MiniRun", category:"Взуття", price:1299, oldPrice:0, popular:false, image:"https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ8bY8Xz9E6cs6eyNChZlj2obsATtbp1E0nQQ&s"},
];

// Зберігання у localStorage
const storage = {
    get(key, fallback){
        try{ return JSON.parse(localStorage.getItem(key)) ?? fallback; }catch{ return fallback; }
    },
    set(key, value){ localStorage.setItem(key, JSON.stringify(value)); }
};

const CART_KEY = "fs_cart";
const FAV_KEY = "fs_favorites";
const THEME_KEY = "fs_theme";

// Кошик
function getCart(){ return storage.get(CART_KEY, []); }
function setCart(items){ storage.set(CART_KEY, items); updateCartCount(); }
function addToCart(productId, qty=1){
    const cart = getCart();
    const idx = cart.findIndex(i=>i.id===productId);
    if(idx>-1){ cart[idx].qty += qty; } else { cart.push({id:productId, qty}); }
    setCart(cart);
    toast("Додано до кошика");
}
function removeFromCart(productId){
    setCart(getCart().filter(i=>i.id!==productId));
}
function updateQty(productId, qty){
    const q = Math.max(1, qty|0);
    const cart = getCart().map(i=> i.id===productId ? {...i, qty:q} : i);
    setCart(cart);
}
function clearCart(){ setCart([]); }

// Обране
function getFav(){ return storage.get(FAV_KEY, []); }
function toggleFav(productId){
    let fav = getFav();
    if(fav.includes(productId)){ fav = fav.filter(id=>id!==productId); toast("Видалено з обраного"); }
    else { fav = fav.concat(productId); toast("Додано в обране"); }
    storage.set(FAV_KEY, fav);
    // Перемалювати, якщо є відповідний контейнер
    if(document.getElementById("catalog-grid")) renderCatalog();
    if(document.getElementById("home-product-grid")) renderHomeGrid();
}

// Тема
function applyTheme(){
    const t = storage.get(THEME_KEY,"dark");
    document.body.classList.toggle("light", t==="light");
}
function toggleTheme(){
    const t = storage.get(THEME_KEY,"dark");
    storage.set(THEME_KEY, t==="light"?"dark":"light");
    applyTheme();
}

// UI
function updateCartCount(){
    const el = document.getElementById("cart-count");
    if(!el) return;
    const count = getCart().reduce((s,i)=>s+i.qty,0);
    el.textContent = count;
}

function money(n){ return `${n.toLocaleString("uk-UA")} ₴`; }

function productCard(p){
    const fav = getFav().includes(p.id) ? "active" : "";
    const badge = p.oldPrice>p.price ? `<span class="product__badge">-${Math.round((1-p.price/(p.oldPrice||p.price))*100)}%</span>` : "";
    const old = p.oldPrice>p.price ? `<span class="price-old">${money(p.oldPrice)}</span>` : "";
    return `
    <article class="product card">
      <div class="product__thumb">
        <img src="${p.image}" alt="${p.title}">
        ${badge}
      </div>
      <div class="product__body">
        <div class="product__brand">${p.brand} • ${p.category}</div>
        <h3 class="product__title">${p.title}</h3>
        <div class="product__price">
          <strong>${money(p.price)}</strong>${old}
        </div>
        <div class="product__actions">
          <button class="btn btn-primary" data-add="${p.id}"><i class="fa-solid fa-cart-plus"></i> Додати</button>
          <button class="icon-btn icon-like ${fav}" data-fav="${p.id}" title="Додати в обране"><i class="fa-solid fa-heart"></i></button>
        </div>
      </div>
    </article>
  `;
}

// Рендер для головної
function renderHomeGrid(){
    const grid = document.getElementById("home-product-grid");
    if(!grid) return;
    const items = PRODUCTS.filter(p=>p.popular).slice(0,8);
    grid.innerHTML = items.map(productCard).join("");
    wireProductButtons(grid);
}

// Рендер каталогу з фільтрами
function readFilters(){
    const cat = document.querySelector(".chip.active")?.dataset.cat || "all";
    const q = document.getElementById("search")?.value.trim().toLowerCase() || "";
    const sort = document.getElementById("sort")?.value || "popular";
    const min = parseFloat(document.getElementById("price-min")?.value || "0");
    const max = parseFloat(document.getElementById("price-max")?.value || "0");
    const onlyFav = !!document.getElementById("only-favorites")?.checked;
    return {cat, q, sort, min, max, onlyFav};
}

function applyFilters(list, f){
    let res = [...list];
    if(f.cat!=="all") res = res.filter(p=>p.category===f.cat);
    if(f.q) res = res.filter(p=> (p.title+p.brand).toLowerCase().includes(f.q));
    if(f.min>0) res = res.filter(p=>p.price>=f.min);
    if(f.max>0) res = res.filter(p=>p.price<=f.max);
    if(f.onlyFav){
        const set = new Set(getFav());
        res = res.filter(p=>set.has(p.id));
    }
    switch(f.sort){
        case "price-asc": res.sort((a,b)=>a.price-b.price); break;
        case "price-desc": res.sort((a,b)=>b.price-a.price); break;
        case "name": res.sort((a,b)=>a.title.localeCompare(b.title)); break;
        default: res.sort((a,b)=> (b.popular?1:0)-(a.popular?1:0)); break;
    }
    return res;
}

function renderCatalog(){
    const grid = document.getElementById("catalog-grid");
    if(!grid) return;
    const f = readFilters();
    const filtered = applyFilters(PRODUCTS, f);
    document.getElementById("results-count").textContent = filtered.length;
    grid.innerHTML = filtered.map(productCard).join("");
    wireProductButtons(grid);
}

function wireProductButtons(scope=document){
    scope.querySelectorAll("[data-add]").forEach(btn=>{
        btn.addEventListener("click", ()=> addToCart(parseInt(btn.dataset.add,10), 1));
    });
    scope.querySelectorAll("[data-fav]").forEach(btn=>{
        btn.addEventListener("click", ()=> toggleFav(parseInt(btn.dataset.fav,10)));
    });
}

// Кошик — рендер
function renderCart(){
    const wrap = document.getElementById("cart-content");
    const empty = document.getElementById("cart-empty");
    if(!wrap || !empty) return;
    const items = getCart();
    if(items.length===0){
        wrap.classList.add("hidden");
        empty.classList.remove("hidden");
        updateCartCount();
        return;
    }
    wrap.classList.remove("hidden");
    empty.classList.add("hidden");

    const list = document.getElementById("cart-list");
    const withData = items.map(i=> ({...i, p: PRODUCTS.find(p=>p.id===i.id)})).filter(x=>!!x.p);

    list.innerHTML = withData.map(({p,qty})=>`
    <div class="cart-item card" data-id="${p.id}">
      <img src="${p.image}" alt="${p.title}">
      <div>
        <h3 class="cart-item__title">${p.title}</h3>
        <div class="muted">${p.brand} • ${p.category}</div>
        <div class="cart-item__price">${money(p.price)}</div>
      </div>
      <div class="cart-actions">
        <div class="qty">
          <button data-dec="${p.id}" aria-label="Зменшити кількість">-</button>
          <input data-qty="${p.id}" type="number" min="1" value="${qty}">
          <button data-inc="${p.id}" aria-label="Збільшити кількість">+</button>
        </div>
        <button class="btn btn-outline btn-sm" data-remove="${p.id}">
          <i class="fa-solid fa-trash"></i> Видалити
        </button>
      </div>
    </div>
  `).join("");

    // Підсумки
    const totalItems = withData.reduce((s,x)=>s+x.qty,0);
    const total = withData.reduce((s,x)=>s+x.qty*x.p.price,0);
    document.getElementById("summary-items").textContent = totalItems;
    document.getElementById("summary-total").textContent = money(total);

    // Обробники
    list.querySelectorAll("[data-inc]").forEach(b=>{
        b.addEventListener("click", ()=>{
            const id = parseInt(b.dataset.inc,10);
            const item = getCart().find(i=>i.id===id);
            updateQty(id, (item?.qty||1)+1);
            renderCart();
        });
    });
    list.querySelectorAll("[data-dec]").forEach(b=>{
        b.addEventListener("click", ()=>{
            const id = parseInt(b.dataset.dec,10);
            const item = getCart().find(i=>i.id===id);
            const next = Math.max(1,(item?.qty||1)-1);
            updateQty(id, next);
            renderCart();
        });
    });
    list.querySelectorAll("[data-qty]").forEach(inp=>{
        inp.addEventListener("change", ()=>{
            const id = parseInt(inp.dataset.qty,10);
            updateQty(id, parseInt(inp.value,10)||1);
            renderCart();
        });
    });
    list.querySelectorAll("[data-remove]").forEach(b=>{
        b.addEventListener("click", ()=>{
            removeFromCart(parseInt(b.dataset.remove,10));
            renderCart();
            toast("Товар видалено");
        });
    });

    document.getElementById("apply-promo")?.addEventListener("click", ()=>{
        const code = document.getElementById("promo").value.trim().toUpperCase();
        if(code==="SAVE10"){
            const discounted = Math.round(total*0.9);
            document.getElementById("summary-total").textContent = money(discounted);
            toast("Промокод застосовано: -10%");
        }else{
            toast("Недійсний промокод");
        }
    });

    document.getElementById("checkout")?.addEventListener("click", ()=>{
        toast("Дякуємо! Це демо — оформлення не виконується.");
    });

    document.getElementById("clear-cart")?.addEventListener("click", ()=>{
        clearCart();
        renderCart();
        toast("Кошик очищено");
    });

    updateCartCount();
}

// Toast
let toastTimer;
function toast(msg){
    const el = document.getElementById("toast");
    if(!el) return;
    el.textContent = msg;
    el.classList.add("show");
    clearTimeout(toastTimer);
    toastTimer = setTimeout(()=> el.classList.remove("show"), 1800);
}

// Події фільтрів
function wireCatalogFilters(){
    document.getElementById("search")?.addEventListener("input", debounce(renderCatalog, 150));
    document.getElementById("sort")?.addEventListener("change", renderCatalog);
    document.getElementById("price-apply")?.addEventListener("click", renderCatalog);
    document.getElementById("only-favorites")?.addEventListener("change", renderCatalog);
    document.getElementById("reset-filters")?.addEventListener("click", ()=>{
        document.getElementById("search").value = "";
        document.getElementById("sort").value = "popular";
        document.getElementById("price-min").value = "";
        document.getElementById("price-max").value = "";
        document.getElementById("only-favorites").checked = false;
        document.querySelectorAll("#category-chips .chip").forEach(c=>c.classList.remove("active"));
        document.querySelector('#category-chips .chip[data-cat="all"]').classList.add("active");
        renderCatalog();
    });
    document.querySelectorAll("#category-chips .chip").forEach(ch=>{
        ch.addEventListener("click", ()=>{
            document.querySelectorAll("#category-chips .chip").forEach(c=>c.classList.remove("active"));
            ch.classList.add("active");
            renderCatalog();
        });
    });
}

// Перемикач теми
function wireThemeToggle(){
    document.getElementById("theme-toggle")?.addEventListener("click", toggleTheme);
}

// Debounce
function debounce(fn, delay){
    let t; return (...args)=>{ clearTimeout(t); t = setTimeout(()=>fn(...args), delay); };
}

// Ініціалізація
document.addEventListener("DOMContentLoaded", ()=>{
    applyTheme();
    updateCartCount();
    wireThemeToggle();

    const page = document.body.dataset.page;
    if(page==="home"){
        renderHomeGrid();
    }else if(page==="catalog"){
        wireCatalogFilters();
        renderCatalog();
    }else if(page==="cart"){
        renderCart();
    }
});
