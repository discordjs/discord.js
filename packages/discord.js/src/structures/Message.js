'use strict';

const { Collection } = require('@discordjs/collection');
const { messageLink } = require('@discordjs/formatters');
const { DiscordSnowflake } = require('@sapphire/snowflake');
const {
  InteractionType,
  ChannelType,
  MessageType,
  MessageFlags,
  PermissionFlagsBits,
  MessageReferenceType,
} = require('discord-api-types/v10');
const Attachment = require('./Attachment');
const Base = require('./Base');
const ClientApplication = require('./ClientApplication');
const Embed = require('./Embed');
const InteractionCollector = require('./InteractionCollector');
const Mentions = require('./MessageMentions');
const MessagePayload = require('./MessagePayload');
const { Poll } = require('./Poll.js');
const ReactionCollector = require('./ReactionCollector');
const { Sticker } = require('./Sticker');
const { DiscordjsError, ErrorCodes } = require('../errors');
const ReactionManager = require('../managers/ReactionManager');
const { createComponent, findComponentByCustomId } = require('../util/Components');
const { NonSystemMessageTypes, MaxBulkDeletableMessageAge, UndeletableMessageTypes } = require('../util/Constants');
const MessageFlagsBitField = require('../util/MessageFlagsBitField');
const PermissionsBitField = require('../util/PermissionsBitField');
const { _transformAPIMessageInteractionMetadata } = require('../util/Transformers.js');
const { cleanContent, resolvePartialEmoji, transformResolved } = require('../util/Util');

/**
 * Represents a message on Discord.
 * @extends {Base}
 */
class Message extends Base {
  constructor(client, data) {
    super(client);

    /**
     * The id of the channel the message was sent in
     * @type {Snowflake}
     */
    this.channelId = data.channel_id;

    /**
     * The id of the guild the message was sent in, if any
     * @type {?Snowflake}
     */
    this.guildId = data.guild_id ?? this.channel?.guild?.id ?? null;

    this._patch(data);
  }

