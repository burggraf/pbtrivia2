#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
POCKETBASE_BIN="${ROOT_DIR}/pocketbase"
POCKETBASE_ARGS=(serve --dir "${ROOT_DIR}/pb_data")
POCKETBASE_MATCH="${POCKETBASE_BIN} ${POCKETBASE_ARGS[*]}"

cleanup() {
  if [[ -n "${POCKETBASE_PID:-}" ]] && ps -p "${POCKETBASE_PID}" >/dev/null 2>&1; then
    echo "Stopping PocketBase (pid ${POCKETBASE_PID})"
    kill "${POCKETBASE_PID}" >/dev/null 2>&1 || true
  fi
}

trap cleanup EXIT

if pgrep -f "${POCKETBASE_MATCH}" >/dev/null 2>&1; then
  echo "Existing PocketBase instance detected. Terminating…"
  pkill -f "${POCKETBASE_MATCH}" || true
  sleep 1
fi

if [[ ! -x "${POCKETBASE_BIN}" ]]; then
  echo "PocketBase binary not found at ${POCKETBASE_BIN}."
  echo "Run ./pocketbase or follow POCKETBASE_SETUP.md first."
  exit 1
fi

echo "Starting PocketBase…"
"${POCKETBASE_BIN}" "${POCKETBASE_ARGS[@]}" >/dev/null 2>&1 &
POCKETBASE_PID=$!
echo "PocketBase running on http://127.0.0.1:8090 (pid ${POCKETBASE_PID})"

launch_url() {
  local url=$1
  if command -v open >/dev/null 2>&1; then
    open "${url}" >/dev/null 2>&1 || true
  elif command -v xdg-open >/dev/null 2>&1; then
    xdg-open "${url}" >/dev/null 2>&1 || true
  fi
}

(sleep 2 && launch_url "http://localhost:5173") &

echo "Starting Vite dev server…"
(cd "${ROOT_DIR}" && npm run dev)
