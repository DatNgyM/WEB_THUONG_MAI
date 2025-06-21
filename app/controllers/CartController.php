<?php
/**
 * Cart Controller
 * Xử lý các tác vụ liên quan đến giỏ hàng
 */
class CartController extends Controller
{
    /**
     * Hiển thị giỏ hàng
     */
    public function index()
    {
        $data = [
            'pageTitle' => 'Giỏ hàng - Website Thương Mại'
        ];

        $this->view('cart/index', $data);
    }

    /**
     * Thêm sản phẩm vào giỏ hàng
     */
    public function add()
    {
        if ($_SERVER['REQUEST_METHOD'] == 'POST') {
            // Lấy dữ liệu
            $productId = isset($_POST['product_id']) ? (int) $_POST['product_id'] : 0;
            $quantity = isset($_POST['quantity']) ? (int) $_POST['quantity'] : 1;

            // Kiểm tra sản phẩm tồn tại
            $productModel = $this->model('ProductModel');
            $product = $productModel->getById($productId);

            if (!$product) {
                // Trả về lỗi nếu sản phẩm không tồn tại
                header('Content-Type: application/json');
                echo json_encode(['success' => false, 'message' => 'Sản phẩm không tồn tại']);
                return;
            }

            // Khởi tạo session nếu chưa có
            if (session_status() == PHP_SESSION_NONE) {
                session_start();
            }

            // Khởi tạo giỏ hàng nếu chưa có
            if (!isset($_SESSION['cart'])) {
                $_SESSION['cart'] = [];
            }

            // Kiểm tra sản phẩm đã có trong giỏ hàng chưa
            if (isset($_SESSION['cart'][$productId])) {
                // Nếu có rồi thì cộng thêm số lượng
                $_SESSION['cart'][$productId]['quantity'] += $quantity;
            } else {
                // Nếu chưa có thì thêm mới
                $_SESSION['cart'][$productId] = [
                    'id' => $productId,
                    'name' => $product->name,
                    'price' => $product->price,
                    'image' => $product->image,
                    'quantity' => $quantity
                ];
            }

            // Trả về kết quả thành công
            header('Content-Type: application/json');
            echo json_encode([
                'success' => true,
                'message' => 'Đã thêm sản phẩm vào giỏ hàng',
                'cart_count' => count($_SESSION['cart'])
            ]);
            return;
        }

        // Nếu không phải POST request thì chuyển hướng về trang chủ
        $this->redirect('');
    }

    /**
     * Cập nhật giỏ hàng
     */
    public function update()
    {
        if ($_SERVER['REQUEST_METHOD'] == 'POST') {
            // Lấy dữ liệu
            $productId = isset($_POST['product_id']) ? (int) $_POST['product_id'] : 0;
            $quantity = isset($_POST['quantity']) ? (int) $_POST['quantity'] : 1;

            // Khởi tạo session nếu chưa có
            if (session_status() == PHP_SESSION_NONE) {
                session_start();
            }

            // Kiểm tra giỏ hàng và sản phẩm tồn tại
            if (isset($_SESSION['cart']) && isset($_SESSION['cart'][$productId])) {
                if ($quantity > 0) {
                    // Cập nhật số lượng
                    $_SESSION['cart'][$productId]['quantity'] = $quantity;
                } else {
                    // Xóa sản phẩm khỏi giỏ hàng nếu số lượng <= 0
                    unset($_SESSION['cart'][$productId]);
                }

                // Trả về kết quả thành công
                header('Content-Type: application/json');
                echo json_encode([
                    'success' => true,
                    'message' => 'Đã cập nhật giỏ hàng'
                ]);
                return;
            }

            // Trả về lỗi nếu không tìm thấy sản phẩm trong giỏ hàng
            header('Content-Type: application/json');
            echo json_encode(['success' => false, 'message' => 'Không tìm thấy sản phẩm trong giỏ hàng']);
            return;
        }

        // Nếu không phải POST request thì chuyển hướng về trang giỏ hàng
        $this->redirect('cart');
    }

    /**
     * Xóa sản phẩm khỏi giỏ hàng
     */
    public function remove($productId = null)
    {
        if (!$productId) {
            $this->redirect('cart');
            return;
        }

        // Khởi tạo session nếu chưa có
        if (session_status() == PHP_SESSION_NONE) {
            session_start();
        }

        // Xóa sản phẩm khỏi giỏ hàng
        if (isset($_SESSION['cart']) && isset($_SESSION['cart'][$productId])) {
            unset($_SESSION['cart'][$productId]);
        }

        // Chuyển hướng về trang giỏ hàng
        $this->redirect('cart');
    }

    /**
     * Xóa toàn bộ giỏ hàng
     */
    public function clear()
    {
        // Khởi tạo session nếu chưa có
        if (session_status() == PHP_SESSION_NONE) {
            session_start();
        }

        // Xóa giỏ hàng
        unset($_SESSION['cart']);

        // Chuyển hướng về trang giỏ hàng
        $this->redirect('cart');
    }

    /**
     * Chuyển đến trang thanh toán
     */
    public function checkout()
    {
        // Kiểm tra đã đăng nhập chưa
        if (session_status() == PHP_SESSION_NONE) {
            session_start();
        }

        if (!isset($_SESSION['user_id'])) {
            // Nếu chưa đăng nhập thì chuyển hướng đến trang đăng nhập
            $_SESSION['redirect_after_login'] = 'cart/checkout';
            $this->redirect('login');
            return;
        }

        // Kiểm tra giỏ hàng có sản phẩm không
        if (!isset($_SESSION['cart']) || empty($_SESSION['cart'])) {
            // Nếu giỏ hàng trống thì chuyển hướng về giỏ hàng
            $this->redirect('cart');
            return;
        }

        // Tải model
        $userModel = $this->model('UserModel');

        // Lấy thông tin người dùng
        $user = $userModel->getById($_SESSION['user_id']);

        $data = [
            'pageTitle' => 'Thanh toán - Website Thương Mại',
            'user' => $user
        ];

        $this->view('cart/checkout', $data);
    }
}
