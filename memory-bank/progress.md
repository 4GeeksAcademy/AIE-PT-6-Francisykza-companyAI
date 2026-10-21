# Progreso

Actualizado el 2026-10-21. Leyenda: ✅ comprobado · ❓ sin comprobar. **Este archivo se actualiza en cada commit que cambie algo** (lo exige `AGENTS.md`).

## Hecho

- ✅ Repositorio creado a partir de la plantilla del monorepo (primer commit `Initial commit`).
- ✅ Empresa elegida y razonada: Brasaland (`company-choice.md`).
- ✅ `CONTEXT.md` sustituido por el briefing de Brasaland: es idéntico a `CONTEXT-brasaland-briefing.es.md` del syllabus (comparado con `diff` el 2026-10-16). Ya no es el placeholder.
- ✅ Hito de infraestructura de agentes (rama `feature/agent-memory-bank`): `memory-bank/` (resumen de negocio, contexto técnico y este archivo), `AGENTS.md` con el flujo previo al commit, `.agents/rules/` (3 reglas con alcance) y la skill `.agents/skills/add-monorepo-component`.
- ✅ La skill se probó con su script de comprobación sobre una copia temporal: pasa con un componente correcto y falla con uno sin `README.es.md`, con nombre mal formado, con una ruta fuera del mapa y con un archivo ajeno modificado (ver el commit de la skill).

- ✅ Hito «Sitio web público» (rama `feature/public-website`): `uis/website/` con `index.html` (landing con Schema.org), `application.html` (registro en Brasa Points), `validation.js` y `validation.test.js`. Estilos solo con Tailwind v4 (CDN). `node --test uis/website/validation.test.js`: 10 pruebas pasan (2026-10-21). Comportamiento del formulario probado en Chromium sin estilos: 22 de 22 comprobaciones correctas. Detalle en `uis/website/README.es.md`.

## Estado de las carpetas de aplicación

✅ `uis/website/` existe desde el 2026-10-21 (web estática: HTML, Tailwind por CDN y JavaScript sin dependencias). `uis/backoffice` y `services/` **no existen todavía**. Todo lo nuevo debe ir en las rutas del mapa de `AGENTS.md` (`.agents/rules/monorepo-layout.md`).

## Sin verificar del sitio web (hito «Sitio web público»)

- ❓ **Aspecto visual con Tailwind.** El CDN de Tailwind no es accesible desde el entorno donde se escribió el código, así que el diseño no se ha visto renderizado. Hay que abrirlo en Codespaces y revisar móvil, tablet y escritorio.
- ❓ **PageSpeed Insights / Lighthouse (≥ 80)** sobre la URL pública de Codespaces: no ejecutado.
- ❓ `npx http-server uis/website -p 3000 -a 0.0.0.0`: no ejecutado (sin acceso a npm). La web se probó abriendo los archivos directamente.
- ❓ Lector de pantalla y navegación completa por teclado: solo se comprobó que el Tab llega a los botones; falta una prueba real.
- ❓ Los campos del formulario no vienen del briefing (`CONTEXT.md` no define ninguno): son una propuesta derivada del dominio. Pendiente de confirmar con el equipo, igual que el límite de 18 años y el rango de códigos postales de Florida (32003–34997).
- ❓ Correo de contacto `contacto@brasaland.example` es un marcador.

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
