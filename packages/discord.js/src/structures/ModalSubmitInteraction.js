'use strict';

const { Collection } = require('@discordjs/collection');
const { lazy } = require('@discordjs/util');
const { transformResolved } = require('../util/Util.js');
const { BaseInteraction } = require('./BaseInteraction.js');
const { InteractionWebhook } = require('./InteractionWebhook.js');
const { ModalComponentResolver } = require('./ModalComponentResolver.js');
const { InteractionResponses } = require('./interfaces/InteractionResponses.js');

const getMessage = lazy(() => require('./Message.js').Message);

/**
 * @typedef {Object} BaseModalData
 * @property {ComponentType} type The component type of the component
 * @property {number} id The id of the component
 */

/**
 * @typedef {BaseModalData} SelectMenuModalData
 * @property {string} customId The custom id of the component
 * @property {string[]} values The values of the component
 * @property {Collection<string, GuildMember|APIGuildMember>} [members] The resolved members
 * @property {Collection<string, User|APIUser>} [users] The resolved users
 * @property {Collection<string, Role|APIRole>} [roles] The resolved roles
 * @property {Collection<string, BaseChannel|APIChannel>} [channels] The resolved channels
 */

/**
 * @typedef {BaseModalData} TextInputModalData
 * @property {string} customId The custom id of the component
 * @property {string} value The value of the component
 */

/**
 * @typedef {BaseModalData} TextDisplayModalData
 */

/**
 * @typedef {SelectMenuModalData|TextInputModalData} ModalData
 */

/**
 * @typedef {BaseModalData} LabelModalData
 * @property {ModalData} component The component within the label
 */

/**
 * @typedef {BaseModalData} ActionRowModalData
 * @property {TextInputModalData[]} components The components of this action row
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
     * @type {ModalComponentResolver}
     */
    this.components = new ModalComponentResolver(
      this.client,
      data.data.components?.map(component => this.transformComponent(component, data.data.resolved)),
      transformResolved({ client: this.client, guild: this.guild, channel: this.channel }, data.data.resolved),
    );

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
   * @param {APIInteractionDataResolved} resolved The resolved data for the interaction
   * @returns {ModalData[]}
   * @private
   */
  transformComponent(rawComponent, resolved) {
    if ('components' in rawComponent) {
      return {
        type: rawComponent.type,
        id: rawComponent.id,
        components: rawComponent.components.map(component => this.transformComponent(component, resolved)),
      };
    }

    if ('component' in rawComponent) {
      return {
        type: rawComponent.type,
        id: rawComponent.id,
        component: this.transformComponent(rawComponent.component, resolved),
      };
    }

    const data = {
      type: rawComponent.type,
      id: rawComponent.id,
    };

    // Text display components do not have custom ids.
    if ('custom_id' in rawComponent) data.customId = rawComponent.custom_id;

    if ('value' in rawComponent) data.value = rawComponent.value;

    if (rawComponent.values) {
      data.values = rawComponent.values;
      if (resolved) {
        const resolveCollection = (resolvedData, resolver) => {
          const collection = new Collection();
          for (const value of data.values) {
            if (resolvedData?.[value]) {
              collection.set(value, resolver(resolvedData[value]));
            }
          }

          return collection.size ? collection : null;
        };

        const users = resolveCollection(resolved.users, user => this.client.users._add(user));
        if (users) data.users = users;

        const channels = resolveCollection(
          resolved.channels,
          channel => this.client.channels._add(channel, this.guild) ?? channel,
        );
        if (channels) data.channels = channels;

        const members = resolveCollection(resolved.members, member => this.guild?.members._add(member) ?? member);
        if (members) data.members = members;

        const roles = resolveCollection(resolved.roles, role => this.guild?.roles._add(role) ?? role);
        if (roles) data.roles = roles;
      }
    }

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
