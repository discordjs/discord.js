const Constants = require('../util/Constants');

/**
 * Represents a user's presence.
 */
class Presence {
  constructor(client, data = {}) {
    Object.defineProperty(this, 'client', { value: client });
    this.patch(data);
  }

  patch(data) {
    /**
     * The status of the presence:
     *
     * * **`online`** - user is online
     * * **`offline`** - user is offline or invisible
     * * **`idle`** - user is AFK
     * * **`dnd`** - user is in Do Not Disturb
     * @type {string}
     */
    this.status = data.status || this.status;

    const activity = data.game || data.activity;
    /**
     * @type {?Activity}
     */
    this.activity = activity ? new Activity(this, activity) : null;
  }

  _clone() {
    const clone = Object.assign(Object.create(this), this);
    if (this.activity) clone.activity = this.activity._clone();
    return clone;
  }

  /**
   * Whether this presence is equal to another
   * @param {Presence} presence The presence to compare with
   * @returns {boolean}
   */
  equals(presence) {
    return this === presence || (
      presence &&
      this.status === presence.status &&
      this.activity ? this.activity.equals(presence.activity) : !presence.activity
    );
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
    this.type = Constants.ActivityTypes[data.type];

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
      start: data.timestamps.start ? new Date(data.timestamps.start) : null,
      end: data.timestamps.end ? new Date(data.timestamps.end) : null,
    } : null;

    /**
     * Party of the activity
     * @type {?Object}
     * @prop {?string} id ID of the party
     * @prop {Number[]} size Size of the party as `[current, max]`
     */
    this.party = data.party || null;

    /**
     * Assets for rich presence
     * @type {?RichPresenceAssets}
     */
    this.assets = data.assets ? new RichPresenceAssets(this, data.assets) : null;
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
     * Hover text for large image
     * @type {?string}
     */
    this.largeText = assets.large_text || null;

    /**
     * Hover text for small image
     * @type {?string}
     */
    this.smallText = assets.small_text || null;

    /**
     * ID of large image asset
     * @type {?string}
     */
    this.largeImage = assets.large_image || null;

    /**
     * ID of small image asset
     * @type {?string}
     */
    this.smallImage = assets.small_image || null;
  }

  /**
   * @param  {string} format Format of the image
   * @param  {number} size Size of the iamge
   * @returns {?string} small image url
   */
  smallImageURL({ format, size } = {}) {
    if (!this.smallImage) return null;
    return this.activity.presence.client.rest.cdn
      .AppAsset(this.activity.applicationID, this.smallImage, { format, size });
  }

  /**
   * @param  {string} format Format of the image
   * @param  {number} size Size of the iamge
   * @returns {?string} large image url
   */
  largeImageURL({ format, size } = {}) {
    if (!this.largeImage) return null;
    return this.activity.presence.client.rest.cdn
      .AppAsset(this.activity.applicationID, this.largeImage, { format, size });
  }
}

exports.Presence = Presence;
exports.Activity = Activity;
exports.RichPresenceAssets = RichPresenceAssets;
