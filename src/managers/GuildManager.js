'use strict';

const BaseManager = require('./BaseManager');
const DataResolver = require('../util/DataResolver');
const { Events, VerificationLevels, DefaultMessageNotifications,
  ExplicitContentFilterLevels } = require('../util/Constants');
const Guild = require('../structures/Guild');
const GuildChannel = require('../structures/GuildChannel');
const GuildMember = require('../structures/GuildMember');
const Permissions = require('../util/Permissions');
const { resolveColor } = require('../util/Util');
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
   * @property {Collection<Snowflake, Guild>} cache
   * @memberof GuildManager
   * @instance
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
  /* eslint-disable max-len */
  /**
   * Creates a guild.
   * <warn>This is only available to bots in fewer than 10 guilds.</warn>
   * @param {string} name The name of the guild
   * @param {Object} [options] Options for the creating
   * @param {PartialChannelData[]} [options.channels] The channels for this guild
   * @param {DefaultMessageNotifications} [options.defaultMessageNotifications] The default message notifications for the guild
   * @param {ExplicitContentFilterLevel} [options.explicitContentFilter] The explicit content filter level for the guild
   * @param {BufferResolvable|Base64Resolvable} [options.icon=null] The icon for the guild
   * @param {string} [options.region] The region for the server, defaults to the closest one available
   * @param {RoleData[]} [options.roles] The roles for this guild, the first element of this array is used to change properties of the guild's everyone role.
   * @param {VerificationLevel} [options.verificationLevel] The verification level for the guild
   * @returns {Promise<Guild>} The guild that was created
   */
  create(name, { channels = [], defaultMessageNotifications, explicitContentFilter, icon = null, region, roles = [], verificationLevel } = {}) {
    if (!icon || (typeof icon === 'string' && icon.startsWith('data:'))) {
      if (typeof verificationLevel !== 'undefined' && typeof verificationLevel !== 'number') {
        verificationLevel = VerificationLevels.indexOf(verificationLevel);
      }
      if (typeof defaultMessageNotifications !== 'undefined' && typeof defaultMessageNotifications !== 'number') {
        defaultMessageNotifications = DefaultMessageNotifications.indexOf(defaultMessageNotifications);
      }
      if (typeof explicitContentFilter !== 'undefined' && typeof explicitContentFilter !== 'number') {
        explicitContentFilter = ExplicitContentFilterLevels.indexOf(explicitContentFilter);
      }
      for (const channel of channels) {
        if (!channel.permissionOverwrites) continue;
        for (const overwrite of channel.permissionOverwrites) {
          if (overwrite.allow) overwrite.allow = Permissions.resolve(overwrite.allow);
          if (overwrite.deny) overwrite.deny = Permissions.resolve(overwrite.deny);
        }
        channel.permission_overwrites = channel.permissionOverwrites;
        delete channel.permissionOverwrites;
      }
      for (const role of roles) {
        if (role.color) role.color = resolveColor(role.color);
        if (role.permissions) role.permissions = Permissions.resolve(role.permissions);
      }
      return new Promise((resolve, reject) =>
        this.client.api.guilds.post({ data: {
          name,
          region,
          icon,
          verification_level: verificationLevel,
          default_message_notifications: defaultMessageNotifications,
          explicit_content_filter: explicitContentFilter,
          channels,
          roles,
        } })
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
    /* eslint-enable max-len */

    return DataResolver.resolveImage(icon)
      .then(data => this.create(name, { region, icon: data || null }));
  }
}

module.exports = GuildManager;
