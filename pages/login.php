<?php
$page_title = "Đăng nhập";

// Handle login form submission
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $email = trim($_POST['email'] ?? '');
    $password = $_POST['password'] ?? '';
    $remember = isset($_POST['remember']);

    $errors = [];

    // Validation
    if (empty($email)) {
        $errors[] = "Email không được để trống.";
    } elseif (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
        $errors[] = "Email không hợp lệ.";
    }

    if (empty($password)) {
        $errors[] = "Mật khẩu không được để trống.";
    }

    // Login attempt
    if (empty($errors)) {
        try {
            $userModel = new UserModel();
            $user = $userModel->login($email, $password);

            if ($user) {
                // Set session
                $_SESSION['user_id'] = $user['id'];
                $_SESSION['user_email'] = $user['email'];
                $_SESSION['user_name'] = $user['name'];
                $_SESSION['is_admin'] = $user['is_admin'] ?? 0;

                // Set remember me cookie if requested
                if ($remember) {
                    $token = bin2hex(random_bytes(32));
                    setcookie('remember_token', $token, time() + (30 * 24 * 60 * 60), '/'); // 30 days
                    $userModel->setRememberToken($user['id'], $token);
                }

                // Redirect to intended page or home
                $redirect = $_GET['redirect'] ?? 'index.php';
                header("Location: $redirect");
                exit;
            } else {
                $errors[] = "Email hoặc mật khẩu không chính xác.";
            }
        } catch (Exception $e) {
            error_log("Login error: " . $e->getMessage());
            $errors[] = "Có lỗi xảy ra. Vui lòng thử lại.";
        }
    }
}
?>

<section class="auth-section">
    <div class="container">
        <div class="auth-container">
            <div class="auth-form-wrapper">
                <div class="auth-header">
                    <h1 class="auth-title">Đăng nhập</h1>
                    <p class="auth-subtitle">Chào mừng bạn trở lại!</p>
                </div>

                <?php if (!empty($errors)): ?>
                    <div class="alert alert-error">
                        <i class="fas fa-exclamation-circle"></i>
                        <ul class="error-list">
                            <?php foreach ($errors as $error): ?>
                                <li><?php echo htmlspecialchars($error); ?></li>
                            <?php endforeach; ?>
                        </ul>
                    </div>
                <?php endif; ?>

                <form class="auth-form" method="POST" action="">
                    <div class="form-group">
                        <label for="email" class="form-label">
                            <i class="fas fa-envelope"></i> Email
                        </label>
                        <input type="email" id="email" name="email" class="form-input"
                            value="<?php echo htmlspecialchars($email ?? ''); ?>" placeholder="Nhập email của bạn"
                            required>
                    </div>

                    <div class="form-group">
                        <label for="password" class="form-label">
                            <i class="fas fa-lock"></i> Mật khẩu
                        </label>
                        <div class="password-input-wrapper">
                            <input type="password" id="password" name="password" class="form-input"
                                placeholder="Nhập mật khẩu" required>
                            <button type="button" class="password-toggle" onclick="togglePassword('password')">
                                <i class="fas fa-eye" id="password-eye"></i>
                            </button>
                        </div>
                    </div>

                    <div class="form-options">
                        <div class="checkbox-group">
                            <input type="checkbox" id="remember" name="remember" class="form-checkbox">
                            <label for="remember" class="checkbox-label">Ghi nhớ đăng nhập</label>
                        </div>

                        <a href="index.php?page=forgot-password" class="forgot-link">Quên mật khẩu?</a>
                    </div>

                    <button type="submit" class="btn btn-primary btn-lg btn-full">
                        <i class="fas fa-sign-in-alt"></i> Đăng nhập
                    </button>
                </form>

                <div class="auth-footer">
                    <p class="auth-switch">
                        Chưa có tài khoản?
                        <a href="index.php?page=register" class="auth-switch-link">Đăng ký ngay</a>
                    </p>
                </div>

                <div class="social-login">
                    <div class="social-login-divider">
                        <span>Hoặc đăng nhập bằng</span>
                    </div>

                    <div class="social-login-buttons">
                        <button type="button" class="btn btn-social btn-google">
                            <i class="fab fa-google"></i> Google
                        </button>
                        <button type="button" class="btn btn-social btn-facebook">
                            <i class="fab fa-facebook-f"></i> Facebook
                        </button>
                    </div>
                </div>
            </div>

            <div class="auth-image">
                <div class="auth-image-content">
                    <img src="images/logo.jpg" alt="Five:07" class="auth-logo">
                    <h2>Five:07 E-commerce</h2>
                    <p>Khám phá những sản phẩm công nghệ tuyệt vời cùng chúng tôi!</p>

                    <div class="auth-features">
                        <div class="auth-feature">
                            <i class="fas fa-shipping-fast"></i>
                            <span>Giao hàng nhanh chóng</span>
                        </div>
                        <div class="auth-feature">
                            <i class="fas fa-shield-alt"></i>
                            <span>Bảo mật thông tin</span>
                        </div>
                        <div class="auth-feature">
                            <i class="fas fa-headset"></i>
                            <span>Hỗ trợ 24/7</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</section>

<script>
    function togglePassword(inputId) {
        const input = document.getElementById(inputId);
        const eye = document.getElementById(inputId + '-eye');

        if (input.type === 'password') {
            input.type = 'text';
            eye.classList.remove('fa-eye');
            eye.classList.add('fa-eye-slash');
        } else {
            input.type = 'password';
            eye.classList.remove('fa-eye-slash');
            eye.classList.add('fa-eye');
        }
    }

    // Social login handlers (placeholder)
    document.addEventListener('DOMContentLoaded', function () {
        const googleBtn = document.querySelector('.btn-google');
        const facebookBtn = document.querySelector('.btn-facebook');

        if (googleBtn) {
            googleBtn.addEventListener('click', function () {
                alert('Tính năng đăng nhập Google đang được phát triển.');
            });
        }

        if (facebookBtn) {
            facebookBtn.addEventListener('click', function () {
                alert('Tính năng đăng nhập Facebook đang được phát triển.');
            });
        }
    });
</script>

<?php
// Add specific JavaScript for login page
$additional_js = ['JS/login.js'];
?>