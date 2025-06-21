<?php
// Bootstrap file chỉ nạp các lớp cốt lõi, helpers được nạp từ public/index.php
require_once ROOT_PATH . '/app/core/App.php';
require_once ROOT_PATH . '/app/core/Controller.php';
require_once ROOT_PATH . '/app/core/Model.php';

// Tự động nạp controller
spl_autoload_register(function ($className) {
    // Tìm trong thư mục controllers
    if (file_exists(ROOT_PATH . '/app/controllers/' . $className . '.php')) {
        require_once ROOT_PATH . '/app/controllers/' . $className . '.php';
        return;
    }

    // Tìm trong thư mục models
    if (file_exists(ROOT_PATH . '/app/models/' . $className . '.php')) {
        require_once ROOT_PATH . '/app/models/' . $className . '.php';
        return;
    }
});
