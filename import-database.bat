@echo off
echo ========================================
echo  Import Database for E-commerce Website
echo ========================================

echo.
echo Checking MySQL connection...

mysql -u root -p -e "SELECT 'MySQL connection successful' as status;"

if %ERRORLEVEL% NEQ 0 (
    echo Error: Could not connect to MySQL. Please check:
    echo 1. MySQL is running
    echo 2. Username/password is correct
    echo 3. MySQL is accessible on localhost:3306
    pause
    exit /b 1
)

echo.
echo Creating database and importing schema...
mysql -u root -p < database/schema.sql

if %ERRORLEVEL% NEQ 0 (
    echo Error: Failed to import database schema
    pause
    exit /b 1
)

echo.
echo Importing sample data...
mysql -u root -p < database/sample_data.sql

if %ERRORLEVEL% NEQ 0 (
    echo Error: Failed to import sample data
    pause
    exit /b 1
)

echo.
echo ========================================
echo  Database import completed successfully!
echo ========================================
echo.
echo Database: ecommerce_db
echo Tables created:
echo - categories
echo - products  
echo - product_images
echo - users
echo - user_addresses
echo - orders
echo - order_items
echo - cart_items
echo - wishlists
echo - product_reviews
echo - coupons
echo - settings
echo.
echo Sample data imported:
echo - 5 Categories
echo - 10 Products with images
echo - 5 Users (admin, customers, seller)
echo - 2 Sample orders
echo - Product reviews
echo - System settings
echo.
echo Login credentials:
echo Admin: admin@example.com / 123456
echo Customer: customer1@example.com / 123456
echo Customer: customer2@example.com / 123456
echo.
pause
