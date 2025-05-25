// Kiểm tra người dùng đã đăng nhập hay chưa
function checkLoginStatus() {
    const isLoggedIn = localStorage.getItem('isLoggedIn');
    const userData = JSON.parse(localStorage.getItem('user'));
    
    if (!isLoggedIn || !userData) {
        console.log('Người dùng chưa đăng nhập, chuyển hướng đến trang đăng nhập');
        localStorage.setItem('redirectAfterLogin', window.location.href);
        window.location.href = '/Page/login.html';
        return false;
    }
    return true;
}

// Get cart items from localStorage
let cart = JSON.parse(localStorage.getItem('cartItems')) || [];
// Kiểm tra xem người dùng đã đăng nhập chưa
const isLoggedIn = checkLoginStatus();

// DOM Elements
const orderItemsContainer = document.getElementById('orderItems');
const subtotalElement = document.getElementById('subtotal');
const shippingElement = document.getElementById('shipping');
const taxElement = document.getElementById('tax');
const totalElement = document.getElementById('total');
const placeOrderButton = document.getElementById('placeOrderBtn');
const savedAddressesGrid = document.querySelector('.saved-addresses-grid');
const addNewAddressButton = document.getElementById('addNewAddress');

// Payment method elements
const creditCardRadio = document.getElementById('credit-card');
const paypalRadio = document.getElementById('paypal');
const creditCardForm = document.getElementById('credit-card-form');

// Delivery option elements
const standardDelivery = document.getElementById('standard');
const expressDelivery = document.getElementById('express');

// Load saved addresses
function loadSavedAddresses() {
    // Lấy thông tin người dùng từ localStorage
    const userData = JSON.parse(localStorage.getItem('user'));
    if (!userData) return;
    
    // Lấy địa chỉ mặc định từ thông tin người dùng
    const defaultAddress = userData.address;
    
    // Cập nhật địa chỉ đã lưu
    const savedAddressSpan = document.getElementById('savedAddress');
    if (savedAddressSpan && defaultAddress) {
        savedAddressSpan.textContent = defaultAddress;
    }
    
    // Lấy các địa chỉ đã lưu khác
    const savedAddresses = JSON.parse(localStorage.getItem('userAddresses')) || [];
    
    // Nếu không có địa chỉ được lưu trước đó, thoát khỏi hàm
    if (savedAddresses.length === 0) return;
    
    // Chỉ hiển thị các địa chỉ không phải mặc định
    savedAddresses.forEach((address, index) => {
        // Bỏ qua địa chỉ mặc định vì đã hiển thị ở trên
        if (address.isDefault) return;
        
        const addressId = `address-${index + 2}`; // +2 vì đã có address1
        
        const addressHTML = `
        <div class="saved-address">
            <input type="radio" name="address" id="${addressId}">
            <label for="${addressId}">
                <strong>${address.name}</strong><br>
                <span class="text-muted">${address.address}</span>
            </label>
        </div>`;
        
        const addNewAddressBtn = document.getElementById('addNewAddress');
        if (addNewAddressBtn) {
            addNewAddressBtn.insertAdjacentHTML('beforebegin', addressHTML);
        }
    });
}

// Display cart items
function displayOrderItems() {
    if (!orderItemsContainer) return;
    
    orderItemsContainer.innerHTML = '';
    let subtotal = 0;
    
    // Kiểm tra nếu giỏ hàng trống
    if (cart.length === 0) {
        orderItemsContainer.innerHTML = '<p class="text-center py-3">Your cart is empty</p>';
        updateOrderSummary(0);
        return;
    }

    cart.forEach(item => {
        const itemTotal = item.price * item.quantity;
        subtotal += itemTotal;
        
        const itemHTML = `
        <div class="order-item">
            <div class="item-image">
                <img src="${item.image || 'https://via.placeholder.com/60'}" alt="${item.name}">
            </div>
            <div class="item-details">
                <div class="item-name">${item.name}</div>
                <div class="item-variant">${item.variant || ''}</div>
                <div class="item-quantity">Qty: ${item.quantity}</div>
            </div>
            <div class="item-price">$${itemTotal.toFixed(2)}</div>
        </div>`;
        
        orderItemsContainer.insertAdjacentHTML('beforeend', itemHTML);
    });

    updateOrderSummary(subtotal);
}

// Update order summary calculations
function updateOrderSummary(subtotal) {
    // Xác định phí vận chuyển dựa trên phương thức vận chuyển được chọn
    const expressSelected = document.querySelector('input[name="delivery"][value="express"]')?.checked;
    const shipping = expressSelected ? 9.99 : 0;
    
    // Tính thuế (10%)
    const tax = subtotal * 0.1;
    
    // Tính giảm giá nếu có
    let discount = 0;
    const discountElement = document.getElementById('discount-amount');
    if (discountElement) {
        discount = parseFloat(discountElement.textContent.replace('-$', '')) || 0;
    }
    
    // Tính tổng tiền
    const total = subtotal + shipping + tax - discount;

    // Cập nhật hiển thị
    if (subtotalElement) subtotalElement.textContent = `$${subtotal.toFixed(2)}`;
    if (shippingElement) shippingElement.textContent = shipping ? `$${shipping.toFixed(2)}` : 'Free';
    if (taxElement) taxElement.textContent = `$${tax.toFixed(2)}`;
    if (totalElement) totalElement.textContent = `$${total.toFixed(2)}`;
}

