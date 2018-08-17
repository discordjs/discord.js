const AbstractHandler = require('./AbstractHandler');
const { Events } = require('../../../../util/Constants');

class WebhookUpdate extends AbstractHandler {
  handle(packet) {
    const client = this.packetManager.client;
    const data = packet.d;
    const guild = client.guilds.get(data.guild_id);
    const channel = client.channels.get(data.channel_id);
    if (guild && channel) client.emit(Events.WEBHOOK_UPDATE, guild, channel);
  }
}

/**
 * Emitted whenever a guild channel has it's webhooks changed.
 * @event Client#webhookUpdate
 * @param {Guild} guild The guild that had a webhook update
 * @param {GuildChannel} channel The channel that had a webhook update
 */

module.exports = WebhookUpdate;
