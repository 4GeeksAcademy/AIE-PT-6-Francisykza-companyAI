# Modelos y utilidades de Brasaland (TypeScript)

Funciones base para gestionar, filtrar, ordenar y transformar los datos del sistema de pedidos de ingredientes (reto elegido en `company-choice.md`). Es la capa lógica que usarán otros sistemas más adelante; no incluye interfaz.

## Cómo ejecutarlo

```bash
npm install
npm run typecheck   # valida los tipos: npx tsc --noEmit
npm run check       # comprobaciones automáticas de las funciones
npm run demo        # demostración en consola con datos ficticios
```

## Estructura

| Archivo | Responsabilidad |
| --- | --- |
| `src/types/models.ts` | Interfaces y tipos: `Restaurant`, `Supplier`, `Ingredient`, `StockLevel`, `PurchaseOrder`, `OrderLine`, `Sale`, `Money` |
| `src/utils/business-rules.ts` | Las reglas de negocio (3 días de proteínas, recargo del 8 %, umbral de 500 USD, lunes 10:00). Único lugar donde viven sus valores |
| `src/utils/domain-helpers.ts` | Funciones auxiliares sobre los modelos (totales, recargo, días de inventario, hora local) |
| `src/utils/collections.ts` | Filtrar, ordenar (uno o varios criterios) y agrupar |
| `src/utils/search.ts` | Búsqueda lineal (arrays desordenados) y binaria (arrays ordenados) |
| `src/utils/transformations.ts` | Agregaciones y reportes: contar por categoría, sumar, máximos, mínimos, promedios |
| `src/utils/validations.ts` | Validaciones de negocio antes de procesar o guardar datos |
| `src/data/sample-data.ts` | Datos **ficticios** para la demo y las pruebas |
| `src/demo.ts` · `src/checks.ts` | Demostración en consola · comprobaciones automáticas |

## Decisiones

- Todas las funciones son puras: no modifican lo que reciben ni usan variables globales.
- Un importe siempre lleva su moneda (`COP` o `USD`). Los totales se separan por moneda y nunca se suman monedas distintas.
- Los instantes son texto ISO 8601 **con zona** (`2026-11-16T09:30:00-05:00`). La regla «lunes antes de las 10:00» se evalúa en la hora local del local (`Restaurant.timeZone`).
- Búsqueda vacía o sin coincidencia: `-1` en las funciones de índice y `undefined` en las que devuelven el elemento. Promedios y máximos de listas vacías devuelven `undefined`.
- La búsqueda binaria exige un array ordenado de forma ascendente por la misma clave (se puede ordenar con `sortBy`).
- El umbral de aprobación de 500 USD en pedidos en COP necesita un tipo de cambio, que se pasa por parámetro porque el briefing no fija ninguno.

## Reglas de negocio implementadas

Salen de `company-choice.md` y `CONTEXT.md`:

- Un local no puede tener menos de 3 días de inventario de proteínas.
- El pedido de emergencia lleva un 8 % de recargo sobre el precio de lista.
- Un pedido de emergencia confirmado o entregado por encima de 500 USD necesita la aprobación de Lucía Fernández.
- El pedido semanal se hace los lunes antes de las 10:00, hora local.
- Cada país opera con su moneda (Colombia, COP; EE. UU., USD).
- Un pedido debe tener líneas con cantidad y precio mayores que 0, una sola moneda coherente con el local y fechas coherentes (la entrega no es anterior a la creación).
