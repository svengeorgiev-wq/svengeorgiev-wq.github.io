param(
  [Parameter(Mandatory = $true)]
  [string]$DocumentPath,

  [string]$OutputPath = (Join-Path (Split-Path -Parent $PSScriptRoot) 'content.js'),

  [switch]$ResolveDoi
)

$ErrorActionPreference = 'Stop'
Add-Type -AssemblyName System.IO.Compression.FileSystem

function Get-Paragraphs([string]$Path) {
  $archive = [System.IO.Compression.ZipFile]::OpenRead($Path)
  try {
    $entry = $archive.GetEntry('word/document.xml')
    if (-not $entry) { throw 'word/document.xml fehlt.' }
    $reader = [System.IO.StreamReader]::new($entry.Open())
    try { [xml]$xml = $reader.ReadToEnd() } finally { $reader.Dispose() }

    $ns = [System.Xml.XmlNamespaceManager]::new($xml.NameTable)
    $ns.AddNamespace('w', 'http://schemas.openxmlformats.org/wordprocessingml/2006/main')
    $index = 0
    foreach ($paragraph in $xml.SelectNodes('//w:body//w:p', $ns)) {
      $text = (($paragraph.SelectNodes('.//w:t', $ns) | ForEach-Object { $_.InnerText }) -join '').Trim()
      if (-not $text) { continue }
      $index++
      [pscustomobject]@{ Index = $index; Text = $text }
    }
  } finally {
    $archive.Dispose()
  }
}

function Normalize([string]$Text) {
  $formD = $Text.Normalize([Text.NormalizationForm]::FormD)
  $withoutMarks = -join ($formD.ToCharArray() | Where-Object {
    [Globalization.CharUnicodeInfo]::GetUnicodeCategory($_) -ne [Globalization.UnicodeCategory]::NonSpacingMark
  })
  return (($withoutMarks.ToLowerInvariant() -replace '[^a-z0-9]+', ' ') -replace '\s+', ' ').Trim()
}

function Get-Year($Item) {
  foreach ($property in @('published-print', 'published-online', 'published', 'issued')) {
    $value = $Item.$property
    if ($value -and $value.'date-parts' -and $value.'date-parts'[0][0]) {
      return [int]$value.'date-parts'[0][0]
    }
  }
  return $null
}

function Resolve-DoiForCitation([string]$Citation, [int]$Year) {
  $uri = 'https://api.crossref.org/works?rows=5&select=DOI,title,published,published-print,published-online,issued&query.bibliographic=' + [uri]::EscapeDataString($Citation) + '&mailto=info%40munichpublishing.de'
  $headers = @{ 'User-Agent' = 'MunichPublishing-PWA-QA/1.0 (mailto:info@munichpublishing.de)' }
  $response = Invoke-RestMethod -Uri $uri -Headers $headers -TimeoutSec 30
  $normalizedCitation = Normalize $Citation
  foreach ($item in $response.message.items) {
    $candidateTitle = [string]($item.title | Select-Object -First 1)
    if (-not $candidateTitle -or -not $item.DOI) { continue }
    $normalizedTitle = Normalize $candidateTitle
    $candidateYear = Get-Year $item
    $yearMatches = (-not $Year) -or (-not $candidateYear) -or ([math]::Abs($candidateYear - $Year) -le 1)
    if ($yearMatches -and $normalizedTitle.Length -ge 14 -and $normalizedCitation.Contains($normalizedTitle)) {
      return ([string]$item.DOI).ToLowerInvariant()
    }
  }
  return $null
}

$paragraphs = @(Get-Paragraphs $DocumentPath)

$days = [Collections.Generic.List[object]]::new()
$week = ''
for ($i = 0; $i -lt $paragraphs.Count; $i++) {
  $text = $paragraphs[$i].Text
  if ($text -match '^WOCHE\s+\d+\s+·\s+(.+)$') {
    $week = $Matches[1]
    continue
  }
  if ($text -notmatch '^TAG\s+(\d+)\s+·\s+(.+)$') { continue }

  $day = [ordered]@{
    number = [int]$Matches[1]
    title = $Matches[2]
    week = $week
    impulse = ''
    impulseBenefit = ''
    exercise = ''
    exerciseBenefit = ''
    reflection = ''
    reflectionBenefit = ''
    chapter = ''
    restDay = ($Matches[2] -eq 'Ruhetag')
  }
  $benefitSlot = ''
  for ($j = $i + 1; $j -lt $paragraphs.Count; $j++) {
    $line = $paragraphs[$j].Text
    if ($line -match '^(TAG|WOCHE)\s+') { break }
    if ($line -match '^Impuls\s+—\s+(.+)$') { $day.impulse = $Matches[1]; $benefitSlot = 'impulseBenefit'; continue }
    if ($line -match '^Übung\s+—\s+(.+)$') { $day.exercise = $Matches[1]; $benefitSlot = 'exerciseBenefit'; continue }
    if ($line -match '^Reflexionsfrage\s+—\s+(.+)$') { $day.reflection = $Matches[1]; $benefitSlot = 'reflectionBenefit'; continue }
    if ($line -match '^Das bringt es dir:\s*(.+)$' -and $benefitSlot) { $day[$benefitSlot] = $Matches[1]; continue }
    if ($line -match '^Kapitel\s+—\s+(.+)$') { $day.chapter = $Matches[1]; continue }
  }
  $days.Add([pscustomobject]$day)
}

