'use strict';

const snakeCase = require('lodash.snakecase');
const transform = require('lodash.transform');

class Transformers extends null {
  static toSnakeCase(obj = {}) {
    return transform(obj, (acc, value, key, target) => {
      const camelKey = Array.isArray(target) ? key : snakeCase(key);
      acc[camelKey] = Boolean(value) && typeof value === 'object' ? Transformers.toSnakeCase(value) : value;
    });
  }
}

module.exports = Transformers;
