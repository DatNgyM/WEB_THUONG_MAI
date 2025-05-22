# CCCD Implementation Testing Guide

## Overview
This guide outlines the testing scenarios for the CCCD (national ID) implementation in the registration and user profile system.

## Test Scenarios

### 1. User Registration Flow

#### Test Case 1.1: Registration Without CCCD
1. Navigate to the login page
2. Click the "Register" tab
3. Fill in all required fields except CCCD
4. Submit the form
5. **Expected Result:** 
   - Registration should succeed
   - A temporary CCCD starting with 'T' followed by 12 digits should be generated
   - User should be redirected to login page

#### Test Case 1.2: Registration With Valid CCCD
1. Navigate to the login page
2. Click the "Register" tab
3. Fill in all required fields including a valid 12-digit CCCD
4. Submit the form
5. **Expected Result:**
   - Registration should succeed
   - The provided CCCD should be saved
   - User should be redirected to login page

#### Test Case 1.3: Registration With Invalid CCCD Format
1. Navigate to the login page
2. Click the "Register" tab
3. Fill in all required fields
4. Enter an invalid CCCD (e.g., less than 12 digits or containing letters)
5. Submit the form
6. **Expected Result:**
   - Registration should fail
   - Error message should indicate CCCD format issue
   - Form should remain on registration tab

### 2. Login and CCCD Display

#### Test Case 2.1: Login With Temporary CCCD
1. Login with a user that has a temporary CCCD
2. Navigate to account settings page
3. **Expected Result:**
   - The temporary CCCD should be displayed
   - CCCD field should be editable
   - A warning about temporary CCCD should be displayed

#### Test Case 2.2: Login With Valid CCCD
1. Login with a user that has a valid CCCD
2. Navigate to account settings page
3. **Expected Result:**
   - The valid CCCD should be displayed
   - CCCD field should be read-only
   - No warnings should be displayed

### 3. CCCD Update Flow

#### Test Case 3.1: Update Temporary CCCD to Valid CCCD
1. Login with a user that has a temporary CCCD
2. Navigate to account settings page
3. Enter a valid 12-digit CCCD
4. Save changes
5. **Expected Result:**
   - Update should succeed
   - Success message should be displayed
   - CCCD field should become read-only
   - CCCD temporary warning should disappear

#### Test Case 3.2: Update to Invalid CCCD Format
1. Login with a user that has a temporary CCCD
2. Navigate to account settings page
3. Enter an invalid CCCD format
4. Save changes
5. **Expected Result:**
   - Update should fail
   - Error message should indicate CCCD format issue
   - Field should remain editable

#### Test Case 3.3: Update to Already Used CCCD
1. Login with a user that has a temporary CCCD
2. Navigate to account settings page
3. Enter a CCCD that's already used by another user
4. Save changes
5. **Expected Result:**
   - Update should fail
   - Error message should indicate the CCCD is already in use
   - Field should remain editable

### 4. Seller Registration Flow

#### Test Case 4.1: Attempt Seller Registration with Temporary CCCD
1. Login with a user that has a temporary CCCD
2. Navigate to seller registration page
3. Fill in seller details and submit
4. **Expected Result:**
   - Registration should fail
   - Error message should prompt user to update CCCD first
   - User should be directed to update CCCD

#### Test Case 4.2: Seller Registration with Valid CCCD
1. Login with a user that has a valid CCCD
2. Navigate to seller registration page
3. Fill in seller details and submit
4. **Expected Result:**
   - Registration should be submitted for review
   - Confirmation message should be displayed

## Database Verification

After running the tests, verify the database state:

1. Check that users registered without CCCD have temporary CCCDs starting with 'T'
2. Verify that updated CCCDs are correctly stored
3. Confirm that seller applications are properly linked to user accounts with valid CCCDs
