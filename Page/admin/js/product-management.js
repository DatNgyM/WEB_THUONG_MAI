// File quản lý sản phẩm trong trang admin
// Biến toàn cục để lưu trữ dữ liệu sản phẩm
let productData = [];
let currentPage = 1;
const productsPerPage = 10; // Số lượng sản phẩm mỗi trang

// Hàm để lấy dữ liệu sản phẩm từ API
async function fetchProducts() {
    try {
        console.log('Đang tải danh sách sản phẩm từ API...', new Date().toISOString());
        
        // Hiển thị trạng thái đang tải trong bảng
        const tableBody = document.querySelector('table tbody');
        if (tableBody) {
            tableBody.innerHTML = `
                <tr>
                    <td colspan="6" class="text-center">
                        <div class="spinner-border text-primary" role="status">
                            <span class="sr-only">Đang tải...</span>
                        </div>
                        <p class="mt-2">Đang tải dữ liệu sản phẩm...</p>
                    </td>
                </tr>
            `;
        }
        
        // Thiết lập timeout cho fetch để tránh treo vô hạn
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 10000); // Timeout sau 10 giây
        
        try {
            const response = await fetch('/api/admin/products', {
                signal: controller.signal
            });
            
            clearTimeout(timeoutId); // Hủy timeout nếu fetch thành công
            
            if (!response.ok) {
                throw new Error(`Lỗi khi tải dữ liệu: ${response.status} ${response.statusText}`);
            }
            
            // Parse JSON response
            const data = await response.json();
            if (!Array.isArray(data)) {
                console.warn('Dữ liệu trả về không phải là mảng:', data);
                productData = [];
            } else {
                productData = data;
                console.log(`Đã nhận ${productData.length} sản phẩm từ API`);
            }
            
            // Kiểm tra xem có sản phẩm mới được thêm vào không
            const urlParams = new URLSearchParams(window.location.search);
            const newProductId = urlParams.get('newProductId');
            
            if (newProductId) {
                // Tìm sản phẩm mới trong dữ liệu và đánh dấu
                const newProduct = productData.find(p => p.id == newProductId);
                if (newProduct) {
                    newProduct.isNew = true; // Đánh dấu sản phẩm mới
                    console.log('Đã tìm thấy sản phẩm mới:', newProduct);
                }
            }
            
            // Hiển thị dữ liệu trong bảng
            renderProductTable();
            updateProductStats();
            
        } catch (fetchError) {
            if (fetchError.name === 'AbortError') {
                throw new Error('Không thể kết nối đến server sau 10 giây. Vui lòng thử lại sau.');
            }
            throw fetchError;
        }
    } catch (error) {
        console.error('Lỗi khi lấy dữ liệu sản phẩm:', error);
        
        // Hiển thị lỗi trong bảng thay vì để trống
        const tableBody = document.querySelector('table tbody');
        if (tableBody) {
            tableBody.innerHTML = `
                <tr>
                    <td colspan="6" class="text-center text-danger">
                        <i class="fas fa-exclamation-circle me-2"></i>
                        ${error.message || 'Không thể tải dữ liệu sản phẩm. Vui lòng thử lại sau.'}
                        <button class="btn btn-sm btn-outline-primary ms-3" onclick="fetchProducts()">
                            <i class="fas fa-sync-alt me-1"></i> Thử lại
                        </button>
                    </td>
                </tr>
            `;
        }
        
        showNotification('error', 'Không thể tải dữ liệu sản phẩm. Vui lòng thử lại sau.');
    }
}

// Format giá tiền thành định dạng tiền tệ
function formatCurrency(price) {
    return new Intl.NumberFormat('vi-VN', {
        style: 'currency',
        currency: 'VND'
    }).format(price);
}

