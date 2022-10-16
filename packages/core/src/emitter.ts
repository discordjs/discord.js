import type { REST } from '@discordjs/rest';
import { WebSocketShardEvents, type WebSocketManager } from '@discordjs/ws';
import { AsyncEventEmitter } from '@vladfrangu/async_event_emitter';
import type {
	GatewayChannelCreateDispatchData,
	GatewayChannelDeleteDispatchData,
	GatewayChannelPinsUpdateDispatchData,
	GatewayChannelUpdateDispatchData,
	GatewayDispatchEvents,
	GatewayGuildBanAddDispatchData,
	GatewayGuildBanRemoveDispatchData,
	GatewayGuildCreateDispatchData,
	GatewayGuildDeleteDispatchData,
	GatewayGuildEmojisUpdateDispatchData,
	GatewayGuildIntegrationsUpdateDispatchData,
	GatewayGuildMemberAddDispatchData,
	GatewayGuildMemberRemoveDispatchData,
	GatewayGuildMembersChunkDispatchData,
	GatewayGuildMemberUpdateDispatchData,
	GatewayGuildRoleDeleteDispatchData,
	GatewayGuildRoleModifyDispatchData,
	GatewayGuildScheduledEventCreateDispatchData,
	GatewayGuildScheduledEventDeleteDispatchData,
	GatewayGuildScheduledEventUpdateDispatchData,
	GatewayGuildScheduledEventUserAddDispatchData,
	GatewayGuildScheduledEventUserRemoveDispatchData,
	GatewayGuildStickersUpdateDispatchData,
	GatewayGuildUpdateDispatchData,
	GatewayIntegrationCreateDispatchData,
	GatewayIntegrationDeleteDispatchData,
	GatewayIntegrationUpdateDispatchData,
	GatewayInteractionCreateDispatchData,
	GatewayInviteCreateDispatchData,
	GatewayInviteDeleteDispatchData,
	GatewayMessageCreateDispatchData,
	GatewayMessageDeleteBulkDispatchData,
	GatewayMessageDeleteDispatchData,
	GatewayMessageReactionAddDispatchData,
	GatewayMessageReactionRemoveAllDispatchData,
	GatewayMessageReactionRemoveDispatchData,
	GatewayMessageReactionRemoveEmojiDispatchData,
	GatewayMessageUpdateDispatchData,
	GatewayPresenceUpdateDispatchData,
	GatewayReadyDispatchData,
	GatewayResumedDispatch,
	GatewayStageInstanceCreateDispatchData,
	GatewayStageInstanceDeleteDispatchData,
	GatewayStageInstanceUpdateDispatchData,
	GatewayThreadCreateDispatchData,
	GatewayThreadDeleteDispatchData,
	GatewayThreadListSync,
	GatewayThreadMembersUpdateDispatchData,
	GatewayThreadMemberUpdateDispatchData,
	GatewayThreadUpdateDispatchData,
	GatewayTypingStartDispatchData,
	GatewayUserUpdateDispatchData,
	GatewayVoiceServerUpdateDispatchData,
	GatewayVoiceStateUpdateDispatchData,
	GatewayWebhooksUpdateDispatchData,
} from 'discord-api-types/v10';
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

export interface WithIntrinsicProps<T> extends IntrinsicProps {
	data: T;
}

