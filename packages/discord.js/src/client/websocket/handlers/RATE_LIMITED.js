'use strict';

const process = require('node:process');
const { GatewayOpcodes } = require('discord-api-types/v10');
const { Events } = require('../../../util/Events.js');

const emittedWarning = false;

module.exports = (client, { d: data }) => {
  /**
   * Represents metadata for a gateway request guild member rate limit event
   *
   * @typedef {Object} GatewayRequestGuildMemberRateLimitMetaData
   * @property {Guild} guild The guild related to the rate limited request
   * @property {string} nonce The nonce used in the request that was rate limited
   */

  /**
   * Represents additional metadata for a gateway rate limited event
   *
   * @typedef {GatewayRequestGuildMemberRateLimitMetaData} GatewayRateLimitMetaData
   */

  /**
   * Represents the information provided by Discord when a gateway ratelimit is hit.
   *
   * @typedef {Object} GatewayRateLimitData
   * @property {GatewayOpCodes} opcode The opcode of the event that triggered the rate limit
   * @property {number} retryAfter The number of seconds to wait before submitting another request
   * @property {GatewayRateLimitMetaData} [meta] Additional metadata for the event that was rate limited
   */

  let meta;
  switch (data.opcode) {
    case GatewayOpcodes.RequestGuildMembers: {
      const guild = client.guilds.cache.get(data.meta.guild_id);

      meta = {
        guild,
        nonce: data.nonce,
      };

      break;
    }

    default: {
      if (!emittedWarning) {
        process.emitWarning(`Received a rate limit for an unknown opcode: ${data.opcode}`);
      }
    }
  }

  /**
   * Emitted whenever a gateway rate limit is hit.
   *
   * @event Client#rateLimited
   * @param {GatewayRateLimitData} rateLimitData The data related to the rate limit
   */
  client.emit(Events.RateLimited, {
    opcode: data.opcode,
    retryAfter: data.retry_after,
    meta,
  });
};
