// Script đơn giản để vô hiệu hóa các handler form trùng lặp
console.log('Initializing form conflict resolver');

document.addEventListener('DOMContentLoaded', function() {
  console.log('Cleaning up duplicate form handlers');
  
  // Vô hiệu hóa add-product-form.js nếu có
  if (typeof window.originalAddProductFormHandler === 'undefined') {
    window.originalAddProductFormHandler = true;
    
    // Vô hiệu hóa tất cả các sự kiện nút submit
    const submitButton = document.querySelector('button[type="submit"]');
    if (submitButton) {
      const newButton = submitButton.cloneNode(true);
      submitButton.parentNode.replaceChild(newButton, submitButton);
      console.log('Reset submit button');
    }
  }
  
  // Hiển thị thông tin về các script
  const scripts = Array.from(document.querySelectorAll('script')).map(s => s.src || 'inline');
  console.log('Scripts loaded:', scripts);
});
