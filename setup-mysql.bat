@echo off
echo ========================================
echo  Setup E-commerce Database
echo ========================================

echo.
echo Step 1: Starting MySQL service...
net start mysql

if %ERRORLEVEL% NEQ 0 (
    echo.
    echo Trying alternative service names...
    net start mysql80
    if %ERRORLEVEL% NEQ 0 (
        net start wampmysqld64
        if %ERRORLEVEL% NEQ 0 (
            echo.
            echo ❌ Could not start MySQL service automatically.
            echo Please start MySQL manually:
            echo - XAMPP: Start MySQL in XAMPP Control Panel
            echo - WAMP: Start MySQL in WAMP Server
            echo - Manual: Start MySQL service in Windows Services
            echo.
            pause
            exit /b 1
        )
    )
)

echo ✅ MySQL service started successfully!
echo.

echo Step 2: Testing MySQL connection...
mysql -u root -p -e "SELECT 'MySQL is running!' as status;"

if %ERRORLEVEL% NEQ 0 (
    echo ❌ MySQL connection failed. Please check:
    echo 1. MySQL username/password
    echo 2. MySQL port (default: 3306)
    echo 3. MySQL configuration
    echo.
    pause
    exit /b 1
)

echo ✅ MySQL connection successful!
echo.

echo Step 3: Creating database...
mysql -u root -p < database/schema.sql

if %ERRORLEVEL% NEQ 0 (
    echo ❌ Failed to create database schema
    pause
    exit /b 1
)

echo ✅ Database schema created!
echo.

echo Step 4: Importing sample data...
mysql -u root -p < database/sample_data.sql

if %ERRORLEVEL% NEQ 0 (
    echo ❌ Failed to import sample data
    pause
    exit /b 1
)

echo ✅ Sample data imported!
echo.

echo Step 5: Testing PHP database connection...
php test-db.php

echo.
echo ========================================
echo  🎉 Setup completed successfully!
echo ========================================
echo.
echo You can now start the website:
echo 1. Run: start-server-mysql.bat
echo 2. Open: http://localhost:8080
echo.
echo Login accounts:
echo Admin: admin@example.com / 123456
echo Customer: customer1@example.com / 123456
echo.
pause
