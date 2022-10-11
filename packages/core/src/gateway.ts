import EventEmitter from 'node:events';
import type { REST } from '@discordjs/rest';
import type { WebSocketManager } from '@discordjs/ws';
import { WebSocketShardEvents } from '@discordjs/ws';
import type {
	APIChannel,
	APIEmoji,
	APIGuild,
	APIGuildScheduledEvent,
	APIInteraction,
	APIMessage,
	APIStageInstance,
	APIThreadChannel,
	APIUnavailableGuild,
	APIUser,
	GatewayChannelPinsUpdateDispatchData,
	GatewayGuildCreateDispatchData,
	GatewayGuildIntegrationsUpdateDispatchData,
	GatewayGuildMemberAddDispatchData,
	GatewayGuildMembersChunkDispatchData,
	GatewayGuildMemberUpdateDispatchData,
	GatewayGuildRoleDeleteDispatchData,
	GatewayGuildRoleModifyDispatchData,
	GatewayGuildScheduledEventUserAddDispatchData,
	GatewayGuildScheduledEventUserRemoveDispatchData,
	GatewayGuildStickersUpdateDispatchData,
	GatewayIntegrationCreateDispatchData,
	GatewayIntegrationDeleteDispatchData,
	GatewayIntegrationUpdateDispatchData,
	GatewayInviteCreateDispatchData,
	GatewayInviteDeleteDispatchData,
	GatewayMessageDeleteBulkDispatchData,
	GatewayMessageDeleteDispatchData,
	GatewayMessageReactionAddDispatchData,
	GatewayMessageReactionRemoveAllDispatchData,
	GatewayMessageReactionRemoveDispatchData,
	GatewayMessageReactionRemoveEmojiDispatchData,
	GatewayMessageUpdateDispatchData,
	GatewayPresenceUpdate,
	GatewayReadyDispatchData,
	GatewayThreadListSync,
	GatewayThreadMembersUpdateDispatchData,
	GatewayThreadMemberUpdateDispatchData,
	GatewayVoiceServerUpdateDispatchData,
	GatewayVoiceState,
	GatewayWebhooksUpdateDispatchData,
} from 'discord-api-types/v10';
import { GatewayDispatchEvents } from 'discord-api-types/v10';

export interface MappedEvents {
	channelCreate: [{ api: REST; channel: APIChannel }];
	channelDelete: [{ api: REST; channel: APIChannel }];
	channelPinsUpdate: [{ api: REST; data: GatewayChannelPinsUpdateDispatchData }];
	channelUpdate: [{ api: REST; channel: APIChannel }];
	guildBanAdd: [{ api: REST; guild_id: string; user: APIUser }];
	guildBanRemove: [{ api: REST; guild_id: string; user: APIUser }];
	guildCreate: [{ api: REST; guild: GatewayGuildCreateDispatchData }];
	guildDelete: [{ api: REST; guild: APIUnavailableGuild }];
	guildEmojisUpdate: [{ api: REST; emojis: APIEmoji[]; guild_id: string }];
	guildIntegrationsUpdate: [{ api: REST; guild: GatewayGuildIntegrationsUpdateDispatchData }];
	guildMemberAdd: [{ api: REST; member: GatewayGuildMemberAddDispatchData }];
	guildMemberRemove: [{ api: REST; guild_id: string; user: APIUser }];
	guildMemberUpdate: [{ api: REST; member: GatewayGuildMemberUpdateDispatchData }];
	guildMembersChunk: [GatewayGuildMembersChunkDispatchData & { api: REST }];
	guildRoleCreate: [GatewayGuildRoleModifyDispatchData & { api: REST }];
	guildRoleDelete: [GatewayGuildRoleDeleteDispatchData & { api: REST }];
	guildRoleUpdate: [GatewayGuildRoleModifyDispatchData & { api: REST }];
	guildScheduledEventCreate: [{ api: REST; event: APIGuildScheduledEvent }];
	guildScheduledEventDelete: [{ api: REST; event: APIGuildScheduledEvent }];
	guildScheduledEventUpdate: [{ api: REST; event: APIGuildScheduledEvent }];
	guildScheduledEventUserAdd: [GatewayGuildScheduledEventUserAddDispatchData & { api: REST }];
	guildScheduledEventUserRemove: [GatewayGuildScheduledEventUserRemoveDispatchData & { api: REST }];
	guildStickersUpdate: [GatewayGuildStickersUpdateDispatchData & { api: REST }];
	guildUpdate: [{ api: REST; guild: APIGuild }];
	integrationCreate: [{ api: REST; integration: GatewayIntegrationCreateDispatchData }];
	integrationDelete: [GatewayIntegrationDeleteDispatchData & { api: REST }];
	integrationUpdate: [{ api: REST; integration: GatewayIntegrationUpdateDispatchData }];
	interactionCreate: [{ api: REST; interaction: APIInteraction }];
	inviteCreate: [{ api: REST; invite: GatewayInviteCreateDispatchData }];
	inviteDelete: [GatewayInviteDeleteDispatchData & { api: REST }];
	messageCreate: [{ api: REST; message: APIMessage }];
	messageDelete: [GatewayMessageDeleteDispatchData & { api: REST }];
	messageDeleteBulk: [GatewayMessageDeleteBulkDispatchData & { api: REST }];
	messageReactionAdd: [GatewayMessageReactionAddDispatchData & { api: REST }];
	messageReactionRemove: [GatewayMessageReactionRemoveDispatchData & { api: REST }];
	messageReactionRemoveAll: [GatewayMessageReactionRemoveAllDispatchData & { api: REST }];
	messageReactionRemoveEmoji: [GatewayMessageReactionRemoveEmojiDispatchData & { api: REST }];
	messageUpdate: [{ api: REST; message: GatewayMessageUpdateDispatchData }];
	presenceUpdate: [GatewayPresenceUpdate & { api: REST }];
	ready: [{ api: REST; data: GatewayReadyDispatchData }];
	stageInstanceCreate: [{ api: REST; stage_instance: APIStageInstance }];
	stageInstanceDelete: [{ api: REST; stage_instance: APIStageInstance }];
	stageInstanceUpdate: [{ api: REST; stage_instance: APIStageInstance }];
	threadCreate: [{ api: REST; channel: APIThreadChannel }];
	threadDelete: [{ api: REST; channel: APIThreadChannel }];
	threadListSync: [GatewayThreadListSync & { api: REST }];
	threadMemberUpdate: [GatewayThreadMemberUpdateDispatchData & { api: REST }];
	threadMembersUpdate: [GatewayThreadMembersUpdateDispatchData & { api: REST }];
	threadUpdate: [{ api: REST; channel: APIThreadChannel }];
	userUpdate: [{ api: REST; user: APIUser }];
	voiceServerUpdate: [GatewayVoiceServerUpdateDispatchData & { api: REST }];
	voiceStateUpdate: [{ api: REST; voice_state: GatewayVoiceState }];
	webhooksUpdate: [GatewayWebhooksUpdateDispatchData & { api: REST }];
}

