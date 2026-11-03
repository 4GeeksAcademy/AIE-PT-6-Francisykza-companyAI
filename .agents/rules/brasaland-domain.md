---
alcance: por patrón de archivo
patrones: ["services/**", "data/**", "agents/**", "workflows/**", "packages/**", "uis/**"]
---

# Regla: datos y reglas de negocio de Brasaland

**Alcance:** se aplica solo al editar archivos que coincidan con los patrones de arriba, es decir, código que maneja datos o lógica de negocio.
**Por qué:** la empresa opera en dos países, con dos monedas y dos idiomas (`CONTEXT.md`); un importe sin moneda o una hora sin zona produce errores silenciosos.

## Qué hacer

- Todo importe lleva su **moneda** (`COP` o `USD`) junto al número. No sumes ni compares importes de monedas distintas sin conversión explícita.
- Las horas límite del negocio (por ejemplo, el pedido semanal de los lunes antes de las 10:00) se interpretan en la **hora local del local**; Medellín no usa horario de verano y Miami sí. Guarda instantes con zona horaria y no uses `new Date("YYYY-MM-DD")` ni conversiones implícitas.
- Las reglas del procedimiento de pedidos (frecuencias y plazos por categoría, mínimo de 3 días de proteínas, recargo de emergencia del 8 %, aprobación por encima de 500 USD) viven en **un único lugar** del código. Sus valores están en `memory-bank/projectbrief.md`. No los repitas como números sueltos.
- Usa los nombres de personas, áreas y locales tal como aparecen en `CONTEXT.md`.
- Los textos de interfaz usan el español como idioma base; el inglés es opcional y se añade después, sin duplicar pantallas.
- Si un dato o regla no está en `CONTEXT.md` ni en el memory bank, **pregunta**; no lo inventes.

## Qué no hacer

- No inventes nombres de campos, locales, proveedores o importes: si necesitas datos de ejemplo, márcalos como ficticios en el archivo.
- No guardes datos personales de clientes o empleados en el repositorio.

## Cómo comprobarlo

- `git grep -nE "\b(8|500)\b" -- services data agents workflows packages` y revisa que cada coincidencia de negocio sea la constante única o su prueba.
- Revisa que cada campo de importe del diff tenga moneda.
