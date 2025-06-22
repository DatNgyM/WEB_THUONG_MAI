<?php
/**
 * Five:07 E-commerce Platform
 * Main entry point - index.php
 */

// Start session
session_start();

// Include configuration and core files
require_once 'config/config.php';
require_once 'config/database.php';
require_once 'app/core/Database.php';
require_once 'app/core/Model.php';

// Autoload models and controllers
function autoloadClasses($className)
{
    $paths = [
        'app/models/' . $className . '.php',
        'app/controllers/' . $className . '.php'
    ];

    foreach ($paths as $path) {
        if (file_exists($path)) {
            require_once $path;
            return;
        }
    }
}
spl_autoload_register('autoloadClasses');

// Get current page
$page = $_GET['page'] ?? 'home';

// Handle logout
if ($page === 'logout') {
    session_destroy();
    header('Location: index.php');
    exit;
}

// Handle POST requests and redirects before any output
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    switch ($page) {
        case 'cart':
            // Handle cart AJAX requests
            $action = $_POST['action'] ?? '';
            $response = ['success' => false, 'message' => ''];

            try {
                switch ($action) {
                    case 'add_to_cart':
                        $product_id = intval($_POST['product_id'] ?? 0);
                        $quantity = intval($_POST['quantity'] ?? 1);

                        if ($product_id > 0 && $quantity > 0) {
                            if (!isset($_SESSION['cart'])) {
                                $_SESSION['cart'] = [];
                            }

                            if (isset($_SESSION['cart'][$product_id])) {
                                $_SESSION['cart'][$product_id] += $quantity;
                            } else {
                                $_SESSION['cart'][$product_id] = $quantity;
                            }

                            $response['success'] = true;
                            $response['message'] = 'Đã thêm sản phẩm vào giỏ hàng';
                            $response['cart_count'] = array_sum($_SESSION['cart']);
                        }
                        break;

                    case 'update_cart':
                        $product_id = intval($_POST['product_id'] ?? 0);
                        $quantity = intval($_POST['quantity'] ?? 1);

                        if ($product_id > 0 && $quantity > 0) {
                            if (!isset($_SESSION['cart'])) {
                                $_SESSION['cart'] = [];
                            }
                            $_SESSION['cart'][$product_id] = $quantity;

                            $response['success'] = true;
                            $response['cart_count'] = array_sum($_SESSION['cart']);
                        }
                        break;

                    case 'remove_from_cart':
                        $product_id = intval($_POST['product_id'] ?? 0);
                        if ($product_id > 0 && isset($_SESSION['cart'][$product_id])) {
                            unset($_SESSION['cart'][$product_id]);
                            $response['success'] = true;
                            $response['cart_count'] = array_sum($_SESSION['cart']);
                        }
                        break;
                }
            } catch (Exception $e) {
                error_log("Cart error: " . $e->getMessage());
                $response['message'] = 'Có lỗi xảy ra';
            }

            // Return JSON for AJAX requests
            if (
                !empty($_SERVER['HTTP_X_REQUESTED_WITH']) &&
                strtolower($_SERVER['HTTP_X_REQUESTED_WITH']) == 'xmlhttprequest'
            ) {
                header('Content-Type: application/json');
                echo json_encode($response);
                exit;
            }

            // Redirect for regular form submissions
            if ($response['success']) {
                header('Location: index.php?page=cart');
                exit;
            }
            break;
    }
}

// Handle redirects and logic before any output
switch ($page) {
    case 'product-detail':
        // Pre-process product-detail page
        $product_id = intval($_GET['id'] ?? 0);
        if ($product_id <= 0) {
            header('Location: index.php?page=404');
            exit;
        }

        try {
            require_once 'app/models/ProductModel.php';
            $productModel = new ProductModel();
            $product = $productModel->getProductById($product_id);

            if (!$product) {
                header('Location: index.php?page=404');
                exit;
            }
        } catch (Exception $e) {
            error_log("Error loading product: " . $e->getMessage());
            header('Location: index.php?page=404');
            exit;
        }
        break;
}

// Include header after all redirects
include 'includes/header.php';

// Route to appropriate page
switch ($page) {
    case 'home':
        include 'pages/home.php';
        break;
    case 'products':
        include 'pages/products.php';
        break;
    case 'product-detail':
        include 'pages/product-detail.php';
        break;
    case 'cart':
        include 'pages/cart.php';
        break;
    case 'checkout':
        include 'pages/checkout.php';
        break;
    case 'login':
        include 'pages/login.php';
        break;
    case 'register':
        include 'pages/register.php';
        break;
    case 'profile':
        include 'pages/profile.php';
        break;
    case 'admin':
        include 'pages/admin.php';
        break;
    default:
        include 'pages/404.php';
        break;
}

// Include footer
include 'includes/footer.php';
?>