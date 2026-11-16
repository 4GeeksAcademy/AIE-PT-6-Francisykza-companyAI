// Comprobaciones automáticas de las utilidades. Ejecutar con:  npm run check
// Si alguna falla, el script termina con un error que indica cuál.

import { purchaseOrders, restaurants, sales } from "./data/sample-data";
import type { Ingredient, PurchaseOrder, Restaurant, StockLevel } from "./types/models";
import {
  compareValues,
  filterByCriteria,
  filterByRange,
  groupBy,
  sortBy,
  sortByCriteria,
} from "./utils/collections";
import {
  convertToUsd,
  getDaysOfStock,
  getLocalTimeParts,
  getOrderTotal,
} from "./utils/domain-helpers";
import {
  binarySearch,
  binarySearchIndex,
  linearSearch,
  linearSearchIndex,
} from "./utils/search";
import {
  averageBy,
  averageTicketByRestaurant,
  countBy,
  findLargestOrder,
  findMaxBy,
  findMinBy,
  sumBy,
  sumOrderTotalsByCurrency,
} from "./utils/transformations";
import {
  findStockBelowMinimum,
  isValidIsoDateTime,
  validateDateOrder,
  validateProteinStockMinimum,
  validatePurchaseOrder,
  validateRequiredFields,
  validateRestaurant,
  validateWeeklyOrderDeadline,
} from "./utils/validations";

let passed = 0;

function check(name: string, condition: boolean): void {
  if (!condition) {
    throw new Error(`Comprobación fallida: ${name}`);
  }
  passed++;
}

function sameList(a: readonly unknown[], b: readonly unknown[]): boolean {
  return JSON.stringify(a) === JSON.stringify(b);
}

const COP_PER_USD = 4000; // Valor inventado solo para estas pruebas.
const numbers = [30, 10, 20, 50, 40];
const sortedNumbers = [10, 20, 30, 40, 50];

// --- Colecciones ---
check("compareValues números", compareValues(2, 10) < 0);
check("compareValues textos", compareValues("b", "a") > 0 && compareValues("a", "a") === 0);
check("sortBy ascendente", sameList(sortBy(numbers, (n) => n), sortedNumbers));
check("sortBy descendente", sameList(sortBy(numbers, (n) => n, "desc"), [50, 40, 30, 20, 10]));
check("sortBy no modifica el original", sameList(numbers, [30, 10, 20, 50, 40]));
check("sortBy array vacío", sortBy<number>([], (n) => n).length === 0);

const people = [
  { name: "b", age: 2 },
  { name: "a", age: 2 },
  { name: "c", age: 1 },
];
check(
  "sortByCriteria desempata por el segundo criterio",
  sameList(
    sortByCriteria(people, [
      { getValue: (p) => p.age, direction: "desc" },
      { getValue: (p) => p.name, direction: "asc" },
    ]).map((p) => p.name),
    ["a", "b", "c"]
  )
);
check("filterByCriteria", filterByCriteria(people, { age: 2 }).length === 2);
check("filterByCriteria sin criterios devuelve todo", filterByCriteria(people, {}).length === 3);
check("filterByCriteria sin coincidencias", filterByCriteria(people, { name: "z" }).length === 0);
check("filterByRange incluye los extremos", filterByRange(numbers, (n) => n, 20, 40).length === 3);
check("filterByRange array vacío", filterByRange<number>([], (n) => n, 0, 1).length === 0);
check("groupBy", Object.keys(groupBy(people, (p) => String(p.age))).length === 2);

// --- Búsquedas ---
check("lineal encuentra", linearSearchIndex(numbers, (n) => n === 20) === 2);
check("lineal no encuentra", linearSearchIndex(numbers, (n) => n === 99) === -1);
check("lineal array vacío", linearSearch<number>([], () => true) === undefined);
check("binaria encuentra el primero", binarySearchIndex(sortedNumbers, 10, (n) => n) === 0);
check("binaria encuentra el último", binarySearchIndex(sortedNumbers, 50, (n) => n) === 4);
check("binaria encuentra en medio", binarySearchIndex(sortedNumbers, 30, (n) => n) === 2);
check("binaria no encuentra", binarySearchIndex(sortedNumbers, 35, (n) => n) === -1);
check("binaria menor que todos", binarySearchIndex(sortedNumbers, 1, (n) => n) === -1);
check("binaria mayor que todos", binarySearchIndex(sortedNumbers, 99, (n) => n) === -1);
check("binaria array vacío", binarySearchIndex<number, number>([], 1, (n) => n) === -1);
check("binaria con textos", binarySearch(["a", "c", "e"], "c", (s) => s) === "c");

