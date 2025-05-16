// Bootstrap 5 version - converted from jQuery to vanilla JS
// Note: Select2 still requires jQuery as a dependency, so we're 
// using a hybrid approach that minimizes jQuery usage
(function() {
  'use strict';

  document.addEventListener('DOMContentLoaded', function() {
    // Select2 requires jQuery to initialize
    if (typeof jQuery !== 'undefined') {
      const singleSelects = document.querySelectorAll(".js-example-basic-single");
      if (singleSelects.length > 0) {
        jQuery(".js-example-basic-single").select2();
      }
      
      const multipleSelects = document.querySelectorAll(".js-example-basic-multiple");
      if (multipleSelects.length > 0) {
        jQuery(".js-example-basic-multiple").select2();
      }
    } else {
      console.error('Select2 requires jQuery to function properly');
    }
  });
})();