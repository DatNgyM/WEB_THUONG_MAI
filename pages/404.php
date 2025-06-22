<?php
$page_title = "Trang không tồn tại";
?>

<section class="error-section">
    <div class="container">
        <div class="error-content">
            <div class="error-visual">
                <div class="error-code">404</div>
                <div class="error-illustration">
                    <i class="fas fa-search"></i>
                </div>
            </div>

            <div class="error-text">
                <h1 class="error-title">Oops! Trang không tồn tại</h1>
                <p class="error-description">
                    Xin lỗi, chúng tôi không thể tìm thấy trang bạn đang tìm kiếm.
                    Trang có thể đã được di chuyển, xóa hoặc bạn đã nhập sai địa chỉ.
                </p>

                <div class="error-suggestions">
                    <h3>Bạn có thể thử:</h3>
                    <ul>
                        <li>Kiểm tra lại địa chỉ URL</li>
                        <li>Quay lại trang trước đó</li>
                        <li>Tìm kiếm sản phẩm bạn cần</li>
                        <li>Liên hệ với chúng tôi nếu cần hỗ trợ</li>
                    </ul>
                </div>

                <div class="error-actions">
                    <a href="index.php" class="btn btn-primary btn-lg">
                        <i class="fas fa-home"></i> Về trang chủ
                    </a>
                    <a href="index.php?page=products" class="btn btn-outline btn-lg">
                        <i class="fas fa-shopping-bag"></i> Xem sản phẩm
                    </a>
                    <button type="button" class="btn btn-secondary btn-lg" onclick="history.back()">
                        <i class="fas fa-arrow-left"></i> Quay lại
                    </button>
                </div>
            </div>
        </div>

        <!-- Search Section -->
        <div class="error-search">
            <div class="search-container">
                <h3>Tìm kiếm sản phẩm</h3>
                <form class="search-form" action="index.php" method="GET">
                    <input type="hidden" name="page" value="products">
                    <div class="search-input-group">
                        <input type="text" name="search" placeholder="Nhập từ khóa tìm kiếm..." class="search-input">
                        <button type="submit" class="search-btn">
                            <i class="fas fa-search"></i> Tìm kiếm
                        </button>
                    </div>
                </form>
            </div>
        </div>

        <!-- Popular Categories -->
        <div class="error-categories">
            <h3>Danh mục phổ biến</h3>
            <div class="categories-list">
                <a href="index.php?page=products&category=smartphones" class="category-link">
                    <i class="fas fa-mobile-alt"></i> Điện thoại
                </a>
                <a href="index.php?page=products&category=laptops" class="category-link">
                    <i class="fas fa-laptop"></i> Laptop
                </a>
                <a href="index.php?page=products&category=watches" class="category-link">
                    <i class="fas fa-clock"></i> Đồng hồ
                </a>
                <a href="index.php?page=products&category=accessories" class="category-link">
                    <i class="fas fa-headphones"></i> Phụ kiện
                </a>
            </div>
        </div>

        <!-- Contact Info -->
        <div class="error-contact">
            <div class="contact-content">
                <h3>Cần hỗ trợ?</h3>
                <p>Đội ngũ hỗ trợ của chúng tôi luôn sẵn sàng giúp đỡ bạn!</p>
                <div class="contact-methods">
                    <div class="contact-method">
                        <i class="fas fa-phone"></i>
                        <div>
                            <strong>Hotline</strong>
                            <span>0123 456 789</span>
                        </div>
                    </div>
                    <div class="contact-method">
                        <i class="fas fa-envelope"></i>
                        <div>
                            <strong>Email</strong>
                            <span>support@five07.com</span>
                        </div>
                    </div>
                    <div class="contact-method">
                        <i class="fas fa-comments"></i>
                        <div>
                            <strong>Live Chat</strong>
                            <span>8:00 - 22:00</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</section>

