// Custom JavaScript for the website

// Sử dụng Strict Mode
"use strict";

document.addEventListener('DOMContentLoaded', function() {

    // Kích hoạt tooltips
    var tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'));
    var tooltipList = tooltipTriggerList.map(function (tooltipTriggerEl) {
        return new bootstrap.Tooltip(tooltipTriggerEl);
    });
    
    // Hiển thị nút "Về đầu trang" khi cuộn xuống
    const scrollToTopBtn = document.getElementById('scrollToTop');
    if (scrollToTopBtn) {
        window.addEventListener('scroll', function() {
            if (window.pageYOffset > 300) {
                scrollToTopBtn.style.display = 'block';
            } else {
                scrollToTopBtn.style.display = 'none';
            }
        });
        
        scrollToTopBtn.addEventListener('click', function(e) {
            e.preventDefault();
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
    }
    
    // Xử lý hiệu ứng lazy load cho hình ảnh
    if ('IntersectionObserver' in window) {
        const lazyImages = document.querySelectorAll('.lazy-load');
        
        const imageObserver = new IntersectionObserver(function(entries, observer) {
            entries.forEach(function(entry) {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    img.src = img.dataset.src;
                    img.classList.remove('lazy-load');
                    imageObserver.unobserve(img);
                }
            });
        });
        
        lazyImages.forEach(function(img) {
            imageObserver.observe(img);
        });
    }

    // Xử lý thêm vào giỏ hàng
    const addToCartButtons = document.querySelectorAll('.add-to-cart-btn');
    
    if (addToCartButtons.length > 0) {
        addToCartButtons.forEach(button => {
            button.addEventListener('click', function(e) {
                e.preventDefault();
                const productId = this.getAttribute('data-product-id');
                const productName = this.getAttribute('data-product-name');
                const productPrice = this.getAttribute('data-product-price');
                
                // Gọi hàm thêm vào giỏ hàng
                addToCart(productId, productName, productPrice);
            });
        });
    }

    // Hàm thêm vào giỏ hàng
    function addToCart(productId, productName, productPrice) {
        // Lấy giỏ hàng từ localStorage
        let cart = localStorage.getItem('cart');
        cart = cart ? JSON.parse(cart) : [];
        
        // Kiểm tra sản phẩm đã có trong giỏ hàng chưa
        const existingItem = cart.find(item => item.id === productId);
        
        if (existingItem) {
            // Nếu có rồi thì tăng số lượng
            existingItem.quantity += 1;
        } else {
            // Nếu chưa có thì thêm mới
            cart.push({
                id: productId,
                name: productName,
                price: productPrice,
                quantity: 1
            });
        }
        
        // Lưu giỏ hàng vào localStorage
        localStorage.setItem('cart', JSON.stringify(cart));
        
        // Cập nhật số lượng sản phẩm hiển thị trên header
        updateCartCount();
        
        // Hiển thị thông báo
        showToast('Đã thêm sản phẩm vào giỏ hàng!');
    }

    // Cập nhật số lượng sản phẩm trên header
    function updateCartCount() {
        const cartBadge = document.querySelector('.fa-shopping-cart + .badge');
        if (cartBadge) {
            let cart = localStorage.getItem('cart');
            cart = cart ? JSON.parse(cart) : [];
            
            let count = 0;
            cart.forEach(item => {
                count += item.quantity;
            });
            
            cartBadge.textContent = count;
        }
    }

    // Hiển thị thông báo toast
    function showToast(message) {
        const toastContainer = document.createElement('div');
        toastContainer.classList.add('toast-container', 'position-fixed', 'bottom-0', 'end-0', 'p-3');
        
        const toastElement = document.createElement('div');
        toastElement.classList.add('toast', 'align-items-center', 'text-bg-success', 'border-0');
        toastElement.setAttribute('role', 'alert');
        toastElement.setAttribute('aria-live', 'assertive');
        toastElement.setAttribute('aria-atomic', 'true');
        
        toastElement.innerHTML = `
            <div class="d-flex">
                <div class="toast-body">
                    ${message}
                </div>
                <button type="button" class="btn-close btn-close-white me-2 m-auto" data-bs-dismiss="toast" aria-label="Close"></button>
            </div>
        `;
        
        toastContainer.appendChild(toastElement);
        document.body.appendChild(toastContainer);
        
        const toast = new bootstrap.Toast(toastElement, {
            autohide: true,
            delay: 3000
        });
        toast.show();
        
        // Xóa toast sau khi ẩn
        toastElement.addEventListener('hidden.bs.toast', function () {
            toastContainer.remove();
        });
    }

    // Khởi tạo cart count khi load trang
    updateCartCount();

    // Xử lý hình ảnh sản phẩm trong trang chi tiết
    const productThumbnails = document.querySelectorAll('.product-thumbnail');
    const mainProductImage = document.getElementById('main-product-image');
    
    if (productThumbnails.length > 0 && mainProductImage) {
        productThumbnails.forEach(thumbnail => {
            thumbnail.addEventListener('click', function() {
                const imgSrc = this.getAttribute('src');
                mainProductImage.setAttribute('src', imgSrc);
                
                // Cập nhật class active
                productThumbnails.forEach(item => {
                    item.classList.remove('active');
                });
                this.classList.add('active');
            });
        });
    }

});
