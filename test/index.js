const ih = require("../lib");
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

    it("sets a primative key to a root-level path", () => {
      copy.z = val;
      expect(ih.set(obj, "z", val)).toEqual(copy);
    });

    it("overwrites a primative key to a root-level path", () => {
      copy.a = val;
      expect(ih.set(obj, "a", val)).toEqual(copy);
    });

    it("sets a key to a path nested one level", () => {
      copy.c.z = val;
      expect(ih.set(copy, "c.z", val)).toEqual(copy);
    });

    it("overwrites a key to a path nested one level", () => {
      copy.c.d = val;
      expect(ih.set(copy, "c.d", val)).toEqual(copy);
    });

    it("sets a key to a path nested two levels", () => {
      copy.c.e.z = val;
      expect(ih.set(copy, "c.e.z", val)).toEqual(copy);
    });

    it("overwrites a key to a path nested two levels", () => {
      copy.c.e.g = val;
      expect(ih.set(copy, "c.e.g", val)).toEqual(copy);
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

    it("sets a primative key to a root-level path", () => {
      copy.z = val;
      expect(ih.setDeep(obj, "z", val)).toEqual(copy);
    });

    it("overwrites a primative key to a root-level path", () => {
      copy.a = val;
      expect(ih.setDeep(obj, "a", val)).toEqual(copy);
    });

    it("sets a key to a path nested one level", () => {
      copy.c.z = val;
      expect(ih.setDeep(copy, "c.z", val)).toEqual(copy);
    });

    it("overwrites a key to a path nested one level", () => {
      copy.c.d = val;
      expect(ih.setDeep(copy, "c.d", val)).toEqual(copy);
    });

    it("sets a key to a path nested two levels", () => {
      copy.c.e.z = val;
      expect(ih.setDeep(copy, "c.e.z", val)).toEqual(copy);
    });

    it("overwrites a key to a path nested two levels", () => {
      copy.c.e.g = val;
      expect(ih.setDeep(copy, "c.e.g", val)).toEqual(copy);
    });

    it("sets a root-level deep path that doesn't exist", () => {
      copy.z = {y: {x: val}};
      expect(ih.setDeep(obj, "z.y.x", val)).toEqual(copy);
    });

    it("sets a nested deep path that doesn't exist", () => {
      copy.c.a = {z: val};
      expect(ih.setDeep(obj, "c.a.z", val)).toEqual(copy);
    });

  });

  // describe("inc", () => {

  //   it("increments a value by provided amount", () => {
  //     copy.c.d += 5;
  //     expect(ih.inc(obj, "c.d", 5)).toEqual(copy);
  //   });
    
  //   it("increments a value by 1 if no amount is provided", () => {
  //     copy.c.e.f += 1;
  //     expect(ih.inc(obj, "c.e.f")).toEqual(copy);
  //   });

  //   it("sets a non-existant value", () => {
  //     copy.c.e.
  //   });


  // });

});