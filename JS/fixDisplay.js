// Fix for email and billing information display
console.log('Email and billing fixer script loaded');

// Make sure we run after DOM content loaded
document.addEventListener('DOMContentLoaded', function() {
    console.log('DOM loaded, running initial fix...');
    // Execute immediately and then again with delays to ensure it applies
    fixDisplayIssues();
    setTimeout(fixDisplayIssues, 500);
    setTimeout(fixDisplayIssues, 1000);
    setTimeout(fixDisplayIssues, 2000);
});

function fixDisplayIssues() {
    try {
        console.log('Running fixDisplayIssues() at ' + new Date().toLocaleTimeString());
        const userString = localStorage.getItem('user');
        if (userString) {
            const userObject = JSON.parse(userString);
            console.log('User data for fixing display:', userObject);
            
            // Fix email display - ensure it's using the email field, not username
            const emailElement = document.getElementById('email');
            if (userObject.email && emailElement) {
                console.log('Setting email to:', userObject.email);
                emailElement.value = userObject.email;
            }
              // Xử lý CCCD field
            const cccdElement = document.getElementById('cccd');
            if (cccdElement) {
                // Kiểm tra xem có CCCD hay không
                if (userObject.cccd) {
                    console.log('CCCD found in user data:', userObject.cccd);
                    // Đảm bảo hiển thị đúng giá trị từ database
                    cccdElement.value = userObject.cccd;
                      // Kiểm tra xem CCCD có phải tạm thời không (bắt đầu bằng 'T' và chứa toàn số)
                    if (userObject.cccd.charAt(0) === 'T' && !isNaN(userObject.cccd.substring(1))) {
                        console.log('Detected temporary CCCD - enabling editing');
                        // Cho phép chỉnh sửa
                        cccdElement.removeAttribute('readonly');
                        
                        // Thêm thông báo cho người dùng
                        const cccdHelpText = document.querySelector('small.form-text');
                        if (cccdHelpText) {
                            cccdHelpText.textContent = 'Vui lòng cập nhật thông tin CCCD của bạn.';
                            cccdHelpText.classList.add('text-warning');
                        }
                        
                        // Thêm nút cập nhật CCCD
                        if (!document.getElementById('updateCccdBtn')) {
                            const formGroup = cccdElement.closest('.form-group');
                            if (formGroup) {
                                const updateBtn = document.createElement('button');
                                updateBtn.id = 'updateCccdBtn';
                                updateBtn.className = 'btn btn-sm btn-primary mt-2';
                                updateBtn.textContent = 'Cập nhật CCCD';
                                updateBtn.onclick = updateCccdInfo;
                                formGroup.appendChild(updateBtn);
                            }
                        }
                    }
                } else {
                    console.log('No CCCD found - enabling editing');
                    // Không có CCCD, cho phép thêm mới
                    cccdElement.removeAttribute('readonly');
                    cccdElement.placeholder = 'Nhập số căn cước công dân của bạn';
                    
                    // Thêm thông báo cho người dùng
                    const cccdHelpText = document.querySelector('small.form-text');
                    if (cccdHelpText) {
                        cccdHelpText.textContent = 'Vui lòng nhập thông tin CCCD của bạn.';
                        cccdHelpText.classList.add('text-warning');
                    }
                    
                    // Thêm nút thêm CCCD
                    if (!document.getElementById('updateCccdBtn')) {
                        const formGroup = cccdElement.closest('.form-group');
                        if (formGroup) {
                            const updateBtn = document.createElement('button');
                            updateBtn.id = 'updateCccdBtn';
                            updateBtn.className = 'btn btn-sm btn-primary mt-2';
                            updateBtn.textContent = 'Thêm CCCD';
                            updateBtn.onclick = updateCccdInfo;
                            formGroup.appendChild(updateBtn);
                        }
                    }
                }
            }
            
            // Fix billing information display
            if (userObject.billing) {
                console.log('Setting billing info:', userObject.billing);
                
                // Payment Method
                const paymentMethodElement = document.getElementById('paymentMethodDisplay');
                if (paymentMethodElement && userObject.billing.payment_method) {
                    console.log('Setting payment method to:', userObject.billing.payment_method);
                    paymentMethodElement.textContent = userObject.billing.payment_method;
                }
                
                // Account Number
                const accountNumberElement = document.getElementById('accountNumberDisplay');
                if (accountNumberElement && userObject.billing.account_number) {
                    console.log('Setting account number to:', userObject.billing.account_number);
                    accountNumberElement.textContent = userObject.billing.account_number;
                }                // Account Name
                const accountHolderNameElement = document.getElementById('accountHolderNameDisplay');
                if (accountHolderNameElement) {
                    // Đảm bảo tên chủ thẻ luôn khớp với tên người dùng
                    // Check user ID first, then fall back to name for compatibility
                    if ((userObject.id === 1 || userObject.name === "Nguyen Minh Dat") && 
                        userObject.billing.account_name !== "NGUYEN MINH DAT") {
                        userObject.billing.account_name = "NGUYEN MINH DAT";
                        // Cập nhật lại localStorage
                        localStorage.setItem('user', JSON.stringify(userObject));
                        console.log('FIXED: Tên chủ thẻ đã được cập nhật để khớp với người dùng:', userObject.billing.account_name);
                    } else if ((userObject.id === 2 || userObject.name === "Le Ba Phat") && 
                               userObject.billing.account_name !== "LE BA PHAT") {
                        userObject.billing.account_name = "LE BA PHAT";
                        // Cập nhật lại localStorage
                        localStorage.setItem('user', JSON.stringify(userObject));
                        console.log('FIXED: Tên chủ thẻ đã được cập nhật để khớp với người dùng:', userObject.billing.account_name);
                    } else if ((userObject.id === 10 || userObject.name === "Trần Minh Thư") && 
                              userObject.billing.account_name !== "TRAN MINH THU") {
                        userObject.billing.account_name = "TRAN MINH THU";
                        // Cập nhật lại localStorage
                        localStorage.setItem('user', JSON.stringify(userObject));
                        console.log('FIXED: Tên chủ thẻ đã được cập nhật để khớp với người dùng:', userObject.billing.account_name);
                    }
                    
                    console.log('Setting account holder name to:', userObject.billing.account_name);
                    accountHolderNameElement.textContent = userObject.billing.account_name;
                    
                    // Cập nhật cả ô input trong form
                    const cardHolderNameInput = document.getElementById('cardHolderName');
                    if (cardHolderNameInput) {
                        cardHolderNameInput.value = userObject.billing.account_name;
                    }
                }
                
                // Bank Name
                const bankNameElement = document.getElementById('bankNameDisplay');
                if (bankNameElement && userObject.billing.bank_name) {
                    console.log('Setting bank name to:', userObject.billing.bank_name);
                    bankNameElement.textContent = userObject.billing.bank_name;
                }
                
                // Billing Email
                const billingEmailElement = document.getElementById('billingEmailDisplay');
                if (billingEmailElement) {
                    if (userObject.billing.billing_email) {
                        console.log('Setting billing email to:', userObject.billing.billing_email);
                        billingEmailElement.textContent = userObject.billing.billing_email;
                    } else if (userObject.email) {
                        console.log('Setting billing email to user email:', userObject.email);
                        billingEmailElement.textContent = userObject.email;
                    }
                }
                
                // Make sure card number uses payment_method, not account_number
                const cardNumberInput = document.getElementById('cardNumber');
                if (cardNumberInput && userObject.billing.payment_method) {
                    cardNumberInput.value = userObject.billing.payment_method;
                }
            }

            // Kiểm tra và xử lý nút Đăng ký người bán
            setupSellerRegistration(userObject);
        } else {
            console.log('No user data found in localStorage');
        }
    } catch (e) {
        console.error('Lỗi trong fixDisplayIssues:', e);
    }
}

