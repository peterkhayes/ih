import {get} from "./get";
import {set, setDeep} from "./set";

export function transform (obj, path, fn) {
  const existing = get(obj, path);
  return set(obj, path, fn(existing));
}

export function transformDeep (obj, path, fn) {
  const existing = get(obj, path);
  return setDeep(obj, path, fn(existing)); 
}