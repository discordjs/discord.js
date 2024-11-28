'use strict';

const InteractionCallback = require('./InteractionCallback');
const InteractionCallbackResource = require('./InteractionCallbackResource');

/**
 * Represents an interaction's response
 */
class InteractionCallbackResponse {
  constructor(client, data) {
    /**
     * The client that instantiated this
     * @name InteractionCallbackResponse#client
     * @type {Client}
     * @readonly
     */
    Object.defineProperty(this, 'client', { value: client });

    /**
     * The interaction object associated with the interaction callback response
     * @type {InteractionCallback}
     */
    this.interaction = new InteractionCallback(client, data.interaction);

    /**
     * The resource that was created by the interaction response
     * @type {?InteractionCallbackResource}
     */
    this.resource = data.resource ? new InteractionCallbackResource(client, data.resource) : null;
  }
}

module.exports = InteractionCallbackResponse;
