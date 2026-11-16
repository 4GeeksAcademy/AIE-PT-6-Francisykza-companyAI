// Validaciones de negocio: comprueban que los datos cumplen las reglas de Brasaland
// ANTES de procesarlos o guardarlos. Ninguna lanza errores: devuelven un resultado
// con la lista de problemas encontrados (en español, pensada para quien usa la herramienta).

import type {
  Ingredient,
  Money,
  OrderLine,
  PurchaseOrder,
  Restaurant,
  StockLevel,
} from "../types/models";
import {
  CURRENCY_BY_COUNTRY,
  EMERGENCY_APPROVAL_THRESHOLD_USD,
  EMERGENCY_APPROVER_NAME,
  MIN_PROTEIN_STOCK_DAYS,
  WEEKLY_ORDER_DEADLINE_HOUR,
  WEEKLY_ORDER_WEEKDAY,
} from "./business-rules";
import { linearSearch } from "./search";
import {
  convertToUsd,
  getDaysOfStock,
  getLocalTimeParts,
  getOrderCurrency,
  getOrderTotal,
} from "./domain-helpers";

export interface ValidationResult {
  isValid: boolean;
  errors: string[];
}

// Fecha y hora completa con zona: "2026-11-16T09:30:00-05:00" o "...Z".
// Se exige la zona para no depender de la zona del ordenador.
const ISO_DATE_TIME_WITH_ZONE =
  /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}(:\d{2}(\.\d+)?)?(Z|[+-]\d{2}:\d{2})$/;

function buildResult(errors: string[]): ValidationResult {
  return { isValid: errors.length === 0, errors };
}

/** Une varios resultados en uno solo. */
export function combineResults(results: readonly ValidationResult[]): ValidationResult {
  return buildResult(results.flatMap((result) => result.errors));
}

function prefixErrors(result: ValidationResult, prefix: string): ValidationResult {
  return buildResult(result.errors.map((error) => `${prefix}: ${error}`));
}

function isMissing(value: unknown): boolean {
  return (
    value === undefined ||
    value === null ||
    (typeof value === "string" && value.trim() === "")
  );
}

/** Comprueba que los campos obligatorios existen y no están vacíos. */
export function validateRequiredFields<T extends object>(
  item: T,
  requiredFields: readonly (keyof T)[]
): ValidationResult {
  const errors = requiredFields
    .filter((field) => isMissing(item[field]))
    .map((field) => `Falta el campo obligatorio "${String(field)}".`);
  return buildResult(errors);
}

export function isValidIsoDateTime(value: string): boolean {
  return ISO_DATE_TIME_WITH_ZONE.test(value) && !Number.isNaN(Date.parse(value));
}

export function validateDateTime(value: string, fieldName: string): ValidationResult {
  return isValidIsoDateTime(value)
    ? buildResult([])
    : buildResult([
        `"${fieldName}" debe ser una fecha y hora ISO con zona (ej. 2026-11-16T09:30:00-05:00).`,
      ]);
}

/** La fecha `later` no puede ser anterior a `earlier`. */
export function validateDateOrder(
  earlier: string,
  later: string,
  earlierName: string,
  laterName: string
): ValidationResult {
  if (!isValidIsoDateTime(earlier) || !isValidIsoDateTime(later)) {
    return buildResult([]); // Ya las reporta validateDateTime.
  }
  return Date.parse(later) >= Date.parse(earlier)
    ? buildResult([])
    : buildResult([`"${laterName}" no puede ser anterior a "${earlierName}".`]);
}

/** Un importe debe ser un número finito mayor que 0. */
export function validateMoney(money: Money, fieldName: string): ValidationResult {
  return Number.isFinite(money.amount) && money.amount > 0
    ? buildResult([])
    : buildResult([`"${fieldName}" debe ser un importe mayor que 0.`]);
}

/** Un local debe tener todos sus datos y la moneda propia de su país. */
export function validateRestaurant(restaurant: Restaurant): ValidationResult {
  const required = validateRequiredFields(restaurant, [
    "id",
    "name",
    "city",
    "country",
    "currency",
    "timeZone",
  ]);

  const expectedCurrency = CURRENCY_BY_COUNTRY[restaurant.country];
  const currencyErrors =
    expectedCurrency !== undefined && restaurant.currency !== expectedCurrency
      ? [
          `El local de ${restaurant.country} debe operar en ${expectedCurrency}, no en ${restaurant.currency}.`,
        ]
      : [];

  return combineResults([required, buildResult(currencyErrors)]);
}

export function validateOrderLine(line: OrderLine): ValidationResult {
  const required = validateRequiredFields(line, ["ingredientId"]);
  const quantityErrors =
    Number.isFinite(line.quantity) && line.quantity > 0
      ? []
      : ["La cantidad debe ser mayor que 0."];

  return combineResults([
    required,
    buildResult(quantityErrors),
    validateMoney(line.unitPrice, "unitPrice"),
  ]);
}

/**
 * El pedido semanal se genera los lunes antes de las 10:00, hora LOCAL del local.
 * `timeZone` es la zona del local (ej. "America/Bogota").
 */
