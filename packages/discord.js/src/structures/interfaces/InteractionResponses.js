'use strict';

const process = require('node:process');
const { deprecate } = require('node:util');
const { makeURLSearchParams } = require('@discordjs/rest');
const { isJSONEncodable } = require('@discordjs/util');
const { InteractionResponseType, MessageFlags, Routes, InteractionType } = require('discord-api-types/v10');
const { DiscordjsError, ErrorCodes } = require('../../errors');
const MessageFlagsBitField = require('../../util/MessageFlagsBitField');
const InteractionCallbackResponse = require('../InteractionCallbackResponse');
const InteractionCollector = require('../InteractionCollector');
const InteractionResponse = require('../InteractionResponse');
const MessagePayload = require('../MessagePayload');

let deprecationEmittedForEphemeralOption = false;
let deprecationEmittedForFetchReplyOption = false;

/**
 * @typedef {Object} ModalComponentData
 * @property {string} title The title of the modal
 * @property {string} customId The custom id of the modal
 * @property {ActionRow[]} components The components within this modal
 */

/**
 * Interface for classes that support shared interaction response types.
 * @interface
 */
class InteractionResponses {
  /**
   * Options for deferring the reply to an {@link BaseInteraction}.
   * @typedef {Object} InteractionDeferReplyOptions
   * @property {boolean} [ephemeral] Whether the reply should be ephemeral.
   * <warn>This option is deprecated. Use `flags` instead.</warn>
   * @property {MessageFlagsResolvable} [flags] Flags for the reply.
   * <info>Only `MessageFlags.Ephemeral` can be set.</info>
   * @property {boolean} [withResponse] Whether to return an {@link InteractionCallbackResponse} as the response
   * @property {boolean} [fetchReply] Whether to fetch the reply
   * <warn>This option is deprecated. Use `withResponse` or fetch the response instead.</warn>
   */

  /**
   * Options for deferring and updating the reply to a {@link MessageComponentInteraction}.
   * @typedef {Object} InteractionDeferUpdateOptions
   * @property {boolean} [withResponse] Whether to return an {@link InteractionCallbackResponse} as the response
   * @property {boolean} [fetchReply] Whether to fetch the reply
   * <warn>This option is deprecated. Use `withResponse` or fetch the response instead.</warn>
   */

  /**
   * Options for a reply to a {@link BaseInteraction}.
   * @typedef {BaseMessageOptionsWithPoll} InteractionReplyOptions
   * @property {boolean} [ephemeral] Whether the reply should be ephemeral.
   * <warn>This option is deprecated. Use `flags` instead.</warn>
   * @property {boolean} [tts=false] Whether the message should be spoken aloud
   * @property {boolean} [withResponse] Whether to return an {@link InteractionCallbackResponse} as the response
   * @property {boolean} [fetchReply] Whether to fetch the reply
   * <warn>This option is deprecated. Use `withResponse` or fetch the response instead.</warn>
   * @property {MessageFlagsResolvable} [flags] Which flags to set for the message.
   * <info>Only `MessageFlags.Ephemeral`, `MessageFlags.SuppressEmbeds`, and `MessageFlags.SuppressNotifications`
   * can be set.</info>
   */

  /**
   * Options for updating the message received from a {@link MessageComponentInteraction}.
   * @typedef {MessageEditOptions} InteractionUpdateOptions
   * @property {boolean} [withResponse] Whether to return an {@link InteractionCallbackResponse} as the response
   * @property {boolean} [fetchReply] Whether to fetch the reply
   * <warn>This option is deprecated. Use `withResponse` or fetch the response instead.</warn>
   */

  /**
   * Options for showing a modal in response to a {@link BaseInteraction}
   * @typedef {Object} ShowModalOptions
   * @property {boolean} [withResponse] Whether to return an {@link InteractionCallbackResponse} as the response
   */

  /**
   * Defers the reply to this interaction.
   * @param {InteractionDeferReplyOptions} [options] Options for deferring the reply to this interaction
   * @returns {Promise<InteractionCallbackResponse|Message|InteractionResponse>}
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

    if ('ephemeral' in options) {
      if (!deprecationEmittedForEphemeralOption) {
        process.emitWarning(
          `Supplying "ephemeral" for interaction response options is deprecated. Utilize flags instead.`,
        );

        deprecationEmittedForEphemeralOption = true;
      }
    }

    if ('fetchReply' in options) {
      if (!deprecationEmittedForFetchReplyOption) {
        process.emitWarning(
          // eslint-disable-next-line max-len
          `Supplying "fetchReply" for interaction response options is deprecated. Utilize "withResponse" instead or fetch the response after using the method.`,
        );

        deprecationEmittedForFetchReplyOption = true;
      }
    }

    const flags = new MessageFlagsBitField(options.flags);

    if (options.ephemeral) {
      flags.add(MessageFlags.Ephemeral);
    }

    const response = await this.client.rest.post(Routes.interactionCallback(this.id, this.token), {
      body: {
        type: InteractionResponseType.DeferredChannelMessageWithSource,
        data: {
          flags: flags.bitfield,
        },
      },
      auth: false,
      query: makeURLSearchParams({ with_response: options.withResponse ?? false }),
    });

    this.deferred = true;
    this.ephemeral = flags.has(MessageFlags.Ephemeral);

    return options.withResponse
      ? new InteractionCallbackResponse(this.client, response)
      : options.fetchReply
        ? this.fetchReply()
        : new InteractionResponse(this);
  }

  /**
   * Creates a reply to this interaction.
   * <info>Use the `withResponse` option to get the interaction callback response.</info>
   * @param {string|MessagePayload|InteractionReplyOptions} options The options for the reply
   * @returns {Promise<InteractionCallbackResponse|Message|InteractionResponse>}
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

    if (typeof options !== 'string') {
      if ('ephemeral' in options) {
        if (!deprecationEmittedForEphemeralOption) {
          process.emitWarning(
            `Supplying "ephemeral" for interaction response options is deprecated. Utilize flags instead.`,
          );

          deprecationEmittedForEphemeralOption = true;
        }
      }

      if ('fetchReply' in options) {
        if (!deprecationEmittedForFetchReplyOption) {
          process.emitWarning(
            // eslint-disable-next-line max-len
            `Supplying "fetchReply" for interaction response options is deprecated. Utilize "withResponse" instead or fetch the response after using the method.`,
          );

          deprecationEmittedForFetchReplyOption = true;
        }
      }
    }

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

    return options.withResponse
      ? new InteractionCallbackResponse(this.client, response)
      : options.fetchReply
        ? this.fetchReply()
        : new InteractionResponse(this);
  }

  /**
   * Fetches a reply to this interaction.
   * @see Webhook#fetchMessage
   * @param {Snowflake|'@original'} [message='@original'] The response to fetch
   * @returns {Promise<Message>}
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
   * @typedef {WebhookMessageEditOptions} InteractionEditReplyOptions
   * @property {MessageResolvable|'@original'} [message='@original'] The response to edit
   */

