'use strict';

const { setTimeout, clearTimeout } = require('node:timers');
const { RouteBases, Routes } = require('discord-api-types/v10');
const Base = require('./Base');
const { resolveImage } = require('../util/DataResolver');
const Events = require('../util/Events');

/**
 * Represents the template for a guild.
 * @extends {Base}
 */
class GuildTemplate extends Base {
  /**
   * A regular expression that matches guild template links.
   * The `code` group property is present on the `exec()` result of this expression.
   * @type {RegExp}
   * @memberof GuildTemplate
   */
  static GuildTemplatesPattern = /discord(?:app)?\.(?:com\/template|new)\/(?<code>[\w-]{2,255})/i;

  constructor(client, data) {
    super(client);
    this._patch(data);
  }

  _patch(data) {
    if ('code' in data) {
      /**
       * The unique code of this template
       * @type {string}
       */
      this.code = data.code;
    }

    if ('name' in data) {
      /**
       * The name of this template
       * @type {string}
       */
      this.name = data.name;
    }

    if ('description' in data) {
      /**
       * The description of this template
       * @type {?string}
       */
      this.description = data.description;
    }

    if ('usage_count' in data) {
      /**
       * The amount of times this template has been used
       * @type {number}
       */
      this.usageCount = data.usage_count;
    }

    if ('creator_id' in data) {
      /**
       * The id of the user that created this template
       * @type {Snowflake}
       */
      this.creatorId = data.creator_id;
    }

    if ('creator' in data) {
      /**
       * The user that created this template
       * @type {User}
       */
      this.creator = this.client.users._add(data.creator);
    }

    if ('created_at' in data) {
      /**
       * The timestamp of when this template was created at
       * @type {number}
       */
      this.createdTimestamp = Date.parse(data.created_at);
    }

    if ('updated_at' in data) {
      /**
       * The timestamp of when this template was last synced to the guild
       * @type {number}
       */
      this.updatedTimestamp = Date.parse(data.updated_at);
    }

    if ('source_guild_id' in data) {
      /**
       * The id of the guild that this template belongs to
       * @type {Snowflake}
       */
      this.guildId = data.source_guild_id;
    }

    if ('serialized_source_guild' in data) {
      /**
       * The data of the guild that this template would create
       * @type {APIGuild}
       */
      this.serializedGuild = data.serialized_source_guild;
    }

    /**
     * Whether this template has unsynced changes
     * @type {?boolean}
     */
    this.unSynced = 'is_dirty' in data ? Boolean(data.is_dirty) : null;

    return this;
  }

  /**
   * Creates a guild based on this template.
   * <warn>This is only available to bots in fewer than 10 guilds.</warn>
   * @param {string} name The name of the guild
   * @param {BufferResolvable|Base64Resolvable} [icon] The icon for the guild
   * @returns {Promise<Guild>}
   */
  async createGuild(name, icon) {
    const { client } = this;
    const data = await client.rest.post(Routes.template(this.code), {
      body: {
        name,
        icon: await resolveImage(icon),
      },
    });

    if (client.guilds.cache.has(data.id)) return client.guilds.cache.get(data.id);

    return new Promise(resolve => {
      const resolveGuild = guild => {
        client.off(Events.GuildCreate, handleGuild);
        client.decrementMaxListeners();
        resolve(guild);
      };

      const handleGuild = guild => {
        if (guild.id === data.id) {
          clearTimeout(timeout);
          resolveGuild(guild);
        }
      };

      client.incrementMaxListeners();
      client.on(Events.GuildCreate, handleGuild);

      const timeout = setTimeout(() => resolveGuild(client.guilds._add(data)), 10_000).unref();
    });
  }

  /**
   * Options used to edit a guild template.
   * @typedef {Object} GuildTemplateEditOptions
   * @property {string} [name] The name of this template
   * @property {string} [description] The description of this template
   */

  /**
   * Updates the metadata of this template.
   * @param {GuildTemplateEditOptions} [options] Options for editing the template
   * @returns {Promise<GuildTemplate>}
   */
  async edit({ name, description } = {}) {
    const data = await this.client.rest.patch(Routes.guildTemplate(this.guildId, this.code), {
      body: { name, description },
    });
    return this._patch(data);
  }

  /**
   * Deletes this template.
   * @returns {Promise<GuildTemplate>}
   */
  async delete() {
    await this.client.rest.delete(Routes.guildTemplate(this.guildId, this.code));
    return this;
  }

  /**
   * Syncs this template to the current state of the guild.
   * @returns {Promise<GuildTemplate>}
   */
  async sync() {
    const data = await this.client.rest.put(Routes.guildTemplate(this.guildId, this.code));
    return this._patch(data);
  }

  /**
   * The time when this template was created at
   * @type {Date}
   * @readonly
   */
  get createdAt() {
    return new Date(this.createdTimestamp);
  }

  /**
   * The time when this template was last synced to the guild
   * @type {Date}
   * @readonly
   */
  get updatedAt() {
    return new Date(this.updatedTimestamp);
  }

  /**
   * The guild that this template belongs to
   * @type {?Guild}
   * @readonly
   */
  get guild() {
    return this.client.guilds.resolve(this.guildId);
  }

  /**
   * The URL of this template
   * @type {string}
   * @readonly
   */
  get url() {
    return `${RouteBases.template}/${this.code}`;
  }

  /**
   * When concatenated with a string, this automatically returns the template's code instead of the template object.
   * @returns {string}
   * @example
   * // Logs: Template: FKvmczH2HyUf
   * console.log(`Template: ${guildTemplate}!`);
   */
  toString() {
    return this.code;
  }
}

module.exports = GuildTemplate;
