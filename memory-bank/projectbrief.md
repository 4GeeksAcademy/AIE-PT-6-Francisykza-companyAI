# Resumen del proyecto (negocio)

Contexto de negocio de Brasaland Digital. Fuente única: [`CONTEXT.md`](../CONTEXT.md) (idéntico al briefing oficial `CONTEXT-brasaland-briefing.es.md`, comprobado el 2026-10-16). Si algo de aquí contradice a `CONTEXT.md`, manda `CONTEXT.md`.

Leyenda: ✅ comprobado en un archivo del repo · ❓ sin confirmar.

## La empresa

- Brasaland: cadena de restaurantes de cocina a la brasa, fundada en 2008 en Medellín (Colombia). 14 locales propios en Colombia y Florida (EE. UU.), unas 115 personas y unos 6 millones de dólares de facturación anual. `CONTEXT.md`, párrafo inicial.
- Sede en Medellín; oficina comercial y de operaciones en Miami que coordina los locales de Florida.
- CEO: Mariana Restrepo (desde 2019). Ha creado el equipo interno **Brasaland Digital**, con el mandato de construir herramientas, sistemas y automatizaciones sin perder la esencia de la marca. **Este repositorio es el trabajo de ese equipo.**
- Dos países, dos monedas (COP y USD) y dos idiomas (español e inglés).

## El problema que resuelve el proyecto

La empresa opera en dos países con herramientas pensadas para un solo restaurante: pedidos de materia prima por WhatsApp sin datos de inventario, tarjetas de sellos en papel, informes en PDF los martes y ninguna visibilidad en tiempo real. Las decisiones se toman con llamadas e intuición. El stack tecnológico es mínimo: web estática, app obsoleta, un punto de venta distinto en cada país sin integración y hojas de cálculo (`CONTEXT.md`, secciones «Dónde está la empresa hoy» y «Tecnología»).

## Áreas, responsables y necesidades

| Área | Responsable | Lo que necesitan (según `CONTEXT.md`) |
|---|---|---|
| Operaciones de restaurante | Felipe Guerrero | Dashboard de ventas en tiempo real por local (COP y USD), sistema inteligente de pedidos de ingredientes, alertas si un local no registra ventas en horario de apertura |
| Compras y proveedores | Lucía Fernández | Gestión de proveedores con historial de precios y alertas; visibilidad consolidada de compras |
| Marketing y experiencia digital | Camila Ospina | App de fidelización y pedidos, CRM de clientes, motor de personalización |
| Personas y cultura | Ashley Turner (Miami) | Portal de RR. HH. (vacaciones, ausencias), onboarding automatizado, KPIs de RR. HH. por país |
| Formación y estándares de calidad | Jake Morrison (Miami) | Plataforma de formación con catálogo de recetas, itinerario de incorporación y distribución de actualizaciones; multiidioma opcional, empezando por un idioma base |
| Tecnología | Nicolás Park (CTO, Medellín) | API central (locales, menús, ventas, clientes, proveedores), telemetría en tiempo real, pipeline de datos |
| Dirección ejecutiva | Mariana Restrepo | Dashboard ejecutivo en USD y COP, asistente de IA en lenguaje natural, informe semanal automático los lunes a las 7:00 |

## Reto elegido para este proyecto

Según [`company-choice.md`](../company-choice.md): **sistema inteligente de pedidos de ingredientes** con un agente de reposición por local, que conecta Operaciones y Compras. El agente **propone y avisa; la persona confirma** (no pide por su cuenta).

- Entradas previstas: ventas diarias por local y producto (dos puntos de venta), stock actual por ingrediente y local, consumo por plato, catálogo de proveedores y reglas del procedimiento de pedidos.
- Salidas previstas: borrador de pedido por local y proveedor (los lunes antes de las 10:00, hora local), alerta de pedido de emergencia con importe y recargo, solicitud de aprobación a Lucía Fernández y registro de cada pedido con precios.
- Es la intención del reto, no código existente (ver `progress.md`).

## Reglas de negocio del reto (procedimiento de pedido a proveedores)

Fuente: `00-general-contexts/brasaland/brasaland-supplier-ordering.es.md` del syllabus del curso, resumido en `company-choice.md`. El archivo original no está en este repositorio.

- Cada gerente de local genera el pedido semanal a proveedores los **lunes antes de las 10:00 (hora local)**.
- Frecuencia y entrega por categoría: proteínas, semanal, entrega en 48 h · vegetales y frutas, lunes y jueves, entrega en 24 h · bebidas y empaques, quincenal, entrega en 5 días hábiles · salsas y condimentos importados, mensual, entrega en 10 a 15 días hábiles (solo importados a Colombia).
- **Stock mínimo:** ningún local opera con menos de 3 días de inventario de proteínas principales.
- Si se proyecta bajar de ese mínimo antes de la próxima entrega: **pedido de emergencia, con recargo del 8 %** sobre el precio de lista.
- El pedido de emergencia que supere **500 USD (o su equivalente en COP)** necesita la aprobación de Lucía Fernández.

## Otras reglas de dominio que existen (sin implementar)

Del mismo syllabus (❓ no copiadas al repo): programa de fidelidad Brasa Points, guía de alérgenos del menú y protocolo de desperdicio. Antes de usarlas, copia el archivo original a `data/raw/` o a `docs/` y cítalo.

## Fuera de alcance

Este hito solo prepara la infraestructura para agentes (memory bank, `AGENTS.md`, reglas y skill). No se crean aplicaciones, APIs ni agentes de producto.
