@echo off
echo ========================================
echo       Five:07 Laragon Setup Script
echo ========================================
echo.

echo Checking if Laragon is running...
tasklist /FI "IMAGENAME eq laragon.exe" 2>NUL | find /I /N "laragon.exe">NUL
if "%ERRORLEVEL%"=="0" (
    echo [OK] Laragon is running
) else (
    echo [ERROR] Laragon is not running. Please start Laragon first.
    pause
    exit /b 1
)

echo.
echo Setting up database...
echo Please make sure MySQL is running in Laragon

echo.
echo Importing database schema...
mysql -u root -e "SOURCE %~dp0laragon-setup.sql" 2>NUL
if %ERRORLEVEL% equ 0 (
    echo [OK] Database imported successfully
) else (
    echo [WARNING] Could not import database automatically
    echo Please import laragon-setup.sql manually through phpMyAdmin
)

echo.
echo Checking Apache configuration...
if exist "C:\laragon\etc\apache2\sites-enabled\auto.web-thuong-mai.test.conf" (
    echo [OK] Virtual host already exists
) else (
    echo Creating virtual host...
    echo ^<VirtualHost *:80^> > "C:\laragon\etc\apache2\sites-enabled\auto.web-thuong-mai.test.conf"
    echo     DocumentRoot "C:/laragon/www/WEB_THUONG_MAI" >> "C:\laragon\etc\apache2\sites-enabled\auto.web-thuong-mai.test.conf"
    echo     ServerName web-thuong-mai.test >> "C:\laragon\etc\apache2\sites-enabled\auto.web-thuong-mai.test.conf"
    echo     ErrorLog "logs/web-thuong-mai-error.log" >> "C:\laragon\etc\apache2\sites-enabled\auto.web-thuong-mai.test.conf"
    echo     CustomLog "logs/web-thuong-mai-access.log" common >> "C:\laragon\etc\apache2\sites-enabled\auto.web-thuong-mai.test.conf"
    echo ^</VirtualHost^> >> "C:\laragon\etc\apache2\sites-enabled\auto.web-thuong-mai.test.conf"
    echo [OK] Virtual host created
)

echo.
echo Updating hosts file...
findstr /C:"web-thuong-mai.test" C:\Windows\System32\drivers\etc\hosts >nul
if %errorlevel% equ 0 (
    echo [OK] Hosts entry already exists
) else (
    echo 127.0.0.1 web-thuong-mai.test >> C:\Windows\System32\drivers\etc\hosts
    if %ERRORLEVEL% equ 0 (
        echo [OK] Hosts file updated
    ) else (
        echo [WARNING] Could not update hosts file automatically
        echo Please add manually: 127.0.0.1 web-thuong-mai.test
    )
)

echo.
echo ========================================
echo Setup completed!
echo ========================================
echo.
echo You can access the website at:
echo - http://web-thuong-mai.test
echo - http://localhost/WEB_THUONG_MAI
echo.
echo Default accounts:
echo - Admin: admin@five07.com / password
echo - User: user@test.com / password
echo - Seller: seller@test.com / password
echo.
echo Please restart Apache in Laragon for changes to take effect.
echo.
pause
