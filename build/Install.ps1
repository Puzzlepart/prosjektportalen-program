<#

.SYNOPSIS
This script will install Program to a site collection

.DESCRIPTION
Use the required -Url param to specify the target site collection. You can also install assets and default data to other site collections. The script will provision all the necessary lists, files and settings necessary for Prosjektportalen to work.

.EXAMPLE
./Install.ps1 -Url https://puzzlepart.sharepoint.com/sites/program

.LINK
https://github.com/Puzzlepart/prosjektportalen-program

#>

Param(
    [Parameter(Mandatory = $true, HelpMessage = "Where do you want to install the Project Portal?")]
    [string]$Url,
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
    [Parameter(Mandatory = $false, HelpMessage = "Do you want to skip default config?")]
    [switch]$SkipDefaultConfig
)

. ./SharedFunctions.ps1

# Loads bundle if switch SkipLoadingBundle is not present
if (-not $SkipLoadingBundle.IsPresent) {
    LoadBundle -Environment $Environment
}

# Handling credentials
if ($PSCredential -ne $null) {
    $Credential = $PSCredential
}
elseif ($GenericCredential -ne $null -and $GenericCredential -ne "") {
    $Credential = Get-PnPStoredCredential -Name $GenericCredential -Type PSCredential 
}
elseif ($Credential -eq $null -and -not $UseWebLogin.IsPresent -and -not $CurrentCredentials.IsPresent) {
    $Credential = (Get-Credential -Message "Please enter your username and password")
}

if (-not $AssetsUrl) {
    $AssetsUrl = $Url
}

if (-not $DataSourceSiteUrl) {
    $DataSourceSiteUrl = $Url
}

# Start installation
function Start-Install() {
    Connect-SharePoint $Url 
    $CurrentPPVersion = ParseVersion -VersionString (Get-PnPPropertyBag -Key pp_version)
    if (-not $CurrentPPVersion) {
        $CurrentPPVersion = "N/A"

        if ($ProjectPortalReleasePath -eq $null) {
            Write-Host "Project Portal is not installed on the specified URL. You need to specify ProjectPortalReleasePath to install Project Portal first." -ForegroundColor Red
            exit 1 
        }
    }
    $CurrentProgramVersion = ParseVersion -VersionString (Get-PnPPropertyBag -Key pp_program_version)
    if (-not $CurrentProgramVersion) {
        $CurrentProgramVersion = "N/A"
    }

    # Prints header
    Write-Host "############################################################################" -ForegroundColor Green
    Write-Host "" -ForegroundColor Green
    Write-Host "Installing Program v{package-version}" -ForegroundColor Green
    Write-Host "" -ForegroundColor Green
    Write-Host "Installation URL:`t`t[$Url]" -ForegroundColor Green
    Write-Host "Environment:`t`t`t[$Environment]" -ForegroundColor Green
    Write-Host "Project Portal Version:`t`t[$CurrentPPVersion]" -ForegroundColor Green
    Write-Host "Program Version:`t`t[$CurrentProgramVersion]" -ForegroundColor Green
    Write-Host "" -ForegroundColor Green
    Write-Host "############################################################################" -ForegroundColor Green

    # Starts stop watch
    $sw = [Diagnostics.Stopwatch]::StartNew()
    $ErrorActionPreference = "Stop"

    # Sets up PnP trace log
    if ($Logging -eq "File") {
        $execDateTime = Get-Date -Format "yyyyMMdd_HHmmss"
        Set-PnPTraceLog -On -Level Debug -LogFile "pplog-$execDateTime.txt"
    }
    elseif ($Logging -eq "Host") {
        Set-PnPTraceLog -On -Level Debug
    }
    else {
        Set-PnPTraceLog -Off
    }

    if ($ProjectPortalReleasePath) {    
        # Installing project portal base
        $OriginalPSScriptRoot = $PSScriptRoot
        try {
            Set-Location $ProjectPortalReleasePath
            Write-Host "Installing Project Portal (estimated approx. 20 minutes)..." -ForegroundColor Green
            if ($CurrentCredentials.IsPresent) {
                .\Install.ps1 -Url $Url -CurrentCredentials -SkipData -SkipTaxonomy -SkipDefaultConfig -SkipLoadingBundle:$SkipLoadingBundle -Environment:$Environment
            }
            else {
                .\Install.ps1 -Url $Url -PSCredential $Credential -SkipData -SkipTaxonomy -SkipDefaultConfig -SkipLoadingBundle:$SkipLoadingBundle -Environment:$Environment
            }
            Set-Location $OriginalPSScriptRoot
        }
        catch {
            Set-Location $OriginalPSScriptRoot
            Write-Host
            Write-Host "Error installing project portal" -ForegroundColor Red
            Write-Host $error[0] -ForegroundColor Red
            exit 1 
        }
    }
    
    Connect-SharePoint $Url 
    
    # Installing root
    try { 
        Write-Host "Deploying root-package with fields, content types, lists and pages..." -ForegroundColor Green -NoNewLine
        Apply-Template -Template root -ExcludeHandlers PropertyBagEntries
        Write-Host "`tDONE" -ForegroundColor Green
    }
    catch {
        Write-Host
        Write-Host "Error installing root-package to $Url" -ForegroundColor Red
        Write-Host $error[0] -ForegroundColor Red
        exit 1 
    }
    
    
    if (-not $SkipDefaultConfig.IsPresent) {
        # Installing config
        try {
            Write-Host "Deploying default config.." -ForegroundColor Green -NoNewLine
            Apply-Template -Template config
            Write-Host "`t`t`t`t`t`tDONE" -ForegroundColor Green
        }
        catch {
            Write-Host
            Write-Host "Error installing default config to $Url" -ForegroundColor Red
            Write-Host $error[0] -ForegroundColor Red
        }
    }

    try {
        Write-Host "Updating web property bag..." -ForegroundColor Green -NoNewLine
        Apply-Template -Template "root" -Localized -Handlers PropertyBagEntries
        Write-Host "`t`t`t`t`t`tDONE" -ForegroundColor Green
    }
    catch {
        Write-Host
        Write-Host "Error updating web property bag for $Url" -ForegroundColor Red
        Write-Host $error[0] -ForegroundColor Red
        exit 1 
    }
        
    Disconnect-PnPOnline
    $sw.Stop()
    Write-Host "Installation completed in [$($sw.Elapsed)]" -ForegroundColor Green
}

Start-Install
