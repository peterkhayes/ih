# ih

**Simple immutability helpers for javascript apps.**

Like using immutable data, but want to work with plain javascript objects?  Use this small set of helpers to manipulate objects in an immutable way.  Each method returns a new object, with the minimal set of changes required to complete the operation.

## API

In all methods that follow, `obj` is the object to be operated on, and `path` is either a string or an array of strings representing the path within an object to be transformed.

- `get(obj, path)` - returns the value at `path` within `obj`.
- `set(obj, path, val)` - returns a copy of `obj`, with the value at `path` set to `val`.
- `setDeep(obj, path, val)` - like `set`, but will recursively create objects to set a nested value.  
- `without(obj, path)` - returns a copy of obj, with the key at `path` removed.
- `transform(obj, path, fn)` - `get`s the value at `path`, calls `fn` on that value, and `set`s the path to the returned value.
- `transformDeep(obj, path, fn)` - like `transform`, but using `setDeep`
- `merge(obj, [path,] val)` - returns a copy of `obj` with all properties of `obj` at `path` merged with those in `val`.  Values from `val` take precedence.  If only two arguments are provided, merges `val` directly with `obj`. 
- `mergeDeep(obj, path, val)` - like `merge`, but using `setDeep`
- `inc(obj, path, val = 1)` - increments the value at `path` by `val`, or sets it to `val` if it is null.  Throws if it is a non-numerical value.
- `incDeep(obj, path, val = 1)` - like `inc`, but using `setDeep`
- `toggle(obj, path)` - applies the `not` operator to the value at `path`.
- `toggleDeep(obj, path, val = 1)` - like `toggle`, but using `setDeep`
- `push(obj, path, val)` - concats `val` to the end of the array at `path`, or sets `path` to `val` if there is nothing there.  Throws if a non-array value is there.
- `pushDeep(obj, path, val = 1)` - like `push`, but using `setDeep`
- `shift(obj, path, val)` - concats `val` to the beginning of the array at `path`, or sets `path` to `val` if there is nothing there.  Throws if a non-array value is there.
- `shiftDeep(obj, path, val = 1)` - like `shift`, but using `setDeep`