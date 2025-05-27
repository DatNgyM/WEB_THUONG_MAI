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
    // Lấy ID sản phẩm từ URL
    const urlParams = new URLSearchParams(window.location.search);
    const productId = urlParams.get('id');
    
    if (!productId) {
        showError('Không tìm thấy ID sản phẩm trong URL.');
        return;
    }
    
    try {
        // Hiển thị trạng thái đang tải
        showLoading();
        
        // Gọi API để lấy thông tin sản phẩm theo ID
        const response = await fetch(`/api/products/${productId}`);
        
        if (!response.ok) {
            throw new Error(`Lỗi API: ${response.status} ${response.statusText}`);
        }
        
        const product = await response.json();
        
        // Hiển thị thông tin sản phẩm lên trang
        displayProductDetails(product);
        
        // Xử lý sự kiện cho nút số lượng
        setupQuantityButtons();
        
        // Cập nhật số lượng sản phẩm trong giỏ hàng hiển thị trên header
        updateCartCount();
    } catch (error) {
        console.error('Lỗi khi tải thông tin sản phẩm:', error);
        showError(`Không thể tải thông tin sản phẩm. Lỗi: ${error.message}`);
    }
});

// Hiển thị trạng thái đang tải
function showLoading() {
    const productInfoElement = document.querySelector('.product-info');
    
    if (productInfoElement) {
        productInfoElement.innerHTML = `
            <div class="text-center p-5">
                <div class="spinner-border" role="status">
                    <span class="visually-hidden">Đang tải...</span>
                </div>
                <p class="mt-3">Đang tải thông tin sản phẩm...</p>
            </div>
        `;
    }
}

// Hiển thị thông báo lỗi
function showError(message) {
    const productInfoElement = document.querySelector('.product-info');
    
    if (productInfoElement) {
        productInfoElement.innerHTML = `
            <div class="alert alert-danger" role="alert">
                <i class="fas fa-exclamation-circle me-2"></i>
                ${message}
            </div>
        `;
    }
    
    // Cập nhật tiêu đề trang
    document.title = 'Lỗi - Five:05';
    
    // Ẩn các nút mua hàng khi có lỗi
    const addToCartBtn = document.getElementById('addToCartBtn');
    const buyNowBtn = document.querySelector('.btn-buy-now');
    
    if (addToCartBtn) {
        addToCartBtn.style.display = 'none';
    }
    
    if (buyNowBtn) {
        buyNowBtn.style.display = 'none';
    }
}

// Thiết lập hình ảnh thumbnail cho sản phẩm
function setupProductThumbnails(product) {
    const thumbnailsContainer = document.querySelector('.thumbnails');
    if (!thumbnailsContainer) return;
    
    console.log('Thiết lập thumbnails cho sản phẩm:', product.name);
    
    // Xóa tất cả thumbnails hiện tại
    thumbnailsContainer.innerHTML = '';
    
    // Thêm thumbnail cho hình ảnh chính
    const mainImageSrc = product.image || '/images/products/default-product.jpg';
    console.log('Main image src:', mainImageSrc);
    addThumbnail(thumbnailsContainer, mainImageSrc, true);
    
    // Sử dụng images array nếu có
    if (product.images && Array.isArray(product.images) && product.images.length > 0) {
        console.log(`Sản phẩm có ${product.images.length} hình ảnh phụ`);
        product.images.forEach((img, index) => {
            // Chỉ thêm các hình ảnh khác với hình chính
            if (img !== mainImageSrc) {
                let imgPath = img;
                if (!imgPath.startsWith('/') && !imgPath.startsWith('http')) {
                    imgPath = '/' + imgPath;
                }
                console.log(`Thêm thumbnail phụ: ${imgPath}`);
                addThumbnail(thumbnailsContainer, imgPath, false);
            }
        });
    } else {
        // Fallback: Thêm các thumbnails phụ (giả lập từ các hình ảnh có sẵn trong /images)
        console.log('Không có images array, sử dụng các hình ảnh mẫu');
        const productType = detectProductType(product.name);
        let additionalImages = [];
    
        if (productType === 'iphone') {
            additionalImages = [
                '/images/iphone-16-pro-max-titan.jpg',
                '/images/iphone-16-pro-max-titan-sa-mac-2.jpg',
                '/images/iphone-16-pro-max-titan-sa-mac-3.jpg',
                '/images/iphone-16-pro-max-titan-sa-mac-4.jpg'
            ];
        } else if (productType === 'watch') {
            additionalImages = [
                '/images/apple-watch-ultra-2-lte-49mm-vien-titanium-day-milan-638641727211652156-750x500.jpg'
            ];
        } else if (productType === 'macbook') {
            additionalImages = [
                '/images/macbook-pro-14-inch-m4-16gb-512gb-tgdd-den-1-638660152965882579-750x500.jpg'
            ];
        } else if (productType === 'laptop') {
            additionalImages = [
                '/images/msi-stealth-14-ai-studio-a1vfg-ultra-7-085vn.jpg'
            ];
        }
        
        // Filter out main image to avoid duplicates
        additionalImages = additionalImages.filter(img => img !== mainImageSrc);
        
        additionalImages.forEach(src => {
            console.log(`Thêm thumbnail mẫu: ${src}`);
            addThumbnail(thumbnailsContainer, src, false);
        });
    }
}

