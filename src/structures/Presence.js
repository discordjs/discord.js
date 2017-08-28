const Constants = require('../util/Constants');

/**
 * Represents a user's presence.
 */
class Presence {
  constructor(data = {}) {
    /**
     * The status of the presence:
     *
     * * **`online`** - user is online
     * * **`offline`** - user is offline or invisible
     * * **`idle`** - user is AFK
     * * **`dnd`** - user is in Do not Disturb
     * @type {string}
     */
    this.status = data.status || 'offline';

    /**
     * The activity that the user is doing
     * @type {?Activity}
     */
    this.activity = data.activity ? new Activity(data.activity) : null;
  }

  update(data) {
    this.status = data.status || this.status;
    this.activity = data.activity ? new Activity(data.activity) : null;
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
 * Represents the activity of a user's presence
 */
class Activity {
  constructor(data) {
    /**
     * The name of the activity is happening
     * @type {string}
     */
    this.name = data.name;

    /**
     * The type of the activity
     * @type {ActivityType}
     */
    this.type = Constants.ActivityTypes[data.type];

    /**
     * Contextual url for the activity
     * @type {?string}
     */
    this.url = data.url || null;
  }

  /**
   * Whether this activity is equal to another activity.
   * @param {Activity} activity The activity to compare.
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

exports.Presence = Presence;
exports.Activity = Activity;
