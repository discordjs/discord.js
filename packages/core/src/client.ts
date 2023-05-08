import { setTimeout } from 'node:timers';
import type { REST } from '@discordjs/rest';
import { calculateShardId } from '@discordjs/util';
import { WebSocketShardEvents } from '@discordjs/ws';
import { DiscordSnowflake } from '@sapphire/snowflake';
import { AsyncEventEmitter } from '@vladfrangu/async_event_emitter';
import { GatewayDispatchEvents, GatewayOpcodes } from 'discord-api-types/v10';
import type {
	GatewayDispatchPayload,
	APIGuildMember,
	GatewayRequestGuildMembersData,
	GatewayPresenceUpdateData,
	GatewayVoiceStateUpdateData,
} from 'discord-api-types/v10';
import { API } from './api/index.js';
import type { Gateway } from './gateway/Gateway.js';

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

// need this to be its own type for some reason, the compiler doesn't behave the same way if we in-line it
type _DiscordEvents = {
	[K in GatewayDispatchEvents]: GatewayDispatchPayload & {
		t: K;
	};
};

export type DiscordEvents = {
	// @ts-expect-error - unclear why this is an error, this behaves as expected
	[K in keyof _DiscordEvents]: _DiscordEvents[K]['d'];
};

export type MappedEvents = {
	[K in keyof DiscordEvents]: [WithIntrinsicProps<DiscordEvents[K]>];
};

export interface ClientOptions {
	gateway: Gateway;
	rest: REST;
}

export class Client extends AsyncEventEmitter<MappedEvents> {
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
