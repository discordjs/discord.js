'use strict';

const { userMention } = require('@discordjs/formatters');
const { calculateUserDefaultAvatarIndex } = require('@discordjs/rest');
const { DiscordSnowflake } = require('@sapphire/snowflake');
const { Base } = require('./Base.js');
const { UserFlagsBitField } = require('../util/UserFlagsBitField.js');

/**
 * Represents a user on Discord.
 * @extends {Base}
 */
class User extends Base {
  constructor(client, data) {
    super(client);

    /**
     * The user's id
     * @type {Snowflake}
     */
    this.id = data.id;

    this.bot = null;

    this.system = null;

    this.flags = null;

    this._patch(data);
  }

  _patch(data) {
    if ('username' in data) {
      /**
       * The username of the user
       * @type {?string}
       */
      this.username = data.username;
    } else {
      this.username ??= null;
    }

    if ('global_name' in data) {
      /**
       * The global name of this user
       * @type {?string}
       */
      this.globalName = data.global_name;
    } else {
      this.globalName ??= null;
    }

    if ('bot' in data) {
      /**
       * Whether or not the user is a bot
       * @type {?boolean}
       */
      this.bot = Boolean(data.bot);
    } else if (!this.partial && typeof this.bot !== 'boolean') {
      this.bot = false;
    }

    if ('discriminator' in data) {
      /**
       * The discriminator of this user
       * <info>`'0'`, or a 4-digit stringified number if they're using the legacy username system</info>
       * @type {?string}
       */
      this.discriminator = data.discriminator;
    } else {
      this.discriminator ??= null;
    }

    if ('avatar' in data) {
      /**
       * The user avatar's hash
       * @type {?string}
       */
      this.avatar = data.avatar;
    } else {
      this.avatar ??= null;
    }

    if ('banner' in data) {
      /**
       * The user banner's hash
       * <info>The user must be force fetched for this property to be present or be updated</info>
       * @type {?string}
       */
      this.banner = data.banner;
    } else if (this.banner !== null) {
      this.banner ??= undefined;
    }

    if ('accent_color' in data) {
      /**
       * The base 10 accent color of the user's banner
       * <info>The user must be force fetched for this property to be present or be updated</info>
       * @type {?number}
       */
      this.accentColor = data.accent_color;
    } else if (this.accentColor !== null) {
      this.accentColor ??= undefined;
    }

    if ('system' in data) {
      /**
       * Whether the user is an Official Discord System user (part of the urgent message system)
       * @type {?boolean}
       */
      this.system = Boolean(data.system);
    } else if (!this.partial && typeof this.system !== 'boolean') {
      this.system = false;
    }

    if ('public_flags' in data) {
      /**
       * The flags for this user
       * @type {?UserFlagsBitField}
       */
      this.flags = new UserFlagsBitField(data.public_flags);
    }

    /**
     * @typedef {Object} AvatarDecorationData
     * @property {string} asset The avatar decoration hash
     * @property {Snowflake} skuId The id of the avatar decoration's SKU
     */

    if (data.avatar_decoration_data) {
      /**
       * The user avatar decoration's data
       * @type {?AvatarDecorationData}
       */
      this.avatarDecorationData = {
        asset: data.avatar_decoration_data.asset,
        skuId: data.avatar_decoration_data.sku_id,
      };
    } else {
      this.avatarDecorationData = null;
    }
  }

  /**
   * Whether this User is a partial
   * @type {boolean}
   * @readonly
   */
  get partial() {
    return typeof this.username !== 'string';
  }

  /**
   * The timestamp the user was created at
   * @type {number}
   * @readonly
   */
  get createdTimestamp() {
    return DiscordSnowflake.timestampFrom(this.id);
  }

  /**
   * The time the user was created at
   * @type {Date}
   * @readonly
   */
  get createdAt() {
    return new Date(this.createdTimestamp);
  }

  /**
   * A link to the user's avatar.
   * @param {ImageURLOptions} [options={}] Options for the image URL
   * @returns {?string}
   */
  avatarURL(options = {}) {
    return this.avatar && this.client.rest.cdn.avatar(this.id, this.avatar, options);
  }

  /**
   * A link to the user's avatar decoration.
   * @returns {?string}
   */
  avatarDecorationURL() {
    return this.avatarDecorationData ? this.client.rest.cdn.avatarDecoration(this.avatarDecorationData.asset) : null;
  }

  /**
   * A link to the user's default avatar
   * @type {string}
   * @readonly
   */
  get defaultAvatarURL() {
    const index = this.discriminator === '0' ? calculateUserDefaultAvatarIndex(this.id) : this.discriminator % 5;
    return this.client.rest.cdn.defaultAvatar(index);
  }

  /**
   * A link to the user's avatar if they have one.
   * Otherwise a link to their default avatar will be returned.
   * @param {ImageURLOptions} [options={}] Options for the image URL
   * @returns {string}
   */
  displayAvatarURL(options) {
    return this.avatarURL(options) ?? this.defaultAvatarURL;
  }

