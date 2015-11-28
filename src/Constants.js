"use strict";

export const API = "https://discordapp.com/api";
export const Endpoints = {
	// general endpoints
	LOGIN: `${API}/auth/login`,
	LOGOUT: `${API}/auth/logout`,
	ME: `${API}/users/@me`,
	GATEWAY: `${API}/gateway`,
	USER_CHANNELS: (userID) => `${API}/users/${userID}/channels`,
	AVATAR : (userID, avatar) => `${API}/users/${userID}/avatars/${avatar}.jpg`,
	INVITE: (id) => `${API}/invite/${id}`,

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
	CHANNEL_MESSAGE: (channelID, messageID) => `${Endpoints.CHANNEL_MESSAGES(channelID)}/${messageID}`
};

export const Permissions = {
	// general
	createInstantInvite: 1 << 0,
	kickMembers: 1 << 1,
	banMembers: 1 << 2,
	manageRoles: 1 << 3,
	managePermissions: 1 << 3,
	manageChannels: 1 << 4,
	manageChannel: 1 << 4,
	manageServer: 1 << 5,
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

export const PacketType = {
	READY : "READY",
	MESSAGE_CREATE : "MESSAGE_CREATE",
	MESSAGE_UPDATE : "MESSAGE_UPDATE",
	MESSAGE_DELETE : "MESSAGE_DELETE",
	SERVER_CREATE : "GUILD_CREATE",
	SERVER_DELETE : "GUILD_DELETE",
	SERVER_UPDATE : "GUILD_UPDATE",
	CHANNEL_CREATE : "CHANNEL_CREATE",
	CHANNEL_DELETE : "CHANNEL_DELETE",
	CHANNEL_UPDATE : "CHANNEL_UPDATE",
	SERVER_ROLE_CREATE : "GUILD_ROLE_CREATE",
	SERVER_ROLE_DELETE : "GUILD_ROLE_DELETE",
	SERVER_ROLE_UPDATE : "GUILD_ROLE_UPDATE",
	SERVER_MEMBER_ADD : "GUILD_MEMBER_ADD",
	SERVER_MEMBER_REMOVE : "GUILD_MEMBER_REMOVE",
	SERVER_MEMBER_UPDATE : "GUILD_MEMBER_UPDATE",
	PRESENCE_UPDATE : "PRESENCE_UPDATE",
	TYPING : "TYPING_START",
	SERVER_BAN_ADD : "GUILD_BAN_ADD",
	SERVER_BAN_REMOVE : "GUILD_BAN_REMOVE"
};
