// Order Confirmation Page JavaScript
document.addEventListener('DOMContentLoaded', function() {
    // Check if the user is logged in
    checkLoginStatus();
    
    // Load and display order details
    loadOrderDetails();
});

// Check login status
function checkLoginStatus() {
    const isLoggedIn = localStorage.getItem('isLoggedIn');
    const userData = JSON.parse(localStorage.getItem('user'));
    
    if (!isLoggedIn || !userData) {
        console.log('User is not logged in, redirecting to login page');
        localStorage.setItem('redirectAfterLogin', window.location.href);
        window.location.href = '/Page/login.html';
        return false;
    }
    return true;
}

/**
 * Load and display order details from localStorage
 */
function loadOrderDetails() {
    // Get the current order from localStorage
    const currentOrder = JSON.parse(localStorage.getItem('currentOrder'));
    
    if (!currentOrder) {
        console.error('No order details found');
        displayNoOrderMessage();
        return;
    }
    
    // Display order information
    displayOrderInfo(currentOrder);
    
    // Display shipping information
    displayShippingInfo(currentOrder);
    
    // Display order items
    displayOrderItems(currentOrder.items);
    
    // Display order totals
    displayOrderTotals(currentOrder);
}

/**
 * Display a message when no order is found
 */
function displayNoOrderMessage() {
    const orderHeader = document.querySelector('.order-header');
    if (orderHeader) {
        orderHeader.innerHTML = `
            <i class="fas fa-exclamation-circle text-warning" style="font-size: 3rem;"></i>
            <h2>No Order Found</h2>
            <p>We couldn't find any order details. Please return to the shop and try again.</p>
            <a href="/Page/index.html" class="btn btn-primary mt-3">Go to Shop</a>
        `;
    }
    
    // Hide other sections
    const sections = document.querySelectorAll('.confirmation-section:not(:first-child)');
    sections.forEach(section => {
        section.style.display = 'none';
    });
}

/**
 * Display order information
 */
function displayOrderInfo(order) {
    // Set Order ID
    const orderIdElement = document.getElementById('orderId');
    if (orderIdElement) {
        orderIdElement.textContent = order.id || 'N/A';
    }
    
    // Set Order Date
    const orderDateElement = document.getElementById('orderDate');
    if (orderDateElement && order.orderDate) {
        // Format the date nicely
        const orderDate = new Date(order.orderDate);
        orderDateElement.textContent = orderDate.toLocaleString();
    }
    
    // Set Payment Method
    const paymentMethodElement = document.getElementById('paymentMethod');
    if (paymentMethodElement) {
        let methodText = 'Unknown';
        
        if (order.paymentMethod === 'credit') {
            methodText = 'Credit Card';
            // Add masked card number if available
            if (order.paymentDetails && order.paymentDetails.cardNumber) {
                const lastFour = order.paymentDetails.cardNumber.slice(-4);
                methodText += ` (**** **** **** ${lastFour})`;
            }
        } else if (order.paymentMethod === 'bank_transfer') {
            methodText = 'Bank Transfer';
        }
        
        paymentMethodElement.textContent = methodText;
    }
    
    // Set Order Status
    const orderStatusElement = document.getElementById('orderStatus');
    if (orderStatusElement) {
        orderStatusElement.textContent = order.status || 'Processing';
        
        // Set appropriate badge color based on status
        if (order.status === 'pending') {
            orderStatusElement.className = 'badge bg-warning';
        } else if (order.status === 'delivered') {
            orderStatusElement.className = 'badge bg-success';
        } else if (order.status === 'cancelled') {
            orderStatusElement.className = 'badge bg-danger';
        } else {
            orderStatusElement.className = 'badge bg-info';
        }
    }
}

/**
 * Display shipping information
 */
