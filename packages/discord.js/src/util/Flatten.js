import { Collection } from '@discordjs/collection';

const isObject = data => typeof data === 'object' && data !== null;

/**
 * Flatten an object. Any properties that are collections will get converted to an array of keys.
 *
 * @param {Object} obj The object to flatten.
 * @param {...Object<string, boolean|string>} [props] Specific properties to include/exclude.
 * @returns {Object}
 */
export function flatten(obj, ...props) {
  if (!isObject(obj)) return obj;

  const objProps = Object.keys(obj)
    .filter(key => !key.startsWith('_'))
    .map(key => ({ [key]: true }));

  const mergedProps = objProps.length ? Object.assign(...objProps, ...props) : Object.assign({}, ...props);

  const out = {};

  // eslint-disable-next-line prefer-const
  for (let [prop, newProp] of Object.entries(mergedProps)) {
    if (!newProp) continue;
    newProp = newProp === true ? prop : newProp;

    const element = obj[prop];
    const elemIsObj = isObject(element);
    const valueOf = elemIsObj && typeof element.valueOf === 'function' ? element.valueOf() : null;
    const hasToJSON = elemIsObj && typeof element.toJSON === 'function';

    // If it's a Collection, make the array of keys
    if (element instanceof Collection) out[newProp] = Array.from(element.keys());
    // If the valueOf is a Collection, use its array of keys
    else if (valueOf instanceof Collection) out[newProp] = Array.from(valueOf.keys());
    // If it's an array, call toJSON function on each element if present, otherwise flatten each element
    else if (Array.isArray(element)) out[newProp] = element.map(elm => elm.toJSON?.() ?? flatten(elm));
    // If it's an object with a primitive `valueOf`, use that value
    else if (typeof valueOf !== 'object') out[newProp] = valueOf;
    // If it's an object with a toJSON function, use the return value of it
    else if (hasToJSON) out[newProp] = element.toJSON();
    // If element is an object, use the flattened version of it
    else if (typeof element === 'object') out[newProp] = flatten(element);
    // If it's a primitive
    else if (!elemIsObj) out[newProp] = element;
  }

  return out;
}
