'use strict';

const EventEmitter = require('node:events');
const { REST } = require('@discordjs/rest');
const { DiscordjsTypeError, ErrorCodes } = require('../errors');
const Options = require('../util/Options');
const { mergeDefault, flatten } = require('../util/Util');

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

    /**
     * The options the client was instantiated with
     * @type {ClientOptions}
     */
    this.options = mergeDefault(Options.createDefault(), {
      ...options,
      rest: {
        ...options.rest,
        userAgentAppendix: options.rest?.userAgentAppendix
          ? `${Options.userAgentAppendix} ${options.rest.userAgentAppendix}`
          : undefined,
      },
    });

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
    this.rest.requestManager.clearHashSweeper();
    this.rest.requestManager.clearHandlerSweeper();
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
}

module.exports = BaseClient;

/**
 * @external REST
 * @see {@link https://discord.js.org/docs/packages/rest/stable/REST:Class}
 */
