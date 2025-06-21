<?php
/**
 * ContactController
 * Xử lý trang liên hệ
 */
class ContactController extends Controller
{
    /**
     * Hiển thị trang liên hệ
     */
    public function index()
    {
        $data = [
            'pageTitle' => 'Liên hệ',
            'contactInfo' => [
                'address' => '123 Đường ABC, Quận XYZ, TP Hồ Chí Minh',
                'phone' => '0123456789',
                'email' => 'info@example.com',
                'workingHours' => 'Thứ 2 - Thứ 6: 8:00 - 17:30'
            ]
        ];

        // Kiểm tra có thông báo từ form không
        if (isset($_GET['status']) && $_GET['status'] == 'success') {
            $data['message'] = 'Cảm ơn bạn đã gửi thông tin liên hệ. Chúng tôi sẽ phản hồi sớm nhất có thể!';
            $data['messageType'] = 'success';
        }

        $this->view('contact/index', $data);
    }

    /**
     * Xử lý form liên hệ
     */
    public function send()
    {
        // Xử lý form liên hệ (sẽ thêm sau khi có database)
        // Tạm thời chỉ chuyển hướng về trang liên hệ với thông báo
        $this->redirect('contact?status=success');
    }
}
