'use strict';

const { RouteBases, Routes, PermissionFlagsBits } = require('discord-api-types/v10');
const Base = require('./Base');
const { GuildScheduledEvent } = require('./GuildScheduledEvent');
const IntegrationApplication = require('./IntegrationApplication');
const InviteStageInstance = require('./InviteStageInstance');
const { Error, ErrorCodes } = require('../errors');

/**
 * Represents an invitation to a guild channel.
 * @extends {Base}
 */
class Invite extends Base {
  /**
   * Regular expression that globally matches Discord invite links
   * @type {RegExp}
   * @memberof Invite
   */
  static InvitesPattern = /discord(?:(?:app)?\.com\/invite|\.gg(?:\/invite)?)\/([\w-]{2,255})/gi;

  constructor(client, data) {
    super(client);
    this._patch(data);
  }

  _patch(data) {
    const InviteGuild = require('./InviteGuild');
    /**
     * The guild the invite is for including welcome screen data if present
     * @type {?(Guild|InviteGuild)}
     */
    this.guild ??= null;
    if (data.guild) {
      this.guild = this.client.guilds.resolve(data.guild.id) ?? new InviteGuild(this.client, data.guild);
    }

    if ('code' in data) {
      /**
       * The code for this invite
       * @type {string}
       */
      this.code = data.code;
    }

    if ('approximate_presence_count' in data) {
      /**
       * The approximate number of online members of the guild this invite is for
       * <info>This is only available when the invite was fetched through {@link Client#fetchInvite}.</info>
       * @type {?number}
       */
      this.presenceCount = data.approximate_presence_count;
    } else {
      this.presenceCount ??= null;
    }

    if ('approximate_member_count' in data) {
      /**
       * The approximate total number of members of the guild this invite is for
       * <info>This is only available when the invite was fetched through {@link Client#fetchInvite}.</info>
       * @type {?number}
       */
      this.memberCount = data.approximate_member_count;
    } else {
      this.memberCount ??= null;
    }

    if ('temporary' in data) {
      /**
       * Whether or not this invite only grants temporary membership
       * <info>This is only available when the invite was fetched through {@link GuildInviteManager#fetch}
       * or created through {@link GuildInviteManager#create}.</info>
       * @type {?boolean}
       */
      this.temporary = data.temporary ?? null;
    } else {
      this.temporary ??= null;
    }

    if ('max_age' in data) {
      /**
       * The maximum age of the invite, in seconds, 0 if never expires
       * <info>This is only available when the invite was fetched through {@link GuildInviteManager#fetch}
       * or created through {@link GuildInviteManager#create}.</info>
       * @type {?number}
       */
      this.maxAge = data.max_age;
    } else {
      this.maxAge ??= null;
    }

    if ('uses' in data) {
      /**
       * How many times this invite has been used
       * <info>This is only available when the invite was fetched through {@link GuildInviteManager#fetch}
       * or created through {@link GuildInviteManager#create}.</info>
       * @type {?number}
       */
      this.uses = data.uses;
    } else {
      this.uses ??= null;
    }

    if ('max_uses' in data) {
      /**
       * The maximum uses of this invite
       * <info>This is only available when the invite was fetched through {@link GuildInviteManager#fetch}
       * or created through {@link GuildInviteManager#create}.</info>
       * @type {?number}
       */
      this.maxUses = data.max_uses;
    } else {
      this.maxUses ??= null;
    }

    if ('inviter_id' in data) {
      /**
       * The user's id who created this invite
       * @type {?Snowflake}
       */
      this.inviterId = data.inviter_id;
    } else {
      this.inviterId ??= null;
    }

    if ('inviter' in data) {
      this.client.users._add(data.inviter);
      this.inviterId = data.inviter.id;
    }

    if ('target_user' in data) {
      /**
       * The user whose stream to display for this voice channel stream invite
       * @type {?User}
       */
      this.targetUser = this.client.users._add(data.target_user);
    } else {
      this.targetUser ??= null;
    }

    if ('target_application' in data) {
      /**
       * The embedded application to open for this voice channel embedded application invite
       * @type {?IntegrationApplication}
       */
      this.targetApplication = new IntegrationApplication(this.client, data.target_application);
    } else {
      this.targetApplication ??= null;
    }

    if ('target_type' in data) {
      /**
       * The target type
       * @type {?InviteTargetType}
       */
      this.targetType = data.target_type;
    } else {
      this.targetType ??= null;
    }

    if ('channel_id' in data) {
      /**
       * The id of the channel this invite is for
       * @type {?Snowflake}
       */
      this.channelId = data.channel_id;
    }

    if ('channel' in data) {
      /**
       * The channel this invite is for
       * @type {?Channel}
       */
      this.channel =
        this.client.channels._add(data.channel, this.guild, { cache: false }) ??
        this.client.channels.resolve(this.channelId);

      this.channelId ??= data.channel.id;
    }

    if ('created_at' in data) {
      /**
       * The timestamp this invite was created at
       * @type {?number}
       */
      this.createdTimestamp = Date.parse(data.created_at);
    } else {
      this.createdTimestamp ??= null;
    }

    if ('expires_at' in data) {
      this._expiresTimestamp = data.expires_at && Date.parse(data.expires_at);
    } else {
      this._expiresTimestamp ??= null;
    }

    if ('stage_instance' in data) {
      /**
       * The stage instance data if there is a public {@link StageInstance} in the stage channel this invite is for
       * @type {?InviteStageInstance}
       * @deprecated
       */
      this.stageInstance = new InviteStageInstance(this.client, data.stage_instance, this.channel.id, this.guild.id);
    } else {
      this.stageInstance ??= null;
    }

    if ('guild_scheduled_event' in data) {
      /**
       * The guild scheduled event data if there is a {@link GuildScheduledEvent} in the channel this invite is for
       * @type {?GuildScheduledEvent}
       */
      this.guildScheduledEvent = new GuildScheduledEvent(this.client, data.guild_scheduled_event);
    } else {
      this.guildScheduledEvent ??= null;
    }
  }