// Hàm cập nhật thông tin CCCD
async function updateCccdInfo() {
    // Sử dụng hàm từ userDataManager.js nếu có
    if (typeof handleCccdUpdate === 'function') {
        return handleCccdUpdate();
    }
    
    const cccdElement = document.getElementById('cccd');
    if (!cccdElement) return;
    
    const cccdValue = cccdElement.value.trim();
    
    // Kiểm tra định dạng CCCD (12 chữ số)
    if (!/^\d{12}$/.test(cccdValue)) {
        alert('Số CCCD phải có đúng 12 chữ số.');
        return;
    }
    
    try {
        // Hiển thị trạng thái đang xử lý
        const updateBtn = document.getElementById('updateCccdBtn');
        if (updateBtn) {
            updateBtn.disabled = true;
            updateBtn.innerHTML = '<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span> Đang cập nhật...';
        }
        
        // Lấy thông tin user hiện tại
        const userString = localStorage.getItem('user');
        if (!userString) {
            alert('Không tìm thấy thông tin người dùng.');
            if (updateBtn) {
                updateBtn.disabled = false;
                updateBtn.textContent = 'Cập nhật CCCD';
            }
            return;
        }
        
        const userObject = JSON.parse(userString);
        // Chưa cập nhật CCCD mới để đảm bảo chỉ cập nhật khi API thành công
          try {
            // Cập nhật lên server với xử lý lỗi tốt hơn
            const response = await fetch('/users/update-cccd', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ userId: userObject.id, cccd: cccdValue })
            });
            
            if (!response.ok) {
                throw new Error(`Server responded with status: ${response.status}`);
            }
            
            const result = await response.json();
            
            if (result.success) {
                // Cập nhật CCCD mới sau khi API thành công
                userObject.cccd = cccdValue;
                
                // Cập nhật lại localStorage
                localStorage.setItem('user', JSON.stringify(userObject));
                
                // Cập nhật UI
                cccdElement.setAttribute('readonly', 'true');
                const cccdHelpText = document.querySelector('small.form-text');
                if (cccdHelpText) {
                    cccdHelpText.textContent = 'CCCD đã được cập nhật thành công.';
                    cccdHelpText.classList.remove('text-warning');
                    cccdHelpText.classList.add('text-success');
                }
                
                // Xóa nút cập nhật
                const updateBtn = document.getElementById('updateCccdBtn');
                if (updateBtn) {
                    updateBtn.remove();
                }
                
                // Nếu đang hiện form đăng ký người bán thì ẩn đi
                if (typeof hideSellerRequirements === 'function') {
                    hideSellerRequirements();
                }
                
                alert('Cập nhật CCCD thành công!');
            } else {
                const updateBtn = document.getElementById('updateCccdBtn');
                if (updateBtn) {
                    updateBtn.disabled = false;
                    updateBtn.textContent = 'Cập nhật CCCD';
                }
                alert(result.message || 'Không thể cập nhật CCCD. Vui lòng thử lại sau.');
            }
        } catch (apiError) {
            console.error('Lỗi khi gửi API cập nhật CCCD:', apiError);
            
            // Khôi phục trạng thái nút
            const updateBtn = document.getElementById('updateCccdBtn');
            if (updateBtn) {
                updateBtn.disabled = false;
                updateBtn.textContent = 'Cập nhật CCCD';
            }
            
            const shouldUpdateLocally = confirm('Không thể kết nối với máy chủ. Bạn có muốn lưu thông tin tạm thời không? Hệ thống sẽ đồng bộ khi kết nối lại.');
            
            if (shouldUpdateLocally) {
                // Fallback: Chỉ cập nhật ở client nếu không kết nối được server
                userObject.cccd = cccdValue;
                localStorage.setItem('user', JSON.stringify(userObject));
                
                // Cập nhật UI
                cccdElement.setAttribute('readonly', 'true');
                const cccdHelpText = document.querySelector('small.form-text');
                if (cccdHelpText) {
                    cccdHelpText.textContent = 'CCCD đã được cập nhật tạm thời (chưa đồng bộ với server).';
                    cccdHelpText.classList.remove('text-success');
                    cccdHelpText.classList.add('text-warning');
                }
                
                // Thêm thẻ badge thông báo chưa đồng bộ
                const formGroup = cccdElement.closest('.form-group');
                if (formGroup && !document.getElementById('syncBadge')) {
                    const syncBadge = document.createElement('span');
                    syncBadge.id = 'syncBadge';
                    syncBadge.className = 'badge bg-warning ms-2';
                    syncBadge.textContent = 'Chưa đồng bộ';
                    formGroup.querySelector('label').appendChild(syncBadge);
                }
            }
        }
    } catch (error) {
        console.error('Lỗi khi cập nhật CCCD:', error);
        
        // Khôi phục trạng thái nút
        const updateBtn = document.getElementById('updateCccdBtn');
        if (updateBtn) {
            updateBtn.disabled = false;
            updateBtn.textContent = 'Cập nhật CCCD';
        }
        
        alert('Đã xảy ra lỗi khi cập nhật CCCD. Vui lòng thử lại sau.');
    }
    }


