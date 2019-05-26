# Connect to SharePoint
function Connect-SharePoint ($Url) {
    if ($UseWebLogin.IsPresent) {
        Connect-PnPOnline $Url -UseWebLogin
    } elseif ($CurrentCredentials.IsPresent) {
        Connect-PnPOnline $Url -CurrentCredentials
    } else {
        Connect-PnPOnline $Url -Credentials $Credential
    }
}

# Get web language
function Get-WebLanguage($ctx) {
    $web = $ctx.Web
    $ctx.Load($web)
    $ctx.ExecuteQuery()
    return $web.Language
}

# Merge hash tables
function Merge-Hashtables {
    $Output = @{}
    ForEach ($Hashtable in ($Input + $Args)) {
        If ($Hashtable -is [Hashtable]) {
            ForEach ($Key in $Hashtable.Keys) {$Output.$Key = $Hashtable.$Key}
        }
    }
    $Output
}

# Apply tepmplate
function Apply-Template([string]$Template, [switch]$Localized, [OfficeDevPnP.Core.Framework.Provisioning.Model.Handlers]$Handlers = "All", [OfficeDevPnP.Core.Framework.Provisioning.Model.Handlers]$ExcludeHandlers, [HashTable]$Parameters = @{}) {    
    $Language = Get-WebLanguage -ctx (Get-PnPContext)
    if ($Localized.IsPresent) {
        $Template = "$($Template)-$($Language)"
    }
    if ($ExcludeHandlers -ne $null) {
        Apply-PnPProvisioningTemplate ".\templates\$($Template).pnp" -Parameters $MergedParameters -ExcludeHandlers $ExcludeHandlers
    } else {
        Apply-PnPProvisioningTemplate ".\templates\$($Template).pnp" -Parameters $MergedParameters -Handlers $Handlers
    }
}

# Aim at using relative urls for referencing scripts, images etc.
function Get-SecondaryUrlAsParam ([string]$RootUrl, $SecondaryUrl) {
    $RootUri = New-Object -TypeName System.Uri -ArgumentList $RootUrl
    $SecondaryUri = New-Object -TypeName System.Uri -ArgumentList $SecondaryUrl

    if ($RootUri.Host -eq $SecondaryUri.Host) {
        if ($SecondaryUri.LocalPath -eq "/") {
            return ""
        }
        return $SecondaryUri.LocalPath
    } else {
        return $SecondaryUrl
    }
}

function Get-WebLanguage($ctx) {
    $web = $ctx.Web
    $ctx.Load($web)
    $ctx.ExecuteQuery()
    return $web.Language
}

function ParseVersion($VersionString) {
    if($VersionString  -like "*.*.*#*") {
        $vs = $VersionString.Split("#")[0]
        return [Version]($vs)
    }
    if($VersionString  -like "*.*.*.*") {
        $vs = $VersionString.Split(".")[0..2] -join "."
        return [Version]($vs)
    }
    if($VersionString  -like "*.*.*") {
        return [Version]($VersionString)
    }
}