"use strict";

const Bucket = require("../util/Bucket");
const Call = require("../structures/Call");
const Constants = require("../Constants");
const ExtendedUser = require("../structures/ExtendedUser");
const OPCodes = Constants.GatewayOPCodes;
const User = require("../structures/User");
var WebSocket = typeof window !== "undefined" ? window.WebSocket : require("ws");
const Zlib = require("zlib");

var EventEmitter;
try {
    EventEmitter = require("eventemitter3");
} catch(err) {
    EventEmitter = require("events").EventEmitter;
}
var Erlpack;
try {
    Erlpack = require("erlpack");
} catch(err) { // eslint-disable no-empty
}
var Pako;
try {
    Pako = require("pako");
} catch(err) { // eslint-disable no-empty
}
try {
    WebSocket = require("uws");
} catch(err) { // eslint-disable no-empty
}

/**
* Represents a shard
* @extends EventEmitter
* @prop {Number} id The ID of the shard
* @prop {Boolean} connecting Whether the shard is connecting
* @prop {Boolean} ready Whether the shard is ready
* @prop {Array<String>?} discordServerTrace Debug trace of Discord servers
* @prop {String} status The status of the shard. "disconnected"/"connecting"/"handshaking"/"connected"
* @prop {Number} lastHeartbeatReceived Last time Discord acknowledged a heartbeat, null if shard has not sent heartbeat yet
* @prop {Number} lastHeartbeatSent Last time shard sent a heartbeat, null if shard has not sent heartbeat yet
* @prop {Number} latency Current latency between shard and Discord
*/
class Shard extends EventEmitter {
    constructor(id, client) {
        super();

        this.id = id;
        this.client = client;

        this.hardReset();
    }

    get latency() {
        return this.lastHeartbeatSent && this.lastHeartbeatReceived ? this.lastHeartbeatReceived - this.lastHeartbeatSent : Infinity;
    }

    /**
    * Tells the shard to connect
    */
    connect() {
        if(this.ws && this.ws.readyState != WebSocket.CLOSED) {
            this.client.emit("error", new Error("Existing connection detected"), this.id);
            return;
        }
        ++this.connectAttempts;
        this.connecting = true;
        return this.initializeWS();
    }

    /**
    * Disconnects the shard
    * @arg {Object?} [options] Shard disconnect options
    * @arg {String | Boolean} [options.reconnect] false means destroy everything, true means you want to reconnect in the future, "auto" will autoreconnect
    */
    disconnect(options, error) {
        if(!this.ws) {
            return;
        }
        options = options || {};
        if(this.heartbeatInterval) {
            clearInterval(this.heartbeatInterval);
            this.heartbeatInterval = null;
        }
        if(this.ws) {
            this.ws.onclose = undefined;
            try {
                if(options.reconnect && this.sessionID) {
                    this.ws.terminate();
                } else {
                    this.ws.close();
                }
            } catch(err) {
                /**
                * Fired when the shard encounters an error
                * @event Client#error
                * @prop {Error} err The error
                * @prop {Number} id The ID of the shard
                */
                this.client.emit("error", err, this.id);
            }
            /**
            * Fired when the shard disconnects
            * @event Shard#disconnect
            * @prop {Error?} err The error, if any
            */
            this.emit("disconnect", error || null);
            this.ws = null;
        }
        this.status = "disconnected";
        this.reset();
        if(options.reconnect === "auto" && this.client.options.autoreconnect) {
            /**
            * Fired when stuff happens and gives more info
            * @event Client#debug
            * @prop {String} message The debug message
            * @prop {Number} id The ID of the shard
            */
            this.client.emit("debug", `Queueing reconnect in ${this.reconnectInterval}ms | Attempt ${this.connectAttempts}`, this.id);
            setTimeout(() => {
                this.client.shards.connect(this);
            }, this.reconnectInterval);
            this.reconnectInterval = Math.min(Math.round(this.reconnectInterval * (Math.random() * 2 + 1)), 30000);
        } else if(!options.reconnect) {
            this.hardReset();
        }
    }

    reset() {
        this.connecting = false;
        this.ready = false;
        this.preReady = false;
        this.getAllUsersCount = {};
        this.getAllUsersQueue = [];
        this.getAllUsersLength = 1;
        this.guildSyncQueue = [];
        this.guildSyncQueueLength = 1;
        this.unsyncedGuilds = 0;
        this.lastHeartbeatAck = true;
        this.lastHeartbeatReceived = null;
        this.lastHeartbeatSent = null;
        this.status = "disconnected";
    }

    hardReset() {
        this.reset();
        this.seq = 0;
        this.sessionID = null;
        this.reconnectInterval = 1000;
        this.connectAttempts = 0;
        this.ws = null;
        this.heartbeatInterval = null;
        this.guildCreateTimeout = null;
        this.idleSince = null;
        this.globalBucket = new Bucket(120, 60000, 0);
        this.presenceUpdateBucket = new Bucket(5, 60000, 0);
        this.presence = JSON.parse(JSON.stringify(this.client.presence)); // Fast copy
    }

    resume() {
        this.sendWS(OPCodes.RESUME, {
            token: this.client.token,
            session_id: this.sessionID,
            seq: this.seq
        }, true);
    }

    identify() {
        var identify = {
            token: this.client.token,
            v: Constants.GATEWAY_VERSION,
            compress: !!this.client.options.compress,
            large_threshold: this.client.options.largeThreshold,
            properties: {
                "os": process.platform,
                "browser": "Eris",
                "device": "Eris"
            }
        };
        if(this.client.options.maxShards > 1) {
            identify.shard = [this.id, this.client.options.maxShards];
        }
        if(this.presence.status) {
            identify.presence = this.presence;
        }
        this.sendWS(OPCodes.IDENTIFY, identify, true);
    }

