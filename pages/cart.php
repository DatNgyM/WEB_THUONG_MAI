<?php
$page_title = "Giỏ hàng";

// Handle cart actions
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $action = $_POST['action'] ?? '';
    $response = ['success' => false, 'message' => ''];
    
    try {
        switch ($action) {
            case 'add_to_cart':
                $product_id = intval($_POST['product_id'] ?? 0);
                $quantity = intval($_POST['quantity'] ?? 1);
                
                if ($product_id > 0 && $quantity > 0) {
                    if (!isset($_SESSION['cart'])) {
                        $_SESSION['cart'] = [];
                    }
                    
                    // Add to existing quantity or set new quantity
                    if (isset($_SESSION['cart'][$product_id])) {
                        $_SESSION['cart'][$product_id] += $quantity;
                    } else {
                        $_SESSION['cart'][$product_id] = $quantity;
                    }
                    
                    $response['success'] = true;
                    $response['message'] = 'Đã thêm sản phẩm vào giỏ hàng';
                    $response['cart_count'] = array_sum($_SESSION['cart']);
                } else {
                    $response['message'] = 'Thông tin sản phẩm không hợp lệ';
                }
                break;
                
            case 'update_cart':
                $product_id = intval($_POST['product_id'] ?? 0);
                $quantity = intval($_POST['quantity'] ?? 1);
                
                if ($product_id > 0 && $quantity > 0) {
                    if (!isset($_SESSION['cart'])) {
                        $_SESSION['cart'] = [];
                    }
                    $_SESSION['cart'][$product_id] = $quantity;
                    
                    $response['success'] = true;
                    $response['message'] = 'Đã cập nhật giỏ hàng';
                    $response['cart_count'] = array_sum($_SESSION['cart']);
                } else {
                    $response['message'] = 'Thông tin sản phẩm không hợp lệ';
                }
                break;
                
            case 'remove_from_cart':
                $product_id = intval($_POST['product_id'] ?? 0);
                if ($product_id > 0 && isset($_SESSION['cart'][$product_id])) {
                    unset($_SESSION['cart'][$product_id]);
                    
                    $response['success'] = true;
                    $response['message'] = 'Đã xóa sản phẩm khỏi giỏ hàng';
                    $response['cart_count'] = array_sum($_SESSION['cart']);
                } else {
                    $response['message'] = 'Không tìm thấy sản phẩm trong giỏ hàng';
                }
                break;
                
            case 'update_quantity':
                $product_id = intval($_POST['product_id'] ?? 0);
                $quantity = intval($_POST['quantity'] ?? 1);
                
                if ($product_id > 0 && $quantity > 0) {
                    if (!isset($_SESSION['cart'])) {
                        $_SESSION['cart'] = [];
                    }
                    $_SESSION['cart'][$product_id] = $quantity;
                    
                    $response['success'] = true;
                    $response['cart_count'] = array_sum($_SESSION['cart']);
                }
                break;
                
            case 'remove_item':
                $product_id = intval($_POST['product_id'] ?? 0);
                if ($product_id > 0 && isset($_SESSION['cart'][$product_id])) {
                    unset($_SESSION['cart'][$product_id]);
                    
                    $response['success'] = true;
                    $response['cart_count'] = array_sum($_SESSION['cart']);
                }
                break;
                
            case 'clear_cart':
                $_SESSION['cart'] = [];
                $response['success'] = true;
                $response['message'] = 'Đã xóa toàn bộ giỏ hàng';
                $response['cart_count'] = 0;
                break;
                
            default:
                $response['message'] = 'Hành động không hợp lệ';
        }
    } catch (Exception $e) {
        $response['message'] = 'Có lỗi xảy ra: ' . $e->getMessage();
        error_log("Cart error: " . $e->getMessage());
    }
    
    // Return JSON for AJAX requests
    if (isset($_SERVER['HTTP_ACCEPT']) && strpos($_SERVER['HTTP_ACCEPT'], 'application/json') !== false) {
        header('Content-Type: application/json');
        echo json_encode($response);
        exit;
    }
    
    // Redirect to avoid form resubmission for regular form submissions
    if ($response['success']) {
        header('Location: index.php?page=cart');
        exit;
    }
}