  /**
   * Edits a reply to this interaction.
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
   * @param {string|MessagePayload|InteractionReplyOptions} options The options for the reply
   * @returns {Promise<Message>}
   */
  followUp(options) {
    if (!this.deferred && !this.replied) return Promise.reject(new DiscordjsError(ErrorCodes.InteractionNotReplied));
    return this.webhook.send(options);
  }

  /**
   * Defers an update to the message to which the component was attached.
   * @param {InteractionDeferUpdateOptions} [options] Options for deferring the update to this interaction
   * @returns {Promise<InteractionCallbackResponse|Message|InteractionResponse>}
   * @example
   * // Defer updating and reset the component's loading state
   * interaction.deferUpdate()
   *   .then(console.log)
   *   .catch(console.error);
   */
  async deferUpdate(options = {}) {
    if (this.deferred || this.replied) throw new DiscordjsError(ErrorCodes.InteractionAlreadyReplied);

    if ('fetchReply' in options) {
      if (!deprecationEmittedForFetchReplyOption) {
        process.emitWarning(
          // eslint-disable-next-line max-len
          `Supplying "fetchReply" for interaction response options is deprecated. Utilize "withResponse" instead or fetch the response after using the method.`,
        );

        deprecationEmittedForFetchReplyOption = true;
      }
    }

    const response = await this.client.rest.post(Routes.interactionCallback(this.id, this.token), {
      body: {
        type: InteractionResponseType.DeferredMessageUpdate,
      },
      auth: false,
      query: makeURLSearchParams({ with_response: options.withResponse ?? false }),
    });
    this.deferred = true;

    return options.withResponse
      ? new InteractionCallbackResponse(this.client, response)
      : options.fetchReply
        ? this.fetchReply()
        : new InteractionResponse(this, this.message?.interactionMetadata?.id);
  }

  /**
   * Updates the original message of the component on which the interaction was received on.
   * @param {string|MessagePayload|InteractionUpdateOptions} options The options for the updated message
   * @returns {Promise<InteractionCallbackResponse|Message|void>}
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
    if (this.deferred || this.replied) throw new DiscordjsError(ErrorCodes.InteractionAlreadyReplied);

    if (typeof options !== 'string' && 'fetchReply' in options) {
      if (!deprecationEmittedForFetchReplyOption) {
        process.emitWarning(
          // eslint-disable-next-line max-len
          `Supplying "fetchReply" for interaction response options is deprecated. Utilize "withResponse" instead or fetch the response after using the method.`,
        );

        deprecationEmittedForFetchReplyOption = true;
      }
    }

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

    return options.withResponse
      ? new InteractionCallbackResponse(this.client, response)
      : options.fetchReply
        ? this.fetchReply()
        : new InteractionResponse(this, this.message.interactionMetadata?.id);
  }

  /**
   * Shows a modal component
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
   * Responds to the interaction with an upgrade button.
   * <info>Only available for applications with monetization enabled.</info>
   * @deprecated Sending a premium-style button is the new Discord behaviour.
   * @returns {Promise<void>}
   */
  async sendPremiumRequired() {
    if (this.deferred || this.replied) throw new DiscordjsError(ErrorCodes.InteractionAlreadyReplied);
    await this.client.rest.post(Routes.interactionCallback(this.id, this.token), {
      body: {
        type: InteractionResponseType.PremiumRequired,
      },
      auth: false,
    });
    this.replied = true;
  }

  /**
   * An object containing the same properties as {@link CollectorOptions}, but a few less:
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
      'showModal',
      'sendPremiumRequired',
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

InteractionResponses.prototype.sendPremiumRequired = deprecate(
  InteractionResponses.prototype.sendPremiumRequired,
  // eslint-disable-next-line max-len
  'InteractionResponses#sendPremiumRequired() is deprecated. Sending a premium-style button is the new Discord behaviour.',
);

module.exports = InteractionResponses;
