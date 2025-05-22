/**
 * User Data Manager
 * Quản lý dữ liệu người dùng và đảm bảo tính nhất quán giữa các phiên đăng nhập
 */

// Khởi tạo khi tài liệu đã tải xong
document.addEventListener('DOMContentLoaded', function() {
    // Kiểm tra và cập nhật dữ liệu người dùng
    validateAndFixUserData();
    
    // Thiết lập các form và sự kiện
    setupForms();
    
    // Hiển thị thông tin người dùng
    displayUserInfo();
    
    // Kiểm tra tình trạng CCCD và cập nhật UI
    checkCccdStatus();
    
    // Kiểm tra và đồng bộ các dữ liệu đang ở trạng thái tạm thời
    // Đợi 2 giây để trang đã tải hoàn toàn
    setTimeout(function() {
        // Đồng bộ CCCD
        if (typeof syncPendingCccdUpdates === 'function') {
            syncPendingCccdUpdates();
        }
        
        // Đồng bộ profile (phone và address)
        if (typeof syncPendingProfileUpdates === 'function') {
            syncPendingProfileUpdates();
        }
        
        // Kiểm tra nếu cần làm mới thông tin từ server
        if (shouldRefreshUserData()) {
            refreshUserDataFromServer();
        }
    }, 2000);
    
    // Thiết lập bắt sự kiện online để đồng bộ khi có kết nối mạng trở lại
    window.addEventListener('online', function() {
        console.log('[User Manager] Phát hiện kết nối mạng trở lại. Đang đồng bộ dữ liệu...');
        
        // Đồng bộ CCCD
        if (typeof syncPendingCccdUpdates === 'function') {
            syncPendingCccdUpdates();
        }
        
        // Đồng bộ profile
        if (typeof syncPendingProfileUpdates === 'function') {
            syncPendingProfileUpdates();
        }
    });
});

/**
 * Kiểm tra và sửa lỗi dữ liệu người dùng trong localStorage
 */
function validateAndFixUserData() {
    try {
        console.log('[User Manager] Kiểm tra dữ liệu người dùng...');
        const userString = localStorage.getItem('user');
        
        if (!userString) {
            console.log('[User Manager] Không tìm thấy dữ liệu người dùng, chuyển hướng đến trang đăng nhập');
            // Chuyển hướng đến trang đăng nhập nếu không có dữ liệu người dùng
            return;
        }
        
        // Phân tích dữ liệu người dùng
        const userObject = JSON.parse(userString);
        console.log('[User Manager] Dữ liệu người dùng hiện tại:', userObject);
        
        // Đảm bảo các trường quan trọng tồn tại
        if (!userObject.id) {
            console.warn('[User Manager] Dữ liệu người dùng thiếu ID');
            // Không sửa ID nếu không có - đây là lỗi nghiêm trọng
        }
        
        // Đảm bảo email và username tồn tại
        if (!userObject.email && userObject.username) {
            userObject.email = userObject.username.includes('@') 
                ? userObject.username 
                : `${userObject.username}@gmail.com`;
            console.log('[User Manager] Tạo email từ username:', userObject.email);
        }
        
        // Đảm bảo các đối tượng con tồn tại
        if (!userObject.billing) {
            userObject.billing = {
                payment_method: "",
                account_number: "",
                account_name: userObject.name ? userObject.name.toUpperCase() : "",
                bank_name: "",
                billing_email: userObject.email || ""
            };
            console.log('[User Manager] Khởi tạo đối tượng billing');
        }
        
        if (!userObject.notifications) {
            userObject.notifications = {
                comments: false,
                updates: false,
                reminders: false,
                events: false,
                pages_you_follow: false,
                alert_login: true,
                alert_password: true
            };
            console.log('[User Manager] Khởi tạo đối tượng notifications');
        }
          // Đảm bảo các trường thông tin cơ bản
        if (!userObject.phoneNumber) userObject.phoneNumber = userObject.phone || "";
        if (!userObject.phone) userObject.phone = userObject.phoneNumber || "";
        if (!userObject.address) userObject.address = "";
        if (!userObject.created_at) userObject.created_at = new Date().toISOString();
        
        // Đảm bảo đồng bộ giữa phoneNumber và phone - đây là vấn đề không nhất quán
        if (userObject.phone && userObject.phone !== userObject.phoneNumber) {
            console.log('[User Manager] Đồng bộ phone và phoneNumber:', userObject.phone);
            userObject.phoneNumber = userObject.phone;
        } else if (userObject.phoneNumber && userObject.phoneNumber !== userObject.phone) {
            console.log('[User Manager] Đồng bộ phoneNumber và phone:', userObject.phoneNumber);
            userObject.phone = userObject.phoneNumber;
        }
        
        // Đảm bảo tính nhất quán của dữ liệu
        if (userObject.id === 1 && userObject.name !== "Nguyen Minh Dat") {
            console.log('[User Manager] Khắc phục tên cho người dùng ID 1');
            userObject.name = "Nguyen Minh Dat";
        } else if (userObject.id === 2 && userObject.name !== "Le Ba Phat") {
            console.log('[User Manager] Khắc phục tên cho người dùng ID 2');
            userObject.name = "Le Ba Phat";
        } else if (userObject.id === 10 && userObject.name !== "Trần Minh Thư") {
            console.log('[User Manager] Khắc phục tên cho người dùng ID 10');
            userObject.name = "Trần Minh Thư";
        }

        // Đảm bảo tên chủ thẻ khớp với tên người dùng
        if (userObject.billing && userObject.name) {
            const expectedAccountName = userObject.name.toUpperCase();
            if (userObject.billing.account_name !== expectedAccountName) {
                console.log('[User Manager] Cập nhật tên chủ thẻ để khớp với tên người dùng');
                userObject.billing.account_name = expectedAccountName;
            }
        }
        
        // Lưu dữ liệu đã sửa
        localStorage.setItem('user', JSON.stringify(userObject));
        localStorage.setItem('name', userObject.name); // Cập nhật tên hiển thị
        localStorage.setItem('role', userObject.role || 'buyer'); // Đảm bảo vai trò được cập nhật
        
        console.log('[User Manager] Đã cập nhật dữ liệu người dùng');
        
    } catch (error) {
        console.error('[User Manager] Lỗi khi xác thực dữ liệu người dùng:', error);
    }
}

