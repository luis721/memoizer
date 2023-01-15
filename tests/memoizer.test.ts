import { describe, it, expect, vi } from "vitest";

import { Memoizer } from "../src/main";

describe("Memoizer", () => {
  it("Returns a set and a get function", () => {
    const { set, get } = Memoizer();
    expect(set).toBeDefined();
    expect(get).toBeDefined();
  });

  it("Sets and returns values for a given key", () => {
    const { set, get } = Memoizer<string>();

    const value1 = "First value";
    set(1, value1);
    expect(get(1)).toBe(value1);
  });

  it("Doesn't overwrite any value if indicated", () => {
    const { set, get } = Memoizer<number>();

    const initialValue = 2;
    const overwritedValue = 3;

    set(1, initialValue);
    expect(get(1)).toBe(initialValue);
    set(1, overwritedValue, false);
    expect(get(1)).toBe(initialValue);
  });

  it("Overwrites the value if indicated", () => {
    const { set, get } = Memoizer<number>();

    const initialValue = 2;
    const overwritedValue = 3;

    set(1, initialValue);
    expect(get(1)).toBe(initialValue);

    set(1, overwritedValue, true);
    expect(get(1)).toBe(overwritedValue);
  });

  it("Throws error when the key is not present and no fallback is provided", () => {
    const { get } = Memoizer();
    expect(() => get(1)).toThrowError();
  });

  it("Calls fallback when the key is not present and returns the same value as the fallback", () => {
    const fallbackSpy = vi.fn((key) => key * 2);

    const { get } = Memoizer(fallbackSpy);

    expect(get(1)).toBe(2);
    expect(fallbackSpy).toBeCalledTimes(1);
  });

  it("Assigns the value returned by the fallback, which won't be called next time the key is needed", () => {
    const fallbackSpy = vi.fn((key) => key * 2);
    const { get } = Memoizer(fallbackSpy);

    get(1);
    get(1);
    expect(fallbackSpy).toBeCalledTimes(1);
  });
});
