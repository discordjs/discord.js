const getStructure = name => require(`../structures/${name}`);

const User = getStructure('User');
const Message = getStructure('Message');
const Guild = getStructure('Guild');
const Channel = getStructure('Channel');
const GuildMember = getStructure('GuildMember');

function $string(obj) {
  return (typeof obj === 'string' || obj instanceof String);
}

class ClientDataResolver {

  constructor(client) {
    this.client = client;
  }

  resolveUser(user) {
    if (user instanceof User) {
      return user;
    } else if ($string(user)) {
      return this.client.store.get('users', user);
    } else if (user instanceof Message) {
      return user.author;
    } else if (user instanceof Guild) {
      return user.owner;
    }

    return null;
  }

  resolveGuild(guild) {
    if (guild instanceof Guild) {
      return guild;
    }
    return null;
  }

  resolveGuildMember($guild, $user) {
    let guild = $guild;
    let user = $user;
    if (user instanceof GuildMember) {
      return user;
    }

    guild = this.resolveGuild(guild);
    user = this.resolveUser(user);

    if (!guild || !user) {
      return null;
    }

    return guild.store.get('members', user.id);
  }

  resolveBase64(data) {
    if (data instanceof Buffer) {
      return `data:image/jpg;base64,${data.toString('base64')}`;
    }

    return data;
  }

  resolveChannel(channel) {
    if (channel instanceof Channel) {
      return channel;
    }

    if ($string(channel)) {
      return this.client.store.get('channels', channel);
    }

    return null;
  }

  resolveString(data) {
    if (data instanceof String) {
      return data;
    }

    if (data instanceof Array) {
      return data.join('\n');
    }

    return String(data);
  }
}

module.exports = ClientDataResolver;
