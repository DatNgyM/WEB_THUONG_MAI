# Hướng dẫn chuyển đổi từ Bootstrap 4 sang Bootstrap 5

Tài liệu này cung cấp hướng dẫn để hoàn thiện việc chuyển đổi template Star Admin 2 từ Bootstrap 4 sang Bootstrap 5. Chúng ta đã thực hiện nhiều thay đổi nhưng vẫn còn một số công việc cần làm để hoàn thiện việc chuyển đổi.

## 1. Cập nhật JavaScript (Đã thực hiện)

Chúng tôi đã chuyển đổi một số file JavaScript từ jQuery sang Vanilla JS:
- template.js
- off-canvas.js
- dashboard.js

Các file này đã được sửa đổi để sử dụng DOM API tiêu chuẩn thay vì phụ thuộc vào jQuery, phù hợp với cách tiếp cận của Bootstrap 5.

## 2. Sử dụng CSS Variables của Bootstrap 5

Chúng tôi đã thêm file `bootstrap5-variables.css` với các biến CSS mới của Bootstrap 5. Để sử dụng file này:

1. Thêm link đến file CSS này trong tất cả các file HTML của bạn, trước file style.css chính:

```html
<link rel="stylesheet" href="../../assets/css/bootstrap5-variables.css">
<link rel="stylesheet" href="../../assets/css/style.css">
```

(Điều chỉnh đường dẫn tương đối phù hợp với cấu trúc thư mục nếu cần)

## 3. Tối ưu hóa hiệu suất

Để tối ưu hóa hiệu suất các trang, hãy thực hiện các bước sau:

### 3.1. Giảm thiểu sử dụng jQuery

```javascript
// Thay đổi
$(element).addClass('active');

// Thành
element.classList.add('active');
```

### 3.2. Sử dụng các tính năng mới của Bootstrap 5

- Chuyển từ `.badge-pill` sang `.rounded-pill`
- Chuyển từ `.badge-[color]` sang `.bg-[color]`
- Chuyển từ các lớp hướng không gian như `pl-4` sang `ps-4`
- Chuyển từ `text-left` sang `text-start`, từ `text-right` sang `text-end`
- Thay đổi các thuộc tính data từ `data-toggle` sang `data-bs-toggle`

### 3.3. Lazy loading cho hình ảnh

Thêm thuộc tính `loading="lazy"` cho các thẻ hình ảnh không nằm trên màn hình đầu tiên:

```html
<img src="assets/images/dashboard/circle.svg" class="card-img-absolute" alt="circle-image" loading="lazy">
```

## 4. Áp dụng Dark Mode (Tùy chọn)

Bootstrap 5 có hỗ trợ tốt hơn cho dark mode. File `bootstrap5-variables.css` đã bao gồm các biến cho dark mode.

Thêm đoạn mã sau vào file JavaScript của bạn để bật/tắt dark mode:

```javascript
// Thêm vào file template.js
document.getElementById('darkModeToggle').addEventListener('click', function() {
  document.body.classList.toggle('dark-theme');
  
  // Lưu cài đặt vào localStorage
  if(document.body.classList.contains('dark-theme')) {
    localStorage.setItem('theme', 'dark');
  } else {
    localStorage.setItem('theme', 'light');
  }
});

// Kiểm tra cài đặt theme khi tải trang
(function() {
  const savedTheme = localStorage.getItem('theme');
  if(savedTheme === 'dark') {
    document.body.classList.add('dark-theme');
  }
})();
```

## 5. Xử lý các vấn đề còn lại

### 5.1. Các Badge còn lại

Kiểm tra và chuyển đổi các badge còn lại như:

```html
<div class="badge badge-opacity-warning">In progress</div>
```

Sang:

```html
<div class="badge bg-warning bg-opacity-25">In progress</div>
```

### 5.2. Các phiên bản còn lại của input groups

Chuyển đổi từ:

```html
<div class="input-group">
  <div class="input-group-prepend">
    <span class="input-group-text bg-primary">
      <i class="mdi mdi-account-outline text-white"></i>
    </span>
  </div>
  <input type="text" class="form-control" placeholder="Username">
</div>
```

Sang:

