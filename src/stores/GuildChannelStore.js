const DataStore = require('./DataStore');
const TextChannel = require('../structures/TextChannel');
const VoiceChannel = require('../structures/VoiceChannel');
const Constants = require('../util/Constants');
/**
 * Stores guild channels.
 * @private
 * @extends {DataStore}
 */
class GuildChannelStore extends DataStore {
  constructor(guild, iterable) {
    super(guild.client, iterable);
    this.guild = guild;
  }

  create(data, cache = true) {
    const existing = this.get(data.id);
    if (existing) return existing;

    const ChannelModel = data.type === Constants.ChannelTypes.TEXT ? TextChannel : VoiceChannel;
    const channel = new ChannelModel(this.guild, data);
    if (cache) this.set(channel.id, channel);

    return channel;
  }
}

module.exports = GuildChannelStore;
