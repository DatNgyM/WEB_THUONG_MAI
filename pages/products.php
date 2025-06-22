<?php
$page_title = "Sản phẩm";

// Get search and filter parameters
$search = $_GET['search'] ?? '';
$category = $_GET['category'] ?? '';
$sort = $_GET['sort'] ?? 'name';
$order = $_GET['order'] ?? 'ASC';
$page_num = isset($_GET['p']) ? max(1, intval($_GET['p'])) : 1;
$limit = 12;
$offset = ($page_num - 1) * $limit;

// Get products
try {
    $productModel = new ProductModel();
    // Build filter conditions
    $conditions = [];
    $params = [];

    if (!empty($search)) {
        $conditions[] = "(name LIKE :search1 OR description LIKE :search2)";
        $params[':search1'] = "%$search%";
        $params[':search2'] = "%$search%";
    }

    if (!empty($category)) {
        $conditions[] = "category = :category";
        $params[':category'] = $category;
    }    // Get products with pagination
    $products = $productModel->getProductsWithFilter($conditions, $params, $sort, $order, $limit, $offset);
    $total_products = $productModel->countProducts($conditions, $params);
    $total_pages = ceil($total_products / $limit);

    // Get categories for filter
    $categories = $productModel->getCategories();

} catch (Exception $e) {
    $products = [];
    $total_products = 0;
    $total_pages = 0;
    $categories = [];
    error_log("Error loading products: " . $e->getMessage());
}
?>

<!-- Products Header -->
<section class="products-header">
    <div class="container">
        <div class="products-header-content">
            <div class="breadcrumb">
                <a href="index.php">Trang chủ</a>
                <span class="breadcrumb-separator"><i class="fas fa-chevron-right"></i></span>
                <span class="breadcrumb-current">Sản phẩm</span>
            </div>

            <h1 class="page-title">
                <?php if (!empty($search)): ?>
                    Kết quả tìm kiếm: "<?php echo htmlspecialchars($search); ?>"
                <?php elseif (!empty($category)): ?>
                    <?php echo ucfirst($category); ?>
                <?php else: ?>
                    Tất cả sản phẩm
                <?php endif; ?>
            </h1>

            <p class="page-subtitle">
                Tìm thấy <?php echo $total_products; ?> sản phẩm
            </p>
        </div>
    </div>
</section>

