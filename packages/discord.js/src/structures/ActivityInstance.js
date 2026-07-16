'use strict';

const { ActivityLocation } = require('./ActivityLocation.js');
const { Base } = require('./Base.js');

/**
 * Represents an activity instance.
 *
 * @extends {Base}
 */
class ActivityInstance extends Base {
  constructor(client, data) {
    super(client);

    /**
     * The id of the application
     *
     * @type {Snowflake}
     */
    this.applicationId = data.application_id;

    /**
     * The activity instance id
     *
     * @type {string}
     */
    this.instanceId = data.instance_id;

    /**
     * The unique identifier for the launch
     *
     * @type {Snowflake}
     */
    this.launchId = data.launch_id;

    /**
     * The location the instance is running in
     *
     * @type {ActivityLocation}
     */
    this.location = new ActivityLocation(client, data.location);

    /**
     * The ids of the users connected to the instance
     *
     * @type {Snowflake[]}
     */
    this.users = data.users;
  }
}

exports.ActivityInstance = ActivityInstance;
