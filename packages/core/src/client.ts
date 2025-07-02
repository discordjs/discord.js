import { clearTimeout, setTimeout } from 'node:timers';
import type { REST } from '@discordjs/rest';
import { calculateShardId } from '@discordjs/util';
import { WebSocketShardEvents } from '@discordjs/ws';
import { DiscordSnowflake } from '@sapphire/snowflake';
import { AsyncEventEmitter } from '@vladfrangu/async_event_emitter';
import {
	GatewayDispatchEvents,
	GatewayOpcodes,
	type GatewayApplicationCommandPermissionsUpdateDispatchData,
	type GatewayAutoModerationActionExecutionDispatchData,
	type GatewayAutoModerationRuleCreateDispatchData,
	type GatewayAutoModerationRuleDeleteDispatchData,
	type GatewayAutoModerationRuleUpdateDispatchData,
	type GatewayChannelCreateDispatchData,
	type GatewayChannelDeleteDispatchData,
	type GatewayChannelPinsUpdateDispatchData,
	type GatewayChannelUpdateDispatchData,
	type GatewayEntitlementCreateDispatchData,
	type GatewayEntitlementDeleteDispatchData,
	type GatewayEntitlementUpdateDispatchData,
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
	type GatewayGuildSoundboardSoundCreateDispatch,
	type GatewayGuildSoundboardSoundDeleteDispatch,
	type GatewayGuildSoundboardSoundUpdateDispatch,
	type GatewayGuildSoundboardSoundsUpdateDispatch,
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
	type GatewayMessagePollVoteDispatchData,
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
	type GatewaySubscriptionCreateDispatchData,
	type GatewaySubscriptionDeleteDispatchData,
	type GatewaySubscriptionUpdateDispatchData,
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
	type GatewayRequestSoundboardSoundsData,
	type GatewaySoundboardSoundsDispatchData,
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

export interface ToEventProps<Data> extends IntrinsicProps {
	data: Data;
}

export interface MappedEvents {
	[GatewayDispatchEvents.ApplicationCommandPermissionsUpdate]: [
		ToEventProps<GatewayApplicationCommandPermissionsUpdateDispatchData>,
	];
	[GatewayDispatchEvents.AutoModerationActionExecution]: [
		ToEventProps<GatewayAutoModerationActionExecutionDispatchData>,
	];
	[GatewayDispatchEvents.AutoModerationRuleCreate]: [ToEventProps<GatewayAutoModerationRuleCreateDispatchData>];
	[GatewayDispatchEvents.AutoModerationRuleDelete]: [ToEventProps<GatewayAutoModerationRuleDeleteDispatchData>];
	[GatewayDispatchEvents.AutoModerationRuleUpdate]: [ToEventProps<GatewayAutoModerationRuleUpdateDispatchData>];
	[GatewayDispatchEvents.ChannelCreate]: [ToEventProps<GatewayChannelCreateDispatchData>];
	[GatewayDispatchEvents.ChannelDelete]: [ToEventProps<GatewayChannelDeleteDispatchData>];
	[GatewayDispatchEvents.ChannelPinsUpdate]: [ToEventProps<GatewayChannelPinsUpdateDispatchData>];
	[GatewayDispatchEvents.ChannelUpdate]: [ToEventProps<GatewayChannelUpdateDispatchData>];
	[GatewayDispatchEvents.EntitlementCreate]: [ToEventProps<GatewayEntitlementCreateDispatchData>];
	[GatewayDispatchEvents.EntitlementDelete]: [ToEventProps<GatewayEntitlementDeleteDispatchData>];
	[GatewayDispatchEvents.EntitlementUpdate]: [ToEventProps<GatewayEntitlementUpdateDispatchData>];
	[GatewayDispatchEvents.GuildAuditLogEntryCreate]: [ToEventProps<GatewayGuildAuditLogEntryCreateDispatchData>];
	[GatewayDispatchEvents.GuildBanAdd]: [ToEventProps<GatewayGuildBanAddDispatchData>];
	[GatewayDispatchEvents.GuildBanRemove]: [ToEventProps<GatewayGuildBanRemoveDispatchData>];
	[GatewayDispatchEvents.GuildCreate]: [ToEventProps<GatewayGuildCreateDispatchData>];
	[GatewayDispatchEvents.GuildDelete]: [ToEventProps<GatewayGuildDeleteDispatchData>];
	[GatewayDispatchEvents.GuildEmojisUpdate]: [ToEventProps<GatewayGuildEmojisUpdateDispatchData>];
	[GatewayDispatchEvents.GuildIntegrationsUpdate]: [ToEventProps<GatewayGuildIntegrationsUpdateDispatchData>];
	[GatewayDispatchEvents.GuildMemberAdd]: [ToEventProps<GatewayGuildMemberAddDispatchData>];
	[GatewayDispatchEvents.GuildMemberRemove]: [ToEventProps<GatewayGuildMemberRemoveDispatchData>];
	[GatewayDispatchEvents.GuildMemberUpdate]: [ToEventProps<GatewayGuildMemberUpdateDispatchData>];
	[GatewayDispatchEvents.GuildMembersChunk]: [ToEventProps<GatewayGuildMembersChunkDispatchData>];
	[GatewayDispatchEvents.GuildRoleCreate]: [ToEventProps<GatewayGuildRoleCreateDispatchData>];
	[GatewayDispatchEvents.GuildRoleDelete]: [ToEventProps<GatewayGuildRoleDeleteDispatchData>];
	[GatewayDispatchEvents.GuildRoleUpdate]: [ToEventProps<GatewayGuildRoleUpdateDispatchData>];
	[GatewayDispatchEvents.GuildScheduledEventCreate]: [ToEventProps<GatewayGuildScheduledEventCreateDispatchData>];
	[GatewayDispatchEvents.GuildScheduledEventDelete]: [ToEventProps<GatewayGuildScheduledEventDeleteDispatchData>];
	[GatewayDispatchEvents.GuildScheduledEventUpdate]: [ToEventProps<GatewayGuildScheduledEventUpdateDispatchData>];
	[GatewayDispatchEvents.GuildScheduledEventUserAdd]: [ToEventProps<GatewayGuildScheduledEventUserAddDispatchData>];
	[GatewayDispatchEvents.GuildScheduledEventUserRemove]: [
		ToEventProps<GatewayGuildScheduledEventUserRemoveDispatchData>,
	];
	[GatewayDispatchEvents.GuildSoundboardSoundCreate]: [ToEventProps<GatewayGuildSoundboardSoundCreateDispatch>];
	[GatewayDispatchEvents.GuildSoundboardSoundDelete]: [ToEventProps<GatewayGuildSoundboardSoundDeleteDispatch>];
	[GatewayDispatchEvents.GuildSoundboardSoundUpdate]: [ToEventProps<GatewayGuildSoundboardSoundUpdateDispatch>];
	[GatewayDispatchEvents.GuildSoundboardSoundsUpdate]: [ToEventProps<GatewayGuildSoundboardSoundsUpdateDispatch>];
	[GatewayDispatchEvents.SoundboardSounds]: [ToEventProps<GatewaySoundboardSoundsDispatchData>];
	[GatewayDispatchEvents.GuildStickersUpdate]: [ToEventProps<GatewayGuildStickersUpdateDispatchData>];
	[GatewayDispatchEvents.GuildUpdate]: [ToEventProps<GatewayGuildUpdateDispatchData>];
	[GatewayDispatchEvents.IntegrationCreate]: [ToEventProps<GatewayIntegrationCreateDispatchData>];
	[GatewayDispatchEvents.IntegrationDelete]: [ToEventProps<GatewayIntegrationDeleteDispatchData>];
	[GatewayDispatchEvents.IntegrationUpdate]: [ToEventProps<GatewayIntegrationUpdateDispatchData>];
	[GatewayDispatchEvents.InteractionCreate]: [ToEventProps<GatewayInteractionCreateDispatchData>];
	[GatewayDispatchEvents.InviteCreate]: [ToEventProps<GatewayInviteCreateDispatchData>];
	[GatewayDispatchEvents.InviteDelete]: [ToEventProps<GatewayInviteDeleteDispatchData>];
	[GatewayDispatchEvents.MessageCreate]: [ToEventProps<GatewayMessageCreateDispatchData>];
	[GatewayDispatchEvents.MessageDelete]: [ToEventProps<GatewayMessageDeleteDispatchData>];
	[GatewayDispatchEvents.MessageDeleteBulk]: [ToEventProps<GatewayMessageDeleteBulkDispatchData>];
	[GatewayDispatchEvents.MessagePollVoteAdd]: [ToEventProps<GatewayMessagePollVoteDispatchData>];
	[GatewayDispatchEvents.MessagePollVoteRemove]: [ToEventProps<GatewayMessagePollVoteDispatchData>];
	[GatewayDispatchEvents.MessageReactionAdd]: [ToEventProps<GatewayMessageReactionAddDispatchData>];
	[GatewayDispatchEvents.MessageReactionRemove]: [ToEventProps<GatewayMessageReactionRemoveDispatchData>];
	[GatewayDispatchEvents.MessageReactionRemoveAll]: [ToEventProps<GatewayMessageReactionRemoveAllDispatchData>];
	[GatewayDispatchEvents.MessageReactionRemoveEmoji]: [ToEventProps<GatewayMessageReactionRemoveEmojiDispatchData>];
	[GatewayDispatchEvents.MessageUpdate]: [ToEventProps<GatewayMessageUpdateDispatchData>];
	[GatewayDispatchEvents.PresenceUpdate]: [ToEventProps<GatewayPresenceUpdateDispatchData>];
	[GatewayDispatchEvents.Ready]: [ToEventProps<GatewayReadyDispatchData>];
	[GatewayDispatchEvents.Resumed]: [ToEventProps<never>];
	[GatewayDispatchEvents.StageInstanceCreate]: [ToEventProps<GatewayStageInstanceCreateDispatchData>];
	[GatewayDispatchEvents.StageInstanceDelete]: [ToEventProps<GatewayStageInstanceDeleteDispatchData>];
	[GatewayDispatchEvents.StageInstanceUpdate]: [ToEventProps<GatewayStageInstanceUpdateDispatchData>];
	[GatewayDispatchEvents.SubscriptionCreate]: [ToEventProps<GatewaySubscriptionCreateDispatchData>];
	[GatewayDispatchEvents.SubscriptionDelete]: [ToEventProps<GatewaySubscriptionDeleteDispatchData>];
	[GatewayDispatchEvents.SubscriptionUpdate]: [ToEventProps<GatewaySubscriptionUpdateDispatchData>];
	[GatewayDispatchEvents.ThreadCreate]: [ToEventProps<GatewayThreadCreateDispatchData>];
	[GatewayDispatchEvents.ThreadDelete]: [ToEventProps<GatewayThreadDeleteDispatchData>];
	[GatewayDispatchEvents.ThreadListSync]: [ToEventProps<GatewayThreadListSyncDispatchData>];
	[GatewayDispatchEvents.ThreadMemberUpdate]: [ToEventProps<GatewayThreadMemberUpdateDispatchData>];
	[GatewayDispatchEvents.ThreadMembersUpdate]: [ToEventProps<GatewayThreadMembersUpdateDispatchData>];
	[GatewayDispatchEvents.ThreadUpdate]: [ToEventProps<GatewayThreadUpdateDispatchData>];
	[GatewayDispatchEvents.TypingStart]: [ToEventProps<GatewayTypingStartDispatchData>];
	[GatewayDispatchEvents.UserUpdate]: [ToEventProps<GatewayUserUpdateDispatchData>];
	[GatewayDispatchEvents.VoiceServerUpdate]: [ToEventProps<GatewayVoiceServerUpdateDispatchData>];
	[GatewayDispatchEvents.VoiceStateUpdate]: [ToEventProps<GatewayVoiceStateUpdateDispatchData>];
	[GatewayDispatchEvents.WebhooksUpdate]: [ToEventProps<GatewayWebhooksUpdateDispatchData>];
}

// eslint-disable-next-line @typescript-eslint/no-empty-object-type
export interface ManagerShardEventsMap extends MappedEvents {}

export interface ClientOptions {
	gateway: Gateway;
	rest: REST;
}

export interface RequestGuildMembersResult {
	members: GatewayGuildMembersChunkDispatchData['members'];
	nonce: NonNullable<GatewayGuildMembersChunkDispatchData['nonce']>;
	notFound: NonNullable<GatewayGuildMembersChunkDispatchData['not_found']>;
	presences: NonNullable<GatewayGuildMembersChunkDispatchData['presences']>;
}

function createTimer(controller: AbortController, timeout: number) {
	return setTimeout(() => controller.abort(), timeout);
}

export class Client extends AsyncEventEmitter<MappedEvents> {
	public readonly rest: REST;

	public readonly gateway: Gateway;

	public readonly api: API;

	public constructor(options: ClientOptions) {
		super();
		this.rest = options.rest;
		this.gateway = options.gateway;
		this.api = new API(this.rest);

		this.gateway.on(WebSocketShardEvents.Dispatch, (dispatch, shardId) => {
			this.emit(dispatch.t, this.toEventProps(dispatch.d, shardId));
		});
	}

	/**
	 * Requests guild members from the gateway and returns an async iterator that yields the data from each guild members chunk event.
	 *
	 * @see {@link https://discord.com/developers/docs/topics/gateway-events#request-guild-members}
	 * @param options - The options for the request
	 * @param timeout - The timeout for waiting for each guild members chunk event
	 * @example
	 * Requesting all members from a guild
	 * ```ts
	 * for await (const { members } of client.requestGuildMembersIterator({ guild_id: '1234567890', query: '', limit: 0 })) {
	 * 	console.log(members);
	 * }
	 * ```
	 */
	public async *requestGuildMembersIterator(options: GatewayRequestGuildMembersData, timeout = 10_000) {
		const shardId = calculateShardId(options.guild_id, await this.gateway.getShardCount());
		const nonce = options.nonce ?? DiscordSnowflake.generate().toString();

		const controller = new AbortController();

		let timer: NodeJS.Timeout | undefined = createTimer(controller, timeout);

		await this.gateway.send(shardId, {
			op: GatewayOpcodes.RequestGuildMembers,
			// eslint-disable-next-line id-length
			d: {
				...options,
				nonce,
			},
		});

		try {
			const iterator = AsyncEventEmitter.on(this, GatewayDispatchEvents.GuildMembersChunk, {
				signal: controller.signal,
			});

			for await (const [{ data }] of iterator) {
				if (data.nonce !== nonce) continue;

				clearTimeout(timer);
				timer = undefined;

				yield {
					members: data.members,
					nonce,
					notFound: data.not_found ?? null,
					presences: data.presences ?? null,
					chunkIndex: data.chunk_index,
					chunkCount: data.chunk_count,
				};

				if (data.chunk_index >= data.chunk_count - 1) break;

				timer = createTimer(controller, timeout);
			}
		} catch (error) {
			if (error instanceof Error && error.name === 'AbortError') {
				throw new Error('Request timed out');
			}

			throw error;
		} finally {
			if (timer) {
				clearTimeout(timer);
			}
		}
	}

	/**
	 * Requests guild members from the gateway.
	 *
	 * @see {@link https://discord.com/developers/docs/topics/gateway-events#request-guild-members}
	 * @param options - The options for the request
	 * @param timeout - The timeout for waiting for each guild members chunk event
	 * @example
	 * Requesting specific members from a guild
	 * ```ts
	 * const { members } = await client.requestGuildMembers({ guild_id: '1234567890', user_ids: ['9876543210'] });
	 * ```
	 */
	public async requestGuildMembers(options: GatewayRequestGuildMembersData, timeout = 10_000) {
		const members: RequestGuildMembersResult['members'] = [];
		const notFound: RequestGuildMembersResult['notFound'] = [];
		const presences: RequestGuildMembersResult['presences'] = [];
		const nonce = options.nonce ?? DiscordSnowflake.generate().toString();

		for await (const data of this.requestGuildMembersIterator({ ...options, nonce }, timeout)) {
			members.push(...data.members);
			if (data.presences) presences.push(...data.presences);
			if (data.notFound) notFound.push(...data.notFound);
		}

		return { members, nonce, notFound, presences };
	}

	/**
	 * Requests soundboard sounds from the gateway and returns an async iterator that yields the data from each soundboard sounds event.
	 *
	 * @see {@link https://discord.com/developers/docs/topics/gateway-events#request-soundboard-sounds}
	 * @param options - The options for the request
	 * @param timeout - The timeout for waiting for each soundboard sounds
	 * @example
	 * Requesting soundboard sounds for specific guilds
	 * ```ts
	 * for await (const { guildId, soundboardSounds } of this.requestSoundboardSoundsIterator({
	 *	guild_ids: ['1234567890', '9876543210'],
	 * })) {
	 *	console.log(`Soundboard sounds for guild ${guildId}:`, soundboardSounds);
	 * }
	 * ```
	 */
	public async *requestSoundboardSoundsIterator(options: GatewayRequestSoundboardSoundsData, timeout = 10_000) {
		const shardCount = await this.gateway.getShardCount();
		const shardIds = Map.groupBy(options.guild_ids, (guildId) => calculateShardId(guildId, shardCount));

		const controller = new AbortController();

		let timer: NodeJS.Timeout | undefined = createTimer(controller, timeout);

		for (const [shardId, guildIds] of shardIds) {
			await this.gateway.send(shardId, {
				op: GatewayOpcodes.RequestSoundboardSounds,
				// eslint-disable-next-line id-length
				d: {
					...options,
					guild_ids: guildIds,
				},
			});
		}

		try {
			const iterator = AsyncEventEmitter.on(this, GatewayDispatchEvents.SoundboardSounds, {
				signal: controller.signal,
			});

			const guildIds = new Set(options.guild_ids);

			for await (const [{ data }] of iterator) {
				if (!guildIds.has(data.guild_id)) continue;

				clearTimeout(timer);
				timer = undefined;

				yield {
					guildId: data.guild_id,
					soundboardSounds: data.soundboard_sounds,
				};

				guildIds.delete(data.guild_id);

				if (guildIds.size === 0) break;

				timer = createTimer(controller, timeout);
			}
		} catch (error) {
			if (error instanceof Error && error.name === 'AbortError') {
				throw new Error('Request timed out');
			}

			throw error;
		} finally {
			if (timer) {
				clearTimeout(timer);
			}
		}
	}

	/**
	 * Requests soundboard sounds from the gateway.
	 *
	 * @see {@link https://discord.com/developers/docs/topics/gateway-events#request-soundboard-sounds}
	 * @param options - The options for the request
	 * @param timeout - The timeout for waiting for each soundboard sounds event
	 * @example
	 * Requesting soundboard sounds for specific guilds
	 * ```ts
	 * const soundboardSounds = await client.requestSoundboardSounds({ guild_ids: ['1234567890', '9876543210'], });
	 *
	 * console.log(soundboardSounds.get('1234567890'));
	 * ```
	 */
	public async requestSoundboardSounds(options: GatewayRequestSoundboardSoundsData, timeout = 10_000) {
		const soundboardSounds = new Map<
			GatewaySoundboardSoundsDispatchData['guild_id'],
			GatewaySoundboardSoundsDispatchData['soundboard_sounds']
		>();

		for await (const data of this.requestSoundboardSoundsIterator(options, timeout)) {
			soundboardSounds.set(data.guildId, data.soundboardSounds);
		}

		return soundboardSounds;
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

	private toEventProps<ObjectType>(obj: ObjectType, shardId: number): ToEventProps<ObjectType> {
		return {
			api: this.api,
			shardId,
			data: obj,
		};
	}
}
