<!-- Breadcrumb -->
<nav aria-label="breadcrumb" class="mb-4">
    <ol class="breadcrumb">
        <li class="breadcrumb-item"><a href="<?= BASE_URL ?>">Trang chủ</a></li>
        <li class="breadcrumb-item"><a href="<?= BASE_URL ?>/product">Sản phẩm</a></li>
        <li class="breadcrumb-item"><a
                href="<?= BASE_URL ?>/product/category/<?= $product->category_id ?>"><?= $product->category_name ?></a>
        </li>
        <li class="breadcrumb-item active" aria-current="page"><?= $product->name ?></li>
    </ol>
</nav>

<div class="row">
    <div class="col-lg-6">
        <!-- Product Images -->
        <div class="product-images mb-4">
            <img src="<?= asset($product->image) ?>" id="main-product-image"
                class="img-fluid product-detail-img mb-3 w-100" alt="<?= $product->name ?>">

            <!-- Image Thumbnails -->
            <div class="row">
                <div class="col-3">
                    <img src="<?= asset($product->image) ?>" class="img-fluid product-thumbnail active"
                        alt="<?= $product->name ?>">
                </div> <?php if (!empty($product->images)): ?>
                    <?php $imageList = json_decode($product->images, true); ?>
                    <?php if (!empty($imageList) && is_array($imageList)): ?>
                        <?php foreach ($imageList as $index => $img): ?>
                            <div class="col-3">
                                <img src="<?= asset($img) ?>" class="img-fluid product-thumbnail"
                                    alt="<?= $product->name ?> - Image <?= $index + 1 ?>">
                            </div>
                        <?php endforeach; ?>
                    <?php endif; ?>
                <?php endif; ?>
            </div>
        </div>
    </div>

    <div class="col-lg-6">
        <!-- Product Info -->
        <h1 class="h2 mb-2"><?= $product->name ?></h1>

        <!-- Product Category & SKU -->
        <div class="mb-3">
            <span class="badge bg-secondary me-2"><?= $product->category_name ?></span>
            <span class="text-muted">SKU: <?= $product->sku ?? 'N/A' ?></span>
        </div>

        <!-- Product Rating -->
        <div class="mb-3">
            <div class="d-inline-block me-2">
                <?php for ($i = 0; $i < 5; $i++): ?>
                    <?php if ($i < ($product->rating ?? 0)): ?>
                        <i class="fas fa-star text-warning"></i>
                    <?php else: ?>
                        <i class="far fa-star text-warning"></i>
                    <?php endif; ?>
                <?php endfor; ?>
            </div>
            <span>(<?= $product->review_count ?? 0 ?> đánh giá)</span>
        </div>

        <!-- Product Price -->
        <div class="mb-4">
            <?php if ($product->discount_percent > 0): ?>
                <h3 class="text-danger mb-0"><?= number_format($product->price * (1 - $product->discount_percent / 100)) ?>
                    đ</h3>
                <p class="mb-0">
                    <span class="text-muted text-decoration-line-through"><?= number_format($product->price) ?> đ</span>
                    <span class="badge bg-danger ms-2">-<?= $product->discount_percent ?>%</span>
                </p>
            <?php else: ?>
                <h3><?= number_format($product->price) ?> đ</h3>
            <?php endif; ?>
        </div>

        <!-- Product Short Description -->
        <div class="mb-4">
            <p><?= nl2br($product->short_description ?? '') ?></p>
        </div>

        <!-- Product Quantity & Add to Cart -->
        <form class="mb-4" id="add-to-cart-form">
            <input type="hidden" name="product_id" value="<?= $product->id ?>">
            <div class="row align-items-center">
                <div class="col-md-4 col-6">
                    <div class="input-group mb-3">
                        <button class="btn btn-outline-secondary" type="button" id="decrement-quantity">-</button>
                        <input type="text" class="form-control text-center" id="quantity" name="quantity" value="1"
                            min="1">
                        <button class="btn btn-outline-secondary" type="button" id="increment-quantity">+</button>
                    </div>
                </div>
                <div class="col-md-8 col-12">
                    <button type="submit" class="btn btn-primary w-100">
                        <i class="fas fa-shopping-cart me-2"></i> Thêm vào giỏ hàng
                    </button>
                </div>
            </div>
        </form>

        <!-- Product Availability -->
        <div class="mb-4">
            <?php if ($product->stock_quantity > 0): ?>
                <p class="mb-1"><i class="fas fa-check-circle text-success me-2"></i> Còn hàng
                    (<?= $product->stock_quantity ?> sản phẩm)</p>
            <?php else: ?>
                <p class="mb-1"><i class="fas fa-times-circle text-danger me-2"></i> Hết hàng</p>
            <?php endif; ?>
            <p class="mb-1"><i class="fas fa-shipping-fast me-2"></i> Giao hàng miễn phí cho đơn trên 1 triệu đồng</p>
            <p><i class="fas fa-undo me-2"></i> Đổi trả trong vòng 30 ngày</p>
        </div>
    </div>
