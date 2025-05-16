(function() {
  'use strict';
  document.addEventListener('DOMContentLoaded', function() {
    var todoListItem = document.querySelector('.todo-list');
    var todoListInput = document.querySelector('.todo-list-input');
    
    if (todoListItem && todoListInput) {
      var addButton = document.querySelector('.todo-list-add-btn');
      
      if (addButton) {
        addButton.addEventListener('click', function(event) {
          event.preventDefault();
          
          var item = this.previousElementSibling?.value;
          
          if (item) {
            var li = document.createElement('li');
            li.innerHTML = "<div class='form-check'><label class='form-check-label'><input class='checkbox' type='checkbox'/>" + item + "<i class='input-helper'></i></label></div><i class='remove ti-close'></i>";
            todoListItem.appendChild(li);
            todoListInput.value = "";
          }
        });
      }
      
      todoListItem.addEventListener('change', function(e) {
        if (e.target && e.target.classList.contains('checkbox')) {
          var checkbox = e.target;
          var listItem = checkbox.closest('li');
          
          if (checkbox.hasAttribute('checked')) {
            checkbox.removeAttribute('checked');
          } else {
            checkbox.setAttribute('checked', 'checked');
          }
          
          if (listItem) {
            listItem.classList.toggle('completed');
          }
        }
      });
      
      todoListItem.addEventListener('click', function(e) {
        if (e.target && e.target.classList.contains('remove')) {
          var listItem = e.target.parentElement;
          if (listItem) {
            listItem.remove();
          }
        }
      });
    }
  });
})();