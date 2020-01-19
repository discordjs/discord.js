'use strict';

const Action = require('./Action');
const Invite = require('../../structures/Invite');
const { Events } = require('../../util/Constants');

class InviteCreateAction extends Action {
  handle(data) {
    const client = this.client;
    const inviteData = Object.assign(data, {
      guild: client.guilds.get(data.guild_id),
      channel: client.channels.get(data.channel_id),
    });
    const invite = new Invite(client, inviteData);
    /**
     * Emitted when an invite is created.
     * @event Client#inviteCreate
     * @param {Invite} invite The invite that was created
     */
    client.emit(Events.INVITE_CREATE, invite);
    return { invite };
  }
}

module.exports = InviteCreateAction;
