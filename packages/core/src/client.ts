import { setTimeout } from 'node:timers';
import type { REST } from '@discordjs/rest';
import { calculateShardId } from '@discordjs/util';
import { WebSocketShardEvents } from '@discordjs/ws';
import { DiscordSnowflake } from '@sapphire/snowflake';
import { AsyncEventEmitter } from '@vladfrangu/async_event_emitter';
import {
	GatewayDispatchEvents,
	GatewayOpcodes,
	type APIGuildMember,
	type GatewayAutoModerationActionExecutionDispatchData,
	type GatewayAutoModerationRuleCreateDispatchData,
	type GatewayAutoModerationRuleDeleteDispatchData,
	type GatewayAutoModerationRuleUpdateDispatchData,
	type GatewayChannelCreateDispatchData,
	type GatewayChannelDeleteDispatchData,
	type GatewayChannelPinsUpdateDispatchData,
	type GatewayChannelUpdateDispatchData,
	type GatewayGuildAuditLogEntryCreateDispatchData,
	type GatewayGuildBanAddDispatchData,
	type GatewayGuildBanRemoveDispatchData,
	type GatewayGuildCreateDispatchData,
	type GatewayGuildDeleteDispatchData,
	type GatewayGuildEmojisUpdateDispatchData,
	type GatewayGuildIntegrationsUpdateDispatchData,
	type GatewayGuildMemberAddDispatchData,
	type GatewayGuildMemberRemoveDispatchData,
	type GatewayGuildMemberUpdateDispatchData,
	type GatewayGuildMembersChunkDispatchData,
	type GatewayGuildRoleCreateDispatchData,
	type GatewayGuildRoleDeleteDispatchData,
	type GatewayGuildRoleUpdateDispatchData,
	type GatewayGuildScheduledEventCreateDispatchData,
	type GatewayGuildScheduledEventDeleteDispatchData,
	type GatewayGuildScheduledEventUpdateDispatchData,
	type GatewayGuildScheduledEventUserAddDispatchData,
	type GatewayGuildScheduledEventUserRemoveDispatchData,
	type GatewayGuildStickersUpdateDispatchData,
	type GatewayGuildUpdateDispatchData,
	type GatewayIntegrationCreateDispatchData,
	type GatewayIntegrationDeleteDispatchData,
	type GatewayIntegrationUpdateDispatchData,
	type GatewayInteractionCreateDispatchData,
	type GatewayInviteCreateDispatchData,
	type GatewayInviteDeleteDispatchData,
	type GatewayMessageCreateDispatchData,
	type GatewayMessageDeleteBulkDispatchData,
	type GatewayMessageDeleteDispatchData,
	type GatewayMessageReactionAddDispatchData,
	type GatewayMessageReactionRemoveAllDispatchData,
	type GatewayMessageReactionRemoveDispatchData,
	type GatewayMessageReactionRemoveEmojiDispatchData,
	type GatewayMessageUpdateDispatchData,
	type GatewayPresenceUpdateData,
	type GatewayPresenceUpdateDispatchData,
	type GatewayReadyDispatchData,
	type GatewayRequestGuildMembersData,
	type GatewayStageInstanceCreateDispatchData,
	type GatewayStageInstanceDeleteDispatchData,
	type GatewayStageInstanceUpdateDispatchData,
	type GatewayThreadCreateDispatchData,
	type GatewayThreadDeleteDispatchData,
	type GatewayThreadListSyncDispatchData,
	type GatewayThreadMemberUpdateDispatchData,
	type GatewayThreadMembersUpdateDispatchData,
	type GatewayThreadUpdateDispatchData,
	type GatewayTypingStartDispatchData,
	type GatewayUserUpdateDispatchData,
	type GatewayVoiceServerUpdateDispatchData,
	type GatewayVoiceStateUpdateData,
	type GatewayVoiceStateUpdateDispatchData,
	type GatewayWebhooksUpdateDispatchData,
} from 'discord-api-types/v10';
import type { Gateway } from './Gateway.js';
import { API } from './api/index.js';

