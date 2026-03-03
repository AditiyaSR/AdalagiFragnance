#!/usr/bin/env bash
set -euo pipefail

if [ -z "${VERCEL_DEPLOY_HOOK_URL:-}" ]; then
  echo "ERROR: VERCEL_DEPLOY_HOOK_URL belum diset."
  echo "Buat Deploy Hook di Vercel: Project Settings > Git > Deploy Hooks, lalu export URL-nya."
  exit 1
fi

response=$(curl -fsS -X POST "$VERCEL_DEPLOY_HOOK_URL")

echo "Deploy hook triggered successfully."
echo "$response"
