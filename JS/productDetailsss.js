class ProductDetailsManager {
  constructor() {
    this.productId = this.getProductIdFromURL();
    this.product = null;
  }
  
  getProductIdFromURL() {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get('id');
  }
  
  async init() {
    if (!this.productId) {
      this.showError('Product ID not found in URL');
      return;
    }
    
    await this.loadProduct();
  }
  
  async loadProduct() {
    try {
      console.log(`Loading product with ID: ${this.productId}`);
      
      const response = await fetch(`/api/products/${this.productId}`);
      
      if (!response.ok) {
        if (response.status === 404) {
          throw new Error('Product not found');
        }
        throw new Error(`Server error: ${response.status}`);
      }
      
      this.product = await response.json();
      console.log('Loaded product:', this.product);
      
      this.renderProduct();
      
    } catch (error) {
      console.error('Error loading product:', error);
      this.showError(error.message);
    }
  }
  
  renderProduct() {
    // Update page title và breadcrumb
    document.title = `${this.product.name} - Five:07`;
    this.updateBreadcrumb();
    
    // Update product info
    this.updateProductInfo();
    this.updateProductGallery();
    this.updateProductPrice();
    this.updateProductDescription(); // ← Thêm dòng này
    
    // Initialize event listeners for dynamic content
    this.initDynamicEventListeners();
  }
  
  updateBreadcrumb() {
    const categoryBreadcrumb = document.getElementById('breadcrumb-category');
    const productBreadcrumb = document.getElementById('breadcrumb-product');
    
    if (categoryBreadcrumb) {
      categoryBreadcrumb.textContent = this.product.category;
    }
    if (productBreadcrumb) {
      productBreadcrumb.textContent = this.product.name;
    }
  }
  
  updateProductInfo() {
    // Update product title
    const productTitle = document.querySelector('.product-title');
    if (productTitle) productTitle.textContent = this.product.name;
    
    // Update product name in header
    const productNameElement = document.getElementById('product-name');
    if (productNameElement) productNameElement.textContent = this.product.name;
    
    // Update SKU
    const skuElement = document.getElementById('product-sku');
    if (skuElement) skuElement.textContent = `SKU: ${this.product.id}`;
    
    // Update rating
    this.updateRating();
    
    // Update description
    const descriptionElement = document.getElementById('product-description');
    if (descriptionElement) {
      descriptionElement.textContent = this.product.description || 'No description available.';
    }
    
    // Update brand và category
    const brandElement = document.querySelector('.product-brand');
    if (brandElement) {
      brandElement.innerHTML = `
        <span class="badge bg-secondary">${this.product.brand}</span>
        <span class="text-muted ms-2">Category: ${this.product.category}</span>
      `;
    }
    
    // Update seller info
    const sellerElement = document.querySelector('.seller-info');
    if (sellerElement) {
      sellerElement.innerHTML = `Sold by: <strong>${this.product.seller}</strong>`;
    }
  }
  
  updateRating() {
    const rating = this.product.rating || 4;
    const ratingText = document.querySelector('.rating-text');
    
    if (ratingText) {
      ratingText.textContent = `(${rating}/5)`;
    }
    
    // Update stars
    const starsContainer = document.querySelector('.product-rating .stars');
    if (starsContainer) {
      starsContainer.innerHTML = this.renderStars(rating);
    }
  }
  
  renderStars(rating) {
    let starsHTML = '';
    for (let i = 1; i <= 5; i++) {
      if (i <= Math.floor(rating)) {
        starsHTML += '<i class="fas fa-star text-warning"></i>';
      } else if (i === Math.ceil(rating) && rating % 1 !== 0) {
        starsHTML += '<i class="fas fa-star-half-alt text-warning"></i>';
      } else {
        starsHTML += '<i class="far fa-star text-warning"></i>';
      }
    }
    return starsHTML;
  }
  
  updateProductPrice() {
    const priceElement = document.getElementById('product-price');
    const currentPriceElement = document.querySelector('.current-price');
    
    if (priceElement) {
      priceElement.textContent = `$${this.product.price.toFixed(2)}`;
    }
    
    if (currentPriceElement) {
      currentPriceElement.textContent = `$${this.product.price.toFixed(2)}`;
    }
  }
  
  updateProductGallery() {
    const mainImage = document.getElementById('mainImage');
    const thumbnailsContainer = document.querySelector('.thumbnails');
    
    // Update main image
    if (mainImage) {
      mainImage.src = this.product.image;
      mainImage.alt = this.product.name;
    }
    
    // Update thumbnails
    if (thumbnailsContainer && this.product.images && this.product.images.length > 0) {
      thumbnailsContainer.innerHTML = this.product.images.map((img, index) => `
        <img src="${img}" 
             alt="View ${index + 1}" 
             class="thumbnail ${index === 0 ? 'active' : ''}" 
             onclick="changeImage(event, '${img}')"
             style="cursor: pointer; border: 2px solid ${index === 0 ? '#007bff' : 'transparent'};">
      `).join('');
    }
  }
  
  initDynamicEventListeners() {
    // Quantity controls
    this.setupQuantityControls();
    
    // Add to cart functionality
    const addToCartBtn = document.querySelector('.add-to-cart');
    if (addToCartBtn) {
      addToCartBtn.addEventListener('click', () => {
        this.handleAddToCart();
      });
    }
    
    // Buy now functionality
    const buyNowBtn = document.querySelector('.btn-buy-now');
    if (buyNowBtn) {
      buyNowBtn.addEventListener('click', () => {
        this.handleBuyNow();
      });
    }
  }
  
  setupQuantityControls() {
    const quantityInput = document.getElementById('quantity');
    const minusBtn = document.querySelector('.quantity-btn.minus');
    const plusBtn = document.querySelector('.quantity-btn.plus');
    
    if (minusBtn) {
      minusBtn.addEventListener('click', () => {
        const currentValue = parseInt(quantityInput.value) || 1;
        if (currentValue > 1) {
          quantityInput.value = currentValue - 1;
        }
      });
    }
    
    if (plusBtn) {
      plusBtn.addEventListener('click', () => {
        const currentValue = parseInt(quantityInput.value) || 1;
        if (currentValue < 10) {
          quantityInput.value = currentValue + 1;
        }
      });
    }
  }
  
  handleAddToCart() {
    const quantity = parseInt(document.getElementById('quantity')?.value) || 1;
    
    // Add to cart multiple times based on quantity
    for (let i = 0; i < quantity; i++) {
      if (typeof addToCart === 'function') {
        addToCart(this.product);
      } else {
        this.manualAddToCart(this.product);
      }
    }
    
    // Show success message
    this.showSuccessMessage(`Added ${quantity} x ${this.product.name} to cart!`);
  }
  
  manualAddToCart(product) {
    let cart = JSON.parse(localStorage.getItem('cart')) || [];
    
    const existingProductIndex = cart.findIndex(item => item.id === product.id);
    
    if (existingProductIndex !== -1) {
      cart[existingProductIndex].quantity += 1;
    } else {
      cart.push({
        id: product.id,
        name: product.name,
        price: product.price,
        image: product.image,
        quantity: 1
      });
    }
    
    localStorage.setItem('cart', JSON.stringify(cart));
    this.updateCartCount();
  }
  
  updateCartCount() {
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    const totalItems = cart.reduce((total, item) => total + item.quantity, 0);
    
    const cartCountElements = document.querySelectorAll('.cart-count');
    cartCountElements.forEach(element => {
      element.textContent = totalItems;
    });
  }
  
  handleBuyNow() {
    this.handleAddToCart();
    // Redirect to checkout page
    window.location.href = '/Page/checkout.html';
  }
  
  showSuccessMessage(message) {
    // Create and show a toast notification
    const toast = document.createElement('div');
    toast.className = 'alert alert-success position-fixed';
    toast.style.cssText = 'top: 20px; right: 20px; z-index: 9999; max-width: 300px;';
    toast.innerHTML = `
      <i class="fas fa-check-circle me-2"></i>
      ${message}
    `;
    
    document.body.appendChild(toast);
    
    // Remove toast after 3 seconds
    setTimeout(() => {
      toast.remove();
    }, 3000);
  }
  
  showError(message) {
    const container = document.querySelector('.product-details-container');
    if (container) {
      container.innerHTML = `
        <div class="alert alert-danger text-center">
          <h4><i class="fas fa-exclamation-triangle"></i> Product Not Found</h4>
          <p>${message}</p>
          <a href="/Page/product.html" class="btn btn-primary">
            <i class="fas fa-arrow-left"></i> Back to Shop
          </a>
        </div>
      `;
    }
  }
  
  updateProductDescription() {
    // Update mô tả chính
    const mainDescription = document.getElementById('product-description');
    if (mainDescription) {
      mainDescription.textContent = this.product.description || 'No description available.';
    }
    
    // ↓ THÊM PHẦN MỚI ĐỂ HIỂN THỊ DYNAMIC CONTENT ↓
    this.updateDynamicTabs();
  }
  
  updateDynamicTabs() {
    // Update Description tab với nội dung từ Smart Enhancer
    this.updateDescriptionTab();
    
    // Update Specifications tab
    this.updateSpecificationsTab();
  }
  
  updateDescriptionTab() {
    const tabDescriptionContent = document.querySelector('#description .product-description-content');
    if (!tabDescriptionContent) return;
    
    // Sử dụng nội dung dynamic từ Smart Enhancer
    let contentHTML = `
      <div class="product-overview">
        <h3>${this.product.name}</h3>
        <p class="lead">${this.product.detailedDescription || this.product.description}</p>
      </div>
    `;
    
    // Thêm highlights nếu có
    if (this.product.highlights && this.product.highlights.length > 0) {
      contentHTML += `
        <div class="product-highlights mt-4">
          <h4><i class="fas fa-star text-warning me-2"></i>Điểm nổi bật</h4>
          <div class="highlights-grid">
            ${this.product.highlights.map(highlight => `
              <div class="highlight-item">
                <i class="fas fa-check-circle text-success me-2"></i>
                <span>${highlight}</span>
              </div>
            `).join('')}
          </div>
        </div>
      `;
    }
    
    // Thêm features nếu có
    if (this.product.features && this.product.features.length > 0) {
      contentHTML += `
        <div class="product-features mt-4">
          <h4><i class="fas fa-list text-primary me-2"></i>Tính năng chính</h4>
          <div class="row">
            ${this.product.features.map(feature => `
              <div class="col-md-6 mb-2">
                <div class="feature-item">
                  <i class="fas fa-arrow-right text-primary me-2"></i>
                  <span>${feature}</span>
                </div>
              </div>
            `).join('')}
          </div>
        </div>
      `;
    }
    
    // Thêm hình ảnh sản phẩm
    contentHTML += `
      <div class="product-image-section mt-4">
        <div class="row align-items-center">
          <div class="col-md-6">
            <img src="${this.product.image}" 
                 alt="${this.product.name}" 
                 class="img-fluid rounded shadow"
                 onerror="this.src='/images/products/default-product.jpg'">
          </div>
          <div class="col-md-6">
            <h5>Thiết kế và Chất lượng</h5>
            <p>Sản phẩm được thiết kế với sự chú ý đến từng chi tiết, đảm bảo mang lại trải nghiệm tối ưu cho người dùng với chất lượng vượt trội.</p>
          </div>
        </div>
      </div>
    `;
    
    tabDescriptionContent.innerHTML = contentHTML;
  }
  
  updateSpecificationsTab() {
    const specificationsContent = document.querySelector('#specifications .specifications-content');
    if (!specificationsContent || !this.product.specifications) return;
    
    let specsHTML = '<div class="specifications-table">';
    
    Object.entries(this.product.specifications).forEach(([category, specs]) => {
      specsHTML += `
        <div class="spec-category mb-4">
          <h5 class="spec-category-title">
            <i class="fas fa-cog text-primary me-2"></i>${category}
          </h5>
          <div class="spec-items">
            ${specs.map(spec => `
              <div class="spec-item">
                <i class="fas fa-check text-success me-2"></i>
                <span>${spec}</span>
              </div>
            `).join('')}
          </div>
        </div>
      `;
    });
    
    specsHTML += '</div>';
    specificationsContent.innerHTML = specsHTML;
  }
}

// Global function for image gallery (keep existing functionality)
function changeImage(event, src) {
  const mainImage = document.getElementById('mainImage');
  const thumbnails = document.querySelectorAll('.thumbnail');
  
  mainImage.src = src;
  thumbnails.forEach(thumb => {
    thumb.classList.remove('active');
    thumb.style.border = '2px solid transparent';
  });
  event.target.classList.add('active');
  event.target.style.border = '2px solid #007bff';
}

// Initialize product details manager
document.addEventListener('DOMContentLoaded', () => {
  window.productDetailsManager = new ProductDetailsManager();
  window.productDetailsManager.init();
});