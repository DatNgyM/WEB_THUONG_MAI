<?php
/**
 * Category Model
 * Xử lý dữ liệu danh mục
 */
class CategoryModel extends Model
{
    protected $table = 'categories';
    protected $useMockData = true; // Sử dụng dữ liệu giả lập khi chưa có database
    protected $mockData = [];

    public function __construct()
    {
        parent::__construct();
        $this->mockData = $this->getMockData();
    }

    /**
     * Lấy tất cả danh mục
     * @return array Danh sách danh mục
     */
    public function getAllCategories()
    {
        if ($this->useMockData) {
            return $this->mockData;
        }

        $sql = "SELECT * FROM {$this->table} WHERE status = 1 ORDER BY position ASC";
        $this->db->query($sql);
        return $this->db->resultSet();
    }

    /**
     * Cung cấp dữ liệu giả lập cho danh mục sản phẩm
     * @return array Dữ liệu danh mục mẫu
     */
    protected function getMockData()
    {
        return [
            (object) [
                'id' => 1,
                'name' => 'Điện thoại',
                'slug' => 'dien-thoai',
                'description' => 'Các mẫu điện thoại thông minh mới nhất',
                'image' => 'images/categories/dien-thoai.jpg',
                'position' => 1,
                'status' => 1
            ],
            (object) [
                'id' => 2,
                'name' => 'Laptop',
                'slug' => 'laptop',
                'description' => 'Laptop, máy tính xách tay chính hãng',
                'image' => 'images/categories/laptop.jpg',
                'position' => 2,
                'status' => 1
            ],
            (object) [
                'id' => 3,
                'name' => 'Đồng hồ',
                'slug' => 'dong-ho',
                'description' => 'Đồng hồ thông minh, đồng hồ thời trang cao cấp',
                'image' => 'images/categories/dong-ho.jpg',
                'position' => 3,
                'status' => 1
            ],
            (object) [
                'id' => 4,
                'name' => 'Tablet',
                'slug' => 'tablet',
                'description' => 'Máy tính bảng các loại',
                'image' => 'images/categories/tablet.jpg',
                'position' => 4,
                'status' => 1
            ],
            (object) [
                'id' => 5,
                'name' => 'Phụ kiện',
                'slug' => 'phu-kien',
                'description' => 'Phụ kiện công nghệ chính hãng',
                'image' => 'images/categories/phu-kien.jpg',
                'position' => 5,
                'status' => 1
            ]
        ];
    }    /**
         * Lấy danh mục phổ biến
         * @param int $limit Số danh mục lấy ra
         * @return array Danh sách danh mục phổ biến
         */
    public function getPopularCategories($limit = 4)
    {
        if ($this->useMockData) {
            // Trong dữ liệu giả lập, chỉ đơn giản lấy 4 danh mục đầu tiên
            return array_slice($this->mockData, 0, $limit);
        }

        $sql = "SELECT c.*, COUNT(p.id) as product_count 
                FROM {$this->table} c 
                LEFT JOIN products p ON c.id = p.category_id AND p.status = 1 
                WHERE c.status = 1 
                GROUP BY c.id 
                ORDER BY product_count DESC 
                LIMIT :limit";

        $this->db->query($sql);
        $this->db->bind(':limit', $limit, PDO::PARAM_INT);

        return $this->db->resultSet();
    }

    /**
     * Lấy thông tin danh mục theo ID
     * @param int $id ID danh mục
     * @return object|null Thông tin danh mục
     */
    public function getCategoryById($id)
    {
        if ($this->useMockData) {
            foreach ($this->mockData as $category) {
                if ($category->id == $id) {
                    return $category;
                }
            }
            return null;
        }

        $sql = "SELECT * FROM {$this->table} WHERE id = :id AND status = 1";
        $this->db->query($sql);
        $this->db->bind(':id', $id, PDO::PARAM_INT);
        return $this->db->single();
    }

    /**
     * Lấy thông tin danh mục theo slug
     * @param string $slug Slug của danh mục
     * @return object|null Thông tin danh mục
     */
    public function getCategoryBySlug($slug)
    {
        if ($this->useMockData) {
            foreach ($this->mockData as $category) {
                if ($category->slug == $slug) {
                    return $category;
                }
            }
            return null;
        }

        $sql = "SELECT * FROM {$this->table} WHERE slug = :slug AND status = 1";
        $this->db->query($sql);
        $this->db->bind(':slug', $slug);
        return $this->db->single();
    }
}
