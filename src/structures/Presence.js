const { ActivityFlags, Endpoints } = require('../util/Constants');

/**
 * The status of this presence:
 *
 * * **`online`** - user is online
 * * **`idle`** - user is AFK
 * * **`offline`** - user is offline or invisible
 * * **`dnd`** - user is in Do Not Disturb
 * @typedef {string} PresenceStatus
 */

/**
 * Represents a user's presence.
 */
class Presence {
  constructor(data = {}, client) {
    Object.defineProperty(this, 'client', { value: client });

    /**
     * The status of this presence:
     * @type {PresenceStatus}
     */
    this.status = data.status || 'offline';

    /**
     * The game that the user is playing
     * @type {?Game}
     */
    this.game = data.game ? new Game(data.game, this) : null;

    /**
     * The devices this presence is on
     * @type {?object}
     * @property {PresenceStatus} web
     * @property {PresenceStatus} mobile
     * @property {PresenceStatus} desktop
     */
    this.clientStatus = data.client_status || null;
  }

  update(data) {
    this.status = data.status || this.status;
    this.game = data.game ? new Game(data.game, this) : null;
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
      (this.game ? this.game.equals(presence.game) : !presence.game) &&
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

    this.syncID = data.sync_id;
    this._flags = data.flags;
  }

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
    }
    return Endpoints.CDN(this.game.presence.client.options.http.cdn)
      .AppAsset(this.game.applicationID, this.largeImage);
  }
}

exports.Presence = Presence;
exports.Game = Game;
exports.RichPresenceAssets = RichPresenceAssets;
