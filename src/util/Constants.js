const DefaultOptions = exports.DefaultOptions = {
	ws: {
		large_threshold: 250,
		compress: true,
		properties: {
			$os: process ? process.platform : 'discord.js',
			$browser: 'discord.js',
			$device: 'discord.js',
			$referrer: '',
			$referring_domain: '',
		},
	},
	protocol_version: 4,
};

const Package = exports.Package = require('../../package.json');

const Errors = exports.Errors = {
	NO_TOKEN: new Error('request to use token, but token was unavailable to the client'),
	NO_BOT_ACCOUNT: new Error('you should ideally be using a bot account!'),
	BAD_WS_MESSAGE: new Error('a bad message was received from the websocket - bad compression or not json'),
	TOOK_TOO_LONG: new Error('something took too long to do'),
	NOT_A_PERMISSION: new Error('that is not a valid permission number'),
};

const API = 'https://discordapp.com/api';

const Endpoints = exports.Endpoints = {
	// general endpoints
	LOGIN:         `${API}/auth/login`,
	LOGOUT:        `${API}/auth/logout`,
	ME:            `${API}/users/@me`,
	ME_GUILD:     (guildID) => `${Endpoints.ME}/guilds/${guildID}`,
	GATEWAY:       `${API}/gateway`,
	USER_CHANNELS: (userID) => `${API}/users/${userID}/channels`,
	AVATAR:        (userID, avatar) => `${API}/users/${userID}/avatars/${avatar}.jpg`,
	INVITE:        (id) => `${API}/invite/${id}`,

	// guilds
	GUILDS:             `${API}/guilds`,
	GUILD:              (guildID) => `${Endpoints.GUILDS}/${guildID}`,
	GUILD_ICON:         (guildID, hash) => `${Endpoints.GUILD(guildID)}/icons/${hash}.jpg`,
	GUILD_PRUNE:        (guildID) => `${Endpoints.GUILD(guildID)}/prune`,
	GUILD_EMBED:        (guildID) => `${Endpoints.GUILD(guildID)}/embed`,
	GUILD_INVITES:      (guildID) => `${Endpoints.GUILD(guildID)}/invites`,
	GUILD_ROLES:        (guildID) => `${Endpoints.GUILD(guildID)}/roles`,
	GUILD_BANS:         (guildID) => `${Endpoints.GUILD(guildID)}/bans`,
	GUILD_INTEGRATIONS: (guildID) => `${Endpoints.GUILD(guildID)}/integrations`,
	GUILD_MEMBERS:      (guildID) => `${Endpoints.GUILD(guildID)}/members`,
	GUILD_CHANNELS:     (guildID) => `${Endpoints.GUILD(guildID)}/channels`,

	// channels
	CHANNELS:            `${API}/channels`,
	CHANNEL:             (channelID) => `${Endpoints.CHANNELS}/${channelID}`,
	CHANNEL_MESSAGES:    (channelID) => `${Endpoints.CHANNEL(channelID)}/messages`,
	CHANNEL_INVITES:     (channelID) => `${Endpoints.CHANNEL(channelID)}/invites`,
	CHANNEL_TYPING:      (channelID) => `${Endpoints.CHANNEL(channelID)}/typing`,
	CHANNEL_PERMISSIONS: (channelID) => `${Endpoints.CHANNEL(channelID)}/permissions`,
	CHANNEL_MESSAGE:     (channelID, messageID) => `${Endpoints.CHANNEL_MESSAGES(channelID)}/${messageID}`,
};

const OPCodes = exports.OPCodes = {
	DISPATCH: 0,
	HEARTBEAT: 1,
	IDENTIFY: 2,
	STATUS_UPDATE: 3,
	VOICE_STATE_UPDATE: 4,
	VOICE_GUILD_PING: 5,
	RESUME: 6,
	RECONNECT: 7,
	REQUEST_GUILD_MEMBERS: 8,
	INVALID_SESSION: 9,
};