<!-- Products Content -->
<section class="products-content">
    <div class="container">
        <div class="products-layout">
            <!-- Sidebar Filters -->
            <div class="products-sidebar">
                <div class="sidebar-section">
                    <h3 class="sidebar-title">Bộ lọc</h3>

                    <!-- Search Filter -->
                    <div class="filter-group">
                        <label class="filter-label">Tìm kiếm</label>
                        <form class="search-form" method="GET">
                            <input type="hidden" name="page" value="products">
                            <?php if (!empty($category)): ?>
                                <input type="hidden" name="category" value="<?php echo htmlspecialchars($category); ?>">
                            <?php endif; ?>
                            <div class="search-input-group">
                                <input type="text" name="search" value="<?php echo htmlspecialchars($search); ?>"
                                    placeholder="Nhập từ khóa..." class="search-input">
                                <button type="submit" class="search-btn">
                                    <i class="fas fa-search"></i>
                                </button>
                            </div>
                        </form>
                    </div>

                    <!-- Category Filter -->
                    <div class="filter-group">
                        <label class="filter-label">Danh mục</label>
                        <div class="filter-options">
                            <a href="?page=products<?php echo !empty($search) ? '&search=' . urlencode($search) : ''; ?>"
                                class="filter-option <?php echo empty($category) ? 'active' : ''; ?>">
                                Tất cả
                            </a>
                            <?php if (!empty($categories)): ?>
                                <?php foreach ($categories as $cat): ?>
                                    <a href="?page=products&category=<?php echo urlencode($cat); ?><?php echo !empty($search) ? '&search=' . urlencode($search) : ''; ?>"
                                        class="filter-option <?php echo $category === $cat ? 'active' : ''; ?>">
                                        <?php echo ucfirst($cat); ?>
                                    </a>
                                <?php endforeach; ?>
                            <?php endif; ?>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Products Main -->
            <div class="products-main">
                <!-- Sort Options -->
                <div class="products-toolbar">
                    <div class="sort-options">
                        <label class="sort-label">Sắp xếp theo:</label>
                        <select class="sort-select" onchange="updateSort(this.value)">
                            <option value="name_ASC" <?php echo ($sort === 'name' && $order === 'ASC') ? 'selected' : ''; ?>>
                                Tên A-Z
                            </option>
                            <option value="name_DESC" <?php echo ($sort === 'name' && $order === 'DESC') ? 'selected' : ''; ?>>
                                Tên Z-A
                            </option>
                            <option value="price_ASC" <?php echo ($sort === 'price' && $order === 'ASC') ? 'selected' : ''; ?>>
                                Giá thấp đến cao
                            </option>
                            <option value="price_DESC" <?php echo ($sort === 'price' && $order === 'DESC') ? 'selected' : ''; ?>>
                                Giá cao đến thấp
                            </option>
                            <option value="created_at_DESC" <?php echo ($sort === 'created_at' && $order === 'DESC') ? 'selected' : ''; ?>>
                                Mới nhất
                            </option>
                        </select>
                    </div>

                    <div class="view-options">
                        <button class="view-btn active" data-view="grid" title="Xem dạng lưới">
                            <i class="fas fa-th-large"></i>
                        </button>
                        <button class="view-btn" data-view="list" title="Xem dạng danh sách">
                            <i class="fas fa-list"></i>
                        </button>
                    </div>
                </div>

                <!-- Products Grid -->
                <?php if (!empty($products)): ?>
                    <div class="products-grid" id="products-grid">
                        <?php foreach ($products as $product): ?>
                            <div class="product-card" data-product-id="<?php echo $product['id']; ?>">
                                <div class="product-image">
                                    <img src="<?php echo !empty($product['image_url']) ? $product['image_url'] : 'images/placeholder.jpg'; ?>"
                                        alt="<?php echo htmlspecialchars($product['name']); ?>" class="product-img">
                                    <div class="product-overlay">
                                        <a href="index.php?page=product-detail&id=<?php echo $product['id']; ?>"
                                            class="btn btn-primary btn-sm">
                                            <i class="fas fa-eye"></i> Chi tiết
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
                                            <span
                                                class="current-price"><?php echo number_format($product['price'], 0, ',', '.'); ?>₫</span>
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

                    <!-- Pagination -->
                    <?php if ($total_pages > 1): ?>
                        <div class="pagination">
                            <div class="pagination-info">
                                Trang <?php echo $page_num; ?> của <?php echo $total_pages; ?>
                                (<?php echo $total_products; ?> sản phẩm)
                            </div>

                            <div class="pagination-controls">
                                <?php if ($page_num > 1): ?>
                                    <a href="?page=products&p=<?php echo ($page_num - 1); ?><?php echo !empty($search) ? '&search=' . urlencode($search) : ''; ?><?php echo !empty($category) ? '&category=' . urlencode($category) : ''; ?>&sort=<?php echo $sort; ?>&order=<?php echo $order; ?>"
                                        class="pagination-btn">
                                        <i class="fas fa-chevron-left"></i> Trước
                                    </a>
                                <?php endif; ?>

                                <?php
                                $start_page = max(1, $page_num - 2);
                                $end_page = min($total_pages, $page_num + 2);

                                for ($i = $start_page; $i <= $end_page; $i++): ?>
                                    <a href="?page=products&p=<?php echo $i; ?><?php echo !empty($search) ? '&search=' . urlencode($search) : ''; ?><?php echo !empty($category) ? '&category=' . urlencode($category) : ''; ?>&sort=<?php echo $sort; ?>&order=<?php echo $order; ?>"
                                        class="pagination-btn <?php echo ($i === $page_num) ? 'active' : ''; ?>">
                                        <?php echo $i; ?>
                                    </a>
                                <?php endfor; ?>

                                <?php if ($page_num < $total_pages): ?>
                                    <a href="?page=products&p=<?php echo ($page_num + 1); ?><?php echo !empty($search) ? '&search=' . urlencode($search) : ''; ?><?php echo !empty($category) ? '&category=' . urlencode($category) : ''; ?>&sort=<?php echo $sort; ?>&order=<?php echo $order; ?>"
                                        class="pagination-btn">
                                        Sau <i class="fas fa-chevron-right"></i>
                                    </a>
                                <?php endif; ?>
                            </div>
                        </div>
                    <?php endif; ?>

                <?php else: ?>
                    <div class="no-products">
                        <div class="no-products-content">
                            <i class="fas fa-search"></i>
                            <h3>Không tìm thấy sản phẩm nào</h3>
                            <p>
                                <?php if (!empty($search)): ?>
                                    Không có sản phẩm nào phù hợp với từ khóa "<?php echo htmlspecialchars($search); ?>"
                                <?php elseif (!empty($category)): ?>
                                    Không có sản phẩm nào trong danh mục "<?php echo htmlspecialchars($category); ?>"
                                <?php else: ?>
                                    Hiện tại chưa có sản phẩm nào.
                                <?php endif; ?>
                            </p>
                            <a href="index.php?page=products" class="btn btn-primary">
                                <i class="fas fa-arrow-left"></i> Về trang sản phẩm
                            </a>
                        </div>
                    </div>
                <?php endif; ?>
            </div>
        </div>
    </div>
</section>

<script>
    // Sort functionality
    function updateSort(value) {
        const [sort, order] = value.split('_');
        const url = new URL(window.location);
        url.searchParams.set('sort', sort);
        url.searchParams.set('order', order);
        window.location.href = url.toString();
    }

    // View toggle functionality
    document.addEventListener('DOMContentLoaded', function () {
        const viewButtons = document.querySelectorAll('.view-btn');
        const productsGrid = document.getElementById('products-grid');

        viewButtons.forEach(btn => {
            btn.addEventListener('click', function () {
                viewButtons.forEach(b => b.classList.remove('active'));
                this.classList.add('active');

                const view = this.dataset.view;
                if (view === 'list') {
                    productsGrid.classList.add('list-view');
                } else {
                    productsGrid.classList.remove('list-view');
                }
            });
        });
    });
</script>

<?php
// Add specific JavaScript for products page
$additional_js = ['JS/shop.js', 'JS/cart.js'];
?>