# AGENTS.md — cómo trabaja cualquier agente en este repositorio

Este repositorio es el monorepo de **Brasaland Digital** (cadena de restaurantes de cocina a la brasa, Colombia y Florida). Estas reglas valen para cualquier agente de código (Claude Code, Cursor, Copilot, Windsurf…). Si una petición del desarrollador contradice algo de aquí, **detente y pregunta** antes de actuar.

## 1. Qué leer al inicio de cada sesión (en este orden)

1. [`CONTEXT.md`](./CONTEXT.md): briefing de la empresa y **fuente única** de datos de dominio. (`CONTEXT.es.md` es un placeholder de la plantilla: ignóralo.)
2. [`memory-bank/projectbrief.md`](./memory-bank/projectbrief.md): negocio, objetivos y problema que resuelve el proyecto.
3. [`memory-bank/techContext.md`](./memory-bank/techContext.md): stack, decisiones de arquitectura tomadas y restricciones técnicas.
4. [`memory-bank/progress.md`](./memory-bank/progress.md): estado actual y próximos pasos.
5. Las reglas de [`.agents/rules/`](./.agents/rules/) (el alcance de cada una está en su cabecera).
6. El `README.md` de la carpeta donde vayas a trabajar.
7. Las skills de [`.agents/skills/`](./.agents/skills/) cuando la tarea coincida con la descripción de alguna.

## 2. Flujo obligatorio antes de cada commit

Haz estos pasos **en este orden**. Si alguno no se puede cumplir, no hagas el commit y explica por qué.

1. **Ubicación.** Comprueba con el mapa de carpetas (sección 5) que cada archivo nuevo está en la carpeta que le corresponde y que no has creado un árbol paralelo.
2. **Dominio.** Contrasta los nombres, monedas, idiomas y reglas de negocio que uses con `CONTEXT.md` (y con `.agents/rules/brasaland-domain.md` si tocas código de datos o de negocio). Nada inventado.
3. **Comprobación.** Ejecuta las pruebas, el linter y el build que existan para lo que has tocado. Si no existe ninguno (hoy no hay aplicaciones), dilo expresamente. No marques como comprobado nada que no hayas ejecutado.
4. **Documentación.** Actualiza `memory-bank/progress.md` **siempre**; actualiza `projectbrief.md` o `techContext.md` si cambia el negocio o una decisión técnica; añade o ajusta el `README.md` de la carpeta tocada.
5. **Revisión del diff.** Revisa `git diff --staged`: sin secretos (`.env`, claves, tokens), sin datos personales, sin archivos protegidos modificados (sección 3) y sin cambios ajenos a la tarea.
6. **Mensaje de commit.** Una unidad coherente por commit. El mensaje dice qué cambia, cómo se comprobó y qué no se pudo ejecutar.

## 3. Archivos y carpetas que NO debes modificar sin confirmación explícita del desarrollador

- `CONTEXT.md`: fuente de verdad de la empresa.
- `company-choice.md`: decisión y razonamiento del desarrollador.
- `README.md` y `README.es.md` de la raíz, y los `README` que ya trae la plantilla (puedes **añadir** README nuevos).
- `.devcontainer/`: entorno de desarrollo compartido.
- `AGENTS.md` y `.agents/`: las reglas del propio agente. Propón el cambio en vez de aplicarlo.
- `data/raw/`: datos originales; solo se **añaden** archivos nuevos, nunca se editan los existentes.
- `.git/` y la configuración de git.

## 4. Cuándo detenerte y preguntar

- Una petición contradice `CONTEXT.md`, el memory bank o estas reglas.
- Hay que elegir algo marcado como «pendiente de decidir» en `techContext.md` (framework, base de datos, autenticación…).
- Hace falta una carpeta que el mapa no contempla, o una dependencia o herramienta nueva.
- Aparecen datos personales de clientes o empleados.
- Una acción no se puede deshacer (borrar datos, reescribir historial, publicar).

## 5. Mapa de carpetas (dónde vive cada cosa)

Antes de crear nada, lee el `README.md` de la carpeta. **No inventes carpetas paralelas** (por ejemplo, otro `frontend/` o `api/` en la raíz).

| Ruta | Qué va aquí |
|---|---|
| `uis/` | Todo lo que tiene interfaz |
| `uis/website` | Web corporativa pública (ruta `/`; marca y textos alineados con `CONTEXT.md`) |
| `uis/backoffice` | Aplicación interna de la empresa (diseño propio, separado del sitio público; vista de entrada en `/`) |
| `services/` | API central de la empresa en FastAPI; los endpoints nuevos van en la API existente, no en servicios nuevos |
| `data/raw` → `data/pipelines` → `data/process`, `data/eval` | Datos originales, ETL, resultados limpios y evaluación |
| `agents/` | Agentes de IA **del producto** de Brasaland (uno por subcarpeta, desde `agents/_template/`) |
| `skills/` | Capacidades reutilizables **del producto** |
| `mcps/` · `workflows/` | Servidores MCP · flujos n8n y automatizaciones |
| `packages/` · `shared/` | Librerías compartidas (`@repo/shared-types`) · recursos sueltos |
| `docs/` · `infra/` · `scripts/` · `internal/` | Documentación transversal · despliegue · scripts · herramientas internas |
| `memory-bank/` | Memoria del proyecto para agentes (leer al empezar, actualizar al terminar) |
| `.agents/` | **Configuración de los agentes de código** (reglas y skills de desarrollo). No es código de producto |

> `.agents/` no es `agents/` ni `skills/`: la primera dice cómo trabaja la herramienta de desarrollo en este repo; las otras son código de producto que construye Brasaland Digital.
