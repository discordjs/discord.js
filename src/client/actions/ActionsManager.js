const requireAction = name => require(`./${name}`);

class ActionsManager {
  constructor(client) {
    this.client = client;

    this.register('MessageCreate');
    this.register('MessageDelete');
    this.register('MessageUpdate');
    this.register('ChannelCreate');
    this.register('ChannelDelete');
    this.register('ChannelUpdate');
    this.register('GuildDelete');
    this.register('GuildUpdate');
    this.register('GuildMemberRemove');
    this.register('GuildRoleCreate');
    this.register('GuildRoleDelete');
    this.register('GuildRoleUpdate');
    this.register('UserUpdate');
  }

  register(name) {
    const Action = requireAction(name);
    this[name] = new Action(this.client);
  }
}

module.exports = ActionsManager;
