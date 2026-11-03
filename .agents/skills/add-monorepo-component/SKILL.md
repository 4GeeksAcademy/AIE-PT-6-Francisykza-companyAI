---
name: add-monorepo-component
description: Crea un componente nuevo (interfaz, servicio, agente, pipeline, flujo, MCP o paquete) en la carpeta correcta del monorepo de Brasaland, con su README y su entrada en el memory bank. Úsala cada vez que se vaya a crear una subcarpeta de aplicación o de datos.
---

# Skill: añadir un componente al monorepo

## Objetivo

Crear **un** componente nuevo en la carpeta que le corresponde según el mapa de `AGENTS.md`, documentado y registrado en `memory-bank/progress.md`, sin crear estructuras paralelas. No escribe la lógica del componente.

## Cuándo no usarla

- Para añadir un endpoint a la API existente de `services/` (se edita esa API).
- Para cambiar un componente que ya existe.
- Para reglas o skills de desarrollo (van en `.agents/`).

## Inputs

| Input | Formato | Ejemplo |
|---|---|---|
| `ruta` | ruta relativa a la raíz, en una de las carpetas permitidas (abajo) y con el último tramo en `kebab-case` | `agents/reposicion-pedidos` |
| `objetivo` | una frase: qué hace y qué problema de `CONTEXT.md` resuelve (área y responsable) | «Propone el pedido semanal por local; área de Operaciones, Felipe Guerrero» |
| `tecnologia` | tecnología prevista, o `sin decidir` si figura en «Pendiente de decidir» de `techContext.md` | `Python` |

Rutas permitidas: `uis/website`, `uis/backoffice`, `services/<nombre>`, `agents/<nombre>`, `mcps/<nombre>`, `workflows/<nombre>`, `data/pipelines/<nombre>`, `packages/<nombre>`, `internal/<nombre>`. Cualquier otra, o un nombre que sea `_template`, no vale.

## Pasos

1. Lee `AGENTS.md`, `memory-bank/techContext.md` y el `README.md` de la carpeta padre de `ruta`. Si `tecnologia` es una de las decisiones pendientes y nadie la ha tomado, **pregunta** antes de seguir.
2. Comprueba que `ruta` no existe y que está entre las permitidas. Si encaja mejor en otra carpeta del mapa, para y propón esa.
3. Crea la carpeta con `README.md` y `README.es.md` (mismo contenido, en inglés y en español) con: objetivo, área y responsable que lo necesitan (de `CONTEXT.md`), tecnología, cómo ejecutarlo (`pendiente` si aún no hay nada ejecutable) y enlace al README padre. Si se parte de `agents/_template/`, **copia** la carpeta, no la edites.
4. Añade en `memory-bank/progress.md`, en «Hecho», una línea con la fecha, la ruta y el objetivo. Si se tomó una decisión técnica, pásala a la tabla de `techContext.md`.
5. Ejecuta `bash .agents/skills/add-monorepo-component/scripts/check_component.sh <ruta>` y corrige hasta que termine en `RESULTADO: OK`.
6. Haz el commit siguiendo el flujo de `AGENTS.md`: solo la carpeta nueva y el memory bank.

## Output esperado

- `<ruta>/README.md` y `<ruta>/README.es.md`.
- Una línea nueva en `memory-bank/progress.md` que menciona `<ruta>`.
- Ningún otro archivo modificado.

## Criterios de aceptación (los verifica `scripts/check_component.sh`)

1. `ruta` está entre las permitidas y su último tramo es `kebab-case`.
2. La carpeta existe y contiene `README.md` y `README.es.md`, no vacíos y con un título `#`.
3. `memory-bank/progress.md` menciona `ruta`.
4. `git status --porcelain` solo muestra archivos dentro de `ruta/` o dentro de `memory-bank/`.
5. El script termina con código 0. Si no se pudo ejecutar, la skill **no se da por aplicada**.