```html
<div class="input-group">
  <span class="input-group-text bg-primary">
    <i class="mdi mdi-account-outline text-white"></i>
  </span>
  <input type="text" class="form-control" placeholder="Username">
</div>
```

### 5.3. Cập nhật Form Elements

Form elements được cập nhật như sau:

1. Thêm `.form-label` cho các nhãn form:
   ```html
   <label for="inputField" class="form-label">Input Field</label>
   ```

2. Sử dụng `.form-select` cho các dropdown thay vì `.form-control`:
   ```html 
   <select class="form-select" id="exampleSelect">
     <option>Option 1</option>
     <option>Option 2</option>
   </select>
   ```

3. Cập nhật `.form-group` thành class `.mb-3` cho spacing:
   ```html
   <div class="form-group mb-3">
     <!-- form content -->
   </div>
   ```

4. Cập nhật form checks:
   ```html
   <!-- Trước đây -->
   <div class="form-check form-check-flat form-check-primary">
     <label class="form-check-label">
       <input type="checkbox" class="form-check-input"> Option
     </label>
   </div>

   <!-- Bootstrap 5 -->
   <div class="form-check form-check-flat form-check-primary mb-3">
     <input type="checkbox" class="form-check-input" id="check1">
     <label class="form-check-label" for="check1">Option</label>
   </div>
   ```

### 5.4. Cập nhật Typography

Bootstrap 5 bổ sung thêm 2 class display mới:
- `.display-5`
- `.display-6`

Các lớp khoảng cách cũng cần được cập nhật:
- `.pl-*` thành `.ps-*` (padding-left → padding-start)
- `.pr-*` thành `.pe-*` (padding-right → padding-end)
- `.ml-*` thành `.ms-*` (margin-left → margin-start)
- `.mr-*` thành `.me-*` (margin-right → margin-end)

### 5.5. Charts và JavaScript

Đã cập nhật Chart.js để tương thích với Bootstrap 5 và sử dụng Vanilla JS thay vì jQuery:

```javascript
// Thay vì
if ($("#barChart").length) {
  var barChartCanvas = $("#barChart").get(0).getContext("2d");
  // ...
}

// Chuyển sang
if (document.getElementById("barChart")) {
  var barChartCanvas = document.getElementById("barChart").getContext("2d");
  // ...
}
```

## 6. Tối ưu hóa tự động

Để giúp tự động hóa quá trình cập nhật, chúng tôi đã tạo file `bs5-optimize.js` - một công cụ tự động sửa các class và thuộc tính Bootstrap 4 còn sót lại trong DOM khi trang web được tải. Thêm script này để bắt các vấn đề còn tồn tại:

```html
<script src="../../assets/js/bs5-optimize.js"></script>
```

## 7. Kiểm tra tương thích

Sau khi thực hiện tất cả các thay đổi, hãy đảm bảo rằng bạn kiểm tra tính tương thích trên các trình duyệt khác nhau:
- Chrome, Firefox, Safari, Edge mới nhất
- Các thiết bị iOS và Android

## 8. Cân nhắc trong tương lai

- Loại bỏ jQuery hoàn toàn: Bootstrap 5 không còn phụ thuộc vào jQuery
- Cập nhật thêm về hiệu suất: Sử dụng hình ảnh định dạng WebP, tối ưu hóa CSS
- Xem xét việc kết hợp với các công nghệ khác như:
  - CSS Grid cho bố cục hiện đại
  - CSS Custom Properties thay cho SCSS variables
  - Progressive Web App (PWA)

```html
<div class="input-group">
  <span class="input-group-addon input-group-prepend">
    <span class="input-group-text">@</span>
  </span>
  <input class="form-control" type="text">
</div>
```

Sang:

```html
<div class="input-group">
  <span class="input-group-text">@</span>
  <input class="form-control" type="text">
</div>
```

## Kết luận

Việc chuyển đổi từ Bootstrap 4 sang Bootstrap 5 đã gần hoàn thành. Các thay đổi còn lại chủ yếu liên quan đến việc tinh chỉnh các component để sử dụng hiệu quả các tính năng mới của Bootstrap 5 và tối ưu hóa hiệu suất template.
