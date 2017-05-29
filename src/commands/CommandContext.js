class CommandContext {
  constructor(message, args) {
    this.message = message;
    this.args = args;
    this.channel = message.channel;
    this.guild = message.guild;
  }

  reply(...args) {
    return this.message.reply(...args);
  }

  send(...args) {
    return this.channel.send(...args);
  }
}

module.exports = CommandContext;
