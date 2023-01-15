import { describe, it, expect, vi } from "vitest";

import { Memoizer } from "../src/main";

describe("Basic set and get operations", () => {
  it("Returns a set and a get function", () => {
    const { set, get } = Memoizer();
    expect(set).toBeDefined();
    expect(get).toBeDefined();
  });

  it("Sets and returns values for a given key", () => {
    const { set, get } = Memoizer<string>();

    const value1 = "First value";
    set(1, value1);
    expect(get(1)).resolves.toBe(value1);
  });

  it("Doesn't overwrite any value if indicated", () => {
    const { set, get } = Memoizer<number>();

    const initialValue = 2;
    const overwritedValue = 3;

    set(1, initialValue);
    expect(get(1)).resolves.toBe(initialValue);
    set(1, overwritedValue, false);
    expect(get(1)).resolves.toBe(initialValue);
  });

  it("Overwrites the value if indicated", () => {
    const { set, get } = Memoizer<number>();

    const initialValue = 2;
    const overwritedValue = 3;

    set(1, initialValue);
    expect(get(1)).resolves.toBe(initialValue);

    set(1, overwritedValue, true);
    expect(get(1)).resolves.toBe(overwritedValue);
  });

  it("Throws error when the key is not present and no fallback is provided", async () => {
    const { get } = Memoizer();
    expect(async () => await get(1)).rejects.toThrow();
  });
});

describe("Memoizer with sync fallback", () => {
  it("Calls fallback when the key is not present and returns the same value as the fallback", async () => {
    const fallbackSpy = vi.fn((key) => key * 2);

    const { get } = Memoizer<number>(fallbackSpy);

    expect(get(1)).resolves.toBe(2);
    expect(fallbackSpy).toBeCalledTimes(1);
  });

  it("Assigns the value returned by the fallback, which won't be called next time the key is needed", async () => {
    const fallbackSpy = vi.fn((key) => key * 2);
    const { get } = Memoizer<number>(fallbackSpy);

    await get(1);
    await get(1);
    expect(fallbackSpy).toBeCalledTimes(1);
  });

  it("Throws error message if fallback fails", async () => {
    const fallbackSpy = (key) => {
      throw new Error("Error message.");
    };

    const { get } = Memoizer<number>(fallbackSpy);
    expect(async () => await get(1)).rejects.toThrowError();
  });
});

describe("Memoizer with async fallback", () => {
  it("Calls fallback when the key is not present and returns the same value as the fallback", async () => {
    const fallbackSpy = vi.fn(async (key) => key * 2);

    const { get } = Memoizer(fallbackSpy);

    expect(await get(1)).toBe(2);
    expect(fallbackSpy).toBeCalledTimes(1);
  });

  it("Assigns the value returned by the fallback, which won't be called next time the key is needed", async () => {
    const fallbackSpy = vi.fn(async (key) => key * 2);
    const { get } = Memoizer(fallbackSpy);

    await get(1);
    await get(1);
    expect(fallbackSpy).toBeCalledTimes(1);
  });

  it("Throws error message if fallback fails", async () => {
    const fallbackSpy = async (key) => {
      throw new Error("Error message.");
    };

    const { get } = Memoizer<number>(fallbackSpy);
    expect(async () => await get(1)).rejects.toThrowError();
  });
});

describe("Memoizer with a fallback that uses the current data", () => {
  it("Calls fallback when the key is not present and returns the same value as the fallback", async () => {
    // lets say the fallback computes the next value as the
    // sum of the previous two
    const fallbackSpy = vi.fn(
      async (key, data) => data[key - 1] + data[key - 2]
    );

    const { set, get } = Memoizer(fallbackSpy);

    set(3, 10);
    set(4, 12);
    expect(await get(5)).toBe(22);
  });
});
