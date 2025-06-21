<?php
/**
 * Product Model
 * Xử lý dữ liệu sản phẩm
 */
class ProductModel extends Model
{
    protected $table = 'products';
    protected $useMockData = true; // Sử dụng dữ liệu giả lập khi chưa có database
    protected $mockData = [];

    public function __construct()
    {
        parent::__construct();
        $this->mockData = $this->getMockData();
    }

    /**
     * Lấy danh sách sản phẩm với phân trang
     * @param int $limit Số sản phẩm mỗi trang
     * @param int $offset Vị trí bắt đầu
     * @return array Danh sách sản phẩm
     */
    public function getProducts($limit = 12, $offset = 0)
    {
        if ($this->useMockData) {
            return array_slice($this->mockData, $offset, $limit);
        }

        $sql = "SELECT p.*, c.name as category_name 
                FROM {$this->table} p 
                JOIN categories c ON p.category_id = c.id 
                WHERE p.status = 1 
                ORDER BY p.created_at DESC 
                LIMIT :limit OFFSET :offset";

        $this->db->query($sql);
        $this->db->bind(':limit', $limit, PDO::PARAM_INT);
        $this->db->bind(':offset', $offset, PDO::PARAM_INT);

        return $this->db->resultSet();
    }

    /**
     * Lấy tổng số sản phẩm
     * @return int Tổng số sản phẩm
     */
    public function getTotalProducts()
    {
        if ($this->useMockData) {
            return count($this->mockData);
        }

        $this->db->query("SELECT COUNT(*) as total FROM {$this->table} WHERE status = 1");
        $row = $this->db->single();
        return $row->total;
    }    /**
         * Lấy danh sách sản phẩm nổi bật
         * @param int $limit Số sản phẩm lấy ra
         * @return array Danh sách sản phẩm nổi bật
         */
    public function getFeaturedProducts($limit = 8)
    {
        if ($this->useMockData) {
            $featuredProducts = array_filter($this->mockData, function ($product) {
                return $product['is_featured'] == 1;
            });
            return array_slice($featuredProducts, 0, $limit);
        }

        $sql = "SELECT p.*, c.name as category_name 
                FROM {$this->table} p 
                JOIN categories c ON p.category_id = c.id 
                WHERE p.status = 1 AND p.is_featured = 1 
                ORDER BY p.created_at DESC 
                LIMIT :limit";

        $this->db->query($sql);
        $this->db->bind(':limit', $limit, PDO::PARAM_INT);

        return $this->db->resultSet();
    }    /**
         * Lấy danh sách sản phẩm mới nhất
         * @param int $limit Số sản phẩm lấy ra
         * @return array Danh sách sản phẩm mới nhất
         */
    public function getLatestProducts($limit = 8)
    {
        if ($this->useMockData) {
            // Sắp xếp mảng theo created_at giảm dần
            $products = $this->mockData;
            usort($products, function ($a, $b) {
                return strtotime($b['created_at']) - strtotime($a['created_at']);
            });
            return array_slice($products, 0, $limit);
        }

        $sql = "SELECT p.*, c.name as category_name 
                FROM {$this->table} p 
                JOIN categories c ON p.category_id = c.id 
                WHERE p.status = 1 
                ORDER BY p.created_at DESC 
                LIMIT :limit";

        $this->db->query($sql);
        $this->db->bind(':limit', $limit, PDO::PARAM_INT);

        return $this->db->resultSet();
    }    /**
         * Lấy danh sách sản phẩm theo danh mục
         * @param int $categoryId ID danh mục
         * @param int $limit Số sản phẩm mỗi trang
         * @param int $offset Vị trí bắt đầu
         * @return array Danh sách sản phẩm theo danh mục
         */
    public function getProductsByCategory($categoryId, $limit = 12, $offset = 0)
    {
        if ($this->useMockData) {
            $categoryProducts = array_filter($this->mockData, function ($product) use ($categoryId) {
                return $product['category_id'] == $categoryId;
            });
            return array_slice($categoryProducts, $offset, $limit);
        }

        $sql = "SELECT p.*, c.name as category_name 
                FROM {$this->table} p 
                JOIN categories c ON p.category_id = c.id 
                WHERE p.status = 1 AND p.category_id = :category_id 
                ORDER BY p.created_at DESC 
                LIMIT :limit OFFSET :offset";

        $this->db->query($sql);
        $this->db->bind(':category_id', $categoryId, PDO::PARAM_INT);
        $this->db->bind(':limit', $limit, PDO::PARAM_INT);
        $this->db->bind(':offset', $offset, PDO::PARAM_INT);

        return $this->db->resultSet();
    }    /**
         * Lấy tổng số sản phẩm theo danh mục
         * @param int $categoryId ID danh mục
         * @return int Tổng số sản phẩm
         */
    public function getTotalProductsByCategory($categoryId)
    {
        if ($this->useMockData) {
            $categoryProducts = array_filter($this->mockData, function ($product) use ($categoryId) {
                return $product['category_id'] == $categoryId;
            });
            return count($categoryProducts);
        }

        $this->db->query("SELECT COUNT(*) as total FROM {$this->table} WHERE status = 1 AND category_id = :category_id");
        $this->db->bind(':category_id', $categoryId, PDO::PARAM_INT);
        $row = $this->db->single();
        return $row->total;
    }    /**
         * Tìm kiếm sản phẩm
         * @param string $query Từ khóa tìm kiếm
         * @param int $limit Số sản phẩm mỗi trang
         * @param int $offset Vị trí bắt đầu
         * @return array Kết quả tìm kiếm
         */
    public function searchProducts($query, $limit = 12, $offset = 0)
    {
        if ($this->useMockData) {
            $query = strtolower($query);
            $searchResults = array_filter($this->mockData, function ($product) use ($query) {
                return (
                    strpos(strtolower($product['name']), $query) !== false ||
                    strpos(strtolower($product['description']), $query) !== false ||
                    strpos(strtolower($product['category_name']), $query) !== false ||
                    strpos(strtolower($product['brand']), $query) !== false
                );
            });
            return array_slice($searchResults, $offset, $limit);
        }

        $sql = "SELECT p.*, c.name as category_name 
                FROM {$this->table} p 
                JOIN categories c ON p.category_id = c.id 
                WHERE p.status = 1 AND (p.name LIKE :query OR p.description LIKE :query OR c.name LIKE :query) 
                ORDER BY p.created_at DESC 
                LIMIT :limit OFFSET :offset";

        $this->db->query($sql);
        $this->db->bind(':query', '%' . $query . '%');
        $this->db->bind(':limit', $limit, PDO::PARAM_INT);
        $this->db->bind(':offset', $offset, PDO::PARAM_INT);

        return $this->db->resultSet();
    }    /**
         * Lấy tổng số kết quả tìm kiếm
         * @param string $query Từ khóa tìm kiếm
         * @return int Tổng số kết quả
         */
    public function getTotalSearchResults($query)
    {
        if ($this->useMockData) {
            $query = strtolower($query);
            $searchResults = array_filter($this->mockData, function ($product) use ($query) {
                return (
                    strpos(strtolower($product['name']), $query) !== false ||
                    strpos(strtolower($product['description']), $query) !== false ||
                    strpos(strtolower($product['category_name']), $query) !== false ||
                    strpos(strtolower($product['brand']), $query) !== false
                );
            });
            return count($searchResults);
        }

        $sql = "SELECT COUNT(*) as total 
                FROM {$this->table} p 
                JOIN categories c ON p.category_id = c.id 
                WHERE p.status = 1 AND (p.name LIKE :query OR p.description LIKE :query OR c.name LIKE :query)";

        $this->db->query($sql);
        $this->db->bind(':query', '%' . $query . '%');
        $row = $this->db->single();
        return $row->total;
    }    /**
         * Lấy sản phẩm liên quan
         * @param int $categoryId ID danh mục
         * @param int $currentProductId ID sản phẩm hiện tại (để loại trừ)
         * @param int $limit Số sản phẩm lấy ra
         * @return array Danh sách sản phẩm liên quan
         */
    public function getRelatedProducts($categoryId, $currentProductId, $limit = 4)
    {
        if ($this->useMockData) {
            $relatedProducts = array_filter($this->mockData, function ($product) use ($categoryId, $currentProductId) {
                return $product['category_id'] == $categoryId && $product['id'] != $currentProductId;
            });

            // Trộn ngẫu nhiên các sản phẩm
            shuffle($relatedProducts);

            return array_slice($relatedProducts, 0, $limit);
        }

        $sql = "SELECT p.*, c.name as category_name 
                FROM {$this->table} p 
                JOIN categories c ON p.category_id = c.id 
                WHERE p.status = 1 AND p.category_id = :category_id AND p.id != :current_id 
                ORDER BY RAND() 
                LIMIT :limit";

        $this->db->query($sql);
        $this->db->bind(':category_id', $categoryId, PDO::PARAM_INT);
        $this->db->bind(':current_id', $currentProductId, PDO::PARAM_INT);
        $this->db->bind(':limit', $limit, PDO::PARAM_INT);

        return $this->db->resultSet();
    }

