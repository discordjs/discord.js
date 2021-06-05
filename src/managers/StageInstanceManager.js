'use strict';

const BaseManager = require('./BaseManager');
const StageInstance = require('../structures/StageInstance');

class StageInstanceManager extends BaseManager {
  constructor(guild, iterable) {
    super(guild.client, iterable, StageInstance);
  }
}

module.exports = StageInstanceManager;