  _patch(data) {
    /**
     * The message's id
     * @type {Snowflake}
     */
    this.id = data.id;

    /**
     * The timestamp the message was sent at
     * @type {number}
     */
    this.createdTimestamp = DiscordSnowflake.timestampFrom(this.id);

    if ('type' in data) {
      /**
       * The type of the message
       * @type {?MessageType}
       */
      this.type = data.type;

      /**
       * Whether or not this message was sent by Discord, not actually a user (e.g. pin notifications)
       * @type {?boolean}
       */
      this.system = !NonSystemMessageTypes.includes(this.type);
    } else {
      this.system ??= null;
      this.type ??= null;
    }

    if ('content' in data) {
      /**
       * The content of the message.
       * <info>This property requires the {@link GatewayIntentBits.MessageContent} privileged intent
       * in a guild for messages that do not mention the client.</info>
       * @type {?string}
       */
      this.content = data.content;
    } else {
      this.content ??= null;
    }

    if ('author' in data) {
      /**
       * The author of the message
       * @type {?User}
       */
      this.author = this.client.users._add(data.author, !data.webhook_id);
    } else {
      this.author ??= null;
    }

    if ('pinned' in data) {
      /**
       * Whether or not this message is pinned
       * @type {?boolean}
       */
      this.pinned = Boolean(data.pinned);
    } else {
      this.pinned ??= null;
    }

    if ('tts' in data) {
      /**
       * Whether or not the message was Text-To-Speech
       * @type {?boolean}
       */
      this.tts = data.tts;
    } else {
      this.tts ??= null;
    }

    if ('nonce' in data) {
      /**
       * A random number or string used for checking message delivery
       * <warn>This is only received after the message was sent successfully, and
       * lost if re-fetched</warn>
       * @type {?string}
       */
      this.nonce = data.nonce;
    } else {
      this.nonce ??= null;
    }

    if ('embeds' in data) {
      /**
       * An array of embeds in the message - e.g. YouTube Player.
       * <info>This property requires the {@link GatewayIntentBits.MessageContent} privileged intent
       * in a guild for messages that do not mention the client.</info>
       * @type {Embed[]}
       */
      this.embeds = data.embeds.map(embed => new Embed(embed));
    } else {
      this.embeds = this.embeds?.slice() ?? [];
    }

    if ('components' in data) {
      /**
       * An array of components in the message.
       * <info>This property requires the {@link GatewayIntentBits.MessageContent} privileged intent
       * in a guild for messages that do not mention the client.</info>
       * @type {Component[]}
       */
      this.components = data.components.map(component => createComponent(component));
    } else {
      this.components = this.components?.slice() ?? [];
    }

    if ('attachments' in data) {
      /**
       * A collection of attachments in the message - e.g. Pictures - mapped by their ids.
       * <info>This property requires the {@link GatewayIntentBits.MessageContent} privileged intent
       * in a guild for messages that do not mention the client.</info>
       * @type {Collection<Snowflake, Attachment>}
       */
      this.attachments = new Collection();
      if (data.attachments) {
        for (const attachment of data.attachments) {
          this.attachments.set(attachment.id, new Attachment(attachment));
        }
      }
    } else {
      this.attachments = new Collection(this.attachments);
    }

    if ('sticker_items' in data || 'stickers' in data) {
      /**
       * A collection of stickers in the message
       * @type {Collection<Snowflake, Sticker>}
       */
      this.stickers = new Collection(
        (data.sticker_items ?? data.stickers)?.map(sticker => [sticker.id, new Sticker(this.client, sticker)]),
      );
    } else {
      this.stickers = new Collection(this.stickers);
    }

    if ('position' in data) {
      /**
       * A generally increasing integer (there may be gaps or duplicates) that represents
       * the approximate position of the message in a thread.
       * @type {?number}
       */
      this.position = data.position;
    } else {
      this.position ??= null;
    }

    if ('role_subscription_data' in data) {
      /**
       * Role subscription data found on {@link MessageType.RoleSubscriptionPurchase} messages.
       * @typedef {Object} RoleSubscriptionData
       * @property {Snowflake} roleSubscriptionListingId The id of the SKU and listing the user is subscribed to
       * @property {string} tierName The name of the tier the user is subscribed to
       * @property {number} totalMonthsSubscribed The total number of months the user has been subscribed for
       * @property {boolean} isRenewal Whether this notification is a renewal
       */

      /**
       * The data of the role subscription purchase or renewal.
       * <info>This is present on {@link MessageType.RoleSubscriptionPurchase} messages.</info>
       * @type {?RoleSubscriptionData}
       */
      this.roleSubscriptionData = {
        roleSubscriptionListingId: data.role_subscription_data.role_subscription_listing_id,
        tierName: data.role_subscription_data.tier_name,
        totalMonthsSubscribed: data.role_subscription_data.total_months_subscribed,
        isRenewal: data.role_subscription_data.is_renewal,
      };
    } else {
      this.roleSubscriptionData ??= null;
    }

    if ('resolved' in data) {
      /**
       * Resolved data from auto-populated select menus.
       * @typedef {Object} CommandInteractionResolvedData
       */
      this.resolved = transformResolved(
        { client: this.client, guild: this.guild, channel: this.channel },
        data.resolved,
      );
    } else {
      this.resolved ??= null;
    }

    // Discord sends null if the message has not been edited
    if (data.edited_timestamp) {
      /**
       * The timestamp the message was last edited at (if applicable)
       * @type {?number}
       */
      this.editedTimestamp = Date.parse(data.edited_timestamp);
    } else {
      this.editedTimestamp ??= null;
    }

    if ('reactions' in data) {
      /**
       * A manager of the reactions belonging to this message
       * @type {ReactionManager}
       */
      this.reactions = new ReactionManager(this);
      if (data.reactions?.length > 0) {
        for (const reaction of data.reactions) {
          this.reactions._add(reaction);
        }
      }
    } else {
      this.reactions ??= new ReactionManager(this);
    }

    if (!this.mentions) {
      /**
       * All valid mentions that the message contains
       * @type {MessageMentions}
       */
      this.mentions = new Mentions(
        this,
        data.mentions,
        data.mention_roles,
        data.mention_everyone,
        data.mention_channels,
        data.referenced_message?.author,
      );
    } else {
      this.mentions = new Mentions(
        this,
        data.mentions ?? this.mentions.users,
        data.mention_roles ?? this.mentions.roles,
        data.mention_everyone ?? this.mentions.everyone,
        data.mention_channels ?? this.mentions.crosspostedChannels,
        data.referenced_message?.author ?? this.mentions.repliedUser,
      );
    }

    if ('webhook_id' in data) {
      /**
       * The id of the webhook that sent the message, if applicable
       * @type {?Snowflake}
       */
      this.webhookId = data.webhook_id;
    } else {
      this.webhookId ??= null;
    }

    if ('application' in data) {
      /**
       * Supplemental application information for group activities
       * @type {?ClientApplication}
       */
      this.groupActivityApplication = new ClientApplication(this.client, data.application);
    } else {
      this.groupActivityApplication ??= null;
    }

    if ('application_id' in data) {
      /**
       * The id of the application of the interaction that sent this message, if any
       * @type {?Snowflake}
       */
      this.applicationId = data.application_id;
    } else {
      this.applicationId ??= null;
    }

    if ('activity' in data) {
      /**
       * Group activity
       * @type {?MessageActivity}
       */
      this.activity = {
        partyId: data.activity.party_id,
        type: data.activity.type,
      };
    } else {
      this.activity ??= null;
    }

    if ('thread' in data) {
      this.client.channels._add(data.thread, this.guild);
    }

    if (this.member && data.member) {
      this.member._patch(data.member);
    } else if (data.member && this.guild && this.author) {
      this.guild.members._add(Object.assign(data.member, { user: this.author }));
    }

    if ('flags' in data) {
      /**
       * Flags that are applied to the message
       * @type {Readonly<MessageFlagsBitField>}
       */
      this.flags = new MessageFlagsBitField(data.flags).freeze();
    } else {
      this.flags = new MessageFlagsBitField(this.flags).freeze();
    }

    /**
     * Reference data sent in a message that contains ids identifying the referenced message.
     * This can be present in the following types of message:
     * * Crossposted messages (`MessageFlags.Crossposted`)
     * * {@link MessageType.ChannelPinnedMessage}
     * * {@link MessageType.ChannelFollowAdd}
     * * {@link MessageType.Reply}
     * * {@link MessageType.ThreadStarterMessage}
     * @see {@link https://discord.com/developers/docs/resources/message#message-object-message-types}
     * @typedef {Object} MessageReference
     * @property {Snowflake} channelId The channel id that was referenced
     * @property {Snowflake|undefined} guildId The guild id that was referenced
     * @property {Snowflake|undefined} messageId The message id that was referenced
     * @property {MessageReferenceType} type The type of message reference
     */

    if ('message_reference' in data) {
      /**
       * Message reference data
       * @type {?MessageReference}
       */
      this.reference = {
        channelId: data.message_reference.channel_id,
        guildId: data.message_reference.guild_id,
        messageId: data.message_reference.message_id,
        type: data.message_reference.type,
      };
    } else {
      this.reference ??= null;
    }

    if (data.referenced_message) {
      this.channel?.messages._add({ guild_id: data.message_reference?.guild_id, ...data.referenced_message });
    }

    if (data.interaction_metadata) {
      /**
       * Partial data of the interaction that a message is a result of
       * @typedef {Object} MessageInteractionMetadata
       * @property {Snowflake} id The interaction's id
       * @property {InteractionType} type The type of the interaction
       * @property {User} user The user that invoked the interaction
       * @property {APIAuthorizingIntegrationOwnersMap} authorizingIntegrationOwners
       * Ids for installation context(s) related to an interaction
       * @property {?Snowflake} originalResponseMessageId
       * Id of the original response message. Present only on follow-up messages
       * @property {?Snowflake} interactedMessageId
       * Id of the message that contained interactive component.
       * Present only on messages created from component interactions
       * @property {?MessageInteractionMetadata} triggeringInteractionMetadata
       * Metadata for the interaction that was used to open the modal. Present only on modal submit interactions
       */

      /**
       * Partial data of the interaction that this message is a result of
       * @type {?MessageInteractionMetadata}
       */
      this.interactionMetadata = _transformAPIMessageInteractionMetadata(this.client, data.interaction_metadata);
    } else {
      this.interactionMetadata ??= null;
    }

    /**
     * Partial data of the interaction that a message is a reply to
     * @typedef {Object} MessageInteraction
     * @property {Snowflake} id The interaction's id
     * @property {InteractionType} type The type of the interaction
     * @property {string} commandName The name of the interaction's application command,
     * as well as the subcommand and subcommand group, where applicable
     * @property {User} user The user that invoked the interaction
     * @deprecated Use {@link Message#interactionMetadata} instead.
     */

    if (data.interaction) {
      /**
       * Partial data of the interaction that this message is a reply to
       * @type {?MessageInteraction}
       * @deprecated Use {@link Message#interactionMetadata} instead.
       */
      this.interaction = {
        id: data.interaction.id,
        type: data.interaction.type,
        commandName: data.interaction.name,
        user: this.client.users._add(data.interaction.user),
      };
    } else {
      this.interaction ??= null;
    }

    if (data.poll) {
      /**
       * The poll that was sent with the message
       * @type {?Poll}
       */
      this.poll = new Poll(this.client, data.poll, this);
    } else {
      this.poll ??= null;
    }

    if (data.message_snapshots) {
      /**
       * The message snapshots associated with the message reference
       * @type {Collection<Snowflake, Message>}
       */
      this.messageSnapshots = data.message_snapshots.reduce((coll, snapshot) => {
        const channel = this.client.channels.resolve(this.reference.channelId);
        const snapshotData = {
          ...snapshot.message,
          id: this.reference.messageId,
          channel_id: this.reference.channelId,
          guild_id: this.reference.guildId,
        };

        return coll.set(
          this.reference.messageId,
          channel ? channel.messages._add(snapshotData) : new this.constructor(this.client, snapshotData),
        );
      }, new Collection());
    } else {
      this.messageSnapshots ??= new Collection();
    }

    /**
     * A call associated with a message
     * @typedef {Object} MessageCall
     * @property {Readonly<?Date>} endedAt The time the call ended
     * @property {?number} endedTimestamp The timestamp the call ended
     * @property {Snowflake[]} participants The ids of the users that participated in the call
     */

    if (data.call) {
      /**
       * The call associated with the message
       * @type {?MessageCall}
       */
      this.call = {
        endedTimestamp: data.call.ended_timestamp ? Date.parse(data.call.ended_timestamp) : null,
        participants: data.call.participants,
        get endedAt() {
          return this.endedTimestamp && new Date(this.endedTimestamp);
        },
      };
    } else {
      this.call ??= null;
    }
  }

