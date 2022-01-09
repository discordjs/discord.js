'use strict';

const { Error } = require('../../errors');
const { InteractionResponseTypes } = require('../../util/Constants');
const MessageFlags = require('../../util/MessageFlags');
const MessagePayload = require('../MessagePayload');

/**
 * Interface for classes that support shared interaction response types.
 * @interface
 */
class InteractionResponses {
  /**
   * Options for deferring the reply to an {@link Interaction}.
   * @typedef {Object} InteractionDeferReplyOptions
   * @property {boolean} [ephemeral] Whether the reply should be ephemeral
   * @property {boolean} [fetchReply] Whether to fetch the reply
   */

  /**
   * Options for deferring and updating the reply to a {@link MessageComponentInteraction}.
   * @typedef {Object} InteractionDeferUpdateOptions
   * @property {boolean} [fetchReply] Whether to fetch the reply
   */

  /**
   * Options for a reply to an {@link Interaction}.
   * @typedef {BaseMessageOptions} InteractionReplyOptions
   * @property {boolean} [ephemeral] Whether the reply should be ephemeral
   * @property {boolean} [fetchReply] Whether to fetch the reply
   */

  /**
   * Options for updating the message received from a {@link MessageComponentInteraction}.
   * @typedef {MessageEditOptions} InteractionUpdateOptions
   * @property {boolean} [fetchReply] Whether to fetch the reply
   */

  /**
   * Defers the reply to this interaction.
   * @param {InteractionDeferReplyOptions} [options] Options for deferring the reply to this interaction
   * @returns {Promise<Message|APIMessage|void>}
   * @example
   * // Defer the reply to this interaction
   * interaction.deferReply()
   *   .then(console.log)
   *   .catch(console.error)
   * @example
   * // Defer to send an ephemeral reply later
   * interaction.deferReply({ ephemeral: true })
   *   .then(console.log)
   *   .catch(console.error);
   */
  async deferReply(options = {}) {
    if (this.deferred || this.replied) throw new Error('INTERACTION_ALREADY_REPLIED');
    this.ephemeral = options.ephemeral ?? false;
    await this.client.api.interactions(this.id, this.token).callback.post({
      data: {
        type: InteractionResponseTypes.DEFERRED_CHANNEL_MESSAGE_WITH_SOURCE,
        data: {
          flags: options.ephemeral ? MessageFlags.FLAGS.EPHEMERAL : undefined,
        },
      },
      auth: false,
    });
    this.deferred = true;

    return options.fetchReply ? this.fetchReply() : undefined;
  }

  /**
   * Creates a reply to this interaction.
   * <info>Use the `fetchReply` option to get the bot's reply message.</info>
   * @param {string|MessagePayload|InteractionReplyOptions} options The options for the reply
   * @returns {Promise<Message|APIMessage|void>}
   * @example
   * // Reply to the interaction and fetch the response
   * interaction.reply({ content: 'Pong!', fetchReply: true })
   *   .then((message) => console.log(`Reply sent with content ${message.content}`))
   *   .catch(console.error);
   * @example
   * // Create an ephemeral reply with an embed
   * const embed = new MessageEmbed().setDescription('Pong!');
   *
   * interaction.reply({ embeds: [embed], ephemeral: true })
   *   .then(() => console.log('Reply sent.'))
   *   .catch(console.error);
   */
  async reply(options) {
    if (this.deferred || this.replied) throw new Error('INTERACTION_ALREADY_REPLIED');
    this.ephemeral = options.ephemeral ?? false;

    let messagePayload;
    if (options instanceof MessagePayload) messagePayload = options;
    else messagePayload = MessagePayload.create(this, options);

    const { data, files } = await messagePayload.resolveData().resolveFiles();

    await this.client.api.interactions(this.id, this.token).callback.post({
      data: {
        type: InteractionResponseTypes.CHANNEL_MESSAGE_WITH_SOURCE,
        data,
      },
      files,
      auth: false,
    });
    this.replied = true;

    return options.fetchReply ? this.fetchReply() : undefined;
  }

  /**
   * Fetches the initial reply to this interaction.
   * @see Webhook#fetchMessage
   * @returns {Promise<Message|APIMessage>}
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
   * @param {string|MessagePayload|WebhookEditMessageOptions} options The new options for the message
   * @returns {Promise<Message|APIMessage>}
   * @example
   * // Edit the reply to this interaction
   * interaction.editReply('New content')
   *   .then(console.log)
   *   .catch(console.error);
   */
  async editReply(options) {
    if (!this.deferred && !this.replied) throw new Error('INTERACTION_NOT_REPLIED');
    const message = await this.webhook.editMessage('@original', options);
    this.replied = true;
    return message;
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
    if (this.ephemeral) throw new Error('INTERACTION_EPHEMERAL_REPLIED');
    await this.webhook.deleteMessage('@original');
  }

  /**
   * Send a follow-up message to this interaction.
   * @param {string|MessagePayload|InteractionReplyOptions} options The options for the reply
   * @returns {Promise<Message|APIMessage>}
   */
  followUp(options) {
    if (!this.deferred && !this.replied) return Promise.reject(new Error('INTERACTION_NOT_REPLIED'));
    return this.webhook.send(options);
  }

  /**
   * Defers an update to the message to which the component was attached.
   * @param {InteractionDeferUpdateOptions} [options] Options for deferring the update to this interaction
   * @returns {Promise<Message|APIMessage|void>}
   * @example
   * // Defer updating and reset the component's loading state
   * interaction.deferUpdate()
   *   .then(console.log)
   *   .catch(console.error);
   */
  async deferUpdate(options = {}) {
    if (this.deferred || this.replied) throw new Error('INTERACTION_ALREADY_REPLIED');
    await this.client.api.interactions(this.id, this.token).callback.post({
      data: {
        type: InteractionResponseTypes.DEFERRED_MESSAGE_UPDATE,
      },
      auth: false,
    });
    this.deferred = true;

    return options.fetchReply ? this.fetchReply() : undefined;
  }

  /**
   * Updates the original message of the component on which the interaction was received on.
   * @param {string|MessagePayload|InteractionUpdateOptions} options The options for the updated message
   * @returns {Promise<Message|APIMessage|void>}
   * @example
   * // Remove the components from the message
   * interaction.update({
   *   content: "A component interaction was received",
   *   components: []
   * })
   *   .then(console.log)
   *   .catch(console.error);
   */
  async update(options) {
    if (this.deferred || this.replied) throw new Error('INTERACTION_ALREADY_REPLIED');

    let messagePayload;
    if (options instanceof MessagePayload) messagePayload = options;
    else messagePayload = MessagePayload.create(this, options);

    const { data, files } = await messagePayload.resolveData().resolveFiles();

    await this.client.api.interactions(this.id, this.token).callback.post({
      data: {
        type: InteractionResponseTypes.UPDATE_MESSAGE,
        data,
      },
      files,
      auth: false,
    });
    this.replied = true;

    return options.fetchReply ? this.fetchReply() : undefined;
  }

  static applyToClass(structure, ignore = []) {
    const props = [
      'deferReply',
      'reply',
      'fetchReply',
      'editReply',
      'deleteReply',
      'followUp',
      'deferUpdate',
      'update',
    ];

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
