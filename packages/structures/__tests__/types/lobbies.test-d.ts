import type { APIChannel, APIUser, MessageFlags, MessageType } from 'discord-api-types/v10';
import { expectTypeOf } from 'vitest';
import { LobbyMemberFlagsBitField } from '../../src/bitfields/LobbyMemberFlagsBitField.js';
import type { MessageFlagsBitField } from '../../src/bitfields/MessageFlagsBitField.js';
import {
	Lobby,
	LobbyInvite,
	LobbyMember,
	type LobbyMessage,
	LobbyMessageMember,
	type APILobby,
	type APILobbyInvite,
	type APILobbyMember,
	type APILobbyMessage,
	type APILobbyMessageMember,
} from '../../src/lobbies/index.js';
import type { User } from '../../src/users/User.js';
import { kClone, kData, kPatch } from '../../src/utils/symbols.js';

declare const lobby: Lobby;
declare const member: LobbyMember;
declare const message: LobbyMessage;
declare const invite: LobbyInvite;
declare const snapshot: LobbyMessageMember;

expectTypeOf(lobby.id).toBeString();
expectTypeOf(lobby.applicationId).toBeString();
expectTypeOf(lobby.createdTimestamp).toEqualTypeOf<number | null>();
expectTypeOf(lobby.createdDate).toEqualTypeOf<Date | null>();
expectTypeOf(lobby.toJSON()).toEqualTypeOf<APILobby>();
expectTypeOf(member.id).toBeString();
expectTypeOf(member.flags).toEqualTypeOf<LobbyMemberFlagsBitField | null>();
expectTypeOf(member.additionalName).toEqualTypeOf<string | undefined>();
expectTypeOf(member.toJSON()).toEqualTypeOf<APILobbyMember>();
expectTypeOf(message.id).toBeString();
expectTypeOf(message.type).toEqualTypeOf<MessageType>();
expectTypeOf(message.flags).toEqualTypeOf<MessageFlagsBitField | null>();
expectTypeOf(message.content).toBeString();
expectTypeOf(message.lobbyId).toBeString();
expectTypeOf(message.channelId).toBeString();
expectTypeOf(message.applicationId).toBeString();
expectTypeOf(message.createdTimestamp).toEqualTypeOf<number | null>();
expectTypeOf(message.createdDate).toEqualTypeOf<Date | null>();
expectTypeOf(message.toJSON()).toEqualTypeOf<APILobbyMessage>();
expectTypeOf(invite.code).toBeString();
expectTypeOf(invite.toJSON()).toEqualTypeOf<APILobbyInvite>();
expectTypeOf(snapshot.additionalName).toBeString();
expectTypeOf(snapshot.toJSON()).toEqualTypeOf<APILobbyMessageMember>();

expectTypeOf(lobby[kPatch]({ application_id: '0', metadata: null })).toEqualTypeOf<Lobby>();
expectTypeOf(lobby[kClone]({ members: [] })).toEqualTypeOf<Lobby>();
expectTypeOf(member[kPatch]({ flags: 0 })).toEqualTypeOf<LobbyMember>();
expectTypeOf(member[kClone]({ additional_name: 'Updated' })).toEqualTypeOf<LobbyMember>();
expectTypeOf(message[kPatch]({ content: 'Updated' })).toEqualTypeOf<LobbyMessage>();
expectTypeOf(message[kClone]({ moderation_metadata: null })).toEqualTypeOf<LobbyMessage>();
expectTypeOf(invite[kPatch]({ code: 'Updated' })).toEqualTypeOf<LobbyInvite>();
expectTypeOf(invite[kClone]()).toEqualTypeOf<LobbyInvite>();
expectTypeOf(snapshot[kPatch]({ additional_name: 'Updated' })).toEqualTypeOf<LobbyMessageMember>();
expectTypeOf(snapshot[kClone]()).toEqualTypeOf<LobbyMessageMember>();

// @ts-expect-error Patches accept the API's numeric flags, not a string
member[kPatch]({ flags: '1' });
// @ts-expect-error Clone patches accept response names, which cannot be null
member[kClone]({ additional_name: null });
// @ts-expect-error Clone patches accept raw string metadata values
message[kClone]({ metadata: { count: 1 } });

