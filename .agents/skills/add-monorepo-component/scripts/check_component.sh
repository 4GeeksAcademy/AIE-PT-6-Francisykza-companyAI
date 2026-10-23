#!/usr/bin/env bash
# Comprueba los criterios de aceptación de la skill add-monorepo-component.
# Uso: bash .agents/skills/add-monorepo-component/scripts/check_component.sh <ruta>
# Ejecutar desde la raíz del repositorio. Sale con 0 si todo está bien y con 1 si falla algo.
set -u

ruta="${1:-}"
fallos=0

ok()  { echo "  [ok]   $1"; }
mal() { echo "  [FALLO] $1"; fallos=$((fallos + 1)); }

if [ -z "$ruta" ]; then
  echo "Uso: $0 <ruta>"; exit 2
fi
ruta="${ruta%/}"

# 1. Ruta permitida y nombre en kebab-case
if echo "$ruta" | grep -Eq '^(uis/(website|backoffice)|(services|agents|mcps|workflows|packages|internal)/[a-z0-9]+(-[a-z0-9]+)*|data/pipelines/[a-z0-9]+(-[a-z0-9]+)*)$'; then
  ok "1. ruta permitida y en kebab-case: $ruta"
else
  mal "1. ruta no permitida o con nombre mal formado: $ruta"
fi

# 2. Carpeta y READMEs
if [ -d "$ruta" ]; then
  ok "2. la carpeta existe"
  for f in README.md README.es.md; do
    if [ -s "$ruta/$f" ] && grep -q '^# ' "$ruta/$f"; then
      ok "2. $f existe, no esta vacio y tiene titulo"
    else
      mal "2. falta $ruta/$f, esta vacio o no tiene titulo '# '"
    fi
  done
else
  mal "2. la carpeta no existe: $ruta"
fi

# 3. Entrada en el memory bank
if [ -f memory-bank/progress.md ] && grep -Fq "$ruta" memory-bank/progress.md; then
  ok "3. memory-bank/progress.md menciona $ruta"
else
  mal "3. memory-bank/progress.md no menciona $ruta"
fi

# 4. Solo cambios dentro de la ruta o del memory bank
extra=$(git status --porcelain --untracked-files=all | sed -E 's/^.{3}//' | grep -Ev "^($ruta/|memory-bank/)" || true)
if [ -z "$extra" ]; then
  ok "4. solo hay cambios dentro de $ruta/ y memory-bank/"
else
  mal "4. hay cambios fuera de la ruta y del memory bank:"
  echo "$extra" | sed 's/^/         /'
fi

if [ "$fallos" -eq 0 ]; then
  echo "RESULTADO: OK"; exit 0
else
  echo "RESULTADO: $fallos fallo(s)"; exit 1
fi
