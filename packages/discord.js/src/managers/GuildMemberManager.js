'use strict';

const { process } = require('node:process');
const { setTimeout, clearTimeout } = require('node:timers');
const { Collection } = require('@discordjs/collection');
const { makeURLSearchParams } = require('@discordjs/rest');
const { DiscordSnowflake } = require('@sapphire/snowflake');
const { Routes, GatewayOpcodes } = require('discord-api-types/v10');
const CachedManager = require('./CachedManager');
const { DiscordjsError, DiscordjsTypeError, DiscordjsRangeError, ErrorCodes } = require('../errors');
const BaseGuildVoiceChannel = require('../structures/BaseGuildVoiceChannel');
const { GuildMember } = require('../structures/GuildMember');
const { Role } = require('../structures/Role');
const { resolveImage } = require('../util/DataResolver');
const Events = require('../util/Events');
const { GuildMemberFlagsBitField } = require('../util/GuildMemberFlagsBitField');
const Partials = require('../util/Partials');

let deprecatedEmittedForEditSoleNickname = false;

/**
 * Manages API methods for GuildMembers and stores their cache.
 * @extends {CachedManager}
 */
class GuildMemberManager extends CachedManager {
  constructor(guild, iterable) {
    super(guild.client, GuildMember, iterable);

    /**
     * The guild this manager belongs to
     * @type {Guild}
     */
    this.guild = guild;
  }

  /**
   * The cache of this Manager
   * @type {Collection<Snowflake, GuildMember>}
   * @name GuildMemberManager#cache
   */

  _add(data, cache = true) {
    return super._add(data, cache, { id: data.user.id, extras: [this.guild] });
  }

  /**
   * Data that resolves to give a GuildMember object. This can be:
   * * A GuildMember object
   * * A User resolvable
   * @typedef {GuildMember|UserResolvable} GuildMemberResolvable
   */

  /**
   * Resolves a {@link GuildMemberResolvable} to a {@link GuildMember} object.
   * @param {GuildMemberResolvable} member The user that is part of the guild
   * @returns {?GuildMember}
   */
  resolve(member) {
    const memberResolvable = super.resolve(member);
    if (memberResolvable) return memberResolvable;
    const userId = this.client.users.resolveId(member);
    if (userId) return this.cache.get(userId) ?? null;
    return null;
  }

  /**
   * Resolves a {@link GuildMemberResolvable} to a member id.
   * @param {GuildMemberResolvable} member The user that is part of the guild
   * @returns {?Snowflake}
   */
  resolveId(member) {
    const memberResolvable = super.resolveId(member);
    if (memberResolvable) return memberResolvable;
    const userId = this.client.users.resolveId(member);
    return this.cache.has(userId) ? userId : null;
  }

  /**
   * Options used to add a user to a guild using OAuth2.
   * @typedef {Object} AddGuildMemberOptions
   * @property {string} accessToken An OAuth2 access token for the user with the {@link OAuth2Scopes.GuildsJoin}
   * scope granted to the bot's application
   * @property {string} [nick] The nickname to give to the member
   * <info>This property requires the {@link PermissionFlagsBits.ManageNicknames} permission.</info>
   * @property {Collection<Snowflake, Role>|RoleResolvable[]} [roles] The roles to add to the member
   * <info>This property requires the {@link PermissionFlagsBits.ManageRoles} permission.</info>
   * @property {boolean} [mute] Whether the member should be muted
   * <info>This property requires the {@link PermissionFlagsBits.MuteMembers} permission.</info>
   * @property {boolean} [deaf] Whether the member should be deafened
   * <info>This property requires the {@link PermissionFlagsBits.MuteMembers} permission.</info>
   * @property {boolean} [force] Whether to skip the cache check and request the API directly
   * @property {boolean} [fetchWhenExisting=true] Whether to fetch the user if not cached and already a member
   */