// Handle delivery option changes
function handleDeliveryOptionChange() {
    if (!subtotalElement) return;
    const subtotal = parseFloat(subtotalElement.textContent.replace('$', ''));
    updateOrderSummary(subtotal);
}

// Form validation
function validateForm() {
    // Kiểm tra phương thức thanh toán được chọn
    const selectedPayment = document.querySelector('input[name="payment"]:checked');
    if (!selectedPayment) {
        alert('Please select a payment method');
        return false;
    }
    
    // Nếu là thanh toán bằng thẻ tín dụng
    if (selectedPayment.value === 'credit') {
        const cardNumber = document.getElementById('cardNumber');
        const cardExpiry = document.getElementById('cardExpiry');
        const cardCvv = document.getElementById('cardCvv');
        
        // Kiểm tra nếu là thẻ mới (không phải thẻ đã lưu)
        if (cardNumber && !cardNumber.hasAttribute('data-original')) {
            if (!cardNumber.value || !cardExpiry.value || !cardCvv.value) {
                alert('Please fill in all card details');
                return false;
            }
            
            // Thêm logic kiểm tra định dạng thẻ tín dụng ở đây nếu cần
        }
    }
    
    return true;
}

// Handle payment method changes
function handlePaymentMethodChange() {
    // Lấy tất cả các payment form
    const paymentForms = document.querySelectorAll('.payment-form');
    if (!paymentForms) return;
    
    // Ẩn tất cả các form
    paymentForms.forEach(form => {
        form.style.display = 'none';
    });
    
    // Hiển thị form của phương thức được chọn
    const selectedPaymentMethod = document.querySelector('input[name="payment"]:checked');
    if (selectedPaymentMethod) {
        const parentMethod = selectedPaymentMethod.closest('.payment-method');
        const form = parentMethod?.querySelector('.payment-form');
        if (form) {
            form.style.display = 'block';
        }
    }
}

// Handle place order
async function handlePlaceOrder(e) {
    // Ngăn chặn form submit
    if (e) e.preventDefault();
    
    // Kiểm tra xem người dùng đã đăng nhập chưa
    if (!isLoggedIn) {
        alert('Please sign in to complete your order');
        window.location.href = '/Page/login.html';
        return;
    }
    
    // Kiểm tra giỏ hàng
    if (cart.length === 0) {
        alert('Your cart is empty');
        return;
    }
    
    // Validate form inputs
    if (!validateForm()) {
        return;
    }

    // Hiển thị trạng thái đang xử lý
    placeOrderButton.disabled = true;
    const originalButtonText = placeOrderButton.innerHTML;
    placeOrderButton.innerHTML = '<i class="fas fa-spinner fa-spin me-2"></i> Processing...';

    try {
        // Get selected address
        const selectedAddress = document.querySelector('input[name="address"]:checked');
        if (!selectedAddress) {
            throw new Error('Please select a shipping address');
        }
        
        // Lấy thông tin địa chỉ từ label
        const addressLabel = document.querySelector(`label[for="${selectedAddress.id}"]`);
        const addressText = addressLabel.querySelector('.text-muted')?.textContent || '';

        // Get selected payment method
        const selectedPayment = document.querySelector('input[name="payment"]:checked');
        if (!selectedPayment) {
            throw new Error('Please select a payment method');
        }
        const paymentMethod = selectedPayment.value;

        // Get delivery option
        const selectedDelivery = document.querySelector('input[name="delivery"]:checked');
        const deliveryOption = selectedDelivery ? selectedDelivery.value : 'standard';

        // Tính tổng tiền
        const subtotal = parseFloat(subtotalElement.textContent.replace('$', ''));
        const shipping = shippingElement.textContent === 'Free' ? 0 : parseFloat(shippingElement.textContent.replace('$', ''));
        const tax = parseFloat(taxElement.textContent.replace('$', ''));
        const total = parseFloat(totalElement.textContent.replace('$', ''));

        // Tạo thông tin thanh toán
        let paymentDetails = {};
        if (paymentMethod === 'credit') {
            paymentDetails = {
                cardNumber: document.getElementById('cardNumber')?.getAttribute('data-original') || document.getElementById('cardNumber')?.value,
                cardExpiry: document.getElementById('cardExpiry')?.value,
                cardCvv: document.getElementById('cardCvv')?.value
            };
        } else if (paymentMethod === 'bank_transfer') {
            paymentDetails = {
                bankName: document.getElementById('bankName')?.value,
                accountName: document.getElementById('accountName')?.value,
                accountNumber: document.getElementById('accountNumber')?.value
            };
        }

        // Get user info
        const userData = JSON.parse(localStorage.getItem('user'));

        // Create order object
        const order = {
            userId: userData.id,
            userName: userData.name,
            userEmail: userData.email,
            items: cart,
            shippingAddress: addressText,
            paymentMethod,
            paymentDetails,
            deliveryOption,
            subtotal,
            shipping,
            tax,
            total,
            status: 'pending',
            orderDate: new Date().toISOString()
        };

        // Giả lập gửi đơn hàng (trong môi trường thực tế sẽ gọi API)
        console.log('Đơn hàng được tạo:', order);
        
        // Lưu đơn hàng vào localStorage để hiển thị trên trang xác nhận
        saveOrderToLocalStorage(order);

        // Xóa giỏ hàng
        localStorage.removeItem('cartItems');
        
        // Gửi yêu cầu tạo đơn hàng lên server (mô phỏng)
        setTimeout(() => {
            // Chuyển hướng đến trang xác nhận đơn hàng
            window.location.href = '/Page/orderConfirmation.html';
        }, 1500);

    } catch (error) {
        console.error('Lỗi khi đặt hàng:', error);
        alert(error.message || 'Failed to place order. Please try again.');
        
        // Khôi phục trạng thái nút
        placeOrderButton.disabled = false;
        placeOrderButton.innerHTML = originalButtonText;
    }
}

