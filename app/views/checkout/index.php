<div class="container py-5">
    <div class="row">
        <div class="col-12 mb-4">
            <h1 class="fw-bold mb-0">Thanh toán</h1>
            <nav aria-label="breadcrumb">
                <ol class="breadcrumb">
                    <li class="breadcrumb-item"><a href="<?= BASE_URL ?>">Trang chủ</a></li>
                    <li class="breadcrumb-item"><a href="<?= BASE_URL ?>/cart">Giỏ hàng</a></li>
                    <li class="breadcrumb-item active" aria-current="page">Thanh toán</li>
                </ol>
            </nav>
        </div>
    </div>

    <form action="<?= BASE_URL ?>/checkout/placeOrder" method="post">
        <div class="row">
            <div class="col-lg-8">
                <div class="card border-0 shadow-sm mb-4">
                    <div class="card-header bg-white py-3">
                        <h5 class="card-title mb-0">Thông tin giao hàng</h5>
                    </div>
                    <div class="card-body p-4">
                        <div class="row g-3">
                            <div class="col-md-6">
                                <div class="form-floating">
                                    <input type="text" class="form-control" id="name" name="name"
                                        placeholder="Họ và tên" required>
                                    <label for="name">Họ và tên</label>
                                </div>
                            </div>

                            <div class="col-md-6">
                                <div class="form-floating">
                                    <input type="tel" class="form-control" id="phone" name="phone"
                                        placeholder="Số điện thoại" required>
                                    <label for="phone">Số điện thoại</label>
                                </div>
                            </div>

                            <div class="col-12">
                                <div class="form-floating">
                                    <input type="email" class="form-control" id="email" name="email"
                                        placeholder="name@example.com">
                                    <label for="email">Email (tùy chọn)</label>
                                </div>
                            </div>

                            <div class="col-12">
                                <div class="form-floating">
                                    <textarea class="form-control" id="address" name="address" placeholder="Địa chỉ"
                                        style="height: 100px" required></textarea>
                                    <label for="address">Địa chỉ nhận hàng</label>
                                </div>
                            </div>

                            <div class="col-12">
                                <div class="form-floating">
                                    <textarea class="form-control" id="note" name="note" placeholder="Ghi chú"
                                        style="height: 100px"></textarea>
                                    <label for="note">Ghi chú đơn hàng (tùy chọn)</label>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div class="card border-0 shadow-sm mb-4">
                    <div class="card-header bg-white py-3">
                        <h5 class="card-title mb-0">Phương thức thanh toán</h5>
                    </div>
                    <div class="card-body p-4">
                        <div class="row g-3">
                            <?php foreach ($paymentMethods as $index => $method): ?>
                                <div class="col-12">
                                    <div class="form-check border rounded p-3 <?= $index === 0 ? 'border-primary' : '' ?>">
                                        <input class="form-check-input" type="radio" name="payment_method"
                                            id="payment_<?= $method['id'] ?>" value="<?= $method['id'] ?>" <?= $index === 0 ? 'checked' : '' ?>>
                                        <label class="form-check-label w-100" for="payment_<?= $method['id'] ?>">
                                            <?= $method['name'] ?>
                                        </label>
                                    </div>
                                </div>
                            <?php endforeach; ?>
                        </div>
                    </div>
                </div>
            </div>

            <div class="col-lg-4">
                <div class="card border-0 shadow-sm mb-4">
                    <div class="card-header bg-white py-3">
                        <h5 class="card-title mb-0">Đơn hàng của bạn</h5>
                    </div>
                    <div class="card-body p-4">
                        <div class="d-flex justify-content-between align-items-center mb-3">
                            <span>Sản phẩm</span>
                            <span>Thành tiền</span>
                        </div>

                        <hr>

                        <?php foreach ($cartItems as $item): ?>
                            <div class="d-flex justify-content-between align-items-center mb-3">
                                <div>
                                    <h6 class="mb-0"><?= $item['name'] ?></h6>
                                    <small class="text-muted">SL: <?= $item['quantity'] ?> x
                                        <?= number_format($item['price'], 0, ',', '.') ?> ₫</small>
                                </div>
                                <span><?= number_format($item['price'] * $item['quantity'], 0, ',', '.') ?> ₫</span>
                            </div>
                        <?php endforeach; ?>

                        <hr>

                        <div class="d-flex justify-content-between mb-2">
                            <span>Tạm tính</span>
                            <span><?= number_format($subtotal, 0, ',', '.') ?> ₫</span>
                        </div>

                        <div class="d-flex justify-content-between mb-2">
                            <span>Phí vận chuyển</span>
                            <span><?= number_format($shipping, 0, ',', '.') ?> ₫</span>
                        </div>

                        <?php if ($discount > 0): ?>
                            <div class="d-flex justify-content-between mb-2">
                                <span>Giảm giá</span>
                                <span>-<?= number_format($discount, 0, ',', '.') ?> ₫</span>
                            </div>
                        <?php endif; ?>

                        <hr>

                        <div class="d-flex justify-content-between align-items-center mb-3">
                            <h5 class="mb-0">Tổng cộng</h5>
                            <h5 class="text-primary mb-0"><?= number_format($total, 0, ',', '.') ?> ₫</h5>
                        </div>
                    </div>
                    <div class="card-footer bg-white py-3">
                        <button type="submit" class="btn btn-primary w-100 py-2">
                            <i class="fas fa-check-circle me-2"></i>Đặt hàng
                        </button>
                    </div>
                </div>

                <div class="card border-0 shadow-sm">
                    <div class="card-body p-4">
                        <div class="mb-3">
                            <div class="input-group">
                                <input type="text" class="form-control" placeholder="Mã giảm giá" id="coupon">
                                <button class="btn btn-outline-secondary" type="button">Áp dụng</button>
                            </div>
                        </div>

                        <div class="d-flex align-items-center mb-3">
                            <i class="fas fa-shield-alt text-success me-2"></i>
                            <small class="text-muted">Thanh toán an toàn và bảo mật</small>
                        </div>

                        <div class="d-flex align-items-center mb-3">
                            <i class="fas fa-truck text-success me-2"></i>
                            <small class="text-muted">Giao hàng miễn phí cho đơn hàng từ 500.000 ₫</small>
                        </div>

                        <div class="d-flex align-items-center">
                            <i class="fas fa-undo text-success me-2"></i>
                            <small class="text-muted">Đổi trả miễn phí trong 30 ngày</small>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </form>
</div>