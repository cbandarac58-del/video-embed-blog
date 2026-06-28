$base = Split-Path -Parent $MyInvocation.MyCommand.Path
$dest = Join-Path $base "vixtube-deploy.zip"

if (Test-Path $dest) { Remove-Item $dest -Force }

$paths = @(
    (Join-Path $base "dist"),
    (Join-Path $base "package.json"),
    (Join-Path $base "package-lock.json"),
    (Join-Path $base "install.js"),
    (Join-Path $base "app.js"),
    (Join-Path $base "src\content")
)

Compress-Archive -Path $paths -DestinationPath $dest -Force
Write-Host "ZIP created: $dest"
$size = (Get-Item $dest).Length / 1MB
Write-Host "Size: $([math]::Round($size,2)) MB"
