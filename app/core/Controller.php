<?php
/**
 * Base Controller
 * Loads models and views
 */
class Controller
{
    /**
     * Load model
     * @param string $model Tên model cần load
     * @return object Model instance
     */
    public function model($model)
    {
        // Require model file
        require_once MODEL_PATH . '/' . $model . '.php';
        // Instantiate model
        return new $model();
    }

    /**
     * Load view
     * @param string $view Tên view cần load
     * @param array $data Data để truyền vào view
     * @return void
     */
    public function view($view, $data = [])
    {
        // Kiểm tra file view tồn tại
        $viewFile = VIEW_PATH . '/' . $view . '.php';

        if (file_exists($viewFile)) {
            // Đảm bảo rằng các biến được extracted trước khi nạp bất kỳ view nào
            extract($data);
            $viewPath = $viewFile;

            // Đảm bảo rằng chúng ta đã có helper trước khi render view
            if (!function_exists('asset')) {
                require_once ROOT_PATH . '/app/helpers/UrlHelper.php';
            }

            // Load view với master layout
            require_once VIEW_PATH . '/layouts/master.php';
        } else {
            die('View không tồn tại: ' . $viewFile);
        }
    }

    /**
     * Redirect to another page
     * @param string $url URL cần chuyển hướng đến
     * @return void
     */
    public function redirect($url)
    {
        header('Location: ' . BASE_URL . '/' . $url);
        exit;
    }

    /**
     * Load partial view
     * @param string $partial Tên partial view
     * @param array $data Data để truyền vào view
     * @return void
     */
    protected function partial($partial, $data = [])
    {
        extract($data);
        include VIEW_PATH . '/partials/' . $partial . '.php';
    }
}
