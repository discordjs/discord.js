'use strict';

const { Collection } = require('@discordjs/collection');
const { FormattingPatterns } = require('discord-api-types/v10');
const { flatten } = require('../util/Util');

/**
 * Keeps track of mentions in a {@link Message}.
 */
class MessageMentions {
  /**
   * A regular expression that matches `@everyone` and `@here`.
   * The `mention` group property is present on the `exec` result of this expression.
   * @type {RegExp}
   * @memberof MessageMentions
   */
  static EveryonePattern = /@(?<mention>everyone|here)/;

  /**
   * A regular expression that matches user mentions like `<@81440962496172032>`.
   * The `id` group property is present on the `exec` result of this expression.
   * @type {RegExp}
   * @memberof MessageMentions
   */
  static UsersPattern = FormattingPatterns.UserWithOptionalNickname;

  /**
   * A regular expression that matches role mentions like `<@&297577916114403338>`.
   * The `id` group property is present on the `exec` result of this expression.
   * @type {RegExp}
   * @memberof MessageMentions
   */
  static RolesPattern = FormattingPatterns.Role;

  /**
   * A regular expression that matches channel mentions like `<#222079895583457280>`.
   * The `id` group property is present on the `exec` result of this expression.
   * @type {RegExp}
   * @memberof MessageMentions
   */
  static ChannelsPattern = FormattingPatterns.Channel;

  constructor(message, users, roles, everyone, crosspostedChannels, repliedUser) {
    /**
     * The client the message is from
     * @type {Client}
     * @readonly
     */
    Object.defineProperty(this, 'client', { value: message.client });

    /**
     * The guild the message is in
     * @type {?Guild}
     * @readonly
     */
    Object.defineProperty(this, 'guild', { value: message.guild });

    /**
     * The initial message content
     * @type {string}
     * @readonly
     * @private
     */
    Object.defineProperty(this, '_content', { value: message.content });

    /**
     * Whether `@everyone` or `@here` were mentioned
     * @type {boolean}
     */
    this.everyone = Boolean(everyone);

    if (users) {
      if (users instanceof Collection) {
        /**
         * Any users that were mentioned
         * <info>Order as received from the API, not as they appear in the message content</info>
         * @type {Collection<Snowflake, User>}
         */
        this.users = new Collection(users);
      } else {
        this.users = new Collection();
        for (const mention of users) {
          if (mention.member && message.guild) {
            message.guild.members._add(Object.assign(mention.member, { user: mention }));
          }
          const user = message.client.users._add(mention);
          this.users.set(user.id, user);
        }
      }
    } else {
      this.users = new Collection();
    }

    if (roles instanceof Collection) {
      /**
       * Any roles that were mentioned
       * <info>Order as received from the API, not as they appear in the message content</info>
       * @type {Collection<Snowflake, Role>}
       */
      this.roles = new Collection(roles);
    } else if (roles) {
      this.roles = new Collection();
      const guild = message.guild;
      if (guild) {
        for (const mention of roles) {
          const role = guild.roles.cache.get(mention);
          if (role) this.roles.set(role.id, role);
        }
      }
    } else {
      this.roles = new Collection();
    }

    /**
     * Cached members for {@link MessageMentions#members}
     * @type {?Collection<Snowflake, GuildMember>}
     * @private
     */
    this._members = null;

    /**
     * Cached channels for {@link MessageMentions#channels}
     * @type {?Collection<Snowflake, BaseChannel>}
     * @private
     */
    this._channels = null;

    /**
     * Crossposted channel data.
     * @typedef {Object} CrosspostedChannel
     * @property {Snowflake} channelId The mentioned channel's id
     * @property {Snowflake} guildId The id of the guild that has the channel
     * @property {ChannelType} type The channel's type
     * @property {string} name The channel's name
     */

    if (crosspostedChannels) {
      if (crosspostedChannels instanceof Collection) {
        /**
         * A collection of crossposted channels
         * <info>Order as received from the API, not as they appear in the message content</info>
         * @type {Collection<Snowflake, CrosspostedChannel>}
         */
        this.crosspostedChannels = new Collection(crosspostedChannels);
      } else {
        this.crosspostedChannels = new Collection();
        for (const d of crosspostedChannels) {
          this.crosspostedChannels.set(d.id, {
            channelId: d.id,
            guildId: d.guild_id,
            type: d.type,
            name: d.name,
          });
        }
      }
    } else {
      this.crosspostedChannels = new Collection();
    }

    /**
     * The author of the message that this message is a reply to
     * @type {?User}
     */
    this.repliedUser = repliedUser ? this.client.users._add(repliedUser) : null;
  }

  /**
   * Any members that were mentioned (only in {@link Guild}s)
   * <info>Order as received from the API, not as they appear in the message content</info>
   * @type {?Collection<Snowflake, GuildMember>}
   * @readonly
   */
  get members() {
    if (this._members) return this._members;
    if (!this.guild) return null;
    this._members = new Collection();
    this.users.forEach(user => {
      const member = this.guild.members.resolve(user);
      if (member) this._members.set(member.user.id, member);
    });
    return this._members;
  }

  /**
   * Any channels that were mentioned
   * <info>Order as they appear first in the message content</info>
   * @type {Collection<Snowflake, BaseChannel>}
   * @readonly
   */
  get channels() {
    if (this._channels) return this._channels;
    this._channels = new Collection();
    const globalChannelsPatern = new RegExp(this.constructor.ChannelsPattern.source, 'g');
    let matches;

    while ((matches = globalChannelsPatern.exec(this._content)) !== null) {
      const channel = this.client.channels.cache.get(matches.groups.id);
      if (channel) this._channels.set(channel.id, channel);
    }

    return this._channels;
  }

  /**
   * Options used to check for a mention.
   * @typedef {Object} MessageMentionsHasOptions
   * @property {boolean} [ignoreDirect=false] Whether to ignore direct mentions to the item
   * @property {boolean} [ignoreRoles=false] Whether to ignore role mentions to a guild member
   * @property {boolean} [ignoreRepliedUser=false] Whether to ignore replied user mention to an user
   * @property {boolean} [ignoreEveryone=false] Whether to ignore `@everyone`/`@here` mentions
   */

  /**
   * Checks if a user, guild member, thread member, role, or channel is mentioned.
   * Takes into account user mentions, role mentions, channel mentions,
   * replied user mention, and `@everyone`/`@here` mentions.
   * @param {UserResolvable|RoleResolvable|ChannelResolvable} data The User/Role/Channel to check for
   * @param {MessageMentionsHasOptions} [options] The options for the check
   * @returns {boolean}
   */
  has(data, { ignoreDirect = false, ignoreRoles = false, ignoreRepliedUser = false, ignoreEveryone = false } = {}) {
    const user = this.client.users.resolve(data);
    const role = this.guild?.roles.resolve(data);
    const channel = this.client.channels.resolve(data);

    if (!ignoreRepliedUser && this.users.has(this.repliedUser?.id) && this.repliedUser?.id === user?.id) return true;
    if (!ignoreDirect) {
      if (this.users.has(user?.id)) return true;
      if (this.roles.has(role?.id)) return true;
      if (this.channels.has(channel?.id)) return true;
    }
    if (user && !ignoreEveryone && this.everyone) return true;
    if (!ignoreRoles) {
      const member = this.guild?.members.resolve(data);
      if (member) {
        for (const mentionedRole of this.roles.values()) if (member.roles.cache.has(mentionedRole.id)) return true;
      }
    }

    return false;
  }

  toJSON() {
    return flatten(this, {
      members: true,
      channels: true,
    });
  }
}

module.exports = MessageMentions;
