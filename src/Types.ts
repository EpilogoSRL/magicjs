
/**
 * Get all of the keys except those to which U can be assigned.
 */
export type ExcludeKeys<T, U> = {
  [K in keyof T]: U extends T[K] ? never : K;
}[keyof T];

/**
 * Get the interface containing no properties to which U can be assigned.
 */
type ExcludeUndefined<T> = {
  [K in ExcludeKeys<T, undefined>]: T[K];
};

/**
 * Get the interface where all properties are optional.
 */
export type Optional<T> = { [K in keyof T]?: T[K] };

/**
 * Get all of the keys to which U can be assigned.
 */
type OnlyKeys<T, U> = {
  [K in keyof T]: U extends T[K] ? K : never;
}[keyof T];

/**
 * Get the interface containing only properties to which U can be assigned.
 */
type OnlyUndefined<T> = {
  [K in OnlyKeys<T, undefined>]: T[K];
};

/**
 * Get the interface where properties that can be assigned undefined are
 * also optional.
 */
export type UndefinedOptional<T> = ExcludeUndefined<T> & Optional<OnlyUndefined<T>>;
