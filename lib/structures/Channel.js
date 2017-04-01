"use strict";

const Base = require("./Base");

/**
* Represents a channel. You also probably want to look at GroupChannel, GuildChannel, and PrivateChannel
* @prop {String} id The ID of the channel
* @prop {Number} createdAt Timestamp of the channel's creation
*/
class Channel extends Base {
    constructor(data) {
        super(data.id);
        this.type = data.type;
    }

    /**
    * Send typing status in a text channel
    * @returns {Promise}
    */
    sendTyping() {
        return (this._client || this.guild.shard.client).sendChannelTyping.call((this._client || this.guild.shard.client), this.id);
    }

    /**
    * Get a previous message in a text channel
    * @arg {String} messageID The ID of the message
    * @returns {Promise<Message>}
    */
    getMessage(messageID) {
        return (this._client || this.guild.shard.client).getMessage.call((this._client || this.guild.shard.client), this.id, messageID);
    }

    /**
    * Get a previous message in a text channel
    * @arg {Number} [limit=50] The max number of messages to get
    * @arg {String} [before] Get messages before this message ID
    * @arg {String} [after] Get messages after this message ID
    * @arg {String} [around] Get messages around this message ID (does not work with limit > 100)
    * @returns {Promise<Message[]>}
    */
    getMessages(limit, before, after, around) {
        return (this._client || this.guild.shard.client).getMessages.call((this._client || this.guild.shard.client), this.id, limit, before, after, around);
    }

    /**
    * Get all the pins in a text channel
    * @returns {Promise<Message[]>}
    */
    getPins() {
        return (this._client || this.guild.shard.client).getPins.call((this._client || this.guild.shard.client), this.id);
    }

    /**
    * Create a message in a text channel
    * Note: If you want to DM someone, the user ID is **not** the DM channel ID. use Client.getDMChanne() to get the DM channel ID for a user
    * @arg {String | Object} content A string or object. If an object is passed:
    * @arg {String} content.content A content string
    * @arg {Boolean} [content.tts] Set the message TTS flag
    * @arg {Boolean} [content.disableEveryone] Whether to filter @everyone/@here or not (overrides default)
    * @arg {Object} [content.embed] An embed object. See [the official Discord API documentation entry](https://discordapp.com/developers/docs/resources/channel#embed-object) for object structure
    * @arg {Object} [file] A file object
    * @arg {String} file.file A buffer containing file data
    * @arg {String} file.name What to name the file
    * @returns {Promise<Message>}
    */
    createMessage(content, file) {
        return (this._client || this.guild.shard.client).createMessage.call((this._client || this.guild.shard.client), this.id, content, file);
    }

    /**
    * Edit a message
    * @arg {String} messageID The ID of the message
    * @arg {String | Array | Object} content A string, array of strings, or object. If an object is passed:
    * @arg {String} content.content A content string
    * @arg {Boolean} [content.disableEveryone] Whether to filter @everyone/@here or not (overrides default)
    * @arg {Object} [content.embed] An embed object. See [the official Discord API documentation entry](https://discordapp.com/developers/docs/resources/channel#embed-object) for object structure
    * @returns {Promise<Message>}
    */
    editMessage(messageID, content) {
        return (this._client || this.guild.shard.client).editMessage.call((this._client || this.guild.shard.client), this.id, messageID, content);
    }

    /**
    * Pin a message
    * @arg {String} messageID The ID of the message
    * @returns {Promise}
    */
    pinMessage(messageID) {
        return (this._client || this.guild.shard.client).pinMessage.call((this._client || this.guild.shard.client), this.id, messageID);
    }

    /**
    * Unpin a message
    * @arg {String} messageID The ID of the message
    * @returns {Promise}
    */
    unpinMessage(messageID) {
        return (this._client || this.guild.shard.client).unpinMessage.call((this._client || this.guild.shard.client), this.id, messageID);
    }

    /**
    * Get a list of users who reacted with a specific reaction
    * @arg {String} messageID The ID of the message
    * @arg {String} reaction The reaction (Unicode string if Unicode emoji, `emojiName:emojiID` if custom emoji)
    * @arg {Number} [limit=100] The maximum number of users to get
    * @returns {Promise<User[]>}
    */
    getMessageReaction(messageID, reaction, limit) {
        return (this._client || this.guild.shard.client).getMessageReaction.call((this._client || this.guild.shard.client), this.id, messageID, reaction, limit);
    }

    /**
    * Add a reaction to a message
    * @arg {String} messageID The ID of the message
    * @arg {String} reaction The reaction (Unicode string if Unicode emoji, `emojiName:emojiID` if custom emoji)
    * @arg {String} [userID="@me"] The ID of the user to react as
    * @returns {Promise}
    */
    addMessageReaction(messageID, reaction, userID) {
        return (this._client || this.guild.shard.client).addMessageReaction.call((this._client || this.guild.shard.client), this.id, messageID, reaction, userID);
    }

    /**
    * Remove a reaction from a message
    * @arg {String} messageID The ID of the message
    * @arg {String} reaction The reaction (Unicode string if Unicode emoji, `emojiName:emojiID` if custom emoji)
    * @arg {String} [userID="@me"] The ID of the user to remove the reaction for
    * @returns {Promise}
    */
    removeMessageReaction(messageID, reaction, userID) {
        return (this._client || this.guild.shard.client).removeMessageReaction.call((this._client || this.guild.shard.client), this.id, messageID, reaction, userID);
    }

    /**
    * Remove all reactions from a message
    * @arg {String} messageID The ID of the message
    * @returns {Promise}
    */
    removeMessageReactions(messageID) {
        return (this._client || this.guild.shard.client).removeMessageReactions.call((this._client || this.guild.shard.client), this.id, messageID);
    }

    /**
    * Delete a message
    * @arg {String} messageID The ID of the message
    * @returns {Promise}
    */
    deleteMessage(messageID) {
        return (this._client || this.guild.shard.client).deleteMessage.call((this._client || this.guild.shard.client), this.id, messageID);
    }

    /**
    * Un-send a message. You're welcome Programmix
    * @arg {String} messageID The ID of the message
    * @returns {Promise}
    */
    unsendMessage(messageID) {
        return (this._client || this.guild.shard.client).deleteMessage.call((this._client || this.guild.shard.client), this.id, messageID);
    }

    /**
    * Bulk delete messages (bot accounts only)
    * @arg {String[]} messageIDs Array of message IDs to delete
    * @returns {Promise}
    */
    deleteMessages(messageIDs) {
        return (this._client || this.guild.shard.client).deleteMessages.call((this._client || this.guild.shard.client), this.id, messageIDs);
    }

    /**
    * Purge previous messages in the channel with an optional filter (bot accounts only)
    * @arg {Number} limit The max number of messages to search through, -1 for no limit
    * @arg {function} [filter] Optional filter function that returns a boolean when passed a Message object
    * @arg {String} [before] Get messages before this message ID
    * @arg {String} [after] Get messages after this message ID
    * @returns {Promise<Number>} Resolves with the number of messages deleted
    */
    purge(limit, filter, before, after) {
        return (this._client || this.guild.shard.client).purgeChannel.call((this._client || this.guild.shard.client), this.id, limit, filter, before, after);
    }
}

module.exports = Channel;
