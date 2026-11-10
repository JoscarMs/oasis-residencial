$baseUrl = "http://localhost:38080"
$adminUser = "admin"
$adminPass = "admin123"

Write-Host "=========================================================="
Write-Host "CONFIGURACION AUTOMATICA DE KEYCLOAK PARA PROYECTO OASIS"
Write-Host "=========================================================="

# 1. Autenticar contra el realm master de Keycloak
Write-Host "1. Autenticando en Keycloak como admin..."
$tokenResponse = Invoke-RestMethod -Method Post -Uri "$baseUrl/realms/master/protocol/openid-connect/token" `
    -ContentType "application/x-www-form-urlencoded" `
    -Body @{
        client_id = "admin-cli"
        username = $adminUser
        password = $adminPass
        grant_type = "password"
    }

$adminToken = $tokenResponse.access_token
$headers = @{
    Authorization = "Bearer $adminToken"
    "Content-Type" = "application/json"
}

# 2. Paso 3: Crear o verificar realm 'oasis'
Write-Host "2. Verificando realm 'oasis'..."
try {
    $existingRealm = Invoke-RestMethod -Method Get -Uri "$baseUrl/admin/realms/oasis" -Headers $headers
    Write-Host "   El realm 'oasis' ya existe."
} catch {
    Write-Host "   Creando realm 'oasis'..."
    $realmPayload = @{
        id = "oasis"
        realm = "oasis"
        displayName = "OASIS Residencias"
        enabled = $true
        internationalizationEnabled = $true
        supportedLocales = @("es", "en")
        defaultLocale = "es"
    } | ConvertTo-Json
    Invoke-RestMethod -Method Post -Uri "$baseUrl/admin/realms" -Headers $headers -Body $realmPayload
    Write-Host "   Realm 'oasis' creado con exito."
}

# 3. Paso 3.1: Crear roles del realm OASIS
Write-Host "3. Creando roles de Realm para OASIS..."
$roles = @("ADMIN", "SUPERVISOR", "RECEPCIONISTA", "RESIDENTE", "VENDEDOR")
$existingRoles = (Invoke-RestMethod -Method Get -Uri "$baseUrl/admin/realms/oasis/roles" -Headers $headers).name

foreach ($r in $roles) {
    if ($existingRoles -notcontains $r) {
        $rolePayload = @{ name = $r; description = "Rol $r para OASIS" } | ConvertTo-Json
        Invoke-RestMethod -Method Post -Uri "$baseUrl/admin/realms/oasis/roles" -Headers $headers -Body $rolePayload
        Write-Host "   Rol '$r' creado."
    } else {
        Write-Host "   Rol '$r' ya existe."
    }
}

# 4. Paso 4: Crear clientes 'oasis-frontend' y 'bomerp-frontend'
Write-Host "4. Configurando cliente 'oasis-frontend'..."
$existingClients = Invoke-RestMethod -Method Get -Uri "$baseUrl/admin/realms/oasis/clients" -Headers $headers
$client = $existingClients | Where-Object { $_.clientId -eq "oasis-frontend" }

$clientConfig = @{
    clientId = "oasis-frontend"
    name = "OASIS Frontend Web"
    description = "Cliente publico SPA Angular para OASIS"
    enabled = $true
    publicClient = $true
    standardFlowEnabled = $true
    directAccessGrantsEnabled = $true
    redirectUris = @("http://localhost:4200/*", "http://localhost:4201/*")
    webOrigins = @("http://localhost:4200", "http://localhost:4201", "+")
    attributes = @{
        "pkce.code.challenge.method" = "S256"
        "post.logout.redirect.uris" = "http://localhost:4200/*##http://localhost:4201/*"
    }
} | ConvertTo-Json

if ($null -eq $client) {
    Invoke-RestMethod -Method Post -Uri "$baseUrl/admin/realms/oasis/clients" -Headers $headers -Body $clientConfig
    Write-Host "   Cliente 'oasis-frontend' creado."
} else {
    Invoke-RestMethod -Method Put -Uri "$baseUrl/admin/realms/oasis/clients/$($client.id)" -Headers $headers -Body $clientConfig
    Write-Host "   Cliente 'oasis-frontend' actualizado."
}

