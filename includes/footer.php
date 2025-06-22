</main>

<!-- Footer -->
<footer class="main-footer">
    <div class="footer-container">
        <!-- Footer Top -->
        <div class="footer-top">
            <div class="footer-section">
                <h3 class="footer-title">Five:07 E-commerce</h3>
                <p class="footer-desc">
                    Nền tảng thương mại điện tử hiện đại, cung cấp những sản phẩm chất lượng cao
                    với dịch vụ khách hàng tận tâm.
                </p>
                <div class="footer-social">
                    <a href="#" class="social-link" aria-label="Facebook">
                        <i class="fab fa-facebook-f"></i>
                    </a>
                    <a href="#" class="social-link" aria-label="Instagram">
                        <i class="fab fa-instagram"></i>
                    </a>
                    <a href="#" class="social-link" aria-label="Twitter">
                        <i class="fab fa-twitter"></i>
                    </a>
                    <a href="#" class="social-link" aria-label="YouTube">
                        <i class="fab fa-youtube"></i>
                    </a>
                </div>
            </div>

            <div class="footer-section">
                <h4 class="footer-subtitle">Danh mục</h4>
                <ul class="footer-links">
                    <li><a href="index.php?page=products&category=smartphones">Điện thoại</a></li>
                    <li><a href="index.php?page=products&category=laptops">Laptop</a></li>
                    <li><a href="index.php?page=products&category=watches">Đồng hồ</a></li>
                    <li><a href="index.php?page=products&category=accessories">Phụ kiện</a></li>
                    <li><a href="index.php?page=products">Tất cả sản phẩm</a></li>
                </ul>
            </div>

            <div class="footer-section">
                <h4 class="footer-subtitle">Hỗ trợ</h4>
                <ul class="footer-links">
                    <li><a href="#contact">Liên hệ</a></li>
                    <li><a href="#shipping">Chính sách giao hàng</a></li>
                    <li><a href="#return">Chính sách đổi trả</a></li>
                    <li><a href="#warranty">Bảo hành</a></li>
                    <li><a href="#faq">Câu hỏi thường gặp</a></li>
                </ul>
            </div>

            <div class="footer-section">
                <h4 class="footer-subtitle">Thông tin liên hệ</h4>
                <div class="footer-contact">
                    <div class="contact-item">
                        <i class="fas fa-map-marker-alt"></i>
                        <span>123 Đường ABC, Quận XYZ, TP.HCM</span>
                    </div>
                    <div class="contact-item">
                        <i class="fas fa-phone"></i>
                        <span>0123 456 789</span>
                    </div>
                    <div class="contact-item">
                        <i class="fas fa-envelope"></i>
                        <span>contact@five07.com</span>
                    </div>
                    <div class="contact-item">
                        <i class="fas fa-clock"></i>
                        <span>8:00 - 22:00 (Thứ 2 - CN)</span>
                    </div>
                </div>
            </div>
        </div>

        <!-- Footer Bottom -->
        <div class="footer-bottom">
            <div class="footer-bottom-content">
                <p class="copyright">
                    © <?php echo date('Y'); ?> Five:07 E-commerce. Tất cả quyền được bảo lưu.
                </p>
                <div class="footer-bottom-links">
                    <a href="#privacy">Chính sách bảo mật</a>
                    <a href="#terms">Điều khoản sử dụng</a>
                    <a href="#cookies">Cookies</a>
                </div>
            </div>
        </div>
    </div>
</footer>

<!-- Back to Top Button -->
<div class="back-to-top" id="backToTop">
    <i class="fas fa-chevron-up"></i>
</div>

<!-- JavaScript -->
<script src="JS/authDisplay.js"></script>
<script src="JS/cart.js"></script>
<script src="JS/cartUtils.js"></script>
<script src="JS/home.js"></script>

<!-- Additional JavaScript for specific pages -->
<?php if (isset($additional_js) && is_array($additional_js)): ?>
    <?php foreach ($additional_js as $js): ?>
        <script src="<?php echo $js; ?>"></script>
    <?php endforeach; ?>
<?php endif; ?>

<!-- Common JavaScript -->
<script>
    // Mobile menu toggle
    document.addEventListener('DOMContentLoaded', function () {
        const mobileToggle = document.querySelector('.mobile-menu-toggle');
        const mobileMenu = document.querySelector('.mobile-menu');

        if (mobileToggle && mobileMenu) {
            mobileToggle.addEventListener('click', function () {
                mobileMenu.classList.toggle('active');
            });
        }

        // Back to top button
        const backToTop = document.getElementById('backToTop');
        if (backToTop) {
            window.addEventListener('scroll', function () {
                if (window.pageYOffset > 300) {
                    backToTop.classList.add('visible');
                } else {
                    backToTop.classList.remove('visible');
                }
            });

            backToTop.addEventListener('click', function () {
                window.scrollTo({
                    top: 0,
                    behavior: 'smooth'
                });
            });
        }

        // Close mobile menu when clicking outside
        document.addEventListener('click', function (event) {
            if (!event.target.closest('.mobile-menu') && !event.target.closest('.mobile-menu-toggle')) {
                mobileMenu.classList.remove('active');
            }
        });
    });
</script>
</body>

</html>