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
     * The Client that instantiated this PartialGuild
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
     * @type {string}
     */
    this.id = data.id;

    /**
     * The name of this guild
     * @type {string}
     */
    this.name = data.name;

    /**
     * The hash of this guild's icon, or null if there is none.
     * @type {?string}
     */
    this.icon = data.icon;

    /**
     * The hash of the guild splash image, or null if no splash (VIP only)
     * @type {?string}
     */
    this.splash = data.splash;
  }
}

module.exports = PartialGuild;
