param(
  [switch]$NoOpen
)

$ErrorActionPreference = "Stop"
$projectRoot = Split-Path -Parent $PSScriptRoot
$statePath = Join-Path $projectRoot ".daily-planner-server.json"
$logPath = Join-Path $projectRoot ".daily-planner-dev.log"
$errorLogPath = Join-Path $projectRoot ".daily-planner-dev-error.log"
$port = 5173
$url = "http://127.0.0.1:$port/calendar"

function Open-DailyPlanner {
  if (-not $NoOpen) {
    Start-Process $url
  }
}

function Test-ProcessState {
  param($State)

  try {
    $process = Get-Process -Id ([int]$State.launcherPid) -ErrorAction Stop
    if ($process.HasExited) {
      return $false
    }

    $expectedStart = [datetime]::Parse(
      [string]$State.processStartedAtUtc,
      [System.Globalization.CultureInfo]::InvariantCulture
    ).ToUniversalTime()
    $actualStart = $process.StartTime.ToUniversalTime()
    return [math]::Abs(($actualStart - $expectedStart).TotalSeconds) -le 5
  } catch {
    return $false
  }
}

try {
  if (Test-Path -LiteralPath $statePath) {
    try {
      $savedState = Get-Content -LiteralPath $statePath -Raw | ConvertFrom-Json
      if (Test-ProcessState -State $savedState) {
        Open-DailyPlanner
        Write-Host "Daily Planner is already running at $url"
        exit 0
      }
    } catch {
      # A stale state file is replaced after a successful start.
    }

    Remove-Item -LiteralPath $statePath -Force -ErrorAction SilentlyContinue
  }

  $npmCommand = Get-Command "npm.cmd" -ErrorAction Stop

  if (-not (Test-Path -LiteralPath (Join-Path $projectRoot "node_modules"))) {
    Write-Host "First run detected. Installing dependencies..."
    & $npmCommand.Source install --no-audit --no-fund
    if ($LASTEXITCODE -ne 0) {
      throw "Dependency installation failed."
    }
  }

  Write-Host "Starting Daily Planner..."
  $launcher = Start-Process `
    -FilePath $npmCommand.Source `
    -ArgumentList @(
      "run",
      "dev",
      "--",
      "--host",
      "127.0.0.1",
      "--port",
      "$port",
      "--strictPort"
    ) `
    -WorkingDirectory $projectRoot `
    -WindowStyle Hidden `
    -RedirectStandardOutput $logPath `
    -RedirectStandardError $errorLogPath `
    -PassThru

  $deadline = (Get-Date).AddSeconds(30)
  $serverReady = $false

  while ((Get-Date) -lt $deadline) {
    if ($launcher.HasExited) {
      $errorText = Get-Content -LiteralPath $errorLogPath -Raw -ErrorAction SilentlyContinue
      throw "The development server exited before it was ready.`n$errorText"
    }

    try {
      $response = Invoke-WebRequest -UseBasicParsing -Uri $url -TimeoutSec 2
      if ($response.StatusCode -eq 200) {
        $serverReady = $true
        break
      }
    } catch {
      Start-Sleep -Milliseconds 500
    }
  }

  if (-not $serverReady) {
    Stop-Process -Id $launcher.Id -Force -ErrorAction SilentlyContinue
    throw "Daily Planner did not become ready within 30 seconds."
  }

  $state = [ordered]@{
    launcherPid = $launcher.Id
    processStartedAtUtc = $launcher.StartTime.ToUniversalTime().ToString("o")
    port = $port
    url = $url
  }

  $state | ConvertTo-Json | Set-Content -LiteralPath $statePath -Encoding utf8
  Open-DailyPlanner
  Write-Host "Daily Planner is running at $url"
  Write-Host "Use the one-click stop script when finished."
} catch {
  Write-Host ""
  Write-Host "Daily Planner could not start: $($_.Exception.Message)"
  exit 1
}
