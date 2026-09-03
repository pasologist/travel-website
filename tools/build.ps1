# =============================================================================
#  C&R Luxurious Travel - build script (Windows PowerShell 5.1 or newer)
#  -----------------------------------------------------------------------------
#  Reads the single source of truth in wordpress/plugin/cr-luxurious-travel/
#  and produces:
#    preview/*.html                 standalone pages you can open in a browser
#                                   (CSS + page HTML + JS stitched together)
#    dist/cr-luxurious-travel.zip   the plugin zip to upload to WordPress
#
#  Run from anywhere:   powershell -ExecutionPolicy Bypass -File tools\build.ps1
#  Options:             -NoZip   skip the zip     -NoPreview   skip previews
# =============================================================================
param(
    [switch]$NoZip,
    [switch]$NoPreview
)
$ErrorActionPreference = 'Stop'

$root       = Split-Path -Parent $PSScriptRoot
$plugin     = Join-Path $root 'wordpress\plugin\cr-luxurious-travel'
$assets     = Join-Path $plugin 'assets'
$pagesDir   = Join-Path $plugin 'pages'
$previewDir = Join-Path $root 'preview'
$distDir    = Join-Path $root 'dist'
$utf8       = New-Object System.Text.UTF8Encoding($false)

$fontsHref = 'https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,500;0,600;1,400;1,500&family=Outfit:wght@300;400;500;600&family=Parisienne&display=swap'
$titles = @{
    'home' = 'Home'; 'stays' = 'Stays'; 'stay' = 'Stay'; 'all-inclusive' = 'All-Inclusive'
    'dining' = 'Dining'; 'spa' = 'Spa & Wellness'; 'experiences' = 'Experiences'
    'weddings' = 'Weddings & Events'; 'offers' = 'Offers'; 'contact' = 'Contact'
}

function Read-Utf8([string]$path) { [System.IO.File]::ReadAllText($path, [System.Text.Encoding]::UTF8) }

# ---------------------------------------------------------------- previews
if (-not $NoPreview) {
    $css = Read-Utf8 (Join-Path $assets 'cr-style.css')
    $js  = Read-Utf8 (Join-Path $assets 'cr-site.js')
    New-Item -ItemType Directory -Force $previewDir | Out-Null
    $count = 0
    Get-ChildItem $pagesDir -Filter '*.html' | ForEach-Object {
        $slug  = $_.BaseName
        $html  = Read-Utf8 $_.FullName
        $out   = if ($slug -eq 'home') { 'index.html' } else { "$slug.html" }
        $title = if ($titles.ContainsKey($slug)) { $titles[$slug] } else { $slug }
        $title = $title.Replace('&', '&amp;')
        $doc = @"
<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>$title · C&amp;R Luxurious Travel (preview)</title>
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="$fontsHref" rel="stylesheet">
<!-- PIECE 1: global styles (assets/cr-style.css) -->
<style>
$css
</style>
</head>
<body class="cr-body">
<script>window.CR_CONFIG={base:'./',ext:'.html',home:'./index.html',formAction:'',formMode:'mailto',preview:true};</script>
<!-- PAGE HTML (pages/$slug.html) -->
$html
<!-- PIECE 2: global script (assets/cr-site.js) -->
<script>
$js
</script>
</body>
</html>
"@
        [System.IO.File]::WriteAllText((Join-Path $previewDir $out), $doc, $utf8)
        $count++
    }
    Write-Host "Preview: $count pages written to $previewDir"
}

# ---------------------------------------------------------------- plugin zip
if (-not $NoZip) {
    New-Item -ItemType Directory -Force $distDir | Out-Null
    $zip = Join-Path $distDir 'cr-luxurious-travel.zip'
    if (Test-Path $zip) { Remove-Item $zip -Force }
    Add-Type -AssemblyName System.IO.Compression
    Add-Type -AssemblyName System.IO.Compression.FileSystem
    # Entries are added one by one with forward-slash names. Windows PowerShell 5.1
    # (.NET Framework) would otherwise write backslash paths, which Linux servers
    # such as Hostinger unpack as literal file names instead of folders.
    $archive = [System.IO.Compression.ZipFile]::Open($zip, [System.IO.Compression.ZipArchiveMode]::Create)
    $count = 0
    try {
        Get-ChildItem $plugin -Recurse -File | ForEach-Object {
            $rel = $_.FullName.Substring($plugin.Length).TrimStart('\', '/') -replace '\\', '/'
            $entryName = "cr-luxurious-travel/$rel"
            [System.IO.Compression.ZipFileExtensions]::CreateEntryFromFile($archive, $_.FullName, $entryName, [System.IO.Compression.CompressionLevel]::Optimal) | Out-Null
            $count++
        }
    } finally {
        $archive.Dispose()
    }
    $size = [math]::Round((Get-Item $zip).Length / 1KB)
    Write-Host "Plugin zip: $zip ($count files, $size KB)"
}
