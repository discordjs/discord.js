'use strict';

const BaseGuild = require('./BaseGuild');
const PermissionsBitField = require('../util/PermissionsBitField');

/**
 * A partial guild received when using {@link GuildManager#fetch} to fetch multiple guilds.
 * @extends {BaseGuild}
 */
class OAuth2Guild extends BaseGuild {
  constructor(client, data) {
    super(client, data);

    /**
     * Whether the client user is the owner of the guild
     * @type {boolean}
     */
    this.owner = data.owner;

    /**
     * The permissions that the client user has in this guild
     * @type {Readonly<PermissionsBitField>}
     */
    this.permissions = new PermissionsBitField(BigInt(data.permissions)).freeze();
  }
}

module.exports = OAuth2Guild;
