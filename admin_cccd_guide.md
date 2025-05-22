# CCCD Management Guide for Administrators

## Overview

This guide explains how the CCCD (Citizen ID) system works in the Five:07 platform, and provides administrators with guidance on how to manage and troubleshoot issues related to user CCCD.

## CCCD Implementation Details

### Database Structure

The user table has been modified to support the CCCD functionality:

```sql
-- Updated users table structure with CCCD handling
ALTER TABLE users ALTER COLUMN cccd DROP NOT NULL;
```

CCCD values can be:
1. **Valid CCCD**: 12-digit numeric value provided by the user
2. **Temporary CCCD**: String starting with 'T' followed by 12 random digits
3. **NULL**: (Should not occur with current implementation)

### Temporary CCCD Format

Temporary CCCDs are automatically generated with the following format:
```
T + 12-digit random number (padded with leading zeros if necessary)
```

Example: `T000123456789`

## Administrative Functions

### Identifying Users with Temporary CCCDs

SQL query to find users with temporary CCCDs:
```sql
SELECT id, name, username, email, cccd, created_at
FROM users
WHERE cccd LIKE 'T%' AND LENGTH(cccd) = 13;
```

### Verifying Seller Accounts

When verifying seller accounts, always check if the user has a valid CCCD:
1. Check if the CCCD starts with 'T' (temporary) or is a regular 12-digit number
2. Reject seller applications from users with temporary CCCDs
3. For existing seller accounts with temporary CCCDs, send notification to update

### Managing CCCD Issues

Common issues and solutions:

1. **User cannot update their CCCD**:
   - Check for server errors in updating CCCD
   - Ensure CCCD format validation is working (12 digits)
   - Verify no duplicate CCCD errors

2. **Duplicate CCCD Errors**:
   - Check the database for duplicate entries
   - Verify the uniqueness constraint is working
   - If legitimate duplication, contact users to verify identity

3. **Seller Registration Issues**:
   - Ensure system is properly rejecting sellers with temporary CCCDs
   - Verify seller_info table foreign key constraints
   - Check CCCD validation in seller registration workflow

## Monitoring Tools

For development and testing environments, CCCD testing tools are included:
- Access any page with `?cccd-test=true` parameter to show the testing panel
- Use the testing panel to inspect and modify CCCD values for testing purposes

## Batch Operations

To migrate users with temporary CCCDs to valid ones (admin function):

```sql
-- Get list of users with temporary CCCDs
SELECT id, name, email, cccd
FROM users
WHERE cccd LIKE 'T%';

-- After verification, update individual users
UPDATE users 
SET cccd = '123456789012' -- Valid 12-digit CCCD
WHERE id = 1; -- User ID
```

## Security Considerations

1. CCCD values should be treated as sensitive personal information
2. Audit all changes to CCCD values
3. Implement proper access controls for CCCD management functions
4. Ensure CCCD validation is consistent across all parts of the application