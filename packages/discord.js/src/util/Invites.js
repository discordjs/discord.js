import { InviteType } from 'discord-api-types/v10';
import { BaseInvite } from '../structures/BaseInvite.js';
import { GroupDMInvite } from '../structures/GroupDMInvite.js';
import { GuildInvite } from '../structures/GuildInvite.js';

/**
 * Any invite.
 *
 * @typedef {GuildInvite|GroupDMInvite} Invite
 */

const InviteTypeToClass = {
  [InviteType.Guild]: GuildInvite,
  [InviteType.GroupDM]: GroupDMInvite,
};

/**
 * Creates an invite.
 *
 * @param {Client} client The client
 * @param {Object} data The data
 * @returns {BaseInvite}
 * @ignore
 */
export function createInvite(client, data) {
  return new (InviteTypeToClass[data.type] ?? BaseInvite)(client, data);
}