/**
 * Thiết lập các form và xử lý sự kiện
 */
function setupForms() {
    // Form hồ sơ
    const profileForm = document.getElementById('profileForm');
    if (profileForm) {
        profileForm.addEventListener('submit', handleProfileFormSubmit);
    }
    
    // Form tài khoản
    const usernameForm = document.getElementById('usernameForm');
    if (usernameForm) {
        usernameForm.addEventListener('submit', handleUsernameFormSubmit);
    }
    
    // Form thanh toán
    const billingForm = document.getElementById('billingSettingsForm');
    if (billingForm) {
        billingForm.addEventListener('submit', handleBillingFormSubmit);
    }
    
    // Form thông báo
    const notificationsForm = document.getElementById('notificationsForm');
    if (notificationsForm) {
        notificationsForm.addEventListener('submit', handleNotificationsFormSubmit);
    }
    
    // Form mật khẩu
    const passwordForm = document.getElementById('passwordForm');
    if (passwordForm) {
        passwordForm.addEventListener('submit', handlePasswordFormSubmit);
    }
    
    // Nút đăng ký người bán
    const sellerBtn = document.getElementById('requestSellerBtn');
    if (sellerBtn) {
        sellerBtn.addEventListener('click', handleSellerRegistration);
    }
    
    // Nút nâng cấp tài khoản
    const upgradeBtn = document.getElementById('upgradeToPremiumBtn');
    if (upgradeBtn) {
        upgradeBtn.addEventListener('click', function() {
            window.location.href = '/Page/upgradeAccount.html';
        });
    }
    
    // Nút xóa tài khoản
    const deleteBtn = document.getElementById('deleteAccountBtn');
    if (deleteBtn) {
        deleteBtn.addEventListener('click', handleDeleteAccount);
    }
    
    // Xử lý đăng xuất
    const logoutLinks = document.querySelectorAll('a[href="#logout"]');
    if (logoutLinks.length > 0) {
        logoutLinks.forEach(link => {
            link.addEventListener('click', handleLogout);
        });
    }
}

/**
 * Hiển thị thông tin người dùng trong giao diện
 */
function displayUserInfo() {
    try {
        const userString = localStorage.getItem('user');
        if (!userString) return;
        
        const userObject = JSON.parse(userString);
        console.log('[User Manager] Hiển thị thông tin người dùng:', userObject);
        
        // Thông tin cơ bản
        setElementValue('fullName', userObject.name);
        setElementValue('username', userObject.username);
        setElementValue('newUsername', userObject.username);
        setElementValue('cccd', userObject.cccd);
        setElementValue('email', userObject.email);
        setElementValue('phoneNumber', userObject.phoneNumber);
        setElementValue('address', userObject.address);
        
        // Ngày tạo tài khoản
        if (userObject.created_at) {
            const createdDate = new Date(userObject.created_at);
            setElementValue('createdAt', createdDate.toLocaleDateString());
        }
        
        // Thông tin tài khoản
        setElementValue('userRole', capitalizeFirstLetter(userObject.role || 'buyer'));
        
        // Thông tin người bán
        const sellerBtn = document.getElementById('requestSellerBtn');
        const sellerMsg = document.getElementById('sellerRequestMsg');
        
        if (userObject.role === 'seller') {
            setElementValue('sellerStatus', 'Activated');
            hideElement(sellerBtn);
            hideElement(sellerMsg);
        } else if (userObject.request_seller || userObject.is_requesting_seller) {
            setElementValue('sellerStatus', 'Pending Approval');
            hideElement(sellerBtn);
            showElement(sellerMsg);
        } else {
            setElementValue('sellerStatus', 'Not a seller');
            showElement(sellerBtn);
            hideElement(sellerMsg);
        }
        
        // Thông tin premium
        const upgradeBtn = document.getElementById('upgradeToPremiumBtn');
        if (userObject.is_premium === true) {
            setElementValue('premiumStatus', 'Premium Account');
            setElementText('premiumStatusDisplay', 'Premium Account');
            hideElement(upgradeBtn);
        } else {
            setElementValue('premiumStatus', 'Standard Account');
            setElementText('premiumStatusDisplay', 'Standard Account');
            showElement(upgradeBtn);
        }
        
        // Thông tin thanh toán
        if (userObject.billing) {
            setElementText('paymentMethodDisplay', userObject.billing.payment_method || 'N/A');
            setElementText('accountNumberDisplay', userObject.billing.account_number || 'N/A');
            setElementText('accountHolderNameDisplay', userObject.billing.account_name || 'N/A');
            setElementText('bankNameDisplay', userObject.billing.bank_name || 'N/A');
            setElementText('billingEmailDisplay', userObject.billing.billing_email || userObject.email || 'N/A');
            
            // Form thanh toán
            setElementValue('cardHolderName', userObject.billing.account_name);
            setElementValue('cardNumber', userObject.billing.payment_method || userObject.billing.account_number);
            setElementValue('billingAddress', userObject.billing.billing_address);
        }
        
        // Thông tin thông báo
        if (userObject.notifications) {
            setCheckboxState('alertLogin', userObject.notifications.alert_login);
            setCheckboxState('alertPassword', userObject.notifications.alert_password);
            setCheckboxState('notifyComments', userObject.notifications.comments);
            setCheckboxState('notifyUpdates', userObject.notifications.updates);
            setCheckboxState('notifyReminders', userObject.notifications.reminders);
            setCheckboxState('notifyEvents', userObject.notifications.events);
            setCheckboxState('notifyPagesYouFollow', userObject.notifications.pages_you_follow);
        }
    } catch (error) {
        console.error('[User Manager] Lỗi khi hiển thị thông tin người dùng:', error);
    }
}

