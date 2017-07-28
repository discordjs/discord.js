const GuildChannel = require('./GuildChannel');

class CategoryChannel extends GuildChannel {
  get children() {
    return this.guild.channels.filter(c => c.parentID === this.id);
  }
}

module.exports = CategoryChannel;
