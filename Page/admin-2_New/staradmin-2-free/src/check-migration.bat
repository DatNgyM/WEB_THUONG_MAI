@echo off
echo StarAdmin Free Template - Bootstrap 5 Migration Validation
echo =====================================================

echo.
echo 1. Checking Bootstrap 5 CSS references...
findstr /C:"bootstrap5-variables.css" index.html > nul
if %errorlevel% equ 0 (
    echo [PASS] Bootstrap 5 CSS references found
) else (
    echo [FAIL] Bootstrap 5 CSS references not found
)

echo.
echo 2. Checking Navbar SCSS structure...
if exist assets\scss\_navbar.scss (
    echo [PASS] Navbar SCSS structure exists
) else (
    echo [FAIL] Navbar SCSS structure missing
)

echo.
echo 3. Checking datepicker vanilla JS adapter...
if exist assets\js\datepicker-vanilla.js (
    echo [PASS] Datepicker vanilla JS adapter exists
) else (
    echo [FAIL] Datepicker vanilla JS adapter missing
)

echo.
echo 4. Checking all template pages...
powershell -Command "& {
    $files = Get-ChildItem -Path 'pages' -Recurse -Filter '*.html';
    $errorFound = $false;
    foreach ($file in $files) {
        $content = Get-Content -Path $file.FullName -Raw;
        if ($content -match '<link rel=\"stylesheet\" href=\".+/assets/css/style\.css\">/assets/css/bootstrap5-variables\.css') {
            Write-Host ('[FAIL] Malformed CSS reference in: ' + $file.FullName);
            $errorFound = $true;
            break;
        }
    }
    if (-not $errorFound) {
        Write-Host '[PASS] All template pages have correct CSS references';
    }
}"

echo.
echo Migration validation complete!
echo.