$bomerpClient = $existingClients | Where-Object { $_.clientId -eq "bomerp-frontend" }
if ($null -eq $bomerpClient) {
    $bomerpConfig = @{
        clientId = "bomerp-frontend"
        name = "BOMERP OASIS Compatibility Client"
        enabled = $true
        publicClient = $true
        standardFlowEnabled = $true
        directAccessGrantsEnabled = $true
        redirectUris = @("http://localhost:4200/*", "http://localhost:4201/*")
        webOrigins = @("http://localhost:4200", "http://localhost:4201", "+")
    } | ConvertTo-Json
    Invoke-RestMethod -Method Post -Uri "$baseUrl/admin/realms/oasis/clients" -Headers $headers -Body $bomerpConfig
    Write-Host "   Cliente 'bomerp-frontend' (compatibilidad) creado."
}

# 5. Paso 5: Crear usuarios semilla
Write-Host "5. Creando usuarios semilla para OASIS..."
$seedUsers = @(
    @{
        username = "admin"
        email = "admin@oasis.com"
        firstName = "Administrador"
        lastName = "Principal"
        roles = @("ADMIN", "SUPERVISOR")
        password = "Oasis2026!"
    },
    @{
        username = "supervisor"
        email = "supervisor@oasis.com"
        firstName = "Supervisor"
        lastName = "Residencia"
        roles = @("SUPERVISOR")
        password = "Oasis2026!"
    },
    @{
        username = "recepcionista"
        email = "recepcionista@oasis.com"
        firstName = "Recepcionista"
        lastName = "Oasis"
        roles = @("RECEPCIONISTA", "VENDEDOR")
        password = "Oasis2026!"
    },
    @{
        username = "residente1"
        email = "residente1@oasis.com"
        firstName = "Carlos"
        lastName = "Mendoza"
        roles = @("RESIDENTE")
        password = "Oasis2026!"
    },
    @{
        username = "residente2"
        email = "residente2@oasis.com"
        firstName = "Maria"
        lastName = "Torres"
        roles = @("RESIDENTE")
        password = "Oasis2026!"
    }
)

$currentUsers = Invoke-RestMethod -Method Get -Uri "$baseUrl/admin/realms/oasis/users" -Headers $headers
$allRoles = Invoke-RestMethod -Method Get -Uri "$baseUrl/admin/realms/oasis/roles" -Headers $headers

foreach ($u in $seedUsers) {
    $existing = $currentUsers | Where-Object { $_.username -eq $u.username }
    $userId = $null
    if ($null -eq $existing) {
        $userPayload = @{
            username = $u.username
            email = $u.email
            firstName = $u.firstName
            lastName = $u.lastName
            enabled = $true
            emailVerified = $true
            requiredActions = @()
        } | ConvertTo-Json

        Invoke-RestMethod -Method Post -Uri "$baseUrl/admin/realms/oasis/users" -Headers $headers -Body $userPayload
        Start-Sleep -Milliseconds 200
        $createdUser = Invoke-RestMethod -Method Get -Uri "$baseUrl/admin/realms/oasis/users?username=$($u.username)" -Headers $headers
        $userId = $createdUser[0].id
        Write-Host "   Usuario '$($u.username)' creado con id: $userId"
    } else {
        $userId = $existing.id
        Write-Host "   Usuario '$($u.username)' ya existia con id: $userId"
    }

    # Set password
    $credPayload = @{
        type = "password"
        value = $u.password
        temporary = $false
    } | ConvertTo-Json
    Invoke-RestMethod -Method Put -Uri "$baseUrl/admin/realms/oasis/users/$userId/reset-password" -Headers $headers -Body $credPayload

    # Assign roles
    $rolesToAssign = $allRoles | Where-Object { $u.roles -contains $_.name }
    $jsonElements = foreach ($r in $rolesToAssign) { $r | ConvertTo-Json -Compress }
    $jsonArray = "[ " + ($jsonElements -join ", ") + " ]"
    try {
        Invoke-RestMethod -Method Post -Uri "$baseUrl/admin/realms/oasis/users/$userId/role-mappings/realm" -Headers $headers -Body $jsonArray
    } catch {}

    Write-Host "   Credenciales y roles asignados a '$($u.username)'."
}

Write-Host "=========================================================="
Write-Host "PASOS 2, 3, 4 Y 5 COMPLETADOS EXITOSAMENTE"
Write-Host "=========================================================="
