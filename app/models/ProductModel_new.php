<?php
/**
 * Product Model
 * Xử lý dữ liệu sản phẩm từ MySQL Database
 */
class ProductModel extends Model
{
    protected $table = 'products';

    public function __construct()
    {
        parent::__construct();
    }

    /**
     * Lấy danh sách sản phẩm với phân trang
     * @param int $limit Số sản phẩm mỗi trang
     * @param int $offset Vị trí bắt đầu
     * @return array Danh sách sản phẩm
     */
    public function getProducts($limit = 12, $offset = 0)
    {
        $sql = "SELECT p.*, c.name as category_name, 
                       pi.image_path as primary_image
                FROM {$this->table} p 
                LEFT JOIN categories c ON p.category_id = c.id 
                LEFT JOIN product_images pi ON p.id = pi.product_id AND pi.is_primary = 1
                WHERE p.status = 1 
                ORDER BY p.created_at DESC 
                LIMIT :limit OFFSET :offset";

        $this->db->query($sql);
        $this->db->bind(':limit', $limit, PDO::PARAM_INT);
        $this->db->bind(':offset', $offset, PDO::PARAM_INT);

        return $this->db->resultSet();
    }    /**
     * Lấy tổng số sản phẩm
     * @return int Tổng số sản phẩm
     */
    public function getTotalProducts()
    {
        $sql = "SELECT COUNT(*) as count FROM {$this->table} WHERE status = 1";
        $this->db->query($sql);
        $result = $this->db->single();
        return (int) $result['count'];
    }

    /**
     * Lấy sản phẩm nổi bật
     * @param int $limit Số lượng sản phẩm
     * @return array Danh sách sản phẩm nổi bật
     */
    public function getFeaturedProducts($limit = 8)
    {
        $sql = "SELECT p.*, c.name as category_name,
                       pi.image_path as primary_image
                FROM {$this->table} p 
                LEFT JOIN categories c ON p.category_id = c.id 
                LEFT JOIN product_images pi ON p.id = pi.product_id AND pi.is_primary = 1
                WHERE p.status = 1 AND p.featured = 1 
                ORDER BY p.created_at DESC 
                LIMIT :limit";

        $this->db->query($sql);
        $this->db->bind(':limit', $limit, PDO::PARAM_INT);

        return $this->db->resultSet();
    }

    /**
     * Lấy sản phẩm mới nhất
     * @param int $limit Số lượng sản phẩm
     * @return array Danh sách sản phẩm mới nhất
     */
    public function getLatestProducts($limit = 8)
    {
        $sql = "SELECT p.*, c.name as category_name,
                       pi.image_path as primary_image
                FROM {$this->table} p 
                LEFT JOIN categories c ON p.category_id = c.id 
                LEFT JOIN product_images pi ON p.id = pi.product_id AND pi.is_primary = 1
                WHERE p.status = 1 
                ORDER BY p.created_at DESC 
                LIMIT :limit";

        $this->db->query($sql);
        $this->db->bind(':limit', $limit, PDO::PARAM_INT);

        return $this->db->resultSet();
    }

    /**
     * Lấy chi tiết sản phẩm theo ID
     * @param int $id ID sản phẩm
     * @return array|false Chi tiết sản phẩm
     */
    public function getProductById($id)
    {
        $sql = "SELECT p.*, c.name as category_name, c.slug as category_slug
                FROM {$this->table} p 
                LEFT JOIN categories c ON p.category_id = c.id 
                WHERE p.id = :id AND p.status = 1";

        $this->db->query($sql);
        $this->db->bind(':id', $id, PDO::PARAM_INT);

        return $this->db->single();
    }

    /**
     * Lấy chi tiết sản phẩm theo slug
     * @param string $slug Slug sản phẩm
     * @return array|false Chi tiết sản phẩm
     */
    public function getProductBySlug($slug)
    {
        $sql = "SELECT p.*, c.name as category_name, c.slug as category_slug
                FROM {$this->table} p 
                LEFT JOIN categories c ON p.category_id = c.id 
                WHERE p.slug = :slug AND p.status = 1";

        $this->db->query($sql);
        $this->db->bind(':slug', $slug);

        return $this->db->single();
    }

    /**
     * Lấy hình ảnh sản phẩm
     * @param int $productId ID sản phẩm
     * @return array Danh sách hình ảnh
     */
    public function getProductImages($productId)
    {
        $sql = "SELECT * FROM product_images 
                WHERE product_id = :product_id 
                ORDER BY sort_order ASC";

        $this->db->query($sql);
        $this->db->bind(':product_id', $productId, PDO::PARAM_INT);

        return $this->db->resultSet();
    }

    /**
     * Lấy sản phẩm theo danh mục
     * @param int $categoryId ID danh mục
     * @param int $limit Số lượng sản phẩm
     * @param int $offset Vị trí bắt đầu
     * @return array Danh sách sản phẩm
     */
    public function getProductsByCategory($categoryId, $limit = 12, $offset = 0)
    {
        $sql = "SELECT p.*, c.name as category_name,
                       pi.image_path as primary_image
                FROM {$this->table} p 
                LEFT JOIN categories c ON p.category_id = c.id 
                LEFT JOIN product_images pi ON p.id = pi.product_id AND pi.is_primary = 1
                WHERE p.category_id = :category_id AND p.status = 1 
                ORDER BY p.created_at DESC 
                LIMIT :limit OFFSET :offset";

        $this->db->query($sql);
        $this->db->bind(':category_id', $categoryId, PDO::PARAM_INT);
        $this->db->bind(':limit', $limit, PDO::PARAM_INT);
        $this->db->bind(':offset', $offset, PDO::PARAM_INT);

        return $this->db->resultSet();
    }

