import { describe, expect, it } from "vitest";
import { getIn, setIn, updateIn } from "./paths.js";

describe("paths", () => {
  const obj = { a: { list: [{ x: 1 }, { x: 2 }] } };

  it("getIn reads nested values and tolerates missing keys", () => {
    expect(getIn(obj, ["a", "list", 1, "x"])).toBe(2);
    expect(getIn(obj, ["nope", "x"])).toBeUndefined();
  });

  it("setIn returns a new object without mutating the original", () => {
    const next = setIn(obj, ["a", "list", 0, "x"], 9);
    expect(next.a.list[0].x).toBe(9);
    expect(obj.a.list[0].x).toBe(1);
    expect(next.a.list[1]).toBe(obj.a.list[1]);
  });

  it("updateIn applies a function to the nested value", () => {
    const next = updateIn(obj, ["a", "list"], (l) => [...l, { x: 3 }]);
    expect(next.a.list).toHaveLength(3);
  });
});
