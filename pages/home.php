<?php
$page_title = "Trang chủ";

// Get featured products
try {
    $productModel = new ProductModel();
    $featured_products = $productModel->getFeaturedProducts(8);
} catch (Exception $e) {
    $featured_products = [];
    error_log("Error loading featured products: " . $e->getMessage());
}
?>

<!-- Hero Section -->
<section class="hero-section">
    <div class="hero-container">
        <div class="hero-content">
            <div class="hero-text">
                <h1 class="hero-title">
                    Chào mừng đến với <span class="brand-name">Five:07</span>
                </h1>
                <p class="hero-subtitle">
                    Khám phá những sản phẩm công nghệ tốt nhất với giá cả hợp lý
                </p>
                <div class="hero-buttons">
                    <a href="index.php?page=products" class="btn btn-primary">
                        <i class="fas fa-shopping-bag"></i> Mua sắm ngay
                    </a>
                    <a href="#about" class="btn btn-outline">
                        <i class="fas fa-info-circle"></i> Tìm hiểu thêm
                    </a>
                </div>
            </div>
            <div class="hero-image">
                <img src="images/banner_QC.png" alt="Five:07 Banner" class="hero-img">
            </div>
        </div>
    </div>
</section>

<!-- Features Section -->
<section class="features-section">
    <div class="container">
        <div class="features-grid">
            <div class="feature-card">
                <div class="feature-icon">
                    <i class="fas fa-shipping-fast"></i>
                </div>
                <h3 class="feature-title">Giao hàng nhanh</h3>
                <p class="feature-desc">Giao hàng trong 24h với dịch vụ chuyển phát nhanh</p>
            </div>

            <div class="feature-card">
                <div class="feature-icon">
                    <i class="fas fa-shield-alt"></i>
                </div>
                <h3 class="feature-title">Bảo hành chính hãng</h3>
                <p class="feature-desc">Cam kết 100% sản phẩm chính hãng, bảo hành toàn diện</p>
            </div>

            <div class="feature-card">
                <div class="feature-icon">
                    <i class="fas fa-headset"></i>
                </div>
                <h3 class="feature-title">Hỗ trợ 24/7</h3>
                <p class="feature-desc">Đội ngũ chăm sóc khách hàng tận tâm, hỗ trợ mọi lúc</p>
            </div>

            <div class="feature-card">
                <div class="feature-icon">
                    <i class="fas fa-undo-alt"></i>
                </div>
                <h3 class="feature-title">Đổi trả dễ dàng</h3>
                <p class="feature-desc">Chính sách đổi trả linh hoạt trong 30 ngày</p>
            </div>
        </div>
    </div>
</section>

<!-- Featured Products Section -->
<section class="products-section">
    <div class="container">
        <div class="section-header">
            <h2 class="section-title">Sản phẩm nổi bật</h2>
            <p class="section-subtitle">Những sản phẩm được yêu thích nhất</p>
        </div>

        <?php if (!empty($featured_products)): ?>
            <div class="products-grid">
                <?php foreach ($featured_products as $product): ?>
                    <div class="product-card" data-product-id="<?php echo $product['id']; ?>">
                        <div class="product-image">
                            <img src="<?php echo !empty($product['image_url']) ? $product['image_url'] : 'images/placeholder.jpg'; ?>"
                                alt="<?php echo htmlspecialchars($product['name']); ?>" class="product-img">
                            <div class="product-overlay">
                                <a href="index.php?page=product-detail&id=<?php echo $product['id']; ?>"
                                    class="btn btn-primary btn-sm">
                                    <i class="fas fa-eye"></i> Xem chi tiết
                                </a>
                                <button class="btn btn-outline btn-sm add-to-cart-btn"
                                    data-product-id="<?php echo $product['id']; ?>">
                                    <i class="fas fa-shopping-cart"></i> Thêm vào giỏ
                                </button>
                            </div>
                        </div>

                        <div class="product-info">
                            <h3 class="product-name">
                                <a href="index.php?page=product-detail&id=<?php echo $product['id']; ?>">
                                    <?php echo htmlspecialchars($product['name']); ?>
                                </a>
                            </h3>

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
                                <span class="rating-text">(<?php echo $rating; ?>)</span>
                            </div>

                            <div class="product-price">
                                <?php if (!empty($product['sale_price']) && $product['sale_price'] < $product['price']): ?>
                                    <span
                                        class="original-price"><?php echo number_format($product['price'], 0, ',', '.'); ?>₫</span>
                                    <span
                                        class="sale-price"><?php echo number_format($product['sale_price'], 0, ',', '.'); ?>₫</span>
                                <?php else: ?>
                                    <span class="current-price"><?php echo number_format($product['price'], 0, ',', '.'); ?>₫</span>
                                <?php endif; ?>
                            </div>

                            <?php if (!empty($product['category'])): ?>
                                <div class="product-category">
                                    <span class="category-tag"><?php echo htmlspecialchars($product['category']); ?></span>
                                </div>
                            <?php endif; ?>
                        </div>
                    </div>
                <?php endforeach; ?>
            </div>

            <div class="section-footer">
                <a href="index.php?page=products" class="btn btn-primary btn-lg">
                    <i class="fas fa-arrow-right"></i> Xem tất cả sản phẩm
                </a>
            </div>
        <?php else: ?>
            <div class="no-products">
                <div class="no-products-content">
                    <i class="fas fa-box-open"></i>
                    <h3>Không có sản phẩm nào</h3>
                    <p>Hiện tại chưa có sản phẩm nào để hiển thị.</p>
                    <a href="index.php?page=products" class="btn btn-primary">
                        <i class="fas fa-plus"></i> Thêm sản phẩm mới
                    </a>
                </div>
            </div>
        <?php endif; ?>
    </div>
