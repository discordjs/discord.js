const API = 'https://discordapp.com/api';

const ConnectionState = {
	CONNECTED:    0,
	CONNECTING:   1,
	DISCONNECTED: 2,
	NOT_STARTED:  3,
};

const DefaultOptions = {
	logging: {
		enabled:  false,
		as_event: true,
	},
	ws:      {
		large_threshold: 250,
		compress:        true,
		properties:      {
			$os:               'discord.js',
			$browser:          'discord.js',
			$device:           'discord.js',
			$referrer:         'discord.js',
			$referring_domain: 'discord.js',
		},
	},
};

const Endpoints = {
	// general endpoints
	LOGIN:         `${API}/auth/login`,
	LOGOUT:        `${API}/auth/logout`,
	ME:            `${API}/users/@me`,
	ME_SERVER:     (serverID) => `${Endpoints.ME}/guilds/${serverID}`,
	GATEWAY:       `${API}/gateway`,
	USER_CHANNELS: (userID) => `${API}/users/${userID}/channels`,
	AVATAR:        (userID, avatar) => `${API}/users/${userID}/avatars/${avatar}.jpg`,
	INVITE:        (id) => `${API}/invite/${id}`,

	// servers
	SERVERS:             `${API}/guilds`,
	SERVER:              (serverID) => `${Endpoints.SERVERS}/${serverID}`,
	SERVER_ICON:         (serverID, hash) => `${Endpoints.SERVER(serverID)}/icons/${hash}.jpg`,
	SERVER_PRUNE:        (serverID) => `${Endpoints.SERVER(serverID)}/prune`,
	SERVER_EMBED:        (serverID) => `${Endpoints.SERVER(serverID)}/embed`,
	SERVER_INVITES:      (serverID) => `${Endpoints.SERVER(serverID)}/invites`,
	SERVER_ROLES:        (serverID) => `${Endpoints.SERVER(serverID)}/roles`,
	SERVER_BANS:         (serverID) => `${Endpoints.SERVER(serverID)}/bans`,
	SERVER_INTEGRATIONS: (serverID) => `${Endpoints.SERVER(serverID)}/integrations`,
	SERVER_MEMBERS:      (serverID) => `${Endpoints.SERVER(serverID)}/members`,
	SERVER_CHANNELS:     (serverID) => `${Endpoints.SERVER(serverID)}/channels`,

	// channels
	CHANNELS:            `${API}/channels`,
	CHANNEL:             (channelID) => `${Endpoints.CHANNELS}/${channelID}`,
	CHANNEL_MESSAGES:    (channelID) => `${Endpoints.CHANNEL(channelID)}/messages`,
	CHANNEL_INVITES:     (channelID) => `${Endpoints.CHANNEL(channelID)}/invites`,
	CHANNEL_TYPING:      (channelID) => `${Endpoints.CHANNEL(channelID)}/typing`,
	CHANNEL_PERMISSIONS: (channelID) => `${Endpoints.CHANNEL(channelID)}/permissions`,
	CHANNEL_MESSAGE:     (channelID, messageID) => `${Endpoints.CHANNEL_MESSAGES(channelID)}/${messageID}`,
};

const Errors = {
	NO_TOKEN:                      new Error('Wanted to access a token, but there is no token available to the Client'),
	ALREADY_CONNECTED:             new Error('Wanted to connect to the WebSocket endpoint, but already connected'),
	ALREADY_CONNECTING:            new Error('Wanted to connect to the WebSocket endpoint, but already connecting'),
	WEBSOCKET_CLOSED_BEFORE_READY: new Error(
		'Waited for READY packet from server, but socket closed before that could happen'
	),
};

const Permissions = {
	// general
	createInstantInvite: 1 << 0,
	kickMembers:         1 << 1,
	banMembers:          1 << 2,
	manageRoles:         1 << 3,
	managePermissions:   1 << 3,
	manageChannels:      1 << 4,
	manageChannel:       1 << 4,
	manageServer:        1 << 5,
	// text
	readMessages:        1 << 10,
	sendMessages:        1 << 11,
	sendTTSMessages:     1 << 12,
	manageMessages:      1 << 13,
	embedLinks:          1 << 14,
	attachFiles:         1 << 15,
	readMessageHistory:  1 << 16,
	mentionEveryone:     1 << 17,
	// voice
	voiceConnect:        1 << 20,
	voiceSpeak:          1 << 21,
	voiceMuteMembers:    1 << 22,
	voiceDeafenMembers:  1 << 23,
	voiceMoveMembers:    1 << 24,
	voiceUseVAD:         1 << 25
};

const Events = {
	READY:        'ready',
	DISCONNECTED: 'disconnected',
	CONNECTED:    'connected',

	ERROR: 'error',
	LOG:   'log',

	SERVER_CREATE:      'serverCreate',
	SERVER_DELETE:      'serverDelete',
	SERVER_AVAILABLE:   'serverAvailable',
	SERVER_UNAVAILABLE: 'serverUnavailable',
	SERVER_UPDATE:      'serverUpdate',
};

const Package = require('../../package.json');

module.exports = {
	API:             API,
	ConnectionState: ConnectionState,
	DefaultOptions:  DefaultOptions,
	Endpoints:       Endpoints,
	Errors:          Errors,
	Events:          Events,
	Package:         Package,
	Permissions:     Permissions,
};
