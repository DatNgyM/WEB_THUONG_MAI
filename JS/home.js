/*!
 * Five:07 Home Page JavaScript
 * Chỉ xử lý giao diện, không fetch API
 */

document.addEventListener('DOMContentLoaded', function() {
    // Initialize home page functionality
    initHomePage();
});

function initHomePage() {
    // Setup product cards click events
    setupProductCards();
    
    // Setup add to cart buttons
    setupAddToCartButtons();
    
    // Setup search functionality (if exists)
    setupSearch();
    
    // Setup hero buttons
    setupHeroButtons();
}

// Product cards functionality
function setupProductCards() {
    const productCards = document.querySelectorAll('.product-card');
    
    productCards.forEach(card => {
        // Add hover effects
        card.addEventListener('mouseenter', function() {
            this.classList.add('hovered');
        });
        
        card.addEventListener('mouseleave', function() {
            this.classList.remove('hovered');
        });
        
        // Product link clicks
        const productLink = card.querySelector('.product-name a');
        if (productLink) {
            productLink.addEventListener('click', function(e) {
                // Smooth transition effect
                card.style.transform = 'scale(0.98)';
                setTimeout(() => {
                    card.style.transform = '';
                }, 150);
            });
        }
    });
}

// Add to cart buttons
function setupAddToCartButtons() {
    const addToCartButtons = document.querySelectorAll('.add-to-cart-btn');
    
    addToCartButtons.forEach(button => {
        button.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            
            const productId = this.dataset.productId;
            const quantity = this.dataset.quantity || 1;
            
            // Add loading state
            const originalText = this.innerHTML;
            this.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Đang thêm...';
            this.disabled = true;
            
            // Use main.js addToCart function
            if (typeof addToCart === 'function') {
                addToCart(productId, quantity);
            }
            
            // Reset button after delay
            setTimeout(() => {
                this.innerHTML = originalText;
                this.disabled = false;
            }, 1000);
        });
    });
}

// Search functionality
function setupSearch() {
    const searchInput = document.querySelector('.search-input');
    
    if (searchInput) {
        let searchTimeout;
        
        searchInput.addEventListener('input', function() {
            clearTimeout(searchTimeout);
            searchTimeout = setTimeout(() => {
                const searchTerm = this.value.toLowerCase().trim();
                filterVisibleProducts(searchTerm);
            }, 300);
        });
    }
}

// Filter products on current page
function filterVisibleProducts(searchTerm) {
    const productCards = document.querySelectorAll('.product-card');
    
    productCards.forEach(card => {
        const productName = card.querySelector('.product-name');
        const productCategory = card.querySelector('.category-tag');
        
        if (productName) {
            const name = productName.textContent.toLowerCase();
            const category = productCategory ? productCategory.textContent.toLowerCase() : '';
            
            const matches = name.includes(searchTerm) || category.includes(searchTerm);
            
            if (matches || searchTerm === '') {
                card.style.display = '';
                card.classList.remove('hidden');
            } else {
                card.style.display = 'none';
                card.classList.add('hidden');
            }
        }
    });
    
    // Show no results message if needed
    const visibleProducts = document.querySelectorAll('.product-card:not(.hidden)');
    const noResultsMsg = document.querySelector('.no-results-message');
    
    if (visibleProducts.length === 0 && searchTerm !== '') {
        if (!noResultsMsg) {
            const productsGrid = document.querySelector('.products-grid');
            if (productsGrid) {
                const message = document.createElement('div');
                message.className = 'no-results-message';
                message.innerHTML = `
                    <div style="text-align: center; padding: 2rem; color: #6c757d;">
                        <i class="fas fa-search" style="font-size: 3rem; margin-bottom: 1rem;"></i>
                        <h3>Không tìm thấy sản phẩm</h3>
                        <p>Không có sản phẩm nào phù hợp với từ khóa "<strong>${searchTerm}</strong>"</p>
                    </div>
                `;
                productsGrid.appendChild(message);
            }
        }
    } else if (noResultsMsg) {
        noResultsMsg.remove();
    }
}

// Hero buttons functionality
function setupHeroButtons() {
    const heroButtons = document.querySelectorAll('.hero-buttons .btn');
    
    heroButtons.forEach(button => {
        button.addEventListener('click', function(e) {
            // Add click animation
            this.style.transform = 'scale(0.95)';
            setTimeout(() => {
                this.style.transform = '';
            }, 150);
        });
    });
}

// Smooth scroll for anchor links
function initSmoothScroll() {
    const anchorLinks = document.querySelectorAll('a[href^="#"]');
    
    anchorLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            const targetElement = document.querySelector(targetId);
            
            if (targetElement) {
                targetElement.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
}

// Call smooth scroll init
document.addEventListener('DOMContentLoaded', initSmoothScroll);
