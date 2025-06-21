<footer class="bg-dark text-white mt-5 py-4">
    <div class="container">
        <div class="row">
            <div class="col-md-4 mb-4 mb-md-0">
                <h5>Thông tin liên hệ</h5>
                <address class="mb-0">
                    <p><i class="fas fa-map-marker-alt me-2"></i> 123 Đường ABC, Quận XYZ, TP. Hồ Chí Minh</p>
                    <p><i class="fas fa-phone me-2"></i> (84) 123-456-789</p>
                    <p><i class="fas fa-envelope me-2"></i> info@webthuongmai.com</p>
                </address>
            </div>

            <div class="col-md-4 mb-4 mb-md-0">
                <h5>Liên kết nhanh</h5>
                <ul class="list-unstyled">
                    <li><a href="<?= BASE_URL ?>" class="text-white">Trang chủ</a></li>
                    <li><a href="<?= BASE_URL ?>/product" class="text-white">Sản phẩm</a></li>
                    <li><a href="<?= BASE_URL ?>/about" class="text-white">Giới thiệu</a></li>
                    <li><a href="<?= BASE_URL ?>/policy" class="text-white">Chính sách</a></li>
                    <li><a href="<?= BASE_URL ?>/contact" class="text-white">Liên hệ</a></li>
                </ul>
            </div>

            <div class="col-md-4">
                <h5>Kết nối với chúng tôi</h5>
                <div class="social-links">
                    <a href="#" class="text-white me-2"><i class="fab fa-facebook-f fa-lg"></i></a>
                    <a href="#" class="text-white me-2"><i class="fab fa-twitter fa-lg"></i></a>
                    <a href="#" class="text-white me-2"><i class="fab fa-instagram fa-lg"></i></a>
                    <a href="#" class="text-white me-2"><i class="fab fa-youtube fa-lg"></i></a>
                </div>

                <div class="mt-3">
                    <h5>Đăng ký nhận tin</h5>
                    <form>
                        <div class="input-group">
                            <input type="email" class="form-control" placeholder="Email của bạn">
                            <button class="btn btn-primary" type="button">Đăng ký</button>
                        </div>
                    </form>
                </div>
            </div>
        </div>

        <hr class="my-4">

        <div class="row">
            <div class="col-md-6">
                <p class="mb-md-0">© <?= date('Y') ?> Website Thương Mại. Tất cả quyền được bảo lưu.</p>
            </div>
            <div class="col-md-6 text-md-end">
                <p class="mb-0">
                    <a href="<?= BASE_URL ?>/terms" class="text-white me-3">Điều khoản sử dụng</a>
                    <a href="<?= BASE_URL ?>/privacy" class="text-white">Chính sách bảo mật</a>
                </p>
            </div>
        </div>
    </div>
</footer>

<!-- Back to top button -->
<button id="scrollToTop" class="btn btn-primary rounded-circle position-fixed bottom-0 end-0 m-4"
    style="display:none; z-index:1000;">
    <i class="fas fa-arrow-up"></i>
</button>