// Thêm một thumbnail vào container
function addThumbnail(container, src, isActive) {
    const thumbnail = document.createElement('div');
    thumbnail.className = `thumbnail ${isActive ? 'active' : ''}`;
    
    const img = document.createElement('img');
    img.alt = 'Product thumbnail';
    
    // Log để debug
    console.log(`Thêm thumbnail với src: ${src}`);
    
    // Kiểm tra tính hợp lệ của đường dẫn
    if (!src || typeof src !== 'string') {
        console.error('Source không hợp lệ:', src);
        src = '/images/products/default-product.jpg';
    }
    
    // Đảm bảo đường dẫn bắt đầu bằng "/"
    if (!src.startsWith('/') && !src.startsWith('http')) {
        src = '/' + src;
        console.log(`Đã điều chỉnh đường dẫn thumbnail: ${src}`);
    }
    
    // Thêm handler xử lý lỗi
    img.onerror = function() {
        console.error(`Lỗi tải thumbnail: ${src}, thay thế bằng ảnh mặc định`);
        this.src = '/images/products/default-product.jpg';
    };
    
    img.src = src;
    
    // Thêm sự kiện click để thay đổi hình ảnh chính
    img.addEventListener('click', (event) => {
        changeImage(event, src);
    });
    
    thumbnail.appendChild(img);
    container.appendChild(thumbnail);
}

// Phân loại sản phẩm dựa trên tên
function detectProductType(productName) {
    const name = productName.toLowerCase();
    
    if (name.includes('iphone')) return 'iphone';
    if (name.includes('watch')) return 'watch';
    if (name.includes('macbook')) return 'macbook';
    if (name.includes('msi') || name.includes('laptop') || name.includes('notebook')) return 'laptop';
    
    return 'other';
}

