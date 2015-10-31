"use strict";

var API = "https://discordapp.com/api";
var Endpoints = {
	// general endpoints
	LOGIN: API + "/auth/login",
	LOGOUT: API + "/auth/logout",
	ME: API + "/users/@me",
	GATEWAY: API + "/gateway",
	USER_CHANNELS: function USER_CHANNELS(userID) {
		return API + "/users/" + userID + "/channels";
	},
	AVATAR: function AVATAR(userID, avatar) {
		return API + "/users/" + userID + "/avatars/" + avatar + ".jpg";
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
	}
};

var PacketType = {
	READY: "READY"
};

exports.API_ENDPOINT = API;
exports.Endpoints = Endpoints;
exports.PacketType = PacketType;