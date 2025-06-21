<?php
/**
 * App Core Class
 * Tạo URL & loads core controller
 * URL Format: /controller/method/params
 */
class App
{
    protected $controller = 'HomeController';
    protected $method = 'index';
    protected $params = [];
    public function __construct()
    {
        // Debug URL
        /*
        if (isset($_GET['url'])) {
            echo '<div style="background: #f8f9fa; padding: 10px; margin: 10px; border: 1px solid #ddd;">';
            echo '<h4>Debug URL:</h4>';
            echo 'Raw URL: ' . $_GET['url'] . '<br>';
            echo 'Parsed URL: <pre>';
            print_r(explode('/', filter_var(rtrim($_GET['url'], '/'), FILTER_SANITIZE_URL)));
            echo '</pre>';
            echo '</div>';
        }
        */

        $url = $this->parseUrl();        // Lấy controller
        if (isset($url[0]) && !empty($url[0])) {
            $controllerFile = CONTROLLER_PATH . '/' . ucfirst($url[0]) . 'Controller.php';
            if (file_exists($controllerFile)) {
                $this->controller = ucfirst($url[0]) . 'Controller';
                unset($url[0]);
            } else {
                // Debug - ghi log controller không tồn tại
                $log_file = ROOT_PATH . '/url_debug.log';
                $log_message = date('Y-m-d H:i:s') . ' - Controller not found: ' . $controllerFile . "\n";
                file_put_contents($log_file, $log_message, FILE_APPEND);
            }
        }

        // Require controller
        $controllerPath = CONTROLLER_PATH . '/' . $this->controller . '.php';
        if (file_exists($controllerPath)) {
            require_once $controllerPath;
        } else {
            // Debug - controller file không tồn tại
            $log_file = ROOT_PATH . '/url_debug.log';
            $log_message = date('Y-m-d H:i:s') . ' - Controller file not found: ' . $controllerPath . "\n";
            file_put_contents($log_file, $log_message, FILE_APPEND);

            // Chuyển hướng đến trang lỗi
            header('Location: ' . BASE_URL . '/error/notfound');
            exit;
        }

        // Khởi tạo controller
        $this->controller = new $this->controller;

        // Lấy method
        if (isset($url[1])) {
            if (method_exists($this->controller, $url[1])) {
                $this->method = $url[1];
                unset($url[1]);
            }
        }

        // Lấy params
        $this->params = $url ? array_values($url) : [];

        // Gọi callback với danh sách tham số
        call_user_func_array([$this->controller, $this->method], $this->params);
    }    /**
         * Parse URL và trả về các phần trong mảng
         */
    public function parseUrl()
    {
        if (isset($_GET['url'])) {
            // Lọc và cắt URL
            $url = filter_var(rtrim($_GET['url'], '/'), FILTER_SANITIZE_URL);
            $parts = explode('/', $url);

            // Debug - ghi log URL
            $log_file = ROOT_PATH . '/url_debug.log';
            $log_message = date('Y-m-d H:i:s') . ' - URL: ' . $url . ' - Parts: ' . print_r($parts, true) . "\n";
            file_put_contents($log_file, $log_message, FILE_APPEND);

            return $parts;
        }
        return [];
    }
}