// Hiển thị thông tin sản phẩm chi tiết
function displayProductDetails(product) {
    console.log('Hiển thị thông tin sản phẩm:', product);
    
    // Validate product data
    if (!product || typeof product !== 'object') {
        console.error('Dữ liệu sản phẩm không hợp lệ:', product);
        showError('Dữ liệu sản phẩm không hợp lệ hoặc bị thiếu.');
        return;
    }
    
    // Đảm bảo có các trường cần thiết
    product.name = product.name || 'Sản phẩm không rõ tên';
    product.price = product.price || 0;
    product.category = product.category || 'Danh mục chung';
    product.description = product.description || 'Không có mô tả cho sản phẩm này.';
    
    // Cập nhật tiêu đề trang
    document.title = `${product.name} - Five:07`;
    
    // Cập nhật breadcrumb
    const breadcrumbCategory = document.getElementById('breadcrumb-category');
    if (breadcrumbCategory) {
        breadcrumbCategory.textContent = product.category;
    }
    
    const breadcrumbProduct = document.getElementById('breadcrumb-product');
    if (breadcrumbProduct) {
        breadcrumbProduct.textContent = product.name;
    }
    
    // Cập nhật hình ảnh sản phẩm
    const mainImage = document.getElementById('mainImage');
    if (mainImage) {
        // Kiểm tra và xử lý path của hình ảnh
        let imagePath = product.image || '/images/products/default-product.jpg';
        
        // Thêm debug log
        console.log(`Đang thiết lập hình ảnh chính: ${imagePath}`);
        
        // Thêm prefix "/" nếu cần
        if (imagePath && !imagePath.startsWith('/') && !imagePath.startsWith('http')) {
            imagePath = '/' + imagePath;
            console.log(`Đã điều chỉnh đường dẫn hình ảnh: ${imagePath}`);
        }
        
        // Kiểm tra xem file có tồn tại không (dùng Image object)
        const imgTest = new Image();
        imgTest.onload = function() {
            console.log(`Hình ảnh ${imagePath} đã tải thành công`);
            mainImage.src = imagePath;
        };
        
        imgTest.onerror = function() {
            console.error(`Lỗi tải hình ảnh ${imagePath}, thay thế bằng ảnh mặc định`);
            mainImage.src = '/images/products/default-product.jpg';
        };
        
        // Bắt đầu tải hình ảnh để kiểm tra
        imgTest.src = imagePath;
        
        // Set alt text
        mainImage.alt = product.name;
        
        // Thêm handler cho lỗi hình ảnh trong trường hợp source thay đổi sau này
        mainImage.onerror = function() {
            console.error(`Lỗi tải hình ảnh ${mainImage.src}, thay thế bằng ảnh mặc định`);
            mainImage.src = '/images/products/default-product.jpg';
        };
    }
    
    // Thiết lập hình ảnh thumbnail
    setupProductThumbnails(product);
    
    // Cập nhật thông tin sản phẩm
    const productNameElements = document.querySelectorAll('#product-name');
    productNameElements.forEach(element => {
        element.textContent = product.name;
    });
    
    const productPriceElement = document.getElementById('product-price');
    if (productPriceElement) {
        productPriceElement.textContent = `$${parseFloat(product.price).toFixed(2)}`;
    }
    
    const productDescriptionElement = document.getElementById('product-description');
    if (productDescriptionElement) {
        // Nếu không có mô tả hoặc mô tả quá ngắn, tạo mô tả phong phú dựa trên tên sản phẩm
        if (!product.description || product.description.length < 50) {
            productDescriptionElement.textContent = generateRichDescription(product);
        } else {
            productDescriptionElement.textContent = product.description;
        }
    }
      // Cập nhật tab mô tả sản phẩm nếu cần
    updateProductTabs(product);
    
    // Đảm bảo hiển thị và xử lý nút Add to Cart
    const addToCartBtn = document.getElementById('addToCartBtn');
    if (addToCartBtn) {
        addToCartBtn.style.display = 'flex'; // Hiển thị nút
        addToCartBtn.onclick = function() {
            const quantityInput = document.getElementById('quantity');
            const quantity = quantityInput ? parseInt(quantityInput.value) : 1;
            addToCart(product, quantity);
        };
    }
    
    // Đảm bảo hiển thị và xử lý nút Buy Now
    const buyNowBtn = document.querySelector('.btn-buy-now');
    if (buyNowBtn) {
        buyNowBtn.style.display = 'flex'; // Hiển thị nút
        buyNowBtn.onclick = function() {
            const quantityInput = document.getElementById('quantity');
            const quantity = quantityInput ? parseInt(quantityInput.value) : 1;
            addToCart(product, quantity);
            window.location.href = '/Page/checkout.html'; // Chuyển đến trang thanh toán
        };
    }
}

