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
                window.location.href = `/Page/productdetailss.html?id=${productId}`;
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
            // Thay đổi endpoint API để lấy tất cả sản phẩm
            const response = await fetch('/api/products'); // Sử dụng /api/products
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const products = await response.json();
            this.renderProducts(products);
        } catch (error) {
            console.error('Error loading products:', error); // Sửa lại thông báo lỗi
            // Show featured products from local data as fallback
            this.renderProducts(this.getFallbackProducts());
        }
    }

    renderProducts(products) {
        const productsContainer = document.getElementById('products-container'); // Sử dụng getElementById nếu ID là duy nhất
        if (!productsContainer) {
            console.error("Products container not found!");
            return;
        }

        if (!Array.isArray(products)) {
            console.error("Products data is not an array:", products);
            productsContainer.innerHTML = '<p>Không có sản phẩm nào để hiển thị.</p>';
            return;
        }

        if (products.length === 0) {
            productsContainer.innerHTML = '<p>Không có sản phẩm nào để hiển thị.</p>';
            return;
        }

        const html = products.map(product => {
            // Đảm bảo sử dụng đúng tên thuộc tính từ API
            // Ví dụ: product.image_url nếu API trả về image_url
            // Ví dụ: product.price nếu API trả về price
            const imageUrl = product.image_url || product.image || '/images/placeholder.jpg'; // Thêm ảnh placeholder nếu không có ảnh
            const productName = product.name || 'Tên sản phẩm không xác định';
            const productPrice = product.price !== undefined ? product.price.toFixed(2) : 'N/A';
            const productId = product.id || 'N/A';

            return `
            <div class="product" data-product-id="${productId}">
                <img src="${imageUrl}" alt="${productName}">
                <div class="product-info">
                    <h3 class="product-name">${productName}</h3>
                    <div class="product-price">$${productPrice}</div>
                    <button class="add-to-cart">Add to Cart</button>
                </div>
            </div>
        `;
        }).join('');

        productsContainer.innerHTML = html;
        this.setupEventListeners(); // Gọi lại để gán sự kiện cho sản phẩm mới
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
