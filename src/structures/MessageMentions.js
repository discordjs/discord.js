const Collection = require('../util/Collection');
const { ChannelTypes } = require('../util/Constants');

/**
 * Keeps track of mentions in a {@link Message}.
 */
class MessageMentions {
  constructor(message, users, roles, everyone, crosspostedChannels) {
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
          let user = message.client.users.get(mention.id);
          if (!user) user = message.client.dataManager.newUser(mention);
          this.users.set(user.id, user);
          if (mention.member && message.guild && !message.guild.members.has(mention.id)) {
            message.guild._addMember(Object.assign(mention.member, { user }), false);
          }
        }
      }
    } else {
      this.users = new Collection();
    }

    if (roles) {
      if (roles instanceof Collection) {
        /**
         * Any roles that were mentioned
         * <info>Order as received from the API, not as they appear in the message content</
         * @type {Collection<Snowflake, Role>}
         */
        this.roles = new Collection(roles);
      } else {
        this.roles = new Collection();
        for (const mention of roles) {
          const role = message.channel.guild.roles.get(mention);
          if (role) this.roles.set(role.id, role);
        }
      }
    } else {
      this.roles = new Collection();
    }

    /**
     * Content of the message
     * @type {Message}
     * @private
     */
    this._content = message.content;

    /**
     * The client the message is from
     * @type {Client}
     * @private
     */
    this._client = message.client;

    /**
     * The guild the message is in
     * @type {?Guild}
     * @private
     */
    this._guild = message.channel.guild;

    /**
     * Cached members for {@MessageMention#members}
     * @type {?Collection<Snowflake, GuildMember>}
     * @private
     */
    this._members = null;

    /**
     * Cached channels for {@MessageMention#channels}
     * @type {?Collection<Snowflake, GuildChannel>}
     * @private
     */
    this._channels = null;

    /**
     * Crossposted channel data.
     * @typedef {Object} CrosspostedChannel
     * @property {Snowflake} channelID ID of the mentioned channel
     * @property {Snowflake} guildID ID of the guild that has the channel
     * @property {string} type Type of the channel
     * @property {string} name Name of the channel
     */

    if (crosspostedChannels) {
      if (crosspostedChannels instanceof Collection) {
        /**
        * A collection of crossposted channels
        * @type {Collection<Snowflake, CrosspostedChannel>}
        */
        this.crosspostedChannels = new Collection(crosspostedChannels);
      } else {
        this.crosspostedChannels = new Collection();
        const channelTypes = Object.keys(ChannelTypes);
        for (const d of crosspostedChannels) {
          const type = channelTypes[d.type];
          this.crosspostedChannels.set(d.id, {
            channelID: d.id,
            guildID: d.guild_id,
            type: type ? type.toLowerCase() : 'unknown',
            name: d.name,
          });
        }
      }
    } else {
      this.crosspostedChannels = new Collection();
    }
  }

  /**
   * Any members that were mentioned (only in {@link TextChannel}s)
   * <info>Order as received from the API, not as they appear in the message content</
   * @type {?Collection<Snowflake, GuildMember>}
   * @readonly
   */
  get members() {
    if (this._members) return this._members;
    if (!this._guild) return null;
    this._members = new Collection();
    this.users.forEach(user => {
      const member = this._guild.member(user);
      if (member) this._members.set(member.user.id, member);
    });
    return this._members;
  }

  /**
   * Any channels that were mentioned
   * <info>Order as they appear first in the message content</info>
   * @type {Collection<Snowflake, GuildChannel>}
   * @readonly
   */
  get channels() {
    if (this._channels) return this._channels;
    this._channels = new Collection();
    let matches;
    while ((matches = this.constructor.CHANNELS_PATTERN.exec(this._content)) !== null) {
      const chan = this._client.channels.get(matches[1]);
      if (chan) this._channels.set(chan.id, chan);
    }
    return this._channels;
  }
}

/**
 * Regular expression that globally matches `@everyone` and `@here`
 * @type {RegExp}
 */
MessageMentions.EVERYONE_PATTERN = /@(everyone|here)/g;

/**
 * Regular expression that globally matches user mentions like `<@81440962496172032>`
 * @type {RegExp}
 */
MessageMentions.USERS_PATTERN = /<@!?[0-9]+>/g;

/**
 * Regular expression that globally matches role mentions like `<@&297577916114403338>`
 * @type {RegExp}
 */
MessageMentions.ROLES_PATTERN = /<@&[0-9]+>/g;

/**
 * Regular expression that globally matches channel mentions like `<#222079895583457280>`
 * @type {RegExp}
 */
MessageMentions.CHANNELS_PATTERN = /<#([0-9]+)>/g;

module.exports = MessageMentions;
