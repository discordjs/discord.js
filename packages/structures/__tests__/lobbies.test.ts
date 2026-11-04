import { DiscordSnowflake } from '@sapphire/snowflake';
import { ChannelType, MessageFlags, MessageType, type APIUser } from 'discord-api-types/v10';
import { describe, expect, test } from 'vitest';
import { LobbyMemberFlags, LobbyMemberFlagsBitField } from '../src/bitfields/LobbyMemberFlagsBitField.js';
import { MessageFlagsBitField } from '../src/bitfields/MessageFlagsBitField.js';
import {
	Lobby,
	LobbyInvite,
	LobbyMember,
	LobbyMessage,
	LobbyMessageMember,
	type APILobby,
	type APILobbyMember,
	type APILobbyMessage,
} from '../src/lobbies/index.js';
import { User } from '../src/users/User.js';
import { kClone, kData, kPatch } from '../src/utils/symbols.js';

const user: APIUser = {
	id: '41771983429993000',
	username: 'player',
	discriminator: '0',
	global_name: null,
	avatar: null,
};

const memberData: APILobbyMember = {
	id: user.id,
	metadata: { team: 'blue' },
	flags: 1,
	additional_name: 'Twindly Shimmerleaf',
};

const lobbyData: APILobby = {
	id: '96008815106887111',
	application_id: '41771983429993937',
	metadata: { topic: 'we need more redstone' },
	members: [memberData],
	linked_channel: {
		id: '222089694387765248',
		type: ChannelType.GuildText,
		name: 'lobby',
		position: 0,
	},
};

const messageData: APILobbyMessage = {
	id: '1028645863041548409',
	type: MessageType.Default,
	content: 'Ready!',
	lobby_id: lobbyData.id,
	channel_id: lobbyData.id,
	author: user,
	lobby_member: { additional_name: 'Twindly Shimmerleaf' },
	metadata: { match: 'next' },
	moderation_metadata: { verdict: 'allowed' },
	flags: MessageFlags.SuppressNotifications,
	application_id: lobbyData.application_id,
};

