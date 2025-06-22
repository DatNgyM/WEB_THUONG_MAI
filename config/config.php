<?php
// Cấu hình cơ bản của ứng dụng
// Cấu hình cho Laragon - Apache
define('BASE_URL', 'http://web-thuong-mai.test'); // Hoặc http://localhost/WEB_THUONG_MAI
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

// Cấu hình sử dụng database thật thay vì dữ liệu giả lập
define('USE_MOCK_DATA', false);

// Thiết lập múi giờ và charset
date_default_timezone_set('Asia/Ho_Chi_Minh');

// Hiển thị lỗi trong môi trường phát triển - luôn bật cho dễ debug
ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);