  /**
   * The channel that the message was sent in
   * @type {TextBasedChannels}
   * @readonly
   */
  get channel() {
    return this.client.channels.resolve(this.channelId);
  }

  /**
   * Whether or not this message is a partial
   * @type {boolean}
   * @readonly
   */
  get partial() {
    return typeof this.content !== 'string' || !this.author;
  }

  /**
   * Represents the author of the message as a guild member.
   * Only available if the message comes from a guild where the author is still a member
   * @type {?GuildMember}
   * @readonly
   */
  get member() {
    return this.guild?.members.resolve(this.author) ?? null;
  }

  /**
   * The time the message was sent at
   * @type {Date}
   * @readonly
   */
  get createdAt() {
    return new Date(this.createdTimestamp);
  }

  /**
   * The time the message was last edited at (if applicable)
   * @type {?Date}
   * @readonly
   */
  get editedAt() {
    return this.editedTimestamp && new Date(this.editedTimestamp);
  }

  /**
   * The guild the message was sent in (if in a guild channel)
   * @type {?Guild}
   * @readonly
   */
  get guild() {
    return this.client.guilds.resolve(this.guildId) ?? this.channel?.guild ?? null;
  }

  /**
   * Whether this message has a thread associated with it
   * @type {boolean}
   * @readonly
   */
  get hasThread() {
    return this.flags.has(MessageFlags.HasThread);
  }