$tools = [Collections.Generic.List[object]]::new()
$toolChapter = ''
foreach ($paragraph in ($paragraphs | Where-Object { $_.Index -ge 991 -and $_.Index -le 1026 })) {
  if ($paragraph.Text -match '^Kapitel\s+(\d+)\s+·\s+(.+)$') {
    $toolChapter = 'Kapitel ' + $Matches[1] + ' – ' + $Matches[2]
    continue
  }
  if ($paragraph.Text -match '^(\d+)\.\s+(.+?)\s+(★{1,3})\s+–\s+(.+)$') {
    $number = [int]$Matches[1]
    $state = if ($number -in 13,14) { 'rot' } elseif ($number -in 19,21,22) { 'gruen' } else { 'gelb' }
    $tools.Add([pscustomobject][ordered]@{
      number = $number
      title = $Matches[2]
      stars = $Matches[3].Length
      summary = $Matches[4]
      chapter = $toolChapter
      state = $state
    })
  }
}

$sourceMap = [ordered]@{}
$chapterNumber = 0
foreach ($paragraph in $paragraphs) {
  if ($paragraph.Index -gt 50 -and $paragraph.Text -match '^Kapitel\s+(\d+)\s+–\s+(.+)$') {
    $chapterNumber = [int]$Matches[1]
    continue
  }
  if ($chapterNumber -lt 1 -or $chapterNumber -gt 11) { continue }
  if ($paragraph.Text -notmatch '^[¹²³⁴⁵⁶⁷⁸⁹⁰]+\s+(.+)$') { continue }
  $citation = $Matches[1]
  $key = Normalize $citation
  if (-not $sourceMap.Contains($key)) {
    $year = if ($citation -match '\((\d{4})\)') { [int]$Matches[1] } else { $null }
    $sourceMap[$key] = [ordered]@{
      id = 'quelle-' + ($sourceMap.Count + 1)
      citation = $citation
      year = $year
      chapters = [Collections.Generic.List[int]]::new()
      doi = $null
      url = 'https://scholar.google.com/scholar?q=' + [uri]::EscapeDataString($citation)
    }
  }
  if (-not $sourceMap[$key].chapters.Contains($chapterNumber)) {
    $sourceMap[$key].chapters.Add($chapterNumber)
  }
}

$sources = [Collections.Generic.List[object]]::new()
foreach ($entry in $sourceMap.GetEnumerator()) {
  $source = $entry.Value
  if ($ResolveDoi) {
    try {
      $doi = Resolve-DoiForCitation -Citation $source.citation -Year $source.year
      if ($doi) {
        $source.doi = $doi
        $source.url = 'https://doi.org/' + $doi
      }
    } catch {
      Write-Warning ('Crossref lookup failed for ' + $source.id + ': ' + $_.Exception.Message)
    }
    Start-Sleep -Milliseconds 120
  }
  $sources.Add([pscustomobject]$source)
}

if ($days.Count -ne 21) { throw "Expected 21 days, found $($days.Count)." }
if ($tools.Count -ne 22) { throw "Expected 22 tools, found $($tools.Count)." }
if ($sources.Count -ne 66) { throw "Expected 66 unique sources, found $($sources.Count)." }

$content = [ordered]@{
  meta = [ordered]@{
    title = 'Overthinking beim Dating und in Beziehungen'
    subtitle = 'Nervensystem beruhigen. Grübeln stoppen. Nähe schaffen.'
    author = 'Lea Hoffmann'
    sourceCount = $sources.Count
    generatedFrom = (Split-Path -Leaf $DocumentPath)
  }
  days = $days
  tools = $tools
  sources = $sources
}

$json = $content | ConvertTo-Json -Depth 12
$javascript = 'window.OVERTHINKING_CONTENT = ' + $json + ';' + [Environment]::NewLine
[IO.File]::WriteAllText($OutputPath, $javascript, [Text.UTF8Encoding]::new($false))

$doiCount = @($sources | Where-Object { $_.doi }).Count
Write-Output "Wrote $OutputPath"
Write-Output "Days=$($days.Count) Tools=$($tools.Count) Sources=$($sources.Count) DOI=$doiCount"
