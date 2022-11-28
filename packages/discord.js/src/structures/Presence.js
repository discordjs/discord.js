'use strict';

const Base = require('./Base');
const { Emoji } = require('./Emoji');
const ActivityFlagsBitField = require('../util/ActivityFlagsBitField');
const { flatten } = require('../util/Util');

/**
 * Activity sent in a message.
 * @typedef {Object} MessageActivity
 * @property {string} [partyId] Id of the party represented in activity
 * @property {MessageActivityType} type Type of activity sent
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
 * @extends {Base}
 */
class Presence extends Base {
  constructor(client, data = {}) {
    super(client);

    /**
     * The presence's user id
     * @type {Snowflake}
     */
    this.userId = data.user.id;

    /**
     * The guild this presence is in
     * @type {?Guild}
     */
    this.guild = data.guild ?? null;

    this._patch(data);
  }

  /**
   * The user of this presence
   * @type {?User}
   * @readonly
   */
  get user() {
    return this.client.users.resolve(this.userId);
  }

  /**
   * The member of this presence
   * @type {?GuildMember}
   * @readonly
   */
  get member() {
    return this.guild.members.resolve(this.userId);
  }

  _patch(data) {
    if ('status' in data) {
      /**
       * The status of this presence
       * @type {PresenceStatus}
       */
      this.status = data.status;
    } else {
      this.status ??= 'offline';
    }

    if ('activities' in data) {
      /**
       * The activities of this presence
       * @type {Activity[]}
       */
      this.activities = data.activities.map(activity => new Activity(this, activity));
    } else {
      this.activities ??= [];
    }

    if ('client_status' in data) {
      /**
       * The devices this presence is on
       * @type {?Object}
       * @property {?ClientPresenceStatus} web The current presence in the web application
       * @property {?ClientPresenceStatus} mobile The current presence in the mobile application
       * @property {?ClientPresenceStatus} desktop The current presence in the desktop application
       */
      this.clientStatus = data.client_status;
    } else {
      this.clientStatus ??= null;
    }

    return this;
  }

  _clone() {
    const clone = Object.assign(Object.create(this), this);
    clone.activities = this.activities.map(activity => activity._clone());
    return clone;
  }

  /**
   * Whether this presence is equal to another.
   * @param {Presence} presence The presence to compare with
   * @returns {boolean}
   */
  equals(presence) {
    return (
      this === presence ||
      (presence &&
        this.status === presence.status &&
        this.activities.length === presence.activities.length &&
        this.activities.every((activity, index) => activity.equals(presence.activities[index])) &&
        this.clientStatus?.web === presence.clientStatus?.web &&
        this.clientStatus?.mobile === presence.clientStatus?.mobile &&
        this.clientStatus?.desktop === presence.clientStatus?.desktop)
    );
  }

  toJSON() {
    return flatten(this);
  }
}

/**
 * Represents an activity that is part of a user's presence.
 */
