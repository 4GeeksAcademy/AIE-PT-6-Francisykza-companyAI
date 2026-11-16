// Funciones para filtrar, ordenar y agrupar arrays.
// Ninguna modifica el array recibido: siempre devuelven uno nuevo.

export type Comparable = string | number;

export type SortDirection = "asc" | "desc";

export interface SortCriterion<T> {
  getValue: (item: T) => Comparable;
  direction: SortDirection;
}

/** Compara dos valores del mismo tipo: negativo si a < b, 0 si son iguales, positivo si a > b. */
export function compareValues(a: Comparable, b: Comparable): number {
  if (typeof a === "number" && typeof b === "number") {
    return a - b;
  }
  const textA = String(a);
  const textB = String(b);
  if (textA < textB) {
    return -1;
  }
  return textA > textB ? 1 : 0;
}

export function filterItems<T>(
  items: readonly T[],
  predicate: (item: T) => boolean
): T[] {
  return items.filter(predicate);
}

/** Elementos cuyos campos coinciden con todos los criterios indicados (los undefined se ignoran). */
export function filterByCriteria<T extends object>(
  items: readonly T[],
  criteria: Partial<T>
): T[] {
  const keys = Object.keys(criteria) as (keyof T)[];
  return items.filter((item) =>
    keys.every((key) => criteria[key] === undefined || item[key] === criteria[key])
  );
}

/** Elementos cuyo valor numérico está entre min y max, ambos incluidos. */
export function filterByRange<T>(
  items: readonly T[],
  getValue: (item: T) => number,
  min: number = Number.NEGATIVE_INFINITY,
  max: number = Number.POSITIVE_INFINITY
): T[] {
  return items.filter((item) => {
    const value = getValue(item);
    return value >= min && value <= max;
  });
}

export function sortBy<T>(
  items: readonly T[],
  getValue: (item: T) => Comparable,
  direction: SortDirection = "asc"
): T[] {
  const sign = direction === "asc" ? 1 : -1;
  return [...items].sort((a, b) => sign * compareValues(getValue(a), getValue(b)));
}

/** Ordena por varios criterios: el primero manda y los siguientes desempatan. */
export function sortByCriteria<T>(
  items: readonly T[],
  criteria: readonly SortCriterion<T>[]
): T[] {
  return [...items].sort((a, b) => {
    for (const criterion of criteria) {
      const sign = criterion.direction === "asc" ? 1 : -1;
      const result = sign * compareValues(criterion.getValue(a), criterion.getValue(b));
      if (result !== 0) {
        return result;
      }
    }
    return 0;
  });
}

/** Agrupa los elementos por la clave que devuelve getKey. */
export function groupBy<T>(
  items: readonly T[],
  getKey: (item: T) => string
): Record<string, T[]> {
  return items.reduce<Record<string, T[]>>((groups, item) => {
    const key = getKey(item);
    (groups[key] ??= []).push(item);
    return groups;
  }, {});
}
