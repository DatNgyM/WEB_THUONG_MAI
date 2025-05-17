// Debug utility for admin product management
console.log('Debug script loaded for product management');

window.debugProduct = {
  logFormData: function(formData) {
    console.group('Form Data Contents:');
    for (let pair of formData.entries()) {
      console.log(pair[0] + ': ' + (pair[1] instanceof File ? `File: ${pair[1].name}` : pair[1]));
    }
    console.groupEnd();
    return formData; // For chaining
  },
    logApiResponse: async function(response) {
    console.group('API Response:');
    console.log('Status:', response.status, response.statusText);
    console.log('Headers:', [...response.headers].reduce((obj, [key, value]) => {
      obj[key] = value;
      return obj;
    }, {}));
    
    try {
      // Clone response để không ảnh hưởng đến response gốc
      const clonedResponse = response.clone();
      
      try {
        const data = await clonedResponse.json();
        console.log('Response Body (JSON):', data);
      } catch (e) {
        const text = await clonedResponse.text();
        console.log('Response Body (Text):', text.substring(0, 500) + (text.length > 500 ? '...' : ''));
      }
    } catch (err) {
      console.error('Không thể đọc body response:', err);
    }
    
    console.groupEnd();
    return response; // For chaining
  },
  
  trackRedirect: function() {
    console.log('Current URL:', window.location.href);
    const urlParams = new URLSearchParams(window.location.search);
    const params = {};
    for (const [key, value] of urlParams.entries()) {
      params[key] = value;
    }
    console.log('URL Parameters:', params);
  }
};

// Execute immediately
window.debugProduct.trackRedirect();