// Tạo mô tả phong phú dựa trên thông tin sản phẩm
function generateRichDescription(product) {
    const productType = detectProductType(product.name);
    let description = '';
    
    switch (productType) {
        case 'iphone':
            description = `${product.name} là sản phẩm điện thoại cao cấp với thiết kế sang trọng và hiện đại. 
                          Được trang bị công nghệ màn hình Super Retina XDR, camera đẳng cấp và hiệu năng vượt trội. 
                          Sản phẩm phù hợp cho người dùng đòi hỏi trải nghiệm công nghệ cao cấp.`;
            break;
        case 'watch':
            description = `${product.name} là đồng hồ thông minh với nhiều tính năng theo dõi sức khỏe, 
                          hoạt động thể thao và kết nối thông minh. Thiết kế bền bỉ, chống nước và 
                          thời lượng pin ấn tượng giúp bạn sử dụng cả ngày dài.`;
            break;
        case 'macbook':
            description = `${product.name} là máy tính xách tay mạnh mẽ dành cho công việc sáng tạo và 
                          chuyên nghiệp. Với màn hình Retina sắc nét, hiệu suất ấn tượng và thời lượng pin 
                          lâu dài, đây là công cụ hoàn hảo cho các nhà thiết kế, lập trình viên và người làm sáng tạo nội dung.`;
            break;
        case 'laptop':
            description = `${product.name} là laptop hiệu năng cao với cấu hình mạnh mẽ, 
                          phù hợp cho gaming và xử lý đồ họa nặng. Được trang bị card đồ họa mạnh, 
                          hệ thống tản nhiệt hiệu quả và màn hình chất lượng cao.`;
            break;
        default:
            description = `${product.name} là sản phẩm công nghệ cao cấp với nhiều tính năng ưu việt. 
                          Thiết kế tinh tế, hiệu năng ổn định và độ bền cao là những điểm nổi bật của sản phẩm này.`;
    }
    
    return description.replace(/\s+/g, ' ').trim();
}

// Cập nhật các tab thông tin sản phẩm
function updateProductTabs(product) {
    const productType = detectProductType(product.name);
    const descriptionTab = document.querySelector('#description .product-description-content');
    const specificationsTab = document.querySelector('#specifications .specifications-content');
    
    if (!descriptionTab || !specificationsTab) return;
    
    // Cập nhật thông số kỹ thuật dựa theo loại sản phẩm
    if (productType === 'iphone') {
        // Giữ nguyên nội dung mặc định cho iPhone
    } else if (productType === 'watch') {
        updateWatchSpecifications(specificationsTab);
    } else if (productType === 'macbook' || productType === 'laptop') {
        updateLaptopSpecifications(specificationsTab, productType);
    }
}

// Cập nhật thông số kỹ thuật cho đồng hồ
function updateWatchSpecifications(container) {
    if (!container) return;
    
    container.innerHTML = `
        <div class="spec-group">
            <h3>Màn hình</h3>
            <ul>
                <li><strong>Kích thước:</strong> 1.92 inch</li>
                <li><strong>Loại:</strong> LTPO OLED Always-On Retina</li>
                <li><strong>Độ phân giải:</strong> 502 x 410 pixels</li>
                <li><strong>Độ sáng:</strong> Lên đến 2000 nits</li>
            </ul>
        </div>
        <div class="spec-group">
            <h3>Thiết kế & Vật liệu</h3>
            <ul>
                <li><strong>Vật liệu khung viền:</strong> Titanium</li>
                <li><strong>Mặt kính:</strong> Sapphire Crystal</li>
                <li><strong>Khả năng chống nước:</strong> 100m, IP6X</li>
            </ul>
        </div>
        <div class="spec-group">
            <h3>Kết nối</h3>
            <ul>
                <li><strong>Bluetooth:</strong> 5.3</li>
                <li><strong>Wi-Fi:</strong> 802.11b/g/n 2.4GHz và 5GHz</li>
                <li><strong>Cellular:</strong> LTE, UMTS</li>
                <li><strong>Định vị:</strong> GPS, GLONASS, Galileo, QZSS, BeiDou</li>
            </ul>
        </div>
    `;
}

