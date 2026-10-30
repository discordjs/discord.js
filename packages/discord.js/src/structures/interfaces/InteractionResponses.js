'use strict';

const { makeURLSearchParams } = require('@discordjs/rest');
const { isJSONEncodable } = require('@discordjs/util');
const { InteractionResponseType, MessageFlags, Routes, InteractionType } = require('discord-api-types/v10');
const { DiscordjsError, ErrorCodes } = require('../../errors/index.js');
const { MessageFlagsBitField } = require('../../util/MessageFlagsBitField.js');
const { InteractionCallbackResponse } = require('../InteractionCallbackResponse.js');
const { InteractionCollector } = require('../InteractionCollector.js');
const { MessagePayload } = require('../MessagePayload.js');

/**
 * Interface for classes that support shared interaction response types.
 *
 * @interface
 */
class InteractionResponses {
  /**
   * Options for deferring the reply to an {@link BaseInteraction}.
   *
   * @typedef {Object} InteractionDeferReplyOptions
   * @property {boolean} [withResponse] Whether to return an {@link InteractionCallbackResponse} as the response
   * @property {MessageFlagsResolvable} [flags] Flags for the reply.
   * <info>Only `MessageFlags.Ephemeral` can be set.</info>
   */

  /**
   * Options for deferring and updating the reply to a {@link MessageComponentInteraction}.
   *
   * @typedef {Object} InteractionDeferUpdateOptions
   * @property {boolean} [withResponse] Whether to return an {@link InteractionCallbackResponse} as the response
   */

  /**
   * Options for a reply to a {@link BaseInteraction}.
   *
   * @typedef {BaseMessageOptionsWithPoll} InteractionReplyOptions
   * @property {boolean} [tts=false] Whether the message should be spoken aloud
   * @property {boolean} [withResponse] Whether to return an {@link InteractionCallbackResponse} as the response
   * @property {MessageFlagsResolvable} [flags] Which flags to set for the message.
   * <info>Only {@link MessageFlags.Ephemeral}, {@link MessageFlags.SuppressEmbeds},
   * {@link MessageFlags.SuppressNotifications}, and {@link MessageFlags.IsVoiceMessage} can be set.</info>
   */

  /**
   * Options for updating the message received from a {@link MessageComponentInteraction}.
   *
   * @typedef {MessageEditOptions} InteractionUpdateOptions
   * @property {boolean} [withResponse] Whether to return an {@link InteractionCallbackResponse} as the response
   */

  /**
   * Options for launching activity in response to a {@link BaseInteraction}
   *
   * @typedef {Object} LaunchActivityOptions
   * @property {boolean} [withResponse] Whether to return an {@link InteractionCallbackResponse} as the response
   */

  /**
   * Options for showing a modal in response to a {@link BaseInteraction}
   *
   * @typedef {Object} ShowModalOptions
   * @property {boolean} [withResponse] Whether to return an {@link InteractionCallbackResponse} as the response
   */

  /**
   * Defers the reply to this interaction.
   *
   * @param {InteractionDeferReplyOptions} [options] Options for deferring the reply to this interaction
   * @returns {Promise<InteractionCallbackResponse|undefined>}
   * @example
   * // Defer the reply to this interaction
   * interaction.deferReply()
   *   .then(console.log)
   *   .catch(console.error)
   * @example
   * // Defer to send an ephemeral reply later
   * interaction.deferReply({ flags: MessageFlags.Ephemeral })
   *   .then(console.log)
   *   .catch(console.error);
   */
  async deferReply(options = {}) {
    if (this.deferred || this.replied) throw new DiscordjsError(ErrorCodes.InteractionAlreadyReplied);

    const resolvedFlags = new MessageFlagsBitField(options.flags);

    const response = await this.client.rest.post(Routes.interactionCallback(this.id, this.token), {
      body: {
        type: InteractionResponseType.DeferredChannelMessageWithSource,
        data: {
          flags: resolvedFlags.bitfield,
        },
      },
      auth: false,
      query: makeURLSearchParams({ with_response: options.withResponse ?? false }),
    });

    this.deferred = true;
    this.ephemeral = resolvedFlags.has(MessageFlags.Ephemeral);

    return options.withResponse ? new InteractionCallbackResponse(this.client, response) : undefined;
  }

