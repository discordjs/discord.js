'use strict';

const { Collection } = require('@discordjs/collection');
const { makeURLSearchParams } = require('@discordjs/rest');
const { Routes } = require('discord-api-types/v10');
const CachedManager = require('./CachedManager');
const User = require('../structures/User');

/**
 * Manages API methods for users who voted on a poll and stores their cache.
 * @extends {CachedManager}
 */
class PollAnswerVoterManager extends CachedManager {
  constructor(answer, iterable) {
    super(answer.client, User, iterable);

    /**
     * The poll answer that this manager belongs to
     * @type {PollAnswer}
     */
    this.answer = answer;
  }

  /**
   * The cache of this manager
   * @type {Collection<Snowflake, User>}
   * @name PollAnswerVoterManager#cache
   */

  /**
   * Options used to fetch users who voted for this poll answer.
   * @typedef {Object} FetchPollAnswerVotersOptions
   * @property {number} [limit] The maximum amount of users to fetch
   * @property {Snowflake} [after] The user id to fetch voters after
   */

  /**
   * Fetches the users that voted on this poll answer. Resolves with a collection of users, mapped by their ids.
   * @param {FetchPollAnswerVotersOptions} [options] Options for fetching the users
   * @returns {Promise<Collection<Snowflake, User>>}
   */
  async fetch({ after, limit }) {
    const poll = this.answer.poll;
    const query = makeURLSearchParams({ limit, after });
    const data = await this.client.rest.get(Routes.pollAnswerVoters(poll.channelId, poll.messageId, this.answer.id), {
      query,
    });

    const users = new Collection();
    for (const rawUser of data) {
      const user = this.client.users._add(rawUser);
      this.cache.set(user.id, user);
      users.set(user.id, user);
    }

    this.answer.voteCount = users.size;

    return users;
  }
}

module.exports = PollAnswerVoterManager;
