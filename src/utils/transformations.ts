// Agregaciones y reportes sencillos sobre colecciones.
// Las genéricas (countBy, sumBy, findMaxBy…) sirven para cualquier tipo;
// las de reporte aplican esas piezas a los modelos de Brasaland.

import type { Currency, Ingredient, PurchaseOrder, Sale } from "../types/models";
import { groupBy } from "./collections";
import { getOrderCurrency, getOrderTotal, roundToCents } from "./domain-helpers";

export interface TicketReport {
  restaurantId: string;
  currency: Currency;
  salesCount: number;
  averageTicket: number;
}

export function countBy<T>(
  items: readonly T[],
  getKey: (item: T) => string
): Record<string, number> {
  return items.reduce<Record<string, number>>((counts, item) => {
    const key = getKey(item);
    counts[key] = (counts[key] ?? 0) + 1;
    return counts;
  }, {});
}

export function sumBy<T>(items: readonly T[], getValue: (item: T) => number): number {
  return items.reduce((sum, item) => sum + getValue(item), 0);
}

/** Elemento con el valor más alto. undefined si el array está vacío. */
export function findMaxBy<T>(
  items: readonly T[],
  getValue: (item: T) => number
): T | undefined {
  return items.reduce<T | undefined>(
    (best, item) =>
      best === undefined || getValue(item) > getValue(best) ? item : best,
    undefined
  );
}

/** Elemento con el valor más bajo. undefined si el array está vacío. */
export function findMinBy<T>(
  items: readonly T[],
  getValue: (item: T) => number
): T | undefined {
  return items.reduce<T | undefined>(
    (best, item) =>
      best === undefined || getValue(item) < getValue(best) ? item : best,
    undefined
  );
}

/** Promedio de los valores. undefined si el array está vacío (evita dividir entre 0). */
export function averageBy<T>(
  items: readonly T[],
  getValue: (item: T) => number
): number | undefined {
  if (items.length === 0) {
    return undefined;
  }
  return sumBy(items, getValue) / items.length;
}

/** Cuántos ingredientes hay en cada categoría. */
export function countIngredientsByCategory(
  ingredients: readonly Ingredient[]
): Record<string, number> {
  return countBy(ingredients, (ingredient) => ingredient.category);
}

/** Gasto total en pedidos, separado por moneda (nunca se suman COP y USD entre sí). */
export function sumOrderTotalsByCurrency(
  orders: readonly PurchaseOrder[]
): Record<Currency, number> {
  return orders.reduce<Record<Currency, number>>(
    (totals, order) => {
      const total = getOrderTotal(order);
      if (total !== undefined) {
        totals[total.currency] = roundToCents(totals[total.currency] + total.amount);
      }
      return totals;
    },
    { COP: 0, USD: 0 }
  );
}

function getOrdersInCurrency(
  orders: readonly PurchaseOrder[],
  currency: Currency
): PurchaseOrder[] {
  return orders.filter((order) => getOrderCurrency(order) === currency);
}

function getOrderAmount(order: PurchaseOrder): number {
  return getOrderTotal(order)?.amount ?? 0;
}

/** Pedido de mayor importe en la moneda indicada. */
export function findLargestOrder(
  orders: readonly PurchaseOrder[],
  currency: Currency
): PurchaseOrder | undefined {
  return findMaxBy(getOrdersInCurrency(orders, currency), getOrderAmount);
}

/** Pedido de menor importe en la moneda indicada. */
export function findSmallestOrder(
  orders: readonly PurchaseOrder[],
  currency: Currency
): PurchaseOrder | undefined {
  return findMinBy(getOrdersInCurrency(orders, currency), getOrderAmount);
}

/** Ticket medio por local y moneda, con el número de ventas que lo respalda. */
export function averageTicketByRestaurant(sales: readonly Sale[]): TicketReport[] {
  const groups = groupBy(
    sales,
    (sale) => `${sale.restaurantId}|${sale.total.currency}`
  );

  return Object.values(groups).map((groupSales) => ({
    restaurantId: groupSales[0].restaurantId,
    currency: groupSales[0].total.currency,
    salesCount: groupSales.length,
    averageTicket: roundToCents(
      averageBy(groupSales, (sale) => sale.total.amount) ?? 0
    ),
  }));
}
