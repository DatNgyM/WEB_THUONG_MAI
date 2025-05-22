# CCCD Implementation Test Plan

## Introduction

This document outlines how to manually test the CCCD implementation across the Five:07 e-commerce platform. Follow these steps to ensure the CCCD functionality is working correctly.

## Prerequisites

1. The application must be running (server & client)
2. You should have admin access to the database
3. Clear browser cache and cookies before starting

## Test Cases

### Test 1: User Registration Without CCCD

#### Step 1: Access the Registration Form
1. Open the application in your browser
2. Navigate to the login page (`/Page/login.html`)
3. Click on the "Register" tab

#### Step 2: Register Without CCCD
1. Fill in all required fields:
   - Name: `Test User`
   - Username: `testuser1`
   - Email: `testuser1@example.com`
   - Password: `password123`
   - Repeat Password: `password123`
2. Leave the CCCD field empty
3. Click "Create Account"

#### Expected Results:
- Registration should succeed
- On login, you should be able to see a temporary CCCD (starting with 'T')
- Account settings page should show the temporary CCCD and allow editing

### Test 2: User Registration With Valid CCCD

#### Step 1: Access the Registration Form
1. Navigate to the login page
2. Click on the "Register" tab

#### Step 2: Register With Valid CCCD
1. Fill in all required fields as in Test 1
2. Enter a valid CCCD: `123456789012` (12 digits)
3. Click "Create Account"

#### Expected Results:
- Registration should succeed
- On login, you should see the provided CCCD
- Account settings page should show the CCCD as readonly

### Test 3: User Registration With Invalid CCCD

#### Step 1: Access the Registration Form
1. Navigate to the login page
2. Click on the "Register" tab

#### Step 2: Register With Invalid CCCD
1. Fill in all required fields as in Test 1
2. Enter an invalid CCCD: `12345` (less than 12 digits)
3. Click "Create Account"

#### Expected Results:
- An error message should appear indicating the CCCD format is invalid
- Registration should not proceed

### Test 4: Updating Temporary CCCD

#### Step 1: Log in with a User Having Temporary CCCD
1. Log in as the user created in Test 1

#### Step 2: Navigate to Account Settings
1. Click on your profile
2. Go to Account Settings

#### Step 3: Update CCCD
1. Find the CCCD field (should be editable)
2. Enter a valid CCCD: `987654321012`
3. Save the changes

#### Expected Results:
- CCCD update should be successful
- The field should become readonly
- Notifications about temporary CCCD should disappear

### Test 5: Attempting Premium Upgrade with Temporary CCCD

#### Step 1: Log in with a User Having Temporary CCCD
1. Create a new user with temporary CCCD or use one from Test 1 (before updating)
2. Log in as that user

#### Step 2: Access Premium Upgrade Page
1. Navigate to the Premium Upgrade page

#### Expected Results:
- A modal should appear warning about the temporary CCCD
- Premium package selection should be disabled
- There should be a button to redirect to account settings

### Test 6: Attempting Seller Registration with Temporary CCCD

#### Step 1: Log in with a User Having Temporary CCCD
1. Use a user with temporary CCCD

#### Step 2: Try to Register as Seller
1. Navigate to the seller registration page
2. Fill in the required details
3. Submit the form

#### Expected Results:
- Registration should be rejected
- An error message should indicate the need to update CCCD
- A link to account settings should be provided

### Test 7: Testing CCCD Utilities

#### Step 1: Access Testing Tools
1. Add `?cccd-test=true` to any URL in the application
2. A testing panel should appear in the corner of the page

#### Step 2: Use Testing Functions
1. Test "Check current CCCD" functionality
2. Test setting temporary and valid CCCDs
3. Test resetting notifications

#### Expected Results:
- Testing panel should accurately display CCCD status
- Setting different CCCD values should work
- Application should behave correctly based on the set CCCD values

### Test 8: Database Migration Utility

#### Step 1: Run the CCCD Utility
1. Open a terminal
2. Navigate to the project root
3. Run `node cccd-util.js help`

#### Step 2: Test Various Commands
1. `node cccd-util.js list temporary`
2. `node cccd-util.js verify`
3. `node cccd-util.js stats`

#### Expected Results:
- Utility should show meaningful information about CCCDs in the database
- No errors should occur during execution

## Reporting Issues

If you encounter any issues during testing, please document them with:

1. The test case number
2. Step where the issue occurred
3. Expected vs. actual behavior
4. Screenshots if available
5. Browser console logs

## After Testing

After completing all tests, run the cleanup command to reset test data:
```
node cccd-util.js cleanup-test-data
```

## Contact

For questions about the testing process, please contact the development team.
