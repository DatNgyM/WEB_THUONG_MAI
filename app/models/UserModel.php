<?php
/**
 * User Model
 * Xử lý dữ liệu người dùng
 */
class UserModel extends Model
{
    protected $table = 'users';
    protected $useMockData = true; // Sử dụng dữ liệu giả lập khi chưa có database
    protected $mockData = [];

    public function __construct()
    {
        parent::__construct();
        $this->mockData = $this->getMockData();
    }

    /**
     * Đăng ký tài khoản mới
     * @param array $data Dữ liệu đăng ký
     * @return int|bool ID người dùng mới hoặc false nếu thất bại
     */
    public function register($data)
    {
        if ($this->useMockData) {
            // Với dữ liệu giả lập, chỉ giả định đăng ký thành công
            return 999; // Trả về một ID giả định
        }

        // Mã hóa mật khẩu
        $data['password'] = password_hash($data['password'], PASSWORD_DEFAULT);

        // Thêm ngày tạo
        $data['created_at'] = date('Y-m-d H:i:s');

        return $this->insert($data);
    }

    /**
     * Cung cấp dữ liệu giả lập cho người dùng
     * @return array Dữ liệu người dùng mẫu
     */
    protected function getMockData()
    {
        return [
            (object) [
                'id' => 1,
                'name' => 'Admin User',
                'email' => 'admin@example.com',
                'password' => password_hash('admin123', PASSWORD_DEFAULT),
                'phone' => '0901234567',
                'address' => 'Hà Nội, Việt Nam',
                'role' => 'admin',
                'status' => 1,
                'created_at' => '2023-01-01 00:00:00'
            ],
            (object) [
                'id' => 2,
                'name' => 'User Test',
                'email' => 'user@example.com',
                'password' => password_hash('user123', PASSWORD_DEFAULT),
                'phone' => '0907654321',
                'address' => 'Hồ Chí Minh, Việt Nam',
                'role' => 'user',
                'status' => 1,
                'created_at' => '2023-01-15 00:00:00'
            ]
        ];
    }    /**
         * Đăng nhập
         * @param string $email Email người dùng
         * @param string $password Mật khẩu
         * @return object|bool Thông tin người dùng hoặc false nếu thất bại
         */
    public function login($email, $password)
    {
        if ($this->useMockData) {
            foreach ($this->mockData as $user) {
                if ($user->email == $email && password_verify($password, $user->password)) {
                    return $user;
                }
            }
            return false;
        }

        $this->db->query("SELECT * FROM {$this->table} WHERE email = :email AND status = 1");
        $this->db->bind(':email', $email);

        $user = $this->db->single();

        // Kiểm tra người dùng tồn tại
        if (!$user) {
            return false;
        }

        // Kiểm tra mật khẩu
        if (password_verify($password, $user->password)) {
            return $user;
        }

        return false;
    }

    /**
     * Kiểm tra email đã tồn tại chưa
     * @param string $email Email cần kiểm tra
     * @return bool true nếu email đã tồn tại, false nếu chưa
     */
    public function emailExists($email)
    {
        $this->db->query("SELECT id FROM {$this->table} WHERE email = :email");
        $this->db->bind(':email', $email);

        if ($this->db->rowCount() > 0) {
            return true;
        }

        return false;
    }

    /**
     * Cập nhật thông tin người dùng
     * @param array $data Dữ liệu cần cập nhật
     * @param int $id ID người dùng
     * @return bool Kết quả cập nhật
     */
    public function updateProfile($data, $id)
    {
        // Không cho phép cập nhật email qua phương thức này
        if (isset($data['email'])) {
            unset($data['email']);
        }

        // Không cho phép cập nhật mật khẩu qua phương thức này
        if (isset($data['password'])) {
            unset($data['password']);
        }

        return $this->update($data, $id);
    }

    /**
     * Đổi mật khẩu
     * @param int $userId ID người dùng
     * @param string $currentPassword Mật khẩu hiện tại
     * @param string $newPassword Mật khẩu mới
     * @return bool Kết quả đổi mật khẩu
     */
    public function changePassword($userId, $currentPassword, $newPassword)
    {
        // Lấy thông tin người dùng
        $user = $this->getById($userId);

        // Kiểm tra mật khẩu hiện tại
        if (!password_verify($currentPassword, $user->password)) {
            return false;
        }

        // Mã hóa mật khẩu mới
        $hashedPassword = password_hash($newPassword, PASSWORD_DEFAULT);

        // Cập nhật mật khẩu
        $this->db->query("UPDATE {$this->table} SET password = :password WHERE id = :id");
        $this->db->bind(':password', $hashedPassword);
        $this->db->bind(':id', $userId);

        return $this->db->execute();
    }
}
