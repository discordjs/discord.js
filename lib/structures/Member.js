"use strict";

const Base = require("./Base");
const Permission = require("./Permission");
const Permissions = require("../Constants").Permissions;
const VoiceState = require("./VoiceState");

/**
* Represents a server member
* @prop {String} id The ID of the member
* @prop {String} mention A string that mentions the member
* @prop {Guild} guild The guild the member is in
* @prop {Number} joinedAt Timestamp of when the member joined the guild
* @prop {String} status The member's status. Either "online", "idle", or "offline"
* @prop {Object?} game The active game the member is playing
* @prop {String} game.name The name of the active game
* @prop {Number} game.type The type of the active game (0 is default, 1 is Twitch, 2 is YouTube)
* @prop {String?} game.url The url of the active game
* @prop {VoiceState} voiceState The voice state of the member
* @prop {String?} nick The server nickname of the member
* @prop {String[]} roles An array of role IDs this member is a part of
* @prop {User} user The user object of the member
* @prop {Permission} permission The guild-wide permissions of the member
* @prop {String} defaultAvatar The hash for the default avatar of a user if there is no avatar set
* @prop {Number} createdAt Timestamp of user creation
* @prop {Boolean} bot Whether the user is an OAuth bot or not
* @prop {String} username The username of the user
* @prop {String} discriminator The discriminator of the user
* @prop {String?} avatar The hash of the user's avatar, or null if no avatar
* @prop {String} defaultAvatarURL The URL of the user's default avatar
* @prop {String} avatarURL The URL of the user's avatar which can be either a JPG or GIF
* @prop {String} staticAvatarURL The URL of the user's avatar (always a JPG)
*/
class Member extends Base {
    constructor(data, guild) {
        super(data.id);
        if((this.guild = guild)) {
            this.user = guild.shard.client.users.get(data.id);
            if(!this.user && data.user) {
                this.user = guild.shard.client.users.add(data.user, guild.shard.client);
            }
            if(!this.user) {
                throw new Error("User associated with Member not found: " + data.id);
            }
        } else {
            this.user = null;
        }
        this.voiceState = new VoiceState(data);
        this.update(data);
    }

    update(data) {
        this.status = data.status !== undefined ? data.status : this.status || "offline";
        this.game = data.game !== undefined ? data.game : this.game || null;
        this.joinedAt = data.joined_at !== undefined ? Date.parse(data.joined_at) : this.joinedAt;

        if(data.mute !== undefined) {
            this.voiceState.update(data);
        }

        this.nick = data.nick !== undefined ? data.nick : this.nick || null;
        if(data.roles !== undefined) {
            this.roles = data.roles;
        }
    }

    get permission() {
        if(this.id === this.guild.ownerID) {
            return new Permission(Permissions.all);
        } else {
            var permissions = this.guild.roles.get(this.guild.id).permissions.allow;
            for(var role of this.roles) {
                role = this.guild.roles.get(role);
                if(!role) {
                    continue;
                }

                var perm = role.permissions.allow;
                if(perm & Permissions.administrator) {
                    permissions = Permissions.all;
                    break;
                } else {
                    permissions |= perm;
                }
            }
            return new Permission(permissions);
        }
    }

    get username() {
        return this.user.username;
    }

    get discriminator() {
        return this.user.discriminator;
    }

    get avatar() {
        return this.user.avatar;
    }

    get bot() {
        return this.user.bot;
    }

    get createdAt() {
        return this.user.createdAt;
    }

    get defaultAvatar() {
        return this.user.defaultAvatar;
    }

    get defaultAvatarURL() {
        return this.user.defaultAvatarURL;
    }

    get staticAvatarURL(){
        return this.user.staticAvatarURL;
    }

    get avatarURL() {
        return this.user.avatarURL;
    }

    get mention() {
        return `<@!${this.id}>`;
    }

    /**
    * Edit the guild member
    * @arg {Object} options The properties to edit
    * @arg {String[]} [options.roles] The array of role IDs the user should have
    * @arg {String} [options.nick] Set the user's server nickname, "" to remove
    * @arg {Boolean} [options.mute] Server mute the user
    * @arg {Boolean} [options.deaf] Server deafen the user
    * @arg {String} [options.channelID] The ID of the voice channel to move the user to (must be in voice)
    * @returns {Promise}
    */
    edit(options) {
        return this.guild.shard.client.editGuildMember.call(this.guild.shard.client, this.guild.id, this.id, options);
    }

    /**
    * Add a role to the guild member
    * @arg {String} roleID The ID of the role
    * @returns {Promise}
    */
    addRole(roleID) {
        return this.guild.shard.client.addGuildMemberRole.call(this.guild.shard.client, this.guild.id, this.id, roleID);
    }

    /**
    * Remve a role from the guild member
    * @arg {String} roleID The ID of the role
    * @returns {Promise}
    */
    removeRole(roleID) {
        return this.guild.shard.client.removeGuildMemberRole.call(this.guild.shard.client, this.guild.id, this.id, roleID);
    }

    /**
    * Kick the member from the guild
    * @returns {Promise}
    */
    kick() {
        return this.guild.shard.client.kickGuildMember.call(this.guild.shard.client, this.guild.id, this.id);
    }

    /**
    * Ban the user from the guild
    * @arg {Number} [deleteMessageDays=0] Number of days to delete messages for
    * @returns {Promise}
    */
    ban(deleteMessageDays) {
        return this.guild.shard.client.banGuildMember.call(this.guild.shard.client, this.guild.id, this.id, deleteMessageDays);
    }

    /**
    * Unban the user from the guild
    * @returns {Promise}
    */
    unban() {
        return this.guild.shard.client.unbanGuildMember.call(this.guild.shard.client, this.guild.id, this.id);
    }
}

module.exports = Member;