  /**
   * Adds a user to the guild using OAuth2.
   * <info>This method requires the {@link PermissionFlagsBits.CreateInstantInvite} permission.
   * @param {UserResolvable} user The user to add to the guild
   * @param {AddGuildMemberOptions} options Options for adding the user to the guild
   * @returns {Promise<?GuildMember>}
   */
  async add(user, options) {
    const userId = this.client.users.resolveId(user);
    if (!userId) throw new DiscordjsTypeError(ErrorCodes.InvalidType, 'user', 'UserResolvable');
    if (!options.force) {
      const cachedUser = this.cache.get(userId);
      if (cachedUser) return cachedUser;
    }
    const resolvedOptions = {
      access_token: options.accessToken,
      nick: options.nick,
      mute: options.mute,
      deaf: options.deaf,
    };
    if (options.roles) {
      if (!Array.isArray(options.roles) && !(options.roles instanceof Collection)) {
        throw new DiscordjsTypeError(
          ErrorCodes.InvalidType,
          'options.roles',
          'Array or Collection of Roles or Snowflakes',
          true,
        );
      }
      const resolvedRoles = [];
      for (const role of options.roles.values()) {
        const resolvedRole = this.guild.roles.resolveId(role);
        if (!resolvedRole) {
          throw new DiscordjsTypeError(ErrorCodes.InvalidElement, 'Array or Collection', 'options.roles', role);
        }
        resolvedRoles.push(resolvedRole);
      }
      resolvedOptions.roles = resolvedRoles;
    }
    const data = await this.client.rest.put(Routes.guildMember(this.guild.id, userId), { body: resolvedOptions });

    // Data is an empty array buffer if the member is already part of the guild.
    return data instanceof ArrayBuffer
      ? options.fetchWhenExisting === false
        ? null
        : this.fetch(userId)
      : this._add(data);
  }

  /**
   * The client user as a GuildMember of this guild
   * @type {?GuildMember}
   * @readonly
   */
  get me() {
    return (
      this.cache.get(this.client.user.id) ??
      (this.client.options.partials.includes(Partials.GuildMember)
        ? this._add({ user: { id: this.client.user.id } }, true)
        : null)
    );
  }

  /**
   * Options used to fetch a single member from a guild.
   * @typedef {BaseFetchOptions} FetchMemberOptions
   * @property {UserResolvable} user The user to fetch
   */

  /**
   * Options used to fetch multiple members from a guild.
   * @typedef {Object} FetchMembersOptions
   * @property {UserResolvable|UserResolvable[]} [user] The user(s) to fetch
   * @property {?string} [query] Limit fetch to members with similar usernames
   * @property {number} [limit=0] Maximum number of members to request
   * @property {boolean} [withPresences=false] Whether to include the presences
   * @property {number} [time=120e3] Timeout for receipt of members
   * @property {?string} [nonce] Nonce for this request (32 characters max - default to base 16 now timestamp)
   */

  /**
   * Fetches member(s) from a guild.
   * @param {UserResolvable|FetchMemberOptions|FetchMembersOptions} [options] Options for fetching member(s).
   * Omitting the parameter or providing `undefined` will fetch all members.
   * @returns {Promise<GuildMember|Collection<Snowflake, GuildMember>>}
   * @example
   * // Fetch all members from a guild
   * guild.members.fetch()
   *   .then(console.log)
   *   .catch(console.error);
   * @example
   * // Fetch a single member
   * guild.members.fetch('66564597481480192')
   *   .then(console.log)
   *   .catch(console.error);
   * @example
   * // Fetch a single member without checking cache
   * guild.members.fetch({ user, force: true })
   *   .then(console.log)
   *   .catch(console.error)
   * @example
   * // Fetch a single member without caching
   * guild.members.fetch({ user, cache: false })
   *   .then(console.log)
   *   .catch(console.error);
   * @example
   * // Fetch by an array of users including their presences
   * guild.members.fetch({ user: ['66564597481480192', '191615925336670208'], withPresences: true })
   *   .then(console.log)
   *   .catch(console.error);
   * @example
   * // Fetch by query
   * guild.members.fetch({ query: 'hydra', limit: 1 })
   *   .then(console.log)
   *   .catch(console.error);
   */
  fetch(options) {
    if (!options) return this._fetchMany();
    const { user: users, limit, withPresences, cache, force } = options;
    const resolvedUser = this.client.users.resolveId(users ?? options);
    if (resolvedUser && !limit && !withPresences) return this._fetchSingle({ user: resolvedUser, cache, force });
    const resolvedUsers = users?.map?.(user => this.client.users.resolveId(user)) ?? resolvedUser ?? undefined;
    return this._fetchMany({ ...options, users: resolvedUsers });
  }

