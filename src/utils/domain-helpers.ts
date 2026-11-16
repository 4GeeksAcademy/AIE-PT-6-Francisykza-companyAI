// Funciones auxiliares para trabajar con los modelos del dominio.
// Todas son puras: solo usan lo que reciben por parámetros.

import type {
  Currency,
  Money,
  OrderLine,
  PurchaseOrder,
  StockLevel,
} from "../types/models";
import { EMERGENCY_SURCHARGE_RATE } from "./business-rules";

export interface LocalTimeParts {
  weekday: string;
  hour: number;
  minute: number;
}

export function roundToCents(value: number): number {
  return Math.round(value * 100) / 100;
}

export function createMoney(amount: number, currency: Currency): Money {
  return { amount: roundToCents(amount), currency };
}

export function formatMoney(money: Money): string {
  return `${money.amount.toFixed(2)} ${money.currency}`;
}

export function getLineTotal(line: OrderLine): Money {
  return createMoney(line.quantity * line.unitPrice.amount, line.unitPrice.currency);
}

/** Moneda común de todas las líneas, o undefined si no hay líneas o se mezclan monedas. */
export function getOrderCurrency(order: PurchaseOrder): Currency | undefined {
  if (order.lines.length === 0) {
    return undefined;
  }
  const firstCurrency = order.lines[0].unitPrice.currency;
  const sameCurrency = order.lines.every(
    (line) => line.unitPrice.currency === firstCurrency
  );
  return sameCurrency ? firstCurrency : undefined;
}

/** Suma de las líneas a precio de lista (sin recargo). */
export function getOrderSubtotal(order: PurchaseOrder): number {
  const subtotal = order.lines.reduce(
    (sum, line) => sum + line.quantity * line.unitPrice.amount,
    0
  );
  return roundToCents(subtotal);
}

export function isEmergencyOrder(order: PurchaseOrder): boolean {
  return order.type === "emergency";
}

/** Total del pedido, con el recargo si es de emergencia. undefined si no se puede calcular. */
export function getOrderTotal(order: PurchaseOrder): Money | undefined {
  const currency = getOrderCurrency(order);
  if (currency === undefined) {
    return undefined;
  }
  const surchargeFactor = isEmergencyOrder(order) ? 1 + EMERGENCY_SURCHARGE_RATE : 1;
  return createMoney(getOrderSubtotal(order) * surchargeFactor, currency);
}

/**
 * Importe en USD. Para COP hace falta el tipo de cambio (COP por 1 USD),
 * que se pasa por parámetro: no existe un valor fijo en el briefing.
 */
export function convertToUsd(money: Money, copPerUsd: number): number | undefined {
  if (money.currency === "USD") {
    return money.amount;
  }
  if (!Number.isFinite(copPerUsd) || copPerUsd <= 0) {
    return undefined;
  }
  return roundToCents(money.amount / copPerUsd);
}

/** Días que dura el inventario al ritmo de consumo actual. undefined si no hay consumo válido. */
export function getDaysOfStock(stock: StockLevel): number | undefined {
  if (!Number.isFinite(stock.dailyConsumption) || stock.dailyConsumption <= 0) {
    return undefined;
  }
  return stock.quantity / stock.dailyConsumption;
}

/** Día de la semana, hora y minuto de un instante en la zona horaria indicada. */
export function getLocalTimeParts(
  isoDateTime: string,
  timeZone: string
): LocalTimeParts | undefined {
  const date = new Date(isoDateTime);
  if (Number.isNaN(date.getTime())) {
    return undefined;
  }

  try {
    const parts = new Intl.DateTimeFormat("en-US", {
      timeZone,
      weekday: "short",
      hour: "numeric",
      minute: "numeric",
      hourCycle: "h23",
    }).formatToParts(date);

    const readPart = (type: string): string =>
      parts.find((part) => part.type === type)?.value ?? "";

    return {
      weekday: readPart("weekday"),
      hour: Number(readPart("hour")),
      minute: Number(readPart("minute")),
    };
  } catch {
    // Zona horaria inexistente.
    return undefined;
  }
}
