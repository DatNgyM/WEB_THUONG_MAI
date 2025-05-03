class DashboardStats {
    constructor() {
        this.initializeCharts();
        this.loadStatistics();
        this.loadRecentOrders();
        this.loadTopProducts();
        this.loadCustomerActivity();
        this.setupAutoRefresh();
    }

    initializeCharts() {
        // Sales Performance Chart
        const salesCtx = document.getElementById('salesChart')?.getContext('2d');
        if (salesCtx) {
            this.salesChart = new Chart(salesCtx, {
                type: 'line',
                data: {
                    labels: [],
                    datasets: [{
                        label: 'Sales',
                        data: [],
                        borderColor: 'rgba(255, 255, 255, 1)',
                        borderWidth: 2,
                        fill: false
                    }]
                },
                options: {
                    responsive: true,
                    scales: {
                        yAxes: [{
                            ticks: {
                                beginAtZero: true,
                                fontColor: 'white'
                            },
                            gridLines: {
                                color: 'rgba(255, 255, 255, 0.1)'
                            }
                        }],
                        xAxes: [{
                            ticks: {
                                fontColor: 'white'
                            },
                            gridLines: {
                                color: 'rgba(255, 255, 255, 0.1)'
                            }
                        }]
                    },
                    legend: {
                        labels: {
                            fontColor: 'white'
                        }
                    }
                }
            });
        }

        // Category Distribution Chart
        const categoryCtx = document.getElementById('categoryChart')?.getContext('2d');
        if (categoryCtx) {
            this.categoryChart = new Chart(categoryCtx, {
                type: 'doughnut',
                data: {
                    labels: [],
                    datasets: [{
                        data: [],
                        backgroundColor: [
                            'rgba(255, 99, 132, 0.8)',
                            'rgba(54, 162, 235, 0.8)',
                            'rgba(255, 206, 86, 0.8)',
                            'rgba(75, 192, 192, 0.8)'
                        ]
                    }]
                },
                options: {
                    responsive: true,
                    legend: {
                        position: 'right',
                        labels: {
                            fontColor: 'white'
                        }
                    }
                }
            });
        }
    }

    async loadStatistics() {
        try {
            // Fetch dashboard statistics
            const response = await fetch('/api/dashboard/stats');
            const stats = await response.json();
            
            // Update statistics cards
            this.updateStatCards(stats);
            
            // Update charts
            this.updateSalesChart(stats.salesData);
            this.updateCategoryChart(stats.categoryData);
        } catch (error) {
            console.error('Error loading dashboard statistics:', error);
            this.showNotification('Failed to load dashboard statistics', 'error');
        }
    }

    updateStatCards(stats) {
        // Update orders count
        const ordersEl = document.querySelector('[data-stat="orders"]');
        if (ordersEl) {
            ordersEl.querySelector('h3').textContent = stats.todayOrders;
            ordersEl.querySelector('p').textContent = 
                `${stats.ordersTrend >= 0 ? '+' : ''}${stats.ordersTrend}% from yesterday`;
        }

        // Update revenue
        const revenueEl = document.querySelector('[data-stat="revenue"]');
        if (revenueEl) {
            revenueEl.querySelector('h3').textContent = `$${stats.revenue.toFixed(2)}`;
            revenueEl.querySelector('p').textContent = 
                `${stats.revenueTrend >= 0 ? '+' : ''}${stats.revenueTrend}% from last week`;
        }

        // Update active users
        const usersEl = document.querySelector('[data-stat="users"]');
        if (usersEl) {
            usersEl.querySelector('h3').textContent = stats.activeUsers;
            usersEl.querySelector('p').textContent = 
                `${stats.newUsers >= 0 ? '+' : ''}${stats.newUsers}% new users`;
        }

        // Update low stock items
        const stockEl = document.querySelector('[data-stat="stock"]');
        if (stockEl) {
            stockEl.querySelector('h3').textContent = stats.lowStockItems;
            stockEl.querySelector('p').textContent = 'Needs attention';
        }
    }

    updateSalesChart(salesData) {
        if (!this.salesChart) return;

        this.salesChart.data.labels = salesData.map(item => item.date);
        this.salesChart.data.datasets[0].data = salesData.map(item => item.amount);
        this.salesChart.update();
    }

    updateCategoryChart(categoryData) {
        if (!this.categoryChart) return;

        this.categoryChart.data.labels = categoryData.map(item => item.category);
        this.categoryChart.data.datasets[0].data = categoryData.map(item => item.percentage);
        this.categoryChart.update();
    }

    async loadRecentOrders() {
        try {
            const response = await fetch('/api/dashboard/recent-orders');
            const orders = await response.json();
            
            const tbody = document.querySelector('#recentOrdersTable tbody');
            if (tbody) {
                tbody.innerHTML = orders.map(order => `
                    <tr>
                        <th scope="row"><b>#${order.id}</b></th>
                        <td>${order.customerName}</td>
                        <td>${order.items}</td>
                        <td>$${order.total.toFixed(2)}</td>
                        <td><span class="badge badge-${this.getStatusBadgeClass(order.status)}">${order.status}</span></td>
                        <td>
                            <button class="btn btn-sm btn-primary" onclick="location.href='orders.html?id=${order.id}'">View</button>
                        </td>
                    </tr>
                `).join('');
            }
        } catch (error) {
            console.error('Error loading recent orders:', error);
        }
    }

    async loadTopProducts() {
        try {
            const response = await fetch('/api/dashboard/top-products');
            const products = await response.json();
            
            const tbody = document.querySelector('#topProductsTable tbody');
            if (tbody) {
                tbody.innerHTML = products.map(product => `
                    <tr>
                        <td>${product.name}</td>
                        <td>${product.unitsSold}</td>
                        <td>$${product.revenue.toFixed(2)}</td>
                    </tr>
                `).join('');
            }
        } catch (error) {
            console.error('Error loading top products:', error);
        }
    }

    async loadCustomerActivity() {
        try {
            const response = await fetch('/api/dashboard/customer-activity');
            const activities = await response.json();
            
            const container = document.querySelector('.tm-notification-items');
            if (container) {
                container.innerHTML = activities.map(activity => `
                    <div class="media tm-notification-item">
                        <div class="media-body">
                            <p class="mb-2">
                                <b>${activity.customerName}</b> ${activity.action} <b>${activity.product}</b>
                                <small class="text-muted">${activity.timeAgo}</small>
                            </p>
                        </div>
                    </div>
                `).join('');
            }
        } catch (error) {
            console.error('Error loading customer activity:', error);
        }
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

    setupAutoRefresh() {
        // Refresh data every 5 minutes
        setInterval(() => {
            this.loadStatistics();
            this.loadRecentOrders();
            this.loadTopProducts();
            this.loadCustomerActivity();
        }, 5 * 60 * 1000);
    }

    showNotification(message, type = 'success') {
        const notification = document.createElement('div');
        notification.className = `notification ${type}`;
        notification.textContent = message;
        document.body.appendChild(notification);

        setTimeout(() => notification.classList.add('show'), 10);
        setTimeout(() => {
            notification.classList.remove('show');
            setTimeout(() => notification.remove(), 300);
        }, 2000);
    }
}

// Initialize dashboard when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    const dashboard = new DashboardStats();
});