const Events = exports.Events = {
	READY: 'ready',
	GUILD_CREATE: 'guildCreate',
	GUILD_DELETE: 'guildDelete',
	GUILD_UNAVAILABLE: 'guildUnavailable',
	GUILD_AVAILABLE: 'guildAvailable',
	GUILD_UPDATE: 'guildUpdate',
	GUILD_BAN_ADD: 'guildBanAdd',
	GUILD_BAN_REMOVE: 'guildBanRemove',
	GUILD_MEMBER_ADD: 'guildMemberAdd',
	GUILD_MEMBER_REMOVE: 'guildMemberRemove',
	GUILD_MEMBER_ROLES_UPDATE: 'guildMemberRolesUpdate',
	GUILD_ROLE_CREATE: 'guildRoleCreate',
	GUILD_ROLE_DELETE: 'guildRoleDelete',
	GUILD_ROLE_UPDATE: 'guildRoleUpdate',
	GUILD_MEMBER_AVAILABLE: 'guildMemberAvailable',
	CHANNEL_CREATE: 'channelCreate',
	CHANNEL_DELETE: 'channelDelete',
	CHANNEL_UPDATE: 'channelUpdate',
	PRESENCE_UPDATE: 'presenceUpdate',
	USER_UPDATE: 'userUpdate',
	WARN: 'warn',
};

const WSEvents = exports.WSEvents = {
	CHANNEL_CREATE: 'CHANNEL_CREATE',
	CHANNEL_DELETE: 'CHANNEL_DELETE',
	CHANNEL_UPDATE: 'CHANNEL_UPDATE',
	MESSAGE_CREATE: 'MESSAGE_CREATE',
	MESSAGE_DELETE: 'MESSAGE_DELETE',
	MESSAGE_UPDATE: 'MESSAGE_UPDATE',
	PRESENCE_UPDATE: 'PRESENCE_UPDATE',
	READY: 'READY',
	GUILD_BAN_ADD: 'GUILD_BAN_ADD',
	GUILD_BAN_REMOVE: 'GUILD_BAN_REMOVE',
	GUILD_CREATE: 'GUILD_CREATE',
	GUILD_DELETE: 'GUILD_DELETE',
	GUILD_MEMBER_ADD: 'GUILD_MEMBER_ADD',
	GUILD_MEMBER_REMOVE: 'GUILD_MEMBER_REMOVE',
	GUILD_MEMBER_UPDATE: 'GUILD_MEMBER_UPDATE',
	GUILD_MEMBERS_CHUNK: 'GUILD_MEMBERS_CHUNK',
	GUILD_ROLE_CREATE: 'GUILD_ROLE_CREATE',
	GUILD_ROLE_DELETE: 'GUILD_ROLE_DELETE',
	GUILD_ROLE_UPDATE: 'GUILD_ROLE_UPDATE',
	GUILD_UPDATE: 'GUILD_UPDATE',
	TYPING: 'TYPING_START',
	USER_UPDATE: 'USER_UPDATE',
	VOICE_STATE_UPDATE: 'VOICE_STATE_UPDATE',
	FRIEND_ADD: 'RELATIONSHIP_ADD',
	FRIEND_REMOVE: 'RELATIONSHIP_REMOVE',
};

const PermissionFlags = exports.PermissionFlags = {
	CREATE_INSTANT_INVITE: 1 << 0,
	KICK_MEMBERS: 1 << 1,
	BAN_MEMBERS: 1 << 2,
	MANAGE_ROLES: 1 << 3,
	MANAGE_CHANNELS: 1 << 4,
	MANAGE_GUILD: 1 << 5,

	READ_MESSAGES: 1 << 10,
	SEND_MESSAGES: 1 << 11,
	SEND_TTS_MESSAGES: 1 << 12,
	MANAGE_MESSAGES: 1 << 13,
	EMBED_LINKS: 1 << 14,
	ATTACH_FILES: 1 << 15,
	READ_MESSAGE_HISTORY: 1 << 16,
	MENTION_EVERYONE: 1 << 17,

	CONNECT: 1 << 20,
	SPEAK: 1 << 21,
	MUTE_MEMBERS: 1 << 22,
	DEAFEN_MEMBERS: 1 << 23,
	MOVE_MEMBERS: 1 << 24,
	USE_VAD: 1 << 25,
};

const DEFAULT_PERMISSIONS = exports.DEFAULT_PERMISSIONS = 36953089;