// Get cart items
$cart_items = [];
$cart_total = 0;
$cart_count = 0;

if (!empty($_SESSION['cart'])) {
    try {
        $productModel = new ProductModel();
        $product_ids = array_keys($_SESSION['cart']);
        
        if (!empty($product_ids)) {
            $products = $productModel->getProductsByIds($product_ids);
            
            foreach ($products as $product) {
                $quantity = $_SESSION['cart'][$product['id']];
                $price = !empty($product['sale_price']) ? $product['sale_price'] : $product['price'];
                $subtotal = $price * $quantity;
                
                $cart_items[] = [
                    'product' => $product,
                    'quantity' => $quantity,
                    'price' => $price,
                    'subtotal' => $subtotal
                ];
                
                $cart_total += $subtotal;
                $cart_count += $quantity;
            }
        }
    } catch (Exception $e) {
        error_log("Error loading cart items: " . $e->getMessage());
    }
}
?>

<section class="cart-section">
    <div class="container">
        <div class="cart-header">
            <div class="breadcrumb">
                <a href="index.php">Trang chủ</a>
                <span class="breadcrumb-separator"><i class="fas fa-chevron-right"></i></span>
                <span class="breadcrumb-current">Giỏ hàng</span>
            </div>
            
            <h1 class="page-title">Giỏ hàng của bạn</h1>
            <p class="page-subtitle">
                <?php if ($cart_count > 0): ?>
                    Bạn có <?php echo $cart_count; ?> sản phẩm trong giỏ hàng
                <?php else: ?>
                    Giỏ hàng của bạn đang trống
                <?php endif; ?>
            </p>
        </div>
        
        <?php if (!empty($cart_items)): ?>
            <div class="cart-content">
                <div class="cart-table-container">
                    <table class="cart-table">
                        <thead>
                            <tr>
                                <th class="product-col">Sản phẩm</th>
                                <th class="price-col">Giá</th>
                                <th class="quantity-col">Số lượng</th>
                                <th class="total-col">Tổng cộng</th>
                                <th class="action-col">Thao tác</th>
                            </tr>
                        </thead>
                        <tbody>
                            <?php foreach ($cart_items as $item): ?>
                                <tr class="cart-item" data-product-id="<?php echo $item['product']['id']; ?>">
                                    <td class="product-info">
                                        <div class="product-item">
                                            <div class="product-image">
                                                <img src="<?php echo !empty($item['product']['image_url']) ? $item['product']['image_url'] : 'images/placeholder.jpg'; ?>" 
                                                     alt="<?php echo htmlspecialchars($item['product']['name']); ?>" 
                                                     class="product-thumb">
                                            </div>
                                            <div class="product-details">
                                                <h3 class="product-name">
                                                    <a href="index.php?page=product-detail&id=<?php echo $item['product']['id']; ?>">
                                                        <?php echo htmlspecialchars($item['product']['name']); ?>
                                                    </a>
                                                </h3>
                                                <?php if (!empty($item['product']['category'])): ?>
                                                    <p class="product-category"><?php echo htmlspecialchars($item['product']['category']); ?></p>
                                                <?php endif; ?>
                                            </div>
                                        </div>
                                    </td>
                                    
                                    <td class="product-price">
                                        <?php if (!empty($item['product']['sale_price']) && $item['product']['sale_price'] < $item['product']['price']): ?>
                                            <span class="original-price"><?php echo number_format($item['product']['price'], 0, ',', '.'); ?>₫</span>
                                            <span class="sale-price"><?php echo number_format($item['product']['sale_price'], 0, ',', '.'); ?>₫</span>
                                        <?php else: ?>
                                            <span class="current-price"><?php echo number_format($item['product']['price'], 0, ',', '.'); ?>₫</span>
                                        <?php endif; ?>
                                    </td>
                                      <td class="product-quantity">
                                        <div class="quantity-controls">
                                            <button type="button" class="quantity-btn" data-action="decrease" data-product-id="<?php echo $item['product']['id']; ?>">-</button>
                                            <input type="number" class="quantity-input" value="<?php echo $item['quantity']; ?>" 
                                                   min="1" max="<?php echo $item['product']['stock'] ?? 999; ?>" 
                                                   data-product-id="<?php echo $item['product']['id']; ?>">
                                            <button type="button" class="quantity-btn" data-action="increase" data-product-id="<?php echo $item['product']['id']; ?>">+</button>
                                        </div>
                                    </td>
                                    
                                    <td class="product-total">
                                        <span class="item-total" data-product-id="<?php echo $item['product']['id']; ?>">
                                            <?php echo number_format($item['subtotal'], 0, ',', '.'); ?>₫
                                        </span>
                                    </td>
                                    
                                    <td class="product-actions">
                                        <button type="button" class="btn btn-sm btn-outline remove-cart-btn" 
                                                data-product-id="<?php echo $item['product']['id']; ?>" 
                                                title="Xóa sản phẩm">
                                            <i class="fas fa-trash-alt"></i>
                                        </button>
                                    </td>
                                </tr>
                            <?php endforeach; ?>
                        </tbody>
                    </table>
                </div>
                
                <div class="cart-actions">
                    <div class="cart-actions-left">
                        <a href="index.php?page=products" class="btn btn-outline">
                            <i class="fas fa-arrow-left"></i> Tiếp tục mua sắm
                        </a>
                        <button type="button" class="btn btn-secondary clear-cart-btn">
                            <i class="fas fa-trash"></i> Xóa toàn bộ giỏ hàng
                        </button>
                    </div>
                    
                    <div class="cart-actions-right">
                        <button type="button" class="btn btn-outline update-cart-btn">
                            <i class="fas fa-sync"></i> Cập nhật giỏ hàng
                        </button>
                    </div>
                </div>
                
                <div class="cart-summary">
                    <div class="summary-content">
                        <h3 class="summary-title">Tổng kết đơn hàng</h3>
                        
                        <div class="summary-row">
                            <span class="summary-label">Tạm tính:</span>
                            <span class="summary-value"><?php echo number_format($cart_total, 0, ',', '.'); ?>₫</span>
                        </div>
                        
                        <div class="summary-row">
                            <span class="summary-label">Phí vận chuyển:</span>
                            <span class="summary-value">
                                <?php 
                                $shipping_fee = $cart_total >= 500000 ? 0 : 30000; // Free shipping for orders >= 500k
                                if ($shipping_fee > 0): ?>
                                    <?php echo number_format($shipping_fee, 0, ',', '.'); ?>₫
                                <?php else: ?>
                                    <span class="free-shipping">Miễn phí</span>
                                <?php endif; ?>
                            </span>
                        </div>
                        
                        <?php if ($cart_total < 500000): ?>
                            <div class="summary-note">
                                <i class="fas fa-info-circle"></i>
                                Mua thêm <?php echo number_format(500000 - $cart_total, 0, ',', '.'); ?>₫ để được miễn phí vận chuyển!
                            </div>
                        <?php endif; ?>
                        
                        <div class="summary-row summary-total">
                            <span class="summary-label">Tổng cộng:</span>
                            <span class="summary-value total-amount">
                                <?php echo number_format($cart_total + $shipping_fee, 0, ',', '.'); ?>₫
                            </span>
                        </div>
                        
                        <div class="summary-actions">
                            <a href="index.php?page=checkout" class="btn btn-primary btn-lg btn-full">
                                <i class="fas fa-credit-card"></i> Thanh toán
                            </a>
                        </div>
                    </div>
                </div>
            </div>
            
        <?php else: ?>
            <div class="empty-cart">
                <div class="empty-cart-content">
                    <i class="fas fa-shopping-cart"></i>
                    <h3>Giỏ hàng của bạn đang trống</h3>
                    <p>Hãy thêm một số sản phẩm vào giỏ hàng để tiếp tục mua sắm.</p>
                    <a href="index.php?page=products" class="btn btn-primary btn-lg">
                        <i class="fas fa-shopping-bag"></i> Bắt đầu mua sắm
                    </a>
                </div>
            </div>
        <?php endif; ?>
    </div>
