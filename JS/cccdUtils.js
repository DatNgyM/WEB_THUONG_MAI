
/**
 * Tiện ích xử lý CCCD
 * Cung cấp các hàm hỗ trợ để xử lý số CCCD trong toàn bộ ứng dụng
 */

// Định dạng CCCD hợp lệ: đúng 12 chữ số
const CCCD_PATTERN = /^\d{12}$/;

// Hàm kiểm tra xem một giá trị CCCD có phải là tạm thời hay không
function isTemporaryCccd(cccdValue) {
    if (!cccdValue) return false;
    
    // Định dạng CCCD tạm thời có thể là:
    // 1. Bắt đầu bằng 'T' và theo sau là các chữ số
    // 2. Hoặc định dạng mẫu "012345678901"
    return (cccdValue.charAt(0) === 'T' && !isNaN(cccdValue.substring(1))) ||
           cccdValue === "079203001234" ||
           cccdValue === "012345678901";
}

// Hàm tạo CCCD tạm thời theo định dạng mới
function generateTemporaryCccd() {
    return `T${Math.floor(Math.random() * 1000000000000).toString().padStart(12, '0')}`;
}

// Hàm kiểm tra tính hợp lệ của CCCD chính thức (12 chữ số)
function isValidCccd(cccdValue) {
    if (!cccdValue) return false;
    return CCCD_PATTERN.test(cccdValue);
}

// Hàm kiểm tra xem người dùng cần cập nhật CCCD không
function needsCccdUpdate(user) {
    return !user.cccd || isTemporaryCccd(user.cccd);
}

// Hàm xử lý hiển thị CCCD trong các form
function setupCccdField(cccdElement, userObject) {
    if (!cccdElement || !userObject) return;
    
    // Đảm bảo hiển thị đúng giá trị từ database
    cccdElement.value = userObject.cccd || '';
    
    // Nếu là CCCD tạm thời hoặc không có CCCD
    if (!userObject.cccd || isTemporaryCccd(userObject.cccd)) {
        // Cho phép chỉnh sửa
        cccdElement.removeAttribute('readonly');
        
        // Thêm thông báo
        const helpText = cccdElement.nextElementSibling;
        if (helpText && helpText.classList.contains('form-text')) {
            helpText.textContent = 'Vui lòng cập nhật số CCCD hợp lệ (12 chữ số).';
            helpText.classList.add('text-warning');
        }
        
        console.log('CCCD tạm thời hoặc trống - đã bật chế độ chỉnh sửa');
    } else {
        console.log('CCCD hợp lệ - đã hiển thị:', userObject.cccd);
    }
}

// Export các hàm để sử dụng ở nơi khác (sử dụng với module system)
// Đối với non-module, các hàm này sẽ là global
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        isTemporaryCccd,
        generateTemporaryCccd,
        isValidCccd,
        setupCccdField
    };
}
