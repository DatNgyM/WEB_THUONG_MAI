/**
 * Session-Based Authentication Test Script
 * Tests the functionality of the new session authentication system
 */

// Store test results
const testResults = {
  total: 0,
  passed: 0,
  failed: 0,
  skipped: 0,
  details: []
};

// Test function to log results
function test(name, testFunction) {
  testResults.total++;
  
  try {
    console.log(`🧪 Running test: ${name}`);
    const result = testFunction();
    
    if (result === true) {
      console.log(`✅ PASSED: ${name}`);
      testResults.passed++;
      testResults.details.push({ name, status: 'passed' });
    } else if (result === 'skipped') {
      console.log(`⏭️ SKIPPED: ${name}`);
      testResults.skipped++;
      testResults.details.push({ name, status: 'skipped' });
    } else {
      console.log(`❌ FAILED: ${name}`);
      testResults.failed++;
      testResults.details.push({ name, status: 'failed', message: result || 'Test returned false' });
    }
  } catch (error) {
    console.error(`❌ ERROR in test "${name}":`, error);
    testResults.failed++;
    testResults.details.push({ name, status: 'failed', message: error.message });
  }
}

// Async test function
async function testAsync(name, testFunction) {
  testResults.total++;
  
  try {
    console.log(`🧪 Running async test: ${name}`);
    const result = await testFunction();
    
    if (result === true) {
      console.log(`✅ PASSED: ${name}`);
      testResults.passed++;
      testResults.details.push({ name, status: 'passed' });
    } else if (result === 'skipped') {
      console.log(`⏭️ SKIPPED: ${name}`);
      testResults.skipped++;
      testResults.details.push({ name, status: 'skipped' });
    } else {
      console.log(`❌ FAILED: ${name}`);
      testResults.failed++;
      testResults.details.push({ name, status: 'failed', message: result || 'Test returned false' });
    }
  } catch (error) {
    console.error(`❌ ERROR in test "${name}":`, error);
    testResults.failed++;
    testResults.details.push({ name, status: 'failed', message: error.message });
  }
}

// Run tests when document is ready
document.addEventListener('DOMContentLoaded', async function() {
  console.log('🧪 Starting session authentication tests...');
  
  // Test for session scripts loaded
  test('Session scripts are loaded', function() {
    const hasSessionLogin = typeof loginUserWithSession === 'function';
    const hasSessionLogout = typeof logoutSession === 'function';
    return hasSessionLogin && hasSessionLogout;
  });
  
  // Test for session cookie
  testAsync('Session endpoint returns status response', async function() {
    try {
      const res = await fetch('/session/status', {
        credentials: 'include'
      });
      
      if (!res.ok) {
        return `Session status endpoint returned ${res.status}`;
      }
      
      const data = await res.json();
      return typeof data.isAuthenticated === 'boolean';
    } catch (error) {
      return `Error fetching session status: ${error.message}`;
    }
  });
  
  // Test local storage session flag
  test('Local storage contains session flag', function() {
    const useSession = localStorage.getItem('useSession');
    return useSession === 'true' || useSession === 'false' || 'Session flag not set, but this is acceptable for new users';
  });
  
  // Run more tests only if logged in
  if (localStorage.getItem('isLoggedIn') === 'true') {
    // Test user data consistency
    test('User data is available in localStorage', function() {
      const userData = localStorage.getItem('user');
      if (!userData) return 'No user data in localStorage';
      
      try {
        const user = JSON.parse(userData);
        return user && user.id && user.name && user.role;
      } catch (error) {
        return `Invalid user JSON: ${error.message}`;
      }
    });
    
    // Test session validation - only if using sessions
    if (localStorage.getItem('useSession') === 'true') {
      testAsync('Session validation works', async function() {
        try {
          const res = await fetch('/session/status', {
            credentials: 'include'
          });
          
          const data = await res.json();
          return data.isAuthenticated === true;
        } catch (error) {
          return `Error validating session: ${error.message}`;
        }
      });
    } else {
      test('Session validation - skipped (not using sessions)', function() {
        return 'skipped';
      });
    }
  } else {
    test('User data tests - skipped (not logged in)', function() {
      return 'skipped';
    });
  }
  
  // Display test summary
  setTimeout(function() {
    console.log('🧪 Test summary:');
    console.log(`Total: ${testResults.total}, Passed: ${testResults.passed}, Failed: ${testResults.failed}, Skipped: ${testResults.skipped}`);
    
    if (testResults.failed > 0) {
      console.log('❌ Failed tests:');
      testResults.details.filter(t => t.status === 'failed').forEach(test => {
        console.log(`- ${test.name}: ${test.message || 'Failed'}`);
      });
    }
    
    // Create visual test report if container exists
    const testContainer = document.getElementById('session-test-results');
    if (testContainer) {
      testContainer.innerHTML = `
        <h3>Session Authentication Test Results</h3>
        <p>Total: ${testResults.total}, Passed: ${testResults.passed}, Failed: ${testResults.failed}, Skipped: ${testResults.skipped}</p>
        <ul>
          ${testResults.details.map(test => `
            <li class="test-${test.status}">
              ${test.name}: ${test.status.toUpperCase()}
              ${test.message ? `<br><small>${test.message}</small>` : ''}
            </li>
          `).join('')}
        </ul>
      `;
    }
  }, 1000);
});