</section>

<script>
document.addEventListener('DOMContentLoaded', function() {
    // Quantity controls
    const quantityDecrease = document.querySelectorAll('.quantity-decrease');
    const quantityIncrease = document.querySelectorAll('.quantity-increase');
    const quantityInputs = document.querySelectorAll('.quantity-input');
    
    // Decrease quantity
    quantityDecrease.forEach(btn => {
        btn.addEventListener('click', function() {
            const productId = this.dataset.productId;
            const input = document.querySelector(`.quantity-input[data-product-id="${productId}"]`);
            let value = parseInt(input.value);
            
            if (value > 1) {
                input.value = value - 1;
                updateCartItem(productId, input.value);
            }
        });
    });
    
    // Increase quantity
    quantityIncrease.forEach(btn => {
        btn.addEventListener('click', function() {
            const productId = this.dataset.productId;
            const input = document.querySelector(`.quantity-input[data-product-id="${productId}"]`);
            let value = parseInt(input.value);
            let max = parseInt(input.getAttribute('max'));
            
            if (value < max) {
                input.value = value + 1;
                updateCartItem(productId, input.value);
            }
        });
    });
    
    // Quantity input change
    quantityInputs.forEach(input => {
        input.addEventListener('change', function() {
            const productId = this.dataset.productId;
            const quantity = parseInt(this.value);
            const min = parseInt(this.getAttribute('min'));
            const max = parseInt(this.getAttribute('max'));
            
            if (quantity >= min && quantity <= max) {
                updateCartItem(productId, quantity);
            } else {
                this.value = Math.max(min, Math.min(max, quantity));
            }
        });
    });
    
    // Remove item buttons
    const removeButtons = document.querySelectorAll('.remove-item-btn');
    removeButtons.forEach(btn => {
        btn.addEventListener('click', function() {
            const productId = this.dataset.productId;
            if (confirm('Bạn có chắc chắn muốn xóa sản phẩm này khỏi giỏ hàng?')) {
                removeCartItem(productId);
            }
        });
    });
    
    // Clear cart button
    const clearCartBtn = document.querySelector('.clear-cart-btn');
    if (clearCartBtn) {
        clearCartBtn.addEventListener('click', function() {
            if (confirm('Bạn có chắc chắn muốn xóa toàn bộ giỏ hàng?')) {
                clearCart();
            }
        });
    }
});

