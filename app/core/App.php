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
        $url = $this->parseUrl();

        // Special routing rules
        if (empty($url[0])) {
            // Root URL - serve index.html
            $this->serveStaticPage('index.html');
            return;
        }

        // Handle special routes
        switch ($url[0]) {
            case 'login':
                $this->serveStaticPage('login.html');
                return;
            case 'product':
                if (isset($url[1])) {
                    $this->controller = 'ProductController';
                    $this->method = 'show';
                    $this->params = [$url[1]];
                } else {
                    $this->serveStaticPage('product.html');
                    return;
                }
                break;
            case 'cart':
                $this->serveStaticPage('cart.html');
                return;
            case 'checkout':
                $this->serveStaticPage('checkout.html');
                return;
            case 'account':
                $this->serveStaticPage('accountsetting.html');
                return;
            case 'admin':
                if (isset($url[1])) {
                    $this->serveAdminPage($url[1]);
                } else {
                    $this->serveAdminPage('index.html');
                }
                return;
            case 'api':
                // API requests should be handled by api.php
                header('Location: ' . BASE_URL . '/api.php?' . $_SERVER['QUERY_STRING']);
                exit;
            default:
                // Try to find controller
                $controllerFile = CONTROLLER_PATH . '/' . ucfirst($url[0]) . 'Controller.php';
                if (file_exists($controllerFile)) {
                    $this->controller = ucfirst($url[0]) . 'Controller';
                    unset($url[0]);
                } else {
                    // Default to 404
                    $this->notFound();
                    return;
                }
                break;
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

    /**
     * Serve static HTML page
     */
    private function serveStaticPage($filename)
    {
        $filePath = ROOT_PATH . '/Page/' . $filename;

        if (file_exists($filePath)) {
            header('Content-Type: text/html; charset=UTF-8');
            readfile($filePath);
            exit;
        } else {
            $this->notFound();
        }
    }

    /**
     * Serve admin page
     */
    private function serveAdminPage($filename)
    {
        $filePath = ROOT_PATH . '/Page/admin/' . $filename;

        if (file_exists($filePath)) {
            header('Content-Type: text/html; charset=UTF-8');
            readfile($filePath);
            exit;
        } else {
            $this->notFound();
        }
    }

    /**
     * Handle 404 not found
     */
    private function notFound()
    {
        http_response_code(404);
        echo '<h1>404 - Page Not Found</h1>';
        echo '<p>The requested page could not be found.</p>';
        echo '<a href="' . BASE_URL . '">Go to Home</a>';
        exit;
    }
}
