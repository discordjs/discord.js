'use strict';

const { Error } = require('../../errors');
const { InteractionResponseTypes, InteractionTypes } = require('../../util/Constants');
const MessageFlags = require('../../util/MessageFlags');
const InteractionCollector = require('../InteractionCollector');
const MessagePayload = require('../MessagePayload');
const Modal = require('../Modal');

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
   * @property {MessageFlags} [flags] Which flags to set for the message.
   * Only `SUPPRESS_EMBEDS` and `EPHEMERAL` can be set.
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
   * Fetches a reply to this interaction.
   * @see Webhook#fetchMessage
   * @param {MessageResolvable|'@original'} [message='@original'] The response to fetch
   * @returns {Promise<Message|APIMessage>}
   * @example
   * // Fetch the initial reply to this interaction
   * interaction.fetchReply()
   *   .then(reply => console.log(`Replied with ${reply.content}`))
   *   .catch(console.error);
   */
  fetchReply(message = '@original') {
    return this.webhook.fetchMessage(message);
  }

  /**
   * Options that can be passed into {@link InteractionResponses#editReply}.
   * @typedef {WebhookEditMessageOptions} InteractionEditReplyOptions
   * @property {MessageResolvable|'@original'} [message='@original'] The response to edit
   */

  /**
   * Edits a reply to this interaction.
   * @see Webhook#editMessage
   * @param {string|MessagePayload|InteractionEditReplyOptions} options The new options for the message
   * @returns {Promise<Message|APIMessage>}
   * @example
   * // Edit the initial reply to this interaction
   * interaction.editReply('New content')
   *   .then(console.log)
   *   .catch(console.error);
   */
  async editReply(options) {
    if (!this.deferred && !this.replied) throw new Error('INTERACTION_NOT_REPLIED');
    const message = await this.webhook.editMessage(options.message ?? '@original', options);
    this.replied = true;
    return message;
  }

  /**
   * Deletes a reply to this interaction.
   * @see Webhook#deleteMessage
   * @param {MessageResolvable|'@original'} [message='@original'] The response to delete
   * @returns {Promise<void>}
   * @example
   * // Delete the initial reply to this interaction
   * interaction.deleteReply()
   *   .then(console.log)
   *   .catch(console.error);
   */
  async deleteReply(message = '@original') {
    await this.webhook.deleteMessage(message);
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

  /**
   * Shows a modal component
   * @param {Modal|ModalOptions} modal The modal to show
   * @returns {Promise<void>}
   */
  async showModal(modal) {
    if (this.deferred || this.replied) throw new Error('INTERACTION_ALREADY_REPLIED');

    const _modal = modal instanceof Modal ? modal : new Modal(modal);
    await this.client.api.interactions(this.id, this.token).callback.post({
      data: {
        type: InteractionResponseTypes.MODAL,
        data: _modal.toJSON(),
      },
    });
    this.replied = true;
  }

  /**
   * An object containing the same properties as CollectorOptions, but a few more:
   * @typedef {Object} AwaitModalSubmitOptions
   * @property {CollectorFilter} [filter] The filter applied to this collector
   * @property {number} time Time in milliseconds to wait for an interaction before rejecting
   */

  /**
   * Collects a single modal submit interaction that passes the filter.
   * The Promise will reject if the time expires.
   * @param {AwaitModalSubmitOptions} options Options to pass to the internal collector
   * @returns {Promise<ModalSubmitInteraction>}
   * @example
   * // Collect a modal submit interaction
   * const filter = (interaction) => interaction.customId === 'modal';
   * interaction.awaitModalSubmit({ filter, time: 15_000 })
   *   .then(interaction => console.log(`${interaction.customId} was submitted!`))
   *   .catch(console.error);
   */
  awaitModalSubmit(options) {
    if (typeof options.time !== 'number') throw new Error('INVALID_TYPE', 'time', 'number');
    const _options = { ...options, max: 1, interactionType: InteractionTypes.MODAL_SUBMIT };
    return new Promise((resolve, reject) => {
      const collector = new InteractionCollector(this.client, _options);
      collector.once('end', (interactions, reason) => {
        const interaction = interactions.first();
        if (interaction) resolve(interaction);
        else reject(new Error('INTERACTION_COLLECTOR_ERROR', reason));
      });
    });
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
      'showModal',
      'awaitModalSubmit',
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
