// Modelos del dominio de Brasaland para el sistema de pedidos de ingredientes.
// Solo contiene tipos: la lógica que los usa vive en src/utils.
//
// Convenciones (ver CONTEXT.md y company-choice.md):
//  - Dos países (Colombia y EE. UU.) y dos monedas (COP y USD).
//  - Todo importe lleva su moneda (interfaz Money).
//  - Los instantes se guardan como texto ISO 8601 con zona (ej. "2026-11-16T09:30:00-05:00").

export type Currency = "COP" | "USD";

export type CountryCode = "CO" | "US";

export type IngredientCategory =
  | "proteins"
  | "vegetables"
  | "beverages"
  | "packaging"
  | "imported-sauces";

export type OrderType = "regular" | "emergency";

export type OrderStatus =
  | "draft"
  | "pending-approval"
  | "confirmed"
  | "delivered"
  | "cancelled";

/** Un importe siempre va acompañado de su moneda. */
export interface Money {
  amount: number;
  currency: Currency;
}

/** Un local de Brasaland. `timeZone` es una zona IANA (ej. "America/Bogota"). */
export interface Restaurant {
  id: string;
  name: string;
  city: string;
  country: CountryCode;
  currency: Currency;
  timeZone: string;
}

export interface Supplier {
  id: string;
  name: string;
  country: CountryCode;
  categories: IngredientCategory[];
}

export interface Ingredient {
  id: string;
  name: string;
  category: IngredientCategory;
  unit: string;
  supplierId: string;
  listPrice: Money;
}

/** Inventario de un ingrediente en un local, medido en `recordedAt`. */
export interface StockLevel {
  restaurantId: string;
  ingredientId: string;
  quantity: number;
  dailyConsumption: number;
  recordedAt: string;
}

export interface OrderLine {
  ingredientId: string;
  quantity: number;
  unitPrice: Money;
}

/** Pedido de un local a un proveedor. */
export interface PurchaseOrder {
  id: string;
  restaurantId: string;
  supplierId: string;
  type: OrderType;
  status: OrderStatus;
  createdAt: string;
  deliveredAt?: string;
  approvedBy?: string;
  lines: OrderLine[];
}

/** Venta registrada en el punto de venta de un local. */
export interface Sale {
  id: string;
  restaurantId: string;
  soldAt: string;
  total: Money;
}
