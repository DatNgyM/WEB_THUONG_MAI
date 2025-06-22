<?php
// Product data is already loaded and validated in index.php
// Get product ID from URL
$product_id = intval($_GET['id'] ?? 0);

// Get related products
try {
    $productModel = new ProductModel();
    $related_products = $productModel->getRelatedProducts($product_id, $product['category'] ?? '', 4);
} catch (Exception $e) {
    error_log("Error loading related products: " . $e->getMessage());
    $related_products = [];
}

$page_title = $product['name'];
?>

<!-- Product Detail Header -->
<section class="product-detail-header">
    <div class="container">
        <div class="breadcrumb">
            <a href="index.php">Trang chủ</a>
            <span class="breadcrumb-separator"><i class="fas fa-chevron-right"></i></span>
            <a href="index.php?page=products">Sản phẩm</a>
            <span class="breadcrumb-separator"><i class="fas fa-chevron-right"></i></span>
            <?php if (!empty($product['category'])): ?>
                <a href="index.php?page=products&category=<?php echo urlencode($product['category']); ?>">
                    <?php echo htmlspecialchars($product['category']); ?>
                </a>
                <span class="breadcrumb-separator"><i class="fas fa-chevron-right"></i></span>
            <?php endif; ?>
            <span class="breadcrumb-current"><?php echo htmlspecialchars($product['name']); ?></span>
        </div>
    </div>
</section>

<!-- Product Detail Content -->
<section class="product-detail-content">
    <div class="container">
        <div class="product-detail-layout">
            <!-- Product Images -->
            <div class="product-images">
                <div class="main-image">
                    <img src="<?php echo !empty($product['image_url']) ? $product['image_url'] : 'images/placeholder.jpg'; ?>"
                        alt="<?php echo htmlspecialchars($product['name']); ?>" class="main-product-image"
                        id="mainImage">
                    <div class="image-zoom" id="imageZoom"></div>
                </div>

                <?php if (!empty($product['images'])): ?>
                    <div class="thumbnail-images">
                        <div class="thumbnail-item active">
                            <img src="<?php echo !empty($product['image_url']) ? $product['image_url'] : 'images/placeholder.jpg'; ?>"
                                alt="<?php echo htmlspecialchars($product['name']); ?>">
                        </div>
                        <?php foreach ($product['images'] as $image): ?>
                            <div class="thumbnail-item">
                                <img src="<?php echo $image; ?>" alt="<?php echo htmlspecialchars($product['name']); ?>">
                            </div>
                        <?php endforeach; ?>
                    </div>
                <?php endif; ?>
            </div>

            <!-- Product Info -->
            <div class="product-info">
                <h1 class="product-title"><?php echo htmlspecialchars($product['name']); ?></h1>

                <div class="product-rating">
                    <?php
                    $rating = $product['rating'] ?? 4.5;
                    $full_stars = floor($rating);
                    $half_star = ($rating - $full_stars) >= 0.5;

                    for ($i = 1; $i <= 5; $i++):
                        if ($i <= $full_stars): ?>
                            <i class="fas fa-star"></i>
                        <?php elseif ($i == $full_stars + 1 && $half_star): ?>
                            <i class="fas fa-star-half-alt"></i>
                        <?php else: ?>
                            <i class="far fa-star"></i>
                        <?php endif;
                    endfor; ?>
                    <span class="rating-text">(<?php echo $rating; ?>) - <?php echo $product['reviews_count'] ?? 0; ?>
                        đánh giá</span>
                </div>

                <div class="product-price">
                    <?php if (!empty($product['sale_price']) && $product['sale_price'] < $product['price']): ?>
                        <span class="original-price"><?php echo number_format($product['price'], 0, ',', '.'); ?>₫</span>
                        <span class="sale-price"><?php echo number_format($product['sale_price'], 0, ',', '.'); ?>₫</span>
                        <span class="discount-percent">
                            -<?php echo round((($product['price'] - $product['sale_price']) / $product['price']) * 100); ?>%
                        </span>
                    <?php else: ?>
                        <span class="current-price"><?php echo number_format($product['price'], 0, ',', '.'); ?>₫</span>
                    <?php endif; ?>
                </div>

                <?php if (!empty($product['category'])): ?>
                    <div class="product-category">
                        <span class="category-label">Danh mục:</span>
                        <a href="index.php?page=products&category=<?php echo urlencode($product['category']); ?>"
                            class="category-link">
                            <?php echo htmlspecialchars($product['category']); ?>
                        </a>
                    </div>
                <?php endif; ?>

                <div class="product-stock">
                    <?php if (($product['stock'] ?? 0) > 0): ?>
                        <span class="stock-available">
                            <i class="fas fa-check-circle"></i> Còn hàng (<?php echo $product['stock']; ?> sản phẩm)
                        </span>
                    <?php else: ?>
                        <span class="stock-unavailable">
                            <i class="fas fa-times-circle"></i> Hết hàng
                        </span>
                    <?php endif; ?>
                </div>

                <div class="product-description">
                    <h3>Mô tả sản phẩm</h3>
                    <div class="description-content">
                        <?php echo nl2br(htmlspecialchars($product['description'] ?? 'Chưa có mô tả cho sản phẩm này.')); ?>
                    </div>
                </div>

                <!-- Add to Cart Form -->
                <div class="product-actions">
                    <form class="add-to-cart-form" data-product-id="<?php echo $product['id']; ?>">
                        <div class="quantity-input">
                            <label for="quantity">Số lượng:</label>
                            <div class="quantity-controls">
                                <button type="button" class="quantity-btn quantity-decrease">-</button>
                                <input type="number" name="quantity" id="quantity" value="1" min="1"
                                    max="<?php echo $product['stock'] ?? 999; ?>" class="quantity-field">
                                <button type="button" class="quantity-btn quantity-increase">+</button>
                            </div>
                        </div>

                        <div class="action-buttons">
                            <?php if (($product['stock'] ?? 0) > 0): ?>
                                <button type="submit" class="btn btn-primary btn-lg add-to-cart-btn">
                                    <i class="fas fa-shopping-cart"></i> Thêm vào giỏ hàng
                                </button>
                                <button type="button" class="btn btn-outline btn-lg buy-now-btn">
                                    <i class="fas fa-bolt"></i> Mua ngay
                                </button>
                            <?php else: ?>
                                <button type="button" class="btn btn-disabled btn-lg" disabled>
                                    <i class="fas fa-times"></i> Hết hàng
                                </button>
                            <?php endif; ?>
                        </div>
                    </form>
                </div>

                <!-- Product Features -->
                <div class="product-features">
                    <div class="feature-item">
                        <i class="fas fa-shipping-fast"></i>
                        <span>Giao hàng miễn phí</span>
                    </div>
                    <div class="feature-item">
                        <i class="fas fa-shield-alt"></i>
                        <span>Bảo hành chính hãng</span>
                    </div>
                    <div class="feature-item">
                        <i class="fas fa-undo-alt"></i>
                        <span>Đổi trả trong 30 ngày</span>
                    </div>
                    <div class="feature-item">
                        <i class="fas fa-headset"></i>
                        <span>Hỗ trợ 24/7</span>
                    </div>
                </div>
            </div>
        </div>
    </div>
