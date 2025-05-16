#!/usr/bin/env pwsh
# Script để cập nhật tất cả các footer trong các trang HTML

Write-Host "Đang cập nhật footer trên tất cả các trang HTML..."

$files = Get-ChildItem -Path "c:\Users\DAT DAT\Downloads\staradmin-2-free\src\pages" -Include "*.html" -Recurse

foreach ($file in $files) {
    $content = Get-Content -Path $file.FullName -Raw
    
    # Tìm và thay thế footer có chứa tham chiếu đến bootstrapdash
    $updatedContent = $content -replace '<span class="text-muted text-center text-sm-start d-block d-sm-inline-block">Premium <a href="https://www.bootstrapdash.com/" target="_blank">Bootstrap admin template</a> from BootstrapDash.</span>', '<span class="text-muted text-center text-sm-start d-block d-sm-inline-block">StarAdmin Free Bootstrap Admin Template</span>'
    
    # Lưu nội dung đã cập nhật trở lại tệp
    if ($content -ne $updatedContent) {
        Set-Content -Path $file.FullName -Value $updatedContent
        Write-Host "Đã cập nhật: $($file.FullName)"
    }
}

Write-Host "Hoàn tất cập nhật footer!"
