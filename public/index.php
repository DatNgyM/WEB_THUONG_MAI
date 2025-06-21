<?php
// Tải cấu hình - đảm bảo BASE_URL và các hằng số khác được tải trước
require_once '../config/config.php';
require_once '../config/database.php';

// Tải Helper Functions trước mọi thứ khác để đảm bảo các hàm như asset() luôn khả dụng
require_once '../app/helpers/UrlHelper.php';

// Tải Core Libraries
require_once '../app/core/Controller.php';
require_once '../app/core/Database.php';
require_once '../app/core/Model.php';
require_once '../app/core/App.php';

// Autoload Classes
function autoloadModel($className)
{
    $path = MODEL_PATH . '/' . $className . '.php';
    if (file_exists($path)) {
        require_once $path;
    }
}

function autoloadController($className)
{
    $path = CONTROLLER_PATH . '/' . $className . '.php';
    if (file_exists($path)) {
        require_once $path;
    }
}

spl_autoload_register('autoloadModel');
spl_autoload_register('autoloadController');

// Khởi tạo ứng dụng
$init = new App();
