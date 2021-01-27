'use strict';

const Emoji = require('./Emoji');

/**
 * Parent class for {@link ServerEmoji} and {@link ServerPreviewEmoji}.
 * @extends {Emoji}
 * @abstract
 */
class BaseServerEmoji extends Emoji {
  constructor(client, data, server) {
    super(client, data);

    /**
     * The server this emoji is a part of
     * @type {Server|ServerPreview}
     */
    this.server = server;

    this.requiresColons = null;
    this.managed = null;
    this.available = null;

    /**
     * Array of role ids this emoji is active for
     * @name BaseServerEmoji#_roles
     * @type {Snowflake[]}
     * @private
     */
    Object.defineProperty(this, '_roles', { value: [], writable: true });

    this._patch(data);
  }

  _patch(data) {
    if (data.name) this.name = data.name;

    if (typeof data.require_colons !== 'undefined') {
      /**
       * Whether or not this emoji requires colons surrounding it
       * @type {?boolean}
       */
      this.requiresColons = data.require_colons;
    }

    if (typeof data.managed !== 'undefined') {
      /**
       * Whether this emoji is managed by an external service
       * @type {?boolean}
       */
      this.managed = data.managed;
    }

    if (typeof data.available !== 'undefined') {
      /**
       * Whether this emoji is available
       * @type {?boolean}
       */
      this.available = data.available;
    }

    if (data.roles) this._roles = data.roles;
  }
}

module.exports = BaseServerEmoji;
