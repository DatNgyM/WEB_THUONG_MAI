# Fix Bootstrap 5 CSS references
# This script corrects incorrect reference to bootstrap5-variables.css in HTML files

$files = Get-ChildItem -Path "c:\Users\DAT DAT\Downloads\staradmin-2-free\src\pages" -Recurse -Filter "*.html"

foreach ($file in $files) {
    # Read file content
    $content = Get-Content -Path $file.FullName -Raw
    
    # Check if file has the malformed reference
    if ($content -match '<link rel="stylesheet" href=".+/assets/css/style.css">/assets/css/bootstrap5-variables.css') {
        Write-Host "Fixing $($file.FullName)"
        
        # Calculate relative path based on how many folders deep we are from src
        $relativePath = $file.FullName.Replace("c:\Users\DAT DAT\Downloads\staradmin-2-free\src\", "").Split("\") | Select-Object -Skip 1
        $depth = $relativePath.Count - 1
        $prefix = "../" * $depth
        
        # Replace the malformed reference with correct references
        $newContent = $content -replace '(<link rel="stylesheet" href="[\.\.\/]+/assets/css/style.css">)/assets/css/bootstrap5-variables.css', 
            "`$1`r`n    <link rel=`"stylesheet`" href=`"$($prefix)assets/css/bootstrap5-variables.css`">"
        
        # Write fixed content back to file
        Set-Content -Path $file.FullName -Value $newContent
        Write-Host "Fixed $($file.FullName)"
    }
}

Write-Host "All files have been fixed successfully."
