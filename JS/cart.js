class Cart {
    constructor() {
        this.items = JSON.parse(localStorage.getItem('cart')) || [];
        this.init();
    }

    init() {
        // Initialize cart elements
        this.cartContainer = document.querySelector('.cart-container');
        this.cartDropdown = document.querySelector('.cart-dropdown');
        this.cartCount = document.querySelector('.cart-count');
        this.cartItemsContainer = document.getElementById('cartItemsContainer');
        this.subtotalElement = document.getElementById('subtotal');
        this.shippingElement = document.getElementById('shipping');
        this.totalElement = document.getElementById('total');
        this.promoCodeInput = document.getElementById('promoCode');
        this.applyPromoButton = document.getElementById('applyPromo');

        this.setupEventListeners();
        this.updateCartDisplay();
    }

    setupEventListeners() {
        // Toggle cart dropdown
        this.cartContainer?.addEventListener('click', (e) => {
            if (e.target.closest('a')) {
                e.preventDefault();
                this.toggleCart();
            }
        });

        // Close cart when clicking outside
        document.addEventListener('click', (e) => {
            if (!e.target.closest('.cart-container') && this.cartContainer?.classList.contains('active')) {
                this.toggleCart();
            }
        });

        // Listen for add to cart events
        document.addEventListener('addToCart', (e) => this.addItem(e.detail));

        // Setup promo code button
        this.applyPromoButton?.addEventListener('click', () => this.applyPromoCode());
    }

    toggleCart() {
        this.cartContainer?.classList.toggle('active');
    }

    addItem(product) {
        const existingItem = this.items.find(item => 
            item.id === product.id && 
            item.color === product.color && 
            item.storage === product.storage
        );

        if (existingItem) {
            existingItem.quantity += product.quantity;
        } else {
            this.items.push(product);
        }

        this.updateLocalStorage();
        this.updateCartDisplay();
        this.showNotification('Product added to cart');
    }

    removeItem(index) {
        this.items.splice(index, 1);
        this.updateLocalStorage();
        this.updateCartDisplay();
    }

    updateQuantity(index, newQuantity) {
        if (newQuantity > 0 && newQuantity <= 10) {
            this.items[index].quantity = newQuantity;
            this.updateLocalStorage();
            this.updateCartDisplay();
        }
    }

    updateLocalStorage() {
        localStorage.setItem('cart', JSON.stringify(this.items));
    }

    calculateSubtotal() {
        return this.items.reduce((total, item) => total + (item.price * item.quantity), 0);
    }

    calculateShipping() {
        const subtotal = this.calculateSubtotal();
        return subtotal > 100 ? 0 : 15; // Free shipping over $100
    }

    calculateTotal() {
        return this.calculateSubtotal() + this.calculateShipping();
    }

    applyPromoCode() {
        const promoCode = this.promoCodeInput?.value.trim().toUpperCase();
        // Add your promo code logic here
        if (promoCode === 'WELCOME10') {
            this.showNotification('Promo code applied successfully!');
            this.updateCartDisplay();
        } else {
            this.showNotification('Invalid promo code', 'error');
        }
    }

    updateCartDisplay() {
        // Update cart count
        const totalItems = this.items.reduce((sum, item) => sum + item.quantity, 0);
        if (this.cartCount) this.cartCount.textContent = totalItems;

        // Update dropdown content if exists
        if (this.cartDropdown) {
            this.updateDropdownDisplay();
        }

        // Update cart page content if exists
        if (this.cartItemsContainer) {
            this.updateCartPageDisplay();
        }
    }

    updateDropdownDisplay() {
        const content = this.cartDropdown.querySelector('.cart-dropdown-content');
        
        if (this.items.length === 0) {
            content.innerHTML = '<div class="empty-cart">Your cart is empty</div>';
            return;
        }

        let html = '<div class="cart-items">';
        this.items.forEach((item, index) => {
            html += this.generateCartItemHTML(item, index, true);
        });
        html += '</div>';
        
        // Add cart footer
        html += `
            <div class="cart-footer">
                <div class="cart-total">
                    <span>Total:</span>
                    <span class="total-amount">$${this.calculateTotal().toFixed(2)}</span>
                </div>
                <div class="cart-actions">
                    <button class="view-cart-btn" onclick="window.location.href='cart.html'">View Cart</button>
                    <button class="checkout-btn" onclick="window.location.href='checkout.html'">Checkout</button>
                </div>
            </div>
        `;

        content.innerHTML = html;
    }

    updateCartPageDisplay() {
        if (this.items.length === 0) {
            this.cartItemsContainer.innerHTML = `
                <div class="empty-cart-message">
                    <i class="fas fa-shopping-cart"></i>
                    <h3>Your cart is empty</h3>
                    <p>Browse our products and find something you like</p>
                    <button onclick="window.location.href='product.html'" class="btn-continue-shopping">
                        Start Shopping
                    </button>
                </div>
            `;
            return;
        }

        let html = '';
        this.items.forEach((item, index) => {
            html += this.generateCartItemHTML(item, index, false);
        });

        this.cartItemsContainer.innerHTML = html;

        // Update summary
        const subtotal = this.calculateSubtotal();
        const shipping = this.calculateShipping();
        const total = this.calculateTotal();

        if (this.subtotalElement) this.subtotalElement.textContent = `$${subtotal.toFixed(2)}`;
        if (this.shippingElement) this.shippingElement.textContent = shipping === 0 ? 'Free' : `$${shipping.toFixed(2)}`;
        if (this.totalElement) this.totalElement.textContent = `$${total.toFixed(2)}`;
    }

    generateCartItemHTML(item, index, isDropdown) {
        return `
            <div class="cart-item ${isDropdown ? 'dropdown-item' : ''}">
                <img src="${item.image}" alt="${item.name}" class="cart-item-image">
                <div class="cart-item-details">
                    <h4 class="cart-item-name">${item.name}</h4>
                    <div class="cart-item-meta">
                        ${item.color ? `<span>Color: ${item.color}</span>` : ''}
                        ${item.storage ? `<span>Storage: ${item.storage}GB</span>` : ''}
                    </div>
                    <div class="cart-item-price">
                        <span class="price">$${(item.price * item.quantity).toFixed(2)}</span>
                        <div class="quantity-controls">
                            <button class="quantity-btn" onclick="cart.updateQuantity(${index}, ${item.quantity - 1})">-</button>
                            <span class="quantity">${item.quantity}</span>
                            <button class="quantity-btn" onclick="cart.updateQuantity(${index}, ${item.quantity + 1})">+</button>
                        </div>
                    </div>
                </div>
                <button class="remove-item" onclick="cart.removeItem(${index})">×</button>
            </div>
        `;
    }

    showNotification(message, type = 'success') {
        const notification = document.createElement('div');
        notification.className = `notification ${type}`;
        notification.textContent = message;
        document.body.appendChild(notification);

        // Trigger animation
        setTimeout(() => notification.classList.add('show'), 10);

        // Remove notification after animation
        setTimeout(() => {
            notification.classList.remove('show');
            setTimeout(() => notification.remove(), 300);
        }, 2000);
    }
}

// Initialize cart when DOM is loaded
let cart;
document.addEventListener('DOMContentLoaded', () => {
    cart = new Cart();
});