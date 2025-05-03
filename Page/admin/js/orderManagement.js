class OrderManagement {
    constructor() {
        this.initializeElements();
        this.setupEventListeners();
        this.loadOrders();
    }

    initializeElements() {
        // Search elements
        this.searchInput = document.querySelector('input[placeholder="Search orders..."]');
        this.statusFilter = document.querySelector('select.custom-select');
        this.dateRange = document.getElementById('daterange');
        
        // Table elements
        this.ordersTableBody = document.querySelector('table tbody');
        this.paginationContainer = document.querySelector('.tm-pagination');
    }

    setupEventListeners() {
        // Search functionality
        this.searchInput?.addEventListener('input', (e) => this.handleSearch(e.target.value));
        this.statusFilter?.addEventListener('change', (e) => this.handleStatusFilter(e.target.value));
        
        // Date range picker
        if (this.dateRange) {
            $(this.dateRange).datepicker({
                dateFormat: 'yy-mm-dd',
                onSelect: (date) => this.handleDateFilter(date)
            });
        }

        // Order actions
        document.addEventListener('click', (e) => {
            if (e.target.closest('.btn-view-order')) {
                const orderId = e.target.closest('tr').dataset.orderId;
                this.viewOrderDetails(orderId);
            }
            if (e.target.closest('.btn-update-status')) {
                const orderId = e.target.closest('tr').dataset.orderId;
                this.updateOrderStatus(orderId);
            }
        });
    }

    async loadOrders() {
        try {
            // Fetch orders from API
            const response = await fetch('/api/orders');
            const orders = await response.json();
            this.renderOrders(orders);
        } catch (error) {
            console.error('Error loading orders:', error);
            // Show error notification
            this.showNotification('Failed to load orders', 'error');
        }
    }

    renderOrders(orders) {
        if (!this.ordersTableBody) return;

        this.ordersTableBody.innerHTML = orders.map(order => `
            <tr data-order-id="${order.id}">
                <th scope="row"><b>#${order.id}</b></th>
                <td>${order.customerName}</td>
                <td>${order.orderDate}</td>
                <td><span class="badge badge-${this.getStatusBadgeClass(order.status)}">${order.status}</span></td>
                <td>$${order.total.toFixed(2)}</td>
                <td>${order.paymentMethod}</td>
                <td>
                    <div class="btn-group">
                        <button type="button" class="btn btn-sm btn-primary btn-view-order" data-toggle="modal" data-target="#orderDetailsModal">
                            <i class="fas fa-eye"></i>
                        </button>
                        <button type="button" class="btn btn-sm btn-success btn-update-status">
                            <i class="fas fa-check"></i>
                        </button>
                        <button type="button" class="btn btn-sm btn-danger">
                            <i class="fas fa-times"></i>
                        </button>
                    </div>
                </td>
            </tr>
        `).join('');
    }

    getStatusBadgeClass(status) {
        const statusClasses = {
            'pending': 'warning',
            'processing': 'primary',
            'shipped': 'info',
            'delivered': 'success',
            'cancelled': 'danger'
        };
        return statusClasses[status.toLowerCase()] || 'secondary';
    }

    async viewOrderDetails(orderId) {
        try {
            // Fetch order details from API
            const response = await fetch(`/api/orders/${orderId}`);
            const order = await response.json();
            
            // Update modal content
            const modal = document.getElementById('orderDetailsModal');
            if (modal) {
                modal.querySelector('.modal-title').textContent = `Order Details #${orderId}`;
                // Update customer info
                modal.querySelector('[data-customer-name]').textContent = order.customerName;
                modal.querySelector('[data-customer-email]').textContent = order.customerEmail;
                modal.querySelector('[data-customer-phone]').textContent = order.customerPhone;
                
                // Update shipping info
                modal.querySelector('[data-shipping-address]').textContent = order.shippingAddress;
                modal.querySelector('[data-shipping-city]').textContent = order.shippingCity;
                modal.querySelector('[data-shipping-zip]').textContent = order.shippingZip;
                
                // Update order items
                const itemsContainer = modal.querySelector('.order-items tbody');
                if (itemsContainer) {
                    itemsContainer.innerHTML = order.items.map(item => `
                        <tr>
                            <td>${item.name}</td>
                            <td>$${item.price.toFixed(2)}</td>
                            <td>${item.quantity}</td>
                            <td>$${(item.price * item.quantity).toFixed(2)}</td>
                        </tr>
                    `).join('');
                }
                
                // Update totals
                modal.querySelector('[data-subtotal]').textContent = `$${order.subtotal.toFixed(2)}`;
                modal.querySelector('[data-shipping]').textContent = `$${order.shipping.toFixed(2)}`;
                modal.querySelector('[data-total]').textContent = `$${order.total.toFixed(2)}`;
            }
        } catch (error) {
            console.error('Error loading order details:', error);
            this.showNotification('Failed to load order details', 'error');
        }
    }

    async updateOrderStatus(orderId) {
        try {
            // Call API to update status
            const response = await fetch(`/api/orders/${orderId}/status`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ status: 'processing' })
            });

            if (!response.ok) throw new Error('Failed to update order status');

            // Refresh orders list
            this.loadOrders();
            this.showNotification('Order status updated successfully', 'success');
        } catch (error) {
            console.error('Error updating order status:', error);
            this.showNotification('Failed to update order status', 'error');
        }
    }

    handleSearch(searchTerm) {
        // Implement search logic
        console.log('Searching for:', searchTerm);
        // Update orders list based on search
    }

    handleStatusFilter(status) {
        // Implement status filter logic
        console.log('Filtering by status:', status);
        // Update orders list based on status
    }

    handleDateFilter(date) {
        // Implement date filter logic
        console.log('Filtering by date:', date);
        // Update orders list based on date
    }

    showNotification(message, type = 'success') {
        const notification = document.createElement('div');
        notification.className = `notification ${type}`;
        notification.textContent = message;
        document.body.appendChild(notification);

        // Trigger animation
        setTimeout(() => notification.classList.add('show'), 10);

        // Remove notification after animation
        setTimeout(() => {
            notification.classList.remove('show');
            setTimeout(() => notification.remove(), 300);
        }, 2000);
    }
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    const orderManagement = new OrderManagement();
});