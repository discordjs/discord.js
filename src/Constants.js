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

var PacketType = {
	READY : "READY"
}

exports.API_ENDPOINT = API;
exports.Endpoints = Endpoints;
exports.PacketType = PacketType;