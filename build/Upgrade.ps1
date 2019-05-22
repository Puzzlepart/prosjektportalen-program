<#

.SYNOPSIS
This script will upgrade Program to a site collection

.DESCRIPTION
Use the required -Url param to specify the target site collection. The script will provision all the necessary lists, files and settings necessary for Prosjektportalen+Program to work.

.EXAMPLE
./Upgrade.ps1 -Url https://puzzlepart.sharepoint.com/sites/program

.LINK
https://github.com/Puzzlepart/prosjektportalen-program

#>

Param(
    [Parameter(Mandatory = $true, HelpMessage = "Where do you want to install the Program customizations?")]
    [string]$Url,
    [Parameter(Mandatory = $false, HelpMessage = "Where do you want to install the required resources?")]
    [string]$AssetsUrl,
    [Parameter(Mandatory = $false, HelpMessage = "Do you want to handle PnP libraries and PnP PowerShell without using bundled files?")]
    [switch]$SkipLoadingBundle,
    [Parameter(Mandatory = $false, HelpMessage = "Stored credential from Windows Credential Manager")]
    [string]$GenericCredential,
    [Parameter(Mandatory = $false, HelpMessage = "Use Web Login to connect to SharePoint. Useful for e.g. ADFS environments.")]
    [switch]$UseWebLogin,
    [Parameter(Mandatory = $false, HelpMessage = "Use the credentials of the current user to connect to SharePoint. Useful e.g. if you install directly from the server.")]
    [switch]$CurrentCredentials,
    [Parameter(Mandatory = $false, HelpMessage = "PowerShell credential to authenticate with")]
    [System.Management.Automation.PSCredential]$PSCredential,
    [Parameter(Mandatory = $false, HelpMessage = "Installation Environment. If SkipLoadingBundle is set, this will be ignored")]
    [ValidateSet('SharePointPnPPowerShell2013', 'SharePointPnPPowerShell2016', 'SharePointPnPPowerShellOnline')]
    [string]$Environment = "SharePointPnPPowerShellOnline",
    [Parameter(Mandatory = $false, HelpMessage = "Path to Project Portal release folder")]
    [string]$ProjectPortalReleasePath,
    [Parameter(Mandatory = $false)]
    [ValidateSet('None', 'File', 'Host')]
    [string]$Logging = "File"
)

$ErrorActionPreference = "Stop"

# Fix encoding issues of scripts
Get-ChildItem .\scripts\* -Recurse *.ps1 | % { $content=$_ | Get-Content; Set-Content -PassThru $_.FullName $content -Encoding UTF8 -Force} > $null

# Handling credentials
if ($PSCredential -ne $null) {
    $Credential = $PSCredential
}
elseif ($GenericCredential -ne $null -and $GenericCredential -ne "") {
    $Credential = Get-PnPStoredCredential -Name $GenericCredential -Type PSCredential 
}
elseif ($null -eq $Credential -and -not $UseWebLogin.IsPresent -and -not $CurrentCredentials.IsPresent) {
    $Credential = (Get-Credential -Message "Please enter your username and password")
}

if (-not $AssetsUrl) {
    $AssetsUrl = $Url
}

try {
    .\Install.ps1 -Url $Url -AssetsUrl $AssetsUrl -Environment $Environment -Upgrade -PSCredential $Credential -UseWebLogin:$UseWebLogin -CurrentCredentials:$CurrentCredentials -SkipLoadingBundle -Logging $Logging -ProjectPortalReleasePath $ProjectPortalReleasePath
}
catch {
    Write-Host
    Write-Host "Error upgrading Project Portal. Aborting"
    exit 1
}