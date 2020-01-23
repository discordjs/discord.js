'use strict';

const DataStore = require('./DataStore');
const DataResolver = require('../util/DataResolver');
const { Events, VerificationLevels, DefaultMessageNotifications,
  ExplicitContentFilterLevels } = require('../util/Constants');
const Guild = require('../structures/Guild');
const GuildChannel = require('../structures/GuildChannel');
const GuildMember = require('../structures/GuildMember');
const Role = require('../structures/Role');

/**
 * Stores guilds.
 * @extends {DataStore}
 */
class GuildStore extends DataStore {
  constructor(client, iterable) {
    super(client, iterable, Guild);
  }

  /**
   * @typedef {string} Snowflake
   */

  /**
   * The value set for a guild's default message notifications, e.g. `ALL`. Here are the available types:
   * * ALL
   * * MENTIONS
   * @typedef {string} DefaultMessageNotifications
   */

  /**
   * The value set for the explicit content filter levels for a guild:
   * * DISABLED
   * * MEMBERS_WITHOUT_ROLES
   * * ALL_MEMBERS
   * @typedef {string} ExplicitContentFilterLevel
   */

  /**
   * The value set for the verification levels for a guild:
   * * NONE
   * * LOW
   * * MEDIUM
   * * HIGH
   * * VERY_HIGH
   * @typedef {string} VerificationLevel
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
   * @memberof GuildStore
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
   * @memberof GuildStore
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
   * @param {DefaultMessageNotifications} [options.defaultMessageNotifications] The default message notifications for the guild
   * @param {ExplicitContentFilterLevel} [options.explicitContentFilter] The explicit content filter level for the guild
   * @param {BufferResolvable|Base64Resolvable} [options.icon=null] The icon for the guild
   * @param {string} [options.region] The region for the server, defaults to the closest one available
   * @param {VerificationLevel} [options.verificationLevel] The verification level for the guild
   * @returns {Promise<Guild>} The guild that was created
   */
  create(name, { defaultMessageNotifications, explicitContentFilter, icon = null, region, verificationLevel } = {}) {
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
      return new Promise((resolve, reject) =>
        this.client.api.guilds.post({ data: {
          name,
          region,
          icon,
          verification_level: verificationLevel,
          default_message_notifications: defaultMessageNotifications,
          explicit_content_filter: explicitContentFilter,
        } })
          .then(data => {
            if (this.client.guilds.has(data.id)) return resolve(this.client.guilds.get(data.id));

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

module.exports = GuildStore;
