'use strict';

const snakeCase = require('lodash.snakecase');

class Transformers extends null {
  /**
   * Transforms camel-cased keys into snake cased keys
   * @param {*} obj The object to transform
   * @returns {*}
   */
  static toSnakeCase(obj = {}) {
    if (typeof obj !== 'object' || !obj) return obj;
    if (Array.isArray(obj)) return obj.map(Transformers.toSnakeCase);

    const target = {};
    for (const [key, value] of Object.entries(obj)) {
      target[snakeCase(key)] = Transformers.toSnakeCase(value);
    }
    return target;
  }
}

module.exports = Transformers;
