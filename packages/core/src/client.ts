import type { REST } from '@discordjs/rest';
import type { WebSocketManager } from '@discordjs/ws';
import { WebSocketShardEvents } from '@discordjs/ws';
import { AsyncEventEmitter } from '@vladfrangu/async_event_emitter';
import type {
	GatewayDispatchPayload,
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
import { API } from './api/index.js';

export interface IntrinsicProps {
	/**
	 * The rest API
	 */
	api: API;
	/**
	 * The id of the shard that emitted the event
	 */
	shardId: number;
}

export type WithIntrinsicProps<T> = IntrinsicProps & T;

export interface MappedEvents {
	channelCreate: [WithIntrinsicProps<{ channel: APIChannel }>];
	channelDelete: [WithIntrinsicProps<{ channel: APIChannel }>];
	channelPinsUpdate: [WithIntrinsicProps<{ data: GatewayChannelPinsUpdateDispatchData }>];
	channelUpdate: [WithIntrinsicProps<{ channel: APIChannel }>];
	dispatch: [WithIntrinsicProps<{ data: GatewayDispatchPayload }>];
	guildBanAdd: [WithIntrinsicProps<{ guild_id: string; user: APIUser }>];
	guildBanRemove: [WithIntrinsicProps<{ guild_id: string; user: APIUser }>];
	guildCreate: [WithIntrinsicProps<{ guild: GatewayGuildCreateDispatchData }>];
	guildDelete: [WithIntrinsicProps<{ guild: APIUnavailableGuild }>];
	guildEmojisUpdate: [WithIntrinsicProps<{ emojis: APIEmoji[]; guild_id: string }>];
	guildIntegrationsUpdate: [WithIntrinsicProps<{ guild_id: string }>];
	guildMemberAdd: [WithIntrinsicProps<{ member: GatewayGuildMemberAddDispatchData }>];
	guildMemberRemove: [WithIntrinsicProps<{ guild_id: string; user: APIUser }>];
	guildMemberUpdate: [WithIntrinsicProps<{ member: GatewayGuildMemberUpdateDispatchData }>];
	guildMembersChunk: [WithIntrinsicProps<{ data: GatewayGuildMembersChunkDispatchData }>];
	guildRoleCreate: [WithIntrinsicProps<{ data: GatewayGuildRoleModifyDispatchData }>];
	guildRoleDelete: [WithIntrinsicProps<{ data: GatewayGuildRoleDeleteDispatchData }>];
	guildRoleUpdate: [WithIntrinsicProps<{ data: GatewayGuildRoleModifyDispatchData }>];
	guildScheduledEventCreate: [WithIntrinsicProps<{ event: APIGuildScheduledEvent }>];
	guildScheduledEventDelete: [WithIntrinsicProps<{ event: APIGuildScheduledEvent }>];
	guildScheduledEventUpdate: [WithIntrinsicProps<{ event: APIGuildScheduledEvent }>];
	guildScheduledEventUserAdd: [WithIntrinsicProps<{ data: GatewayGuildScheduledEventUserAddDispatchData }>];
	guildScheduledEventUserRemove: [WithIntrinsicProps<{ data: GatewayGuildScheduledEventUserRemoveDispatchData }>];
	guildStickersUpdate: [WithIntrinsicProps<{ data: GatewayGuildStickersUpdateDispatchData }>];
	guildUpdate: [WithIntrinsicProps<{ guild: APIGuild }>];
	integrationCreate: [WithIntrinsicProps<{ integration: GatewayIntegrationCreateDispatchData }>];
	integrationDelete: [WithIntrinsicProps<{ data: GatewayIntegrationDeleteDispatchData }>];
	integrationUpdate: [WithIntrinsicProps<{ integration: GatewayIntegrationUpdateDispatchData }>];
	interactionCreate: [WithIntrinsicProps<{ interaction: APIInteraction }>];
	inviteCreate: [WithIntrinsicProps<{ invite: GatewayInviteCreateDispatchData }>];
	inviteDelete: [WithIntrinsicProps<{ data: GatewayInviteDeleteDispatchData }>];
	messageCreate: [WithIntrinsicProps<{ message: APIMessage }>];
	messageDelete: [WithIntrinsicProps<{ data: GatewayMessageDeleteDispatchData }>];
	messageDeleteBulk: [WithIntrinsicProps<{ data: GatewayMessageDeleteBulkDispatchData }>];
	messageReactionAdd: [WithIntrinsicProps<{ data: GatewayMessageReactionAddDispatchData }>];
	messageReactionRemove: [WithIntrinsicProps<{ data: GatewayMessageReactionRemoveDispatchData }>];
	messageReactionRemoveAll: [WithIntrinsicProps<{ data: GatewayMessageReactionRemoveAllDispatchData }>];
	messageReactionRemoveEmoji: [WithIntrinsicProps<{ data: GatewayMessageReactionRemoveEmojiDispatchData }>];
	messageUpdate: [WithIntrinsicProps<{ message: GatewayMessageUpdateDispatchData }>];
	presenceUpdate: [WithIntrinsicProps<{ data: GatewayPresenceUpdate }>];
	ready: [WithIntrinsicProps<{ data: GatewayReadyDispatchData }>];
	stageInstanceCreate: [WithIntrinsicProps<{ stage_instance: APIStageInstance }>];
	stageInstanceDelete: [WithIntrinsicProps<{ stage_instance: APIStageInstance }>];
	stageInstanceUpdate: [WithIntrinsicProps<{ stage_instance: APIStageInstance }>];
	threadCreate: [WithIntrinsicProps<{ thread: APIThreadChannel }>];
	threadDelete: [WithIntrinsicProps<{ thread: APIThreadChannel }>];
	threadListSync: [WithIntrinsicProps<{ data: GatewayThreadListSync }>];
	threadMemberUpdate: [WithIntrinsicProps<{ data: GatewayThreadMemberUpdateDispatchData }>];
	threadMembersUpdate: [WithIntrinsicProps<{ data: GatewayThreadMembersUpdateDispatchData }>];
	threadUpdate: [WithIntrinsicProps<{ thread: APIThreadChannel }>];
	userUpdate: [WithIntrinsicProps<{ user: APIUser }>];
	voiceServerUpdate: [WithIntrinsicProps<{ data: GatewayVoiceServerUpdateDispatchData }>];
	voiceStateUpdate: [WithIntrinsicProps<{ state: GatewayVoiceState }>];
	webhooksUpdate: [WithIntrinsicProps<{ data: GatewayWebhooksUpdateDispatchData }>];
}

export type ManagerShardEventsMap = {
	[K in keyof MappedEvents]: MappedEvents[K];
};

export interface ClientOptions {
	rest: REST;
	ws: WebSocketManager;
}

export function createClient({ rest, ws }: ClientOptions) {
	const eventAPI = new API(rest);
	const emitter = new AsyncEventEmitter<ManagerShardEventsMap>();

	ws.on(WebSocketShardEvents.Dispatch, ({ data: dispatch, shardId }) => {
		function wrapIntrinsicProps<T>(obj: T): WithIntrinsicProps<T> {
			return {
				api: eventAPI,
				shardId,
				...obj,
			};
		}

		emitter.emit('dispatch', wrapIntrinsicProps({ data: dispatch }));
		switch (dispatch.t) {
			case GatewayDispatchEvents.MessageCreate:
				emitter.emit('messageCreate', wrapIntrinsicProps({ message: dispatch.d }));
				break;
			case GatewayDispatchEvents.InteractionCreate:
				emitter.emit('interactionCreate', wrapIntrinsicProps({ interaction: dispatch.d }));
				break;
			case GatewayDispatchEvents.Ready:
				emitter.emit('ready', wrapIntrinsicProps({ data: dispatch.d }));
				break;
			case GatewayDispatchEvents.ChannelCreate:
				emitter.emit('channelCreate', wrapIntrinsicProps({ channel: dispatch.d }));
				break;
			case GatewayDispatchEvents.ChannelUpdate:
				emitter.emit('channelUpdate', wrapIntrinsicProps({ channel: dispatch.d }));
				break;
			case GatewayDispatchEvents.ChannelDelete:
				emitter.emit('channelDelete', wrapIntrinsicProps({ channel: dispatch.d }));
				break;
			case GatewayDispatchEvents.ChannelPinsUpdate:
				emitter.emit('channelPinsUpdate', wrapIntrinsicProps({ data: dispatch.d }));
				break;
			case GatewayDispatchEvents.GuildBanAdd:
				emitter.emit('guildBanAdd', wrapIntrinsicProps(dispatch.d));
				break;
			case GatewayDispatchEvents.GuildBanRemove:
				emitter.emit('guildBanRemove', wrapIntrinsicProps(dispatch.d));
				break;
			case GatewayDispatchEvents.GuildCreate:
				emitter.emit('guildCreate', wrapIntrinsicProps({ guild: dispatch.d }));
				break;
			case GatewayDispatchEvents.GuildUpdate:
				emitter.emit('guildUpdate', wrapIntrinsicProps({ guild: dispatch.d }));
				break;
			case GatewayDispatchEvents.GuildDelete:
				emitter.emit('guildDelete', wrapIntrinsicProps({ guild: dispatch.d }));
				break;
			case GatewayDispatchEvents.GuildEmojisUpdate:
				emitter.emit('guildEmojisUpdate', wrapIntrinsicProps(dispatch.d));
				break;
			case GatewayDispatchEvents.GuildIntegrationsUpdate:
				emitter.emit('guildIntegrationsUpdate', wrapIntrinsicProps({ guild_id: dispatch.d.guild_id }));
				break;
			case GatewayDispatchEvents.GuildMemberAdd:
				emitter.emit('guildMemberAdd', wrapIntrinsicProps({ member: dispatch.d }));
				break;
			case GatewayDispatchEvents.GuildMemberRemove:
				emitter.emit('guildMemberRemove', wrapIntrinsicProps(dispatch.d));
				break;
			case GatewayDispatchEvents.GuildMemberUpdate:
				emitter.emit('guildMemberUpdate', wrapIntrinsicProps({ member: dispatch.d }));
				break;
			case GatewayDispatchEvents.GuildMembersChunk:
				emitter.emit('guildMembersChunk', wrapIntrinsicProps({ data: dispatch.d }));
				break;
			case GatewayDispatchEvents.GuildRoleCreate:
				emitter.emit('guildRoleCreate', wrapIntrinsicProps({ data: dispatch.d }));
				break;
			case GatewayDispatchEvents.GuildRoleUpdate:
				emitter.emit('guildRoleUpdate', wrapIntrinsicProps({ data: dispatch.d }));
				break;
			case GatewayDispatchEvents.GuildRoleDelete:
				emitter.emit('guildRoleDelete', wrapIntrinsicProps({ data: dispatch.d }));
				break;
			case GatewayDispatchEvents.GuildScheduledEventCreate:
				emitter.emit('guildScheduledEventCreate', wrapIntrinsicProps({ event: dispatch.d }));
				break;
			case GatewayDispatchEvents.GuildScheduledEventDelete:
				emitter.emit('guildScheduledEventDelete', wrapIntrinsicProps({ event: dispatch.d }));
				break;
			case GatewayDispatchEvents.GuildScheduledEventUpdate:
				emitter.emit('guildScheduledEventUpdate', wrapIntrinsicProps({ event: dispatch.d }));
				break;
			case GatewayDispatchEvents.GuildScheduledEventUserAdd:
				emitter.emit('guildScheduledEventUserAdd', wrapIntrinsicProps({ data: dispatch.d }));
				break;
			case GatewayDispatchEvents.GuildScheduledEventUserRemove:
				emitter.emit('guildScheduledEventUserRemove', wrapIntrinsicProps({ data: dispatch.d }));
				break;
			case GatewayDispatchEvents.GuildStickersUpdate:
				emitter.emit('guildStickersUpdate', wrapIntrinsicProps({ data: dispatch.d }));
				break;
			case GatewayDispatchEvents.IntegrationCreate:
				emitter.emit('integrationCreate', wrapIntrinsicProps({ integration: dispatch.d }));
				break;
			case GatewayDispatchEvents.IntegrationUpdate:
				emitter.emit('integrationUpdate', wrapIntrinsicProps({ integration: dispatch.d }));
				break;
			case GatewayDispatchEvents.IntegrationDelete:
				emitter.emit('integrationDelete', wrapIntrinsicProps({ data: dispatch.d }));
				break;
			case GatewayDispatchEvents.InviteCreate:
				emitter.emit('inviteCreate', wrapIntrinsicProps({ invite: dispatch.d }));
				break;
			case GatewayDispatchEvents.InviteDelete:
				emitter.emit('inviteDelete', wrapIntrinsicProps({ data: dispatch.d }));
				break;
			case GatewayDispatchEvents.MessageDelete:
				emitter.emit('messageDelete', wrapIntrinsicProps({ data: dispatch.d }));
				break;
			case GatewayDispatchEvents.MessageDeleteBulk:
				emitter.emit('messageDeleteBulk', wrapIntrinsicProps({ data: dispatch.d }));
				break;
			case GatewayDispatchEvents.MessageReactionAdd:
				emitter.emit('messageReactionAdd', wrapIntrinsicProps({ data: dispatch.d }));
				break;
			case GatewayDispatchEvents.MessageReactionRemove:
				emitter.emit('messageReactionRemove', wrapIntrinsicProps({ data: dispatch.d }));
				break;
			case GatewayDispatchEvents.MessageReactionRemoveAll:
				emitter.emit('messageReactionRemoveAll', wrapIntrinsicProps({ data: dispatch.d }));
				break;
			case GatewayDispatchEvents.MessageReactionRemoveEmoji:
				emitter.emit('messageReactionRemoveEmoji', wrapIntrinsicProps({ data: dispatch.d }));
				break;
			case GatewayDispatchEvents.MessageUpdate:
				emitter.emit('messageUpdate', wrapIntrinsicProps({ message: dispatch.d }));
				break;
			case GatewayDispatchEvents.PresenceUpdate:
				emitter.emit('presenceUpdate', wrapIntrinsicProps({ data: dispatch.d }));
				break;
			case GatewayDispatchEvents.StageInstanceCreate:
				emitter.emit('stageInstanceCreate', wrapIntrinsicProps({ stage_instance: dispatch.d }));
				break;
			case GatewayDispatchEvents.StageInstanceUpdate:
				emitter.emit('stageInstanceUpdate', wrapIntrinsicProps({ stage_instance: dispatch.d }));
				break;
			case GatewayDispatchEvents.StageInstanceDelete:
				emitter.emit('stageInstanceDelete', wrapIntrinsicProps({ stage_instance: dispatch.d }));
				break;
			case GatewayDispatchEvents.ThreadCreate:
				emitter.emit('threadCreate', wrapIntrinsicProps({ thread: dispatch.d as APIThreadChannel }));
				break;
			case GatewayDispatchEvents.ThreadUpdate:
				emitter.emit('threadUpdate', wrapIntrinsicProps({ thread: dispatch.d as APIThreadChannel }));
				break;
			case GatewayDispatchEvents.ThreadDelete:
				emitter.emit('threadDelete', wrapIntrinsicProps({ thread: dispatch.d as APIThreadChannel }));
				break;
			// eslint-disable-next-line n/no-sync
			case GatewayDispatchEvents.ThreadListSync:
				emitter.emit('threadListSync', wrapIntrinsicProps({ data: dispatch.d }));
				break;
			case GatewayDispatchEvents.ThreadMemberUpdate:
				emitter.emit('threadMemberUpdate', wrapIntrinsicProps({ data: dispatch.d }));
				break;
			case GatewayDispatchEvents.ThreadMembersUpdate:
				emitter.emit('threadMembersUpdate', wrapIntrinsicProps({ data: dispatch.d }));
				break;
			case GatewayDispatchEvents.UserUpdate:
				emitter.emit('userUpdate', wrapIntrinsicProps({ user: dispatch.d }));
				break;
			case GatewayDispatchEvents.VoiceServerUpdate:
				emitter.emit('voiceServerUpdate', wrapIntrinsicProps({ data: dispatch.d }));
				break;
			case GatewayDispatchEvents.VoiceStateUpdate:
				emitter.emit('voiceStateUpdate', wrapIntrinsicProps({ state: dispatch.d }));
				break;
			case GatewayDispatchEvents.WebhooksUpdate:
				emitter.emit('webhooksUpdate', wrapIntrinsicProps({ data: dispatch.d }));
				break;
			default:
				break;
		}
	});

	return emitter;
}
