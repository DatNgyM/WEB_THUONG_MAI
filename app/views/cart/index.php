<!-- Breadcrumb -->
<nav aria-label="breadcrumb" class="mb-4">
    <ol class="breadcrumb">
        <li class="breadcrumb-item"><a href="<?= BASE_URL ?>">Trang chủ</a></li>
        <li class="breadcrumb-item active" aria-current="page">Giỏ hàng</li>
    </ol>
</nav>

<h1 class="h2 mb-4">Giỏ hàng của bạn</h1>

<?php
// Khởi tạo session nếu chưa có
if (session_status() == PHP_SESSION_NONE) {
    session_start();
}

// Kiểm tra giỏ hàng có sản phẩm không
$cartEmpty = !isset($_SESSION['cart']) || empty($_SESSION['cart']);

// Tính tổng tiền
$totalPrice = 0;
if (!$cartEmpty) {
    foreach ($_SESSION['cart'] as $item) {
        $totalPrice += $item['price'] * $item['quantity'];
    }
}
?>

<?php if ($cartEmpty): ?>
    <div class="text-center my-5">
        <i class="fas fa-shopping-cart fa-5x text-muted mb-4"></i>
        <h3>Giỏ hàng của bạn đang trống</h3>
        <p class="mb-4">Hãy thêm sản phẩm vào giỏ hàng của bạn</p>
        <a href="<?= BASE_URL ?>/product" class="btn btn-primary">Tiếp tục mua sắm</a>
    </div>
<?php else: ?>
    <div class="row">
        <!-- Cart Items -->
        <div class="col-lg-8">
            <div class="card mb-4">
                <div class="card-header bg-white">
                    <div class="row align-items-center">
                        <div class="col-6">Sản phẩm</div>
                        <div class="col-2 text-center">Giá</div>
                        <div class="col-2 text-center">Số lượng</div>
                        <div class="col-2 text-end">Tổng cộng</div>
                    </div>
                </div>
                <div class="card-body">
                    <?php foreach ($_SESSION['cart'] as $productId => $item): ?>
                        <div class="row align-items-center mb-3 pb-3 border-bottom cart-item"
                            data-product-id="<?= $productId ?>">
                            <!-- Product Image & Name -->
                            <div class="col-6">
                                <div class="d-flex align-items-center">
                                    <img src="<?= BASE_URL ?>/images/products/<?= $item['image'] ?>" class="img-fluid rounded"
                                        style="width: 80px;" alt="<?= $item['name'] ?>">
                                    <div class="ms-3">
                                        <h5 class="mb-0"><?= $item['name'] ?></h5>
                                        <button class="btn btn-link btn-sm text-danger p-0 mt-2 remove-item">
                                            <i class="fas fa-trash-alt me-1"></i> Xóa
                                        </button>
                                    </div>
                                </div>
                            </div>

                            <!-- Price -->
                            <div class="col-2 text-center">
                                <?= number_format($item['price']) ?> đ
                            </div>

                            <!-- Quantity -->
                            <div class="col-2 text-center">
                                <div class="input-group input-group-sm">
                                    <button class="btn btn-outline-secondary decrement-qty" type="button">-</button>
                                    <input type="text" class="form-control text-center item-qty"
                                        value="<?= $item['quantity'] ?>">
                                    <button class="btn btn-outline-secondary increment-qty" type="button">+</button>
                                </div>
                            </div>

                            <!-- Total -->
                            <div class="col-2 text-end fw-bold item-total">
                                <?= number_format($item['price'] * $item['quantity']) ?> đ
                            </div>
                        </div>
                    <?php endforeach; ?>
                </div>
                <div class="card-footer bg-white d-flex justify-content-between">
                    <a href="<?= BASE_URL ?>/product" class="btn btn-outline-primary">
                        <i class="fas fa-arrow-left me-2"></i> Tiếp tục mua sắm
                    </a>
                    <button class="btn btn-outline-danger" id="clear-cart">
                        <i class="fas fa-trash me-2"></i> Xóa giỏ hàng
                    </button>
                </div>
            </div>
        </div>

        <!-- Cart Summary -->
        <div class="col-lg-4">
            <div class="card">
                <div class="card-header bg-white">
                    <h5 class="mb-0">Tổng giỏ hàng</h5>
                </div>
                <div class="card-body">
                    <div class="d-flex justify-content-between mb-2">
                        <span>Tạm tính</span>
                        <span id="subtotal"><?= number_format($totalPrice) ?> đ</span>
                    </div>
                    <div class="d-flex justify-content-between mb-2">
                        <span>Phí giao hàng</span>
                        <span>
                            <?php
                            $shippingFee = $totalPrice >= 1000000 ? 0 : 30000;
                            echo $shippingFee === 0 ? 'Miễn phí' : number_format($shippingFee) . ' đ';
                            ?>
                        </span>
                    </div>
                    <hr>
                    <div class="d-flex justify-content-between mb-3">
                        <span class="fw-bold">Tổng cộng</span>
                        <span class="fw-bold" id="total"><?= number_format($totalPrice + $shippingFee) ?> đ</span>
                    </div>

                    <!-- Coupon Code -->
                    <div class="mb-3">
                        <label for="coupon-code" class="form-label">Mã giảm giá</label>
                        <div class="input-group mb-3">
                            <input type="text" class="form-control" id="coupon-code" placeholder="Nhập mã giảm giá">
                            <button class="btn btn-outline-primary" type="button" id="apply-coupon">Áp dụng</button>
                        </div>
                    </div>

                    <a href="<?= BASE_URL ?>/cart/checkout" class="btn btn-primary w-100">
                        <i class="fas fa-credit-card me-2"></i> Tiến hành thanh toán
                    </a>
                </div>
            </div>
        </div>
    </div>