  /**
   * The thread started by this message
   * <info>This property is not suitable for checking whether a message has a thread,
   * use {@link Message#hasThread} instead.</info>
   * @type {?ThreadChannel}
   * @readonly
   */
  get thread() {
    return this.channel?.threads?.cache.get(this.id) ?? null;
  }

  /**
   * The URL to jump to this message
   * @type {string}
   * @readonly
   */
  get url() {
    return this.inGuild() ? messageLink(this.channelId, this.id, this.guildId) : messageLink(this.channelId, this.id);
  }

  /**
   * The message contents with all mentions replaced by the equivalent text.
   * If mentions cannot be resolved to a name, the relevant mention in the message content will not be converted.
   * @type {?string}
   * @readonly
   */
  get cleanContent() {
    // eslint-disable-next-line eqeqeq
    return this.content != null && this.channel ? cleanContent(this.content, this.channel) : null;
  }

  /**
   * Creates a reaction collector.
   * @param {ReactionCollectorOptions} [options={}] Options to send to the collector
   * @returns {ReactionCollector}
   * @example
   * // Create a reaction collector
   * const filter = (reaction, user) => reaction.emoji.name === '👌' && user.id === 'someId';
   * const collector = message.createReactionCollector({ filter, time: 15_000 });
   * collector.on('collect', r => console.log(`Collected ${r.emoji.name}`));
   * collector.on('end', collected => console.log(`Collected ${collected.size} items`));
   */
  createReactionCollector(options = {}) {
    return new ReactionCollector(this, options);
  }

