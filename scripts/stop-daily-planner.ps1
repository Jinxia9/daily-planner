$ErrorActionPreference = "Stop"
$projectRoot = Split-Path -Parent $PSScriptRoot
$statePath = Join-Path $projectRoot ".daily-planner-server.json"

function Get-DescendantProcessIds {
  param([int]$ParentId)

  $children = @(
    Get-CimInstance Win32_Process `
      -Filter "ParentProcessId = $ParentId" `
      -ErrorAction SilentlyContinue
  )

  foreach ($child in $children) {
    Get-DescendantProcessIds -ParentId ([int]$child.ProcessId)
    [int]$child.ProcessId
  }
}

try {
  if (-not (Test-Path -LiteralPath $statePath)) {
    Write-Host "Daily Planner is not running from the one-click launcher."
    exit 0
  }

  $state = Get-Content -LiteralPath $statePath -Raw | ConvertFrom-Json
  $launcherId = [int]$state.launcherPid
  $launcher = Get-Process -Id $launcherId -ErrorAction Stop

  $expectedStart = [datetime]::Parse(
    [string]$state.processStartedAtUtc,
    [System.Globalization.CultureInfo]::InvariantCulture
  ).ToUniversalTime()
  $actualStart = $launcher.StartTime.ToUniversalTime()

  if ([math]::Abs(($actualStart - $expectedStart).TotalSeconds) -gt 5) {
    Remove-Item -LiteralPath $statePath -Force
    throw "The saved process is no longer the Daily Planner launcher."
  }

  $processIds = @(Get-DescendantProcessIds -ParentId $launcherId)
  $processIds += $launcherId

  foreach ($processId in $processIds) {
    Stop-Process -Id $processId -Force -ErrorAction SilentlyContinue
  }

  Remove-Item -LiteralPath $statePath -Force -ErrorAction SilentlyContinue
  Write-Host "Daily Planner has been stopped."
} catch {
  Write-Host ""
  Write-Host "Daily Planner could not be stopped: $($_.Exception.Message)"
  exit 1
}
