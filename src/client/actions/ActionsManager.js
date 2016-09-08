class ActionsManager {
  constructor(client) {
    this.client = client;

    this.register('MessageCreate');
    this.register('MessageDelete');
    this.register('MessageDeleteBulk');
    this.register('MessageUpdate');
    this.register('ChannelCreate');
    this.register('ChannelDelete');
    this.register('ChannelUpdate');
    this.register('GuildDelete');
    this.register('GuildUpdate');
    this.register('GuildMemberGet');
    this.register('GuildMemberRemove');
    this.register('GuildBanRemove');
    this.register('GuildRoleCreate');
    this.register('GuildRoleDelete');
    this.register('GuildRoleUpdate');
    this.register('UserGet');
    this.register('UserUpdate');
    this.register('GuildSync');
  }

  register(name) {
    const Action = require(`./${name}`);
    this[name] = new Action(this.client);
  }
}

module.exports = ActionsManager;
