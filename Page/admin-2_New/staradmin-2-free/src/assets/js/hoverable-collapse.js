(function() {
  'use strict';
  //Open submenu on hover in compact sidebar mode and horizontal menu mode
  document.addEventListener('DOMContentLoaded', function() {
    const sidebarNavItems = document.querySelectorAll('.sidebar .nav-item');
    
    sidebarNavItems.forEach(function(navItem) {
      navItem.addEventListener('mouseenter', handleMouseEvent);
      navItem.addEventListener('mouseleave', handleMouseEvent);
    });
    
    function handleMouseEvent(ev) {
      var body = document.body;
      var sidebarIconOnly = body.classList.contains("sidebar-icon-only");
      var sidebarFixed = body.classList.contains("sidebar-fixed");
      
      if (!('ontouchstart' in document.documentElement)) {
        if (sidebarIconOnly) {
          if (sidebarFixed) {
            if (ev.type === 'mouseenter') {
              body.classList.remove('sidebar-icon-only');
            }
          } else {
            var menuItem = ev.currentTarget;
            if (ev.type === 'mouseenter') {
              menuItem.classList.add('hover-open');
            } else {
              menuItem.classList.remove('hover-open');
            }
          }
        }
      }
    }
  });
})();