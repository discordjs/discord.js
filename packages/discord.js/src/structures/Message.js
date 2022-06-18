'use strict';

const { Collection } = require('@discordjs/collection');
const { DiscordSnowflake } = require('@sapphire/snowflake');
const {
  InteractionType,
  ChannelType,
  MessageType,
  MessageFlags,
  PermissionFlagsBits,
} = require('discord-api-types/v10');
const Attachment = require('./Attachment');
const Base = require('./Base');
const ClientApplication = require('./ClientApplication');
const Embed = require('./Embed');
const InteractionCollector = require('./InteractionCollector');
const Mentions = require('./MessageMentions');
const MessagePayload = require('./MessagePayload');
const ReactionCollector = require('./ReactionCollector');
const { Sticker } = require('./Sticker');
const { Error } = require('../errors');
const ReactionManager = require('../managers/ReactionManager');
const { createComponent } = require('../util/Components');
const { NonSystemMessageTypes } = require('../util/Constants');
const MessageFlagsBitField = require('../util/MessageFlagsBitField');
const PermissionsBitField = require('../util/PermissionsBitField');
const { cleanContent, resolvePartialEmoji } = require('../util/Util');

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
       * The content of the message
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
       * A list of embeds in the message - e.g. YouTube Player
       * @type {Embed[]}
       */
      this.embeds = data.embeds.map(e => new Embed(e));
    } else {
      this.embeds = this.embeds?.slice() ?? [];
    }

    if ('components' in data) {
      /**
       * A list of MessageActionRows in the message
       * @type {ActionRow[]}
       */
      this.components = data.components.map(c => createComponent(c));
    } else {
      this.components = this.components?.slice() ?? [];
    }

    if ('attachments' in data) {
      /**
       * A collection of attachments in the message - e.g. Pictures - mapped by their ids
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
        (data.sticker_items ?? data.stickers)?.map(s => [s.id, new Sticker(this.client, s)]),
      );
    } else {
      this.stickers = new Collection(this.stickers);
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
     * * {@link MessageType.ChannelFollowAdd}
     * * {@link MessageType.ChannelPinnedMessage}
     * * {@link MessageType.Reply}
     * * {@link MessageType.ThreadStarterMessage}
     * @see {@link https://discord.com/developers/docs/resources/channel#message-types}
     * @typedef {Object} MessageReference
     * @property {Snowflake} channelId The channel's id the message was referenced
     * @property {?Snowflake} guildId The guild's id the message was referenced
     * @property {?Snowflake} messageId The message's id that was referenced
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
      };
    } else {
      this.reference ??= null;
    }

    if (data.referenced_message) {
      this.channel?.messages._add({ guild_id: data.message_reference?.guild_id, ...data.referenced_message });
    }

    /**
     * Partial data of the interaction that a message is a reply to
     * @typedef {Object} MessageInteraction
     * @property {Snowflake} id The interaction's id
     * @property {InteractionType} type The type of the interaction
     * @property {string} commandName The name of the interaction's application command
     * @property {User} user The user that invoked the interaction
     */

    if (data.interaction) {
      /**
       * Partial data of the interaction that this message is a reply to
       * @type {?MessageInteraction}
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
    return this.channel?.threads?.resolve(this.id) ?? null;
  }

  /**
   * The URL to jump to this message
   * @type {string}
   * @readonly
   */
  get url() {
    return `https://discord.com/channels/${this.guildId ?? '@me'}/${this.channelId}/${this.id}`;
  }

  /**
   * The message contents with all mentions replaced by the equivalent text.
   * If mentions cannot be resolved to a name, the relevant mention in the message content will not be converted.
   * @type {?string}
   * @readonly
   */
  get cleanContent() {
    // eslint-disable-next-line eqeqeq
    return this.content != null ? cleanContent(this.content, this.channel) : null;
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
        else reject(new Error('INTERACTION_COLLECTOR_ERROR', reason));
      });
    });
  }

  /**
   * Whether the message is editable by the client user
   * @type {boolean}
   * @readonly
   */
  get editable() {
    const precheck = Boolean(this.author.id === this.client.user.id && (!this.guild || this.channel?.viewable));
    // Regardless of permissions thread messages cannot be edited if
    // the thread is locked.
    if (this.channel?.isThread()) {
      return precheck && !this.channel.locked;
    }
    return precheck;
  }

  /**
   * Whether the message is deletable by the client user
   * @type {boolean}
   * @readonly
   */
  get deletable() {
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

    return Boolean(
      this.author.id === this.client.user.id ||
        (permissions.has(PermissionFlagsBits.ManageMessages, false) &&
          this.guild.members.me.communicationDisabledUntilTimestamp < Date.now()),
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
    if (!this.reference) throw new Error('MESSAGE_REFERENCE_MISSING');
    const { channelId, messageId } = this.reference;
    const channel = this.client.channels.resolve(channelId);
    if (!channel) throw new Error('GUILD_CHANNEL_RESOLVE');
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
      channel?.type === ChannelType.GuildNews &&
        !this.flags.has(MessageFlags.Crossposted) &&
        this.type === MessageType.Default &&
        channel.viewable &&
        channel.permissionsFor(this.client.user)?.has(bitfield, false),
    );
  }

  /**
   * Options that can be passed into {@link Message#edit}.
   * @typedef {Object} MessageEditOptions
   * @property {?string} [content] Content to be edited
   * @property {Embed[]|APIEmbed[]} [embeds] Embeds to be added/edited
   * @property {MessageMentionOptions} [allowedMentions] Which mentions should be parsed from the message content
   * @property {MessageFlags} [flags] Which flags to set for the message.
   * Only `MessageFlags.SuppressEmbeds` can be edited.
   * @property {Attachment[]} [attachments] An array of attachments to keep,
   * all attachments will be kept if omitted
   * @property {Array<JSONEncodable<AttachmentPayload>>|BufferResolvable[]|Attachment[]|AttachmentBuilder[]} [files]
   * Files to add to the message
   * @property {ActionRow[]|ActionRowOptions[]} [components]
   * Action rows containing interactive components for the message (buttons, select menus)
   */

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
  edit(options) {
    if (!this.channel) return Promise.reject(new Error('CHANNEL_NOT_CACHED'));
    return this.channel.messages.edit(this, options);
  }

  /**
   * Publishes a message in an announcement channel to all channels following it.
   * @returns {Promise<Message>}
   * @example
   * // Crosspost a message
   * if (message.channel.type === ChannelType.GuildNews) {
   *   message.crosspost()
   *     .then(() => console.log('Crossposted message'))
   *     .catch(console.error);
   * }
   */
  crosspost() {
    if (!this.channel) return Promise.reject(new Error('CHANNEL_NOT_CACHED'));
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
    if (!this.channel) throw new Error('CHANNEL_NOT_CACHED');
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
    if (!this.channel) throw new Error('CHANNEL_NOT_CACHED');
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
    if (!this.channel) throw new Error('CHANNEL_NOT_CACHED');
    await this.channel.messages.react(this.id, emoji);

    return this.client.actions.MessageReactionAdd.handle(
      {
        user: this.client.user,
        channel: this.channel,
        message: this,
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
    if (!this.channel) throw new Error('CHANNEL_NOT_CACHED');
    await this.channel.messages.delete(this.id);
    return this;
  }

  /**
   * Options provided when sending a message as an inline reply.
   * @typedef {BaseMessageOptions} ReplyMessageOptions
   * @property {boolean} [failIfNotExists=this.client.options.failIfNotExists] Whether to error if the referenced
   * message does not exist (creates a standard message in this case when false)
   * @property {StickerResolvable[]} [stickers=[]] Stickers to send in the message
   */

  /**
   * Send an inline reply to this message.
   * @param {string|MessagePayload|ReplyMessageOptions} options The options to provide
   * @returns {Promise<Message>}
   * @example
   * // Reply to a message
   * message.reply('This is a reply!')
   *   .then(() => console.log(`Replied to message "${message.content}"`))
   *   .catch(console.error);
   */
  reply(options) {
    if (!this.channel) return Promise.reject(new Error('CHANNEL_NOT_CACHED'));
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
   * A number that is allowed to be the duration (in minutes) of inactivity after which a thread is automatically
   * archived. This can be:
   * * `60` (1 hour)
   * * `1440` (1 day)
   * * `4320` (3 days)
   * * `10080` (7 days)
   * @typedef {number|string} ThreadAutoArchiveDuration
   */

  /**
   * Options for starting a thread on a message.
   * @typedef {Object} StartThreadOptions
   * @property {string} name The name of the new thread
   * @property {ThreadAutoArchiveDuration} [autoArchiveDuration=this.channel.defaultAutoArchiveDuration] The amount of
   * time (in minutes) after which the thread should automatically archive in case of no recent activity
   * @property {string} [reason] Reason for creating the thread
   * @property {number} [rateLimitPerUser] The rate limit per user (slowmode) for the thread in seconds
   */

  /**
   * Create a new public thread from this message
   * @see ThreadManager#create
   * @param {StartThreadOptions} [options] Options for starting a thread on this message
   * @returns {Promise<ThreadChannel>}
   */
  startThread(options = {}) {
    if (!this.channel) return Promise.reject(new Error('CHANNEL_NOT_CACHED'));
    if (![ChannelType.GuildText, ChannelType.GuildNews].includes(this.channel.type)) {
      return Promise.reject(new Error('MESSAGE_THREAD_PARENT'));
    }
    if (this.hasThread) return Promise.reject(new Error('MESSAGE_EXISTING_THREAD'));
    return this.channel.threads.create({ ...options, startMessage: this });
  }

  /**
   * Fetch this message.
   * @param {boolean} [force=true] Whether to skip the cache check and request the API
   * @returns {Promise<Message>}
   */
  fetch(force = true) {
    if (!this.channel) return Promise.reject(new Error('CHANNEL_NOT_CACHED'));
    return this.channel.messages.fetch({ message: this.id, force });
  }

  /**
   * Fetches the webhook used to create this message.
   * @returns {Promise<?Webhook>}
   */
  fetchWebhook() {
    if (!this.webhookId) return Promise.reject(new Error('WEBHOOK_MESSAGE'));
    if (this.webhookId === this.applicationId) return Promise.reject(new Error('WEBHOOK_APPLICATION'));
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
    return this.components.flatMap(row => row.components).find(component => component.customId === customId) ?? null;
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
      this.tts === message.tts &&
      this.nonce === message.nonce &&
      this.embeds.length === message.embeds.length &&
      this.attachments.length === message.attachments.length;

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