describe('Lobby structures', () => {
	test('Lobby exposes scalar fields and derives its creation time from its id', () => {
		const lobby = new Lobby(lobbyData);
		expect(lobby.id).toBe(lobbyData.id);
		expect(lobby.applicationId).toBe(lobbyData.application_id);
		expect(lobby.createdTimestamp).toBe(DiscordSnowflake.timestampFrom(lobbyData.id));
		expect(lobby.createdDate?.getTime()).toBe(lobby.createdTimestamp);
		expect(lobby.toJSON()).toStrictEqual(lobbyData);
	});

	test('LobbyMember exposes optional flags and additional name', () => {
		const member = new LobbyMember(memberData);
		expect(member.id).toBe(memberData.id);
		expect(member.flags).toBeInstanceOf(LobbyMemberFlagsBitField);
		expect(member.flags?.has('CanLinkLobby')).toBe(true);
		expect(member.flags?.toJSON()).toBe(1);
		expect(member.additionalName).toBe(memberData.additional_name);
		expect(member.toJSON()).toStrictEqual(memberData);

		const minimal = new LobbyMember({ id: user.id });
		expect(minimal.flags).toBeNull();
		expect(minimal.additionalName).toBeUndefined();
		expect(minimal.toJSON()).toStrictEqual({ id: user.id });

		const zeroFlags = new LobbyMember({ id: user.id, metadata: null, flags: 0 });
		expect(zeroFlags.flags).toBeInstanceOf(LobbyMemberFlagsBitField);
		expect(zeroFlags.flags?.bitField).toBe(0n);
		expect(zeroFlags.flags?.has('CanLinkLobby')).toBe(false);
		expect(zeroFlags.toJSON()).toStrictEqual({ id: user.id, metadata: null, flags: 0 });
	});

	test('LobbyMessage exposes only the documented scalar message fields', () => {
		const message = new LobbyMessage(messageData);
		expect(message.id).toBe(messageData.id);
		expect(message.type).toBe(MessageType.Default);
		expect(message.content).toBe('Ready!');
		expect(message.lobbyId).toBe(lobbyData.id);
		expect(message.channelId).toBe(lobbyData.id);
		expect(message.applicationId).toBe(lobbyData.application_id);
		expect(message.flags).toBeInstanceOf(MessageFlagsBitField);
		expect(message.flags?.has(MessageFlags.SuppressNotifications)).toBe(true);
		expect(message.flags?.has('SuppressNotifications')).toBe(true);
		expect(message.createdTimestamp).toBe(DiscordSnowflake.timestampFrom(messageData.id));
		expect(message.createdDate?.getTime()).toBe(message.createdTimestamp);
		expect(message.toJSON()).toStrictEqual(messageData);
		expect(message.toJSON()).not.toHaveProperty('timestamp');
		expect(message.toJSON()).not.toHaveProperty('edited_timestamp');
	});

	test('message flags distinguish zero from missing and remain raw numbers in JSON', () => {
		const zero = new LobbyMessage({ ...messageData, flags: 0 });
		expect(zero.flags).toBeInstanceOf(MessageFlagsBitField);
		expect(zero.flags?.bitField).toBe(0n);
		expect(zero.flags?.toJSON()).toBe(0);
		expect(zero.toJSON().flags).toBe(0);
		expect(zero[kClone]().toJSON().flags).toBe(0);

		const { flags: _flags, ...withoutFlags } = messageData;
		const missing = new LobbyMessage<'flags'>(withoutFlags);
		expect(missing.flags).toBeNull();
		expect(missing.toJSON()).toStrictEqual(withoutFlags);
		expect(missing[kClone]().flags).toBeNull();
		missing[kPatch]({ flags: 0 });
		expect(missing.flags?.bitField).toBe(0n);
		expect(missing.toJSON().flags).toBe(0);
	});

	test('flag wrapper mutation does not mutate raw structure state', () => {
		const member = new LobbyMember(memberData);
		member.flags?.remove('CanLinkLobby');
		expect(member.flags?.has('CanLinkLobby')).toBe(true);
		expect(member.toJSON().flags).toBe(1);

		const message = new LobbyMessage(messageData);
		message.flags?.remove(MessageFlags.SuppressNotifications);
		expect(message.flags?.has(MessageFlags.SuppressNotifications)).toBe(true);
		expect(message.toJSON().flags).toBe(MessageFlags.SuppressNotifications);
	});

	test('LobbyMemberFlagsBitField resolves documented flag names and serializes as an integer', () => {
		const flags = new LobbyMemberFlagsBitField('CanLinkLobby');
		expect(LobbyMemberFlags.CanLinkLobby).toBe(1n);
		expect(flags.bitField).toBe(1n);
		expect(flags.has('CanLinkLobby')).toBe(true);
		expect(flags.toArray()).toStrictEqual(['CanLinkLobby']);
		expect(flags.toJSON()).toBe(1);
		expect(JSON.stringify(flags)).toBe('1');
		flags.remove('CanLinkLobby');
		expect(flags.toJSON()).toBe(0);
		expect(new LobbyMemberFlagsBitField().toJSON()).toBe(0);
	});

	test('LobbyInvite and LobbyMessageMember use their own minimal response shapes', () => {
		const invite = new LobbyInvite({ code: 'join-lobby' });
		expect(invite.code).toBe('join-lobby');
		expect(invite.toJSON()).toStrictEqual({ code: 'join-lobby' });

		const snapshot = new LobbyMessageMember({ additional_name: 'Original name' });
		expect(snapshot.additionalName).toBe('Original name');
		expect(snapshot.toJSON()).toStrictEqual({ additional_name: 'Original name' });
	});

	test('nested fields remain raw and are deep copied by toJSON', () => {
		const lobby = new Lobby(lobbyData);
		const member = new LobbyMember(memberData);
		const message = new LobbyMessage(messageData);
		for (const field of ['members', 'linkedChannel', 'linked_channel', 'metadata']) {
			expect(lobby).not.toHaveProperty(field);
		}

		expect(member).not.toHaveProperty('metadata');
		for (const field of ['author', 'lobbyMember', 'lobby_member', 'metadata', 'moderationMetadata']) {
			expect(message).not.toHaveProperty(field);
		}

		const lobbyJSON = lobby.toJSON();
		lobbyJSON.members[0]!.additional_name = 'Changed';
		lobbyJSON.metadata!.topic = 'Changed';
		lobbyJSON.linked_channel!.id = '0';
		expect(lobby.toJSON()).toStrictEqual(lobbyData);

		const memberJSON = member.toJSON();
		memberJSON.metadata!.team = 'red';
		expect(member.toJSON()).toStrictEqual(memberData);

		const messageJSON = message.toJSON();
		messageJSON.author.username = 'Changed';
		messageJSON.lobby_member!.additional_name = 'Changed';
		messageJSON.metadata!.match = 'Changed';
		messageJSON.moderation_metadata!.verdict = 'Changed';
		expect(message.toJSON()).toStrictEqual(messageData);
		expect(JSON.parse(JSON.stringify(message))).toStrictEqual(messageData);
	});

	test('patching updates in place and preserves fields absent from a patch', () => {
		const lobby = new Lobby(lobbyData);
		expect(lobby[kPatch]({ metadata: null, members: [] })).toBe(lobby);
		expect(lobby.toJSON()).toStrictEqual({ ...lobbyData, metadata: null, members: [] });

		const member = new LobbyMember(memberData);
		expect(member[kPatch]({ flags: 0, additional_name: 'New name', metadata: null })).toBe(member);
		expect(member.flags?.bitField).toBe(0n);
		expect(member.additionalName).toBe('New name');
		expect(member.toJSON()).toStrictEqual({ ...memberData, flags: 0, additional_name: 'New name', metadata: null });

		const message = new LobbyMessage(messageData);
		expect(message[kPatch]({ content: '', metadata: null, moderation_metadata: null })).toBe(message);
		expect(message.content).toBe('');
		expect(message.toJSON()).toStrictEqual({ ...messageData, content: '', metadata: null, moderation_metadata: null });

		const invite = new LobbyInvite({ code: 'before' });
		expect(invite[kPatch]({ code: 'after' })).toBe(invite);
		expect(invite.code).toBe('after');

		const snapshot = new LobbyMessageMember({ additional_name: 'before' });
		expect(snapshot[kPatch]({ additional_name: 'after' })).toBe(snapshot);
		expect(snapshot.additionalName).toBe('after');
	});

	test('cloning preserves each structure and isolates nested raw data', () => {
		const lobby = new Lobby(lobbyData);
		const lobbyClone = lobby[kClone]({ metadata: null });
		expect(lobbyClone).toBeInstanceOf(Lobby);
		expect(lobbyClone).not.toBe(lobby);
		expect(lobbyClone.toJSON()).toStrictEqual({ ...lobbyData, metadata: null });
		lobbyClone[kData].members[0]!.additional_name = 'Changed';
		expect(lobby.toJSON()).toStrictEqual(lobbyData);

		const member = new LobbyMember(memberData);
		const memberClone = member[kClone]({ additional_name: 'Changed', flags: 0 });
		expect(memberClone).toBeInstanceOf(LobbyMember);
		expect(memberClone.additionalName).toBe('Changed');
		expect(memberClone.flags?.bitField).toBe(0n);
		expect(memberClone.toJSON().flags).toBe(0);
		memberClone[kData].metadata!.team = 'red';
		expect(member.toJSON()).toStrictEqual(memberData);

		const message = new LobbyMessage(messageData);
		const messageClone = message[kClone]({ content: 'Changed', flags: 0 });
		expect(messageClone).toBeInstanceOf(LobbyMessage);
		expect(messageClone.content).toBe('Changed');
		expect(messageClone.flags?.bitField).toBe(0n);
		expect(messageClone.toJSON().flags).toBe(0);
		messageClone[kData].author.username = 'Changed';
		expect(message.toJSON()).toStrictEqual(messageData);

		const invite = new LobbyInvite({ code: 'before' });
		const inviteClone = invite[kClone]({ code: 'after' });
		expect(inviteClone).toBeInstanceOf(LobbyInvite);
		expect(inviteClone.code).toBe('after');
		expect(invite.code).toBe('before');

		const snapshot = new LobbyMessageMember({ additional_name: 'before' });
		const snapshotClone = snapshot[kClone]({ additional_name: 'after' });
		expect(snapshotClone).toBeInstanceOf(LobbyMessageMember);
		expect(snapshotClone.additionalName).toBe('after');
		expect(snapshot.additionalName).toBe('before');
	});

	test('null and absent metadata remain distinct through patching and cloning', () => {
		const {
			lobby_member: _snapshot,
			metadata: _metadata,
			moderation_metadata: _moderation,
			...minimalData
		} = messageData;
		const message = new LobbyMessage(minimalData);
		expect(message.toJSON()).toStrictEqual(minimalData);
		expect(message[kClone]().toJSON()).toStrictEqual(minimalData);
		message[kPatch]({ metadata: null, moderation_metadata: null });
		message[kPatch]({ content: 'Updated' });
		expect(message[kClone]().toJSON()).toStrictEqual({
			...minimalData,
			content: 'Updated',
			metadata: null,
			moderation_metadata: null,
		});
	});

	test('DataTemplate omissions survive construction, patching, and cloning', () => {
		class OmittedLobby extends Lobby<'application_id' | 'metadata' | 'members' | 'linked_channel'> {
			public static override readonly DataTemplate = {
				set application_id(_: string) {},
				set metadata(_: APILobby['metadata']) {},
				set members(_: APILobby['members']) {},
				set linked_channel(_: NonNullable<APILobby['linked_channel']>) {},
			};
		}

		const lobby = new OmittedLobby(lobbyData);
		expect(lobby.applicationId).toBeUndefined();
		expect(lobby.toJSON()).toStrictEqual({ id: lobbyData.id });
		lobby[kPatch](lobbyData);
		expect(lobby[kClone]().toJSON()).toStrictEqual({ id: lobbyData.id });
		expect(lobby[kClone]()).toBeInstanceOf(OmittedLobby);

		class OmittedMember extends LobbyMember<'flags' | 'additional_name'> {
			public static override readonly DataTemplate = {
				set flags(_: number) {},
				set additional_name(_: string) {},
			};
		}

		const member = new OmittedMember(memberData);
		member[kPatch]({ flags: 1, additional_name: 'Changed' });
		expect(member.flags).toBeNull();
		expect(member.additionalName).toBeUndefined();
		expect(member[kClone]().toJSON()).toStrictEqual({ id: user.id, metadata: memberData.metadata });

		class OmittedMessage extends LobbyMessage<'content' | 'author' | 'flags'> {
			public static override readonly DataTemplate = {
				set content(_: string) {},
				set author(_: APIUser) {},
				set flags(_: APILobbyMessage['flags']) {},
			};
		}

		const message = new OmittedMessage(messageData);
		message[kPatch]({ content: 'Changed', author: user, flags: 0 });
		expect(message.content).toBeUndefined();
		expect(message.flags).toBeNull();
		expect(message.toJSON()).not.toHaveProperty('author');
		expect(message.toJSON()).not.toHaveProperty('flags');
		expect(message[kClone]().toJSON()).toStrictEqual(message.toJSON());

		class OmittedInvite extends LobbyInvite<'code'> {
			public static override readonly DataTemplate = { set code(_: string) {} };
		}

		const invite = new OmittedInvite({});
		invite[kPatch]({ code: 'ignored' });
		expect(invite.code).toBeUndefined();
		expect(invite[kClone]().toJSON()).toStrictEqual({});

		class OmittedSnapshot extends LobbyMessageMember<'additional_name'> {
			public static override readonly DataTemplate = { set additional_name(_: string) {} };
		}

		const snapshot = new OmittedSnapshot({});
		snapshot[kPatch]({ additional_name: 'ignored' });
		expect(snapshot.additionalName).toBeUndefined();
		expect(snapshot[kClone]().toJSON()).toStrictEqual({});
	});

	test('omitted ids produce null dates and snowflake zero remains valid', () => {
		const { id: _lobbyId, ...withoutLobbyId } = lobbyData;
		const lobby = new Lobby<'id'>(withoutLobbyId);
		expect(lobby.createdTimestamp).toBeNull();
		expect(lobby.createdDate).toBeNull();
		expect(lobby[kClone]().toJSON()).toStrictEqual(withoutLobbyId);

		const { id: _messageId, ...withoutMessageId } = messageData;
		const message = new LobbyMessage<'id'>(withoutMessageId);
		expect(message.createdTimestamp).toBeNull();
		expect(message.createdDate).toBeNull();
		expect(message[kClone]().toJSON()).toStrictEqual(withoutMessageId);

		const zero = new Lobby({ ...lobbyData, id: '0' });
		expect(zero.createdTimestamp).toBe(DiscordSnowflake.epochNumber);
		expect(zero.createdDate?.getTime()).toBe(DiscordSnowflake.epochNumber);
	});

	test('date getters preserve a subclass timestamp at Unix epoch', () => {
		class EpochLobby extends Lobby {
			public override get createdTimestamp() {
				return 0;
			}
		}

		class EpochMessage extends LobbyMessage {
			public override get createdTimestamp() {
				return 0;
			}
		}

		expect(new EpochLobby(lobbyData).createdDate?.getTime()).toBe(0);
		expect(new EpochMessage(messageData).createdDate?.getTime()).toBe(0);
	});

	test('subclasses can own and expose nested structures without getter conflicts', () => {
		class CachedLobby extends Lobby {
			public get members() {
				return this[kData].members.map((data) => new LobbyMember(data));
			}

			public get linkedChannel() {
				return this[kData].linked_channel;
			}

			public get metadata() {
				return this[kData].metadata === null ? null : new Map(Object.entries(this[kData].metadata));
			}
		}

		class CachedMessage extends LobbyMessage {
			public get author() {
				return new User(this[kData].author);
			}

			public get lobbyMember() {
				const data = this[kData].lobby_member;
				return data ? new LobbyMessageMember(data) : undefined;
			}
		}

		const lobby = new CachedLobby(lobbyData);
		expect(lobby.members[0]).toBeInstanceOf(LobbyMember);
		expect(lobby.linkedChannel?.id).toBe(lobbyData.linked_channel?.id);
		expect(lobby.metadata?.get('topic')).toBe(lobbyData.metadata?.topic);
		expect(lobby[kClone]()).toBeInstanceOf(CachedLobby);
		expect(lobby.toJSON()).toStrictEqual(lobbyData);

		const message = new CachedMessage(messageData);
		expect(message.author).toBeInstanceOf(User);
		expect(message.lobbyMember).toBeInstanceOf(LobbyMessageMember);
		expect(message[kClone]()).toBeInstanceOf(CachedMessage);
		expect(message.toJSON()).toStrictEqual(messageData);
	});
});
