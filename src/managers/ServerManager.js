'use strict';

const BaseManager = require('./BaseManager');
const Invite = require('../structures/Invite');
const Role = require('../structures/Role');
const Server = require('../structures/Server');
const ServerChannel = require('../structures/ServerChannel');
const ServerEmoji = require('../structures/ServerEmoji');
const ServerMember = require('../structures/ServerMember');
const {
  ChannelTypes,
  Events,
  VerificationLevels,
  DefaultMessageNotifications,
  ExplicitContentFilterLevels,
} = require('../util/Constants');
const DataResolver = require('../util/DataResolver');
const Permissions = require('../util/Permissions');
const { resolveColor } = require('../util/Util');

/**
 * Manages API methods for Servers and stores their cache.
 * @extends {BaseManager}
 */
class ServerManager extends BaseManager {
  constructor(client, iterable) {
    super(client, iterable, Server);
  }

  /**
   * The cache of this Manager
   * @type {Collection<Snowflake, Server>}
   * @name ServerManager#cache
   */

  /**
   * Data that resolves to give a Server object. This can be:
   * * A Server object
   * * A ServerChannel object
   * * A ServerEmoji object
   * * A Role object
   * * A Snowflake
   * * An Invite object
   * @typedef {Server|ServerChannel|ServerMember|ServerEmoji|Role|Snowflake|Invite} ServerResolvable
   */

  /**
   * Partial data for a Role.
   * @typedef {Object} PartialRoleData
   * @property {number} [id] The ID for this role, used to set channel overrides,
   * this is a placeholder and will be replaced by the API after consumption
   * @property {string} [name] The name of the role
   * @property {ColorResolvable} [color] The color of the role, either a hex string or a base 10 number
   * @property {boolean} [hoist] Whether or not the role should be hoisted
   * @property {number} [position] The position of the role
   * @property {PermissionResolvable|number} [permissions] The permissions of the role
   * @property {boolean} [mentionable] Whether or not the role should be mentionable
   */

  /**
   * Partial overwrite data.
   * @typedef {Object} PartialOverwriteData
   * @property {number|Snowflake} id The Role or User ID for this overwrite
   * @property {string} [type] The type of this overwrite
   * @property {PermissionResolvable} [allow] The permissions to allow
   * @property {PermissionResolvable} [deny] The permissions to deny
   */

  /**
   * Partial data for a Channel.
   * @typedef {Object} PartialChannelData
   * @property {number} [id] The ID for this channel, used to set its parent,
   * this is a placeholder and will be replaced by the API after consumption
   * @property {number} [parentID] The parent ID for this channel
   * @property {string} [type] The type of the channel
   * @property {string} name The name of the channel
   * @property {string} [topic] The topic of the text channel
   * @property {boolean} [nsfw] Whether the channel is NSFW
   * @property {number} [bitrate] The bitrate of the voice channel
   * @property {number} [userLimit] The user limit of the channel
   * @property {PartialOverwriteData} [permissionOverwrites]
   * Overwrites of the channel
   * @property {number} [rateLimitPerUser] The rate limit per user of the channel in seconds
   */

  /**
   * Resolves a ServerResolvable to a Server object.
   * @method resolve
   * @memberof ServerManager
   * @instance
   * @param {ServerResolvable} server The server resolvable to identify
   * @returns {?Server}
   */
  resolve(server) {
    if (
      server instanceof ServerChannel ||
      server instanceof ServerMember ||
      server instanceof ServerEmoji ||
      server instanceof Role ||
      (server instanceof Invite && server.server)
    ) {
      return super.resolve(server.server);
    }
    return super.resolve(server);
  }

  /**
   * Resolves a ServerResolvable to a Server ID string.
   * @method resolveID
   * @memberof ServerManager
   * @instance
   * @param {ServerResolvable} server The server resolvable to identify
   * @returns {?Snowflake}
   */
  resolveID(server) {
    if (
      server instanceof ServerChannel ||
      server instanceof ServerMember ||
      server instanceof ServerEmoji ||
      server instanceof Role ||
      (server instanceof Invite && server.server)
    ) {
      return super.resolveID(server.server.id);
    }
    return super.resolveID(server);
  }

  /**
   * Creates a server.
   * <warn>This is only available to bots in fewer than 10 servers.</warn>
   * @param {string} name The name of the server
   * @param {Object} [options] Options for the creating
   * @param {number} [options.afkChannelID] The ID of the AFK channel
   * @param {number} [options.afkTimeout] The AFK timeout in seconds
   * @param {PartialChannelData[]} [options.channels] The channels for this server
   * @param {DefaultMessageNotifications} [options.defaultMessageNotifications] The default message notifications
   * for the server
   * @param {ExplicitContentFilterLevel} [options.explicitContentFilter] The explicit content filter level
   * for the server
   * @param {BufferResolvable|Base64Resolvable} [options.icon=null] The icon for the server
   * @param {string} [options.region] The region for the server, defaults to the closest one available
   * @param {PartialRoleData[]} [options.roles] The roles for this server,
   * the first element of this array is used to change properties of the server's everyone role.
   * @param {number} [options.systemChannelID] The ID of the system channel
   * @param {VerificationLevel} [options.verificationLevel] The verification level for the server
   * @returns {Promise<Server>} The server that was created
   */
  async create(
    name,
    {
      afkChannelID,
      afkTimeout,
      channels = [],
      defaultMessageNotifications,
      explicitContentFilter,
      icon = null,
      region,
      roles = [],
      systemChannelID,
      verificationLevel,
    } = {},
  ) {
    icon = await DataResolver.resolveImage(icon);
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
      if (channel.type) channel.type = ChannelTypes[channel.type.toUpperCase()];
      channel.parent_id = channel.parentID;
      delete channel.parentID;
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
      this.client.api.servers
        .post({
          data: {
            name,
            region,
            icon,
            verification_level: verificationLevel,
            default_message_notifications: defaultMessageNotifications,
            explicit_content_filter: explicitContentFilter,
            roles,
            channels,
            afk_channel_id: afkChannelID,
            afk_timeout: afkTimeout,
            system_channel_id: systemChannelID,
          },
        })
        .then(data => {
          if (this.client.servers.cache.has(data.id)) return resolve(this.client.servers.cache.get(data.id));

          const handleServer = server => {
            if (server.id === data.id) {
              this.client.clearTimeout(timeout);
              this.client.removeListener(Events.GUILD_CREATE, handleServer);
              this.client.decrementMaxListeners();
              resolve(server);
            }
          };
          this.client.incrementMaxListeners();
          this.client.on(Events.GUILD_CREATE, handleServer);

          const timeout = this.client.setTimeout(() => {
            this.client.removeListener(Events.GUILD_CREATE, handleServer);
            this.client.decrementMaxListeners();
            resolve(this.client.servers.add(data));
          }, 10000);
          return undefined;
        }, reject),
    );
  }

  /**
   * Obtains a server from Discord, or the server cache if it's already available.
   * @param {Snowflake} id ID of the server
   * @param {boolean} [cache=true] Whether to cache the new server object if it isn't already
   * @param {boolean} [force=false] Whether to skip the cache check and request the API
   * @returns {Promise<Server>}
   * @example
   * // Fetch a server by its id
   * client.servers.fetch('222078108977594368')
   *   .then(server => console.log(server.name))
   *   .catch(console.error);
   */
  async fetch(id, cache = true, force = false) {
    if (!force) {
      const existing = this.cache.get(id);
      if (existing) return existing;
    }

    const data = await this.client.api.servers(id).get({ query: { with_counts: true } });
    return this.add(data, cache);
  }
}

module.exports = ServerManager;
