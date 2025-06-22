<!-- Helper function cho Javascript để render sản phẩm -->
<script>
    function formatPrice(price) {
        return new Intl.NumberFormat('vi-VN').format(price) + ' ₫';
    }

    function getProductImageUrl(imagePath) {
        return '<?= BASE_URL ?>/public/' + imagePath;
    }
</script>

<!-- Hero Section with Carousel -->
<section class="hero-slider">
    <div id="mainCarousel" class="carousel slide" data-bs-ride="carousel">
        <div class="carousel-indicators">
            <button type="button" data-bs-target="#mainCarousel" data-bs-slide-to="0" class="active"></button>
            <button type="button" data-bs-target="#mainCarousel" data-bs-slide-to="1"></button>
            <button type="button" data-bs-target="#mainCarousel" data-bs-slide-to="2"></button>
        </div>
        <div class="carousel-inner rounded">
            <div class="carousel-item active">
                <img src="<?= asset('images/iphone-16-pro-max-titan-sa-mac-2.jpg') ?>" class="d-block w-100"
                    alt="iPhone 16 Pro Max">
                <div class="carousel-caption d-none d-md-block">
                    <h2>iPhone 16 Pro Max</h2>
                    <p>Trải nghiệm đỉnh cao với iPhone 16 Pro Max mới nhất</p>
                    <a href="<?= BASE_URL ?>/product/detail/1" class="btn btn-primary">Khám phá ngay</a>
                </div>
            </div>
            <div class="carousel-item">
                <img src="<?= asset('images/macbook-pro-14-inch-m4-16gb-512gb-tgdd-den-1-638660152965882579-750x500.jpg') ?>"
                    class="d-block w-100" alt="MacBook Pro">
                <div class="carousel-caption d-none d-md-block">
                    <h2>MacBook Pro M4</h2>
                    <p>Sức mạnh vượt trội với chip M4 mới</p>
                    <a href="<?= BASE_URL ?>/product/detail/2" class="btn btn-primary">Mua ngay</a>
                </div>
            </div>
            <div class="carousel-item">
                <img src="<?= asset('images/apple-watch-ultra-2-lte-49mm-vien-titanium-day-milan-638641727211652156-750x500.jpg') ?>"
                    class="d-block w-100" alt="Apple Watch">
                <div class="carousel-caption d-none d-md-block">
                    <h2>Apple Watch Ultra 2</h2>
                    <p>Đồng hồ thông minh cho người yêu thể thao</p>
                    <a href="<?= BASE_URL ?>/product/detail/3" class="btn btn-primary">Tìm hiểu thêm</a>
                </div>
            </div>
        </div>
        <button class="carousel-control-prev" type="button" data-bs-target="#mainCarousel" data-bs-slide="prev">
            <span class="carousel-control-prev-icon" aria-hidden="true"></span>
            <span class="visually-hidden">Previous</span>
        </button>
        <button class="carousel-control-next" type="button" data-bs-target="#mainCarousel" data-bs-slide="next">
            <span class="carousel-control-next-icon" aria-hidden="true"></span>
            <span class="visually-hidden">Next</span>
        </button>
    </div>
</section>

<!-- Featured Categories -->
<section class="mt-5">
    <div class="container">
        <h2 class="section-title">Danh mục nổi bật</h2>
        <div class="row g-4">
            <?php foreach ($categories as $category): ?>
                <div class="col-md-6 col-lg-3">
                    <div class="category-card">
                        <img src="<?= asset('images/categories/' . ($category->slug ?? 'default') . '.jpg') ?>"
                            alt="<?= $category->name ?>" class="img-fluid w-100">
                        <a href="<?= BASE_URL ?>/product/category/<?= $category->id ?>">
                            <div class="category-overlay">
                                <h3 class="category-title"><?= $category->name ?></h3>
                            </div>
                        </a>
                    </div>
                </div>
            <?php endforeach; ?>
        </div>
    </div>
</section>