<?php endif; ?>

<script>
    document.addEventListener('DOMContentLoaded', function () {
        // Cart functionality
        const cartItems = document.querySelectorAll('.cart-item');
        const subtotalElement = document.getElementById('subtotal');
        const totalElement = document.getElementById('total');

        // Update cart and totals
        function updateCart() {
            let subtotal = 0;

            cartItems.forEach(item => {
                const productId = item.dataset.productId;
                const price = parseInt(item.querySelector('.item-qty').value) * parseFloat(item.querySelector('.item-total').dataset.price);
                subtotal += price;

                // Update item total display
                item.querySelector('.item-total').textContent = price.toLocaleString('vi-VN') + ' đ';

                // Update cart in session
                updateCartItem(productId, parseInt(item.querySelector('.item-qty').value));
            });

            // Update subtotal and total
            subtotalElement.textContent = subtotal.toLocaleString('vi-VN') + ' đ';

            // Calculate shipping
            let shippingFee = subtotal >= 1000000 ? 0 : 30000;

            // Update total
            totalElement.textContent = (subtotal + shippingFee).toLocaleString('vi-VN') + ' đ';
        }

        // Update cart item with AJAX
        function updateCartItem(productId, quantity) {
            fetch('<?= BASE_URL ?>/cart/update', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                },
                body: `product_id=${productId}&quantity=${quantity}`
            })
                .then(response => response.json())
                .then(data => {
                    if (!data.success) {
                        console.error(data.message);
                    }
                })
                .catch(error => {
                    console.error('Error:', error);
                });
        }

        // Increment quantity buttons
        document.querySelectorAll('.increment-qty').forEach(button => {
            button.addEventListener('click', function () {
                const input = this.parentElement.querySelector('.item-qty');
                input.value = parseInt(input.value) + 1;
                updateCart();
            });
        });

        // Decrement quantity buttons
        document.querySelectorAll('.decrement-qty').forEach(button => {
            button.addEventListener('click', function () {
                const input = this.parentElement.querySelector('.item-qty');
                if (parseInt(input.value) > 1) {
                    input.value = parseInt(input.value) - 1;
                    updateCart();
                }
            });
        });

        // Manual quantity input
        document.querySelectorAll('.item-qty').forEach(input => {
            input.addEventListener('change', function () {
                if (parseInt(this.value) < 1) {
                    this.value = 1;
                }
                updateCart();
            });
        });

        // Remove item buttons
        document.querySelectorAll('.remove-item').forEach(button => {
            button.addEventListener('click', function () {
                const item = this.closest('.cart-item');
                const productId = item.dataset.productId;

                // Remove from DOM
                item.remove();

                // Remove from session
                fetch(`<?= BASE_URL ?>/cart/remove/${productId}`)
                    .then(() => {
                        // Update cart totals
                        updateCart();

                        // Reload if cart is empty
                        if (document.querySelectorAll('.cart-item').length === 0) {
                            window.location.reload();
                        }
                    });
            });
        });

        // Clear cart button
        const clearCartButton = document.getElementById('clear-cart');
        if (clearCartButton) {
            clearCartButton.addEventListener('click', function () {
                if (confirm('Bạn có chắc chắn muốn xóa toàn bộ giỏ hàng?')) {
                    window.location.href = '<?= BASE_URL ?>/cart/clear';
                }
            });
        }

        // Apply coupon button
        const applyCouponButton = document.getElementById('apply-coupon');
        if (applyCouponButton) {
            applyCouponButton.addEventListener('click', function () {
                const couponCode = document.getElementById('coupon-code').value;
                if (!couponCode) {
                    alert('Vui lòng nhập mã giảm giá');
                    return;
                }

                // Apply coupon with AJAX
                fetch('<?= BASE_URL ?>/cart/apply-coupon', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/x-www-form-urlencoded',
                    },
                    body: `coupon_code=${couponCode}`
                })
                    .then(response => response.json())
                    .then(data => {
                        if (data.success) {
                            alert(data.message);
                            // Reload to show updated prices
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