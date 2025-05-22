/**
 * File kiểm tra thông tin người dùng
 * Dùng để debug và kiểm tra thông tin phone và address
 */

document.addEventListener('DOMContentLoaded', function() {
    setTimeout(checkUserInformation, 1500);
});

// Hàm kiểm tra và hiển thị thông tin người dùng trong console
function checkUserInformation() {
    try {
        console.log('===== KIỂM TRA THÔNG TIN NGƯỜI DÙNG =====');
        
        // Lấy thông tin từ localStorage
        const userString = localStorage.getItem('user');
        if (!userString) {
            console.log('Không tìm thấy thông tin người dùng trong localStorage');
            return;
        }
        
        const userObject = JSON.parse(userString);
        
        // Hiển thị thông tin cơ bản
        console.log('Thông tin cơ bản:');
        console.table({
            id: userObject.id || 'N/A',
            name: userObject.name || 'N/A',
            username: userObject.username || 'N/A',
            email: userObject.email || 'N/A'
        });
        
        // Hiển thị thông tin phone và address
        console.log('Thông tin liên lạc:');
        console.table({
            'Phone (phone)': userObject.phone || 'KHÔNG CÓ',
            'Phone (phoneNumber)': userObject.phoneNumber || 'KHÔNG CÓ',
            'Địa chỉ': userObject.address || 'KHÔNG CÓ',
            'CCCD': userObject.cccd || 'KHÔNG CÓ',
            'CCCD Status': userObject.cccdStatus || 'KHÔNG CÓ'
        });
        
        // Kiểm tra tính nhất quán giữa phone và phoneNumber
        if (userObject.phone !== userObject.phoneNumber) {
            console.warn('CHÚ Ý: Có sự không nhất quán giữa phone và phoneNumber!');
            console.warn(`- phone: ${userObject.phone}`);
            console.warn(`- phoneNumber: ${userObject.phoneNumber}`);
        }
        
        // Nếu không có phone hoặc address, hiển thị thông báo về cách cập nhật
        if (!userObject.phone && !userObject.phoneNumber) {
            console.info('HƯỚNG DẪN: Bạn chưa có số điện thoại. Cập nhật thông tin trong phần Hồ sơ.');
        }
        
        if (!userObject.address) {
            console.info('HƯỚNG DẪN: Bạn chưa có địa chỉ. Cập nhật thông tin trong phần Hồ sơ.');
        }
    } catch (error) {
        console.error('Lỗi khi kiểm tra thông tin người dùng:', error);
    }
}

// Hàm để người dùng gọi khi muốn kiểm tra thông tin
function showUserInfo() {
    checkUserInformation();
    return "Đã hiển thị thông tin người dùng trong console. Mở Developer Tools (F12) để xem kết quả.";
}

// Thêm hàm vào window để gọi từ console
window.showUserInfo = showUserInfo;
console.info("Gõ showUserInfo() trong console để kiểm tra thông tin người dùng");
