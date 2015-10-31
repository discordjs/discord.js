var API = "https://discordapp.com/api";
var Endpoints = {
	// general endpoints
	LOGIN: `${API}/auth/login`,
	LOGOUT: `${API}/auth/logout`,
	ME: `${API}/users/@me`,
	GATEWAY: `${API}/gateway`,
	USER_CHANNELS: (userID) => `${API}/users/${userID}/channels`,
	AVATAR : (userID, avatar) => `${API}/users/${userID}/avatars/${avatar}.jpg`,
	
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
};

var Permissions = {
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

var PacketType = {
	READY : "READY"
}

exports.API_ENDPOINT = API;
exports.Endpoints = Endpoints;
exports.PacketType = PacketType;
exports.Permissions = Permissions;