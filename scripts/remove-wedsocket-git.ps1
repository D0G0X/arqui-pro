<#
  remove-wedsocket-git.ps1
  Usage: run this script from PowerShell. It will:
    - rename backend/wedsocket/.git -> .git-backup (backup)
    - remove any cached nested git index in main repo
    - add backend/wedsocket to main repo and commit
    - (optionally) push to origin

  IMPORTANT: This script runs git commands on your machine. Review it before running.
#>

Param(
  [switch]$Push
)

Set-StrictMode -Version Latest

$wspath = Join-Path $PSScriptRoot '..\backend\wedsocket'
$wspath = (Resolve-Path $wspath).Path

Write-Host "wedsocket path: $wspath"

if (-not (Test-Path (Join-Path $wspath '.git'))) {
  Write-Host "No nested .git found at $wspath. Aborting." -ForegroundColor Yellow
  exit 1
}

Write-Host "Renaming nested .git to .git-backup..."
Try {
  Rename-Item -LiteralPath (Join-Path $wspath '.git') -NewName '.git-backup' -ErrorAction Stop
  Write-Host "Renamed .git -> .git-backup"
} Catch {
  Write-Error "Failed to rename .git: $_"
  exit 1
}

Write-Host "Adding backend/wedsocket to main repo and committing..."
$root = Resolve-Path "$PSScriptRoot\.."
Set-Location $root.Path

try {
  git rm -r --cached backend/wedsocket -f 2>$null | Out-Null
} catch {
  # ignore
}

$add = git add backend/wedsocket
Write-Host $add

$status = git commit -m "Add wedsocket folder into main repo (removed nested git metadata)" 2>&1
Write-Host $status

if ($Push) {
  Write-Host "Pushing to origin..."
  $pushOut = git push 2>&1
  Write-Host $pushOut
}

Write-Host "Done. If you want to permanently remove the backup, delete $wspath\.git-backup"