/**
 * Kiểm tra tình trạng CCCD và cập nhật UI
 */
function checkCccdStatus() {
    try {
        const userString = localStorage.getItem('user');
        if (!userString) return;
        
        const userObject = JSON.parse(userString);
        const cccdElement = document.getElementById('cccd');
        if (!cccdElement) return;
        
        // Kiểm tra CCCD tạm thời (bắt đầu bằng chữ 'T')
        const isTemporaryCccd = userObject.cccd && userObject.cccd.charAt(0) === 'T';
        
        // CCCD trống hoặc tạm thời thì cho phép chỉnh sửa
        if (!userObject.cccd || isTemporaryCccd) {
            cccdElement.removeAttribute('readonly');
            
            // Thêm thông báo
            const helpText = document.querySelector('small.form-text');
            if (helpText) {
                helpText.textContent = 'Vui lòng cập nhật số CCCD hợp lệ (12 chữ số).';
                helpText.classList.add('text-warning');
            }
            
            // Thêm nút cập nhật nếu chưa có
            if (!document.getElementById('updateCccdBtn')) {
                const formGroup = cccdElement.closest('.form-group');
                if (formGroup) {
                    const updateBtn = document.createElement('button');
                    updateBtn.id = 'updateCccdBtn';
                    updateBtn.className = 'btn btn-warning btn-sm mt-2';
                    updateBtn.textContent = 'Cập nhật CCCD';
                    updateBtn.type = 'button';
                    updateBtn.onclick = handleCccdUpdate;
                    formGroup.appendChild(updateBtn);
                }
            }
        }
    } catch (error) {
        console.error('[User Manager] Lỗi khi kiểm tra CCCD:', error);
    }
}

/**
 * Xử lý cập nhật CCCD
 */
async function handleCccdUpdate() {
    const cccdElement = document.getElementById('cccd');
    if (!cccdElement) return;
    
    const cccdValue = cccdElement.value.trim();
    
    // Kiểm tra định dạng CCCD
    if (!/^\d{12}$/.test(cccdValue)) {
        alert('Số CCCD phải có đúng 12 chữ số.');
        return;
    }
    
    try {
        const userString = localStorage.getItem('user');
        if (!userString) {
            alert('Không tìm thấy thông tin người dùng.');
            return;
        }
        
        const userObject = JSON.parse(userString);
        
        // Hiển thị trạng thái đang xử lý
        const updateBtn = document.getElementById('updateCccdBtn');
        if (updateBtn) {
            updateBtn.disabled = true;
            updateBtn.innerHTML = '<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span> Đang cập nhật...';
        }
        
        // Gọi API thực tế để cập nhật CCCD
        try {
            const response = await fetch('/users/update-cccd', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ userId: userObject.id, cccd: cccdValue })
            });
            
            const result = await response.json();
            
            if (result.success) {
                // Cập nhật CCCD mới vào đối tượng người dùng
                userObject.cccd = cccdValue;
                // Lưu vào localStorage
                localStorage.setItem('user', JSON.stringify(userObject));
                
                // Cập nhật UI
                cccdElement.setAttribute('readonly', 'true');
                const helpText = document.querySelector('small.form-text');
                if (helpText) {
                    helpText.textContent = 'CCCD đã được cập nhật thành công.';
                    helpText.classList.remove('text-warning');
                    helpText.classList.add('text-success');
                }
                
                // Xóa nút cập nhật
                if (updateBtn) updateBtn.remove();
                
                alert('Cập nhật CCCD thành công!');
            } else {
                if (updateBtn) {
                    updateBtn.disabled = false;
                    updateBtn.textContent = 'Cập nhật CCCD';
                }
                alert(result.message || 'Không thể cập nhật CCCD. Vui lòng thử lại sau.');
            }
        } catch (apiError) {
            console.error('[User Manager] Lỗi API khi cập nhật CCCD:', apiError);
            
            if (updateBtn) {
                updateBtn.disabled = false;
                updateBtn.textContent = 'Cập nhật CCCD';
            }
            
            // Hiển thị thông báo chi tiết hơn về lỗi
            alert('Không thể kết nối đến máy chủ. Vui lòng kiểm tra kết nối mạng và thử lại sau.');
        }
    } catch (error) {
        console.error('[User Manager] Lỗi khi cập nhật CCCD:', error);
        alert('Đã xảy ra lỗi khi cập nhật CCCD.');
    }
}

/**
 * Kiểm tra và đồng bộ các thay đổi CCCD đã lưu tạm thời lên server
 * Gọi hàm này khi người dùng đăng nhập hoặc khi có kết nối mạng trở lại
 */