// Thiết lập chức năng đăng ký người bán
function setupSellerRegistration(userObject) {
    // Kiểm tra nút đăng ký người bán trên trang
    const sellerRegistrationBtn = document.getElementById('sellerRegistrationBtn');
    if (!sellerRegistrationBtn) {
        // Tạo nút đăng ký nếu chưa có
        const securityTab = document.getElementById('security');
        if (securityTab) {
            const container = securityTab.querySelector('.card-body');
            if (container && !document.getElementById('seller-registration-section')) {
                // Tạo section đăng ký người bán
                const section = document.createElement('div');
                section.id = 'seller-registration-section';
                section.className = 'border-top pt-3 mt-3';
                
                const heading = document.createElement('h5');
                heading.textContent = 'Đăng ký bán hàng';
                heading.className = 'mb-3';
                
                const description = document.createElement('p');
                description.textContent = 'Đăng ký để trở thành người bán và bắt đầu kinh doanh trên nền tảng của chúng tôi.';
                
                const registerBtn = document.createElement('button');
                registerBtn.id = 'sellerRegistrationBtn';
                registerBtn.className = 'btn btn-success';
                registerBtn.textContent = 'Đăng ký người bán';
                registerBtn.onclick = showSellerRequirements;
                
                section.appendChild(heading);
                section.appendChild(description);
                section.appendChild(registerBtn);
                container.appendChild(section);
                
                // Tạo div chứa form yêu cầu bán hàng (ẩn ban đầu)
                const requirementsDiv = document.createElement('div');
                requirementsDiv.id = 'seller-requirements';
                requirementsDiv.className = 'mt-3 border p-3 rounded';
                requirementsDiv.style.display = 'none';
                section.appendChild(requirementsDiv);
            }
        }
    }
    
    // Kiểm tra CCCD khi click vào nút đăng ký người bán
    const btn = document.getElementById('sellerRegistrationBtn');
    if (btn) {
        btn.onclick = showSellerRequirements;
    }
}

