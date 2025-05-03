class InventoryManagement {
    constructor() {
        this.initializeElements();
        this.setupEventListeners();
        this.loadInventory();
        this.loadInventoryStats();
        this.setupProductForm();
    }

    initializeElements() {
        // Search and filter elements
        this.searchInput = document.querySelector('input[placeholder="Search inventory..."]');
        
        // Table elements
        this.inventoryTableBody = document.querySelector('table tbody');
        this.paginationContainer = document.querySelector('.tm-pagination');

        // Summary elements
        this.totalProductsEl = document.querySelector('[data-summary="total-products"]');
        this.lowStockEl = document.querySelector('[data-summary="low-stock"]');
        this.outOfStockEl = document.querySelector('[data-summary="out-of-stock"]');
        this.totalValueEl = document.querySelector('[data-summary="total-value"]');
    }

    setupEventListeners() {
        // Search functionality
        this.searchInput?.addEventListener('input', (e) => this.handleSearch(e.target.value));

        // Stock adjustment modal
        document.addEventListener('click', (e) => {
            if (e.target.closest('[data-action="adjust-stock"]')) {
                const productId = e.target.closest('tr').dataset.productId;
                this.openAdjustStockModal(productId);
            }
            if (e.target.closest('[data-action="view-history"]')) {
                const productId = e.target.closest('tr').dataset.productId;
                this.openStockHistoryModal(productId);
            }
        });

        // Export button
        const exportBtn = document.querySelector('[data-action="export"]');
        exportBtn?.addEventListener('click', () => this.exportInventory());
    }

    async loadInventory() {
        try {
            // Fetch inventory data from API
            const response = await fetch('/api/inventory');
            const inventory = await response.json();
            this.renderInventory(inventory);
        } catch (error) {
            console.error('Error loading inventory:', error);
            this.showNotification('Failed to load inventory', 'error');
        }
    }

    async loadInventoryStats() {
        try {
            // Fetch inventory statistics from API
            const response = await fetch('/api/inventory/stats');
            const stats = await response.json();
            this.updateInventoryStats(stats);
        } catch (error) {
            console.error('Error loading inventory stats:', error);
        }
    }

    renderInventory(inventory) {
        if (!this.inventoryTableBody) return;

        this.inventoryTableBody.innerHTML = inventory.map(item => `
            <tr data-product-id="${item.id}">
                <td>#${item.id}</td>
                <td>${item.name}</td>
                <td>${item.category}</td>
                <td class="${this.getStockLevelClass(item.inStock, item.reorderLevel)}">
                    ${item.inStock}
                </td>
                <td>${item.reorderLevel}</td>
                <td>$${item.unitPrice.toFixed(2)}</td>
                <td>$${(item.unitPrice * item.inStock).toFixed(2)}</td>
                <td>
                    <div class="btn-group">
                        <button class="btn btn-sm btn-primary" data-action="adjust-stock">
                            <i class="fas fa-edit"></i>
                        </button>
                        <button class="btn btn-sm btn-info" data-action="view-history">
                            <i class="fas fa-history"></i>
                        </button>
                    </div>
                </td>
            </tr>
        `).join('');
    }

    getStockLevelClass(currentStock, reorderLevel) {
        if (currentStock === 0) return 'text-danger';
        if (currentStock <= reorderLevel) return 'text-warning';
        return '';
    }

    updateInventoryStats(stats) {
        if (this.totalProductsEl) this.totalProductsEl.textContent = stats.totalProducts;
        if (this.lowStockEl) this.lowStockEl.textContent = stats.lowStockItems;
        if (this.outOfStockEl) this.outOfStockEl.textContent = stats.outOfStockItems;
        if (this.totalValueEl) this.totalValueEl.textContent = `$${stats.totalValue.toFixed(2)}`;
    }

    async openAdjustStockModal(productId) {
        try {
            // Fetch product details
            const response = await fetch(`/api/inventory/${productId}`);
            const product = await response.json();
            
            // Update modal content
            const modal = document.getElementById('adjustStockModal');
            if (modal) {
                modal.querySelector('[name="product"]').value = product.name;
                modal.querySelector('[name="currentStock"]').value = product.inStock;
                
                // Setup form submission
                const form = modal.querySelector('form');
                form.onsubmit = (e) => {
                    e.preventDefault();
                    this.handleStockAdjustment(productId, form);
                };
            }
        } catch (error) {
            console.error('Error loading product details:', error);
            this.showNotification('Failed to load product details', 'error');
        }
    }

    async handleStockAdjustment(productId, form) {
        try {
            const formData = new FormData(form);
            const adjustment = {
                type: formData.get('adjustmentType'),
                quantity: parseInt(formData.get('quantity')),
                reason: formData.get('reason')
            };

            // Call API to adjust stock
            const response = await fetch(`/api/inventory/${productId}/adjust`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(adjustment)
            });

            if (!response.ok) throw new Error('Failed to adjust stock');

            // Close modal and refresh inventory
            $('#adjustStockModal').modal('hide');
            this.loadInventory();
            this.loadInventoryStats();
            this.showNotification('Stock adjusted successfully', 'success');
        } catch (error) {
            console.error('Error adjusting stock:', error);
            this.showNotification('Failed to adjust stock', 'error');
        }
    }

    async openStockHistoryModal(productId) {
        try {
            // Fetch stock history
            const response = await fetch(`/api/inventory/${productId}/history`);
            const history = await response.json();
            
            // Update modal content
            const modal = document.getElementById('stockHistoryModal');
            if (modal) {
                const tbody = modal.querySelector('tbody');
                tbody.innerHTML = history.map(entry => `
                    <tr>
                        <td>${entry.date}</td>
                        <td>${entry.type}</td>
                        <td>${entry.quantity > 0 ? '+' : ''}${entry.quantity}</td>
                        <td>${entry.previousStock}</td>
                        <td>${entry.newStock}</td>
                        <td>${entry.reason}</td>
                        <td>${entry.updatedBy}</td>
                    </tr>
                `).join('');
            }
        } catch (error) {
            console.error('Error loading stock history:', error);
            this.showNotification('Failed to load stock history', 'error');
        }
    }

    handleSearch(searchTerm) {
        // Filter inventory table based on search term
        const rows = this.inventoryTableBody?.querySelectorAll('tr');
        if (!rows) return;

        rows.forEach(row => {
            const text = row.textContent.toLowerCase();
            row.style.display = text.includes(searchTerm.toLowerCase()) ? '' : 'none';
        });
    }

    async exportInventory() {
        try {
            // Call API to get export data
            const response = await fetch('/api/inventory/export');
            const blob = await response.blob();
            
            // Create download link
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `inventory-${new Date().toISOString().split('T')[0]}.csv`;
            document.body.appendChild(a);
            a.click();
            window.URL.revokeObjectURL(url);
            a.remove();
            
            this.showNotification('Inventory exported successfully', 'success');
        } catch (error) {
            console.error('Error exporting inventory:', error);
            this.showNotification('Failed to export inventory', 'error');
        }
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

    setupProductForm() {
        // Add detail row button
        document.getElementById('addDetailRow')?.addEventListener('click', () => {
            const container = document.getElementById('additionalDetails');
            const row = document.createElement('div');
            row.className = 'row mb-2';
            row.innerHTML = `
                <div class="col-md-5">
                    <input type="text" class="form-control" name="detail_keys[]" placeholder="Key">
                </div>
                <div class="col-md-5">
                    <input type="text" class="form-control" name="detail_values[]" placeholder="Value">
                </div>
                <div class="col-md-2">
                    <button type="button" class="btn btn-sm btn-danger remove-detail">
                        <i class="fas fa-times"></i>
                    </button>
                </div>
            `;
            container?.appendChild(row);

            // Add remove handler
            row.querySelector('.remove-detail')?.addEventListener('click', () => {
                row.remove();
            });
        });

        // Save product button
        document.getElementById('saveProduct')?.addEventListener('click', () => {
            this.handleSaveProduct();
        });

        // Image preview
        const imageInput = document.querySelector('input[name="images"]');
        imageInput?.addEventListener('change', (e) => {
            this.handleImagePreview(e);
        });
    }

    async handleSaveProduct() {
        const form = document.getElementById('addProductForm');
        if (!form) return;

        const formData = new FormData(form);

        // Validate required fields
        const requiredFields = ['name', 'category', 'sku', 'price', 'stock', 'reorderLevel', 'description'];
        for (const field of requiredFields) {
            if (!formData.get(field)) {
                this.showNotification(`Please fill in the ${field.replace(/([A-Z])/g, ' $1').toLowerCase()}`, 'error');
                return;
            }
        }

        // Collect additional details
        const details = {};
        const keys = formData.getAll('detail_keys[]');
        const values = formData.getAll('detail_values[]');
        keys.forEach((key, index) => {
            if (key && values[index]) {
                details[key] = values[index];
            }
        });

        // Create product object
        const productData = {
            name: formData.get('name'),
            category: formData.get('category'),
            sku: formData.get('sku'),
            price: parseFloat(formData.get('price')),
            stock: parseInt(formData.get('stock')),
            reorderLevel: parseInt(formData.get('reorderLevel')),
            description: formData.get('description'),
            details: details
        };

        try {
            // Upload images first if any
            const imageFiles = formData.getAll('images');
            if (imageFiles.length > 0 && imageFiles[0].size > 0) {
                const imageFormData = new FormData();
                imageFiles.forEach(file => {
                    imageFormData.append('images', file);
                });

                const uploadResponse = await fetch('/api/admin/inventory/upload-images', {
                    method: 'POST',
                    body: imageFormData
                });

                if (uploadResponse.ok) {
                    const { imageUrls } = await uploadResponse.json();
                    productData.images = imageUrls;
                }
            }

            // Save product data
            const response = await fetch('/api/admin/inventory/products', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(productData)
            });

            if (response.ok) {
                this.showNotification('Product added successfully', 'success');
                $('#addProductModal').modal('hide');
                form.reset();
                this.loadInventory(); // Refresh inventory list
            } else {
                const error = await response.json();
                throw new Error(error.message);
            }
        } catch (error) {
            console.error('Error saving product:', error);
            this.showNotification(error.message || 'Failed to save product', 'error');
        }
    }

    handleImagePreview(event) {
        const files = event.target.files;
        const previewContainer = document.createElement('div');
        previewContainer.className = 'image-preview mt-2';
        
        // Remove existing preview
        const existingPreview = event.target.parentElement.querySelector('.image-preview');
        if (existingPreview) {
            existingPreview.remove();
        }

        // Create new previews
        Array.from(files).forEach(file => {
            const reader = new FileReader();
            reader.onload = (e) => {
                const preview = document.createElement('img');
                preview.src = e.target.result;
                preview.className = 'mr-2 mb-2';
                preview.style.maxHeight = '100px';
                previewContainer.appendChild(preview);
            };
            reader.readAsDataURL(file);
        });

        event.target.parentElement.appendChild(previewContainer);
    }
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    const inventoryManagement = new InventoryManagement();
});