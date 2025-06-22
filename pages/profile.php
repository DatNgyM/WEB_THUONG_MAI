<?php
$page_title = "Tài khoản";

// Check if user is logged in
if (!isset($_SESSION['user_id'])) {
    header('Location: index.php?page=login&redirect=' . urlencode($_SERVER['REQUEST_URI']));
    exit;
}

// Handle form submission
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $action = $_POST['action'] ?? '';

    if ($action === 'update_profile') {
        $name = trim($_POST['name'] ?? '');
        $phone = trim($_POST['phone'] ?? '');
        $address = trim($_POST['address'] ?? '');

        $errors = [];

        if (empty($name)) {
            $errors[] = "Họ tên không được để trống.";
        }

        if (!empty($phone) && !preg_match('/^[0-9]{10,11}$/', $phone)) {
            $errors[] = "Số điện thoại không hợp lệ.";
        }

        if (empty($errors)) {
            try {
                $userModel = new UserModel();
                $updateData = [
                    'name' => $name,
                    'phone' => $phone,
                    'address' => $address
                ];

                if ($userModel->updateProfile($_SESSION['user_id'], $updateData)) {
                    $_SESSION['user_name'] = $name;
                    $success_message = "Cập nhật thông tin thành công!";
                } else {
                    $errors[] = "Có lỗi xảy ra khi cập nhật thông tin.";
                }
            } catch (Exception $e) {
                error_log("Profile update error: " . $e->getMessage());
                $errors[] = "Có lỗi xảy ra. Vui lòng thử lại.";
            }
        }
    }
}

// Get user info
try {
    $userModel = new UserModel();
    $user = $userModel->find($_SESSION['user_id']);

    if (!$user) {
        session_destroy();
        header('Location: index.php?page=login');
        exit;
    }
} catch (Exception $e) {
    error_log("Error loading user profile: " . $e->getMessage());
    header('Location: index.php?page=login');
    exit;
}
?>