function displayShippingInfo(order) {
    // Set Customer Name
    const customerNameElement = document.getElementById('customerName');
    if (customerNameElement) {
        customerNameElement.textContent = order.userName || 'N/A';
    }
    
    // Set Shipping Address
    const shippingAddressElement = document.getElementById('shippingAddress');
    if (shippingAddressElement) {
        shippingAddressElement.textContent = order.shippingAddress || 'N/A';
    }
    
    // Set Delivery Option
    const deliveryOptionElement = document.getElementById('deliveryOption');
    if (deliveryOptionElement) {
        let deliveryText = 'Standard Delivery';
        
        if (order.deliveryOption === 'express') {
            deliveryText = 'Express Delivery (1-2 business days)';
        } else {
            deliveryText = 'Standard Delivery (3-5 business days)';
        }
        
        deliveryOptionElement.textContent = deliveryText;
    }
}

/**
 * Display order items
 */
function displayOrderItems(items) {
    const orderItemsContainer = document.getElementById('orderItems');
    if (!orderItemsContainer) return;
    
    orderItemsContainer.innerHTML = '';
    
    // Check if items array exists and has elements
    if (!items || items.length === 0) {
        orderItemsContainer.innerHTML = '<p class="text-center py-3">No items in this order</p>';
        return;
    }
    
    // Display each order item
    items.forEach(item => {
        const itemTotal = item.price * item.quantity;
        
        const itemHTML = `
            <div class="order-item">
                <div class="row align-items-center">
                    <div class="col-md-2">
                        <img src="${item.image}" alt="${item.name}" class="img-fluid rounded" 
                             onerror="this.src='/img/placeholder.png'" style="max-height: 60px;">
                    </div>
                    <div class="col-md-5">
                        <h5 class="mb-0">${item.name}</h5>
                        <small class="text-muted">${item.description || ''}</small>
                    </div>
                    <div class="col-md-2 text-center">
                        <span class="text-muted">Qty: ${item.quantity}</span>
                    </div>
                    <div class="col-md-3 text-end">
                        <span class="text-muted">$${item.price.toFixed(2)} each</span><br>
                        <strong>$${itemTotal.toFixed(2)}</strong>
                    </div>
                </div>
            </div>
        `;
        
        orderItemsContainer.innerHTML += itemHTML;
    });
}

/**
 * Display order totals
 */
function displayOrderTotals(order) {
    // Set Subtotal
    const subtotalElement = document.getElementById('subtotal');
    if (subtotalElement) {
        subtotalElement.textContent = `$${order.subtotal.toFixed(2)}`;
    }
    
    // Set Shipping
    const shippingElement = document.getElementById('shipping');
    if (shippingElement) {
        if (order.shipping === 0) {
            shippingElement.textContent = 'Free';
        } else {
            shippingElement.textContent = `$${order.shipping.toFixed(2)}`;
        }
    }
    
    // Set Tax
    const taxElement = document.getElementById('tax');
    if (taxElement) {
        taxElement.textContent = `$${order.tax.toFixed(2)}`;
    }
    
    // Set Total
    const totalElement = document.getElementById('total');
    if (totalElement) {
        totalElement.textContent = `$${order.total.toFixed(2)}`;
    }
}

// Function to update user order history
function updateOrderHistory(order) {
    if (!order) return;
    
    // Get user from localStorage
    const userData = JSON.parse(localStorage.getItem('user'));
    if (!userData) return;
    
    // Initialize or update order history array
    if (!userData.orderHistory) {
        userData.orderHistory = [];
    }
    
    // Add current order to history if not already there
    const orderExists = userData.orderHistory.some(existingOrder => existingOrder.id === order.id);
    if (!orderExists) {
        userData.orderHistory.push({
            id: order.id,
            date: order.orderDate,
            total: order.total,
            status: order.status
        });
        
        // Update user data in localStorage
        localStorage.setItem('user', JSON.stringify(userData));
    }
}

// Execute order history update
document.addEventListener('DOMContentLoaded', function() {
    const currentOrder = JSON.parse(localStorage.getItem('currentOrder'));
    if (currentOrder) {
        updateOrderHistory(currentOrder);
    }
});
