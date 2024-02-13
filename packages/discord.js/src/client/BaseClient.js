'use strict';

const EventEmitter = require('node:events');
const { REST } = require('@discordjs/rest');
const { Routes } = require('discord-api-types/v10');
const { DiscordjsTypeError, ErrorCodes } = require('../errors');
const Options = require('../util/Options');
const { flatten } = require('../util/Util');

/**
 * The base class for all clients.
 * @extends {EventEmitter}
 */
class BaseClient extends EventEmitter {
  constructor(options = {}) {
    super({ captureRejections: true });

    if (typeof options !== 'object' || options === null) {
      throw new DiscordjsTypeError(ErrorCodes.InvalidType, 'options', 'object', true);
    }

    const defaultOptions = Options.createDefault();
    /**
     * The options the client was instantiated with
     * @type {ClientOptions}
     */
    this.options = {
      ...defaultOptions,
      ...options,
      presence: {
        ...defaultOptions.presence,
        ...options.presence,
      },
      sweepers: {
        ...defaultOptions.sweepers,
        ...options.sweepers,
      },
      ws: {
        ...defaultOptions.ws,
        ...options.ws,
      },
      rest: {
        ...defaultOptions.rest,
        ...options.rest,
        userAgentAppendix: options.rest?.userAgentAppendix
          ? `${Options.userAgentAppendix} ${options.rest.userAgentAppendix}`
          : Options.userAgentAppendix,
      },
    };

    /**
     * The REST manager of the client
     * @type {REST}
     */
    this.rest = new REST(this.options.rest);
  }

  /**
   * Destroys all assets used by the base client.
   * @returns {void}
   */
  destroy() {
    this.rest.clearHashSweeper();
    this.rest.clearHandlerSweeper();
  }

  /**
   * Options used for deleting a webhook.
   * @typedef {Object} WebhookDeleteOptions
   * @property {string} [token] Token of the webhook
   * @property {string} [reason] The reason for deleting the webhook
   */

  /**
   * Deletes a webhook.
   * @param {Snowflake} id The webhook's id
   * @param {WebhookDeleteOptions} [options] Options for deleting the webhook
   * @returns {Promise<void>}
   */
  async deleteWebhook(id, { token, reason } = {}) {
    await this.rest.delete(Routes.webhook(id, token), { auth: !token, reason });
  }

  /**
   * Increments max listeners by one, if they are not zero.
   * @private
   */
  incrementMaxListeners() {
    const maxListeners = this.getMaxListeners();
    if (maxListeners !== 0) {
      this.setMaxListeners(maxListeners + 1);
    }
  }

  /**
   * Decrements max listeners by one, if they are not zero.
   * @private
   */
  decrementMaxListeners() {
    const maxListeners = this.getMaxListeners();
    if (maxListeners !== 0) {
      this.setMaxListeners(maxListeners - 1);
    }
  }

  toJSON(...props) {
    return flatten(this, ...props);
  }

  async [Symbol.asyncDispose]() {
    await this.destroy();
  }
}

module.exports = BaseClient;

/**
 * @external REST
 * @see {@link https://discord.js.org/docs/packages/rest/stable/REST:Class}
 */
