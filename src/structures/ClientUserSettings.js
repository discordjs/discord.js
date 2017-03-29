const Constants = require('../util/Constants');
const Util = require('../util/Util');

class ClientUserSettings {
  constructor(user, data) {
    this.user = user;
    this.patch(data);
  }

  patch(data) {
    const has = data.hasOwnProperty.bind(data);
    /**
     * Automatically convert emoticons in your messages to emoji.
     * For example, when you type `:-)` Discord will convert it to 😃
     * @type {boolean}
     */
    if (has('convert_emoticons')) this.convertEmoticons = data.convertEmoticons;

    /**
     * If new guilds should automatically disable DMs between you and its members
     * @type {boolean}
     */
    if (has('default_guilds_restricted')) this.defaultGuildsRestricted = data.default_guilds_restricted;

    /**
     * Automatically detect accounts from services like Steam and Blizzard when you open the Discord client
     * @type {boolean}
     */
    if (has('detect_platform_accounts')) this.detectPlatformAccounts = data.detect_platform_accounts;

    /**
     * Developer Mode exposes context menu items helpful for people writing bots using the Discord API
     * @type {boolean}
     */
    if (has('developer_mode')) this.developerMode = data.developer_mode;

    /**
     * Allow playback and usage of the `/tts` command
     * @type {boolean}
     */
    if (has('enable_tts_command')) this.enableTTSCommand = data.enable_tts_command;

    /**
     * The theme of the client. Either `light` or `dark`
     * @type {String}
     */
    if (has('theme')) this.theme = data.theme;

    /**
     * Last status set in the client
     * @type {PresenceStatus}
     */
    if (has('status')) this.status = data.status;

    /**
     * Display currently running game as status message
     */
    if (has('show_current_game')) this.showCurrentGame = data.show_current_game;

    /**
     * Display images, videos, and lolcats when uploaded directly to Discord
     * @type {boolean}
     */
    if (has('inline_attachment_media')) this.inlineAttachmentMedia = data.inline_attachment_media;

    /**
     * Display images, videos, and lolcats when uploaded posted as links in chat
     * @type {boolean}
     */
    if (has('inline_embed_media')) this.inlineEmbedMedia = data.inline_embed_media;

    /**
     * Language the Discord client will use.
     * Formatted as <ISO-639-1 (lower case)> <dash> <ISO-3166 ALPHA 2 (upper case)>
     * Example: `en-US`
     * @type {string}
     */
    if (has('locale')) this.locale = data.locale;

    /**
     * Display messages in compact mode
     * @type {boolean}
     */
    if (has('message_display_compact')) this.messageDisplayCompact = data.message_display_compact;

    /**
     * Show emoji reactions on messages
     * @type {boolean}
     */
    if (has('render_reactions')) this.renderReactions = data.render_reactions;

    /**
     * Array of snowflake IDs for guilds, in the order they appear in the Discord client
     * @type {Snowflake[]}
     */
    if (has('guild_positions')) this.guildPositions = data.guild_positions;

    /**
     * Array of snowflake IDs for guilds which you will not recieve DMs from
     * @type {Snowflake[]}
     */
    if (has('restricted_guilds')) this.restrictedGuilds = data.restricted_guilds;

    if (has('explicit_content_filter')) {
      /**
       * Safe direct messaging; force people's messages with images to be scanned before they are sent to you
       * one of `DISABLED`, `NON_FRIENDS`, `FRIENDS_AND_NON_FRIENDS`
       * @type {string}
       */
      this.explicitContentFilter = Constants.ExplicitContentFilterTypes[data.explicit_content_filter];
    }

    if (has('friend_source_flags')) {
      const flags = data.friend_source_flags;
      /**
       * Who can add you as a friend
       * @type {Object}
       */
      this.friendSources = {
        all: flags.all || false,
        mutualGuilds: flags.all ? true : flags.mutual_guilds || false,
        mutualFriends: flags.all ? true : flags.mutualFriends || false,
      };
    }
  }

  /**
   * Update a specific property of of user settings
   * @param {string} name Name of property
   * @param {value} value Value to patch
   * @returns {Promise<Object>}
   */
  update(name, value) {
    return this.user.client.rest.methods.patchUserSettings({ [name]: value });
  }

  /**
   * @param {Guild} guild Guild to move
   * @param {number} position Absolute or relative position
   * @param {boolean} [relative=false] Whether to position relatively or absolutely
   * @returns {Promise<Guild>}
   */
  setGuildPosition(guild, position, relative) {
    const temp = Object.assign([], this.guildPositions);
    Util.moveElementInArray(temp, guild.id, position, relative);
    return this.update('guild_positions', temp).then(() => guild);
  }

  addRestrictedGuild(guild) {
    const temp = Object.assign([], this.restrictedGuilds);
    if (temp.includes(guild.id)) return Promise.reject(new Error('Guild is already restricted'));
    temp.push(guild.id);
    return this.update('restricted_guilds', temp).then(() => guild);
  }

  removeRestrictedGuild(guild) {
    const temp = Object.assign([], this.restrictedGuilds);
    const index = temp.indexOf(guild.id);
    if (index < 0) return Promise.reject(new Error('Guild is not restricted'));
    temp.splice(index, 1);
    return this.update('restricted_guilds', temp).then(() => guild);
  }
}

module.exports = ClientUserSettings;
