---
alcance: siempre activa
---

# Regla: estructura del monorepo

**Alcance:** siempre activa, en cualquier tarea que cree, mueva o borre archivos.
**Por qué:** el monorepo ya trae un mapa de carpetas con una responsabilidad cada una (`README.md` raíz). Los agentes tienden a crear estructuras nuevas en vez de usar las existentes.

## Qué hacer

- Antes de crear nada, lee el `README.md` de la carpeta de destino y comprueba el mapa de `AGENTS.md`.
- Sitúa el código así: interfaz de la web pública → `uis/website`; aplicación interna → `uis/backoffice`; API y tareas en segundo plano → `services/`; datos → `data/`; agentes de producto → `agents/`; flujos n8n → `workflows/`.
- Los endpoints nuevos se añaden a la **API FastAPI central** de `services/`. Un servicio o worker separado solo se crea si necesita ejecutarse aparte, y se justifica en `memory-bank/techContext.md`.
- Cada subcarpeta nueva lleva `README.md` y `README.es.md` (todas las carpetas de la plantilla tienen la pareja) con objetivo, tecnología y cómo ejecutarla, y se anota en `memory-bank/progress.md`. La skill `add-monorepo-component` automatiza esto.
- Si dos carpetas necesitan el mismo código o tipos, extráelo a `packages/`.

## Qué no hacer

- No crees árboles paralelos (`frontend/`, `api/`, `backend/`, `src/` en la raíz) ni carpetas de aplicación fuera de `uis/` y `services/`.
- No pongas código de producto en `.agents/`, ni reglas o skills de desarrollo en `agents/` o `skills/`.
- No toques `agents/_template/` ni `skills/_template/`: se copian, no se editan.

## Cómo comprobarlo

`git diff --name-status main...HEAD`: toda ruta nueva debe empezar por una carpeta del mapa de `AGENTS.md`.
