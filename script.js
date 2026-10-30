const products = [
    {
        id: 1,
        name: "iPhone 15 Pro Max",
        brand: "Apple",
        price: 165000,
        description: "256GB Storage | 8GB RAM",
        image: "https://images.unsplash.com/photo-1696446702183-cbd13d8b5b1a?w=500"
    },
    {
        id: 2,
        name: "iPhone 14 Pro",
        brand: "Apple",
        price: 125000,
        description: "128GB Storage | 6GB RAM",
        image: "https://images.unsplash.com/photo-1678685888221-cda773a3dcdb?w=500"
    },
    {
        id: 3,
        name: "Samsung S24 Ultra",
        brand: "Samsung",
        price: 145000,
        description: "256GB Storage | 12GB RAM",
        image: "https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?w=500"
    },
    {
        id: 4,
        name: "Samsung Galaxy A55",
        brand: "Samsung",
        price: 48000,
        description: "128GB Storage | 8GB RAM",
        image: "https://images.unsplash.com/photo-1598327105666-5b89351aff97?w=500"
    },
    {
        id: 5,
        name: "Tecno Camon 30",
        brand: "Tecno",
        price: 28000,
        description: "256GB Storage | 8GB RAM",
        image: "https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=500"
    },
    {
        id: 6,
        name: "Tecno Spark 20",
        brand: "Tecno",
        price: 17000,
        description: "128GB Storage | 8GB RAM",
        image: "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=500"
    },
    {
        id: 7,
        name: "Infinix Note 40",
        brand: "Infinix",
        price: 27000,
        description: "256GB Storage | 8GB RAM",
        image: "https://images.unsplash.com/photo-1598327105666-5b89351aff97?w=500"
    },
    {
        id: 8,
        name: "Xiaomi Redmi Note 13",
        brand: "Xiaomi",
        price: 24000,
        description: "256GB Storage | 8GB RAM",
        image: "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=500"
    }
];

let cart = JSON.parse(localStorage.getItem("lewisCart")) || [];
let selectedBrand = "All";

const productsGrid = document.getElementById("products-grid");
const searchInput = document.getElementById("search-input");
const emptyMessage = document.getElementById("empty-message");
const cartCount = document.getElementById("cart-count");
const cartItems = document.getElementById("cart-items");
const cartTotal = document.getElementById("cart-total");
const cartOverlay = document.getElementById("cart-overlay");

function formatPrice(price) {
    return "KSh " + price.toLocaleString("en-KE");
}

function displayProducts() {
    const searchTerm = searchInput.value.toLowerCase();

    const filteredProducts = products.filter(product => {
        const matchesSearch =
            product.name.toLowerCase().includes(searchTerm) ||
            product.brand.toLowerCase().includes(searchTerm);

        const matchesBrand =
            selectedBrand === "All" || product.brand === selectedBrand;

        return matchesSearch && matchesBrand;
    });

    productsGrid.innerHTML = "";

    emptyMessage.style.display =
        filteredProducts.length === 0 ? "block" : "none";

    filteredProducts.forEach(product => {
        const card = document.createElement("div");
        card.className = "product-card";

        card.innerHTML = `
            <div class="product-image">
                <span class="product-brand">${product.brand}</span>
                <img src="${product.image}" alt="${product.name}" loading="lazy">
            </div>

            <div class="product-info">
                <h3>${product.name}</h3>
                <p>${product.description}</p>

                <div class="product-bottom">
                    <span class="product-price">${formatPrice(product.price)}</span>

                    <button class="add-cart" data-id="${product.id}">
                        <i class="fas fa-cart-plus"></i> Add
                    </button>
                </div>
            </div>
        `;

        productsGrid.appendChild(card);
    });
}

productsGrid.addEventListener("click", event => {
    const button = event.target.closest(".add-cart");

    if (!button) return;

    addToCart(Number(button.dataset.id));
});

function addToCart(id) {
    const existingItem = cart.find(item => item.id === id);

    if (existingItem) {
        existingItem.quantity++;
    } else {
        cart.push({
            id,
            quantity: 1
        });
    }

    updateCart();
    openCart();
}