</section>

<!-- Product Tabs -->
<section class="product-tabs">
    <div class="container">
        <div class="tabs-nav">
            <button class="tab-btn active" data-tab="specs">Thông số kỹ thuật</button>
            <button class="tab-btn" data-tab="reviews">Đánh giá</button>
            <button class="tab-btn" data-tab="shipping">Vận chuyển</button>
        </div>

        <div class="tabs-content">
            <!-- Specifications Tab -->
            <div class="tab-panel active" id="specs-tab">
                <div class="specifications">
                    <?php if (!empty($product['specifications'])): ?>
                        <?php
                        $specs = json_decode($product['specifications'], true);
                        if ($specs && is_array($specs)):
                            ?>
                            <div class="specs-grid">
                                <?php foreach ($specs as $key => $value): ?>
                                    <div class="spec-row">
                                        <div class="spec-label"><?php echo htmlspecialchars($key); ?></div>
                                        <div class="spec-value"><?php echo htmlspecialchars($value); ?></div>
                                    </div>
                                <?php endforeach; ?>
                            </div>
                        <?php else: ?>
                            <p>Thông số kỹ thuật đang được cập nhật.</p>
                        <?php endif; ?>
                    <?php else: ?>
                        <p>Thông số kỹ thuật đang được cập nhật.</p>
                    <?php endif; ?>
                </div>
            </div>

            <!-- Reviews Tab -->
            <div class="tab-panel" id="reviews-tab">
                <div class="reviews-section">
                    <div class="reviews-summary">
                        <div class="rating-overview">
                            <div class="rating-score">
                                <span class="score"><?php echo $rating; ?></span>
                                <div class="rating-stars">
                                    <?php for ($i = 1; $i <= 5; $i++):
                                        if ($i <= $full_stars): ?>
                                            <i class="fas fa-star"></i>
                                        <?php elseif ($i == $full_stars + 1 && $half_star): ?>
                                            <i class="fas fa-star-half-alt"></i>
                                        <?php else: ?>
                                            <i class="far fa-star"></i>
                                        <?php endif;
                                    endfor; ?>
                                </div>
                                <p><?php echo $product['reviews_count'] ?? 0; ?> đánh giá</p>
                            </div>
                        </div>
                    </div>

                    <div class="reviews-list">
                        <p>Tính năng đánh giá đang được phát triển.</p>
                    </div>
                </div>
            </div>

            <!-- Shipping Tab -->
            <div class="tab-panel" id="shipping-tab">
                <div class="shipping-info">
                    <div class="shipping-methods">
                        <h4>Phương thức vận chuyển</h4>
                        <div class="shipping-option">
                            <i class="fas fa-shipping-fast"></i>
                            <div>
                                <strong>Giao hàng nhanh</strong>
                                <p>Giao trong 24h tại TP.HCM và Hà Nội</p>
                            </div>
                        </div>
                        <div class="shipping-option">
                            <i class="fas fa-truck"></i>
                            <div>
                                <strong>Giao hàng tiêu chuẩn</strong>
                                <p>Giao trong 2-3 ngày làm việc</p>
                            </div>
                        </div>
                    </div>

                    <div class="return-policy">
                        <h4>Chính sách đổi trả</h4>
                        <ul>
                            <li>Đổi trả miễn phí trong 30 ngày</li>
                            <li>Sản phẩm còn nguyên vẹn, chưa sử dụng</li>
                            <li>Có hóa đơn mua hàng</li>
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    </div>
</section>