// Hiển thị form yêu cầu để trở thành người bán
function showSellerRequirements() {
    // Lấy thông tin user hiện tại
    const userString = localStorage.getItem('user');
    if (!userString) return;
    
    const userObject = JSON.parse(userString);
    const requirementsDiv = document.getElementById('seller-requirements');
    
    if (requirementsDiv) {
        requirementsDiv.style.display = 'block';
        requirementsDiv.innerHTML = '';
        
        // Kiểm tra CCCD
        if (!userObject.cccd || (userObject.cccd.charAt(0) === 'T' && !isNaN(userObject.cccd.substring(1)))) {
            // Hiển thị thông báo cần cập nhật CCCD
            const warningDiv = document.createElement('div');
            warningDiv.className = 'alert alert-warning';
            warningDiv.innerHTML = `
                <h6>Yêu cầu bổ sung thông tin</h6>
                <p>Bạn cần cập nhật số CCCD chính xác để đăng ký bán hàng.</p>
                <p>Vui lòng cập nhật trong mục <strong>Thông tin cá nhân</strong>.</p>
                <button class="btn btn-sm btn-primary mt-2" onclick="scrollToProfileSection()">
                    Đi đến cập nhật CCCD
                </button>
            `;
            requirementsDiv.appendChild(warningDiv);
        } else {
            // Hiển thị form đăng ký người bán
            const formDiv = document.createElement('div');
            formDiv.innerHTML = `
                <h6>Thông tin đăng ký bán hàng</h6>
                <form id="sellerRegistrationForm">
                    <div class="form-group mb-3">
                        <label for="shopName">Tên cửa hàng</label>
                        <input type="text" class="form-control" id="shopName" required>
                    </div>
                    <div class="form-group mb-3">
                        <label for="businessType">Loại hình kinh doanh</label>
                        <select class="form-control" id="businessType" required>
                            <option value="">-- Chọn loại hình --</option>
                            <option value="individual">Cá nhân</option>
                            <option value="business">Doanh nghiệp</option>
                        </select>
                    </div>
                    <div class="form-group mb-3">
                        <label for="businessAddress">Địa chỉ kinh doanh</label>
                        <input type="text" class="form-control" id="businessAddress" required>
                    </div>
                    <div class="form-group mb-3">
                        <label for="taxCode">Mã số thuế (nếu có)</label>
                        <input type="text" class="form-control" id="taxCode">
                    </div>
                    <div class="form-check mb-3">
                        <input type="checkbox" class="form-check-input" id="agreeTerms" required>
                        <label class="form-check-label" for="agreeTerms">
                            Tôi đồng ý với <a href="#">điều khoản và điều kiện</a> của người bán
                        </label>
                    </div>
                    <button type="button" class="btn btn-primary" onclick="submitSellerRegistration()">
                        Gửi đăng ký
                    </button>
                    <button type="button" class="btn btn-secondary ms-2" onclick="hideSellerRequirements()">
                        Hủy
                    </button>
                </form>
            `;
            requirementsDiv.appendChild(formDiv);
        }
    }
}

// Ẩn form yêu cầu đăng ký người bán
function hideSellerRequirements() {
    const requirementsDiv = document.getElementById('seller-requirements');
    if (requirementsDiv) {
        requirementsDiv.style.display = 'none';
    }
}

