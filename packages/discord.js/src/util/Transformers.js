'use strict';

const snakeCase = require('lodash.snakecase');
const transform = require('lodash.transform');

class Transformers extends null {
  /**
   * Transforms camel-cased keys into snake cased keys
   * @param {*} obj The object to transform
   * @returns {*}
   */
  static toSnakeCase(obj = {}) {
    return transform(obj, (acc, value, key, target) => {
      const camelKey = Array.isArray(target) ? key : snakeCase(key);
      acc[camelKey] = value && typeof value === 'object' ? Transformers.toSnakeCase(value) : value;
    });
  }
}

module.exports = Transformers;
