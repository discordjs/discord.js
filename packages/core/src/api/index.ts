import type { REST } from '@discordjs/rest';
import { BotsAPI } from './bot.js';
import { ChannelsAPI } from './channel.js';
import { GuildsAPI } from './guild.js';
import { GuildMembersAPI } from './guildMember.js';
import { GuildTemplatesAPI } from './guildTemplate.js';
import { InteractionsAPI } from './interactions.js';
import { InvitesAPI } from './invite.js';
import { MessagesAPI } from './message.js';
import { StickersAPI } from './sticker.js';
import { ThreadsAPI } from './thread.js';
import { VoiceAPI } from './voice.js';
import { WebhooksAPI } from './webhook.js';

export * from './bot.js';
export * from './guildMember.js';
export * from './guild.js';
export * from './message.js';
export * from './thread.js';
export * from './webhook.js';
export * from './channel.js';
export * from './interactions.js';
export * from './guildTemplate.js';
export * from './invite.js';
export * from './voice.js';
export * from './sticker.js';

export class API {
	public readonly bots: BotsAPI;

	public readonly channels: ChannelsAPI;

	public readonly guilds: GuildsAPI;

	public readonly guildMembers: GuildMembersAPI;

	public readonly guildTemplates: GuildTemplatesAPI;

	public readonly interactions: InteractionsAPI;

	public readonly invites: InvitesAPI;

	public readonly messages: MessagesAPI;

	public readonly stickers: StickersAPI;

	public readonly threads: ThreadsAPI;

	public readonly voice: VoiceAPI;

	public readonly webhooks: WebhooksAPI;

	public constructor(rest: REST) {
		this.bots = new BotsAPI(rest);
		this.channels = new ChannelsAPI(rest);
		this.guilds = new GuildsAPI(rest);
		this.guildMembers = new GuildMembersAPI(rest);
		this.guildTemplates = new GuildTemplatesAPI(rest);
		this.invites = new InvitesAPI(rest);
		this.messages = new MessagesAPI(rest);
		this.stickers = new StickersAPI(rest);
		this.threads = new ThreadsAPI(rest);
		this.voice = new VoiceAPI(rest);
		this.webhooks = new WebhooksAPI(rest);
		this.interactions = new InteractionsAPI(rest, this.webhooks);
	}
}
