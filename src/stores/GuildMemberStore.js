const DataStore = require('./DataStore');
const GuildMember = require('../structures/GuildMember');
/**
 * Stores guild members.
 * @private
 * @extends {DataStore}
 */
class GuildMemberStore extends DataStore {
  constructor(guild, iterable) {
    super(guild.client, iterable);
    this.guild = guild;
  }

  create(data) {
    const existing = this.has(data.user.id);
    if (existing) return existing;

    const member = new GuildMember(this.guild, data);
    this.set(member.id, member);

    return member;
  }
}

module.exports = GuildMemberStore;
