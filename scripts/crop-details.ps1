Add-Type -AssemblyName System.Drawing

function Crop-Image($srcPath, $dstPath, $x, $y, $w, $h) {
    $src = [System.Drawing.Bitmap]::FromFile($srcPath)
    $rect = New-Object System.Drawing.Rectangle($x, $y, $w, $h)
    $crop = $src.Clone($rect, $src.PixelFormat)
    $crop.Save($dstPath, [System.Drawing.Imaging.ImageFormat]::Jpeg)
    $crop.Dispose()
    $src.Dispose()
    Write-Host "Cropped $dstPath"
}

$base = "c:\Users\mahab\Downloads\KAYAA\public\photos"
Crop-Image "$base\festive-ensemble-hero.jpg" "$base\chandani-lehenga-detail.jpg" 250 200 450 600
Crop-Image "$base\emerald-kurta-hero.jpg" "$base\emerald-kurta-detail.jpg" 200 250 500 650
