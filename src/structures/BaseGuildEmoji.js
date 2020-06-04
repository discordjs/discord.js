'use strict';

const Emoji = require('./Emoji');

/**
 * Parent class for {@link GuildEmoji} and {@link GuildPreviewEmoji}.
 * @extends {Emoji}
 */
class BaseGuildEmoji extends Emoji {
  constructor(client, data, guild) {
    super(client, data);

    /**
     * The guild this emoji is a part of
     * @type {Guild|GuildPreview}
     */
    this.guild = guild;

    /**
     * Array of role ids this emoji is active for
     * @name BaseGuildEmoji#_roles
     * @type {Snowflake[]}
     * @private
     */
    Object.defineProperty(this, '_roles', { value: [], writable: true });

    this._patch(data);
  }

  _patch(data) {
    if (data.name) this.name = data.name;

    /**
     * Whether or not this emoji requires colons surrounding it
     * @type {boolean}
     * @name GuildEmoji#requiresColons
     */
    if (typeof data.require_colons !== 'undefined') this.requiresColons = data.require_colons;

    /**
     * Whether this emoji is managed by an external service
     * @type {boolean}
     * @name GuildEmoji#managed
     */
    if (typeof data.managed !== 'undefined') this.managed = data.managed;

    /**
     * Whether this emoji is available
     * @type {boolean}
     * @name GuildEmoji#available
     */
    if (typeof data.available !== 'undefined') this.available = data.available;

    if (data.roles) this._roles = data.roles;
  }
}

module.exports = BaseGuildEmoji;
