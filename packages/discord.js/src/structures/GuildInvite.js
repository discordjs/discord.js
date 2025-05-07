'use strict';

const { Routes, PermissionFlagsBits, InviteType } = require('discord-api-types/v10');
const { BaseInvite } = require('./BaseInvite.js');
const { GuildScheduledEvent } = require('./GuildScheduledEvent.js');
const { IntegrationApplication } = require('./IntegrationApplication.js');
const { InviteGuild } = require('./InviteGuild.js');
const { DiscordjsError, ErrorCodes } = require('../errors/index.js');

/**
 * A channel invite leading to a guild.
 * @extends {BaseInvite}
 */
class GuildInvite extends BaseInvite {
  constructor(client, data) {
    super(client, data);

    // Type may be missing from audit logs.
    this.type ??= InviteType.Guild;

    /**
     * The id of the guild this invite is for.
     * @type {Snowflake}
     */
    // Guild id may be missing from audit logs.
    this.guildId = data.guild_id ?? data.guild.id;

    /**
     * The maximum age of the invite in seconds. `0` for no expiry.
     * <info>This is only available when the invite was fetched through {@link GuildInviteManager#fetch}
     * or created through {@link GuildInviteManager#create}.</info>
     * @name GuildInvite#maxAge
     * @type {?number}
     */

    /**
     * The approximate total number of members of the guild.
     * <info>This is only available when the invite was fetched through {@link Client#fetchInvite}.</info>
     * @name GuildInvite#approximateMemberCount
     * @type {?number}
     */
  }

  _patch(data) {
    if ('guild' in data) {
      /**
       * The guild the invite is for. May include welcome screen data.
       * @type {?(Guild|InviteGuild)}
       */
      this.guild = this.client.guilds.cache.get(data.guild.id) ?? new InviteGuild(this.client, data.guild);
    } else {
      this.guild ??= null;
    }

    super._patch(data, this.guild);

    if ('target_type' in data) {
      /**
       * The target type.
       * @type {?InviteTargetType}
       */
      this.targetType = data.target_type;
    } else {
      this.targetType ??= null;
    }

    if ('target_user' in data) {
      /**
       * The user whose stream to display for this voice channel stream invite.
       * @type {?User}
       */
      this.targetUser = this.client.users._add(data.target_user);
    } else {
      this.targetUser ??= null;
    }

    if ('target_application' in data) {
      /**
       * The embedded application to open for this voice channel embedded application invite.
       * @type {?IntegrationApplication}
       */
      this.targetApplication = new IntegrationApplication(this.client, data.target_application);
    } else {
      this.targetApplication ??= null;
    }

    if ('guild_scheduled_event' in data) {
      /**
       * The guild scheduled event data if there is a {@link GuildScheduledEvent} in the channel.
       * @type {?GuildScheduledEvent}
       */
      this.guildScheduledEvent = new GuildScheduledEvent(this.client, data.guild_scheduled_event);
    } else {
      this.guildScheduledEvent ??= null;
    }

    if ('uses' in data) {
      /**
       * How many times this invite has been used.
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
       * The maximum uses of this invite.
       * <info>This is only available when the invite was fetched through {@link GuildInviteManager#fetch}
       * or created through {@link GuildInviteManager#create}.</info>
       * @type {?number}
       */
      this.maxUses = data.max_uses;
    } else {
      this.maxUses ??= null;
    }

    if ('temporary' in data) {
      /**
       * Whether this invite grants temporary membership.
       * <info>This is only available when the invite was fetched through {@link GuildInviteManager#fetch}
       * or created through {@link GuildInviteManager#create}.</info>
       * @type {?boolean}
       */
      this.temporary = data.temporary ?? null;
    } else {
      this.temporary ??= null;
    }

    if ('approximate_presence_count' in data) {
      /**
       * The approximate number of online members of the guild.
       * <info>This is only available when the invite was fetched through {@link Client#fetchInvite}.</info>
       * @type {?number}
       */
      this.approximatePresenceCount = data.approximate_presence_count;
    } else {
      this.approximatePresenceCount ??= null;
    }
  }

  /**
   * Whether the invite is deletable by the client user.
   * @type {boolean}
   * @readonly
   */
  get deletable() {
    const guild = this.guild;
    if (!guild || !this.client.guilds.cache.has(guild.id)) return false;
    if (!guild.members.me) throw new DiscordjsError(ErrorCodes.GuildUncachedMe);
    return Boolean(
      this.channel?.permissionsFor(this.client.user).has(PermissionFlagsBits.ManageChannels, false) ||
        guild.members.me.permissions.has(PermissionFlagsBits.ManageGuild),
    );
  }

  /**
   * Delete this invite.
   * @param {string} [reason] Reason for deleting this invite
   * @returns {Promise<void>}
   */
  async delete(reason) {
    await this.client.rest.delete(Routes.invite(this.code), { reason });
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
}

exports.GuildInvite = GuildInvite;
