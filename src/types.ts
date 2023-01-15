export type Store<T> = {
  [key: Key]: T;
};

export type Key = number | string;

export type Fallback<T> = (key: Key) => T | Promise<T>;
