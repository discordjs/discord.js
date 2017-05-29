const Client = require('../client/Client');
const Collection = require('../util/Collection');
const CommandContext = require('./CommandContext');

const REGEX = {
  mention: /^(<(@!?|#))|>$/g,
};

class CommandClient extends Client {
  /**
   * Command Client
   * @param {Object} [options] Options
   * @param {string} [options.prefix=?] Prefix
   * @param {boolean} [options.mentionable] If mentioning the bot can trigger a command
   */
  constructor({ prefix = '?', mentionable = true } = {}) {
    super({});
    this._options = { prefix, mentionable };

    this.commands = new Collection();
    this.on('raw', packet => {
      if (packet.t === 'READY') {
        this._options.cprefix = new RegExp(`^${this._options.prefix}|^<@?${packet.d.user.id}>`);
      }
    });
    this.on('message', this._handleMessage.bind(this));
    require('./DefaultHelpCommand')(this);
  }

  command(name, input, handler, help) {
    if (!handler && typeof input === 'function') {
      handler = input;
      input = '';
    }
    const args = this.constructor.parseArgMap(input);
    this.commands.set(name, { args, handler, help });
    return this;
  }

  _handleMessage(message) {
    if (
      message.author.bot ||
      !this._options.cprefix.test(message.content)
    ) return;

    message.content = message.content.replace(this._options.cprefix, '').trim().split(' ');
    let command = message.content.shift().toLowerCase().trim();
    message.content = message.content.join(' ');
    if (this.commands.has(command)) {
      const cmd = this.commands.get(command);
      const args = this.constructor.parseArgs(cmd.args, message);
      cmd.handler(new CommandContext(message, args));
    }
  }

  static parseArgs(args, message) {
    let items = message.content.split(' ');
    const consumableArgs = Object.assign([], args);
    const output = {};
    do {
      const { name, rest, type } = consumableArgs.shift();
      if (rest) {
        output[name] = items.join(' ');
        break;
      } else if (type) {
        let original = items.shift().trim();
        switch (type) {
          case 'Member':
            if (!message.guild) throw new Error('Wanted member but message not send in guild!');
            if (REGEX.mention.test(original)) original = original.replace(REGEX.mention, '');
            output[name] = message.guild.member(original);
            break;
          case 'User':
            if (REGEX.mention.test(original)) original = original.replace(REGEX.mention, '');
            output[name] = message.client.users.get(original);
            break;
          case 'Channel':
            if (REGEX.mention.test(original)) original = original.replace(REGEX.mention, '');
            output[name] = message.client.channels.get(original);
            break;
        }
      } else {
        output[name] = items.shift();
      }
    } while (items.length);
    return output;
  }

  static parseArgMap(str) {
    return str.match(/(<.+?>)|(\[.+?])/g)
      .map(m => {
        const optional = m.startsWith('[') && m.endsWith(']');
        const raw = m.replace(/[<>[\]]/g, '');
        let [name, type] = raw.split(':').map(x => x.trim());
        const rest = name.endsWith('...');
        if (rest) name = name.slice(0, -3);
        return { optional, name, type, rest, raw: m };
      });
  }
}

module.exports = CommandClient;
