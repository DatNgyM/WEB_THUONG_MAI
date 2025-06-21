<?php
/**
 * AuthController
 * Xử lý đăng nhập, đăng ký và quản lý tài khoản
 */
class AuthController extends Controller
{
    /**
     * Hiển thị trang đăng nhập
     */
    public function login()
    {
        $data = [
            'pageTitle' => 'Đăng nhập',
            'errors' => []
        ];

        // Kiểm tra có thông báo từ form không
        if (isset($_GET['register']) && $_GET['register'] == 'success') {
            $data['message'] = 'Đăng ký thành công. Vui lòng đăng nhập để tiếp tục!';
            $data['messageType'] = 'success';
        }

        $this->view('auth/login', $data);
    }

    /**
     * Xử lý đăng nhập
     */
    public function processLogin()
    {
        // Ở đây sẽ xử lý đăng nhập thực tế với database
        // Tạm thời chỉ giả lập đăng nhập thành công
        if (isset($_POST['email']) && isset($_POST['password'])) {
            // Chuyển hướng đến trang chủ sau khi đăng nhập
            $this->redirect('');
        } else {
            // Chuyển hướng lại trang đăng nhập với thông báo lỗi
            $this->redirect('auth/login?error=invalid');
        }
    }

    /**
     * Hiển thị trang đăng ký
     */
    public function register()
    {
        $data = [
            'pageTitle' => 'Đăng ký',
            'errors' => []
        ];

        $this->view('auth/register', $data);
    }

    /**
     * Xử lý đăng ký
     */
    public function processRegister()
    {
        // Ở đây sẽ xử lý đăng ký thực tế với database
        // Tạm thời chỉ giả lập đăng ký thành công
        if (isset($_POST['name']) && isset($_POST['email']) && isset($_POST['password'])) {
            // Chuyển hướng đến trang đăng nhập với thông báo thành công
            $this->redirect('auth/login?register=success');
        } else {
            // Chuyển hướng lại trang đăng ký với thông báo lỗi
            $this->redirect('auth/register?error=invalid');
        }
    }

    /**
     * Xử lý đăng xuất
     */
    public function logout()
    {
        // Ở đây sẽ xử lý đăng xuất thực tế với session
        // Tạm thời chỉ chuyển hướng về trang chủ
        $this->redirect('');
    }
}