<!-- Featured Products -->
<section class="mt-5">
    <div class="container">
        <h2 class="section-title">Sản phẩm nổi bật</h2>
        <div class="row g-4">
            <?php if (!empty($featuredProducts)): ?>
                <?php foreach ($featuredProducts as $product): ?>
                    <div class="col-6 col-md-4 col-lg-3">
                        <div class="card product-card h-100">
                            <?php if (isset($product->discount_percent) && $product->discount_percent > 0): ?>
                                <div class="badge-corner">
                                    <span>-<?= $product->discount_percent ?>%</span>
                                </div>
                            <?php endif; ?>
                            <img src="<?= asset($product->image) ?>" class="card-img-top" alt="<?= $product->name ?>">
                            <div class="card-body">
                                <h5 class="card-title text-truncate"><?= $product->name ?></h5>
                                <p class="card-text small text-muted text-truncate"><?= $product->category_name ?></p>
                                <div class="d-flex justify-content-between align-items-center mb-2">
                                    <?php if (isset($product->discount_percent) && $product->discount_percent > 0): ?>
                                        <span
                                            class="text-danger fw-bold"><?= number_format($product->price * (1 - $product->discount_percent / 100)) ?>
                                            đ</span>
                                        <span class="price-original"><?= number_format($product->price) ?> đ</span>
                                    <?php else: ?>
                                        <span class="fw-bold"><?= number_format($product->price) ?> đ</span>
                                    <?php endif; ?>
                                </div>
                            </div>
                            <div class="card-footer bg-white border-top-0 d-flex justify-content-between">
                                <a href="<?= BASE_URL ?>/product/detail/<?= $product->id ?>"
                                    class="btn btn-sm btn-outline-secondary">Chi tiết</a>
                                <button class="btn btn-sm btn-primary add-to-cart-btn" data-product-id="<?= $product->id ?>"
                                    data-product-name="<?= $product->name ?>"
                                    data-product-price="<?= $product->price * (1 - $product->discount_percent / 100) ?>">
                                    <i class="fas fa-shopping-cart"></i> Thêm vào giỏ
                                </button>
                            </div>
                        </div>
                    </div>
                <?php endforeach; ?>
            <?php else: ?>
                <div class="col-12">
                    <div class="alert alert-info">Không có sản phẩm nổi bật</div>
                </div>
            <?php endif; ?>
        </div>
    </div>
</section>

<!-- Latest Products -->
<section class="mt-5">
    <div class="container">
        <h2 class="section-title">Sản phẩm mới nhất</h2>
        <div class="row g-4">
            <?php if (!empty($newProducts)): ?>
                <?php foreach ($newProducts as $product): ?>
                    <div class="col-6 col-md-4 col-lg-3">
                        <div class="card product-card h-100">
                            <?php if ($product->discount_percent > 0): ?>
                                <div class="badge-corner">
                                    <span>-<?= $product->discount_percent ?>%</span>
                                </div>
                            <?php endif; ?>
                            <img src="<?= BASE_URL ?>/images/products/<?= $product->image ?>" class="card-img-top"
                                alt="<?= $product->name ?>">
                            <div class="card-body">
                                <h5 class="card-title text-truncate"><?= $product->name ?></h5>
                                <p class="card-text small text-muted text-truncate"><?= $product->category_name ?></p>
                                <div class="d-flex justify-content-between align-items-center mb-2">
                                    <?php if ($product->discount_percent > 0): ?>
                                        <span
                                            class="text-danger fw-bold"><?= number_format($product->price * (1 - $product->discount_percent / 100)) ?>
                                            đ</span>
                                        <span class="price-original"><?= number_format($product->price) ?> đ</span>
                                    <?php else: ?>
                                        <span class="fw-bold"><?= number_format($product->price) ?> đ</span>
                                    <?php endif; ?>
                                </div>
                            </div>
                            <div class="card-footer bg-white border-top-0 d-flex justify-content-between">
                                <a href="<?= BASE_URL ?>/product/detail/<?= $product->id ?>"
                                    class="btn btn-sm btn-outline-secondary">Chi tiết</a>
                                <button class="btn btn-sm btn-primary add-to-cart-btn" data-product-id="<?= $product->id ?>"
                                    data-product-name="<?= $product->name ?>"
                                    data-product-price="<?= $product->price * (1 - $product->discount_percent / 100) ?>">
                                    <i class="fas fa-shopping-cart"></i> Thêm vào giỏ
                                </button>
                            </div>
                        </div>
                    </div>
                <?php endforeach; ?>
            <?php else: ?>
                <div class="col-12">
                    <div class="alert alert-info">Không có sản phẩm mới</div>
                </div>
            <?php endif; ?>
        </div>

        <div class="text-center mt-4">
            <a href="<?= BASE_URL ?>/product" class="btn btn-outline-primary">Xem tất cả sản phẩm</a>
        </div>
    </div>
</section>

<!-- Features -->
<section class="mt-5 bg-light py-5">
    <div class="container">
        <div class="row g-4">
            <div class="col-md-3">
                <div class="text-center">
                    <i class="fas fa-shipping-fast fa-3x text-primary mb-3"></i>
                    <h5>Giao hàng nhanh chóng</h5>
                    <p class="text-muted">Giao hàng trong 24 giờ</p>
                </div>
            </div>
            <div class="col-md-3">
                <div class="text-center">
                    <i class="fas fa-undo fa-3x text-primary mb-3"></i>
                    <h5>Đổi trả 30 ngày</h5>
                    <p class="text-muted">Dễ dàng đổi trả sản phẩm</p>
                </div>
            </div>
            <div class="col-md-3">
                <div class="text-center">
                    <i class="fas fa-shield-alt fa-3x text-primary mb-3"></i>
                    <h5>Bảo hành chính hãng</h5>
                    <p class="text-muted">Sản phẩm chính hãng 100%</p>
                </div>
            </div>
            <div class="col-md-3">
                <div class="text-center">
                    <i class="fas fa-headset fa-3x text-primary mb-3"></i>
                    <h5>Hỗ trợ 24/7</h5>
                    <p class="text-muted">Tư vấn và hỗ trợ mọi lúc</p>
                </div>
            </div>
        </div>
    </div>
</section>