    wsEvent(packet) {
        // var startTime = Date.now();
        // var debugStr = "";
        switch(packet.t) { /* eslint-disable no-redeclare */ // (╯°□°）╯︵ ┻━┻
            case "PRESENCE_UPDATE": {
                if(packet.d.user.username !== undefined) {
                    var user = this.client.users.get(packet.d.user.id);
                    var oldUser = null;
                    if(user && (user.username !== packet.d.user.username || user.avatar !== packet.d.user.avatar)) {
                        oldUser = {
                            username: user.username,
                            discriminator: user.discriminator,
                            avatar: user.avatar
                        };
                    }
                    if(!user || oldUser) {
                        user = this.client.users.update(packet.d.user, this.client);
                        /**
                        * Fired when a user's username or avatar changes
                        * @event Client#userUpdate
                        * @prop {User} user The updated user
                        * @prop {Object?} oldUser The old user data
                        * @prop {String} oldUser.username The username of the user
                        * @prop {String} oldUser.discriminator The discriminator of the user
                        * @prop {String?} oldUser.avatar The hash of the user's avatar, or null if no avatar
                        */
                        this.client.emit("userUpdate", user, oldUser);
                    }
                }
                if(!packet.d.guild_id) {
                    packet.d.id = packet.d.user.id;
                    var relationship = this.client.relationships.get(packet.d.id);
                    if(!relationship) { // Removing relationships
                        return;
                    }
                    var oldPresence = {
                        game: relationship.game,
                        status: relationship.status
                    };
                    /**
                    * Fired when a guild member or relationship's status or game changes
                    * @event Client#presenceUpdate
                    * @prop {Member | Relationship} other The updated member or relationship
                    * @prop {Object?} oldPresence The old presence data. If the user was offline when the bot started and the client option getAllUsers is not true, this will be null
                    * @prop {String} oldPresence.status The other user's old status. Either "online", "idle", or "offline"
                    * @prop {Object?} oldPresence.game The old game the other user was playing
                    * @prop {String} oldPresence.game.name The name of the active game
                    * @prop {Number} oldPresence.game.type The type of the active game (0 is default, 1 is Twitch, 2 is YouTube)
                    * @prop {String} oldPresence.game.url The url of the active game
                    */
                    this.client.emit("presenceUpdate", this.client.relationships.update(packet.d), oldPresence);
                    break;
                }
                var guild = this.client.guilds.get(packet.d.guild_id);
                if(!guild) {
                    this.client.emit("warn", "Rogue presence update: " + JSON.stringify(packet), this.id);
                    break;
                }
                var member = guild.members.get(packet.d.id = packet.d.user.id);
                var oldPresence = null;
                if(member && (member.status !== packet.d.status || (member.game !== packet.d.game && (!member.game || !packet.d.game || member.game.name !== packet.d.game.name || member.game.type !== packet.d.game.type || member.game.url !== packet.d.game.url)))) {
                    oldPresence = {
                        game: member.game,
                        status: member.status
                    };
                }
                if((!member && packet.d.user.username) || oldPresence) {
                    member = guild.members.update(packet.d, guild);
                    this.client.emit("presenceUpdate", member, oldPresence);
                }
                break;
            }
            case "VOICE_STATE_UPDATE": { // (╯°□°）╯︵ ┻━┻
                if(packet.d.guild_id === undefined) {
                    packet.d.id = packet.d.user_id;
                    if(packet.d.channel_id === null) {
                        var flag = false;
                        for(var groupChannel of this.client.groupChannels) {
                            var call = (groupChannel[1].call || groupChannel[1].lastCall);
                            if(call && call.voiceStates.remove(packet.d)) {
                                flag = true;
                                break;
                            }
                        }
                        if(!flag) {
                            for(var privateChannel of this.client.privateChannels) {
                                var call = (privateChannel[1].call || privateChannel[1].lastCall);
                                if(call && call.voiceStates.remove(packet.d)) {
                                    flag = true;
                                    break;
                                }
                            }
                            if(!flag) {
                                this.client.emit("error", new Error("VOICE_STATE_UPDATE for user leaving call not found"));
                                break;
                            }
                        }
                    } else {
                        var channel = this.client.getChannel(packet.d.channel_id);
                        if(!channel.call && !channel.lastCall) {
                            this.client.emit("error", new Error("VOICE_STATE_UPDATE for untracked call"));
                            break;
                        }
                        (channel.call || channel.lastCall).voiceStates.update(packet.d);
                    }
                    break;
                }
                var guild = this.client.guilds.get(packet.d.guild_id);
                if(!guild) {
                    break;
                }
                if(guild.pendingVoiceStates) {
                    guild.pendingVoiceStates.push(packet.d);
                    break;
                }
                var member = guild.members.get(packet.d.id = packet.d.user_id);
                if(!member) {
                    var channel = guild.channels.find((channel) => channel.type === 2 && channel.voiceMembers.get(packet.d.id));
                    if(channel) {
                        channel.voiceMembers.remove(packet.d);
                        this.client.emit("warn", "VOICE_STATE_UPDATE member null but in channel: " + packet.d.id, this.id);
                        break;
                    }
                    break;
                }
                var oldState = {
                    mute: member.voiceState.mute,
                    deaf: member.voiceState.deaf,
                    selfMute: member.voiceState.selfMute,
                    selfDeaf: member.voiceState.selfDeaf
                };
                var oldChannelID = member.voiceState.channelID;
                member.update(packet.d, this.client);
                if(member.user.id === this.client.user.id) {
                    var voiceConnection = this.client.voiceConnections.get(packet.d.guild_id);
                    if(voiceConnection && voiceConnection.channelID !== packet.d.channel_id) {
                        voiceConnection.switchChannel(packet.d.channel_id, true);
                    }
                }
                if(oldChannelID != packet.d.channel_id) {
                    var oldChannel, newChannel;
                    if(oldChannelID) {
                        oldChannel = guild.channels.get(oldChannelID);
                    }
                    if(packet.d.channel_id && (newChannel = guild.channels.get(packet.d.channel_id)) && newChannel.type === 2) { // Welcome to Discord, where one can "join" text channels
                        if(oldChannel) {
                            /**
                            * Fired when a guild member switches voice channels
                            * @event Client#voiceChannelSwitch
                            * @prop {Member} member The member
                            * @prop {GuildChannel} newChannel The new voice channel
                            * @prop {GuildChannel} oldChannel The old voice channel
                            */
                            oldChannel.voiceMembers.remove(member);
                            this.client.emit("voiceChannelSwitch", newChannel.voiceMembers.add(member, guild), newChannel, oldChannel);
                        } else {
                            /**
                            * Fired when a guild member joins a voice channel. This event is not fired when a member switches voice channels, see `voiceChannelSwitch`
                            * @event Client#voiceChannelJoin
                            * @prop {Member} member The member
                            * @prop {GuildChannel} newChannel The voice channel
                            */
                            this.client.emit("voiceChannelJoin", newChannel.voiceMembers.add(member, guild), newChannel);
                        }
                    } else if(oldChannel) {
                        /**
                        * Fired when a guild member leaves a voice channel. This event is not fired when a member switches voice channels, see `voiceChannelSwitch`
                        * @event Client#voiceChannelLeave
                        * @prop {Member} member The member
                        * @prop {GuildChannel} oldChannel The voice channel
                        */
                        this.client.emit("voiceChannelLeave", oldChannel.voiceMembers.remove(member), oldChannel);
                    }
                }
                if(oldState.mute !== member.mute || oldState.deaf !== member.deaf || oldState.selfMute !== member.selfMute || oldState.selfDeaf !== member.selfDeaf) {
                    /**
                    * Fired when a guild member's voice state changes
                    * @event Client#voiceStateUpdate
                    * @prop {Member} member The member
                    * @prop {Object} oldState The old voice state
                    * @prop {Boolean} oldState.mute The previous server mute status
                    * @prop {Boolean} oldState.deaf The previous server deaf status
                    * @prop {Boolean} oldState.selfMute The previous self mute status
                    * @prop {Boolean} oldState.selfDeaf The previous self deaf status
                    */
                    this.client.emit("voiceStateUpdate", member, oldState);
                }
                break;
            }
            case "TYPING_START": {
                if(this.client.listeners("typingStart").length > 0) {
                    /**
                    * Fired when a user begins typing
                    * @event Client#typingStart
                    * @prop {Channel} channel The text channel the user is typing in
                    * @prop {User} user The user
                    */
                    this.client.emit("typingStart", this.client.getChannel(packet.d.channel_id), this.client.users.get(packet.d.user_id));
                }
                break;
            }
            case "MESSAGE_CREATE": {
                var channel = this.client.getChannel(packet.d.channel_id);
                if(channel) { // MESSAGE_CREATE just when deleting o.o
                    channel.lastMessageID = packet.d.id;
                    /**
                    * Fired when a message is created
                    * @event Client#messageCreate
                    * @prop {Message} message The message
                    */
                    this.client.emit("messageCreate", channel.messages.add(packet.d, this.client));
                } else {
                    this.client.emit("debug", "MESSAGE_CREATE but channel not found (OK if deleted channel)", this.id);
                }
                break;
            }
            case "MESSAGE_UPDATE": {
                var channel = this.client.getChannel(packet.d.channel_id);
                if(!channel) {
                    break;
                }
                var message = channel.messages.get(packet.d.id);
                var oldMessage = {
                    id: packet.d.id
                };
                if(message) {
                    oldMessage = {
                        attachments: message.attachments,
                        content: message.content,
                        embeds: message.embeds,
                        editedTimestamp: message.editedTimestamp,
                        mentionedBy: message.mentionedBy,
                        mentions: message.mentions,
                        roleMentions: message.roleMentions,
                        channelMentions: message.channelMentions,
                        tts: message.tts
                    };
                }
                /**
                * Fired when a message is updated
                * @event Client#messageUpdate
                * @prop {Message} message The updated message. If oldMessage was undefined, it is not recommended to use this since it will be very incomplete
                * @prop {Object?} oldMessage The old message data, if the message was cached
                * @prop {Object[]} oldMessage.id The ID of the message
                * @prop {Object[]?} oldMessage.attachments Array of attachments
                * @prop {Object[]?} oldMessage.embeds Array of embeds
                * @prop {String?} oldMessage.content Message content
                * @prop {Number?} oldMessage.editedTimestamp Timestamp of latest message edit
                * @prop {Object?} oldMessage.mentionedBy Object of if different things mention the bot user
                * @prop {Boolean?} oldMessage.tts Whether to play the message using TTS or not
                * @prop {String[]?} oldMessage.mentions Array of mentioned users' ids
                * @prop {String[]?} oldMessage.roleMentions Array of mentioned roles' ids.
                * @prop {String[]?} oldMessage.channelMentions Array of mentions channels' ids.
                */
                this.client.emit("messageUpdate", channel.messages.update(packet.d, this.client), oldMessage);
                break;
            }
            case "MESSAGE_DELETE": {
                var channel = this.client.getChannel(packet.d.channel_id);
                if(!channel) {
                    break;
                }
                /**
                * Fired when a cached message is deleted
                * @event Client#messageDelete
                * @prop {Message | Object} message The message object. If the message is not cached, this will be an object with `id` and `channel` keys. No other property is guaranteed
                */
                this.client.emit("messageDelete", channel.messages.remove(packet.d) || {
                    id: packet.d.id,
                    channel: channel
                });
                break;
            }
            case "MESSAGE_DELETE_BULK": {
                var channel = this.client.getChannel(packet.d.channel_id);
                if(!channel) {
                    break;
                }

                /**
                 * Fired when a bulk delete occurs
                 * @event Client#messageDeleteBulk
                * @prop {Message[] | Object[]} messages An array of (potentially partial) message objects. If a message is not cached, it will be an object with `id` and `channel` keys. No other property is guaranteed
                 */
                this.client.emit("messageDeleteBulk", packet.d.ids.map((id) => (channel.messages.remove({
                    id
                }) || {
                    id: id,
                    channel: channel
                })));
                break;
            }
            case "MESSAGE_REACTION_ADD": {
                var channel = this.client.getChannel(packet.d.channel_id);
                if(!channel) {
                    break;
                }
                var message = channel.messages.get(packet.d.message_id);
                if(message) {
                    var reaction = packet.d.emoji.id ? `${packet.d.emoji.name}:${packet.d.emoji.id}` : packet.d.emoji.name;
                    if(message.reactions[reaction]) {
                        ++message.reactions[reaction].count;
                        if(packet.d.user_id === this.client.user.id) {
                            message.reactions[reaction].me = true;
                        }
                    } else {
                        message.reactions[reaction] = {
                            count: 1,
                            me: packet.d.user_id === this.client.user.id
                        };
                    }
                }
                /**
                * Fired when someone adds a reaction to a message
                * @event Client#messageReactionAdd
                * @prop {Message | Object} message The message object. If the message is not cached, this will be an object with `id` and `channel` keys. No other property is guaranteed
                * @prop {Object} emoji The reaction emoji object
                * @prop {String?} emoji.id The emoji ID (null for non-custom emojis)
                * @prop {String} emoji.name The emoji name
                * @prop {String} userID The ID of the user that added the reaction
                */
                this.client.emit("messageReactionAdd", message || {
                    id: packet.d.message_id,
                    channel: channel
                }, packet.d.emoji, packet.d.user_id);
                break;
            }
            case "MESSAGE_REACTION_REMOVE": {
                var channel = this.client.getChannel(packet.d.channel_id);
                if(!channel) {
                    break;
                }
                var message = channel.messages.get(packet.d.message_id);
                if(message) {
                    var reaction = packet.d.emoji.id ? `${packet.d.emoji.name}:${packet.d.emoji.id}` : packet.d.emoji.name;
                    if(message.reactions[reaction]) {
                        --message.reactions[reaction].count;
                        if(packet.d.user_id === this.client.user.id) {
                            message.reactions[reaction].me = false;
                        }
                    }
                }
                /**
                * Fired when someone removes a reaction from a message
                * @event Client#messageReactionRemove
                * @prop {Message | Object} message The message object. If the message is not cached, this will be an object with `id` and `channel` keys. No other property is guaranteed
                * @prop {Object} emoji The reaction emoji object
                * @prop {String?} emoji.id The ID of the emoji (null for non-custom emojis)
                * @prop {String} emoji.name The emoji name
                * @prop {String} userID The ID of the user that removed the reaction
                */
                this.client.emit("messageReactionRemove", message || {
                    id: packet.d.message_id,
                    channel: channel
                }, packet.d.emoji, packet.d.user_id);
                break;
            }
            case "MESSAGE_REACTIONS_REMOVE_ALL": {
                var channel = this.client.getChannel(packet.d.channel_id);
                if(!channel) {
                    break;
                }
                /**
                * Fired when someone removes a reaction from a message
                * @event Client#messageReactionRemove
                * @prop {Message | Object} message The message object. If the message is not cached, this will be an object with `id` and `channel` keys. No other property is guaranteed
                * @prop {Object} emoji The reaction emoji object
                * @prop {String?} emoji.id The ID of the emoji (null for non-custom emojis)
                * @prop {String} emoji.name The emoji name
                * @prop {String} userID The ID of the user that removed the reaction
                */
                this.client.emit("messageReactionRemoveAll", channel.messages.get(packet.d.message_id) || {
                    id: packet.d.message_id,
                    channel: channel
                });
                break;
            }
            case "GUILD_MEMBER_ADD": {
                var guild = this.client.guilds.get(packet.d.guild_id);
                packet.d.id = packet.d.user.id;
                ++guild.memberCount;
                /**
                * Fired when a member joins a server
                * @event Client#guildMemberAdd
                * @prop {Guild} guild The guild
                * @prop {Member} member The member
                */
                this.client.emit("guildMemberAdd", guild, guild.members.add(packet.d, guild));
                break;
            }
            case "GUILD_MEMBER_UPDATE": {
                var guild = this.client.guilds.get(packet.d.guild_id);
                var member = guild.members.get(packet.d.id = packet.d.user.id);
                var oldMember = null;
                if(member) {
                    oldMember = {
                        roles: member.roles,
                        nick: member.nick
                    };
                }
                member = guild.members.update(packet.d, guild);
                /**
                * Fired when a member's roles or nickname are updated
                * @event Client#guildMemberUpdate
                * @prop {Guild} guild The guild
                * @prop {Member} member The updated member
                * @prop {Object?} oldMember The old member data
                * @prop {String[]} oldMember.roles An array of role IDs this member is a part of
                * @prop {String?} oldMember.nick The server nickname of the member
                */
                this.client.emit("guildMemberUpdate", guild, member, oldMember);
                break;
            }
            case "GUILD_MEMBER_REMOVE": {
                if(packet.d.user.id === this.client.user.id) { // The bot is probably leaving
                    break;
                }
                var guild = this.client.guilds.get(packet.d.guild_id);
                --guild.memberCount;
                packet.d.id = packet.d.user.id;
                /**
                * Fired when a member leaves a server
                * @event Client#guildMemberRemove
                * @prop {Guild} guild The guild
                * @prop {Member | Object} member The member. If the member is not cached, this will be an object with `id` and `user` key
                */
                this.client.emit("guildMemberRemove", guild, guild.members.remove(packet.d) || {
                    id: packet.d.id,
                    user: new User(packet.d.user)
                });
                break;
            }
            case "GUILD_CREATE": {
                if(!packet.d.unavailable) {
                    var guild = this.createGuild(packet.d);
                    if(this.ready) {
                        if(this.client.unavailableGuilds.remove(packet.d)) {
                            /**
                            * Fired when an guild becomes available
                            * @event Client#guildAvailable
                            * @prop {Guild} guild The guild
                            */
                            this.client.emit("guildAvailable", guild);
                        } else {
                            /**
                            * Fired when an guild is created
                            * @event Client#guildCreate
                            * @prop {Guild} guild The guild
                            */
                            this.client.emit("guildCreate", guild);
                        }
                    } else {
                        this.client.unavailableGuilds.remove(packet.d);
                        this.restartGuildCreateTimeout();
                    }
                } else {
                    this.client.guilds.remove(packet.d);
                    /**
                    * Fired when an unavailable guild is created
                    * @event Client#unavailableGuildCreate
                    * @prop {UnavailableGuild} guild The unavailable guild
                    */
                    this.client.emit("unavailableGuildCreate", this.client.unavailableGuilds.add(packet.d, this.client));
                }
                break;
            }
            case "GUILD_UPDATE": {
                var guild = this.client.guilds.get(packet.d.id);
                var oldGuild = null;
                oldGuild = {
                    name: guild.name,
                    verificationLevel: guild.verification_level,
                    splash: guild.splash,
                    region: guild.region,
                    ownerID: guild.owner_id,
                    icon: guild.icon,
                    features: guild.features,
                    emojis: guild.emojis,
                    afkChannelID: guild.afk_channel_id,
                    afkTimeout: guild.afk_timeout
                };
                /**
                * Fired when an guild is updated
                * @event Client#guildUpdate
                * @prop {Guild} guild The guild
                * @prop {Object} oldGuild The old guild data
                * @prop {String} oldGuild.name The name of the guild
                * @prop {Number} oldGuild.verificationLevel The guild verification level
                * @prop {String} oldGuild.region The region of the guild
                * @prop {String?} oldGuild.icon The hash of the guild icon, or null if no icon
                * @prop {String} oldGuild.afkChannelID The ID of the AFK voice channel
                * @prop {Number} oldGuild.afkTimeout The AFK timeout in seconds
                * @prop {String} oldGuild.ownerID The ID of the user that is the guild owner
                * @prop {String?} oldGuild.splash The hash of the guild splash image, or null if no splash (VIP only)
                * @prop {Object[]} oldGuild.features An array of guild features
                * @prop {Object[]} oldGuild.emojis An array of guild emojis
                */
                this.client.emit("guildUpdate", this.client.guilds.update(packet.d, this.client), oldGuild);
                break;
            }
            case "GUILD_DELETE": {
                delete this.client.guildShardMap[packet.d.id];
                var guild = this.client.guilds.remove(packet.d);
                if(guild) { // Discord sends GUILD_DELETE for guilds that were previously unavailable in READY
                    guild.channels.forEach((channel) => {
                        delete this.client.channelGuildMap[channel.id];
                    });
                }
                if(packet.d.unavailable) {
                    /**
                    * Fired when an guild becomes unavailable
                    * @event Client#guildUnavailable
                    * @prop {Guild} guild The guild
                    */
                    this.client.emit("guildUnavailable", this.client.unavailableGuilds.add(packet.d, this.client));
                } else {
                    /**
                    * Fired when an guild is deleted
                    * @event Client#guildDelete
                    * @prop {Guild} guild The guild
                    */
                    this.client.emit("guildDelete", guild || {
                        id: packet.d.id
                    });
                }
                break;
            }
            case "GUILD_BAN_ADD": {
                /**
                * Fired when a user is banned from a guild
                * @event Client#guildBanAdd
                * @prop {Guild} guild The guild
                * @prop {User} user The banned user
                */
                this.client.emit("guildBanAdd", this.client.guilds.get(packet.d.guild_id), this.client.users.add(packet.d.user, this.client));
                break;
            }
            case "GUILD_BAN_REMOVE": {
                /**
                * Fired when a user is unbanned from a guild
                * @event Client#guildBanRemove
                * @prop {Guild} guild The guild
                * @prop {User} user The banned user
                */
                this.client.emit("guildBanRemove", this.client.guilds.get(packet.d.guild_id), this.client.users.add(packet.d.user, this.client));
                break;
            }
            case "GUILD_ROLE_CREATE": {
                /**
                * Fired when a guild role is created
                * @event Client#guildRoleCreate
                * @prop {Guild} guild The guild
                * @prop {Role} role The role
                */
                var guild = this.client.guilds.get(packet.d.guild_id);
                this.client.emit("guildRoleCreate", guild, guild.roles.add(packet.d.role, guild));
                break;
            }
            case "GUILD_ROLE_UPDATE": {
                var guild = this.client.guilds.get(packet.d.guild_id);
                var role = guild.roles.add(packet.d.role, guild);
                var oldRole = null;
                if(role) {
                    oldRole = {
                        color: role.color,
                        hoist: role.hoist,
                        managed: role.managed,
                        name: role.name,
                        permissions: role.permissions,
                        position: role.position
                    };
                }
                /**
                * Fired when a guild role is updated
                * @event Client#guildRoleUpdate
                * @prop {Guild} guild The guild
                * @prop {Role} role The updated role
                * @prop {Object} oldRole The old role data
                * @prop {String} oldRole.name The name of the role
                * @prop {Boolean} oldRole.managed Whether a guild integration manages this role or not
                * @prop {Boolean} oldRole.hoist Whether users with this role are hoisted in the user list or not
                * @prop {Number} oldRole.color The hex color of the role in base 10
                * @prop {Number} oldRole.position The position of the role
                * @prop {Permission} oldRole.permissions The permissions number of the role
                */
                this.client.emit("guildRoleUpdate", guild, guild.roles.update(packet.d.role, guild), oldRole);
                break;
            }
            case "GUILD_ROLE_DELETE": {
                /**
                * Fired when a guild role is deleted
                * @event Client#guildRoleDelete
                * @prop {Guild} guild The guild
                * @prop {Role} role The role
                */
                var guild = this.client.guilds.get(packet.d.guild_id);
                if(guild) { // Eventual Consistency™ (╯°□°）╯︵ ┻━┻
                    this.client.emit("guildRoleDelete", guild, guild.roles.remove({id: packet.d.role_id}));
                }
                break;
            }
            case "CHANNEL_CREATE": {
                if(packet.d.type === undefined || packet.d.type === 1) {
                    if(this.id === 0) {
                        /**
                        * Fired when a channel is created
                        * @event Client#channelCreate
                        * @prop {Channel} channel The channel
                        */
                        this.client.privateChannelMap[packet.d.recipients[0].id] = packet.d.id;
                        this.client.emit("channelCreate", this.client.privateChannels.add(packet.d, this.client));
                    }
                } else if(packet.d.type === 0 || packet.d.type === 2) {
                    var guild = this.client.guilds.get(packet.d.guild_id);
                    if(!guild) {
                        break;
                    }
                    var channel = guild.channels.add(packet.d, guild);
                    this.client.channelGuildMap[packet.d.id] = packet.d.guild_id;
                    this.client.emit("channelCreate", channel);
                } else if(packet.d.type === 3) {
                    if(this.id === 0) {
                        this.client.emit("channelCreate", this.client.groupChannels.add(packet.d, this.client));
                    }
                } else {
                    this.emit("error", new Error("Unhandled CHANNEL_CREATE type: " + JSON.stringify(packet, null, 2)));
                }
                break;
            }
            case "CHANNEL_UPDATE": {
                var channel = this.client.getChannel(packet.d.id);
                if(!channel) {
                    return;
                }
                if(channel.type === 3) {
                    if(this.id !== 0) {
                        break;
                    }
                    var oldChannel = {
                        name: channel.name,
                        ownerID: channel.ownerID,
                        icon: channel.icon
                    };
                }
                if(channel.type === 0 || channel.type === 2) {
                    var oldChannel = {
                        name: channel.name,
                        topic: channel.topic,
                        position: channel.position,
                        bitrate: channel.bitrate,
                        permissionOverwrites: channel.permissionOverwrites
                    };
                }
                channel.update(packet.d);
                /**
                * Fired when a channel is updated
                * @event Client#channelUpdate
                * @prop {Channel} channel The updated channel
                * @prop {Object} oldChannel The old channel data
                * @prop {String} oldChannel.name The name of the channel
                * @prop {Number} oldChannel.position The position of the channel
                * @prop {String?} oldChannel.topic The topic of the channel (text channels only)
                * @prop {Number?} oldChannel.bitrate The bitrate of the channel (voice channels only)
                * @prop {Collection} oldChannel.permissionOverwrites Collection of PermissionOverwrites in this channel
                */
                this.client.emit("channelUpdate", channel, oldChannel);
                break;
            }
            case "CHANNEL_DELETE": {
                if(packet.d.type === 1 || packet.d.type === undefined) {
                    if(this.id === 0) {
                        var channel = this.client.privateChannels.remove(packet.d);
                        if(channel) {
                            delete this.client.privateChannelMap[channel.recipient.id];
                            /**
                            * Fired when a channel is deleted
                            * @event Client#channelDelete
                            * @prop {Channel} channel The channel
                            */
                            this.client.emit("channelDelete", channel);
                        }
                    }
                } else if(packet.d.type === 0 || packet.d.type === 2) {
                    delete this.client.channelGuildMap[packet.d.id];
                    var channel = this.client.guilds.get(packet.d.guild_id).channels.remove(packet.d);
                    if(!channel) {
                        return;
                    }
                    if(channel.type === 2) {
                        channel.voiceMembers.forEach((member) => {
                            this.client.emit("voiceChannelLeave", channel.voiceMembers.remove(member), channel);
                        });
                    }
                    this.client.emit("channelDelete", channel);
                } else if(packet.d.type === 3) {
                    if(this.id === 0) {
                        this.client.emit("channelDelete", this.client.groupChannels.remove(packet.d));
                    }
                } else {
                    this.emit("error", new Error("Unhandled CHANNEL_DELETE type: " + JSON.stringify(packet, null, 2)));
                }
                break;
            }
            case "CALL_CREATE": {
                packet.d.id = packet.d.message_id;
                var channel = this.client.getChannel(packet.d.channel_id);
                if(channel.call) {
                    channel.call.update(packet.d);
                } else {
                    channel.call = new Call(packet.d, channel);
                    var incrementedID = "";
                    var overflow = true;
                    var chunks = packet.d.id.match(/\d{1,9}/g).map((chunk) => parseInt(chunk));
                    for(var i = chunks.length - 1; i >= 0; --i) {
                        if(overflow) {
                            ++chunks[i];
                            overflow = false;
                        }
                        if(chunks[i] > 999999999) {
                            overflow = true;
                            incrementedID = "000000000" + incrementedID;
                        } else {
                            incrementedID = chunks[i] + incrementedID;
                        }
                    }
                    if(overflow) {
                        incrementedID = overflow + incrementedID;
                    }
                    this.client.getMessages(channel.id, 1, incrementedID);
                }
                /**
                * Fired when a call is created
                * @event Client#callCreate
                * @prop {Call} call The call
                */
                this.client.emit("callCreate", channel.call);
                break;
            }
            case "CALL_UPDATE": {
                var channel = this.client.getChannel(packet.d.channel_id);
                if(!channel.call) {
                    throw new Error("CALL_UPDATE but channel has no call");
                }
                var oldCall = {
                    participants: channel.call.participants,
                    ringing: channel.call.ringing,
                    region: channel.call.region,
                    endedTimestamp: channel.call.endedTimestamp,
                    unavailable: channel.call.unavailable,
                };
                /**
                * Fired when a call is updated
                * @event Client#callUpdate
                * @prop {Call} call The updated call
                * @prop {Object} oldCall The old call data
                * @prop {String[]} oldCall.participants The IDs of the call participants
                * @prop {Number?} oldCall.endedTimestamp The timestamp of the call end
                * @prop {String[]?} oldCall.ringing The IDs of people that were being rung
                * @prop {String?} oldCall.region The region of the call server
                * @prop {Boolean} oldCall.unavailable Whether the call was unavailable or not
                */
                this.client.emit("callUpdate", channel.call.update(packet.d), oldCall);
                break;
            }
            case "CALL_DELETE": {
                var channel = this.client.getChannel(packet.d.channel_id);
                if(!channel.call) {
                    throw new Error("CALL_DELETE but channel has no call");
                }
                channel.lastCall = channel.call;
                channel.call = null;
                /**
                * Fired when a call is deleted
                * @event Client#callDelete
                * @prop {Call} call The call
                */
                this.client.emit("callDelete", channel.lastCall);
                break;
            }
            case "CHANNEL_RECIPIENT_ADD": {
                var channel = this.client.groupChannels.get(packet.d.channel_id);
                    /**
                    * Fired when a user joins a group channel
                    * @event Client#channelRecipientAdd
                    * @prop {GroupChannel} channel The channel
                    * @prop {User} user The user
                    */
                this.client.emit("channelRecipientAdd", channel, channel.recipients.add(this.client.users.add(packet.d.user, this.client)));
                break;
            }
            case "CHANNEL_RECIPIENT_REMOVE": {
                var channel = this.client.groupChannels.get(packet.d.channel_id);
                    /**
                    * Fired when a user leaves a group channel
                    * @event Client#channelRecipientRemove
                    * @prop {GroupChannel} channel The channel
                    * @prop {User} user The user
                    */
                this.client.emit("channelRecipientRemove", channel, channel.recipients.remove(packet.d.user));
                break;
            }
            case "FRIEND_SUGGESTION_CREATE": {
                /**
                * Fired when a client receives a friend suggestion
                * @event Client#friendSuggestionCreate
                * @prop {User} user The suggested user
                * @prop {String[]} reasons Array of reasons why this suggestion was made
                * @prop {Number} reasons.type Type of reason?
                * @prop {String} reasons.platform_type Platform you share with the user
                * @prop {String} reasons.name Username of suggested user on that platform
                */
                this.client.emit("friendSuggestionCreate",new User(packet.d.suggested_user), packet.d.reasons);
                break;
            }
            case "FRIEND_SUGGESTION_DELETE": {
                /**
                * Fired when a client's friend suggestion is removed for any reason
                * @event Client#friendSuggestionDelete
                * @prop {User} user The suggested user
                */
                this.client.emit("friendSuggestionDelete", this.client.users.get(packet.d.suggested_user_id));
                break;
            }
            case "GUILD_MEMBERS_CHUNK": {
                var guild = this.client.guilds.get(packet.d.guild_id);
                if(this.getAllUsersCount.hasOwnProperty(guild.id)) {
                    if(this.getAllUsersCount[guild.id] <= 1) {
                        delete this.getAllUsersCount[guild.id];
                        this.checkReady();
                    } else {
                        --this.getAllUsersCount[guild.id];
                    }
                }

                /**
                 * Fired when Discord sends member chunks
                 * @event Client#guildMemberChunk
                 * @prop {Guild} guild The guild the chunked members are in
                 * @prop {Array<Member>} members The members in the chunk
                 */
                this.client.emit("guildMemberChunk", guild, packet.d.members.map((member) => {
                    member.id = member.user.id;
                    return guild.members.add(member, guild);
                }));

                this.lastHeartbeatAck = true;

                // debugStr = " | " + packet.d.members.length + " members | " + guild.id;

                break;
            }
            case "GUILD_SYNC": {// (╯°□°）╯︵ ┻━┻ thx Discord devs
                var guild = this.client.guilds.get(packet.d.id);
                for(var member of packet.d.members) {
                    member.id = member.user.id;
                    guild.members.add(member, guild);
                }
                for(var presence of packet.d.presences) {
                    if(!guild.members.get(presence.user.id)) {
                        var userData = this.client.users.get(presence.user.id);
                        if(userData) {
                            userData = `{username: ${userData.username}, id: ${userData.id}, discriminator: ${userData.discriminator}}`;
                        }
                        this.client.emit("debug", `Presence without member. ${presence.user.id}. In global user cache: ${userData}. ` + JSON.stringify(presence), this.id);
                        continue;
                    }
                    presence.id = presence.user.id;
                    guild.members.update(presence);
                }
                if(guild.pendingVoiceStates && guild.pendingVoiceStates.length > 0) {
                    for(var voiceState of guild.pendingVoiceStates) {
                        if(!guild.members.get(voiceState.user_id)) {
                            continue;
                        }
                        voiceState.id = voiceState.user_id;
                        var channel = guild.channels.get(voiceState.channel_id);
                        if(channel) {
                            channel.voiceMembers.add(guild.members.update(voiceState));
                            if(this.client.options.seedVoiceConnections && voiceState.id === this.client.user.id && !this.client.voiceConnections.get(channel.guild ? channel.guild.id : "call")) {
                                this.client.joinVoiceChannel(channel.id, false);
                            }
                        } else { // Phantom voice states from connected users in deleted channels (╯°□°）╯︵ ┻━┻
                            this.client.emit("warn", "Phantom voice state received but channel not found | Guild: " + guild.id + " | Channel: " + voiceState.channel_id);
                        }
                    }
                }
                guild.pendingVoiceStates = null;
                --this.unsyncedGuilds;
                this.checkReady();
                break;
            }
            case "RESUMED":
            case "READY": {
                this.connectAttempts = 0;
                this.reconnectInterval = 1000;

                this.connecting = false;
                this.status = "connected";
                this.presence.status = "online";
                this.client.shards._readyPacketCB();

                if(packet.t === "RESUMED") {
                    this.preReady = true;
                    this.ready = true;

                    /**
                    * Fired when a shard finishes resuming
                    * @event Shard#resume
                    * @prop {Number} id The ID of the shard
                    */
                    this.emit("resume");
                    break;
                }

                this.client.user = this.client.users.add(new ExtendedUser(packet.d.user, this.client), this.client);
                if(this.client.user.bot) {
                    this.client.bot = true;
                    if(!this.client.token.startsWith("Bot ")) {
                        this.client.token = "Bot " + this.client.token;
                    }
                } else {
                    this.client.bot = false;
                    this.client.userGuildSettings = packet.d.user_guild_settings;
                    this.client.userSettings = packet.d.user_settings;
                }

                if(packet.d._trace) {
                    this.discordServerTrace = packet.d._trace;
                }

                this.sessionID = packet.d.session_id;

                packet.d.guilds.forEach((guild) => {
                    if(guild.unavailable) {
                        this.client.guilds.remove(guild);
                        this.client.unavailableGuilds.add(guild, this.client, true);
                    } else {
                        this.client.unavailableGuilds.remove(this.createGuild(guild));
                    }
                });

                packet.d.private_channels.forEach((channel) => {
                    if(channel.type === undefined || channel.type === 1) {
                        this.client.privateChannelMap[channel.recipients[0].id] = channel.id;
                        this.client.privateChannels.add(channel, this.client, true);
                    } else if(channel.type === 3) {
                        this.client.groupChannels.add(channel, this.client, true);
                    } else {
                        this.emit("error", new Error("Unhandled READY private_channel type: " + JSON.stringify(channel, null, 2)));
                    }
                });

                if(packet.d.relationships) {
                    packet.d.relationships.forEach((relationship) => {
                        this.client.relationships.add(relationship, this.client, true);
                    });
                }

                if(packet.d.presences) {
                    packet.d.presences.forEach((presence) => {
                        if(this.client.relationships.get(presence.user.id)) { // Avoid DM channel presences which are also in here
                            presence.id = presence.user.id;
                            this.client.relationships.update(presence, null, true);
                        }
                    });
                }

                if(packet.d.notes) {
                    this.client.notes = packet.d.notes;
                }

                this.preReady = true;
                /**
                * Fired when a shard finishes processing the ready packet
                * @event Client#shardPreReady
                * @prop {Number} id The ID of the shard
                */
                this.client.emit("shardPreReady", this.id);

                if(this.client.unavailableGuilds.size > 0 && packet.d.guilds.length > 0) {
                    this.restartGuildCreateTimeout();
                } else {
                    this.checkReady();
                }

                // debugStr = " | " + packet.d.guilds.length + " guilds";

                break;
            }
            case "VOICE_SERVER_UPDATE": {
                packet.d.session_id = this.sessionID;
                packet.d.user_id = this.client.user.id;
                packet.d.shard = this;
                this.client.voiceConnections.voiceServerUpdate(packet.d);
                break;
            }
            case "USER_UPDATE": {
                this.client.users.update(packet.d, this.client);
                break;
            }
            case "RELATIONSHIP_ADD": {
                if(this.client.bot) {
                    break;
                }
                var relationship = this.client.relationships.get(packet.d.id);
                if(relationship) {
                    var oldRelationship = {
                        type: relationship.type
                    };
                    /**
                    * Fired when a relationship is updated
                    * @event Client#relationshipUpdate
                    * @prop {Relationship} relationship The relationship
                    * @prop {Object} oldRelationship The old relationship data
                    * @prop {Number} oldRelationship.type The old type of the relationship
                    */
                    this.client.emit("relationshipUpdate", this.client.relationships.update(packet.d), oldRelationship);
                } else {
                    /**
                    * Fired when a relationship is added
                    * @event Client#relationshipAdd
                    * @prop {Relationship} relationship The relationship
                    */
                    this.client.emit("relationshipAdd", this.client.relationships.add(packet.d, this.client));
                }
                break;
            }
            case "RELATIONSHIP_REMOVE": {
                if(this.client.bot) {
                    break;
                }
                /**
                * Fired when a relationship is removed
                * @event Client#relationshipRemove
                * @prop {Relationship} relationship The relationship
                */
                this.client.emit("relationshipRemove", this.client.relationships.remove(packet.d));
                break;
            }
            case "GUILD_EMOJIS_UPDATE": {
                var guild = this.client.guilds.get(packet.d.guild_id);
                var oldEmojis = guild.emojis;
                guild.update(packet.d);
                /**
                * Fired when a guild's emojis are updated
                * @event Client#guildEmojisUpdate
                * @prop {Guild} guild The guild
                * @prop {Array} emojis The updated emojis of the guild
                * @prop {Array} oldEmojis The old emojis of the guild
                */
                this.client.emit("guildEmojisUpdate", guild, guild.emojis, oldEmojis);
                break;
            }
            case "CHANNEL_PINS_UPDATE": {
                var channel = this.client.getChannel(packet.d.channel_id);
                if(!channel) {
                    this.client.emit("debug", `CHANNEL_PINS_UPDATE target channel ${packet.d.channel_id} not found`);
                    break;
                }
                var oldTimestamp = channel.lastPinTimestamp;
                channel.lastPinTimestamp = Date.parse(packet.d.timestamp);
                /**
                * Fired when a channel pin timestamp is updated
                * @event Client#channelPinUpdate
                * @prop {Channel} channel The channel
                * @prop {Number} timestamp The new timestamp
                * @prop {Number} oldTimestamp The old timestamp
                */
                this.client.emit("channelPinUpdate", channel, channel.lastPinTimestamp, oldTimestamp);
                break;
            }
            case "PRESENCES_REPLACE": {
                for(var presence of packet.d) {
                    var guild = this.client.guilds.get(presence.guild_id);
                    if(!guild) {
                        this.client.emit("warn", "Rogue presences replace: " + JSON.stringify(presence), this.id);
                        continue;
                    }
                    var member = guild.members.get(presence.user.id);
                    if(!member && presence.user.username) {
                        presence.id = presence.user.id;
                        member.update(presence);
                    }
                }
                break;
            }
            case "USER_NOTE_UPDATE": {
                if(packet.d.note) {
                    this.client.notes[packet.d.id] = packet.d.note;
                } else {
                    this.client.notes[packet.d.id];
                }
                break;
            }
            case "MESSAGE_ACK": // Ignore these
            case "GUILD_INTEGRATIONS_UPDATE":
            case "USER_SETTINGS_UPDATE":
            case "CHANNEL_PINS_ACK": {
                break;
            }
            default: {
                /**
                * Fired when the shard encounters an unknown packet
                * @event Client#unknown
                * @prop {Object} packet The unknown packet
                * @prop {Number} id The ID of the shard
                */
                this.client.emit("unknown", packet, this.id);
                break;
            }
        } /* eslint-enable no-redeclare */
        // this.client.emit("debug", packet.t + ": " + (Date.now() - startTime) + "ms" + debugStr, this.id);
    }

