<!-- Breadcrumb -->
<nav aria-label="breadcrumb" class="mb-4">
    <ol class="breadcrumb">
        <li class="breadcrumb-item"><a href="<?= BASE_URL ?>">Trang chủ</a></li>
        <li class="breadcrumb-item active" aria-current="page">Sản phẩm</li>
    </ol>
</nav>

<div class="row">
    <!-- Sidebar Filters -->
    <div class="col-lg-3 mb-4">
        <div class="card">
            <div class="card-header bg-primary text-white">
                <h5 class="card-title mb-0">Lọc sản phẩm</h5>
            </div>
            <div class="card-body">
                <!-- Categories Filter -->
                <h6 class="fw-bold">Danh mục</h6>
                <ul class="list-group list-group-flush mb-3">
                    <li class="list-group-item d-flex justify-content-between align-items-center">
                        <a href="<?= BASE_URL ?>/product" class="text-decoration-none text-dark">Tất cả</a>
                        <span class="badge bg-primary rounded-pill"><?= $totalProducts ?></span>
                    </li>
                    <?php foreach ($categories as $category): ?>
                        <li class="list-group-item d-flex justify-content-between align-items-center">
                            <a href="<?= BASE_URL ?>/product/category/<?= $category->id ?>"
                                class="text-decoration-none text-dark">
                                <?= $category->name ?>
                            </a>
                            <span class="badge bg-primary rounded-pill"><?= $category->product_count ?? 0 ?></span>
                        </li>
                    <?php endforeach; ?>
                </ul>

                <!-- Price Filter -->
                <h6 class="fw-bold">Giá</h6>
                <form action="<?= BASE_URL ?>/product" method="GET">
                    <div class="mb-3">
                        <label for="price-min" class="form-label">Từ</label>
                        <input type="number" class="form-control" id="price-min" name="price_min"
                            value="<?= $_GET['price_min'] ?? 0 ?>" min="0">
                    </div>
                    <div class="mb-3">
                        <label for="price-max" class="form-label">Đến</label>
                        <input type="number" class="form-control" id="price-max" name="price_max"
                            value="<?= $_GET['price_max'] ?? 100000000 ?>" min="0">
                    </div>
                    <button type="submit" class="btn btn-sm btn-primary w-100">Áp dụng</button>
                </form>
            </div>
        </div>
    </div>

    <!-- Product List -->
    <div class="col-lg-9">
        <!-- Sort and Display Options -->
        <div class="d-flex justify-content-between align-items-center mb-4">
            <div>
                <span>Hiển thị <?= count($products) ?> trên <?= $totalProducts ?> sản phẩm</span>
            </div>
            <div class="d-flex align-items-center">
                <label for="sort-by" class="me-2">Sắp xếp theo:</label>
                <select class="form-select form-select-sm" id="sort-by" style="width: auto;">
                    <option value="newest">Mới nhất</option>
                    <option value="price-asc">Giá tăng dần</option>
                    <option value="price-desc">Giá giảm dần</option>
                    <option value="name-asc">Tên A-Z</option>
                    <option value="name-desc">Tên Z-A</option>
                </select>
                <div class="btn-group ms-3" role="group">
                    <button type="button" class="btn btn-outline-secondary btn-sm active" data-view="grid">
                        <i class="fas fa-th"></i>
                    </button>
                    <button type="button" class="btn btn-outline-secondary btn-sm" data-view="list">
                        <i class="fas fa-list"></i>
                    </button>
                </div>
            </div>
        </div>

        <!-- Grid View (Default) -->
        <div class="row g-4" id="grid-view">
            <?php if (!empty($products)): ?>
                <?php foreach ($products as $product): ?>
                    <div class="col-6 col-md-4">
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
                    <div class="alert alert-info">Không tìm thấy sản phẩm</div>
                </div>
            <?php endif; ?>
        </div>

        <!-- List View (Hidden by default) -->
        <div class="d-none" id="list-view">
            <?php if (!empty($products)): ?>
                <?php foreach ($products as $product): ?>
                    <div class="card mb-3">
                        <div class="row g-0">
                            <div class="col-md-3">
                                <?php if ($product->discount_percent > 0): ?>
                                    <div class="badge-corner">
                                        <span>-<?= $product->discount_percent ?>%</span>
                                    </div>
                                <?php endif; ?>
                                <img src="<?= BASE_URL ?>/images/products/<?= $product->image ?>"
                                    class="img-fluid rounded-start" alt="<?= $product->name ?>">
                            </div>
                            <div class="col-md-9">
                                <div class="card-body">
                                    <h5 class="card-title"><?= $product->name ?></h5>
                                    <p class="card-text text-muted small"><?= $product->category_name ?></p>
                                    <div class="mb-3">
                                        <?php if ($product->discount_percent > 0): ?>
                                            <span
                                                class="text-danger fw-bold me-2"><?= number_format($product->price * (1 - $product->discount_percent / 100)) ?>
                                                đ</span>
                                            <span class="price-original"><?= number_format($product->price) ?> đ</span>
                                        <?php else: ?>
                                            <span class="fw-bold"><?= number_format($product->price) ?> đ</span>
                                        <?php endif; ?>
                                    </div>
                                    <p class="card-text"><?= substr($product->description, 0, 150) ?>...</p>
                                    <div class="d-flex">
                                        <a href="<?= BASE_URL ?>/product/detail/<?= $product->id ?>"
                                            class="btn btn-sm btn-outline-secondary me-2">Chi tiết</a>
                                        <button class="btn btn-sm btn-primary add-to-cart-btn"
                                            data-product-id="<?= $product->id ?>" data-product-name="<?= $product->name ?>"
                                            data-product-price="<?= $product->price * (1 - $product->discount_percent / 100) ?>">
                                            <i class="fas fa-shopping-cart"></i> Thêm vào giỏ
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                <?php endforeach; ?>
            <?php else: ?>
                <div class="alert alert-info">Không tìm thấy sản phẩm</div>
            <?php endif; ?>
        </div>

        <!-- Pagination -->
        <?php if ($totalPages > 1): ?>
            <nav aria-label="Page navigation" class="mt-4">
                <ul class="pagination justify-content-center">
                    <li class="page-item <?= ($currentPage <= 1) ? 'disabled' : '' ?>">
                        <a class="page-link" href="<?= BASE_URL ?>/product?page=<?= $currentPage - 1 ?>"
                            aria-label="Previous">
                            <span aria-hidden="true">&laquo;</span>
                        </a>
                    </li>

                    <?php for ($i = 1; $i <= $totalPages; $i++): ?>
                        <li class="page-item <?= ($i == $currentPage) ? 'active' : '' ?>">
                            <a class="page-link" href="<?= BASE_URL ?>/product?page=<?= $i ?>"><?= $i ?></a>
                        </li>
                    <?php endfor; ?>

                    <li class="page-item <?= ($currentPage >= $totalPages) ? 'disabled' : '' ?>">
                        <a class="page-link" href="<?= BASE_URL ?>/product?page=<?= $currentPage + 1 ?>" aria-label="Next">
                            <span aria-hidden="true">&raquo;</span>
                        </a>
                    </li>
                </ul>
            </nav>
        <?php endif; ?>
    </div>
</div>

<!-- JavaScript for view toggling -->
<script>
    document.addEventListener('DOMContentLoaded', function () {
        const gridViewBtn = document.querySelector('[data-view="grid"]');
        const listViewBtn = document.querySelector('[data-view="list"]');
        const gridView = document.getElementById('grid-view');
        const listView = document.getElementById('list-view');

        gridViewBtn.addEventListener('click', function () {
            gridView.classList.remove('d-none');
            listView.classList.add('d-none');
            listViewBtn.classList.remove('active');
            gridViewBtn.classList.add('active');
        });

        listViewBtn.addEventListener('click', function () {
            gridView.classList.add('d-none');
            listView.classList.remove('d-none');
            gridViewBtn.classList.remove('active');
            listViewBtn.classList.add('active');
        });

        // Sorting functionality
        const sortSelect = document.getElementById('sort-by');
        sortSelect.addEventListener('change', function () {
            const url = new URL(window.location.href);
            url.searchParams.set('sort', this.value);
            window.location.href = url.toString();
        });

        // Set current sort value from URL
        const urlParams = new URLSearchParams(window.location.search);
        const sortParam = urlParams.get('sort');
        if (sortParam) {
            sortSelect.value = sortParam;
        }
    });
</script>