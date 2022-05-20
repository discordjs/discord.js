'use strict';

const CachedManager = require('./CachedManager');
const AutoModRule = require('../structures/AutoModRule');

/**
 * Manages API methods for {@link AutoModRule}s and stores their cache.
 * @extends {CachedManager}
 */
class AutoModRuleManager extends CachedManager {
  constructor(guild, iterable) {
    super(guild.client, AutoModRule, iterable);

    /**
     * The guild this manager belongs to
     * @type {Guild}
     */
    this.guild = guild;
  }
}

module.exports = AutoModRuleManager;
