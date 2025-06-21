<?php
/**
 * Home Controller
 * Xử lý các tác vụ liên quan đến trang chủ
 */
class HomeController extends Controller
{
    /**
     * Phương thức mặc định - hiển thị trang chủ
     */
    public function index()
    {
        // Tải model sản phẩm
        $productModel = $this->model('ProductModel');

        // Lấy danh sách sản phẩm nổi bật
        $featuredProducts = $productModel->getFeaturedProducts(8);

        // Lấy danh sách sản phẩm mới nhất
        $newProducts = $productModel->getLatestProducts(8);

        // Tải model danh mục
        $categoryModel = $this->model('CategoryModel');

        // Lấy danh sách danh mục
        $categories = $categoryModel->getPopularCategories(4);

        // Load view với dữ liệu
        $data = [
            'pageTitle' => 'Trang chủ - Website Thương Mại',
            'featuredProducts' => $featuredProducts,
            'newProducts' => $newProducts,
            'categories' => $categories
        ];

        $this->view('home/index', $data);
    }
}
