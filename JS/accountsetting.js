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
            document.getElementById('fullName').value = data.fullName || user.name || '';
            document.getElementById('phoneNumber').value = data.phoneNumber || user.phone || '';
            document.getElementById('address').value = data.address || user.address || '';
            document.getElementById('email').value = user.email; // Email from localStorage, typically not editable here
            
            // Lưu thông tin địa chỉ vào localStorage để có thể sử dụng trong trang checkout
            if (data.address && !user.address) {
                user.address = data.address;
                localStorage.setItem('user', JSON.stringify(user));
            }
            
            // Nếu có thông tin thanh toán, lưu vào localStorage
            if (data.paymentMethods) {
                savePaymentInfo(data.paymentMethods);
            }
        } catch (error) {
            console.error('Error fetching profile:', error);
            // Nếu API lỗi, vẫn hiển thị thông tin từ localStorage
            if (user) {
                document.getElementById('fullName').value = user.name || '';
                document.getElementById('phoneNumber').value = user.phone || '';
                document.getElementById('address').value = user.address || '';
                document.getElementById('email').value = user.email || '';
            }
        }
    }
    
    // Lưu thông tin thanh toán vào localStorage
    function savePaymentInfo(paymentMethods) {
        // Kiểm tra xem đã có thông tin thanh toán trong localStorage chưa
        const existingPaymentInfo = JSON.parse(localStorage.getItem('userPaymentInfo')) || {};
        
        // Cập nhật thông tin thẻ tín dụng nếu có
        if (paymentMethods.creditCard) {
            existingPaymentInfo.creditCard = paymentMethods.creditCard;
        }
        
        // Cập nhật thông tin tài khoản ngân hàng nếu có
        if (paymentMethods.bankAccount) {
            existingPaymentInfo.bankAccount = paymentMethods.bankAccount;
        }
        
        // Lưu thông tin thanh toán cập nhật vào localStorage
        localStorage.setItem('userPaymentInfo', JSON.stringify(existingPaymentInfo));
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
    
    // Update billing display with information from localStorage
    updateBillingDisplay();
    updateBillingDisplay(); // Update billing display with localStorage data

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
            
            // Cập nhật thông tin trong localStorage
            if (user) {
                user.name = fullName;
                user.phone = phoneNumber;
                user.address = address;
                localStorage.setItem('user', JSON.stringify(user));
                
                // Nếu đây là địa chỉ mặc định, thêm vào danh sách địa chỉ
                saveAddressToUserAddresses(fullName, address);
            }
            
            alert('Profile updated successfully!');
        } catch (error) {
            console.error('Error updating profile:', error);
            
            // Ngay cả khi API lỗi, vẫn cập nhật localStorage để sử dụng ở trang checkout
            if (user) {
                user.name = fullName;
                user.phone = phoneNumber;
                user.address = address;
                localStorage.setItem('user', JSON.stringify(user));
                
                // Lưu địa chỉ vào danh sách địa chỉ
                saveAddressToUserAddresses(fullName, address);
            }
            
            alert('Your information has been saved locally, but could not be synchronized with the server');
        }
    });
    
    /**
     * Lưu địa chỉ vào danh sách địa chỉ người dùng
     */
    function saveAddressToUserAddresses(name, address) {
        if (!address) return;
        
        // Lấy danh sách địa chỉ hiện có
        const addresses = JSON.parse(localStorage.getItem('userAddresses')) || [];
        
        // Kiểm tra xem địa chỉ đã tồn tại chưa
        const existingAddressIndex = addresses.findIndex(addr => addr.address === address);
        
        if (existingAddressIndex !== -1) {
            // Nếu đã tồn tại, cập nhật
            addresses[existingAddressIndex].name = name || 'Home Address';
            addresses[existingAddressIndex].isDefault = true;
        } else {
            // Nếu chưa tồn tại, đánh dấu các địa chỉ khác không phải mặc định
            addresses.forEach(addr => {
                addr.isDefault = false;
            });
            
            // Thêm địa chỉ mới
            addresses.push({
                name: name || 'Home Address',
                address: address,
                isDefault: true,
                dateAdded: new Date().toISOString()
            });
        }
        
        // Lưu lại vào localStorage
        localStorage.setItem('userAddresses', JSON.stringify(addresses));
    }

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
    
    // Handle Billing Information Form Submission
    document.getElementById('billingSettingsForm')?.addEventListener('submit', function(event) {
        event.preventDefault();
        
        // Get the active tab
        const activeTab = document.querySelector('#billingTabs .nav-link.active');
        const isCardTab = activeTab && activeTab.id === 'credit-card-tab';
        
        // Create payment info object
        const paymentInfo = JSON.parse(localStorage.getItem('userPaymentInfo')) || {};
        
        if (isCardTab) {
            // Get credit card details
            const cardHolderName = document.getElementById('cardHolderName').value;
            const cardNumber = document.getElementById('cardNumber').value;
            const expiryDate = document.getElementById('expiryDate').value;
            const cvv = document.getElementById('cvv').value;
            
            // Validate input
            if (!cardHolderName || !cardNumber || !expiryDate || !cvv) {
                alert('Please fill in all credit card details.');
                return;
            }
            
            // Check if the card number is masked (already saved)
            let finalCardNumber = cardNumber;
            if (cardNumber.includes('••••')) {
                // Use the original number stored in data attribute
                const originalNumber = document.getElementById('cardNumber').getAttribute('data-original');
                if (originalNumber) {
                    finalCardNumber = originalNumber;
                }
            }
            
            // Update credit card info
            paymentInfo.creditCard = {
                holderName: cardHolderName,
                number: finalCardNumber,
                expiry: expiryDate,
                cvv: cvv
            };
        } else {
            // Get bank account details
            const bankName = document.getElementById('bankName').value;
            const accountName = document.getElementById('accountName').value;
            const accountNumber = document.getElementById('accountNumber').value;
            
            // Validate input
            if (!bankName || !accountName || !accountNumber) {
                alert('Please fill in all bank account details.');
                return;
            }
            
            // Update bank account info
            paymentInfo.bankAccount = {
                bankName: bankName,
                accountName: accountName,
                accountNumber: accountNumber
            };
        }
        
        // Save payment info to localStorage
        localStorage.setItem('userPaymentInfo', JSON.stringify(paymentInfo));
        
        // Also update user data if needed
        const userData = JSON.parse(localStorage.getItem('user'));
        if (userData) {
            if (!userData.paymentMethods) {
                userData.paymentMethods = {};
            }
            
            if (isCardTab && paymentInfo.creditCard) {
                userData.paymentMethods.creditCard = paymentInfo.creditCard;
            } else if (paymentInfo.bankAccount) {
                userData.paymentMethods.bankAccount = paymentInfo.bankAccount;
            }
            
            localStorage.setItem('user', JSON.stringify(userData));
        }
        
        // Display success message
        alert('Payment information updated successfully!');
        
        // Update the display
        updateBillingDisplay();
    });
    
    // Function to update billing display with payment info
    function updateBillingDisplay() {
        // Get payment info from localStorage
        const paymentInfo = JSON.parse(localStorage.getItem('userPaymentInfo')) || {};
        const userData = JSON.parse(localStorage.getItem('user')) || {};
        
        // Get display elements
        const paymentMethodDisplay = document.getElementById('paymentMethodDisplay');
        const accountNumberDisplay = document.getElementById('accountNumberDisplay');
        const accountHolderNameDisplay = document.getElementById('accountHolderNameDisplay');
        const bankNameDisplay = document.getElementById('bankNameDisplay');
        const billingEmailDisplay = document.getElementById('billingEmailDisplay');
        
        // Display credit card info if available
        if (paymentInfo.creditCard) {
            if (paymentMethodDisplay) paymentMethodDisplay.textContent = 'Credit Card';
            if (accountNumberDisplay && paymentInfo.creditCard.number) {
                accountNumberDisplay.textContent = '•••• •••• •••• ' + paymentInfo.creditCard.number.slice(-4);
            }
            if (accountHolderNameDisplay) {
                accountHolderNameDisplay.textContent = paymentInfo.creditCard.holderName || 'N/A';
            }
            if (bankNameDisplay) bankNameDisplay.textContent = 'N/A';
            
            // Fill in form fields
            const cardHolderNameInput = document.getElementById('cardHolderName');
            const cardNumberInput = document.getElementById('cardNumber');
            const expiryDateInput = document.getElementById('expiryDate');
            
            if (cardHolderNameInput) cardHolderNameInput.value = paymentInfo.creditCard.holderName || '';
            if (cardNumberInput && paymentInfo.creditCard.number) {
                cardNumberInput.value = '•••• •••• •••• ' + paymentInfo.creditCard.number.slice(-4);
                cardNumberInput.setAttribute('data-original', paymentInfo.creditCard.number);
            }
            if (expiryDateInput) expiryDateInput.value = paymentInfo.creditCard.expiry || '';
        } 
        // Display bank account info if available
        else if (paymentInfo.bankAccount) {
            if (paymentMethodDisplay) paymentMethodDisplay.textContent = 'Bank Transfer';
            if (accountNumberDisplay && paymentInfo.bankAccount.accountNumber) {
                accountNumberDisplay.textContent = paymentInfo.bankAccount.accountNumber;
            }
            if (accountHolderNameDisplay) {
                accountHolderNameDisplay.textContent = paymentInfo.bankAccount.accountName || 'N/A';
            }
            if (bankNameDisplay) {
                bankNameDisplay.textContent = paymentInfo.bankAccount.bankName || 'N/A';
            }
            
            // Fill form fields
            const bankNameInput = document.getElementById('bankName');
            const accountNameInput = document.getElementById('accountName');
            const accountNumberInput = document.getElementById('accountNumber');
            
            if (bankNameInput) bankNameInput.value = paymentInfo.bankAccount.bankName || '';
            if (accountNameInput) accountNameInput.value = paymentInfo.bankAccount.accountName || '';
            if (accountNumberInput) accountNumberInput.value = paymentInfo.bankAccount.accountNumber || '';
        }
        // Try from user data if not found in paymentInfo
        else if (userData.paymentMethods) {
            if (userData.paymentMethods.creditCard) {
                if (paymentMethodDisplay) paymentMethodDisplay.textContent = 'Credit Card';
                if (accountNumberDisplay && userData.paymentMethods.creditCard.number) {
                    accountNumberDisplay.textContent = '•••• •••• •••• ' + userData.paymentMethods.creditCard.number.slice(-4);
                }
                if (accountHolderNameDisplay) {
                    accountHolderNameDisplay.textContent = userData.paymentMethods.creditCard.holderName || 'N/A';
                }
                if (bankNameDisplay) bankNameDisplay.textContent = 'N/A';
                
                // Fill form fields
                const cardHolderNameInput = document.getElementById('cardHolderName');
                const cardNumberInput = document.getElementById('cardNumber');
                const expiryDateInput = document.getElementById('expiryDate');
                
                if (cardHolderNameInput) cardHolderNameInput.value = userData.paymentMethods.creditCard.holderName || '';
                if (cardNumberInput && userData.paymentMethods.creditCard.number) {
                    cardNumberInput.value = '•••• •••• •••• ' + userData.paymentMethods.creditCard.number.slice(-4);
                    cardNumberInput.setAttribute('data-original', userData.paymentMethods.creditCard.number);
                }
                if (expiryDateInput) expiryDateInput.value = userData.paymentMethods.creditCard.expiry || '';
            } 
            else if (userData.paymentMethods.bankAccount) {
                if (paymentMethodDisplay) paymentMethodDisplay.textContent = 'Bank Transfer';
                if (accountNumberDisplay && userData.paymentMethods.bankAccount.accountNumber) {
                    accountNumberDisplay.textContent = userData.paymentMethods.bankAccount.accountNumber;
                }
                if (accountHolderNameDisplay) {
                    accountHolderNameDisplay.textContent = userData.paymentMethods.bankAccount.accountName || 'N/A';
                }
                if (bankNameDisplay) {
                    bankNameDisplay.textContent = userData.paymentMethods.bankAccount.bankName || 'N/A';
                }
                
                // Fill form fields
                const bankNameInput = document.getElementById('bankName');
                const accountNameInput = document.getElementById('accountName');
                const accountNumberInput = document.getElementById('accountNumber');
                
                if (bankNameInput) bankNameInput.value = userData.paymentMethods.bankAccount.bankName || '';
                if (accountNameInput) accountNameInput.value = userData.paymentMethods.bankAccount.accountName || '';
                if (accountNumberInput) accountNumberInput.value = userData.paymentMethods.bankAccount.accountNumber || '';
            }
        }
        
        // Set email from user data
        if (billingEmailDisplay && userData.email) {
            billingEmailDisplay.textContent = userData.email;
        }
    }
    
    // FOR TESTING: Add real bank account data if not exists
    function addSampleBankData() {
        const existingPaymentInfo = JSON.parse(localStorage.getItem('userPaymentInfo')) || {};
        
        // Only add if no bank account exists yet
        if (!existingPaymentInfo.bankAccount) {
            existingPaymentInfo.bankAccount = {
                bankName: "Vietcombank",
                accountName: "LE BA PHAT",
                accountNumber: "1026666666"
            };
            
            localStorage.setItem('userPaymentInfo', JSON.stringify(existingPaymentInfo));
            console.log("Real bank account data added");
            
            // Also add to user object
            const userData = JSON.parse(localStorage.getItem('user'));
            if (userData) {
                if (!userData.paymentMethods) {
                    userData.paymentMethods = {};
                }
                userData.paymentMethods.bankAccount = existingPaymentInfo.bankAccount;
                localStorage.setItem('user', JSON.stringify(userData));
            }
        }
    }

    // Automatically add sample bank data for testing purposes
    // This ensures that there's always bank account data available for checkout
    addSampleBankData();
    
    // If bankUtils.js is included, also use its functionality
    if (typeof ensureBankAccountInfo === 'function') {
        ensureBankAccountInfo();
    }
});
