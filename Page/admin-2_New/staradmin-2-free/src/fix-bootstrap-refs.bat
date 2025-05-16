@echo off
echo Fixing Bootstrap 5 references in HTML files...

setlocal EnableDelayedExpansion

REM Fix index.html (already done manually)
echo Fixed index.html

REM Fix typography.html
echo Fixing typography.html
powershell -Command "$content = Get-Content -Path 'c:\Users\DAT DAT\Downloads\staradmin-2-free\src\pages\ui-features\typography.html' -Raw; $content = $content -replace '<link rel=""stylesheet"" href=""../../assets/css/style.css"">(/assets/css/bootstrap5-variables.css)', '<link rel=""stylesheet"" href=""../../assets/css/style.css"">\n    <link rel=""stylesheet"" href=""../../assets/css/bootstrap5-variables.css"">'; Set-Content -Path 'c:\Users\DAT DAT\Downloads\staradmin-2-free\src\pages\ui-features\typography.html' -Value $content"

REM Fix dropdowns.html
echo Fixing dropdowns.html
powershell -Command "$content = Get-Content -Path 'c:\Users\DAT DAT\Downloads\staradmin-2-free\src\pages\ui-features\dropdowns.html' -Raw; $content = $content -replace '<link rel=""stylesheet"" href=""../../assets/css/style.css"">(/assets/css/bootstrap5-variables.css)', '<link rel=""stylesheet"" href=""../../assets/css/style.css"">\n    <link rel=""stylesheet"" href=""../../assets/css/bootstrap5-variables.css"">'; Set-Content -Path 'c:\Users\DAT DAT\Downloads\staradmin-2-free\src\pages\ui-features\dropdowns.html' -Value $content"

REM Fix buttons.html (add other file paths as needed)

echo All files fixed successfully.
