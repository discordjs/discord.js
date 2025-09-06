'use strict';

const { lazy } = require('@discordjs/util');
const { BaseInteraction } = require('./BaseInteraction.js');
const { InteractionWebhook } = require('./InteractionWebhook.js');
const { ModalSubmitFields } = require('./ModalSubmitFields.js');
const { InteractionResponses } = require('./interfaces/InteractionResponses.js');

const getMessage = lazy(() => require('./Message.js').Message);

/**
 * @typedef {Object} BaseModalData
 * @property {ComponentType} type The component type of the field
 * @property {string} customId The custom id of the field
 * @property {number} id The id of the field
 */

/**
 * @typedef {BaseModalData} TextInputModalData
 * @property {string} value The value of the field
 */

/**
 * @typedef {BaseModalData} StringSelectModalData
 * @property {string[]} values The values of the field
 */

/**
 * @typedef {TextInputModalData | StringSelectModalData} ModalData
 */

/**
 * @typedef {Object} LabelModalData
 * @property {ModalData} component The component within the label
 * @property {ComponentType} type The component type of the label
 * @property {number} id The id of the label
 */

/**
 * @typedef {Object} ActionRowModalData
 * @property {TextInputModalData[]} components The components of this action row
 * @property {ComponentType} type The component type of the action row
 * @property {number} id The id of the action row
 */

/**
 * Represents a modal interaction
 *
 * @extends {BaseInteraction}
 * @implements {InteractionResponses}
 */
class ModalSubmitInteraction extends BaseInteraction {
  constructor(client, data) {
    super(client, data);
    /**
     * The custom id of the modal.
     *
     * @type {string}
     */
    this.customId = data.data.custom_id;

    if ('message' in data) {
      /**
       * The message associated with this interaction
       *
       * @type {?Message}
       */
      this.message = this.channel?.messages._add(data.message) ?? new (getMessage())(this.client, data.message);
    } else {
      this.message = null;
    }

    /**
     * The components within the modal
     *
     * @type {Array<ActionRowModalData | LabelModalData>}
     */
    this.components = data.data.components?.map(component => ModalSubmitInteraction.transformComponent(component));

    /**
     * The fields within the modal
     *
     * @type {ModalSubmitFields}
     */
    this.fields = new ModalSubmitFields(this.components);

    /**
     * Whether the reply to this interaction has been deferred
     *
     * @type {boolean}
     */
    this.deferred = false;

    /**
     * Whether this interaction has already been replied to
     *
     * @type {boolean}
     */
    this.replied = false;

    /**
     * Whether the reply to this interaction is ephemeral
     *
     * @type {?boolean}
     */
    this.ephemeral = null;

    /**
     * An associated interaction webhook, can be used to further interact with this interaction
     *
     * @type {InteractionWebhook}
     */
    this.webhook = new InteractionWebhook(this.client, this.applicationId, this.token);
  }

  /**
   * Transforms component data to discord.js-compatible data
   *
   * @param {*} rawComponent The data to transform
   * @returns {ModalData[]}
   * @private
   */
  static transformComponent(rawComponent) {
    if ('components' in rawComponent) {
      return {
        type: rawComponent.type,
        id: rawComponent.id,
        components: rawComponent.components.map(component => this.transformComponent(component)),
      };
    }

    if ('component' in rawComponent) {
      return {
        type: rawComponent.type,
        id: rawComponent.id,
        component: this.transformComponent(rawComponent.component),
      };
    }

    const data = {
      type: rawComponent.type,
      customId: rawComponent.custom_id,
      id: rawComponent.id,
    };

    if (rawComponent.value) data.value = rawComponent.value;
    if (rawComponent.values) data.values = rawComponent.values;

    return data;
  }

  /**
   * Whether this is from a {@link MessageComponentInteraction}.
   *
   * @returns {boolean}
   */
  isFromMessage() {
    return Boolean(this.message);
  }

  // These are here only for documentation purposes - they are implemented by InteractionResponses

  deferReply() {}

  reply() {}

  fetchReply() {}

  editReply() {}

  deleteReply() {}

  followUp() {}

  deferUpdate() {}

  update() {}

  launchActivity() {}
}

InteractionResponses.applyToClass(ModalSubmitInteraction, 'showModal');

exports.ModalSubmitInteraction = ModalSubmitInteraction;
