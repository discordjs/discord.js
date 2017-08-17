/*
{ splash: null,
     id: '123123123',
     icon: '123123123',
     name: 'name' }
*/

/**
 * Represents a guild that the client only has limited information for - e.g. from invites.
 */
class PartialGuild {
  constructor(client, data) {
    /**
     * The client that instantiated this PartialGuild
     * @name PartialGuild#client
     * @type {Client}
     * @readonly
     */
    Object.defineProperty(this, 'client', { value: client });

    this.setup(data);
  }

  setup(data) {
    /**
     * The ID of this guild
     * @type {Snowflake}
     */
    this.id = data.id;

    /**
     * The name of this guild
     * @type {string}
     */
    this.name = data.name;

    /**
     * The hash of this guild's icon
     * @type {?string}
     */
    this.icon = data.icon;

    /**
     * The hash of the guild splash image (VIP only)
     * @type {?string}
     */
    this.splash = data.splash;
       
    /**
     * Gets the URL to this guild's icon
     * @param {Object} [options={}] Options for the icon url
     * @param {string} [options.format='webp'] One of `webp`, `png`, `jpg`
     * @param {number} [options.size=128] One of `128`, '256', `512`, `1024`, `2048`
     * @returns {?string}
     */
    iconURL({ format, size } = {}) {
      if (!this.icon) return null;
      return Constants.Endpoints.CDN(this.client.options.http.cdn).Icon(this.id, this.icon, format, size);
    }
  }
}

module.exports = PartialGuild;
