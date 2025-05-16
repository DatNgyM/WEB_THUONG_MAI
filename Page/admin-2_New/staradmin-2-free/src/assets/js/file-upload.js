// Bootstrap 5 version - converted from jQuery to vanilla JS
(function() {
  'use strict';
  document.addEventListener('DOMContentLoaded', function() {
    document.querySelectorAll('.file-upload-browse').forEach(function(element) {
      element.addEventListener('click', function() {
        const fileInput = this.parentNode.parentNode.parentNode.querySelector('.file-upload-default');
        if (fileInput) {
          fileInput.click();
        }
      });
    });

    document.querySelectorAll('.file-upload-default').forEach(function(element) {
      element.addEventListener('change', function() {
        const formControl = this.parentNode.querySelector('.form-control');
        if (formControl) {
          formControl.value = this.value.replace(/C:\\fakepath\\/i, '');
        }
      });
    });
  });
})();