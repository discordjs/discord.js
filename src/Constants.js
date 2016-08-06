"use strict";

const Constants = {};

const API = Constants.API = "https://discordapp.com/api";
const CDN = Constants.CDN = "https://cdn.discordapp.com";

const Endpoints = Constants.Endpoints = {
	// general endpoints
	LOGIN: `${API}/auth/login`,
	LOGOUT: `${API}/auth/logout`,
	ME: `${API}/users/@me`,
	ME_CHANNELS: `${API}/users/@me/channels`,
	ME_SERVER: (serverID) => `${Endpoints.ME}/guilds/${serverID}`,
	OAUTH2_APPLICATION: (appID) => `${API}/oauth2/applications/${appID}`,
	ME_NOTES: `${API}/users/@me/notes`,
	GATEWAY: `${API}/gateway`,
	AVATAR : (userID, avatar) => `${API}/users/${userID}/avatars/${avatar}.jpg`,
	INVITE: (id) => `${API}/invite/${id}`,

	// emojis
	EMOJI: (emojiID) => `${CDN}/emojis/${emojiID}.png`,

	// servers
	SERVERS: `${API}/guilds`,
	SERVER: (serverID) => `${Endpoints.SERVERS}/${serverID}`,
	SERVER_ICON: (serverID, hash) => `${Endpoints.SERVER(serverID) }/icons/${hash}.jpg`,
	SERVER_PRUNE: (serverID) => `${Endpoints.SERVER(serverID) }/prune`,
	SERVER_EMBED: (serverID) => `${Endpoints.SERVER(serverID) }/embed`,
	SERVER_INVITES: (serverID) => `${Endpoints.SERVER(serverID) }/invites`,
	SERVER_ROLES: (serverID) => `${Endpoints.SERVER(serverID) }/roles`,
	SERVER_BANS: (serverID) => `${Endpoints.SERVER(serverID) }/bans`,
	SERVER_INTEGRATIONS: (serverID) => `${Endpoints.SERVER(serverID) }/integrations`,
	SERVER_MEMBERS: (serverID) => `${Endpoints.SERVER(serverID) }/members`,
	SERVER_CHANNELS: (serverID) => `${Endpoints.SERVER(serverID) }/channels`,

	// channels
	CHANNELS: `${API}/channels`,
	CHANNEL: (channelID) => `${Endpoints.CHANNELS}/${channelID}`,
	CHANNEL_MESSAGES: (channelID) => `${Endpoints.CHANNEL(channelID) }/messages`,
	CHANNEL_INVITES: (channelID) => `${Endpoints.CHANNEL(channelID) }/invites`,
	CHANNEL_TYPING: (channelID) => `${Endpoints.CHANNEL(channelID) }/typing`,
	CHANNEL_PERMISSIONS: (channelID) => `${Endpoints.CHANNEL(channelID) }/permissions`,
	CHANNEL_MESSAGE: (channelID, messageID) => `${Endpoints.CHANNEL_MESSAGES(channelID)}/${messageID}`,
	CHANNEL_PINS: (channelID) => `${Endpoints.CHANNEL(channelID) }/pins`,
	CHANNEL_PIN: (channelID, messageID) => `${Endpoints.CHANNEL_PINS(channelID) }/${messageID}`,

	// friends
	FRIENDS: `${API}/users/@me/relationships`
};

Constants.Permissions = {
	// general
	createInstantInvite: 1 << 0,
	kickMembers: 1 << 1,
	banMembers: 1 << 2,
	administrator: 1 << 3,
	manageChannels: 1 << 4,
	manageChannel: 1 << 4,
	manageServer: 1 << 5,
	changeNickname: 1 << 26,
	manageNicknames: 1 << 27,
	manageRoles: 1 << 28,
	managePermissions: 1 << 28,
	// text
	readMessages: 1 << 10,
	sendMessages: 1 << 11,
	sendTTSMessages: 1 << 12,
	manageMessages: 1 << 13,
	embedLinks: 1 << 14,
	attachFiles: 1 << 15,
	readMessageHistory: 1 << 16,
	mentionEveryone: 1 << 17,
	// voice
	voiceConnect: 1 << 20,
	voiceSpeak: 1 << 21,
	voiceMuteMembers: 1 << 22,
	voiceDeafenMembers: 1 << 23,
	voiceMoveMembers: 1 << 24,
	voiceUseVAD: 1 << 25

};

Constants.PacketType = {
	CHANNEL_CREATE : "CHANNEL_CREATE",
	CHANNEL_DELETE : "CHANNEL_DELETE",
	CHANNEL_UPDATE : "CHANNEL_UPDATE",
	MESSAGE_CREATE : "MESSAGE_CREATE",
	MESSAGE_DELETE : "MESSAGE_DELETE",
	MESSAGE_UPDATE : "MESSAGE_UPDATE",
	PRESENCE_UPDATE : "PRESENCE_UPDATE",
	READY : "READY",
	SERVER_BAN_ADD : "GUILD_BAN_ADD",
	SERVER_BAN_REMOVE: "GUILD_BAN_REMOVE",
	SERVER_CREATE : "GUILD_CREATE",
	SERVER_DELETE : "GUILD_DELETE",
	SERVER_MEMBER_ADD : "GUILD_MEMBER_ADD",
	SERVER_MEMBER_REMOVE : "GUILD_MEMBER_REMOVE",
	SERVER_MEMBER_UPDATE : "GUILD_MEMBER_UPDATE",
	SERVER_MEMBERS_CHUNK : "GUILD_MEMBERS_CHUNK",
	SERVER_ROLE_CREATE : "GUILD_ROLE_CREATE",
	SERVER_ROLE_DELETE : "GUILD_ROLE_DELETE",
	SERVER_ROLE_UPDATE : "GUILD_ROLE_UPDATE",
	SERVER_UPDATE : "GUILD_UPDATE",
	TYPING : "TYPING_START",
	USER_UPDATE : "USER_UPDATE",
	USER_NOTE_UPDATE: "USER_NOTE_UPDATE",
	VOICE_STATE_UPDATE : "VOICE_STATE_UPDATE",
	FRIEND_ADD : "RELATIONSHIP_ADD",
	FRIEND_REMOVE : "RELATIONSHIP_REMOVE"
};

export default Constants;
