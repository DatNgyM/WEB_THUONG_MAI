@echo off
echo Starting PHP development server...
echo.
echo Server will be available at: http://localhost:8080
echo Press Ctrl+C to stop the server
echo.
php -S localhost:8080 -t public
