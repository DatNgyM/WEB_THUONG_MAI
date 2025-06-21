<div class="container py-5">
    <div class="row mb-5">
        <div class="col-lg-6">
            <h1 class="fw-bold mb-4">Giới thiệu về <?= $companyInfo['name'] ?></h1>

            <p class="lead">Chúng tôi tự hào là một trong những đơn vị cung cấp các sản phẩm công nghệ hàng đầu tại Việt
                Nam.</p>

            <p>Được thành lập vào năm <?= $companyInfo['founded'] ?>, <?= $companyInfo['name'] ?> không ngừng phát triển
                và mở rộng để trở thành đối tác tin cậy cung cấp các sản phẩm công nghệ chính hãng cho người tiêu dùng.
            </p>

            <div class="d-flex align-items-center mb-3">
                <div class="bg-primary text-white rounded-circle p-3 me-3">
                    <i class="fas fa-bullseye fa-2x"></i>
                </div>
                <div>
                    <h4 class="mb-0">Sứ mệnh</h4>
                    <p class="mb-0"><?= $companyInfo['mission'] ?></p>
                </div>
            </div>

            <div class="d-flex align-items-center">
                <div class="bg-primary text-white rounded-circle p-3 me-3">
                    <i class="fas fa-eye fa-2x"></i>
                </div>
                <div>
                    <h4 class="mb-0">Tầm nhìn</h4>
                    <p class="mb-0"><?= $companyInfo['vision'] ?></p>
                </div>
            </div>
        </div>

        <div class="col-lg-6 mt-4 mt-lg-0">
            <div class="bg-light p-4 rounded-3 shadow-sm">
                <h3 class="border-bottom pb-3 mb-4">Thông tin liên hệ</h3>
                <div class="d-flex mb-3">
                    <div class="text-primary me-3">
                        <i class="fas fa-map-marker-alt fa-2x"></i>
                    </div>
                    <div>
                        <h5>Địa chỉ</h5>
                        <p class="mb-0"><?= $companyInfo['address'] ?></p>
                    </div>
                </div>

                <div class="d-flex mb-3">
                    <div class="text-primary me-3">
                        <i class="fas fa-phone-alt fa-2x"></i>
                    </div>
                    <div>
                        <h5>Điện thoại</h5>
                        <p class="mb-0"><?= $companyInfo['phone'] ?></p>
                    </div>
                </div>

                <div class="d-flex">
                    <div class="text-primary me-3">
                        <i class="fas fa-envelope fa-2x"></i>
                    </div>
                    <div>
                        <h5>Email</h5>
                        <p class="mb-0"><?= $companyInfo['email'] ?></p>
                    </div>
                </div>
            </div>
        </div>
    </div>

    <div class="row mb-5">
        <div class="col-12">
            <h2 class="text-center mb-5">Đội ngũ của chúng tôi</h2>

            <div class="row">
                <?php foreach ($teamMembers as $member): ?>
                    <div class="col-md-6 col-lg-3 mb-4">
                        <div class="card h-100">
                            <img src="<?= asset($member['image']) ?>" class="card-img-top" alt="<?= $member['name'] ?>"
                                onerror="this.src='<?= asset('images/user.png') ?>'">
                            <div class="card-body text-center">
                                <h5 class="card-title"><?= $member['name'] ?></h5>
                                <p class="card-text text-muted"><?= $member['position'] ?></p>
                                <div class="social-icons">
                                    <a href="#" class="btn btn-sm btn-outline-primary rounded-circle"><i
                                            class="fab fa-facebook-f"></i></a>
                                    <a href="#" class="btn btn-sm btn-outline-primary rounded-circle"><i
                                            class="fab fa-twitter"></i></a>
                                    <a href="#" class="btn btn-sm btn-outline-primary rounded-circle"><i
                                            class="fab fa-linkedin-in"></i></a>
                                </div>
                            </div>
                        </div>
                    </div>
                <?php endforeach; ?>
            </div>
        </div>
    </div>

    <div class="row">
        <div class="col-12">
            <h2 class="text-center mb-5">Giá trị cốt lõi</h2>

            <div class="row g-4">
                <div class="col-md-4">
                    <div class="card h-100 border-0 shadow-sm">
                        <div class="card-body text-center p-4">
                            <div class="text-primary mb-3">
                                <i class="fas fa-award fa-3x"></i>
                            </div>
                            <h4 class="card-title">Chất lượng</h4>
                            <p class="card-text">Chúng tôi cam kết cung cấp những sản phẩm chất lượng cao, chính hãng
                                với giá cả hợp lý nhất.</p>
                        </div>
                    </div>
                </div>

                <div class="col-md-4">
                    <div class="card h-100 border-0 shadow-sm">
                        <div class="card-body text-center p-4">
                            <div class="text-primary mb-3">
                                <i class="fas fa-users fa-3x"></i>
                            </div>
                            <h4 class="card-title">Khách hàng</h4>
                            <p class="card-text">Chúng tôi luôn đặt khách hàng làm trọng tâm, không ngừng cải tiến để
                                mang lại trải nghiệm tốt nhất.</p>
                        </div>
                    </div>
                </div>

                <div class="col-md-4">
                    <div class="card h-100 border-0 shadow-sm">
                        <div class="card-body text-center p-4">
                            <div class="text-primary mb-3">
                                <i class="fas fa-sync-alt fa-3x"></i>
                            </div>
                            <h4 class="card-title">Đổi mới</h4>
                            <p class="card-text">Chúng tôi không ngừng đổi mới, cập nhật xu hướng công nghệ mới nhất để
                                mang đến cho khách hàng.</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</div>