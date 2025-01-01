'use strict';

const { lazy } = require('@discordjs/util');

const getMessage = lazy(() => require('./Message').Message);

/**
 * Represents the resource that was created by the interaction response.
 */
class InteractionCallbackResource {
  constructor(client, data) {
    /**
     * The client that instantiated this
     * @name InteractionCallbackResource#client
     * @type {Client}
     * @readonly
     */
    Object.defineProperty(this, 'client', { value: client });

    /**
     * The interaction callback type
     * @type {InteractionResponseType}
     */
    this.type = data.type;

    /**
     * The Activity launched by an interaction
     * @typedef {Object} ActivityInstance
     * @property {string} id The instance id of the Activity
     */

    /**
     * Represents the Activity launched by this interaction
     * @type {?ActivityInstance}
     */
    this.activityInstance = data.activity_instance ?? null;

    if ('message' in data) {
      /**
       * The message created by the interaction
       * @type {?Message}
       */
      this.message =
        this.client.channels.cache.get(data.message.channel_id)?.messages._add(data.message) ??
        new (getMessage())(client, data.message);
    } else {
      this.message = null;
    }
  }
}

module.exports = InteractionCallbackResource;
