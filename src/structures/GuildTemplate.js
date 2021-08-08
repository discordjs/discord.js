'use strict';

const Base = require('./Base');
const { Events } = require('../util/Constants');
const DataResolver = require('../util/DataResolver');

/**
 * Represents the template for a guild.
 * @extends {Base}
 */
class GuildTemplate extends Base {
  /**
   * @param {Client} client The instantiating client
   * @param {APIGuildTemplate} data The raw data for the template
   */
  constructor(client, data) {
    super(client);
    this._patch(data);
  }

  /**
   * Builds or updates the template with the provided data.
   * @param {APIGuildTemplate} data The raw data for the template
   * @returns {GuildTemplate}
   * @private
   */
  _patch(data) {
    /**
     * The unique code of this template
     * @type {string}
     */
    this.code = data.code;

    /**
     * The name of this template
     * @type {string}
     */
    this.name = data.name;

    /**
     * The description of this template
     * @type {?string}
     */
    this.description = data.description;

    /**
     * The amount of times this template has been used
     * @type {number}
     */
    this.usageCount = data.usage_count;

    /**
     * The id of the user that created this template
     * @type {Snowflake}
     */
    this.creatorId = data.creator_id;

    /**
     * The user that created this template
     * @type {User}
     */
    this.creator = this.client.users._add(data.creator);

    /**
     * The time of when this template was created at
     * @type {Date}
     */
    this.createdAt = new Date(data.created_at);

    /**
     * The time of when this template was last synced to the guild
     * @type {Date}
     */
    this.updatedAt = new Date(data.updated_at);

    /**
     * The id of the guild that this template belongs to
     * @type {Snowflake}
     */
    this.guildId = data.source_guild_id;

    /**
     * The data of the guild that this template would create
     * @type {APIGuild}
     */
    this.serializedGuild = data.serialized_source_guild;

    /**
     * Whether this template has unsynced changes
     * @type {?boolean}
     */
    this.unSynced = 'is_dirty' in data ? Boolean(data.is_dirty) : null;

    return this;
  }

  /**
   * Creates a guild based from this template.
   * <warn>This is only available to bots in fewer than 10 guilds.</warn>
   * @param {string} name The name of the guild
   * @param {BufferResolvable|Base64Resolvable} [icon] The icon for the guild
   * @returns {Promise<Guild>}
   */
  async createGuild(name, icon) {
    const { client } = this;
    const data = await client.api.guilds.templates(this.code).post({
      data: {
        name,
        icon: await DataResolver.resolveImage(icon),
      },
    });

    if (client.guilds.cache.has(data.id)) return client.guilds.cache.get(data.id);

    return new Promise(resolve => {
      const resolveGuild = guild => {
        client.off(Events.GUILD_CREATE, handleGuild);
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
      client.on(Events.GUILD_CREATE, handleGuild);

      const timeout = setTimeout(() => resolveGuild(client.guilds._add(data)), 10000).unref();
    });
  }

  /**
   * Options used to edit a guild template.
   * @typedef {Object} EditGuildTemplateOptions
   * @property {string} [name] The name of this template
   * @property {string} [description] The description of this template
   */

  /**
   * Updates the metadata of this template.
   * @param {EditGuildTemplateOptions} [options] Options for editing the template
   * @returns {Promise<GuildTemplate>}
   */
  async edit({ name, description } = {}) {
    const data = await this.client.api.guilds(this.guildId).templates(this.code).patch({ data: { name, description } });
    return this._patch(data);
  }

  /**
   * Deletes this template.
   * @returns {Promise<GuildTemplate>}
   */
  async delete() {
    await this.client.api.guilds(this.guildId).templates(this.code).delete();
    return this;
  }

  /**
   * Syncs this template to the current state of the guild.
   * @returns {Promise<GuildTemplate>}
   */
  async sync() {
    const data = await this.client.api.guilds(this.guildId).templates(this.code).put();
    return this._patch(data);
  }

  /**
   * The timestamp of when this template was created at
   * @type {number}
   * @readonly
   */
  get createdTimestamp() {
    return this.createdAt.getTime();
  }

  /**
   * The timestamp of when this template was last synced to the guild
   * @type {number}
   * @readonly
   */
  get updatedTimestamp() {
    return this.updatedAt.getTime();
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
    return `${this.client.options.http.template}/${this.code}`;
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

/**
 * Regular expression that globally matches guild template links
 * @type {RegExp}
 */
GuildTemplate.GUILD_TEMPLATES_PATTERN = /discord(?:app)?\.(?:com\/template|new)\/([\w-]{2,255})/gi;

module.exports = GuildTemplate;

/* eslint-disable max-len */
/**
 * @external APIGuildTemplate
 * @see {@link https://discord.com/developers/docs/resources/guild-template#guild-template-object-guild-template-structure}
 */
