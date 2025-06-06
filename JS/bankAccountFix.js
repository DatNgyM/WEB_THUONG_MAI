/**
 * bankAccountFix.js
 * Script để đảm bảo hiển thị thông tin ngân hàng chính xác trong checkout
 */

// Thực thi ngay khi tải trang
(function() {
    console.log('Bank account fix script loaded');
    
    // Đảm bảo DOM đã sẵn sàng trước khi chạy
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', fixBankAccountInfo);
    } else {
        fixBankAccountInfo();
    }
    
    // Fix thông tin tài khoản ngân hàng sau khi trang đã tải
    window.addEventListener('load', function() {
        console.log('Window loaded, applying bank account fix');
        setTimeout(fixBankAccountInfo, 500);
        setTimeout(fixBankAccountInfo, 1500);
    });
})();

/**
 * Fix thông tin tài khoản ngân hàng trong trang checkout
 */
function fixBankAccountInfo() {
    console.log('Fixing bank account information');
    
    // Thông tin tài khoản ngân hàng chính xác
    const correctBankInfo = {
        bankName: "Vietcombank",
        accountName: "LE BA PHAT",
        accountNumber: "1026666666"
    };
    
    // Cập nhật trong localStorage
    updateLocalStorage(correctBankInfo);
    
    // Cập nhật trong DOM
    updateDOMBankInfo(correctBankInfo);
    
    // Kiểm tra xem payment method đã được tạo chưa
    checkAndFixPaymentMethod(correctBankInfo);
}

/**
 * Cập nhật thông tin tài khoản ngân hàng trong localStorage
 */
function updateLocalStorage(bankInfo) {
    try {
        // Cập nhật trong thông tin người dùng
        const userData = JSON.parse(localStorage.getItem('user')) || {};
        if (!userData.paymentMethods) {
            userData.paymentMethods = {};
        }
        userData.paymentMethods.bankAccount = bankInfo;
        localStorage.setItem('user', JSON.stringify(userData));
        
        // Cập nhật trong thông tin thanh toán
        const paymentInfo = JSON.parse(localStorage.getItem('userPaymentInfo')) || {};
        paymentInfo.bankAccount = bankInfo;
        localStorage.setItem('userPaymentInfo', JSON.stringify(paymentInfo));
        
        console.log('Updated bank account info in localStorage');
    } catch (e) {
        console.error('Error updating localStorage:', e);
    }
}

/**
 * Cập nhật thông tin tài khoản ngân hàng trong DOM
 */
function updateDOMBankInfo(bankInfo) {
    // Tìm các trường input trong phương thức thanh toán ngân hàng
    const bankNameInput = document.getElementById('bankName');
    const accountNameInput = document.getElementById('accountName');
    const accountNumberInput = document.getElementById('accountNumber');
    
    // Cập nhật giá trị nếu tìm thấy
    if (bankNameInput) bankNameInput.value = bankInfo.bankName;
    if (accountNameInput) accountNameInput.value = bankInfo.accountName;
    if (accountNumberInput) accountNumberInput.value = bankInfo.accountNumber;
    
    // Log kết quả
    if (bankNameInput || accountNameInput || accountNumberInput) {
        console.log('Updated bank account fields in DOM');
    } else {
        console.log('Bank account fields not found in DOM yet');
    }
}

/**
 * Kiểm tra và sửa phương thức thanh toán ngân hàng
 */
function checkAndFixPaymentMethod(bankInfo) {
    // Tìm container phương thức thanh toán
    const paymentMethodsContainer = document.querySelector('.payment-methods');
    if (!paymentMethodsContainer) {
        console.log('Payment methods container not found yet');
        return;
    }
    
    // Kiểm tra xem đã có phương thức thanh toán bằng ngân hàng chưa
    let bankMethodExists = document.querySelector('.payment-method.bank-transfer');
    
    if (!bankMethodExists) {
        console.log('Bank payment method not found, creating it');
        
        // Tạo phương thức thanh toán ngân hàng mới
        const bankMethodHTML = `
        <div class="payment-method bank-transfer">
            <label>
                <input type="radio" name="payment" value="bank_transfer">
                <i class="fas fa-university"></i>
                Bank Transfer
            </label>
            <div class="payment-form" style="display: none;">
                <div class="form-group">
                    <label for="bankName" class="small text-muted">Bank Name</label>
                    <input type="text" id="bankName" class="form-control" value="${bankInfo.bankName}" readonly>
                </div>
                <div class="form-group mt-2">
                    <label for="accountName" class="small text-muted">Account Name</label>
                    <input type="text" id="accountName" class="form-control" value="${bankInfo.accountName}" readonly>
                </div>
                <div class="form-group mt-2">
                    <label for="accountNumber" class="small text-muted">Account Number</label>
                    <input type="text" id="accountNumber" class="form-control" value="${bankInfo.accountNumber}" readonly>
                </div>
            </div>
        </div>`;
        
        // Thêm vào container
        paymentMethodsContainer.insertAdjacentHTML('beforeend', bankMethodHTML);
        console.log('Bank payment method added successfully');
        
        // Thêm event listener cho radio button
        const bankTransferRadio = document.querySelector('input[name="payment"][value="bank_transfer"]');
        if (bankTransferRadio && typeof handlePaymentMethodChange === 'function') {
            bankTransferRadio.addEventListener('change', handlePaymentMethodChange);
        }
    } else {
        console.log('Bank payment method exists, updating values');
        
        // Cập nhật giá trị
        const bankNameInput = bankMethodExists.querySelector('#bankName');
        const accountNameInput = bankMethodExists.querySelector('#accountName');
        const accountNumberInput = bankMethodExists.querySelector('#accountNumber');
        
        if (bankNameInput) bankNameInput.value = bankInfo.bankName;
        if (accountNameInput) accountNameInput.value = bankInfo.accountName;
        if (accountNumberInput) accountNumberInput.value = bankInfo.accountNumber;
    }
}

// Sửa đoạn code để lấy thông tin từ đúng user hiện tại
function updateBankAccountFields() {
  // Lấy thông tin user hiện tại
  const currentUser = JSON.parse(localStorage.getItem('currentUser'));
  
  if (!currentUser || !currentUser.id) {
    console.log('No user logged in, not updating bank fields');
    return;
  }
  
  // Thêm log để debug
  console.log('Current user:', currentUser);
  
  // Lấy thông tin tài khoản ngân hàng từ server cho user hiện tại
  fetch(`/api/billing/${currentUser.id}`)
    .then(response => response.json())
    .then(data => {
      console.log('Bank data from server:', data);
      
      if (data.success && data.account) {
        // Cập nhật đúng thông tin từ server
        document.getElementById('bankName').value = data.account.bank_name || '';
        document.getElementById('accountName').value = data.account.account_name || '';
        document.getElementById('accountNumber').value = data.account.account_number || '';
        
        // Lưu thông tin này vào localStorage
        if (!currentUser.bankAccount) currentUser.bankAccount = {};
        currentUser.bankAccount.bankName = data.account.bank_name;
        currentUser.bankAccount.accountName = data.account.account_name;
        currentUser.bankAccount.accountNumber = data.account.account_number;
        localStorage.setItem('currentUser', JSON.stringify(currentUser));
        
        console.log('Updated bank fields from server data');
      } else {
        // Nếu server không có dữ liệu, xóa trống các trường
        document.getElementById('bankName').value = '';
        document.getElementById('accountName').value = '';
        document.getElementById('accountNumber').value = '';
        console.log('Cleared bank fields (no server data)');
      }
    })
    .catch(error => {
      console.error('Error fetching bank account info:', error);
    });
}