/**
 * Lưu đơn hàng vào localStorage
 */
function saveOrderToLocalStorage(order) {
    // Tạo ID đơn hàng
    order.id = 'ORD-' + new Date().getTime();
    
    // Lưu đơn hàng vào danh sách đơn hàng
    const orders = JSON.parse(localStorage.getItem('orders')) || [];
    orders.push(order);
    localStorage.setItem('orders', JSON.stringify(orders));
    
    // Lưu đơn hàng hiện tại để hiển thị trên trang xác nhận
    localStorage.setItem('currentOrder', JSON.stringify(order));
}

// Form validation
function validateForm() {
    if (creditCardRadio.checked) {
        const cardNumber = document.querySelector('input[placeholder="1234 5678 9012 3456"]').value;
        const expiryDate = document.querySelector('input[placeholder="MM/YY"]').value;
        const cvv = document.querySelector('input[placeholder="123"]').value;

        if (!cardNumber || !expiryDate || !cvv) {
            alert('Please fill in all card details');
            return false;
        }

        // Add more validation as needed
    }

    return true;
}

// Add new address handler
function handleAddNewAddress() {
    // Hiển thị modal thêm địa chỉ mới
    showAddAddressModal();
}

/**
 * Hiển thị modal thêm địa chỉ mới
 */
function showAddAddressModal() {
    // Tạo modal thêm địa chỉ mới
    const modalHTML = `
    <div class="modal fade" id="addressModal" tabindex="-1" aria-labelledby="addressModalLabel" aria-hidden="true">
        <div class="modal-dialog">
            <div class="modal-content">
                <div class="modal-header">
                    <h5 class="modal-title" id="addressModalLabel">Add New Address</h5>
                    <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                </div>
                <div class="modal-body">
                    <form id="newAddressForm">
                        <div class="mb-3">
                            <label for="addressName" class="form-label">Address Name</label>
                            <input type="text" class="form-control" id="addressName" placeholder="Home, Work, etc.">
                        </div>
                        <div class="mb-3">
                            <label for="streetAddress" class="form-label">Street Address</label>
                            <input type="text" class="form-control" id="streetAddress" required>
                        </div>
                        <div class="row mb-3">
                            <div class="col-md-6">
                                <label for="city" class="form-label">City</label>
                                <input type="text" class="form-control" id="city" required>
                            </div>
                            <div class="col-md-6">
                                <label for="state" class="form-label">State/Province</label>
                                <input type="text" class="form-control" id="state" required>
                            </div>
                        </div>
                        <div class="row mb-3">
                            <div class="col-md-6">
                                <label for="zipCode" class="form-label">Zip/Postal Code</label>
                                <input type="text" class="form-control" id="zipCode" required>
                            </div>
                            <div class="col-md-6">
                                <label for="country" class="form-label">Country</label>
                                <select class="form-select" id="country" required>
                                    <option value="">Select Country</option>
                                    <option value="US">United States</option>
                                    <option value="VN">Vietnam</option>
                                    <option value="CA">Canada</option>
                                    <option value="UK">United Kingdom</option>
                                    <option value="AU">Australia</option>
                                </select>
                            </div>
                        </div>
                        <div class="form-check mb-3">
                            <input class="form-check-input" type="checkbox" id="defaultAddress">
                            <label class="form-check-label" for="defaultAddress">
                                Set as default shipping address
                            </label>
                        </div>
                    </form>
                </div>
                <div class="modal-footer">
                    <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cancel</button>
                    <button type="button" class="btn btn-primary" id="saveAddressBtn">Save Address</button>
                </div>
            </div>
        </div>
    </div>`;
    
    // Thêm modal vào body
    document.body.insertAdjacentHTML('beforeend', modalHTML);
    
    // Khởi tạo modal Bootstrap
    const addressModal = new bootstrap.Modal(document.getElementById('addressModal'));
    addressModal.show();
    
    // Xử lý sự kiện lưu địa chỉ mới
    document.getElementById('saveAddressBtn').addEventListener('click', function() {
        saveNewAddress(addressModal);
    });
}

