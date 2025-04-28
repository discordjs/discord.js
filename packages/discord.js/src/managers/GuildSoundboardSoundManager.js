'use strict';

const { Collection } = require('@discordjs/collection');
const { lazy } = require('@discordjs/util');
const { Routes } = require('discord-api-types/v10');
const CachedManager = require('./CachedManager.js');
const { DiscordjsTypeError, ErrorCodes } = require('../errors/index.js');
const { SoundboardSound } = require('../structures/SoundboardSound.js');
const { resolveBase64, resolveFile } = require('../util/DataResolver.js');

const fileTypeMime = lazy(() => require('magic-bytes.js').filetypemime);

/**
 * Manages API methods for Soundboard Sounds and stores their cache.
 * @extends {CachedManager}
 */
class GuildSoundboardSoundManager extends CachedManager {
  constructor(guild, iterable) {
    super(guild.client, SoundboardSound, iterable);

    /**
     * The guild this manager belongs to
     * @type {Guild}
     */
    this.guild = guild;
  }

  /**
   * The cache of Soundboard Sounds
   * @type {Collection<Snowflake, SoundboardSound>}
   * @name GuildSoundboardSoundManager#cache
   */

  _add(data, cache) {
    return super._add(data, cache, { extras: [this.guild], id: data.sound_id });
  }

  /**
   * Data that resolves to give a SoundboardSound object. This can be:
   * * A SoundboardSound object
   * * A Snowflake
   * @typedef {SoundboardSound|Snowflake} SoundboardSoundResolvable
   */

  /**
   * Resolves a SoundboardSoundResolvable to a SoundboardSound object.
   * @method resolve
   * @memberof GuildSoundboardSoundManager
   * @instance
   * @param {SoundboardSoundResolvable} soundboardSound The SoundboardSound resolvable to identify
   * @returns {?SoundboardSound}
   */

  /**
   * Resolves a {@link SoundboardSoundResolvable} to a {@link SoundboardSound} id.
   * @param {SoundboardSoundResolvable} soundboardSound The soundboard sound resolvable to resolve
   * @returns {?Snowflake}
   */
  resolveId(soundboardSound) {
    if (soundboardSound instanceof this.holds) return soundboardSound.soundId;
    if (typeof soundboardSound === 'string') return soundboardSound;
    return null;
  }

  /**
   * Options used to create a soundboard sound in a guild.
   * @typedef {Object} GuildSoundboardSoundCreateOptions
   * @property {BufferResolvable|Stream} file The file for the soundboard sound
   * @property {string} name The name for the soundboard sound
   * @property {string} [contentType] The content type for the soundboard sound file
   * @property {number} [volume] The volume (a double) for the soundboard sound, from 0 (inclusive) to 1. Defaults to 1
   * @property {Snowflake} [emojiId] The emoji id for the soundboard sound
   * @property {string} [emojiName] The emoji name for the soundboard sound
   * @property {string} [reason] The reason for creating the soundboard sound
   */

  /**
   * Creates a new guild soundboard sound.
   * @param {GuildSoundboardSoundCreateOptions} options Options for creating a guild soundboard sound
   * @returns {Promise<SoundboardSound>} The created soundboard sound
   * @example
   * // Create a new soundboard sound from a file on your computer
   * guild.soundboardSounds.create({ file: './sound.mp3', name: 'sound' })
   *   .then(sound => console.log(`Created new soundboard sound with name ${sound.name}!`))
   *   .catch(console.error);
   */
  async create({ contentType, emojiId, emojiName, file, name, reason, volume }) {
    const resolvedFile = await resolveFile(file);

    const resolvedContentType = contentType ?? resolvedFile.contentType ?? fileTypeMime()(resolvedFile.data)[0];

    const sound = resolveBase64(resolvedFile.data, resolvedContentType);

    const body = { emoji_id: emojiId, emoji_name: emojiName, name, sound, volume };

    const soundboardSound = await this.client.rest.post(Routes.guildSoundboardSounds(this.guild.id), {
      body,
      reason,
    });

    return this._add(soundboardSound);
  }