  /**
   * Creates a reply to this interaction.
   * <info>Use the `withResponse` option to get the interaction callback response.</info>
   *
   * @param {string|MessagePayload|InteractionReplyOptions} options The options for the reply
   * @returns {Promise<InteractionCallbackResponse|undefined>}
   * @example
   * // Reply to the interaction and fetch the response
   * interaction.reply({ content: 'Pong!', withResponse: true })
   *   .then((response) => console.log(`Reply sent with content ${response.resource.message.content}`))
   *   .catch(console.error);
   * @example
   * // Create an ephemeral reply with an embed
   * const embed = new EmbedBuilder().setDescription('Pong!');
   *
   * interaction.reply({ embeds: [embed], flags: MessageFlags.Ephemeral })
   *   .then(() => console.log('Reply sent.'))
   *   .catch(console.error);
   */
  async reply(options) {
    if (this.deferred || this.replied) throw new DiscordjsError(ErrorCodes.InteractionAlreadyReplied);

    let messagePayload;
    if (options instanceof MessagePayload) messagePayload = options;
    else messagePayload = MessagePayload.create(this, options);

    const { body: data, files } = await messagePayload.resolveBody().resolveFiles();

    const response = await this.client.rest.post(Routes.interactionCallback(this.id, this.token), {
      body: {
        type: InteractionResponseType.ChannelMessageWithSource,
        data,
      },
      files,
      auth: false,
      query: makeURLSearchParams({ with_response: options.withResponse ?? false }),
    });

    this.ephemeral = Boolean(data.flags & MessageFlags.Ephemeral);
    this.replied = true;

    return options.withResponse ? new InteractionCallbackResponse(this.client, response) : undefined;
  }

  /**
   * Fetches a reply to this interaction.
   *
   * @see Webhook#fetchMessage
   * @param {Snowflake|'@original'} [message='@original'] The response to fetch
   * @returns {Promise<Message>}
   * @example
   * // Fetch the initial reply to this interaction
   * interaction.fetchReply()
   *   .then(reply => console.log(`Replied with ${reply.content}`))
   *   .catch(console.error);
   */
  async fetchReply(message = '@original') {
    return this.webhook.fetchMessage(message);
  }

  /**
   * Options that can be passed into {@link InteractionResponses#editReply}.
   *
   * @typedef {WebhookMessageEditOptions} InteractionEditReplyOptions
   * @property {MessageResolvable|'@original'} [message='@original'] The response to edit
   */

  /**
   * Edits a reply to this interaction.
   *
   * @see Webhook#editMessage
   * @param {string|MessagePayload|InteractionEditReplyOptions} options The new options for the message
   * @returns {Promise<Message>}
   * @example
   * // Edit the initial reply to this interaction
   * interaction.editReply('New content')
   *   .then(console.log)
   *   .catch(console.error);
   */
  async editReply(options) {
    if (!this.deferred && !this.replied) throw new DiscordjsError(ErrorCodes.InteractionNotReplied);
    const msg = await this.webhook.editMessage(options.message ?? '@original', options);
    this.replied = true;
    return msg;
  }

  /**
   * Deletes a reply to this interaction.
   *
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
    if (!this.deferred && !this.replied) throw new DiscordjsError(ErrorCodes.InteractionNotReplied);

    await this.webhook.deleteMessage(message);
  }

  /**
   * Send a follow-up message to this interaction.
   *
   * @param {string|MessagePayload|InteractionReplyOptions} options The options for the reply
   * @returns {Promise<Message>}
   */
  async followUp(options) {
    if (!this.deferred && !this.replied) throw new DiscordjsError(ErrorCodes.InteractionNotReplied);
    const msg = await this.webhook.send(options);
    this.replied = true;
    return msg;
  }

  /**
   * Defers an update to the message to which the component was attached.
   *
   * @param {InteractionDeferUpdateOptions} [options] Options for deferring the update to this interaction
   * @returns {Promise<InteractionCallbackResponse|undefined>}
   * @example
   * // Defer updating and reset the component's loading state
   * interaction.deferUpdate()
   *   .then(console.log)
   *   .catch(console.error);
   */
  async deferUpdate(options = {}) {
    if (this.deferred || this.replied) throw new DiscordjsError(ErrorCodes.InteractionAlreadyReplied);
    const response = await this.client.rest.post(Routes.interactionCallback(this.id, this.token), {
      body: {
        type: InteractionResponseType.DeferredMessageUpdate,
      },
      auth: false,
      query: makeURLSearchParams({ with_response: options.withResponse ?? false }),
    });
    this.deferred = true;

    return options.withResponse ? new InteractionCallbackResponse(this.client, response) : undefined;
  }