/**
 * Lưu địa chỉ mới
 */
function saveNewAddress(modal) {
    const form = document.getElementById('newAddressForm');
    
    // Kiểm tra form hợp lệ
    if (form.checkValidity()) {
        // Thu thập dữ liệu từ form
        const addressName = document.getElementById('addressName').value || 'New Address';
        const street = document.getElementById('streetAddress').value;
        const city = document.getElementById('city').value;
        const state = document.getElementById('state').value;
        const zip = document.getElementById('zipCode').value;
        const country = document.getElementById('country').value;
        
        // Tạo địa chỉ đầy đủ
        const fullAddress = `${street}, ${city}, ${state} ${zip}, ${getCountryName(country)}`;
        
        // Thêm địa chỉ mới vào danh sách hiển thị
        addNewAddressToList(addressName, fullAddress);
        
        // Lưu địa chỉ vào localStorage
        saveAddressToLocalStorage(addressName, fullAddress);
        
        // Đóng modal
        modal.hide();
        
        // Xóa modal khỏi DOM sau khi đóng
        document.getElementById('addressModal').addEventListener('hidden.bs.modal', function() {
            this.remove();
        });
    } else {
        // Hiển thị thông báo lỗi
        form.classList.add('was-validated');
    }
}

/**
 * Lấy tên quốc gia từ mã quốc gia
 */
function getCountryName(countryCode) {
    const countries = {
        'US': 'United States',
        'VN': 'Vietnam',
        'CA': 'Canada',
        'UK': 'United Kingdom',
        'AU': 'Australia'
    };
    
    return countries[countryCode] || countryCode;
}

/**
 * Thêm địa chỉ mới vào danh sách hiển thị
 */
function addNewAddressToList(name, address) {
    const savedAddressesGrid = document.querySelector('.saved-addresses-grid');
    const addAddressBtn = document.getElementById('addNewAddress');
    
    if (!savedAddressesGrid || !addAddressBtn) return;
    
    // Tạo ID duy nhất cho địa chỉ mới
    const addressId = 'address-' + new Date().getTime();
    
    // Tạo HTML cho địa chỉ mới
    const addressHTML = `
    <div class="saved-address">
        <input type="radio" name="address" id="${addressId}">
        <label for="${addressId}">
            <strong>${name}</strong><br>
            <span class="text-muted">${address}</span>
        </label>
    </div>`;
    
    // Thêm địa chỉ mới vào trước nút "Thêm địa chỉ mới"
    addAddressBtn.insertAdjacentHTML('beforebegin', addressHTML);
    
    // Chọn địa chỉ mới
    document.getElementById(addressId).checked = true;
}

/**
 * Lưu địa chỉ vào localStorage
 */
function saveAddressToLocalStorage(name, address) {
    // Lấy danh sách địa chỉ hiện có
    const addresses = JSON.parse(localStorage.getItem('userAddresses')) || [];
    
    // Kiểm tra nếu đặt làm địa chỉ mặc định
    const isDefault = document.getElementById('defaultAddress')?.checked || false;
    
    // Nếu đặt làm mặc định, cập nhật các địa chỉ khác
    if (isDefault) {
        addresses.forEach(addr => {
            addr.isDefault = false;
        });
    }
    
    // Thêm địa chỉ mới
    addresses.push({
        name: name,
        address: address,
        isDefault: isDefault,
        dateAdded: new Date().toISOString()
    });
    
    // Lưu lại vào localStorage
    localStorage.setItem('userAddresses', JSON.stringify(addresses));
    
    // Nếu là địa chỉ mặc định, cập nhật trong thông tin người dùng
    if (isDefault) {
        updateDefaultAddress(address);
    }
}

/**
 * Cập nhật địa chỉ mặc định trong thông tin người dùng
 */
function updateDefaultAddress(address) {
    // Lấy thông tin người dùng hiện tại
    const userData = JSON.parse(localStorage.getItem('user'));
    
    if (userData) {
        // Cập nhật địa chỉ mặc định
        userData.address = address;
        
        // Lưu lại thông tin người dùng
        localStorage.setItem('user', JSON.stringify(userData));
    }
}

/**
 * Tải thông tin phương thức thanh toán
 */
