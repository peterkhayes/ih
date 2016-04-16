[![Build Status](https://travis-ci.org/peterkhayes/ih.svg?branch=master)](https://travis-ci.org/peterkhayes/ih) [![Coverage Status](https://coveralls.io/repos/github/peterkhayes/ih/badge.svg?branch=master)](https://coveralls.io/github/peterkhayes/ih?branch=master)  
# ih
Simple immutability helpers for javascript apps.

## Purpose
Like using immutable data, but want to work with plain javascript objects?  Use this small set of helpers to manipulate objects in an immutable way. Each method returns a new object, with the minimal set of changes required to complete the operation.

`ih` is well-tested, 1kb when minified and gzipped, and has no dependencies.  It's based on tools we've built for our React/Redux frontend app at ClassDojo.

## Usage
```js
const ih = require("ih");

const obj = {
  a: {
    b: {
      c: 4
    }
  },
  arr: [
    {id: 1},
    {id: 2}
  ]
};

const get1 = ih.get(obj, "a.b.c") // => 4
const get2 = ih.get(obj, "a.b") // => {c: 4}

const set1 = ih.set(obj, "a", 3) // => new obj with a = 3.
const set2 = ih.set(obj, "a.b.c", 5) // => new obj with a.b.c = 5.  obj.a and obj.a.b are both new objects.
const set3 = ih.set(obj, "arr.0", {id: 3}) // => new obj with arr[0] = {id: 3}.  arr is a new array, second item is not.
const set4 = ih.set(obj, "a.e.f", 4) // throws - use setDeep for this.
const set4 = ih.setDeep(obj, "a.e.f", 4) // => new obj with a and a.e both objects, and a.e.f == 4.

const transformed = ih.transform(obj, "a.b.c", (x) => x - 1) // => new obj with a.b.c = 3.
const concatted = ih.concat(obj, "arr", [{id: 3}]) // => new obj with a new array with an extra item at arr.
const merged = ih.merge(obj, "a.b", {d: 3, e: 4}) // => new obj with a.b now having 3 keys.
```

## How it works
Under the hood, `ih` is essentially a wrapper around Object.assign, making usage of this funcationality much more readable. For example,  
```
  ih.set(obj, "a.b.c", 3)
```
desugars to  
```
  Object.assign({}, obj, {
    a: Object.assign({}, obj.a, {
      b: Object.assign({}, obj.b, {
        c: 3
      });
    });
  });
```
or, with ES7 spread syntax  
```
  {
    ...obj,
    a: {
      ...obj.a,
      b: {
        ...obj.b,
        c: 3
      }
    }
  }
```

## API

In all methods that follow, `obj` is the object to be operated on, and `path` is either a string or an array of strings representing the path within an object to be transformed.

#### Basic
- `get(obj, path)` - returns the value at `path` within `obj`.
- `set(obj, path, val)` - returns a copy of `obj`, with the value at `path` set to `val`.
- `setDeep(obj, path, val)` - like `set`, but will recursively create objects to set a nested value.  
- `without(obj, path)` - returns a copy of obj, with the key at `path` removed.

#### Transformations
- `transform(obj, path, fn)` - `get`s the value at `path`, calls `fn` on that value, and `set`s the path to the returned value.
- `transformDeep(obj, path, fn)` - like `transform`, but using `setDeep`.
- `merge(obj, [path,] val)` - merges all properties of item at `path` with those in `val`.  Values from `val` take precedence.  If only two arguments are provided, merges `val` directly with `obj`. 
- `mergeDeep(obj, path, val)` - like `merge`, but using `setDeep`.
- `inc(obj, path, val = 1)` - increments the value at `path` by `val`, or sets it to `val` if it is null.  Throws if it is a non-numerical value.
- `incDeep(obj, path, val = 1)` - like `inc`, but using `setDeep`.
- `toggle(obj, path)` - applies the `not` operator to the value at `path`.
- `toggleDeep(obj, path, val = 1)` - like `toggle`, but using `setDeep`.

#### Array operations
- `concat(obj, path, val)` - concats `val` to the end of the array at `path`, or sets `path` to `val` if there is nothing there.  Throws if a non-array value is there.
- `concatDeep(obj, path, val = 1)` - like `concat`, but using `setDeep`.
- `concatLeft(obj, path, val)` - concats `val` to the beginning of the array at `path`, or sets `path` to `val` if there is nothing there.  Throws if a non-array value is there.
- `concatLeftDeep(obj, path, val = 1)` - like `concatLeft`, but using `setDeep`.