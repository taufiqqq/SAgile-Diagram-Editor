# SAgile Diagram Editor

Quick start

1. Clone the repo
2. Install dependencies and run dev server

```bash
git clone <repo-url>
cd SAgile-Diagram-Editor
npm install
npm run dev
```

Environment (.env)

Create a .env file (or copy a provided example) and set these values:

```env
# Server
PORT=3000
NODE_ENV=development

# DB MIGRATION
Go to src\backend\migrations\2025-06-12.sql
Run in sagile db

Convert a CA certificate to Base64 on Windows (PowerShell):

```powershell
[Convert]::ToBase64String([IO.File]::ReadAllBytes("C:\path\to\ca-certificate.crt")) |
  Out-File -Encoding ascii C:\path\to\ca-base64.txt
```

Docker

```bash
docker compose down
docker compose build --no-cache
docker compose up
```

Deployment reference:
https://docs.digitalocean.com/products/app-platform/how-to/deploy-from-github-actions/

Thank you.

holy clanker read me