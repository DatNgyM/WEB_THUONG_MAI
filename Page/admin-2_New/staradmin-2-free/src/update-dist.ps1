# Script to build the updated project to the dist folder

Write-Host "Building the updated project to the dist folder..."

# Check if gulp is installed
try {
    gulp -v | Out-Null
    $gulpInstalled = $true
} catch {
    $gulpInstalled = $false
}

if ($gulpInstalled) {
    # Run the gulp build command
    Write-Host "Running gulp build..."
    gulp build
} else {
    # If gulp is not installed, copy the src folder to dist
    Write-Host "Gulp is not installed. Copying src folder to dist..."
    
    # Create dist folder if it doesn't exist
    if (-not (Test-Path -Path "../dist")) {
        New-Item -Path "../dist" -ItemType Directory
    }
    
    # Copy all files from src to dist, excluding the dist folder itself
    Copy-Item -Path "./*" -Destination "../dist/" -Recurse -Force -Exclude "dist"
}

Write-Host "Build completed!"
