<?php
/**
 * AccountController
 * Xử lý trang tài khoản người dùng
 */
class AccountController extends Controller
{
    /**
     * Hiển thị trang thông tin tài khoản
     */
    public function index()
    {
        // Tạo dữ liệu giả lập cho người dùng đã đăng nhập
        $user = [
            'id' => 1,
            'name' => 'Nguyễn Văn A',
            'email' => 'nguyen.van.a@example.com',
            'phone' => '0123456789',
            'address' => '123 Đường ABC, Phường XYZ, Quận 1, TP Hồ Chí Minh',
            'avatar' => 'images/user.png',
            'created_at' => '2023-01-15'
        ];

        $orders = [
            [
                'id' => 'DH001',
                'date' => '2023-06-10',
                'total' => 1499000,
                'status' => 'Đã giao hàng',
                'items' => 2
            ],
            [
                'id' => 'DH002',
                'date' => '2023-05-25',
                'total' => 32990000,
                'status' => 'Đang giao hàng',
                'items' => 1
            ],
            [
                'id' => 'DH003',
                'date' => '2023-04-15',
                'total' => 7650000,
                'status' => 'Đã hủy',
                'items' => 3
            ]
        ];

        $data = [
            'pageTitle' => 'Tài khoản của tôi',
            'user' => $user,
            'orders' => $orders
        ];

        $this->view('account/index', $data);
    }

    /**
     * Hiển thị trang đơn hàng
     */
    public function orders()
    {
        // Tạo dữ liệu giả lập cho đơn hàng
        $orders = [
            [
                'id' => 'DH001',
                'date' => '2023-06-10',
                'total' => 1499000,
                'status' => 'Đã giao hàng',
                'items' => [
                    [
                        'product_id' => 6,
                        'name' => 'Tai nghe Bluetooth',
                        'price' => 499000,
                        'quantity' => 1,
                        'image' => 'images/products/tai-nghe-bluetooth.jpg'
                    ],
                    [
                        'product_id' => 7,
                        'name' => 'Sạc dự phòng',
                        'price' => 1000000,
                        'quantity' => 1,
                        'image' => 'images/products/sac-du-phong.jpg'
                    ]
                ]
            ],
            [
                'id' => 'DH002',
                'date' => '2023-05-25',
                'total' => 32990000,
                'status' => 'Đang giao hàng',
                'items' => [
                    [
                        'product_id' => 1,
                        'name' => 'iPhone 16 Pro Max',
                        'price' => 32990000,
                        'quantity' => 1,
                        'image' => 'images/iphone-16-pro-max-titan.jpg'
                    ]
                ]
            ]
        ];

        $data = [
            'pageTitle' => 'Đơn hàng của tôi',
            'orders' => $orders
        ];

        $this->view('account/orders', $data);
    }

    /**
     * Hiển thị trang chỉnh sửa thông tin
     */
    public function edit()
    {
        // Tạo dữ liệu giả lập cho người dùng đã đăng nhập
        $user = [
            'id' => 1,
            'name' => 'Nguyễn Văn A',
            'email' => 'nguyen.van.a@example.com',
            'phone' => '0123456789',
            'address' => '123 Đường ABC, Phường XYZ, Quận 1, TP Hồ Chí Minh',
            'avatar' => 'images/user.png'
        ];

        $data = [
            'pageTitle' => 'Cập nhật thông tin tài khoản',
            'user' => $user
        ];

        $this->view('account/edit', $data);
    }

    /**
     * Xử lý cập nhật thông tin tài khoản
     */
    public function update()
    {
        // Ở đây sẽ xử lý cập nhật thông tin tài khoản thực tế với database
        // Tạm thời chỉ chuyển hướng về trang tài khoản với thông báo thành công
        $this->redirect('account?update=success');
    }
}
