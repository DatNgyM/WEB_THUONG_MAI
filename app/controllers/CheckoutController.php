<?php
/**
 * CheckoutController
 * Xử lý trang thanh toán
 */
class CheckoutController extends Controller
{
    /**
     * Hiển thị trang thanh toán
     */
    public function index()
    {
        // Tạo dữ liệu giả lập cho giỏ hàng
        $cartItems = [
            [
                'id' => 1,
                'name' => 'iPhone 16 Pro Max',
                'price' => 32990000,
                'quantity' => 1,
                'image' => 'images/iphone-16-pro-max-titan.jpg'
            ],
            [
                'id' => 6,
                'name' => 'Tai nghe Bluetooth',
                'price' => 499000,
                'quantity' => 2,
                'image' => 'images/products/tai-nghe-bluetooth.jpg'
            ]
        ];

        // Tính tổng tiền
        $subtotal = 0;
        foreach ($cartItems as $item) {
            $subtotal += $item['price'] * $item['quantity'];
        }

        // Các chi phí khác
        $shipping = 30000;
        $discount = 0;
        $total = $subtotal + $shipping - $discount;

        $data = [
            'pageTitle' => 'Thanh toán',
            'cartItems' => $cartItems,
            'subtotal' => $subtotal,
            'shipping' => $shipping,
            'discount' => $discount,
            'total' => $total,
            'paymentMethods' => [
                ['id' => 'cod', 'name' => 'Thanh toán khi nhận hàng'],
                ['id' => 'bank', 'name' => 'Chuyển khoản ngân hàng'],
                ['id' => 'momo', 'name' => 'Ví điện tử MoMo'],
                ['id' => 'vnpay', 'name' => 'VNPay']
            ]
        ];

        $this->view('checkout/index', $data);
    }

    /**
     * Xử lý đặt hàng
     */
    public function placeOrder()
    {
        // Ở đây sẽ xử lý đặt hàng thực tế với database
        // Tạm thời chỉ chuyển hướng đến trang xác nhận đặt hàng
        $this->redirect('checkout/success');
    }

    /**
     * Hiển thị trang đặt hàng thành công
     */
    public function success()
    {
        $orderNumber = 'DH' . date('YmdHi') . rand(100, 999);

        $data = [
            'pageTitle' => 'Đặt hàng thành công',
            'orderNumber' => $orderNumber,
            'orderDate' => date('d/m/Y H:i:s')
        ];

        $this->view('checkout/success', $data);
    }
}
