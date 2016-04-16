/**
* Return the value at the given key path.
* path can be either an array of keys or a string delimited by dots.
* Useful for getting values in a nested object.
* f.i: get(object, "key1.key2.name")
*/
export function get (obj, path) {
  const keys = Array.isArray(path) ? path : path.split(".");

  if (obj == null) return obj;
  if (keys.length === 1) return obj[keys[0]];

  return get(obj[keys[0]], keys.slice(1));
}