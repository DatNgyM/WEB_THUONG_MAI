<div class="container py-5">
    <div class="row justify-content-center">
        <div class="col-lg-6">
            <div class="card border-0 shadow-lg">
                <div class="card-body p-5">
                    <h1 class="card-title text-center mb-4">Đăng ký tài khoản</h1>

                    <?php if (isset($message)): ?>
                        <div class="alert alert-<?= $messageType ?> alert-dismissible fade show" role="alert">
                            <?= $message ?>
                            <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
                        </div>
                    <?php endif; ?>

                    <?php if (isset($_GET['error']) && $_GET['error'] == 'invalid'): ?>
                        <div class="alert alert-danger alert-dismissible fade show" role="alert">
                            Có lỗi xảy ra khi đăng ký. Vui lòng kiểm tra lại thông tin và thử lại!
                            <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
                        </div>
                    <?php endif; ?>

                    <form action="<?= BASE_URL ?>/auth/processRegister" method="post">
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
                                        placeholder="name@example.com" required>
                                    <label for="email">Email</label>
                                </div>
                            </div>

                            <div class="col-12">
                                <div class="form-floating">
                                    <input type="password" class="form-control" id="password" name="password"
                                        placeholder="Mật khẩu" required>
                                    <label for="password">Mật khẩu</label>
                                    <div class="form-text">Mật khẩu phải có ít nhất 8 ký tự, bao gồm chữ hoa, chữ thường
                                        và số.</div>
                                </div>
                            </div>

                            <div class="col-12">
                                <div class="form-floating">
                                    <input type="password" class="form-control" id="confirm_password"
                                        name="confirm_password" placeholder="Xác nhận mật khẩu" required>
                                    <label for="confirm_password">Xác nhận mật khẩu</label>
                                </div>
                            </div>

                            <div class="col-12">
                                <div class="form-floating">
                                    <textarea class="form-control" id="address" name="address" placeholder="Địa chỉ"
                                        style="height: 100px"></textarea>
                                    <label for="address">Địa chỉ</label>
                                </div>
                            </div>

                            <div class="col-12">
                                <div class="form-check">
                                    <input class="form-check-input" type="checkbox" id="terms" name="terms" required>
                                    <label class="form-check-label" for="terms">
                                        Tôi đồng ý với <a href="#" class="text-decoration-none">Điều khoản dịch vụ</a>
                                        và <a href="#" class="text-decoration-none">Chính sách bảo mật</a>
                                    </label>
                                </div>
                            </div>

                            <div class="col-12">
                                <button type="submit" class="btn btn-primary w-100 py-2 mt-3">Đăng ký</button>
                            </div>

                            <div class="col-12 text-center">
                                <p class="mb-0 mt-3">Đã có tài khoản? <a href="<?= BASE_URL ?>/auth/login"
                                        class="text-decoration-none">Đăng nhập ngay</a></p>
                            </div>
                        </div>
                    </form>

                    <hr class="my-4">

                    <div class="text-center">
                        <p class="text-muted mb-3">Hoặc đăng ký với</p>
                        <div class="d-flex justify-content-center gap-2">
                            <a href="#" class="btn btn-outline-primary btn-lg rounded-circle">
                                <i class="fab fa-facebook-f"></i>
                            </a>
                            <a href="#" class="btn btn-outline-danger btn-lg rounded-circle">
                                <i class="fab fa-google"></i>
                            </a>
                            <a href="#" class="btn btn-outline-dark btn-lg rounded-circle">
                                <i class="fab fa-apple"></i>
                            </a>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</div>