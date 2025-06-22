/*!
 * Five:07 E-commerce Shop JS
 * Chỉ giữ lại các chức năng giao diện: filter, sort, hiển thị sản phẩm, cart, notification
 * Không fetch API, không gọi endpoint cũ
 */

document.addEventListener('DOMContentLoaded', function() {
    // Filter toggle for mobile
    const filterToggle = document.querySelector('.filter-toggle');
    const filterSidebar = document.querySelector('.filter-sidebar');
    if (filterToggle && filterSidebar) {
        filterToggle.addEventListener('click', function() {
            filterSidebar.classList.toggle('active');
        });
    }

    // Sort select
    const sortSelect = document.querySelector('.sort-select');
    if (sortSelect) {
        sortSelect.addEventListener('change', function() {
            // Chỉ submit form, không fetch API
            this.form && this.form.submit();
        });
    }

    // Add to cart buttons
    const addToCartButtons = document.querySelectorAll('.add-to-cart-btn');
    addToCartButtons.forEach(button => {
        button.addEventListener('click', function(e) {
            e.preventDefault();
            const productId = this.dataset.productId;
            const quantity = this.dataset.quantity || 1;
            // Gọi hàm addToCart nếu đã có trong main.js
            if (typeof addToCart === 'function') {
                addToCart(productId, quantity);
            } else {
                showNotification('Đã thêm sản phẩm vào giỏ hàng!', 'success');
            }
        });
    });

    // Notification test (nếu cần)
    // showNotification('Shop page loaded!', 'info');
});

// Giả lập hàm addToCart (nếu cần thiết)
function addToCart(productId, quantity) {
    console.log(`Thêm sản phẩm ID ${productId} vào giỏ hàng, số lượng: ${quantity}`);
    showNotification(`Đã thêm sản phẩm vào giỏ hàng!`, 'success');
}

// Hàm hiển thị thông báo
function showNotification(message, type) {
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.textContent = message;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.remove();
    }, 3000);
}