  /**
   * The hexadecimal version of the user accent color, with a leading hash
   * <info>The user must be force fetched for this property to be present</info>
   * @type {?string}
   * @readonly
   */
  get hexAccentColor() {
    if (typeof this.accentColor !== 'number') return this.accentColor;
    return `#${this.accentColor.toString(16).padStart(6, '0')}`;
  }

  /**
   * A link to the user's banner. See {@link User#banner} for more info
   * @param {ImageURLOptions} [options={}] Options for the image URL
   * @returns {?string}
   */
  bannerURL(options = {}) {
    return this.banner && this.client.rest.cdn.banner(this.id, this.banner, options);
  }

  /**
   * The tag of this user
   * <info>This user's username, or their legacy tag (e.g. `hydrabolt#0001`)
   * if they're using the legacy username system</info>
   * @type {?string}
   * @readonly
   */
  get tag() {
    return typeof this.username === 'string'
      ? this.discriminator === '0'
        ? this.username
        : `${this.username}#${this.discriminator}`
      : null;
  }

  /**
   * The global name of this user, or their username if they don't have one
   * @type {?string}
   * @readonly
   */
  get displayName() {
    return this.globalName ?? this.username;
  }

  /**
   * The DM between the client's user and this user
   * @type {?DMChannel}
   * @readonly
   */
  get dmChannel() {
    return this.client.users.dmChannel(this.id);
  }

  /**
   * Creates a DM channel between the client and the user.
   * @param {boolean} [force=false] Whether to skip the cache check and request the API
   * @returns {Promise<DMChannel>}
   */
  createDM(force = false) {
    return this.client.users.createDM(this.id, { force });
  }

  /**
   * Deletes a DM channel (if one exists) between the client and the user. Resolves with the channel if successful.
   * @returns {Promise<DMChannel>}
   */
  deleteDM() {
    return this.client.users.deleteDM(this.id);
  }

  /**
   * Sends a message to this user.
   * @param {string|MessagePayload|MessageCreateOptions} options The options to provide
   * @returns {Promise<Message>}
   * @example
   * // Send a direct message
   * user.send('Hello!')
   *   .then(message => console.log(`Sent message: ${message.content} to ${user.tag}`))
   *   .catch(console.error);
   */
  async send(options) {
    const dmChannel = await this.createDM();

    return this.client.channels.createMessage(dmChannel, options);
  }

  /**
   * Checks if the user is equal to another.
   * It compares id, username, discriminator, avatar, banner, accent color, and bot flags.
   * It is recommended to compare equality by using `user.id === user2.id` unless you want to compare all properties.
   * @param {User} user User to compare with
   * @returns {boolean}
   */
  equals(user) {
    return (
      user &&
      this.id === user.id &&
      this.username === user.username &&
      this.discriminator === user.discriminator &&
      this.globalName === user.globalName &&
      this.avatar === user.avatar &&
      this.flags?.bitfield === user.flags?.bitfield &&
      this.banner === user.banner &&
      this.accentColor === user.accentColor &&
      this.avatarDecorationData?.asset === user.avatarDecorationData?.asset &&
      this.avatarDecorationData?.skuId === user.avatarDecorationData?.skuId
    );
  }

  /**
   * Compares the user with an API user object
   * @param {APIUser} user The API user object to compare
   * @returns {boolean}
   * @private
   */
  _equals(user) {
    return (
      user &&
      this.id === user.id &&
      this.username === user.username &&
      this.discriminator === user.discriminator &&
      this.globalName === user.global_name &&
      this.avatar === user.avatar &&
      this.flags?.bitfield === user.public_flags &&
      ('banner' in user ? this.banner === user.banner : true) &&
      ('accent_color' in user ? this.accentColor === user.accent_color : true) &&
      ('avatar_decoration_data' in user
        ? this.avatarDecorationData?.asset === user.avatar_decoration_data?.asset &&
          this.avatarDecorationData?.skuId === user.avatar_decoration_data?.sku_id
        : true)
    );
  }

  /**
   * Fetches this user.
   * @param {boolean} [force=true] Whether to skip the cache check and request the API
   * @returns {Promise<User>}
   */
  fetch(force = true) {
    return this.client.users.fetch(this.id, { force });
  }

  /**
   * When concatenated with a string, this automatically returns the user's mention instead of the User object.
   * @returns {string}
   * @example
   * // Logs: Hello from <@123456789012345678>!
   * console.log(`Hello from ${user}!`);
   */
  toString() {
    return userMention(this.id);
  }

  toJSON(...props) {
    const json = super.toJSON(
      {
        createdTimestamp: true,
        defaultAvatarURL: true,
        hexAccentColor: true,
        tag: true,
      },
      ...props,
    );
    json.avatarURL = this.avatarURL();
    json.displayAvatarURL = this.displayAvatarURL();
    json.bannerURL = this.banner ? this.bannerURL() : this.banner;
    return json;
  }
}

exports.User = User;
