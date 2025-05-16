#!/usr/bin/env pwsh
# Bootstrap 5 Migration Validation Script
# This script checks if the migration to Bootstrap 5 has been completed successfully

Write-Host "StarAdmin Free Template - Bootstrap 5 Migration Validation" -ForegroundColor Cyan
Write-Host "=====================================================" -ForegroundColor Cyan

# Initialize counters
$totalChecks = 0
$passedChecks = 0

function Test-MigrationItem {
    param (
        [string]$Description,
        [scriptblock]$Test
    )
    
    $totalChecks++
    Write-Host "Checking: $Description... " -NoNewline
    
    try {
        $result = & $Test
        if ($result -eq $true) {
            $passedChecks++
            Write-Host "PASSED" -ForegroundColor Green
            return $true
        } else {
            Write-Host "FAILED" -ForegroundColor Red
            return $false
        }
    } catch {
        Write-Host "ERROR: $_" -ForegroundColor Red
        return $false
    }
}

# Check 1: Bootstrap 5 CSS references
Test-MigrationItem -Description "Bootstrap 5 CSS references" -Test {
    $indexHtml = Get-Content -Path "index.html" -Raw
    $containsBootstrap5 = $indexHtml -match "bootstrap5-variables\.css"
    return $containsBootstrap5
}

# Check 2: Navbar SCSS structure fixed
Test-MigrationItem -Description "Navbar SCSS structure" -Test {
    $navbarScss = Get-Content -Path "assets/scss/_navbar.scss" -Raw
    # Simple check for content - adjust as needed
    $validContent = $navbarScss -match "navbar-content" -and $navbarScss -match "navbar-brand-wrapper"
    return $validContent
}

# Check 3: jQuery dependency removed from main scripts
Test-MigrationItem -Description "jQuery dependency removal" -Test {
    $templateJs = Get-Content -Path "assets/js/template.js" -Raw
    $noJquery = -not ($templateJs -match "\$\(document\)\.ready" -or $templateJs -match "jQuery\(" -or $templateJs -match "\$\(")
    return $noJquery
}

# Check 4: Datepicker vanilla JS adapter
Test-MigrationItem -Description "Datepicker vanilla JS adapter" -Test {
    $datepickerJs = Test-Path -Path "assets/js/datepicker-vanilla.js" -PathType Leaf
    return $datepickerJs
}

# Check 5: All file references to bootstrap5-variables.css are correct
Test-MigrationItem -Description "Bootstrap 5 CSS references in HTML files" -Test {
    $files = Get-ChildItem -Path "pages" -Recurse -Filter "*.html"
    $allCorrect = $true
    
    foreach ($file in $files) {
        $content = Get-Content -Path $file.FullName -Raw
        if ($content -match '<link rel="stylesheet" href=".+/assets/css/style\.css">/assets/css/bootstrap5-variables\.css') {
            $allCorrect = $false
            break
        }
    }
    
    return $allCorrect
}

# Final Summary
Write-Host "`nMigration Validation Summary:" -ForegroundColor Yellow
Write-Host "==========================" -ForegroundColor Yellow
Write-Host "Total checks: $totalChecks" -ForegroundColor White
Write-Host "Passed checks: $passedChecks" -ForegroundColor Green
$failedChecks = $totalChecks - $passedChecks
if ($failedChecks -gt 0) {
    Write-Host "Failed checks: $failedChecks" -ForegroundColor Red
}

# Overall status
if ($passedChecks -eq $totalChecks) {
    Write-Host "`n✅ Bootstrap 5 migration is COMPLETE! All checks passed." -ForegroundColor Green
} else {
    $percentage = [math]::Round(($passedChecks / $totalChecks) * 100)
    Write-Host "`n⚠️ Bootstrap 5 migration is at $percentage% completion. Some checks failed." -ForegroundColor Yellow
}
