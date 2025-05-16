(function() {
  'use strict';
  document.addEventListener('DOMContentLoaded', function() {
    document.querySelectorAll('[data-bs-toggle="offcanvas"]').forEach(function(element) {
      element.addEventListener('click', function() {
        document.querySelector('.sidebar-offcanvas')?.classList.toggle('active');
      });
    });
  });
})();