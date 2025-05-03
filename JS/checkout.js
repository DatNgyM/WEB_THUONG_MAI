// Get cart items from localStorage
let cart = JSON.parse(localStorage.getItem('cart')) || [];

// DOM Elements
const orderItemsContainer = document.getElementById('orderItems');
const subtotalElement = document.getElementById('subtotal');
const shippingElement = document.getElementById('shipping');
const taxElement = document.getElementById('tax');
const totalElement = document.getElementById('total');
const placeOrderButton = document.getElementById('placeOrder');
const savedAddressesGrid = document.getElementById('savedAddresses');
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
    const savedAddresses = JSON.parse(localStorage.getItem('savedAddresses')) || [];
    savedAddressesGrid.innerHTML = '';

    savedAddresses.forEach((address, index) => {
        const addressElement = document.createElement('div');
        addressElement.className = 'saved-address';
        addressElement.innerHTML = `
            <input type="radio" name="address" id="address-${index}" ${index === 0 ? 'checked' : ''}>
            <label for="address-${index}">
                <strong>${address.name}</strong><br>
                ${address.street}<br>
                ${address.city}, ${address.state} ${address.zip}<br>
                ${address.phone}
            </label>
        `;
        savedAddressesGrid.appendChild(addressElement);
    });
}

// Display cart items
function displayOrderItems() {
    orderItemsContainer.innerHTML = '';
    let subtotal = 0;

    cart.forEach(item => {
        const itemElement = document.createElement('div');
        itemElement.className = 'order-item';
        itemElement.innerHTML = `
            <img src="${item.image}" alt="${item.name}" class="order-item-image">
            <div class="order-item-details">
                <h4>${item.name}</h4>
                <div class="order-item-meta">
                    <span>Quantity: ${item.quantity}</span>
                </div>
                <div class="order-item-price">
                    <span>$${(item.price * item.quantity).toFixed(2)}</span>
                </div>
            </div>
        `;
        orderItemsContainer.appendChild(itemElement);
        subtotal += item.price * item.quantity;
    });

    updateOrderSummary(subtotal);
}

// Update order summary calculations
function updateOrderSummary(subtotal) {
    const shipping = expressDelivery.checked ? 15 : 0;
    const tax = subtotal * 0.1; // 10% tax rate
    const total = subtotal + shipping + tax;

    subtotalElement.textContent = `$${subtotal.toFixed(2)}`;
    shippingElement.textContent = shipping ? `$${shipping.toFixed(2)}` : 'Free';
    taxElement.textContent = `$${tax.toFixed(2)}`;
    totalElement.textContent = `$${total.toFixed(2)}`;
}

// Handle delivery option changes
function handleDeliveryOptionChange() {
    const subtotal = parseFloat(subtotalElement.textContent.replace('$', ''));
    updateOrderSummary(subtotal);
}

// Handle payment method changes
function handlePaymentMethodChange() {
    creditCardForm.style.display = creditCardRadio.checked ? 'block' : 'none';
}

// Handle place order
async function handlePlaceOrder() {
    // Validate form inputs
    if (!validateForm()) {
        return;
    }

    placeOrderButton.disabled = true;
    placeOrderButton.textContent = 'Processing...';

    try {
        // Get selected address
        const selectedAddress = document.querySelector('input[name="address"]:checked');
        if (!selectedAddress) {
            throw new Error('Please select a shipping address');
        }

        // Get selected payment method
        const paymentMethod = creditCardRadio.checked ? 'credit-card' : 'paypal';

        // Get delivery option
        const deliveryOption = expressDelivery.checked ? 'express' : 'standard';

        // Create order object
        const order = {
            items: cart,
            address: selectedAddress.id,
            paymentMethod,
            deliveryOption,
            total: parseFloat(totalElement.textContent.replace('$', '')),
            orderDate: new Date().toISOString()
        };

        // Send order to server (implement your API endpoint)
        const response = await fetch('/api/orders', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(order)
        });

        if (!response.ok) {
            throw new Error('Failed to place order');
        }

        // Clear cart
        localStorage.removeItem('cart');
        
        // Show success message and redirect
        alert('Order placed successfully!');
        window.location.href = '/order-confirmation.html';

    } catch (error) {
        alert(error.message || 'Failed to place order. Please try again.');
    } finally {
        placeOrderButton.disabled = false;
        placeOrderButton.textContent = 'Place Order';
    }
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
    // Implement address form modal or redirect to address form page
    window.location.href = 'add-address.html';
}

// Event listeners
document.addEventListener('DOMContentLoaded', () => {
    loadSavedAddresses();
    displayOrderItems();
    handlePaymentMethodChange(); // Initial display state

    standardDelivery.addEventListener('change', handleDeliveryOptionChange);
    expressDelivery.addEventListener('change', handleDeliveryOptionChange);
    creditCardRadio.addEventListener('change', handlePaymentMethodChange);
    paypalRadio.addEventListener('change', handlePaymentMethodChange);
    placeOrderButton.addEventListener('click', handlePlaceOrder);
    addNewAddressButton.addEventListener('click', handleAddNewAddress);
});