    syncGuild(guildID) {
        if(this.guildSyncQueueLength + 3 + guildID.length > 4081) { // 4096 - "{\"op\":12,\"d\":[]}".length + 1 for lazy comma offset
            this.requestGuildSync(this.guildSyncQueue);
            this.guildSyncQueue = [guildID];
            this.guildSyncQueueLength = 1 + guildID.length + 3;
        } else if(this.ready) {
            this.requestGuildSync([guildID]);
        } else {
            this.guildSyncQueue.push(guildID);
            this.guildSyncQueueLength += guildID.length + 3;
        }
    }

    requestGuildSync(guildID) {
        this.sendWS(OPCodes.SYNC_GUILD, guildID);
    }

    createGuild(_guild) {
        this.client.guildShardMap[_guild.id] = this.id;
        var guild = this.client.guilds.add(_guild, this.client, true);
        if(this.client.bot === false) {
            ++this.unsyncedGuilds;
            this.syncGuild(guild.id);
        }
        if(this.client.options.getAllUsers && guild.members.size < guild.memberCount) {
            guild.fetchAllMembers();
        }
        return guild;
    }

    restartGuildCreateTimeout() {
        if(this.guildCreateTimeout) {
            clearTimeout(this.guildCreateTimeout);
            this.guildCreateTimeout = null;
        }
        if(!this.ready) {
            if(this.client.unavailableGuilds.size === 0 && this.unsyncedGuilds === 0) {
                return this.checkReady();
            }
            this.guildCreateTimeout = setTimeout(() => {
                this.checkReady();
            }, this.client.options.guildCreateTimeout);
        }
    }