  /**
   * The time the invite was created at
   * @type {?Date}
   * @readonly
   */
  get createdAt() {
    return this.createdTimestamp && new Date(this.createdTimestamp);
  }

  /**
   * Whether the invite is deletable by the client user
   * @type {boolean}
   * @readonly
   */
  get deletable() {
    const guild = this.guild;
    if (!guild || !this.client.guilds.cache.has(guild.id)) return false;
    if (!guild.members.me) throw new Error(ErrorCodes.GuildUncachedMe);
    return Boolean(
      this.channel?.permissionsFor(this.client.user).has(PermissionFlagsBits.ManageChannels, false) ||
        guild.members.me.permissions.has(PermissionFlagsBits.ManageGuild),
    );
  }

  /**
   * The timestamp the invite will expire at
   * @type {?number}
   * @readonly
   */
  get expiresTimestamp() {
    return (
      this._expiresTimestamp ??
      (this.createdTimestamp && this.maxAge ? this.createdTimestamp + this.maxAge * 1_000 : null)
    );
  }

  /**
   * The time the invite will expire at
   * @type {?Date}
   * @readonly
   */
  get expiresAt() {
    return this.expiresTimestamp && new Date(this.expiresTimestamp);
  }

  /**
   * The user who created this invite
   * @type {?User}
   * @readonly
   */
  get inviter() {
    return this.inviterId && this.client.users.resolve(this.inviterId);
  }

  /**
   * The URL to the invite
   * @type {string}
   * @readonly
   */
  get url() {
    return `${RouteBases.invite}/${this.code}`;
  }

  /**
   * Deletes this invite.
   * @param {string} [reason] Reason for deleting this invite
   * @returns {Promise<Invite>}
   */
  async delete(reason) {
    await this.client.rest.delete(Routes.invite(this.code), { reason });
    return this;
  }

  /**
   * When concatenated with a string, this automatically concatenates the invite's URL instead of the object.
   * @returns {string}
   * @example
   * // Logs: Invite: https://discord.gg/A1b2C3
   * console.log(`Invite: ${invite}`);
   */
  toString() {
    return this.url;
  }

  toJSON() {
    return super.toJSON({
      url: true,
      expiresTimestamp: true,
      presenceCount: false,
      memberCount: false,
      uses: false,
      channel: 'channelId',
      inviter: 'inviterId',
      guild: 'guildId',
    });
  }

  valueOf() {
    return this.code;
  }
}

module.exports = Invite;