// --- Agregaciones ---
check("countBy", countBy(["a", "b", "a"], (s) => s)["a"] === 2);
check("countBy array vacío", Object.keys(countBy<string>([], (s) => s)).length === 0);
check("sumBy", sumBy(numbers, (n) => n) === 150);
check("sumBy array vacío", sumBy<number>([], (n) => n) === 0);
check("findMaxBy", findMaxBy(numbers, (n) => n) === 50);
check("findMinBy", findMinBy(numbers, (n) => n) === 10);
check("findMaxBy array vacío", findMaxBy<number>([], (n) => n) === undefined);
check("findMinBy array vacío", findMinBy<number>([], (n) => n) === undefined);
check("averageBy", averageBy(numbers, (n) => n) === 30);
check("averageBy array vacío no divide entre 0", averageBy<number>([], (n) => n) === undefined);

const totals = sumOrderTotalsByCurrency(purchaseOrders);
check("total COP (incluye recargo de emergencia)", totals.COP === 1842400);
check("total USD (incluye recargo de emergencia)", totals.USD === 1531.2);
check("totales de lista vacía", sumOrderTotalsByCurrency([]).COP === 0);
check("pedido mayor en USD", findLargestOrder(purchaseOrders, "USD")?.id === "po-004");
check("pedido mayor sin pedidos", findLargestOrder([], "USD") === undefined);

const tickets = averageTicketByRestaurant(sales);
check("ticket medio: un informe por local y moneda", tickets.length === 2);
check("ticket medio COP", tickets.some((t) => t.currency === "COP" && Math.round(t.averageTicket) === 43667));
check("ticket medio de lista vacía", averageTicketByRestaurant([]).length === 0);

// --- Helpers de dominio ---
const emergencyOrder = purchaseOrders.find((o) => o.id === "po-003");
check("el pedido de emergencia lleva recargo del 8 %", emergencyOrder !== undefined && getOrderTotal(emergencyOrder)?.amount === 648);
check("pedido sin líneas no tiene total", getOrderTotal({ ...purchaseOrders[0], lines: [] }) === undefined);
check("convertToUsd con USD", convertToUsd({ amount: 10, currency: "USD" }, 0) === 10);
check("convertToUsd con COP", convertToUsd({ amount: 8000, currency: "COP" }, COP_PER_USD) === 2);
check("convertToUsd sin tipo de cambio válido", convertToUsd({ amount: 8000, currency: "COP" }, 0) === undefined);

const stock = (quantity: number, dailyConsumption: number): StockLevel => ({
  restaurantId: "r",
  ingredientId: "i",
  quantity,
  dailyConsumption,
  recordedAt: "2026-11-15T23:00:00-05:00",
});
check("días de inventario", getDaysOfStock(stock(60, 20)) === 3);
check("consumo 0 no da días", getDaysOfStock(stock(60, 0)) === undefined);

check(
  "hora local: 14:30 UTC es 09:30 en Bogotá",
  getLocalTimeParts("2026-11-16T14:30:00Z", "America/Bogota")?.hour === 9
);
check("zona horaria inexistente", getLocalTimeParts("2026-11-16T14:30:00Z", "Mars/Olympus") === undefined);

// --- Validaciones ---
const beef: Ingredient = {
  id: "i",
  name: "Carne",
  category: "proteins",
  unit: "kg",
  supplierId: "s",
  listPrice: { amount: 1, currency: "USD" },
};
check("proteína con 3 días cumple el mínimo", validateProteinStockMinimum(stock(60, 20), beef).isValid);
check("proteína con menos de 3 días no cumple", !validateProteinStockMinimum(stock(59, 20), beef).isValid);
check("proteína sin consumo válido se rechaza", !validateProteinStockMinimum(stock(60, 0), beef).isValid);
check(
  "otras categorías no tienen mínimo",
  validateProteinStockMinimum(stock(1, 20), { ...beef, category: "vegetables" }).isValid
);
check("findStockBelowMinimum", findStockBelowMinimum([stock(10, 20), stock(100, 20)], [beef]).length === 1);
check("findStockBelowMinimum sin datos", findStockBelowMinimum([], []).length === 0);

