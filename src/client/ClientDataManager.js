const Constants = require('../util/Constants');
const Util = require('../util/Util');
const Guild = require('../structures/Guild');
const User = require('../structures/User');
const DMChannel = require('../structures/DMChannel');
const Emoji = require('../structures/Emoji');
const TextChannel = require('../structures/TextChannel');
const VoiceChannel = require('../structures/VoiceChannel');
const GuildChannel = require('../structures/GuildChannel');
const GroupDMChannel = require('../structures/GroupDMChannel');

class ClientDataManager {
  constructor(client) {
    this.client = client;
  }

  get pastReady() {
    return this.client.ws.connection.status === Constants.Status.READY;
  }

  newEmoji(data, guild) {
    const already = guild.emojis.has(data.id);
    if (data && !already) {
      let emoji = new Emoji(guild, data);
      this.client.emit(Constants.Events.GUILD_EMOJI_CREATE, emoji);
      guild.emojis.set(emoji.id, emoji);
      return emoji;
    } else if (already) {
      return guild.emojis.get(data.id);
    }

    return null;
  }

  killEmoji(emoji) {
    if (!(emoji instanceof Emoji && emoji.guild)) return;
    this.client.emit(Constants.Events.GUILD_EMOJI_DELETE, emoji);
    emoji.guild.emojis.delete(emoji.id);
  }

  updateGuild(currentGuild, newData) {
    const oldGuild = Util.cloneObject(currentGuild);
    currentGuild.setup(newData);
    if (this.pastReady) this.client.emit(Constants.Events.GUILD_UPDATE, oldGuild, currentGuild);
  }

  updateChannel(currentChannel, newData) {
    currentChannel.setup(newData);
  }

  updateEmoji(currentEmoji, newData) {
    const oldEmoji = Util.cloneObject(currentEmoji);
    currentEmoji.setup(newData);
    this.client.emit(Constants.Events.GUILD_EMOJI_UPDATE, oldEmoji, currentEmoji);
    return currentEmoji;
  }
}

module.exports = ClientDataManager;