    /**
     * Lấy chi tiết sản phẩm theo ID
     * @param int $id ID sản phẩm
     * @return object|null Thông tin chi tiết sản phẩm
     */
    public function getProductById($id)
    {
        if ($this->useMockData) {
            foreach ($this->mockData as $product) {
                if ($product['id'] == $id) {
                    return (object) $product;
                }
            }
            return null;
        }

        $sql = "SELECT p.*, c.name as category_name 
                FROM {$this->table} p 
                JOIN categories c ON p.category_id = c.id 
                WHERE p.id = :id AND p.status = 1";

        $this->db->query($sql);
        $this->db->bind(':id', $id, PDO::PARAM_INT);

        return $this->db->single();
    }

    /**
     * Lấy chi tiết sản phẩm theo slug
     * @param string $slug Slug sản phẩm
     * @return object|null Thông tin chi tiết sản phẩm
     */
    public function getProductBySlug($slug)
    {
        if ($this->useMockData) {
            foreach ($this->mockData as $product) {
                if ($product['slug'] == $slug) {
                    return (object) $product;
                }
            }
            return null;
        }

        $sql = "SELECT p.*, c.name as category_name 
                FROM {$this->table} p 
                JOIN categories c ON p.category_id = c.id 
                WHERE p.slug = :slug AND p.status = 1";

        $this->db->query($sql);
        $this->db->bind(':slug', $slug);

        return $this->db->single();
    }

