'use strict';

const Collector = require('./interfaces/Collector');
const { Events } = require('../util/Constants');

class GuildMemberCollector extends Collector {
  constructor(guild, filter, options = {}) {
    super(guild.client, filter, options);

    this.guild = guild;

    this.joined = 0;

    const chunkListener = (members => {
      for (const member of members.values()) this.handleDispose(member);
    }).bind(this);

    if (this.client.getMaxListeners() !== 0) this.client.setMaxListeners(this.client.getMaxListeners() + 1);
    this.client.on(Events.GUILD_MEMBER_ADD, this.handleCollect);
    this.client.on(Events.GUILD_MEMBER_REMOVE, this.handleDispose);
    this.client.on(Events.GUILD_MEMBERS_CHUNK, chunkListener);

    this.once('end', () => {
      this.client.removeListener(Events.GUILD_MEMBER_ADD, this.handleCollect);
      this.client.removeListener(Events.GUILD_MEMBER_REMOVE, this.handleDispose);
      this.client.removeListener(Events.GUILD_MEMBERS_CHUNK, chunkListener);
      if (this.client.getMaxListeners() !== 0) this.client.setMaxListeners(this.client.getMaxListeners() - 1);
    });
  }

  collect(member) {
    if (member.guild.id !== this.guild.id) return null;
    this.joined++;
    return member.id;
  }

  dispose(member) {
    return member.guild.id === this.guild.id ? member.id : null;
  }

  endReason() {
    if (this.options.max && this.collected.size > this.options.max) return 'limit';
    if (this.options.maxJoined && this.joined > this.options.maxJoined) return 'joinedLimit';
    return null;
  }
}

module.exports = GuildMemberCollector;