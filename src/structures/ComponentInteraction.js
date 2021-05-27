'use strict';

const APIMessage = require('./APIMessage');
const Interaction = require('./Interaction');
const InteractionResponses = require('./interfaces/InteractionResponses');
const WebhookClient = require('../client/WebhookClient');
const { Error } = require('../errors');
const { InteractionResponseTypes } = require('../util/Constants');

/**
 * Represents a message button interaction.
 * @extends {Interaction}
 */
class ComponentInteraction extends Interaction {
  // eslint-disable-next-line no-useless-constructor
  constructor(client, data) {
    super(client, data);

    /**
     * The message to which the button was attached
     * @type {?Message|Object}
     */
    this.message = data.message ? this.channel?.messages.add(data.message) ?? data.message : null;

    /**
     * The custom ID of the button which was clicked
     * @type {string}
     */
    this.customID = data.data.custom_id;

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
   * Defers an update to the message to which the button was attached
   * @returns {Promise<void>}
   * @example
   * // Defer to update the button to a loading state
   * interaction.defer()
   *   .then(console.log)
   *   .catch(console.error);
   */
  async deferUpdate() {
    if (this.deferred || this.replied) throw new Error('INTERACTION_ALREADY_REPLIED');
    await this.client.api.interactions(this.id, this.token).callback.post({
      data: {
        type: InteractionResponseTypes.DEFERRED_MESSAGE_UPDATE,
      },
    });
    this.deferred = true;
  }

  /**
   * Updates the message to which the button was attached
   * @param {string|APIMessage|MessageAdditions} content The content for the reply
   * @param {WebhookEditMessageOptions} [options] Additional options for the reply
   * @returns {Promise<void>}
   * @example
   * // Remove the buttons from the message   *
   * interaction.reply("A button was clicked", { components: [] })
   *   .then(console.log)
   *   .catch(console.error);
   */
  async update(content, options) {
    if (this.deferred || this.replied) throw new Error('INTERACTION_ALREADY_REPLIED');
    const apiMessage = content instanceof APIMessage ? content : APIMessage.create(this, content, options);
    const { data, files } = await apiMessage.resolveData().resolveFiles();

    await this.client.api.interactions(this.id, this.token).callback.post({
      data: {
        type: InteractionResponseTypes.UPDATE_MESSAGE,
        data,
      },
      files,
    });
    this.replied = true;
  }

  // These are here only for documentation purposes - they are implemented by InteractionResponses
  /* eslint-disable no-empty-function */
  defer() {}
  reply() {}
  fetchReply() {}
  editReply() {}
  deleteReply() {}
  followUp() {}
}

InteractionResponses.applyToClass(ComponentInteraction);

module.exports = ComponentInteraction;
