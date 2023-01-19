'use strict';

const { DiscordSnowflake } = require('@sapphire/snowflake');
const { AuditLogOptionsType, AuditLogEvent } = require('discord-api-types/v10');
const AutoModerationRule = require('./AutoModerationRule');
const { GuildScheduledEvent } = require('./GuildScheduledEvent');
const Integration = require('./Integration');
const Invite = require('./Invite');
const { StageInstance } = require('./StageInstance');
const { Sticker } = require('./Sticker');
const Webhook = require('./Webhook');
const Partials = require('../util/Partials');
const { flatten } = require('../util/Util');

const Targets = {
  All: 'All',
  Guild: 'Guild',
  GuildScheduledEvent: 'GuildScheduledEvent',
  Channel: 'Channel',
  User: 'User',
  Role: 'Role',
  Invite: 'Invite',
  Webhook: 'Webhook',
  Emoji: 'Emoji',
  Message: 'Message',
  Integration: 'Integration',
  StageInstance: 'StageInstance',
  Sticker: 'Sticker',
  Thread: 'Thread',
  ApplicationCommand: 'ApplicationCommand',
  AutoModeration: 'AutoModeration',
  Unknown: 'Unknown',
};

/**
 * The target of a guild audit log entry. It can be one of:
 * * A guild
 * * A channel
 * * A user
 * * A role
 * * An invite
 * * A webhook
 * * An emoji
 * * A message
 * * An integration
 * * A stage instance
 * * A sticker
 * * A guild scheduled event
 * * A thread
 * * An application command
 * * An auto moderation rule
 * * An object with an id key if target was deleted or fake entity
 * * An object where the keys represent either the new value or the old value
 * @typedef {?(Object|Guild|BaseChannel|User|Role|Invite|Webhook|GuildEmoji|Message|Integration|StageInstance|Sticker|
 * GuildScheduledEvent|ApplicationCommand|AutoModerationRule)} AuditLogEntryTarget
 */

/**
 * The action type of an entry, e.g. `Create`. Here are the available types:
 * * Create
 * * Delete
 * * Update
 * * All
 * @typedef {string} AuditLogActionType
 */

/**
 * The target type of an entry. Here are the available types:
 * * Guild
 * * Channel
 * * User
 * * Role
 * * Invite
 * * Webhook
 * * Emoji
 * * Message
 * * Integration
 * * StageInstance
 * * Sticker
 * * Thread
 * * GuildScheduledEvent
 * * ApplicationCommandPermission
 * @typedef {string} AuditLogTargetType
 */

/**
 * Audit logs entry.
 */
class GuildAuditLogsEntry {
  /**
   * Key mirror of all available audit log targets.
   * @type {Object<string, string>}
   * @memberof GuildAuditLogsEntry
   */
  static Targets = Targets;

