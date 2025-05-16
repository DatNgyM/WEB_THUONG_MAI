/**
 * Vanilla JavaScript adapter for bootstrap-datepicker plugin
 * Makes the bootstrap-datepicker plugin work with vanilla JS instead of jQuery
 */
document.addEventListener('DOMContentLoaded', function() {
  const datepickerElements = document.querySelectorAll('.datepicker');
  
  // Initialize datepickers
  datepickerElements.forEach(function(element) {
    // Bootstrap-datepicker still requires jQuery, so we use it minimally just for the plugin
    if (window.jQuery && window.jQuery.fn.datepicker) {
      // Initialize with jQuery
      window.jQuery(element).datepicker({
        todayHighlight: true,
        autoclose: true,
        format: 'dd/mm/yyyy'
      });
    } else {
      console.warn('Bootstrap datepicker requires jQuery. Datepicker functionality will be disabled.');
    }  });

  // Navbar datepicker has been removed
  // No need to initialize it anymore
});