  async _fetchSingle({ user, cache, force = false }) {
    if (!force) {
      const existing = this.cache.get(user);
      if (existing && !existing.partial) return existing;
    }

    const data = await this.client.rest.get(Routes.guildMember(this.guild.id, user));
    return this._add(data, cache);
  }

  async _fetchMany({
    limit = 0,
    withPresences: presences,
    users,
    query,
    time = 120e3,
    nonce = DiscordSnowflake.generate().toString(),
  } = {}) {
    if (nonce.length > 32) throw new DiscordjsRangeError(ErrorCodes.MemberFetchNonceLength);

    return new Promise((resolve, reject) => {
      if (!query && !users) query = '';
      this.guild.shard.send({
        op: GatewayOpcodes.RequestGuildMembers,
        d: {
          guild_id: this.guild.id,
          presences,
          user_ids: users,
          query,
          nonce,
          limit,
        },
      });
      const fetchedMembers = new Collection();
      let i = 0;
      const handler = (members, _, chunk) => {
        if (chunk.nonce !== nonce) return;
        timeout.refresh();
        i++;
        for (const member of members.values()) {
          fetchedMembers.set(member.id, member);
        }
        if (members.size < 1_000 || (limit && fetchedMembers.size >= limit) || i === chunk.count) {
          clearTimeout(timeout);
          this.client.removeListener(Events.GuildMembersChunk, handler);
          this.client.decrementMaxListeners();
          resolve(users && !Array.isArray(users) && fetchedMembers.size ? fetchedMembers.first() : fetchedMembers);
        }
      };
      const timeout = setTimeout(() => {
        this.client.removeListener(Events.GuildMembersChunk, handler);
        this.client.decrementMaxListeners();
        reject(new DiscordjsError(ErrorCodes.GuildMembersTimeout));
      }, time).unref();
      this.client.incrementMaxListeners();
      this.client.on(Events.GuildMembersChunk, handler);
    });
  }

  /**
   * Fetches the client user as a GuildMember of the guild.
   * @param {BaseFetchOptions} [options] The options for fetching the member
   * @returns {Promise<GuildMember>}
   */
  fetchMe(options) {
    return this.fetch({ ...options, user: this.client.user.id });
  }

  /**
   * Options used for searching guild members.
   * @typedef {Object} GuildSearchMembersOptions
   * @property {string} query Filter members whose username or nickname start with this query
   * @property {number} [limit] Maximum number of members to search
   * @property {boolean} [cache=true] Whether or not to cache the fetched member(s)
   */

  /**
   * Searches for members in the guild based on a query.
   * @param {GuildSearchMembersOptions} options Options for searching members
   * @returns {Promise<Collection<Snowflake, GuildMember>>}
   */
  async search({ query, limit, cache = true } = {}) {
    const data = await this.client.rest.get(Routes.guildMembersSearch(this.guild.id), {
      query: makeURLSearchParams({ query, limit }),
    });
    return data.reduce((col, member) => col.set(member.user.id, this._add(member, cache)), new Collection());
  }

  /**
   * Options used for listing guild members.
   * @typedef {Object} GuildListMembersOptions
   * @property {Snowflake} [after] Limit fetching members to those with an id greater than the supplied id
   * @property {number} [limit] Maximum number of members to list
   * @property {boolean} [cache=true] Whether or not to cache the fetched member(s)
   */

  /**
   * Lists up to 1000 members of the guild.
   * @param {GuildListMembersOptions} [options] Options for listing members
   * @returns {Promise<Collection<Snowflake, GuildMember>>}
   */
  async list({ after, limit, cache = true } = {}) {
    const query = makeURLSearchParams({ limit, after });
    const data = await this.client.rest.get(Routes.guildMembers(this.guild.id), { query });
    return data.reduce((col, member) => col.set(member.user.id, this._add(member, cache)), new Collection());
  }

