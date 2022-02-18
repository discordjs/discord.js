'use strict';

const snakeCase = require('lodash.snakecase');

class Transformers extends null {
  /**
   * Transforms camel-cased keys into snake cased keys
   * @param {*} obj The object to transform
   * @returns {*}
   */
  static toSnakeCase(obj) {
    if (typeof obj !== 'object' || !obj) return obj;
    if (Array.isArray(obj)) return obj.map(Transformers.toSnakeCase);
    return Object.fromEntries(
      Object.entries(obj).map(([key, value]) => [snakeCase(key), Transformers.toSnakeCase(value)]),
    );
  }
}

module.exports = Transformers;
