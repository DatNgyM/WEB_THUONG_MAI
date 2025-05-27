class ProductDetails {
    constructor() {
        this.init();
    }

    init() {
        this.addToCartBtn = document.querySelector('.btn-add-to-cart');
        this.buyNowBtn = document.querySelector('.btn-buy-now');
        this.colorOptions = document.querySelectorAll('input[name="color"]');
        this.storageOptions = document.querySelectorAll('input[name="storage"]');
        this.quantityInput = document.querySelector('.quantity-input input');

        this.setupEventListeners();
    }

    setupEventListeners() {
        this.addToCartBtn?.addEventListener('click', () => this.handleAddToCart());
        this.buyNowBtn?.addEventListener('click', () => this.handleBuyNow());

        // Update price when storage option changes
        this.storageOptions.forEach(option => {
            option.addEventListener('change', () => this.updatePrice());
        });
    }

    getSelectedOptions() {
        const color = document.querySelector('input[name="color"]:checked')?.value || '';
        const storage = document.querySelector('input[name="storage"]:checked')?.value || '';
        const quantity = parseInt(this.quantityInput.value) || 1;

        return { color, storage, quantity };
    }

    getCurrentProductInfo() {
        return {
            id: 1, // This would normally come from the server/database
            name: document.querySelector('.product-title').textContent,
            price: parseFloat(document.querySelector('.current-price').textContent.replace('$', '')),
            image: document.querySelector('#mainImage').src,
            ...this.getSelectedOptions()
        };
    }

    updatePrice() {
        const selectedStorage = document.querySelector('input[name="storage"]:checked');
        if (selectedStorage) {
            const priceElement = selectedStorage.closest('.storage-option').querySelector('.storage-price');
            const price = priceElement.textContent;
            document.querySelector('.current-price').textContent = price;
        }
    }

    handleAddToCart() {
        const productInfo = this.getCurrentProductInfo();
        
        // Create and dispatch custom event for cart to handle
        const event = new CustomEvent('addToCart', {
            detail: productInfo
        });
        document.dispatchEvent(event);
    }

    handleBuyNow() {
        this.handleAddToCart();
        // Redirect to checkout page
        window.location.href = '/Page/checkout.html';
    }
}

// Initialize product details when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new ProductDetails();
});