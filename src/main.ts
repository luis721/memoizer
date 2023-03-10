import type { Fallback, Key, Store } from "./types";

function Memoizer<T>(fallback?: Fallback<T>) {
  const data: Store<T> = {};

  async function get(key: Key) {
    if (!data[key]) {
      if (!fallback) throw new Error("Key not found.");
      const value = await fallback(key, data);
      set(key, value);
    }

    return data[key];
  }

  function set(key: Key, value: T, overwrite = false) {
    const currentValue = data[key];
    if (currentValue && !overwrite) return;

    data[key] = value;
  }

  return { get, set };
}

export { Memoizer };
