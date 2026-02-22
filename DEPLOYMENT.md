# Deployment Guide for Fly.io

This guide explains how to deploy the Baza Firm application to Fly.io with proper environment configuration.

## How Environment Variables Work

This application uses **runtime environment variables** rather than build-time configuration. This means:

1. The app fetches configuration from the `/api/config` endpoint at startup
2. The server reads environment variables from `process.env` at runtime
3. Configuration is loaded before the Angular app initializes

This approach ensures that Fly.io environment variables are properly available at runtime.

## Deployment Steps

### 1. Install Fly.io CLI

```powershell
# On Windows
powershell -Command "iwr https://fly.io/install.ps1 -useb | iex"
```

### 2. Login to Fly.io

```bash
flyctl auth login
```

### 3. Set Environment Variables

Set your production environment variables as **secrets** (recommended for sensitive data):

```bash
flyctl secrets set API_URL=https://your-api-domain.com/api
flyctl secrets set KEYCLOAK_URL=https://your-keycloak-domain.com
flyctl secrets set KEYCLOAK_REALM=bazafirm-customer
flyctl secrets set KEYCLOAK_CLIENT_ID=customer-app-web
```

### 4. Deploy

```bash
flyctl deploy
```

### 5. Verify

Check that your app is running:

```bash
flyctl status
flyctl logs
```

Open your app:

```bash
flyctl open
```

## Environment Variables

The following environment variables are available:

| Variable | Description | Default |
|----------|-------------|---------|
| `API_URL` | Backend API URL | `http://localhost:8082/api` |
| `KEYCLOAK_URL` | Keycloak authentication server URL | `http://localhost:8082` |
| `KEYCLOAK_REALM` | Keycloak realm name | `bazafirm-customer` |
| `KEYCLOAK_CLIENT_ID` | Keycloak client ID | `customer-app-web` |

## Troubleshooting

### Check Current Secrets

```bash
flyctl secrets list
```

### View Logs

```bash
flyctl logs
```

### Access the /api/config Endpoint

You can verify your configuration by accessing:
```
https://your-app.fly.dev/api/config
```

This should return your runtime configuration (without sensitive secrets).

## Local Development

For local development, the app uses default values. To override them locally:

1. Set environment variables in your terminal:
```bash
$env:API_URL="http://localhost:8080/api"
$env:KEYCLOAK_URL="http://localhost:8082"
```

2. Or use Docker:
```bash
docker build -t baza-firm-fe .
docker run -p 4000:4000 \
  -e API_URL=http://localhost:8080/api \
  -e KEYCLOAK_URL=http://localhost:8082 \
  baza-firm-fe
```
