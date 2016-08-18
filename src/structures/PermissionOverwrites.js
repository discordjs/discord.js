class PermissionOverwrites {
  constructor(guildChannel, data) {
    this.channel = guildChannel;
    if (data) {
      this.setup(data);
    }
  }

  setup(data) {
    this.type = data.type;
    this.id = data.id;
    this.denyData = data.deny;
    this.allowData = data.allow;
  }
}

module.exports = PermissionOverwrites;