  constructor(guild, data, logs) {
    /**
     * The target type of this entry
     * @type {AuditLogTargetType}
     */
    this.targetType = GuildAuditLogsEntry.targetType(data.action_type);
    const targetType = this.targetType;

    /**
     * The action type of this entry
     * @type {AuditLogActionType}
     */
    this.actionType = GuildAuditLogsEntry.actionType(data.action_type);

    /**
     * The type of action that occured.
     * @type {AuditLogEvent}
     */
    this.action = data.action_type;

    /**
     * The reason of this entry
     * @type {?string}
     */
    this.reason = data.reason ?? null;

    /**
     * The user that executed this entry
     * @type {?User}
     */
    this.executor = data.user_id
      ? guild.client.options.partials.includes(Partials.User)
        ? guild.client.users._add({ id: data.user_id })
        : guild.client.users.cache.get(data.user_id)
      : null;

    /**
     * An entry in the audit log representing a specific change.
     * @typedef {Object} AuditLogChange
     * @property {string} key The property that was changed, e.g. `nick` for nickname changes
     * <warn>For application command permissions updates the key is the id of the user, channel,
     * role, or a permission constant that was updated instead of an actual property name</warn>
     * @property {*} [old] The old value of the change, e.g. for nicknames, the old nickname
     * @property {*} [new] The new value of the change, e.g. for nicknames, the new nickname
     */

    /**
     * Specific property changes
     * @type {AuditLogChange[]}
     */
    this.changes = data.changes?.map(c => ({ key: c.key, old: c.old_value, new: c.new_value })) ?? [];

    /**
     * The entry's id
     * @type {Snowflake}
     */
    this.id = data.id;

    /**
     * Any extra data from the entry
     * @type {?(Object|Role|GuildMember)}
     */
    this.extra = null;
    switch (data.action_type) {
      case AuditLogEvent.MemberPrune:
        this.extra = {
          removed: Number(data.options.members_removed),
          days: Number(data.options.delete_member_days),
        };
        break;

      case AuditLogEvent.MemberMove:
      case AuditLogEvent.MessageDelete:
      case AuditLogEvent.MessageBulkDelete:
        this.extra = {
          channel: guild.channels.cache.get(data.options.channel_id) ?? { id: data.options.channel_id },
          count: Number(data.options.count),
        };
        break;

      case AuditLogEvent.MessagePin:
      case AuditLogEvent.MessageUnpin:
        this.extra = {
          channel: guild.client.channels.cache.get(data.options.channel_id) ?? { id: data.options.channel_id },
          messageId: data.options.message_id,
        };
        break;

      case AuditLogEvent.MemberDisconnect:
        this.extra = {
          count: Number(data.options.count),
        };
        break;

      case AuditLogEvent.ChannelOverwriteCreate:
      case AuditLogEvent.ChannelOverwriteUpdate:
      case AuditLogEvent.ChannelOverwriteDelete:
        switch (data.options.type) {
          case AuditLogOptionsType.Role:
            this.extra = guild.roles.cache.get(data.options.id) ?? {
              id: data.options.id,
              name: data.options.role_name,
              type: AuditLogOptionsType.Role,
            };
            break;

          case AuditLogOptionsType.Member:
            this.extra = guild.members.cache.get(data.options.id) ?? {
              id: data.options.id,
              type: AuditLogOptionsType.Member,
            };
            break;

          default:
            break;
        }
        break;

      case AuditLogEvent.StageInstanceCreate:
      case AuditLogEvent.StageInstanceDelete:
      case AuditLogEvent.StageInstanceUpdate:
        this.extra = {
          channel: guild.client.channels.cache.get(data.options?.channel_id) ?? { id: data.options?.channel_id },
        };
        break;

      case AuditLogEvent.ApplicationCommandPermissionUpdate:
        this.extra = {
          applicationId: data.options.application_id,
        };
        break;

      case AuditLogEvent.AutoModerationBlockMessage:
      case AuditLogEvent.AutoModerationFlagToChannel:
      case AuditLogEvent.AutoModerationUserCommunicationDisabled:
        this.extra = {
          autoModerationRuleName: data.options.auto_moderation_rule_name,
          autoModerationRuleTriggerType: data.options.auto_moderation_rule_trigger_type,
        };
        break;

      default:
        break;
    }

    /**
     * The target of this entry
     * @type {?AuditLogEntryTarget}
     */
    this.target = null;
    if (targetType === Targets.Unknown) {
      this.target = this.changes.reduce((o, c) => {
        o[c.key] = c.new ?? c.old;
        return o;
      }, {});
      this.target.id = data.target_id;
      // MemberDisconnect and similar types do not provide a target_id.
    } else if (targetType === Targets.User && data.target_id) {
      this.target = guild.client.options.partials.includes(Partials.User)
        ? guild.client.users._add({ id: data.target_id })
        : guild.client.users.cache.get(data.target_id);
    } else if (targetType === Targets.Guild) {
      this.target = guild.client.guilds.cache.get(data.target_id);
    } else if (targetType === Targets.Webhook) {
      this.target =
        logs?.webhooks.get(data.target_id) ??
        new Webhook(
          guild.client,
          this.changes.reduce(
            (o, c) => {
              o[c.key] = c.new ?? c.old;
              return o;
            },
            {
              id: data.target_id,
              guild_id: guild.id,
            },
          ),
        );
    } else if (targetType === Targets.Invite) {
      let change = this.changes.find(c => c.key === 'code');
      change = change.new ?? change.old;

      this.target =
        guild.invites.cache.get(change) ??
        new Invite(
          guild.client,
          this.changes.reduce(
            (o, c) => {
              o[c.key] = c.new ?? c.old;
              return o;
            },
            { guild },
          ),
        );
    } else if (targetType === Targets.Message) {
      // Discord sends a channel id for the MessageBulkDelete action type.
      this.target =
        data.action_type === AuditLogEvent.MessageBulkDelete
          ? guild.channels.cache.get(data.target_id) ?? { id: data.target_id }
          : guild.client.users.cache.get(data.target_id);
    } else if (targetType === Targets.Integration) {
      this.target =
        logs?.integrations.get(data.target_id) ??
        new Integration(
          guild.client,
          this.changes.reduce(
            (o, c) => {
              o[c.key] = c.new ?? c.old;
              return o;
            },
            { id: data.target_id },
          ),
          guild,
        );
    } else if (targetType === Targets.Channel || targetType === Targets.Thread) {
      this.target =
        guild.channels.cache.get(data.target_id) ??
        this.changes.reduce(
          (o, c) => {
            o[c.key] = c.new ?? c.old;
            return o;
          },
          { id: data.target_id },
        );
    } else if (targetType === Targets.StageInstance) {
      this.target =
        guild.stageInstances.cache.get(data.target_id) ??
        new StageInstance(
          guild.client,
          this.changes.reduce(
            (o, c) => {
              o[c.key] = c.new ?? c.old;
              return o;
            },
            {
              id: data.target_id,
              channel_id: data.options?.channel_id,
              guild_id: guild.id,
            },
          ),
        );
    } else if (targetType === Targets.Sticker) {
      this.target =
        guild.stickers.cache.get(data.target_id) ??
        new Sticker(
          guild.client,
          this.changes.reduce(
            (o, c) => {
              o[c.key] = c.new ?? c.old;
              return o;
            },
            { id: data.target_id },
          ),
        );
    } else if (targetType === Targets.GuildScheduledEvent) {
      this.target =
        guild.scheduledEvents.cache.get(data.target_id) ??
        new GuildScheduledEvent(
          guild.client,
          this.changes.reduce(
            (o, c) => {
              o[c.key] = c.new ?? c.old;
              return o;
            },
            { id: data.target_id, guild_id: guild.id },
          ),
        );
    } else if (targetType === Targets.ApplicationCommand) {
      this.target = logs?.applicationCommands.get(data.target_id) ?? { id: data.target_id };
    } else if (targetType === Targets.AutoModeration) {
      this.target =
        guild.autoModerationRules.cache.get(data.target_id) ??
        new AutoModerationRule(
          guild.client,
          this.changes.reduce(
            (o, c) => {
              o[c.key] = c.new ?? c.old;
              return o;
            },
            { id: data.target_id, guild_id: guild.id },
          ),
          guild,
        );
    } else if (data.target_id) {
      this.target = guild[`${targetType.toLowerCase()}s`]?.cache.get(data.target_id) ?? { id: data.target_id };
    }
  }