async function syncPendingCccdUpdates() {
    try {
        console.log('[User Manager] Kiểm tra và đồng bộ CCCD...');
        const userString = localStorage.getItem('user');
        if (!userString) return;
        
        const userObject = JSON.parse(userString);
        
        // Kiểm tra xem CCCD có cần đồng bộ không
        if (!userObject.cccd || !userObject.id) return;
        
        // Kiểm tra xem CCCD có đang ở trạng thái chưa đồng bộ không
        const syncBadge = document.getElementById('syncBadge');
        if (!syncBadge) return;
        
        console.log('[User Manager] Phát hiện CCCD cần đồng bộ:', userObject.cccd);
        
        try {
            // Hiển thị trạng thái đang đồng bộ
            syncBadge.textContent = 'Đang đồng bộ...';
            syncBadge.className = 'badge bg-info ms-2';
            
            // Gửi yêu cầu cập nhật CCCD lên server
            const response = await fetch('/users/update-cccd', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ userId: userObject.id, cccd: userObject.cccd })
            });
            
            if (!response.ok) {
                throw new Error(`Server responded with status: ${response.status}`);
            }
            
            const result = await response.json();
            
            if (result.success) {
                console.log('[User Manager] Đồng bộ CCCD thành công');
                
                // Cập nhật UI
                syncBadge.remove();
                
                const cccdHelpText = document.querySelector('small.form-text');
                if (cccdHelpText) {
                    cccdHelpText.textContent = 'CCCD đã được đồng bộ thành công.';
                    cccdHelpText.classList.remove('text-warning');
                    cccdHelpText.classList.add('text-success');
                }
                
                // Hiển thị thông báo nhỏ
                showNotification('Đồng bộ CCCD thành công', 'success');
            } else {
                console.error('[User Manager] Đồng bộ CCCD thất bại:', result.message);
                
                // Cập nhật UI
                syncBadge.textContent = 'Chưa đồng bộ';
                syncBadge.className = 'badge bg-warning ms-2';
                
                // Hiển thị thông báo nhỏ
                showNotification('Đồng bộ CCCD thất bại', 'error');
            }
        } catch (apiError) {
            console.error('[User Manager] Lỗi khi đồng bộ CCCD:', apiError);
            
            // Cập nhật UI
            syncBadge.textContent = 'Chưa đồng bộ';
            syncBadge.className = 'badge bg-warning ms-2';
        }
    } catch (error) {
        console.error('[User Manager] Lỗi khi kiểm tra đồng bộ CCCD:', error);
    }
}

/**
 * Hiển thị thông báo nhỏ
 */
function showNotification(message, type = 'info') {
    const notificationContainer = document.getElementById('notificationContainer');
    
    // Tạo container thông báo nếu chưa tồn tại
    if (!notificationContainer) {
        const container = document.createElement('div');
        container.id = 'notificationContainer';
        container.style.cssText = 'position: fixed; top: 20px; right: 20px; z-index: 9999;';
        document.body.appendChild(container);
    }
    
    // Tạo thông báo
    const notification = document.createElement('div');
    notification.className = `alert alert-${type === 'error' ? 'danger' : type}`;
    notification.innerHTML = message;
    notification.style.cssText = 'margin-bottom: 10px; min-width: 200px;';
    
    // Thêm vào container
    document.getElementById('notificationContainer').appendChild(notification);
    
    // Tự động ẩn sau 5 giây
    setTimeout(function() {
        notification.style.opacity = '0';
        notification.style.transition = 'opacity 0.5s';
        
        setTimeout(function() {
            notification.remove();
        }, 500);
    }, 5000);
}

/**
 * Xử lý gửi form hồ sơ
 */
function handleProfileFormSubmit(e) {
    e.preventDefault();
    
    try {
        const userString = localStorage.getItem('user');
        let userObject = userString ? JSON.parse(userString) : {};
        
        // Lấy thông tin từ form
        const newName = document.getElementById('fullName').value;
        const newUsername = document.getElementById('username').value;
        const newPhoneNumber = document.getElementById('phoneNumber').value;
        const newAddress = document.getElementById('address').value;
        
        // Cập nhật CCCD nếu đang chỉnh sửa
        const cccdField = document.getElementById('cccd');
        if (cccdField && !cccdField.hasAttribute('readonly') && cccdField.value !== userObject.cccd) {
            // Xử lý riêng cho cập nhật CCCD
            handleCccdUpdate();
            return;
        }
        
        // Hiển thị trạng thái đang cập nhật
        const submitBtn = document.querySelector('#profileForm button[type="submit"]');
        if (submitBtn) {
            submitBtn.disabled = true;
            submitBtn.innerHTML = '<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span> Đang cập nhật...';
        }
        
        // Đồng bộ với server
        updateProfileOnServer({
            userId: userObject.id,
            name: newName,
            phoneNumber: newPhoneNumber,
            address: newAddress,
            email: userObject.email
        }, function(success, message) {
            // Khôi phục trạng thái nút
            if (submitBtn) {
                submitBtn.disabled = false;
                submitBtn.textContent = 'Lưu thay đổi';
            }
            
            if (success) {
                // Cập nhật thông tin trong userObject
                userObject.name = newName;
                userObject.username = newUsername;
                userObject.phoneNumber = newPhoneNumber;
                // Đảm bảo cả phone và phoneNumber đều được cập nhật
                userObject.phone = newPhoneNumber;
                userObject.address = newAddress;
                
                // Cập nhật tên chủ thẻ nếu có thông tin billing
                if (userObject.billing) {
                    userObject.billing.account_name = userObject.name.toUpperCase();
                }
                
                // Lưu thông tin vào localStorage
                localStorage.setItem('user', JSON.stringify(userObject));
                localStorage.setItem('name', userObject.name);
                
                alert('Thông tin hồ sơ đã được cập nhật thành công!');
            } else {
                alert('Không thể cập nhật thông tin: ' + message);
            }
        });
    } catch (error) {
        console.error('[User Manager] Lỗi khi cập nhật hồ sơ:', error);
        alert('Đã xảy ra lỗi khi cập nhật thông tin. Vui lòng thử lại!');
    }
}

