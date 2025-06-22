<?php
/**
 * API Endpoint for AJAX requests
 * Handle all API calls from JavaScript
 */

// Start session and include necessary files
session_start();
require_once '../config/config.php';
require_once '../config/database.php';
require_once '../app/core/Database.php';
require_once '../app/core/Model.php';
require_once '../app/core/Controller.php';

// Set JSON headers
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization');

// Handle OPTIONS request
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

// Autoload classes
function autoloadClasses($className)
{
    $paths = [
        '../app/models/' . $className . '.php',
        '../app/controllers/' . $className . '.php'
    ];

    foreach ($paths as $path) {
        if (file_exists($path)) {
            require_once $path;
            return;
        }
    }
}
spl_autoload_register('autoloadClasses');

// Get request path
$request = $_GET['request'] ?? '';
$method = $_SERVER['REQUEST_METHOD'];

// Route API requests
try {
    switch ($request) {
        case 'products':
            handleProductsAPI($method);
            break;
        case 'auth/login':
            handleAuthLogin($method);
            break;
        case 'auth/register':
            handleAuthRegister($method);
            break;
        case 'auth/logout':
            handleAuthLogout($method);
            break;
        case 'cart':
            handleCartAPI($method);
            break;
        case 'user/profile':
            handleUserProfile($method);
            break;
        default:
            http_response_code(404);
            echo json_encode(['error' => 'API endpoint not found']);
            break;
    }
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(['error' => 'Internal server error: ' . $e->getMessage()]);
}

function handleProductsAPI($method)
{
    require_once '../app/models/ProductModel.php';
    $productModel = new ProductModel();

    switch ($method) {
        case 'GET':
            $products = $productModel->getAllProducts();
            echo json_encode(['success' => true, 'data' => $products]);
            break;
        default:
            http_response_code(405);
            echo json_encode(['error' => 'Method not allowed']);
            break;
    }
}

function handleAuthLogin($method)
{
    if ($method !== 'POST') {
        http_response_code(405);
        echo json_encode(['error' => 'Method not allowed']);
        return;
    }

    $input = json_decode(file_get_contents('php://input'), true);
    $email = $input['email'] ?? '';
    $password = $input['password'] ?? '';

    if (empty($email) || empty($password)) {
        http_response_code(400);
        echo json_encode(['error' => 'Email and password are required']);
        return;
    }

    require_once '../app/models/UserModel.php';
    $userModel = new UserModel();
    $user = $userModel->login($email, $password);

    if ($user) {
        $_SESSION['user_id'] = $user['id'];
        $_SESSION['user_email'] = $user['email'];
        $_SESSION['user_role'] = $user['role'];
        echo json_encode(['success' => true, 'user' => $user]);
    } else {
        http_response_code(401);
        echo json_encode(['error' => 'Invalid credentials']);
    }
}

function handleAuthRegister($method)
{
    if ($method !== 'POST') {
        http_response_code(405);
        echo json_encode(['error' => 'Method not allowed']);
        return;
    }

    $input = json_decode(file_get_contents('php://input'), true);

    require_once '../app/models/UserModel.php';
    $userModel = new UserModel();
    $result = $userModel->register($input);

    if ($result['success']) {
        echo json_encode($result);
    } else {
        http_response_code(400);
        echo json_encode($result);
    }
}

function handleAuthLogout($method)
{
    if ($method !== 'POST') {
        http_response_code(405);
        echo json_encode(['error' => 'Method not allowed']);
        return;
    }

    session_destroy();
    echo json_encode(['success' => true, 'message' => 'Logged out successfully']);
}

function handleCartAPI($method)
{
    if (!isset($_SESSION['user_id'])) {
        http_response_code(401);
        echo json_encode(['error' => 'User not authenticated']);
        return;
    }

    // Handle cart operations
    switch ($method) {
        case 'GET':
            // Get cart items
            echo json_encode(['success' => true, 'data' => []]);
            break;
        case 'POST':
            // Add to cart
            echo json_encode(['success' => true, 'message' => 'Item added to cart']);
            break;
        default:
            http_response_code(405);
            echo json_encode(['error' => 'Method not allowed']);
            break;
    }
}

function handleUserProfile($method)
{
    if (!isset($_SESSION['user_id'])) {
        http_response_code(401);
        echo json_encode(['error' => 'User not authenticated']);
        return;
    }

    require_once '../app/models/UserModel.php';
    $userModel = new UserModel();

    switch ($method) {
        case 'GET':
            $user = $userModel->getUserById($_SESSION['user_id']);
            echo json_encode(['success' => true, 'data' => $user]);
            break;
        case 'PUT':
            $input = json_decode(file_get_contents('php://input'), true);
            $result = $userModel->updateUser($_SESSION['user_id'], $input);
            echo json_encode($result);
            break;
        default:
            http_response_code(405);
            echo json_encode(['error' => 'Method not allowed']);
            break;
    }
}
?>