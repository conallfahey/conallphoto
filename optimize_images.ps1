# Web optimization script for photos
$imageFiles = Get-ChildItem -Path "images" -Filter "*.jpg" -File
$imageFiles += Get-ChildItem -Path "images" -Filter "*.JPG" -File

Write-Host "Processing $($imageFiles.Count) images for web optimization..."

foreach ($file in $imageFiles) {
    Write-Host "Processing: $($file.Name)"
    ffmpeg -i "images\$($file.Name)" -vf "scale='min(1920,iw)':'min(1080,ih)':force_original_aspect_ratio=decrease" -q:v 3 -update 1 -y "images-web\$($file.Name)" -loglevel error
    if ($LASTEXITCODE -eq 0) {
        Write-Host "Successfully optimized: $($file.Name)"
    } else {
        Write-Host "Failed to optimize: $($file.Name)"
    }
}

Write-Host "Web optimization complete!"