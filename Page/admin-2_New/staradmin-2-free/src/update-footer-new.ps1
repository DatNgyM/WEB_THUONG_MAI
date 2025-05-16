$files = @(
    "c:\Users\DAT DAT\Downloads\staradmin-2-free\src\pages\ui-features\typography.html",
    "c:\Users\DAT DAT\Downloads\staradmin-2-free\src\pages\ui-features\dropdowns.html",
    "c:\Users\DAT DAT\Downloads\staradmin-2-free\src\pages\ui-features\buttons.html",
    "c:\Users\DAT DAT\Downloads\staradmin-2-free\src\pages\tables\basic-table.html",
    "c:\Users\DAT DAT\Downloads\staradmin-2-free\src\pages\samples\blank-page.html",
    "c:\Users\DAT DAT\Downloads\staradmin-2-free\src\pages\icons\font-awesome.html",
    "c:\Users\DAT DAT\Downloads\staradmin-2-free\src\pages\forms\basic_elements.html",
    "c:\Users\DAT DAT\Downloads\staradmin-2-free\src\pages\charts\chartjs.html"
)

foreach ($file in $files) {
    Write-Host "Processing $file"
    $content = Get-Content -Path $file -Raw
    if ($content -match '<span class="text-muted text-center text-sm-start d-block d-sm-inline-block">Premium <a href="https://www.bootstrapdash.com/" target="_blank">Bootstrap admin template</a> from BootstrapDash.</span>') {
        $content = $content -replace '<span class="text-muted text-center text-sm-start d-block d-sm-inline-block">Premium <a href="https://www.bootstrapdash.com/" target="_blank">Bootstrap admin template</a> from BootstrapDash.</span>', '<span class="text-muted text-center text-sm-start d-block d-sm-inline-block">StarAdmin Free Bootstrap Admin Template</span>'
        $content | Set-Content -Path $file
        Write-Host "Updated $file"
    } else {
        Write-Host "No match in $file"
    }
}
