# Carga token local y sube a main; el deploy corre en GitHub Actions (workflow Deploy GitHub Pages).
$ErrorActionPreference = 'Stop'
$root = Split-Path -Parent (Split-Path -Parent $MyInvocation.MyCommand.Path)
$envFile = Join-Path $root 'local.credentials.env'
if (-not (Test-Path $envFile)) {
  Write-Error "Falta local.credentials.env en la raíz del proyecto."
}
Get-Content $envFile | ForEach-Object {
  if ($_ -match '^\s*([^#=]+)=(.*)$') {
    [Environment]::SetEnvironmentVariable($matches[1].Trim(), $matches[2].Trim(), 'Process')
  }
}
Set-Location $root
git add -A
$status = git status --porcelain
if (-not $status) {
  Write-Host 'Sin cambios para commitear.'
} else {
  if (-not $args[0]) { Write-Error 'Uso: .\scripts\push-y-deploy.ps1 "mensaje del commit"' }
  git commit -m $args[0]
}
$env:GIT_TERMINAL_PROMPT = '0'
git push origin main
Write-Host 'Push OK. Despliegue: Actions → Deploy GitHub Pages (automático en push a main).'
if ($env:GH_TOKEN) {
  gh workflow run 'Deploy GitHub Pages' -R RUGDRAIGER/Bomberos-de-R-o-Bueno 2>$null
}