  /**
   * Data for editing a soundboard sound.
   * @typedef {Object} GuildSoundboardSoundEditOptions
   * @property {string} [name] The name of the soundboard sound
   * @property {?number} [volume] The volume (a double) of the soundboard sound, from 0 (inclusive) to 1
   * @property {?Snowflake} [emojiId] The emoji id of the soundboard sound
   * @property {?string} [emojiName] The emoji name of the soundboard sound
   * @property {string} [reason] The reason for editing the soundboard sound
   */

  /**
   * Edits a soundboard sound.
   * @param {SoundboardSoundResolvable} soundboardSound The soundboard sound to edit
   * @param {GuildSoundboardSoundEditOptions} [options={}] The new data for the soundboard sound
   * @returns {Promise<SoundboardSound>}
   */
  async edit(soundboardSound, options = {}) {
    const soundId = this.resolveId(soundboardSound);

    if (!soundId) throw new DiscordjsTypeError(ErrorCodes.InvalidType, 'soundboardSound', 'SoundboardSoundResolvable');

    const { emojiId, emojiName, name, reason, volume } = options;

    const body = { emoji_id: emojiId, emoji_name: emojiName, name, volume };

    const data = await this.client.rest.patch(Routes.guildSoundboardSound(this.guild.id, soundId), {
      body,
      reason,
    });

    const existing = this.cache.get(soundId);

    if (existing) {
      const clone = existing._clone();

      clone._patch(data);
      return clone;
    }

    return this._add(data);
  }

  /**
   * Deletes a soundboard sound.
   * @param {SoundboardSoundResolvable} soundboardSound The soundboard sound to delete
   * @param {string} [reason] Reason for deleting this soundboard sound
   * @returns {Promise<void>}
   */
  async delete(soundboardSound, reason) {
    const soundId = this.resolveId(soundboardSound);

    if (!soundId) throw new DiscordjsTypeError(ErrorCodes.InvalidType, 'soundboardSound', 'SoundboardSoundResolvable');

    await this.client.rest.delete(Routes.guildSoundboardSound(this.guild.id, soundId), { reason });
  }

  /**
   * Options used to fetch a soundboard sound.
   * @typedef {BaseFetchOptions} FetchSoundboardSoundOptions
   * @property {SoundboardSoundResolvable} soundboardSound The soundboard sound to fetch
   */

  /**
   * Options used to fetch soundboard sounds from Discord
   * @typedef {Object} FetchGuildSoundboardSoundsOptions
   * @property {boolean} [cache] Whether to cache the fetched soundboard sounds
   */

  /* eslint-disable max-len */
  /**
   * Obtains one or more soundboard sounds from Discord, or the soundboard sound cache if they're already available.
   * @param {SoundboardSoundResolvable|FetchSoundboardSoundOptions|FetchGuildSoundboardSoundsOptions} [options] Options for fetching soundboard sound(s)
   * @returns {Promise<SoundboardSound|Collection<Snowflake, SoundboardSound>>}
   * @example
   * // Fetch a single soundboard sound
   * guild.soundboardSounds.fetch('222078108977594368')
   *   .then(sound => console.log(`The soundboard sound name is: ${sound.name}`))
   *   .catch(console.error);
   * @example
   * // Fetch all soundboard sounds from the guild
   * guild.soundboardSounds.fetch()
   *   .then(sounds => console.log(`There are ${sounds.size} soundboard sounds.`))
   *   .catch(console.error);
   */
  /* eslint-enable max-len */
  async fetch(options) {
    if (!options) return this._fetchMany();
    const { cache, force, soundboardSound } = options;
    const resolvedSoundboardSound = this.resolveId(soundboardSound ?? options);
    if (resolvedSoundboardSound) return this._fetchSingle({ cache, force, soundboardSound: resolvedSoundboardSound });
    return this._fetchMany({ cache });
  }

  async _fetchSingle({ cache, force, soundboardSound } = {}) {
    if (!force) {
      const existing = this.cache.get(soundboardSound);
      if (existing) return existing;
    }

    const data = await this.client.rest.get(Routes.guildSoundboardSound(this.guild.id, soundboardSound));
    return this._add(data, cache);
  }

  async _fetchMany({ cache } = {}) {
    const data = await this.client.rest.get(Routes.guildSoundboardSounds(this.guild.id));

    return data.items.reduce((coll, sound) => coll.set(sound.sound_id, this._add(sound, cache)), new Collection());
  }
}

exports.GuildSoundboardSoundManager = GuildSoundboardSoundManager;