<style>
    .error-section {
        padding: 80px 0;
        min-height: 60vh;
        background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%);
    }

    .error-content {
        text-align: center;
        margin-bottom: 60px;
    }

    .error-visual {
        margin-bottom: 40px;
    }

    .error-code {
        font-size: 8rem;
        font-weight: 700;
        color: var(--primary-color);
        line-height: 1;
        margin-bottom: 20px;
        text-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
    }

    .error-illustration {
        font-size: 4rem;
        color: var(--secondary-color);
        margin-bottom: 20px;
    }

    .error-title {
        font-size: 2.5rem;
        font-weight: 600;
        color: var(--text-primary);
        margin-bottom: 20px;
    }

    .error-description {
        font-size: 1.2rem;
        color: var(--text-secondary);
        max-width: 600px;
        margin: 0 auto 30px;
        line-height: 1.6;
    }

    .error-suggestions {
        background: white;
        padding: 30px;
        border-radius: 12px;
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
        margin: 40px auto;
        max-width: 500px;
        text-align: left;
    }

    .error-suggestions h3 {
        color: var(--text-primary);
        margin-bottom: 15px;
        font-size: 1.2rem;
    }

    .error-suggestions ul {
        list-style: none;
        padding: 0;
    }

    .error-suggestions li {
        padding: 8px 0;
        padding-left: 25px;
        position: relative;
        color: var(--text-secondary);
    }

    .error-suggestions li::before {
        content: '•';
        color: var(--primary-color);
        position: absolute;
        left: 0;
        font-weight: bold;
    }

    .error-actions {
        display: flex;
        gap: 15px;
        justify-content: center;
        flex-wrap: wrap;
        margin-top: 40px;
    }

    .error-search {
        background: white;
        padding: 40px;
        border-radius: 12px;
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
        margin-bottom: 40px;
        text-align: center;
    }

    .error-search h3 {
        color: var(--text-primary);
        margin-bottom: 20px;
    }

    .search-input-group {
        display: flex;
        max-width: 500px;
        margin: 0 auto;
        gap: 10px;
    }

    .search-input {
        flex: 1;
        padding: 12px 16px;
        border: 2px solid #e9ecef;
        border-radius: 8px;
        font-size: 1rem;
    }

    .search-btn {
        padding: 12px 24px;
        background: var(--primary-color);
        color: white;
        border: none;
        border-radius: 8px;
        cursor: pointer;
        transition: all 0.3s ease;
    }

    .search-btn:hover {
        background: var(--primary-hover);
    }

    .error-categories {
        text-align: center;
        margin-bottom: 40px;
    }

    .error-categories h3 {
        color: var(--text-primary);
        margin-bottom: 20px;
    }

    .categories-list {
        display: flex;
        gap: 15px;
        justify-content: center;
        flex-wrap: wrap;
    }

    .category-link {
        display: flex;
        align-items: center;
        gap: 8px;
        padding: 12px 20px;
        background: white;
        color: var(--text-primary);
        text-decoration: none;
        border-radius: 8px;
        box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
        transition: all 0.3s ease;
    }

    .category-link:hover {
        transform: translateY(-2px);
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
        color: var(--primary-color);
    }

    .error-contact {
        background: white;
        padding: 40px;
        border-radius: 12px;
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
        text-align: center;
    }

    .error-contact h3 {
        color: var(--text-primary);
        margin-bottom: 10px;
    }

    .error-contact p {
        color: var(--text-secondary);
        margin-bottom: 30px;
    }

    .contact-methods {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
        gap: 20px;
    }

    .contact-method {
        display: flex;
        align-items: center;
        gap: 15px;
        padding: 20px;
        background: #f8f9fa;
        border-radius: 8px;
    }

    .contact-method i {
        font-size: 1.5rem;
        color: var(--primary-color);
    }

    .contact-method div {
        text-align: left;
    }

    .contact-method strong {
        display: block;
        color: var(--text-primary);
        margin-bottom: 5px;
    }

    .contact-method span {
        color: var(--text-secondary);
    }

    @media (max-width: 768px) {
        .error-code {
            font-size: 6rem;
        }

        .error-title {
            font-size: 2rem;
        }

        .error-actions {
            flex-direction: column;
            align-items: center;
        }

        .search-input-group {
            flex-direction: column;
        }

        .categories-list {
            flex-direction: column;
            align-items: center;
        }

        .contact-methods {
            grid-template-columns: 1fr;
        }
    }
</style>