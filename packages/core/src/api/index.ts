import type { REST } from '@discordjs/rest';
import { ApplicationCommandsAPI } from './applicationCommands.js';
import { ChannelsAPI } from './channel.js';
import { GuildsAPI } from './guild.js';
import { InteractionsAPI } from './interactions.js';
import { InvitesAPI } from './invite.js';
import { OAuth2API } from './oauth2.js';
import { RoleConnectionsAPI } from './roleConnections.js';
import { StageInstancesAPI } from './stageInstances.js';
import { StickersAPI } from './sticker.js';
import { ThreadsAPI } from './thread.js';
import { UsersAPI } from './user.js';
import { VoiceAPI } from './voice.js';
import { WebhooksAPI } from './webhook.js';

export * from './applicationCommands.js';
export * from './channel.js';
export * from './guild.js';
export * from './interactions.js';
export * from './invite.js';
export * from './oauth2.js';
export * from './roleConnections.js';
export * from './stageInstances.js';
export * from './sticker.js';
export * from './thread.js';
export * from './user.js';
export * from './voice.js';
export * from './webhook.js';

export class API {
	public readonly applicationCommands: ApplicationCommandsAPI;

	public readonly channels: ChannelsAPI;

	public readonly guilds: GuildsAPI;

	public readonly interactions: InteractionsAPI;

	public readonly invites: InvitesAPI;

	public readonly oauth2: OAuth2API;

	public readonly roleConnections: RoleConnectionsAPI;

	public readonly stageInstances: StageInstancesAPI;

	public readonly stickers: StickersAPI;

	public readonly threads: ThreadsAPI;

	public readonly users: UsersAPI;

	public readonly voice: VoiceAPI;

	public readonly webhooks: WebhooksAPI;

	public constructor(public readonly rest: REST) {
		this.applicationCommands = new ApplicationCommandsAPI(rest);
		this.channels = new ChannelsAPI(rest);
		this.guilds = new GuildsAPI(rest);
		this.invites = new InvitesAPI(rest);
		this.roleConnections = new RoleConnectionsAPI(rest);
		this.oauth2 = new OAuth2API(rest);
		this.stageInstances = new StageInstancesAPI(rest);
		this.stickers = new StickersAPI(rest);
		this.threads = new ThreadsAPI(rest);
		this.users = new UsersAPI(rest);
		this.voice = new VoiceAPI(rest);
		this.webhooks = new WebhooksAPI(rest);
		this.interactions = new InteractionsAPI(rest, this.webhooks);
	}
}
