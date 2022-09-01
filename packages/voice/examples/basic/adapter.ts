import { DiscordGatewayAdapterCreator, DiscordGatewayAdapterLibraryMethods } from '../../';
import { Snowflake, Client, Guild, VoiceBasedChannel, Status, Events } from 'discord';
import {
	GatewayDispatchEvents,
	GatewayVoiceServerUpdateDispatchData,
	GatewayVoiceStateUpdateDispatchData,
} from 'discord-api-types/v9';

const adapters = new Map<Snowflake, DiscordGatewayAdapterLibraryMethods>();
const trackedClients = new Set<Client>();

/**
 * Tracks a Discord.js client, listening to VOICE_SERVER_UPDATE and VOICE_STATE_UPDATE events
 *
 * @param client - The Discord.js Client to track
 */
function trackClient(client: Client) {
	if (trackedClients.has(client)) return;
	trackedClients.add(client);
	client.ws.on(GatewayDispatchEvents.VoiceServerUpdate, (payload: GatewayVoiceServerUpdateDispatchData) => {
		adapters.get(payload.guild_id)?.onVoiceServerUpdate(payload);
	});
	client.ws.on(GatewayDispatchEvents.VoiceStateUpdate, (payload: GatewayVoiceStateUpdateDispatchData) => {
		if (payload.guild_id && payload.session_id && payload.user_id === client.user?.id) {
			adapters.get(payload.guild_id)?.onVoiceStateUpdate(payload);
		}
	});
	client.on(Events.ShardDisconnect, (_, shardId) => {
		const guilds = trackedShards.get(shardId);
		if (guilds) {
			for (const guildID of guilds.values()) {
				adapters.get(guildID)?.destroy();
			}
		}
		trackedShards.delete(shardId);
	});
}

const trackedShards = new Map<number, Set<Snowflake>>();

function trackGuild(guild: Guild) {
	let guilds = trackedShards.get(guild.shardId);
	if (!guilds) {
		guilds = new Set();
		trackedShards.set(guild.shardId, guilds);
	}
	guilds.add(guild.id);
}

/**
 * Creates an adapter for a Voice Channel.
 *
 * @param channel - The channel to create the adapter for
 */
export function createDiscordJSAdapter(channel: VoiceBasedChannel): DiscordGatewayAdapterCreator {
	return (methods) => {
		adapters.set(channel.guild.id, methods);
		trackClient(channel.client);
		trackGuild(channel.guild);
		return {
			sendPayload(data) {
				if (channel.guild.shard.status === Status.Ready) {
					channel.guild.shard.send(data);
					return true;
				}
				return false;
			},
			destroy() {
				return adapters.delete(channel.guild.id);
			},
		};
	};
}