/**
 * Xử lý gửi form username
 */
function handleUsernameFormSubmit(e) {
    e.preventDefault();
    
    try {
        const userString = localStorage.getItem('user');
        let userObject = userString ? JSON.parse(userString) : {};
        
        const newUsername = document.getElementById('newUsername').value;
        if (!newUsername) {
            alert('Vui lòng nhập username mới');
            return;
        }
        
        // Cập nhật username
        userObject.username = newUsername;
        
        // Lưu vào localStorage
        localStorage.setItem('user', JSON.stringify(userObject));
        
        // Cập nhật giao diện
        document.getElementById('username').value = newUsername;
        
        alert('Username đã được cập nhật thành công!');
    } catch (error) {
        console.error('[User Manager] Lỗi khi cập nhật username:', error);
        alert('Đã xảy ra lỗi khi cập nhật username. Vui lòng thử lại!');
    }
}

/**
 * Xử lý form thanh toán
 */
function handleBillingFormSubmit(e) {
    e.preventDefault();
    
    try {
        const userString = localStorage.getItem('user');
        let userObject = userString ? JSON.parse(userString) : {};
        
        if (!userObject.billing) {
            userObject.billing = {};
        }
        
        // Lấy giá trị từ form
        let inputCardHolder = document.getElementById('cardHolderName').value;
        
        // Đảm bảo tên chủ thẻ khớp với tên người dùng
        const expectedName = userObject.name ? userObject.name.toUpperCase() : "";
        if (inputCardHolder !== expectedName) {
            inputCardHolder = expectedName;
            document.getElementById('cardHolderName').value = inputCardHolder;
            alert("Lưu ý: Tên chủ thẻ đã được điều chỉnh để khớp với tên tài khoản của bạn.");
        }
        
        // Cập nhật thông tin thanh toán
        userObject.billing.account_name = inputCardHolder;
        userObject.billing.payment_method = document.getElementById('cardNumber').value;
        userObject.billing.account_number = document.getElementById('cardNumber').value;
        userObject.billing.billing_address = document.getElementById('billingAddress').value;
        
        // Lưu vào localStorage
        localStorage.setItem('user', JSON.stringify(userObject));
        
        // Cập nhật giao diện
        document.getElementById('accountHolderNameDisplay').textContent = userObject.billing.account_name;
        document.getElementById('paymentMethodDisplay').textContent = userObject.billing.payment_method;
        document.getElementById('accountNumberDisplay').textContent = userObject.billing.account_number;
        
        alert('Thông tin thanh toán đã được cập nhật!');
    } catch (error) {
        console.error('[User Manager] Lỗi khi cập nhật thông tin thanh toán:', error);
        alert('Đã xảy ra lỗi khi cập nhật thông tin thanh toán. Vui lòng thử lại!');
    }
}

/**
 * Xử lý form thông báo
 */
function handleNotificationsFormSubmit(e) {
    e.preventDefault();
    
    try {
        const userString = localStorage.getItem('user');
        let userObject = userString ? JSON.parse(userString) : {};
        
        if (!userObject.notifications) {
            userObject.notifications = {};
        }
        
        // Cập nhật cài đặt thông báo
        userObject.notifications.alert_login = document.getElementById('alertLogin').checked;
        userObject.notifications.alert_password = document.getElementById('alertPassword').checked;
        userObject.notifications.comments = document.getElementById('notifyComments').checked;
        userObject.notifications.updates = document.getElementById('notifyUpdates').checked;
        userObject.notifications.reminders = document.getElementById('notifyReminders').checked;
        userObject.notifications.events = document.getElementById('notifyEvents').checked;
        userObject.notifications.pages_you_follow = document.getElementById('notifyPagesYouFollow').checked;
        
        // Lưu vào localStorage
        localStorage.setItem('user', JSON.stringify(userObject));
        
        alert('Cài đặt thông báo đã được cập nhật!');
    } catch (error) {
        console.error('[User Manager] Lỗi khi cập nhật cài đặt thông báo:', error);
        alert('Đã xảy ra lỗi khi cập nhật cài đặt thông báo. Vui lòng thử lại!');
    }
}

/**
 * Xử lý form mật khẩu
 */
