Add-Type -AssemblyName System.Drawing

$sourcePath = "C:\Users\mahab\.gemini\antigravity-ide\brain\b0e46265-01b6-4b5d-a3c8-c257c99bea81\.user_uploaded\media_1789628423558.png"
$img = [System.Drawing.Bitmap]::FromFile($sourcePath)

Write-Host "Source Width: $($img.Width), Height: $($img.Height)"
$img.Dispose()