check("fecha ISO con zona", isValidIsoDateTime("2026-11-16T09:30:00-05:00"));
check("fecha ISO con Z", isValidIsoDateTime("2026-11-16T09:30:00Z"));
check("fecha sin zona se rechaza", !isValidIsoDateTime("2026-11-16T09:30:00"));
check("fecha solo día se rechaza", !isValidIsoDateTime("2026-11-16"));
check("fecha imposible se rechaza", !isValidIsoDateTime("2026-13-45T09:30:00Z"));
check("fechas coherentes", validateDateOrder("2026-11-01T00:00:00Z", "2026-11-02T00:00:00Z", "a", "b").isValid);
check("fechas incoherentes", !validateDateOrder("2026-11-02T00:00:00Z", "2026-11-01T00:00:00Z", "a", "b").isValid);

check("campos obligatorios completos", validateRequiredFields({ a: "x", b: 1 }, ["a", "b"]).isValid);
check("campo obligatorio vacío", !validateRequiredFields({ a: "  " }, ["a"]).isValid);
check("campo obligatorio ausente", !validateRequiredFields({ a: undefined as string | undefined }, ["a"]).isValid);

check("locales de ejemplo válidos", restaurants.every((r) => validateRestaurant(r).isValid));
const wrongCurrencyRestaurant: Restaurant = { ...restaurants[0], currency: "USD" };
check("moneda que no corresponde al país", !validateRestaurant(wrongCurrencyRestaurant).isValid);

check("lunes 09:59 local es válido", validateWeeklyOrderDeadline("2026-11-16T09:59:00-05:00", "America/Bogota").isValid);
check("lunes 10:00 local ya no es válido", !validateWeeklyOrderDeadline("2026-11-16T10:00:00-05:00", "America/Bogota").isValid);
check("martes no es válido", !validateWeeklyOrderDeadline("2026-11-17T08:00:00-05:00", "America/Bogota").isValid);
check(
  "usa la hora local, no la UTC (lunes 03:00 UTC es domingo en Bogotá)",
  !validateWeeklyOrderDeadline("2026-11-16T03:00:00Z", "America/Bogota").isValid
);
check("fecha inválida en la regla semanal", !validateWeeklyOrderDeadline("no-es-fecha", "America/Bogota").isValid);

const medellin = restaurants[0];
const miami = restaurants[1];
const byId = (id: string): PurchaseOrder => purchaseOrders.find((o) => o.id === id) as PurchaseOrder;
check("pedido regular válido", validatePurchaseOrder(byId("po-001"), medellin, COP_PER_USD).isValid);
check("emergencia pequeña sin aprobación es válida", validatePurchaseOrder(byId("po-002"), medellin, COP_PER_USD).isValid);
check("emergencia >500 USD sin aprobación se rechaza", !validatePurchaseOrder(byId("po-003"), miami, COP_PER_USD).isValid);
check("emergencia >500 USD con aprobación es válida", validatePurchaseOrder(byId("po-004"), miami, COP_PER_USD).isValid);
check(
  "emergencia >500 USD pendiente de aprobación es válida",
  validatePurchaseOrder({ ...byId("po-003"), status: "pending-approval" }, miami, COP_PER_USD).isValid
);
check("pedido sin líneas se rechaza", !validatePurchaseOrder({ ...byId("po-001"), lines: [] }, medellin, COP_PER_USD).isValid);
check("pedido en moneda distinta a la del local", !validatePurchaseOrder(byId("po-001"), miami, COP_PER_USD).isValid);
check(
  "pedido con monedas mezcladas",
  !validatePurchaseOrder(
    { ...byId("po-001"), lines: [...byId("po-001").lines, { ingredientId: "x", quantity: 1, unitPrice: { amount: 1, currency: "USD" } }] },
    medellin,
    COP_PER_USD
  ).isValid
);
check(
  "pedido entregado sin fecha de entrega",
  !validatePurchaseOrder({ ...byId("po-001"), deliveredAt: undefined }, medellin, COP_PER_USD).isValid
);
check(
  "entrega anterior a la creación",
  !validatePurchaseOrder({ ...byId("po-001"), deliveredAt: "2026-01-01T00:00:00-05:00" }, medellin, COP_PER_USD).isValid
);
check(
  "cantidad cero en una línea",
  !validatePurchaseOrder(
    { ...byId("po-001"), lines: [{ ingredientId: "x", quantity: 0, unitPrice: { amount: 1, currency: "COP" } }] },
    medellin,
    COP_PER_USD
  ).isValid
);
check(
  "emergencia en COP sin tipo de cambio válido se rechaza",
  !validatePurchaseOrder(byId("po-002"), medellin, 0).isValid
);

console.log(`Todas las comprobaciones pasaron (${passed}).`);