export interface MappedEvents {
	[GatewayDispatchEvents.ChannelCreate]: [WithIntrinsicProps<GatewayChannelCreateDispatchData>];
	[GatewayDispatchEvents.ChannelDelete]: [WithIntrinsicProps<GatewayChannelDeleteDispatchData>];
	[GatewayDispatchEvents.ChannelPinsUpdate]: [WithIntrinsicProps<GatewayChannelPinsUpdateDispatchData>];
	[GatewayDispatchEvents.ChannelUpdate]: [WithIntrinsicProps<GatewayChannelUpdateDispatchData>];
	[GatewayDispatchEvents.GuildBanAdd]: [WithIntrinsicProps<GatewayGuildBanAddDispatchData>];
	[GatewayDispatchEvents.GuildBanRemove]: [WithIntrinsicProps<GatewayGuildBanRemoveDispatchData>];
	[GatewayDispatchEvents.GuildCreate]: [WithIntrinsicProps<GatewayGuildCreateDispatchData>];
	[GatewayDispatchEvents.GuildDelete]: [WithIntrinsicProps<GatewayGuildDeleteDispatchData>];
	[GatewayDispatchEvents.GuildEmojisUpdate]: [WithIntrinsicProps<GatewayGuildEmojisUpdateDispatchData>];
	[GatewayDispatchEvents.GuildIntegrationsUpdate]: [WithIntrinsicProps<GatewayGuildIntegrationsUpdateDispatchData>];
	[GatewayDispatchEvents.GuildMemberAdd]: [WithIntrinsicProps<GatewayGuildMemberAddDispatchData>];
	[GatewayDispatchEvents.GuildMemberRemove]: [WithIntrinsicProps<GatewayGuildMemberRemoveDispatchData>];
	[GatewayDispatchEvents.GuildMemberUpdate]: [WithIntrinsicProps<GatewayGuildMemberUpdateDispatchData>];
	[GatewayDispatchEvents.GuildMembersChunk]: [WithIntrinsicProps<GatewayGuildMembersChunkDispatchData>];
	[GatewayDispatchEvents.GuildRoleCreate]: [WithIntrinsicProps<GatewayGuildRoleModifyDispatchData>];
	[GatewayDispatchEvents.GuildRoleDelete]: [WithIntrinsicProps<GatewayGuildRoleDeleteDispatchData>];
	[GatewayDispatchEvents.GuildRoleUpdate]: [WithIntrinsicProps<GatewayGuildRoleModifyDispatchData>];
	[GatewayDispatchEvents.GuildScheduledEventCreate]: [WithIntrinsicProps<GatewayGuildScheduledEventCreateDispatchData>];
	[GatewayDispatchEvents.GuildScheduledEventDelete]: [WithIntrinsicProps<GatewayGuildScheduledEventDeleteDispatchData>];
	[GatewayDispatchEvents.GuildScheduledEventUpdate]: [WithIntrinsicProps<GatewayGuildScheduledEventUpdateDispatchData>];
	[GatewayDispatchEvents.GuildScheduledEventUserAdd]: [
		WithIntrinsicProps<GatewayGuildScheduledEventUserAddDispatchData>,
	];
	[GatewayDispatchEvents.GuildScheduledEventUserRemove]: [
		WithIntrinsicProps<GatewayGuildScheduledEventUserRemoveDispatchData>,
	];
	[GatewayDispatchEvents.GuildStickersUpdate]: [WithIntrinsicProps<GatewayGuildStickersUpdateDispatchData>];
	[GatewayDispatchEvents.GuildUpdate]: [WithIntrinsicProps<GatewayGuildUpdateDispatchData>];
	[GatewayDispatchEvents.IntegrationCreate]: [WithIntrinsicProps<GatewayIntegrationCreateDispatchData>];
	[GatewayDispatchEvents.IntegrationDelete]: [WithIntrinsicProps<GatewayIntegrationDeleteDispatchData>];
	[GatewayDispatchEvents.IntegrationUpdate]: [WithIntrinsicProps<GatewayIntegrationUpdateDispatchData>];
	[GatewayDispatchEvents.InteractionCreate]: [WithIntrinsicProps<GatewayInteractionCreateDispatchData>];
	[GatewayDispatchEvents.InviteCreate]: [WithIntrinsicProps<GatewayInviteCreateDispatchData>];
	[GatewayDispatchEvents.InviteDelete]: [WithIntrinsicProps<GatewayInviteDeleteDispatchData>];
	[GatewayDispatchEvents.MessageCreate]: [WithIntrinsicProps<GatewayMessageCreateDispatchData>];
	[GatewayDispatchEvents.MessageDelete]: [WithIntrinsicProps<GatewayMessageDeleteDispatchData>];
	[GatewayDispatchEvents.MessageDeleteBulk]: [WithIntrinsicProps<GatewayMessageDeleteBulkDispatchData>];
	[GatewayDispatchEvents.MessageReactionAdd]: [WithIntrinsicProps<GatewayMessageReactionAddDispatchData>];
	[GatewayDispatchEvents.MessageReactionRemove]: [WithIntrinsicProps<GatewayMessageReactionRemoveDispatchData>];
	[GatewayDispatchEvents.MessageReactionRemoveAll]: [WithIntrinsicProps<GatewayMessageReactionRemoveAllDispatchData>];
	[GatewayDispatchEvents.MessageReactionRemoveEmoji]: [
		WithIntrinsicProps<GatewayMessageReactionRemoveEmojiDispatchData>,
	];
	[GatewayDispatchEvents.MessageUpdate]: [WithIntrinsicProps<GatewayMessageUpdateDispatchData>];
	[GatewayDispatchEvents.PresenceUpdate]: [WithIntrinsicProps<GatewayPresenceUpdateDispatchData>];
	[GatewayDispatchEvents.Ready]: [WithIntrinsicProps<GatewayReadyDispatchData>];
	[GatewayDispatchEvents.StageInstanceCreate]: [WithIntrinsicProps<GatewayStageInstanceCreateDispatchData>];
	[GatewayDispatchEvents.StageInstanceDelete]: [WithIntrinsicProps<GatewayStageInstanceDeleteDispatchData>];
	[GatewayDispatchEvents.StageInstanceUpdate]: [WithIntrinsicProps<GatewayStageInstanceUpdateDispatchData>];
	[GatewayDispatchEvents.ThreadCreate]: [WithIntrinsicProps<GatewayThreadCreateDispatchData>];
	[GatewayDispatchEvents.ThreadDelete]: [WithIntrinsicProps<GatewayThreadDeleteDispatchData>];
	[GatewayDispatchEvents.ThreadListSync]: [WithIntrinsicProps<GatewayThreadListSync>];
	[GatewayDispatchEvents.ThreadMemberUpdate]: [WithIntrinsicProps<GatewayThreadMemberUpdateDispatchData>];
	[GatewayDispatchEvents.ThreadMembersUpdate]: [WithIntrinsicProps<GatewayThreadMembersUpdateDispatchData>];
	[GatewayDispatchEvents.ThreadUpdate]: [WithIntrinsicProps<GatewayThreadUpdateDispatchData>];
	[GatewayDispatchEvents.UserUpdate]: [WithIntrinsicProps<GatewayUserUpdateDispatchData>];
	[GatewayDispatchEvents.VoiceServerUpdate]: [WithIntrinsicProps<GatewayVoiceServerUpdateDispatchData>];
	[GatewayDispatchEvents.VoiceStateUpdate]: [WithIntrinsicProps<GatewayVoiceStateUpdateDispatchData>];
	[GatewayDispatchEvents.WebhooksUpdate]: [WithIntrinsicProps<GatewayWebhooksUpdateDispatchData>];
	[GatewayDispatchEvents.Resumed]: [WithIntrinsicProps<GatewayResumedDispatch['d']>];
	[GatewayDispatchEvents.TypingStart]: [WithIntrinsicProps<GatewayTypingStartDispatchData>];
}

export type ManagerShardEventsMap = {
	[K in keyof MappedEvents]: MappedEvents[K];
};

export interface EmitterOptions {
	rest: REST;
	ws: WebSocketManager;
}

export function createEmitter({ rest, ws }: EmitterOptions) {
	const eventAPI = new API(rest);
	const emitter = new AsyncEventEmitter<ManagerShardEventsMap>();

	ws.on(WebSocketShardEvents.Dispatch, ({ data: dispatch, shardId }) => {
		function wrapIntrinsicProps<T>(obj: T): WithIntrinsicProps<T> {
			return {
				api: eventAPI,
				shardId,
				data: obj,
			};
		}

		// @ts-expect-error event props can't be resolved properly, but they are correct
		emitter.emit(dispatch.t, wrapIntrinsicProps(dispatch.d));
	});

	return emitter;
}