function updateCart() {
    localStorage.setItem("lewisCart", JSON.stringify(cart));

    const totalItems = cart.reduce(
        (total, item) => total + item.quantity,
        0
    );

    cartCount.textContent = totalItems;

    cartItems.innerHTML = "";

    if (cart.length === 0) {
        cartItems.innerHTML = `
            <div class="cart-empty">
                <i class="fas fa-shopping-cart"></i>
                <p>Your shopping cart is empty.</p>
            </div>
        `;
    }

    let total = 0;

    cart.forEach(item => {
        const product = products.find(product => product.id === item.id);

        if (!product) return;

        total += product.price * item.quantity;

        const cartItem = document.createElement("div");
        cartItem.className = "cart-item";

        cartItem.innerHTML = `
            <img src="${product.image}" alt="${product.name}">

            <div class="cart-item-info">
                <h4>${product.name}</h4>
                <p>${formatPrice(product.price)}</p>

                <div class="quantity-controls">
                    <button data-action="decrease" data-id="${product.id}">-</button>
                    <span>${item.quantity}</span>
                    <button data-action="increase" data-id="${product.id}">+</button>
                </div>
            </div>

            <button class="remove-item" data-action="remove" data-id="${product.id}" aria-label="Remove ${product.name}">
                <i class="fas fa-trash"></i>
            </button>
        `;

        cartItems.appendChild(cartItem);
    });

    cartTotal.textContent = formatPrice(total);
}

cartItems.addEventListener("click", event => {
    const button = event.target.closest("button[data-action]");

    if (!button) return;

    const id = Number(button.dataset.id);
    const action = button.dataset.action;

    const item = cart.find(item => item.id === id);

    if (!item) return;

    if (action === "increase") {
        item.quantity++;
    }

    if (action === "decrease") {
        item.quantity--;

        if (item.quantity <= 0) {
            cart = cart.filter(item => item.id !== id);
        }
    }

    if (action === "remove") {
        cart = cart.filter(item => item.id !== id);
    }

    updateCart();
});

function openCart() {
    cartOverlay.classList.add("open");
    document.body.style.overflow = "hidden";
}

function closeCart() {
    cartOverlay.classList.remove("open");
    document.body.style.overflow = "";
}

document.getElementById("cart-button").addEventListener("click", openCart);

document.getElementById("close-cart").addEventListener("click", closeCart);

cartOverlay.addEventListener("click", event => {
    if (event.target === cartOverlay) {
        closeCart();
    }
});

document.addEventListener("keydown", event => {
    if (event.key === "Escape") {
        closeCart();
    }
});

searchInput.addEventListener("input", displayProducts);

document.querySelectorAll(".brand-card").forEach(button => {
    button.addEventListener("click", () => {
        document.querySelectorAll(".brand-card").forEach(card => {
            card.classList.remove("active");
        });

        button.classList.add("active");

        selectedBrand = button.dataset.brand;

        displayProducts();
    });
});

document.getElementById("checkout-button").addEventListener("click", () => {
    if (cart.length === 0) {
        alert("Your cart is empty. Add a phone first.");
        return;
    }

    const orderLines = cart.map(item => {
        const product = products.find(product => product.id === item.id);

        return `${product.name} x ${item.quantity} = ${formatPrice(product.price * item.quantity)}`;
    });

    const total = cart.reduce((sum, item) => {
        const product = products.find(product => product.id === item.id);
        return sum + product.price * item.quantity;
    }, 0);

    const message = `
Hello Lewis Phones!

I would like to place this order:

${orderLines.join("\n")}

Total: ${formatPrice(total)}

Please confirm availability and delivery details.
    `;

    const whatsappURL =
        `https://wa.me/254707902074?text=${encodeURIComponent(message)}`;

    window.open(whatsappURL, "_blank");
});

const menuToggle = document.getElementById("menu-toggle");
const navLinks = document.getElementById("nav-links");

menuToggle.addEventListener("click", () => {
    navLinks.classList.toggle("active");

    menuToggle.innerHTML = navLinks.classList.contains("active")
        ? '<i class="fas fa-times"></i>'
        : '<i class="fas fa-bars"></i>';
});

navLinks.querySelectorAll("a").forEach(link => {
    link.addEventListener("click", () => {
        navLinks.classList.remove("active");
        menuToggle.innerHTML = '<i class="fas fa-bars"></i>';
    });
});

document.getElementById("year").textContent = new Date().getFullYear();

displayProducts();
updateCart();