// Update cart item quantity
function updateCartItem(productId, quantity) {
    const formData = new FormData();
    formData.append('action', 'update_quantity');
    formData.append('product_id', productId);
    formData.append('quantity', quantity);
    
    fetch('index.php?page=cart', {
        method: 'POST',
        body: formData,
        headers: {
            'X-Requested-With': 'XMLHttpRequest'
        }
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            // Update item total and cart total
            location.reload(); // Simple reload for now
        }
    })
    .catch(error => {
        console.error('Error updating cart:', error);
    });
}

// Remove cart item
function removeCartItem(productId) {
    const formData = new FormData();
    formData.append('action', 'remove_item');
    formData.append('product_id', productId);
    
    fetch('index.php?page=cart', {
        method: 'POST',
        body: formData,
        headers: {
            'X-Requested-With': 'XMLHttpRequest'
        }
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            location.reload();
        }
    })
    .catch(error => {
        console.error('Error removing item:', error);
    });
}

// Clear entire cart
function clearCart() {
    const formData = new FormData();
    formData.append('action', 'clear_cart');
    
    fetch('index.php?page=cart', {
        method: 'POST',
        body: formData,
        headers: {
            'X-Requested-With': 'XMLHttpRequest'
        }
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            location.reload();
        }
    })
    .catch(error => {
        console.error('Error clearing cart:', error);
    });
}
</script>

<?php
// Add specific CSS and JavaScript for cart page
$additional_css = ['CSS/cart-styles.css'];
$additional_js = ['JS/cart.js', 'JS/cartUtils.js'];
?>
