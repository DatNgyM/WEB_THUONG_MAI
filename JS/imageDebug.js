/**
 * Image Debug Tool
 * This utility helps diagnose issues with image loading in the product listings and details pages.
 * 
 * Usage:
 * 1. Include this script in your HTML: <script src="/JS/imageDebug.js"></script>
 * 2. Add data-debug="true" to any <img> tag you want to monitor
 * 3. Open browser console to see detailed logs about image loading
 */

// Setup the global debug state
window.imageDebugEnabled = localStorage.getItem('imageDebugEnabled') === 'true';

// Initialize the image debug tool
function initImageDebugTool() {
    console.log('Image Debug Tool initialized');
    
    // Add a toggle button to the page
    const debugButton = document.createElement('button');
    debugButton.textContent = window.imageDebugEnabled ? 'Disable Image Debug' : 'Enable Image Debug';
    debugButton.style.position = 'fixed';
    debugButton.style.bottom = '10px';
    debugButton.style.right = '10px';
    debugButton.style.zIndex = '9999';
    debugButton.style.backgroundColor = window.imageDebugEnabled ? '#ff4d4d' : '#4CAF50';
    debugButton.style.color = 'white';
    debugButton.style.border = 'none';
    debugButton.style.padding = '8px 12px';
    debugButton.style.borderRadius = '4px';
    debugButton.style.cursor = 'pointer';
    
    debugButton.addEventListener('click', function() {
        window.imageDebugEnabled = !window.imageDebugEnabled;
        localStorage.setItem('imageDebugEnabled', window.imageDebugEnabled);
        this.textContent = window.imageDebugEnabled ? 'Disable Image Debug' : 'Enable Image Debug';
        this.style.backgroundColor = window.imageDebugEnabled ? '#ff4d4d' : '#4CAF50';
        location.reload(); // Reload to apply debug mode
    });
    
    document.body.appendChild(debugButton);
    
    if (window.imageDebugEnabled) {
        // Add visual indicators to all images
        monitorAllImages();
        // Add debug info overlay
        createDebugInfoOverlay();
    }
}

// Function to monitor all images on the page
function monitorAllImages() {
    const images = document.querySelectorAll('img');
    
    images.forEach((img, index) => {
        // Add a border to indicate we're monitoring this image
        img.style.border = '2px dashed orange';
        
        // Add an index number to each image
        const indexDiv = document.createElement('div');
        indexDiv.textContent = `#${index}`;
        indexDiv.style.position = 'absolute';
        indexDiv.style.top = '0';
        indexDiv.style.left = '0';
        indexDiv.style.backgroundColor = 'orange';
        indexDiv.style.color = 'black';
        indexDiv.style.padding = '2px 5px';
        indexDiv.style.fontSize = '10px';
        
        // Make the parent position relative if needed
        const parent = img.parentElement;
        if (window.getComputedStyle(parent).position === 'static') {
            parent.style.position = 'relative';
        }
        
        parent.appendChild(indexDiv);
        
        // Add debug attributes
        img.setAttribute('data-debug-id', index);
        img.setAttribute('data-original-src', img.src);
        
        // Monitor for load/error events
        img.addEventListener('load', function() {
            console.log(`Image #${index} loaded successfully:`, this.src);
            this.style.border = '2px solid green';
            updateDebugInfo(`Image #${index} loaded: ${this.src}`);
        });
        
        img.addEventListener('error', function() {
            console.error(`Image #${index} failed to load:`, this.src);
            this.style.border = '2px solid red';
            updateDebugInfo(`Image #${index} FAILED: ${this.src}`, 'error');
            
            // Add an error overlay
            const errorDiv = document.createElement('div');
            errorDiv.textContent = 'IMAGE ERROR';
            errorDiv.style.position = 'absolute';
            errorDiv.style.top = '50%';
            errorDiv.style.left = '50%';
            errorDiv.style.transform = 'translate(-50%, -50%)';
            errorDiv.style.backgroundColor = 'rgba(255, 0, 0, 0.7)';
            errorDiv.style.color = 'white';
            errorDiv.style.padding = '5px';
            errorDiv.style.fontSize = '12px';
            
            this.parentElement.appendChild(errorDiv);
        });
    });
}

// Create a debug info overlay
function createDebugInfoOverlay() {
    const overlay = document.createElement('div');
    overlay.id = 'image-debug-overlay';
    overlay.style.position = 'fixed';
    overlay.style.bottom = '50px';
    overlay.style.right = '10px';
    overlay.style.width = '300px';
    overlay.style.maxHeight = '200px';
    overlay.style.overflow = 'auto';
    overlay.style.backgroundColor = 'rgba(0,0,0,0.8)';
    overlay.style.color = 'white';
    overlay.style.padding = '10px';
    overlay.style.zIndex = '9998';
    overlay.style.fontSize = '12px';
    overlay.style.fontFamily = 'monospace';
    overlay.style.borderRadius = '5px';
    
    const header = document.createElement('div');
    header.textContent = '📷 IMAGE DEBUG LOG';
    header.style.borderBottom = '1px solid #555';
    header.style.paddingBottom = '5px';
    header.style.marginBottom = '5px';
    header.style.fontWeight = 'bold';
    
    const logList = document.createElement('div');
    logList.id = 'image-debug-log';
    
    overlay.appendChild(header);
    overlay.appendChild(logList);
    document.body.appendChild(overlay);
}

// Update the debug info
function updateDebugInfo(message, type = 'info') {
    const logList = document.getElementById('image-debug-log');
    if (!logList) return;
    
    const entry = document.createElement('div');
    entry.textContent = `${new Date().toLocaleTimeString()}: ${message}`;
    entry.style.borderBottom = '1px dotted #333';
    entry.style.paddingBottom = '3px';
    entry.style.marginBottom = '3px';
    
    if (type === 'error') {
        entry.style.color = '#ff6666';
    }
    
    logList.prepend(entry);
    
    // Limit entries
    if (logList.childNodes.length > 20) {
        logList.removeChild(logList.lastChild);
    }
}

// Monitor AJAX requests that might load product data
function monitorAjaxRequests() {
    const originalFetch = window.fetch;
    window.fetch = function() {
        const url = arguments[0];
        if (url.includes('/api/products')) {
            console.log('Product API request detected:', url);
            updateDebugInfo(`API call: ${url}`);
        }
        
        return originalFetch.apply(this, arguments)
            .then(response => {
                if (url.includes('/api/products')) {
                    updateDebugInfo(`API response: ${response.status} ${response.statusText}`);
                    if (!response.ok) {
                        updateDebugInfo(`API error: ${response.status} ${response.statusText}`, 'error');
                    }
                }
                return response;
            })
            .catch(error => {
                if (url.includes('/api/products')) {
                    updateDebugInfo(`API exception: ${error.message}`, 'error');
                }
                throw error;
            });
    };
}

// Initialize the tool when the page is fully loaded
window.addEventListener('load', function() {
    if (document.querySelector('img')) {
        initImageDebugTool();
        
        if (window.imageDebugEnabled) {
            monitorAjaxRequests();
        }
    }
});
