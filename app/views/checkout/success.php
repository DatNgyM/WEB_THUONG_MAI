<div class="container py-5">
    <div class="row justify-content-center">
        <div class="col-lg-8 text-center">
            <div class="card border-0 shadow-lg">
                <div class="card-body p-5">
                    <div class="mb-4">
                        <i class="fas fa-check-circle text-success fa-5x"></i>
                    </div>

                    <h1 class="mb-4">Đặt hàng thành công!</h1>

                    <p class="lead mb-4">Cảm ơn bạn đã mua hàng tại Website Thương Mại. Chúng tôi sẽ xử lý đơn hàng của
                        bạn trong thời gian sớm nhất.</p>

                    <div class="card mb-4">
                        <div class="card-body">
                            <div class="row">
                                <div class="col-md-6 text-md-start">
                                    <h5>Mã đơn hàng</h5>
                                    <p class="mb-0 fw-bold"><?= $orderNumber ?></p>
                                </div>
                                <div class="col-md-6 text-md-end mt-3 mt-md-0">
                                    <h5>Ngày đặt hàng</h5>
                                    <p class="mb-0"><?= $orderDate ?></p>
                                </div>
                            </div>
                        </div>
                    </div>

                    <p class="mb-4">Bạn sẽ nhận được email xác nhận đơn hàng trong ít phút. Bạn có thể kiểm tra trạng
                        thái đơn hàng tại trang "Tài khoản của tôi".</p>

                    <div class="d-grid gap-2 d-sm-flex justify-content-sm-center">
                        <a href="<?= BASE_URL ?>" class="btn btn-primary btn-lg px-4 me-sm-3">
                            Tiếp tục mua sắm
                        </a>
                        <a href="<?= BASE_URL ?>/account/orders" class="btn btn-outline-secondary btn-lg px-4">
                            Xem đơn hàng
                        </a>
                    </div>
                </div>
            </div>
        </div>
    </div>
</div>