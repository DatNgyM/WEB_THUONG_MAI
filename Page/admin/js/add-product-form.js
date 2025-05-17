// Script để xử lý form thêm sản phẩm
document.addEventListener('DOMContentLoaded', function() {
  // Chọn form từ DOM
  const form = document.getElementById('addProductForm');
  
  if (!form) {
    console.error('Không tìm thấy form thêm sản phẩm!');
    return;
  }
  
  // Xử lý sự kiện submit form
  form.addEventListener('submit', async function(event) {
    // Ngăn form submit mặc định
    event.preventDefault();
    
    console.log('Form submitted!', new Date().toISOString());
    
    // Kiểm tra validation
    if (!form.checkValidity()) {
      event.stopPropagation();
      form.classList.add('was-validated');
      console.error('Form không hợp lệ, vui lòng kiểm tra lại');
      return;
    }
    
    form.classList.add('was-validated');
    
    try {
      // Tạo overlay loading
      const loadingOverlay = document.createElement('div');
      loadingOverlay.className = 'loading-overlay';
      loadingOverlay.innerHTML = `
        <div class="loading-spinner"></div>
        <div class="loading-text">Đang xử lý thêm sản phẩm...</div>
      `;
      document.body.appendChild(loadingOverlay);
      
      // Lấy dữ liệu từ form
      const formData = new FormData(form);
      
      // Thêm seller_id mặc định
      formData.append('seller_id', 1);
      
      // Log dữ liệu form
      console.group('Form data');
      for (const pair of formData.entries()) {
        console.log(pair[0] + ': ' + (pair[1] instanceof File ? 
          `File: ${pair[1].name} (${pair[1].size} bytes)` : pair[1]));
      }
      console.groupEnd();
      
      // Kiểm tra giá trị số lượng và giá tiền
      const price = parseFloat(formData.get('price'));
      const stock = parseInt(formData.get('stock_quantity'));
      
      if (isNaN(price) || price < 0 || price >= 100000000) {
        throw new Error('Giá sản phẩm không hợp lệ. Vui lòng nhập giá nhỏ hơn 100.000.000');
      }
      
      if (isNaN(stock) || stock < 0) {
        formData.set('stock_quantity', '0');
        console.log('Số lượng không hợp lệ, đã đặt mặc định là 0');
      }
      
      console.log('Đang gửi dữ liệu đến server...');
      
      // Gửi request POST
      const response = await fetch('/api/admin/products', {
        method: 'POST',
        body: formData
      });
      
      console.log('Server response:', response.status, response.statusText);
      
      if (!response.ok) {
        const errorData = await response.json().catch(e => ({ error: response.statusText }));
        throw new Error(errorData.details || errorData.error || 'Lỗi không xác định');
      }
      
      // Xử lý phản hồi thành công
      const responseData = await response.json();
      console.log('Sản phẩm đã được thêm thành công:', responseData);
      
      // Thông báo thành công và chuyển hướng
      alert('Sản phẩm đã được thêm thành công!');
      window.location.href = 'products.html?success=true&newProductId=' + 
        (responseData.product ? responseData.product.id : '');
        
    } catch (error) {
      console.error('Lỗi khi thêm sản phẩm:', error);
      alert('Lỗi: ' + error.message);
    } finally {
      // Xóa overlay loading
      const loadingOverlay = document.querySelector('.loading-overlay');
      if (loadingOverlay) {
        loadingOverlay.remove();
      }
    }
  });
});