  /**
   * Finds the target type of a guild audit log entry.
   * @param {AuditLogEvent} target The action target
   * @returns {AuditLogTargetType}
   */
  static targetType(target) {
    if (target < 10) return Targets.Guild;
    if (target < 20) return Targets.Channel;
    if (target < 30) return Targets.User;
    if (target < 40) return Targets.Role;
    if (target < 50) return Targets.Invite;
    if (target < 60) return Targets.Webhook;
    if (target < 70) return Targets.Emoji;
    if (target < 80) return Targets.Message;
    if (target < 83) return Targets.Integration;
    if (target < 86) return Targets.StageInstance;
    if (target < 100) return Targets.Sticker;
    if (target < 110) return Targets.GuildScheduledEvent;
    if (target < 120) return Targets.Thread;
    if (target < 130) return Targets.ApplicationCommand;
    if (target >= 140 && target < 150) return Targets.AutoModeration;
    return Targets.Unknown;
  }

  /**
   * Finds the action type from the guild audit log entry action.
   * @param {AuditLogEvent} action The action target
   * @returns {AuditLogActionType}
   */
  static actionType(action) {
    if (
      [
        AuditLogEvent.ChannelCreate,
        AuditLogEvent.ChannelOverwriteCreate,
        AuditLogEvent.MemberBanRemove,
        AuditLogEvent.BotAdd,
        AuditLogEvent.RoleCreate,
        AuditLogEvent.InviteCreate,
        AuditLogEvent.WebhookCreate,
        AuditLogEvent.EmojiCreate,
        AuditLogEvent.MessagePin,
        AuditLogEvent.IntegrationCreate,
        AuditLogEvent.StageInstanceCreate,
        AuditLogEvent.StickerCreate,
        AuditLogEvent.GuildScheduledEventCreate,
        AuditLogEvent.ThreadCreate,
        AuditLogEvent.AutoModerationRuleCreate,
        AuditLogEvent.AutoModerationBlockMessage,
      ].includes(action)
    ) {
      return 'Create';
    }

    if (
      [
        AuditLogEvent.ChannelDelete,
        AuditLogEvent.ChannelOverwriteDelete,
        AuditLogEvent.MemberKick,
        AuditLogEvent.MemberPrune,
        AuditLogEvent.MemberBanAdd,
        AuditLogEvent.MemberDisconnect,
        AuditLogEvent.RoleDelete,
        AuditLogEvent.InviteDelete,
        AuditLogEvent.WebhookDelete,
        AuditLogEvent.EmojiDelete,
        AuditLogEvent.MessageDelete,
        AuditLogEvent.MessageBulkDelete,
        AuditLogEvent.MessageUnpin,
        AuditLogEvent.IntegrationDelete,
        AuditLogEvent.StageInstanceDelete,
        AuditLogEvent.StickerDelete,
        AuditLogEvent.GuildScheduledEventDelete,
        AuditLogEvent.ThreadDelete,
        AuditLogEvent.AutoModerationRuleDelete,
      ].includes(action)
    ) {
      return 'Delete';
    }

    if (
      [
        AuditLogEvent.GuildUpdate,
        AuditLogEvent.ChannelUpdate,
        AuditLogEvent.ChannelOverwriteUpdate,
        AuditLogEvent.MemberUpdate,
        AuditLogEvent.MemberRoleUpdate,
        AuditLogEvent.MemberMove,
        AuditLogEvent.RoleUpdate,
        AuditLogEvent.InviteUpdate,
        AuditLogEvent.WebhookUpdate,
        AuditLogEvent.EmojiUpdate,
        AuditLogEvent.IntegrationUpdate,
        AuditLogEvent.StageInstanceUpdate,
        AuditLogEvent.StickerUpdate,
        AuditLogEvent.GuildScheduledEventUpdate,
        AuditLogEvent.ThreadUpdate,
        AuditLogEvent.ApplicationCommandPermissionUpdate,
        AuditLogEvent.AutoModerationRuleUpdate,
      ].includes(action)
    ) {
      return 'Update';
    }

    return 'All';
  }

  /**
   * The timestamp this entry was created at
   * @type {number}
   * @readonly
   */
  get createdTimestamp() {
    return DiscordSnowflake.timestampFrom(this.id);
  }

  /**
   * The time this entry was created at
   * @type {Date}
   * @readonly
   */
  get createdAt() {
    return new Date(this.createdTimestamp);
  }

  toJSON() {
    return flatten(this, { createdTimestamp: true });
  }
}

module.exports = GuildAuditLogsEntry;