export function validateWeeklyOrderDeadline(
  createdAt: string,
  timeZone: string
): ValidationResult {
  const localTime = getLocalTimeParts(createdAt, timeZone);
  if (localTime === undefined) {
    return buildResult(["No se pudo interpretar la fecha del pedido o la zona horaria del local."]);
  }

  const isMonday = localTime.weekday === WEEKLY_ORDER_WEEKDAY;
  const minutesIntoDay = localTime.hour * 60 + localTime.minute;
  const isBeforeDeadline = minutesIntoDay < WEEKLY_ORDER_DEADLINE_HOUR * 60;

  return isMonday && isBeforeDeadline
    ? buildResult([])
    : buildResult([
        `El pedido semanal debe hacerse el lunes antes de las ${WEEKLY_ORDER_DEADLINE_HOUR}:00 (hora local del local).`,
      ]);
}

/** Las proteínas no pueden bajar de los días mínimos de inventario. Otras categorías no tienen mínimo. */
export function validateProteinStockMinimum(
  stock: StockLevel,
  ingredient: Ingredient
): ValidationResult {
  if (ingredient.category !== "proteins") {
    return buildResult([]);
  }

  const days = getDaysOfStock(stock);
  if (days === undefined) {
    return buildResult([
      `No se puede calcular el inventario de "${ingredient.name}": el consumo diario no es válido.`,
    ]);
  }

  return days >= MIN_PROTEIN_STOCK_DAYS
    ? buildResult([])
    : buildResult([
        `"${ingredient.name}" tiene ${days.toFixed(1)} días de inventario; el mínimo es ${MIN_PROTEIN_STOCK_DAYS}.`,
      ]);
}

/** Registros de inventario de proteínas que están por debajo del mínimo (candidatos a pedido de emergencia). */
export function findStockBelowMinimum(
  stocks: readonly StockLevel[],
  ingredients: readonly Ingredient[]
): StockLevel[] {
  return stocks.filter((stock) => {
    const ingredient = linearSearch(
      ingredients,
      (candidate) => candidate.id === stock.ingredientId
    );
    return ingredient !== undefined && !validateProteinStockMinimum(stock, ingredient).isValid;
  });
}

function validateEmergencyApproval(
  order: PurchaseOrder,
  copPerUsd: number
): ValidationResult {
  const total = getOrderTotal(order);
  if (order.type !== "emergency" || total === undefined) {
    return buildResult([]);
  }

  const totalInUsd = convertToUsd(total, copPerUsd);
  if (totalInUsd === undefined) {
    return buildResult(["Hace falta un tipo de cambio COP/USD válido para evaluar la aprobación."]);
  }

  const mustBeApproved = order.status === "confirmed" || order.status === "delivered";
  const exceedsThreshold = totalInUsd > EMERGENCY_APPROVAL_THRESHOLD_USD;

  return mustBeApproved && exceedsThreshold && isMissing(order.approvedBy)
    ? buildResult([
        `El pedido de emergencia supera ${EMERGENCY_APPROVAL_THRESHOLD_USD} USD y necesita la aprobación de ${EMERGENCY_APPROVER_NAME}.`,
      ])
    : buildResult([]);
}

/**
 * Valida un pedido completo: campos obligatorios, líneas, moneda coherente con el local,
 * fechas coherentes y aprobación de los pedidos de emergencia grandes.
 * `copPerUsd` es el tipo de cambio (COP por 1 USD) usado para el umbral de aprobación.
 */
export function validatePurchaseOrder(
  order: PurchaseOrder,
  restaurant: Restaurant,
  copPerUsd: number
): ValidationResult {
  const lineResults = order.lines.map((line, index) =>
    prefixErrors(validateOrderLine(line), `Línea ${index + 1}`)
  );

  const orderCurrency = getOrderCurrency(order);
  const currencyErrors: string[] = [];
  if (order.lines.length === 0) {
    currencyErrors.push("El pedido debe tener al menos una línea.");
  } else if (orderCurrency === undefined) {
    currencyErrors.push("Todas las líneas del pedido deben usar la misma moneda.");
  } else if (orderCurrency !== restaurant.currency) {
    currencyErrors.push(
      `El pedido está en ${orderCurrency} pero el local opera en ${restaurant.currency}.`
    );
  }

  const deliveryErrors =
    order.status === "delivered" && isMissing(order.deliveredAt)
      ? ['Un pedido entregado necesita "deliveredAt".']
      : [];

  const dateResults =
    order.deliveredAt === undefined
      ? []
      : [
          validateDateTime(order.deliveredAt, "deliveredAt"),
          validateDateOrder(order.createdAt, order.deliveredAt, "createdAt", "deliveredAt"),
        ];

  return combineResults([
    validateRequiredFields(order, ["id", "restaurantId", "supplierId", "type", "status", "createdAt"]),
    validateDateTime(order.createdAt, "createdAt"),
    ...dateResults,
    ...lineResults,
    buildResult(currencyErrors),
    buildResult(deliveryErrors),
    validateEmergencyApproval(order, copPerUsd),
  ]);
}
