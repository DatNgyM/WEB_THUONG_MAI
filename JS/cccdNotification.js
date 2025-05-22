/**
 * Notification script for CCCD updates
 * Shows notifications to users with temporary CCCDs
 */

document.addEventListener('DOMContentLoaded', function() {
    checkAndNotifyForCccdUpdate();
});

// Kiểm tra xem có cần hiển thị thông báo cập nhật CCCD không
function checkAndNotifyForCccdUpdate() {
    // Chỉ chạy cho người dùng đã đăng nhập
    if (localStorage.getItem('isLoggedIn') !== 'true') {
        return;
    }
    
    try {
        const userString = localStorage.getItem('user');
        if (!userString) return;
        
        const userObject = JSON.parse(userString);
        
        // Sử dụng các hàm từ cccdUtils nếu có
        const needsUpdate = typeof window.needsCccdUpdate === 'function' 
            ? window.needsCccdUpdate(userObject)
            : !userObject.cccd || (userObject.cccd.charAt(0) === 'T' && !isNaN(userObject.cccd.substring(1)));
        
        // Nếu cần cập nhật CCCD, hiển thị thông báo
        if (needsUpdate) {
            showCccdNotification();
        }
    } catch (error) {
        console.error('Error checking CCCD status:', error);
    }
}

// Hiển thị thông báo cập nhật CCCD
function showCccdNotification() {
    // Kiểm tra xem đã hiển thị trong phiên này chưa
    if (window.cccdNotificationShown) {
        return;
    }
    
    // Tạo thành phần HTML cho thông báo
    const notification = document.createElement('div');
    notification.className = 'toast show';
    notification.style.position = 'fixed';
    notification.style.bottom = '20px';
    notification.style.right = '20px';
    notification.style.minWidth = '300px';
    notification.style.backgroundColor = 'white';
    notification.style.boxShadow = '0 0 10px rgba(0,0,0,0.2)';
    notification.style.zIndex = '1050';
    notification.style.borderLeft = '5px solid #ffc107';
    
    notification.innerHTML = `
        <div class="toast-header">
            <strong class="me-auto">Cập nhật thông tin</strong>
            <small>Quan trọng</small>
            <button type="button" class="btn-close" data-bs-dismiss="toast"></button>
        </div>
        <div class="toast-body">
            <p>Chúng tôi nhận thấy bạn chưa cập nhật CCCD hợp lệ.</p>
            <p>Vui lòng cập nhật để sử dụng đầy đủ tính năng của hệ thống.</p>
            <a href="/Page/accountsetting.html" class="btn btn-warning btn-sm">Cập nhật ngay</a>
        </div>
    `;
    
    // Thêm vào DOM
    document.body.appendChild(notification);
    
    // Thêm event listener cho nút đóng
    const closeButton = notification.querySelector('.btn-close');
    if (closeButton) {
        closeButton.addEventListener('click', function() {
            notification.remove();
        });
    }
    
    // Tự động đóng sau 10 giây
    setTimeout(() => {
        if (document.body.contains(notification)) {
            notification.remove();
        }
    }, 10000);
    
    // Đánh dấu đã hiển thị trong phiên này
    window.cccdNotificationShown = true;
}