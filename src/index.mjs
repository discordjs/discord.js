export * from './client/Client';

// "Root" Classes (staring points)
export { default as BaseClient } from './client/BaseClient';
export { default as Client } from './client/Client';
export { default as Shard } from './sharding/Shard';
export { default as ShardClientUtil } from './sharding/ShardClientUtil';
export { default as ShardingManager } from './sharding/ShardingManager';
export { default as WebhookClient } from './client/WebhookClient';

// Utilities
export { default as Collection } from './util/Collection';
export { default as Constants } from './util/Constants';
export { default as DataResolver } from './util/DataResolver';
export { default as DataStore } from './stores/DataStore';
export { default as DiscordAPIError } from './rest/DiscordAPIError';
export { default as EvaluatedPermissions } from './util/Permissions';
export { default as Permissions } from './util/Permissions';
export { default as Snowflake } from './util/Snowflake';
export { default as SnowflakeUtil } from './util/Snowflake';

import Util from './util/Util';
export { Util, Util as util };

import Package from '../package.json';
export const version = Package.version;

// Stores
export { default as ChannelStore } from './stores/ChannelStore';
export { default as ChannelPresenceStore } from './stores/ChannelPresenceStore';
export { default as GuildMemberStore } from './stores/GuildMemberStore';
export { default as GuildStore } from './stores/GuildStore';
export { default as MessageStore } from './stores/MessageStore';
export { default as PresenceStore } from './stores/PresenceStore';
export { default as RoleStore } from './stores/RoleStore';
export { default as UserStore } from './stores/UserStore';

// Structures
export { Activity } from './structures/Presence';
export { default as Channel } from './structures/Channel';
export { default as CategoryChannel } from './structures/CategoryChannel';
export { default as ClientUser } from './structures/ClientUser';
export { default as ClientUserSettings } from './structures/ClientUserSettings';
export { default as Collector } from './structures/interfaces/Collector';
export { default as DMChannel } from './structures/DMChannel';
export { default as Emoji } from './structures/Emoji';
export { default as GroupDMChannel } from './structures/GroupDMChannel';
export { default as Guild } from './structures/Guild';
export { default as GuildAuditLogs } from './structures/GuildAuditLogs';
export { default as GuildChannel } from './structures/GuildChannel';
export { default as GuildMember } from './structures/GuildMember';
export { default as Invite } from './structures/Invite';
export { default as Message } from './structures/Message';
export { default as MessageAttachment } from './structures/MessageAttachment';
export { default as MessageCollector } from './structures/MessageCollector';
export { default as MessageEmbed } from './structures/MessageEmbed';
export { default as MessageMentions } from './structures/MessageMentions';
export { default as MessageReaction } from './structures/MessageReaction';
export { default as ClientApplication } from './structures/ClientApplication';
export { default as PermissionOverwrites } from './structures/PermissionOverwrites';
export { default as Presence } from './structures/Presence';
export { default as ReactionEmoji } from './structures/ReactionEmoji';
export { default as ReactionCollector } from './structures/ReactionCollector';
export { default as Role } from './structures/Role';
export { default as TextChannel } from './structures/TextChannel';
export { default as User } from './structures/User';
export { default as UserConnection } from './structures/UserConnection';
export { default as VoiceChannel } from './structures/VoiceChannel';
export { default as VoiceRegion } from './structures/VoiceRegion';
export { default as Webhook } from './structures/Webhook';

export { WebSocket } from './WebSocket';

