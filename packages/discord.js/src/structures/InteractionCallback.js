'use strict';

const { DiscordSnowflake } = require('@sapphire/snowflake');

/**
 * Represents an interaction callback response from Discord
 */
class InteractionCallback {
  constructor(client, data) {
    /**
     * The client that instantiated this.
     * @name InteractionCallback#client
     * @type {Client}
     * @readonly
     */
    Object.defineProperty(this, 'client', { value: client });

    /**
     * The id of the original interaction response
     * @type {Snowflake}
     */
    this.id = data.id;

    /**
     * The type of the original interaction
     * @type {InteractionType}
     */
    this.type = data.type;

    /**
     * The instance id of the Activity if one was launched or joined
     * @type {?string}
     */
    this.activityInstanceId = data.activity_instance_id ?? null;

    /**
     * The id of the message that was created by the interaction
     * @type {?Snowflake}
     */
    this.responseMessageId = data.response_message_id ?? null;

    /**
     * Whether the message is in a loading state
     * @type {?boolean}
     */
    this.responseMessageLoading = data.response_message_loading ?? null;

    /**
     * Whether the response message was ephemeral
     * @type {?boolean}
     */
    this.responseMessageEphemeral = data.response_message_ephemeral ?? null;
  }

  /**
   * The timestamp the original interaction was created at
   * @type {number}
   * @readonly
   */
  get createdTimestamp() {
    return DiscordSnowflake.timestampFrom(this.id);
  }

  /**
   * The time the original interaction was created at
   * @type {Date}
   * @readonly
   */
  get createdAt() {
    return new Date(this.createdTimestamp);
  }
}

module.exports = InteractionCallback;
