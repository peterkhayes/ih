const ih = require("../src");
const clone = require("clone");
const expect = require("expect");

const obj = {
  a: 1,
  b: 2,
  c: {
    d: 3,
    e: {
      f: 4,
      g: 5
    }
  },
  arr: [
    {foo: 1},
    {foo: 2},
    {bar: 3},
  ]
};

describe("ih", () => {

  let copy, mutabilityTestCopy;
  beforeEach(() => {
    copy = clone(obj);
    mutabilityTestCopy = clone(obj);
  });

  afterEach(() => {
    try {
      expect(obj).toEqual(mutabilityTestCopy);
    } catch (ex) {
      ex.message = `Object was modified - ${ex.message}`;
      throw ex;
    }
  });

  describe("get", () => {

    it("gets a key from a root-level path", () => {
      expect(ih.get(obj, "a")).toBe(1);
    });

    it("gets a key from a path nested one level", () => {
      expect(ih.get(obj, "c.d")).toBe(3);
    });

    it("gets a key from a path nested two levels", () => {
      expect(ih.get(obj, "c.e.g")).toBe(5);
    });

    it("gets a key from an array path", () => {
      expect(ih.get(obj, "arr.0.foo")).toBe(1);
    });

    it("gets a missing key at the root level", () => {
      expect(ih.get(obj, "z")).toBe(undefined);
    });

    it("gets a missing key at a nested level", () => {
      expect(ih.get(obj, "c.e.z")).toBe(undefined);
    });

    it("gets a missing key with many missing levels", () => {
      expect(ih.get(obj, "z.y.x")).toBe(undefined);
    });

    it("gets a missing key from an array", () => {
      expect(ih.get(obj, "foo.4.bar")).toBe(undefined);
    });

  });

  describe("set", () => {

    const val = {foo: "bar"};

    it("sets a primitive key to a root-level path", () => {
      copy.z = val;
      expect(ih.set(obj, "z", val)).toEqual(copy);
    });

    it("overwrites a primitive key to a root-level path", () => {
      copy.a = val;
      expect(ih.set(obj, "a", val)).toEqual(copy);
    });

    it("sets a key to a path nested one level", () => {
      copy.c.z = val;
      expect(ih.set(obj, "c.z", val)).toEqual(copy);
    });

    it("overwrites a key to a path nested one level", () => {
      copy.c.d = val;
      expect(ih.set(obj, "c.d", val)).toEqual(copy);
    });

    it("sets a key within an array", () => {
      copy.arr.push(undefined, val);
      expect(ih.set(obj, "arr.4", val)).toEqual(copy);
    });

    it("overwrites a key within an array", () => {
      copy.arr[1] = val;
      expect(ih.set(obj, "arr.1", val)).toEqual(copy);
    });

    it("sets a key to a path nested two levels", () => {
      copy.c.e.z = val;
      expect(ih.set(obj, "c.e.z", val)).toEqual(copy);
    });

    it("overwrites a key to a path nested two levels", () => {
      copy.c.e.g = val;
      expect(ih.set(obj, "c.e.g", val)).toEqual(copy);
    });

    it("throws if trying to set to a root-level deep path that doesn't exist", () => {
      expect(() => ih.set(obj, "z.y.x", val)).toThrow();
    });

    it("throws if trying to set to a nested deep path that doesn't exist", () => {
      expect(() => ih.set(obj, "c.a.z", val)).toThrow();
    });

  });

  describe("setDeep", () => {

    const val = {foo: "bar"};

    it("sets a primitive key to a root-level path", () => {
      copy.z = val;
      expect(ih.setDeep(obj, "z", val)).toEqual(copy);
    });

    it("overwrites a primitive key to a root-level path", () => {
      copy.a = val;
      expect(ih.setDeep(obj, "a", val)).toEqual(copy);
    });

    it("sets a key to a path nested one level", () => {
      copy.c.z = val;
      expect(ih.setDeep(obj, "c.z", val)).toEqual(copy);
    });

    it("overwrites a key to a path nested one level", () => {
      copy.c.d = val;
      expect(ih.setDeep(obj, "c.d", val)).toEqual(copy);
    });

    it("sets a key within an array", () => {
      copy.arr.push(undefined, val);
      expect(ih.setDeep(obj, "arr.4", val)).toEqual(copy);
    });

    it("overwrites a key within an array", () => {
      copy.arr[1] = val;
      expect(ih.setDeep(obj, "arr.1", val)).toEqual(copy);
    });

    it("sets a key to a path nested two levels", () => {
      copy.c.e.z = val;
      expect(ih.setDeep(obj, "c.e.z", val)).toEqual(copy);
    });

    it("overwrites a key to a path nested two levels", () => {
      copy.c.e.g = val;
      expect(ih.setDeep(obj, "c.e.g", val)).toEqual(copy);
    });

    it("sets a root-level deep path that doesn't exist", () => {
      copy.z = {y: {x: val}};
      expect(ih.setDeep(obj, "z.y.x", val)).toEqual(copy);
    });

    it("sets a nested deep path that doesn't exist", () => {
      copy.c.a = {z: val};
      expect(ih.setDeep(obj, "c.a.z", val)).toEqual(copy);
    });

    it("sets a nested deep array path that doesn't exist", () => {
      copy.c.a = [undefined, val];
      expect(ih.setDeep(obj, "c.a.1", val)).toEqual(copy);
    });

  });

  describe("without", () => {

    it("removes a root-level value", () => {
      delete copy.a;
      expect(ih.without(obj, "a")).toEqual(copy);
    });

    it("removes a nested value", () => {
      delete copy.c.e;
      expect(ih.without(obj, "c.e")).toEqual(copy);
    });

    it("removes an array value", () => {
      copy.arr.splice(1, 1);
      expect(ih.without(obj, "arr.1")).toEqual(copy);
    });

    it("does nothing for non-existant values", () => {
      expect(ih.without(obj, "c.e.d")).toEqual(copy);
    });

  });

  describe("merge", () => {

    it("merges two objects at the given path", () => {
      copy.c.e = 5;
      copy.c.f = 6;
      expect(ih.merge(obj, "c", {e: 5, f: 6})).toEqual(copy);
    });
    
    it("merges a shorter array at the given path", () => {
      copy.arr[0] = 5;
      expect(ih.merge(obj, "arr", [5])).toEqual(copy);
    });

    it("merges a longer array at the given path", () => {
      copy.arr = [1, 2, 3, 4, 5];
      expect(ih.merge(obj, "arr", [1, 2, 3, 4, 5])).toEqual(copy);
    });

    it("merges two objects at the root", () => {
      copy.a = 2;
      copy.b = 3;
      expect(ih.merge(obj, {a: 2, b: 3})).toEqual(copy);
    });

    it("merges a shorter array at the root", () => {
      copy.arr[0] = 5;
      expect(ih.merge(obj.arr, [5])).toEqual(copy.arr);
    });

    it("merges a longer array at the root", () => {
      copy.arr = [1, 2, 3, 4, 5];
      expect(ih.merge(obj.arr, [1, 2, 3, 4, 5])).toEqual(copy.arr);
    });

    it("throws if an array is merged with an object", () => {
      expect(() => ih.merge(obj, "arr", {})).toThrow();
    });

    it("throws if an object is merged with an array", () => {
      expect(() => ih.merge(obj, "c", [])).toThrow();
    });

    it("throws if a primitive is merged with an object", () => {
      expect(() => ih.merge(obj, "a", {})).toThrow();
    });

    it("throws if an object is merged with a primitive", () => {
      expect(() => ih.merge(obj, "c", 1)).toThrow();
    });

  });

  describe("inc", () => {

    it("increments a value by provided amount", () => {
      copy.c.d -= 5;
      expect(ih.inc(obj, "c.d", -5)).toEqual(copy);
    });
    
    it("increments a value by 1 if no amount is provided", () => {
      copy.c.e.f += 1;
      expect(ih.inc(obj, "c.e.f")).toEqual(copy);
    });

    it("sets a non-existant value", () => {
      copy.c.e.h = 2;
      expect(ih.inc(obj, "c.e.h", 2)).toEqual(copy);
    });

  });

});