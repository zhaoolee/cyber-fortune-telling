#!/usr/bin/env bash
set -euo pipefail

PROJECT_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"

cd "${PROJECT_ROOT}"

if [ -n "$(docker compose ps -q database)" ]; then
  ./scripts/backup-database.sh
else
  echo "database service is not running yet; skipping backup for first deploy"
fi

docker compose pull
docker compose up -d
docker compose ps
