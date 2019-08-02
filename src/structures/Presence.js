'use strict';

const Util = require('../util/Util');
const ActivityFlags = require('../util/ActivityFlags');
const { ActivityTypes } = require('../util/Constants');

/**
 * Activity sent in a message.
 * @typedef {Object} MessageActivity
 * @property {string} [partyID] Id of the party represented in activity
 * @property {number} [type] Type of activity sent
 */

/**
 * The status of this presence:
 * * **`online`** - user is online
 * * **`idle`** - user is AFK
 * * **`offline`** - user is offline or invisible
 * * **`dnd`** - user is in Do Not Disturb
 * @typedef {string} PresenceStatus
 */

/**
 * The status of this presence:
 * * **`online`** - user is online
 * * **`idle`** - user is AFK
 * * **`dnd`** - user is in Do Not Disturb
 * @typedef {string} ClientPresenceStatus
 */

/**
 * Represents a user's presence.
 */
class Presence {
  /**
   * @param {Client} client The instantiating client
   * @param {Object} [data={}] The data for the presence
   */
  constructor(client, data = {}) {
    /**
     * The client that instantiated this
     * @name Presence#client
     * @type {Client}
     * @readonly
     */
    Object.defineProperty(this, 'client', { value: client });
    /**
     * The user ID of this presence
     * @type {Snowflake}
     */
    this.userID = data.user.id;

    /**
     * The guild of this presence
     * @type {?Guild}
     */
    this.guild = data.guild || null;

    this.patch(data);
  }

  /**
   * The user of this presence
   * @type {?User}
   * @readonly
   */
  get user() {
    return this.client.users.get(this.userID) || null;
  }

  /**
   * The member of this presence
   * @type {?GuildMember}
   * @readonly
   */
  get member() {
    return this.guild.members.get(this.userID) || null;
  }

  patch(data) {
    /**
     * The status of this presence
     * @type {PresenceStatus}
     */
    this.status = data.status || this.status || 'offline';

    const activity = data.game || data.activity;
    /**
     * The activity of this presence
     * @type {?Activity}
     */
    this.activity = activity ? new Activity(this, activity) : null;

    /**
     * The devices this presence is on
     * @type {?Object}
     * @property {?ClientPresenceStatus} web The current presence in the web application
     * @property {?ClientPresenceStatus} mobile The current presence in the mobile application
     * @property {?ClientPresenceStatus} desktop The current presence in the desktop application
     */
    this.clientStatus = data.client_status || null;

    return this;
  }

  _clone() {
    const clone = Object.assign(Object.create(this), this);
    if (this.activity) clone.activity = this.activity._clone();
    return clone;
  }

  /**
   * Whether this presence is equal to another.
   * @param {Presence} presence The presence to compare with
   * @returns {boolean}
   */
  equals(presence) {
    return this === presence || (
      presence &&
      this.status === presence.status &&
      this.activity ? this.activity.equals(presence.activity) : !presence.activity &&
        this.clientStatus.web === presence.clientStatus.web &&
        this.clientStatus.mobile === presence.clientStatus.mobile &&
        this.clientStatus.desktop === presence.clientStatus.desktop
    );
  }

  toJSON() {
    return Util.flatten(this);
  }
}

/**
 * Represents an activity that is part of a user's presence.
 */
class Activity {
  constructor(presence, data) {
    Object.defineProperty(this, 'presence', { value: presence });

    /**
     * The name of the activity being played
     * @type {string}
     */
    this.name = data.name;

    /**
     * The type of the activity status
     * @type {ActivityType}
     */
    this.type = ActivityTypes[data.type];

    /**
     * If the activity is being streamed, a link to the stream
     * @type {?string}
     */
    this.url = data.url || null;

    /**
     * Details about the activity
     * @type {?string}
     */
    this.details = data.details || null;

    /**
     * State of the activity
     * @type {?string}
     */
    this.state = data.state || null;

    /**
     * Application ID associated with this activity
     * @type {?Snowflake}
     */
    this.applicationID = data.application_id || null;

    /**
     * Timestamps for the activity
     * @type {?Object}
     * @prop {?Date} start When the activity started
     * @prop {?Date} end When the activity will end
     */
    this.timestamps = data.timestamps ? {
      start: data.timestamps.start ? new Date(Number(data.timestamps.start)) : null,
      end: data.timestamps.end ? new Date(Number(data.timestamps.end)) : null,
    } : null;

    /**
     * Party of the activity
     * @type {?Object}
     * @prop {?string} id ID of the party
     * @prop {number[]} size Size of the party as `[current, max]`
     */
    this.party = data.party || null;

    /**
     * Assets for rich presence
     * @type {?RichPresenceAssets}
     */
    this.assets = data.assets ? new RichPresenceAssets(this, data.assets) : null;

    this.syncID = data.sync_id;

    /**
     * Flags that describe the activity
     * @type {Readonly<ActivityFlags>}
     */
    this.flags = new ActivityFlags(data.flags).freeze();
  }

  /**
   * Whether this activity is equal to another activity.
   * @param {Activity} activity The activity to compare with
   * @returns {boolean}
   */
  equals(activity) {
    return this === activity || (
      activity &&
      this.name === activity.name &&
      this.type === activity.type &&
      this.url === activity.url
    );
  }

  /**
   * When concatenated with a string, this automatically returns the activities' name instead of the Activity object.
   * @returns {string}
   */
  toString() {
    return this.name;
  }

  _clone() {
    return Object.assign(Object.create(this), this);
  }
}

/**
 * Assets for a rich presence
 */
class RichPresenceAssets {
  constructor(activity, assets) {
    Object.defineProperty(this, 'activity', { value: activity });

    /**
     * Hover text for the large image
     * @type {?string}
     */
    this.largeText = assets.large_text || null;

    /**
     * Hover text for the small image
     * @type {?string}
     */
    this.smallText = assets.small_text || null;

    /**
     * ID of the large image asset
     * @type {?Snowflake}
     */
    this.largeImage = assets.large_image || null;

    /**
     * ID of the small image asset
     * @type {?Snowflake}
     */
    this.smallImage = assets.small_image || null;
  }

  /**
   * Gets the URL of the small image asset
   * @param {Object} [options] Options for the image url
   * @param {string} [options.format] Format of the image
   * @param {number} [options.size] Size of the image
   * @returns {?string} The small image URL
   */
  smallImageURL({ format, size } = {}) {
    if (!this.smallImage) return null;
    return this.activity.presence.client.rest.cdn
      .AppAsset(this.activity.applicationID, this.smallImage, { format, size });
  }

  /**
   * Gets the URL of the large image asset
   * @param {Object} [options] Options for the image url
   * @param {string} [options.format] Format of the image
   * @param {number} [options.size] Size of the image
   * @returns {?string} The large image URL
   */
  largeImageURL({ format, size } = {}) {
    if (!this.largeImage) return null;
    if (/^spotify:/.test(this.largeImage)) {
      return `https://i.scdn.co/image/${this.largeImage.slice(8)}`;
    }
    return this.activity.presence.client.rest.cdn
      .AppAsset(this.activity.applicationID, this.largeImage, { format, size });
  }
}

exports.Presence = Presence;
exports.Activity = Activity;
exports.RichPresenceAssets = RichPresenceAssets;