export class Events extends EventEmitter {
	public constructor(rest: REST, ws: WebSocketManager) {
		super();
		ws.on(WebSocketShardEvents.Dispatch, ({ data }) => {
			switch (data.t) {
				case GatewayDispatchEvents.MessageCreate:
					this.emit('messageCreate', { api: rest, message: data.d });
					break;
				case GatewayDispatchEvents.InteractionCreate:
					this.emit('interactionCreate', { api: rest, interaction: data.d });
					break;
				case GatewayDispatchEvents.Ready:
					this.emit('ready', { api: rest, data: data.d });
					break;
				case GatewayDispatchEvents.ChannelCreate:
					this.emit('channelCreate', { api: rest, channel: data.d });
					break;
				case GatewayDispatchEvents.ChannelUpdate:
					this.emit('channelUpdate', { api: rest, channel: data.d });
					break;
				case GatewayDispatchEvents.ChannelDelete:
					this.emit('channelDelete', { api: rest, channel: data.d });
					break;
				case GatewayDispatchEvents.ChannelPinsUpdate:
					this.emit('channelPinsUpdate', { api: rest, ...data.d });
					break;
				case GatewayDispatchEvents.GuildBanAdd:
					this.emit('guildBanAdd', { api: rest, ...data.d });
					break;
				case GatewayDispatchEvents.GuildBanRemove:
					this.emit('guildBanRemove', { api: rest, ...data.d });
					break;
				case GatewayDispatchEvents.GuildCreate:
					this.emit('guildCreate', { api: rest, guild: data.d });
					break;
				case GatewayDispatchEvents.GuildUpdate:
					this.emit('guildUpdate', { api: rest, guild: data.d });
					break;
				case GatewayDispatchEvents.GuildDelete:
					this.emit('guildDelete', { api: rest, guild: data.d });
					break;
				case GatewayDispatchEvents.GuildEmojisUpdate:
					this.emit('guildEmojisUpdate', { api: rest, ...data.d });
					break;
				case GatewayDispatchEvents.GuildIntegrationsUpdate:
					this.emit('guildIntegrationsUpdate', { api: rest, guild_id: data.d.guild_id });
					break;
				case GatewayDispatchEvents.GuildMemberAdd:
					this.emit('guildMemberAdd', { api: rest, member: data.d });
					break;
				case GatewayDispatchEvents.GuildMemberRemove:
					this.emit('guildMemberRemove', { api: rest, ...data.d });
					break;
				case GatewayDispatchEvents.GuildMemberUpdate:
					this.emit('guildMemberUpdate', { api: rest, member: data.d });
					break;
				case GatewayDispatchEvents.GuildMembersChunk:
					this.emit('guildMembersChunk', { api: rest, ...data.d });
					break;
				case GatewayDispatchEvents.GuildRoleCreate:
					this.emit('guildRoleCreate', { api: rest, ...data.d });
					break;
				case GatewayDispatchEvents.GuildRoleUpdate:
					this.emit('guildRoleUpdate', { api: rest, ...data.d });
					break;
				case GatewayDispatchEvents.GuildRoleDelete:
					this.emit('guildRoleDelete', { api: rest, ...data.d });
					break;
				case GatewayDispatchEvents.GuildScheduledEventCreate:
					this.emit('guildScheduledEventCreate', { api: rest, event: data.d });
					break;
				case GatewayDispatchEvents.GuildScheduledEventDelete:
					this.emit('guildScheduledEventDelete', { api: rest, event: data.d });
					break;
				case GatewayDispatchEvents.GuildScheduledEventUpdate:
					this.emit('guildScheduledEventUpdate', { api: rest, event: data.d });
					break;
				case GatewayDispatchEvents.GuildScheduledEventUserAdd:
					this.emit('guildScheduledEventUserAdd', { api: rest, ...data.d });
					break;
				case GatewayDispatchEvents.GuildScheduledEventUserRemove:
					this.emit('guildScheduledEventUserRemove', { api: rest, ...data.d });
					break;
				case GatewayDispatchEvents.GuildStickersUpdate:
					this.emit('guildStickersUpdate', { api: rest, ...data.d });
					break;
				case GatewayDispatchEvents.IntegrationCreate:
					this.emit('integrationCreate', { api: rest, integration: data.d });
					break;
				case GatewayDispatchEvents.IntegrationUpdate:
					this.emit('integrationUpdate', { api: rest, integration: data.d });
					break;
				case GatewayDispatchEvents.IntegrationDelete:
					this.emit('integrationDelete', { api: rest, ...data.d });
					break;
				case GatewayDispatchEvents.InviteCreate:
					this.emit('inviteCreate', { api: rest, invite: data.d });
					break;
				case GatewayDispatchEvents.InviteDelete:
					this.emit('inviteDelete', { api: rest, ...data.d });
					break;
				case GatewayDispatchEvents.MessageDelete:
					this.emit('messageDelete', { api: rest, ...data.d });
					break;
				case GatewayDispatchEvents.MessageDeleteBulk:
					this.emit('messageDeleteBulk', { api: rest, ...data.d });
					break;
				case GatewayDispatchEvents.MessageReactionAdd:
					this.emit('messageReactionAdd', { api: rest, ...data.d });
					break;
				case GatewayDispatchEvents.MessageReactionRemove:
					this.emit('messageReactionRemove', { api: rest, ...data.d });
					break;
				case GatewayDispatchEvents.MessageReactionRemoveAll:
					this.emit('messageReactionRemoveAll', { api: rest, ...data.d });
					break;
				case GatewayDispatchEvents.MessageReactionRemoveEmoji:
					this.emit('messageReactionRemoveEmoji', { api: rest, ...data.d });
					break;
				case GatewayDispatchEvents.MessageUpdate:
					this.emit('messageUpdate', { api: rest, message: data.d });
					break;
				case GatewayDispatchEvents.PresenceUpdate:
					this.emit('presenceUpdate', { api: rest, ...data.d });
					break;
				case GatewayDispatchEvents.StageInstanceCreate:
					this.emit('stageInstanceCreate', { api: rest, stage_instance: data.d });
					break;
				case GatewayDispatchEvents.StageInstanceUpdate:
					this.emit('stageInstanceUpdate', { api: rest, stage_instance: data.d });
					break;
				case GatewayDispatchEvents.StageInstanceDelete:
					this.emit('stageInstanceDelete', { api: rest, stage_instance: data.d });
					break;
				case GatewayDispatchEvents.ThreadCreate:
					this.emit('threadCreate', { api: rest, thread: data.d });
					break;
				case GatewayDispatchEvents.ThreadUpdate:
					this.emit('threadUpdate', { api: rest, thread: data.d });
					break;
				case GatewayDispatchEvents.ThreadDelete:
					this.emit('threadDelete', { api: rest, thread: data.d });
					break;
				// eslint-disable-next-line n/no-sync
				case GatewayDispatchEvents.ThreadListSync:
					this.emit('threadListSync', { api: rest, ...data.d });
					break;
				case GatewayDispatchEvents.ThreadMemberUpdate:
					this.emit('threadMemberUpdate', { api: rest, ...data.d });
					break;
				case GatewayDispatchEvents.ThreadMembersUpdate:
					this.emit('threadMembersUpdate', { api: rest, ...data.d });
					break;
				case GatewayDispatchEvents.UserUpdate:
					this.emit('userUpdate', { api: rest, user: data.d });
					break;
				case GatewayDispatchEvents.VoiceServerUpdate:
					this.emit('voiceServerUpdate', { api: rest, ...data.d });
					break;
				case GatewayDispatchEvents.VoiceStateUpdate:
					this.emit('voiceStateUpdate', { api: rest, state: data.d });
					break;
				case GatewayDispatchEvents.WebhooksUpdate:
					this.emit('webhooksUpdate', { api: rest, ...data.d });
					break;
				default:
					break;
			}
		});
	}

	public async login(): Promise<GatewayReadyDispatchData> {
		return new Promise((resolve, reject) => {
			this.once('ready', (dispatch) => resolve(dispatch.data));
			this.once('error', reject);
		});
	}
}

export interface Events {
	on<K extends keyof MappedEvents>(event: K, listener: (...args: MappedEvents[K]) => void): this;
}
