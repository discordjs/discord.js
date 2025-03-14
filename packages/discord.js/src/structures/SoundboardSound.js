'use strict';

const { DiscordSnowflake } = require('@sapphire/snowflake');
const { Base } = require('./Base.js');
const { DiscordjsError, ErrorCodes } = require('../errors/index.js');

/**
 * Represents a soundboard sound.
 * @extends {Base}
 */
class SoundboardSound extends Base {
  constructor(client, data) {
    super(client);

    /**
     * The id of the soundboard sound
     * @type {Snowflake|string}
     */
    this.soundId = data.sound_id;

    this._patch(data);
  }

  _patch(data) {
    if ('available' in data) {
      /**
       * Whether this soundboard sound is available
       * @type {?boolean}
       */
      this.available = data.available;
    } else {
      this.available ??= null;
    }

    if ('name' in data) {
      /**
       * The name of the soundboard sound
       * @type {?string}
       */
      this.name = data.name;
    } else {
      this.name ??= null;
    }

    if ('volume' in data) {
      /**
       * The volume of the soundboard sound, from 0 to 1
       * @type {?number}
       */
      this.volume = data.volume;
    } else {
      this.volume ??= null;
    }

    if ('emoji_id' in data) {
      /**
       * The emoji id of the soundboard sound
       * @type {?Snowflake}
       */
      this.emojiId = data.emoji_id;
    } else {
      this.emojiId ??= null;
    }

    if ('emoji_name' in data) {
      /**
       * The emoji name of the soundboard sound
       * @type {?string}
       */
      this.emojiName = data.emoji_name;
    } else {
      this.emojiName ??= null;
    }

    if ('guild_id' in data) {
      /**
       * The guild id of the soundboard sound
       * @type {?Snowflake}
       */
      this.guildId = data.guild_id;
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
   * The timestamp the soundboard sound was created at
   * @type {number}
   * @readonly
   */
  get createdTimestamp() {
    return DiscordSnowflake.timestampFrom(this.soundId);
  }

  /**
   * The time the sticker was created at
   * @type {Date}
   * @readonly
   */
  get createdAt() {
    return new Date(this.createdTimestamp);
  }

  /**
   * A link to the soundboard sound
   * @type {string}
   * @readonly
   */
  get url() {
    return this.client.rest.cdn.soundboardSound(this.soundId);
  }

  /**
   * Edits the soundboard sound.
   * @param {GuildSoundboardSoundEditOptions} options The options to provide
   * @returns {Promise<SoundboardSound>}
   * @example
   * // Update the name of a soundboard sound
   * soundboardSound.edit({ name: 'new name' })
   *   .then(sound => console.log(`Updated the name of the soundboard sound to ${sound.name}`))
   *   .catch(console.error);
   */
  async edit(options) {
    if (!this.guild) throw new DiscordjsError(ErrorCodes.NotGuildSoundboardSound, 'edited');

    return this.guild.soundboardSounds.edit(this, options);
  }

  /**
   * Deletes the soundboard sound.
   * @param {string} [reason] Reason for deleting this soundboard sound
   * @returns {Promise<SoundboardSound>}
   * @example
   * // Delete a message
   * soundboardSound.delete()
   *   .then(sound => console.log(`Deleted soundboard sound ${sound.name}`))
   *   .catch(console.error);
   */
  async delete(reason) {
    if (!this.guild) throw new DiscordjsError(ErrorCodes.NotGuildSoundboardSound, 'deleted');

    await this.guild.soundboardSounds.delete(this, reason);

    return this;
  }

  /**
   * Whether this soundboard sound is the same as another one.
   * @param {SoundboardSound|APISoundboardSound} other The soundboard sound to compare it to
   * @returns {boolean}
   */
  equals(other) {
    if (other instanceof SoundboardSound) {
      return (
        this.soundId === other.soundId &&
        this.available === other.available &&
        this.name === other.name &&
        this.volume === other.volume &&
        this.emojiId === other.emojiId &&
        this.emojiName === other.emojiName &&
        this.guildId === other.guildId &&
        this.user?.id === other.user?.id
      );
    }

    return (
      this.soundId === other.sound_id &&
      this.available === other.available &&
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
