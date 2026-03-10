'use strict';

const { Collection } = require('@discordjs/collection');
const { BaseManager } = require('./BaseManager.js');

// Relationship types: 1=friend, 2=blocked, 3=pending_incoming, 4=pending_outgoing
const RelationshipTypes = {
  FRIEND: 1,
  BLOCKED: 2,
  PENDING_INCOMING: 3,
  PENDING_OUTGOING: 4,
};

/**
 * Manages relationships (friends, blocked, pending) and stores their cache.
 *
 * @extends {BaseManager}
 */
class RelationshipManager extends BaseManager {
  constructor(client) {
    super(client);

    /**
     * Cache of relationship types keyed by user id
     *
     * @type {Collection<Snowflake, number>}
     */
    this.cache = new Collection();

    /**
     * Friend nicknames keyed by user id
     *
     * @type {Collection<Snowflake, string>}
     */
    this.friendNicknames = new Collection();

    /**
     * Relationship creation dates keyed by user id
     *
     * @type {Collection<Snowflake, Date>}
     */
    this.sinceCache = new Collection();
  }

  /**
   * Friends collection (relationship type 1)
   *
   * @type {Collection<Snowflake, User>}
   * @readonly
   */
  get friendCache() {
    const users = this.cache
      .filter(value => value === RelationshipTypes.FRIEND)
      .map((_, key) => [key, this.client.users.cache.get(key)]);
    return new Collection(users);
  }

  /**
   * Blocked users collection (relationship type 2)
   *
   * @type {Collection<Snowflake, User>}
   * @readonly
   */
  get blockedCache() {
    const users = this.cache
      .filter(value => value === RelationshipTypes.BLOCKED)
      .map((_, key) => [key, this.client.users.cache.get(key)]);
    return new Collection(users);
  }

  /**
   * Incoming friend requests (relationship type 3)
   *
   * @type {Collection<Snowflake, User>}
   * @readonly
   */
  get incomingCache() {
    const users = this.cache
      .filter(value => value === RelationshipTypes.PENDING_INCOMING)
      .map((_, key) => [key, this.client.users.cache.get(key)]);
    return new Collection(users);
  }

  /**
   * Outgoing friend requests (relationship type 4)
   *
   * @type {Collection<Snowflake, User>}
   * @readonly
   */
  get outgoingCache() {
    const users = this.cache
      .filter(value => value === RelationshipTypes.PENDING_OUTGOING)
      .map((_, key) => [key, this.client.users.cache.get(key)]);
    return new Collection(users);
  }

  /**
   * Populate cache from READY payload relationships array
   *
   * @param {Array} relationships Array of relationship objects from READY
   * @private
   */
  _setup(relationships) {
    if (!Array.isArray(relationships)) return;
    for (const rel of relationships) {
      this.cache.set(rel.id, rel.type);
      this.friendNicknames.set(rel.id, rel.nickname);
      this.sinceCache.set(rel.id, new Date(rel.since || 0));
    }
  }

  /**
   * Fetch all relationships from the API
   *
   * @returns {Promise<RelationshipManager>}
   */
  async fetch() {
    const data = await this.client.rest.get('/users/@me/relationships');
    this._setup(data);
    return this;
  }

  /**
   * Send a friend request to a user
   *
   * @param {string} userId The user id to send the request to
   * @returns {Promise<void>}
   */
  async sendFriendRequest(userId) {
    await this.client.rest.put(`/users/@me/relationships/${userId}`, { body: {} });
  }

  /**
   * Accept a friend request or add a friend
   *
   * @param {string} userId The user id
   * @returns {Promise<void>}
   */
  async addFriend(userId) {
    await this.client.rest.put(`/users/@me/relationships/${userId}`, {
      body: { confirm_stranger_request: true },
    });
  }

  /**
   * Delete a relationship (unfriend, unblock, cancel request)
   *
   * @param {string} userId The user id
   * @returns {Promise<void>}
   */
  async deleteRelationship(userId) {
    await this.client.rest.delete(`/users/@me/relationships/${userId}`);
  }

  /**
   * Block a user
   *
   * @param {string} userId The user id
   * @returns {Promise<void>}
   */
  async addBlocked(userId) {
    await this.client.rest.put(`/users/@me/relationships/${userId}`, {
      body: { type: RelationshipTypes.BLOCKED },
    });
  }

  /**
   * Set a friend's nickname
   *
   * @param {string} userId The user id
   * @param {?string} nickname The nickname to set (null to clear)
   * @returns {Promise<void>}
   */
  async setNickname(userId, nickname = null) {
    await this.client.rest.patch(`/users/@me/relationships/${userId}`, {
      body: { nickname: typeof nickname === 'string' ? nickname : null },
    });
    if (nickname) {
      this.friendNicknames.set(userId, nickname);
    } else {
      this.friendNicknames.delete(userId);
    }
  }

  toJSON() {
    return this.cache.map((value, key) => ({
      id: key,
      type: value,
      nickname: this.friendNicknames.get(key),
      since: this.sinceCache.get(key)?.toISOString(),
    }));
  }
}

exports.RelationshipManager = RelationshipManager;
exports.RelationshipTypes = RelationshipTypes;