    getGuildMembers(guildID, chunkCount) {
        this.getAllUsersCount[guildID] = chunkCount;
        if(this.getAllUsersLength + 3 + guildID.length > 4048) { // 4096 - "{\"op\":8,\"d\":{\"guild_id\":[],\"query\":\"\",\"limit\":0}}".length + 1 for lazy comma offset
            this.requestGuildMembers(this.getAllUsersQueue);
            this.getAllUsersQueue = [guildID];
            this.getAllUsersLength = 1 + guildID.length + 3;
        } else if(this.ready) {
            this.requestGuildMembers([guildID]);
        } else {
            this.getAllUsersQueue.push(guildID);
            this.getAllUsersLength += guildID.length + 3;
        }
    }

    requestGuildMembers(guildID, query, limit) {
        this.sendWS(OPCodes.GET_GUILD_MEMBERS, {
            guild_id: guildID,
            query: query || "",
            limit: limit || 0
        });
    }

    checkReady() {
        if(!this.ready) {
            if(this.guildSyncQueue.length > 0) {
                this.requestGuildSync(this.guildSyncQueue);
                this.guildSyncQueue = [];
                this.guildSyncQueueLength = 1;
                return;
            }
            if(this.unsyncedGuilds > 0) {
                return;
            }
            if(this.getAllUsersQueue.length > 0) {
                this.requestGuildMembers(this.getAllUsersQueue);
                this.getAllUsersQueue = [];
                this.getAllUsersLength = 1;
                return;
            }
            if(Object.keys(this.getAllUsersCount).length === 0) {
                this.ready = true;
                /**
                * Fired when the shard turns ready
                * @event Shard#ready
                */
                this.emit("ready");
            }
        }
    }

