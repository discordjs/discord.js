'use strict';

const snakeCase = require('lodash.snakecase');

/**
 * Transforms camel-cased keys into snake cased keys
 * @param {*} obj The object to transform
 * @returns {*}
 */
function toSnakeCase(obj) {
  if (typeof obj !== 'object' || !obj) return obj;
  if (Array.isArray(obj)) return obj.map(toSnakeCase);
  return Object.fromEntries(Object.entries(obj).map(([key, value]) => [snakeCase(key), toSnakeCase(value)]));
}

module.exports = { toSnakeCase };