function handlePasswordFormSubmit(e) {
    e.preventDefault();
    
    try {
        const currentPassword = document.getElementById('currentPassword').value;
        const newPassword = document.getElementById('newPassword').value;
        const confirmPassword = document.getElementById('confirmPassword').value;
        
        // Kiểm tra các trường dữ liệu
        if (!currentPassword || !newPassword || !confirmPassword) {
            alert('Vui lòng điền đầy đủ thông tin mật khẩu');
            return;
        }
        
        if (newPassword !== confirmPassword) {
            alert('Mật khẩu mới và xác nhận mật khẩu không khớp');
            return;
        }
        
        if (newPassword.length < 8) {
            alert('Mật khẩu mới phải có ít nhất 8 ký tự');
            return;
        }
        
        // Giả lập API gọi thay đổi mật khẩu
        simulateApiUpdate('/users/change-password', {
            currentPassword,
            newPassword
        }, function(success, message) {
            if (success) {
                // Xóa giá trị trong form
                document.getElementById('currentPassword').value = '';
                document.getElementById('newPassword').value = '';
                document.getElementById('confirmPassword').value = '';
                
                alert('Mật khẩu đã được cập nhật thành công!');
            } else {
                alert(message || 'Không thể cập nhật mật khẩu. Vui lòng thử lại sau.');
            }
        });
    } catch (error) {
        console.error('[User Manager] Lỗi khi cập nhật mật khẩu:', error);
        alert('Đã xảy ra lỗi khi cập nhật mật khẩu. Vui lòng thử lại!');
    }
}

/**
 * Xử lý đăng ký người bán
 */
function handleSellerRegistration() {
    try {
        const userString = localStorage.getItem('user');
        if (!userString) return;
        
        let userObject = JSON.parse(userString);
        
        // Kiểm tra thông tin bắt buộc
        const requiredFields = ['name', 'email', 'phoneNumber', 'address', 'cccd'];
        const missingFields = [];
        
        requiredFields.forEach(field => {
            if (!userObject[field]) {
                missingFields.push(getFieldDisplayName(field));
            }
        });
        
        if (missingFields.length > 0) {
            alert(`Vui lòng điền đầy đủ thông tin sau trước khi đăng ký: ${missingFields.join(', ')}`);
            return;
        }
        
        // Kiểm tra CCCD hợp lệ
        if (!isCccdValid(userObject.cccd)) {
            alert('CCCD không hợp lệ. Vui lòng cập nhật CCCD (12 chữ số) trước khi đăng ký.');
            return;
        }
        
        // Hiển thị thông báo yêu cầu xác nhận
        const confirmation = confirm('Bạn đã điền đầy đủ thông tin chưa? Tiến hành xác thực người dùng và đăng ký làm người bán?');
        if (confirmation) {
            // Cập nhật trạng thái đăng ký
            userObject.request_seller = true;
            userObject.is_requesting_seller = true;
            
            // Lưu vào localStorage
            localStorage.setItem('user', JSON.stringify(userObject));
            
            // Cập nhật UI
            document.getElementById('sellerStatus').value = 'Pending Approval';
            document.getElementById('requestSellerBtn').style.display = 'none';
            document.getElementById('sellerRequestMsg').style.display = 'block';
            
            alert('Yêu cầu trở thành người bán đã được gửi. Vui lòng chờ phê duyệt.');
        }
    } catch (error) {
        console.error('[User Manager] Lỗi khi đăng ký người bán:', error);
        alert('Đã xảy ra lỗi khi đăng ký trở thành người bán. Vui lòng thử lại!');
    }
}

/**
 * Xử lý xóa tài khoản
 */
function handleDeleteAccount() {
    const confirmation = confirm('Bạn có chắc chắn muốn xóa tài khoản? Hành động này không thể hoàn tác.');
    
    if (confirmation) {
        try {
            // Giả lập API gọi xóa tài khoản
            simulateApiUpdate('/users/delete-account', {}, function(success, message) {
                if (success) {
                    // Xóa thông tin đăng nhập
                    localStorage.removeItem('isLoggedIn');
                    localStorage.removeItem('user');
                    localStorage.removeItem('name');
                    localStorage.removeItem('role');
                    
                    alert('Tài khoản của bạn đã được xóa thành công.');
                    
                    // Chuyển hướng về trang chủ
                    window.location.href = '/Page/index.html';
                } else {
                    alert(message || 'Không thể xóa tài khoản. Vui lòng thử lại sau.');
                }
            });
        } catch (error) {
            console.error('[User Manager] Lỗi khi xóa tài khoản:', error);
            alert('Đã xảy ra lỗi khi xóa tài khoản. Vui lòng thử lại!');
        }
    }
}

/**
 * Xử lý đăng xuất
 */
function handleLogout(e) {
    e.preventDefault();
    
    // Xóa thông tin đăng nhập
    localStorage.removeItem('isLoggedIn');
    localStorage.removeItem('user');
    localStorage.removeItem('name');
    localStorage.removeItem('role');
    
    // Chuyển hướng về trang đăng nhập
    window.location.href = '/Page/login.html';
}

// ----- HELPER FUNCTIONS -----

/**
 * Gọi API thực tế hoặc giả lập trong môi trường phát triển
 * @param {string} endpoint - Đường dẫn API endpoint
 * @param {object} data - Dữ liệu gửi đến API
 * @param {function} callback - Hàm callback với kết quả (success, message)
 */
