<?php
/**
 * URL Helper Functions
 * Các hàm hỗ trợ quản lý đường dẫn
 */

// Đảm bảo rằng BASE_URL đã được định nghĩa
if (!defined('BASE_URL')) {
    // Fallback để tránh lỗi nếu cấu hình chưa được tải
    define('BASE_URL', 'http://localhost/WEB_THUONG_MAI');
}

/**
 * Lấy đường dẫn đầy đủ của tài nguyên tĩnh (hình ảnh, css, js...)
 * 
 * @param string $path Đường dẫn tương đối 
 * @return string Đường dẫn đầy đủ
 */
function asset($path)
{
    // Chuẩn hóa đường dẫn
    $path = ltrim($path, '/');

    // Nếu đường dẫn đã bắt đầu bằng 'public/', không cần thêm vào nữa
    if (strpos($path, 'public/') === 0) {
        return BASE_URL . '/' . $path;
    }

    // Kiểm tra xem có phải ảnh sản phẩm không
    if (strpos($path, 'images/products/') === 0) {
        return BASE_URL . '/public/' . $path;
    }

    // Kiểm tra xem có phải ảnh danh mục không
    if (strpos($path, 'images/categories/') === 0) {
        return BASE_URL . '/public/' . $path;
    }

    // Với các tài nguyên khác
    if (strpos($path, 'images/') === 0 || strpos($path, 'css/') === 0 || strpos($path, 'js/') === 0) {
        return BASE_URL . '/public/' . $path;
    }

    // Mặc định
    return BASE_URL . '/' . $path;
}
