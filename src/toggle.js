import {transform, transformDeep} from "./transform";

function _toggle (val) {
  return !val;
}

export function toggle (obj, path) {
  return transform(obj, path, _toggle);
}

export function toggleDeep (obj, path) {
  return transformDeep(obj, path, _toggle);
}