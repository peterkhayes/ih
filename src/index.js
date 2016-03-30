/**
* Return the value at the given key path.
* path can be either an array of keys or a string delimited by dots.
* Useful for getting values in a nested object.
* f.i: get(object, "key1.key2.name")
*/
function get (obj, path) {
  const keys = Array.isArray(path) ? path : path.split(".");

  if (obj == null) return obj;

  if (keys.length === 1) {
    return obj[keys[0]];
  } else {
    return get(obj[keys[0]], keys.slice(1));
  }
}

/**
* Returns a new object also containing the new key, value pair.
* If an equivalent key already exists in this Map, it will be replaced.
* Nested paths, either as a dot-separated string or an array, are valid.
*/
function set (obj, path, val) {
  const [headKey, ...tailKeys] = Array.isArray(path) ? path : path.split(".");

  if (tailKeys.length === 0) {
    return {
      ...obj,
      [headKey]: val
    };
  } else if (obj[headKey]) {
    return {
      ...obj,
      [headKey]: set(obj[headKey], tailKeys, val)
    };
  } else {
    throw new Error("Attempted to set a non-existant deep path.");
  }
}


/**
* Like `set`, but will recursively create objects to set a nested value.
*/
function setDeep (obj, path, val) {
  const [headKey, ...tailKeys] = Array.isArray(path) ? path : path.split(".");

  if (tailKeys.length === 0) {
    return {
      ...obj,
      [headKey]: val
    };
  } else if (obj[headKey]) {
    return {
      ...obj,
      [headKey]: setDeep(obj[headKey], tailKeys, val)
    };
  } else {
    return {
      ...obj,
      [headKey]: setDeep({}, tailKeys, val)
    };
  }
}

/**
* Returns a new object resulting from merging the source object the new one.
* The path allows you to specify at which level to perform the merge, or if you
* send the object to merge instead of a path then it will be used to be merged
* on the root level of the source object. This will perform a deep merge but won't
* affect those siblings or keys that already existed in the source object, will
* only override existing keys with the values from the new object.
*
*/
function merge (obj, path, object) {
  if (isObject(path)) {
    return {...obj, ...path};
  } else {
    const toMerge = buildNestedObject({}, path, object);
    return {...obj, ...toMerge};
  }
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
  get, set, setDeep, merge, without, transform, transformDeep,
  inc, incDeep, toggle, toggleDeep, push, pushDeep, shift, shiftDeep
};

/***
* Utility functions
*/

/**
* Private: Take a key patch such as "student.teacher.name" and a value to build
* the nested structure with that value assigned. Also expects an initial object
* to use for building the structure.
* f.i:
*   buildNestedObject({}, "student.teacher.name", "john") => {student: {teacher: {name: "john"}}}
*/
function buildNestedObject (obj, path, value) {
  const keys = Array.isArray(path) ? path : path.split(".");

  if (keys.length === 1) {
    obj[keys[0]] = value;
  } else {
    const key = keys.shift();
    obj[key] = buildNestedObject(typeof obj[key] === "undefined" ? {} : obj[key], keys, value);
  }

  return obj;
}

function isObject (obj) {
  const type = typeof obj;
  return type === 'function' || type === 'object' && !!obj;
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