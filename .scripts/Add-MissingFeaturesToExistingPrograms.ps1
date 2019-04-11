Param(
    [Parameter(Mandatory = $true)]
    [string]$Url,
    [Parameter(Mandatory = $false, HelpMessage = "Use current credentials?")]
    [switch]$CurrentCredentials,
    [Parameter(Mandatory = $false, HelpMessage = "Use Web Login?")]
    [switch]$UseWebLogin
)

function Connect($Url) {
    if ($CurrentCredentials.IsPresent) {
        Connect-PnPOnline -Url $Url -CurrentCredentials
    }
    elseif ($UseWebLogin.IsPresent) {
        Connect-PnPOnline -Url $Url -UseWebLogin
    }
    else {
        Connect-PnPOnline -Url $Url
    }
}

<# Add ProgramProjectStats #>
function Add-MissingWebpart($Web, $WebpartName, $RootWeb) {
    $serverRelativeUrl = $RootWeb.ServerRelativeUrl
    $subwebRelativeUrl = $Web.ServerRelativeUrl

    if ($WebpartName -eq "DeliveriesOverview") {
        $targetFileName = "Program-leveranseoversikt.aspx"
    }
    else {
        $targetFileName = "Program$WebpartName.aspx"
    }
    Try {
        $file = Get-PnPFile -Url "$subwebRelativeUrl/SitePages/$targetFileName"
        if ($null -eq $file) {   
            Copy-PnPFile -SourceUrl "Resources/SitePage_OneColumn.txt" -TargetUrl "$subwebRelativeUrl/SitePages" -OverwriteIfAlreadyExists -Force
            Rename-PnPFile -ServerRelativeUrl "$subwebRelativeUrl/SitePages/SitePage_OneColumn.txt" -TargetFileName $targetFileName -Force -Web $Web
        }
        $webparts = Get-PnPWebPart -ServerRelativePageUrl "$subwebRelativeUrl/SitePages/$targetFileName"
        if ($null -ne $webparts) {
            $webparts | ForEach-Object {
                Remove-PnPWebPart -Identity $_.Id -ServerRelativePageUrl "$subwebRelativeUrl/SitePages/$targetFileName" -Web $Web
            }
        }
        $xml = Get-PnPFile -Url "$serverRelativeUrl/_catalogs/wp/Program$WebpartName.webpart" -AsString
        $url = "$subwebRelativeUrl/SitePages/$targetFileName"
        Add-PnPWebPartToWebPartPage -ServerRelativePageUrl $url -Xml $xml -ZoneId "Header" -ZoneIndex 1 -Web $Web
    }
    Catch {
        Write-Host $_.Exception.Message
    }
}

Connect -Url $Url

$missingWebParts = @("ProjectStats", "ExperienceLog", "DeliveriesOverview", "RiskOverview", "ResourceAllocation")

$web = Get-PnPWeb

<# Add Missing SitePages and web parts #>
Get-PnPSubWebs | ForEach-Object {
    $currentWeb = $_
    Try {

        $missingWebParts | ForEach-Object {
            $webpartName = $_
            Try {
                Add-MissingWebpart -Web $currentWeb -WebpartName $webpartName -RootWeb $web
            }
            Catch {
                Write-Host "Failed to add missing webpart"
            }
        }
    }
    Catch {
        $_.Exception.Message
    }
    <# Update Navigation #>
    Apply-PnPProvisioningTemplate -Path ./Navigation.xml -Web $currentWeb
}