import {transform, transformDeep} from "./transform";

function _merge (toMerge, existing = {}) {
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

export function merge (obj, path, toMerge) {
  if (arguments.length === 2) {
    return _merge(path, obj);
  } else {
    return transform(obj, path, _merge.bind(null, toMerge));
  }
}

export function mergeDeep (obj, path, toMerge) {
  if (arguments.length === 2) {
    return _merge(path, obj);
  } else {
    return transformDeep(obj, path, _merge.bind(null, toMerge));
  }
}
