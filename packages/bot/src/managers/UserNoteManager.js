'use strict';

const { Collection } = require('@discordjs/collection');
const { BaseManager } = require('./BaseManager.js');

/**
 * Manages user notes and stores their cache.
 *
 * @extends {BaseManager}
 */
class UserNoteManager extends BaseManager {
  constructor(client) {
    super(client);

    /**
     * Cache of notes keyed by user id
     *
     * @type {Collection<Snowflake, string>}
     */
    this.cache = new Collection();
  }

  /**
   * Reload notes cache from READY payload
   *
   * @param {Object} data Notes object from READY ({userId: "note text"})
   * @private
   */
  _reload(data = {}) {
    this.cache = new Collection(Object.entries(data));
    return this;
  }

  /**
   * Update a note for a user
   *
   * @param {string} userId The user id
   * @param {?string} note The note text (null to delete)
   * @returns {Promise<UserNoteManager>}
   */
  async updateNote(userId, note = null) {
    await this.client.rest.put(`/users/@me/notes/${userId}`, { body: { note } });
    if (note) {
      this.cache.set(userId, note);
    } else {
      this.cache.delete(userId);
    }

    return this;
  }

  /**
   * Fetch a note for a user
   *
   * @param {string} userId The user id
   * @param {Object} [options] Fetch options
   * @param {boolean} [options.cache=true] Whether to cache the result
   * @param {boolean} [options.force=false] Whether to skip the cache check
   * @returns {Promise<string>}
   */
  async fetch(userId, { cache = true, force = false } = {}) {
    if (!force) {
      const existing = this.cache.get(userId);
      if (existing) return existing;
    }

    const data = await this.client.rest.get(`/users/@me/notes/${userId}`).catch(() => ({ note: '' }));
    const note = data.note ?? '';
    if (cache) this.cache.set(userId, note);
    return note;
  }
}

exports.UserNoteManager = UserNoteManager;
