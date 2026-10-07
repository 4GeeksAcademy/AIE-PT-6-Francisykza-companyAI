# Elección de empresa: Brasaland

## Empresa elegida y por qué

He elegido **Brasaland**, la cadena de restaurantes de cocina a la brasa fundada en 2008 en Medellín, con 14 locales propios en Colombia y Florida, unas 115 personas y alrededor de 6 millones de dólares de facturación anual. Me atrae porque es un negocio rentable que ha crecido más rápido que sus herramientas: gestiona dos países, dos monedas y dos idiomas con WhatsApp, hojas de cálculo e informes en PDF que llegan los martes. Eso significa que casi cualquier automatización que construya tendrá un efecto visible e inmediato.

También me convence porque el dominio lo entiende cualquiera: un restaurante genera datos a diario (ventas, pedidos, stock, turnos) que hoy nadie consolida. Y el equipo interno, Brasaland Digital, tiene el mandato de la CEO Mariana Restrepo de construir esos sistemas casi desde cero, así que hay mucho margen para aportar. Como trabajo con n8n, los problemas de Brasaland, que conectan datos dispersos y disparan alertas o acciones, encajan con lo que ya sé hacer.

## Departamentos cuyos problemas me parecen más interesantes

1. **Operaciones de Restaurante (Felipe Guerrero):** cada uno de los 14 locales funciona casi aislado y los pedidos de ingredientes se hacen por WhatsApp o teléfono, sin datos de inventario detrás. El resultado es exceso de stock en unos locales y roturas en otros. Es interesante porque el problema es de datos (ventas históricas y stock actual) y de decisión (cuánto pedir y cuándo), justo donde la IA aporta valor.
2. **Compras y Proveedores (Lucía Fernández):** con unos 20 proveedores entre Colombia y Florida, Lucía se entera de las subidas de precio cuando llega la factura y no tiene datos consolidados de compras. Me interesa porque está directamente conectado con Operaciones: si los pedidos se generaran de forma inteligente, también se podría construir el historial de precios y las alertas que Compras necesita.

## Reto de automatización que más ganas tengo de construir

**Sistema inteligente de pedidos de ingredientes**, basado en ventas históricas y stock actual (lo que Operaciones pide en el briefing). Hoy cada gerente de local debe generar el pedido semanal a proveedores los lunes antes de las 10:00 de la mañana. Hay frecuencias distintas por categoría (proteínas semanal, vegetales dos veces por semana, bebidas y empaques quincenal, salsas importadas mensual) y una regla de stock mínimo: ningún local debe operar con menos de 3 días de inventario de proteínas. Si el stock va a caer por debajo de ese umbral antes de la siguiente entrega, hay que hacer un pedido de emergencia con un 8 % de recargo, que además necesita aprobación de Lucía Fernández si supera los 500 USD. Automatizar esto evita roturas, reduce recargos y deja datos para negociar con proveedores.

## Mi idea de Agente de IA

**Qué haría el agente:** sería un agente de reposición de pedidos para cada local. Cada semana (y antes de cada ventana de pedido según la categoría) calcularía qué hay que pedir, a qué proveedor y en qué cantidad. Para ello estimaría el consumo esperado de cada ingrediente a partir de las ventas recientes y compararía el stock actual con las reglas del procedimiento: frecuencia por categoría, plazo de entrega y mínimo de 3 días de proteínas. Si proyecta que un local se quedará por debajo del mínimo antes de la próxima entrega, lo marcaría como posible pedido de emergencia y calcularía el sobrecoste del 8 %, para que el gerente decida con datos si compensa.

**Información que necesita:**
- Ventas diarias por local y por producto (de los dos sistemas de punto de venta, el de Colombia y el de Florida).
- Stock actual por ingrediente y local (inicialmente un registro simple de inventario al cierre del turno).
- Receta o consumo por plato, para pasar de platos vendidos a ingredientes usados.
- Catálogo de proveedores con categorías, plazos de entrega y precios de lista.
- Reglas del procedimiento de pedidos (días y horas límite, stock mínimo, recargo de emergencia, umbral de 500 USD).

**Qué produciría o desencadenaría:**
- Un borrador de pedido por local y proveedor, enviado al gerente del local los lunes antes de las 10:00 (hora local) para que lo revise y confirme.
- Una alerta de pedido de emergencia cuando se prevea romper el mínimo de 3 días, con el importe estimado y el recargo.
- Una solicitud de aprobación automática a Lucía Fernández cuando el pedido de emergencia supere los 500 USD (o su equivalente en COP).
- Un registro de cada pedido con precios, que serviría de base para el historial de precios y la visibilidad consolidada de compras que Compras necesita.

El agente no sustituiría al gerente: propone y avisa, y la persona confirma. Podría montarse como un flujo en n8n con un modelo de IA que razone sobre los datos y decida cuándo escalar.
