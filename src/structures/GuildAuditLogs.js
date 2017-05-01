const Collection = require('../util/Collection');

const Targets = {
  GUILD: 'GUILD',
  CHANNEL: 'CHANNEL',
  USER: 'USER',
  ROLE: 'ROLE',
  INVITE: 'INVITE',
  WEBHOOK: 'WEBHOOK',
  EMOJI: 'EMOJI',
};

const Actions = {
  GUILD_UPDATE: 1,
  CHANNEL_CREATE: 10,
  CHANNEL_UPDATE: 11,
  CHANNEL_DELETE: 12,
  CHANNEL_OVERWRITE_CREATE: 13,
  CHANNEL_OVERWRITE_UPDATE: 14,
  CHANNEL_OVERWRITE_DELETE: 15,
  MEMBER_KICK: 20,
  MEMBER_PRUNE: 21,
  MEMBER_BAN_ADD: 22,
  MEMBER_BAN_REMOVE: 23,
  MEMBER_UPDATE: 24,
  MEMBER_ROLE_UPDATE: 25,
  ROLE_CREATE: 30,
  ROLE_UPDATE: 31,
  ROLE_DELETE: 32,
  INVITE_CREATE: 40,
  INVITE_UPDATE: 41,
  INVITE_DELETE: 42,
  WEBHOOK_CREATE: 50,
  WEBHOOK_UPDATE: 51,
  WEBHOOK_DELETE: 52,
  EMOJI_CREATE: 60,
  EMOJI_UPDATE: 61,
  EMOJI_DELETE: 62,
};


/**
 * Audit logs entries are held in this class.
 */
class GuildAuditLogs {
  constructor(guild, data) {
    if (data.users) for (const user of data.users) guild.client.dataManager.newUser(user);

    /**
     * The entries for this guild's audit logs
     * @type {Collection<Snowflake, GuildAuditLogsEntry>}
     */
    this.entries = new Collection();
    for (const item of data.audit_log_entries) {
      const entry = new GuildAuditLogsEntry(guild, item);
      this.entries.set(entry.id, entry);
    }
  }

  /**
   * Handles possible promises for entry targets.
   * @returns {GuildAuditLogs}
   */
  static build(...args) {
    return new Promise(resolve => {
      const logs = new GuildAuditLogs(...args);
      Promise.all(logs.entries.map(e => e.target)).then(() => resolve(logs));
    });
  }

  /**
   * Find target type from entry action.
   * @param {number} target The action target
   * @returns {?string}
   */
  static targetType(target) {
    if (target < 10) return Targets.GUILD;
    if (target < 20) return Targets.CHANNEL;
    if (target < 30) return Targets.USER;
    if (target < 40) return Targets.ROLE;
    if (target < 50) return Targets.INVITE;
    if (target < 60) return Targets.WEBHOOK;
    if (target < 70) return Targets.EMOJI;
    return null;
  }


  /**
   * Find action type from entry action.
   * @param {string} action The action target
   * @returns {string}
   */
  static actionType(action) {
    if ([
      Actions.CHANNEL_CREATE,
      Actions.CHANNEL_OVERWRITE_CREATE,
      Actions.MEMBER_BAN_REMOVE,
      Actions.ROLE_CREATE,
      Actions.INVITE_CREATE,
      Actions.WEBHOOK_CREATE,
      Actions.EMOJI_CREATE,
    ].includes(action)) return 'CREATE';

    if ([
      Actions.CHANNEL_DELETE,
      Actions.CHANNEL_OVERWRITE_DELETE,
      Actions.MEMBER_KICK,
      Actions.MEMBER_PRUNE,
      Actions.MEMBER_BAN_ADD,
      Actions.ROLE_DELETE,
      Actions.INVITE_DELETE,
      Actions.WEBHOOK_DELETE,
      Actions.EMOJI_DELETE,
    ].includes(action)) return 'DELETE';

    if ([
      Actions.GUILD_UPDATE,
      Actions.CHANNEL_UPDATE,
      Actions.CHANNEL_OVERWRITE_UPDATE,
      Actions.MEMBER_UPDATE,
      Actions.ROLE_UPDATE,
      Actions.INVITE_UPDATE,
      Actions.WEBHOOK_UPDATE,
      Actions.EMOJI_UPDATE,
    ].includes(action)) return 'UPDATE';

    return 'ALL';
  }
}

/**
 * Audit logs entry.
 */
class GuildAuditLogsEntry {
  constructor(guild, data) {
    const targetType = GuildAuditLogs.targetType(data.action_type);
    /**
     * The target type of this entry
     * @type {string}
     */
    this.targetType = targetType;

    /**
     * The action type of this entry
     * @type {string}
     */
    this.actionType = GuildAuditLogs.actionType(data.action_type);

    /**
     * Specific action type of this entry
     * @type {string}
     */
    this.action = Object.keys(Actions).find(k => Actions[k] === data.action_type);

    /**
     * The reason of this entry
     * @type {?string}
     */
    this.reason = data.reason || null;

    /**
     * The user that executed this entry
     * @type {User}
     */
    this.executor = guild.client.users.get(data.user_id);

    /**
     * Specific property changes
     * @type {Object[]}
     */
    this.changes = data.changes ? data.changes.map(c => ({ name: c.key, old: c.old_value, new: c.new_value })) : null;

    /**
     * The ID of this entry
     * @type {Snowflake}
     */
    this.id = data.id;

    /**
     * Any extra data from the entry
     * @type {?Object|Role|GuildMember}
     */
    this.extra = null;
    if (data.options) {
      if (data.action_type === Actions.MEMBER_PRUNE) {
        this.extra = {
          removed: data.options.members_removed,
          days: data.options.delete_member_days,
        };
      } else {
        switch (data.options.type) {
          case 'member':
            this.extra = guild.members.get(this.options.id);
            if (!this.extra) this.extra = { id: this.options.id };
            break;
          case 'role':
            this.extra = guild.roles.get(this.options.id);
            if (!this.extra) this.extra = { id: this.options.id, name: this.options.role_name };
            break;
          default:
            break;
        }
      }
    }

    if ([Targets.USER, Targets.GUILD].includes(targetType)) {
      /**
       * The target of this entry
       * @type {?Guild|User|Role|Emoji|Invite|Webhook}
       */
      this.target = guild.client[`${targetType.toLowerCase()}s`].get(data.target_id);
    } else if (targetType === Targets.WEBHOOK) {
      this.target = guild.fetchWebhooks()
        .then(hooks => {
          this.target = hooks.find(h => h.id === data.target_id);
          return this.target;
        });
    } else if (targetType === Targets.INVITE) {
      const change = this.changes.find(c => c.name === 'code');
      this.target = guild.fetchInvites()
        .then(invites => {
          this.target = invites.find(i => i.code === (change.new || change.old));
          return this.target;
        });
    } else {
      this.target = guild[`${targetType.toLowerCase()}s`].get(data.target_id);
    }
  }
}

GuildAuditLogs.Actions = Actions;
GuildAuditLogs.Targets = Targets;
GuildAuditLogs.Entry = GuildAuditLogsEntry;

module.exports = GuildAuditLogs;
