<?php
/**
 * User Model
 * Xử lý dữ liệu người dùng từ MySQL Database
 */
class UserModel extends Model
{
    protected $table = 'users';

    public function __construct()
    {
        parent::__construct();
    }    /**
     * Đăng ký người dùng mới
     * @param array $data Dữ liệu người dùng
     * @return int|false ID người dùng mới hoặc false
     */
    public function register($data)
    {
        // Hash password
        $data['password'] = password_hash($data['password'], PASSWORD_DEFAULT);
        $data['created_at'] = date('Y-m-d H:i:s');
        
        return $this->insert($data);
    }

    /**
     * Đăng nhập người dùng
     * @param string $email Email
     * @param string $password Mật khẩu
     * @return array|false Thông tin người dùng hoặc false
     */
    public function login($email, $password)
    {
        $user = $this->getUserByEmail($email);
          if ($user && password_verify($password, $user['password'])) {
            // Cập nhật last_login
            $this->update(['last_login' => date('Y-m-d H:i:s')], $user['id']);
            
            // Không trả về password
            unset($user['password']);
            return $user;
        }
        
        return false;
    }

    /**
     * Lấy người dùng theo email
     * @param string $email Email
     * @return array|false Thông tin người dùng
     */
    public function getUserByEmail($email)
    {
        $sql = "SELECT * FROM {$this->table} WHERE email = :email AND status = 1";
        
        $this->db->query($sql);
        $this->db->bind(':email', $email);
        
        return $this->db->single();
    }

    /**
     * Lấy người dùng theo username
     * @param string $username Username
     * @return array|false Thông tin người dùng
     */
    public function getUserByUsername($username)
    {
        $sql = "SELECT * FROM {$this->table} WHERE username = :username AND status = 1";
        
        $this->db->query($sql);
        $this->db->bind(':username', $username);
        
        return $this->db->single();
    }

    /**
     * Kiểm tra email đã tồn tại
     * @param string $email Email
     * @param int $excludeId ID người dùng loại trừ (dùng khi update)
     * @return bool
     */
    public function emailExists($email, $excludeId = null)
    {
        $sql = "SELECT COUNT(*) as count FROM {$this->table} WHERE email = :email";
        
        if ($excludeId) {
            $sql .= " AND id != :exclude_id";
        }
        
        $this->db->query($sql);
        $this->db->bind(':email', $email);
        
        if ($excludeId) {
            $this->db->bind(':exclude_id', $excludeId, PDO::PARAM_INT);
        }
        
        $result = $this->db->single();
        return $result['count'] > 0;
    }

    /**
     * Kiểm tra username đã tồn tại
     * @param string $username Username
     * @param int $excludeId ID người dùng loại trừ
     * @return bool
     */
    public function usernameExists($username, $excludeId = null)
    {
        $sql = "SELECT COUNT(*) as count FROM {$this->table} WHERE username = :username";
        
        if ($excludeId) {
            $sql .= " AND id != :exclude_id";
        }
        
        $this->db->query($sql);
        $this->db->bind(':username', $username);
        
        if ($excludeId) {
            $this->db->bind(':exclude_id', $excludeId, PDO::PARAM_INT);
        }
        
        $result = $this->db->single();
        return $result['count'] > 0;
    }

    /**
     * Lấy thông tin người dùng (không có password)
     * @param int $id ID người dùng
     * @return array|false Thông tin người dùng
     */
    public function getUserProfile($id)
    {
        $sql = "SELECT id, username, email, first_name, last_name, phone, avatar, 
                       date_of_birth, gender, role, status, created_at, last_login
                FROM {$this->table} 
                WHERE id = :id AND status = 1";
        
        $this->db->query($sql);
        $this->db->bind(':id', $id, PDO::PARAM_INT);
        
        return $this->db->single();
    }

    /**
     * Cập nhật thông tin người dùng
     * @param int $id ID người dùng
     * @param array $data Dữ liệu cập nhật
     * @return bool
     */
    public function updateProfile($id, $data)
    {
        // Không cho phép cập nhật một số trường nhạy cảm
        $allowedFields = ['first_name', 'last_name', 'phone', 'avatar', 'date_of_birth', 'gender'];
        $updateData = [];
        
        foreach ($allowedFields as $field) {
            if (isset($data[$field])) {
                $updateData[$field] = $data[$field];
            }
        }
        
        if (empty($updateData)) {
            return false;
        }
          $updateData['updated_at'] = date('Y-m-d H:i:s');
        
        return $this->update($updateData, $id);
    }

