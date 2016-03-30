/**
* Return the value at the given key path.
* path can be either an array of keys or a string delimited by dots.
* Useful for getting values in a nested object.
* f.i: get(object, "key1.key2.name")
*/
function get (obj, path) {
  const keys = Array.isArray(path) ? path : path.split(".");

  if (obj == null) return obj;
  if (keys.length === 1) return obj[keys[0]];

  return get(obj[keys[0]], keys.slice(1));
}

/**
* Returns a new object also containing the new key, value pair.
* If an equivalent key already exists in this Map, it will be replaced.
* Nested paths, either as a dot-separated string or an array, are valid.
*/
function set (obj, path, val) {
  const [headKey, ...tailKeys] = Array.isArray(path) ? path : path.split(".");

  if (tailKeys.length === 0) return {...obj, [headKey]: val};
  if (obj[headKey] == null) throw new Error("Attempted to set a non-existant deep path.");

  return {
    ...obj,
    [headKey]: set(obj[headKey], tailKeys, val)
  };
}


/**
* Like `set`, but will recursively create objects to set a nested value.
*/
function setDeep (obj, path, val) {
  const [headKey, ...tailKeys] = Array.isArray(path) ? path : path.split(".");

  if (tailKeys.length === 0) return {...obj, [headKey]: val};

  return {
    ...obj,
    [headKey]: set((obj[headKey] == null ? {} : obj[headKey]), tailKeys, val)
  };
}

/**
* Returns a new object containing all the keys / values from the source object
* but the one specified in the `key` parameter.
*/
function without (obj, path) {
  const [headKey, ...tailKeys] = Array.isArray(path) ? path : path.split(".");

  if (obj == null) {
    return obj;
  } else if (tailKeys.length === 0) {
    const newObj = {...obj};
    delete newObj[headKey];
    return newObj;
  } else {
    return {
      ...obj,
      [headKey]: without(obj, tailKeys)
    };
  }
}

function transform (obj, path, fn) {
  const existing = get(obj, path);
  return set(obj, path, fn(existing));
}

function transformDeep (obj, path, fn) {
  const existing = get(obj, path);
  return set(obj, path, fn(existing)); 
}


function merge (obj, path, toMerge) {
  return transform(obj, path, mergeOp.bind(null, toMerge));
}

function mergeDeep (obj, path, toMerge) {
  return transformDeep(obj, path, mergeOp.bind(null, toMerge));
}

function inc (obj, path, val) {
  return transform(obj, path, incOp.bind(null, val));
}

function incDeep (obj, path, val) {
  return transformDeep(obj, path, incOp.bind(null, val));
}

function toggle (obj, path) {
  return transform(obj, path, toggleOp);
}

function toggleDeep (obj, path) {
  return transformDeep(obj, path, toggleOp);
}

function push (obj, path, val) {
  return transform(obj, path, concatOp.bind(null, val, false));
}

function pushDeep (obj, path, val) {
  return transformDeep(obj, path, concatOp.bind(null, val, false));
}

function shift (obj, path, val) {
  return transform(obj, path, concatOp.bind(null, val, true));
}

function shiftDeep (obj, path, val) {
  return transformDeep(obj, path, concatOp.bind(null, val, true));
}

module.exports = {
  get, set, setDeep, without, transform, transformDeep, merge, mergeDeep,
  inc, incDeep, toggle, toggleDeep, push, pushDeep, shift, shiftDeep
};

/***
* Operations used in regular and deep modes
*/

function mergeOp (toMerge, existing = {}) {
  return {...existing, ...toMerge};
}

function toggleOp (val) {
  return !val;
}

function incOp (amt = 1, existing) {
  if (typeof amount !== "number") {
    throw new Error(`Attempted to increment by a non-numerical value: ${amt}`);
  } else if (existing == null) {
    return amt;
  } else if (typeof existing === "number") {
    return amt + existing;
  } else {
    throw new Error(`Attempted to increment a non-numerical value: ${existing}`);
  }
}

function concatOp (values, reverse, existing) {
  values = Array.isArray(values) ? values : [values];
  if (existing == null) {
    return values;
  } else if (Array.isArray(existing)) {
    if (reverse) {
      return values.concat(existing);
    } else {
      return existing.concat(values);
    }
  } else {
    throw new Error(`Attempted to concat onto a non-array value: ${existing}`);
  }
}