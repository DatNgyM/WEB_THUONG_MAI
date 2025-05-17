// Fix for product form submission
// This script completely replaces the existing form submission handler
// and correctly handles the product addition process

document.addEventListener('DOMContentLoaded', function() {
  console.log('Product form fix loaded');
  
  // Remove existing event listeners from the submit button
  const submitButton = document.querySelector('button[type="submit"]');
  if (submitButton) {
    const newSubmitButton = submitButton.cloneNode(true);
    submitButton.parentNode.replaceChild(newSubmitButton, submitButton);
    
    // Add new event listener
    newSubmitButton.addEventListener('click', handleProductSubmit);
  }
  
  // Get form reference
  const form = document.getElementById('addProductForm');
  
  // Add our own submit handler to the form
  if (form) {
    // Remove the existing onsubmit attribute if it exists
    form.removeAttribute('onsubmit');
    
    // Add our handler
    form.addEventListener('submit', handleProductSubmit);
  }
  
  // Main function to handle product submission
  async function handleProductSubmit(event) {
    // Prevent default form submission
    event.preventDefault();
    console.log('Product submission handler called', new Date().toISOString());
    
    try {
      // Reference to the form
      const form = document.getElementById('addProductForm');
      
      // Validate form
      if (!form.checkValidity()) {
        console.log('Form validation failed');
        form.classList.add('was-validated');
        return;
      }
      
      // Show loading overlay
      showLoadingOverlay('Đang xử lý thêm sản phẩm...');
      
      // Get form data
      const formData = new FormData(form);
      
      // Đảm bảo rằng formData có seller_id
      if (!formData.has('seller_id')) {
        formData.append('seller_id', 1); // Default seller ID for admin
      }
      
      // Log the form data for debugging
      console.group('Form Data');
      for (const [key, value] of formData.entries()) {
        console.log(`${key}: ${value instanceof File ? value.name : value}`);
      }
      console.groupEnd();
      
      // Send the data
      console.log('Sending request to server...');
      const response = await fetch('/api/admin/products', {
        method: 'POST',
        body: formData,
        redirect: 'manual' // Important: prevent automatic redirects
      });
      
      console.log('Server response:', response.status, response.statusText);
      
      // Handle non-successful responses
      if (!response.ok) {
        let errorMessage = 'Lỗi khi thêm sản phẩm';
        
        try {
          const errorData = await response.json();
          errorMessage = errorData.error || errorData.details || errorMessage;
        } catch (jsonError) {
          // If we can't parse the JSON, use the status text
          errorMessage = `Lỗi ${response.status}: ${response.statusText}`;
        }
        
        throw new Error(errorMessage);
      }
        // Process successful response
      const data = await response.json();
      console.log('Product successfully added:', data);
      
      // Hiển thị thông báo thành công
      alert('Sản phẩm đã được thêm thành công!');
      
      // Redirect to the products page with success parameter
      setTimeout(() => {
        const productId = data.product ? data.product.id : '';
        window.location.href = `products.html?success=true&newProductId=${productId}`;
      }, 500);
      
    } catch (error) {
      console.error('Error adding product:', error);
      alert(`Lỗi: ${error.message}`);
    } finally {
      hideLoadingOverlay();
    }
  }
  
  // Helper function to show loading overlay
  function showLoadingOverlay(message) {
    // Remove any existing overlay first
    hideLoadingOverlay();
    
    // Create new overlay
    const overlay = document.createElement('div');
    overlay.className = 'loading-overlay';
    overlay.innerHTML = `
      <div class="loading-spinner"></div>
      <div class="loading-text">${message || 'Đang xử lý...'}</div>
    `;
    document.body.appendChild(overlay);
  }
  
  // Helper function to hide loading overlay
  function hideLoadingOverlay() {
    const existing = document.querySelector('.loading-overlay');
    if (existing) {
      existing.remove();
    }
  }
  
  console.log('Product form fix initialized successfully');
});
