Param(
    [Parameter(Mandatory = $true)]
    [string]$Url,
    [Parameter(Mandatory = $false, HelpMessage = "Use current credentials?")]
    [switch]$CurrentCredentials,
    [Parameter(Mandatory = $false, HelpMessage = "Use Web Login?")]
    [switch]$UseWebLogin
)

if ($CurrentCredentials.IsPresent) {
    Connect-PnPOnline -Url $Url -CurrentCredentials
} elseif ($UseWebLogin.IsPresent) {
    Connect-PnPOnline -Url $Url -UseWebLogin
} else {
    Connect-PnPOnline -Url $Url
}

Set-PnPTraceLog -On -Level Debug

<# Add ProgramProjectStats #>
Get-PnPSubWebs | ForEach-Object {
    Connect-PnPOnline -Url $_.Url
    $serverRelativeUrl = $_.ServerRelativeUrl
    $url = $serverRelativeUrl += "/SitePages/ProgramProjectStats.aspx"
    Add-PnPWikiPage -PageUrl $url -Layout OneColumn
    Add-PnPWebPartToWikiPage -ServerRelativePageUrl $url -Path ..\templates\root\WebPartGallery\ProgramProjectStats.webpart -Row 1 -Column 1
}

<# Add ProgramExperienceLog #>
Get-PnPSubWebs | ForEach-Object {
    Connect-PnPOnline -Url $_.Url
    $serverRelativeUrl = $_.ServerRelativeUrl
    $url = $serverRelativeUrl += "/SitePages/ProgramExperienceLog.aspx"
    Add-PnPWikiPage -PageUrl $url -Layout OneColumn
    Add-PnPWebPartToWikiPage -ServerRelativePageUrl $url -Path ..\templates\root\WebPartGallery\ProgramExperienceLog.webpart -Row 1 -Column 1
}

<# Add ProgramDeliveriesOverview #>
Get-PnPSubWebs | ForEach-Object {
    Connect-PnPOnline -Url $_.Url
    $serverRelativeUrl = $_.ServerRelativeUrl
    $url = $serverRelativeUrl += "/SitePages/Program-leveranseoversikt.aspx"
    Add-PnPWikiPage -PageUrl $url -Layout OneColumn
    Add-PnPWebPartToWikiPage -ServerRelativePageUrl $url -Path ..\templates\root\WebPartGallery\ProgramDeliveriesOverview.webpart -Row 1 -Column 1
}

<# Add ProgramRiskOverview #>
Get-PnPSubWebs | ForEach-Object {
    Connect-PnPOnline -Url $_.Url
    $serverRelativeUrl = $_.ServerRelativeUrl
    $url = $serverRelativeUrl += "/SitePages/ProgramRiskOverview.aspx"
    Add-PnPWikiPage -PageUrl $url -Layout OneColumn
    Add-PnPWebPartToWikiPage -ServerRelativePageUrl $url -Path ..\templates\root\WebPartGallery\ProgramRiskOverview.webpart -Row 1 -Column 1
}

<# Add ProgramResourceAllocation #>
Get-PnPSubWebs | ForEach-Object {
    Connect-PnPOnline -Url $_.Url
    $serverRelativeUrl = $_.ServerRelativeUrl
    $url = $serverRelativeUrl += "/SitePages/ProgramResourceAllocation.aspx"
    Add-PnPWikiPage -PageUrl $url -Layout OneColumn
    Add-PnPWebPartToWikiPage -ServerRelativePageUrl $url -Path ..\templates\root\WebPartGallery\ProgramResourceAllocation.webpart -Row 1 -Column 1
}

<# Update Navigation #>
Apply-PnPProvisioningTemplate -Path ./Navigation.xml