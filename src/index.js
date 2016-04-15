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
  return setOp(obj, path, val, false);
}


/**
* Like `set`, but will recursively create objects to set a nested value.
*/
function setDeep (obj, path, val) {
  return setOp(obj, path, val, true);
}

/**
* Returns a new object containing all the keys / values from the source object
* but the one specified in the `key` parameter.
*/
function without (obj, path) {
  const [headKey, ...tailKeys] = Array.isArray(path) ? path : path.split(".");

  if (obj == null) {
    return obj;
  } else if (Array.isArray(obj)) {
    if (tailKeys.length === 0) {
      if (isNaN(headKey)) {
        throw new Error("Attempted to use a non-numerical value as an array key.");
      } else {
        return [...obj.slice(0, headKey), ...obj.slice(Number(headKey) + 1)];
      }
    } else {
      return [...obj.slice(0, headKey), without(obj, tailKeys), ...obj.slice(Number(headKey) + 1)];
    }
  } else {
    if (tailKeys.length === 0) {
      const newObj = {...obj};
      delete newObj[headKey];
      return newObj;
    } else {
      return { ...obj, [headKey]: without(obj[headKey], tailKeys) };
    }
  }
}

function transform (obj, path, fn) {
  const existing = get(obj, path);
  return set(obj, path, fn(existing));
}

function transformDeep (obj, path, fn) {
  const existing = get(obj, path);
  return setDeep(obj, path, fn(existing)); 
}


function merge (obj, path, toMerge) {
  if (arguments.length === 2) {
    return mergeOp(path, obj);
  } else {
    return transform(obj, path, mergeOp.bind(null, toMerge));
  }
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

function concat (obj, path, val) {
  return transform(obj, path, concatOp.bind(null, val, false));
}

function concatDeep (obj, path, val) {
  return transformDeep(obj, path, concatOp.bind(null, val, false));
}

function concatLeft (obj, path, val) {
  return transform(obj, path, concatOp.bind(null, val, true));
}

function concatLeftDeep (obj, path, val) {
  return transformDeep(obj, path, concatOp.bind(null, val, true));
}

module.exports = {
  get, set, setDeep, without, transform, transformDeep, merge, mergeDeep,
  inc, incDeep, toggle, toggleDeep, concat, concatDeep, concatLeft, concatLeftDeep
};

/***
* Operations used in regular and deep modes
*/

function setOp (obj, path, val, deep) {
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
    newVal = setOp(base, tailKeys, val, deep);
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

function mergeOp (toMerge, existing = {}) {
  const isArray = Array.isArray(toMerge);
  if (typeof toMerge !== "object") {
    throw new Error(`Can't merge a primitive: ${toMerge}`);
  } else if (typeof existing !== "object") {
    throw new Error(`Can't merge a primitive: ${existing}`);
  } else if (isArray !== Array.isArray(existing)) {
    throw new Error("Can't merge an array onto a non-array.");
  } else if (!isArray) {
    return {...existing, ...toMerge};
  } else if (toMerge.length > existing.length) {
    return toMerge;
  } else {
    return toMerge.concat(existing.slice(toMerge.length));
  }
}

function toggleOp (val) {
  return !val;
}

function incOp (amt = 1, existing) {
  if (typeof amt !== "number") {
    throw new Error(`Attempted to increment by a non-numerical value: ${amt}`);
  } else if (existing == null) {
    return amt;
  } else if (typeof existing === "number") {
    return amt + existing;
  } else {
    throw new Error(`Attempted to increment a non-numerical value: ${existing}`);
  }
}

function concatOp (values, left, existing) {
  values = Array.isArray(values) ? values : [values];
  if (existing == null) {
    return values;
  } else if (Array.isArray(existing)) {
    if (left) {
      return values.concat(existing);
    } else {
      return existing.concat(values);
    }
  } else {
    throw new Error(`Attempted to concat onto a non-array value: ${existing}`);
  }
}