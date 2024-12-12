'use strict';

const Base = require('./Base');

/**
 * Represents a soundboard sound.
 * @extends {Base}
 */
class SoundboardSound extends Base {
  constructor(client, data) {
    super(client);

    /**
     * The id of the soundboard sound
     * @type {Snowflake|number}
     */
    this.soundId = data.sound_id;

    this._patch(data);
  }

  _patch(data) {
    /**
     * Whether this soundboard sound is available
     * @type {boolean}
     */
    this.available = data.available;

    /**
     * The name of the soundboard sound
     * @type {string}
     */
    this.name = data.name;

    /**
     * The volume of the soundboard sound
     * @type {number}
     */
    this.volume = data.volume;

    if ('emoji_id' in data) {
      /**
       * The emoji id of the soundboard sound
       * @type {?Snowflake}
       */
      this.emojiId = data.emojiId;
    } else {
      this.emojiId ??= null;
    }

    if ('emoji_name' in data) {
      /**
       * The emoji name of the soundboard sound
       * @type {?string}
       */
      this.emojiName = data.emojiName;
    } else {
      this.emojiName ??= null;
    }

    if ('guild_id' in data) {
      /**
       * The guild id of the soundboard sound
       * @type {?Snowflake}
       */
      this.guildId = data.guildId;
    } else {
      this.guildId ??= null;
    }

    if ('user' in data) {
      /**
       * The user who created this soundboard sound
       * @type {?User}
       */
      this.user = this.client.users._add(data.user);
    } else {
      this.user ??= null;
    }
  }

  /**
   * The guild this soundboard sound is part of
   * @type {?Guild}
   * @readonly
   */
  get guild() {
    return this.client.guilds.resolve(this.guildId);
  }

  /**
   * Whether this soundboard sound is the same as another one.
   * @param {SoundboardSound|APISoundboardSound} other The soundboard sound to compare it to
   * @returns {boolean}
   */
  equals(other) {
    if (other instanceof SoundboardSound) {
      return (
        this.id === other.id &&
        this.name === other.name &&
        this.volume === other.volume &&
        this.emojiId === other.emojiId &&
        this.emojiName === other.emojiName &&
        this.guildId === other.guildId &&
        this.user?.id === other.user?.id
      );
    }

    return (
      this.id === other.sound_id &&
      this.name === other.name &&
      this.volume === other.volume &&
      this.emojiId === other.emoji_id &&
      this.emojiName === other.emoji_name &&
      this.guildId === other.guild_id &&
      this.user?.id === other.user?.id
    );
  }
}

exports.SoundboardSound = SoundboardSound;