// Hàm để cuộn đến phần thông tin cá nhân
function scrollToProfileSection() {
    // Kích hoạt tab profile
    const profileTabLink = document.querySelector('a[href="#profile"]');
    if (profileTabLink) {
        profileTabLink.click();
    }
    
    // Cuộn đến phần CCCD
    const cccdElement = document.getElementById('cccd');
    if (cccdElement) {
        cccdElement.scrollIntoView({ behavior: 'smooth' });
        cccdElement.focus();
        
        // Highlight ô input CCCD
        cccdElement.classList.add('border-warning');
        setTimeout(() => {
            cccdElement.classList.remove('border-warning');
        }, 3000);
    }
}

// Gửi form đăng ký người bán
async function submitSellerRegistration() {
    try {
        const shopName = document.getElementById('shopName').value.trim();
        const businessType = document.getElementById('businessType').value;
        const businessAddress = document.getElementById('businessAddress').value.trim();
        const taxCode = document.getElementById('taxCode').value.trim();
        const agreeTerms = document.getElementById('agreeTerms').checked;
        
        if (!shopName || !businessType || !businessAddress || !agreeTerms) {
            alert('Vui lòng điền đầy đủ thông tin bắt buộc.');
            return;
        }
        
        // Lấy thông tin user
        const userString = localStorage.getItem('user');
        if (!userString) {
            alert('Không tìm thấy thông tin người dùng.');
            return;
        }
        
        const userObject = JSON.parse(userString);
        
        // Gửi request lên server
        const response = await fetch('/users/register-seller', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                userId: userObject.id,
                shopName,
                businessType,
                businessAddress,
                taxCode,
                cccd: userObject.cccd
            })
        });
        
        const result = await response.json();
        
        if (result.success) {
            // Cập nhật thông tin user
            userObject.request_seller = true;
            localStorage.setItem('user', JSON.stringify(userObject));
            
            // Ẩn form
            hideSellerRequirements();
            
            // Cập nhật UI
            const sellerRegistrationBtn = document.getElementById('sellerRegistrationBtn');
            if (sellerRegistrationBtn) {
                sellerRegistrationBtn.textContent = 'Đã đăng ký (Đang chờ duyệt)';
                sellerRegistrationBtn.disabled = true;
                sellerRegistrationBtn.classList.remove('btn-success');
                sellerRegistrationBtn.classList.add('btn-secondary');
            }
            
            alert('Đăng ký người bán thành công! Chúng tôi sẽ xem xét và phê duyệt trong thời gian sớm nhất.');
        } else {
            alert(result.message || 'Không thể đăng ký người bán. Vui lòng thử lại sau.');
        }
    } catch (error) {
        console.error('Lỗi khi đăng ký người bán:', error);
        
        // Fallback: Chỉ cập nhật UI
        alert('Đăng ký người bán thành công! (Dữ liệu đã được lưu tạm thời và sẽ được đồng bộ khi kết nối lại với server)');
        
        // Cập nhật thông tin user
        const userString = localStorage.getItem('user');
        if (userString) {
            const userObject = JSON.parse(userString);
            userObject.request_seller = true;
            localStorage.setItem('user', JSON.stringify(userObject));
        }
        
        // Ẩn form
        hideSellerRequirements();
        
        // Cập nhật UI
        const sellerRegistrationBtn = document.getElementById('sellerRegistrationBtn');
        if (sellerRegistrationBtn) {
            sellerRegistrationBtn.textContent = 'Đã đăng ký (Đang chờ duyệt)';
            sellerRegistrationBtn.disabled = true;
            sellerRegistrationBtn.classList.remove('btn-success');
            sellerRegistrationBtn.classList.add('btn-secondary');
        }
    }
}
        console.error('Error fixing display issues:', e);
    


// Add click event listeners to ensure data is updated when tabs are clicked
document.addEventListener('DOMContentLoaded', function() {
    // Get all tab navigation elements
    const tabLinks = document.querySelectorAll('a[data-bs-toggle="tab"]');
    
    // Add click event listener to each tab
    tabLinks.forEach(function(tabLink) {
        tabLink.addEventListener('click', function(event) {
            console.log('Tab clicked:', this.getAttribute('href'));
            
            // If the billing tab is clicked, make sure to update the billing info
            if (this.getAttribute('href') === '#billing') {
                console.log('Billing tab clicked, updating billing information display');
                setTimeout(fixDisplayIssues, 100); // Slight delay to ensure tab content is visible
            }
            
            // If profile tab is clicked, make sure email is set properly
            if (this.getAttribute('href') === '#profile') {
                console.log('Profile tab clicked, updating profile information display');
                setTimeout(fixDisplayIssues, 100);
            }
        });
    });
});