    /**
     * Cung cấp dữ liệu giả lập cho sản phẩm
     * @return array Dữ liệu sản phẩm mẫu
     */
    protected function getMockData()
    {
        return [
            [
                'id' => 1,
                'name' => 'iPhone 16 Pro Max',
                'slug' => 'iphone-16-pro-max',
                'description' => 'Điện thoại iPhone 16 Pro Max mới nhất với hiệu năng vượt trội và thiết kế đẳng cấp',
                'price' => 34990000,
                'sale_price' => 32990000,
                'image' => 'images/iphone-16-pro-max-titan.jpg',
                'images' => json_encode([
                    'images/iphone-16-pro-max-1-638639190782955686.jpg',
                    'images/iphone-16-pro-max-2-638639190801601764.jpg',
                    'images/iphone-16-pro-max-3-638639190825284815.jpg',
                    'images/iphone-16-pro-max-4-638639190848358132.jpg'
                ]),
                'quantity' => 50,
                'category_id' => 1,
                'category_name' => 'Điện thoại',
                'brand' => 'Apple',
                'is_featured' => 1,
                'status' => 1,
                'created_at' => '2023-09-15 10:00:00',
                'updated_at' => '2023-09-15 10:00:00'
            ],
            [
                'id' => 2,
                'name' => 'MacBook Pro 14 inch M4',
                'slug' => 'macbook-pro-14-inch-m4',
                'description' => 'MacBook Pro 14 inch với chip M4 mới nhất, hiệu năng vượt trội và màn hình Retina XDR',
                'price' => 49990000,
                'sale_price' => 47990000,
                'image' => 'images/macbook-pro-14-inch-m4-16gb-512gb-tgdd-den-1-638660152965882579-750x500.jpg',
                'images' => json_encode([
                    'images/macbook-pro-14-inch-m4-16gb-512gb-tgdd-den-1-638660152965882579-750x500.jpg'
                ]),
                'quantity' => 25,
                'category_id' => 2,
                'category_name' => 'Laptop',
                'brand' => 'Apple',
                'is_featured' => 1,
                'status' => 1,
                'created_at' => '2023-09-20 11:30:00',
                'updated_at' => '2023-09-20 11:30:00'
            ],
            [
                'id' => 3,
                'name' => 'Apple Watch Ultra 2 LTE 49mm',
                'slug' => 'apple-watch-ultra-2-lte-49mm',
                'description' => 'Đồng hồ thông minh Apple Watch Ultra 2 với khả năng kết nối LTE, thiết kế bền bỉ cho người dùng năng động',
                'price' => 22990000,
                'sale_price' => 21490000,
                'image' => 'images/apple-watch-ultra-2-lte-49mm-vien-titanium-day-milan-638641727211652156-750x500.jpg',
                'images' => json_encode([
                    'images/apple-watch-ultra-2-lte-49mm-vien-titanium-day-milan-638641727211652156-750x500.jpg'
                ]),
                'quantity' => 30,
                'category_id' => 3,
                'category_name' => 'Đồng hồ',
                'brand' => 'Apple',
                'is_featured' => 1,
                'status' => 1,
                'created_at' => '2023-10-01 09:15:00',
                'updated_at' => '2023-10-01 09:15:00'
            ],
            [
                'id' => 4,
                'name' => 'MSI Stealth 14 AI Studio A1VFG',
                'slug' => 'msi-stealth-14-ai-studio-a1vfg',
                'description' => 'Laptop gaming mỏng nhẹ MSI Stealth 14 AI Studio với GPU NVIDIA GeForce RTX 4070, màn hình 14" QHD+ 240Hz',
                'price' => 46990000,
                'sale_price' => 43990000,
                'image' => 'images/msi-stealth-14-ai-studio-a1vfg-ultra-7-085vn.jpg',
                'images' => json_encode([
                    'images/msi-stealth-14-ai-studio-a1vfg-ultra-7-085vn.jpg'
                ]),
                'quantity' => 15,
                'category_id' => 2,
                'category_name' => 'Laptop',
                'brand' => 'MSI',
                'is_featured' => 1,
                'status' => 1,
                'created_at' => '2023-10-05 14:20:00',
                'updated_at' => '2023-10-05 14:20:00'
            ],
            [
                'id' => 5,
                'name' => 'Đồng hồ Ferrari 0830772',
                'slug' => 'dong-ho-ferrari-0830772',
                'description' => 'Đồng hồ thương hiệu Ferrari, thiết kế thể thao, mặt số 44mm với dây đeo cao su chính hãng',
                'price' => 8500000,
                'sale_price' => 7650000,
                'image' => 'images/ferrari-0830772-nam1-700x467.jpg',
                'images' => json_encode([
                    'images/ferrari-0830772-nam1-700x467.jpg'
                ]),
                'quantity' => 20,
                'category_id' => 3,
                'category_name' => 'Đồng hồ',
                'brand' => 'Ferrari',
                'is_featured' => 1,
                'status' => 1,
                'created_at' => '2023-10-10 16:45:00',
                'updated_at' => '2023-10-10 16:45:00'
            ]
        ];
    }
}
