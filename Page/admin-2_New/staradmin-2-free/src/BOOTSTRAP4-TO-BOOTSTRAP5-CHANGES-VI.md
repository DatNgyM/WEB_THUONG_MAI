# Các thay đổi khi nâng cấp từ Bootstrap 4 lên Bootstrap 5

## 1. Thay đổi về JavaScript

### 1.1. Loại bỏ jQuery
- **Thay đổi chính**: Bootstrap 5 đã loại bỏ hoàn toàn phụ thuộc vào jQuery, sử dụng JavaScript thuần (vanilla JavaScript)
- **Đã thực hiện**:
  - Đã chuyển đổi tất cả mã jQuery sang JavaScript thuần trong các tệp:
    - `template.js`: Thay thế các trình chọn jQuery bằng API DOM gốc
    - `settings.js`: Thay thế các trình xử lý sự kiện jQuery bằng addEventListener
    - `todolist.js`: Thay thế thao tác DOM của jQuery bằng các phương thức gốc
    - `hoverable-collapse.js`: Thay thế các sự kiện jQuery bằng trình nghe sự kiện gốc
    - `dashboard.js`: Loại bỏ phụ thuộc jQuery

### 1.2. Cập nhật thuộc tính dữ liệu
- **Thay đổi chính**: Đổi tiền tố thuộc tính dữ liệu từ `data-` sang `data-bs-`
- **Đã thực hiện**:
  - Đổi `data-toggle` thành `data-bs-toggle`
  - Đổi `data-target` thành `data-bs-target`
  - Đổi `data-dismiss` thành `data-bs-dismiss`
  - Tạo script `bs5-optimize.js` để tự động chuyển đổi các thuộc tính còn lại

### 1.3. Khởi tạo các thành phần
- **Thay đổi chính**: Cú pháp khởi tạo các thành phần đã thay đổi
- **Đã thực hiện**:
  - Cập nhật cú pháp khởi tạo:
    ```javascript
    // Bootstrap 4 (jQuery)
    $('#myTooltip').tooltip();
    
    // Bootstrap 5 (Vanilla JS)
    const tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'))
    const tooltipList = tooltipTriggerList.map(tooltipTriggerEl => new bootstrap.Tooltip(tooltipTriggerEl))
    ```

## 2. Thay đổi về CSS

### 2.1. Các lớp CSS đã đổi tên
- **Đã thực hiện**:
  - `.badge-pill` → `.rounded-pill`
  - `.badge-*` (primary, success, etc.) → `.bg-*`
  - `.no-gutters` → `.g-0`
  - `.float-left` → `.float-start`
  - `.float-right` → `.float-end`
  - `.text-left` → `.text-start`
  - `.text-right` → `.text-end`
  - `.font-weight-*` → `.fw-*`
  - `.font-style-*` → `.fst-*`
  - `.ml-*` → `.ms-*` (margin-left → margin-start)
  - `.mr-*` → `.me-*` (margin-right → margin-end)
  - `.pl-*` → `.ps-*` (padding-left → padding-start)
  - `.pr-*` → `.pe-*` (padding-right → padding-end)
  - `.text-monospace` → `.font-monospace`
  - `.text-hide` → đã loại bỏ
  - `.form-inline` → đã loại bỏ

### 2.2. Thay đổi cấu trúc Navbar
- **Đã thực hiện**:
  - Cập nhật cấu trúc SCSS trong `_navbar.scss`
  - Sửa đổi tệp SCSS để hỗ trợ phong cách Bootstrap 5
  - Làm sạch mã CSS và loại bỏ các phần phụ thuộc vào Bootstrap 4

### 2.3. Thay đổi về biến CSS
- **Đã thực hiện**:
  - Thêm tệp `bootstrap5-variables.css` để hỗ trợ các biến CSS của Bootstrap 5
  - Cập nhật tất cả các tệp HTML để tham chiếu đến tệp này
  - Thay đổi các biến SCSS theo quy ước đặt tên mới của Bootstrap 5

## 3. Thay đổi về cấu trúc HTML

