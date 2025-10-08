'use strict';

const { Collection } = require('@discordjs/collection');
const { lazy } = require('@discordjs/util');
const BaseInteraction = require('./BaseInteraction');
const InteractionWebhook = require('./InteractionWebhook');
const ModalSubmitFields = require('./ModalSubmitFields');
const InteractionResponses = require('./interfaces/InteractionResponses');
const { transformResolved } = require('../util/Util');

const getMessage = lazy(() => require('./Message').Message);

/**
 * @typedef {Object} BaseModalData
 * @property {ComponentType} type The component type of the field
 * @property {number} id The id of the field
 */

/**
 * @typedef {BaseModalData} TextInputModalData
 * @property {string} customId The custom id of the field
 * @property {string} value The value of the field
 */

/**
 * @typedef {BaseModalData} SelectMenuModalData
 * @property {string} customId The custom id of the field
 * @property {string[]} values The values of the field
 * @property {Collection<string, GuildMember|APIGuildMember>} [members] The resolved members
 * @property {Collection<string, User|APIUser>} [users] The resolved users
 * @property {Collection<string, Role|APIRole>} [roles] The resolved roles
 * @property {Collection<string, BaseChannel|APIChannel>} [channels] The resolved channels
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
 * @extends {BaseInteraction}
 * @implements {InteractionResponses}
 */
class ModalSubmitInteraction extends BaseInteraction {
  constructor(client, data) {
    super(client, data);
    /**
     * The custom id of the modal.
     * @type {string}
     */
    this.customId = data.data.custom_id;

    if ('message' in data) {
      /**
       * The message associated with this interaction
       * @type {?Message}
       */
      this.message = this.channel?.messages._add(data.message) ?? new (getMessage())(this.client, data.message);
    } else {
      this.message = null;
    }

    /**
     * The components within the modal
     *
     * @type {Array<ActionRowModalData | LabelModalData | TextDisplayModalData>}
     */
    this.components = data.data.components?.map(component =>
      ModalSubmitInteraction.transformComponent(component, data.data.resolved, {
        client: this.client,
        guild: this.guild,
      }),
    );

    /**
     * The fields within the modal
     * @type {ModalSubmitFields}
     */
    this.fields = new ModalSubmitFields(
      this.components,
      transformResolved({ client: this.client, guild: this.guild, channel: this.channel }, data.data.resolved),
    );

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
     * Whether the reply to this interaction is ephemeral
     * @type {?boolean}
     */
    this.ephemeral = null;

    /**
     * An associated interaction webhook, can be used to further interact with this interaction
     * @type {InteractionWebhook}
     */
    this.webhook = new InteractionWebhook(this.client, this.applicationId, this.token);
  }

  /**
   * Transforms component data to discord.js-compatible data
   * @param {*} rawComponent The data to transform
   * @param {APIInteractionDataResolved} [resolved] The resolved data for the interaction
   * @param {*} [extra] Extra data required for the transformation
   * @returns {ModalData[]}
   */
  static transformComponent(rawComponent, resolved, { client, guild } = {}) {
    if ('components' in rawComponent) {
      return {
        type: rawComponent.type,
        id: rawComponent.id,
        components: rawComponent.components.map(component =>
          this.transformComponent(component, resolved, { client, guild }),
        ),
      };
    }

    if ('component' in rawComponent) {
      return {
        type: rawComponent.type,
        id: rawComponent.id,
        component: this.transformComponent(rawComponent.component, resolved, { client, guild }),
      };
    }

    let data = {
      type: rawComponent.type,
      id: rawComponent.id,
    };

    // Text display components do not have custom ids.
    if ('custom_id' in rawComponent) data.customId = rawComponent.custom_id;

    if ('value' in rawComponent) data.value = rawComponent.value;

    if (rawComponent.values) {
      data.values = rawComponent.values;

      if (resolved) {
        const { members, users, channels, roles } = resolved;
        const result = {};

        if (users) {
          result.users = new Collection();

          for (const user of Object.values(users)) {
            result.users.set(user.id, client.users._add(user));
          }
        }

        if (channels) {
          result.channels = new Collection();

          for (const apiChannel of Object.values(channels)) {
            result.channels.set(apiChannel.id, client.channels._add(apiChannel, guild) ?? apiChannel);
          }
        }

        if (members) {
          result.members = new Collection();

          for (const [id, member] of Object.entries(members)) {
            const user = users[id];
            result.members.set(id, guild?.members._add({ user, ...member }) ?? member);
          }
        }

        if (roles) {
          result.roles = new Collection();

          for (const role of Object.values(roles)) {
            result.roles.set(role.id, guild?.roles._add(role) ?? role);
          }
        }

        data = { ...data, ...result };
      }
    }

    return data;
  }

  /**
   * Whether this is from a {@link MessageComponentInteraction}.
   * @returns {boolean}
   */
  isFromMessage() {
    return Boolean(this.message);
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
  sendPremiumRequired() {}
  launchActivity() {}
}

InteractionResponses.applyToClass(ModalSubmitInteraction, 'showModal');

module.exports = ModalSubmitInteraction;
