<header>
    <nav class="navbar navbar-expand-lg navbar-dark bg-dark">
        <div class="container">
            <a class="navbar-brand" href="<?= BASE_URL ?>">
                <img src="<?= asset('images/logo.jpg') ?>" alt="Logo" height="40"
                    class="d-inline-block align-text-top me-2">
                Website Thương Mại
            </a>
            <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarMain"
                aria-controls="navbarMain" aria-expanded="false" aria-label="Toggle navigation">
                <span class="navbar-toggler-icon"></span>
            </button>
            <div class="collapse navbar-collapse" id="navbarMain">
                <ul class="navbar-nav me-auto mb-2 mb-lg-0">
                    <li class="nav-item">
                        <a class="nav-link" href="<?= BASE_URL ?>">Trang chủ</a>
                    </li>
                    <li class="nav-item">
                        <a class="nav-link" href="<?= BASE_URL ?>/product">Sản phẩm</a>
                    </li>
                    <li class="nav-item dropdown">
                        <a class="nav-link dropdown-toggle" href="#" id="navbarDropdown" role="button"
                            data-bs-toggle="dropdown" aria-expanded="false">
                            Danh mục
                        </a>
                        <ul class="dropdown-menu" aria-labelledby="navbarDropdown">
                            <li><a class="dropdown-item" href="<?= BASE_URL ?>/product/category/1">Điện thoại</a></li>
                            <li><a class="dropdown-item" href="<?= BASE_URL ?>/product/category/2">Laptop</a></li>
                            <li><a class="dropdown-item" href="<?= BASE_URL ?>/product/category/3">Đồng hồ</a></li>
                            <li>
                                <hr class="dropdown-divider">
                            </li>
                            <li><a class="dropdown-item" href="<?= BASE_URL ?>/product/categories">Tất cả danh mục</a>
                            </li>
                        </ul>
                    </li>
                    <li class="nav-item">
                        <a class="nav-link" href="<?= BASE_URL ?>/about">Giới thiệu</a>
                    </li>
                    <li class="nav-item">
                        <a class="nav-link" href="<?= BASE_URL ?>/contact">Liên hệ</a>
                    </li>
                </ul>
                <form class="d-flex me-2" action="<?= BASE_URL ?>/search" method="GET">
                    <div class="input-group">
                        <input class="form-control" type="search" name="query" placeholder="Tìm kiếm"
                            aria-label="Search">
                        <button class="btn btn-outline-light" type="submit">
                            <i class="fas fa-search"></i>
                        </button>
                    </div>
                </form>
                <div class="d-flex"> <a href="<?= BASE_URL ?>/cart"
                        class="btn btn-outline-light position-relative me-2">
                        <i class="fas fa-shopping-cart"></i>
                        <span class="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger">
                            0
                            <span class="visually-hidden">sản phẩm</span>
                        </span>
                    </a>

                    <div class="dropdown">
                        <button class="btn btn-outline-light dropdown-toggle" type="button" id="userDropdown"
                            data-bs-toggle="dropdown" aria-expanded="false">
                            <i class="fas fa-user"></i>
                        </button>
                        <ul class="dropdown-menu dropdown-menu-end" aria-labelledby="userDropdown">
                            <li><a class="dropdown-item" href="<?= BASE_URL ?>/auth/login">Đăng nhập</a></li>
                            <li><a class="dropdown-item" href="<?= BASE_URL ?>/auth/register">Đăng ký</a></li>
                            <li>
                                <hr class="dropdown-divider">
                            </li>
                            <li><a class="dropdown-item" href="<?= BASE_URL ?>/account">Tài khoản</a></li>
                            <li><a class="dropdown-item" href="<?= BASE_URL ?>/account/orders">Đơn hàng của tôi</a></li>
                            <li><a class="dropdown-item" href="<?= BASE_URL ?>/auth/logout">Đăng xuất</a></li>
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    </nav>

    <!-- Banner Quảng Cáo -->
    <div class="container mt-2">
        <div class="row">
            <div class="col-12">
                <img src="<?= BASE_URL ?>/images/banner_QC.png" alt="Banner quảng cáo" class="img-fluid w-100 rounded">
            </div>
        </div>
    </div>
</header>