### 3.1. Nhóm đầu vào (Input groups)
- **Thay đổi chính**: Loại bỏ các lớp wrapper `.input-group-prepend` và `.input-group-append`
- **Đã thực hiện**:
  ```html
  <!-- Bootstrap 4 -->
  <div class="input-group">
    <div class="input-group-prepend">
      <span class="input-group-text">@</span>
    </div>
    <input class="form-control" type="text">
  </div>

  <!-- Bootstrap 5 -->
  <div class="input-group">
    <span class="input-group-text">@</span>
    <input class="form-control" type="text">
  </div>
  ```

### 3.2. Form check
- **Thay đổi chính**: Thay đổi vị trí của `<input>` và `<label>`
- **Đã thực hiện**:
  ```html
  <!-- Bootstrap 4 -->
  <div class="form-check">
    <label class="form-check-label">
      <input type="checkbox" class="form-check-input"> Option
    </label>
  </div>

  <!-- Bootstrap 5 -->
  <div class="form-check">
    <input type="checkbox" class="form-check-input" id="check1">
    <label class="form-check-label" for="check1">Option</label>
  </div>
  ```

### 3.3. Dropdown
- **Thay đổi chính**: Thay đổi data-toggle thành data-bs-toggle
- **Đã thực hiện**: Cập nhật tất cả các dropdown trong mẫu

## 4. Tích hợp Plugins

### 4.1. Bootstrap Datepicker
- **Đã thực hiện**:
  - Tạo tệp `datepicker-vanilla.js` là một bộ điều hợp giữa JavaScript thuần và plugin bootstrap-datepicker
  - Thêm bộ điều hợp này vào tất cả các trang sử dụng datepicker
  - Cập nhật ví dụ datepicker trong trang tài liệu để sử dụng JavaScript thuần thay vì jQuery

### 4.2. Chart.js và Plugins khác
- **Đã thực hiện**:
  - Cập nhật Chart.js để tương thích với Bootstrap 5
  - Thay thế các plugin phụ thuộc jQuery bằng các giải pháp dùng JavaScript thuần
  - Giữ lại khả năng tương thích với các plugin bên thứ ba còn phụ thuộc jQuery

## 5. Tối ưu hóa hiệu suất

### 5.1. Tối ưu hóa hình ảnh
- **Đã thực hiện**:
  - Thêm thuộc tính `loading="lazy"` cho các hình ảnh không nằm trong viewport ban đầu
  - Tối ưu hóa các tài nguyên hình ảnh để cải thiện thời gian tải

### 5.2. Xử lý sự kiện
- **Đã thực hiện**:
  - Tối ưu hóa các bộ lắng nghe sự kiện với JavaScript thuần
  - Sử dụng sự kiện ủy quyền thay vì gắn nhiều bộ lắng nghe

### 5.3. Chế độ tối
- **Đã thực hiện**:
  - Thêm hỗ trợ chuyển đổi chế độ tối với Bootstrap 5

## 6. Các tệp đã cập nhật

### 6.1. Tệp HTML
- Tất cả các mẫu HTML trong thư mục `pages/`
- `index.html`
- `documentation.html`
- Các tệp partial (`_navbar.html`, `_sidebar.html`, `_footer.html`)

### 6.2. Tệp JavaScript 
- Tất cả các tệp JS trong thư mục `assets/js/`
- Tạo mới `bs5-optimize.js` và `datepicker-vanilla.js`

### 6.3. Tệp CSS/SCSS
- Cập nhật SCSS trong thư mục `assets/scss/`
- Tạo mới `bootstrap5-variables.css`

## 7. Lợi ích từ việc nâng cấp

1. **Hiệu suất**: Loại bỏ phụ thuộc jQuery đã cải thiện thời gian tải và tốc độ thực thi
2. **Bảo trì**: Thực hành JavaScript hiện đại giúp mã dễ bảo trì hơn
3. **Tương thích**: Cập nhật để hoạt động với công nghệ trình duyệt mới nhất
4. **Hiện đại hóa**: Hỗ trợ RTL tốt hơn và sử dụng thuộc tính logic
5. **Khả năng tiếp cận**: Cải thiện hỗ trợ ARIA thông qua các cải tiến Bootstrap 5
6. **Cấu trúc**: Sửa cấu trúc SCSS trong navbar và các thành phần khác
7. **Tích hợp**: Thêm biến CSS của Bootstrap 5 để tùy chỉnh chủ đề tốt hơn
8. **Plugin**: Cập nhật tích hợp datepicker với bộ điều hợp JS thuần
