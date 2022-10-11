import type { REST } from '@discordjs/rest';
import type { WebSocketManager } from '@discordjs/ws';
import { WebSocketShardEvents } from '@discordjs/ws';
import { AsyncEventEmitter } from '@vladfrangu/async_event_emitter';
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
import { api } from './api/index.js';

export type WithIntrinsicProps<T> = T & { api: ReturnType<typeof api> };

export interface MappedEvents {
	channelCreate: [WithIntrinsicProps<{ channel: APIChannel }>];
	channelDelete: [WithIntrinsicProps<{ channel: APIChannel }>];
	channelPinsUpdate: [WithIntrinsicProps<GatewayChannelPinsUpdateDispatchData>];
	channelUpdate: [WithIntrinsicProps<{ channel: APIChannel }>];
	guildBanAdd: [WithIntrinsicProps<{ guild_id: string; user: APIUser }>];
	guildBanRemove: [WithIntrinsicProps<{ guild_id: string; user: APIUser }>];
	guildCreate: [WithIntrinsicProps<{ guild: GatewayGuildCreateDispatchData }>];
	guildDelete: [WithIntrinsicProps<{ guild: APIUnavailableGuild }>];
	guildEmojisUpdate: [WithIntrinsicProps<{ emojis: APIEmoji[]; guild_id: string }>];
	guildIntegrationsUpdate: [WithIntrinsicProps<{ guild_id: string }>];
	guildMemberAdd: [WithIntrinsicProps<{ member: GatewayGuildMemberAddDispatchData }>];
	guildMemberRemove: [WithIntrinsicProps<{ guild_id: string; user: APIUser }>];
	guildMemberUpdate: [WithIntrinsicProps<{ member: GatewayGuildMemberUpdateDispatchData }>];
	guildMembersChunk: [WithIntrinsicProps<GatewayGuildMembersChunkDispatchData>];
	guildRoleCreate: [WithIntrinsicProps<GatewayGuildRoleModifyDispatchData>];
	guildRoleDelete: [WithIntrinsicProps<GatewayGuildRoleDeleteDispatchData>];
	guildRoleUpdate: [WithIntrinsicProps<GatewayGuildRoleModifyDispatchData>];
	guildScheduledEventCreate: [WithIntrinsicProps<{ event: APIGuildScheduledEvent }>];
	guildScheduledEventDelete: [WithIntrinsicProps<{ event: APIGuildScheduledEvent }>];
	guildScheduledEventUpdate: [WithIntrinsicProps<{ event: APIGuildScheduledEvent }>];
	guildScheduledEventUserAdd: [WithIntrinsicProps<GatewayGuildScheduledEventUserAddDispatchData>];
	guildScheduledEventUserRemove: [WithIntrinsicProps<GatewayGuildScheduledEventUserRemoveDispatchData>];
	guildStickersUpdate: [WithIntrinsicProps<GatewayGuildStickersUpdateDispatchData>];
	guildUpdate: [WithIntrinsicProps<{ guild: APIGuild }>];
	integrationCreate: [WithIntrinsicProps<{ integration: GatewayIntegrationCreateDispatchData }>];
	integrationDelete: [WithIntrinsicProps<GatewayIntegrationDeleteDispatchData>];
	integrationUpdate: [WithIntrinsicProps<{ integration: GatewayIntegrationUpdateDispatchData }>];
	interactionCreate: [WithIntrinsicProps<{ interaction: APIInteraction }>];
	inviteCreate: [WithIntrinsicProps<{ invite: GatewayInviteCreateDispatchData }>];
	inviteDelete: [WithIntrinsicProps<GatewayInviteDeleteDispatchData>];
	messageCreate: [WithIntrinsicProps<{ message: APIMessage }>];
	messageDelete: [WithIntrinsicProps<GatewayMessageDeleteDispatchData>];
	messageDeleteBulk: [WithIntrinsicProps<GatewayMessageDeleteBulkDispatchData>];
	messageReactionAdd: [WithIntrinsicProps<GatewayMessageReactionAddDispatchData>];
	messageReactionRemove: [WithIntrinsicProps<GatewayMessageReactionRemoveDispatchData>];
	messageReactionRemoveAll: [WithIntrinsicProps<GatewayMessageReactionRemoveAllDispatchData>];
	messageReactionRemoveEmoji: [WithIntrinsicProps<GatewayMessageReactionRemoveEmojiDispatchData>];
	messageUpdate: [WithIntrinsicProps<{ message: GatewayMessageUpdateDispatchData }>];
	presenceUpdate: [WithIntrinsicProps<GatewayPresenceUpdate>];
	ready: [WithIntrinsicProps<{ data: GatewayReadyDispatchData }>];
	stageInstanceCreate: [WithIntrinsicProps<{ stage_instance: APIStageInstance }>];
	stageInstanceDelete: [WithIntrinsicProps<{ stage_instance: APIStageInstance }>];
	stageInstanceUpdate: [WithIntrinsicProps<{ stage_instance: APIStageInstance }>];
	threadCreate: [WithIntrinsicProps<{ thread: APIThreadChannel }>];
	threadDelete: [WithIntrinsicProps<{ thread: APIThreadChannel }>];
	threadListSync: [WithIntrinsicProps<GatewayThreadListSync>];
	threadMemberUpdate: [WithIntrinsicProps<GatewayThreadMemberUpdateDispatchData>];
	threadMembersUpdate: [WithIntrinsicProps<GatewayThreadMembersUpdateDispatchData>];
	threadUpdate: [WithIntrinsicProps<{ thread: APIThreadChannel }>];
	userUpdate: [WithIntrinsicProps<{ user: APIUser }>];
	voiceServerUpdate: [WithIntrinsicProps<GatewayVoiceServerUpdateDispatchData>];
	voiceStateUpdate: [WithIntrinsicProps<{ state: GatewayVoiceState }>];
	webhooksUpdate: [WithIntrinsicProps<GatewayWebhooksUpdateDispatchData>];
}

