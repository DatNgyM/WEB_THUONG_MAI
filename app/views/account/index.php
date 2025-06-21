<div class="container py-5">
    <div class="row">
        <div class="col-lg-3">
            <div class="card border-0 shadow-sm mb-4">
                <div class="card-body text-center p-4">
                    <div class="mb-3">
                        <img src="<?= asset($user['avatar']) ?>" alt="<?= $user['name'] ?>" class="rounded-circle"
                            width="100" height="100">
                    </div>
                    <h5><?= $user['name'] ?></h5>
                    <p class="text-muted small mb-0">Thành viên từ <?= date('d/m/Y', strtotime($user['created_at'])) ?>
                    </p>
                </div>
            </div>

            <div class="list-group shadow-sm mb-4">
                <a href="<?= BASE_URL ?>/account" class="list-group-item list-group-item-action active">
                    <i class="fas fa-user me-2"></i> Thông tin tài khoản
                </a>
                <a href="<?= BASE_URL ?>/account/orders" class="list-group-item list-group-item-action">
                    <i class="fas fa-clipboard-list me-2"></i> Đơn hàng của tôi
                </a>
                <a href="<?= BASE_URL ?>/account/edit" class="list-group-item list-group-item-action">
                    <i class="fas fa-edit me-2"></i> Cập nhật thông tin
                </a>
                <a href="<?= BASE_URL ?>/auth/logout" class="list-group-item list-group-item-action text-danger">
                    <i class="fas fa-sign-out-alt me-2"></i> Đăng xuất
                </a>
            </div>
        </div>

        <div class="col-lg-9">
            <?php if (isset($_GET['update']) && $_GET['update'] == 'success'): ?>
                <div class="alert alert-success alert-dismissible fade show" role="alert">
                    Thông tin tài khoản đã được cập nhật thành công!
                    <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
                </div>
            <?php endif; ?>

            <div class="card border-0 shadow-sm mb-4">
                <div class="card-header bg-white py-3">
                    <h4 class="card-title mb-0">Thông tin tài khoản</h4>
                </div>
                <div class="card-body p-4">
                    <div class="row">
                        <div class="col-md-6 mb-3">
                            <h6>Họ và tên</h6>
                            <p class="text-muted mb-0"><?= $user['name'] ?></p>
                        </div>

                        <div class="col-md-6 mb-3">
                            <h6>Email</h6>
                            <p class="text-muted mb-0"><?= $user['email'] ?></p>
                        </div>

                        <div class="col-md-6 mb-3">
                            <h6>Số điện thoại</h6>
                            <p class="text-muted mb-0"><?= $user['phone'] ?></p>
                        </div>

                        <div class="col-12">
                            <h6>Địa chỉ</h6>
                            <p class="text-muted mb-0"><?= $user['address'] ?></p>
                        </div>
                    </div>
                </div>
                <div class="card-footer bg-white py-3">
                    <a href="<?= BASE_URL ?>/account/edit" class="btn btn-primary">
                        <i class="fas fa-edit me-2"></i>Cập nhật thông tin
                    </a>
                </div>
            </div>

            <div class="card border-0 shadow-sm">
                <div class="card-header bg-white py-3 d-flex justify-content-between align-items-center">
                    <h4 class="card-title mb-0">Đơn hàng gần đây</h4>
                    <a href="<?= BASE_URL ?>/account/orders" class="btn btn-outline-primary btn-sm">Xem tất cả</a>
                </div>
                <div class="card-body p-0">
                    <div class="table-responsive">
                        <table class="table mb-0">
                            <thead>
                                <tr>
                                    <th>Mã đơn hàng</th>
                                    <th>Ngày đặt</th>
                                    <th>Số sản phẩm</th>
                                    <th>Tổng tiền</th>
                                    <th>Trạng thái</th>
                                    <th></th>
                                </tr>
                            </thead>
                            <tbody>
                                <?php if (!empty($orders)): ?>
                                    <?php foreach ($orders as $order): ?>
                                        <tr>
                                            <td><a
                                                    href="<?= BASE_URL ?>/account/orders/<?= $order['id'] ?>"><?= $order['id'] ?></a>
                                            </td>
                                            <td><?= $order['date'] ?></td>
                                            <td><?= $order['items'] ?></td>
                                            <td><?= number_format($order['total'], 0, ',', '.') ?> ₫</td>
                                            <td>
                                                <?php if ($order['status'] == 'Đã giao hàng'): ?>
                                                    <span class="badge bg-success"><?= $order['status'] ?></span>
                                                <?php elseif ($order['status'] == 'Đang giao hàng'): ?>
                                                    <span class="badge bg-primary"><?= $order['status'] ?></span>
                                                <?php elseif ($order['status'] == 'Đã hủy'): ?>
                                                    <span class="badge bg-danger"><?= $order['status'] ?></span>
                                                <?php else: ?>
                                                    <span class="badge bg-secondary"><?= $order['status'] ?></span>
                                                <?php endif; ?>
                                            </td>
                                            <td>
                                                <a href="<?= BASE_URL ?>/account/orders/<?= $order['id'] ?>"
                                                    class="btn btn-sm btn-outline-secondary">Chi tiết</a>
                                            </td>
                                        </tr>
                                    <?php endforeach; ?>
                                <?php else: ?>
                                    <tr>
                                        <td colspan="6" class="text-center py-3">Bạn chưa có đơn hàng nào</td>
                                    </tr>
                                <?php endif; ?>
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    </div>
</div>