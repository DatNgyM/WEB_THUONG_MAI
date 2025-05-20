document.addEventListener('DOMContentLoaded', () => {
    // const token = localStorage.getItem('token'); // Bỏ qua kiểm tra token
    let user = null; // Khởi tạo user là null

    try {
        const userString = localStorage.getItem('user');
        if (userString) {
            user = JSON.parse(userString); // Cố gắng parse thông tin user
        }
    } catch (e) {
        console.error("Lỗi khi đọc thông tin người dùng từ localStorage:", e);
        // Cân nhắc xóa item 'user' bị lỗi khỏi localStorage nếu cần
        // localStorage.removeItem('user'); 
    }

    // Ghi log để kiểm tra giá trị
    console.log('Kiểm tra xác thực - Token:', token);
    console.log('Kiểm tra xác thực - User:', user);

    // if (!token || !user) { // Chỉ kiểm tra user
    if (!user) { // Chỉ kiểm tra user, bỏ qua token
        console.log('Không có user, đang chuyển hướng về trang login...');
        window.location.href = '/Page/login.html';
        return;
    }

    // Nếu user tồn tại, tiếp tục với phần còn lại của script
    console.log('User hợp lệ, tiếp tục tải trang cài đặt.');

    // Function to fetch user profile
    async function fetchProfile() {
        try {
            // Bỏ header Authorization vì không dùng token
            const response = await fetch('/api/profile'); 
            if (!response.ok) throw new Error('Failed to fetch profile');
            const data = await response.json();
            document.getElementById('fullName').value = data.fullName || '';
            document.getElementById('phoneNumber').value = data.phoneNumber || '';
            document.getElementById('address').value = data.address || '';
            document.getElementById('email').value = user.email; // Email from localStorage, typically not editable here
        } catch (error) {
            console.error('Error fetching profile:', error);
            alert('Could not load your profile information.');
        }
    }

    // Function to fetch notifications settings
    async function fetchNotifications() {
        try {
            // Bỏ header Authorization vì không dùng token
            const response = await fetch('/api/notifications');
            if (!response.ok) throw new Error('Failed to fetch notifications settings');
            const data = await response.json();
            document.getElementById('emailNotifications').checked = data.emailNotifications || false;
            document.getElementById('smsNotifications').checked = data.smsNotifications || false;
            // Add more notification settings as needed
        } catch (error) {
            console.error('Error fetching notifications settings:', error);
            alert('Could not load your notification settings.');
        }
    }

    // Function to fetch billing information
    async function fetchBilling() {
        try {
            // Bỏ header Authorization vì không dùng token
            const response = await fetch('/api/billing');
            if (!response.ok) throw new Error('Failed to fetch billing information');
            const data = await response.json();
            // Assuming you have form fields for billing info
            // Example: document.getElementById('cardNumber').value = data.cardNumber || '';
            // Fill other billing fields
        } catch (error) {
            console.error('Error fetching billing information:', error);
            // alert('Could not load your billing information.'); // Optional: can be noisy
        }
    }

    // Load all data on page load
    fetchProfile();
    fetchNotifications();
    fetchBilling();

    // Handle Profile Information Form Submission
    document.getElementById('profileForm')?.addEventListener('submit', async (event) => {
        event.preventDefault();
        const fullName = document.getElementById('fullName').value;
        const phoneNumber = document.getElementById('phoneNumber').value;
        const address = document.getElementById('address').value;

        try {
            const response = await fetch('/api/profile/update', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                    // Bỏ Authorization header 
                },
                body: JSON.stringify({ fullName, phoneNumber, address })
            });
            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Failed to update profile');
            }
            alert('Profile updated successfully!');
        } catch (error) {
            console.error('Error updating profile:', error);
            alert(`Error: ${error.message}`);
        }
    });

    // Handle Username Change Form Submission
    document.getElementById('usernameForm')?.addEventListener('submit', async (event) => {
        event.preventDefault();
        const newUsername = document.getElementById('newUsername').value;
        if (!newUsername) {
            alert('Please enter a new username.');
            return;
        }
        try {
            const response = await fetch('/api/account/change-username', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                    // Bỏ Authorization header 
                },
                body: JSON.stringify({ newUsername })
            });
            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Failed to change username');
            }
            alert('Username changed successfully! You might need to log in again.');
            // Optionally update localStorage and UI
            user.username = newUsername; // Assuming username is part of user object
            localStorage.setItem('user', JSON.stringify(user));
        } catch (error) {
            console.error('Error changing username:', error);
            alert(`Error: ${error.message}`);
        }
    });

    // Handle Password Change Form Submission
    document.getElementById('passwordForm')?.addEventListener('submit', async (event) => {
        event.preventDefault();
        const currentPassword = document.getElementById('currentPassword').value;
        const newPassword = document.getElementById('newPassword').value;
        const confirmPassword = document.getElementById('confirmPassword').value;

        if (newPassword !== confirmPassword) {
            alert('New passwords do not match.');
            return;
        }
        if (!currentPassword || !newPassword) {
            alert('Please fill in all password fields.');
            return;
        }

        try {
            const response = await fetch('/api/account/change-password', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                    // Bỏ Authorization header 
                },
                body: JSON.stringify({ currentPassword, newPassword })
            });
            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Failed to change password');
            }
            alert('Password changed successfully!');
            document.getElementById('passwordForm').reset();
        } catch (error) {
            console.error('Error changing password:', error);
            alert(`Error: ${error.message}`);
        }
    });

    // Handle Notification Settings Form Submission
    document.getElementById('notificationsForm')?.addEventListener('submit', async (event) => {
        event.preventDefault();
        const emailNotifications = document.getElementById('emailNotifications').checked;
        const smsNotifications = document.getElementById('smsNotifications').checked;
        // Add more notification settings as needed

        try {
            const response = await fetch('/api/notifications/update', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                    // Bỏ Authorization header 
                },
                body: JSON.stringify({ emailNotifications, smsNotifications /*, other settings */ })
            });
            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Failed to update notification settings');
            }
            alert('Notification settings updated successfully!');
        } catch (error) {
            console.error('Error updating notification settings:', error);
            alert(`Error: ${error.message}`);
        }
    });

    // Handle Account Deletion
    document.getElementById('deleteAccountBtn')?.addEventListener('click', async () => {
        if (!confirm('Are you sure you want to delete your account? This action cannot be undone.')) {
            return;
        }

        try {
            const response = await fetch('/api/account/delete', {
                method: 'DELETE',
                headers: {
                    // Bỏ Authorization header 
                }
            });
            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Failed to delete account');
            }
            alert('Account deleted successfully.');
            // Clear localStorage and redirect to homepage or login page
            localStorage.removeItem('token');
            localStorage.removeItem('user');
            window.location.href = '/'; // Or '/Page/login.html'
        } catch (error) {
            console.error('Error deleting account:', error);
            alert(`Error: ${error.message}`);
        }
    });

    // Logout functionality (if you have a logout button on this page)
    document.getElementById('logoutButton')?.addEventListener('click', () => {
        // localStorage.removeItem('token'); // Bỏ qua token
        localStorage.removeItem('user');
        localStorage.removeItem('isLoggedIn'); // Thêm dòng này để đảm bảo trạng thái đăng nhập được xóa
        localStorage.removeItem('name'); // Thêm dòng này
        localStorage.removeItem('role'); // Thêm dòng này
        window.location.href = '/Page/login.html';
    });
});
