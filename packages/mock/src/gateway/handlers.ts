/* eslint-disable id-length */
import { GatewayCloseCodes, GatewayDispatchEvents, GatewayOpcodes, type APIGuildMember } from 'discord-api-types/v10';
import { AllIntents, PrivilegedIntents } from '../world/intents.js';
import type { FakeGateway } from './FakeGateway.js';

const memberChunkSize = 1_000;

function stripBotPrefix(token: string) {
	return token.replace(/^bot\s+/i, '');
}

/**
 * Registers the handlers for every opcode the fake understands, through the same public call a consumer would use
 */
export function registerBuiltinHandlers(gateway: FakeGateway): void {
	const { world } = gateway;

	gateway.handle(GatewayOpcodes.Heartbeat, ({ d }, session) => {
		session.heartbeat(d);
	});

	gateway.handle(GatewayOpcodes.Identify, ({ d }, session) => {
		if (stripBotPrefix(d.token) !== world.token) {
			session.close(GatewayCloseCodes.AuthenticationFailed, 'Authentication failed.');
			return;
		}

		const [shardId, shardCount] = d.shard ?? [0, 1];
		if (shardCount !== world.shardCount || shardId < 0 || shardId >= shardCount) {
			session.close(GatewayCloseCodes.InvalidShard, 'Invalid shard.');
			return;
		}

		if (d.intents & ~AllIntents) {
			session.close(GatewayCloseCodes.InvalidIntents, 'Invalid intent(s).');
			return;
		}

		if (d.intents & PrivilegedIntents & ~world.privilegedIntents) {
			session.close(GatewayCloseCodes.DisallowedIntents, 'Disallowed intent(s).');
			return;
		}

		session.ready(d);
	});

	gateway.handle(GatewayOpcodes.Resume, ({ d }, session) => {
		if (stripBotPrefix(d.token) !== world.token) {
			session.close(GatewayCloseCodes.AuthenticationFailed, 'Authentication failed.');
			return;
		}

		const previous = gateway.sessions.get(d.session_id);
		if (!previous?.canResume(d.seq)) {
			session.invalidate({ resumable: false });
			return;
		}

		session.resume(previous, d.seq);
	});

	gateway.handle(GatewayOpcodes.RequestGuildMembers, ({ d }, session) => {
		if (!session.owns(d.guild_id) || !world.getGuild(d.guild_id)) return;

		const members = world.listMembers(d.guild_id);
		let matched: APIGuildMember[];
		let notFound: string[] = [];

		if ('user_ids' in d && d.user_ids) {
			const ids = [d.user_ids].flat();
			matched = members.filter((member) => ids.includes(member.user.id));
			notFound = ids.filter((id) => !matched.some((member) => member.user.id === id));
		} else {
			const query = ('query' in d ? d.query : '').toLowerCase();
			matched = members.filter(
				(member) =>
					member.user.username.toLowerCase().startsWith(query) || member.nick?.toLowerCase().startsWith(query),
			);
			if ('limit' in d && d.limit > 0) matched = matched.slice(0, d.limit);
		}

		const chunkCount = Math.max(1, Math.ceil(matched.length / memberChunkSize));
		for (let index = 0; index < chunkCount; index++) {
			session.dispatch(GatewayDispatchEvents.GuildMembersChunk, {
				guild_id: d.guild_id,
				members: matched.slice(index * memberChunkSize, (index + 1) * memberChunkSize),
				chunk_index: index,
				chunk_count: chunkCount,
				...(index === 0 && notFound.length ? { not_found: notFound } : {}),
				...(d.presences ? { presences: [] } : {}),
				...(d.nonce ? { nonce: d.nonce } : {}),
			});
		}
	});

	// Presence is not modeled yet; accepting the update keeps clients that set one at startup connected
	gateway.handle(GatewayOpcodes.PresenceUpdate, () => {});
}
