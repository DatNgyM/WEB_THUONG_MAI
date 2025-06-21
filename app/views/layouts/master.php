<!DOCTYPE html>
<html lang="vi">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title><?= $pageTitle ?? 'Website Thương Mại' ?></title> <!-- Bootstrap 5 CSS từ CDN -->
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css" rel="stylesheet">
    <!-- Font Awesome từ CDN -->
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
    <!-- Custom CSS - Đảm bảo rằng asset() function đã sẵn sàng -->
    <?php if (function_exists('asset')): ?>
        <link href="<?= asset('css/style.css') ?>" rel="stylesheet">
        <link href="<?= asset('css/custom.css') ?>" rel="stylesheet">
        <link href="<?= asset('css/responsive.css') ?>" rel="stylesheet">
    <?php else: ?>
        <!-- Fallback nếu asset() chưa được định nghĩa -->
        <link href="<?= BASE_URL ?>/public/css/style.css" rel="stylesheet">
        <link href="<?= BASE_URL ?>/public/css/custom.css" rel="stylesheet">
        <link href="<?= BASE_URL ?>/public/css/responsive.css" rel="stylesheet">
    <?php endif; ?>

    <?php if (isset($extraCSS)): ?>
        <?= $extraCSS ?>
    <?php endif; ?>
</head>

<body>
    <!-- Header -->
    <?php include VIEW_PATH . '/partials/header.php'; ?>

    <!-- Main Content -->
    <main class="container py-4">
        <?php include $viewPath; ?>
    </main>

    <!-- Footer -->
    <?php include VIEW_PATH . '/partials/footer.php'; ?> <!-- Page Loader -->
    <div class="page-loader">
        <div class="spinner"></div>
    </div>

    <!-- Bootstrap 5 JS Bundle từ CDN -->
    <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/js/bootstrap.bundle.min.js"></script>
    <!-- jQuery từ CDN -->
    <script src="https://code.jquery.com/jquery-3.6.0.min.js"></script> <!-- Custom JS -->
    <?php if (function_exists('asset')): ?>
        <script src="<?= asset('js/main.js') ?>"></script>
    <?php else: ?>
        <!-- Fallback nếu asset() chưa được định nghĩa -->
        <script src="<?= BASE_URL ?>/public/js/main.js"></script>
    <?php endif; ?>

    <script>
        $(window).on('load', function () {
            // Ẩn loading spinner khi trang đã tải xong
            $('.page-loader').fadeOut('slow');
        });

        $(document).ready(function () {
            // Cập nhật active nav link dựa trên URL hiện tại
            const currentLocation = location.pathname;
            $('.navbar-nav .nav-link').each(function () {
                const link = $(this).attr('href').split('/').slice(0, -1).join('/');
                if (currentLocation.includes(link) && link !== '<?= BASE_URL ?>') {
                    $(this).addClass('active');
                } else if (currentLocation === '/' && link === '<?= BASE_URL ?>') {
                    $(this).addClass('active');
                }
            });

            // Khởi tạo tooltip Bootstrap
            $('[data-bs-toggle="tooltip"]').tooltip();
        });
    </script>

    <?php if (isset($extraJS)): ?>
        <?= $extraJS ?>
    <?php endif; ?>
</body>

</html>