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
    // Lấy thông tin người dùng từ localStorage
    const userData = JSON.parse(localStorage.getItem('user'));
    if (!userData) return;
    
    // Kiểm tra nếu có thông tin thanh toán trong localStorage
    const paymentInfo = JSON.parse(localStorage.getItem('userPaymentInfo'));
    
    if (paymentInfo) {
        // Hiển thị thông tin thẻ tín dụng nếu có
        if (paymentInfo.creditCard) {
            const cardInfo = paymentInfo.creditCard;
            const cardNumberInput = document.getElementById('cardNumber');
            const cardExpiryInput = document.getElementById('cardExpiry');
            
            if (cardNumberInput) {
                // Hiển thị số thẻ ẩn một phần (chỉ hiện 4 số cuối)
                const maskedCardNumber = '•••• •••• •••• ' + cardInfo.number.slice(-4);
                cardNumberInput.value = maskedCardNumber;
                cardNumberInput.setAttribute('data-original', cardInfo.number); // Lưu số thẻ đầy đủ trong attribute
            }
            
            if (cardExpiryInput && cardInfo.expiry) {
                cardExpiryInput.value = cardInfo.expiry;
            }
        }
        
        // Hiển thị thông tin ngân hàng nếu có
        if (paymentInfo.bankAccount) {
            addBankPaymentMethod(paymentInfo.bankAccount);
        }
    } else if (userData.paymentMethods) {
        // Nếu có thông tin trong userData
        if (userData.paymentMethods.creditCard) {
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
        
        if (userData.paymentMethods.bankAccount) {
            addBankPaymentMethod(userData.paymentMethods.bankAccount);
        }
    }
}

/**
 * Thêm phương thức thanh toán bằng ngân hàng
 */
function addBankPaymentMethod(bankInfo) {
    const paymentMethodsContainer = document.querySelector('.payment-methods');
    if (!paymentMethodsContainer) return;
    
    // Kiểm tra xem đã có phương thức thanh toán bằng ngân hàng chưa
    let bankMethodExists = document.querySelector('.payment-method.bank-transfer');
    
    if (!bankMethodExists) {
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
        
        paymentMethodsContainer.insertAdjacentHTML('beforeend', bankMethodHTML);
        
        // Thêm event listener cho radio button
        const bankTransferRadio = document.querySelector('input[name="payment"][value="bank_transfer"]');
        if (bankTransferRadio) {
            bankTransferRadio.addEventListener('change', handlePaymentMethodChange);
        }
    }
}

// Event listeners
document.addEventListener('DOMContentLoaded', () => {
    if (isLoggedIn) {
        // Tải thông tin địa chỉ và phương thức thanh toán
        loadSavedAddresses();
        loadPaymentInfo();
        
        // Hiển thị giỏ hàng
        displayOrderItems();
        
        // Thiết lập trạng thái hiển thị ban đầu
        handlePaymentMethodChange();
    
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