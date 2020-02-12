'use strict';

const BaseManager = require('./BaseManager');
const DataResolver = require('../util/DataResolver');
const { Events } = require('../util/Constants');
const Guild = require('../structures/Guild');
const GuildChannel = require('../structures/GuildChannel');
const GuildMember = require('../structures/GuildMember');
const Role = require('../structures/Role');

/**
 * Manages API methods for Guilds and stores their cache.
 * @extends {BaseManager}
 */
class GuildManager extends BaseManager {
  constructor(client, iterable) {
    super(client, iterable, Guild);
  }

  /**
   * The cache of this Manager
   * @type {Collection<Snowflake, Guild>}
   * @name GuildManager#cache
   */

  /**
   * Data that resolves to give a Guild object. This can be:
   * * A Guild object
   * * A GuildChannel object
   * * A Role object
   * * A Snowflake
   * @typedef {Guild|GuildChannel|GuildMember|Role|Snowflake} GuildResolvable
   */

  /**
   * Resolves a GuildResolvable to a Guild object.
   * @method resolve
   * @memberof GuildManager
   * @instance
   * @param {GuildResolvable} guild The guild resolvable to identify
   * @returns {?Guild}
   */
  resolve(guild) {
    if (guild instanceof GuildChannel ||
      guild instanceof GuildMember ||
      guild instanceof Role) return super.resolve(guild.guild);
    return super.resolve(guild);
  }

  /**
   * Resolves a GuildResolvable to a Guild ID string.
   * @method resolveID
   * @memberof GuildManager
   * @instance
   * @param {GuildResolvable} guild The guild resolvable to identify
   * @returns {?Snowflake}
   */
  resolveID(guild) {
    if (guild instanceof GuildChannel ||
      guild instanceof GuildMember ||
      guild instanceof Role) return super.resolveID(guild.guild.id);
    return super.resolveID(guild);
  }

  /**
   * Creates a guild.
   * <warn>This is only available to bots in fewer than 10 guilds.</warn>
   * @param {string} name The name of the guild
   * @param {Object} [options] Options for the creating
   * @param {string} [options.region] The region for the server, defaults to the closest one available
   * @param {BufferResolvable|Base64Resolvable} [options.icon=null] The icon for the guild
   * @returns {Promise<Guild>} The guild that was created
   */
  create(name, { region, icon = null } = {}) {
    if (!icon || (typeof icon === 'string' && icon.startsWith('data:'))) {
      return new Promise((resolve, reject) =>
        this.client.api.guilds.post({ data: { name, region, icon } })
          .then(data => {
            if (this.client.guilds.cache.has(data.id)) return resolve(this.client.guilds.cache.get(data.id));

            const handleGuild = guild => {
              if (guild.id === data.id) {
                this.client.removeListener(Events.GUILD_CREATE, handleGuild);
                this.client.clearTimeout(timeout);
                resolve(guild);
              }
            };
            this.client.on(Events.GUILD_CREATE, handleGuild);

            const timeout = this.client.setTimeout(() => {
              this.client.removeListener(Events.GUILD_CREATE, handleGuild);
              resolve(this.client.guilds.add(data));
            }, 10000);
            return undefined;
          }, reject)
      );
    }

    return DataResolver.resolveImage(icon)
      .then(data => this.create(name, { region, icon: data || null }));
  }
}

module.exports = GuildManager;
