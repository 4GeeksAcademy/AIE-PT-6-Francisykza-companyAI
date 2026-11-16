// Demostración en consola de las utilidades. Ejecutar con:  npm run demo

import { ingredients, purchaseOrders, restaurants, sales, stockLevels } from "./data/sample-data";
import type { PurchaseOrder } from "./types/models";
import { filterByCriteria, filterByRange, groupBy, sortBy, sortByCriteria } from "./utils/collections";
import { formatMoney, getOrderTotal } from "./utils/domain-helpers";
import { binarySearch, linearSearch } from "./utils/search";
import {
  averageTicketByRestaurant,
  countIngredientsByCategory,
  findLargestOrder,
  findSmallestOrder,
  sumOrderTotalsByCurrency,
} from "./utils/transformations";
import {
  findStockBelowMinimum,
  validatePurchaseOrder,
  validateRestaurant,
  validateWeeklyOrderDeadline,
} from "./utils/validations";

// Tipo de cambio inventado SOLO para esta demostración (no es una regla del negocio).
const DEMO_COP_PER_USD = 4000;

function printTitle(title: string): void {
  console.log("");
  console.log(`=== ${title} ===`);
}

function requireRestaurant(id: string) {
  const restaurant = restaurants.find((candidate) => candidate.id === id);
  if (restaurant === undefined) {
    throw new Error(`Local no encontrado: ${id}`);
  }
  return restaurant;
}

printTitle("1. Colecciones: filtrar y ordenar");
const proteins = filterByCriteria(ingredients, { category: "proteins" });
console.log("Proteínas:", proteins.map((ingredient) => ingredient.id).join(", "));
const ingredientsInCop = filterByCriteria(ingredients.map((i) => ({ ...i, currency: i.listPrice.currency })), { currency: "COP" });
const copInRange = filterByRange(ingredientsInCop, (ingredient) => ingredient.listPrice.amount, 10000, 30000);
console.log("Ingredientes en COP entre 10.000 y 30.000:", copInRange.map((i) => i.name).join(", "));
const copByPriceDesc = sortBy(ingredientsInCop, (ingredient) => ingredient.listPrice.amount, "desc");
console.log("Ingrediente en COP con mayor precio:", copByPriceDesc[0].id);
const byCategoryThenName = sortByCriteria(ingredients, [
  { getValue: (ingredient) => ingredient.category, direction: "asc" },
  { getValue: (ingredient) => ingredient.name, direction: "desc" },
]);
console.log("Por categoría y nombre:", byCategoryThenName.map((i) => i.id).join(", "));
console.log("Pedidos por local:", Object.keys(groupBy(purchaseOrders, (order) => order.restaurantId)).join(", "));

printTitle("2. Búsqueda lineal y binaria");
const found = linearSearch(purchaseOrders, (order) => order.id === "po-003");
console.log("Lineal po-003:", found?.id ?? "no encontrado");
console.log("Lineal po-999:", linearSearch(purchaseOrders, (order) => order.id === "po-999")?.id ?? "no encontrado");
const ordersSortedById = sortBy(purchaseOrders, (order) => order.id);
console.log("Binaria po-004:", binarySearch(ordersSortedById, "po-004", (order) => order.id)?.id ?? "no encontrado");
console.log("Binaria po-999:", binarySearch(ordersSortedById, "po-999", (order) => order.id)?.id ?? "no encontrado");
console.log("Binaria en array vacío:", binarySearch([] as PurchaseOrder[], "po-001", (order) => order.id)?.id ?? "no encontrado");

printTitle("3. Agregaciones y reportes");
console.log("Ingredientes por categoría:", countIngredientsByCategory(ingredients));
console.log("Gasto total en pedidos por moneda:", sumOrderTotalsByCurrency(purchaseOrders));
const largestUsd = findLargestOrder(purchaseOrders, "USD");
const smallestUsd = findSmallestOrder(purchaseOrders, "USD");
console.log("Pedido mayor en USD:", largestUsd?.id, largestUsd && formatMoney(getOrderTotal(largestUsd)!));
console.log("Pedido menor en USD:", smallestUsd?.id, smallestUsd && formatMoney(getOrderTotal(smallestUsd)!));
console.log("Ticket medio por local:");
averageTicketByRestaurant(sales).forEach((report) =>
  console.log(`  ${report.restaurantId}: ${report.averageTicket.toFixed(2)} ${report.currency} (${report.salesCount} ventas)`)
);

printTitle("4. Validaciones de negocio");
restaurants.forEach((restaurant) =>
  console.log(`Local ${restaurant.id}:`, validateRestaurant(restaurant).isValid ? "válido" : "inválido")
);
console.log("Local con moneda incorrecta:", validateRestaurant({ ...restaurants[0], currency: "USD" }).errors);

purchaseOrders.forEach((order) => {
  const result = validatePurchaseOrder(order, requireRestaurant(order.restaurantId), DEMO_COP_PER_USD);
  console.log(`Pedido ${order.id}:`, result.isValid ? "válido" : result.errors);
});

const brokenOrder: PurchaseOrder = {
  ...purchaseOrders[0],
  id: "po-broken",
  status: "delivered",
  deliveredAt: "2026-11-01T08:00:00-05:00",
  lines: [{ ingredientId: "", quantity: 0, unitPrice: { amount: 10, currency: "USD" } }],
};
console.log("Pedido con errores:", validatePurchaseOrder(brokenOrder, restaurants[0], DEMO_COP_PER_USD).errors);

console.log("Lunes 09:30 en Bogotá:", validateWeeklyOrderDeadline("2026-11-16T09:30:00-05:00", "America/Bogota").isValid);
console.log("Lunes 10:30 en Bogotá:", validateWeeklyOrderDeadline("2026-11-16T10:30:00-05:00", "America/Bogota").errors);

const lowStock = findStockBelowMinimum(stockLevels, ingredients);
console.log("Inventario de proteínas bajo el mínimo:", lowStock.map((s) => `${s.restaurantId}/${s.ingredientId}`).join(", "));
