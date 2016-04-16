/**
* Returns a new object containing all the keys / values from the source object
* but the one specified in the `key` parameter.
*/
export function without (obj, path) {
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