  /**
   * An object containing the same properties as CollectorOptions, but a few more:
   * @typedef {ReactionCollectorOptions} AwaitReactionsOptions
   * @property {string[]} [errors] Stop/end reasons that cause the promise to reject
   */

  /**
   * Similar to createReactionCollector but in promise form.
   * Resolves with a collection of reactions that pass the specified filter.
   * @param {AwaitReactionsOptions} [options={}] Optional options to pass to the internal collector
   * @returns {Promise<Collection<string | Snowflake, MessageReaction>>}
   * @example
   * // Create a reaction collector
   * const filter = (reaction, user) => reaction.emoji.name === '👌' && user.id === 'someId'
   * message.awaitReactions({ filter, time: 15_000 })
   *   .then(collected => console.log(`Collected ${collected.size} reactions`))
   *   .catch(console.error);
   */
  awaitReactions(options = {}) {
    return new Promise((resolve, reject) => {
      const collector = this.createReactionCollector(options);
      collector.once('end', (reactions, reason) => {
        if (options.errors?.includes(reason)) reject(reactions);
        else resolve(reactions);
      });
    });
  }

  /**
   * @typedef {CollectorOptions} MessageComponentCollectorOptions
   * @property {ComponentType} [componentType] The type of component to listen for
   * @property {number} [max] The maximum total amount of interactions to collect
   * @property {number} [maxComponents] The maximum number of components to collect
   * @property {number} [maxUsers] The maximum number of users to interact
   */

  /**
   * Creates a message component interaction collector.
   * @param {MessageComponentCollectorOptions} [options={}] Options to send to the collector
   * @returns {InteractionCollector}
   * @example
   * // Create a message component interaction collector
   * const filter = (interaction) => interaction.customId === 'button' && interaction.user.id === 'someId';
   * const collector = message.createMessageComponentCollector({ filter, time: 15_000 });
   * collector.on('collect', i => console.log(`Collected ${i.customId}`));
   * collector.on('end', collected => console.log(`Collected ${collected.size} items`));
   */
  createMessageComponentCollector(options = {}) {
    return new InteractionCollector(this.client, {
      ...options,
      interactionType: InteractionType.MessageComponent,
      message: this,
    });
  }

  /**
   * An object containing the same properties as CollectorOptions, but a few more:
   * @typedef {Object} AwaitMessageComponentOptions
   * @property {CollectorFilter} [filter] The filter applied to this collector
   * @property {number} [time] Time to wait for an interaction before rejecting
   * @property {ComponentType} [componentType] The type of component interaction to collect
   * @property {number} [idle] Time to wait without another message component interaction before ending the collector
   * @property {boolean} [dispose] Whether to remove the message component interaction after collecting
   * @property {InteractionResponse} [interactionResponse] The interaction response to collect interactions from
   */

  /**
   * Collects a single component interaction that passes the filter.
   * The Promise will reject if the time expires.
   * @param {AwaitMessageComponentOptions} [options={}] Options to pass to the internal collector
   * @returns {Promise<MessageComponentInteraction>}
   * @example
   * // Collect a message component interaction
   * const filter = (interaction) => interaction.customId === 'button' && interaction.user.id === 'someId';
   * message.awaitMessageComponent({ filter, time: 15_000 })
   *   .then(interaction => console.log(`${interaction.customId} was clicked!`))
   *   .catch(console.error);
   */
  awaitMessageComponent(options = {}) {
    const _options = { ...options, max: 1 };
    return new Promise((resolve, reject) => {
      const collector = this.createMessageComponentCollector(_options);
      collector.once('end', (interactions, reason) => {
        const interaction = interactions.first();
        if (interaction) resolve(interaction);
        else reject(new DiscordjsError(ErrorCodes.InteractionCollectorError, reason));
      });
    });
  }

  /**
   * Whether the message is editable by the client user
   * @type {boolean}
   * @readonly
   */
  get editable() {
    const precheck = Boolean(
      this.author.id === this.client.user.id &&
        (!this.guild || this.channel?.viewable) &&
        this.reference?.type !== MessageReferenceType.Forward,
    );

    // Regardless of permissions thread messages cannot be edited if
    // the thread is archived or the thread is locked and the bot does not have permission to manage threads.
    if (this.channel?.isThread()) {
      if (this.channel.archived) return false;
      if (this.channel.locked) {
        const permissions = this.channel.permissionsFor(this.client.user);
        if (!permissions?.has(PermissionFlagsBits.ManageThreads, true)) return false;
      }
    }

    return precheck;
  }

