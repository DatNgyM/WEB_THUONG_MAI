document.addEventListener('DOMContentLoaded', function() {
  'use strict';

  const multipleCodeElements = document.querySelectorAll('.multiple-codes');
  if (multipleCodeElements.length) {
    multipleCodeElements.forEach((textarea, i) => {
      textarea.id = 'code-' + i;
      CodeMirror.fromTextArea(document.getElementById('code-' + i), {
        mode: "javascript",
        theme: "dracula",
        lineNumbers: true,
        readOnly: true,
        maxHighlightLength: 0,
        workDelay: 0
      });
    });
  }

  const shellModeElements = document.querySelectorAll('.shell-mode');
  if (shellModeElements.length) {
    shellModeElements.forEach((textarea, i) => {
      textarea.id = 'shell-' + i;
      CodeMirror.fromTextArea(document.getElementById('shell-' + i), {
        mode: "shell",
        theme: "dracula",
        readOnly: true,
        maxHighlightLength: 0,
        workDelay: 0
      });
    });
  }

  const demoTabs = document.querySelectorAll('.demo-tabs');
  if (demoTabs.length && typeof pwstabs === 'function') {      
    demoTabs.forEach(tab => {
      new pwstabs(tab, {
        effect: 'none'
      });
    });
  }

  // The function actually applying the offset
  function offsetAnchor() {
    if (location.hash.length !== 0) {
      const targetElement = document.querySelector(location.hash);
      if (targetElement) {
        window.scrollTo({
          top: targetElement.offsetTop - 15,
          behavior: 'smooth'
        });
      }
    }
  }
  
  // Captures click events of all <a> elements with href starting with #
  document.addEventListener('click', function(event) {
    if (event.target.tagName === 'A' && event.target.getAttribute('href') && event.target.getAttribute('href').startsWith('#')) {
      // Click events are captured before hashchanges. Timeout
      // causes offsetAnchor to be called after the page jump.
      window.setTimeout(function() {
        offsetAnchor();
      }, 0);
    }
  });
  
  // Set the offset when entering page with hash present in the url
  window.setTimeout(offsetAnchor, 0);
});    