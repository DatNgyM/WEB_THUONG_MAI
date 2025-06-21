<?php
/**
 * Error Controller
 * Xử lý các trang lỗi
 */
class ErrorController extends Controller
{
    /**
     * Hiển thị trang không tìm thấy (404)
     */
    public function notFound()
    {
        $data = [
            'pageTitle' => 'Không tìm thấy trang - Website Thương Mại'
        ];

        $this->view('error/404', $data);
    }

    /**
     * Hiển thị trang lỗi máy chủ (500)
     */
    public function serverError()
    {
        $data = [
            'pageTitle' => 'Lỗi máy chủ - Website Thương Mại'
        ];

        $this->view('error/500', $data);
    }

    /**
     * Hiển thị trang không có quyền truy cập (403)
     */
    public function forbidden()
    {
        $data = [
            'pageTitle' => 'Không có quyền truy cập - Website Thương Mại'
        ];

        $this->view('error/403', $data);
    }
}
