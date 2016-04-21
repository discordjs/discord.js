"use strict";

/**
 * Object containing user agent data required for API requests.
 * @typedef {(object)} UserAgent
 * @property {string} [url=https://github.com/hydrabolt/discord.js] URL to the repository/homepage of the creator.
 * @property {string} [version=6.0.0] version of your bot.
 * @property {string} full stringified user-agent that is generate automatically upon changes. Read-only.
*/

/**
 * Object containing properties that can be used to alter the client's functionality.
 * @typedef {(object)} ClientOptions
 * @property {boolean} [compress=true] whether or not large packets that are sent over WebSockets should be compressed.
 * @property {boolean} [autoReconnect=false] whether the Client should attempt to automatically reconnect if it is disconnected.
 * @property {boolean} [rateLimitAsError=false] whether rejections to API requests due to rate-limiting should be treated as errors.
 * @property {Number} [largeThreshold=250] an integer between 0 and 250. When a server has more users than `options.largeThreshold`, only the online/active users are cached.
*/

/**
 * Object containing properties that will be applied when deleting messages
 * @typedef {(object)} MessageDeletionOptions
 * @property {Number} [wait] If set, the message will be deleted after `options.wait` milliseconds.
 */

/**
 * Object containing properties that will be used when fetching channel logs. You cannot specify _both_ `options.before` and `options.after`
 * @typedef {(object)} ChannelLogsOptions
 * @property {MessageResolvable} [before] When fetching logs, it will fetch from messages before `options.before` but not including it.
 * @property {MessageResolvable} [after] When fetching logs, it will fetch from messages after `options.after` but not including it.
 */

import Client from "./Client/Client";
import Channel from "./Structures/Channel";
import ChannelPermissions from "./Structures/ChannelPermissions";
import Invite from "./Structures/Invite";
import Message from "./Structures/Message";
import PermissionOverwrite from "./Structures/PermissionOverwrite";
import PMChannel from "./Structures/PMChannel";
import Role from "./Structures/Role";
import Server from "./Structures/Server";
import ServerChannel from "./Structures/ServerChannel";
import TextChannel from "./Structures/TextChannel";
import User from "./Structures/User";
import VoiceChannel from "./Structures/VoiceChannel";
import Constants from "./Constants";
import Cache from "./Util/Cache.js";

export default {
	Client,
	Channel,
	ChannelPermissions,
	Invite,
	Message,
	PermissionOverwrite,
	PMChannel,
	Role,
	Server,
	ServerChannel,
	TextChannel,
	User,
	VoiceChannel,
	Constants,
	Cache
};