class Activity {
  constructor(presence, data) {
    /**
     * The presence of the Activity
     * @type {Presence}
     * @readonly
     * @name Activity#presence
     */
    Object.defineProperty(this, 'presence', { value: presence });

    /**
     * The activity's name
     * @type {string}
     */
    this.name = data.name;

    /**
     * The activity status's type
     * @type {ActivityType}
     */
    this.type = data.type;

    /**
     * If the activity is being streamed, a link to the stream
     * @type {?string}
     */
    this.url = data.url ?? null;

    /**
     * Details about the activity
     * @type {?string}
     */
    this.details = data.details ?? null;

    /**
     * State of the activity
     * @type {?string}
     */
    this.state = data.state ?? null;

    /**
     * The id of the application associated with this activity
     * @type {?Snowflake}
     */
    this.applicationId = data.application_id ?? null;

    /**
     * Represents timestamps of an activity
     * @typedef {Object} ActivityTimestamps
     * @property {?Date} start When the activity started
     * @property {?Date} end When the activity will end
     */

    /**
     * Timestamps for the activity
     * @type {?ActivityTimestamps}
     */
    this.timestamps = data.timestamps
      ? {
          start: data.timestamps.start ? new Date(Number(data.timestamps.start)) : null,
          end: data.timestamps.end ? new Date(Number(data.timestamps.end)) : null,
        }
      : null;

    /**
     * Represents a party of an activity
     * @typedef {Object} ActivityParty
     * @property {?string} id The party's id
     * @property {number[]} size Size of the party as `[current, max]`
     */

    /**
     * Party of the activity
     * @type {?ActivityParty}
     */
    this.party = data.party ?? null;

    /**
     * Assets for rich presence
     * @type {?RichPresenceAssets}
     */
    this.assets = data.assets ? new RichPresenceAssets(this, data.assets) : null;

    /**
     * Flags that describe the activity
     * @type {Readonly<ActivityFlagsBitField>}
     */
    this.flags = new ActivityFlagsBitField(data.flags).freeze();

    /**
     * Emoji for a custom activity
     * @type {?Emoji}
     */
    this.emoji = data.emoji ? new Emoji(presence.client, data.emoji) : null;

    /**
     * The labels of the buttons of this rich presence
     * @type {string[]}
     */
    this.buttons = data.buttons ?? [];

    /**
     * Creation date of the activity
     * @type {number}
     */
    this.createdTimestamp = data.created_at;
  }

  /**
   * Whether this activity is equal to another activity.
   * @param {Activity} activity The activity to compare with
   * @returns {boolean}
   */
  equals(activity) {
    return (
      this === activity ||
      (activity &&
        this.name === activity.name &&
        this.type === activity.type &&
        this.url === activity.url &&
        this.state === activity.state &&
        this.details === activity.details)
    );
  }

  /**
   * The time the activity was created at
   * @type {Date}
   * @readonly
   */
  get createdAt() {
    return new Date(this.createdTimestamp);
  }

  /**
   * When concatenated with a string, this automatically returns the activity's name instead of the Activity object.
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
    /**
     * The activity of the RichPresenceAssets
     * @type {Activity}
     * @readonly
     * @name RichPresenceAssets#activity
     */
    Object.defineProperty(this, 'activity', { value: activity });

    /**
     * Hover text for the large image
     * @type {?string}
     */
    this.largeText = assets.large_text ?? null;

    /**
     * Hover text for the small image
     * @type {?string}
     */
    this.smallText = assets.small_text ?? null;

    /**
     * The large image asset's id
     * @type {?Snowflake}
     */
    this.largeImage = assets.large_image ?? null;

    /**
     * The small image asset's id
     * @type {?Snowflake}
     */
    this.smallImage = assets.small_image ?? null;
  }

  /**
   * Gets the URL of the small image asset
   * @param {ImageURLOptions} [options={}] Options for the image URL
   * @returns {?string}
   */
  smallImageURL(options = {}) {
    if (!this.smallImage) return null;
    if (this.smallImage.includes(':')) {
      const [platform, id] = this.smallImage.split(':');
      switch (platform) {
        case 'mp':
          return `https://media.discordapp.net/${id}`;
        default:
          return null;
      }
    }

    return this.activity.presence.client.rest.cdn.appAsset(this.activity.applicationId, this.smallImage, options);
  }

  /**
   * Gets the URL of the large image asset
   * @param {ImageURLOptions} [options={}] Options for the image URL
   * @returns {?string}
   */
  largeImageURL(options = {}) {
    if (!this.largeImage) return null;
    if (this.largeImage.includes(':')) {
      const [platform, id] = this.largeImage.split(':');
      switch (platform) {
        case 'mp':
          return `https://media.discordapp.net/${id}`;
        default:
          return null;
      }
    }

    return this.activity.presence.client.rest.cdn.appAsset(this.activity.applicationId, this.largeImage, options);
  }
}

exports.Presence = Presence;
exports.Activity = Activity;
exports.RichPresenceAssets = RichPresenceAssets;