  /**
   * Whether the message is deletable by the client user
   * @type {boolean}
   * @readonly
   */
  get deletable() {
    if (UndeletableMessageTypes.includes(this.type)) return false;

    if (!this.guild) {
      return this.author.id === this.client.user.id;
    }
    // DMChannel does not have viewable property, so check viewable after proved that message is on a guild.
    if (!this.channel?.viewable) {
      return false;
    }

    const permissions = this.channel?.permissionsFor(this.client.user);
    if (!permissions) return false;
    // This flag allows deleting even if timed out
    if (permissions.has(PermissionFlagsBits.Administrator, false)) return true;

    // The auto moderation action message author is the reference message author
    return (
      (this.type !== MessageType.AutoModerationAction && this.author.id === this.client.user.id) ||
      (permissions.has(PermissionFlagsBits.ManageMessages, false) && !this.guild.members.me.isCommunicationDisabled())
    );
  }

  /**
   * Whether the message is bulk deletable by the client user
   * @type {boolean}
   * @readonly
   * @example
   * // Filter for bulk deletable messages
   * channel.bulkDelete(messages.filter(message => message.bulkDeletable));
   */
  get bulkDeletable() {
    return (
      (this.inGuild() &&
        Date.now() - this.createdTimestamp < MaxBulkDeletableMessageAge &&
        this.deletable &&
        this.channel?.permissionsFor(this.client.user).has(PermissionFlagsBits.ManageMessages, false)) ??
      false
    );
  }

  /**
   * Whether the message is pinnable by the client user
   * @type {boolean}
   * @readonly
   */
  get pinnable() {
    const { channel } = this;
    return Boolean(
      !this.system &&
        (!this.guild ||
          (channel?.viewable &&
            channel?.permissionsFor(this.client.user)?.has(PermissionFlagsBits.ManageMessages, false))),
    );
  }

  /**
   * Fetches the Message this crosspost/reply/pin-add references, if available to the client
   * @returns {Promise<Message>}
   */
  async fetchReference() {
    if (!this.reference) throw new DiscordjsError(ErrorCodes.MessageReferenceMissing);
    const { channelId, messageId } = this.reference;
    if (!messageId) throw new DiscordjsError(ErrorCodes.MessageReferenceMissing);
    const channel = this.client.channels.resolve(channelId);
    if (!channel) throw new DiscordjsError(ErrorCodes.GuildChannelResolve);
    const message = await channel.messages.fetch(messageId);
    return message;
  }

  /**
   * Whether the message is crosspostable by the client user
   * @type {boolean}
   * @readonly
   */
  get crosspostable() {
    const bitfield =
      PermissionFlagsBits.SendMessages |
      (this.author.id === this.client.user.id ? PermissionsBitField.DefaultBit : PermissionFlagsBits.ManageMessages);
    const { channel } = this;
    return Boolean(
      channel?.type === ChannelType.GuildAnnouncement &&
        !this.flags.has(MessageFlags.Crossposted) &&
        this.type === MessageType.Default &&
        !this.poll &&
        channel.viewable &&
        channel.permissionsFor(this.client.user)?.has(bitfield, false),
    );
  }

  /**
   * Edits the content of the message.
   * @param {string|MessagePayload|MessageEditOptions} options The options to provide
   * @returns {Promise<Message>}
   * @example
   * // Update the content of a message
   * message.edit('This is my new content!')
   *   .then(msg => console.log(`Updated the content of a message to ${msg.content}`))
   *   .catch(console.error);
   */
  async edit(options) {
    if (!this.channel) throw new DiscordjsError(ErrorCodes.ChannelNotCached);
    return this.channel.messages.edit(this, options);
  }

  /**
   * Publishes a message in an announcement channel to all channels following it.
   * @returns {Promise<Message>}
   * @example
   * // Crosspost a message
   * if (message.channel.type === ChannelType.GuildAnnouncement) {
   *   message.crosspost()
   *     .then(() => console.log('Crossposted message'))
   *     .catch(console.error);
   * }
   */
  async crosspost() {
    if (!this.channel) throw new DiscordjsError(ErrorCodes.ChannelNotCached);
    return this.channel.messages.crosspost(this.id);
  }