export interface IntrinsicProps {
	/**
	 * The REST API
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
	[GatewayDispatchEvents.AutoModerationActionExecution]: [
		WithIntrinsicProps<GatewayAutoModerationActionExecutionDispatchData>,
	];
	[GatewayDispatchEvents.AutoModerationRuleCreate]: [WithIntrinsicProps<GatewayAutoModerationRuleCreateDispatchData>];
	[GatewayDispatchEvents.AutoModerationRuleDelete]: [WithIntrinsicProps<GatewayAutoModerationRuleDeleteDispatchData>];
	[GatewayDispatchEvents.AutoModerationRuleUpdate]: [WithIntrinsicProps<GatewayAutoModerationRuleUpdateDispatchData>];
	[GatewayDispatchEvents.ChannelCreate]: [WithIntrinsicProps<GatewayChannelCreateDispatchData>];
	[GatewayDispatchEvents.ChannelDelete]: [WithIntrinsicProps<GatewayChannelDeleteDispatchData>];
	[GatewayDispatchEvents.ChannelPinsUpdate]: [WithIntrinsicProps<GatewayChannelPinsUpdateDispatchData>];
	[GatewayDispatchEvents.ChannelUpdate]: [WithIntrinsicProps<GatewayChannelUpdateDispatchData>];
	[GatewayDispatchEvents.GuildAuditLogEntryCreate]: [WithIntrinsicProps<GatewayGuildAuditLogEntryCreateDispatchData>];
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
	[GatewayDispatchEvents.GuildRoleCreate]: [WithIntrinsicProps<GatewayGuildRoleCreateDispatchData>];
	[GatewayDispatchEvents.GuildRoleDelete]: [WithIntrinsicProps<GatewayGuildRoleDeleteDispatchData>];
	[GatewayDispatchEvents.GuildRoleUpdate]: [WithIntrinsicProps<GatewayGuildRoleUpdateDispatchData>];
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
	[GatewayDispatchEvents.Resumed]: [WithIntrinsicProps<never>];
	[GatewayDispatchEvents.StageInstanceCreate]: [WithIntrinsicProps<GatewayStageInstanceCreateDispatchData>];
	[GatewayDispatchEvents.StageInstanceDelete]: [WithIntrinsicProps<GatewayStageInstanceDeleteDispatchData>];
	[GatewayDispatchEvents.StageInstanceUpdate]: [WithIntrinsicProps<GatewayStageInstanceUpdateDispatchData>];
	[GatewayDispatchEvents.ThreadCreate]: [WithIntrinsicProps<GatewayThreadCreateDispatchData>];
	[GatewayDispatchEvents.ThreadDelete]: [WithIntrinsicProps<GatewayThreadDeleteDispatchData>];
	[GatewayDispatchEvents.ThreadListSync]: [WithIntrinsicProps<GatewayThreadListSyncDispatchData>];
	[GatewayDispatchEvents.ThreadMemberUpdate]: [WithIntrinsicProps<GatewayThreadMemberUpdateDispatchData>];
	[GatewayDispatchEvents.ThreadMembersUpdate]: [WithIntrinsicProps<GatewayThreadMembersUpdateDispatchData>];
	[GatewayDispatchEvents.ThreadUpdate]: [WithIntrinsicProps<GatewayThreadUpdateDispatchData>];
	[GatewayDispatchEvents.TypingStart]: [WithIntrinsicProps<GatewayTypingStartDispatchData>];
	[GatewayDispatchEvents.UserUpdate]: [WithIntrinsicProps<GatewayUserUpdateDispatchData>];
	[GatewayDispatchEvents.VoiceServerUpdate]: [WithIntrinsicProps<GatewayVoiceServerUpdateDispatchData>];
	[GatewayDispatchEvents.VoiceStateUpdate]: [WithIntrinsicProps<GatewayVoiceStateUpdateDispatchData>];
	[GatewayDispatchEvents.WebhooksUpdate]: [WithIntrinsicProps<GatewayWebhooksUpdateDispatchData>];
}

export type ManagerShardEventsMap = {
	[K in keyof MappedEvents]: MappedEvents[K];
};

export interface ClientOptions {
	gateway: Gateway;
	rest: REST;
}

export class Client extends AsyncEventEmitter<ManagerShardEventsMap> {
	public readonly rest: REST;

	public readonly gateway: Gateway;

	public readonly api: API;

	public constructor({ rest, gateway }: ClientOptions) {
		super();
		this.rest = rest;
		this.gateway = gateway;
		this.api = new API(rest);

		this.gateway.on(WebSocketShardEvents.Dispatch, ({ data: dispatch, shardId }) => {
			// @ts-expect-error event props can't be resolved properly, but they are correct
			this.emit(dispatch.t, this.wrapIntrinsicProps(dispatch.d, shardId));
		});
	}

	/**
	 * Requests guild members from the gateway.
	 *
	 * @see {@link https://discord.com/developers/docs/topics/gateway-events#request-guild-members}
	 * @param options - The options for the request
	 * @param timeout - The timeout for waiting for each guild members chunk event
	 */
	public async requestGuildMembers(options: GatewayRequestGuildMembersData, timeout = 10_000) {
		const shardId = calculateShardId(options.guild_id, await this.gateway.getShardCount());
		const nonce = options.nonce ?? DiscordSnowflake.generate().toString();

		const promise = new Promise<APIGuildMember[]>((resolve, reject) => {
			const guildMembers: APIGuildMember[] = [];

			const timer = setTimeout(() => {
				reject(new Error('Request timed out'));
			}, timeout);

			const handler = ({ data }: MappedEvents[GatewayDispatchEvents.GuildMembersChunk][0]) => {
				timer.refresh();

				if (data.nonce !== nonce) return;

				guildMembers.push(...data.members);

				if (data.chunk_index >= data.chunk_count - 1) {
					this.off(GatewayDispatchEvents.GuildMembersChunk, handler);
					resolve(guildMembers);
				}
			};

			this.on(GatewayDispatchEvents.GuildMembersChunk, handler);
		});

		await this.gateway.send(shardId, {
			op: GatewayOpcodes.RequestGuildMembers,
			// eslint-disable-next-line id-length
			d: {
				...options,
				nonce,
			},
		});

		return promise;
	}

	/**
	 * Updates the voice state of the bot user
	 *
	 * @see {@link https://discord.com/developers/docs/topics/gateway-events#update-voice-state}
	 * @param options - The options for updating the voice state
	 */
	public async updateVoiceState(options: GatewayVoiceStateUpdateData) {
		const shardId = calculateShardId(options.guild_id, await this.gateway.getShardCount());

		await this.gateway.send(shardId, {
			op: GatewayOpcodes.VoiceStateUpdate,
			// eslint-disable-next-line id-length
			d: options,
		});
	}

	/**
	 * Updates the presence of the bot user
	 *
	 * @param shardId - The id of the shard to update the presence in
	 * @param options - The options for updating the presence
	 */
	public async updatePresence(shardId: number, options: GatewayPresenceUpdateData) {
		await this.gateway.send(shardId, {
			op: GatewayOpcodes.PresenceUpdate,
			// eslint-disable-next-line id-length
			d: options,
		});
	}

	private wrapIntrinsicProps<T>(obj: T, shardId: number): WithIntrinsicProps<T> {
		return {
			api: this.api,
			shardId,
			data: obj,
		};
	}
}
