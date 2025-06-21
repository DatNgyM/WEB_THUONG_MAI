<div class="container py-5">
    <div class="row justify-content-center">
        <div class="col-lg-5">
            <div class="card border-0 shadow-lg">
                <div class="card-body p-5">
                    <h1 class="card-title text-center mb-4">Đăng nhập</h1>

                    <?php if (isset($message)): ?>
                        <div class="alert alert-<?= $messageType ?> alert-dismissible fade show" role="alert">
                            <?= $message ?>
                            <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
                        </div>
                    <?php endif; ?>

                    <?php if (isset($_GET['error']) && $_GET['error'] == 'invalid'): ?>
                        <div class="alert alert-danger alert-dismissible fade show" role="alert">
                            Email hoặc mật khẩu không đúng. Vui lòng thử lại!
                            <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
                        </div>
                    <?php endif; ?>

                    <form action="<?= BASE_URL ?>/auth/processLogin" method="post">
                        <div class="form-floating mb-3">
                            <input type="email" class="form-control" id="email" name="email"
                                placeholder="name@example.com" required>
                            <label for="email">Email</label>
                        </div>

                        <div class="form-floating mb-4">
                            <input type="password" class="form-control" id="password" name="password"
                                placeholder="Mật khẩu" required>
                            <label for="password">Mật khẩu</label>
                        </div>

                        <div class="d-flex justify-content-between align-items-center mb-4">
                            <div class="form-check">
                                <input class="form-check-input" type="checkbox" id="remember" name="remember">
                                <label class="form-check-label" for="remember">
                                    Ghi nhớ đăng nhập
                                </label>
                            </div>
                            <a href="#" class="text-decoration-none">Quên mật khẩu?</a>
                        </div>

                        <button type="submit" class="btn btn-primary w-100 py-2 mb-4">Đăng nhập</button>

                        <div class="text-center">
                            <p class="mb-0">Chưa có tài khoản? <a href="<?= BASE_URL ?>/auth/register"
                                    class="text-decoration-none">Đăng ký ngay</a></p>
                        </div>
                    </form>

                    <hr class="my-4">

                    <div class="text-center">
                        <p class="text-muted mb-3">Hoặc đăng nhập với</p>
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