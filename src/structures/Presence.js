const { ActivityFlags, Endpoints } = require('../util/Constants');
const ReactionEmoji = require('./ReactionEmoji');

/**
 * The status of this presence:
 * * **`online`** - user is online
 * * **`idle`** - user is AFK
 * * **`offline`** - user is offline or invisible
 * * **`dnd`** - user is in Do Not Disturb
 * @typedef {string} PresenceStatus
 */

/**
 * The status of this presence:
 * * **`online`** - user is online
 * * **`idle`** - user is AFK
 * * **`dnd`** - user is in Do Not Disturb
 * @typedef {string} ClientPresenceStatus
 */

/**
 * Represents a user's presence.
 */
class Presence {
  constructor(data = {}, client) {
    /**
     * The client that instantiated this
     * @name Presence#client
     * @type {Client}
     * @readonly
     */
    Object.defineProperty(this, 'client', { value: client });

    this.update(data);
  }

  update(data) {
    /**
     * The status of this presence:
     * @type {PresenceStatus}
     */
    this.status = data.status || this.status || 'offline';

    /**
     * The game that the user is playing
     * @type {?Game}
     * @deprecated
     */
    this.game = data.game ? new Game(data.game, this) : null;

    if (data.activities) {
      /**
       * The activities of this presence
       * @type {Game[]}
       */
      this.activities = data.activities.map(activity => new Game(activity, this));
    } else if (data.activity || data.game) {
      this.activities = [new Game(data.activity || data.game, this)];
    } else {
      this.activities = [];
    }

    /**
     * The devices this presence is on
     * @type {?Object}
     * @property {?ClientPresenceStatus} web The current presence in the web application
     * @property {?ClientPresenceStatus} mobile The current presence in the mobile application
     * @property {?ClientPresenceStatus} desktop The current presence in the desktop application
     */
    this.clientStatus = data.client_status || null;
  }

  /**
   * Whether this presence is equal to another
   * @param {Presence} presence The presence to compare with
   * @returns {boolean}
   */
  equals(presence) {
    return this === presence || (
      presence &&
      this.status === presence.status &&
      this.activities.length === presence.activities.length &&
      this.activities.every((activity, index) => activity.equals(presence.activities[index])) &&
      this.clientStatus.web === presence.clientStatus.web &&
      this.clientStatus.mobile === presence.clientStatus.mobile &&
      this.clientStatus.desktop === presence.clientStatus.desktop
    );
  }
}

/**
 * Represents a game that is part of a user's presence.
 */
class Game {
  constructor(data, presence) {
    Object.defineProperty(this, 'presence', { value: presence });

    /**
     * The name of the game being played
     * @type {string}
     */
    this.name = data.name;

    /**
     * The type of the game status, its possible values:
     * - 0: Playing
     * - 1: Streaming
     * - 2: Listening
     * - 3: Watching
     * @type {number}
     */
    this.type = data.type;

    /**
     * If the game is being streamed, a link to the stream
     * @type {?string}
     */
    this.url = data.url || null;

    /**
     * Details about the activity
     * @type {?string}
     */
    this.details = data.details || null;

    /**
     * State of the activity
     * @type {?string}
     */
    this.state = data.state || null;

    /**
     * Application ID associated with this activity
     * @type {?Snowflake}
     */
    this.applicationID = data.application_id || null;

    /**
     * Timestamps for the activity
     * @type {?Object}
     * @prop {?Date} start When the activity started
     * @prop {?Date} end When the activity will end
     */
    this.timestamps = data.timestamps ? {
      start: data.timestamps.start ? new Date(Number(data.timestamps.start)) : null,
      end: data.timestamps.end ? new Date(Number(data.timestamps.end)) : null,
    } : null;

    /**
     * Party of the activity
     * @type {?Object}
     * @prop {?string} id ID of the party
     * @prop {number[]} size Size of the party as `[current, max]`
     */
    this.party = data.party || null;

    /**
     * Assets for rich presence
     * @type {?RichPresenceAssets}
     */
    this.assets = data.assets ? new RichPresenceAssets(this, data.assets) : null;

    if (data.emoji) {
      /**
       * Emoji for a custom activity
       * <warn>There is no `reaction` property for this emoji.</warn>
       * @type {?ReactionEmoji}
       */
      this.emoji = new ReactionEmoji({ message: { client: this.presence.client } }, data.emoji);
      this.emoji.reaction = null;
    } else {
      this.emoji = null;
    }


    /**
     * Creation date of the activity
     * @type {number}
     */
    this.createdTimestamp = new Date(data.created_at).getTime();

    this.syncID = data.sync_id;
    this._flags = data.flags;
  }

  /**
   * The time the activity was created at
   * @type {Date}
   * @readonly
   */
  get createdAt() {
    return new Date(this.createdTimestamp);
  }

  /**
   * Flags that describe the activity
   * @type {ActivityFlags[]}
   */
  get flags() {
    const flags = [];
    for (const [name, flag] of Object.entries(ActivityFlags)) {
      if ((this._flags & flag) === flag) flags.push(name);
    }
    return flags;
  }

  /**
   * Whether or not the game is being streamed
   * @type {boolean}
   * @readonly
   */
  get streaming() {
    return this.type === 1;
  }

  /**
   * When concatenated with a string, this automatically returns the game's name instead of the Game object.
   * @returns {string}
   */
  toString() {
    return this.name;
  }

  /**
   * Whether this game is equal to another game
   * @param {Game} game The game to compare with
   * @returns {boolean}
   */
  equals(game) {
    return this === game || (
      game &&
      this.name === game.name &&
      this.type === game.type &&
      this.url === game.url
    );
  }
}

/**
 * Assets for a rich presence
 */
class RichPresenceAssets {
  constructor(game, assets) {
    Object.defineProperty(this, 'game', { value: game });

    /**
     * Hover text for the large image
     * @type {?string}
     */
    this.largeText = assets.large_text || null;

    /**
     * Hover text for the small image
     * @type {?string}
     */
    this.smallText = assets.small_text || null;

    /**
     * ID of the large image asset
     * @type {?Snowflake}
     */
    this.largeImage = assets.large_image || null;

    /**
     * ID of the small image asset
     * @type {?Snowflake}
     */
    this.smallImage = assets.small_image || null;
  }

  /**
   * The URL of the small image asset
   * @type {?string}
   * @readonly
   */
  get smallImageURL() {
    if (!this.smallImage) return null;
    return Endpoints.CDN(this.game.presence.client.options.http.cdn)
      .AppAsset(this.game.applicationID, this.smallImage);
  }

  /**
   * The URL of the large image asset
   * @type {?string}
   * @readonly
   */
  get largeImageURL() {
    if (!this.largeImage) return null;
    if (/^spotify:/.test(this.largeImage)) {
      return `https://i.scdn.co/image/${this.largeImage.slice(8)}`;
    } else if (/^twitch:/.test(this.largeImage)) {
      return `https://static-cdn.jtvnw.net/previews-ttv/live_user_${this.largeImage.slice(7)}.png`;
    }
    return Endpoints.CDN(this.game.presence.client.options.http.cdn)
      .AppAsset(this.game.applicationID, this.largeImage);
  }
}

exports.Presence = Presence;
exports.Game = Game;
exports.RichPresenceAssets = RichPresenceAssets;
