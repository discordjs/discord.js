"use strict";

Object.defineProperty(exports, "__esModule", {
	value: true
});
var Package = exports.Package = require("../../package.json");

var Errors = exports.Errors = {
	NO_TOKEN: new Error("Wanted to access a token, but there is no token available to the Client"),
	ALREADY_CONNECTED: new Error("Wanted to connect to the WebSocket endpoint, but already connected"),
	ALREADY_CONNECTING: new Error("Wanted to connect to the WebSocket endpoint, but already connecting"),
	WEBSOCKET_CLOSED_BEFORE_READY: new Error("Waited for READY packet from server, but socket closed before that could happen")
};

var DefaultOptions = exports.DefaultOptions = {
	logging: {
		enabled: false,
		as_event: true
	},
	ws: {
		large_threshold: 250,
		compress: true,
		properties: {
			$os: "discord.js",
			$browser: "discord.js",
			$device: "discord.js",
			$referrer: "discord.js",
			$referring_domain: "discord.js"
		}
	}
};

var API = exports.API = "https://discordapp.com/api";

var Events = exports.Events = {
	READY: "ready",
	DISCONNECTED: "disconnected",
	CONNECTED: "connected",

	ERROR: "error",
	LOG: "log",

	SERVER_CREATE: "serverCreate",
	SERVER_DELETE: "serverDelete",
	SERVER_AVAILABLE: "serverAvailable",
	SERVER_UNAVAILABLE: "serverUnavailable",
	SERVER_UPDATE: "serverUpdate"
};

var Endpoints = exports.Endpoints = {
	// general endpoints
	LOGIN: API + "/auth/login",
	LOGOUT: API + "/auth/logout",
	ME: API + "/users/@me",
	ME_SERVER: function ME_SERVER(serverID) {
		return Endpoints.ME + "/guilds/" + serverID;
	},
	GATEWAY: API + "/gateway",
	USER_CHANNELS: function USER_CHANNELS(userID) {
		return API + "/users/" + userID + "/channels";
	},
	AVATAR: function AVATAR(userID, avatar) {
		return API + "/users/" + userID + "/avatars/" + avatar + ".jpg";
	},
	INVITE: function INVITE(id) {
		return API + "/invite/" + id;
	},

	// servers
	SERVERS: API + "/guilds",
	SERVER: function SERVER(serverID) {
		return Endpoints.SERVERS + "/" + serverID;
	},
	SERVER_ICON: function SERVER_ICON(serverID, hash) {
		return Endpoints.SERVER(serverID) + "/icons/" + hash + ".jpg";
	},
	SERVER_PRUNE: function SERVER_PRUNE(serverID) {
		return Endpoints.SERVER(serverID) + "/prune";
	},
	SERVER_EMBED: function SERVER_EMBED(serverID) {
		return Endpoints.SERVER(serverID) + "/embed";
	},
	SERVER_INVITES: function SERVER_INVITES(serverID) {
		return Endpoints.SERVER(serverID) + "/invites";
	},
	SERVER_ROLES: function SERVER_ROLES(serverID) {
		return Endpoints.SERVER(serverID) + "/roles";
	},
	SERVER_BANS: function SERVER_BANS(serverID) {
		return Endpoints.SERVER(serverID) + "/bans";
	},
	SERVER_INTEGRATIONS: function SERVER_INTEGRATIONS(serverID) {
		return Endpoints.SERVER(serverID) + "/integrations";
	},
	SERVER_MEMBERS: function SERVER_MEMBERS(serverID) {
		return Endpoints.SERVER(serverID) + "/members";
	},
	SERVER_CHANNELS: function SERVER_CHANNELS(serverID) {
		return Endpoints.SERVER(serverID) + "/channels";
	},

	// channels
	CHANNELS: API + "/channels",
	CHANNEL: function CHANNEL(channelID) {
		return Endpoints.CHANNELS + "/" + channelID;
	},
	CHANNEL_MESSAGES: function CHANNEL_MESSAGES(channelID) {
		return Endpoints.CHANNEL(channelID) + "/messages";
	},
	CHANNEL_INVITES: function CHANNEL_INVITES(channelID) {
		return Endpoints.CHANNEL(channelID) + "/invites";
	},
	CHANNEL_TYPING: function CHANNEL_TYPING(channelID) {
		return Endpoints.CHANNEL(channelID) + "/typing";
	},
	CHANNEL_PERMISSIONS: function CHANNEL_PERMISSIONS(channelID) {
		return Endpoints.CHANNEL(channelID) + "/permissions";
	},
	CHANNEL_MESSAGE: function CHANNEL_MESSAGE(channelID, messageID) {
		return Endpoints.CHANNEL_MESSAGES(channelID) + "/" + messageID;
	}
};

var ConnectionState = exports.ConnectionState = {
	CONNECTED: 0,
	CONNECTING: 1,
	DISCONNECTED: 2,
	NOT_STARTED: 3
};