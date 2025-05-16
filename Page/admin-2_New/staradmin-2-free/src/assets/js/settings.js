(function() {
  'use strict';
  document.addEventListener('DOMContentLoaded', function() {
    document.querySelectorAll(".nav-settings").forEach(function(el) {
      el.addEventListener("click", function() {
        document.getElementById("right-sidebar")?.classList.toggle("open");
      });
    });
    
    document.querySelectorAll(".settings-close").forEach(function(el) {
      el.addEventListener("click", function() {
        document.getElementById("right-sidebar")?.classList.remove("open");
        document.getElementById("theme-settings")?.classList.remove("open");
      });
    });

    document.getElementById("settings-trigger")?.addEventListener("click", function(){
      document.getElementById("theme-settings")?.classList.toggle("open");
    });

    //background constants
    var navbar_classes = "navbar-danger navbar-success navbar-warning navbar-dark navbar-light navbar-primary navbar-info navbar-pink";
    var sidebar_classes = "sidebar-light sidebar-dark";
    var body = document.body;

    //sidebar backgrounds
    document.getElementById("sidebar-light-theme")?.addEventListener("click", function(){
      sidebar_classes.split(" ").forEach(function(cls) {
        body.classList.remove(cls);
      });
      body.classList.add("sidebar-light");
      document.querySelectorAll(".sidebar-bg-options").forEach(function(el) {
        el.classList.remove("selected");
      });
      this.classList.add("selected");
    });
    
    document.getElementById("sidebar-dark-theme")?.addEventListener("click", function(){
      sidebar_classes.split(" ").forEach(function(cls) {
        body.classList.remove(cls);
      });
      body.classList.add("sidebar-dark");
      document.querySelectorAll(".sidebar-bg-options").forEach(function(el) {
        el.classList.remove("selected");
      });
      this.classList.add("selected");
    });


    //Navbar Backgrounds
    document.querySelector(".tiles.primary")?.addEventListener("click", function(){
      document.querySelectorAll(".navbar").forEach(function(el) {
        navbar_classes.split(" ").forEach(function(cls) {
          el.classList.remove(cls);
        });
        el.classList.add("navbar-primary");
      });
      document.querySelectorAll(".tiles").forEach(function(el) {
        el.classList.remove("selected");
      });
      this.classList.add("selected");
    });
    
    document.querySelector(".tiles.success")?.addEventListener("click", function(){
      document.querySelectorAll(".navbar").forEach(function(el) {
        navbar_classes.split(" ").forEach(function(cls) {
          el.classList.remove(cls);
        });
        el.classList.add("navbar-success");
      });
      document.querySelectorAll(".tiles").forEach(function(el) {
        el.classList.remove("selected");
      });
      this.classList.add("selected");
    });
    
    document.querySelector(".tiles.warning")?.addEventListener("click", function(){
      document.querySelectorAll(".navbar").forEach(function(el) {
        navbar_classes.split(" ").forEach(function(cls) {
          el.classList.remove(cls);
        });
        el.classList.add("navbar-warning");
      });
      document.querySelectorAll(".tiles").forEach(function(el) {
        el.classList.remove("selected");
      });
      this.classList.add("selected");
    });
    
    document.querySelector(".tiles.danger")?.addEventListener("click", function(){
      document.querySelectorAll(".navbar").forEach(function(el) {
        navbar_classes.split(" ").forEach(function(cls) {
          el.classList.remove(cls);
        });
        el.classList.add("navbar-danger");
      });
      document.querySelectorAll(".tiles").forEach(function(el) {
        el.classList.remove("selected");
      });
      this.classList.add("selected");
    });
    
    document.querySelector(".tiles.light")?.addEventListener("click", function(){
      document.querySelectorAll(".navbar").forEach(function(el) {
        navbar_classes.split(" ").forEach(function(cls) {
          el.classList.remove(cls);
        });
        el.classList.add("navbar-light");
      });
      document.querySelectorAll(".tiles").forEach(function(el) {
        el.classList.remove("selected");
      });
      this.classList.add("selected");
    });
    
    document.querySelector(".tiles.info")?.addEventListener("click", function(){
      document.querySelectorAll(".navbar").forEach(function(el) {
        navbar_classes.split(" ").forEach(function(cls) {
          el.classList.remove(cls);
        });
        el.classList.add("navbar-info");
      });
      document.querySelectorAll(".tiles").forEach(function(el) {
        el.classList.remove("selected");
      });
      this.classList.add("selected");
    });
    
    document.querySelector(".tiles.dark")?.addEventListener("click", function(){
      document.querySelectorAll(".navbar").forEach(function(el) {
        navbar_classes.split(" ").forEach(function(cls) {
          el.classList.remove(cls);
        });
        el.classList.add("navbar-dark");
      });
      document.querySelectorAll(".tiles").forEach(function(el) {
        el.classList.remove("selected");
      });
      this.classList.add("selected");
    });
    
    document.querySelector(".tiles.default")?.addEventListener("click", function(){
      document.querySelectorAll(".navbar").forEach(function(el) {
        navbar_classes.split(" ").forEach(function(cls) {
          el.classList.remove(cls);
        });
      });
      document.querySelectorAll(".tiles").forEach(function(el) {
        el.classList.remove("selected");
      });
      this.classList.add("selected");
    });

    document.querySelector(".color-theme.default")?.addEventListener("click", function(){
      const themeLink = document.querySelector(".color-theme.default");
      if (themeLink) {
        themeLink.setAttribute("href", "assets/css/style.css");
        themeLink.setAttribute("title", "Light");
      }
    });
    
    document.querySelector(".color-theme.dark")?.addEventListener("click", function(){
      const themeLink = document.querySelector(".color-theme.dark");
      if (themeLink) {
        themeLink.setAttribute("href", "assets/css/style.css");
        themeLink.setAttribute("title", "Dark");
      }
    });
    
    document.querySelector(".color-theme.brown")?.addEventListener("click", function(){
      const themeLink = document.querySelector(".color-theme.brown");
      if (themeLink) {
        themeLink.setAttribute("href", "assets/css/style.css");
        themeLink.setAttribute("title", "Brown");
      }
    });
  });
})();
