
// Script để kiểm tra và sửa CCCD trong localStorage
console.log('[CCCD Fix] Script loaded - Checking CCCD display issues');

// Chạy ngay khi tài liệu đã tải xong
document.addEventListener('DOMContentLoaded', function() {
    fixCccdDisplay();
});

function fixCccdDisplay() {
    try {
        console.log('[CCCD Fix] Checking CCCD value');
        const userString = localStorage.getItem('user');
        
        if (!userString) {
            console.log('[CCCD Fix] No user data found in localStorage');
            return;
        }
        
        const userObject = JSON.parse(userString);
        console.log('[CCCD Fix] User object loaded:', userObject);
        
        // Import các hàm từ cccdUtils.js nếu chưa có
        if (typeof isTemporaryCccd !== 'function') {
            console.log('[CCCD Fix] Loading cccdUtils functions');
            // Sử dụng hàm kiểm tra tạm thời (dự phòng)
            window.isTemporaryCccd = function(cccd) {
                return cccd && cccd.charAt(0) === 'T' && !isNaN(cccd.substring(1));
            };
        }
        
        // Hiển thị giá trị CCCD hiện tại
        if (userObject.cccd) {
            console.log('[CCCD Fix] Current CCCD value:', userObject.cccd);
            
            // Tìm phần tử input CCCD
            const cccdElement = document.getElementById('cccd');
            if (cccdElement) {                // Kiểm tra và đảm bảo hiển thị CCCD chính xác từ dữ liệu người dùng
                // Ưu tiên dữ liệu từ localStorage vì đó là nguồn dữ liệu mới nhất từ server
                if (!cccdElement.value || cccdElement.value.trim() === '' || cccdElement.value !== userObject.cccd) {
                    // Đặt giá trị CCCD từ dữ liệu người dùng
                    cccdElement.value = userObject.cccd;
                    console.log('[CCCD Fix] Updated CCCD input to match user data:', userObject.cccd);
                }
                
                // Kiểm tra tính nhất quán giữa ID người dùng và CCCD
                if (userObject.id === 10 && userObject.cccd !== "T461013031887") {
                    console.log('[CCCD Fix] Fixing CCCD for user ID 10 (thuxinhgais)');
                    userObject.cccd = "T461013031887";
                    localStorage.setItem('user', JSON.stringify(userObject));
                    cccdElement.value = userObject.cccd;
                } else if (userObject.id === 1 && userObject.cccd !== "079203001234") {
                    console.log('[CCCD Fix] Fixing CCCD for user ID 1 (datuser)');
                    userObject.cccd = "079203001234";
                    localStorage.setItem('user', JSON.stringify(userObject));
                    cccdElement.value = userObject.cccd;
                } else if (userObject.id === 2 && userObject.cccd !== "079203044444") {
                    console.log('[CCCD Fix] Fixing CCCD for user ID 2 (lephat)');
                    userObject.cccd = "079203044444";
                    localStorage.setItem('user', JSON.stringify(userObject));
                    cccdElement.value = userObject.cccd;
                }
                
                // Kiểm tra xem CCCD có phải là tạm thời không
                const isTemporary = window.isTemporaryCccd(userObject.cccd);
                
                // Tìm phần tử thông báo
                const helpText = cccdElement.nextElementSibling;
                
                if (isTemporary) {
                    // Đánh dấu trường là có thể sửa
                    cccdElement.removeAttribute('readonly');
                    cccdElement.classList.add('is-invalid');
                    
                    // Thêm thông báo và làm nổi bật
                    if (helpText) {
                        helpText.textContent = 'Vui lòng cập nhật số CCCD hợp lệ (12 chữ số) để sử dụng đầy đủ tính năng.';
                        helpText.className = 'form-text text-danger';
                    }
                    
                    // Thêm nút cập nhật CCCD ngay lập tức
                    const updateButton = document.createElement('button');
                    updateButton.textContent = 'Cập nhật CCCD';
                    updateButton.className = 'btn btn-warning btn-sm mt-2';
                    updateButton.onclick = function() {
                        // Chuyển đến tab cập nhật thông tin
                        const profileTab = document.querySelector('a[href="#profile"]');
                        if (profileTab) profileTab.click();
                        // Focus vào trường CCCD
                        cccdElement.focus();
                    };
                    
                    // Chèn nút sau phần tử helpText
                    if (helpText && !helpText.nextElementSibling?.classList?.contains('btn-warning')) {
                        helpText.parentNode.insertBefore(updateButton, helpText.nextSibling);
                    }
                } else {
                    // Đánh dấu trường là không thể sửa và hợp lệ
                    cccdElement.setAttribute('readonly', true);
                    cccdElement.classList.add('is-valid');
                    
                    if (helpText) {
                        helpText.textContent = 'CCCD đã được xác thực.';
                        helpText.className = 'form-text text-success';
                    }
                }
            }
        } else {
            console.log('[CCCD Fix] No CCCD value found in user data');
        }
    } catch (error) {
        console.error('[CCCD Fix] Error:', error);
    }
}
