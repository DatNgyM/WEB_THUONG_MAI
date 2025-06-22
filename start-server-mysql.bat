@echo off
echo ========================================
echo  E-commerce Website - PHP + MySQL
echo ========================================

echo.
echo Checking MySQL connection...

mysql -u root -p -e "USE ecommerce_db; SELECT 'Database ready!' as status;" 2>nul

if %ERRORLEVEL% NEQ 0 (
    echo.
    echo WARNING: Database not found or MySQL not running!
    echo.
    echo Please run 'import-database.bat' first to create the database.
    echo Or make sure MySQL is running and ecommerce_db exists.
    echo.
    echo Continue anyway? (Y/N)
    set /p choice=
    if /i not "%choice%"=="Y" (
        echo Exiting...
        pause
        exit /b 1
    )
)

echo.
echo Starting PHP development server...
echo.
echo Website will be available at: http://localhost:8080
echo Press Ctrl+C to stop the server
echo.

cd /d "%~dp0"
php -S localhost:8080 -t public

echo.
echo Server stopped.
pause
