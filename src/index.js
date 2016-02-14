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
 * @property {boolean} [revive=false] whether the Client should attempt to automatically reconnect if it is disconnected.
 * @property {boolean} [rate_limit_as_error=false] whether rejections to API requests due to rate-limiting should be treated as errors.
 * @property {Number} [large_threshold=250] an integer between 0 and 250. When a server has more users than `options.large_threshold`, only the online/active users are cached.
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

/**
 * Object that maps permissions to either true (allowed) or false (disallowed) for use with permission management.
 * @see Permission
 * @typedef {(Object<Permission, Boolean>)} PermissionMap
 * @example
 * // allow members to kick and ban others
 * {
 *     "kickMembers" : true,
 *     "banMembers" : true
 * }
 * @example
 * // disallow attaching files
 * {
 *     "attachFiles" : false
 * }
 */

/**
 * Available role and channel permissions. Available permission types are listed below:
 * @typedef {(string)} Permission
 * @example
 * // general
 * "createInstantInvite"
 * "kickMembers"
 * "banMembers"
 * "manageRoles"
 * "managePermissions",
 * "manageChannels",
 * "manageChannel",
 * "manageServer",
 * // text
 * "readMessages",
 * "sendMessages",
 * "sendTTSMessages",
 * "manageMessages",
 * "embedLinks",
 * "attachFiles",
 * "readMessageHistory",
 * "mentionEveryone",
 * // voice
 * "voiceConnect",
 * "voiceSpeak",
 * "voiceMuteMembers",
 * "voiceDeafenMembers",
 * "voiceMoveMembers",
 * "voiceUseVAD"
 */

/**
 * Object containing data relating to roles
 * @typedef {(object)} RoleData
 * @property {string} [name=newrole] name of role, defaults to `new role`
 * @property {boolean} [hoist=false] whether the role should appear as its own category in the user sidebar.
 * @property {Number} [color] denary number representing the color of the role. You can use hex by passing in `0xFF0000`
 * @property {Array<Permission>} [permissions] an array of permissions that the role has.
 * @example
 * {
 *     color : 0xFF0000,
 *     hoist : false,
 *     name : "A New Role!",
 *     permissions : [
 *         // see the constants documentation for full permissions
 *         "attachFiles", "sendMessages"
 *     ]
 * }
 */

/**
 * Object containing configuration information for an Invite.
 * @typedef {(object)} InviteOptions
 * @property {Number} [maxAge=0] maximum time in seconds that the invite will remain valid. Set to 0 for infinity.
 * @property {Number} [maxUses=0] maximum uses of the invite before it becomes invalid. Set to 0 for infinity.
 * @property {Boolean} [temporary=false] Whether the invite should be temporary (users are kicked if after 24 hours they are not given a role)
 * @property {Boolean} [xkcd=false] Whether the invite should be human-friendly
 * @example
 * {
 *     maxAge : 3600, // one hour
 *     maxUses : 0, // infinite uses
 *     xkcd : true // human friendly
 * }
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
