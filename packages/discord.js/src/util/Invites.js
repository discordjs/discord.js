'use strict';

const { InviteType } = require('discord-api-types/v10');
const { BaseInvite } = require('../structures/BaseInvite.js');
const { GroupDMInvite } = require('../structures/GroupDMInvite.js');
const { GuildInvite } = require('../structures/GuildInvite.js');

/**
 * Any invite.
 * @typedef {GuildInvite|GroupDMInvite} Invite
 */

const InviteTypeToClass = {
  [InviteType.Guild]: GuildInvite,
  [InviteType.GroupDM]: GroupDMInvite,
};

/**
 * Creates an invite.
 * @param {Client} client The client
 * @param {Object} data The data
 * @returns {BaseInvite}
 * @ignore
 */
function createInvite(client, data) {
  return new (InviteTypeToClass[data.type] ?? BaseInvite)(client, data);
}

exports.createInvite = createInvite;
