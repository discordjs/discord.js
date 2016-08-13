class PermissionOverwrites {
  constructor(serverChannel, data) {
    this.channel = serverChannel;
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