// Hàm hiển thị dữ liệu sản phẩm trong bảng
function renderProductTable() {
    console.log('Hiển thị bảng sản phẩm với', productData.length, 'sản phẩm');
    const tableBody = document.querySelector('table tbody');
    if (!tableBody) {
        console.error('Không thể tìm thấy tbody trong bảng');
        return;
    }
    
    // Tính toán phân trang
    const startIndex = (currentPage - 1) * productsPerPage;
    const endIndex = Math.min(startIndex + productsPerPage, productData.length);
    const productsToShow = productData.slice(startIndex, endIndex);
    
    // Xóa nội dung cũ
    tableBody.innerHTML = '';
    
    // Kiểm tra nếu không có sản phẩm để hiển thị
    if (!productData.length || productsToShow.length === 0) {
        tableBody.innerHTML = `
            <tr>
                <td colspan="6">
                    <div class="empty-state">
                        <i class="fas fa-box-open"></i>
                        <h5>Không có sản phẩm nào</h5>
                        <p>Hãy thêm sản phẩm mới hoặc điều chỉnh bộ lọc tìm kiếm</p>
                        <a href="add-product.html" class="btn btn-primary">
                            <i class="fas fa-plus-circle me-2"></i> Thêm sản phẩm mới
                        </a>
                    </div>
                </td>
            </tr>
        `;
        console.log('Không có sản phẩm nào để hiển thị');
        return;
    }
    
    // Hiển thị từng sản phẩm
    productsToShow.forEach(product => {
        try {
            const expiryDate = product.expiry_date ? 
                new Date(product.expiry_date).toLocaleDateString('vi-VN') : 
                'N/A';
                
            // Xử lý đường dẫn hình ảnh
            let imagePath = product.image ? product.image : 'img/no-image.svg';
            // Nếu đường dẫn không bắt đầu bằng http hoặc /, thêm / vào đầu
            if (!imagePath.startsWith('http') && !imagePath.startsWith('/')) {
                imagePath = '/' + imagePath;
            }
            
            // Thêm class để highlight sản phẩm mới nếu có
            const isNewClass = product.isNew ? 'new-product-highlight' : '';
            
            const row = document.createElement('tr');
            row.dataset.id = product.id;
            row.className = isNewClass;
            
            row.innerHTML = `
                <td>
                    <input type="checkbox" class="product-checkbox" title="Chọn sản phẩm này">
                </td>
                <td>
                    <div class="d-flex align-items-center">
                        <img src="${imagePath}" alt="${product.name}" class="product-thumbnail me-2" onerror="this.src='img/no-image.svg'">
                        <span>${product.name || 'Sản phẩm không tên'}</span>
                        ${product.isNew ? '<span class="badge bg-success ms-2">Mới</span>' : ''}
                    </div>
                </td>
                <td>${product.sold_quantity || 0}</td>
                <td>${product.stock_quantity || 0}</td>
                <td>${expiryDate}</td>
                <td>
                    <div class="actions">
                        <a href="edit-product.html?id=${product.id}" class="btn btn-sm btn-info" title="Chỉnh sửa">
                            <i class="fas fa-edit"></i>
                        </a>
                        <button class="btn btn-sm btn-danger delete-product" data-id="${product.id}" title="Xóa">
                            <i class="fas fa-trash-alt"></i>
                        </button>
                    </div>
                </td>
            `;
            
            tableBody.appendChild(row);
        } catch (error) {
            console.error('Lỗi khi render sản phẩm:', product, error);
        }
    });
    
    // Cập nhật thông tin phân trang
    updatePagination();
    
    // Thêm lại event listeners cho các nút xóa
    setupDeleteButtons();
}

