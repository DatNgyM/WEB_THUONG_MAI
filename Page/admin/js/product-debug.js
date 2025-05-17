// Test functions for product management
// This script can be loaded in the browser console to debug product management functionality

// Function to simulate a new product arrival
function simulateNewProduct(productId) {
  const urlParams = new URLSearchParams(window.location.search);
  urlParams.set('success', 'true');
  urlParams.set('newProductId', productId || '1');
  window.history.replaceState({}, '', `${window.location.pathname}?${urlParams.toString()}`);
  console.log('URL updated with new product parameters');
  
  // Refresh products to test highlighting
  if (typeof fetchProducts === 'function') {
    fetchProducts();
    console.log('Refreshed products to trigger highlighting');
  } else {
    console.error('fetchProducts function not found');
  }
}

// Function to test API connection
async function testProductAPI() {
  console.log('Testing product API connection...');
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 5000);
    
    const response = await fetch('/api/admin/products', {
      signal: controller.signal
    });
    
    clearTimeout(timeoutId);
    
    if (!response.ok) {
      throw new Error(`API error: ${response.status} ${response.statusText}`);
    }
    
    const data = await response.json();
    console.log('API connection successful!');
    console.log(`Retrieved ${data.length} products`);
    return data;
  } catch (error) {
    console.error('API connection failed:', error);
    return null;
  }
}

// Function to check if all components are loaded properly
function checkComponentsLoaded() {
  console.log('Checking if all components are loaded properly...');
  
  // Check for required functions
  const functions = [
    'fetchProducts',
    'renderProductTable',
    'updatePagination',
    'showNotification'
  ];
  
  const missingFunctions = functions.filter(fn => typeof window[fn] !== 'function');
  
  if (missingFunctions.length > 0) {
    console.error('Missing functions:', missingFunctions);
    return false;
  }
  
  console.log('All required functions are loaded!');
  
  // Check for required DOM elements
  const elements = [
    'table tbody',
    '.pagination'
  ];
  
  const missingElements = elements.filter(selector => !document.querySelector(selector));
  
  if (missingElements.length > 0) {
    console.error('Missing DOM elements:', missingElements);
    return false;
  }
  
  console.log('All required DOM elements are present!');
  return true;
}

// Display usage instructions
console.log(`
===== Product Management Debug Tools =====
The following functions are available:

1. simulateNewProduct(productId)
   - Simulates a newly added product with highlighting
   - Example: simulateNewProduct(5)
   
2. testProductAPI()
   - Tests the connection to the product API
   - Example: await testProductAPI()
   
3. checkComponentsLoaded()
   - Checks if all required components are loaded
   - Example: checkComponentsLoaded()
   
====================================
`);
