<?php
/**
 * Product Controller
 * Xử lý các tác vụ liên quan đến sản phẩm
 */
class ProductController extends Controller
{
    /**
     * Hiển thị danh sách sản phẩm
     */
    public function index()
    {
        // Lấy trang hiện tại
        $page = isset($_GET['page']) ? (int) $_GET['page'] : 1;
        $limit = 12;
        $offset = ($page - 1) * $limit;

        // Tải model
        $productModel = $this->model('ProductModel');
        $categoryModel = $this->model('CategoryModel');

        // Lấy dữ liệu
        $products = $productModel->getProducts($limit, $offset);
        $totalProducts = $productModel->getTotalProducts();
        $categories = $categoryModel->getAllCategories();

        // Tính toán phân trang
        $totalPages = ceil($totalProducts / $limit);

        // Load view
        $data = [
            'pageTitle' => 'Sản phẩm - Website Thương Mại',
            'products' => $products,
            'categories' => $categories,
            'currentPage' => $page,
            'totalPages' => $totalPages
        ];

        $this->view('product/index', $data);
    }

    /**
     * Hiển thị chi tiết sản phẩm
     */
    public function detail($id)
    {
        // Tải model
        $productModel = $this->model('ProductModel');

        // Lấy chi tiết sản phẩm
        $product = $productModel->getById($id);

        // Nếu không tìm thấy sản phẩm
        if (!$product) {
            $this->redirect('error/notfound');
            return;
        }

        // Lấy sản phẩm liên quan
        $relatedProducts = $productModel->getRelatedProducts($product->category_id, $id, 4);

        // JavaScript để xử lý hình ảnh sản phẩm
        $extraJS = '<script src="' . BASE_URL . '/js/productDetails.js"></script>';

        // Load view
        $data = [
            'pageTitle' => $product->name . ' - Website Thương Mại',
            'product' => $product,
            'relatedProducts' => $relatedProducts,
            'extraJS' => $extraJS
        ];

        $this->view('product/detail', $data);
    }

    /**
     * Hiển thị sản phẩm theo danh mục
     */
    public function category($categoryId)
    {
        // Lấy trang hiện tại
        $page = isset($_GET['page']) ? (int) $_GET['page'] : 1;
        $limit = 12;
        $offset = ($page - 1) * $limit;

        // Tải model
        $productModel = $this->model('ProductModel');
        $categoryModel = $this->model('CategoryModel');

        // Lấy thông tin danh mục
        $category = $categoryModel->getById($categoryId);

        // Nếu không tìm thấy danh mục
        if (!$category) {
            $this->redirect('error/notfound');
            return;
        }

        // Lấy sản phẩm theo danh mục
        $products = $productModel->getProductsByCategory($categoryId, $limit, $offset);
        $totalProducts = $productModel->getTotalProductsByCategory($categoryId);

        // Lấy tất cả danh mục
        $categories = $categoryModel->getAllCategories();

        // Tính toán phân trang
        $totalPages = ceil($totalProducts / $limit);

        // Load view
        $data = [
            'pageTitle' => $category->name . ' - Website Thương Mại',
            'category' => $category,
            'products' => $products,
            'categories' => $categories,
            'currentPage' => $page,
            'totalPages' => $totalPages
        ];

        $this->view('product/category', $data);
    }

    /**
     * Tìm kiếm sản phẩm
     */
    public function search()
    {
        // Lấy từ khóa tìm kiếm
        $query = isset($_GET['query']) ? $_GET['query'] : '';

        // Lấy trang hiện tại
        $page = isset($_GET['page']) ? (int) $_GET['page'] : 1;
        $limit = 12;
        $offset = ($page - 1) * $limit;

        // Tải model
        $productModel = $this->model('ProductModel');
        $categoryModel = $this->model('CategoryModel');

        // Tìm kiếm sản phẩm
        $products = $productModel->searchProducts($query, $limit, $offset);
        $totalProducts = $productModel->getTotalSearchResults($query);

        // Lấy danh sách danh mục
        $categories = $categoryModel->getAllCategories();

        // Tính toán phân trang
        $totalPages = ceil($totalProducts / $limit);

        // Load view
        $data = [
            'pageTitle' => 'Kết quả tìm kiếm: ' . $query . ' - Website Thương Mại',
            'query' => $query,
            'products' => $products,
            'categories' => $categories,
            'currentPage' => $page,
            'totalPages' => $totalPages,
            'totalResults' => $totalProducts
        ];

        $this->view('product/search', $data);
    }
}
