// Bootstrap 5 version - typeahead.js still requires jQuery
(function() {
  'use strict';
  
  document.addEventListener('DOMContentLoaded', function() {
    // Make sure jQuery is available since typeahead depends on it
    if (typeof jQuery === 'undefined') {
      console.error('Typeahead requires jQuery to function properly');
      return;
    }

    const $ = jQuery;
    
    const substringMatcher = function(strs) {
      return function findMatches(q, cb) {
        // Array that will be populated with substring matches
        const matches = [];

        // Regex used to determine if a string contains the substring `q`
        const substrRegex = new RegExp(q, 'i');

        // Iterate through the pool of strings for matches
        strs.forEach(function(str) {
          if (substrRegex.test(str)) {
            matches.push(str);
          }
        });

        cb(matches);
      };
    };

    const states = ['Alabama', 'Alaska', 'Arizona', 'Arkansas', 'California',
      'Colorado', 'Connecticut', 'Delaware', 'Florida', 'Georgia', 'Hawaii',
      'Idaho', 'Illinois', 'Indiana', 'Iowa', 'Kansas', 'Kentucky', 'Louisiana',
      'Maine', 'Maryland', 'Massachusetts', 'Michigan', 'Minnesota',
      'Mississippi', 'Missouri', 'Montana', 'Nebraska', 'Nevada', 'New Hampshire',
      'New Jersey', 'New Mexico', 'New York', 'North Carolina', 'North Dakota',
      'Ohio', 'Oklahoma', 'Oregon', 'Pennsylvania', 'Rhode Island',
      'South Carolina', 'South Dakota', 'Tennessee', 'Texas', 'Utah', 'Vermont',
      'Virginia', 'Washington', 'West Virginia', 'Wisconsin', 'Wyoming'
    ];

    // Initialize typeahead on the-basics if it exists
    if ($('#the-basics .typeahead').length > 0) {
      $('#the-basics .typeahead').typeahead({
        hint: true,
        highlight: true,
        minLength: 1
      }, {
        name: 'states',
        source: substringMatcher(states)
      });
    }

    // Initialize Bloodhound for the bloodhound example if it exists
    if ($('#bloodhound .typeahead').length > 0) {
      // Constructs the suggestion engine
      const bloodhoundStates = new Bloodhound({
        datumTokenizer: Bloodhound.tokenizers.whitespace,
        queryTokenizer: Bloodhound.tokenizers.whitespace,
        // `states` is an array of state names defined above
        local: states
      });

      $('#bloodhound .typeahead').typeahead({
        hint: true,
        highlight: true,
        minLength: 1
      }, {
        name: 'states',
        source: bloodhoundStates
      });
    }
  });
})();