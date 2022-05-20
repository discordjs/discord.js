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
     * The guild this manager belongs to.
     * @type {Guild}
     */
    this.guild = guild;
  }

  /**
   * Data that can be resolved to give an AutoModRule object. This can be:
   * * An AutoModRule
   * * A Snowflake
   * @typedef {string} AutoModRuleResolvable
   */

  /**
   * Resolves an {@link AutoModRuleResolvable} to an {@link AutoModRule} object.
   * @method resolve
   * @memberof AutoModRuleManager
   * @instance
   * @param {AutoModRuleResolvable} autoModRule The AutoModRule resolvable to resolve
   * @returns {?AutoModRule}
   */

  /**
   * Resolves an {@link AutoModRuleResolvable} to a {@link AutoModRule} id.
   * @method resolveId
   * @memberof AutoModRuleManager
   * @instance
   * @param {AutoModRuleResolvable} autoModRule The AutoModRule resolvable to resolve
   * @returns {?Snowflake}
   */
}

module.exports = AutoModRuleManager;
