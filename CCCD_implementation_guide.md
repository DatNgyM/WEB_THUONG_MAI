# CCCD Implementation Guide

## Overview

This document provides a comprehensive guide to the CCCD (Citizen ID) implementation in the Five:07 e-commerce platform. The implementation allows users to register without providing a CCCD initially but requires them to provide a valid CCCD before accessing premium features or becoming sellers.

## Table of Contents

1. [Database Schema](#database-schema)
2. [Implementation Components](#implementation-components)
3. [User Flows](#user-flows)
4. [Testing](#testing)
5. [Troubleshooting](#troubleshooting)
6. [Future Improvements](#future-improvements)

## Database Schema

The CCCD implementation required the following database changes:

```sql
-- Modify users table to allow NULL values in cccd column
ALTER TABLE users ALTER COLUMN cccd DROP NOT NULL;

-- Ensure seller_info table links to users with valid CCCD
CREATE TABLE IF NOT EXISTS seller_info (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id) NOT NULL,
    shop_name VARCHAR(100) NOT NULL,
    business_type VARCHAR(50) NOT NULL,
    is_approved BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);
```

## Implementation Components

### 1. Server-Side Components

#### 1.1 User Registration (`userRegister.js`)
- Accepts optional CCCD during registration
- Generates temporary CCCD (`T` + 12 random digits) if not provided
- Stores CCCD in database

#### 1.2 CCCD Update (`userUpdate.js`)
- API endpoint for updating CCCD: `/users/update-cccd`
- Validates CCCD format (must be 12 digits)
- Checks for CCCD uniqueness
- Updates user record

#### 1.3 User Authentication (`userAuth.js`)
- Returns full user object including CCCD status
- Used for client-side CCCD validation

#### 1.4 Seller Registration (`requestSeller.js`)
- Validates CCCD before allowing seller registration
- Rejects requests from users with temporary CCCDs
- Returns appropriate error messages

### 2. Client-Side Components

#### 2.1 CCCD Utilities (`cccdUtils.js`)
- Provides utility functions for CCCD handling:
  - `isTemporaryCccd(cccdValue)`: Checks if CCCD is temporary
  - `generateTemporaryCccd()`: Generates a temporary CCCD
  - `isValidCccd(cccdValue)`: Validates CCCD format
  - `needsCccdUpdate(user)`: Checks if user needs to update CCCD
  - `setupCccdField(cccdElement, userObject)`: Sets up UI for CCCD field

#### 2.2 CCCD Display Fix (`cccdFix.js`)
- Ensures correct display of CCCD values
- Enhances UI for temporary CCCDs
- Provides visual indicators for CCCD status

#### 2.3 CCCD Notifications (`cccdNotification.js`)
- Shows notifications for users with temporary CCCDs
- Prompts users to update their CCCD
- Integrates with the rest of the application

#### 2.4 CCCD Testing (`cccdTests.js`)
- Provides testing tools for CCCD functionality
- Accessible via URL parameter `?cccd-test=true`
- Allows manipulation of CCCD values for testing

### 3. Integration Points

#### 3.1 Login Page
- Registration form includes optional CCCD field
- Validates CCCD format if provided

#### 3.2 Account Settings
- Displays CCCD value and status
- Allows editing of temporary CCCDs
- Shows appropriate UI elements based on CCCD status

#### 3.3 Seller Portal
- Blocks access for users with temporary CCCDs
- Prompts users to update CCCD before accessing seller features

#### 3.4 Premium Upgrade
- Requires valid CCCD for upgrading to premium
- Shows notification if CCCD needs to be updated

## User Flows

### 1. Registration Flow

1. User visits registration page
2. User fills out registration form (CCCD is optional)
3. If CCCD is provided, it's validated (12 digits)
4. If CCCD is not provided, a temporary CCCD is generated
5. User account is created with the appropriate CCCD value

### 2. CCCD Update Flow

1. User logs in with a temporary CCCD
2. System shows notifications about CCCD update requirement
3. User navigates to account settings
4. User updates CCCD with valid 12-digit value
5. System validates and stores the updated CCCD

### 3. Seller Registration Flow

1. User attempts to register as a seller
2. System checks CCCD status
3. If CCCD is temporary, redirects to account settings
4. If CCCD is valid, allows seller registration to proceed

### 4. Premium Upgrade Flow

1. User visits premium upgrade page
2. System checks CCCD status
3. If CCCD is temporary, shows modal with update requirement
4. If CCCD is valid, allows premium package selection

## Testing

A comprehensive testing guide is available in `CCCD_testing_guide.md`. Key tests include:

1. Registration with/without CCCD
2. CCCD format validation
3. CCCD uniqueness validation
4. Feature access based on CCCD status
5. UI elements for temporary CCCDs

## Troubleshooting

### Common Issues

1. **Temporary CCCD Not Generated**: Check `userRegister.js` implementation
2. **CCCD Format Validation Fails**: Ensure CCCD pattern is consistently used
3. **CCCD Update API Errors**: Check error handling in `userUpdate.js`
4. **UI Display Issues**: Verify integration of `cccdFix.js`

### Debugging Tools

1. Use the CCCD testing panel by adding `?cccd-test=true` to any URL
2. Check browser console logs for CCCD-related messages
3. Monitor server logs for CCCD validation errors

## Future Improvements

1. **CCCD Verification**: Implement third-party verification of CCCD validity
2. **Gradual Enforcement**: Allow limited functionality with temporary CCCDs
3. **Admin Dashboard**: Add CCCD management features for administrators
4. **Multiple ID Types**: Support different types of identification beyond CCCD

---

## API Reference

### 1. Register User
- **Endpoint**: `/user/register`
- **Method**: POST
- **Body**: 
  ```json
  {
    "name": "string",
    "username": "string",
    "email": "string",
    "password": "string",
    "cccd": "string (optional)"
  }
  ```

### 2. Update CCCD
- **Endpoint**: `/users/update-cccd`
- **Method**: POST
- **Body**:
  ```json
  {
    "userId": "number",
    "cccd": "string"
  }
  ```

### 3. Check Seller Eligibility
- **Endpoint**: `/user/request-seller`
- **Method**: POST
- **Body**:
  ```json
  {
    "username": "string"
  }
  ```

---

Document Version: 1.0
Last Updated: May 21, 2025
