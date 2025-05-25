// Danh sách sản phẩm - mặc định sẽ được tải từ API
let products = [];

// Lưu trữ trạng thái bộ lọc
let filters = {
    categories: [],
    brands: [],
    priceRange: {
        min: 0,
        max: 2000
    },
    rating: null,
    search: ""
};

// Hàm để tải sản phẩm từ API
async function fetchProducts() {
    try {
        // Sử dụng URL tương đối để tránh vấn đề về domain
        const apiUrl = '/api/products';
        
        console.log('Đang tải sản phẩm từ API:', apiUrl);
        const response = await fetch(apiUrl);
        
        if (!response.ok) {
            console.error('Lỗi API:', response.status, response.statusText);
            throw new Error(`Lỗi API: ${response.status} ${response.statusText}`);
        }
        
        const data = await response.json();
        console.log('Dữ liệu sản phẩm từ API:', data);
        
        // Nếu API không trả về dữ liệu hoặc trả về mảng rỗng
        if (!data || !Array.isArray(data) || data.length === 0) {
            console.warn('API không trả về sản phẩm nào, sử dụng dữ liệu mẫu');
            return getSampleProducts();
        }
        
        // Map data từ API sang định dạng cần thiết
        return data.map(item => {
            // Log thông tin sản phẩm để debug
            console.log('Xử lý sản phẩm:', item);
            return {
                id: item.id,
                name: item.name || 'Sản phẩm không tên',
                price: parseFloat(item.price || 0),
                // Kiểm tra đường dẫn hình ảnh và sử dụng fallback nếu cần
                image: item.image_url || item.image || '/images/products/default-product.jpg',
                category: item.category || 'Other',
                brand: item.brand || 'Unknown',
                rating: parseFloat(item.rating) || 4,
                description: item.description || 'Không có mô tả',
                seller: item.seller_name || 'Unknown Seller'
            };
        });
    } catch (error) {
        console.error('Lỗi khi tải sản phẩm:', error);
        // Hiển thị thông báo lỗi cho người dùng (tùy chọn)
        const productsGrid = document.getElementById('productsGrid');
        if (productsGrid) {
            productsGrid.innerHTML = `<div class="alert alert-danger col-12">Không thể tải sản phẩm. Lỗi: ${error.message}</div>`;
        }
        // Trả về dữ liệu mẫu nếu có lỗi
        return getSampleProducts();
    }
}

// Dữ liệu mẫu để sử dụng khi API không hoạt động
function getSampleProducts() {
    return [
        {
            id: 1,
            name: "iPhone 16 Pro Max Titan",
            price: 1211.87,
            image: "/images/iphone-16-pro-max-titan.jpg",
            category: "Phones & Tablets",
            brand: "Apple",
            rating: 5,
            description: "Latest iPhone model with titanium frame"
        },
        {
            id: 2,
            name: "Laptop MSI Gaming Stealth 14 AI Studio",
            price: 1969.54,
            image: "/images/msi-stealth-14-ai-studio-a1vfg-ultra-7-085vn.jpg",
            category: "Laptops",
            brand: "MSI",
            rating: 4,
            description: "High-performance gaming laptop"
        },
        {
            id: 3,
            name: "Macbook Pro M4 14 inch",
            price: 1542.14,
            image: "/images/macbook-pro-14-inch-m4-16gb-512gb-tgdd-den-1-638660152965882579-750x500.jpg",
            category: "Laptops",
            brand: "Apple",
            rating: 5,
            description: "Powerful MacBook with M4 chip"
        },
        {
            id: 4,
            name: "Apple Watch Ultra 2 GPS",
            price: 990.40,
            image: "/images/apple-watch-ultra-2-lte-49mm-vien-titanium-day-milan-638641727211652156-750x500.jpg",
            category: "Smartwatches",
            brand: "Apple",
            rating: 5,
            description: "Premium smartwatch with advanced features"
        }
    ];
}

// Render một sản phẩm
function renderProduct(product) {
    return `
        <div class="col-md-4 col-sm-6 product-card" data-category="${product.category}" data-brand="${product.brand}" data-price="${product.price}">
            <div class="product">
                <div class="product-image">
                    <img src="${product.image}" alt="${product.name}" />
                    <div class="product-overlay">
                        <a href="/Page/productdetails.html?id=${product.id}" class="btn btn-primary">View Details</a>
                        <button class="btn btn-outline-primary add-to-cart" data-product-id="${product.id}">
                            <i class="fas fa-shopping-cart"></i> Add to Cart
                        </button>
                    </div>
                </div>
                <div class="product-info">
                    <h3 class="product-name">${product.name}</h3>
                    <div class="product-rating">
                        ${renderStars(product.rating)}
                    </div>
                    <p class="product-price">$${product.price.toFixed(2)}</p>
                </div>
            </div>
        </div>
    `;
}

