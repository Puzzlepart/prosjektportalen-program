﻿Param(
    [Parameter(Mandatory = $true)]
    [string]$Url,
    [Parameter(Mandatory = $false, HelpMessage = "Use current credentials?")]
    [switch]$CurrentCredentials,
    [Parameter(Mandatory = $false, HelpMessage = "Use Web Login?")]
    [switch]$UseWebLogin,
    [Parameter(Mandatory = $false, HelpMessage = "Stored credential from Windows Credential Manager")]
    [string]$GenericCredential
)

function Add-MissingWebpart($Web, $WebpartName, $WebpartFilename, $RootWeb) {
    $serverRelativeUrl = $RootWeb.ServerRelativeUrl
    $subwebRelativeUrl = $Web.ServerRelativeUrl
    Try {
        $file = Get-PnPFile -Url "$subwebRelativeUrl/SitePages/Program$WebpartFilename.aspx" -ErrorAction SilentlyContinue
        if ($null -eq $file) {   
            Copy-PnPFile -SourceUrl "Resources/SitePage_OneColumn.txt" -TargetUrl "$subwebRelativeUrl/SitePages" -OverwriteIfAlreadyExists -Force
            Rename-PnPFile -ServerRelativeUrl "$subwebRelativeUrl/SitePages/SitePage_OneColumn.txt" -TargetFileName "Program$WebpartFilename.aspx" -Force -Web $Web
        }
        $webparts = Get-PnPWebPart -ServerRelativePageUrl "$subwebRelativeUrl/SitePages/Program$WebpartFilename.aspx"
        if ($null -ne $webparts) {
            $webparts | ForEach-Object {
                Remove-PnPWebPart -Identity $_.Id -ServerRelativePageUrl "$subwebRelativeUrl/SitePages/Program$WebpartFilename.aspx" -Web $Web
            }
        }
        $xml = Get-PnPFile -Url "$serverRelativeUrl/_catalogs/wp/Program$WebpartFilename.webpart" -AsString
        $url = "$subwebRelativeUrl/SitePages/Program$WebpartFilename.aspx"
        Add-PnPWebPartToWebPartPage -ServerRelativePageUrl $url -Xml $xml -ZoneId "MainColumn" -ZoneIndex 1 -Web $Web

        $navParent = Get-PnPNavigationNode -Web $Web | Where-Object { $_.Title -Eq "Programmets prosjekter" }
        if ($null -ne $navParent) {
            $navSiblings = Get-PnPProperty -ClientObject $navParent -Property "Children" 
            $navNode = $navSiblings | Where-Object { $_.Title -Eq $WebpartName }
            if ($null -eq $navNode) {            
                Add-PnPNavigationNode -Location "QuickLaunch" -Title $WebpartName -Parent $navParent.Id -Url "$subwebRelativeUrl/SitePages/Program$WebpartFilename.aspx" -Web $Web | Out-Null
            } 
        }
    }
    Catch {
        Write-Host $_.Exception.Message
    }
}

if ($CurrentCredentials.IsPresent) {
    Connect-PnPOnline -Url $Url -CurrentCredentials
} elseif ($UseWebLogin.IsPresent) {
    Connect-PnPOnline -Url $Url -UseWebLogin
} elseif ($GenericCredential -ne $null) {
    Connect-PnPOnline -Url $Url -Credentials $GenericCredential
} else {
    Connect-PnPOnline -Url $Url
}

$missingWebParts = @(
    @{Filename = "ProjectStats"; Name = [uri]::UnescapeDataString("Portef%C3%B8ljeinnsikt")}, 
    @{Filename = "ExperienceLog"; Name = "Erfaringslogg"},
    @{Filename = "DeliveriesOverview"; Name = "Leveranseoversikt"}, 
    @{Filename = "RiskOverview"; Name = "Risikooversikt"},
    @{Filename = "ResourceAllocation"; Name = "Ressursallokering"})

$web = Get-PnPWeb

$i = 0
$subwebs = Get-PnPSubWebs
Write-Host "Adding missing pages and web parts" -ForegroundColor Green
$subwebs | ForEach-Object {
    Write-Progress -Id 1 -Activity "Updating programs" -Status "$i/$($subwebs.Count)" -PercentComplete (($i / $subwebs.Count) * 100)
    Write-Host Processing site $_.Title
    $currentWeb = $_
    Try {
        $j = 0
        $missingWebParts | ForEach-Object {
            Try {
                Add-MissingWebpart -Web $currentWeb -WebpartName $_.Name -WebpartFilename $_.Filename -RootWeb $web
                $j++
            }
            Catch {
                Write-Host "Failed to add missing webpart"
            }
            Write-Progress -Id 2 -ParentId 1 -Activity "Adding missing pages, web parts and updating navigation" -Status "$j/$($missingWebParts.Count)" -PercentComplete (($j / $missingWebParts.Count) * 100)
        }
    }
    Catch {
        $_.Exception.Message
    }
    $i++
    Write-Progress -Id 1 -Activity "Updating programs" -Status "$i/$($subwebs.Count)" -PercentComplete (($i / $subwebs.Count) * 100)
}