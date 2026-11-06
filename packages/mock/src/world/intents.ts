import { GatewayDispatchEvents, GatewayIntentBits, type Snowflake } from 'discord-api-types/v10';

const guildEventIntents: Partial<Record<GatewayDispatchEvents, GatewayIntentBits>> = {
	[GatewayDispatchEvents.GuildCreate]: GatewayIntentBits.Guilds,
	[GatewayDispatchEvents.GuildUpdate]: GatewayIntentBits.Guilds,
	[GatewayDispatchEvents.GuildDelete]: GatewayIntentBits.Guilds,
	[GatewayDispatchEvents.GuildRoleCreate]: GatewayIntentBits.Guilds,
	[GatewayDispatchEvents.GuildRoleUpdate]: GatewayIntentBits.Guilds,
	[GatewayDispatchEvents.GuildRoleDelete]: GatewayIntentBits.Guilds,
	[GatewayDispatchEvents.ChannelCreate]: GatewayIntentBits.Guilds,
	[GatewayDispatchEvents.ChannelUpdate]: GatewayIntentBits.Guilds,
	[GatewayDispatchEvents.ChannelDelete]: GatewayIntentBits.Guilds,
	[GatewayDispatchEvents.GuildMemberAdd]: GatewayIntentBits.GuildMembers,
	[GatewayDispatchEvents.GuildMemberUpdate]: GatewayIntentBits.GuildMembers,
	[GatewayDispatchEvents.GuildMemberRemove]: GatewayIntentBits.GuildMembers,
	[GatewayDispatchEvents.GuildBanAdd]: GatewayIntentBits.GuildModeration,
	[GatewayDispatchEvents.GuildBanRemove]: GatewayIntentBits.GuildModeration,
	[GatewayDispatchEvents.GuildAuditLogEntryCreate]: GatewayIntentBits.GuildModeration,
};

const messageEvents = new Set<GatewayDispatchEvents>([
	GatewayDispatchEvents.MessageCreate,
	GatewayDispatchEvents.MessageUpdate,
	GatewayDispatchEvents.MessageDelete,
	GatewayDispatchEvents.MessageDeleteBulk,
]);

/**
 * The intent a session needs to receive an event, or `null` if it is sent regardless of intents
 */
export function intentFor(event: GatewayDispatchEvents, guildId: Snowflake | null): GatewayIntentBits | null {
	if (messageEvents.has(event)) {
		return guildId ? GatewayIntentBits.GuildMessages : GatewayIntentBits.DirectMessages;
	}

	return guildEventIntents[event] ?? null;
}

export const AllIntents = Object.values(GatewayIntentBits)
	.filter((value): value is GatewayIntentBits => typeof value === 'number')
	.reduce((all, intent) => all | intent, 0);

export const PrivilegedIntents =
	GatewayIntentBits.GuildMembers | GatewayIntentBits.GuildPresences | GatewayIntentBits.MessageContent;