// Render stars cho rating
function renderStars(rating) {
    let stars = '';
    for (let i = 1; i <= 5; i++) {
        stars += `<i class="fas fa-star${i <= rating ? '' : ' far'}"></i>`;
    }
    return stars;
}

// Lọc sản phẩm
function filterProducts() {
    return products.filter(product => {
        // Lọc theo danh mục
        if (filters.categories.length && !filters.categories.includes(product.category)) return false;
        
        // Lọc theo thương hiệu
        if (filters.brands.length && !filters.brands.includes(product.brand)) return false;
        
        // Lọc theo giá
        if (product.price < filters.priceRange.min || product.price > filters.priceRange.max) return false;
        
        // Lọc theo rating
        if (filters.rating && product.rating < filters.rating) return false;
        
        // Lọc theo search
        if (filters.search && !product.name.toLowerCase().includes(filters.search.toLowerCase())) return false;
        
        return true;
    });
}

// Cập nhật hiển thị sản phẩm
function updateProductDisplay() {
    const filteredProducts = filterProducts();
    const productsGrid = document.getElementById('productsGrid');
    const loadingIndicator = document.getElementById('loading-indicator');
    const errorMessage = document.getElementById('error-message');
    const noProductsMessage = document.getElementById('no-products-message');
    
    // Ẩn tất cả các thông báo
    if (loadingIndicator) loadingIndicator.style.display = 'none';
    if (errorMessage) errorMessage.style.display = 'none';
    if (noProductsMessage) noProductsMessage.style.display = 'none';
    
    // Nếu không có sản phẩm (sau khi lọc), hiển thị thông báo
    if (filteredProducts.length === 0) {
        if (noProductsMessage) noProductsMessage.style.display = 'block';
        if (productsGrid) productsGrid.innerHTML = '';
    } else {
        // Hiển thị sản phẩm
        if (productsGrid) {
            productsGrid.innerHTML = filteredProducts.map(renderProduct).join('');
            
            // Thêm sự kiện cho nút "Add to Cart"
            productsGrid.querySelectorAll('.add-to-cart').forEach(button => {
                button.addEventListener('click', function(e) {
                    e.preventDefault();
                    const productId = this.dataset.productId;
                    const product = products.find(p => p.id == productId);
                    if (product) {
                        addToCart(product);
                    }
                });
            });
        }
    }
    
    // Cập nhật số lượng sản phẩm hiển thị
    const showingResults = document.querySelector('.showing-results span');
    if (showingResults) {
        showingResults.textContent = filteredProducts.length;
    }
}

// Hàm thêm vào giỏ hàng
function addToCart(product) {
    console.log('Thêm vào giỏ hàng:', product);
    
    // Lấy giỏ hàng hiện tại từ localStorage
    let cart = JSON.parse(localStorage.getItem('cart')) || [];
    
    // Kiểm tra xem sản phẩm đã có trong giỏ hàng chưa
    const existingProductIndex = cart.findIndex(item => item.id === product.id);
    
    if (existingProductIndex !== -1) {
        // Nếu sản phẩm đã có trong giỏ hàng, tăng số lượng
        cart[existingProductIndex].quantity += 1;
    } else {
        // Nếu sản phẩm chưa có trong giỏ hàng, thêm mới
        cart.push({
            id: product.id,
            name: product.name,
            price: product.price,
            image: product.image,
            quantity: 1
        });
    }
    
    // Lưu giỏ hàng vào localStorage
    localStorage.setItem('cart', JSON.stringify(cart));
    
    // Cập nhật hiển thị số lượng sản phẩm trong giỏ hàng
    updateCartCount();
    
    // Hiển thị thông báo thành công
    alert(`Đã thêm "${product.name}" vào giỏ hàng!`);
}

// Cập nhật số lượng sản phẩm trong giỏ hàng
function updateCartCount() {
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    const totalItems = cart.reduce((total, item) => total + item.quantity, 0);
    
    const cartCountElements = document.querySelectorAll('.cart-count');
    cartCountElements.forEach(element => {
        element.textContent = totalItems;
    });
}