  /**
   * The data for editing a guild member.
   * @typedef {Object} GuildMemberEditOptions
   * @property {?string} [nick] The nickname to set for the member
   * @property {Collection<Snowflake, Role>|RoleResolvable[]} [roles] The roles or role ids to apply
   * @property {boolean} [mute] Whether or not the member should be muted
   * @property {boolean} [deaf] Whether or not the member should be deafened
   * @property {?GuildVoiceChannelResolvable} [channel] Channel to move the member to
   * (if they are connected to voice), or `null` if you want to disconnect them from voice
   * @property {?DateResolvable} [communicationDisabledUntil] The date or timestamp
   * for the member's communication to be disabled until. Provide `null` to enable communication again.
   * @property {GuildMemberFlagsResolvable} [flags] The flags to set for the member
   * @property {string} [reason] Reason for editing this user
   */

  /**
   * Edits a member of a guild.
   *
   * @param {UserResolvable} user The member to edit
   * @param {GuildMemberEditOptions} options The options to provide
   * @returns {Promise<GuildMember>}
   */
  async edit(user, { reason, ...options }) {
    const id = this.client.users.resolveId(user);
    if (!id) throw new DiscordjsTypeError(ErrorCodes.InvalidType, 'user', 'UserResolvable');

    if (options.channel) {
      options.channel = this.guild.channels.resolve(options.channel);
      if (!(options.channel instanceof BaseGuildVoiceChannel)) {
        throw new DiscordjsError(ErrorCodes.GuildVoiceChannelResolve);
      }
      options.channel_id = options.channel.id;
      options.channel = undefined;
    } else if (options.channel === null) {
      options.channel_id = null;
      options.channel = undefined;
    }
    options.roles &&= options.roles.map(role => (role instanceof Role ? role.id : role));

    if (options.communicationDisabledUntil !== undefined) {
      options.communication_disabled_until =
        // eslint-disable-next-line eqeqeq
        options.communicationDisabledUntil != null
          ? new Date(options.communicationDisabledUntil).toISOString()
          : options.communicationDisabledUntil;
    }

    if (options.flags !== undefined) {
      options.flags = GuildMemberFlagsBitField.resolve(options.flags);
    }

    let endpoint;

    if (id === this.client.user.id) {
      const keys = Object.keys(options);

      if (keys.length === 1 && keys[0] === 'nick') {
        // For modifying the current application's nickname only, we use the /guilds/{guild.id}/members/@me endpoint.
        // This endpoint only requires the CHANGE_NICKNAME permission.
        // The other endpoint would require the MANAGE_NICKNAMES permission.
        // In v15, this will be split out, so emit a deprecation.
        endpoint = Routes.guildMember(this.guild.id, '@me');

        if (!deprecatedEmittedForEditSoleNickname) {
          process.emitWarning(
            // eslint-disable-next-line max-len
            "You should use GuildMemberManager#editMe() when changing your nickname. Due to Discord's API changes, GuildMemberManager#edit() will end up requiring MANAGE_NICKNAMES in v15.",
            'DeprecationWarning',
          );

          deprecatedEmittedForEditSoleNickname = true;
        }
      }
    }

    endpoint ??= Routes.guildMember(this.guild.id, id);
    const d = await this.client.rest.patch(endpoint, { body: options, reason });

    const clone = this.cache.get(id)?._clone();
    clone?._patch(d);
    return clone ?? this._add(d, false);
  }

  /**
   * The data for editing the current application's guild member.
   *
   * @typedef {Object} GuildMemberEditMeOptions
   * @property {?string} [nick] The nickname to set
   * @property {?(BufferResolvable|Base64Resolvable)} [banner] The banner to set
   * @property {?(BufferResolvable|Base64Resolvable)} [avatar] The avatar to set
   * @property {?string} [bio] The bio to set
   * @property {string} [reason] The reason to use
   */