  /**
   * Pins this message to the channel's pinned messages.
   * @param {string} [reason] Reason for pinning
   * @returns {Promise<Message>}
   * @example
   * // Pin a message
   * message.pin()
   *   .then(console.log)
   *   .catch(console.error)
   */
  async pin(reason) {
    if (!this.channel) throw new DiscordjsError(ErrorCodes.ChannelNotCached);
    await this.channel.messages.pin(this.id, reason);
    return this;
  }

  /**
   * Unpins this message from the channel's pinned messages.
   * @param {string} [reason] Reason for unpinning
   * @returns {Promise<Message>}
   * @example
   * // Unpin a message
   * message.unpin()
   *   .then(console.log)
   *   .catch(console.error)
   */
  async unpin(reason) {
    if (!this.channel) throw new DiscordjsError(ErrorCodes.ChannelNotCached);
    await this.channel.messages.unpin(this.id, reason);
    return this;
  }

  /**
   * Adds a reaction to the message.
   * @param {EmojiIdentifierResolvable} emoji The emoji to react with
   * @returns {Promise<MessageReaction>}
   * @example
   * // React to a message with a unicode emoji
   * message.react('🤔')
   *   .then(console.log)
   *   .catch(console.error);
   * @example
   * // React to a message with a custom emoji
   * message.react(message.guild.emojis.cache.get('123456789012345678'))
   *   .then(console.log)
   *   .catch(console.error);
   */
  async react(emoji) {
    if (!this.channel) throw new DiscordjsError(ErrorCodes.ChannelNotCached);
    await this.channel.messages.react(this.id, emoji);

    return this.client.actions.MessageReactionAdd.handle(
      {
        [this.client.actions.injectedUser]: this.client.user,
        [this.client.actions.injectedChannel]: this.channel,
        [this.client.actions.injectedMessage]: this,
        emoji: resolvePartialEmoji(emoji),
      },
      true,
    ).reaction;
  }

  /**
   * Deletes the message.
   * @returns {Promise<Message>}
   * @example
   * // Delete a message
   * message.delete()
   *   .then(msg => console.log(`Deleted message from ${msg.author.username}`))
   *   .catch(console.error);
   */
  async delete() {
    if (!this.channel) throw new DiscordjsError(ErrorCodes.ChannelNotCached);
    await this.channel.messages.delete(this.id);
    return this;
  }

  /**
   * Options provided when sending a message as an inline reply.
   * @typedef {BaseMessageCreateOptions} MessageReplyOptions
   * @property {boolean} [failIfNotExists=this.client.options.failIfNotExists] Whether to error if the referenced
   * message does not exist (creates a standard message in this case when false)
   */

  /**
   * Send an inline reply to this message.
   * @param {string|MessagePayload|MessageReplyOptions} options The options to provide
   * @returns {Promise<Message>}
   * @example
   * // Reply to a message
   * message.reply('This is a reply!')
   *   .then(() => console.log(`Replied to message "${message.content}"`))
   *   .catch(console.error);
   */
  async reply(options) {
    if (!this.channel) throw new DiscordjsError(ErrorCodes.ChannelNotCached);
    let data;

    if (options instanceof MessagePayload) {
      data = options;
    } else {
      data = MessagePayload.create(this, options, {
        reply: {
          messageReference: this,
          failIfNotExists: options?.failIfNotExists ?? this.client.options.failIfNotExists,
        },
      });
    }
    return this.channel.send(data);
  }

  /**
   * Forwards this message
   *
   * @param {TextBasedChannelResolvable} channel The channel to forward this message to.
   * @returns {Promise<Message>}
   */
  forward(channel) {
    const resolvedChannel = this.client.channels.resolve(channel);
    if (!resolvedChannel) throw new DiscordjsError(ErrorCodes.InvalidType, 'channel', 'TextBasedChannelResolvable');
    return resolvedChannel.send({
      forward: {
        message: this.id,
        channel: this.channelId,
        guild: this.guildId,
      },
    });
  }

  /**
   * Options for starting a thread on a message.
   * @typedef {Object} StartThreadOptions
   * @property {string} name The name of the new thread
   * @property {ThreadAutoArchiveDuration} [autoArchiveDuration=this.channel.defaultAutoArchiveDuration] The amount of
   * time after which the thread should automatically archive in case of no recent activity
   * @property {string} [reason] Reason for creating the thread
   * @property {number} [rateLimitPerUser] The rate limit per user (slowmode) for the thread in seconds
   */

