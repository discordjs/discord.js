'use strict';

const Action = require('./Action');
const { Events } = require('../../util/Constants');

/**
 * The data received in the {@link Client#event:applicationCommandPermissionsUpdate} event
 * @typedef {Object} ApplicationCommandPermissionsUpdateData
 * @property {Snowflake} id The id of the command or global entity that was updated
 * @property {Snowflake} guildId The id of the guild in which permissions were updated
 * @property {Snowflake} applicationId The id of the application that owns the command or entity being updated
 * @property {ApplicationCommandPermissions[]} permissions The updated permissions
 */

class ApplicationCommandPermissionsUpdateAction extends Action {
  handle(data) {
    const client = this.client;
    /**
     * Emitted whenever permissions for an application command in a guild were updated.
     * <warn>This includes permission updates for other applications in addition to the logged in client,
     * check `data.applicationId` to verify which application the update is for</warn>
     * @event Client#applicationCommandPermissionsUpdate
     * @param {ApplicationCommandPermissionsUpdateData} data The updated permissions
     */
    client.emit(Events.APPLICATION_COMMAND_PERMISSIONS_UPDATE, {
      permissions: data.permissions,
      id: data.id,
      guildId: data.guild_id,
      applicationId: data.application_id,
    });
  }
}

module.exports = ApplicationCommandPermissionsUpdateAction;
