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
        const apiUrl = new URL('http://localhost:3000/api/products');
        
        // Thêm các tham số filter nếu có
        if (filters.categories.length > 0) {
            apiUrl.searchParams.append('category', filters.categories.join(','));
        }
        
        if (filters.priceRange.min > 0) {
            apiUrl.searchParams.append('min_price', filters.priceRange.min);
        }
        
        if (filters.priceRange.max < 2000) {
            apiUrl.searchParams.append('max_price', filters.priceRange.max);
        }
        
        if (filters.search.trim() !== '') {
            apiUrl.searchParams.append('search', filters.search);
        }
        
        console.log('Fetching products from API:', apiUrl.toString());
        const response = await fetch(apiUrl.toString());
        
        if (!response.ok) {
            throw new Error(`API error: ${response.status}`);
        }
        
        const data = await response.json();
        
        // Nếu API không trả về dữ liệu, sử dụng mẫu
        if (!data || data.length === 0) {
            console.warn('No products returned from API, using sample data');
            return getSampleProducts();
        }
        
        // Map data từ API sang định dạng cần thiết
        return data.map(item => ({
            id: item.id,
            name: item.name,
            price: parseFloat(item.price),
            image: item.image || '/images/products/default-product.jpg',
            category: item.category || 'Other',
            brand: item.brand || 'Unknown',
            rating: item.rating || 4,
            description: item.description || 'No description available',
            seller: item.seller_name || 'Unknown Seller'
        }));
    } catch (error) {
        console.error('Error fetching products:', error);
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
    productsGrid.innerHTML = filteredProducts.map(renderProduct).join('');
    
    // Cập nhật số lượng sản phẩm hiển thị
    const showingResults = document.querySelector('.showing-results span');
    if (showingResults) {
        showingResults.textContent = filteredProducts.length;
    }
}

// Event Listeners
document.addEventListener('DOMContentLoaded', function() {
    // Khởi tạo hiển thị sản phẩm
    updateProductDisplay();
    
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