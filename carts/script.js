document.addEventListener('DOMContentLoaded', function() {
    // Sample product data
    const products = [
        {
            id: 1,
            title: "Fantse Language",
            price: 99.99,
            image: "../assets/images/whatsapp-image-2025-03-23-at-7.08.35-pm-506x506.jpg"
        },
        {
            id: 2,
            title: "Ashanti Language",
            price: 199.99,
            image: "../assets/images/whatsapp-image-2025-03-23-at-7.09.07-pm-506x506.jpg"
        },
        {
            id: 3,
            title: "Ga Language",
            price: 79.99,
            image: "../assets/images/whatsapp-image-2025-03-23-at-7.12.18-pm-506x506.jpg"
        },
        {
            id: 4,
            title: "Krobo Language",
            price: 49.99,
            image: "../assets/images/whatsapp-image-2025-03-23-at-7.09.27-pm-1280x1280.jpg"
        },
        {
            id: 5,
            title: "Ewe Language",
            price: 29.99,
            image: "../assets/images/whatsapp-image-2025-03-23-at-7.10.04-pm-1280x1280.jpg"
        }
    ];

    // DOM elements
    const productGrid = document.getElementById('product-grid');
    const cartItems = document.getElementById('cart-items');
    const cartCount = document.querySelector('.cart-count');
    const totalPrice = document.querySelector('.total-price');
    const checkoutBtn = document.querySelector('.checkout-btn');
    const cartSidebar = document.getElementById('cart-sidebar');
    const overlay = document.getElementById('overlay');
    const cartIcon = document.querySelector('.cart-icon');
    const closeCart = document.querySelector('.close-cart');

    // Cart state
    let cart = [];

    // Initialize the app
    function init() {
        renderProducts();
        setupEventListeners();
        loadCart();
        updateCartUI();
    }

    // Render products to the page
    function renderProducts() {
        productGrid.innerHTML = '';
        
        products.forEach(product => {
            const productCard = document.createElement('div');
            productCard.className = 'product-card';
            
            productCard.innerHTML = `
                <div class="product-image">
                    <img src="${product.image}" alt="${product.title}">
                </div>
                <div class="product-info">
                    <h3 class="product-title">${product.title}</h3>
                    <p class="product-price">$${product.price.toFixed(2)}</p>
                    <button class="add-to-cart" data-id="${product.id}">Add to Cart</button>
                </div>
            `;
            
            productGrid.appendChild(productCard);
        });
    }

    // Set up event listeners
    function setupEventListeners() {
        // Add to cart buttons
        document.addEventListener('click', function(e) {
            if (e.target.classList.contains('add-to-cart')) {
                const productId = parseInt(e.target.getAttribute('data-id'));
                addToCart(productId);
            }
            
            // Quantity buttons
            if (e.target.classList.contains('quantity-btn')) {
                const cartItemId = parseInt(e.target.closest('.cart-item').getAttribute('data-id'));
                const isIncrease = e.target.classList.contains('increase');
                updateQuantity(cartItemId, isIncrease);
            }
            
            // Remove item button
            if (e.target.classList.contains('remove-item')) {
                const cartItemId = parseInt(e.target.closest('.cart-item').getAttribute('data-id'));
                removeFromCart(cartItemId);
            }
        });
        
        // Cart icon click
        cartIcon.addEventListener('click', openCart);
        
        // Close cart button
        closeCart.addEventListener('click', closeCartSidebar);
        
        // Overlay click
        overlay.addEventListener('click', closeCartSidebar);
        
        // Checkout button
        checkoutBtn.addEventListener('click', checkout);
    }

    // Cart functions
    function addToCart(productId) {
        const product = products.find(p => p.id === productId);
        
        if (!product) return;
        
        const existingItem = cart.find(item => item.id === productId);
        
        if (existingItem) {
            existingItem.quantity += 1;
        } else {
            cart.push({
                ...product,
                quantity: 1
            });
        }
        
        saveCart();
        updateCartUI();
        showAddedToCartMessage(product.title);
    }

    function removeFromCart(productId) {
        cart = cart.filter(item => item.id !== productId);
        saveCart();
        updateCartUI();
    }

    function updateQuantity(productId, isIncrease) {
        const cartItem = cart.find(item => item.id === productId);
        
        if (!cartItem) return;
        
        if (isIncrease) {
            cartItem.quantity += 1;
        } else {
            if (cartItem.quantity > 1) {
                cartItem.quantity -= 1;
            } else {
                removeFromCart(productId);
                return;
            }
        }
        
        saveCart();
        updateCartUI();
    }

    function calculateTotal() {
        return cart.reduce((total, item) => total + (item.price * item.quantity), 0);
    }

    function updateCartUI() {
        // Update cart items
        if (cart.length === 0) {
            cartItems.innerHTML = '<p class="empty-cart-message">Your cart is empty</p>';
            checkoutBtn.disabled = true;
        } else {
            cartItems.innerHTML = '';
            
            cart.forEach(item => {
                const cartItemElement = document.createElement('div');
                cartItemElement.className = 'cart-item';
                cartItemElement.setAttribute('data-id', item.id);
                
                cartItemElement.innerHTML = `
                    <img src="${item.image}" alt="${item.title}" class="cart-item-image">
                    <div class="cart-item-details">
                        <h4 class="cart-item-title">${item.title}</h4>
                        <p class="cart-item-price">$${item.price.toFixed(2)}</p>
                        <div class="cart-item-quantity">
                            <button class="quantity-btn decrease">-</button>
                            <span class="quantity-value">${item.quantity}</span>
                            <button class="quantity-btn increase">+</button>
                        </div>
                    </div>
                    <button class="remove-item" title="Remove item">
                        <i class="fas fa-trash"></i>
                    </button>
                `;
                
                cartItems.appendChild(cartItemElement);
            });
            
            checkoutBtn.disabled = false;
        }
        
        // Update cart count
        const totalItems = cart.reduce((count, item) => count + item.quantity, 0);
        cartCount.textContent = totalItems;
        
        // Update total price
        totalPrice.textContent = `$${calculateTotal().toFixed(2)}`;
    }

    function openCart() {
        cartSidebar.classList.add('active');
        overlay.classList.add('active');
        document.body.style.overflow = 'hidden';
    }

    function closeCartSidebar() {
        cartSidebar.classList.remove('active');
        overlay.classList.remove('active');
        document.body.style.overflow = 'auto';
    }

    function checkout() {
        if (cart.length === 0) return;
        
        alert(`Thank you for your purchase!\nTotal: $${calculateTotal().toFixed(2)}`);
        cart = [];
        saveCart();
        updateCartUI();
        closeCartSidebar();
    }

    function showAddedToCartMessage(productTitle) {
        const message = document.createElement('div');
        message.className = 'added-to-cart-message';
        message.textContent = `${productTitle} added to cart!`;
        
        document.body.appendChild(message);
        
        setTimeout(() => {
            message.classList.add('show');
        }, 10);
        
        setTimeout(() => {
            message.classList.remove('show');
            setTimeout(() => {
                document.body.removeChild(message);
            }, 300);
        }, 2000);
    }

    // Local storage functions
    function saveCart() {
        localStorage.setItem('cart', JSON.stringify(cart));
    }

    function loadCart() {
        const savedCart = localStorage.getItem('cart');
        if (savedCart) {
            cart = JSON.parse(savedCart);
        }
    }

    // Initialize the app
    init();

    // Add styles for the added to cart message
    const style = document.createElement('style');
    style.textContent = `
        .added-to-cart-message {
            position: fixed;
            bottom: 20px;
            left: 50%;
            transform: translateX(-50%);
            background-color: #2ecc71;
            color: white;
            padding: 10px 20px;
            border-radius: 4px;
            box-shadow: 0 2px 10px rgba(0, 0, 0, 0.2);
            opacity: 0;
            transition: opacity 0.3s ease;
            z-index: 1100;
        }
        
        .added-to-cart-message.show {
            opacity: 1;
        }
    `;
    document.head.appendChild(style);
});