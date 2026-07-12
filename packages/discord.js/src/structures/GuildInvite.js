'use strict';

const { Buffer } = require('node:buffer');
const { Collection } = require('@discordjs/collection');
const { lazy } = require('@discordjs/util');
const { Routes, PermissionFlagsBits, InviteType } = require('discord-api-types/v10');
const { DiscordjsError, ErrorCodes } = require('../errors/index.js');
const { createInviteFormData } = require('../util/DataResolver.js');
const { InviteFlagsBitField } = require('../util/InviteFlagsBitField.js');
const { _transformAPIInviteTargetUsersJobStatus } = require('../util/Transformers.js');
const { BaseInvite } = require('./BaseInvite.js');
const { GuildScheduledEvent } = require('./GuildScheduledEvent.js');
const { IntegrationApplication } = require('./IntegrationApplication.js');
const { InviteGuild } = require('./InviteGuild.js');

const getInviteRole = lazy(() => require('./InviteRole.js').InviteRole);

/**
 * A channel invite leading to a guild.
 *
 * @extends {BaseInvite}
 */
class GuildInvite extends BaseInvite {
  constructor(client, data) {
    super(client, data);

    // Type may be missing from audit logs.
    this.type = InviteType.Guild;

    /**
     * The id of the guild this invite is for.
     *
     * @type {Snowflake}
     */
    // Guild id may be missing from audit logs.
    this.guildId = data.guild_id ?? data.guild.id;

    /**
     * The maximum age of the invite in seconds. `0` for no expiry.
     * <info>This is only available when the invite was fetched through {@link GuildInviteManager#fetch}
     * or created through {@link GuildInviteManager#create}.</info>
     *
     * @name GuildInvite#maxAge
     * @type {?number}
     */

    /**
     * The approximate total number of members of the guild.
     * <info>This is only available when the invite was fetched through {@link Client#fetchInvite}.</info>
     *
     * @name GuildInvite#approximateMemberCount
     * @type {?number}
     */
  }

  _patch(data) {
    super._patch(data);

    if ('flags' in data) {
      /**
       * The flags of this invite.
       *
       * @type {Readonly<InviteFlagsBitField>}
       */
      this.flags = new InviteFlagsBitField(data.flags).freeze();
    } else {
      this.flags ??= new InviteFlagsBitField().freeze();
    }

    if ('guild' in data) {
      /**
       * The guild the invite is for. May include welcome screen data.
       *
       * @type {?(Guild|InviteGuild)}
       */
      this.guild = this.client.guilds.cache.get(data.guild.id) ?? new InviteGuild(this.client, data.guild);
    } else {
      this.guild ??= null;
    }

    if ('channel' in data) {
      /**
       * The channel this invite is for.
       *
       * @type {?GuildInvitableChannel}
       */
      this.channel =
        this.client.channels._add(data.channel, this.guild, { cache: false }) ??
        this.client.channels.cache.get(this.channelId);

      this.channelId ??= data.channel.id;
    }

    if ('target_type' in data) {
      /**
       * The target type.
       *
       * @type {?InviteTargetType}
       */
      this.targetType = data.target_type;
    } else {
      this.targetType ??= null;
    }

    if ('target_user' in data) {
      /**
       * The user whose stream to display for this voice channel stream invite.
       *
       * @type {?User}
       */
      this.targetUser = this.client.users._add(data.target_user);
    } else {
      this.targetUser ??= null;
    }

    if ('target_application' in data) {
      /**
       * The embedded application to open for this voice channel embedded application invite.
       *
       * @type {?IntegrationApplication}
       */
      this.targetApplication = new IntegrationApplication(this.client, data.target_application);
    } else {
      this.targetApplication ??= null;
    }

    if ('guild_scheduled_event' in data) {
      /**
       * The guild scheduled event data if there is a {@link GuildScheduledEvent} in the channel.
       *
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
       *
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
       *
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
       *
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
       *
       * @type {?number}
       */
      this.approximatePresenceCount = data.approximate_presence_count;
    } else {
      this.approximatePresenceCount ??= null;
    }

    if ('roles' in data) {
      /**
       * The roles assigned to the user upon accepting the invite.
       *
       * @type {?Collection<Snowflake, Role|InviteRole>}
       */
      this.roles = new Collection(
        data.roles.map(role => [
          role.id,
          this.guild?.roles?._add(role, false) ?? new (getInviteRole())(this.client, role),
        ]),
      );
    } else {
      this.roles ??= null;
    }
  }

  /**
   * Whether the invite is deletable by the client user.
   *
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
   *
   * @param {string} [reason] Reason for deleting this invite
   * @returns {Promise<void>}
   */
  async delete(reason) {
    await this.client.rest.delete(Routes.invite(this.code), { reason });
  }

  /**
   * Update target users of this invite.
   *
   * @param {UserResolvable[]|BufferResolvable} targetUsersFile An array of users or a csv file with a single column of user IDs
   * for all the users able to accept this invite
   * @returns {Promise<unknown>}
   */
  async updateTargetUsers(targetUsersFile) {
    return this.client.rest.put(Routes.inviteTargetUsers(this.code), {
      body: await createInviteFormData(this.client, { targetUsersFile }),
      // This is necessary otherwise rest stringifies the body
      passThroughBody: true,
    });
  }

  /**
   * Get target users of this invite
   *
   * @returns {Promise<Buffer>}
   */
  async fetchTargetUsers() {
    const arrayBuff = await this.client.rest.get(Routes.inviteTargetUsers(this.code));

    return Buffer.from(arrayBuff);
  }

  /**
   * Get status of the job processing target users of this invite
   *
   * @returns {Promise<TargetUsersJobStatusForInvite>}
   */
  async fetchTargetUsersJobStatus() {
    const job = await this.client.rest.get(Routes.inviteTargetUsersJobStatus(this.code));
    return _transformAPIInviteTargetUsersJobStatus(job);
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
      roles: 'roles',
    });
  }
}

exports.GuildInvite = GuildInvite;