    /**
     * Thay đổi mật khẩu
     * @param int $id ID người dùng
     * @param string $oldPassword Mật khẩu cũ
     * @param string $newPassword Mật khẩu mới
     * @return bool
     */
    public function changePassword($id, $oldPassword, $newPassword)
    {
        $user = $this->getById($id);
        
        if (!$user || !password_verify($oldPassword, $user['password'])) {
            return false;
        }
        
        $hashedPassword = password_hash($newPassword, PASSWORD_DEFAULT);
        
        return $this->update($id, [
            'password' => $hashedPassword,
            'updated_at' => date('Y-m-d H:i:s')
        ]);
    }

    /**
     * Reset mật khẩu (admin function)
     * @param int $id ID người dùng
     * @param string $newPassword Mật khẩu mới
     * @return bool
     */
    public function resetPassword($id, $newPassword)
    {
        $hashedPassword = password_hash($newPassword, PASSWORD_DEFAULT);
        
        return $this->update($id, [
            'password' => $hashedPassword,
            'updated_at' => date('Y-m-d H:i:s')
        ]);
    }

    /**
     * Lấy địa chỉ người dùng
     * @param int $userId ID người dùng
     * @param string $type Loại địa chỉ (billing/shipping)
     * @return array Danh sách địa chỉ
     */
    public function getUserAddresses($userId, $type = null)
    {
        $sql = "SELECT * FROM user_addresses WHERE user_id = :user_id";
        
        if ($type) {
            $sql .= " AND type = :type";
        }
        
        $sql .= " ORDER BY is_default DESC, created_at DESC";
        
        $this->db->query($sql);
        $this->db->bind(':user_id', $userId, PDO::PARAM_INT);
        
        if ($type) {
            $this->db->bind(':type', $type);
        }
        
        return $this->db->resultSet();
    }

    /**
     * Lấy địa chỉ mặc định
     * @param int $userId ID người dùng
     * @param string $type Loại địa chỉ
     * @return array|false Địa chỉ mặc định
     */
    public function getDefaultAddress($userId, $type = 'shipping')
    {
        $sql = "SELECT * FROM user_addresses 
                WHERE user_id = :user_id AND type = :type AND is_default = 1 
                LIMIT 1";
        
        $this->db->query($sql);
        $this->db->bind(':user_id', $userId, PDO::PARAM_INT);
        $this->db->bind(':type', $type);
        
        return $this->db->single();
    }

    /**
     * Thêm địa chỉ mới
     * @param array $data Dữ liệu địa chỉ
     * @return int|false ID địa chỉ mới
     */
    public function addAddress($data)
    {
        // Nếu là địa chỉ mặc định, bỏ mặc định các địa chỉ khác
        if (isset($data['is_default']) && $data['is_default'] == 1) {
            $this->removeDefaultAddress($data['user_id'], $data['type']);
        }
        
        $sql = "INSERT INTO user_addresses (user_id, type, first_name, last_name, company, 
                                          address_line_1, address_line_2, city, state, 
                                          postal_code, country, phone, is_default, created_at) 
                VALUES (:user_id, :type, :first_name, :last_name, :company, 
                        :address_line_1, :address_line_2, :city, :state, 
                        :postal_code, :country, :phone, :is_default, :created_at)";
        
        $this->db->query($sql);
        
        foreach ($data as $key => $value) {
            $this->db->bind(':' . $key, $value);
        }
        $this->db->bind(':created_at', date('Y-m-d H:i:s'));
        
        if ($this->db->execute()) {
            return $this->db->lastInsertId();
        }
        
        return false;
    }

    /**
     * Bỏ địa chỉ mặc định
     * @param int $userId ID người dùng
     * @param string $type Loại địa chỉ
     * @return bool
     */
    private function removeDefaultAddress($userId, $type)
    {
        $sql = "UPDATE user_addresses SET is_default = 0 
                WHERE user_id = :user_id AND type = :type";
        
        $this->db->query($sql);
        $this->db->bind(':user_id', $userId, PDO::PARAM_INT);
        $this->db->bind(':type', $type);
        
        return $this->db->execute();
    }

    /**
     * Lấy danh sách khách hàng (admin function)
     * @param int $limit Số lượng
     * @param int $offset Vị trí bắt đầu
     * @return array Danh sách khách hàng
     */
    public function getCustomers($limit = 20, $offset = 0)
    {
        $sql = "SELECT id, username, email, first_name, last_name, phone, role, status, 
                       created_at, last_login
                FROM {$this->table} 
                ORDER BY created_at DESC 
                LIMIT :limit OFFSET :offset";
        
        $this->db->query($sql);
        $this->db->bind(':limit', $limit, PDO::PARAM_INT);
        $this->db->bind(':offset', $offset, PDO::PARAM_INT);
        
        return $this->db->resultSet();
    }

    /**
     * Đếm tổng số người dùng
     * @return int
     */
    public function getTotalUsers()
    {
        $sql = "SELECT COUNT(*) as count FROM {$this->table}";
        $this->db->query($sql);
        $result = $this->db->single();
        return (int) $result['count'];
    }
}
