$listener = New-Object System.Net.HttpListener
$listener.Prefixes.Add('http://localhost:3000/')
$listener.Start()
Write-Host "Server started on http://localhost:3000"

$mimeTypes = @{
    '.html' = 'text/html'
    '.css' = 'text/css'
    '.js' = 'application/javascript'
    '.json' = 'application/json'
    '.png' = 'image/png'
    '.jpg' = 'image/jpeg'
    '.jpeg' = 'image/jpeg'
    '.webp' = 'image/webp'
    '.svg' = 'image/svg+xml'
    '.ico' = 'image/x-icon'
    '.woff' = 'font/woff'
    '.woff2' = 'font/woff2'
}

$root = 'c:\Users\admin\CodeBuddy\20260617092957'

while ($listener.IsListening) {
    try {
        $ctx = $listener.GetContext()
        $req = $ctx.Request
        $res = $ctx.Response
        
        $path = $req.Url.LocalPath
        if ($path -eq '/') { $path = '/index.html' }
        
        $file = Join-Path $root $path.TrimStart('/')
        
        if (Test-Path $file -PathType Leaf) {
            $content = [System.IO.File]::ReadAllBytes($file)
            $res.ContentLength64 = $content.Length
            $ext = [System.IO.Path]::GetExtension($file).ToLower()
            $mime = $mimeTypes[$ext]
            if (-not $mime) { $mime = 'application/octet-stream' }
            $res.ContentType = $mime
            $res.OutputStream.Write($content, 0, $content.Length)
        } else {
            $res.StatusCode = 404
        }
        $res.Close()
    } catch {
        Write-Host "Error: $_"
    }
}
