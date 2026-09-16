/**
 * Reads a nested value. Path segments are object keys or array indices.
 * @param {object} obj
 * @param {(string|number)[]} path
 * @returns {*}
 */
export function getIn(obj, path) {
  return path.reduce((acc, key) => (acc == null ? undefined : acc[key]), obj);
}

/**
 * Immutably sets a nested value, cloning each container along the path.
 * @param {object} obj
 * @param {(string|number)[]} path
 * @param {*} value
 * @returns {object}
 */
export function setIn(obj, path, value) {
  if (path.length === 0) return value;
  const [key, ...rest] = path;
  const copy = Array.isArray(obj) ? [...obj] : { ...obj };
  copy[key] = setIn(obj == null ? undefined : obj[key], rest, value);
  return copy;
}

/**
 * Immutably updates a nested value with a function.
 * @param {object} obj
 * @param {(string|number)[]} path
 * @param {(current: *) => *} fn
 * @returns {object}
 */
export function updateIn(obj, path, fn) {
  return setIn(obj, path, fn(getIn(obj, path)));
}
