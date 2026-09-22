# Technical SEO and Site Integrity Validator
$ErrorActionPreference = "Continue"
$baseDir = (Get-Location).Path

Write-Output "=================================================="
Write-Output "HVAC Cost Guide - Comprehensive Site Validation"
Write-Output "=================================================="

$htmlFiles = Get-ChildItem -Path $baseDir -Recurse -Filter "*.html" | Where-Object { $_.Name -notmatch "^google[a-z0-9]+\.html$" }
Write-Output "Found $($htmlFiles.Count) HTML files to analyze."

$totalErrors = 0
$totalWarnings = 0

# 1. Check Technical SEO & Metadata
Write-Output "`n[1/5] Checking Technical SEO & Metadata..."
foreach ($file in $htmlFiles) {
    $content = [System.IO.File]::ReadAllText($file.FullName)
    $relPath = $file.FullName.Substring($baseDir.Length).Replace("\", "/")

    # Title check
    if ($content -match '<title>(.*?)</title>') {
        $title = $matches[1]
        if ($title.Length -gt 70) {
            Write-Warning "${relPath}: Title is long ($($title.Length) chars): $title"
            $totalWarnings++
        }
    } else {
        Write-Error "${relPath}: Missing <title> tag!"
        $totalErrors++
    }

    # Meta Description check
    if ($content -match '<meta\s+name="description"\s+content="(.*?)"') {
        $desc = $matches[1]
        if ($desc.Length -gt 170) {
            Write-Warning "${relPath}: Meta description long ($($desc.Length) chars)"
            $totalWarnings++
        }
    } else {
        Write-Error "${relPath}: Missing <meta name=`"description`"> tag!"
        $totalErrors++
    }

    # Canonical URL check
    if (-not ($content -match '<link\s+rel="canonical"')) {
        Write-Error "${relPath}: Missing canonical tag!"
        $totalErrors++
    }

    # Open Graph check
    if (-not ($content -match '<meta\s+property="og:title"')) {
        Write-Error "${relPath}: Missing og:title!"
        $totalErrors++
    }

    # JSON-LD Schema check
    if (-not ($content -match '<script\s+type="application/ld\+json"')) {
        Write-Error "${relPath}: Missing JSON-LD Schema!"
        $totalErrors++
    }

    # H1 check
    $h1Matches = [regex]::Matches($content, '<h1[\s>]')
    if ($h1Matches.Count -eq 0) {
        Write-Error "${relPath}: Missing <h1> heading!"
        $totalErrors++
    } elseif ($h1Matches.Count -gt 1) {
        Write-Warning "${relPath}: Multiple ($($h1Matches.Count)) <h1> headings found!"
        $totalWarnings++
    }

    # Accessibility: Skip link
    if (-not ($content -match 'class="skip-link"')) {
        Write-Warning "${relPath}: Missing skip-link for screen readers!"
        $totalWarnings++
    }

    # Lorem Ipsum check
    if ($content -match 'lorem\s+ipsum|dolor\s+sit') {
        Write-Error "${relPath}: Contains placeholder Lorem Ipsum text!"
        $totalErrors++
    }
}

# 2. Check Internal Link Integrity
Write-Output "`n[2/5] Checking Internal Link Resolution..."
$brokenLinks = 0
foreach ($file in $htmlFiles) {
    $content = [System.IO.File]::ReadAllText($file.FullName)
    $fileDir = $file.DirectoryName
    $hrefMatches = [regex]::Matches($content, 'href="([^"#:]+?)"')

    foreach ($match in $hrefMatches) {
        $href = $match.Groups[1].Value

        # Skip external, tel, mailto, anchor-only
        if ($href -match '^https?://' -or $href -match '^mailto:' -or $href -match '^tel:' -or $href -eq '#') {
            continue
        }

        # Resolve target path
        $targetPath = ""
        if ($href.StartsWith("/")) {
            # Root relative
            $cleanHref = $href.TrimStart("/").Replace("/", "\")
            $targetPath = Join-Path $baseDir $cleanHref
        } else {
            # Relative to file
            $cleanHref = $href.Replace("/", "\")
            $targetPath = [System.IO.Path]::GetFullPath((Join-Path $fileDir $cleanHref))
        }

        # If it points to a directory, check for index.html
        if (Test-Path -Path $targetPath -PathType Container) {
            $targetPath = Join-Path $targetPath "index.html"
        }

        if (-not (Test-Path $targetPath)) {
            Write-Error "Broken link in $($file.Name): href='$href' -> Target not found: $targetPath"
            $brokenLinks++
            $totalErrors++
        }
    }
}

# 3. Check Sitemap & Robots.txt
Write-Output "`n[3/5] Validating XML Sitemap & Robots.txt..."
$sitemapPath = Join-Path $baseDir "sitemap.xml"
if (Test-Path $sitemapPath) {
    $sitemapContent = [System.IO.File]::ReadAllText($sitemapPath)
    $locMatches = [regex]::Matches($sitemapContent, '<loc>(https?://.*?/(?:hvac-cost-guide/)?(.*?))</loc>')
    Write-Output "Sitemap contains $($locMatches.Count) URLs."
    
    foreach ($match in $locMatches) {
        $urlPath = $match.Groups[2].Value.Trim("/")
        $expectedDir = if ($urlPath -eq "") { $baseDir } else { Join-Path $baseDir ($urlPath.Replace("/", "\")) }
        $expectedFile = Join-Path $expectedDir "index.html"
        if (-not (Test-Path $expectedFile)) {
            Write-Error "Sitemap URL points to missing file: $($match.Groups[1].Value) (Expected: $expectedFile)"
            $totalErrors++
        }
    }
} else {
    Write-Error "Missing sitemap.xml!"
    $totalErrors++
}

$robotsPath = Join-Path $baseDir "robots.txt"
if (Test-Path $robotsPath) {
    $robotsContent = [System.IO.File]::ReadAllText($robotsPath)
    if (-not ($robotsContent -match 'Sitemap:')) {
        Write-Warning "robots.txt does not mention Sitemap directive."
        $totalWarnings++
    }
} else {
    Write-Error "Missing robots.txt!"
    $totalErrors++
}

# 4. Check Calculator Functionality in JS
Write-Output "`n[4/5] Checking Calculator JS Assets..."
$calcJs = Join-Path $baseDir "assets\js\calculator.js"
$dataJs = Join-Path $baseDir "assets\js\hvac-data.js"
if (Test-Path $calcJs) {
    Write-Output "calculator.js exists and is $( (Get-Item $calcJs).Length ) bytes."
} else {
    Write-Error "Missing assets/js/calculator.js!"
    $totalErrors++
}
if (Test-Path $dataJs) {
    Write-Output "hvac-data.js exists and is $( (Get-Item $dataJs).Length ) bytes."
} else {
    Write-Error "Missing assets/js/hvac-data.js!"
    $totalErrors++
}

# 5. Check CSS Design System
Write-Output "`n[5/5] Checking CSS Design System..."
$cssPath = Join-Path $baseDir "assets\css\styles.css"
if (Test-Path $cssPath) {
    Write-Output "styles.css exists and is $( (Get-Item $cssPath).Length ) bytes."
} else {
    Write-Error "Missing assets/css/styles.css!"
    $totalErrors++
}

Write-Output "`n=================================================="
Write-Output "Validation Complete: $totalErrors Error(s), $totalWarnings Warning(s), $brokenLinks Broken Link(s)."
Write-Output "=================================================="
