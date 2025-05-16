# Script để xóa tất cả tham chiếu đến bootstrapdash.com trong các file HTML

# Đường dẫn thư mục gốc
$rootPath = "c:\Users\DAT DAT\Downloads\staradmin-2-free\src"

# Tìm tất cả các file HTML trong thư mục pages
$htmlFiles = Get-ChildItem -Path $rootPath -Recurse -Filter "*.html"

Write-Host "Đang xóa tham chiếu đến bootstrapdash.com..."

foreach ($file in $htmlFiles) {
    Write-Host "Đang xử lý file: $($file.FullName)"
    
    # Đọc nội dung file
    $content = Get-Content -Path $file.FullName -Raw
    
    # Thay thế tham chiếu đến bootstrapdash.com trong footer
    $content = $content -replace '<span class="text-muted text-center text-sm-start d-block d-sm-inline-block">Premium <a href="https://www.bootstrapdash.com/" target="_blank">Bootstrap admin template</a> from BootstrapDash.</span>', '<span class="text-muted text-center text-sm-start d-block d-sm-inline-block">StarAdmin Free Bootstrap Admin Template</span>'
    
    # Thay thế bất kỳ URL nào khác đến bootstrapdash.com
    $content = $content -replace 'href="https://www.bootstrapdash.com/[^"]*"', 'href="#"'
    
    # Ghi lại nội dung đã sửa đổi vào file
    $content | Set-Content -Path $file.FullName -Force
}

Write-Host "Hoàn tất xóa tham chiếu đến bootstrapdash.com."
