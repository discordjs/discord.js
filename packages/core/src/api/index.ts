import type { REST } from '@discordjs/rest';
import { ChannelsAPI } from './channel.js';
import { GuildsAPI } from './guild.js';
import { InteractionsAPI } from './interactions.js';
import { InvitesAPI } from './invite.js';
import { StickersAPI } from './sticker.js';
import { ThreadsAPI } from './thread.js';
import { UsersAPI } from './user.js';
import { VoiceAPI } from './voice.js';
import { WebhooksAPI } from './webhook.js';

export * from './channel.js';
export * from './guild.js';
export * from './interactions.js';
export * from './invite.js';
export * from './sticker.js';
export * from './thread.js';
export * from './user.js';
export * from './voice.js';
export * from './webhook.js';

export class API {
	public readonly channels: ChannelsAPI;

	public readonly guilds: GuildsAPI;

	public readonly interactions: InteractionsAPI;

	public readonly invites: InvitesAPI;

	public readonly stickers: StickersAPI;

	public readonly threads: ThreadsAPI;

	public readonly users: UsersAPI;

	public readonly voice: VoiceAPI;

	public readonly webhooks: WebhooksAPI;

	public constructor(public readonly rest: REST) {
		this.channels = new ChannelsAPI(rest);
		this.guilds = new GuildsAPI(rest);
		this.invites = new InvitesAPI(rest);
		this.stickers = new StickersAPI(rest);
		this.threads = new ThreadsAPI(rest);
		this.users = new UsersAPI(rest);
		this.voice = new VoiceAPI(rest);
		this.webhooks = new WebhooksAPI(rest);
		this.interactions = new InteractionsAPI(rest, this.webhooks);
	}
}
