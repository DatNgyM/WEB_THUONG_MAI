/**
 * CCCD Update Manager
 * Quản lý việc cập nhật CCCD
 */

// Khởi tạo khi tài liệu đã tải xong
document.addEventListener('DOMContentLoaded', function() {
    setupCccdUpdateHandler();
});

// Thiết lập trình xử lý cập nhật CCCD
function setupCccdUpdateHandler() {
    // Tìm phần tử CCCD trong trang
    const cccdElement = document.getElementById('cccd');
    if (!cccdElement) {
        console.log('[CCCD Update] No CCCD element found');
        return;
    }

    // Tạo nút cập nhật CCCD riêng biệt
    const updateButton = document.createElement('button');
    updateButton.textContent = 'Cập nhật CCCD';
    updateButton.type = 'button'; // Đảm bảo không submit form
    updateButton.className = 'btn btn-warning btn-sm mt-2';
    updateButton.id = 'updateCccdButton';
    updateButton.style.display = 'none'; // Mặc định ẩn

    // Chèn nút sau trường CCCD
    const helpText = cccdElement.nextElementSibling;
    if (helpText) {
        const existingButton = helpText.nextElementSibling;
        if (existingButton && existingButton.id === 'updateCccdButton') {
            // Nút đã tồn tại, không thêm lại
        } else {
            helpText.parentNode.insertBefore(updateButton, helpText.nextSibling);
        }
    } else {
        cccdElement.parentNode.appendChild(updateButton);
    }

    // Kiểm tra và hiển thị nút nếu CCCD đang ở chế độ có thể sửa
    function updateButtonVisibility() {
        if (!cccdElement.hasAttribute('readonly')) {
            updateButton.style.display = 'inline-block';
        } else {
            updateButton.style.display = 'none';
        }
    }

    // Gọi ngay để thiết lập trạng thái ban đầu
    updateButtonVisibility();

    // Thêm sự kiện khi giá trị CCCD thay đổi
    cccdElement.addEventListener('input', function() {
        // Kiểm tra định dạng CCCD (12 chữ số)
        const cccdValue = this.value.trim();
        const isValid = /^\d{12}$/.test(cccdValue);
        
        if (isValid) {
            this.classList.remove('is-invalid');
            this.classList.add('is-valid');
        } else {
            this.classList.remove('is-valid');
            this.classList.add('is-invalid');
        }
    });

    // Xử lý sự kiện cập nhật CCCD
    updateButton.addEventListener('click', function() {
        const cccdValue = cccdElement.value.trim();
        
        // Kiểm tra định dạng CCCD
        if (!/^\d{12}$/.test(cccdValue)) {
            alert('CCCD phải có đúng 12 chữ số. Vui lòng kiểm tra lại.');
            return;
        }
        
        // Lấy thông tin người dùng
        const userString = localStorage.getItem('user');
        if (!userString) {
            alert('Không tìm thấy thông tin người dùng. Vui lòng đăng nhập lại.');
            return;
        }
        
        const userObject = JSON.parse(userString);
        
        // Hiển thị thông báo đang xử lý
        updateButton.disabled = true;
        updateButton.innerHTML = '<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span> Đang cập nhật...';
        
        // Gọi API để cập nhật CCCD
        fetch('/users/update-cccd', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                userId: userObject.id,
                cccd: cccdValue
            })
        })
        .then(response => response.json())
        .then(result => {
            if (result.success) {
                // Cập nhật CCCD trong localStorage
                userObject.cccd = cccdValue;
                localStorage.setItem('user', JSON.stringify(userObject));
                
                // Hiển thị thông báo thành công
                alert('Cập nhật CCCD thành công!');
                
                // Reload trang để cập nhật giao diện
                window.location.reload();
            } else {
                // Hiển thị lỗi
                alert('Lỗi: ' + (result.message || 'Không thể cập nhật CCCD'));
                updateButton.disabled = false;
                updateButton.textContent = 'Cập nhật CCCD';
            }
        })
        .catch(error => {
            console.error('Lỗi khi gọi API cập nhật CCCD:', error);
            alert('Đã xảy ra lỗi khi cập nhật CCCD. Vui lòng thử lại sau.');
            updateButton.disabled = false;
            updateButton.textContent = 'Cập nhật CCCD';
        });
    });

    // Xem xét lại trạng thái CCCD hiện tại
    const userString = localStorage.getItem('user');
    if (userString) {
        const userObject = JSON.parse(userString);
        if (userObject.cccd) {
            console.log('[CCCD Update] Current CCCD:', userObject.cccd);
            
            // Kiểm tra CCCD có phải tạm thời không
            const isTemporary = userObject.cccd.charAt(0) === 'T' && !isNaN(userObject.cccd.substring(1));
            if (isTemporary) {
                // Cho phép chỉnh sửa
                cccdElement.removeAttribute('readonly');
                updateButtonVisibility();
            }
        }
    }
}
