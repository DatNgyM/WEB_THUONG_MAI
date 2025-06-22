<?php
/**
 * Helper Functions
 * Các hàm hỗ trợ chung cho toàn bộ ứng dụng
 */

/**
 * Định dạng tiền tệ VND
 * @param float $amount Số tiền
 * @return string Tiền tệ đã định dạng
 */
function formatPrice($amount)
{
    return number_format($amount, 0, ',', '.') . ' ₫';
}

/**
 * Định dạng ngày tháng
 * @param string $date Ngày tháng
 * @param string $format Định dạng mong muốn
 * @return string Ngày tháng đã định dạng
 */
function formatDate($date, $format = 'd/m/Y H:i')
{
    return date($format, strtotime($date));
}

/**
 * Tạo slug từ chuỗi
 * @param string $string Chuỗi gốc
 * @return string Slug
 */
function createSlug($string)
{
    // Chuyển về chữ thường
    $string = strtolower($string);

    // Thay thế ký tự tiếng Việt
    $vietnamese = [
        'à',
        'á',
        'ạ',
        'ả',
        'ã',
        'â',
        'ầ',
        'ấ',
        'ậ',
        'ẩ',
        'ẫ',
        'ă',
        'ằ',
        'ắ',
        'ặ',
        'ẳ',
        'ẵ',
        'è',
        'é',
        'ẹ',
        'ẻ',
        'ẽ',
        'ê',
        'ề',
        'ế',
        'ệ',
        'ể',
        'ễ',
        'ì',
        'í',
        'ị',
        'ỉ',
        'ĩ',
        'ò',
        'ó',
        'ọ',
        'ỏ',
        'õ',
        'ô',
        'ồ',
        'ố',
        'ộ',
        'ổ',
        'ỗ',
        'ơ',
        'ờ',
        'ớ',
        'ợ',
        'ở',
        'ỡ',
        'ù',
        'ú',
        'ụ',
        'ủ',
        'ũ',
        'ư',
        'ừ',
        'ứ',
        'ự',
        'ử',
        'ữ',
        'ỳ',
        'ý',
        'ỵ',
        'ỷ',
        'ỹ',
        'đ'
    ];

    $english = [
        'a',
        'a',
        'a',
        'a',
        'a',
        'a',
        'a',
        'a',
        'a',
        'a',
        'a',
        'a',
        'a',
        'a',
        'a',
        'a',
        'a',
        'e',
        'e',
        'e',
        'e',
        'e',
        'e',
        'e',
        'e',
        'e',
        'e',
        'e',
        'i',
        'i',
        'i',
        'i',
        'i',
        'o',
        'o',
        'o',
        'o',
        'o',
        'o',
        'o',
        'o',
        'o',
        'o',
        'o',
        'o',
        'o',
        'o',
        'o',
        'o',
        'o',
        'u',
        'u',
        'u',
        'u',
        'u',
        'u',
        'u',
        'u',
        'u',
        'u',
        'u',
        'y',
        'y',
        'y',
        'y',
        'y',
        'd'
    ];

    $string = str_replace($vietnamese, $english, $string);

    // Thay thế ký tự đặc biệt bằng dấu gạch ngang
    $string = preg_replace('/[^a-z0-9]+/', '-', $string);

    // Loại bỏ dấu gạch ngang ở đầu và cuối
    $string = trim($string, '-');

    return $string;
}

/**
 * Cắt chuỗi với độ dài giới hạn
 * @param string $string Chuỗi gốc
 * @param int $length Độ dài tối đa
 * @param string $suffix Hậu tố
 * @return string Chuỗi đã cắt
 */
function truncateString($string, $length = 100, $suffix = '...')
{
    if (strlen($string) <= $length) {
        return $string;
    }

    return substr($string, 0, $length) . $suffix;
}

/**
 * Tính phần trăm giảm giá
 * @param float $originalPrice Giá gốc
 * @param float $salePrice Giá khuyến mãi
 * @return int Phần trăm giảm giá
 */
function calculateDiscountPercentage($originalPrice, $salePrice)
{
    if ($originalPrice <= 0 || $salePrice >= $originalPrice) {
        return 0;
    }

    return round((($originalPrice - $salePrice) / $originalPrice) * 100);
}

