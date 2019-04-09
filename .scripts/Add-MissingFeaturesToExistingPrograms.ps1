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
function Add-MissingWebpart($Web, $WebpartName) {
    if ($null -ne $WebpartName) {
        Write-Host $WebpartName
    }
    else {
        return $null
    }
    $serverRelativeUrl = $Web.ServerRelativeUrl
    Connect -Url $Web.Url
    if ($WebpartName -eq "DeliveriesOverview") {
        $url = "$serverRelativeUrl/SitePages/Program-leveranseoversikt.aspx"
    }
    else {
        $url = "$serverRelativeUrl/SitePages/Program$WebpartName.aspx"
    }
    Try {
        Write-Host $url
        Add-PnPWikiPage -PageUrl $url -Layout OneColumn
        Add-PnPWebPartToWikiPage -ServerRelativePageUrl $url -Path "..\templates\root\WebPartGallery\Program$WebpartName.webpart" -Row 1 -Column 1
    }
    Catch {
        Write-Host $_.Exception.Message
    }
}

Connect -Url $Url

$missingWebParts = @("ProjectStats", "ExperienceLog", "DeliveriesOverview", "RiskOverview", "ResourceAllocation")

<# Add Missing SitePages and web parts #>
Get-PnPSubWebs | ForEach-Object {
    $currentWeb = $_
    Try {

        $missingWebParts | ForEach-Object {
            $webpartName = $_
            Try {
                Add-MissingWebpart -Web $currentWeb -WebpartName $webpartName
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
    Apply-PnPProvisioningTemplate -Path ./Navigation.xml
}