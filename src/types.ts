export type Store<T> = {
  [key: string]: T;
};

export type Key = number | string;

export type Fallback<T> = (key: Key) => T;
