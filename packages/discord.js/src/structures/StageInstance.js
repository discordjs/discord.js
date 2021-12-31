'use strict';

const process = require('node:process');
const Base = require('./Base');
const { PrivacyLevels } = require('../util/Constants');
const SnowflakeUtil = require('../util/SnowflakeUtil');

/**
 * @type {WeakSet<StageInstance>}
 * @private
 * @internal
 */
const deletedStageInstances = new WeakSet();
let deprecationEmittedForDeleted = false;

/**
 * Represents a stage instance.
 * @extends {Base}
 */
class StageInstance extends Base {
  constructor(client, data) {
    super(client);

    /**
     * The stage instance's id
     * @type {Snowflake}
     */
    this.id = data.id;

    this._patch(data);
  }

  _patch(data) {
    if ('guild_id' in data) {
      /**
       * The id of the guild associated with the stage channel
       * @type {Snowflake}
       */
      this.guildId = data.guild_id;
    }

    if ('channel_id' in data) {
      /**
       * The id of the channel associated with the stage channel
       * @type {Snowflake}
       */
      this.channelId = data.channel_id;
    }

    if ('topic' in data) {
      /**
       * The topic of the stage instance
       * @type {string}
       */
      this.topic = data.topic;
    }

    if ('privacy_level' in data) {
      /**
       * The privacy level of the stage instance
       * @type {PrivacyLevel}
       */
      this.privacyLevel = PrivacyLevels[data.privacy_level];
    }

    if ('discoverable_disabled' in data) {
      /**
       * Whether or not stage discovery is disabled
       * @type {?boolean}
       */
      this.discoverableDisabled = data.discoverable_disabled;
    } else {
      this.discoverableDisabled ??= null;
    }
  }

  /**
   * The stage channel associated with this stage instance
   * @type {?StageChannel}
   * @readonly
   */
  get channel() {
    return this.client.channels.resolve(this.channelId);
  }

  /**
   * Whether or not the stage instance has been deleted
   * @type {boolean}
   * @deprecated This will be removed in the next major version, see https://github.com/discordjs/discord.js/issues/7091
   */
  get deleted() {
    if (!deprecationEmittedForDeleted) {
      deprecationEmittedForDeleted = true;
      process.emitWarning(
        'StageInstance#deleted is deprecated, see https://github.com/discordjs/discord.js/issues/7091.',
        'DeprecationWarning',
      );
    }

    return deletedStageInstances.has(this);
  }

  set deleted(value) {
    if (!deprecationEmittedForDeleted) {
      deprecationEmittedForDeleted = true;
      process.emitWarning(
        'StageInstance#deleted is deprecated, see https://github.com/discordjs/discord.js/issues/7091.',
        'DeprecationWarning',
      );
    }

    if (value) deletedStageInstances.add(this);
    else deletedStageInstances.delete(this);
  }

  /**
   * The guild this stage instance belongs to
   * @type {?Guild}
   * @readonly
   */
  get guild() {
    return this.client.guilds.resolve(this.guildId);
  }

  /**
   * Edits this stage instance.
   * @param {StageInstanceEditOptions} options The options to edit the stage instance
   * @returns {Promise<StageInstance>}
   * @example
   * // Edit a stage instance
   * stageInstance.edit({ topic: 'new topic' })
   *  .then(stageInstance => console.log(stageInstance))
   *  .catch(console.error)
   */
  edit(options) {
    return this.guild.stageInstances.edit(this.channelId, options);
  }

  /**
   * Deletes this stage instance.
   * @returns {Promise<StageInstance>}
   * @example
   * // Delete a stage instance
   * stageInstance.delete()
   *  .then(stageInstance => console.log(stageInstance))
   *  .catch(console.error);
   */
  async delete() {
    await this.guild.stageInstances.delete(this.channelId);
    const clone = this._clone();
    deletedStageInstances.add(clone);
    return clone;
  }

  /**
   * Sets the topic of this stage instance.
   * @param {string} topic The topic for the stage instance
   * @returns {Promise<StageInstance>}
   * @example
   * // Set topic of a stage instance
   * stageInstance.setTopic('new topic')
   *  .then(stageInstance => console.log(`Set the topic to: ${stageInstance.topic}`))
   *  .catch(console.error);
   */
  setTopic(topic) {
    return this.guild.stageInstances.edit(this.channelId, { topic });
  }

  /**
   * The timestamp this stage instances was created at
   * @type {number}
   * @readonly
   */
  get createdTimestamp() {
    return SnowflakeUtil.timestampFrom(this.id);
  }

  /**
   * The time this stage instance was created at
   * @type {Date}
   * @readonly
   */
  get createdAt() {
    return new Date(this.createdTimestamp);
  }
}

exports.StageInstance = StageInstance;
exports.deletedStageInstances = deletedStageInstances;