/**
 * Tạo mã đơn hàng ngẫu nhiên
 * @param int $length Độ dài mã
 * @return string Mã đơn hàng
 */
function generateOrderNumber($length = 8)
{
    $prefix = 'ORD';
    $timestamp = substr(time(), -4);
    $random = str_pad(mt_rand(1, 9999), 4, '0', STR_PAD_LEFT);

    return $prefix . $timestamp . $random;
}

/**
 * Validate email
 * @param string $email Email
 * @return bool
 */
function isValidEmail($email)
{
    return filter_var($email, FILTER_VALIDATE_EMAIL) !== false;
}

/**
 * Validate số điện thoại Việt Nam
 * @param string $phone Số điện thoại
 * @return bool
 */
function isValidPhoneVN($phone)
{
    // Loại bỏ spaces và dấu gạch ngang
    $phone = preg_replace('/[\s\-]/', '', $phone);

    // Kiểm tra format số điện thoại VN
    return preg_match('/^(0|\+84)[0-9]{9,10}$/', $phone);
}

/**
 * Làm sạch input
 * @param string $data Dữ liệu đầu vào
 * @return string Dữ liệu đã làm sạch
 */
function sanitizeInput($data)
{
    $data = trim($data);
    $data = stripslashes($data);
    $data = htmlspecialchars($data);
    return $data;
}

/**
 * Tạo token CSRF
 * @return string CSRF token
 */
function generateCSRFToken()
{
    if (!isset($_SESSION['csrf_token'])) {
        $_SESSION['csrf_token'] = bin2hex(random_bytes(32));
    }
    return $_SESSION['csrf_token'];
}

/**
 * Xác thực token CSRF
 * @param string $token Token để xác thực
 * @return bool
 */
function validateCSRFToken($token)
{
    return isset($_SESSION['csrf_token']) && hash_equals($_SESSION['csrf_token'], $token);
}

/**
 * Chuyển hướng với thông báo flash
 * @param string $url URL chuyển hướng
 * @param string $message Thông báo
 * @param string $type Loại thông báo (success, error, warning, info)
 */
function redirectWithMessage($url, $message, $type = 'info')
{
    $_SESSION['flash_message'] = $message;
    $_SESSION['flash_type'] = $type;
    header('Location: ' . $url);
    exit;
}

/**
 * Lấy và xóa thông báo flash
 * @return array|null Thông báo flash
 */
function getFlashMessage()
{
    if (isset($_SESSION['flash_message'])) {
        $message = [
            'message' => $_SESSION['flash_message'],
            'type' => $_SESSION['flash_type'] ?? 'info'
        ];

        unset($_SESSION['flash_message']);
        unset($_SESSION['flash_type']);

        return $message;
    }

    return null;
}

/**
 * Kiểm tra người dùng đã đăng nhập
 * @return bool
 */
function isLoggedIn()
{
    return isset($_SESSION['user_id']) && !empty($_SESSION['user_id']);
}

/**
 * Kiểm tra người dùng có quyền admin
 * @return bool
 */
function isAdmin()
{
    return isLoggedIn() && (isset($_SESSION['user_role']) && $_SESSION['user_role'] === 'admin');
}

/**
 * Lấy thông tin người dùng hiện tại
 * @return array|null Thông tin người dùng
 */
function getCurrentUser()
{
    if (!isLoggedIn()) {
        return null;
    }

    return [
        'id' => $_SESSION['user_id'],
        'username' => $_SESSION['username'] ?? '',
        'email' => $_SESSION['email'] ?? '',
        'role' => $_SESSION['user_role'] ?? 'customer'
    ];
}

/**
 * Tạo thẻ meta cho SEO
 * @param string $title Tiêu đề trang
 * @param string $description Mô tả trang
 * @param string $keywords Từ khóa
 * @return string HTML meta tags
 */
function generateMetaTags($title, $description = '', $keywords = '')
{
    $html = '<title>' . htmlspecialchars($title) . '</title>' . "\n";

    if (!empty($description)) {
        $html .= '<meta name="description" content="' . htmlspecialchars($description) . '">' . "\n";
    }

    if (!empty($keywords)) {
        $html .= '<meta name="keywords" content="' . htmlspecialchars($keywords) . '">' . "\n";
    }

    return $html;
}