<!-- Related Products -->
<?php if (!empty($related_products)): ?>
    <section class="related-products">
        <div class="container">
            <div class="section-header">
                <h2 class="section-title">Sản phẩm liên quan</h2>
            </div>

            <div class="products-grid">
                <?php foreach ($related_products as $related): ?>
                    <div class="product-card">
                        <div class="product-image">
                            <img src="<?php echo !empty($related['image_url']) ? $related['image_url'] : 'images/placeholder.jpg'; ?>"
                                alt="<?php echo htmlspecialchars($related['name']); ?>" class="product-img">
                            <div class="product-overlay">
                                <a href="index.php?page=product-detail&id=<?php echo $related['id']; ?>"
                                    class="btn btn-primary btn-sm">
                                    <i class="fas fa-eye"></i> Chi tiết
                                </a>
                                <button class="btn btn-outline btn-sm add-to-cart-btn"
                                    data-product-id="<?php echo $related['id']; ?>">
                                    <i class="fas fa-shopping-cart"></i> Thêm vào giỏ
                                </button>
                            </div>
                        </div>

                        <div class="product-info">
                            <h3 class="product-name">
                                <a href="index.php?page=product-detail&id=<?php echo $related['id']; ?>">
                                    <?php echo htmlspecialchars($related['name']); ?>
                                </a>
                            </h3>

                            <div class="product-price">
                                <?php if (!empty($related['sale_price']) && $related['sale_price'] < $related['price']): ?>
                                    <span
                                        class="original-price"><?php echo number_format($related['price'], 0, ',', '.'); ?>₫</span>
                                    <span
                                        class="sale-price"><?php echo number_format($related['sale_price'], 0, ',', '.'); ?>₫</span>
                                <?php else: ?>
                                    <span class="current-price"><?php echo number_format($related['price'], 0, ',', '.'); ?>₫</span>
                                <?php endif; ?>
                            </div>
                        </div>
                    </div>
                <?php endforeach; ?>
            </div>
        </div>
    </section>
<?php endif; ?>

<script>
    document.addEventListener('DOMContentLoaded', function () {
        // Quantity controls
        const quantityDecrease = document.querySelector('.quantity-decrease');
        const quantityIncrease = document.querySelector('.quantity-increase');
        const quantityField = document.querySelector('.quantity-field');

        if (quantityDecrease && quantityIncrease && quantityField) {
            quantityDecrease.addEventListener('click', function () {
                let value = parseInt(quantityField.value);
                if (value > 1) {
                    quantityField.value = value - 1;
                }
            });

            quantityIncrease.addEventListener('click', function () {
                let value = parseInt(quantityField.value);
                let max = parseInt(quantityField.getAttribute('max'));
                if (value < max) {
                    quantityField.value = value + 1;
                }
            });
        }

        // Tabs functionality
        const tabButtons = document.querySelectorAll('.tab-btn');
        const tabPanels = document.querySelectorAll('.tab-panel');

        tabButtons.forEach(btn => {
            btn.addEventListener('click', function () {
                const targetTab = this.dataset.tab;

                // Remove active class from all buttons and panels
                tabButtons.forEach(b => b.classList.remove('active'));
                tabPanels.forEach(p => p.classList.remove('active'));

                // Add active class to clicked button and corresponding panel
                this.classList.add('active');
                document.getElementById(targetTab + '-tab').classList.add('active');
            });
        });

        // Image thumbnails
        const thumbnails = document.querySelectorAll('.thumbnail-item');
        const mainImage = document.getElementById('mainImage');

        thumbnails.forEach(thumb => {
            thumb.addEventListener('click', function () {
                thumbnails.forEach(t => t.classList.remove('active'));
                this.classList.add('active');

                const newSrc = this.querySelector('img').src;
                mainImage.src = newSrc;
            });
        });

        // Buy now button
        const buyNowBtn = document.querySelector('.buy-now-btn');
        if (buyNowBtn) {
            buyNowBtn.addEventListener('click', function () {
                // Add to cart first, then redirect to checkout
                const form = document.querySelector('.add-to-cart-form');
                const productId = form.dataset.productId;
                const quantity = document.getElementById('quantity').value;

                // Add to cart logic here (same as add to cart)
                // Then redirect to checkout
                window.location.href = 'index.php?page=checkout';
            });
        }
    });
</script>

<?php
// Add specific JavaScript for product detail page
$additional_js = ['JS/productDetails.js', 'JS/cart.js'];
?>