  /**
   * Create a new public thread from this message
   * @see GuildTextThreadManager#create
   * @param {StartThreadOptions} [options] Options for starting a thread on this message
   * @returns {Promise<ThreadChannel>}
   */
  async startThread(options = {}) {
    if (!this.channel) throw new DiscordjsError(ErrorCodes.ChannelNotCached);
    if (![ChannelType.GuildText, ChannelType.GuildAnnouncement].includes(this.channel.type)) {
      throw new DiscordjsError(ErrorCodes.MessageThreadParent);
    }
    if (this.hasThread) throw new DiscordjsError(ErrorCodes.MessageExistingThread);
    return this.channel.threads.create({ ...options, startMessage: this });
  }

  /**
   * Fetch this message.
   * @param {boolean} [force=true] Whether to skip the cache check and request the API
   * @returns {Promise<Message>}
   */
  async fetch(force = true) {
    if (!this.channel) throw new DiscordjsError(ErrorCodes.ChannelNotCached);
    return this.channel.messages.fetch({ message: this.id, force });
  }

  /**
   * Fetches the webhook used to create this message.
   * @returns {Promise<?Webhook>}
   */
  async fetchWebhook() {
    if (!this.webhookId) throw new DiscordjsError(ErrorCodes.WebhookMessage);
    if (this.webhookId === this.applicationId) throw new DiscordjsError(ErrorCodes.WebhookApplication);
    return this.client.fetchWebhook(this.webhookId);
  }

  /**
   * Suppresses or unsuppresses embeds on a message.
   * @param {boolean} [suppress=true] If the embeds should be suppressed or not
   * @returns {Promise<Message>}
   */
  suppressEmbeds(suppress = true) {
    const flags = new MessageFlagsBitField(this.flags.bitfield);

    if (suppress) {
      flags.add(MessageFlags.SuppressEmbeds);
    } else {
      flags.remove(MessageFlags.SuppressEmbeds);
    }

    return this.edit({ flags });
  }

  /**
   * Removes the attachments from this message.
   * @returns {Promise<Message>}
   */
  removeAttachments() {
    return this.edit({ attachments: [] });
  }

  /**
   * Resolves a component by a custom id.
   * @param {string} customId The custom id to resolve against
   * @returns {?MessageActionRowComponent}
   */
  resolveComponent(customId) {
    return findComponentByCustomId(this.components, customId);
  }

  /**
   * Used mainly internally. Whether two messages are identical in properties. If you want to compare messages
   * without checking all the properties, use `message.id === message2.id`, which is much more efficient. This
   * method allows you to see if there are differences in content, embeds, attachments, nonce and tts properties.
   * @param {Message} message The message to compare it to
   * @param {APIMessage} rawData Raw data passed through the WebSocket about this message
   * @returns {boolean}
   */
  equals(message, rawData) {
    if (!message) return false;
    const embedUpdate = !message.author && !message.attachments;
    if (embedUpdate) return this.id === message.id && this.embeds.length === message.embeds.length;

    let equal =
      this.id === message.id &&
      this.author.id === message.author.id &&
      this.content === message.content &&
      this.nonce === message.nonce &&
      this.tts === message.tts &&
      this.attachments.size === message.attachments.size &&
      this.embeds.length === message.embeds.length &&
      this.attachments.every(attachment => message.attachments.has(attachment.id)) &&
      this.embeds.every((embed, index) => embed.equals(message.embeds[index]));

    if (equal && rawData) {
      equal =
        this.mentions.everyone === message.mentions.everyone &&
        this.createdTimestamp === Date.parse(rawData.timestamp) &&
        this.editedTimestamp === Date.parse(rawData.edited_timestamp);
    }

    return equal;
  }

  /**
   * Whether this message is from a guild.
   * @returns {boolean}
   */
  inGuild() {
    return Boolean(this.guildId);
  }

  /**
   * When concatenated with a string, this automatically concatenates the message's content instead of the object.
   * @returns {string}
   * @example
   * // Logs: Message: This is a message!
   * console.log(`Message: ${message}`);
   */
  toString() {
    return this.content;
  }

  toJSON() {
    return super.toJSON({
      channel: 'channelId',
      author: 'authorId',
      groupActivityApplication: 'groupActivityApplicationId',
      guild: 'guildId',
      cleanContent: true,
      member: false,
      reactions: false,
    });
  }
}

exports.Message = Message;
