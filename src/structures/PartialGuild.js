/*
{ splash: null,
     id: '123123123',
     icon: '123123123',
     name: 'name' }
*/

/**
 * Represents a Guild that the client only has limited information for - e.g. from invites.
 */
class PartialGuild {
  constructor(client, data) {
    /**
     * The client that instantiated this PartialGuild
     * @type {Client}
     */
    this.client = client;
    this.setup(data);
  }

  setup(data) {
    /**
     * The hash of the guild splash image, or null if no splash (VIP only)
     * @type {?string}
     */
    this.splash = data.splash;
    /**
     * The ID of this guild
     * @type {string}
     */
    this.id = data.id;
    /**
     * The hash of this guild's icon, or null if there is none.
     * @type {?string}
     */
    this.icon = data.icon;
    /**
     * The name of this guild
     * @type {string}
     */
    this.name = data.name;
  }
}

module.exports = PartialGuild;
