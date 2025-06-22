<?php
/**
 * Category Model
 * Xử lý dữ liệu danh mục từ MySQL Database
 */
class CategoryModel extends Model
{
    protected $table = 'categories';

    public function __construct()
    {
        parent::__construct();
    }

    /**
     * Lấy tất cả danh mục
     * @return array Danh sách danh mục
     */
    public function getAllCategories()
    {
        $sql = "SELECT * FROM {$this->table} 
                WHERE status = 1 
                ORDER BY sort_order ASC, name ASC";

        $this->db->query($sql);
        return $this->db->resultSet();
    }

    /**
     * Lấy danh mục phổ biến
     * @param int $limit Số lượng danh mục
     * @return array Danh sách danh mục phổ biến
     */
    public function getPopularCategories($limit = 4)
    {
        $sql = "SELECT c.*, COUNT(p.id) as product_count 
                FROM {$this->table} c 
                LEFT JOIN products p ON c.id = p.category_id AND p.status = 1 
                WHERE c.status = 1 
                GROUP BY c.id 
                ORDER BY product_count DESC, c.sort_order ASC 
                LIMIT :limit";

        $this->db->query($sql);
        $this->db->bind(':limit', $limit, PDO::PARAM_INT);

        return $this->db->resultSet();
    }

    /**
     * Lấy danh mục theo ID
     * @param int $id ID danh mục
     * @return array|false Chi tiết danh mục
     */
    public function getCategoryById($id)
    {
        $sql = "SELECT * FROM {$this->table} 
                WHERE id = :id AND status = 1";

        $this->db->query($sql);
        $this->db->bind(':id', $id, PDO::PARAM_INT);

        return $this->db->single();
    }

    /**
     * Lấy danh mục theo slug
     * @param string $slug Slug danh mục
     * @return array|false Chi tiết danh mục
     */
    public function getCategoryBySlug($slug)
    {
        $sql = "SELECT * FROM {$this->table} 
                WHERE slug = :slug AND status = 1";

        $this->db->query($sql);
        $this->db->bind(':slug', $slug);

        return $this->db->single();
    }

    /**
     * Lấy danh mục cha
     * @return array Danh sách danh mục cha
     */
    public function getParentCategories()
    {
        $sql = "SELECT * FROM {$this->table} 
                WHERE parent_id IS NULL AND status = 1 
                ORDER BY sort_order ASC, name ASC";

        $this->db->query($sql);
        return $this->db->resultSet();
    }

    /**
     * Lấy danh mục con
     * @param int $parentId ID danh mục cha
     * @return array Danh sách danh mục con
     */
    public function getChildCategories($parentId)
    {
        $sql = "SELECT * FROM {$this->table} 
                WHERE parent_id = :parent_id AND status = 1 
                ORDER BY sort_order ASC, name ASC";

        $this->db->query($sql);
        $this->db->bind(':parent_id', $parentId, PDO::PARAM_INT);

        return $this->db->resultSet();
    }

    /**
     * Lấy danh mục có cấu trúc cây
     * @return array Danh sách danh mục có cấu trúc cây
     */
    public function getCategoryTree()
    {
        $categories = $this->getAllCategories();
        $tree = [];

        // Tạo danh sách danh mục cha
        foreach ($categories as $category) {
            if ($category['parent_id'] === null) {
                $tree[$category['id']] = $category;
                $tree[$category['id']]['children'] = [];
            }
        }

        // Thêm danh mục con vào danh mục cha
        foreach ($categories as $category) {
            if ($category['parent_id'] !== null && isset($tree[$category['parent_id']])) {
                $tree[$category['parent_id']]['children'][] = $category;
            }
        }

        return array_values($tree);
    }

    /**
     * Đếm số sản phẩm trong danh mục
     * @param int $categoryId ID danh mục
     * @return int Số sản phẩm
     */
    public function getProductCount($categoryId)
    {
        $sql = "SELECT COUNT(*) as count FROM products 
                WHERE category_id = :category_id AND status = 1";

        $this->db->query($sql);
        $this->db->bind(':category_id', $categoryId, PDO::PARAM_INT);

        $result = $this->db->single();
        return (int) $result['count'];
    }

    /**
     * Lấy danh mục có sản phẩm
     * @return array Danh sách danh mục có sản phẩm
     */
    public function getCategoriesWithProducts()
    {
        $sql = "SELECT c.*, COUNT(p.id) as product_count 
                FROM {$this->table} c 
                INNER JOIN products p ON c.id = p.category_id AND p.status = 1 
                WHERE c.status = 1 
                GROUP BY c.id 
                HAVING product_count > 0 
                ORDER BY c.sort_order ASC, c.name ASC";

        $this->db->query($sql);
        return $this->db->resultSet();
    }

    /**
     * Tìm kiếm danh mục
     * @param string $keyword Từ khóa tìm kiếm
     * @return array Danh sách danh mục
     */
    public function searchCategories($keyword)
    {
        $sql = "SELECT * FROM {$this->table} 
                WHERE (name LIKE :keyword OR description LIKE :keyword) 
                      AND status = 1 
                ORDER BY name ASC";

        $this->db->query($sql);
        $searchKeyword = '%' . $keyword . '%';
        $this->db->bind(':keyword', $searchKeyword);

        return $this->db->resultSet();
    }

    /**
     * Lấy breadcrumb của danh mục
     * @param int $categoryId ID danh mục
     * @return array Breadcrumb
     */
    public function getCategoryBreadcrumb($categoryId)
    {
        $breadcrumb = [];
        $currentCategory = $this->getCategoryById($categoryId);

        while ($currentCategory) {
            array_unshift($breadcrumb, $currentCategory);
            
            if ($currentCategory['parent_id']) {
                $currentCategory = $this->getCategoryById($currentCategory['parent_id']);
            } else {
                break;
            }
        }

        return $breadcrumb;
    }
}
