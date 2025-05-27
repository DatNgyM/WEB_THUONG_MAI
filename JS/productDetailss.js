// Hàm xử lý đường dẫn hình ảnh để đảm bảo hiển thị đúng
function processImagePath(path) {
    if (!path) return '/images/products/default-product.jpg';
    
    // Thêm "/" vào đầu đường dẫn nếu cần
    if (!path.startsWith('/') && !path.startsWith('http')) {
        path = '/' + path;
    }
    
    return path;
}

// Lấy dữ liệu sản phẩm từ cơ sở dữ liệu và hiển thị trên trang productdetailss.html
document.addEventListener('DOMContentLoaded', async function() {
    console.log("Trang product details đang được khởi tạo...");
    
    // Lấy ID sản phẩm từ tham số URL
    const params = new URLSearchParams(window.location.search);
    const productId = params.get('id');
    
    console.log("ID sản phẩm từ URL:", productId);
    
    if (!productId) {
        console.error('Không tìm thấy ID sản phẩm trong URL');
        showErrorMessage('Không tìm thấy thông tin sản phẩm. Vui lòng truy cập từ trang sản phẩm.');
        return;
    }
    
    console.log(`Đang tải thông tin sản phẩm với ID: ${productId}`);
    
    try {
        // Fetch thông tin sản phẩm từ API
        const apiUrl = `/api/products/${productId}`;
        console.log("Gọi API:", apiUrl);
        
        const response = await fetch(apiUrl);
        console.log("Trạng thái phản hồi:", response.status, response.statusText);
        
        if (!response.ok) {
            throw new Error(`Lỗi API: ${response.status} ${response.statusText}`);
        }
        
        const product = await response.json();
        console.log('Dữ liệu sản phẩm:', product);
        
        // Hiển thị thông tin sản phẩm lên trang
        displayProductDetails(product);
        
        // Thiết lập thumbnail và các tính năng khác
        setupProductThumbnails(product);
        setupQuantityButtons();
        
    } catch (error) {
        console.error('Lỗi khi tải thông tin sản phẩm:', error);
        showErrorMessage('Không thể tải thông tin sản phẩm');
    }
});

// Hiển thị thông tin sản phẩm
function displayProductDetails(product) {
    // Cập nhật tiêu đề trang
    document.title = `${product.name} - Five:05`;
    
    // Cập nhật breadcrumb
    document.getElementById('breadcrumb-category').textContent = product.category || 'Sản phẩm';
    document.getElementById('breadcrumb-product').textContent = product.name;
    
    // Cập nhật thông tin sản phẩm
    document.getElementById('product-name').textContent = product.name;
    document.getElementById('product-sku').textContent = `SKU: ${product.id || 'N/A'}`;
    document.getElementById('product-price').textContent = `$${parseFloat(product.price).toFixed(2)}`;
    
    // Cập nhật mô tả sản phẩm nếu có
    if (product.description) {
        document.getElementById('product-description').textContent = product.description;
    }
    
    // Cập nhật hình ảnh chính
    const mainImage = document.getElementById('mainImage');
    if (mainImage && product.image) {
        const imagePath = processImagePath(product.image);
        mainImage.src = imagePath;
        mainImage.alt = product.name;
        
        // Thiết lập xử lý lỗi hình ảnh
        mainImage.onerror = function() {
            console.warn(`Không thể tải hình ảnh chính: ${imagePath}`);
            this.src = '/images/products/default-product.jpg';
        };
    }
}

// Thiết lập thumbnails
function setupProductThumbnails(product) {
    const thumbnailsContainer = document.querySelector('.thumbnails');
    if (!thumbnailsContainer) return;
    
    // Xóa thumbnails hiện có
    thumbnailsContainer.innerHTML = '';
    
    // Thêm hình ảnh chính vào thumbnails
    if (product.image) {
        addThumbnail(thumbnailsContainer, product.image, 'Hình chính', true);
    }
    
    // Thêm các hình ảnh khác nếu có
    if (product.images && Array.isArray(product.images) && product.images.length > 0) {
        product.images.forEach((image, index) => {
            // Bỏ qua nếu trùng với hình ảnh chính
            if (image !== product.image) {
                addThumbnail(thumbnailsContainer, image, `Hình ${index + 1}`, false);
            }
        });
    }
}

// Thêm một thumbnail
function addThumbnail(container, imageSrc, altText, isActive) {
    const img = document.createElement('img');
    img.src = processImagePath(imageSrc);
    img.alt = altText;
    img.className = 'thumbnail' + (isActive ? ' active' : '');
    img.onclick = function(event) {
        changeImage(event, img.src);
    };
    
    // Xử lý lỗi hình ảnh
    img.onerror = function() {
        console.warn(`Không thể tải thumbnail: ${img.src}`);
        this.src = '/images/products/default-product.jpg';
    };
    
    container.appendChild(img);
}

// Xử lý đường dẫn hình ảnh
function processImagePath(path) {
    if (!path) return '/images/products/default-product.jpg';
    
    // Thêm dấu "/" vào đầu đường dẫn nếu cần
    if (!path.startsWith('/') && !path.startsWith('http')) {
        path = '/' + path;
    }
    
    return path;
}

// Thay đổi hình ảnh chính
function changeImage(event, src) {
    const mainImage = document.getElementById('mainImage');
    const thumbnails = document.querySelectorAll('.thumbnail');
    
    if (mainImage) {
        // Xử lý đường dẫn
        const processedSrc = processImagePath(src);
        
        // Thiết lập xử lý lỗi
        mainImage.onerror = function() {
            console.error(`Không thể tải hình ảnh: ${processedSrc}`);
            this.src = '/images/products/default-product.jpg';
        };
        
        mainImage.src = processedSrc;
    }
    
    // Cập nhật trạng thái active cho thumbnails
    thumbnails.forEach(thumb => thumb.classList.remove('active'));
    if (event && event.target) {
        event.target.classList.add('active');
    }
}

// Thiết lập nút tăng giảm số lượng
function setupQuantityButtons() {
    const quantityInput = document.querySelector('.quantity-input input');
    const minusBtn = document.querySelector('.quantity-btn.minus');
    const plusBtn = document.querySelector('.quantity-btn.plus');
    
    if (!quantityInput || !minusBtn || !plusBtn) return;
    
    minusBtn.addEventListener('click', () => {
        const currentValue = parseInt(quantityInput.value);
        if (currentValue > 1) {
            quantityInput.value = currentValue - 1;
        }
    });
    
    plusBtn.addEventListener('click', () => {
        const currentValue = parseInt(quantityInput.value);
        if (currentValue < 10) {
            quantityInput.value = currentValue + 1;
        }
    });
}

// Hiển thị thông báo lỗi
function showErrorMessage(message) {
    const container = document.querySelector('.product-details-container');
    if (container) {
        container.innerHTML = `
            <div class="alert alert-danger" role="alert">
                <i class="fas fa-exclamation-circle"></i> ${message}
                <p>Vui lòng thử lại sau hoặc <a href="/Page/product.html">quay lại trang sản phẩm</a>.</p>
            </div>
        `;
    }
}