<section class="profile-section">
    <div class="container">
        <div class="profile-header">
            <div class="breadcrumb">
                <a href="index.php">Trang chủ</a>
                <span class="breadcrumb-separator"><i class="fas fa-chevron-right"></i></span>
                <span class="breadcrumb-current">Tài khoản</span>
            </div>

            <h1 class="page-title">Tài khoản của tôi</h1>
            <p class="page-subtitle">Quản lý thông tin cá nhân và cài đặt tài khoản</p>
        </div>

        <div class="profile-content">
            <div class="profile-sidebar">
                <div class="profile-card">
                    <div class="profile-avatar">
                        <i class="fas fa-user-circle"></i>
                    </div>
                    <div class="profile-info">
                        <h3 class="profile-name"><?php echo htmlspecialchars($user['name']); ?></h3>
                        <p class="profile-email"><?php echo htmlspecialchars($user['email']); ?></p>
                        <span class="profile-badge">
                            <?php echo isset($user['is_admin']) && $user['is_admin'] ? 'Quản trị viên' : 'Khách hàng'; ?>
                        </span>
                    </div>
                </div>

                <div class="profile-menu">
                    <a href="#profile-info" class="menu-item active" data-tab="profile-info">
                        <i class="fas fa-user"></i> Thông tin cá nhân
                    </a>
                    <a href="#order-history" class="menu-item" data-tab="order-history">
                        <i class="fas fa-shopping-bag"></i> Lịch sử đơn hàng
                    </a>
                    <a href="#change-password" class="menu-item" data-tab="change-password">
                        <i class="fas fa-lock"></i> Đổi mật khẩu
                    </a>
                    <a href="index.php?page=logout" class="menu-item logout">
                        <i class="fas fa-sign-out-alt"></i> Đăng xuất
                    </a>
                </div>
            </div>

            <div class="profile-main">
                <!-- Profile Info Tab -->
                <div class="tab-content active" id="profile-info">
                    <div class="tab-header">
                        <h2 class="tab-title">Thông tin cá nhân</h2>
                        <p class="tab-subtitle">Cập nhật thông tin cá nhân của bạn</p>
                    </div>

                    <?php if (!empty($success_message)): ?>
                        <div class="alert alert-success">
                            <i class="fas fa-check-circle"></i>
                            <?php echo htmlspecialchars($success_message); ?>
                        </div>
                    <?php endif; ?>

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

                    <form class="profile-form" method="POST" action="">
                        <input type="hidden" name="action" value="update_profile">

                        <div class="form-row">
                            <div class="form-group">
                                <label for="name" class="form-label">Họ và tên</label>
                                <input type="text" id="name" name="name" class="form-input"
                                    value="<?php echo htmlspecialchars($user['name']); ?>" required>
                            </div>

                            <div class="form-group">
                                <label for="email" class="form-label">Email</label>
                                <input type="email" id="email" class="form-input"
                                    value="<?php echo htmlspecialchars($user['email']); ?>" disabled>
                                <small class="form-help">Email không thể thay đổi</small>
                            </div>
                        </div>

                        <div class="form-row">
                            <div class="form-group">
                                <label for="phone" class="form-label">Số điện thoại</label>
                                <input type="tel" id="phone" name="phone" class="form-input"
                                    value="<?php echo htmlspecialchars($user['phone'] ?? ''); ?>"
                                    placeholder="Nhập số điện thoại">
                            </div>

                            <div class="form-group">
                                <label for="join_date" class="form-label">Ngày tham gia</label>
                                <input type="text" id="join_date" class="form-input"
                                    value="<?php echo date('d/m/Y', strtotime($user['created_at'])); ?>" disabled>
                            </div>
                        </div>

                        <div class="form-group">
                            <label for="address" class="form-label">Địa chỉ</label>
                            <textarea id="address" name="address" class="form-input" rows="3"
                                placeholder="Nhập địa chỉ của bạn"><?php echo htmlspecialchars($user['address'] ?? ''); ?></textarea>
                        </div>

                        <div class="form-actions">
                            <button type="submit" class="btn btn-primary">
                                <i class="fas fa-save"></i> Lưu thay đổi
                            </button>
                            <button type="reset" class="btn btn-outline">
                                <i class="fas fa-undo"></i> Hủy bỏ
                            </button>
                        </div>
                    </form>
                </div>

                <!-- Order History Tab -->
                <div class="tab-content" id="order-history">
                    <div class="tab-header">
                        <h2 class="tab-title">Lịch sử đơn hàng</h2>
                        <p class="tab-subtitle">Xem lại các đơn hàng đã đặt</p>
                    </div>

                    <div class="orders-list">
                        <div class="no-orders">
                            <i class="fas fa-shopping-bag"></i>
                            <h3>Chưa có đơn hàng nào</h3>
                            <p>Bạn chưa có đơn hàng nào. Hãy bắt đầu mua sắm ngay!</p>
                            <a href="index.php?page=products" class="btn btn-primary">
                                <i class="fas fa-shopping-cart"></i> Mua sắm ngay
                            </a>
                        </div>
                    </div>
                </div>

                <!-- Change Password Tab -->
                <div class="tab-content" id="change-password">
                    <div class="tab-header">
                        <h2 class="tab-title">Đổi mật khẩu</h2>
                        <p class="tab-subtitle">Cập nhật mật khẩu để bảo mật tài khoản</p>
                    </div>

                    <form class="password-form">
                        <div class="form-group">
                            <label for="current_password" class="form-label">Mật khẩu hiện tại</label>
                            <input type="password" id="current_password" name="current_password" class="form-input"
                                required>
                        </div>

                        <div class="form-group">
                            <label for="new_password" class="form-label">Mật khẩu mới</label>
                            <input type="password" id="new_password" name="new_password" class="form-input" required>
                        </div>

                        <div class="form-group">
                            <label for="confirm_new_password" class="form-label">Xác nhận mật khẩu mới</label>
                            <input type="password" id="confirm_new_password" name="confirm_new_password"
                                class="form-input" required>
                        </div>

                        <div class="form-actions">
                            <button type="submit" class="btn btn-primary">
                                <i class="fas fa-key"></i> Đổi mật khẩu
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    </div>
</section>

<script>
    document.addEventListener('DOMContentLoaded', function () {
        // Tab navigation
        const menuItems = document.querySelectorAll('.menu-item');
        const tabContents = document.querySelectorAll('.tab-content');

        menuItems.forEach(item => {
            item.addEventListener('click', function (e) {
                if (this.classList.contains('logout')) return;

                e.preventDefault();
                const targetTab = this.dataset.tab;

                // Remove active class from all menu items and tab contents
                menuItems.forEach(menu => menu.classList.remove('active'));
                tabContents.forEach(content => content.classList.remove('active'));

                // Add active class to clicked menu item and corresponding tab
                this.classList.add('active');
                document.getElementById(targetTab).classList.add('active');
            });
        });

        // Password form validation
        const passwordForm = document.querySelector('.password-form');
        if (passwordForm) {
            passwordForm.addEventListener('submit', function (e) {
                e.preventDefault();

                const newPassword = document.getElementById('new_password').value;
                const confirmPassword = document.getElementById('confirm_new_password').value;

                if (newPassword !== confirmPassword) {
                    alert('Mật khẩu mới và xác nhận mật khẩu không khớp!');
                    return;
                }

                if (newPassword.length < 6) {
                    alert('Mật khẩu mới phải có ít nhất 6 ký tự!');
                    return;
                }

                // Add actual password change logic here
                alert('Tính năng đổi mật khẩu đang được phát triển.');
            });
        }
    });
</script>

<?php
// Add specific CSS for profile page
$additional_css = ['CSS/profile-styles.css'];
?>