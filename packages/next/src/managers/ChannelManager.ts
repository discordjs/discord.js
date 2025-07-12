import type { APIChannel } from 'discord-api-types/v10';
import type { Client } from '../Client.js';
import { Channel } from '../structures/Channel.js';
import { CachedManager } from './CachedManager.js';

export class ChannelManager extends CachedManager<Channel> {
	public constructor(data: APIChannel[], client: Client) {
		super(client, Channel);

		for (const channel of data) {
			this.cache.set(channel.id, new Channel(channel, client));
		}
	}
}