  /**
   * Updates the original message of the component on which the interaction was received on.
   *
   * @param {string|MessagePayload|InteractionUpdateOptions} [options] The options for the updated message
   * @returns {Promise<InteractionCallbackResponse|undefined>}
   * @example
   * // Remove the components from the message
   * interaction.update({
   *   content: "A component interaction was received",
   *   components: []
   * })
   *   .then(console.log)
   *   .catch(console.error);
   */
  async update(options = {}) {
    if (this.deferred || this.replied) throw new DiscordjsError(ErrorCodes.InteractionAlreadyReplied);

    let messagePayload;
    if (options instanceof MessagePayload) messagePayload = options;
    else messagePayload = MessagePayload.create(this, options);

    const { body: data, files } = await messagePayload.resolveBody().resolveFiles();

    const response = await this.client.rest.post(Routes.interactionCallback(this.id, this.token), {
      body: {
        type: InteractionResponseType.UpdateMessage,
        data,
      },
      files,
      auth: false,
      query: makeURLSearchParams({ with_response: options.withResponse ?? false }),
    });
    this.replied = true;

    return options.withResponse ? new InteractionCallbackResponse(this.client, response) : undefined;
  }

  /**
   * Launches this application's activity, if enabled
   *
   * @param {LaunchActivityOptions} [options={}] Options for launching the activity
   * @returns {Promise<InteractionCallbackResponse|undefined>}
   */
  async launchActivity({ withResponse } = {}) {
    if (this.deferred || this.replied) throw new DiscordjsError(ErrorCodes.InteractionAlreadyReplied);
    const response = await this.client.rest.post(Routes.interactionCallback(this.id, this.token), {
      query: makeURLSearchParams({ with_response: withResponse ?? false }),
      body: {
        type: InteractionResponseType.LaunchActivity,
      },
      auth: false,
    });
    this.replied = true;

    return withResponse ? new InteractionCallbackResponse(this.client, response) : undefined;
  }

  /**
   * Shows a modal component
   *
   * @param {ModalBuilder|ModalComponentData|APIModalInteractionResponseCallbackData} modal The modal to show
   * @param {ShowModalOptions} [options={}] The options for sending this interaction response
   * @returns {Promise<InteractionCallbackResponse|undefined>}
   */
  async showModal(modal, options = {}) {
    if (this.deferred || this.replied) throw new DiscordjsError(ErrorCodes.InteractionAlreadyReplied);
    const response = await this.client.rest.post(Routes.interactionCallback(this.id, this.token), {
      body: {
        type: InteractionResponseType.Modal,
        data: isJSONEncodable(modal) ? modal.toJSON() : this.client.options.jsonTransformer(modal),
      },
      auth: false,
      query: makeURLSearchParams({ with_response: options.withResponse ?? false }),
    });
    this.replied = true;

    return options.withResponse ? new InteractionCallbackResponse(this.client, response) : undefined;
  }

  /**
   * An object containing the same properties as {@link CollectorOptions}, but a few less:
   *
   * @typedef {Object} AwaitModalSubmitOptions
   * @property {CollectorFilter} [filter] The filter applied to this collector
   * @property {number} time Time in milliseconds to wait for an interaction before rejecting
   */

  /**
   * Collects a single modal submit interaction that passes the filter.
   * The Promise will reject if the time expires.
   *
   * @param {AwaitModalSubmitOptions} options Options to pass to the internal collector
   * @returns {Promise<ModalSubmitInteraction>}
   * @example
   * // Collect a modal submit interaction
   * const filter = (interaction) => interaction.customId === 'modal';
   * interaction.awaitModalSubmit({ filter, time: 15_000 })
   *   .then(interaction => console.log(`${interaction.customId} was submitted!`))
   *   .catch(console.error);
   */
  async awaitModalSubmit(options) {
    if (typeof options.time !== 'number') throw new DiscordjsError(ErrorCodes.InvalidType, 'time', 'number');
    const _options = { ...options, max: 1, interactionType: InteractionType.ModalSubmit };
    return new Promise((resolve, reject) => {
      const collector = new InteractionCollector(this.client, _options);
      collector.once('end', (interactions, reason) => {
        const interaction = interactions.first();
        if (interaction) resolve(interaction);
        else reject(new DiscordjsError(ErrorCodes.InteractionCollectorError, reason));
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
      'launchActivity',
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

exports.InteractionResponses = InteractionResponses;