// Event Listeners
document.addEventListener('DOMContentLoaded', async function() {
    // Hiển thị loading khi trang tải
    const loadingIndicator = document.getElementById('loading-indicator');
    const errorMessage = document.getElementById('error-message');
    if (loadingIndicator) loadingIndicator.style.display = 'block';
    if (errorMessage) errorMessage.style.display = 'none';
    
    try {
        // Khởi tạo hiển thị giỏ hàng
        updateCartCount();
        
        // Tải sản phẩm từ API
        products = await fetchProducts();
        
        // Cập nhật hiển thị sản phẩm
        updateProductDisplay();
    } catch (error) {
        console.error('Lỗi khi khởi tạo trang:', error);
        if (loadingIndicator) loadingIndicator.style.display = 'none';
        if (errorMessage) {
            errorMessage.style.display = 'block';
            errorMessage.textContent = `Không thể tải sản phẩm. Lỗi: ${error.message}`;
        }
    }
    
    // Xử lý sự kiện cho các checkbox category
    document.querySelectorAll('.filter-section input[type="checkbox"]').forEach(checkbox => {
        checkbox.addEventListener('change', function() {
            const section = this.closest('.filter-section');
            const sectionTitle = section.querySelector('h6').textContent;
            
            if (sectionTitle === 'Categories') {
                filters.categories = Array.from(section.querySelectorAll('input:checked'))
                    .map(cb => cb.nextElementSibling.textContent.trim());
            } else if (sectionTitle === 'Brand') {
                filters.brands = Array.from(section.querySelectorAll('input:checked'))
                    .map(cb => cb.nextElementSibling.textContent.trim());
            } else if (sectionTitle === 'Rating') {
                // Xử lý filter theo rating nếu cần
                const checkedRating = section.querySelector('input:checked');
                filters.rating = checkedRating ? parseInt(checkedRating.value) : null;
            }
            
            updateProductDisplay();
        });
    });
    
    // Xử lý sự kiện cho các checkbox category
    document.querySelectorAll('.filter-section input[type="checkbox"]').forEach(checkbox => {
        checkbox.addEventListener('change', function() {
            const section = this.closest('.filter-section');
            if (section.querySelector('h6').textContent === 'Categories') {
                filters.categories = Array.from(section.querySelectorAll('input:checked')).map(cb => cb.nextElementSibling.textContent.trim());
            } else if (section.querySelector('h6').textContent === 'Brand') {
                filters.brands = Array.from(section.querySelectorAll('input:checked')).map(cb => cb.nextElementSibling.textContent.trim());
            }
            updateProductDisplay();
        });
    });
    
    // Xử lý price range
    const priceInputs = document.querySelectorAll('.range-inputs input');
    priceInputs.forEach(input => {
        input.addEventListener('change', function() {
            filters.priceRange.min = parseInt(priceInputs[0].value);
            filters.priceRange.max = parseInt(priceInputs[1].value);
            updateProductDisplay();
        });
    });
    
    // Xử lý rating filter
    document.querySelectorAll('.stars input').forEach(input => {
        input.addEventListener('change', function() {
            filters.rating = parseInt(this.value);
            updateProductDisplay();
        });
    });
    
    // Xử lý search
    const searchInput = document.getElementById('searchInput');
    searchInput.addEventListener('input', function() {
        filters.search = this.value;
        updateProductDisplay();
    });
    
    // Clear all filters
    document.querySelector('.clear-filters').addEventListener('click', function() {
        filters = {
            categories: [],
            brands: [],
            priceRange: {
                min: 0,
                max: 2000
            },
            rating: null,
            search: ""
        };
        
        // Reset các checkbox
        document.querySelectorAll('.filter-section input[type="checkbox"]').forEach(cb => cb.checked = false);
        
        // Reset price range
        document.querySelectorAll('.range-inputs input').forEach((input, index) => {
            input.value = index === 0 ? 0 : 2000;
        });
        
        // Reset search
        document.getElementById('searchInput').value = '';
        
        updateProductDisplay();
    });
    
    // Xử lý sort
    document.querySelector('.sort-options select').addEventListener('change', function() {
        const sortBy = this.value;
        let sortedProducts = [...products];
        
        switch(sortBy) {
            case 'Price: Low to High':
                sortedProducts.sort((a, b) => a.price - b.price);
                break;
            case 'Price: High to Low':
                sortedProducts.sort((a, b) => b.price - a.price);
                break;
            case 'Newest First':
                // Giả sử id cao hơn là sản phẩm mới hơn
                sortedProducts.sort((a, b) => b.id - a.id);
                break;
            // Có thể thêm các option sắp xếp khác
        }
        
        products.length = 0;
        products.push(...sortedProducts);
        updateProductDisplay();
    });
});