</section>

<!-- Categories Section -->
<section class="categories-section">
    <div class="container">
        <div class="section-header">
            <h2 class="section-title">Danh mục sản phẩm</h2>
            <p class="section-subtitle">Khám phá các danh mục sản phẩm đa dạng</p>
        </div>

        <div class="categories-grid">
            <div class="category-card">
                <div class="category-image">
                    <img src="images/iphone-16-pro-max-titan.jpg" alt="Smartphone" class="category-img">
                </div>
                <div class="category-info">
                    <h3 class="category-name">Điện thoại</h3>
                    <p class="category-desc">iPhone, Samsung, Xiaomi...</p>
                    <a href="index.php?page=products&category=smartphones" class="category-link">
                        Xem ngay <i class="fas fa-arrow-right"></i>
                    </a>
                </div>
            </div>

            <div class="category-card">
                <div class="category-image">
                    <img src="images/macbook-pro-14-inch-m4-16gb-512gb-tgdd-den-1-638660152965882579-750x500.jpg"
                        alt="Laptop" class="category-img">
                </div>
                <div class="category-info">
                    <h3 class="category-name">Laptop</h3>
                    <p class="category-desc">MacBook, Dell, HP, Asus...</p>
                    <a href="index.php?page=products&category=laptops" class="category-link">
                        Xem ngay <i class="fas fa-arrow-right"></i>
                    </a>
                </div>
            </div>

            <div class="category-card">
                <div class="category-image">
                    <img src="images/apple-watch-ultra-2-lte-49mm-vien-titanium-day-milan-638641727211652156-750x500.jpg"
                        alt="Watch" class="category-img">
                </div>
                <div class="category-info">
                    <h3 class="category-name">Đồng hồ</h3>
                    <p class="category-desc">Apple Watch, Samsung, Casio...</p>
                    <a href="index.php?page=products&category=watches" class="category-link">
                        Xem ngay <i class="fas fa-arrow-right"></i>
                    </a>
                </div>
            </div>

            <div class="category-card">
                <div class="category-image">
                    <img src="images/banner_QC.png" alt="Accessories" class="category-img">
                </div>
                <div class="category-info">
                    <h3 class="category-name">Phụ kiện</h3>
                    <p class="category-desc">Tai nghe, Sạc, Ốp lưng...</p>
                    <a href="index.php?page=products&category=accessories" class="category-link">
                        Xem ngay <i class="fas fa-arrow-right"></i>
                    </a>
                </div>
            </div>
        </div>
    </div>
</section>

<!-- About Section -->
<section class="about-section" id="about">
    <div class="container">
        <div class="about-content">
            <div class="about-text">
                <h2 class="about-title">Về Five:07</h2>
                <p class="about-desc">
                    Five:07 là nền tảng thương mại điện tử hàng đầu, chuyên cung cấp các sản phẩm
                    công nghệ chất lượng cao với giá cả cạnh tranh. Chúng tôi cam kết mang đến cho
                    khách hàng trải nghiệm mua sắm tuyệt vời nhất.
                </p>
                <div class="about-stats">
                    <div class="stat-item">
                        <div class="stat-number">1000+</div>
                        <div class="stat-label">Sản phẩm</div>
                    </div>
                    <div class="stat-item">
                        <div class="stat-number">10K+</div>
                        <div class="stat-label">Khách hàng</div>
                    </div>
                    <div class="stat-item">
                        <div class="stat-number">99%</div>
                        <div class="stat-label">Hài lòng</div>
                    </div>
                </div>
            </div>
            <div class="about-image">
                <img src="images/logo.jpg" alt="Five:07 About" class="about-img">
            </div>
        </div>
    </div>
</section>

<?php
// Add specific JavaScript for home page
$additional_js = ['JS/home.js'];
?>