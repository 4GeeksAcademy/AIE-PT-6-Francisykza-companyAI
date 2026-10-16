# Progreso

Actualizado el 2026-10-16. Leyenda: ✅ comprobado · ❓ sin comprobar. **Este archivo se actualiza en cada commit que cambie algo** (lo exige `AGENTS.md`).

## Hecho

- ✅ Repositorio creado a partir de la plantilla del monorepo (primer commit `Initial commit`).
- ✅ Empresa elegida y razonada: Brasaland (`company-choice.md`).
- ✅ `CONTEXT.md` sustituido por el briefing de Brasaland: es idéntico a `CONTEXT-brasaland-briefing.es.md` del syllabus (comparado con `diff` el 2026-10-16). Ya no es el placeholder.
- ✅ Hito de infraestructura de agentes (rama `feature/agent-memory-bank`): `memory-bank/` (resumen de negocio, contexto técnico y este archivo), `AGENTS.md` con el flujo previo al commit, `.agents/rules/` (3 reglas con alcance) y la skill `.agents/skills/add-monorepo-component`.
- ✅ La skill se probó con su script de comprobación sobre una copia temporal: pasa con un componente correcto y falla con uno sin `README.es.md`, con nombre mal formado, con una ruta fuera del mapa y con un archivo ajeno modificado (ver el commit de la skill).

## Estado de las carpetas de aplicación

✅ `uis/website`, `uis/backoffice` y `services/` **no existen todavía**. No hay código de producto. Cuando se creen, deben ir en esas rutas (`.agents/rules/monorepo-layout.md`).

## Problemas conocidos de la plantilla

- ❓ `README.md` raíz, en «Current status of the template», dice que «no hay `AGENTS.md` raíz todavía»; ya existe. No se ha editado porque el README raíz es del template (ver archivos protegidos en `AGENTS.md`).
- ❓ `CONTEXT.es.md` sigue siendo el placeholder de la plantilla («Sustituye este archivo…»). La fuente única de contexto es `CONTEXT.md`; los agentes deben ignorar `CONTEXT.es.md`. Decidir si se sustituye o se borra.
- ❓ `README.md` raíz y `services/README.md` se contradicen levemente: una sola API FastAPI central frente a «una subcarpeta por servicio». Se sigue la recomendación del README raíz (una API central) hasta decidir otra cosa.

## Próximos pasos previstos

No hay un plan acordado con el equipo; esto sale de la plantilla y de `company-choice.md` y hay que confirmarlo:

1. Decidir los puntos de «Pendiente de decidir» de `techContext.md`.
2. Primera pieza de producto del reto elegido (sistema de pedidos de ingredientes). La plantilla sitúa los datos en `data/` y la API en `services/`.
3. Hitos del curso que enumera `README.md`: Web, Programming, Backend, Telemetry, RAG, Agents, Workflows y Real-time.
4. Tipos del dominio en `packages/shared` (locales, ventas, stock, proveedores, pedidos) cuando haya una API que los use.