    initializeWS() {
        this.status = "connecting";
        this.ws = new WebSocket(this.client.gatewayURL);
        this.ws.onopen = () => {
            if(!this.client.token) {
                return this.disconnect(null, new Error("Token not specified"));
            }
            this.status = "handshaking";
            /**
            * Fired when the shard establishes a connection
            * @event Client#connect
            * @prop {Number} id The ID of the shard
            */
            this.client.emit("connect", this.id);
            this.lastHeartbeatAck = true;
        };
        this.ws.onmessage = (m) => {
            try {
                var packet = this.parse(m);

                if(this.client.listeners("rawWS").length > 0) {
                    /**
                    * Fired when the shard receives a websocket packet
                    * @event Client#rawWS
                    * @prop {Object} packet The packet
                    * @prop {Number} id The ID of the shard
                    */
                    this.client.emit("rawWS", packet, this.id);
                }

                if(packet.s) {
                    if(packet.s > this.seq + 1 && this.ws) {
                        /**
                        * Fired to warn of something weird but non-breaking happening
                        * @event Client#warn
                        * @prop {String} message The warning message
                        * @prop {Number} id The ID of the shard
                        */
                        this.client.emit("warn", "Non-consecutive sequence, requesting resume", this.id);
                        this.seq = packet.s;
                        this.resume();
                    }
                    this.seq = packet.s;
                }

                switch(packet.op) {
                    case OPCodes.EVENT: {
                        if(!this.client.options.disableEvents[packet.t]) {
                            this.wsEvent(packet);
                        }
                        break;
                    }
                    case OPCodes.HEARTBEAT: {
                        this.heartbeat();
                        break;
                    }
                    case OPCodes.INVALID_SESSION: {
                        this.seq = 0;
                        this.sessionID = null;
                        this.client.emit("warn", "Invalid session, reidentifying!", this.id);
                        this.identify();
                        break;
                    }
                    case OPCodes.RECONNECT: {
                        this.disconnect({
                            reconnect: "auto"
                        });
                        break;
                    }
                    case OPCodes.HELLO: {
                        if(packet.d.heartbeat_interval > 0) {
                            if(this.heartbeatInterval) {
                                clearInterval(this.heartbeatInterval);
                            }
                            this.heartbeatInterval = setInterval(() => this.heartbeat(true), packet.d.heartbeat_interval);
                        }

                        this.discordServerTrace = packet.d._trace;
                        this.connecting = false;

                        if(this.sessionID) {
                            this.resume();
                        } else {
                            this.identify();
                        }
                        this.heartbeat();
                        break; /* eslint-enable no-unreachable */
                    }
                    case OPCodes.HEARTBEAT_ACK: {
                        this.lastHeartbeatAck = true;
                        this.lastHeartbeatReceived = new Date().getTime();
                        break;
                    }
                    default: {
                        this.client.emit("unknown", packet, this.id);
                        break;
                    }
                }
            } catch(err) {
                this.client.emit("error", err, this.id);
            }
        };
        this.ws.onerror = (event) => {
            this.client.emit("error", event, this.id);
        };
        this.ws.onclose = (event) => {
            var err = event.code === 1000 ? null : new Error(event.code + ": " + event.reason);
            if(event.code) {
                this.client.emit("warn", `${event.code === 1000 ? "Clean" : "Unclean"} WS close: ${event.code}: ${event.reason}`, this.id);
                if(event.code === 4001) {
                    err = new Error("Gateway received invalid OP code");
                } else if(event.code === 4002) {
                    err = new Error("Gateway received invalid message");
                } else if(event.code === 4003) {
                    err = new Error("Not authenticated");
                } else if(event.code === 4004) {
                    err = new Error("Authentication failed");
                } else if(event.code === 4005) {
                    err = new Error("Already authenticated");
                } else if(event.code === 4006 || event.code === 4009) {
                    this.sessionID = null;
                    err = new Error("Invalid session");
                } else if(event.code === 4007) {
                    err = new Error("Invalid sequence number: " + this.seq);
                    this.seq = 0;
                } else if(event.code === 4008) {
                    err = new Error("Gateway connection was ratelimited");
                } else if(event.code === 4010) {
                    err = new Error("Invalid shard key");
                } else if(event.code === 4011) {
                    err = new Error("Shard has too many guilds (>2500)");
                } else if(event.code === 1006) {
                    err = new Error("Connection reset by peer");
                } else if(!event.wasClean && event.reason) {
                    err = new Error(event.code + ": " + event.reason);
                }
            } else {
                this.client.emit("warn", event, this.id);
            }
            this.disconnect({
                reconnect: "auto"
            }, err);
        };

        setTimeout(() => {
            if(this.connecting) {
                this.disconnect({
                    reconnect: "auto"
                }, new Error("Connection timeout"));
            }
        }, this.client.options.connectionTimeout);
    }

