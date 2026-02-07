# Run .\scripts\generate-commits.ps1 -ShowAll
# PowerShell script to generate commits data with proper UTF-8 encoding
param([int]$MaxCommits = 100, [switch]$ShowAll)

# Set console output encoding to UTF-8
$OutputEncoding = [System.Text.Encoding]::UTF8
[Console]::OutputEncoding = [System.Text.Encoding]::UTF8

Write-Host "Generating commits data..."

try {
    # Get commit data using git log with proper UTF-8 encoding
    $commits = @()

    # Use git log with UTF-8 encoding
    $env:LC_ALL = "C.UTF-8"

    # If MaxCommits is very large (10000+), get all commits
    if ($MaxCommits -ge 10000) {
        Write-Host "Getting all commits (unlimited mode)..." -ForegroundColor Yellow
        $gitOutput = git -c core.quotepath=false log --pretty=format:"%H|%s|%an|%ae|%ai" --encoding=UTF-8
    } else {
        $gitOutput = git -c core.quotepath=false log --pretty=format:"%H|%s|%an|%ae|%ai" -n $MaxCommits --encoding=UTF-8
    }

    foreach ($line in $gitOutput) {
        if (-not [string]::IsNullOrWhiteSpace($line)) {
            $parts = $line -split '\|', 5
            if ($parts.Length -eq 5) {
                $message = $parts[1]

                # If ShowAll is specified, include all commits
                # Otherwise, filter out automated commits
                $shouldInclude = $ShowAll -or -not (
                    $message.ToLower() -like "*chore(ci): update languages.json*" -or
                    $message.ToLower() -like "*chore(ci): update commits.json*" -or
                    $message.ToLower() -like "*update languages.json*" -or
                    $message.ToLower() -like "*update commits.json*"
                )

                if ($shouldInclude) {
                    # Output only non-personal commit data
                    $commit = @{
                        sha = $parts[0]
                        message = $parts[1]
                        date = $parts[4]
                    }
                    $commits += $commit
                }
            }
        }
    }

    # Limit to MaxCommits only if it's not unlimited mode
    if ($MaxCommits -lt 10000) {
        $commits = $commits | Select-Object -First $MaxCommits
    }

    # Create output data
    $outputData = @{
        commits = $commits
    }

    # Convert to JSON
    $jsonOutput = $outputData | ConvertTo-Json -Depth 10

    # Ensure output directory exists
    $outputPath = ".\assets\js\commits.json"
    $outputDir = ".\assets\js"

    if (-not (Test-Path $outputDir)) {
        New-Item -ItemType Directory -Path $outputDir -Force | Out-Null
    }

    # Write to file with UTF-8 encoding (no BOM)
    [System.IO.File]::WriteAllText((Resolve-Path $outputPath), $jsonOutput, [System.Text.UTF8Encoding]::new($false))

    Write-Host "Successfully generated commits data:" -ForegroundColor Green
    Write-Host "  Total commits: $($commits.Count)" -ForegroundColor Green
    Write-Host "  Output file: $outputPath" -ForegroundColor Green
    Write-Host "  Timestamp: $($outputData.timestamp)" -ForegroundColor Green

    if ($ShowAll) {
        Write-Host "  Mode: All commits included" -ForegroundColor Yellow
    } else {
        Write-Host "  Mode: Filtered commits (automation excluded)" -ForegroundColor Yellow
    }

} catch {
    Write-Error "Error generating commits data: $($_.Exception.Message)"
    exit 1
}