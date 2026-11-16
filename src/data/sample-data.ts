// DATOS FICTICIOS, solo para probar las funciones.
// Los nombres de locales y proveedores son inventados y sus importes no son reales.
// No representan a ninguna persona ni a ningún proveedor real de Brasaland.

import type {
  Ingredient,
  PurchaseOrder,
  Restaurant,
  Sale,
  StockLevel,
  Supplier,
} from "../types/models";

export const restaurants: Restaurant[] = [
  {
    id: "rest-medellin-centro",
    name: "Local Medellín Centro (ejemplo)",
    city: "Medellín",
    country: "CO",
    currency: "COP",
    timeZone: "America/Bogota",
  },
  {
    id: "rest-miami",
    name: "Local Miami (ejemplo)",
    city: "Miami",
    country: "US",
    currency: "USD",
    timeZone: "America/New_York",
  },
];

export const suppliers: Supplier[] = [
  { id: "sup-co-proteins", name: "Proveedor de proteínas CO (ejemplo)", country: "CO", categories: ["proteins"] },
  { id: "sup-co-fresh", name: "Proveedor de frescos CO (ejemplo)", country: "CO", categories: ["vegetables"] },
  { id: "sup-co-goods", name: "Proveedor de bebidas y salsas CO (ejemplo)", country: "CO", categories: ["beverages", "imported-sauces"] },
  { id: "sup-us-proteins", name: "Proveedor de proteínas US (ejemplo)", country: "US", categories: ["proteins"] },
  { id: "sup-us-pack", name: "Proveedor de empaques US (ejemplo)", country: "US", categories: ["packaging", "beverages"] },
];

export const ingredients: Ingredient[] = [
  { id: "ing-beef-co", name: "Carne de res", category: "proteins", unit: "kg", supplierId: "sup-co-proteins", listPrice: { amount: 28000, currency: "COP" } },
  { id: "ing-chicken-co", name: "Pollo", category: "proteins", unit: "kg", supplierId: "sup-co-proteins", listPrice: { amount: 14000, currency: "COP" } },
  { id: "ing-lettuce-co", name: "Lechuga", category: "vegetables", unit: "kg", supplierId: "sup-co-fresh", listPrice: { amount: 6000, currency: "COP" } },
  { id: "ing-cola-co", name: "Gaseosa (caja)", category: "beverages", unit: "caja", supplierId: "sup-co-goods", listPrice: { amount: 45000, currency: "COP" } },
  { id: "ing-sauce-co", name: "Salsa importada", category: "imported-sauces", unit: "botella", supplierId: "sup-co-goods", listPrice: { amount: 18000, currency: "COP" } },
  { id: "ing-beef-us", name: "Carne de res", category: "proteins", unit: "lb", supplierId: "sup-us-proteins", listPrice: { amount: 7.5, currency: "USD" } },
  { id: "ing-chicken-us", name: "Pollo", category: "proteins", unit: "lb", supplierId: "sup-us-proteins", listPrice: { amount: 3.2, currency: "USD" } },
  { id: "ing-boxes-us", name: "Cajas para llevar", category: "packaging", unit: "caja", supplierId: "sup-us-pack", listPrice: { amount: 32, currency: "USD" } },
];

export const stockLevels: StockLevel[] = [
  { restaurantId: "rest-medellin-centro", ingredientId: "ing-beef-co", quantity: 40, dailyConsumption: 20, recordedAt: "2026-11-15T23:00:00-05:00" },
  { restaurantId: "rest-medellin-centro", ingredientId: "ing-chicken-co", quantity: 90, dailyConsumption: 25, recordedAt: "2026-11-15T23:00:00-05:00" },
  { restaurantId: "rest-miami", ingredientId: "ing-beef-us", quantity: 100, dailyConsumption: 30, recordedAt: "2026-11-15T23:00:00-05:00" },
  { restaurantId: "rest-miami", ingredientId: "ing-chicken-us", quantity: 20, dailyConsumption: 10, recordedAt: "2026-11-15T23:00:00-05:00" },
];

export const purchaseOrders: PurchaseOrder[] = [
  {
    id: "po-001",
    restaurantId: "rest-medellin-centro",
    supplierId: "sup-co-proteins",
    type: "regular",
    status: "delivered",
    createdAt: "2026-11-09T09:30:00-05:00",
    deliveredAt: "2026-11-11T08:00:00-05:00",
    lines: [
      { ingredientId: "ing-beef-co", quantity: 40, unitPrice: { amount: 28000, currency: "COP" } },
      { ingredientId: "ing-chicken-co", quantity: 30, unitPrice: { amount: 14000, currency: "COP" } },
    ],
  },
  {
    id: "po-002",
    restaurantId: "rest-medellin-centro",
    supplierId: "sup-co-proteins",
    type: "emergency",
    status: "confirmed",
    createdAt: "2026-11-13T16:00:00-05:00",
    lines: [{ ingredientId: "ing-beef-co", quantity: 10, unitPrice: { amount: 28000, currency: "COP" } }],
  },
  {
    id: "po-003",
    restaurantId: "rest-miami",
    supplierId: "sup-us-proteins",
    type: "emergency",
    status: "confirmed",
    createdAt: "2026-11-12T11:00:00-05:00",
    lines: [{ ingredientId: "ing-beef-us", quantity: 80, unitPrice: { amount: 7.5, currency: "USD" } }],
  },
  {
    id: "po-004",
    restaurantId: "rest-miami",
    supplierId: "sup-us-proteins",
    type: "emergency",
    status: "confirmed",
    createdAt: "2026-11-14T10:00:00-05:00",
    approvedBy: "Lucía Fernández",
    lines: [{ ingredientId: "ing-chicken-us", quantity: 200, unitPrice: { amount: 3.2, currency: "USD" } }],
  },
  {
    id: "po-005",
    restaurantId: "rest-miami",
    supplierId: "sup-us-pack",
    type: "regular",
    status: "confirmed",
    createdAt: "2026-11-09T08:15:00-05:00",
    lines: [{ ingredientId: "ing-boxes-us", quantity: 6, unitPrice: { amount: 32, currency: "USD" } }],
  },
];

export const sales: Sale[] = [
  { id: "sale-001", restaurantId: "rest-medellin-centro", soldAt: "2026-11-14T13:10:00-05:00", total: { amount: 38000, currency: "COP" } },
  { id: "sale-002", restaurantId: "rest-medellin-centro", soldAt: "2026-11-14T14:05:00-05:00", total: { amount: 52000, currency: "COP" } },
  { id: "sale-003", restaurantId: "rest-medellin-centro", soldAt: "2026-11-14T20:40:00-05:00", total: { amount: 41000, currency: "COP" } },
  { id: "sale-004", restaurantId: "rest-miami", soldAt: "2026-11-14T12:30:00-05:00", total: { amount: 22.5, currency: "USD" } },
  { id: "sale-005", restaurantId: "rest-miami", soldAt: "2026-11-14T13:45:00-05:00", total: { amount: 31, currency: "USD" } },
  { id: "sale-006", restaurantId: "rest-miami", soldAt: "2026-11-14T19:20:00-05:00", total: { amount: 18.75, currency: "USD" } },
  { id: "sale-007", restaurantId: "rest-miami", soldAt: "2026-11-14T21:00:00-05:00", total: { amount: 40, currency: "USD" } },
];
