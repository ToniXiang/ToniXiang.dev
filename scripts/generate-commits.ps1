# Run .\scripts\generate-notes-metadata.ps1
# PowerShell script to generate notes metadata with proper UTF-8 encoding

# Set console output encoding to UTF-8
$OutputEncoding = [System.Text.Encoding]::UTF8
[Console]::OutputEncoding = [System.Text.Encoding]::UTF8


Write-Host "Generating notes metadata..."

try {
    $notesPath = ".\assets\notes"
    $notesMetadata = @{}

    if (Test-Path $notesPath) {
        $noteFiles = Get-ChildItem -Path $notesPath -Filter "*.md"

        foreach ($file in $noteFiles) {
            # Get last modified date of the file
            $lastModified = $file.LastWriteTime.ToString("yyyy/MM/dd")

            $notesMetadata[$file.Name] = @{
                filename = $file.Name
                lastModified = $lastModified
            }

            Write-Host "  $($file.Name): $lastModified" -ForegroundColor Cyan
        }

        # Convert to JSON
        $notesJsonOutput = $notesMetadata | ConvertTo-Json -Depth 10

        # Write to file with UTF-8 encoding (no BOM)
        $notesOutputPath = ".\assets\js\notes-metadata.json"
        [System.IO.File]::WriteAllText((Resolve-Path $notesOutputPath), $notesJsonOutput, [System.Text.UTF8Encoding]::new($false))

        Write-Host "Successfully generated notes metadata:" -ForegroundColor Green
        Write-Host "  Total notes: $($noteFiles.Count)" -ForegroundColor Green
        Write-Host "  Output file: $notesOutputPath" -ForegroundColor Green
    } else {
        Write-Host "  Notes directory not found: $notesPath" -ForegroundColor Yellow
    }

} catch {
    Write-Error "Error generating notes metadata: $($_.Exception.Message)"
    exit 1
}