function loadPaymentInfo() {
    console.log('Loading payment information...');
    
    // Lấy thông tin người dùng từ localStorage
    let userData = null;
    try {
        userData = JSON.parse(localStorage.getItem('user'));
        console.log('User data loaded:', userData);
    } catch (e) {
        console.error('Error parsing user data:', e);
    }
    
    if (!userData) {
        console.error('No user data found in localStorage');
        return;
    }
    
    // Kiểm tra nếu có thông tin thanh toán trong localStorage
    let paymentInfo = null;
    try {
        paymentInfo = JSON.parse(localStorage.getItem('userPaymentInfo'));
        console.log('Payment info loaded:', paymentInfo);
    } catch (e) {
        console.error('Error parsing payment info:', e);
    }
    
    let bankAccountInfo = null;
    
    // Kiểm tra thông tin tài khoản ngân hàng trong nhiều nguồn khác nhau
    console.log('Checking all possible sources for bank account info...');
    
    // 1. Kiểm tra thông tin tài khoản ngân hàng trong billing (nguồn chính xác và ưu tiên nhất)
    if (userData.billing && userData.billing.account_name && userData.billing.bank_name) {
        console.log('Found bank account info in user billing data');
        bankAccountInfo = {
            bankName: userData.billing.bank_name,
            accountName: userData.billing.account_name, 
            accountNumber: userData.billing.account_number || "N/A"
        };
    }
    // 2. Kiểm tra thông tin tài khoản ngân hàng trong paymentInfo
    else if (paymentInfo && paymentInfo.bankAccount) {
        console.log('Found bank account info in paymentInfo');
        bankAccountInfo = paymentInfo.bankAccount;
    } 
    // 3. Kiểm tra thông tin tài khoản trong userData
    else if (userData.paymentMethods && userData.paymentMethods.bankAccount) {
        console.log('Found bank account info in userData.paymentMethods');
        bankAccountInfo = userData.paymentMethods.bankAccount;
    }
    // 4. Kiểm tra cách lưu trữ cũ (bankAccount trực tiếp trong userData)
    else if (userData.bankAccount) {
        console.log('Found bank account info directly in userData');
        bankAccountInfo = userData.bankAccount;
    }
    // 5. Thử tìm thông tin tài khoản ngân hàng từ localStorage key khác
    else {
        try {
            const bankData = localStorage.getItem('bankAccountInfo');
            if (bankData) {
                console.log('Found bank account info in separate localStorage key');
                bankAccountInfo = JSON.parse(bankData);
            }
        } catch (e) {
            console.error('Error checking additional bank account sources:', e);
        }
    }
    
    // Nếu tìm thấy thông tin ngân hàng nhưng có tên tài khoản là "LE BA PHAT" và người dùng có tên khác,
    // cập nhật lại tên tài khoản để khớp với người dùng hiện tại
    if (bankAccountInfo && bankAccountInfo.accountName === "LE BA PHAT" && 
        userData.name && userData.name !== "Le Ba Phat" && userData.name !== "LE BA PHAT") {
        console.log('Updating hardcoded bank account name to match current user');
        bankAccountInfo.accountName = userData.name;
    }
    
    // Xử lý thông tin thẻ tín dụng
    if (paymentInfo && paymentInfo.creditCard) {
        const cardInfo = paymentInfo.creditCard;
        const cardNumberInput = document.getElementById('cardNumber');
        const cardExpiryInput = document.getElementById('cardExpiry');
        
        if (cardNumberInput) {
            // Hiển thị số thẻ ẩn một phần (chỉ hiện 4 số cuối)
            const maskedCardNumber = '•••• •••• •••• ' + cardInfo.number.slice(-4);
            cardNumberInput.value = maskedCardNumber;
            cardNumberInput.setAttribute('data-original', cardInfo.number);
        }
        
        if (cardExpiryInput && cardInfo.expiry) {
            cardExpiryInput.value = cardInfo.expiry;
        }
    } 
    // Kiểm tra thông tin thẻ trong userData nếu chưa tìm thấy
    else if (userData.paymentMethods && userData.paymentMethods.creditCard) {
        const cardInfo = userData.paymentMethods.creditCard;
        const cardNumberInput = document.getElementById('cardNumber');
        const cardExpiryInput = document.getElementById('cardExpiry');
        
        if (cardNumberInput && cardInfo.number) {
            const maskedCardNumber = '•••• •••• •••• ' + cardInfo.number.slice(-4);
            cardNumberInput.value = maskedCardNumber;
            cardNumberInput.setAttribute('data-original', cardInfo.number);
        }
        
        if (cardExpiryInput && cardInfo.expiry) {
            cardExpiryInput.value = cardInfo.expiry;
        }
    }
    
    // Nếu không tìm thấy thông tin ngân hàng, sử dụng thông tin thực tế của người dùng
    if (!bankAccountInfo) {
        console.log('No bank account info found, getting current user bank info');
        
        // Lấy thông tin người dùng hiện tại
        const currentUser = JSON.parse(localStorage.getItem('user')) || {};
        
        // Thử lấy thông tin từ billing nếu có
        if (currentUser && currentUser.billing) {
            bankAccountInfo = {
                bankName: currentUser.billing.bank_name || "N/A",
                accountName: currentUser.billing.account_name || currentUser.name || "N/A",
                accountNumber: currentUser.billing.account_number || "N/A"
            };
        } else {
            // Sử dụng tên người dùng từ thông tin đăng nhập
            bankAccountInfo = {
                bankName: "N/A",
                accountName: currentUser.name || "N/A",
                accountNumber: "N/A"
            };
        }
        
        // Lưu dữ liệu vào cả hai nơi để đảm bảo có thể truy cập sau này
        console.log('Saving user bank data to localStorage:', bankAccountInfo);
        
        // 1. Lưu vào userPaymentInfo
        const existingPaymentInfo = JSON.parse(localStorage.getItem('userPaymentInfo')) || {};
        existingPaymentInfo.bankAccount = bankAccountInfo;
        localStorage.setItem('userPaymentInfo', JSON.stringify(existingPaymentInfo));
        
        // 2. Lưu vào user.paymentMethods
        if (userData) {
            if (!userData.paymentMethods) userData.paymentMethods = {};
            userData.paymentMethods.bankAccount = bankAccountInfo;
            localStorage.setItem('user', JSON.stringify(userData));
        }
    }
    
    // Thêm phương thức thanh toán qua ngân hàng
    if (bankAccountInfo) {
        console.log('Adding bank payment method with info:', bankAccountInfo);
        
        // Thêm timeout ngắn để đảm bảo DOM đã được tạo đầy đủ
        setTimeout(() => {
            addBankPaymentMethod(bankAccountInfo);
            
            // Kiểm tra lại sau khi thêm
            setTimeout(checkBankMethodExists, 500);
        }, 100);
    } else {
        console.error('Failed to create bank account info');
    }
}

