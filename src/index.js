const path = require('path');

module.exports = {
  Client: require('./client/Client'),
  Shard: require('./sharding/Shard'),
  ShardingManager: require('./sharding/ShardingManager'),
  Collection: require('./util/Collection'),

  Channel: require('./structures/Channel'),
  ClientUser: require('./structures/ClientUser'),
  DMChannel: require('./structures/DMChannel'),
  Emoji: require('./structures/Emoji'),
  EvaluatedPermissions: require('./structures/EvaluatedPermissions'),
  GroupDMChannel: require('./structures/GroupDMChannel'),
  Guild: require('./structures/Guild'),
  GuildChannel: require('./structures/GuildChannel'),
  GuildMember: require('./structures/GuildMember'),
  Invite: require('./structures/Invite'),
  Message: require('./structures/Message'),
  MessageAttachment: require('./structures/MessageAttachment'),
  MessageCollector: require('./structures/MessageCollector'),
  MessageEmbed: require('./structures/MessageEmbed'),
  PartialGuild: require('./structures/PartialGuild'),
  PartialGuildChannel: require('./structures/PartialGuildChannel'),
  PermissionOverwrites: require('./structures/PermissionOverwrites'),
  Role: require('./structures/Role'),
  TextChannel: require('./structures/TextChannel'),
  User: require('./structures/User'),
  VoiceChannel: require('./structures/VoiceChannel'),

  version: require(path.join(__dirname, '..', 'package')).version,
};
