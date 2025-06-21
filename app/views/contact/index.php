<div class="container py-5">
    <h1 class="fw-bold mb-4">Liên hệ với chúng tôi</h1>

    <?php if (isset($message)): ?>
        <div class="alert alert-<?= $messageType ?> alert-dismissible fade show" role="alert">
            <?= $message ?>
            <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
        </div>
    <?php endif; ?>

    <div class="row">
        <div class="col-lg-5 mb-4 mb-lg-0">
            <div class="bg-light p-4 rounded-3 shadow-sm h-100">
                <h3 class="border-bottom pb-3 mb-4">Thông tin liên hệ</h3>

                <div class="d-flex mb-4">
                    <div class="text-primary me-3">
                        <i class="fas fa-map-marker-alt fa-2x"></i>
                    </div>
                    <div>
                        <h5>Địa chỉ</h5>
                        <p class="mb-0"><?= $contactInfo['address'] ?></p>
                    </div>
                </div>

                <div class="d-flex mb-4">
                    <div class="text-primary me-3">
                        <i class="fas fa-phone-alt fa-2x"></i>
                    </div>
                    <div>
                        <h5>Điện thoại</h5>
                        <p class="mb-0"><?= $contactInfo['phone'] ?></p>
                    </div>
                </div>

                <div class="d-flex mb-4">
                    <div class="text-primary me-3">
                        <i class="fas fa-envelope fa-2x"></i>
                    </div>
                    <div>
                        <h5>Email</h5>
                        <p class="mb-0"><?= $contactInfo['email'] ?></p>
                    </div>
                </div>

                <div class="d-flex">
                    <div class="text-primary me-3">
                        <i class="fas fa-clock fa-2x"></i>
                    </div>
                    <div>
                        <h5>Giờ làm việc</h5>
                        <p class="mb-0"><?= $contactInfo['workingHours'] ?></p>
                    </div>
                </div>

                <div class="mt-4">
                    <h5>Kết nối với chúng tôi</h5>
                    <div class="social-icons mt-3">
                        <a href="#" class="btn btn-primary me-2"><i class="fab fa-facebook-f"></i></a>
                        <a href="#" class="btn btn-info me-2"><i class="fab fa-twitter"></i></a>
                        <a href="#" class="btn btn-danger me-2"><i class="fab fa-youtube"></i></a>
                        <a href="#" class="btn btn-dark"><i class="fab fa-instagram"></i></a>
                    </div>
                </div>
            </div>
        </div>

        <div class="col-lg-7">
            <div class="card border-0 shadow-sm">
                <div class="card-body p-4">
                    <h3 class="card-title border-bottom pb-3 mb-4">Gửi tin nhắn cho chúng tôi</h3>

                    <form action="<?= BASE_URL ?>/contact/send" method="post">
                        <div class="row g-3">
                            <div class="col-md-6">
                                <div class="form-floating mb-3">
                                    <input type="text" class="form-control" id="name" name="name"
                                        placeholder="Họ và tên" required>
                                    <label for="name">Họ và tên</label>
                                </div>
                            </div>

                            <div class="col-md-6">
                                <div class="form-floating mb-3">
                                    <input type="email" class="form-control" id="email" name="email" placeholder="Email"
                                        required>
                                    <label for="email">Email</label>
                                </div>
                            </div>

                            <div class="col-md-6">
                                <div class="form-floating mb-3">
                                    <input type="tel" class="form-control" id="phone" name="phone"
                                        placeholder="Số điện thoại">
                                    <label for="phone">Số điện thoại</label>
                                </div>
                            </div>

                            <div class="col-md-6">
                                <div class="form-floating mb-3">
                                    <input type="text" class="form-control" id="subject" name="subject"
                                        placeholder="Chủ đề" required>
                                    <label for="subject">Chủ đề</label>
                                </div>
                            </div>

                            <div class="col-12">
                                <div class="form-floating mb-3">
                                    <textarea class="form-control" id="message" name="message"
                                        placeholder="Nội dung tin nhắn" style="height: 150px" required></textarea>
                                    <label for="message">Nội dung tin nhắn</label>
                                </div>
                            </div>

                            <div class="col-12">
                                <button type="submit" class="btn btn-primary btn-lg">
                                    <i class="fas fa-paper-plane me-2"></i>Gửi tin nhắn
                                </button>
                            </div>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    </div>

    <div class="row mt-5">
        <div class="col-12">
            <h3 class="mb-4">Vị trí của chúng tôi</h3>
            <div class="map-container rounded shadow-sm">
                <iframe
                    src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3919.5177580567037!2d106.69909847469657!3d10.771594989387864!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x31752f4670702e31%3A0xa5777fb3a5bb4f74!2zQuG6v24gVGjDoG5oIE5vdm9sYW5k!5e0!3m2!1svi!2s!4v1687320225920!5m2!1svi!2s"
                    width="100%" height="450" style="border:0;" allowfullscreen="" loading="lazy"
                    referrerpolicy="no-referrer-when-downgrade"></iframe>
            </div>
        </div>
    </div>
</div>