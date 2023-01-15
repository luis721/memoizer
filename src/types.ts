export type Store<T> = {
  [key: Key]: T;
};

export type Key = number | string;

export type Fallback<T> = (key?: Key, data?: Store<T>) => T | Promise<T>;
