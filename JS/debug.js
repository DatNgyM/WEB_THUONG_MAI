// Debug localStorage khi đăng nhập admin
console.log('Debug localStorage sau khi đăng nhập:');
console.log('isLoggedIn:', localStorage.getItem('isLoggedIn'));
console.log('role:', localStorage.getItem('role'));
console.log('name:', localStorage.getItem('name'));

// Nếu thông tin đăng nhập bị thiếu, cố gắng khôi phục từ sessionStorage
if (!localStorage.getItem('isLoggedIn') || !localStorage.getItem('role')) {
    console.log('Thông tin đăng nhập không đầy đủ, kiểm tra sessionStorage');
    
    // Logic sửa chữa nếu cần
    if (sessionStorage.getItem('isAdmin') === 'true') {
        console.log('Tìm thấy thông tin admin trong sessionStorage, khôi phục vào localStorage');
        localStorage.setItem('isLoggedIn', 'true');
        localStorage.setItem('role', 'admin');
        localStorage.setItem('name', sessionStorage.getItem('adminName') || 'Administrator');
        
        // Refresh trang để áp dụng thay đổi
        location.reload();
    }
}
