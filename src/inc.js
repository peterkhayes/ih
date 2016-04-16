import {transform, transformDeep} from "./transform";

function _inc (amt = 1, existing) {
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

export function inc (obj, path, val) {
  return transform(obj, path, _inc.bind(null, val));
}

export function incDeep (obj, path, val) {
  return transformDeep(obj, path, _inc.bind(null, val));
}