'use strict';

const Interaction = require('./Interaction');
const InteractionResponses = require('./interfaces/InteractionResponses');
const WebhookClient = require('../client/WebhookClient');
const { MessageComponentTypes } = require('../util/Constants');

/**
 * Represents a message component interaction.
 * @extends {Interaction}
 * @implements {InteractionResponses}
 */
class MessageComponentInteraction extends Interaction {
  constructor(client, data) {
    super(client, data);

    /**
     * The message to which the component was attached
     * @type {?Message|Object}
     */
    this.message = data.message ? this.channel?.messages.add(data.message) ?? data.message : null;

    /**
     * The custom ID of the component which was clicked
     * @type {string}
     */
    this.customID = data.data.custom_id;

    /**
     * The type of component that was interacted with
     * @type {string}
     */
    this.componentType = MessageComponentInteraction.resolveType(data.data.component_type);

    /**
     * Whether the reply to this interaction has been deferred
     * @type {boolean}
     */
    this.deferred = false;

    /**
     * Whether this interaction has already been replied to
     * @type {boolean}
     */
    this.replied = false;

    /**
     * An associated webhook client, can be used to create deferred replies
     * @type {WebhookClient}
     */
    this.webhook = new WebhookClient(this.applicationID, this.token, this.client.options);
  }

  /**
   * Resolves the type of a MessageComponent
   * @param {MessageComponentTypeResolvable} type The type to resolve
   * @returns {MessageComponentType}
   * @private
   */
  static resolveType(type) {
    return typeof type === 'string' ? type : MessageComponentTypes[type];
  }

  // These are here only for documentation purposes - they are implemented by InteractionResponses
  /* eslint-disable no-empty-function */
  defer() {}
  reply() {}
  fetchReply() {}
  editReply() {}
  deleteReply() {}
  followUp() {}
  deferUpdate() {}
  update() {}
}

InteractionResponses.applyToClass(MessageComponentInteraction);

module.exports = MessageComponentInteraction;
