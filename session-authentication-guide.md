# Session-Based Authentication System Guide

## Overview
This document explains the new session-based authentication system implemented in the WEB_THUONG_MAI e-commerce application. The system replaces the previous JWT token authentication with more reliable session-based authentication using PostgreSQL for session storage.

## Benefits of Session-Based Authentication
1. **Improved Reliability**: No more token expiration issues
2. **Enhanced Security**: Sessions can be invalidated server-side immediately
3. **Better User Experience**: Seamless authentication without token management issues
4. **Cross-Tab Support**: Login state is maintained across browser tabs

## Components of the System

### Server-Side Components
1. **Session Table**: PostgreSQL table to store session data
2. **Express-Session Middleware**: Handles session management
3. **Auth Middleware**: Protects routes based on session authentication
4. **Session Routes**: APIs for login, logout, and session validation

### Client-Side Components
1. **Session Login**: Handles user and admin login via sessions
2. **Session Logout**: Properly terminates sessions on logout
3. **Session Status Check**: Validates session status on page load
4. **Data Management**: Handles user data with sessions

## How to Use Session Authentication

### Login
1. Visit the login page at `/Page/login.html`
2. Make sure the "Sử dụng xác thực phiên (Session)" checkbox is checked
3. Enter your credentials and click "Sign In"
4. Your browser will receive a session cookie, and you'll be redirected to the appropriate page

### Logout
1. Click the "Logout" button in the UI
2. Your session will be terminated on the server
3. You'll be redirected to the login page

### Protected Areas
- The application automatically checks session status on protected pages
- If your session is invalid or expired, you'll be redirected to the login page

## Technical Implementation Details

### Database Structure
The session system uses a dedicated PostgreSQL table:

```sql
CREATE TABLE sessions (
  "sid" varchar NOT NULL COLLATE "default",
  "sess" json NOT NULL,
  "expire" timestamp(6) NOT NULL,
  CONSTRAINT "session_pkey" PRIMARY KEY ("sid")
);

CREATE INDEX "IDX_session_expire" ON "sessions" ("expire");
```

### Server Middleware
The application uses the following middleware for session management:

```javascript
app.use(session({
  store: new pgSession({
    pool: pool,
    tableName: 'sessions'
  }),
  secret: 'ecommerce-web-secret',
  resave: false,
  saveUninitialized: false,
  cookie: { 
    secure: false,
    httpOnly: true,
    sameSite: 'lax',
    maxAge: 24 * 60 * 60 * 1000
  }
}));
```

### Authentication Routes
- `/session/login`: Login with username and password
- `/session/logout`: Terminate the current session
- `/session/status`: Check authentication status

### Admin-Specific Routes
- `/api/admin/session/login`: Admin login with username and password
- `/api/admin/session/logout`: Terminate admin session
- `/api/admin/session/status`: Check admin authentication status

## Troubleshooting

### Common Issues
1. **"Phiên đăng nhập đã hết hạn"**: Your session has expired. Log in again.
2. **Login doesn't work**: Make sure cookies are enabled in your browser.
3. **Logged out unexpectedly**: The server might have restarted or your session expired.

### Debugging
If experiencing issues:
1. Check browser console for error messages
2. Verify that cookies are being set correctly
3. Ensure database connection is working properly

## Legacy Support
The application maintains backward compatibility with the old authentication system. Users who prefer to use the old system can uncheck the "Sử dụng xác thực phiên (Session)" option at login.

## Notes for Developers
When extending the application:
1. Use the `isAuthenticated` middleware to protect new routes
2. Access the current user via `req.session.user`
3. For admin routes, use `sessionAuthenticateAdmin` middleware
