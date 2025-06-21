<?php
/**
 * AboutController
 * Xử lý trang giới thiệu
 */
class AboutController extends Controller
{
    /**
     * Hiển thị trang giới thiệu
     */
    public function index()
    {
        $data = [
            'pageTitle' => 'Giới thiệu',
            'companyInfo' => [
                'name' => 'Website Thương Mại',
                'founded' => '2010',
                'mission' => 'Cung cấp sản phẩm chất lượng cao với giá cả hợp lý',
                'vision' => 'Trở thành công ty thương mại điện tử hàng đầu Việt Nam',
                'address' => '123 Đường ABC, Quận XYZ, TP Hồ Chí Minh',
                'phone' => '0123456789',
                'email' => 'info@example.com'
            ],
            'teamMembers' => [
                [
                    'name' => 'Nguyễn Văn A',
                    'position' => 'Giám đốc',
                    'image' => 'images/team/member1.jpg'
                ],
                [
                    'name' => 'Trần Thị B',
                    'position' => 'Quản lý kinh doanh',
                    'image' => 'images/team/member2.jpg'
                ],
                [
                    'name' => 'Lê Văn C',
                    'position' => 'Trưởng phòng kỹ thuật',
                    'image' => 'images/team/member3.jpg'
                ],
                [
                    'name' => 'Phạm Thị D',
                    'position' => 'Trưởng phòng marketing',
                    'image' => 'images/team/member4.jpg'
                ]
            ]
        ];

        $this->view('about/index', $data);
    }
}
