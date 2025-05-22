document.addEventListener('DOMContentLoaded', function() {
    // Check if user is authenticated and is a seller
    checkAuthAndRole();
    
    // Initialize dashboard data
    loadDashboardData();
    
    // Initialize event listeners
    initializeEventListeners();
});

function checkAuthAndRole() {
    const token = localStorage.getItem('token');
    if (!token) {
        window.location.href = 'login.html';
        return;
    }
    
    // Check if user has valid CCCD
    try {
        const userString = localStorage.getItem('user');
        if (userString) {
            const user = JSON.parse(userString);
            // Check if CCCD is temporary (starts with T)
            if (!user.cccd || (user.cccd.charAt(0) === 'T' && !isNaN(user.cccd.substring(1)))) {
                // Redirect to account settings with a message
                alert('Bạn cần cập nhật CCCD hợp lệ trước khi sử dụng cổng người bán.');
                window.location.href = 'accountsetting.html#profile';
                return;
            }
        }
    } catch (e) {
        console.error("Error checking CCCD:", e);
    }

    // Verify if user is a seller
    fetch('../server/routes/auth/verify-seller', {
        headers: {
            'Authorization': `Bearer ${token}`
        }
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Not authorized as seller');
        }
        return response.json();
    })
    .catch(error => {
        console.error('Authorization error:', error);
        window.location.href = 'login.html';
    });
}

function loadDashboardData() {
    const token = localStorage.getItem('token');
    
    // Load statistics
    fetch('../server/routes/seller/dashboard-stats', {
        headers: {
            'Authorization': `Bearer ${token}`
        }
    })
    .then(response => response.json())
    .then(data => {
        document.getElementById('totalOrders').textContent = data.totalOrders;
        document.getElementById('totalRevenue').textContent = `$${data.revenue.toFixed(2)}`;
        document.getElementById('totalProducts').textContent = data.productsCount;
        document.getElementById('averageRating').textContent = data.averageRating.toFixed(1);
    })
    .catch(error => console.error('Error loading dashboard stats:', error));

    // Load recent orders
    loadRecentOrders();

    // Load products
    loadProducts();
}

function loadRecentOrders() {
    const token = localStorage.getItem('token');
    
    fetch('../server/routes/seller/recent-orders', {
        headers: {
            'Authorization': `Bearer ${token}`
        }
    })
    .then(response => response.json())
    .then(orders => {
        const ordersTable = document.getElementById('recentOrdersTable');
        ordersTable.innerHTML = '';

        orders.forEach(order => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${order.orderId}</td>
                <td>${order.customerName}</td>
                <td>${order.productName}</td>
                <td>$${order.amount.toFixed(2)}</td>
                <td><span class="badge bg-${getStatusColor(order.status)}">${order.status}</span></td>
                <td>
                    <button class="btn btn-sm btn-primary" onclick="updateOrderStatus('${order.orderId}')">
                        Update Status
                    </button>
                </td>
            `;
            ordersTable.appendChild(row);
        });
    })
    .catch(error => console.error('Error loading recent orders:', error));
}

function loadProducts() {
    const token = localStorage.getItem('token');
    
    fetch('../server/routes/seller/products', {
        headers: {
            'Authorization': `Bearer ${token}`
        }
    })
    .then(response => response.json())
    .then(products => {
        const productsTable = document.getElementById('productManagementTable');
        productsTable.innerHTML = '';

        products.forEach(product => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${product.name}</td>
                <td>$${product.price.toFixed(2)}</td>
                <td>${product.stock}</td>
                <td><span class="badge bg-${product.active ? 'success' : 'danger'}">${product.active ? 'Active' : 'Inactive'}</span></td>
                <td>
                    <button class="btn btn-sm btn-primary me-1" onclick="editProduct('${product.id}')">
                        <i class="fas fa-edit"></i>
                    </button>
                    <button class="btn btn-sm btn-danger" onclick="deleteProduct('${product.id}')">
                        <i class="fas fa-trash"></i>
                    </button>
                </td>
            `;
            productsTable.appendChild(row);
        });
    })
    .catch(error => console.error('Error loading products:', error));
}

function initializeEventListeners() {
    // Add Product Button
    document.getElementById('addProductBtn').addEventListener('click', () => {
        window.location.href = 'admin/add-product.html';
    });

    // Manage Inventory Button
    document.getElementById('manageInventoryBtn').addEventListener('click', () => {
        window.location.href = 'admin/inventory.html';
    });

    // View Analytics Button
    document.getElementById('viewAnalyticsBtn').addEventListener('click', () => {
        // Implement analytics view
        alert('Analytics feature coming soon!');
    });

    // Logout Button
    document.getElementById('logoutBtn').addEventListener('click', () => {
        localStorage.removeItem('token');
        window.location.href = 'login.html';
    });
}

function getStatusColor(status) {
    switch (status.toLowerCase()) {
        case 'pending':
            return 'warning';
        case 'shipped':
            return 'info';
        case 'delivered':
            return 'success';
        case 'cancelled':
            return 'danger';
        default:
            return 'secondary';
    }
}

function updateOrderStatus(orderId) {
    // Implement order status update logic
    const token = localStorage.getItem('token');
    // Show modal or form to update status
    // Make API call to update status
}

function editProduct(productId) {
    window.location.href = `admin/edit-product.html?id=${productId}`;
}

function deleteProduct(productId) {
    if (confirm('Are you sure you want to delete this product?')) {
        const token = localStorage.getItem('token');
        
        fetch(`../server/routes/seller/products/${productId}`, {
            method: 'DELETE',
            headers: {
                'Authorization': `Bearer ${token}`
            }
        })
        .then(response => {
            if (response.ok) {
                loadProducts(); // Reload products table
            } else {
                throw new Error('Failed to delete product');
            }
        })
        .catch(error => {
            console.error('Error deleting product:', error);
            alert('Failed to delete product. Please try again.');
        });
    }
}