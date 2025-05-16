(function () {
  'use strict';
  document.addEventListener('DOMContentLoaded', function() {
    var body = document.body;
    var contentWrapper = document.querySelector('.content-wrapper');
    var scroller = document.querySelector('.container-scroller');
    var footer = document.querySelector('.footer');
    var sidebar = document.querySelector('.sidebar');

    //Add active class to nav-link based on url dynamically
    //Active class can be hard coded directly in html file also as required

    function addActiveClass(element) {
      if (current === "") {
        //for root url
        if (element.getAttribute('href').indexOf("index.html") !== -1) {
          let parentNavItem = element.closest('.nav-item');
          if(parentNavItem) parentNavItem.classList.add('active');
          
          if (element.closest('.sub-menu')) {
            let collapse = element.closest('.collapse');
            if(collapse) collapse.classList.add('show');
            element.classList.add('active');
          }
        }
      } else {
        //for other url
        if (element.getAttribute('href').indexOf(current) !== -1) {
          let parentNavItem = element.closest('.nav-item');
          if(parentNavItem) parentNavItem.classList.add('active');
          
          if (element.closest('.sub-menu')) {
            let collapse = element.closest('.collapse');
            if(collapse) collapse.classList.add('show');
            element.classList.add('active');
          }
          
          if (element.closest('.submenu-item')) {
            element.classList.add('active');
          }
        }
      }
    }

    var current = location.pathname.split("/").slice(-1)[0].replace(/^\/|\/$/g, '');
    
    document.querySelectorAll('.nav li a').forEach(function(element) {
      if (element.closest('.sidebar')) {
        addActiveClass(element);
      }
    });

    document.querySelectorAll('.horizontal-menu .nav li a').forEach(function(element) {
      addActiveClass(element);
    });

    //Close other submenu in sidebar on opening any
    if (sidebar) {
      sidebar.addEventListener('show.bs.collapse', function(e) {
        let openedCollapses = sidebar.querySelectorAll('.collapse.show');
        openedCollapses.forEach(collapse => {
          if (collapse !== e.target) {
            bootstrap.Collapse.getInstance(collapse).hide();
          }
        });
      });
    }


    //Change sidebar and content-wrapper height
    applyStyles();

    function applyStyles() {
      //Applying perfect scrollbar
      if (!body.classList.contains("rtl")) {
        const settingsPanel = document.querySelector('.settings-panel .tab-content .tab-pane.scroll-wrapper');
        if (settingsPanel) {
          const settingsPanelScroll = new PerfectScrollbar(settingsPanel);
        }
        
        const chats = document.querySelector('.chats');
        if (chats) {
          const chatsScroll = new PerfectScrollbar(chats);
        }
        
        if (body.classList.contains("sidebar-fixed")) {
          const sidebarNav = document.querySelector('#sidebar .nav');
          if (sidebarNav) {
            var fixedSidebarScroll = new PerfectScrollbar(sidebarNav);
          }
        }
      }
    }

    document.querySelectorAll('[data-bs-toggle="minimize"]').forEach(function(element) {
      element.addEventListener("click", function () {
        if ((body.classList.contains('sidebar-toggle-display')) || (body.classList.contains('sidebar-absolute'))) {
          body.classList.toggle('sidebar-hidden');
        } else {
          body.classList.toggle('sidebar-icon-only');
        }
      });
    });

    //checkbox and radios
    document.querySelectorAll(".form-check label,.form-radio label").forEach(function(label) {
      const helper = document.createElement('i');
      helper.className = 'input-helper';
      label.appendChild(helper);
    });

    //Horizontal menu in mobile
    document.querySelectorAll('[data-bs-toggle="horizontal-menu-toggle"]').forEach(function(element) {
      element.addEventListener("click", function () {
        document.querySelector(".horizontal-menu .bottom-navbar").classList.toggle("header-toggled");
      });
    });
    
    // Horizontal menu navigation in mobile menu on click
    const navItems = document.querySelectorAll('.horizontal-menu .page-navigation > .nav-item');
    navItems.forEach(function(item) {
      item.addEventListener("click", function (event) {
        if (window.matchMedia('(max-width: 991px)').matches) {
          if (!item.classList.contains('show-submenu')) {
            navItems.forEach(function(navItem) {
              navItem.classList.remove('show-submenu');
            });
          }
          item.classList.toggle('show-submenu');
        }
      });
    })

    window.addEventListener('scroll', function () {
      if (window.matchMedia('(min-width: 992px)').matches) {
        var header = document.querySelector('.horizontal-menu');
        if(header) {
          if (window.scrollY >= 70) {
            header.classList.add('fixed-on-scroll');
          } else {
            header.classList.remove('fixed-on-scroll');
          }
        }
      }
    });
    
    // Datepicker initialization has been moved to datepicker-vanilla.js

  });

  //check all boxes in order status 
  const checkAll = document.getElementById('check-all');
  if(checkAll) {
    checkAll.addEventListener('click', function() {
      document.querySelectorAll(".form-check-input").forEach(function(input) {
        input.checked = checkAll.checked;
      });
    });
  }

  // focus input when clicking on search icon
  const searchIcon = document.getElementById('navbar-search-icon');
  if(searchIcon) {
    searchIcon.addEventListener('click', function() {
      document.getElementById("navbar-search-input").focus();
    });
  }

  // Header light class on scroll
  window.addEventListener('scroll', function() {
    var scroll = window.scrollY;

    //>=, not <=
    if (scroll >= 97) {
      //clearHeader, not clearheader - caps H
      document.querySelector(".fixed-top")?.classList.add("headerLight");
    }
    else {
      document.querySelector(".fixed-top")?.classList.remove("headerLight");
    }
  });

})();