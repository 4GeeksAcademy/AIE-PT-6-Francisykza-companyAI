---
alcance: solicitada por el agente
cuando: ["se completa una funcionalidad", "se toma o cambia una decisión de arquitectura", "cambia el negocio o el flujo de trabajo", "se descubre un problema"]
---

# Regla: mantener el banco de memoria

**Alcance:** el agente la solicita (la aplica) cada vez que ocurra algo de la lista de arriba. Con cada commit, `progress.md` se actualiza siempre (paso 4 de `AGENTS.md`).
**Por qué:** un memory bank desactualizado deja de ser útil en días y el agente siguiente repite errores.

## Qué hacer

- **`progress.md`:** mueve lo terminado a «Hecho» con su fecha, ajusta «Próximos pasos» y añade los problemas encontrados.
- **`techContext.md`:** cuando se toma una decisión, pásala de «Pendiente de decidir» a la tabla de decisiones, con su fuente. Actualiza «Comandos» solo con comandos ejecutados.
- **`projectbrief.md`:** solo cambia cuando cambie el negocio o el reto. Cita siempre su fuente (`CONTEXT.md`, `company-choice.md`).
- Marca ✅ únicamente lo que hayas comprobado leyendo el archivo o ejecutando el comando en esta sesión; lo demás es ❓.
- Mantén los archivos cortos y con fecha. Si dos archivos dicen cosas distintas, corrige el que esté mal en el mismo commit.

## Qué no hacer

- No añadas afirmaciones sobre el negocio, fechas ni planes que no respalde un archivo del repo.
- No copies al memory bank código ni datos personales.
- No dejes decisiones solo en el mensaje de commit.

## Cómo comprobarlo

`git diff --stat` del commit incluye `memory-bank/progress.md`, y cada ✅ nuevo se corresponde con un comando o archivo citado.