// Hàm cập nhật thông tin phân trang
function updatePagination() {
    const totalPages = Math.ceil(productData.length / productsPerPage);
    const paginationContainer = document.querySelector('.pagination');
    if (!paginationContainer) return;
    
    let paginationHTML = `
        <li class="page-item ${currentPage === 1 ? 'disabled' : ''}">
            <a class="page-link" href="#" data-page="${currentPage - 1}" aria-label="Previous">
                <span aria-hidden="true">&laquo;</span>
            </a>
        </li>
    `;
    
    // Hiển thị tối đa 5 trang
    const maxPagesToShow = 5;
    let startPage = Math.max(1, currentPage - Math.floor(maxPagesToShow / 2));
    let endPage = Math.min(totalPages, startPage + maxPagesToShow - 1);
    
    // Điều chỉnh startPage nếu endPage đã được điều chỉnh
    startPage = Math.max(1, endPage - maxPagesToShow + 1);
    
    for (let i = startPage; i <= endPage; i++) {
        paginationHTML += `
            <li class="page-item ${i === currentPage ? 'active' : ''}">
                <a class="page-link" href="#" data-page="${i}">${i}</a>
            </li>
        `;
    }
    
    paginationHTML += `
        <li class="page-item ${currentPage === totalPages ? 'disabled' : ''}">
            <a class="page-link" href="#" data-page="${currentPage + 1}" aria-label="Next">
                <span aria-hidden="true">&raquo;</span>
            </a>
        </li>
    `;
    
    paginationContainer.innerHTML = paginationHTML;
    
    // Cập nhật thông tin hiển thị
    const productInfoElement = document.querySelector('.card-footer span');
    if (productInfoElement) {
        const startProduct = (currentPage - 1) * productsPerPage + 1;
        const endProduct = Math.min(currentPage * productsPerPage, productData.length);
        productInfoElement.textContent = `Hiển thị ${startProduct}-${endProduct} của ${productData.length} sản phẩm`;
    }
    
    // Thêm event listeners cho các nút phân trang
    document.querySelectorAll('.pagination .page-link').forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const page = parseInt(this.getAttribute('data-page'));
            if (page && page !== currentPage && page > 0 && page <= totalPages) {
                currentPage = page;
                renderProductTable();
            }
        });
    });
}

// Cập nhật thống kê sản phẩm
function updateProductStats() {
    // Tổng số sản phẩm
    const totalProducts = productData.length;
    
    // Sản phẩm đang bán (có stock > 0)
    const availableProducts = productData.filter(p => p.stock_quantity > 0).length;
    
    // Sản phẩm hết hàng (stock = 0)
    const outOfStockProducts = productData.filter(p => p.stock_quantity === 0).length;
    
    // Sản phẩm sắp hết hàng (stock < 10)
    const lowStockProducts = productData.filter(p => p.stock_quantity > 0 && p.stock_quantity < 10).length;
    
    // Cập nhật các phần tử hiển thị
    const statsContainer = document.querySelector('.card:last-child .card-body');
    if (statsContainer) {
        const statElements = statsContainer.querySelectorAll('div');
        if (statElements.length >= 4) {
            statElements[0].querySelector('strong').textContent = totalProducts;
            statElements[1].querySelector('strong').textContent = availableProducts;
            statElements[2].querySelector('strong').textContent = outOfStockProducts;
            statElements[3].querySelector('strong').textContent = lowStockProducts;
        }
    }
}

// Thiết lập sự kiện cho các nút xóa sản phẩm
function setupDeleteButtons() {
    document.querySelectorAll('.delete-product').forEach(button => {
        button.addEventListener('click', function() {
            const productId = this.getAttribute('data-id');
            if (confirm('Bạn có chắc chắn muốn xóa sản phẩm này không?')) {
                deleteProduct(productId);
            }
        });
    });
}

// Hàm xóa sản phẩm
async function deleteProduct(productId) {
    try {
        const response = await fetch(`/api/admin/products/${productId}`, {
            method: 'DELETE'
        });
        
        if (!response.ok) {
            throw new Error('Không thể xóa sản phẩm');
        }
        
        // Nếu xóa thành công, cập nhật lại dữ liệu
        await fetchProducts();
        showNotification('success', 'Xóa sản phẩm thành công');
    } catch (error) {
        console.error('Lỗi khi xóa sản phẩm:', error);
        showNotification('error', 'Không thể xóa sản phẩm. Vui lòng thử lại sau.');
    }
}