// Cập nhật thông số kỹ thuật cho laptop/macbook
function updateLaptopSpecifications(container, type) {
    if (!container) return;
    
    if (type === 'macbook') {
        container.innerHTML = `
            <div class="spec-group">
                <h3>Vi xử lý & Hiệu năng</h3>
                <ul>
                    <li><strong>Chip:</strong> Apple M4</li>
                    <li><strong>CPU:</strong> 10 nhân</li>
                    <li><strong>GPU:</strong> 16 nhân</li>
                    <li><strong>Neural Engine:</strong> 16 nhân</li>
                </ul>
            </div>
            <div class="spec-group">
                <h3>Màn hình</h3>
                <ul>
                    <li><strong>Kích thước:</strong> 14.2 inch</li>
                    <li><strong>Loại:</strong> Liquid Retina XDR</li>
                    <li><strong>Độ phân giải:</strong> 3024 x 1964 pixels</li>
                    <li><strong>Tần số quét:</strong> 120Hz ProMotion</li>
                </ul>
            </div>
            <div class="spec-group">
                <h3>Bộ nhớ & Lưu trữ</h3>
                <ul>
                    <li><strong>RAM:</strong> 16GB hợp nhất</li>
                    <li><strong>Bộ nhớ trong:</strong> 512GB SSD</li>
                </ul>
            </div>
        `;
    } else {
        container.innerHTML = `
            <div class="spec-group">
                <h3>Vi xử lý & Hiệu năng</h3>
                <ul>
                    <li><strong>CPU:</strong> Intel Core Ultra 7 155H</li>
                    <li><strong>GPU:</strong> NVIDIA GeForce RTX 4060</li>
                    <li><strong>Tốc độ:</strong> 3.8 GHz (Turbo)</li>
                </ul>
            </div>
            <div class="spec-group">
                <h3>Màn hình</h3>
                <ul>
                    <li><strong>Kích thước:</strong> 14 inch</li>
                    <li><strong>Độ phân giải:</strong> 2.8K (2880x1800)</li>
                    <li><strong>Tần số quét:</strong> 120Hz</li>
                    <li><strong>Độ phủ màu:</strong> 100% DCI-P3</li>
                </ul>
            </div>
            <div class="spec-group">
                <h3>Bộ nhớ & Lưu trữ</h3>
                <ul>
                    <li><strong>RAM:</strong> 32GB LPDDR5X</li>
                    <li><strong>Bộ nhớ trong:</strong> 1TB NVMe PCIe Gen4 SSD</li>
                </ul>
            </div>
        `;
    }
}

// Xử lý sự kiện cho nút số lượng
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

// Thêm sản phẩm vào giỏ hàng
function addToCart(product, quantity = 1) {
    // Lấy giỏ hàng hiện tại từ localStorage
    let cart = JSON.parse(localStorage.getItem('cart')) || [];
    
    // Kiểm tra sản phẩm đã có trong giỏ hàng chưa
    const existingItemIndex = cart.findIndex(item => item.id === product.id);
    
    if (existingItemIndex >= 0) {
        // Nếu sản phẩm đã có trong giỏ hàng, tăng số lượng
        cart[existingItemIndex].quantity += quantity;
    } else {
        // Nếu sản phẩm chưa có trong giỏ hàng, thêm mới
        cart.push({
            id: product.id,
            name: product.name,
            price: parseFloat(product.price),
            image: product.image || '/images/products/default-product.jpg',
            quantity: quantity
        });
    }
    
    // Lưu giỏ hàng vào localStorage
    localStorage.setItem('cart', JSON.stringify(cart));
    
    // Cập nhật số lượng sản phẩm trong giỏ hàng hiển thị trên header
    updateCartCount();
    
    // Hiển thị thông báo thành công
    alert(`Đã thêm "${product.name}" vào giỏ hàng!`);
}

// Cập nhật số lượng sản phẩm trong giỏ hàng hiển thị trên header
function updateCartCount() {
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    const totalItems = cart.reduce((total, item) => total + item.quantity, 0);
    
    const cartCountElements = document.querySelectorAll('.cart-count');
    cartCountElements.forEach(element => {
        element.textContent = totalItems;
    });
}

// Đổi hình ảnh khi click vào thumbnail
function changeImage(event, src) {
    const mainImage = document.getElementById('mainImage');
    const thumbnails = document.querySelectorAll('.thumbnail');
    
    if (mainImage) {
        // Process image path
        const processedSrc = processImagePath(src);
        
        console.log(`Changing main image to: ${processedSrc}`);
        
        // Set up error handling before changing the src
        mainImage.onerror = function() {
            console.error(`Lỗi tải hình ảnh ${processedSrc}, thay thế bằng ảnh mặc định`);
            this.onerror = null; // Prevent infinite loops
            this.src = '/images/products/default-product.jpg';
        };
        
        // Change the image
        mainImage.src = processedSrc;
    }
    
    // Update active thumbnail
    thumbnails.forEach(thumb => thumb.classList.remove('active'));
    if (event && event.target) {
        const thumbnail = event.target.closest('.thumbnail');
        if (thumbnail) {
            thumbnail.classList.add('active');
        }
    }
}