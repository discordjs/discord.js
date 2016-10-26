/**
 * Represents a User's presence
 */
class Presence {
  constructor(data) {
    if (!data) {
      data = {};
    }
    /**
     * The status of the presence:
     *
     * * **`online`** - user is online
     * * **`offline`** - user is offline or invisible
     * * **`idle`** - user is AFK
     * * **`dnd`** - user is in Do not Disturb
     * @type {string}
     */
    this.status = data.status || 'offline';

    /**
     * The game that the user is playing, `null` if they aren't playing a game.
     * @type {?Game}
     */
    this.game = data.game ? new Game(data.game) : null;
  }

  update(data) {
    this.status = data.status || this.status;
    this.game = data.game ? new Game(data.game) : null;
  }

  /**
   * Whether this presence is equal to another
   * @param {Presence} other the presence to compare
   * @returns {boolean}
   */
  equals(other) {
    return (
      other &&
      this.status === other.status &&
      this.game ? this.game.equals(other.game) : !other.game
    );
  }
}

/**
 * Represents a Game that is part of a User's presence.
 */
class Game {
  constructor(data) {
    /**
     * The name of the game being played
     * @type {string}
     */
    this.name = data.name;

    /**
     * The type of the game status
     * @type {number}
     */
    this.type = data.type;

    /**
     * If the game is being streamed, a link to the stream
     * @type {?string}
     */
    this.url = data.url || null;
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
   * Whether this game is equal to another game
   * @param {Game} other the other game to compare
   * @returns {boolean}
   */
  equals(other) {
    return (
      other &&
      this.name === other.name &&
      this.type === other.type &&
      this.url === other.url
    );
  }
}

exports.Presence = Presence;
exports.Game = Game;
