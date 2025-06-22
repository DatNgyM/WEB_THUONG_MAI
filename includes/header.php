<!DOCTYPE html>
<html lang="vi">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title><?php echo isset($page_title) ? $page_title . ' - ' : ''; ?>Five:07 E-commerce</title>
    <!-- Modern CSS -->
    <link rel="stylesheet" href="CSS/main-styles.css">
    <link rel="stylesheet" href="CSS/auth-styles.css">
    <link rel="stylesheet" href="CSS/products-styles.css">
    <link rel="stylesheet" href="CSS/cart-styles.css">
    <link rel="stylesheet" href="CSS/fixes.css">

    <!-- Font Awesome -->
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">

    <!-- Google Fonts -->
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap" rel="stylesheet">

    <!-- Main JavaScript -->
    <script src="JS/main.js" defer></script>

    <!-- Additional CSS for specific pages -->
    <?php if (isset($additional_css) && is_array($additional_css)): ?>
        <?php foreach ($additional_css as $css): ?>
            <link rel="stylesheet" href="<?php echo $css; ?>">
        <?php endforeach; ?>
    <?php endif; ?>
</head>

<body>
    <!-- Navigation Header -->
    <header class="main-header">
        <nav class="navbar">
            <div class="nav-container">
                <!-- Logo -->
                <div class="nav-logo">
                    <a href="index.php" class="logo-link">
                        <img src="images/logo.jpg" alt="Five:07" class="logo-img">
                        <span class="logo-text">Five:07</span>
                    </a>
                </div>

                <!-- Search Bar -->
                <div class="nav-search">
                    <form class="search-form" action="index.php" method="GET">
                        <input type="hidden" name="page" value="products">
                        <div class="search-input-wrapper">
                            <input type="text" name="search" placeholder="Tìm kiếm sản phẩm..." class="search-input">
                            <button type="submit" class="search-btn">
                                <i class="fas fa-search"></i>
                            </button>
                        </div>
                    </form>
                </div>

                <!-- Navigation Links -->
                <div class="nav-links">
                    <a href="index.php" class="nav-link <?php echo ($page == 'home') ? 'active' : ''; ?>">
                        <i class="fas fa-home"></i> Trang chủ
                    </a>
                    <a href="index.php?page=products"
                        class="nav-link <?php echo ($page == 'products') ? 'active' : ''; ?>">
                        <i class="fas fa-shopping-bag"></i> Sản phẩm
                    </a>
                    <?php if (isset($_SESSION['user_id'])): ?>
                        <a href="index.php?page=profile"
                            class="nav-link <?php echo ($page == 'profile') ? 'active' : ''; ?>">
                            <i class="fas fa-user"></i> Tài khoản
                        </a>
                        <?php if (isset($_SESSION['is_admin']) && $_SESSION['is_admin']): ?>
                            <a href="index.php?page=admin" class="nav-link <?php echo ($page == 'admin') ? 'active' : ''; ?>">
                                <i class="fas fa-cog"></i> Quản trị
                            </a>
                        <?php endif; ?>
                        <a href="index.php?page=logout" class="nav-link">
                            <i class="fas fa-sign-out-alt"></i> Đăng xuất
                        </a>
                    <?php else: ?>
                        <a href="index.php?page=login" class="nav-link <?php echo ($page == 'login') ? 'active' : ''; ?>">
                            <i class="fas fa-sign-in-alt"></i> Đăng nhập
                        </a>
                        <a href="index.php?page=register"
                            class="nav-link <?php echo ($page == 'register') ? 'active' : ''; ?>">
                            <i class="fas fa-user-plus"></i> Đăng ký
                        </a>
                    <?php endif; ?>
                </div>

                <!-- Cart -->
                <div class="nav-cart">
                    <a href="index.php?page=cart" class="cart-link">
                        <i class="fas fa-shopping-cart"></i>
                        <span class="cart-count" id="cart-count">
                            <?php
                            $cart_count = 0;
                            if (isset($_SESSION['cart']) && is_array($_SESSION['cart'])) {
                                $cart_count = array_sum($_SESSION['cart']);
                            }
                            echo $cart_count;
                            ?>
                        </span>
                    </a>
                </div>

                <!-- Mobile Menu Toggle -->
                <div class="mobile-menu-toggle">
                    <i class="fas fa-bars"></i>
                </div>
            </div>
        </nav>

        <!-- Mobile Menu -->
        <div class="mobile-menu">
            <div class="mobile-menu-content">
                <a href="index.php" class="mobile-menu-link">Trang chủ</a>
                <a href="index.php?page=products" class="mobile-menu-link">Sản phẩm</a>
                <?php if (isset($_SESSION['user_id'])): ?>
                    <a href="index.php?page=profile" class="mobile-menu-link">Tài khoản</a>
                    <?php if (isset($_SESSION['is_admin']) && $_SESSION['is_admin']): ?>
                        <a href="index.php?page=admin" class="mobile-menu-link">Quản trị</a>
                    <?php endif; ?>
                    <a href="index.php?page=logout" class="mobile-menu-link">Đăng xuất</a>
                <?php else: ?>
                    <a href="index.php?page=login" class="mobile-menu-link">Đăng nhập</a>
                    <a href="index.php?page=register" class="mobile-menu-link">Đăng ký</a>
                <?php endif; ?> <a href="index.php?page=cart" class="mobile-menu-link">Giỏ hàng</a>
            </div>
        </div>
    </header>

    <!-- Main Content -->
    <main class="main-content">