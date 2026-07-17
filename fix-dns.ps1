# Fix DNS Resolution Issue - Automatic Script
# Run this with Administrator privileges

Write-Host "`n🔧 DeerFit MongoDB Atlas DNS Fix Script`n" -ForegroundColor Cyan

# Check if running as Administrator
$isAdmin = ([Security.Principal.WindowsPrincipal] [Security.Principal.WindowsIdentity]::GetCurrent()).IsInRole([Security.Principal.WindowsBuiltInRole] "Administrator")

if (-not $isAdmin) {
    Write-Host "❌ Error: This script must be run as Administrator!" -ForegroundColor Red
    Write-Host "`nTo run as Administrator:" -ForegroundColor Yellow
    Write-Host "1. Press Windows Key + X" -ForegroundColor Gray
    Write-Host "2. Select 'Windows PowerShell (Admin)'" -ForegroundColor Gray
    Write-Host "3. Navigate to script location" -ForegroundColor Gray
    Write-Host "4. Run: .\fix-dns.ps1" -ForegroundColor Gray
    exit 1
}

Write-Host "✅ Running as Administrator`n" -ForegroundColor Green

# Step 1: Get network adapter
Write-Host "📡 Finding network adapter..." -ForegroundColor Cyan
$adapter = Get-NetAdapter -Physical | Where-Object {$_.Status -eq "Up"} | Select-Object -First 1

if (-not $adapter) {
    Write-Host "❌ No active network adapter found!" -ForegroundColor Red
    exit 1
}

Write-Host "✅ Found adapter: $($adapter.Name)`n" -ForegroundColor Green

# Step 2: Set DNS to Google
Write-Host "🌐 Changing DNS to Google (8.8.8.8 and 8.8.4.4)..." -ForegroundColor Cyan

$dnsServers = @("8.8.8.8", "8.8.4.4")

try {
    Set-DnsClientServerAddress -InterfaceAlias $adapter.Name -ServerAddresses $dnsServers -Verbose
    Write-Host "✅ DNS servers updated successfully`n" -ForegroundColor Green
} catch {
    Write-Host "❌ Error setting DNS: $_" -ForegroundColor Red
    exit 1
}

# Step 3: Flush DNS Cache
Write-Host "🔄 Flushing DNS cache..." -ForegroundColor Cyan
ipconfig /flushdns | Out-Null
Write-Host "✅ DNS cache flushed`n" -ForegroundColor Green

# Step 4: Verify DNS Change
Write-Host "✅ Verifying DNS configuration..." -ForegroundColor Cyan
$dnsConfig = Get-DnsClientServerAddress -InterfaceAlias $adapter.Name -AddressFamily IPv4
Write-Host "   Current DNS servers:" -ForegroundColor Gray
$dnsConfig.ServerAddresses | ForEach-Object { Write-Host "   - $_" -ForegroundColor Gray }
Write-Host ""

# Step 5: Test DNS Resolution
Write-Host "🧪 Testing DNS resolution for MongoDB Atlas..." -ForegroundColor Cyan
try {
    $ips = [System.Net.Dns]::GetHostAddresses("cluster0.yfyovpw.mongodb.net")
    if ($ips) {
        Write-Host "✅ DNS Resolution Successful!" -ForegroundColor Green
        Write-Host "   Resolved IPs:" -ForegroundColor Gray
        $ips | ForEach-Object { Write-Host "   - $($_.IPAddressToString)" -ForegroundColor Gray }
        Write-Host ""
        $dnsWorking = $true
    }
} catch {
    Write-Host "⚠️  DNS resolution still failing. Waiting 5 more seconds..." -ForegroundColor Yellow
    Start-Sleep -Seconds 5
    try {
        $ips = [System.Net.Dns]::GetHostAddresses("cluster0.yfyovpw.mongodb.net")
        if ($ips) {
            Write-Host "✅ DNS Resolution Successful!" -ForegroundColor Green
            Write-Host "   Resolved IPs:" -ForegroundColor Gray
            $ips | ForEach-Object { Write-Host "   - $($_.IPAddressToString)" -ForegroundColor Gray }
            Write-Host ""
            $dnsWorking = $true
        }
    } catch {
        Write-Host "❌ DNS still not resolving. Check your network settings." -ForegroundColor Red
        $dnsWorking = $false
    }
}

# Step 6: Test MongoDB Connection
if ($dnsWorking) {
    Write-Host "🚀 Now testing MongoDB connection..." -ForegroundColor Cyan
    Write-Host "   Run this in Command Prompt:" -ForegroundColor Gray
    Write-Host "   cd backend" -ForegroundColor Gray
    Write-Host "   npm run seed" -ForegroundColor Gray
    Write-Host ""

    $continue = Read-Host "Would you like to run npm seed now? (y/n)"

    if ($continue -eq "y" -or $continue -eq "Y") {
        Write-Host "`n🔄 Running npm seed..." -ForegroundColor Cyan
        Set-Location ".\backend"
        npm run seed
    }
}

Write-Host "`n✨ DNS Fix Complete!" -ForegroundColor Green
Write-Host "   If MongoDB still won't connect, try:" -ForegroundColor Gray
Write-Host "   1. Restart your computer" -ForegroundColor Gray
Write-Host "   2. Use Cloudflare DNS: 1.1.1.1 and 1.0.0.1" -ForegroundColor Gray
Write-Host "   3. Or use local MongoDB: net start MongoDB" -ForegroundColor Gray
Write-Host ""
