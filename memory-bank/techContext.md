# Contexto técnico

Verificado contra el repositorio el 2026-10-16 (rama `feature/agent-memory-bank`, sobre `main`). Leyenda: ✅ comprobado leyendo el archivo indicado · ❓ sin ejecutar o sin decidir.

## Estado de partida

✅ El repositorio es una copia de la plantilla `ai-engineering-company-project-monorepo` (`README.md`). Solo contiene estructura de carpetas y documentación, **sin aplicaciones ejecutables ni scripts globales**: `uis/`, `services/`, `agents/` (salvo `_template/`), `mcps/`, `workflows/`, `infra/`, `internal/`, `scripts/` y `shared/` solo tienen README.

## Decisiones de arquitectura ya tomadas (vienen de la plantilla)

| Decisión | Fuente |
|---|---|
| **Una única API central en FastAPI** para toda la empresa, en `services/`, con routers/módulos por dominio. No dividir en microservicios al principio; un worker aparte solo si hace falta de verdad. | `README.md` (sección `services/`) |
| Frontends en `uis/`: web pública en `uis/website`, aplicación interna en `uis/backoffice`. | `README.md`, `uis/README.md` |
| Los datos fluyen `data/raw` → `data/pipelines` → `data/process`, y `data/eval` mide la calidad. | `README.md` (sección `data/`) |
| Un agente por subcarpeta de `agents/`, partiendo de `agents/_template/`. | `agents/README.md` |
| Si dos carpetas necesitan el mismo código o tipos, se extrae a `packages/` (hoy existe `@repo/shared-types` en `packages/shared`). | `README.md`, `packages/shared/package.json` |
| `docker-compose.yml` va en la raíz del repo. | `README.md` |
| Configuración de agentes de código en `.agents/` (reglas y skills de desarrollo), distinta de `agents/` y `skills/`, que son código de producto. | enunciado del hito |

## Entorno de desarrollo (`.devcontainer/devcontainer.json`)

✅ Imagen Ubuntu 24.04 con Python 3.12, Node 22, Docker-outside-of-Docker, GitHub CLI y SSH. Instala con `corepack`/`pnpm` si hay `package.json` y con `uv sync` si hay `pyproject.toml`. Puertos reenviados: 3000, 8000 y 5678. Extensión recomendada: `4geeks.4geeks-student`. ❓ El devcontainer no se ha construido ni ejecutado.

## Lo que no existe todavía

- ✅ No hay `docker-compose.yml` en la raíz (la plantilla dice que debe estar ahí).
- ✅ No hay `package.json` ni `pyproject.toml` en la raíz, ni ejecutor de workspaces. `packages/shared/package.json` (`@repo/shared-types`) es el único `package.json`.
- ✅ No hay pruebas, linters ni CI. Por eso `AGENTS.md` exige comprobar cada cambio con lo que exista y **declarar qué no se pudo ejecutar**.
- ✅ `packages/shared/types/index.ts` solo tiene tipos de ejemplo (`Id`, `BaseEntity`); faltan los del dominio (locales, ventas, proveedores…).

## Restricciones técnicas del dominio (de `CONTEXT.md`)

- Dos países, dos monedas (COP y USD) y dos idiomas (español e inglés).
- Un punto de venta distinto en cada país, sin integración, y hojas de cálculo como sistemas de gestión. No hay API interna, datos consolidados ni telemetría.
- Las horas límite (p. ej. el pedido de los lunes antes de las 10:00) son en **hora local del local**. Medellín no usa horario de verano y Miami sí, así que la diferencia horaria entre ambos cambia a lo largo del año.
- El multiidioma es opcional pero recomendado, empezando por un idioma base (`CONTEXT.md`, área de Formación).

## Pendiente de decidir (no inventar: preguntar)

- Framework de `uis/website` y de `uis/backoffice`.
- Base de datos y modelo de datos (locales, ventas, stock, proveedores, pedidos).
- Autenticación y roles del backoffice.
- Cómo se representan importes con moneda y las zonas horarias en la API.
- Idioma base de las interfaces.
- Proveedor de modelos de IA y de despliegue.

Cada vez que se decida una de estas cosas, se pasa a la tabla de decisiones de arriba y se anota en `progress.md`.

## Comandos

❓ Todavía no hay comandos de arranque, prueba o build: no hay aplicaciones. Cuando exista el primer servicio o interfaz, añade aquí su comando y marca ✅ solo lo que se haya ejecutado.
