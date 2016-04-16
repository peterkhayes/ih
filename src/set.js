function _set (obj, path, val, deep) {
  const [headKey, ...tailKeys] = Array.isArray(path) ? path : path.split(".");

  let newVal;
  if (tailKeys.length === 0) {
    newVal = val;
  } else {
    let base = obj[headKey];
    if (base == null) {
      if (!deep) {
        throw new Error("Attempted to set a non-existant deep path.");
      } else if (isNaN(tailKeys[0])) {
        base = {};
      } else {
        base = [];
      }
    }
    newVal = _set(base, tailKeys, val, deep);
  }

  if (!Array.isArray(obj)) {
    return { ...obj, [headKey]: newVal };
  }

  if (isNaN(headKey)) {
    throw new Error("Attempted to use a non-numerical value as an array key.");
  } else if (headKey > obj.length) {
    const copy = [...obj];
    while (headKey > copy.length) copy.push(undefined);
    copy.push(val);
    return copy;
  } else {
    return [...obj.slice(0, headKey), newVal, ...obj.slice(Number(headKey) + 1)];
  }
}

/**
* Returns a new object also containing the new key, value pair.
* If an equivalent key already exists in this Map, it will be replaced.
* Nested paths, either as a dot-separated string or an array, are valid.
*/
export function set (obj, path, val) {
  return _set(obj, path, val, false);
}


/**
* Like `set`, but will recursively create objects to set a nested value.
*/
export function setDeep (obj, path, val) {
  return _set(obj, path, val, true);
}