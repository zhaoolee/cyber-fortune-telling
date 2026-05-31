#!/usr/bin/env bash
set -euo pipefail

PROJECT_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
BACKUP_DIR="${PROJECT_ROOT}/backups"
TIMESTAMP="$(date +%Y%m%d-%H%M%S)"

cd "${PROJECT_ROOT}"

mkdir -p "${BACKUP_DIR}"

DATABASE_CONTAINER="$(docker compose ps -q database)"

if [ -z "${DATABASE_CONTAINER}" ]; then
  echo "database service is not running. Start it with: docker compose up -d database" >&2
  exit 1
fi

DATABASE_NAME="$(docker compose exec -T database sh -c 'printf "%s" "$POSTGRES_DB"')"
DATABASE_USER="$(docker compose exec -T database sh -c 'printf "%s" "$POSTGRES_USER"')"
BACKUP_FILE="${BACKUP_DIR}/${DATABASE_NAME}-${TIMESTAMP}.dump"

echo "Backing up ${DATABASE_NAME} to ${BACKUP_FILE}"
docker compose exec -T database pg_dump -U "${DATABASE_USER}" -d "${DATABASE_NAME}" -Fc > "${BACKUP_FILE}"
echo "Backup complete: ${BACKUP_FILE}"
