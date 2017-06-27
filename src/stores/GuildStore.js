const DataStore = require('./DataStore');
const Guild = require('../structures/Guild');
const Constants = require('../util/Constants');

class GuildStore extends DataStore {
  create(data, emitEvent) {
    super.create();

    const existing = this.get(data.id);
    if (existing) return existing;

    if (typeof emitEvent === 'undefined') emitEvent = this.client.ws.connection.status === Constants.Status.READY;
    const guild = new Guild(this.client, data);
    this.set(guild.id, guild);

    if (emitEvent) {
			/**
       * Emitted whenever the client joins a guild.
       * @event Client#guildCreate
       * @param {Guild} guild The created guild
       */
      if (this.client.options.fetchAllMembers) {
        guild.fetchMembers().then(() => { this.client.emit(Constants.Events.GUILD_CREATE, guild); });
      } else {
        this.client.emit(Constants.Events.GUILD_CREATE, guild);
      }
    }

    return guild;
  }

  remove(id, emitEvent) {
    super.remove();
    if (typeof emitEvent === 'undefined') emitEvent = this.client.ws.connection.status === Constants.Status.READY;
    const guild = this.get(id);
    this.delete(id);
    if (emitEvent && guild) {
      this.client.emit(Constants.Events.GUILD_DELETE, guild);
    }
  }
}

module.exports = GuildStore;
