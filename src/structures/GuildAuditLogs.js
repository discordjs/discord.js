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

class GuildAuditLogs {
  constructor(guild, data) {
    if (data.users) for (const user of data.users) guild.client.dataManager.newUser(user);
    if (data.channels) {
      for (const channel of data.channels) guild.client.dataManager.newChannel(channel, guild);
    }

    this.entries = [];
    for (const entry of data.audit_log_entries) this.entries.push(new GuildAuditLogsEntry(guild, entry));
  }

  static rootType(type) {
    if (type < 10) return Targets.GUILD;
    if (type < 20) return Targets.CHANNEL;
    if (type < 30) return Targets.USER;
    if (type < 40) return Targets.ROLE;
    if (type < 50) return Targets.INVITE;
    if (type < 60) return Targets.WEBHOOK;
    if (type < 70) return Targets.EMOJI;
    return null;
  }

  static rootMethod(method) {
    if ([
      Actions.CHANNEL_CREATE,
      Actions.CHANNEL_OVERWRITE_CREATE,
      Actions.MEMBER_BAN_REMOVE,
      Actions.ROLE_CREATE,
      Actions.INVITE_CREATE,
      Actions.WEBHOOK_CREATE,
      Actions.EMOJI_CREATE,
    ].includes(method)) return 'CREATE';

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
    ].includes(method)) return 'DELETE';

    if ([
      Actions.GUILD_UPDATE,
      Actions.CHANNEL_UPDATE,
      Actions.CHANNEL_OVERWRITE_UPDATE,
      Actions.MEMBER_UPDATE,
      Actions.ROLE_UPDATE,
      Actions.INVITE_UPDATE,
      Actions.WEBHOOK_UPDATE,
      Actions.EMOJI_UPDATE,
    ].includes(method)) return 'UPDATE';
    
    // Discord client source suggests I should return 'UPDATE' if nothing else matches
    return 'UPDATE';
  }
}

GuildAuditLogs.Actions = Actions;
GuildAuditLogs.Targets = Targets;

class GuildAuditLogsEntry {
  constructor(guild, data) {
    const root = GuildAuditLogs.rootType(data.action_type);
    /**
     * Root action type of this entry
     * @type {string}
     */
    this.root = root;

    /**
     * Specific action type of this entry
     * @type {string}
     */
    this.type = Object.keys(Actions).find(k => Actions[k] === data.action_type);

    /**
     * Method of this entry
     * @type {string}
     */
    this.method = GuildAuditLogs.rootMethod(data.action_type);

    if (['USER', 'GUILD'].includes(root)) {
      /**
       * Target of this entry
       * @type {Guild|User|Role|Invite|Webhook|Emoji}
       */
      this.target = guild.client[`${root.toLowerCase()}s`].get(data.target_id);
    } else {
      this.target = guild[`${root.toLowerCase()}s`].get(data.target_id);
    }

    /**
     * User that executed this entry
     * @type {User}
     */
    this.executor = guild.client.users.get(data.user_id);

    /**
     * Specific property changes
     * @type {Object[]}
     */
    this.changes = data.changes ? data.changes.map(c => ({ name: c.key, old: c.old_value, new: c.new_value })) : null;

    /**
     * ID of this entry
     * @type {Snowflake}
     */
    this.id = data.id;
  }
}

module.exports = GuildAuditLogs;