  /**
   * Edits the current application's guild member in a guild.
   *
   * @param {GuildMemberEditMeOptions} options The options to provide
   * @returns {Promise<GuildMember>}
   */
  async editMe({ reason, ...options }) {
    const data = await this.client.rest.patch(Routes.guildMember(this.guild.id, '@me'), {
      body: {
        ...options,
        banner: options.banner && (await resolveImage(options.banner)),
        avatar: options.avatar && (await resolveImage(options.avatar)),
      },
      reason,
    });

    const clone = this.me?._clone();
    clone?._patch(data);
    return clone ?? this._add(data, false);
  }

  /**
   * Options used for pruning guild members.
   * <info>It's recommended to set {@link GuildPruneMembersOptions#count options.count}
   * to `false` for large guilds.</info>
   * @typedef {Object} GuildPruneMembersOptions
   * @property {number} [days] Number of days of inactivity required to kick
   * @property {boolean} [dry=false] Get the number of users that will be kicked, without actually kicking them
   * @property {boolean} [count] Whether or not to return the number of users that have been kicked.
   * @property {RoleResolvable[]} [roles] Array of roles to bypass the "...and no roles" constraint when pruning
   * @property {string} [reason] Reason for this prune
   */

  /**
   * Prunes members from the guild based on how long they have been inactive.
   * @param {GuildPruneMembersOptions} [options] Options for pruning
   * @returns {Promise<?number>} The number of members that were/will be kicked
   * @example
   * // See how many members will be pruned
   * guild.members.prune({ dry: true })
   *   .then(pruned => console.log(`This will prune ${pruned} people!`))
   *   .catch(console.error);
   * @example
   * // Actually prune the members
   * guild.members.prune({ days: 1, reason: 'too many people!' })
   *   .then(pruned => console.log(`I just pruned ${pruned} people!`))
   *   .catch(console.error);
   * @example
   * // Include members with a specified role
   * guild.members.prune({ days: 7, roles: ['657259391652855808'] })
   *    .then(pruned => console.log(`I just pruned ${pruned} people!`))
   *    .catch(console.error);
   */
  async prune({ days, dry = false, count: compute_prune_count, roles = [], reason } = {}) {
    if (typeof days !== 'number') throw new DiscordjsTypeError(ErrorCodes.PruneDaysType);

    const query = { days };
    const resolvedRoles = [];

    for (const role of roles) {
      const resolvedRole = this.guild.roles.resolveId(role);
      if (!resolvedRole) {
        throw new DiscordjsTypeError(ErrorCodes.InvalidElement, 'Array', 'options.roles', role);
      }
      resolvedRoles.push(resolvedRole);
    }

    if (resolvedRoles.length) {
      query.include_roles = dry ? resolvedRoles.join(',') : resolvedRoles;
    }

    const endpoint = Routes.guildPrune(this.guild.id);

    const { pruned } = await (dry
      ? this.client.rest.get(endpoint, { query: makeURLSearchParams(query), reason })
      : this.client.rest.post(endpoint, { body: { ...query, compute_prune_count }, reason }));

    return pruned;
  }

  /**
   * Kicks a user from the guild.
   * <info>The user must be a member of the guild</info>
   * @param {UserResolvable} user The member to kick
   * @param {string} [reason] Reason for kicking
   * @returns {Promise<GuildMember|User|Snowflake>} Result object will be resolved as specifically as possible.
   * If the GuildMember cannot be resolved, the User will instead be attempted to be resolved. If that also cannot
   * be resolved, the user's id will be the result.
   * @example
   * // Kick a user by id (or with a user/guild member object)
   * guild.members.kick('84484653687267328')
   *   .then(kickInfo => console.log(`Kicked ${kickInfo.user?.tag ?? kickInfo.tag ?? kickInfo}`))
   *   .catch(console.error);
   */
  async kick(user, reason) {
    const id = this.client.users.resolveId(user);
    if (!id) throw new DiscordjsTypeError(ErrorCodes.InvalidType, 'user', 'UserResolvable');

    await this.client.rest.delete(Routes.guildMember(this.guild.id, id), { reason });

    return this.resolve(user) ?? this.client.users.resolve(user) ?? id;
  }

