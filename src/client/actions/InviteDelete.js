'use strict';

const Action = require('./Action');
const Invite = require('../../structures/Invite');
const { Events } = require('../../util/Constants');

class InviteDeleteAction extends Action {
  handle(data) {
    const client = this.client;
    const inviteData = Object.assign(data, {
      guild: client.guilds.get(data.guild_id),
      channel: client.channels.get(data.channel_id),
    });
    const invite = new Invite(client, inviteData);

    /**
     * Emitted when an invite is deleted.
     * @event Client#inviteDelete
     * @param {Invite} invite The invite that was deleted
     */
    client.emit(Events.INVITE_DELETE, invite);
  }
}

module.exports = InviteDeleteAction;