export type ManagerShardEventsMap = {
	[K in keyof MappedEvents]: MappedEvents[K];
};

export class Gateway extends AsyncEventEmitter<ManagerShardEventsMap> {
	public constructor(rest: REST, ws: WebSocketManager) {
		super();

		const eventAPI = api(rest);

		function wrapIntrinsicProps<T extends Record<string, unknown>>(obj: T): WithIntrinsicProps<T> {
			return {
				api: eventAPI,
				...obj,
			};
		}

		ws.on(WebSocketShardEvents.Dispatch, ({ data }) => {
			switch (data.t) {
				case GatewayDispatchEvents.MessageCreate:
					this.emit('messageCreate', wrapIntrinsicProps({ message: data.d }));
					break;
				case GatewayDispatchEvents.InteractionCreate:
					this.emit('interactionCreate', wrapIntrinsicProps({ interaction: data.d }));
					break;
				case GatewayDispatchEvents.Ready:
					this.emit('ready', wrapIntrinsicProps({ data: data.d }));
					break;
				case GatewayDispatchEvents.ChannelCreate:
					this.emit('channelCreate', wrapIntrinsicProps({ channel: data.d }));
					break;
				case GatewayDispatchEvents.ChannelUpdate:
					this.emit('channelUpdate', wrapIntrinsicProps({ channel: data.d }));
					break;
				case GatewayDispatchEvents.ChannelDelete:
					this.emit('channelDelete', wrapIntrinsicProps({ channel: data.d }));
					break;
				case GatewayDispatchEvents.ChannelPinsUpdate:
					this.emit('channelPinsUpdate', wrapIntrinsicProps({ ...data.d }));
					break;
				case GatewayDispatchEvents.GuildBanAdd:
					this.emit('guildBanAdd', wrapIntrinsicProps({ ...data.d }));
					break;
				case GatewayDispatchEvents.GuildBanRemove:
					this.emit('guildBanRemove', wrapIntrinsicProps({ ...data.d }));
					break;
				case GatewayDispatchEvents.GuildCreate:
					this.emit('guildCreate', wrapIntrinsicProps({ guild: data.d }));
					break;
				case GatewayDispatchEvents.GuildUpdate:
					this.emit('guildUpdate', wrapIntrinsicProps({ guild: data.d }));
					break;
				case GatewayDispatchEvents.GuildDelete:
					this.emit('guildDelete', wrapIntrinsicProps({ guild: data.d }));
					break;
				case GatewayDispatchEvents.GuildEmojisUpdate:
					this.emit('guildEmojisUpdate', wrapIntrinsicProps({ ...data.d }));
					break;
				case GatewayDispatchEvents.GuildIntegrationsUpdate:
					this.emit('guildIntegrationsUpdate', wrapIntrinsicProps({ guild_id: data.d.guild_id }));
					break;
				case GatewayDispatchEvents.GuildMemberAdd:
					this.emit('guildMemberAdd', wrapIntrinsicProps({ member: data.d }));
					break;
				case GatewayDispatchEvents.GuildMemberRemove:
					this.emit('guildMemberRemove', wrapIntrinsicProps({ ...data.d }));
					break;
				case GatewayDispatchEvents.GuildMemberUpdate:
					this.emit('guildMemberUpdate', wrapIntrinsicProps({ member: data.d }));
					break;
				case GatewayDispatchEvents.GuildMembersChunk:
					this.emit('guildMembersChunk', wrapIntrinsicProps({ ...data.d }));
					break;
				case GatewayDispatchEvents.GuildRoleCreate:
					this.emit('guildRoleCreate', wrapIntrinsicProps({ ...data.d }));
					break;
				case GatewayDispatchEvents.GuildRoleUpdate:
					this.emit('guildRoleUpdate', wrapIntrinsicProps({ ...data.d }));
					break;
				case GatewayDispatchEvents.GuildRoleDelete:
					this.emit('guildRoleDelete', wrapIntrinsicProps({ ...data.d }));
					break;
				case GatewayDispatchEvents.GuildScheduledEventCreate:
					this.emit('guildScheduledEventCreate', wrapIntrinsicProps({ event: data.d }));
					break;
				case GatewayDispatchEvents.GuildScheduledEventDelete:
					this.emit('guildScheduledEventDelete', wrapIntrinsicProps({ event: data.d }));
					break;
				case GatewayDispatchEvents.GuildScheduledEventUpdate:
					this.emit('guildScheduledEventUpdate', wrapIntrinsicProps({ event: data.d }));
					break;
				case GatewayDispatchEvents.GuildScheduledEventUserAdd:
					this.emit('guildScheduledEventUserAdd', wrapIntrinsicProps({ ...data.d }));
					break;
				case GatewayDispatchEvents.GuildScheduledEventUserRemove:
					this.emit('guildScheduledEventUserRemove', wrapIntrinsicProps({ ...data.d }));
					break;
				case GatewayDispatchEvents.GuildStickersUpdate:
					this.emit('guildStickersUpdate', wrapIntrinsicProps({ ...data.d }));
					break;
				case GatewayDispatchEvents.IntegrationCreate:
					this.emit('integrationCreate', wrapIntrinsicProps({ integration: data.d }));
					break;
				case GatewayDispatchEvents.IntegrationUpdate:
					this.emit('integrationUpdate', wrapIntrinsicProps({ integration: data.d }));
					break;
				case GatewayDispatchEvents.IntegrationDelete:
					this.emit('integrationDelete', wrapIntrinsicProps({ ...data.d }));
					break;
				case GatewayDispatchEvents.InviteCreate:
					this.emit('inviteCreate', wrapIntrinsicProps({ invite: data.d }));
					break;
				case GatewayDispatchEvents.InviteDelete:
					this.emit('inviteDelete', wrapIntrinsicProps({ ...data.d }));
					break;
				case GatewayDispatchEvents.MessageDelete:
					this.emit('messageDelete', wrapIntrinsicProps({ ...data.d }));
					break;
				case GatewayDispatchEvents.MessageDeleteBulk:
					this.emit('messageDeleteBulk', wrapIntrinsicProps({ ...data.d }));
					break;
				case GatewayDispatchEvents.MessageReactionAdd:
					this.emit('messageReactionAdd', wrapIntrinsicProps({ ...data.d }));
					break;
				case GatewayDispatchEvents.MessageReactionRemove:
					this.emit('messageReactionRemove', wrapIntrinsicProps({ ...data.d }));
					break;
				case GatewayDispatchEvents.MessageReactionRemoveAll:
					this.emit('messageReactionRemoveAll', wrapIntrinsicProps({ ...data.d }));
					break;
				case GatewayDispatchEvents.MessageReactionRemoveEmoji:
					this.emit('messageReactionRemoveEmoji', wrapIntrinsicProps({ ...data.d }));
					break;
				case GatewayDispatchEvents.MessageUpdate:
					this.emit('messageUpdate', wrapIntrinsicProps({ message: data.d }));
					break;
				case GatewayDispatchEvents.PresenceUpdate:
					this.emit('presenceUpdate', wrapIntrinsicProps({ ...data.d }));
					break;
				case GatewayDispatchEvents.StageInstanceCreate:
					this.emit('stageInstanceCreate', wrapIntrinsicProps({ stage_instance: data.d }));
					break;
				case GatewayDispatchEvents.StageInstanceUpdate:
					this.emit('stageInstanceUpdate', wrapIntrinsicProps({ stage_instance: data.d }));
					break;
				case GatewayDispatchEvents.StageInstanceDelete:
					this.emit('stageInstanceDelete', wrapIntrinsicProps({ stage_instance: data.d }));
					break;
				case GatewayDispatchEvents.ThreadCreate:
					this.emit('threadCreate', wrapIntrinsicProps({ thread: data.d as APIThreadChannel }));
					break;
				case GatewayDispatchEvents.ThreadUpdate:
					this.emit('threadUpdate', wrapIntrinsicProps({ thread: data.d as APIThreadChannel }));
					break;
				case GatewayDispatchEvents.ThreadDelete:
					this.emit('threadDelete', wrapIntrinsicProps({ thread: data.d as APIThreadChannel }));
					break;
				// eslint-disable-next-line n/no-sync
				case GatewayDispatchEvents.ThreadListSync:
					this.emit('threadListSync', wrapIntrinsicProps({ ...data.d }));
					break;
				case GatewayDispatchEvents.ThreadMemberUpdate:
					this.emit('threadMemberUpdate', wrapIntrinsicProps({ ...data.d }));
					break;
				case GatewayDispatchEvents.ThreadMembersUpdate:
					this.emit('threadMembersUpdate', wrapIntrinsicProps({ ...data.d }));
					break;
				case GatewayDispatchEvents.UserUpdate:
					this.emit('userUpdate', wrapIntrinsicProps({ user: data.d }));
					break;
				case GatewayDispatchEvents.VoiceServerUpdate:
					this.emit('voiceServerUpdate', wrapIntrinsicProps({ ...data.d }));
					break;
				case GatewayDispatchEvents.VoiceStateUpdate:
					this.emit('voiceStateUpdate', wrapIntrinsicProps({ state: data.d }));
					break;
				case GatewayDispatchEvents.WebhooksUpdate:
					this.emit('webhooksUpdate', wrapIntrinsicProps({ ...data.d }));
					break;
				default:
					break;
			}
		});
	}
}
