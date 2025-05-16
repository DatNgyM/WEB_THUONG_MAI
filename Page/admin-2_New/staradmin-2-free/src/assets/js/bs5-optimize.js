// Script to optimize Bootstrap 5 template
document.addEventListener('DOMContentLoaded', function() {
  // 1. Update remaining badges
  const oldBadges = document.querySelectorAll('.badge-opacity-warning, .badge-opacity-success, .badge-opacity-danger');
  oldBadges.forEach(badge => {
    if (badge.classList.contains('badge-opacity-warning')) {
      badge.classList.remove('badge-opacity-warning');
      badge.classList.add('bg-warning', 'bg-opacity-25');
    } else if (badge.classList.contains('badge-opacity-success')) {
      badge.classList.remove('badge-opacity-success');
      badge.classList.add('bg-success', 'bg-opacity-25');
    } else if (badge.classList.contains('badge-opacity-danger')) {
      badge.classList.remove('badge-opacity-danger');
      badge.classList.add('bg-danger', 'bg-opacity-25');
    }
  });
  
  // 2. Optimize images with lazy loading
  const images = document.querySelectorAll('img:not([loading])');
  images.forEach(img => {
    // Skip images that are likely to be in the viewport initially
    const rect = img.getBoundingClientRect();
    if (rect.top > window.innerHeight) {
      img.setAttribute('loading', 'lazy');
    }
  });
  
  // 3. Add missing aria attributes for better accessibility
  document.querySelectorAll('[data-bs-toggle="tab"]').forEach(tab => {
    if (!tab.hasAttribute('aria-selected')) {
      tab.setAttribute('aria-selected', tab.classList.contains('active') ? 'true' : 'false');
    }
  });
  
  // 4. Fix any remaining form-control issues
  document.querySelectorAll('select.form-control').forEach(select => {
    select.classList.remove('form-control');
    select.classList.add('form-select');
  });
  
  // 5. Check for and fix any deprecated data attributes
  document.querySelectorAll('[data-toggle]').forEach(el => {
    const toggleValue = el.getAttribute('data-toggle');
    el.removeAttribute('data-toggle');
    el.setAttribute('data-bs-toggle', toggleValue);
  });
  
  document.querySelectorAll('[data-target]').forEach(el => {
    const targetValue = el.getAttribute('data-target');
    el.removeAttribute('data-target');
    el.setAttribute('data-bs-target', targetValue);
  });
  
  // 6. Update Bootstrap 4 badge classes to Bootstrap 5
  document.querySelectorAll('.badge-pill').forEach(el => {
    el.classList.remove('badge-pill');
    el.classList.add('rounded-pill');
  });
  
  document.querySelectorAll('[class*="badge-"]').forEach(el => {
    // Update badge-primary, badge-secondary, etc. to bg-primary, bg-secondary, etc.
    ['primary', 'secondary', 'success', 'danger', 'warning', 'info', 'light', 'dark'].forEach(color => {
      if (el.classList.contains(`badge-${color}`)) {
        el.classList.remove(`badge-${color}`);
        el.classList.add(`bg-${color}`);
      }
    });
  });
  
  // 6. Add appropriate touch action for better mobile experience
  document.querySelectorAll('.nav-link, .btn').forEach(el => {
    el.style.touchAction = 'manipulation';
  });
  
  // 7. Performance optimization
  // Defer offscreen images
  function deferOffscreenImages() {
    const images = document.querySelectorAll('img[loading="lazy"]');
    
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const img = entry.target;
          const src = img.getAttribute('data-src');
          
          if (src) {
            img.setAttribute('src', src);
            img.removeAttribute('data-src');
          }
          
          observer.unobserve(img);
        }
      });
    });
    
    images.forEach(img => {
      // Only observe images with data-src attribute
      if (img.hasAttribute('data-src')) {
        observer.observe(img);
      }
    });
  }
  
  // Call this function if you have images set up with data-src
  // deferOffscreenImages();
    // 8. Fix any remaining input group issues
  document.querySelectorAll('.input-group-prepend, .input-group-append').forEach(el => {
    // Remove prepend/append classes
    if (el.classList.contains('input-group-prepend')) {
      el.classList.remove('input-group-prepend');
    } else if (el.classList.contains('input-group-append')) {
      el.classList.remove('input-group-append');
    }
    
    // Update the input-group-text inside if needed
    const textEl = el.querySelector('.input-group-text');
    if (textEl) {
      // Already migrated
    }
  });
  
  // 9. Fix any float classes that need to be updated
  document.querySelectorAll('.float-left').forEach(el => {
    el.classList.remove('float-left');
    el.classList.add('float-start');
  });
  
  document.querySelectorAll('.float-right').forEach(el => {
    el.classList.remove('float-right');
    el.classList.add('float-end');
  });

  // 10. Add support for dark mode toggle if present
  const darkModeToggle = document.getElementById('darkModeToggle');
  if (darkModeToggle) {
    // Initialize dark mode based on saved preference
    const savedTheme = localStorage.getItem('theme');
    if(savedTheme === 'dark') {
      document.body.classList.add('dark-theme');
    }
    
    // Set up dark mode toggle
    darkModeToggle.addEventListener('click', function() {
      document.body.classList.toggle('dark-theme');
      
      if(document.body.classList.contains('dark-theme')) {
        localStorage.setItem('theme', 'dark');
      } else {
        localStorage.setItem('theme', 'light');
      }
    });
  }
});