</div>

<!-- Product Details Tabs -->
<div class="mt-5">
    <ul class="nav nav-tabs" id="productTabs" role="tablist">
        <li class="nav-item" role="presentation">
            <button class="nav-link active" id="description-tab" data-bs-toggle="tab" data-bs-target="#description"
                type="button" role="tab" aria-controls="description" aria-selected="true">Mô tả</button>
        </li>
        <li class="nav-item" role="presentation">
            <button class="nav-link" id="specifications-tab" data-bs-toggle="tab" data-bs-target="#specifications"
                type="button" role="tab" aria-controls="specifications" aria-selected="false">Thông số kỹ thuật</button>
        </li>
        <li class="nav-item" role="presentation">
            <button class="nav-link" id="reviews-tab" data-bs-toggle="tab" data-bs-target="#reviews" type="button"
                role="tab" aria-controls="reviews" aria-selected="false">Đánh giá
                (<?= $product->review_count ?? 0 ?>)</button>
        </li>
    </ul>
    <div class="tab-content p-4 border border-top-0" id="productTabContent">
        <!-- Description Tab -->
        <div class="tab-pane fade show active" id="description" role="tabpanel" aria-labelledby="description-tab">
            <?= nl2br($product->description) ?>
        </div>

        <!-- Specifications Tab -->
        <div class="tab-pane fade" id="specifications" role="tabpanel" aria-labelledby="specifications-tab">
            <table class="table table-striped">
                <tbody>
                    <?php if (!empty($product->specs)): ?>
                        <?php $specs = json_decode($product->specs, true); ?>
                        <?php foreach ($specs as $key => $value): ?>
                            <tr>
                                <td width="30%"><?= $key ?></td>
                                <td><?= $value ?></td>
                            </tr>
                        <?php endforeach; ?>
                    <?php else: ?>
                        <tr>
                            <td colspan="2">Chưa có thông số kỹ thuật</td>
                        </tr>
                    <?php endif; ?>
                </tbody>
            </table>
        </div>

        <!-- Reviews Tab -->
        <div class="tab-pane fade" id="reviews" role="tabpanel" aria-labelledby="reviews-tab">
            <!-- Review Form -->
            <div class="mb-4 p-4 bg-light">
                <h5>Viết đánh giá của bạn</h5>
                <form id="review-form">
                    <input type="hidden" name="product_id" value="<?= $product->id ?>">
                    <div class="mb-3">
                        <label class="form-label">Đánh giá</label>
                        <div class="rating">
                            <?php for ($i = 5; $i >= 1; $i--): ?>
                                <input type="radio" name="rating" value="<?= $i ?>" id="rating-<?= $i ?>">
                                <label for="rating-<?= $i ?>"><i class="fas fa-star"></i></label>
                            <?php endfor; ?>
                        </div>
                    </div>
                    <div class="mb-3">
                        <label for="review-title" class="form-label">Tiêu đề</label>
                        <input type="text" class="form-control" id="review-title" name="title" required>
                    </div>
                    <div class="mb-3">
                        <label for="review-content" class="form-label">Nội dung</label>
                        <textarea class="form-control" id="review-content" name="content" rows="3" required></textarea>
                    </div>
                    <button type="submit" class="btn btn-primary">Gửi đánh giá</button>
                </form>
            </div>

            <!-- Review List -->
            <div id="review-list">
                <?php if (!empty($product->reviews)): ?>
                    <?php foreach ($product->reviews as $review): ?>
                        <div class="card mb-3">
                            <div class="card-body">
                                <div class="d-flex justify-content-between align-items-center mb-2">
                                    <h5 class="card-title mb-0"><?= $review->title ?></h5>
                                    <div>
                                        <?php for ($i = 0; $i < 5; $i++): ?>
                                            <?php if ($i < $review->rating): ?>
                                                <i class="fas fa-star text-warning"></i>
                                            <?php else: ?>
                                                <i class="far fa-star text-warning"></i>
                                            <?php endif; ?>
                                        <?php endfor; ?>
                                    </div>
                                </div>
                                <h6 class="card-subtitle mb-2 text-muted">Đánh giá bởi <?= $review->name ?> vào
                                    <?= date('d/m/Y', strtotime($review->created_at)) ?>
                                </h6>
                                <p class="card-text"><?= nl2br($review->content) ?></p>
                            </div>
                        </div>
                    <?php endforeach; ?>
                <?php else: ?>
                    <p>Chưa có đánh giá nào.</p>
                <?php endif; ?>
            </div>
        </div>
    </div>
</div>