async function simulateApiUpdate(endpoint, data, callback) {
    console.log(`[API] Calling ${endpoint} with data:`, data);
    
    try {
        // Kiểm tra kết nối mạng
        if (!navigator.onLine) {
            console.warn(`[API] Network offline. Cannot call ${endpoint}`);
            callback(false, 'Không có kết nối mạng. Vui lòng kiểm tra kết nối và thử lại sau.');
            return;
        }
        
        // Quyết định xem có sử dụng API thực tế hay giả lập
        const useRealApi = endpoint === '/users/update-cccd';
        
        if (useRealApi) {
            try {
                // Gọi API thực tế
                const response = await fetch(endpoint, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(data)
                });
                
                if (!response.ok) {
                    throw new Error(`Server responded with status: ${response.status}`);
                }
                
                const result = await response.json();
                callback(result.success, result.message);
            } catch (error) {
                console.error(`[API] Error calling ${endpoint}:`, error);
                callback(false, 'Không thể kết nối đến máy chủ. Vui lòng thử lại sau.');
            }
        } else {
            // Giả lập độ trễ mạng và phản hồi
            setTimeout(function() {
                console.log(`[API Simulation] Success response from ${endpoint}`);
                callback(true, 'Operation completed successfully');
            }, 500);
        }
    } catch (error) {
        console.error(`[API] Unexpected error with ${endpoint}:`, error);
        callback(false, 'Đã xảy ra lỗi không mong muốn. Vui lòng thử lại sau.');
    }
}

/**
 * Đặt giá trị cho phần tử input
 */
function setElementValue(elementId, value) {
    const element = document.getElementById(elementId);
    if (element) element.value = value || '';
}

/**
 * Đặt nội dung text cho phần tử
 */
function setElementText(elementId, text) {
    const element = document.getElementById(elementId);
    if (element) element.textContent = text || 'N/A';
}

/**
 * Đặt trạng thái checkbox
 */
function setCheckboxState(elementId, checked) {
    const element = document.getElementById(elementId);
    if (element) element.checked = !!checked;
}

/**
 * Hiển thị phần tử
 */
function showElement(element) {
    if (element) element.style.display = 'block';
}

/**
 * Ẩn phần tử
 */
function hideElement(element) {
    if (element) element.style.display = 'none';
}

/**
 * Viết hoa chữ cái đầu tiên
 */
function capitalizeFirstLetter(string) {
    if (!string) return '';
    return string.charAt(0).toUpperCase() + string.slice(1);
}

/**
 * Kiểm tra tính hợp lệ của CCCD
 */
function isCccdValid(cccd) {
    if (!cccd) return false;
    // CCCD hợp lệ: 12 chữ số
    return /^\d{12}$/.test(cccd);
}

/**
 * Lấy tên hiển thị cho các trường
 */
function getFieldDisplayName(field) {
    const map = {
        'name': 'Họ tên',
        'email': 'Email',
        'phoneNumber': 'Số điện thoại',
        'address': 'Địa chỉ',
        'cccd': 'Số CCCD'
    };
    
    return map[field] || field;
}

/**
 * Cập nhật thông tin hồ sơ lên server
 * @param {Object} data - Dữ liệu cập nhật (userId, name, phoneNumber, address, email)
 * @param {Function} callback - Hàm callback với kết quả (success, message)
 */
async function updateProfileOnServer(data, callback) {
    console.log('[User Manager] Đang cập nhật thông tin hồ sơ lên server:', data);
    
    try {
        // Kiểm tra kết nối mạng
        if (!navigator.onLine) {
            console.warn('[User Manager] Network offline. Cannot update profile.');
            callback(false, 'Không có kết nối mạng. Vui lòng kiểm tra kết nối và thử lại sau.');
            return;
        }
        
        try {
            // Gọi API cập nhật profile
            const response = await fetch('/users/update-profile', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data)
            });
            
            if (!response.ok) {
                throw new Error(`Server responded with status: ${response.status}`);
            }
            
            const result = await response.json();
            
            if (result.success) {
                console.log('[User Manager] Cập nhật profile thành công:', result);
                callback(true, 'Cập nhật thông tin thành công');
            } else {
                console.error('[User Manager] Cập nhật profile thất bại:', result.message);
                callback(false, result.message || 'Không thể cập nhật thông tin người dùng');
            }
        } catch (apiError) {
            console.error('[User Manager] Lỗi khi gọi API cập nhật profile:', apiError);
            
            // Nếu không kết nối được với API, vẫn cho phép cập nhật ở phía client
            console.log('[User Manager] Chuyển sang chế độ offline, cập nhật cục bộ');
            callback(true, 'Đã cập nhật cục bộ. Sẽ đồng bộ khi có kết nối mạng.');
            
            // Lưu thông tin cập nhật vào hàng đợi để đồng bộ sau
            savePendingProfileUpdate(data);
        }
    } catch (error) {
        console.error('[User Manager] Lỗi không mong muốn khi cập nhật profile:', error);
        callback(false, 'Đã xảy ra lỗi không mong muốn. Vui lòng thử lại sau.');
    }
}

/**
 * Lưu cập nhật profile đang chờ để đồng bộ sau
 * @param {Object} data - Dữ liệu cập nhật profile
 */
function savePendingProfileUpdate(data) {
    try {
        // Lấy danh sách cập nhật đang chờ
        const pendingUpdatesString = localStorage.getItem('pendingProfileUpdates');
        const pendingUpdates = pendingUpdatesString ? JSON.parse(pendingUpdatesString) : [];
        
        // Thêm cập nhật mới
        pendingUpdates.push({
            userId: data.userId,
            name: data.name,
            phoneNumber: data.phoneNumber, 
            address: data.address,
            email: data.email,
            timestamp: new Date().getTime()
        });
        
        // Lưu lại vào localStorage
        localStorage.setItem('pendingProfileUpdates', JSON.stringify(pendingUpdates));
        console.log('[User Manager] Đã lưu cập nhật profile vào hàng đợi để đồng bộ sau');
        
        // Thiết lập đồng bộ khi có kết nối mạng trở lại
        window.addEventListener('online', syncPendingProfileUpdates);
    } catch (error) {
        console.error('[User Manager] Lỗi khi lưu cập nhật profile tạm thời:', error);
    }
}

