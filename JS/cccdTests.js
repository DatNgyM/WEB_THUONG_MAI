/**
 * Bộ kiểm thử CCCD
 * Cung cấp các hàm để kiểm tra chức năng CCCD
 */

// Khởi tạo khi tài liệu đã tải
document.addEventListener('DOMContentLoaded', function() {
    // Kiểm tra xem có phải trang kiểm thử không
    if (window.location.search.includes('cccd-test=true')) {
        initCccdTests();
    }
});

// Khởi tạo giao diện kiểm thử
function initCccdTests() {
    console.log('[CCCD Test] Initializing test interface');
    
    // Tạo container kiểm thử
    const testContainer = document.createElement('div');
    testContainer.id = 'cccd-test-container';
    testContainer.style.position = 'fixed';
    testContainer.style.top = '10px';
    testContainer.style.right = '10px';
    testContainer.style.width = '350px';
    testContainer.style.backgroundColor = '#f8f9fa';
    testContainer.style.border = '1px solid #ddd';
    testContainer.style.borderRadius = '5px';
    testContainer.style.padding = '10px';
    testContainer.style.zIndex = '9999';
    testContainer.style.boxShadow = '0 0 10px rgba(0,0,0,0.1)';
    
    // Thêm tiêu đề
    testContainer.innerHTML = `
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 10px;">
            <h5 style="margin: 0;">CCCD Testing Tools</h5>
            <button id="close-test-panel" style="background: none; border: none; cursor: pointer;">✖</button>
        </div>
        <div class="test-tools">
            <div style="margin-bottom: 10px;">
                <select id="cccd-test-action" class="form-select">
                    <option value="check">Kiểm tra CCCD hiện tại</option>
                    <option value="set-temporary">Thiết lập CCCD tạm thời</option>
                    <option value="set-valid">Thiết lập CCCD hợp lệ</option>
                    <option value="clear">Xóa CCCD</option>
                    <option value="reset-notification">Reset thông báo</option>
                </select>
            </div>
            <div id="cccd-value-container" style="margin-bottom: 10px; display: none;">
                <input type="text" id="cccd-test-value" class="form-control" placeholder="Nhập giá trị CCCD" />
            </div>
            <div>
                <button id="run-cccd-test" class="btn btn-primary btn-sm w-100">Thực hiện</button>
            </div>
            <div id="test-result" style="margin-top: 10px; padding: 10px; background-color: #e9ecef; border-radius: 5px; display: none;"></div>
        </div>
    `;
    
    // Thêm vào trang
    document.body.appendChild(testContainer);
    
    // Thêm event listeners
    document.getElementById('close-test-panel').addEventListener('click', function() {
        testContainer.remove();
    });
    
    document.getElementById('cccd-test-action').addEventListener('change', function() {
        const valueContainer = document.getElementById('cccd-value-container');
        if (this.value === 'set-temporary' || this.value === 'set-valid') {
            valueContainer.style.display = 'block';
        } else {
            valueContainer.style.display = 'none';
        }
    });
    
    document.getElementById('run-cccd-test').addEventListener('click', runCccdTest);
}

// Thực thi kiểm thử
function runCccdTest() {
    const action = document.getElementById('cccd-test-action').value;
    const valueInput = document.getElementById('cccd-test-value');
    const resultDiv = document.getElementById('test-result');
    
    try {
        // Lấy dữ liệu người dùng hiện tại
        let userObject = JSON.parse(localStorage.getItem('user') || '{}');
        let currentCccd = userObject.cccd || 'không có';
        
        let result = '';
        
        switch (action) {
            case 'check':
                // Kiểm tra CCCD hiện tại
                let isTemp = false;
                let isValid = false;
                
                if (typeof isTemporaryCccd === 'function') {
                    isTemp = isTemporaryCccd(currentCccd);
                } else {
                    isTemp = currentCccd && currentCccd.charAt(0) === 'T' && !isNaN(currentCccd.substring(1));
                }
                
                if (typeof isValidCccd === 'function') {
                    isValid = isValidCccd(currentCccd);
                } else {
                    isValid = /^\d{12}$/.test(currentCccd);
                }
                
                result = `CCCD hiện tại: ${currentCccd}<br>`;
                result += `Là CCCD tạm thời: ${isTemp ? 'Có' : 'Không'}<br>`;
                result += `Là CCCD hợp lệ: ${isValid ? 'Có' : 'Không'}`;
                break;
                
            case 'set-temporary':
                // Thiết lập CCCD tạm thời
                let tempCccd = valueInput.value.trim() || `T${Math.floor(Math.random() * 1000000000000).toString().padStart(12, '0')}`;
                userObject.cccd = tempCccd;
                localStorage.setItem('user', JSON.stringify(userObject));
                result = `Đã thiết lập CCCD tạm thời: ${tempCccd}`;
                break;
                
            case 'set-valid':
                // Thiết lập CCCD hợp lệ
                let validCccd = valueInput.value.trim();
                if (!/^\d{12}$/.test(validCccd)) {
                    result = 'Lỗi: CCCD phải có đúng 12 chữ số';
                } else {
                    userObject.cccd = validCccd;
                    localStorage.setItem('user', JSON.stringify(userObject));
                    result = `Đã thiết lập CCCD hợp lệ: ${validCccd}`;
                }
                break;
                
            case 'clear':
                // Xóa CCCD
                delete userObject.cccd;
                localStorage.setItem('user', JSON.stringify(userObject));
                result = 'Đã xóa CCCD';
                break;
                
            case 'reset-notification':
                // Reset thông báo
                window.cccdNotificationShown = false;
                result = 'Đã reset trạng thái thông báo';
                break;
        }
        
        // Hiển thị kết quả
        resultDiv.innerHTML = result;
        resultDiv.style.display = 'block';
        
        // Tải lại trang nếu cần
        if (['set-temporary', 'set-valid', 'clear'].includes(action)) {
            setTimeout(() => {
                window.location.reload();
            }, 2000);
        }
        
    } catch (error) {
        resultDiv.innerHTML = `Lỗi: ${error.message}`;
        resultDiv.style.display = 'block';
    }
}