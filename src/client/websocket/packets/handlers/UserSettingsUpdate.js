const AbstractHandler = require('./AbstractHandler');

class UserSettingsUpdateHandler extends AbstractHandler {
  handle(packet) {
    this.packetManager.client.user.settings.patch(packet.d);
  }
}

module.exports = UserSettingsUpdateHandler;
