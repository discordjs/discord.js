'use strict';

const BaseManager = require('./BaseManager');
const StageInstance = require('../structures/StageInstance');

class StageInstanceManager extends BaseManager {
  constructor(client, iterable) {
    super(client, iterable, StageInstance);
  }
}

module.exports = StageInstanceManager;