<!-- Related Products -->
<section class="mt-5">
    <h3 class="mb-4">Sản phẩm liên quan</h3>
    <div class="row g-4">
        <?php if (!empty($relatedProducts)): ?>
            <?php foreach ($relatedProducts as $relProduct): ?>
                <div class="col-6 col-md-3">
                    <div class="card product-card h-100">
                        <?php if ($relProduct->discount_percent > 0): ?>
                            <div class="badge-corner">
                                <span>-<?= $relProduct->discount_percent ?>%</span>
                            </div>
                        <?php endif; ?>
                        <img src="<?= BASE_URL ?>/images/products/<?= $relProduct->image ?>" class="card-img-top"
                            alt="<?= $relProduct->name ?>">
                        <div class="card-body">
                            <h5 class="card-title text-truncate"><?= $relProduct->name ?></h5>
                            <div class="d-flex justify-content-between align-items-center mb-2">
                                <?php if ($relProduct->discount_percent > 0): ?>
                                    <span
                                        class="text-danger fw-bold"><?= number_format($relProduct->price * (1 - $relProduct->discount_percent / 100)) ?>
                                        đ</span>
                                    <span class="price-original"><?= number_format($relProduct->price) ?> đ</span>
                                <?php else: ?>
                                    <span class="fw-bold"><?= number_format($relProduct->price) ?> đ</span>
                                <?php endif; ?>
                            </div>
                        </div>
                        <div class="card-footer bg-white border-top-0 d-flex justify-content-between">
                            <a href="<?= BASE_URL ?>/product/detail/<?= $relProduct->id ?>"
                                class="btn btn-sm btn-outline-secondary">Chi tiết</a>
                            <button class="btn btn-sm btn-primary add-to-cart-btn" data-product-id="<?= $relProduct->id ?>"
                                data-product-name="<?= $relProduct->name ?>"
                                data-product-price="<?= $relProduct->price * (1 - $relProduct->discount_percent / 100) ?>">
                                <i class="fas fa-shopping-cart"></i>
                            </button>
                        </div>
                    </div>
                </div>
            <?php endforeach; ?>
        <?php else: ?>
            <div class="col-12">
                <p>Không có sản phẩm liên quan.</p>
            </div>
        <?php endif; ?>
    </div>
</section>

<!-- Product Detail JavaScript -->
<script>
    document.addEventListener('DOMContentLoaded', function () {
        // Product quantity increment/decrement
        const quantityInput = document.getElementById('quantity');
        const decrementBtn = document.getElementById('decrement-quantity');
        const incrementBtn = document.getElementById('increment-quantity');

        decrementBtn.addEventListener('click', function () {
            let value = parseInt(quantityInput.value);
            if (value > 1) {
                quantityInput.value = value - 1;
            }
        });

        incrementBtn.addEventListener('click', function () {
            let value = parseInt(quantityInput.value);
            quantityInput.value = value + 1;
        });

        // Add to cart form submission
        const addToCartForm = document.getElementById('add-to-cart-form');
        addToCartForm.addEventListener('submit', function (e) {
            e.preventDefault();

            const productId = document.querySelector('input[name="product_id"]').value;
            const quantity = document.querySelector('input[name="quantity"]').value;

            // AJAX request to add to cart
            fetch('<?= BASE_URL ?>/cart/add', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                },
                body: `product_id=${productId}&quantity=${quantity}`
            })
                .then(response => response.json())
                .then(data => {
                    if (data.success) {
                        // Show success message
                        alert(data.message);
                        // Update cart count in header
                        document.querySelector('.fa-shopping-cart + .badge').textContent = data.cart_count;
                    } else {
                        alert(data.message);
                    }
                })
                .catch(error => {
                    console.error('Error:', error);
                });
        });

        // Product thumbnails
        const productThumbnails = document.querySelectorAll('.product-thumbnail');
        const mainProductImage = document.getElementById('main-product-image');

        productThumbnails.forEach(thumbnail => {
            thumbnail.addEventListener('click', function () {
                // Remove active class from all thumbnails
                productThumbnails.forEach(item => item.classList.remove('active'));

                // Add active class to clicked thumbnail
                this.classList.add('active');

                // Set main image src to clicked thumbnail src
                mainProductImage.src = this.src;
            });
        });

        // Review form submission
        const reviewForm = document.getElementById('review-form');
        if (reviewForm) {
            reviewForm.addEventListener('submit', function (e) {
                e.preventDefault();

                // Check if user is logged in
                <?php if (!isset($_SESSION['user_id'])): ?>
                    alert('Bạn cần đăng nhập để gửi đánh giá');
                    window.location.href = '<?= BASE_URL ?>/login';
                    return;
                <?php endif; ?>

                const formData = new FormData(reviewForm);

                // AJAX request to submit review
                fetch('<?= BASE_URL ?>/review/add', {
                    method: 'POST',
                    body: formData
                })
                    .then(response => response.json())
                    .then(data => {
                        if (data.success) {
                            alert(data.message);
                            // Reload page to show new review
                            window.location.reload();
                        } else {
                            alert(data.message);
                        }
                    })
                    .catch(error => {
                        console.error('Error:', error);
                    });
            });
        }
    });
</script>