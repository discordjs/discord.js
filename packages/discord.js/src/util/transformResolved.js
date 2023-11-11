'use strict';

const { Collection } = require('@discordjs/collection');
const Attachment = require('../structures/Attachment');

/**
 * Supportive data for interaction resolved data.
 * @typedef {Object} SupportingInteractionResolvedData
 * @property {Client} client The client
 * @property {Guild} [guild] A guild
 * @property {Channel} [channel] A channel
 * @private
 */

/**
 * Transforms the resolved data received from the API.
 * @param {SupportingInteractionResolvedData} supportingData Data to support the transformation
 * @param {APIInteractionDataResolved} [data] The received resolved objects
 * @returns {CommandInteractionResolvedData}
 * @ignore
 */
function transformResolved(
  { client, guild, channel },
  { members, users, channels, roles, messages, attachments } = {},
) {
  const result = {};

  if (members) {
    result.members = new Collection();
    for (const [id, member] of Object.entries(members)) {
      const user = users[id];
      result.members.set(id, guild?.members._add({ user, ...member }) ?? member);
    }
  }

  if (users) {
    result.users = new Collection();
    for (const user of Object.values(users)) {
      result.users.set(user.id, client.users._add(user));
    }
  }

  if (roles) {
    result.roles = new Collection();
    for (const role of Object.values(roles)) {
      result.roles.set(role.id, guild?.roles._add(role) ?? role);
    }
  }

  if (channels) {
    result.channels = new Collection();
    for (const apiChannel of Object.values(channels)) {
      result.channels.set(apiChannel.id, client.channels._add(apiChannel, guild) ?? apiChannel);
    }
  }

  if (messages) {
    result.messages = new Collection();
    for (const message of Object.values(messages)) {
      result.messages.set(message.id, channel?.messages?._add(message) ?? message);
    }
  }

  if (attachments) {
    result.attachments = new Collection();
    for (const attachment of Object.values(attachments)) {
      const patched = new Attachment(attachment);
      result.attachments.set(attachment.id, patched);
    }
  }

  return result;
}

module.exports = { transformResolved };
