class ProductManagement {
    constructor() {
        this.products = [];
        this.initializeElements();
        this.loadProducts();
        this.setupEventListeners();
    }

    initializeElements() {
        this.productsTableBody = document.getElementById('productsTableBody');
        this.addProductForm = document.getElementById('addProductForm');
        this.imagePreview = document.getElementById('imagePreview');
        this.saveProductBtn = document.getElementById('saveProduct');
    }

    setupEventListeners() {
        // Save product button
        this.saveProductBtn?.addEventListener('click', () => this.handleSaveProduct());

        // Image preview
        const imageInput = this.addProductForm?.querySelector('input[name="image"]');
        imageInput?.addEventListener('change', (e) => this.handleImagePreview(e));
    }

    async loadProducts() {
        try {
            const response = await fetch('/api/products');
            if (!response.ok) throw new Error('Failed to load products');
            
            const products = await response.json();
            this.renderProducts(products);
        } catch (error) {
            console.error('Error loading products:', error);
            this.showNotification('Failed to load products', 'error');
        }
    }

    renderProducts(products) {
        if (!this.productsTableBody) return;

        this.productsTableBody.innerHTML = products.map(product => `
            <tr>
                <td>
                    <img src="${product.image}" alt="${product.name}" style="width: 50px; height: 50px; object-fit: cover;">
                </td>
                <td>${product.name}</td>
                <td>${product.category}</td>
                <td>$${product.price.toFixed(2)}</td>
                <td>${product.stock}</td>
                <td>
                    <div class="btn-group">
                        <button class="btn btn-sm btn-primary" onclick="productManagement.editProduct(${product.id})">
                            <i class="fas fa-edit"></i>
                        </button>
                        <button class="btn btn-sm btn-danger" onclick="productManagement.deleteProduct(${product.id})">
                            <i class="fas fa-trash"></i>
                        </button>
                    </div>
                </td>
            </tr>
        `).join('');
    }

    async handleSaveProduct() {
        if (!this.addProductForm) return;

        const formData = new FormData(this.addProductForm);
        
        try {
            const response = await fetch('/api/products', {
                method: 'POST',
                body: formData
            });

            if (!response.ok) throw new Error('Failed to save product');

            this.showNotification('Product saved successfully');
            this.loadProducts(); // Reload products table
            
            // Close modal and reset form
            bootstrap.Modal.getInstance(document.getElementById('addProductModal')).hide();
            this.addProductForm.reset();
            if (this.imagePreview) this.imagePreview.innerHTML = '';
        } catch (error) {
            console.error('Error saving product:', error);
            this.showNotification('Failed to save product', 'error');
        }
    }

    handleImagePreview(event) {
        if (!this.imagePreview || !event.target.files?.[0]) return;

        const file = event.target.files[0];
        const reader = new FileReader();

        reader.onload = (e) => {
            this.imagePreview.innerHTML = `<img src="${e.target.result}" style="max-width: 200px;">`;
        };

        reader.readAsDataURL(file);
    }

    async editProduct(productId) {
        try {
            const response = await fetch(`/api/products/${productId}`);
            if (!response.ok) throw new Error('Failed to load product details');
            
            const product = await response.json();
            // Populate form with product details
            const modal = new bootstrap.Modal(document.getElementById('addProductModal'));
            modal.show();
            
            if (this.addProductForm) {
                this.addProductForm.querySelector('[name="name"]').value = product.name;
                this.addProductForm.querySelector('[name="category"]').value = product.category;
                this.addProductForm.querySelector('[name="price"]').value = product.price;
                this.addProductForm.querySelector('[name="stock"]').value = product.stock;
                this.addProductForm.querySelector('[name="description"]').value = product.description || '';
                
                if (product.image) {
                    this.imagePreview.innerHTML = `<img src="${product.image}" style="max-width: 200px;">`;
                }
            }
        } catch (error) {
            console.error('Error loading product details:', error);
            this.showNotification('Failed to load product details', 'error');
        }
    }

    async deleteProduct(productId) {
        if (!confirm('Are you sure you want to delete this product?')) return;
        
        try {
            const response = await fetch(`/api/products/${productId}`, {
                method: 'DELETE'
            });

            if (!response.ok) throw new Error('Failed to delete product');

            this.showNotification('Product deleted successfully');
            this.loadProducts(); // Reload products table
        } catch (error) {
            console.error('Error deleting product:', error);
            this.showNotification('Failed to delete product', 'error');
        }
    }

    showNotification(message, type = 'success') {
        // Implement your notification system here
        alert(message);
    }
}

// Initialize product management when DOM is loaded
let productManagement;
document.addEventListener('DOMContentLoaded', () => {
    productManagement = new ProductManagement();
});
