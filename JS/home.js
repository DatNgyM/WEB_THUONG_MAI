class HomePage {
    constructor() {
        this.init();
    }

    init() {
        this.setupEventListeners();
        this.loadFeaturedProducts();
    }

    setupEventListeners() {
        // Handle product card click events
        document.querySelectorAll('.product').forEach(product => {
            product.addEventListener('click', (e) => {
                // Prevent click if clicked on add to cart button
                if (e.target.closest('.add-to-cart')) return;
                
                const productId = product.dataset.productId;
                window.location.href = `/Page/productdetails.html?id=${productId}`;
            });
        });

        // Handle add to cart button clicks
        document.querySelectorAll('.add-to-cart').forEach(button => {
            button.addEventListener('click', (e) => {
                e.preventDefault();
                const product = e.target.closest('.product');
                const productInfo = {
                    id: product.dataset.productId,
                    name: product.querySelector('.product-name').textContent,
                    price: parseFloat(product.querySelector('.product-price').textContent.replace('$', '')),
                    image: product.querySelector('img').src,
                    quantity: 1
                };

                // Dispatch add to cart event
                const event = new CustomEvent('addToCart', {
                    detail: productInfo
                });
                document.dispatchEvent(event);
            });
        });

        // Handle search functionality
        const searchInput = document.querySelector('.search-container input');
        if (searchInput) {
            searchInput.addEventListener('input', this.handleSearch.bind(this));
        }
    }

    async loadFeaturedProducts() {
        try {
            const response = await fetch('/server/featured-products');
            const products = await response.json();
            this.renderProducts(products);
        } catch (error) {
            console.error('Error loading featured products:', error);
            // Show featured products from local data as fallback
            this.renderProducts(this.getFallbackProducts());
        }
    }

    renderProducts(products) {
        const productsContainer = document.querySelector('.products');
        if (!productsContainer) return;

        const html = products.map(product => `
            <div class="product" data-product-id="${product.id}">
                <img src="${product.image}" alt="${product.name}">
                <div class="product-info">
                    <h3 class="product-name">${product.name}</h3>
                    <div class="product-price">$${product.price.toFixed(2)}</div>
                    <button class="add-to-cart">Add to Cart</button>
                </div>
            </div>
        `).join('');

        productsContainer.innerHTML = html;
        this.setupEventListeners();
    }

    handleSearch(e) {
        const searchTerm = e.target.value.toLowerCase();
        const products = document.querySelectorAll('.product');

        products.forEach(product => {
            const name = product.querySelector('.product-name').textContent.toLowerCase();
            const shouldShow = name.includes(searchTerm);
            product.style.display = shouldShow ? 'block' : 'none';
        });
    }

    getFallbackProducts() {
        return [
            {
                id: 1,
                name: "iPhone 16 Pro Max",
                price: 1299.99,
                image: "/images/iphone-16-pro-max-titan.jpg"
            },
            {
                id: 2,
                name: "Apple Watch Ultra 2",
                price: 799.99,
                image: "/images/apple-watch-ultra-2-lte-49mm-vien-titanium-day-milan-638641727211652156-750x500.jpg"
            },
            {
                id: 3,
                name: "MacBook Pro 14-inch M4",
                price: 1999.99,
                image: "/images/macbook-pro-14-inch-m4-16gb-512gb-tgdd-den-1-638660152965882579-750x500.jpg"
            },
            {
                id: 4,
                name: "MSI Stealth 14 AI Studio",
                price: 1799.99,
                image: "/images/msi-stealth-14-ai-studio-a1vfg-ultra-7-085vn.jpg"
            },
            {
                id: 5,
                name: "Ferrari Watch",
                price: 299.99,
                image: "/images/ferrari-0830772-nam1-700x467.jpg"
            }
        ];
    }
}

// Initialize home page when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new HomePage();
});
