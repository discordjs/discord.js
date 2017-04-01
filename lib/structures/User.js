"use strict";

const Base = require("./Base");
const CDN_URL = require("../rest/Endpoints").CDN_URL;
const DefaultAvatarHashes = require("../Constants").DefaultAvatarHashes;
const Constants = require("../Constants");

/**
* Represents a user
* @prop {String} id The ID of the user
* @prop {Number} createdAt Timestamp of the user's creation
* @prop {String} mention A string that mentions the user
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
class User extends Base {
    constructor(data, client) {
        super(data.id);
        this._client = client;
        this.bot = !!data.bot;
        this.update(data);
    }

    update(data) {
        this.avatar = data.avatar !== undefined ? data.avatar : this.avatar;
        this.username = data.username !== undefined ? data.username : this.username;
        this.discriminator = data.discriminator !== undefined ? data.discriminator : this.discriminator;
    }

    get mention() {
        return `<@${this.id}>`;
    }

    get defaultAvatar() {
        return DefaultAvatarHashes[this.discriminator % DefaultAvatarHashes.length];
    }

    get defaultAvatarURL() {
        return `https://discordapp.com/assets/${this.defaultAvatar}.png`;
    }

    get staticAvatarURL(){
        return this.avatar ? `${CDN_URL}/avatars/${this.id}/${this.avatar}.${this._client.options.defaultImageFormat}?size=${this._client.options.defaultImageSize}` : this.defaultAvatarURL;
    }

    get avatarURL() {
        return this.avatar ? `${CDN_URL}/avatars/${this.id}/${this.avatar}.${this.avatar.startsWith("a_") ? "gif" : this._client.options.defaultImageFormat}?size=${this._client.options.defaultImageSize}` : this.defaultAvatarURL;
    }

    /**
    * Get the user's avatar with the given format and size
    * @arg {String} [format] The filetype of the avatar ("jpg", "png", "gif", or "webp")
    * @arg {Number} [size] The size of the avatar (128, 256, 512, 1024, 2048)
    */
    dynamicAvatarURL(format, size) {
        if(format === undefined || !~Constants.ImageFormats.indexOf(format.toLowerCase())) {
            format = this.avatar.startsWith("a_") ? "gif" : this._client.options.defaultImageFormat;
        }
        if(size === undefined || !~Constants.ImageSizes.indexOf(size)) {
            size = this._client.options.defaultImageSize;
        }
        return this.avatar ? `${CDN_URL}/avatars/${this.id}/${this.avatar}.${format}?size=${size}` : this.defaultAvatarURL;
    }

    /**
    * Get a DM channel with the user, or create one if it does not exist
    * @returns {Promise<PrivateChannel>}
    */
    getDMChannel() {
        return this._client.getDMChannel.call(this._client, this.id);
    }

    /**
    * Create a relationship with the user
    * @arg {Boolean} [block=false] If true, block the user. Otherwise, add the user as a friend
    * @returns {Promise}
    */
    addRelationship(block) {
        return this._client.addRelationship.call(this._client, this.id, block);
    }

    /**
    * Remove a relationship with the user
    * @returns {Promise}
    */
    removeRelationship() {
        return this._client.removeRelationship.call(this._client, this.id);
    }

    /**
    * Get profile data for the user (user accounts only)
    * @returns {Promise<Object>} The user's profile data.
    */
    getProfile() {
        return this._client.getUserProfile.call(this._client, this.id);
    }
}

module.exports = User;