expectTypeOf<APILobby['linked_channel']>().toEqualTypeOf<APIChannel | undefined>();
expectTypeOf<APILobby['metadata']>().toEqualTypeOf<Record<string, string> | null>();
expectTypeOf<APILobbyMember['metadata']>().toEqualTypeOf<Record<string, string> | null | undefined>();
expectTypeOf<APILobbyMessage['author']>().toEqualTypeOf<APIUser>();
expectTypeOf<APILobbyMessage['flags']>().toEqualTypeOf<MessageFlags | 0>();
expectTypeOf<APILobbyMessage['lobby_member']>().toEqualTypeOf<APILobbyMessageMember | undefined>();
expectTypeOf<APILobbyMessage['moderation_metadata']>().toEqualTypeOf<Record<string, string> | null | undefined>();

const omittedLobby = new Lobby<'id' | 'application_id' | 'members'>({ metadata: null });
expectTypeOf(omittedLobby.id).toBeUnknown();
expectTypeOf(omittedLobby.applicationId).toBeUnknown();
expectTypeOf(omittedLobby.createdTimestamp).toEqualTypeOf<number | null>();

const omittedMember = new LobbyMember<'flags' | 'additional_name'>({ id: '0' });
expectTypeOf(omittedMember.id).toBeString();
expectTypeOf(omittedMember.flags).toEqualTypeOf<LobbyMemberFlagsBitField | null>();
expectTypeOf(omittedMember.additionalName).toBeUnknown();

declare const omittedMessage: LobbyMessage<'content' | 'type' | 'flags'>;
expectTypeOf(omittedMessage.content).toBeUnknown();
expectTypeOf(omittedMessage.type).toBeUnknown();
expectTypeOf(omittedMessage.flags).toEqualTypeOf<MessageFlagsBitField | null>();
expectTypeOf(omittedMessage.lobbyId).toBeString();

expectTypeOf(new LobbyInvite<'code'>({}).code).toBeUnknown();
expectTypeOf(new LobbyMessageMember<'additional_name'>({}).additionalName).toBeUnknown();

new LobbyMemberFlagsBitField('CanLinkLobby');
// @ts-expect-error Only documented lobby member flag names can be resolved
new LobbyMemberFlagsBitField('UnknownFlag');

// @ts-expect-error Lobby metadata is required, though nullable, in API responses
new Lobby<''>({ id: '0', application_id: '0', members: [] });
// @ts-expect-error A lobby member's response name is not nullable
new LobbyMember<''>({ id: '0', additional_name: null });
// @ts-expect-error A message member snapshot contains a required additional name
new LobbyMessageMember<''>({});
// @ts-expect-error Lobby invites only contain a code
new LobbyInvite<''>({ code: 'invite', expires_at: null });
// @ts-expect-error The base lobby leaves member construction to subclasses
expectTypeOf(lobby.members);
// @ts-expect-error The base lobby leaves linked channel construction to subclasses
expectTypeOf(lobby.linkedChannel);
// @ts-expect-error The base member leaves metadata representation to subclasses
expectTypeOf(member.metadata);
// @ts-expect-error The base message leaves author construction to subclasses
expectTypeOf(message.author);
// @ts-expect-error The base message leaves member snapshot construction to subclasses
expectTypeOf(message.lobbyMember);

declare class CachedMember extends LobbyMember {
	public get metadata(): ReadonlyMap<string, string> | null | undefined;
}

declare class CachedLobby extends Lobby {
	public get members(): CachedMember[];
	public get linkedChannel(): APIChannel | undefined;
}

declare class CachedMessage extends LobbyMessage {
	public get author(): User;
	public get lobbyMember(): LobbyMessageMember | undefined;
	public get moderationMetadata(): ReadonlyMap<string, string> | null | undefined;
}

declare const cachedLobby: CachedLobby;
declare const cachedMessage: CachedMessage;
expectTypeOf(cachedLobby.members).toEqualTypeOf<CachedMember[]>();
expectTypeOf(cachedMessage.author).toEqualTypeOf<User>();
expectTypeOf(cachedMessage.lobbyMember).toEqualTypeOf<LobbyMessageMember | undefined>();
expectTypeOf(cachedLobby[kClone]()).toEqualTypeOf<CachedLobby>();
expectTypeOf(cachedMessage[kPatch]({ content: 'Updated' })).toEqualTypeOf<CachedMessage>();

class MetadataOmittedLobby extends Lobby<'metadata'> {
	public static override readonly DataTemplate = { set metadata(_: APILobby['metadata']) {} };

	public get rawMetadata() {
		return this[kData].metadata;
	}
}

declare const metadataOmitted: MetadataOmittedLobby;
expectTypeOf(metadataOmitted.rawMetadata).toBeUnknown();
