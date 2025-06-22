<?php
$page_title = "Đăng ký";

// Handle registration form submission
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $name = trim($_POST['name'] ?? '');
    $email = trim($_POST['email'] ?? '');
    $password = $_POST['password'] ?? '';
    $confirm_password = $_POST['confirm_password'] ?? '';
    $phone = trim($_POST['phone'] ?? '');
    $agree_terms = isset($_POST['agree_terms']);

    $errors = [];

    // Validation
    if (empty($name)) {
        $errors[] = "Họ tên không được để trống.";
    } elseif (strlen($name) < 2) {
        $errors[] = "Họ tên phải có ít nhất 2 ký tự.";
    }

    if (empty($email)) {
        $errors[] = "Email không được để trống.";
    } elseif (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
        $errors[] = "Email không hợp lệ.";
    }

    if (empty($password)) {
        $errors[] = "Mật khẩu không được để trống.";
    } elseif (strlen($password) < 6) {
        $errors[] = "Mật khẩu phải có ít nhất 6 ký tự.";
    }

    if ($password !== $confirm_password) {
        $errors[] = "Xác nhận mật khẩu không khớp.";
    }

    if (!empty($phone) && !preg_match('/^[0-9]{10,11}$/', $phone)) {
        $errors[] = "Số điện thoại không hợp lệ.";
    }

    if (!$agree_terms) {
        $errors[] = "Bạn phải đồng ý với điều khoản sử dụng.";
    }

    // Registration attempt
    if (empty($errors)) {
        try {
            $userModel = new UserModel();

            // Check if email already exists
            if ($userModel->emailExists($email)) {
                $errors[] = "Email này đã được sử dụng.";
            } else {
                $userData = [
                    'name' => $name,
                    'email' => $email,
                    'password' => $password,
                    'phone' => $phone
                ];

                $result = $userModel->register($userData);

                if ($result['success']) {
                    // Auto login after registration
                    $user = $userModel->getUserByEmail($email);
                    if ($user) {
                        $_SESSION['user_id'] = $user['id'];
                        $_SESSION['user_email'] = $user['email'];
                        $_SESSION['user_name'] = $user['name'];
                        $_SESSION['is_admin'] = $user['is_admin'] ?? 0;

                        // Redirect to home page
                        header('Location: index.php?page=home&registered=1');
                        exit;
                    }
                } else {
                    $errors[] = $result['message'] ?? "Có lỗi xảy ra khi đăng ký.";
                }
            }
        } catch (Exception $e) {
            error_log("Registration error: " . $e->getMessage());
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
                    <h1 class="auth-title">Đăng ký</h1>
                    <p class="auth-subtitle">Tạo tài khoản mới để bắt đầu mua sắm!</p>
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
                        <label for="name" class="form-label">
                            <i class="fas fa-user"></i> Họ và tên
                        </label>
                        <input type="text" id="name" name="name" class="form-input"
                            value="<?php echo htmlspecialchars($name ?? ''); ?>" placeholder="Nhập họ và tên của bạn"
                            required>
                    </div>

                    <div class="form-group">
                        <label for="email" class="form-label">
                            <i class="fas fa-envelope"></i> Email
                        </label>
                        <input type="email" id="email" name="email" class="form-input"
                            value="<?php echo htmlspecialchars($email ?? ''); ?>" placeholder="Nhập email của bạn"
                            required>
                    </div>

                    <div class="form-group">
                        <label for="phone" class="form-label">
                            <i class="fas fa-phone"></i> Số điện thoại
                        </label>
                        <input type="tel" id="phone" name="phone" class="form-input"
                            value="<?php echo htmlspecialchars($phone ?? ''); ?>"
                            placeholder="Nhập số điện thoại (tùy chọn)">
                    </div>

                    <div class="form-row">
                        <div class="form-group">
                            <label for="password" class="form-label">
                                <i class="fas fa-lock"></i> Mật khẩu
                            </label>
                            <div class="password-input-wrapper">
                                <input type="password" id="password" name="password" class="form-input"
                                    placeholder="Nhập mật khẩu (ít nhất 6 ký tự)" required>
                                <button type="button" class="password-toggle" onclick="togglePassword('password')">
                                    <i class="fas fa-eye" id="password-eye"></i>
                                </button>
                            </div>
                        </div>

                        <div class="form-group">
                            <label for="confirm_password" class="form-label">
                                <i class="fas fa-lock"></i> Xác nhận mật khẩu
                            </label>
                            <div class="password-input-wrapper">
                                <input type="password" id="confirm_password" name="confirm_password" class="form-input"
                                    placeholder="Nhập lại mật khẩu" required>
                                <button type="button" class="password-toggle"
                                    onclick="togglePassword('confirm_password')">
                                    <i class="fas fa-eye" id="confirm_password-eye"></i>
                                </button>
                            </div>
                        </div>
                    </div>

                    <div class="form-options">
                        <div class="checkbox-group">
                            <input type="checkbox" id="agree_terms" name="agree_terms" class="form-checkbox" required>
                            <label for="agree_terms" class="checkbox-label">
                                Tôi đồng ý với
                                <a href="#terms" class="terms-link">Điều khoản sử dụng</a>
                                và
                                <a href="#privacy" class="terms-link">Chính sách bảo mật</a>
                            </label>
                        </div>
                    </div>

                    <button type="submit" class="btn btn-primary btn-lg btn-full">
                        <i class="fas fa-user-plus"></i> Đăng ký
                    </button>
                </form>

                <div class="auth-footer">
                    <p class="auth-switch">
                        Đã có tài khoản?
                        <a href="index.php?page=login" class="auth-switch-link">Đăng nhập ngay</a>
                    </p>
                </div>

                <div class="social-login">
                    <div class="social-login-divider">
                        <span>Hoặc đăng ký bằng</span>
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
                    <h2>Gia nhập Five:07</h2>
                    <p>Khám phá thế giới công nghệ với hàng ngàn sản phẩm chất lượng!</p>

                    <div class="auth-features">
                        <div class="auth-feature">
                            <i class="fas fa-gift"></i>
                            <span>Ưu đãi độc quyền</span>
                        </div>
                        <div class="auth-feature">
                            <i class="fas fa-star"></i>
                            <span>Tích điểm thưởng</span>
                        </div>
                        <div class="auth-feature">
                            <i class="fas fa-truck"></i>
                            <span>Miễn phí vận chuyển</span>
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

    // Password strength indicator
    document.addEventListener('DOMContentLoaded', function () {
        const passwordInput = document.getElementById('password');
        const confirmPasswordInput = document.getElementById('confirm_password');

        // Password strength check
        passwordInput.addEventListener('input', function () {
            const password = this.value;
            let strength = 0;

            if (password.length >= 6) strength++;
            if (password.match(/[a-z]/)) strength++;
            if (password.match(/[A-Z]/)) strength++;
            if (password.match(/[0-9]/)) strength++;
            if (password.match(/[!@#$%^&*(),.?":{}|<>]/)) strength++;

            // Update UI based on strength (optional)
            this.className = 'form-input password-strength-' + strength;
        });

        // Password confirmation check
        confirmPasswordInput.addEventListener('input', function () {
            const password = passwordInput.value;
            const confirmPassword = this.value;

            if (confirmPassword && password !== confirmPassword) {
                this.setCustomValidity('Mật khẩu không khớp');
            } else {
                this.setCustomValidity('');
            }
        });

        // Social registration handlers (placeholder)
        const googleBtn = document.querySelector('.btn-google');
        const facebookBtn = document.querySelector('.btn-facebook');

        if (googleBtn) {
            googleBtn.addEventListener('click', function () {
                alert('Tính năng đăng ký Google đang được phát triển.');
            });
        }

        if (facebookBtn) {
            facebookBtn.addEventListener('click', function () {
                alert('Tính năng đăng ký Facebook đang được phát triển.');
            });
        }
    });
</script>

<?php
// Add specific JavaScript for register page
$additional_js = ['JS/register.js'];
?>