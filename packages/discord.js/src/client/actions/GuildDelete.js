import { Events } from '../../util/Events.js';
import { Action } from './Action.js';

export class GuildDeleteAction extends Action {
  handle(guild) {
    const { client } = this;

    for (const channel of guild.channels.cache.values()) client.channels._remove(channel.id);
    client.voice.adapters.get(guild.id)?.destroy();

    client.guilds.cache.delete(guild.id);

    /**
     * Emitted whenever a guild kicks the client or the guild is deleted/left.
     *
     * @event Client#guildDelete
     * @param {Guild} guild The guild that was deleted
     */
    client.emit(Events.GuildDelete, guild);
  }
}
