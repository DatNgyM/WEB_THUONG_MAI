<?php
// Cấu hình cơ bản của ứng dụng
// Đường dẫn cho localhost:8080 - sử dụng khi chạy với PHP built-in server
define('BASE_URL', 'http://localhost:8080');
define('ROOT_PATH', dirname(__DIR__));

// Cấu hình đường dẫn
define('APP_PATH', ROOT_PATH . '/app');
define('CONTROLLER_PATH', APP_PATH . '/controllers');
define('MODEL_PATH', APP_PATH . '/models');
define('VIEW_PATH', APP_PATH . '/views');
define('CORE_PATH', APP_PATH . '/core');
define('PUBLIC_PATH', ROOT_PATH . '/public');

// Cấu hình môi trường
define('DEBUG_MODE', true);

// Cấu hình sử dụng dữ liệu giả lập (mockup data) khi chưa có CSDL
define('USE_MOCK_DATA', true);

// Thiết lập múi giờ và charset
date_default_timezone_set('Asia/Ho_Chi_Minh');

// Hiển thị lỗi trong môi trường phát triển - luôn bật cho dễ debug
ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);