/**
 * Thêm phương thức thanh toán bằng ngân hàng
 */
function addBankPaymentMethod(bankInfo) {
    if (!bankInfo) {
        console.log('No bank info provided');
        return;
    }
    
    // Thêm log để kiểm tra dữ liệu
    console.log('Bank info received:', JSON.stringify(bankInfo));
    
    // Kiểm tra thông tin ngân hàng có hợp lệ không
    if (!bankInfo.bankName || !bankInfo.accountNumber) {
        console.log('Invalid bank info - missing required fields:', bankInfo);
        return;
    }
    
    // Sử dụng querySelectorAll để kiểm tra tất cả các khả năng
    const possibleSelectors = ['.payment-methods', '.checkout-section .payment-methods'];
    let paymentMethodsContainer = null;
    
    // Thử tìm container bằng các selector khác nhau
    for (const selector of possibleSelectors) {
        const container = document.querySelector(selector);
        if (container) {
            console.log('Found payment methods container with selector:', selector);
            paymentMethodsContainer = container;
            break;
        }
    }
    
    if (!paymentMethodsContainer) {
        console.error('Payment methods container not found in DOM');
        // Tìm phần tử chứa "Payment Method" để xem cấu trúc DOM xung quanh
        const paymentSections = Array.from(document.querySelectorAll('h3')).filter(el => 
            el.textContent.includes('Payment Method'));
        if (paymentSections.length > 0) {
            console.log('Found payment section heading:', paymentSections[0]);
            // Thử tìm container trong phần tử cha của tiêu đề
            paymentMethodsContainer = paymentSections[0].parentElement.querySelector('.payment-methods');
            if (!paymentMethodsContainer) {
                // Thử tìm trong phần tử liền kề tiêu đề
                const nextElement = paymentSections[0].nextElementSibling;
                if (nextElement && (nextElement.classList.contains('payment-methods') || 
                    nextElement.querySelector('.payment-methods'))) {
                    paymentMethodsContainer = nextElement.classList.contains('payment-methods') ? 
                        nextElement : nextElement.querySelector('.payment-methods');
                }
            }
        }
        
        if (!paymentMethodsContainer) {
            console.log('Last resort: Creating payment container if it does not exist');
            // Tìm payment section
            const paymentSection = document.querySelector('.checkout-section:last-child') || 
                                  document.querySelector('[id*="payment"], [class*="payment"]');
            if (paymentSection) {
                // Tạo container nếu không tìm thấy
                paymentMethodsContainer = document.createElement('div');
                paymentMethodsContainer.classList.add('payment-methods');
                paymentSection.appendChild(paymentMethodsContainer);
            } else {
                // Log toàn bộ DOM để debug
                console.log('Page body:', document.body.innerHTML);
                return;
            }
        }
    }
    
    // Kiểm tra xem đã có phương thức thanh toán bằng ngân hàng chưa
    let bankMethodExists = document.querySelector('.payment-method.bank-transfer');
    
    if (!bankMethodExists) {
        console.log('Adding bank payment method UI to DOM');
        // Tạo phương thức thanh toán bằng ngân hàng
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
                    <input type="text" id="bankName" class="form-control" value="${bankInfo.bankName || ''}" readonly>
                </div>
                <div class="form-group mt-2">
                    <label for="accountName" class="small text-muted">Account Name</label>
                    <input type="text" id="accountName" class="form-control" value="${bankInfo.accountName || ''}" readonly>
                </div>
                <div class="form-group mt-2">
                    <label for="accountNumber" class="small text-muted">Account Number</label>
                    <input type="text" id="accountNumber" class="form-control" value="${bankInfo.accountNumber || ''}" readonly>
                </div>
            </div>
        </div>`;
        
        // Thêm vào container
        paymentMethodsContainer.insertAdjacentHTML('beforeend', bankMethodHTML);
        console.log('Bank payment method added successfully');
        
        // Thêm event listener cho radio button
        const bankTransferRadio = document.querySelector('input[name="payment"][value="bank_transfer"]');
        if (bankTransferRadio) {
            bankTransferRadio.addEventListener('change', handlePaymentMethodChange);
        } else {
            console.error('Could not find bank transfer radio button after adding it to DOM');
        }
        
        // Kiểm tra lại DOM để xác nhận phần tử đã thêm vào
        console.log('Payment methods after adding bank:', paymentMethodsContainer.innerHTML);
    } else {
        console.log('Bank payment method already exists, updating values');
        // Update the existing bank method with new values
        const bankNameInput = bankMethodExists.querySelector('#bankName');
        const accountNameInput = bankMethodExists.querySelector('#accountName');
        const accountNumberInput = bankMethodExists.querySelector('#accountNumber');
        
        if (bankNameInput) bankNameInput.value = bankInfo.bankName || '';
        if (accountNameInput) accountNameInput.value = bankInfo.accountName || '';
        if (accountNumberInput) accountNumberInput.value = bankInfo.accountNumber || '';
    }
}

// Add current user's bank account data if not exists
function addSampleBankData() {
    // Get user data
    const userData = JSON.parse(localStorage.getItem('user')) || {};
    if (!userData.paymentMethods) {
        userData.paymentMethods = {};
    }
    
    // Only add if no bank account exists yet
    if (!userData.paymentMethods.bankAccount) {
        // Use billing information if available
        if (userData.billing) {
            userData.paymentMethods.bankAccount = {
                bankName: userData.billing.bank_name || "N/A",
                accountName: userData.billing.account_name || userData.name || "N/A",
                accountNumber: userData.billing.account_number || "N/A"
            };
        } else {
            // Use basic user info
            userData.paymentMethods.bankAccount = {
                bankName: "N/A",
                accountName: userData.name || "N/A",
                accountNumber: "N/A"
            };
        }
        
        localStorage.setItem('user', JSON.stringify(userData));
        console.log("Real bank account data added");
        
        // Also add to payment info
        const paymentInfo = JSON.parse(localStorage.getItem('userPaymentInfo')) || {};
        paymentInfo.bankAccount = userData.paymentMethods.bankAccount;
        localStorage.setItem('userPaymentInfo', JSON.stringify(paymentInfo));
    }
}

// Event listeners
document.addEventListener('DOMContentLoaded', () => {
    console.log('DOM fully loaded, initializing checkout page');
    
    // Thêm dữ liệu mẫu để test
    addSampleBankData();
    
    if (isLoggedIn) {
        // In ra thông tin người dùng và thông tin thanh toán để debug
        console.log("User data:", JSON.parse(localStorage.getItem('user')));
        console.log("Payment info:", JSON.parse(localStorage.getItem('userPaymentInfo')));
        
        // Tải thông tin địa chỉ và phương thức thanh toán
        loadSavedAddresses();
        loadPaymentInfo();
        
        // Hiển thị giỏ hàng
        displayOrderItems();
        
        // Thiết lập trạng thái hiển thị ban đầu
        handlePaymentMethodChange();
        
        // Sau khi trang đã tải hoàn toàn, kiểm tra xem phương thức thanh toán ngân hàng đã được thêm chưa
        // Sử dụng nhiều timeout với khoảng thời gian khác nhau để đảm bảo kiểm tra nhiều lần
        setTimeout(() => {
            console.log('First check for bank payment method after 500ms');
            checkBankMethodExists();
        }, 500);
        
        // Kiểm tra lần thứ hai sau 1 giây
        setTimeout(() => {
            console.log('Second check for bank payment method after 1s');
            checkBankMethodExists();
        }, 1000);
        
        // Kiểm tra lần cuối sau 2 giây để đảm bảo DOM đã được tải và xử lý hoàn toàn
        setTimeout(() => {
            console.log('Final check for bank payment method after 2s');
            const bankMethod = document.querySelector('.payment-method.bank-transfer');
            
            // Nếu vẫn không tìm thấy, thử cách khác - tạo lại hoàn toàn
            if (!bankMethod) {
                console.log('Bank method still not found, attempting final fix with direct DOM insertion');
                const paymentSection = document.querySelector('.checkout-section:has(h3:contains("Payment"))') || 
                                      document.querySelector('.checkout-section:last-child');
                
                if (paymentSection) {
                    const userData = JSON.parse(localStorage.getItem('user')) || {};
                    const paymentInfo = JSON.parse(localStorage.getItem('userPaymentInfo')) || {};
                    const bankInfo = (paymentInfo && paymentInfo.bankAccount) || 
                                   (userData.paymentMethods && userData.paymentMethods.bankAccount) || 
                                   {
                                       bankName: "VietComBank",
                                       accountName: "Nguyen Van A",
                                       accountNumber: "1234567890123"
                                   };
                                   
                    checkBankMethodExists();
                }
            }
        }, 2000);
    
        // Đăng ký các event listener
        const deliveryOptions = document.querySelectorAll('input[name="delivery"]');
        deliveryOptions.forEach(option => {
            option.addEventListener('change', handleDeliveryOptionChange);
        });
        
        const paymentOptions = document.querySelectorAll('input[name="payment"]');
        paymentOptions.forEach(option => {
            option.addEventListener('change', handlePaymentMethodChange);
        });
        
        if (placeOrderButton) {
            placeOrderButton.addEventListener('click', handlePlaceOrder);
        }
        
        if (addNewAddressButton) {
            addNewAddressButton.addEventListener('click', handleAddNewAddress);
        }
    }
});

/**
 * Kiểm tra phương thức thanh toán ngân hàng
 */
function checkBankMethodExists() {
    console.log('Checking if bank payment method exists in DOM');
    
    // Tìm kiếm phương thức thanh toán ngân hàng trong DOM với selector chính xác hơn
    const selectors = [
        '.payment-method.bank-transfer',
        '.payment-methods .bank-transfer',
        '[class*="payment"] [class*="bank"]',
        '.checkout-section .payment-methods .payment-method:last-child'
    ];
    
    // Thử tìm theo nhiều selector khác nhau
    let bankMethod = null;
    for (const selector of selectors) {
        const element = document.querySelector(selector);
        if (element && (element.classList.contains('bank-transfer') || 
                        element.querySelector('[value="bank_transfer"]'))) {
            bankMethod = element;
            console.log(`Bank method found with selector: ${selector}`);
            break;
        }
    }
    
    if (bankMethod) {
        console.log('Bank payment method found in DOM:', bankMethod);
        // Xác nhận thành công, thêm sự kiện click cho radio button nếu chưa được thêm
        const bankRadio = bankMethod.querySelector('input[type="radio"]');
        if (bankRadio && !bankRadio._hasClickListener) {
            bankRadio.addEventListener('change', handlePaymentMethodChange);
            bankRadio._hasClickListener = true;
            console.log('Added change event listener to bank radio button');
        }
        return true;
    } else {
        console.error('Bank payment method NOT found in DOM');
        
        // Lấy thông tin từ localStorage
        const userData = JSON.parse(localStorage.getItem('user')) || {};
        const paymentInfo = JSON.parse(localStorage.getItem('userPaymentInfo')) || {};
        
        // Hiển thị thông tin debug
        console.log('User payment methods:', userData.paymentMethods);
        console.log('Payment info:', paymentInfo);
        
        // Kiểm tra các container phương thức thanh toán có thể có
        const possibleSelectors = [
            '.payment-methods', 
            '.checkout-section .payment-methods', 
            '.checkout-container .payment-methods',
            '[id*="payment"] .payment-methods',
            '.payment-section .payment-methods'
        ];
        
        let paymentMethodsContainer = null;
        for (const selector of possibleSelectors) {
            const container = document.querySelector(selector);
            if (container) {
                console.log('Payment methods container found with selector:', selector);
                paymentMethodsContainer = container;
                console.log('Payment methods container content:', paymentMethodsContainer.innerHTML);
                break;
            }
        }
        
        if (!paymentMethodsContainer) {
            console.error('Payment methods container not found using any selector!');
            
            // Tìm section chứa phương thức thanh toán
            const paymentSections = Array.from(document.querySelectorAll('h3, h2, .section-title')).filter(el => 
                el.textContent.includes('Payment') || el.textContent.includes('Thanh toán'));
                
            if (paymentSections.length > 0) {
                console.log('Found payment section heading:', paymentSections[0]);
                
                // Tạo container nếu cần thiết
                const paymentSection = paymentSections[0].closest('.checkout-section') || 
                                      paymentSections[0].parentElement;
                                      
                if (paymentSection) {
                    paymentMethodsContainer = paymentSection.querySelector('.payment-methods');
                    if (!paymentMethodsContainer) {
                        console.log('Creating new payment methods container');
                        paymentMethodsContainer = document.createElement('div');
                        paymentMethodsContainer.classList.add('payment-methods');
                        paymentSection.appendChild(paymentMethodsContainer);
                    }
                }
            }
        }
        
        // Thử thêm lại phương thức thanh toán ngân hàng
        let bankAccountInfo = null;
        
        // Kiểm tra tất cả các nguồn dữ liệu có thể
        if (userData.paymentMethods && userData.paymentMethods.bankAccount) {
            console.log('Trying to add bank method again with user data');
            bankAccountInfo = userData.paymentMethods.bankAccount;
        } else if (paymentInfo && paymentInfo.bankAccount) {
            console.log('Trying to add bank method again with payment info');
            bankAccountInfo = paymentInfo.bankAccount;
        } else {
            console.log('Creating real user bank data and trying again');
            bankAccountInfo = {
                bankName: "Vietcombank",
                accountName: "LE BA PHAT",
                accountNumber: "1026666666"
            };
            
            // Lưu dữ liệu mẫu
            if (paymentInfo) {
                paymentInfo.bankAccount = bankAccountInfo;
                localStorage.setItem('userPaymentInfo', JSON.stringify(paymentInfo));
            }
            
            if (userData.paymentMethods) {
                userData.paymentMethods.bankAccount = bankAccountInfo;
                localStorage.setItem('user', JSON.stringify(userData));
            }
        }
        
        if (bankAccountInfo && paymentMethodsContainer) {
            addBankPaymentMethod(bankAccountInfo);
            return true;
        }
        
        return false;
    }
}