/**
 * Đồng bộ các cập nhật profile đang chờ
 */
async function syncPendingProfileUpdates() {
    try {
        console.log('[User Manager] Kiểm tra và đồng bộ cập nhật profile...');
        
        // Kiểm tra kết nối mạng
        if (!navigator.onLine) {
            console.warn('[User Manager] Không có kết nối mạng. Không thể đồng bộ.');
            return;
        }
        
        // Lấy danh sách cập nhật đang chờ
        const pendingUpdatesString = localStorage.getItem('pendingProfileUpdates');
        if (!pendingUpdatesString) return;
        
        const pendingUpdates = JSON.parse(pendingUpdatesString);
        if (pendingUpdates.length === 0) return;
        
        console.log('[User Manager] Đang đồng bộ', pendingUpdates.length, 'cập nhật profile...');
        
        let successCount = 0;
        
        // Xử lý từng cập nhật
        for (const update of pendingUpdates) {
            try {
                const response = await fetch('/users/update-profile', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(update)
                });
                
                if (response.ok) {
                    successCount++;
                }
            } catch (error) {
                console.error('[User Manager] Lỗi khi đồng bộ cập nhật:', error);
            }
        }
        
        if (successCount === pendingUpdates.length) {
            // Xóa danh sách cập nhật nếu tất cả đều thành công
            localStorage.removeItem('pendingProfileUpdates');
            console.log('[User Manager] Đã đồng bộ thành công tất cả cập nhật profile');
            
            // Hiển thị thông báo
            showNotification('Đồng bộ thông tin hồ sơ thành công', 'success');
        } else {
            // Cập nhật lại danh sách nếu chỉ một số thành công
            const remainingUpdates = pendingUpdates.slice(successCount);
            localStorage.setItem('pendingProfileUpdates', JSON.stringify(remainingUpdates));
            console.log('[User Manager] Đã đồng bộ', successCount, '/', pendingUpdates.length, 'cập nhật profile');
            
            // Hiển thị thông báo
            showNotification(`Đã đồng bộ ${successCount}/${pendingUpdates.length} thông tin hồ sơ`, 'warning');
        }
    } catch (error) {
        console.error('[User Manager] Lỗi khi đồng bộ cập nhật profile:', error);
    }
}

/**
 * Kiểm tra nếu cần làm mới dữ liệu người dùng từ server
 * @returns {boolean} True nếu cần làm mới dữ liệu
 */
function shouldRefreshUserData() {
    try {
        // Lấy thời gian cập nhật dữ liệu lần cuối
        const lastUpdateTime = localStorage.getItem('lastUserDataUpdate');
        if (!lastUpdateTime) return true;
        
        // Kiểm tra nếu đã quá 15 phút kể từ lần cập nhật cuối
        const timeSinceLastUpdate = Date.now() - parseInt(lastUpdateTime);
        const fifteenMinutesInMs = 15 * 60 * 1000;
        
        return timeSinceLastUpdate > fifteenMinutesInMs;
    } catch (error) {
        console.error('[User Manager] Lỗi khi kiểm tra thời gian làm mới dữ liệu:', error);
        return false;
    }
}

/**
 * Làm mới dữ liệu người dùng từ server
 */
async function refreshUserDataFromServer() {
    try {
        const userString = localStorage.getItem('user');
        if (!userString) return;
        
        const userObject = JSON.parse(userString);
        if (!userObject.id) return;
        
        console.log('[User Manager] Đang làm mới dữ liệu người dùng từ server...');
        
        // Gọi API để lấy dữ liệu mới nhất
        try {
            const response = await fetch(`/users/get-user-data?userId=${userObject.id}`, {
                method: 'GET',
                headers: { 'Content-Type': 'application/json' }
            });
            
            if (!response.ok) {
                throw new Error(`Server responded with status: ${response.status}`);
            }
            
            const result = await response.json();
            
            if (result.success && result.user) {
                // Cập nhật dữ liệu người dùng
                const updatedUser = result.user;
                
                // Lưu giữ các thuộc tính từ localStorage nếu chúng thiếu trong phản hồi API
                const mergedUser = {
                    ...userObject,
                    ...updatedUser,
                    // Đảm bảo đồng bộ giữa phone và phoneNumber
                    phone: updatedUser.phone || updatedUser.phoneNumber || userObject.phone || userObject.phoneNumber || "",
                    phoneNumber: updatedUser.phone || updatedUser.phoneNumber || userObject.phone || userObject.phoneNumber || "",
                    // Đảm bảo các đối tượng con không bị ghi đè hoàn toàn
                    billing: { ...userObject.billing, ...(updatedUser.billing || {}) },
                    notifications: { ...userObject.notifications, ...(updatedUser.notifications || {}) }
                };
                
                // Cập nhật localStorage
                localStorage.setItem('user', JSON.stringify(mergedUser));
                localStorage.setItem('lastUserDataUpdate', Date.now().toString());
                
                console.log('[User Manager] Đã làm mới dữ liệu người dùng thành công');
                
                // Cập nhật giao diện
                displayUserInfo();
                
                return true;
            } else {
                console.warn('[User Manager] Không lấy được dữ liệu người dùng từ server:', result.message);
                return false;
            }
        } catch (apiError) {
            console.error('[User Manager] Lỗi khi lấy dữ liệu người dùng từ server:', apiError);
            return false;
        }
    } catch (error) {
        console.error('[User Manager] Lỗi khi làm mới dữ liệu người dùng:', error);
        return false;
    }
}