    parse(message) {
        var data = message.data;
        if(Erlpack) {
            if(data instanceof ArrayBuffer) {
                data = new Buffer(data);
            }
            return Erlpack.unpack(data);
        } else {
            if(data instanceof ArrayBuffer) {
                data = Pako.inflate(data, {
                    to: "string"
                });
            } else if(data instanceof Buffer) {
                data = Zlib.inflateSync(data).toString();
            }
            return JSON.parse(data);
        }
    }

    heartbeat(normal) {
        if(normal && !this.lastHeartbeatAck) {
            return this.disconnect({
                reconnect: "auto"
            }, new Error("Server didn't acknowledge previous heartbeat, possible lost connection"));
        }
        this.lastHeartbeatAck = false;
        this.lastHeartbeatSent = new Date().getTime();
        this.sendWS(OPCodes.HEARTBEAT, this.seq, true);
    }

    sendWS(op, _data) {
        if(this.ws && this.ws.readyState === WebSocket.OPEN) {
            var i = 0;
            var waitFor = 1;
            var func = () => {
                if(++i >= waitFor && this.ws && this.ws.readyState === WebSocket.OPEN) {
                    var data = Erlpack ? Erlpack.pack({op: op, d: _data}) : JSON.stringify({op: op, d: _data});
                    this.ws.send(data);
                    this.client.emit("debug", JSON.stringify({op: op, d: _data}), this.id);
                }
            };
            if(op === OPCodes.STATUS_UPDATE) {
                ++waitFor;
                this.presenceUpdateBucket.queue(func);
            }
            this.globalBucket.queue(func);
        }
    }

    /**
    * Updates the bot's status on all guilds the shard is in
    * @arg {String} [status] Sets the bot's status, either "online", "idle", "dnd", or "invisible"
    * @arg {Object} [game] Sets the bot's active game, null to clear
    * @arg {String} game.name Sets the name of the bot's active game
    * @arg {Number} [game.type] The type of game. 0 is default, 1 is streaming (Twitch only)
    * @arg {String} [game.url] Sets the url of the shard's active game
    */
    editStatus(status, game) {
        if(game === undefined && typeof status === "object") {
            game = status;
            status = undefined;
        }
        if(status) {
            this.presence.status = status;
        }
        if(game !== undefined) {
            this.presence.game = game;
        }

        this.sendWS(OPCodes.STATUS_UPDATE, {
            afk: this.presence.status === "idle", // TODO: what's this AFK field?
            game: this.presence.game,
            since: this.presence.status === "idle" ? Date.now() : 0,
            status: this.presence.status
        });

        this.client.guilds.forEach((guild) => {
            if(guild.shard.id === this.id) {
                guild.members.get(this.client.user.id).update(this.presence);
            }
        });
    }
}

module.exports = Shard;
