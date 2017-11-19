const AbstractHandler = require('./AbstractHandler');

class UserGuildSettingsUpdateHandler extends AbstractHandler {
  handle(packet) {
    const client = this.packetManager.client;
    const settings = client.user.guildSettings.get(packet.d.guild_id);
    if (settings) settings.patch(packet.d);
    else client.user.guildSettings.set(packet.d.guild_id, new ClientUserGuildSettings(this.client, packet.d));
    client.emit(Events.USER_GUILD_SETTINGS_UPDATE, client.user.guildSettings.get(packet.d.guild_id));
  }
}

/**
 * Emitted whenever the client user's settings update.
 * @event Client#clientUserGuildSettingsUpdate
 * @param {ClientUserGuildSettings} clientUserGuildSettings The new client user guild settings
 */

module.exports = UserGuildSettingsUpdateHandler;

const { ClientUserGuildSettings, Constants: { Events } } = require('../../../../');