  /**
   * Bans a user from the guild.
   * @param {UserResolvable} user The user to ban
   * @param {BanOptions} [options] Options for the ban
   * @returns {Promise<GuildMember|User|Snowflake>} Result object will be resolved as specifically as possible.
   * If the GuildMember cannot be resolved, the User will instead be attempted to be resolved. If that also cannot
   * be resolved, the user id will be the result.
   * Internally calls the GuildBanManager#create method.
   * @example
   * // Ban a user by id (or with a user/guild member object)
   * guild.members.ban('84484653687267328')
   *   .then(banInfo => console.log(`Banned ${banInfo.user?.tag ?? banInfo.tag ?? banInfo}`))
   *   .catch(console.error);
   */
  ban(user, options) {
    return this.guild.bans.create(user, options);
  }

  /**
   * Unbans a user from the guild. Internally calls the {@link GuildBanManager#remove} method.
   * @param {UserResolvable} user The user to unban
   * @param {string} [reason] Reason for unbanning user
   * @returns {Promise<?User>} The user that was unbanned
   * @example
   * // Unban a user by id (or with a user/guild member object)
   * guild.members.unban('84484653687267328')
   *   .then(user => console.log(`Unbanned ${user.username} from ${guild.name}`))
   *   .catch(console.error);
   */
  unban(user, reason) {
    return this.guild.bans.remove(user, reason);
  }

  /**
   * Bulk ban users from a guild, and optionally delete previous messages sent by them.
   * @param {Collection<Snowflake, UserResolvable>|UserResolvable[]} users The users to ban
   * @param {BulkBanOptions} [options] The options for bulk banning users
   * @returns {Promise<BulkBanResult>} Returns an object with `bannedUsers` key containing the IDs of the banned users
   * and the key `failedUsers` with the IDs that could not be banned or were already banned.
   * Internally calls the GuildBanManager#bulkCreate method.
   * @example
   * // Bulk ban users by ids (or with user/guild member objects) and delete all their messages from the past 7 days
   * guild.members.bulkBan(['84484653687267328'], { deleteMessageSeconds: 7 * 24 * 60 * 60 })
   *   .then(result => {
   *     console.log(`Banned ${result.bannedUsers.length} users, failed to ban ${result.failedUsers.length} users.`)
   *   })
   *   .catch(console.error);
   */
  bulkBan(users, options = {}) {
    return this.guild.bans.bulkCreate(users, options);
  }

  /**
   * Options used for adding or removing a role from a member.
   * @typedef {Object} AddOrRemoveGuildMemberRoleOptions
   * @property {GuildMemberResolvable} user The user to add/remove the role from
   * @property {RoleResolvable} role The role to add/remove
   * @property {string} [reason] Reason for adding/removing the role
   */

  /**
   * Adds a role to a member.
   * @param {AddOrRemoveGuildMemberRoleOptions} options Options for adding the role
   * @returns {Promise<GuildMember|User|Snowflake>}
   */
  async addRole(options) {
    const { user, role, reason } = options;
    const userId = this.resolveId(user);
    const roleId = this.guild.roles.resolveId(role);
    await this.client.rest.put(Routes.guildMemberRole(this.guild.id, userId, roleId), { reason });

    return this.resolve(user) ?? this.client.users.resolve(user) ?? userId;
  }

  /**
   * Removes a role from a member.
   * @param {AddOrRemoveGuildMemberRoleOptions} options Options for removing the role
   * @returns {Promise<GuildMember|User|Snowflake>}
   */
  async removeRole(options) {
    const { user, role, reason } = options;
    const userId = this.resolveId(user);
    const roleId = this.guild.roles.resolveId(role);
    await this.client.rest.delete(Routes.guildMemberRole(this.guild.id, userId, roleId), { reason });

    return this.resolve(user) ?? this.client.users.resolve(user) ?? userId;
  }
}

module.exports = GuildMemberManager;
