// Búsquedas sobre arrays: lineal (array desordenado) y binaria (array ordenado).
// Ambas devuelven -1 / undefined si el array está vacío o no hay coincidencia.

import { compareValues } from "./collections";
import type { Comparable } from "./collections";

/** Índice del primer elemento que cumple el predicado, o -1. Recorre el array de principio a fin. */
export function linearSearchIndex<T>(
  items: readonly T[],
  predicate: (item: T) => boolean
): number {
  for (let index = 0; index < items.length; index++) {
    if (predicate(items[index])) {
      return index;
    }
  }
  return -1;
}

export function linearSearch<T>(
  items: readonly T[],
  predicate: (item: T) => boolean
): T | undefined {
  const index = linearSearchIndex(items, predicate);
  return index === -1 ? undefined : items[index];
}

/**
 * Índice del elemento cuya clave es `target`, o -1.
 * REQUISITO: `sortedItems` debe estar ordenado de forma ascendente por esa misma clave
 * (por ejemplo, con `sortBy` de collections.ts).
 */
export function binarySearchIndex<T, K extends Comparable>(
  sortedItems: readonly T[],
  target: K,
  getKey: (item: T) => K
): number {
  let low = 0;
  let high = sortedItems.length - 1;

  while (low <= high) {
    const middle = Math.floor((low + high) / 2);
    const comparison = compareValues(getKey(sortedItems[middle]), target);

    if (comparison === 0) {
      return middle;
    }
    if (comparison < 0) {
      low = middle + 1;
    } else {
      high = middle - 1;
    }
  }

  return -1;
}

export function binarySearch<T, K extends Comparable>(
  sortedItems: readonly T[],
  target: K,
  getKey: (item: T) => K
): T | undefined {
  const index = binarySearchIndex(sortedItems, target, getKey);
  return index === -1 ? undefined : sortedItems[index];
}