    /**
     * Tìm kiếm sản phẩm
     * @param string $keyword Từ khóa tìm kiếm
     * @param int $limit Số lượng sản phẩm
     * @param int $offset Vị trí bắt đầu
     * @return array Danh sách sản phẩm
     */
    public function searchProducts($keyword, $limit = 12, $offset = 0)
    {
        $sql = "SELECT p.*, c.name as category_name,
                       pi.image_path as primary_image
                FROM {$this->table} p 
                LEFT JOIN categories c ON p.category_id = c.id 
                LEFT JOIN product_images pi ON p.id = pi.product_id AND pi.is_primary = 1
                WHERE (p.name LIKE :keyword OR p.description LIKE :keyword) 
                      AND p.status = 1 
                ORDER BY p.created_at DESC 
                LIMIT :limit OFFSET :offset";

        $this->db->query($sql);
        $searchKeyword = '%' . $keyword . '%';
        $this->db->bind(':keyword', $searchKeyword);
        $this->db->bind(':limit', $limit, PDO::PARAM_INT);
        $this->db->bind(':offset', $offset, PDO::PARAM_INT);

        return $this->db->resultSet();
    }

    /**
     * Lấy sản phẩm liên quan
     * @param int $productId ID sản phẩm hiện tại
     * @param int $categoryId ID danh mục
     * @param int $limit Số lượng sản phẩm
     * @return array Danh sách sản phẩm liên quan
     */
    public function getRelatedProducts($productId, $categoryId, $limit = 4)
    {
        $sql = "SELECT p.*, c.name as category_name,
                       pi.image_path as primary_image
                FROM {$this->table} p 
                LEFT JOIN categories c ON p.category_id = c.id 
                LEFT JOIN product_images pi ON p.id = pi.product_id AND pi.is_primary = 1
                WHERE p.category_id = :category_id 
                      AND p.id != :product_id 
                      AND p.status = 1 
                ORDER BY RAND() 
                LIMIT :limit";

        $this->db->query($sql);
        $this->db->bind(':category_id', $categoryId, PDO::PARAM_INT);
        $this->db->bind(':product_id', $productId, PDO::PARAM_INT);
        $this->db->bind(':limit', $limit, PDO::PARAM_INT);

        return $this->db->resultSet();
    }

    /**
     * Cập nhật lượt xem sản phẩm
     * @param int $productId ID sản phẩm
     * @return bool
     */
    public function updateViews($productId)
    {
        $sql = "UPDATE {$this->table} SET views = views + 1 WHERE id = :id";
        
        $this->db->query($sql);
        $this->db->bind(':id', $productId, PDO::PARAM_INT);
        
        return $this->db->execute();
    }

    /**
     * Lấy sản phẩm được xem nhiều nhất
     * @param int $limit Số lượng sản phẩm
     * @return array Danh sách sản phẩm
     */
    public function getMostViewedProducts($limit = 8)
    {
        $sql = "SELECT p.*, c.name as category_name,
                       pi.image_path as primary_image
                FROM {$this->table} p 
                LEFT JOIN categories c ON p.category_id = c.id 
                LEFT JOIN product_images pi ON p.id = pi.product_id AND pi.is_primary = 1
                WHERE p.status = 1 
                ORDER BY p.views DESC 
                LIMIT :limit";

        $this->db->query($sql);
        $this->db->bind(':limit', $limit, PDO::PARAM_INT);

        return $this->db->resultSet();
    }

    /**
     * Lấy sản phẩm khuyến mãi
     * @param int $limit Số lượng sản phẩm
     * @return array Danh sách sản phẩm khuyến mãi
     */
    public function getSaleProducts($limit = 8)
    {
        $sql = "SELECT p.*, c.name as category_name,
                       pi.image_path as primary_image
                FROM {$this->table} p 
                LEFT JOIN categories c ON p.category_id = c.id 
                LEFT JOIN product_images pi ON p.id = pi.product_id AND pi.is_primary = 1
                WHERE p.sale_price IS NOT NULL 
                      AND p.sale_price < p.price 
                      AND p.status = 1 
                ORDER BY ((p.price - p.sale_price) / p.price) DESC 
                LIMIT :limit";

        $this->db->query($sql);
        $this->db->bind(':limit', $limit, PDO::PARAM_INT);

        return $this->db->resultSet();
    }

    /**
     * Kiểm tra tồn kho
     * @param int $productId ID sản phẩm
     * @param int $quantity Số lượng cần kiểm tra
     * @return bool
     */
    public function checkStock($productId, $quantity = 1)
    {
        $product = $this->getById($productId);
        
        if (!$product) {
            return false;
        }

        return $product['stock_quantity'] >= $quantity;
    }

    /**
     * Cập nhật tồn kho
     * @param int $productId ID sản phẩm
     * @param int $quantity Số lượng thay đổi (có thể âm)
     * @return bool
     */
    public function updateStock($productId, $quantity)
    {
        $sql = "UPDATE {$this->table} 
                SET stock_quantity = stock_quantity + :quantity 
                WHERE id = :id";

        $this->db->query($sql);
        $this->db->bind(':quantity', $quantity, PDO::PARAM_INT);
        $this->db->bind(':id', $productId, PDO::PARAM_INT);

        return $this->db->execute();
    }
}
