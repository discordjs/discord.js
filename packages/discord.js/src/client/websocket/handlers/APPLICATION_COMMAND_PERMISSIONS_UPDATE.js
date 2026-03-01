'use strict';

const { Events } = require('../../../util/Events.js');

module.exports = (client, { d: data }) => {
  /**
   * Represents the properties of an application command permissions update
   *
   * @typedef {Object} ApplicationCommandPermissionsUpdateData
   * @property {ApplicationCommandPermissions[]} permissions The permissions for the command
   * @property {Snowflake} id The id of the command
   * @property {Snowflake} guildId The id of the guild
   * @property {Snowflake} applicationId The id of the application
   */

  /**
   * Emitted whenever permissions for an application command in a guild were updated.
   * <warn>This includes permission updates for other applications in addition to the logged in client,
   * check `data.applicationId` to verify which application the update is for</warn>
   *
   * @event Client#applicationCommandPermissionsUpdate
   * @param {ApplicationCommandPermissionsUpdateData} data The updated permissions
   */
  client.emit(Events.ApplicationCommandPermissionsUpdate, {
    permissions: data.permissions,
    id: data.id,
    guildId: data.guild_id,
    applicationId: data.application_id,
  });
};
