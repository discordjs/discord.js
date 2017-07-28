const GuildChannel = require('./GuildChannel');

class CategoryChannel extends GuildChannel {
  get children() {
    return this.guild.channels.filter(c => c.parent === this);
  }
}

module.exports = CategoryChannel;
