'use strict';

const { lazy } = require('@discordjs/util');
const { BaseInteraction } = require('./BaseInteraction.js');
const { InteractionWebhook } = require('./InteractionWebhook.js');
const { InteractionResponses } = require('./interfaces/InteractionResponses.js');

const getMessage = lazy(() => require('./Message.js').Message);

/**
 * Represents a message component interaction.
 * @extends {BaseInteraction}
 * @implements {InteractionResponses}
 */
class MessageComponentInteraction extends BaseInteraction {
  constructor(client, data) {
    super(client, data);

    /**
     * The id of the channel this interaction was sent in
     * @type {Snowflake}
     * @name MessageComponentInteraction#channelId
     */

    /**
     * The message to which the component was attached
     * @type {Message}
     */
    this.message = this.channel?.messages._add(data.message) ?? new (getMessage())(client, data.message);

    /**
     * The custom id of the component which was interacted with
     * @type {string}
     */
    this.customId = data.data.custom_id;

    /**
     * The type of component which was interacted with
     * @type {ComponentType}
     */
    this.componentType = data.data.component_type;

    /**
     * Whether the reply to this interaction has been deferred
     * @type {boolean}
     */
    this.deferred = false;

    /**
     * Whether the reply to this interaction is ephemeral
     * @type {?boolean}
     */
    this.ephemeral = null;

    /**
     * Whether this interaction has already been replied to
     * @type {boolean}
     */
    this.replied = false;

    /**
     * An associated interaction webhook, can be used to further interact with this interaction
     * @type {InteractionWebhook}
     */
    this.webhook = new InteractionWebhook(this.client, this.applicationId, this.token);
  }

  /**
   * Components that can be placed in an action row for messages.
   * * ButtonComponent
   * * StringSelectMenuComponent
   * * UserSelectMenuComponent
   * * RoleSelectMenuComponent
   * * MentionableSelectMenuComponent
   * * ChannelSelectMenuComponent
   * @typedef {ButtonComponent|StringSelectMenuComponent|UserSelectMenuComponent|
   * RoleSelectMenuComponent|MentionableSelectMenuComponent|ChannelSelectMenuComponent} MessageActionRowComponent
   */

  /**
   * The component which was interacted with
   * @type {MessageActionRowComponent|APIMessageActionRowComponent}
   * @readonly
   */
  get component() {
    return this.message.components
      .flatMap(row => row.components)
      .find(component => (component.customId ?? component.custom_id) === this.customId);
  }

  // These are here only for documentation purposes - they are implemented by InteractionResponses
  /* eslint-disable no-empty-function */
  deferReply() {}
  reply() {}
  fetchReply() {}
  editReply() {}
  deleteReply() {}
  followUp() {}
  deferUpdate() {}
  update() {}
  launchActivity() {}
  showModal() {}
  awaitModalSubmit() {}
}

InteractionResponses.applyToClass(MessageComponentInteraction);

exports.MessageComponentInteraction = MessageComponentInteraction;
