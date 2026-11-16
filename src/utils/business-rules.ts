// Reglas de negocio del procedimiento de pedidos a proveedores.
// Viven SOLO aquí: el resto del código importa estas constantes y no repite los números.
// Fuente: company-choice.md (sección "Reto de automatización") y CONTEXT.md.

import type { CountryCode, Currency } from "../types/models";

/** Ningún local debe operar con menos de 3 días de inventario de proteínas. */
export const MIN_PROTEIN_STOCK_DAYS = 3;

/** El pedido de emergencia lleva un recargo del 8 % sobre el precio de lista. */
export const EMERGENCY_SURCHARGE_RATE = 0.08;

/** Un pedido de emergencia por encima de este importe (en USD) necesita aprobación. */
export const EMERGENCY_APPROVAL_THRESHOLD_USD = 500;

/** Quien aprueba los pedidos de emergencia grandes (CONTEXT.md, Compras y proveedores). */
export const EMERGENCY_APPROVER_NAME = "Lucía Fernández";

/** El pedido semanal se genera los lunes antes de las 10:00, hora local del local. */
export const WEEKLY_ORDER_WEEKDAY = "Mon";
export const WEEKLY_ORDER_DEADLINE_HOUR = 10;

/** Cada país opera con su moneda. */
export const CURRENCY_BY_COUNTRY: Record<CountryCode, Currency> = {
  CO: "COP",
  US: "USD",
};