// Hàm hiển thị thông báo
function showNotification(type, message) {
    // Kiểm tra xem đã có notification trên trang chưa
    let notification = document.querySelector('.notification');
    
    // Nếu chưa có, tạo mới
    if (!notification) {
        notification = document.createElement('div');
        notification.className = 'notification';
        document.body.appendChild(notification);
    }
    
    // Thiết lập thông báo
    notification.className = `notification notification-${type}`;
    notification.textContent = message;
    
    // Hiển thị thông báo
    setTimeout(() => {
        notification.classList.add('show');
    }, 10);
    
    // Ẩn thông báo sau 3 giây
    setTimeout(() => {
        notification.classList.remove('show');
        
        // Xóa khỏi DOM sau khi animation hoàn tất
        setTimeout(() => {
            if (notification.parentNode) {
                notification.parentNode.removeChild(notification);
            }
        }, 300);
    }, 3000);
}

// Xử lý sự kiện khi trang được tải
document.addEventListener('DOMContentLoaded', function() {
    console.log('Product management initialized at', new Date().toISOString());
    
    // Kiểm tra xem có param success=true không
    const urlParams = new URLSearchParams(window.location.search);
    const successParam = urlParams.get('success');
    
    if (successParam === 'true') {
        // Hiển thị thông báo thành công khi quay lại từ trang thêm sản phẩm
        showNotification('success', 'Sản phẩm đã được thêm thành công!');
        
        // Xóa tham số khỏi URL để tránh hiển thị lại thông báo khi refresh trang
        window.history.replaceState({}, document.title, window.location.pathname);
    }
    
    // Lấy dữ liệu sản phẩm khi trang được tải
    fetchProducts();
    
    // Thiết lập timeout để kiểm tra nếu dữ liệu không được tải
    setTimeout(() => {
        if (document.querySelector('table tbody .loading-text')) {
            console.log('Loading timeout triggered - retrying fetch');
            showNotification('info', 'Đang thử lại tải dữ liệu sản phẩm...');
            fetchProducts(); // Thử lại nếu vẫn đang hiển thị loading sau 5 giây
        }
    }, 5000);
    
    // Xử lý nút "Xóa đã chọn"
    const deleteSelectedButton = document.getElementById('deleteSelected');
    if (deleteSelectedButton) {
        deleteSelectedButton.addEventListener('click', function() {
            const selectedCheckboxes = document.querySelectorAll('.product-checkbox:checked');
            if (selectedCheckboxes.length === 0) {
                alert('Vui lòng chọn ít nhất một sản phẩm để xóa');
                return;
            }
            
            if (confirm(`Bạn có chắc chắn muốn xóa ${selectedCheckboxes.length} sản phẩm đã chọn không?`)) {
                // Lấy danh sách ID sản phẩm đã chọn
                const selectedIds = Array.from(selectedCheckboxes).map(checkbox => {
                    return checkbox.closest('tr').getAttribute('data-id');
                });
                
                // Xóa từng sản phẩm đã chọn
                Promise.all(selectedIds.map(id => deleteProduct(id)))
                    .then(() => {
                        // Cập nhật lại dữ liệu sau khi xóa
                        fetchProducts();
                    })
                    .catch(error => {
                        console.error('Lỗi khi xóa sản phẩm:', error);
                    });
            }
        });
    }
    
    // Xử lý nút "Check All"
    const checkAllCheckbox = document.getElementById('checkAll');
    if (checkAllCheckbox) {
        checkAllCheckbox.addEventListener('change', function() {
            document.querySelectorAll('.product-checkbox').forEach(checkbox => {
                checkbox.checked = this.checked;
            });
        });
    }
    
    // Xử lý tìm kiếm sản phẩm
    const searchForm = document.querySelector('.search-form');
    if (searchForm) {
        searchForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const nameInput = this.querySelector('input[type="text"]').value.toLowerCase();
            
            // Lọc sản phẩm theo tên
            fetch('/api/admin/products')
                .then(response => response.json())
                .then(data => {
                    productData = data.filter(product => {
                        // Lọc theo tên
                        if (nameInput && product.name && !product.name.toLowerCase().includes(nameInput)) {
                            return false;
                        }
                        return true;
                    });
                    
                    // Reset về trang 1 và hiển thị kết quả lọc
                    currentPage = 1;
                    renderProductTable();
                    updateProductStats();
                })
                .catch(error => {
                    console.error('Lỗi khi tìm kiếm sản phẩm:', error);
                });
        });
    }
});