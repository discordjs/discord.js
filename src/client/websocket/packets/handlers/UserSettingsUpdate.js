const AbstractHandler = require('./AbstractHandler');
const { Events } = require('../../../../util/Constants');

class UserSettingsUpdateHandler extends AbstractHandler {
  handle(packet) {
    const client = this.packetManager.client;
    client.user.settings.patch(packet.d);
    client.emit(Events.USER_SETTINGS_UPDATE, client.user.settings);
  }
}

/**
 * Emitted whenever the client user's settings update.
 * @event Client#clientUserSettingsUpdate
 * @param {ClientUserSettings} clientUserSettings The new client user settings
 */

module.exports = UserSettingsUpdateHandler;
