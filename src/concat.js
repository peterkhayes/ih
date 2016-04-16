import {transform, transformDeep} from "./transform";

function _concat (values, left, existing) {
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

export function concat (obj, path, val) {
  return transform(obj, path, _concat.bind(null, val, false));
}

export function concatDeep (obj, path, val) {
  return transformDeep(obj, path, _concat.bind(null, val, false));
}

export function concatLeft (obj, path, val) {
  return transform(obj, path, _concat.bind(null, val, true));
}

export function concatLeftDeep (obj, path, val) {
  return transformDeep(obj, path, _concat.bind(null, val, true));
}