'use strict';

const { Error } = require('../../errors');
const { InteractionResponseTypes } = require('../../util/Constants');
const MessageFlags = require('../../util/MessageFlags');
const APIMessage = require('../APIMessage');

/**
 * Interface for classes that support shared interaction response types.
 * @interface
 */
class InteractionResponses {
  /**
   * Options for deferring the reply to an {@link Interaction}.
   * @typedef {Object} InteractionDeferOptions
   * @property {boolean} [ephemeral] Whether the reply should be ephemeral
   */

  /**
   * Options for a reply to an {@link Interaction}.
   * @typedef {BaseMessageOptions} InteractionReplyOptions
   * @property {boolean} [ephemeral] Whether the reply should be ephemeral
   * @property {MessageEmbed[]|Object[]} [embeds] An array of embeds for the message
   */

  /**
   * Defers the reply to this interaction. Resolves to the sent Message if not ephemeral.
   * @param {InteractionDeferOptions} [options] Options for deferring the reply to this interaction
   * @returns {Promise<Message|void>}
   * @example
   * // Defer the reply to this interaction
   * interaction.defer()
   *   .then(console.log)
   *   .catch(console.error)
   * @example
   * // Defer to send an ephemeral reply later
   * interaction.defer({ ephemeral: true })
   *   .then(console.log)
   *   .catch(console.error);
   */
  async defer({ ephemeral } = {}) {
    if (this.deferred || this.replied) throw new Error('INTERACTION_ALREADY_REPLIED');
    await this.client.api.interactions(this.id, this.token).callback.post({
      data: {
        type: InteractionResponseTypes.DEFERRED_CHANNEL_MESSAGE_WITH_SOURCE,
        data: {
          flags: ephemeral ? MessageFlags.FLAGS.EPHEMERAL : undefined,
        },
      },
    });
    this.deferred = true;

    return ephemeral ? undefined : this.fetchReply();
  }

  /**
   * Creates a reply to this interaction. Resolves to the sent Message if not ephemeral.
   * @param {string|APIMessage|InteractionReplyOptions} options The options for the reply
   * @returns {Promise<Message|void>}
   * @example
   * // Reply to the interaction with an embed
   * const embed = new MessageEmbed().setDescription('Pong!');
   *
   * interaction.reply(embed)
   *   .then(console.log)
   *   .catch(console.error);
   * @example
   * // Create an ephemeral reply
   * interaction.reply({ content: 'Pong!', ephemeral: true })
   *   .then(console.log)
   *   .catch(console.error);
   */
  async reply(options) {
    if (this.deferred || this.replied) throw new Error('INTERACTION_ALREADY_REPLIED');

    let apiMessage;
    if (options instanceof APIMessage) apiMessage = options;
    else apiMessage = APIMessage.create(this, options);

    const { data, files } = await apiMessage.resolveData().resolveFiles();

    await this.client.api.interactions(this.id, this.token).callback.post({
      data: {
        type: InteractionResponseTypes.CHANNEL_MESSAGE_WITH_SOURCE,
        data,
      },
      files,
    });
    this.replied = true;

    return options.ephemeral ? undefined : this.fetchReply();
  }

  /**
   * Fetches the initial reply to this interaction.
   * @see Webhook#fetchMessage
   * @returns {Promise<Message|Object>}
   * @example
   * // Fetch the reply to this interaction
   * interaction.fetchReply()
   *   .then(reply => console.log(`Replied with ${reply.content}`))
   *   .catch(console.error);
   */
  fetchReply() {
    return this.webhook.fetchMessage('@original');
  }

  /**
   * Edits the initial reply to this interaction.
   * @see Webhook#editMessage
   * @param {string|APIMessage|WebhookEditMessageOptions} options The new options for the message
   * @returns {Promise<Message|Object>}
   * @example
   * // Edit the reply to this interaction
   * interaction.editReply('New content')
   *   .then(console.log)
   *   .catch(console.error);
   */
  editReply(options) {
    return this.webhook.editMessage('@original', options);
  }

  /**
   * Deletes the initial reply to this interaction.
   * @see Webhook#deleteMessage
   * @returns {Promise<void>}
   * @example
   * // Delete the reply to this interaction
   * interaction.deleteReply()
   *   .then(console.log)
   *   .catch(console.error);
   */
  async deleteReply() {
    await this.webhook.deleteMessage('@original');
  }

  /**
   * Send a follow-up message to this interaction.
   * @param {string|APIMessage|InteractionReplyOptions} options The options for the reply
   * @returns {Promise<Message|Object>}
   */
  followUp(options) {
    return this.webhook.send(options);
  }

  /**
   * Defers an update to the message to which the component was attached.
   * Resolves to that message, if it was not ephemeral.
   * @returns {Promise<Message|void>}
   * @example
   * // Defer updating and reset the component's loading state
   * interaction.deferUpdate()
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

    return (this.message.flags & MessageFlags.FLAGS.EPHEMERAL) === MessageFlags.FLAGS.EPHEMERAL
      ? undefined
      : this.fetchReply();
  }

  /**
   * Updates the original message whose button was pressed.
   * Resolves to that message, if it was not ephemeral.
   * @param {string|APIMessage|WebhookEditMessageOptions} options The options for the reply
   * @returns {Promise<Message|void>}
   * @example
   * // Remove the components from the message
   * interaction.update({
   *   content: "A button was clicked",
   *   components: []
   * })
   *   .then(console.log)
   *   .catch(console.error);
   */
  async update(options) {
    if (this.deferred || this.replied) throw new Error('INTERACTION_ALREADY_REPLIED');

    let apiMessage;
    if (options instanceof APIMessage) apiMessage = options;
    else apiMessage = APIMessage.create(this, options);

    const { data, files } = await apiMessage.resolveData().resolveFiles();

    await this.client.api.interactions(this.id, this.token).callback.post({
      data: {
        type: InteractionResponseTypes.UPDATE_MESSAGE,
        data,
      },
      files,
    });
    this.replied = true;

    return (this.message.flags & MessageFlags.FLAGS.EPHEMERAL) === MessageFlags.FLAGS.EPHEMERAL
      ? undefined
      : this.fetchReply();
  }

  static applyToClass(structure, ignore = []) {
    const props = ['defer', 'reply', 'fetchReply', 'editReply', 'deleteReply', 'followUp', 'deferUpdate', 'update'];
    for (const prop of props) {
      if (ignore.includes(prop)) continue;
      Object.defineProperty(
        structure.prototype,
        prop,
        Object.getOwnPropertyDescriptor(InteractionResponses.prototype, prop),
      );
    }
  }
}

module.exports = InteractionResponses;
