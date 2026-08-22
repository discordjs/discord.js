/* eslint-disable no-lone-blocks, @typescript-eslint/unbound-method, no-param-reassign, id-length */
import type { ChildProcess } from 'node:child_process';
import type { Worker } from 'node:worker_threads';
import {
  type ButtonBuilder,
  type ModalBuilder,
  ActionRowBuilder,
  ChannelSelectMenuBuilder,
  createComponentBuilder,
  EmbedBuilder,
  MentionableSelectMenuBuilder,
  MessageBuilder,
  PrimaryButtonBuilder,
  RoleSelectMenuBuilder,
  StringSelectMenuBuilder,
  TextInputBuilder,
  UserSelectMenuBuilder,
  type ChatInputCommandBuilder,
  type ContextMenuCommandBuilder,
} from '@discordjs/builders';
import type { ReadonlyCollection } from '@discordjs/collection';
import type {
  APIButtonComponent,
  APIButtonComponentWithCustomId,
  APIEmbed,
  APIInteractionDataResolvedChannel,
  APIInteractionDataResolvedGuildMember,
  APIInteractionGuildMember,
  APIPartialChannel,
  APIPartialGuild,
  APIRole,
  APISelectMenuComponent,
  APIStringSelectComponent,
  APITextInputComponent,
  Locale,
  ThreadChannelType,
  WebhookType,
} from 'discord-api-types/v10';
import {
  ApplicationCommandOptionType,
  ApplicationCommandPermissionType,
  ApplicationCommandType,
  ApplicationIntegrationType,
  AuditLogEvent,
  ButtonStyle,
  ChannelType,
  ComponentType,
  GatewayIntentBits,
  GuildScheduledEventRecurrenceRuleFrequency,
  GuildScheduledEventRecurrenceRuleMonth,
  GuildScheduledEventRecurrenceRuleWeekday,
  InteractionType,
  MessageFlags,
  PermissionFlagsBits,
  TextInputStyle,
} from 'discord-api-types/v10';
import { expect } from 'tstyche';
import type {
  ActionRow,
  ActionRowComponent,
  ActionRowData,
  AnnouncementChannel,
  AnyThreadChannel,
  ApplicationCommand,
  ApplicationCommandAttachmentOption,
  ApplicationCommandAttachmentOptionData,
  ApplicationCommandChannelOption,
  ApplicationCommandChannelOptionData,
  ApplicationCommandChoicesData,
  ApplicationCommandChoicesOption,
  ApplicationCommandData,
  ApplicationCommandManager,
  ApplicationCommandOptionData,
  ApplicationCommandPermissionsManager,
  ApplicationCommandResolvable,
  ApplicationCommandSubCommand,
  ApplicationCommandSubCommandData,
  ApplicationCommandSubGroup,
  ApplicationCommandSubGroupData,
  ApplicationEmoji,
  ApplicationEmojiManager,
  Attachment,
  AuditLogChange,
  AutoModerationActionExecution,
  AutoModerationRule,
  AutoModerationRuleManager,
  Awaitable,
  ButtonComponent,
  ButtonComponentData,
  ButtonInteraction,
  CacheType,
  CategoryChannel,
  CategoryChannelChildManager,
  Channel,
  ChannelFlagsBitField,
  ChannelMention,
  ChannelSelectMenuComponent,
  ChannelSelectMenuInteraction,
  ChatInputApplicationCommandData,
  ChatInputCommandInteraction,
  ClientApplication,
  ClientUser,
  CollectedMessageInteraction,
  Collector,
  CommandInteraction,
  CommandInteractionOption,
  CommandInteractionOptionResolver,
  CommandOptionNonChoiceResolvableType,
  ContainerComponentData,
  ContextMenuCommandInteraction,
  DirectoryChannel,
  DMChannel,
  DMMessageManager,
  Embed,
  Emoji,
  Entitlement,
  FetchedThreads,
  FetchedThreadsMore,
  FetchPinnedMessagesResponse,
  FileComponentData,
  FileUploadComponentData,
  ForumChannel,
  Guild,
  GuildApplicationCommandManager,
  GuildAuditLogs,
  GuildAuditLogsActionType,
  GuildAuditLogsEntry,
  GuildAuditLogsTargetType,
  GuildBan,
  GuildBanManager,
  GuildBasedChannel,
  GuildChannelManager,
  GuildEmoji,
  GuildEmojiManager,
  GuildForumThreadManager,
  GuildMember,
  GuildMemberFlagsBitField,
  GuildMemberManager,
  GuildMessageManager,
  GuildOnboarding,
  GuildResolvable,
  GuildScheduledEventManager,
  GuildScheduledEventRecurrenceRuleOptions,
  GuildTextBasedChannel,
  GuildTextThreadManager,
  Interaction,
  InteractionCallbackResponse,
  InteractionCollector,
  InteractionWebhook,
  MediaChannel,
  MediaGalleryComponentData,
  MediaGalleryItemData,
  MentionableSelectMenuComponent,
  MentionableSelectMenuInteraction,
  Message,
  MessageActionRowComponent,
  MessageActionRowComponentData,
  MessageCollector,
  MessageComponentInteraction,
  MessageContextMenuCommandInteraction,
  MessageManager,
  MessageMentions,
  MessageReaction,
  ModalSubmitInteraction,
  NonThreadGuildBasedChannel,
  PartialDMChannel,
  PartialGroupDMChannel,
  PartialGuildMember,
  PartialMessage,
  PartialMessageReaction,
  PartialPoll,
  PartialPollAnswer,
  PartialThreadMember,
  PartialUser,
  Poll,
  PollAnswer,
  PollAnswerVoterManager,
  PollData,
  PrimaryEntryPointCommandInteraction,
  PrivateThreadChannel,
  PublicThreadChannel,
  ReactionCollector,
  RepliableInteraction,
  Role,
  RoleManager,
  RoleSelectMenuComponent,
  RoleSelectMenuInteraction,
  SectionComponentData,
  SelectMenuInteraction,
  SendableChannels,
  SendMethod,
  SeparatorComponentData,
  Serialized,
  Shard,
  ShardClientUtil,
  ShardingManager,
  SKU,
  Snowflake,
  StageChannel,
  StageInstance,
  StickerPack,
  StringSelectMenuComponent,
  StringSelectMenuComponentData,
  StringSelectMenuInteraction,
  TextBasedChannel,
  TextBasedChannelTypes,
  ThreadManager,
  TextChannel,
  TextInputComponent,
  ThreadChannel,
  ThreadMember,
  ThreadMemberFlagsBitField,
  ThreadMemberManager,
  ThreadOnlyChannel,
  Typing,
  User,
  VoiceBasedChannel,
  VoiceChannel,
  Invite,
  GuildInvite,
  AuthorizingIntegrationOwners,
  VoiceServerUpdateData,
  TextDisplayComponentData,
  ThumbnailComponentData,
  UnfurledMediaItemData,
  UserContextMenuCommandInteraction,
  UserMention,
  UserSelectMenuComponent,
  UserSelectMenuInteraction,
  Webhook,
} from './index.js';
import {
  Client,
  Collection,
  Events,
  IntentsBitField,
  Options,
  PermissionsBitField,
  Status,
  resolveColor,
  ShardEvents,
} from './index.js';

// Test type transformation:
declare const serialize: <Value>(value: Value) => Serialized<Value>;
declare const notPropertyOf: <Value, Property extends PropertyKey>(
  value: Value,
  property: Exclude<Property, keyof Value> & Property,
) => void;

const client: Client = new Client({
  intents: GatewayIntentBits.Guilds,
  makeCache: Options.cacheWithLimits({
    MessageManager: 200,
    // @ts-expect-error Object literal may only specify known properties, and 'Message' does not exist in type 'CacheWithLimitsOptions'.
    Message: 100,
    GuildMemberManager: {
      maxSize: 200,
      keepOverLimit: member => member.id === client.user?.id,
    },
    ThreadManager: {
      maxSize: 200,
      keepOverLimit: value => !value.archived,
    },
  }),
});

if (client.isReady()) {
  expect(client).type.toBe<Client<true>>();
} else {
  expect(client).type.toBe<Client>();
}

expect(client.fetchInvite('https://discord.gg/djs')).type.toBe<Promise<Invite>>();
expect(client.fetchInvite('https://discord.gg/djs', { withCounts: true })).type.toBe<Promise<Invite<true>>>();
expect(client.fetchInvite('https://discord.gg/djs', { withCounts: false })).type.not.toBe<Promise<Invite<true>>>();

const testGuildId = '222078108977594368'; // DJS
const testUserId = '987654321098765432'; // example id
const globalCommandId = '123456789012345678'; // example id
const guildCommandId = '234567890123456789'; // example id

client.on('autoModerationActionExecution', autoModerationActionExecution =>
  expect(autoModerationActionExecution).type.toBe<AutoModerationActionExecution>(),
);

client.on('autoModerationRuleCreate', ({ client }) => expect(client).type.toBe<Client<true>>());
client.on('autoModerationRuleDelete', ({ client }) => expect(client).type.toBe<Client<true>>());

client.on('autoModerationRuleUpdate', (oldAutoModerationRule, { client: newClient }) => {
  expect(oldAutoModerationRule!.client).type.toBe<Client<true>>();
  expect(newClient).type.toBe<Client<true>>();
});

client.on('channelCreate', ({ client }) => expect(client).type.toBe<Client<true>>());
client.on('channelDelete', ({ client }) => expect(client).type.toBe<Client<true>>());
client.on('channelPinsUpdate', ({ client }) => expect(client).type.toBe<Client<true>>());

client.on('channelUpdate', ({ client: oldClient }, { client: newClient }) => {
  expect(oldClient).type.toBe<Client<true>>();
  expect(newClient).type.toBe<Client<true>>();
});

client.on('emojiCreate', ({ client }) => expect(client).type.toBe<Client<true>>());
client.on('emojiDelete', ({ client }) => expect(client).type.toBe<Client<true>>());

client.on('emojiUpdate', ({ client: oldClient }, { client: newClient }) => {
  expect(oldClient).type.toBe<Client<true>>();
  expect(newClient).type.toBe<Client<true>>();
});

client.on('guildBanAdd', ({ client }) => expect(client).type.toBe<Client<true>>());
client.on('guildBanRemove', ({ client }) => expect(client).type.toBe<Client<true>>());
client.on('guildDelete', ({ client }) => expect(client).type.toBe<Client<true>>());
client.on('guildIntegrationsUpdate', ({ client }) => expect(client).type.toBe<Client<true>>());
client.on('guildMemberAdd', ({ client }) => expect(client).type.toBe<Client<true>>());
client.on('guildMemberAvailable', ({ client }) => expect(client).type.toBe<Client<true>>());

client.on('guildMemberRemove', member => {
  expect(member.client).type.toBe<Client<true>>();
  if (member.partial) {
    expect(member.joinedAt).type.toBe<null>();
    return;
  }

  expect(member.joinedAt).type.toBe<Date | null>();
});

client.on('guildMembersChunk', (members, { client }) => {
  expect(members.first()!.client).type.toBe<Client<true>>();
  expect(client).type.toBe<Client<true>>();
});

client.on('guildMemberUpdate', ({ client: oldClient }, { client: newClient }) => {
  expect(oldClient).type.toBe<Client<true>>();
  expect(newClient).type.toBe<Client<true>>();
});

client.on('guildScheduledEventCreate', ({ client }) => expect(client).type.toBe<Client<true>>());
client.on('guildScheduledEventDelete', ({ client }) => expect(client).type.toBe<Client<true>>());

client.on('guildScheduledEventUpdate', (oldGuildScheduledEvent, { client }) => {
  expect(oldGuildScheduledEvent!.client).type.toBe<Client<true>>();
  expect(client).type.toBe<Client<true>>();
});

client.on('guildScheduledEventUserAdd', ({ client: oldClient }, { client: newClient }) => {
  expect(oldClient).type.toBe<Client<true>>();
  expect(newClient).type.toBe<Client<true>>();
});

client.on('guildScheduledEventUserRemove', ({ client: oldClient }, { client: newClient }) => {
  expect(oldClient).type.toBe<Client<true>>();
  expect(newClient).type.toBe<Client<true>>();
});

client.on('guildUnavailable', ({ client }) => expect(client).type.toBe<Client<true>>());

client.on('guildUpdate', ({ client: oldClient }, { client: newClient }) => {
  expect(oldClient).type.toBe<Client<true>>();
  expect(newClient).type.toBe<Client<true>>();
});

client.on('interactionCreate', async interaction => {
  expect(interaction.client).type.toBe<Client<true>>();
  expect(interaction.guildId).type.toBe<Snowflake | null>();
  expect(interaction.channelId).type.toBe<Snowflake | null>();
  expect(interaction.member).type.toBe<APIInteractionGuildMember | GuildMember | null>();

  if (interaction.type === InteractionType.MessageComponent) {
    expect(interaction.channelId).type.toBe<Snowflake>();
  }

  if (interaction.type !== InteractionType.ApplicationCommand) return;

  const button = { custom_id: '123', label: 'test', style: ButtonStyle.Primary, type: ComponentType.Button } as const;

  const actionRow = new ActionRowBuilder({
    type: ComponentType.ActionRow,
    components: [button],
  });

  expect(interaction.reply).type.toBeCallableWith({ content: 'Hi!', components: [actionRow] });

  expect(interaction.reply).type.not.toBeCallableWith({ content: 'Hi!', components: [[button]] });

  expect(ActionRowBuilder).type.toBeConstructableWith({});

  expect(interaction.reply).type.not.toBeCallableWith({ content: 'Hi!', components: [button] });

  expect(interaction.reply).type.toBeCallableWith({
    content: 'test',
    components: [
      {
        components: [
          {
            custom_id: 'abc',
            label: 'abc',
            style: ButtonStyle.Primary,
            type: ComponentType.Button,
          },
        ],
        type: ComponentType.ActionRow,
      },
    ],
  });

  // This is for testing never type resolution
  if (!interaction.inGuild()) {
    return;
  }

  if (interaction.inRawGuild()) {
    expect(interaction).type.not.toBe<never>();
    return;
  }

  if (interaction.inCachedGuild()) {
    expect(interaction).type.not.toBe<never>();
  }
});

client.on('inviteCreate', invite => {
  expect(invite).type.toBe<GuildInvite>();
  expect(invite.client).type.toBe<Client<true>>();
});

client.on('inviteDelete', invite => {
  expect(invite).type.toBe<GuildInvite>();
  expect(invite.client).type.toBe<Client<true>>();
});

// This is to check that stuff is the right type
declare const assertIsMessage: (m: Promise<Message>) => void;

client.on('messageCreate', async message => {
  const { client, channel } = message;

  // https://github.com/discordjs/discord.js/issues/8545
  {
    // These should not throw any errors when comparing messages from any source.
    channel.messages.cache.filter(Boolean);
    (await channel.messages.fetch()).filter(({ author }) => author.id === message.author.id);

    if (channel.isDMBased()) {
      expect(channel.messages.channel.messages).type.toBe<DMMessageManager>();
    } else {
      expect(channel.messages.channel.messages).type.toBe<GuildMessageManager>();
    }
  }

  if (!message.inGuild() && message.partial) {
    expect(message).type.not.toBe<never>();
  }

  expect(client).type.toBe<Client<true>>();
  assertIsMessage(channel.send('string'));
  assertIsMessage(channel.send({}));
  assertIsMessage(channel.send({ embeds: [] }));

  assertIsMessage(client.channels.createMessage(channel, 'string'));
  assertIsMessage(client.channels.createMessage(channel, {}));
  assertIsMessage(client.channels.createMessage(channel, { embeds: [] }));

  const embed = new EmbedBuilder();
  assertIsMessage(channel.send({ embeds: [embed] }));
  assertIsMessage(client.channels.createMessage(channel, { embeds: [embed] }));

  if (message.inGuild()) {
    expect(message).type.toBeAssignableTo<Message<true>>();
    const component = await message.awaitMessageComponent({ componentType: ComponentType.Button });
    expect(component).type.toBe<ButtonInteraction<'cached'>>();
    expect(await component.reply({ withResponse: true })).type.toBe<InteractionCallbackResponse<true>>();

    const buttonCollector = message.createMessageComponentCollector({ componentType: ComponentType.Button });
    expect(buttonCollector).type.toBe<InteractionCollector<ButtonInteraction<'cached'>>>();
    expect(buttonCollector.filter).type.toBeAssignableTo<
      (
        test: ButtonInteraction<'cached'>,
        items: Collection<Snowflake, ButtonInteraction<'cached'>>,
      ) => Awaitable<boolean>
    >();
    expect(message.channel).type.toBe<GuildTextBasedChannel>();
    expect(message.guild).type.toBe<Guild>();
    expect(message.member).type.toBe<GuildMember | null>();

    expect(message.mentions).type.toBe<MessageMentions<true>>();
    expect(message.guild).type.toBe<Guild>();
    expect(message.mentions.members).type.toBe<Collection<Snowflake, GuildMember>>();
  }

  expect(message.channel).type.toBe<Exclude<TextBasedChannel, PartialGroupDMChannel>>();
  expect(message.channel).type.not.toBe<GuildTextBasedChannel>();

  expect(channel.send).type.not.toBeCallableWith();
  expect(client.channels.createMessage).type.not.toBeCallableWith();
  expect(channel.send).type.not.toBeCallableWith({ another: 'property' });
  expect(client.channels.createMessage).type.not.toBeCallableWith({ another: 'property' });
  expect(client.channels.createMessage).type.not.toBeCallableWith('string');
  // Check collector creations.

  // Verify that buttons interactions are inferred.
  const buttonCollector = message.createMessageComponentCollector({ componentType: ComponentType.Button });
  expect(message.awaitMessageComponent({ componentType: ComponentType.Button })).type.toBeAssignableTo<
    Promise<ButtonInteraction>
  >();
  expect(channel.awaitMessageComponent({ componentType: ComponentType.Button })).type.toBeAssignableTo<
    Promise<ButtonInteraction>
  >();
  expect(buttonCollector).type.toBeAssignableTo<InteractionCollector<ButtonInteraction>>();

  buttonCollector.on('collect', (...args) => expect(args).type.toBe<[ButtonInteraction]>());
  buttonCollector.on('dispose', (...args) => expect(args).type.toBe<[ButtonInteraction]>());
  buttonCollector.on('end', (...args) =>
    expect(args).type.toBe<[ReadonlyCollection<Snowflake, ButtonInteraction>, string]>(),
  );

  // Verify that select menus interaction are inferred.
  const stringSelectMenuCollector = message.createMessageComponentCollector({
    componentType: ComponentType.StringSelect,
  });
  expect(message.awaitMessageComponent({ componentType: ComponentType.StringSelect })).type.toBeAssignableTo<
    Promise<StringSelectMenuInteraction>
  >();
  expect(channel.awaitMessageComponent({ componentType: ComponentType.StringSelect })).type.toBeAssignableTo<
    Promise<StringSelectMenuInteraction>
  >();
  expect(stringSelectMenuCollector).type.toBeAssignableTo<InteractionCollector<StringSelectMenuInteraction>>();

  stringSelectMenuCollector.on('collect', (...args) => expect(args).type.toBe<[StringSelectMenuInteraction]>());
  stringSelectMenuCollector.on('dispose', (...args) => expect(args).type.toBe<[StringSelectMenuInteraction]>());
  stringSelectMenuCollector.on('end', (...args) =>
    expect(args).type.toBe<[ReadonlyCollection<Snowflake, StringSelectMenuInteraction>, string]>(),
  );

  // Verify that message component interactions are default collected types.
  const defaultCollector = message.createMessageComponentCollector();
  expect(message.awaitMessageComponent()).type.toBeAssignableTo<Promise<MessageComponentInteraction>>();
  expect(channel.awaitMessageComponent()).type.toBeAssignableTo<Promise<MessageComponentInteraction>>();
  expect(defaultCollector).type.toBeAssignableTo<InteractionCollector<CollectedMessageInteraction>>();

  defaultCollector.on('collect', (...args) => expect(args).type.toBe<[ButtonInteraction | SelectMenuInteraction]>());
  defaultCollector.on('dispose', (...args) => expect(args).type.toBe<[ButtonInteraction | SelectMenuInteraction]>());
  // TODO: uncomment once tstyche supports this test
  /* defaultCollector.on('end', (...args) =>
    expect(args).type.toBe<[ReadonlyCollection<Snowflake, ButtonInteraction | SelectMenuInteraction>, string]>(),
  ); */

  // Verify that additional options don't affect default collector types.
  const semiDefaultCollector = message.createMessageComponentCollector({ time: 10_000 });
  expect(semiDefaultCollector).type.toBe<InteractionCollector<CollectedMessageInteraction>>();
  const semiDefaultCollectorChannel = channel.createMessageComponentCollector({ time: 10_000 });
  expect(semiDefaultCollectorChannel).type.toBe<InteractionCollector<CollectedMessageInteraction>>();

  // Verify that interaction collector options can't be used.
  expect(message.createMessageComponentCollector).type.not.toBeCallableWith({
    interactionType: InteractionType.ApplicationCommand,
  });

  // Make sure filter parameters are properly inferred.
  message.createMessageComponentCollector({
    filter: i => {
      expect(i).type.toBe<CollectedMessageInteraction>();
      return true;
    },
  });

  message.createMessageComponentCollector({
    componentType: ComponentType.Button,
    filter: i => {
      expect(i).type.toBe<ButtonInteraction>();
      return true;
    },
  });

  message.createMessageComponentCollector({
    componentType: ComponentType.StringSelect,
    filter: i => {
      expect(i).type.toBe<StringSelectMenuInteraction>();
      return true;
    },
  });

  await message.awaitMessageComponent({
    filter: i => {
      expect(i).type.toBe<CollectedMessageInteraction>();
      return true;
    },
  });

  await message.awaitMessageComponent({
    componentType: ComponentType.Button,
    filter: i => {
      expect(i).type.toBe<ButtonInteraction>();
      return true;
    },
  });

  await message.awaitMessageComponent({
    componentType: ComponentType.StringSelect,
    filter: i => {
      expect(i).type.toBe<StringSelectMenuInteraction>();
      return true;
    },
  });

  const webhook = await message.fetchWebhook();

  if (webhook.isChannelFollower()) {
    expect(webhook.sourceGuild).type.toBeAssignableTo<APIPartialGuild | Guild>();
    expect(webhook.sourceChannel).type.toBeAssignableTo<AnnouncementChannel | APIPartialChannel>();
    expect(webhook).type.toBe<Webhook<WebhookType.ChannelFollower>>();
  } else if (webhook.isIncoming()) {
    expect(webhook.token).type.toBe<string>();
    expect(webhook).type.toBe<Webhook<WebhookType.Incoming>>();
  }

  expect(webhook.sourceGuild).type.not.toBe<APIPartialGuild | Guild>();
  expect(webhook.sourceChannel).type.not.toBe<AnnouncementChannel | APIPartialChannel>();
  expect(webhook.token).type.not.toBe<string>();

  await channel.awaitMessageComponent({
    filter: i => {
      expect(i).type.toBe<CollectedMessageInteraction<'cached'>>();
      return true;
    },
  });

  await channel.awaitMessageComponent({
    componentType: ComponentType.Button,
    filter: i => {
      expect(i).type.toBe<ButtonInteraction<'cached'>>();
      return true;
    },
  });

  await channel.awaitMessageComponent({
    componentType: ComponentType.StringSelect,
    filter: i => {
      expect(i).type.toBe<StringSelectMenuInteraction<'cached'>>();
      return true;
    },
  });

  // Check that both builders and builder data can be sent in messages
  const row = new ActionRowBuilder();

  const rawButtonsRow: ActionRowData<ButtonComponentData> = {
    type: ComponentType.ActionRow,
    components: [
      { type: ComponentType.Button, label: 'test', style: ButtonStyle.Primary, customId: 'test' },
      {
        type: ComponentType.Button,
        label: 'another test',
        style: ButtonStyle.Link,
        url: 'https://discord.js.org',
      },
    ],
  };

  const buttonsRow: ActionRowData<ButtonBuilder> = {
    type: ComponentType.ActionRow,
    components: [new PrimaryButtonBuilder()],
  };

  const rawStringSelectMenuRow: ActionRowData<StringSelectMenuComponentData> = {
    type: ComponentType.ActionRow,
    components: [
      {
        type: ComponentType.StringSelect,
        options: [{ label: 'test', value: 'test' }],
        customId: 'test',
      },
    ],
  };

  const stringSelectRow: ActionRowData<StringSelectMenuBuilder> = {
    type: ComponentType.ActionRow,
    components: [new StringSelectMenuBuilder()],
  };

  const embedData = { description: 'test', color: 0xff0000 };

  await client.channels.createMessage(channel, {
    components: [row, rawButtonsRow, buttonsRow, rawStringSelectMenuRow, stringSelectRow],
    embeds: [embed, embedData],
  });

  const rawTextDisplay: TextDisplayComponentData = {
    type: ComponentType.TextDisplay,
    content: 'test',
  };

  const rawMedia: UnfurledMediaItemData = { url: 'https://discord.js.org' };

  const rawThumbnail: ThumbnailComponentData = {
    type: ComponentType.Thumbnail,
    media: rawMedia,
    spoiler: true,
    description: 'test',
  };

  const rawSection: SectionComponentData = {
    type: ComponentType.Section,
    components: [rawTextDisplay],
    accessory: rawThumbnail,
  };

  const rawMediaGalleryItem: MediaGalleryItemData = {
    media: rawMedia,
    description: 'test',
    spoiler: false,
  };

  const rawMediaGallery: MediaGalleryComponentData = {
    type: ComponentType.MediaGallery,
    items: [rawMediaGalleryItem, rawMediaGalleryItem, rawMediaGalleryItem],
  };

  const rawSeparator: SeparatorComponentData = {
    type: ComponentType.Separator,
    spacing: 1,
    divider: false,
  };

  const rawFile: FileComponentData = {
    type: ComponentType.File,
    file: rawMedia,
  };

  const rawContainer: ContainerComponentData = {
    type: ComponentType.Container,
    components: [rawSection, rawSeparator, rawMediaGallery, rawFile],
    accentColor: 0xff00ff,
    spoiler: true,
  };

  await channel.send({ flags: MessageFlags.IsComponentsV2, components: [rawContainer] });
});

client.on('messageDelete', ({ client }) => expect(client).type.toBe<Client<true>>());

client.on('messageDeleteBulk', (messages, { client }) => {
  expect(messages.first()!.client).type.toBe<Client<true>>();
  expect(client).type.toBe<Client<true>>();
});

client.on('messagePollVoteAdd', async (answer, userId) => {
  expect(answer.client).type.toBe<Client<true>>();
  expect(userId).type.toBe<Snowflake>();

  if (answer.partial) {
    expect(answer.emoji).type.toBe<null>();
    expect(answer.text).type.toBe<null>();
    expect(answer.id).type.not.toBe<null>();
    expect(answer.poll).type.not.toBe<null>();

    await answer.poll.fetch();
    const response = answer.poll.answers?.get(answer.id) ?? answer;

    expect(response.voters.cache.get(userId)!).type.toBe<User>();
  }

  expect(answer.text).type.toBe<string | null>();
  expect(answer.emoji).type.toBe<Emoji | GuildEmoji | null>();
  expect(answer.id).type.toBe<number>();
  expect(answer.voteCount!).type.toBe<number>();
});

client.on('messagePollVoteRemove', async (answer, userId) => {
  expect(answer.client).type.toBe<Client<true>>();
  expect(userId).type.toBe<Snowflake>();

  if (answer.partial) {
    expect(answer.emoji).type.toBe<null>();
    expect(answer.text).type.toBe<null>();
    expect(answer.id).type.not.toBe<null>();
    expect(answer.poll).type.not.toBe<null>();

    await answer.poll.fetch();
    answer = answer.poll.answers?.get(answer.id) ?? answer;
  }

  expect(answer.text).type.toBe<string | null>();
  expect(answer.emoji).type.toBe<Emoji | GuildEmoji | null>();
  expect(answer.id).type.toBe<number>();
  expect(answer.voteCount!).type.toBe<number>();
});

client.on('messageReactionAdd', async (reaction, { client }) => {
  expect(reaction.client).type.toBe<Client<true>>();
  expect(client).type.toBe<Client<true>>();

  if (reaction.partial) {
    expect(reaction.count).type.toBe<null>();
    reaction = await reaction.fetch();
  }

  expect(reaction.count).type.toBe<number>();
  if (reaction.message.partial) {
    expect(reaction.message.content).type.toBe<string | null>();
    return;
  }

  expect(reaction.message.content).type.toBe<string>();
});

client.on('messageReactionRemove', ({ client: oldClient }, { client: newClient }) => {
  expect(oldClient).type.toBe<Client<true>>();
  expect(newClient).type.toBe<Client<true>>();
});

client.on('messageReactionRemoveAll', async (message, reactions) => {
  console.log(`messageReactionRemoveAll - id: ${message.id} (${message.id.length})`);
  if (message.partial) message = await message.fetch();
  console.log(`messageReactionRemoveAll - content: ${message.content}`);
  expect(message.client).type.toBe<Client<true>>();
  expect(reactions.first()!.client).type.toBe<Client<true>>();
});

client.on('messageReactionRemoveEmoji', ({ client }) => expect(client).type.toBe<Client<true>>());

client.on('messageUpdate', ({ client: oldClient }, { client: newClient }) => {
  expect(oldClient).type.toBe<Client<true>>();
  expect(newClient).type.toBe<Client<true>>();
});

client.on('presenceUpdate', (oldPresence, { client }) => {
  expect(oldPresence!.client).type.toBe<Client<true>>();
  expect(client).type.toBe<Client<true>>();
});

declare const slashCommandBuilder: ChatInputCommandBuilder;
declare const contextMenuCommandBuilder: ContextMenuCommandBuilder;
declare const guild: Guild;

client.on('clientReady', async client => {
  expect(client).type.toBe<Client<true>>();
  console.log(`Client is logged in as ${client.user.tag} and ready!`);

  // Test fetching all global commands and ones from one guild
  expect(await client.application!.commands.fetch()).type.toBe<
    Collection<string, ApplicationCommand<{ guild: GuildResolvable }>>
  >();
  expect(await client.application!.commands.fetch({ guildId: testGuildId })).type.toBe<
    Collection<string, ApplicationCommand<{ guild: GuildResolvable }>>
  >();

  // Test command manager methods
  const globalCommand = await client.application!.commands.fetch(globalCommandId);
  const guildCommandFromGlobal = await client.application!.commands.fetch({ id: guildCommandId, guildId: testGuildId });
  const guildCommandFromGuild = await client.guilds.cache.get(testGuildId)!.commands.fetch({ id: guildCommandId });

  await client.application?.commands.create(slashCommandBuilder);
  await client.application?.commands.create(contextMenuCommandBuilder);
  await guild.commands.create(slashCommandBuilder);
  await guild.commands.create(contextMenuCommandBuilder);

  await client.application?.commands.edit(globalCommandId, slashCommandBuilder);
  await client.application?.commands.edit(globalCommandId, contextMenuCommandBuilder);
  await guild.commands.edit(guildCommandId, slashCommandBuilder);
  await guild.commands.edit(guildCommandId, contextMenuCommandBuilder);

  await client.application?.commands.edit(globalCommandId, { defaultMemberPermissions: null });
  await globalCommand.edit({ defaultMemberPermissions: null });
  await globalCommand.setDefaultMemberPermissions(null);

  expect(client.guilds.cache.get(testGuildId)!.commands.fetch).type.not.toBeCallableWith(guildCommandId, {
    guildId: testGuildId,
  });

  // Test command permissions
  const globalPermissionsManager = client.application!.commands.permissions;
  const guildPermissionsManager = client.guilds.cache.get(testGuildId)!.commands.permissions;

  // Permissions from global manager
  await globalPermissionsManager.add({
    command: globalCommandId,
    guild: testGuildId,
    permissions: [{ type: ApplicationCommandPermissionType.Role, id: testGuildId, permission: true }],
    token: 'VeryRealToken',
  });
  await globalPermissionsManager.has({ command: globalCommandId, guild: testGuildId, permissionId: testGuildId });
  await globalPermissionsManager.fetch({ guild: testGuildId });
  await globalPermissionsManager.fetch({ command: globalCommandId, guild: testGuildId });
  await globalPermissionsManager.remove({
    command: globalCommandId,
    guild: testGuildId,
    roles: [testGuildId],
    token: 'VeryRealToken',
  });
  await globalPermissionsManager.remove({
    command: globalCommandId,
    guild: testGuildId,
    users: [testUserId],
    token: 'VeryRealToken',
  });
  await globalPermissionsManager.remove({
    command: globalCommandId,
    guild: testGuildId,
    channels: [testGuildId],
    token: 'VeryRealToken',
  });
  await globalPermissionsManager.remove({
    command: globalCommandId,
    guild: testGuildId,
    roles: [testGuildId],
    users: [testUserId],
    channels: [testGuildId],
    token: 'VeryRealToken',
  });
  await globalPermissionsManager.set({
    command: globalCommandId,
    guild: testGuildId,
    permissions: [{ type: ApplicationCommandPermissionType.Role, id: testGuildId, permission: true }],
    token: 'VeryRealToken',
  });

  expect(globalPermissionsManager.add).type.not.toBeCallableWith({
    command: globalCommandId,
    permissions: [{ type: ApplicationCommandPermissionType.Role, id: testGuildId, permission: true }],
    token: 'VeryRealToken',
  });

  expect(globalPermissionsManager.has).type.not.toBeCallableWith({
    command: globalCommandId,
    permissionId: testGuildId,
  });
  expect(globalPermissionsManager.fetch).type.not.toBeCallableWith();
  expect(globalPermissionsManager.fetch).type.not.toBeCallableWith({ command: globalCommandId });
  expect(globalPermissionsManager.remove).type.not.toBeCallableWith({
    command: globalCommandId,
    roles: [testGuildId],
    token: 'VeryRealToken',
  });
  expect(globalPermissionsManager.remove).type.not.toBeCallableWith({
    command: globalCommandId,
    users: [testUserId],
    token: 'VeryRealToken',
  });
  expect(globalPermissionsManager.remove).type.not.toBeCallableWith({
    command: globalCommandId,
    roles: [testGuildId],
    users: [testUserId],
    token: 'VeryRealToken',
  });
  expect(globalPermissionsManager.set).type.not.toBeCallableWith({
    command: globalCommandId,
    permissions: [{ type: ApplicationCommandPermissionType.Role, id: testGuildId, permission: true }],
    token: 'VeryRealToken',
  });

  expect(globalPermissionsManager.add).type.not.toBeCallableWith({
    guild: testGuildId,
    permissions: [{ type: ApplicationCommandPermissionType.Role, id: testGuildId, permission: true }],
    token: 'VeryRealToken',
  });
  expect(globalPermissionsManager.has).type.not.toBeCallableWith({ guild: testGuildId, permissionId: testGuildId });
  expect(globalPermissionsManager.remove).type.not.toBeCallableWith({
    guild: testGuildId,
    roles: [testGuildId],
    token: 'VeryRealToken',
  });
  expect(globalPermissionsManager.remove).type.not.toBeCallableWith({
    guild: testGuildId,
    users: [testUserId],
    token: 'VeryRealToken',
  });
  expect(globalPermissionsManager.remove).type.not.toBeCallableWith({
    guild: testGuildId,
    roles: [testGuildId],
    users: [testUserId],
    token: 'VeryRealToken',
  });
  expect(globalPermissionsManager.set).type.not.toBeCallableWith({
    guild: testGuildId,
    permissions: [{ type: ApplicationCommandPermissionType.Role, id: testGuildId, permission: true }],
    token: 'VeryRealToken',
  });

  // Permissions from guild manager
  await guildPermissionsManager.add({
    command: globalCommandId,
    permissions: [{ type: ApplicationCommandPermissionType.Role, id: testGuildId, permission: true }],
    token: 'VeryRealToken',
  });
  await guildPermissionsManager.has({ command: globalCommandId, permissionId: testGuildId });
  await guildPermissionsManager.fetch({});
  await guildPermissionsManager.fetch({ command: globalCommandId });
  await guildPermissionsManager.remove({ command: globalCommandId, roles: [testGuildId], token: 'VeryRealToken' });
  await guildPermissionsManager.remove({ command: globalCommandId, users: [testUserId], token: 'VeryRealToken' });
  await guildPermissionsManager.remove({ command: globalCommandId, channels: [testGuildId], token: 'VeryRealToken' });
  await guildPermissionsManager.remove({
    command: globalCommandId,
    roles: [testGuildId],
    users: [testUserId],
    channels: [testGuildId],
    token: 'VeryRealToken',
  });
  await guildPermissionsManager.set({
    command: globalCommandId,
    permissions: [{ type: ApplicationCommandPermissionType.Role, id: testGuildId, permission: true }],
    token: 'VeryRealToken',
  });

  expect(guildPermissionsManager.add).type.not.toBeCallableWith({
    command: globalCommandId,
    guild: testGuildId,
    permissions: [{ type: ApplicationCommandPermissionType.Role, id: testGuildId, permission: true }],
    token: 'VeryRealToken',
  });
  expect(guildPermissionsManager.has).type.not.toBeCallableWith({
    command: globalCommandId,
    guild: testGuildId,
    permissionId: testGuildId,
  });
  expect(guildPermissionsManager.fetch).type.not.toBeCallableWith({ guild: testGuildId });
  expect(guildPermissionsManager.fetch).type.not.toBeCallableWith({ command: globalCommandId, guild: testGuildId });
  expect(guildPermissionsManager.remove).type.not.toBeCallableWith({
    command: globalCommandId,
    guild: testGuildId,
    roles: [testGuildId],
    token: 'VeryRealToken',
  });
  expect(guildPermissionsManager.remove).type.not.toBeCallableWith({
    command: globalCommandId,
    guild: testGuildId,
    users: [testUserId],
    token: 'VeryRealToken',
  });
  expect(guildPermissionsManager.remove).type.not.toBeCallableWith({
    command: globalCommandId,
    guild: testGuildId,
    roles: [testGuildId],
    users: [testUserId],
    token: 'VeryRealToken',
  });
  expect(guildPermissionsManager.set).type.not.toBeCallableWith({
    command: globalCommandId,
    guild: testGuildId,
    permissions: [{ type: ApplicationCommandPermissionType.Role, id: testGuildId, permission: true }],
    token: 'VeryRealToken',
  });

  expect(guildPermissionsManager.add).type.not.toBeCallableWith({
    permissions: [{ type: ApplicationCommandPermissionType.Role, id: testGuildId, permission: true }],
    token: 'VeryRealToken',
  });
  expect(guildPermissionsManager.has).type.not.toBeCallableWith({ permissionId: testGuildId });
  expect(guildPermissionsManager.remove).type.not.toBeCallableWith({ roles: [testGuildId], token: 'VeryRealToken' });
  expect(guildPermissionsManager.remove).type.not.toBeCallableWith({ users: [testUserId], token: 'VeryRealToken' });
  expect(guildPermissionsManager.remove).type.not.toBeCallableWith({
    roles: [testGuildId],
    users: [testUserId],
    token: 'VeryRealToken',
  });
  expect(guildPermissionsManager.set).type.not.toBeCallableWith({
    permissions: [{ type: ApplicationCommandPermissionType.Role, id: testGuildId, permission: true }],
    token: 'VeryRealToken',
  });

  // Permissions from cached global ApplicationCommand
  await globalCommand.permissions.add({
    guild: testGuildId,
    permissions: [{ type: ApplicationCommandPermissionType.Role, id: testGuildId, permission: true }],
    token: 'VeryRealToken',
  });
  await globalCommand.permissions.has({ guild: testGuildId, permissionId: testGuildId });
  await globalCommand.permissions.fetch({ guild: testGuildId });
  await globalCommand.permissions.remove({ guild: testGuildId, roles: [testGuildId], token: 'VeryRealToken' });
  await globalCommand.permissions.remove({ guild: testGuildId, users: [testUserId], token: 'VeryRealToken' });
  await globalCommand.permissions.remove({
    guild: testGuildId,
    roles: [testGuildId],
    users: [testUserId],
    token: 'VeryRealToken',
  });
  await globalCommand.permissions.set({
    guild: testGuildId,
    permissions: [{ type: ApplicationCommandPermissionType.Role, id: testGuildId, permission: true }],
    token: 'VeryRealToken',
  });

  expect(globalCommand.permissions.add).type.not.toBeCallableWith({
    command: globalCommandId,
    guild: testGuildId,
    permissions: [{ type: ApplicationCommandPermissionType.Role, id: testGuildId, permission: true }],
    token: 'VeryRealToken',
  });
  expect(globalCommand.permissions.has).type.not.toBeCallableWith({
    command: globalCommandId,
    guild: testGuildId,
    permissionId: testGuildId,
    token: 'VeryRealToken',
  });
  expect(globalCommand.permissions.fetch).type.not.toBeCallableWith({
    command: globalCommandId,
    guild: testGuildId,
    token: 'VeryRealToken',
  });
  expect(globalCommand.permissions.remove).type.not.toBeCallableWith({
    command: globalCommandId,
    guild: testGuildId,
    roles: [testGuildId],
    token: 'VeryRealToken',
  });
  expect(globalCommand.permissions.remove).type.not.toBeCallableWith({
    command: globalCommandId,
    guild: testGuildId,
    users: [testUserId],
    token: 'VeryRealToken',
  });
  expect(globalCommand.permissions.remove).type.not.toBeCallableWith({
    command: globalCommandId,
    guild: testGuildId,
    roles: [testGuildId],
    users: [testUserId],
    token: 'VeryRealToken',
  });
  expect(globalCommand.permissions.set).type.not.toBeCallableWith({
    command: globalCommandId,
    guild: testGuildId,
    permissions: [{ type: ApplicationCommandPermissionType.Role, id: testGuildId, permission: true }],
    token: 'VeryRealToken',
  });

  expect(globalCommand.permissions.add).type.not.toBeCallableWith({
    permissions: [{ type: ApplicationCommandPermissionType.Role, id: testGuildId, permission: true }],
    token: 'VeryRealToken',
  });
  expect(globalCommand.permissions.has).type.not.toBeCallableWith({ permissionId: testGuildId });
  expect(globalCommand.permissions.fetch).type.not.toBeCallableWith({});
  expect(globalCommand.permissions.remove).type.not.toBeCallableWith({ roles: [testGuildId], token: 'VeryRealToken' });
  expect(globalCommand.permissions.remove).type.not.toBeCallableWith({ users: [testUserId], token: 'VeryRealToken' });
  expect(globalCommand.permissions.remove).type.not.toBeCallableWith({
    roles: [testGuildId],
    users: [testUserId],
    token: 'VeryRealToken',
  });
  expect(globalCommand.permissions.set).type.not.toBeCallableWith({
    permissions: [{ type: ApplicationCommandPermissionType.Role, id: testGuildId, permission: true }],
  });

  // Permissions from cached guild ApplicationCommand
  await guildCommandFromGlobal.permissions.add({
    permissions: [{ type: ApplicationCommandPermissionType.Role, id: testGuildId, permission: true }],
    token: 'VeryRealToken',
  });
  await guildCommandFromGlobal.permissions.has({ permissionId: testGuildId });
  await guildCommandFromGlobal.permissions.fetch({});
  await guildCommandFromGlobal.permissions.remove({ roles: [testGuildId], token: 'VeryRealToken' });
  await guildCommandFromGlobal.permissions.remove({ users: [testUserId], token: 'VeryRealToken' });
  await guildCommandFromGlobal.permissions.remove({
    roles: [testGuildId],
    users: [testUserId],
    token: 'VeryRealToken',
  });
  await guildCommandFromGlobal.permissions.set({
    permissions: [{ type: ApplicationCommandPermissionType.Role, id: testGuildId, permission: true }],
    token: 'VeryRealToken',
  });

  expect(guildCommandFromGlobal.permissions.add).type.not.toBeCallableWith({
    command: globalCommandId,
    permissions: [{ type: ApplicationCommandPermissionType.Role, id: testGuildId, permission: true }],
    token: 'VeryRealToken',
  });
  expect(guildCommandFromGlobal.permissions.has).type.not.toBeCallableWith({
    command: guildCommandId,
    permissionId: testGuildId,
  });
  expect(guildCommandFromGlobal.permissions.remove).type.not.toBeCallableWith({
    command: guildCommandId,
    roles: [testGuildId],
    token: 'VeryRealToken',
  });
  expect(guildCommandFromGlobal.permissions.remove).type.not.toBeCallableWith({
    command: guildCommandId,
    users: [testUserId],
    token: 'VeryRealToken',
  });
  expect(guildCommandFromGlobal.permissions.remove).type.not.toBeCallableWith({
    command: guildCommandId,
    roles: [testGuildId],
    users: [testUserId],
    token: 'VeryRealToken',
  });
  expect(guildCommandFromGlobal.permissions.set).type.not.toBeCallableWith({
    command: guildCommandId,
    permissions: [{ type: ApplicationCommandPermissionType.Role, id: testGuildId, permission: true }],
    token: 'VeryRealToken',
  });

  expect(guildCommandFromGlobal.permissions.add).type.not.toBeCallableWith({
    guild: testGuildId,
    permissions: [{ type: ApplicationCommandPermissionType.Role, id: testGuildId, permission: true }],
    token: 'VeryRealToken',
  });
  expect(guildCommandFromGlobal.permissions.has).type.not.toBeCallableWith({
    guild: testGuildId,
    permissionId: testGuildId,
  });
  expect(guildCommandFromGlobal.permissions.remove).type.not.toBeCallableWith({
    guild: testGuildId,
    roles: [testGuildId],
    token: 'VeryRealToken',
  });
  expect(guildCommandFromGlobal.permissions.remove).type.not.toBeCallableWith({
    guild: testGuildId,
    users: [testUserId],
    token: 'VeryRealToken',
  });
  expect(guildCommandFromGlobal.permissions.remove).type.not.toBeCallableWith({
    guild: testGuildId,
    roles: [testGuildId],
    users: [testUserId],
    token: 'VeryRealToken',
  });
  expect(guildCommandFromGlobal.permissions.set).type.not.toBeCallableWith({
    guild: testGuildId,
    permissions: [{ type: ApplicationCommandPermissionType.Role, id: testGuildId, permission: true }],
    token: 'VeryRealToken',
  });

  await guildCommandFromGuild.permissions.add({
    permissions: [{ type: ApplicationCommandPermissionType.Role, id: testGuildId, permission: true }],
    token: 'VeryRealToken',
  });
  await guildCommandFromGuild.permissions.has({ permissionId: testGuildId });
  await guildCommandFromGuild.permissions.fetch({});
  await guildCommandFromGuild.permissions.remove({ roles: [testGuildId], token: 'VeryRealToken' });
  await guildCommandFromGuild.permissions.remove({ users: [testUserId], token: 'VeryRealToken' });
  await guildCommandFromGuild.permissions.remove({
    roles: [testGuildId],
    users: [testUserId],
    token: 'VeryRealToken',
  });
  await guildCommandFromGuild.permissions.set({
    permissions: [{ type: ApplicationCommandPermissionType.Role, id: testGuildId, permission: true }],
    token: 'VeryRealToken',
  });

  expect(guildCommandFromGuild.permissions.add).type.not.toBeCallableWith({
    command: globalCommandId,
    permissions: [{ type: ApplicationCommandPermissionType.Role, id: testGuildId, permission: true }],
    token: 'VeryRealToken',
  });
  expect(guildCommandFromGuild.permissions.has).type.not.toBeCallableWith({
    command: guildCommandId,
    permissionId: testGuildId,
  });
  expect(guildCommandFromGuild.permissions.remove).type.not.toBeCallableWith({
    command: guildCommandId,
    roles: [testGuildId],
    token: 'VeryRealToken',
  });
  expect(guildCommandFromGuild.permissions.remove).type.not.toBeCallableWith({
    command: guildCommandId,
    users: [testUserId],
    token: 'VeryRealToken',
  });
  expect(guildCommandFromGuild.permissions.remove).type.not.toBeCallableWith({
    command: guildCommandId,
    roles: [testGuildId],
    users: [testUserId],
    token: 'VeryRealToken',
  });
  expect(guildCommandFromGuild.permissions.set).type.not.toBeCallableWith({
    command: guildCommandId,
    permissions: [{ type: ApplicationCommandPermissionType.Role, id: testGuildId, permission: true }],
    token: 'VeryRealToken',
  });

  expect(guildCommandFromGuild.permissions.add).type.not.toBeCallableWith({
    guild: testGuildId,
    permissions: [{ type: ApplicationCommandPermissionType.Role, id: testGuildId, permission: true }],
    token: 'VeryRealToken',
  });
  expect(guildCommandFromGuild.permissions.has).type.not.toBeCallableWith({
    guild: testGuildId,
    permissionId: testGuildId,
  });
  expect(guildCommandFromGuild.permissions.remove).type.not.toBeCallableWith({
    guild: testGuildId,
    roles: [testGuildId],
    token: 'VeryRealToken',
  });
  expect(guildCommandFromGuild.permissions.remove).type.not.toBeCallableWith({
    guild: testGuildId,
    users: [testUserId],
    token: 'VeryRealToken',
  });
  expect(guildCommandFromGuild.permissions.remove).type.not.toBeCallableWith({
    guild: testGuildId,
    roles: [testGuildId],
    users: [testUserId],
    token: 'VeryRealToken',
  });
  expect(guildCommandFromGuild.permissions.set).type.not.toBeCallableWith({
    guild: testGuildId,
    permissions: [{ type: ApplicationCommandPermissionType.Role, id: testGuildId, permission: true }],
    token: 'VeryRealToken',
  });
});

client.on('roleCreate', ({ client }) => expect(client).type.toBe<Client<true>>());
client.on('roleDelete', ({ client }) => expect(client).type.toBe<Client<true>>());

client.on('roleUpdate', ({ client: oldClient }, { client: newClient }) => {
  expect(oldClient).type.toBe<Client<true>>();
  expect(newClient).type.toBe<Client<true>>();
});

client.on('stageInstanceCreate', ({ client }) => expect(client).type.toBe<Client<true>>());
client.on('stageInstanceDelete', ({ client }) => expect(client).type.toBe<Client<true>>());

client.on('stageInstanceUpdate', (oldStageInstance, { client }) => {
  expect(oldStageInstance!.client).type.toBe<Client<true>>();
  expect(client).type.toBe<Client<true>>();
});

client.on('stickerCreate', ({ client }) => expect(client).type.toBe<Client<true>>());
client.on('stickerDelete', ({ client }) => expect(client).type.toBe<Client<true>>());

client.on('stickerUpdate', ({ client: oldClient }, { client: newClient }) => {
  expect(oldClient).type.toBe<Client<true>>();
  expect(newClient).type.toBe<Client<true>>();
});

client.on('threadCreate', thread => {
  expect(thread.client).type.toBe<Client<true>>();

  if (thread.type === ChannelType.PrivateThread) {
    expect(thread.createdTimestamp).type.toBe<number>();
    expect(thread.createdAt).type.toBe<Date>();
  } else {
    expect(thread.createdTimestamp).type.toBe<number | null>();
    expect(thread.createdAt).type.toBe<Date | null>();
  }
});

client.on('threadDelete', ({ client }) => expect(client).type.toBe<Client<true>>());

client.on('threadListSync', (threads, { client }) => {
  expect(threads.first()!.client).type.toBe<Client<true>>();
  expect(client).type.toBe<Client<true>>();
});

client.on('threadMembersUpdate', (addedMembers, removedMembers, thread) => {
  expect(addedMembers.first()!.client).type.toBe<Client<true>>();
  expect(removedMembers.first()!.client).type.toBe<Client<true>>();
  expect(thread.client).type.toBe<Client<true>>();
  expect(addedMembers).type.toBe<ReadonlyCollection<Snowflake, ThreadMember>>();
  expect(removedMembers).type.toBe<ReadonlyCollection<Snowflake, PartialThreadMember | ThreadMember>>();
  expect(thread).type.toBe<AnyThreadChannel>();
  const left = removedMembers.first();
  if (!left) return;

  if (left.partial) {
    expect(left).type.toBe<PartialThreadMember>();
    expect(left.flags).type.toBe<null>();
  } else {
    expect(left).type.toBe<ThreadMember>();
    expect(left.flags).type.toBe<ThreadMemberFlagsBitField>();
  }
});

client.on('threadMemberUpdate', ({ client: oldClient }, { client: newClient }) => {
  expect(oldClient).type.toBe<Client<true>>();
  expect(newClient).type.toBe<Client<true>>();
});

client.on('threadUpdate', ({ client: oldClient }, { client: newClient }) => {
  expect(oldClient).type.toBe<Client<true>>();
  expect(newClient).type.toBe<Client<true>>();
});

client.on('typingStart', ({ client }) => expect(client).type.toBe<Client<true>>());

client.on('userUpdate', ({ client: oldClient }, { client: newClient }) => {
  expect(oldClient).type.toBe<Client<true>>();
  expect(newClient).type.toBe<Client<true>>();
});

client.on('voiceServerUpdate', data => {
  expect(data).type.toBe<VoiceServerUpdateData>();
});

client.on('voiceStateUpdate', ({ client: oldClient }, { client: newClient }) => {
  expect(oldClient).type.toBe<Client<true>>();
  expect(newClient).type.toBe<Client<true>>();
});

client.on('webhooksUpdate', ({ client }) => expect(client).type.toBe<Client<true>>());

client.on('guildCreate', async g => {
  expect(g.client).type.toBe<Client<true>>();
  const channel = g.channels.cache.random();
  if (!channel) return;

  if (channel.type === ChannelType.GuildText) {
    const row: ActionRowData<MessageActionRowComponentData> = {
      type: ComponentType.ActionRow,
      components: [
        new PrimaryButtonBuilder(),
        { type: ComponentType.Button, style: ButtonStyle.Primary, label: 'string', customId: 'foo' },
        { type: ComponentType.Button, style: ButtonStyle.Link, label: 'test', url: 'test' },
        { type: ComponentType.StringSelect, customId: 'foo', options: [{ label: 'label', value: 'value' }] },
        new StringSelectMenuBuilder(),
        // @ts-expect-error Type 'TextInputBuilder' is not assignable to type '...'.
        new TextInputBuilder(),
      ],
    };

    expect(row.components).type.not.toBeAssignableFrom([
      { type: ComponentType.TextInput, style: TextInputStyle.Paragraph, customId: 'foo', label: 'test' },
    ]);

    const row2 = new ActionRowBuilder({
      type: ComponentType.ActionRow,
      components: [
        { type: ComponentType.Button, style: ButtonStyle.Primary, label: 'string', custom_id: 'foo' },
        { type: ComponentType.Button, style: ButtonStyle.Link, label: 'test', url: 'test' },
        { type: ComponentType.StringSelect, custom_id: 'foo', options: [{ label: 'label', value: 'value' }] },
      ],
    });

    await client.channels.createMessage(channel, { components: [row, row2] });
  }

  await channel.setName('foo').then(updatedChannel => {
    console.log(`New channel name: ${updatedChannel.name}`);
  });

  expect(g.members.add).type.not.toBeCallableWith(testUserId);

  expect(g.members.add).type.not.toBeCallableWith(testUserId, {});

  expect(g.members.add).type.not.toBeCallableWith(testUserId, {
    accessToken: 'totallyRealAccessToken',
    roles: [g.roles.cache],
  });

  expect(g.members.add(testUserId, { accessToken: 'totallyRealAccessToken', fetchWhenExisting: false })).type.toBe<
    Promise<GuildMember | null>
  >();

  expect(g.members.add(testUserId, { accessToken: 'totallyRealAccessToken' })).type.toBe<Promise<GuildMember>>();

  expect(
    g.members.add(testUserId, {
      accessToken: 'totallyRealAccessToken',
      mute: true,
      deaf: false,
      roles: [g.roles.cache.first()!],
      force: true,
      fetchWhenExisting: true,
    }),
  ).type.toBe<Promise<GuildMember>>();
});

// Event emitter static method overrides
expect(Client.once(client, 'clientReady')).type.toBe<Promise<[Client<true>]>>();
expect(Client.on(client, 'clientReady')).type.toBeAssignableTo<AsyncIterableIterator<[Client<true>]>>();

await client.login('absolutely-valid-token');

declare const loggedInClient: Client<true>;
expect(loggedInClient.application).type.toBe<ClientApplication>();
expect(loggedInClient.readyAt).type.toBe<Date>();
expect(loggedInClient.readyTimestamp).type.toBe<number>();
expect(loggedInClient.token).type.toBe<string>();
expect(loggedInClient.uptime).type.toBe<number>();
expect(loggedInClient.user).type.toBe<ClientUser>();

declare const loggedOutClient: Client<false>;
expect(loggedOutClient.application).type.toBe<null>();
expect(loggedOutClient.readyAt).type.toBe<null>();
expect(loggedOutClient.readyTimestamp).type.toBe<null>();
expect(loggedOutClient.token).type.toBe<string | null>();
expect(loggedOutClient.uptime).type.toBe<null>();
expect(loggedOutClient.user).type.toBe<null>();

// eslint-disable-next-line @typescript-eslint/no-confusing-void-expression
expect(serialize(undefined)).type.toBe<undefined>();
expect(serialize(null)).type.toBe<null>();
expect(serialize([1, 2, 3])).type.toBe<number[]>();
expect(serialize(new Set([1, 2, 3]))).type.toBe<Record<string, never>>();
expect(
  serialize(
    new Map([
      [1, '2'],
      [2, '4'],
    ]),
  ),
).type.toBe<Record<string, never>>();
expect(serialize(new PermissionsBitField(PermissionFlagsBits.AttachFiles))).type.toBe<string>();
expect(serialize(new IntentsBitField(GatewayIntentBits.Guilds))).type.toBe<number>();
expect(
  serialize(
    new Collection([
      [1, '2'],
      [2, '4'],
    ]),
  ),
).type.toBeAssignableTo<unknown>();
expect(serialize(Symbol('a'))).type.toBe<never>();
expect(serialize(() => {})).type.toBe<never>();
expect(serialize(BigInt(42))).type.toBe<never>();

// Test type return of broadcastEval:
declare const shardClientUtil: ShardClientUtil;
declare const shardingManager: ShardingManager;

expect(shardingManager.broadcastEval(() => 1)).type.toBe<Promise<number[]>>();
expect(shardClientUtil.broadcastEval(() => 1)).type.toBe<Promise<number[]>>();
expect(shardingManager.broadcastEval(async () => 1)).type.toBe<Promise<number[]>>();
expect(shardClientUtil.broadcastEval(async () => 1)).type.toBe<Promise<number[]>>();

declare const dmChannel: DMChannel;
declare const threadChannel: ThreadChannel;
declare const threadChannelFromForum: ThreadChannel<true>;
declare const threadChannelNotFromForum: ThreadChannel<false>;
declare const announcementChannel: AnnouncementChannel;
declare const textChannel: TextChannel;
declare const voiceChannel: VoiceChannel;
declare const user: User;
declare const guildMember: GuildMember;

// Test thread channels' parent inference
expect(threadChannel.parent).type.toBe<AnnouncementChannel | ForumChannel | MediaChannel | TextChannel | null>();
expect(threadChannelFromForum.parent).type.toBe<ForumChannel | MediaChannel | null>();
expect(threadChannelNotFromForum.parent).type.toBe<AnnouncementChannel | TextChannel | null>();

// Test whether the structures implement send
expect(dmChannel.send).type.toBe<SendMethod<false>['send']>();
expect(threadChannel.send).type.toBe<SendMethod<true>['send']>();
expect(announcementChannel.send).type.toBe<SendMethod<true>['send']>();
expect(textChannel.send).type.toBe<SendMethod<true>['send']>();
expect(voiceChannel.send).type.toBe<SendMethod<true>['send']>();
expect(user).type.toBeAssignableTo<SendMethod>();
expect(guildMember).type.toBeAssignableTo<SendMethod>();

expect(client.users.send(user, 'test')).type.toBe<Promise<Message<false>>>();

expect(textChannel.setType(ChannelType.GuildAnnouncement)).type.toBe<Promise<AnnouncementChannel>>();
expect(announcementChannel.setType(ChannelType.GuildText)).type.toBe<Promise<TextChannel>>();

expect(dmChannel.lastMessage).type.toBe<Message | null>();
expect(threadChannel.lastMessage).type.toBe<Message | null>();
expect(announcementChannel.lastMessage).type.toBe<Message | null>();
expect(textChannel.lastMessage).type.toBe<Message | null>();
expect(voiceChannel.lastMessage).type.toBe<Message | null>();

notPropertyOf(user, 'lastMessage');
notPropertyOf(user, 'lastMessageId');
notPropertyOf(guildMember, 'lastMessage');
notPropertyOf(guildMember, 'lastMessageId');

// Test collector event parameters
declare const messageCollector: MessageCollector;
messageCollector.on('collect', (...args) => {
  expect(args).type.toBe<[Message, Collection<Snowflake, Message>]>();
});

(async () => {
  for await (const value of messageCollector) {
    expect(value).type.toBe<[Message<boolean>, Collection<Snowflake, Message>]>();
  }
})();

declare const reactionCollector: ReactionCollector;
reactionCollector.on('dispose', (...args) => {
  expect(args).type.toBe<[MessageReaction, User]>();
});

reactionCollector.on('collect', (...args) => expect(args).type.toBe<[MessageReaction, User]>());
reactionCollector.on('dispose', (...args) => expect(args).type.toBe<[MessageReaction, User]>());
reactionCollector.on('remove', (...args) => expect(args).type.toBe<[MessageReaction, User]>());
reactionCollector.on('end', (...args) =>
  expect(args).type.toBe<[ReadonlyCollection<string, MessageReaction>, string]>(),
);

(async () => {
  for await (const value of reactionCollector) {
    expect(value).type.toBe<[MessageReaction, User]>();
  }
})();

// Make sure the properties are typed correctly, and that no backwards properties
// (K -> V and V -> K) exist:
expect(Events.MessageCreate).type.toBeAssignableTo<'messageCreate'>();
expect(ShardEvents.Death).type.toBeAssignableTo<'death'>();
expect(Status.Connecting).type.toBeAssignableTo<1>();

declare const applicationCommandData: ApplicationCommandData;
declare const applicationCommandOptionData: ApplicationCommandOptionData;
declare const applicationCommandResolvable: ApplicationCommandResolvable;
declare const applicationCommandManager: ApplicationCommandManager;
{
  type ApplicationCommandScope = ApplicationCommand<{ guild: GuildResolvable }>;

  expect(applicationCommandManager.create(applicationCommandData)).type.toBe<Promise<ApplicationCommandScope>>();
  expect(applicationCommandManager.create(applicationCommandData, '0')).type.toBeAssignableTo<
    Promise<ApplicationCommand>
  >();
  expect(applicationCommandManager.edit(applicationCommandResolvable, applicationCommandData)).type.toBe<
    Promise<ApplicationCommandScope>
  >();
  expect(applicationCommandManager.edit(applicationCommandResolvable, applicationCommandData, '0')).type.toBe<
    Promise<ApplicationCommand>
  >();
  expect(applicationCommandManager.set([applicationCommandData])).type.toBe<
    Promise<Collection<Snowflake, ApplicationCommandScope>>
  >();
  expect(applicationCommandManager.set([applicationCommandData] as const, '0')).type.toBe<
    Promise<Collection<Snowflake, ApplicationCommand>>
  >();

  // Test inference of choice values.
  if ('choices' in applicationCommandOptionData) {
    if (applicationCommandOptionData.type === ApplicationCommandOptionType.String) {
      expect(applicationCommandOptionData.choices[0]!.value).type.toBe<string>();
      expect(applicationCommandOptionData.choices[0]!.value).type.not.toBe<number>();
    }

    if (applicationCommandOptionData.type === ApplicationCommandOptionType.Integer) {
      expect(applicationCommandOptionData.choices[0]!.value).type.toBe<number>();
      expect(applicationCommandOptionData.choices[0]!.value).type.not.toBe<string>();
    }

    if (applicationCommandOptionData.type === ApplicationCommandOptionType.Number) {
      expect(applicationCommandOptionData.choices[0]!.value).type.toBe<number>();
      expect(applicationCommandOptionData.choices[0]!.value).type.not.toBe<string>();
    }
  }
}

declare const applicationCommandPermissionsManager: ApplicationCommandPermissionsManager<
  object,
  object,
  Guild | null,
  Snowflake
>;
{
  await applicationCommandPermissionsManager.add({ permissions: [], token: '' });
  await applicationCommandPermissionsManager.add({ permissions: [] as const, token: '' });
  await applicationCommandPermissionsManager.set({ permissions: [], token: '' });
  await applicationCommandPermissionsManager.set({ permissions: [] as const, token: '' });
  await applicationCommandPermissionsManager.remove({ channels: [], roles: [], users: [], token: '' });

  await applicationCommandPermissionsManager.remove({
    channels: [] as const,
    roles: [] as const,
    users: [] as const,
    token: '',
  });
}

declare const chatInputApplicationCommandData: ChatInputApplicationCommandData;
{
  chatInputApplicationCommandData.options = [];
  chatInputApplicationCommandData.options = [] as const;
}

declare const applicationCommandChannelOptionData: ApplicationCommandChannelOptionData;
declare const applicationCommandChannelOption: ApplicationCommandChannelOption;
{
  applicationCommandChannelOptionData.channelTypes = [] as const;
  applicationCommandChannelOptionData.channel_types = [] as const;
  applicationCommandChannelOption.channelTypes = [] as const;
}

declare const applicationCommandAttachmentOptionData: ApplicationCommandAttachmentOptionData;
declare const applicationCommandAttachmentOption: ApplicationCommandAttachmentOption;
{
  applicationCommandAttachmentOptionData.fileTypes = ['image', '.pdf'] as const;
  applicationCommandAttachmentOptionData.file_types = ['video', '.mov'] as const;
  applicationCommandAttachmentOption.fileTypes = ['audio', '.flac'] as const;

  expect({
    description: 'Upload a file',
    fileTypes: ['pdf'],
    name: 'file',
    type: ApplicationCommandOptionType.Attachment,
  }).type.not.toBeAssignableTo<ApplicationCommandOptionData>();
}

declare const applicationNonChoiceOptionData: ApplicationCommandOptionData & {
  type: CommandOptionNonChoiceResolvableType;
};
{
  // Options aren't allowed on this command type.

  expect(applicationNonChoiceOptionData).type.not.toHaveProperty('choices');
}

declare const applicationCommandChoicesData: ApplicationCommandChoicesData;
declare const applicationCommandChoicesOption: ApplicationCommandChoicesOption;
{
  applicationCommandChoicesData.choices = [];
  applicationCommandChoicesData.choices = [] as const;
  applicationCommandChoicesOption.choices = [];
  applicationCommandChoicesOption.choices = [] as const;
}

declare const applicationCommandSubCommandData: ApplicationCommandSubCommandData;
declare const applicationCommandSubCommand: ApplicationCommandSubCommand;
{
  applicationCommandSubCommandData.options = [];
  applicationCommandSubCommandData.options = [] as const;
  applicationCommandSubCommand.options = [];
  applicationCommandSubCommand.options = [] as const;
}

declare const applicationSubGroupCommandData: ApplicationCommandSubGroupData;
declare const applicationCommandSubGroup: ApplicationCommandSubGroup;
{
  expect(applicationSubGroupCommandData.type).type.toBe<ApplicationCommandOptionType.SubcommandGroup>();
  applicationSubGroupCommandData.options = [];
  applicationSubGroupCommandData.options = [] as const;
  applicationCommandSubGroup.options = [];
  applicationCommandSubGroup.options = [] as const;
}

declare const autoModerationRuleManager: AutoModerationRuleManager;
{
  expect(autoModerationRuleManager.fetch('1234567890')).type.toBe<Promise<AutoModerationRule>>();
  expect(autoModerationRuleManager.fetch({ autoModerationRule: '1234567890' })).type.toBe<
    Promise<AutoModerationRule>
  >();
  expect(autoModerationRuleManager.fetch({ autoModerationRule: '1234567890', cache: false })).type.toBe<
    Promise<AutoModerationRule>
  >();
  expect(autoModerationRuleManager.fetch({ autoModerationRule: '1234567890', force: true })).type.toBe<
    Promise<AutoModerationRule>
  >();
  expect(autoModerationRuleManager.fetch({ autoModerationRule: '1234567890', cache: false, force: true })).type.toBe<
    Promise<AutoModerationRule>
  >();
  expect(autoModerationRuleManager.fetch()).type.toBe<Promise<Collection<Snowflake, AutoModerationRule>>>();
  expect(autoModerationRuleManager.fetch({})).type.toBe<Promise<Collection<Snowflake, AutoModerationRule>>>();
  expect(autoModerationRuleManager.fetch({ cache: false })).type.toBe<
    Promise<Collection<Snowflake, AutoModerationRule>>
  >();
  expect(autoModerationRuleManager.fetch).type.not.toBeCallableWith({ force: false });
}

declare const guildApplicationCommandManager: GuildApplicationCommandManager;
expect(guildApplicationCommandManager.fetch('0')).type.toBe<Promise<ApplicationCommand>>();
expect(guildApplicationCommandManager.fetch({ id: '0' })).type.toBe<Promise<ApplicationCommand>>();
expect(guildApplicationCommandManager.fetch()).type.toBe<Promise<Collection<Snowflake, ApplicationCommand>>>();

declare const categoryChannelChildManager: CategoryChannelChildManager;
{
  expect(categoryChannelChildManager.create({ name: 'name', type: ChannelType.GuildVoice })).type.toBe<
    Promise<VoiceChannel>
  >();
  expect(categoryChannelChildManager.create({ name: 'name', type: ChannelType.GuildText })).type.toBe<
    Promise<TextChannel>
  >();
  expect(categoryChannelChildManager.create({ name: 'name', type: ChannelType.GuildAnnouncement })).type.toBe<
    Promise<AnnouncementChannel>
  >();
  expect(categoryChannelChildManager.create({ name: 'name', type: ChannelType.GuildStageVoice })).type.toBe<
    Promise<StageChannel>
  >();
  expect(categoryChannelChildManager.create({ name: 'name' })).type.toBe<Promise<TextChannel>>();
  expect(categoryChannelChildManager.create({ name: 'name' })).type.toBe<Promise<TextChannel>>();
}

declare const guildChannelManager: GuildChannelManager;
{
  expect(guildChannelManager.create({ name: 'name' })).type.toBe<Promise<TextChannel>>();
  expect(guildChannelManager.create({ name: 'name' })).type.toBe<Promise<TextChannel>>();
  expect(guildChannelManager.create({ name: 'name', type: ChannelType.GuildVoice })).type.toBe<Promise<VoiceChannel>>();
  expect(guildChannelManager.create({ name: 'name', type: ChannelType.GuildCategory })).type.toBe<
    Promise<CategoryChannel>
  >();
  expect(guildChannelManager.create({ name: 'name', type: ChannelType.GuildText })).type.toBe<Promise<TextChannel>>();
  expect(guildChannelManager.create({ name: 'name', type: ChannelType.GuildAnnouncement })).type.toBe<
    Promise<AnnouncementChannel>
  >();
  expect(guildChannelManager.create({ name: 'name', type: ChannelType.GuildStageVoice })).type.toBe<
    Promise<StageChannel>
  >();
  expect(guildChannelManager.create({ name: 'name', type: ChannelType.GuildForum })).type.toBe<Promise<ForumChannel>>();
  expect(guildChannelManager.create({ name: 'name', type: ChannelType.GuildMedia })).type.toBe<Promise<MediaChannel>>();

  expect(guildChannelManager.fetch()).type.toBe<Promise<Collection<Snowflake, NonThreadGuildBasedChannel | null>>>();
  expect(guildChannelManager.fetch(undefined, {})).type.toBe<
    Promise<Collection<Snowflake, NonThreadGuildBasedChannel | null>>
  >();
  expect(guildChannelManager.fetch('0')).type.toBe<Promise<GuildBasedChannel | null>>();

  const channel = guildChannelManager.cache.first()!;

  if (channel.isTextBased()) {
    const { messages } = channel;
    const message = await messages.fetch('123');
    expect(messages).type.toBe<GuildMessageManager>();
    expect(messages.crosspost('1234567890')).type.toBe<Promise<Message<true>>>();
    expect(messages.edit('1234567890', 'text')).type.toBe<Promise<Message<true>>>();
    expect(messages.fetch('1234567890')).type.toBe<Promise<Message<true>>>();
    expect(messages.fetchPins()).type.toBe<Promise<FetchPinnedMessagesResponse<true>>>();
    expect(message.guild).type.toBe<Guild>();
    expect(message.guildId).type.toBe<Snowflake>();
    expect(message.channel.messages.channel).type.toBe<GuildTextBasedChannel>();
  }
}

{
  const { messages } = dmChannel;
  const message = await messages.fetch('123');
  expect(messages).type.toBe<DMMessageManager>();
  expect(messages.edit('1234567890', 'text')).type.toBe<Promise<Message>>();
  expect(messages.fetch('1234567890')).type.toBe<Promise<Message>>();
  expect(messages.fetchPins()).type.toBe<Promise<FetchPinnedMessagesResponse>>();
  expect(message.guild).type.toBe<Guild | null>();
  expect(message.guildId).type.toBe<Snowflake | null>();
  expect(message.channel.messages.channel).type.toBe<DMChannel | GuildTextBasedChannel | PartialGroupDMChannel>();
  expect(message.mentions).type.toBe<MessageMentions>();
  expect(message.mentions.guild).type.toBe<Guild | null>();
  expect(message.mentions.members).type.toBe<Collection<Snowflake, GuildMember> | null>();

  if (messages.channel.isDMBased()) {
    expect(messages.channel).type.toBe<DMChannel>();
    expect(messages.channel.messages.channel).type.toBe<DMChannel>();
  }

  expect(messages).type.not.toHaveProperty('crosspost');
}

declare const threadManager: ThreadManager;
{
  expect(threadManager.fetch('12345678901234567')).type.toBe<Promise<AnyThreadChannel | null>>();
  expect(threadManager.fetch('12345678901234567', { cache: true, force: false })).type.toBe<
    Promise<AnyThreadChannel | null>
  >();
  expect(threadManager.fetch()).type.toBe<Promise<FetchedThreads>>();
  expect(threadManager.fetch({})).type.toBe<Promise<FetchedThreads>>();
  expect(threadManager.fetch({ archived: { limit: 4 } })).type.toBe<Promise<FetchedThreadsMore>>();

  expect(threadManager.fetch).type.not.toBeCallableWith({ archived: {} }, { force: true });
}

declare const guildForumThreadManager: GuildForumThreadManager;
expect(guildForumThreadManager.channel).type.toBe<ForumChannel | MediaChannel>();

declare const guildTextThreadManager: GuildTextThreadManager<
  ChannelType.AnnouncementThread | ChannelType.PrivateThread | ChannelType.PublicThread
>;
expect(guildTextThreadManager.channel).type.toBe<AnnouncementChannel | TextChannel>();

declare const guildMemberManager: GuildMemberManager;
{
  expect(guildMemberManager.fetch('12345678901234567')).type.toBe<Promise<GuildMember>>();
  expect(guildMemberManager.fetch({ user: '12345678901234567' })).type.toBe<Promise<GuildMember>>();
  expect(guildMemberManager.fetch({ user: '12345678901234567', cache: true, force: false })).type.toBe<
    Promise<GuildMember>
  >();
  expect(guildMemberManager.fetch({ user: '12345678901234567', cache: true, force: false })).type.toBe<
    Promise<GuildMember>
  >();
  expect(guildMemberManager.fetch()).type.toBe<Promise<Collection<Snowflake, GuildMember>>>();
  expect(guildMemberManager.fetch({})).type.toBe<Promise<Collection<Snowflake, GuildMember>>>();
  expect(guildMemberManager.fetch({ user: ['12345678901234567'] })).type.toBe<
    Promise<Collection<Snowflake, GuildMember>>
  >();
  expect(guildMemberManager.fetch({ withPresences: false })).type.toBe<Promise<Collection<Snowflake, GuildMember>>>();
  expect(guildMemberManager.fetch({ user: '12345678901234567', withPresences: true })).type.toBe<
    Promise<GuildMember>
  >();

  expect(guildMemberManager.fetch({ query: 'test', user: ['12345678901234567'], nonce: 'test' })).type.toBe<
    Promise<Collection<Snowflake, GuildMember>>
  >();

  expect(guildMemberManager.fetch).type.not.toBeCallableWith({ cache: true, force: false });
  expect(guildMemberManager.fetch).type.not.toBeCallableWith({
    user: ['12345678901234567'],
    cache: true,
    force: false,
  });
}

declare const messageManager: MessageManager;
{
  expect(messageManager.fetch('1234567890')).type.toBe<Promise<Message>>();
  expect(messageManager.fetch({ message: '1234567890' })).type.toBe<Promise<Message>>();
  expect(messageManager.fetch({ message: '1234567890', cache: true, force: false })).type.toBe<Promise<Message>>();
  expect(messageManager.fetch()).type.toBe<Promise<Collection<Snowflake, Message>>>();
  expect(messageManager.fetch({})).type.toBe<Promise<Collection<Snowflake, Message>>>();
  expect(messageManager.fetch({ limit: 100, before: '1234567890', cache: false })).type.toBe<
    Promise<Collection<Snowflake, Message>>
  >();
  expect(messageManager.fetch).type.not.toBeCallableWith({ cache: true, force: false });
  expect(messageManager.fetch).type.not.toBeCallableWith({
    message: '1234567890',
    after: '1234567890',
    cache: true,
    force: false,
  });
}

declare const pollAnswerVoterManager: PollAnswerVoterManager;
{
  expect(pollAnswerVoterManager.fetch()).type.toBe<Promise<Collection<Snowflake, User>>>();
  expect(pollAnswerVoterManager.answer).type.toBe<PollAnswer>();
}

declare const roleManager: RoleManager;
expect(roleManager.fetch()).type.toBe<Promise<Collection<Snowflake, Role>>>();
expect(roleManager.fetch(undefined, {})).type.toBe<Promise<Collection<Snowflake, Role>>>();
expect(roleManager.fetch('0')).type.toBe<Promise<Role>>();

declare const guildEmojiManager: GuildEmojiManager;
expect(guildEmojiManager.fetch()).type.toBe<Promise<Collection<Snowflake, GuildEmoji>>>();
expect(guildEmojiManager.fetch(undefined, {})).type.toBe<Promise<Collection<Snowflake, GuildEmoji>>>();
expect(guildEmojiManager.fetch('0')).type.toBe<Promise<GuildEmoji>>();

declare const applicationEmojiManager: ApplicationEmojiManager;
expect(applicationEmojiManager.fetch()).type.toBe<Promise<Collection<Snowflake, ApplicationEmoji>>>();
expect(applicationEmojiManager.fetch(undefined, {})).type.toBe<Promise<Collection<Snowflake, ApplicationEmoji>>>();
expect(applicationEmojiManager.fetch('0')).type.toBe<Promise<ApplicationEmoji>>();

declare const guildBanManager: GuildBanManager;
{
  expect(guildBanManager.fetch('1234567890')).type.toBe<Promise<GuildBan>>();
  expect(guildBanManager.fetch({ user: '1234567890' })).type.toBe<Promise<GuildBan>>();
  expect(guildBanManager.fetch({ user: '1234567890', cache: true, force: false })).type.toBe<Promise<GuildBan>>();
  expect(guildBanManager.fetch()).type.toBe<Promise<Collection<Snowflake, GuildBan>>>();
  expect(guildBanManager.fetch({})).type.toBe<Promise<Collection<Snowflake, GuildBan>>>();
  expect(guildBanManager.fetch({ limit: 100, before: '1234567890' })).type.toBe<
    Promise<Collection<Snowflake, GuildBan>>
  >();
  expect(guildBanManager.fetch).type.not.toBeCallableWith({ cache: true, force: false });
  expect(guildBanManager.fetch).type.not.toBeCallableWith({
    user: '1234567890',
    after: '1234567890',
    cache: true,
    force: false,
  });
}

declare const threadMemberWithGuildMember: ThreadMember<true>;
declare const threadMemberManager: ThreadMemberManager;
{
  expect(threadMemberManager.fetch('12345678')).type.toBe<Promise<ThreadMember>>();
  expect(threadMemberManager.fetch({ member: '12345678', cache: false })).type.toBe<Promise<ThreadMember>>();
  expect(threadMemberManager.fetch({ member: '12345678', force: true })).type.toBe<Promise<ThreadMember>>();
  expect(threadMemberManager.fetch({ member: threadMemberWithGuildMember })).type.toBe<Promise<ThreadMember<true>>>();
  expect(threadMemberManager.fetch({ member: '12345678901234567', withMember: true })).type.toBe<
    Promise<ThreadMember<true>>
  >();
  expect(threadMemberManager.fetch()).type.toBe<Promise<Collection<Snowflake, ThreadMember>>>();
  expect(threadMemberManager.fetch({})).type.toBe<Promise<Collection<Snowflake, ThreadMember>>>();

  expect(threadMemberManager.fetch({ cache: true, limit: 50, withMember: true, after: '12345678901234567' })).type.toBe<
    Promise<Collection<Snowflake, ThreadMember<true>>>
  >();

  expect(threadMemberManager.fetch({ cache: true, withMember: false })).type.toBe<
    Promise<Collection<Snowflake, ThreadMember>>
  >();

  expect(threadMemberManager.fetch).type.not.toBeCallableWith({ cache: true, force: false });
  expect(threadMemberManager.fetch).type.not.toBeCallableWith({
    withMember: false,
    limit: 5,
    after: '12345678901234567',
  });
}

declare const typing: Typing;
expect(typing.user).type.toBe<PartialUser | User>();
if (typing.user.partial) expect(typing.user.username).type.toBe<null>();
if (!typing.user.partial) expect(typing.user.tag).type.toBe<string>();

expect(typing.channel).type.toBe<TextBasedChannel>();
if (typing.channel.partial) expect(typing.channel.lastMessageId).type.toBe<undefined>();

expect(typing.member).type.toBe<GuildMember | null>();
expect(typing.guild).type.toBe<Guild | null>();

if (typing.inGuild()) {
  expect(typing.channel.guild).type.toBe<Guild>();
  expect(typing.guild).type.toBe<Guild>();
}

// Test interactions
declare const interaction: Interaction;
declare const booleanValue: boolean;
if (interaction.inGuild()) {
  expect(interaction.guildId).type.toBe<Snowflake>();
} else {
  expect(interaction.guildId).type.toBe<Snowflake | null>();
}

client.on('interactionCreate', async interaction => {
  if (interaction.type === InteractionType.MessageComponent) {
    expect(interaction).type.toBe<ButtonInteraction | SelectMenuInteraction>();
    expect(interaction.component).type.toBe<APIButtonComponent | APISelectMenuComponent | MessageActionRowComponent>();
    expect(interaction.message).type.toBe<Message>();
    if (interaction.inCachedGuild()) {
      expect(interaction).type.toBeAssignableTo<MessageComponentInteraction>();
      expect(interaction.component).type.toBe<MessageActionRowComponent>();
      expect(interaction.message).type.toBe<Message<true>>();
      expect(interaction.guild).type.toBe<Guild>();
      expect(interaction.reply({ content: 'a', withResponse: true })).type.toBe<
        Promise<InteractionCallbackResponse<true>>
      >();
      expect(interaction.deferReply({ withResponse: true })).type.toBe<Promise<InteractionCallbackResponse<true>>>();
      expect(interaction.deferReply()).type.toBe<Promise<undefined>>();
      expect(interaction.reply({ content: 'a', withResponse: false })).type.toBe<Promise<undefined>>();
      expect(interaction.deferReply({ withResponse: false })).type.toBe<Promise<undefined>>();
      expect(interaction.reply({ content: 'a', withResponse: booleanValue })).type.toBe<
        Promise<InteractionCallbackResponse<true> | undefined>
      >();
      expect(interaction.deferReply({ withResponse: booleanValue })).type.toBe<
        Promise<InteractionCallbackResponse<true> | undefined>
      >();
      expect(interaction.editReply({ content: 'a' })).type.toBe<Promise<Message<true>>>();
      expect(interaction.fetchReply()).type.toBe<Promise<Message<true>>>();
      expect(interaction.update({ content: 'a', withResponse: true })).type.toBe<
        Promise<InteractionCallbackResponse<true>>
      >();
      expect(interaction.update()).type.toBe<Promise<undefined>>();
      expect(interaction.deferUpdate({ withResponse: true })).type.toBe<Promise<InteractionCallbackResponse<true>>>();
      expect(interaction.deferUpdate()).type.toBe<Promise<undefined>>();
      expect(interaction.followUp({ content: 'a' })).type.toBe<Promise<Message<true>>>();
      expect(interaction.launchActivity({ withResponse: true })).type.toBe<
        Promise<InteractionCallbackResponse<true>>
      >();
      expect(interaction.launchActivity({ withResponse: false })).type.toBe<Promise<undefined>>();
      expect(interaction.launchActivity({ withResponse: booleanValue })).type.toBe<
        Promise<InteractionCallbackResponse<true> | undefined>
      >();
    } else if (interaction.inRawGuild()) {
      expect(interaction).type.toBeAssignableTo<MessageComponentInteraction>();
      expect(interaction.component).type.toBe<APIButtonComponent | APISelectMenuComponent>();
      expect(interaction.message).type.toBe<Message<false>>();
      expect(interaction.guild).type.toBe<null>();
      expect(interaction.reply({ content: 'a', withResponse: true })).type.toBe<
        Promise<InteractionCallbackResponse<false>>
      >();
      expect(interaction.deferReply({ withResponse: true })).type.toBe<Promise<InteractionCallbackResponse<false>>>();
      expect(interaction.reply({ content: 'a', withResponse: false })).type.toBe<Promise<undefined>>();
      expect(interaction.deferReply({ withResponse: false })).type.toBe<Promise<undefined>>();
      expect(interaction.deferReply()).type.toBe<Promise<undefined>>();
      expect(interaction.reply({ content: 'a', withResponse: booleanValue })).type.toBe<
        Promise<InteractionCallbackResponse<false> | undefined>
      >();
      expect(interaction.deferReply({ withResponse: booleanValue })).type.toBe<
        Promise<InteractionCallbackResponse<false> | undefined>
      >();
      expect(interaction.editReply({ content: 'a' })).type.toBe<Promise<Message<false>>>();
      expect(interaction.fetchReply()).type.toBe<Promise<Message<false>>>();
      expect(interaction.update({ content: 'a', withResponse: true })).type.toBe<
        Promise<InteractionCallbackResponse<false>>
      >();
      expect(interaction.update({ content: 'a', withResponse: false })).type.toBe<Promise<undefined>>();
      expect(interaction.update()).type.toBe<Promise<undefined>>();
      expect(interaction.update({ content: 'a', withResponse: booleanValue })).type.toBe<
        Promise<InteractionCallbackResponse<false> | undefined>
      >();
      expect(interaction.deferUpdate({ withResponse: true })).type.toBe<Promise<InteractionCallbackResponse<false>>>();
      expect(interaction.deferUpdate()).type.toBe<Promise<undefined>>();
      expect(interaction.followUp({ content: 'a' })).type.toBe<Promise<Message<false>>>();
      expect(interaction.launchActivity({ withResponse: true })).type.toBe<
        Promise<InteractionCallbackResponse<false>>
      >();
      expect(interaction.launchActivity({ withResponse: false })).type.toBe<Promise<undefined>>();
      expect(interaction.launchActivity({ withResponse: booleanValue })).type.toBe<
        Promise<InteractionCallbackResponse<false> | undefined>
      >();
    } else if (interaction.inGuild()) {
      expect(interaction).type.toBeAssignableTo<MessageComponentInteraction>();
      expect(interaction.component).type.toBe<
        APIButtonComponent | APISelectMenuComponent | MessageActionRowComponent
      >();
      expect(interaction.message).type.toBe<Message>();
      expect(interaction.guild).type.toBe<Guild | null>();
      expect(interaction.reply({ content: 'a', withResponse: true })).type.toBe<Promise<InteractionCallbackResponse>>();
      expect(interaction.deferReply({ withResponse: true })).type.toBe<Promise<InteractionCallbackResponse>>();
      expect(interaction.reply({ content: 'a', withResponse: false })).type.toBe<Promise<undefined>>();
      expect(interaction.deferReply({ withResponse: false })).type.toBe<Promise<undefined>>();
      expect(interaction.deferReply()).type.toBe<Promise<undefined>>();
      expect(interaction.reply({ content: 'a', withResponse: booleanValue })).type.toBe<
        Promise<InteractionCallbackResponse | undefined>
      >();
      expect(interaction.deferReply({ withResponse: booleanValue })).type.toBe<
        Promise<InteractionCallbackResponse | undefined>
      >();
      expect(interaction.editReply({ content: 'a' })).type.toBe<Promise<Message>>();
      expect(interaction.fetchReply()).type.toBe<Promise<Message>>();
      expect(interaction.update({ content: 'a', withResponse: true })).type.toBe<
        Promise<InteractionCallbackResponse>
      >();
      expect(interaction.update({ content: 'a', withResponse: false })).type.toBe<Promise<undefined>>();
      expect(interaction.update({ content: 'a', withResponse: booleanValue })).type.toBe<
        Promise<InteractionCallbackResponse | undefined>
      >();
      expect(interaction.update()).type.toBe<Promise<undefined>>();
      expect(interaction.deferUpdate({ withResponse: true })).type.toBe<Promise<InteractionCallbackResponse>>();
      expect(interaction.deferUpdate()).type.toBe<Promise<undefined>>();
      expect(interaction.followUp({ content: 'a' })).type.toBe<Promise<Message>>();
      expect(interaction.launchActivity({ withResponse: true })).type.toBe<Promise<InteractionCallbackResponse>>();
      expect(interaction.launchActivity({ withResponse: false })).type.toBe<Promise<undefined>>();
      expect(interaction.launchActivity({ withResponse: booleanValue })).type.toBe<
        Promise<InteractionCallbackResponse | undefined>
      >();
    }
  }

  if (interaction.inCachedGuild()) {
    expect(interaction.member).type.toBeAssignableTo<GuildMember>();
    expect(interaction).type.not.toBe<ChatInputCommandInteraction<'cached'>>();
    expect(interaction).type.toBeAssignableTo<Interaction>();
    expect(interaction.guildLocale).type.toBe<Locale>();
  } else if (interaction.inRawGuild()) {
    expect(interaction.member).type.toBeAssignableTo<APIInteractionGuildMember>();
    expect(interaction).type.not.toBeAssignableTo<Interaction<'cached'>>();
    expect(interaction.guildLocale).type.toBe<Locale>();
  } else if (interaction.inGuild()) {
    expect(interaction.guildLocale).type.toBe<Locale>();
  } else {
    expect(interaction.member).type.toBe<APIInteractionGuildMember | GuildMember | null>();
    expect(interaction).type.not.toBeAssignableTo<Interaction<'cached'>>();
    expect(interaction.guildId).type.toBe<string | null>();
  }

  if (
    interaction.type === InteractionType.ApplicationCommand &&
    (interaction.commandType === ApplicationCommandType.User ||
      interaction.commandType === ApplicationCommandType.Message)
  ) {
    expect(interaction).type.toBe<MessageContextMenuCommandInteraction | UserContextMenuCommandInteraction>();
    expect(interaction.options).type.not.toHaveProperty('getAttachment');
    if (interaction.inCachedGuild()) {
      expect(interaction).type.toBeAssignableTo<ContextMenuCommandInteraction>();
      expect(interaction.guild).type.toBeAssignableTo<Guild>();
      expect(interaction).type.toBeAssignableTo<CommandInteraction<'cached'>>();
      expect(interaction.reply({ content: 'a', withResponse: true })).type.toBe<
        Promise<InteractionCallbackResponse<true>>
      >();
      expect(interaction.deferReply({ withResponse: true })).type.toBe<Promise<InteractionCallbackResponse<true>>>();
      expect(interaction.deferReply()).type.toBe<Promise<undefined>>();
      expect(interaction.reply({ content: 'a', withResponse: false })).type.toBe<Promise<undefined>>();
      expect(interaction.deferReply({ withResponse: false })).type.toBe<Promise<undefined>>();
      expect(interaction.reply({ content: 'a', withResponse: booleanValue })).type.toBe<
        Promise<InteractionCallbackResponse<true> | undefined>
      >();
      expect(interaction.deferReply({ withResponse: booleanValue })).type.toBe<
        Promise<InteractionCallbackResponse<true> | undefined>
      >();
      expect(interaction.editReply({ content: 'a' })).type.toBe<Promise<Message<true>>>();
      expect(interaction.fetchReply()).type.toBe<Promise<Message<true>>>();
      expect(interaction.followUp({ content: 'a' })).type.toBe<Promise<Message<true>>>();
      expect(interaction.launchActivity({ withResponse: true })).type.toBe<
        Promise<InteractionCallbackResponse<true>>
      >();
      expect(interaction.launchActivity({ withResponse: false })).type.toBe<Promise<undefined>>();
      expect(interaction.launchActivity({ withResponse: booleanValue })).type.toBe<
        Promise<InteractionCallbackResponse<true> | undefined>
      >();
    } else if (interaction.inRawGuild()) {
      expect(interaction).type.toBeAssignableTo<ContextMenuCommandInteraction>();
      expect(interaction.guild).type.toBe<null>();
      expect(interaction.reply({ content: 'a', withResponse: true })).type.toBe<
        Promise<InteractionCallbackResponse<false>>
      >();
      expect(interaction.deferReply({ withResponse: true })).type.toBe<Promise<InteractionCallbackResponse<false>>>();
      expect(interaction.deferReply()).type.toBe<Promise<undefined>>();
      expect(interaction.reply({ content: 'a', withResponse: false })).type.toBe<Promise<undefined>>();
      expect(interaction.deferReply({ withResponse: false })).type.toBe<Promise<undefined>>();
      expect(interaction.reply({ content: 'a', withResponse: booleanValue })).type.toBe<
        Promise<InteractionCallbackResponse<false> | undefined>
      >();
      expect(interaction.deferReply({ withResponse: booleanValue })).type.toBe<
        Promise<InteractionCallbackResponse<false> | undefined>
      >();
      expect(interaction.editReply({ content: 'a' })).type.toBe<Promise<Message<false>>>();
      expect(interaction.fetchReply()).type.toBe<Promise<Message<false>>>();
      expect(interaction.followUp({ content: 'a' })).type.toBe<Promise<Message<false>>>();
      expect(interaction.launchActivity({ withResponse: true })).type.toBe<
        Promise<InteractionCallbackResponse<false>>
      >();
      expect(interaction.launchActivity({ withResponse: false })).type.toBe<Promise<undefined>>();
      expect(interaction.launchActivity({ withResponse: booleanValue })).type.toBe<
        Promise<InteractionCallbackResponse<false> | undefined>
      >();
    } else if (interaction.inGuild()) {
      expect(interaction).type.toBeAssignableTo<ContextMenuCommandInteraction>();
      expect(interaction.guild).type.toBe<Guild | null>();
      expect(interaction.reply({ content: 'a', withResponse: true })).type.toBe<Promise<InteractionCallbackResponse>>();
      expect(interaction.deferReply({ withResponse: true })).type.toBe<Promise<InteractionCallbackResponse>>();
      expect(interaction.deferReply()).type.toBe<Promise<undefined>>();
      expect(interaction.reply({ content: 'a', withResponse: false })).type.toBe<Promise<undefined>>();
      expect(interaction.deferReply({ withResponse: false })).type.toBe<Promise<undefined>>();
      expect(interaction.reply({ content: 'a', withResponse: booleanValue })).type.toBe<
        Promise<InteractionCallbackResponse | undefined>
      >();
      expect(interaction.deferReply({ withResponse: booleanValue })).type.toBe<
        Promise<InteractionCallbackResponse | undefined>
      >();
      expect(interaction.editReply({ content: 'a' })).type.toBe<Promise<Message>>();
      expect(interaction.fetchReply()).type.toBe<Promise<Message>>();
      expect(interaction.followUp({ content: 'a' })).type.toBe<Promise<Message>>();
      expect(interaction.launchActivity({ withResponse: true })).type.toBe<Promise<InteractionCallbackResponse>>();
      expect(interaction.launchActivity({ withResponse: false })).type.toBe<Promise<undefined>>();
      expect(interaction.launchActivity({ withResponse: booleanValue })).type.toBe<
        Promise<InteractionCallbackResponse | undefined>
      >();
    }
  }

  if (
    interaction.type === InteractionType.ApplicationCommand &&
    interaction.commandType === ApplicationCommandType.Message
  ) {
    expect(interaction.targetMessage).type.toBe<Message>();
    expect(interaction.options.getMessage('_MESSAGE')).type.toBe<Message | null>();
    if (interaction.inCachedGuild()) {
      expect(interaction.targetMessage).type.toBe<Message<true>>();
      expect(interaction.options.getMessage('_MESSAGE')).type.toBe<Message<true> | null>();
    } else if (interaction.inRawGuild()) {
      expect(interaction.targetMessage).type.toBe<Message<false>>();
      expect(interaction.options.getMessage('_MESSAGE')).type.toBe<Message<false> | null>();
    } else if (interaction.inGuild()) {
      expect(interaction.targetMessage).type.toBe<Message>();
      expect(interaction.options.getMessage('_MESSAGE')).type.toBe<Message | null>();
    }
  }

  if (
    interaction.type === InteractionType.ApplicationCommand &&
    interaction.commandType === ApplicationCommandType.User
  ) {
    expect(interaction.targetUser).type.toBe<User>();
    expect(interaction.targetMember).type.toBe<APIInteractionGuildMember | GuildMember | null>();
    expect(interaction.options.getUser('user')).type.toBe<User | null>();
    expect(interaction.options.getMember('user')).type.toBe<
      APIInteractionDataResolvedGuildMember | GuildMember | null
    >();
    if (interaction.inCachedGuild()) {
      expect(interaction.targetMember).type.toBe<GuildMember | null>();
      expect(interaction.options.getMember('user')).type.toBe<GuildMember | null>();
    } else if (interaction.inRawGuild()) {
      expect(interaction.targetMember).type.toBe<APIInteractionGuildMember | null>();
      expect(interaction.options.getMember('user')).type.toBe<APIInteractionDataResolvedGuildMember | null>();
    } else if (interaction.inGuild()) {
      expect(interaction.targetMember).type.toBe<APIInteractionGuildMember | GuildMember | null>();
      expect(interaction.options.getMember('user')).type.toBe<
        APIInteractionDataResolvedGuildMember | GuildMember | null
      >();
    }
  }

  if (interaction.type === InteractionType.MessageComponent && interaction.componentType === ComponentType.Button) {
    expect(interaction).type.toBe<ButtonInteraction>();
    expect(interaction.component).type.toBe<APIButtonComponent | ButtonComponent>();
    expect(interaction.message).type.toBe<Message>();
    if (interaction.inCachedGuild()) {
      expect(interaction).type.toBeAssignableTo<ButtonInteraction>();
      expect(interaction.component).type.toBe<ButtonComponent>();
      expect(interaction.message).type.toBe<Message<true>>();
      expect(interaction.guild).type.toBe<Guild>();
      expect(interaction.reply({ withResponse: true })).type.toBe<Promise<InteractionCallbackResponse<true>>>();
    } else if (interaction.inRawGuild()) {
      expect(interaction).type.toBeAssignableTo<ButtonInteraction>();
      expect(interaction.component).type.toBe<APIButtonComponent>();
      expect(interaction.message).type.toBe<Message<false>>();
      expect(interaction.guild).type.toBe<null>();
      expect(interaction.reply({ withResponse: true })).type.toBe<Promise<InteractionCallbackResponse<false>>>();
    } else if (interaction.inGuild()) {
      expect(interaction).type.toBeAssignableTo<ButtonInteraction>();
      expect(interaction.component).type.toBe<APIButtonComponent | ButtonComponent>();
      expect(interaction.message).type.toBe<Message>();
      expect(interaction.guild).type.toBeAssignableTo<Guild | null>();
      expect(interaction.reply({ withResponse: true })).type.toBe<Promise<InteractionCallbackResponse>>();
    }
  }

  if (
    interaction.type === InteractionType.MessageComponent &&
    interaction.componentType === ComponentType.StringSelect
  ) {
    expect(interaction).type.toBe<StringSelectMenuInteraction>();
    expect(interaction.component).type.toBe<APIStringSelectComponent | StringSelectMenuComponent>();
    expect(interaction.message).type.toBe<Message>();
    if (interaction.inCachedGuild()) {
      expect(interaction).type.toBeAssignableTo<StringSelectMenuInteraction>();
      expect(interaction.component).type.toBe<StringSelectMenuComponent>();
      expect(interaction.message).type.toBe<Message<true>>();
      expect(interaction.guild).type.toBe<Guild>();
      expect(interaction.reply({ withResponse: true })).type.toBe<Promise<InteractionCallbackResponse<true>>>();
    } else if (interaction.inRawGuild()) {
      expect(interaction).type.toBeAssignableTo<StringSelectMenuInteraction>();
      expect(interaction.component).type.toBe<APIStringSelectComponent>();
      expect(interaction.message).type.toBe<Message<false>>();
      expect(interaction.guild).type.toBe<null>();
      expect(interaction.reply({ withResponse: true })).type.toBe<Promise<InteractionCallbackResponse<false>>>();
    } else if (interaction.inGuild()) {
      expect(interaction).type.toBeAssignableTo<StringSelectMenuInteraction>();
      expect(interaction.component).type.toBe<APIStringSelectComponent | StringSelectMenuComponent>();
      expect(interaction.message).type.toBe<Message>();
      expect(interaction.guild).type.toBe<Guild | null>();
      expect(interaction.reply({ withResponse: true })).type.toBe<Promise<InteractionCallbackResponse>>();
    }
  }

  if (
    interaction.type === InteractionType.ApplicationCommand &&
    interaction.commandType === ApplicationCommandType.ChatInput
  ) {
    if (interaction.inRawGuild()) {
      expect(interaction).type.not.toBeAssignableTo<Interaction<'cached'>>();
      expect(interaction).type.toBeAssignableTo<ChatInputCommandInteraction>();
      expect(interaction.reply({ withResponse: true })).type.toBe<Promise<InteractionCallbackResponse<false>>>();
      expect(interaction.options.getMember('test')).type.toBe<APIInteractionDataResolvedGuildMember | null>();

      expect(interaction.options.getChannel('test', true)).type.toBe<APIInteractionDataResolvedChannel>();
      expect(interaction.options.getRole('test', true)).type.toBe<APIRole>();
    } else if (interaction.inCachedGuild()) {
      expect(interaction.options.getMember('test')).type.toBe<GuildMember | null>();
      expect(interaction).type.toBeAssignableTo<ChatInputCommandInteraction>();
      expect(interaction.reply({ withResponse: true })).type.toBe<Promise<InteractionCallbackResponse<true>>>();

      expect(interaction.options.getChannel('test', true)).type.toBe<GuildBasedChannel>();
      expect(interaction.options.getRole('test', true)).type.toBe<Role>();

      expect(interaction.options.getChannel('test', true, [ChannelType.PublicThread])).type.toBe<PublicThreadChannel>();
      expect(
        interaction.options.getChannel('test', true, [ChannelType.AnnouncementThread]),
      ).type.toBe<PublicThreadChannel>();
      expect(
        interaction.options.getChannel('test', true, [ChannelType.PublicThread, ChannelType.AnnouncementThread]),
      ).type.toBe<PublicThreadChannel>();
      expect(
        interaction.options.getChannel('test', true, [ChannelType.PrivateThread]),
      ).type.toBe<PrivateThreadChannel>();

      expect(interaction.options.getChannel('test', true, [ChannelType.GuildText])).type.toBe<TextChannel>();
      expect(interaction.options.getChannel('test', false, [ChannelType.GuildText])).type.toBe<TextChannel | null>();
      expect(interaction.options.getChannel('test', true, [ChannelType.GuildForum, ChannelType.GuildVoice])).type.toBe<
        ForumChannel | VoiceChannel
      >();
      expect(interaction.options.getChannel('test', true, [ChannelType.GuildText] as const)).type.toBe<TextChannel>();
      expect(interaction.options.getChannel('test', false, [ChannelType.GuildForum, ChannelType.GuildVoice])).type.toBe<
        ForumChannel | VoiceChannel | null
      >();
      expect(interaction.options.getChannel('test', true, [ChannelType.GuildMedia])).type.toBe<MediaChannel>();

      const resolvedChannel = interaction.options.getChannel('test', true);
      expect(resolvedChannel.permissions).type.toBe<Readonly<PermissionsBitField> | null>();
      expect(resolvedChannel.appPermissions).type.toBe<Readonly<PermissionsBitField> | null>();
    } else {
      expect(interaction).type.toBe<ChatInputCommandInteraction>();
      expect(interaction.reply({ withResponse: true })).type.toBe<Promise<InteractionCallbackResponse>>();
      expect(interaction.options.getMember('test')).type.toBe<
        APIInteractionDataResolvedGuildMember | GuildMember | null
      >();

      expect(interaction.options.getChannel('test', true)).type.toBe<
        APIInteractionDataResolvedChannel | GuildBasedChannel
      >();
      expect(interaction.options.getRole('test', true)).type.toBe<APIRole | Role>();
    }

    expect(interaction).type.toBe<ChatInputCommandInteraction>();
    expect(interaction.options).type.toBe<
      Omit<CommandInteractionOptionResolver<CacheType>, 'getFocused' | 'getMessage'>
    >();
    expect(interaction.options.data).type.toBe<readonly CommandInteractionOption[]>();

    const optionalOption = interaction.options.get('name');
    const requiredOption = interaction.options.get('name', true);
    expect(optionalOption).type.toBe<CommandInteractionOption | null>();
    expect(requiredOption).type.toBe<CommandInteractionOption>();
    expect(requiredOption.options).type.toBe<readonly CommandInteractionOption[] | undefined>();

    expect(interaction.options.getString('name', booleanValue)).type.toBe<string | null>();
    expect(interaction.options.getString('name', false)).type.toBe<string | null>();
    expect(interaction.options.getString('name', true)).type.toBe<string>();

    expect(interaction.options.getSubcommand()).type.toBe<string>();
    expect(interaction.options.getSubcommand(true)).type.toBe<string>();
    expect(interaction.options.getSubcommand(booleanValue)).type.toBe<string | null>();
    expect(interaction.options.getSubcommand(false)).type.toBe<string | null>();

    expect(interaction.options.getSubcommandGroup(true)).type.toBe<string>();
    expect(interaction.options.getSubcommandGroup()).type.toBe<string | null>();
    expect(interaction.options.getSubcommandGroup(booleanValue)).type.toBe<string | null>();
    expect(interaction.options.getSubcommandGroup(false)).type.toBe<string | null>();

    expect(interaction.options).type.not.toHaveProperty('getMessage');
  }

  if (
    interaction.type === InteractionType.ApplicationCommand &&
    interaction.commandType === ApplicationCommandType.PrimaryEntryPoint
  ) {
    expect(interaction).type.toBe<PrimaryEntryPointCommandInteraction>();

    expect(interaction).type.not.toHaveProperty('options');
    if (interaction.inCachedGuild()) {
      expect(interaction).type.toBeAssignableTo<PrimaryEntryPointCommandInteraction>();
      expect(interaction.guild).type.toBeAssignableTo<Guild>();
      expect(interaction).type.toBeAssignableTo<CommandInteraction<'cached'>>();
      expect(interaction.reply({ content: 'a', withResponse: true })).type.toBe<
        Promise<InteractionCallbackResponse<true>>
      >();
      expect(interaction.deferReply({ withResponse: true })).type.toBe<Promise<InteractionCallbackResponse<true>>>();
      expect(interaction.deferReply()).type.toBe<Promise<undefined>>();
      expect(interaction.reply({ content: 'a', withResponse: false })).type.toBe<Promise<undefined>>();
      expect(interaction.deferReply({ withResponse: false })).type.toBe<Promise<undefined>>();
      expect(interaction.reply({ content: 'a', withResponse: booleanValue })).type.toBe<
        Promise<InteractionCallbackResponse<true> | undefined>
      >();
      expect(interaction.deferReply({ withResponse: booleanValue })).type.toBe<
        Promise<InteractionCallbackResponse<true> | undefined>
      >();
      expect(interaction.editReply({ content: 'a' })).type.toBe<Promise<Message<true>>>();
      expect(interaction.fetchReply()).type.toBe<Promise<Message<true>>>();
      expect(interaction.followUp({ content: 'a' })).type.toBe<Promise<Message<true>>>();
      expect(interaction.launchActivity({ withResponse: true })).type.toBe<
        Promise<InteractionCallbackResponse<true>>
      >();
      expect(interaction.launchActivity({ withResponse: false })).type.toBe<Promise<undefined>>();
      expect(interaction.launchActivity({ withResponse: booleanValue })).type.toBe<
        Promise<InteractionCallbackResponse<true> | undefined>
      >();
    } else if (interaction.inRawGuild()) {
      expect(interaction).type.toBeAssignableTo<PrimaryEntryPointCommandInteraction>();
      expect(interaction.guild).type.toBe<null>();
      expect(interaction.reply({ content: 'a', withResponse: true })).type.toBe<
        Promise<InteractionCallbackResponse<false>>
      >();
      expect(interaction.deferReply({ withResponse: true })).type.toBe<Promise<InteractionCallbackResponse<false>>>();
      expect(interaction.deferReply()).type.toBe<Promise<undefined>>();
      expect(interaction.reply({ content: 'a', withResponse: false })).type.toBe<Promise<undefined>>();
      expect(interaction.deferReply({ withResponse: false })).type.toBe<Promise<undefined>>();
      expect(interaction.reply({ content: 'a', withResponse: booleanValue })).type.toBe<
        Promise<InteractionCallbackResponse<false> | undefined>
      >();
      expect(interaction.deferReply({ withResponse: booleanValue })).type.toBe<
        Promise<InteractionCallbackResponse<false> | undefined>
      >();
      expect(interaction.editReply({ content: 'a' })).type.toBe<Promise<Message<false>>>();
      expect(interaction.fetchReply()).type.toBe<Promise<Message<false>>>();
      expect(interaction.followUp({ content: 'a' })).type.toBe<Promise<Message<false>>>();
      expect(interaction.launchActivity({ withResponse: true })).type.toBe<
        Promise<InteractionCallbackResponse<false>>
      >();
      expect(interaction.launchActivity({ withResponse: false })).type.toBe<Promise<undefined>>();
      expect(interaction.launchActivity({ withResponse: booleanValue })).type.toBe<
        Promise<InteractionCallbackResponse<false> | undefined>
      >();
    } else if (interaction.inGuild()) {
      expect(interaction).type.toBeAssignableTo<PrimaryEntryPointCommandInteraction>();
      expect(interaction.guild).type.toBe<Guild | null>();
      expect(interaction.reply({ content: 'a', withResponse: true })).type.toBe<Promise<InteractionCallbackResponse>>();
      expect(interaction.deferReply({ withResponse: true })).type.toBe<Promise<InteractionCallbackResponse>>();
      expect(interaction.deferReply()).type.toBe<Promise<undefined>>();
      expect(interaction.reply({ content: 'a', withResponse: false })).type.toBe<Promise<undefined>>();
      expect(interaction.deferReply({ withResponse: false })).type.toBe<Promise<undefined>>();
      expect(interaction.reply({ content: 'a', withResponse: booleanValue })).type.toBe<
        Promise<InteractionCallbackResponse | undefined>
      >();
      expect(interaction.deferReply({ withResponse: booleanValue })).type.toBe<
        Promise<InteractionCallbackResponse | undefined>
      >();
      expect(interaction.editReply({ content: 'a' })).type.toBe<Promise<Message>>();
      expect(interaction.fetchReply()).type.toBe<Promise<Message>>();
      expect(interaction.followUp({ content: 'a' })).type.toBe<Promise<Message>>();
      expect(interaction.launchActivity({ withResponse: true })).type.toBe<Promise<InteractionCallbackResponse>>();
      expect(interaction.launchActivity({ withResponse: false })).type.toBe<Promise<undefined>>();
      expect(interaction.launchActivity({ withResponse: booleanValue })).type.toBe<
        Promise<InteractionCallbackResponse | undefined>
      >();
    }
  }

  if (interaction.isRepliable()) {
    expect(interaction).type.toBeAssignableTo<RepliableInteraction>();
    await interaction.reply('test');
    await interaction.reply({ withResponse: false });
  }

  if (
    interaction.type === InteractionType.ApplicationCommand &&
    interaction.commandType === ApplicationCommandType.ChatInput &&
    interaction.isRepliable()
  ) {
    expect(interaction).type.toBeAssignableTo<CommandInteraction>();
    expect(interaction).type.toBeAssignableTo<RepliableInteraction>();
  }

  if (interaction.type === InteractionType.ModalSubmit && interaction.isRepliable()) {
    expect(interaction).type.toBe<ModalSubmitInteraction>();
    if (interaction.inCachedGuild()) {
      expect(interaction).type.toBeAssignableTo<ModalSubmitInteraction>();
      expect(interaction.guild).type.toBe<Guild>();
      expect(interaction.reply({ content: 'a', withResponse: true })).type.toBe<
        Promise<InteractionCallbackResponse<true>>
      >();
      expect(interaction.deferReply({ withResponse: true })).type.toBe<Promise<InteractionCallbackResponse<true>>>();
      expect(interaction.deferReply()).type.toBe<Promise<undefined>>();
      expect(interaction.editReply({ content: 'a' })).type.toBe<Promise<Message<true>>>();
      expect(interaction.fetchReply()).type.toBe<Promise<Message<true>>>();
      expect(interaction.deferUpdate({ withResponse: true })).type.toBe<Promise<InteractionCallbackResponse<true>>>();
      expect(interaction.deferUpdate()).type.toBe<Promise<undefined>>();
      expect(interaction.followUp({ content: 'a' })).type.toBe<Promise<Message<true>>>();
      expect(interaction.launchActivity({ withResponse: true })).type.toBe<
        Promise<InteractionCallbackResponse<true>>
      >();
    } else if (interaction.inRawGuild()) {
      expect(interaction).type.toBeAssignableTo<ModalSubmitInteraction>();
      expect(interaction.guild).type.toBe<null>();
      expect(interaction.reply({ content: 'a', withResponse: true })).type.toBe<
        Promise<InteractionCallbackResponse<false>>
      >();
      expect(interaction.deferReply({ withResponse: true })).type.toBe<Promise<InteractionCallbackResponse<false>>>();
      expect(interaction.deferReply()).type.toBe<Promise<undefined>>();
      expect(interaction.editReply({ content: 'a' })).type.toBe<Promise<Message<false>>>();
      expect(interaction.fetchReply()).type.toBe<Promise<Message<false>>>();
      expect(interaction.deferUpdate({ withResponse: true })).type.toBe<Promise<InteractionCallbackResponse<false>>>();
      expect(interaction.deferUpdate()).type.toBe<Promise<undefined>>();
      expect(interaction.followUp({ content: 'a' })).type.toBe<Promise<Message<false>>>();
      expect(interaction.launchActivity({ withResponse: true })).type.toBe<
        Promise<InteractionCallbackResponse<false>>
      >();
    } else if (interaction.inGuild()) {
      expect(interaction).type.toBeAssignableTo<ModalSubmitInteraction>();
      expect(interaction.guild).type.toBe<Guild | null>();
      expect(interaction.reply({ content: 'a', withResponse: true })).type.toBe<Promise<InteractionCallbackResponse>>();
      expect(interaction.deferReply({ withResponse: true })).type.toBe<Promise<InteractionCallbackResponse>>();
      expect(interaction.deferReply()).type.toBe<Promise<undefined>>();
      expect(interaction.editReply({ content: 'a' })).type.toBe<Promise<Message>>();
      expect(interaction.fetchReply()).type.toBe<Promise<Message>>();
      expect(interaction.deferUpdate({ withResponse: true })).type.toBe<Promise<InteractionCallbackResponse>>();
      expect(interaction.deferUpdate()).type.toBe<Promise<undefined>>();
      expect(interaction.followUp({ content: 'a' })).type.toBe<Promise<Message>>();
      expect(interaction.launchActivity({ withResponse: true })).type.toBe<Promise<InteractionCallbackResponse>>();
    }
  }
});

declare const shard: Shard;

shard.on('death', process => {
  expect(process).type.toBe<ChildProcess | Worker>();
});

declare const collector: Collector<string, Interaction, string[]>;

collector.on('collect', (collected, ...other) => {
  expect(collected).type.toBe<Interaction>();
  expect(other).type.toBe<string[]>();
});

collector.on('dispose', (vals, ...other) => {
  expect(vals).type.toBe<Interaction>();
  expect(other).type.toBe<string[]>();
});

collector.on('end', (collection, reason) => {
  expect(collection).type.toBe<ReadonlyCollection<string, Interaction>>();
  expect(reason).type.toBe<string>();
});

(async () => {
  for await (const value of collector) {
    expect(value).type.toBe<[Interaction, ...string[]]>();
  }
})();

expect(shard.eval(client => client.readyTimestamp)).type.toBe<Promise<number | null>>();

// Test audit logs
expect(guild.fetchAuditLogs({ type: AuditLogEvent.MemberKick })).type.toBe<
  Promise<GuildAuditLogs<AuditLogEvent.MemberKick>>
>();

expect(guild.fetchAuditLogs({ type: AuditLogEvent.ChannelCreate })).type.toBe<
  Promise<GuildAuditLogs<AuditLogEvent.ChannelCreate>>
>();

expect(guild.fetchAuditLogs({ type: AuditLogEvent.IntegrationUpdate })).type.toBe<
  Promise<GuildAuditLogs<AuditLogEvent.IntegrationUpdate>>
>();

expect(guild.fetchAuditLogs({ type: null })).type.toBe<Promise<GuildAuditLogs<AuditLogEvent>>>();
expect(guild.fetchAuditLogs()).type.toBe<Promise<GuildAuditLogs<AuditLogEvent>>>();

expect(guild.fetchAuditLogs({ type: AuditLogEvent.MemberKick }).then(al => al.entries.first())).type.toBe<
  Promise<GuildAuditLogsEntry<AuditLogEvent.MemberKick, 'Delete', 'User'> | undefined>
>();
expect(guild.fetchAuditLogs({ type: AuditLogEvent.MemberKick }).then(al => al.entries.first())).type.toBeAssignableTo<
  Promise<GuildAuditLogsEntry<AuditLogEvent.MemberKick, 'Delete', 'User'> | undefined>
>();

expect(guild.fetchAuditLogs({ type: null }).then(al => al.entries.first())).type.toBe<
  Promise<GuildAuditLogsEntry<AuditLogEvent, GuildAuditLogsActionType, GuildAuditLogsTargetType> | undefined>
>();
expect(guild.fetchAuditLogs().then(al => al.entries.first())).type.toBe<
  Promise<GuildAuditLogsEntry<AuditLogEvent, GuildAuditLogsActionType, GuildAuditLogsTargetType> | undefined>
>();

expect(guild.fetchAuditLogs({ type: AuditLogEvent.MemberKick }).then(al => al.entries.first()?.extra)).type.toBe<
  Promise<{ integrationType: string } | null | undefined>
>();

expect(guild.fetchAuditLogs({ type: AuditLogEvent.MemberRoleUpdate }).then(al => al.entries.first()?.extra)).type.toBe<
  Promise<{ integrationType: string } | null | undefined>
>();

expect(
  guild.fetchAuditLogs({ type: AuditLogEvent.StageInstanceCreate }).then(al => al.entries.first()?.extra),
).type.toBe<Promise<StageChannel | { id: Snowflake } | undefined>>();
expect(guild.fetchAuditLogs({ type: AuditLogEvent.MessageDelete }).then(al => al.entries.first()?.extra)).type.toBe<
  Promise<{ channel: GuildTextBasedChannel | { id: Snowflake }; count: number } | undefined>
>();

expect(guild.fetchAuditLogs({ type: AuditLogEvent.MemberKick }).then(al => al.entries.first()?.target)).type.toBe<
  Promise<PartialUser | User | null | undefined>
>();
expect(
  guild.fetchAuditLogs({ type: AuditLogEvent.StageInstanceCreate }).then(al => al.entries.first()?.target),
).type.toBe<Promise<StageInstance | undefined>>();
expect(guild.fetchAuditLogs({ type: AuditLogEvent.MessageDelete }).then(al => al.entries.first()?.target)).type.toBe<
  Promise<User | null | undefined>
>();
expect(
  guild.fetchAuditLogs({ type: AuditLogEvent.MessageBulkDelete }).then(al => al.entries.first()?.target),
).type.toBe<Promise<GuildTextBasedChannel | { id: string } | undefined>>();

declare const AuditLogChange: AuditLogChange;
expect(AuditLogChange.old).type.not.toBe<boolean | undefined>();
expect(AuditLogChange.new).type.not.toBe<boolean | undefined>();
if (AuditLogChange.key === 'available') {
  expect(AuditLogChange.old).type.toBe<boolean | undefined>();
  expect(AuditLogChange.new).type.toBe<boolean | undefined>();
}

declare const TextBasedChannel: TextBasedChannel;
declare const TextBasedChannelTypes: TextBasedChannelTypes;
declare const VoiceBasedChannel: VoiceBasedChannel;
declare const GuildBasedChannel: GuildBasedChannel;
declare const NonThreadGuildBasedChannel: NonThreadGuildBasedChannel;
declare const GuildTextBasedChannel: GuildTextBasedChannel;

expect(TextBasedChannel).type.toBe<TextBasedChannel>();
expect(TextBasedChannelTypes).type.toBe<
  | ChannelType.DM
  | ChannelType.GroupDM
  | ChannelType.GuildAnnouncement
  | ChannelType.GuildStageVoice
  | ChannelType.GuildText
  | ChannelType.GuildVoice
  | ThreadChannelType
>();
expect(VoiceBasedChannel).type.toBe<StageChannel | VoiceChannel>();
expect(GuildBasedChannel).type.toBe<GuildBasedChannel>();
expect(NonThreadGuildBasedChannel).type.toBe<
  AnnouncementChannel | CategoryChannel | ForumChannel | MediaChannel | StageChannel | TextChannel | VoiceChannel
>();
expect(GuildTextBasedChannel).type.toBe<GuildTextBasedChannel>();

new EmbedBuilder().setColor(resolveColor('#ffffff'));

expect({
  type: ComponentType.ActionRow,
  components: [
    {
      type: ComponentType.Button,
    },
  ],
}).type.not.toBeAssignableTo<ActionRowData<MessageActionRowComponentData>>();

declare const chatInputInteraction: ChatInputCommandInteraction;

expect(chatInputInteraction.options.getAttachment('attachment', true)).type.toBe<Attachment>();
expect(chatInputInteraction.options.getAttachment('attachment')).type.toBe<Attachment | null>();

declare const modal: ModalBuilder;

await chatInputInteraction.showModal(modal);

await chatInputInteraction.showModal({
  title: 'abc',
  custom_id: 'abc',
  components: [
    {
      component: {
        type: ComponentType.StringSelect,
        id: 2,
        custom_id: 'aa',
        options: [{ label: 'a', value: 'b' }],
      },
      type: ComponentType.Label,
      label: 'yo',
    },
    {
      component: {
        type: ComponentType.FileUpload,
        custom_id: 'upload',
        file_types: ['image', '.pdf'],
      },
      type: ComponentType.Label,
      label: 'upload',
    },
  ],
});

await chatInputInteraction.showModal({
  title: 'abc',
  customId: 'abc',
  components: [
    {
      type: ComponentType.Label,
      component: {
        type: ComponentType.TextInput,
        style: TextInputStyle.Short,
        customId: 'aa',
      },
      label: 'yo',
    },
    {
      type: ComponentType.Label,
      component: {
        type: ComponentType.UserSelect,
        customId: 'user',
      },
      label: 'aa',
    },
    {
      type: ComponentType.Label,
      component: {
        type: ComponentType.RoleSelect,
        customId: 'role',
      },
      label: 'bb',
    },
    {
      type: ComponentType.Label,
      component: {
        type: ComponentType.ChannelSelect,
        customId: 'channel',
        channelTypes: [ChannelType.GuildText, ChannelType.GuildVoice],
      },
      label: 'cc',
    },
    {
      type: ComponentType.Label,
      component: {
        type: ComponentType.FileUpload,
        customId: 'upload',
        fileTypes: ['video', '.mp4', '.mov'],
      },
      label: 'upload',
    },
  ],
});

expect({
  customId: 'upload',
  fileTypes: ['pdf'],
  type: ComponentType.FileUpload,
}).type.not.toBeAssignableTo<FileUploadComponentData>();

declare const stringSelectMenuComp: StringSelectMenuComponent;
new StringSelectMenuBuilder(stringSelectMenuComp.toJSON());

declare const userSelectMenuComp: UserSelectMenuComponent;
new UserSelectMenuBuilder(userSelectMenuComp.toJSON());

declare const roleSelectMenuComp: RoleSelectMenuComponent;
new RoleSelectMenuBuilder(roleSelectMenuComp.toJSON());

declare const channelSelectMenuComp: ChannelSelectMenuComponent;
new ChannelSelectMenuBuilder(channelSelectMenuComp.toJSON());

declare const mentionableSelectMenuComp: MentionableSelectMenuComponent;
new MentionableSelectMenuBuilder(mentionableSelectMenuComp.toJSON());

declare const buttonData: APIButtonComponentWithCustomId;
new PrimaryButtonBuilder(buttonData);

declare const buttonComp: ButtonComponent;
createComponentBuilder(buttonComp.toJSON());

declare const textInputData: APITextInputComponent;
new TextInputBuilder(textInputData);

declare const textInputComp: TextInputComponent;
new TextInputBuilder(textInputComp.toJSON());

declare const embedData: APIEmbed;
new EmbedBuilder(embedData);

declare const embedComp: Embed;
new EmbedBuilder(embedComp.toJSON());

declare const actionRowComp: ActionRow<ActionRowComponent>;
new ActionRowBuilder(actionRowComp.toJSON());

type UserMentionChannels = DMChannel | PartialDMChannel;
declare const channelMentionChannels: Exclude<Channel | DirectoryChannel, UserMentionChannels>;
declare const userMentionChannels: UserMentionChannels;

expect(channelMentionChannels.toString()).type.toBe<ChannelMention>();
expect(userMentionChannels.toString()).type.toBe<UserMention>();
expect(user.toString()).type.toBe<UserMention>();
expect(guildMember.toString()).type.toBe<UserMention>();

declare const webhook: Webhook;
declare const interactionWebhook: InteractionWebhook;
declare const snowflake: Snowflake;

expect(webhook.send('content')).type.toBe<Promise<Message<true>>>();
expect(webhook.editMessage(snowflake, 'content')).type.toBe<Promise<Message<true>>>();
expect(webhook.fetchMessage(snowflake)).type.toBe<Promise<Message<true>>>();
expect(webhook.edit({ name: 'name' })).type.toBe<Promise<Webhook>>();

expect(interactionWebhook.client).type.toBe<Client<true>>();
expect(interactionWebhook.send('content')).type.toBe<Promise<Message>>();
expect(interactionWebhook.editMessage(snowflake, 'content')).type.toBe<Promise<Message>>();
expect(interactionWebhook.fetchMessage(snowflake)).type.toBe<Promise<Message>>();

declare const partialGroupDMChannel: PartialGroupDMChannel;
declare const categoryChannel: CategoryChannel;
declare const stageChannel: StageChannel;
declare const forumChannel: ForumChannel;
declare const mediaChannel: MediaChannel;
declare const threadOnlyChannel: ThreadOnlyChannel;

// Threads have messages.
expect(threadChannel.messages).type.toBe<GuildMessageManager>();

// Thread-only channels have threads—not messages.
notPropertyOf(threadOnlyChannel, 'messages');
notPropertyOf(forumChannel, 'messages');
notPropertyOf(mediaChannel, 'messages');

await forumChannel.edit({
  availableTags: [...forumChannel.availableTags, { name: 'tag' }],
});

await forumChannel.setAvailableTags([{ ...forumChannel.availableTags, name: 'tag' }]);
await forumChannel.setAvailableTags([{ name: 'tag' }]);

expect(textChannel.flags).type.toBe<Readonly<ChannelFlagsBitField>>();
expect(voiceChannel.flags).type.toBe<Readonly<ChannelFlagsBitField>>();
expect(stageChannel.flags).type.toBe<Readonly<ChannelFlagsBitField>>();
expect(forumChannel.flags).type.toBe<Readonly<ChannelFlagsBitField>>();
expect(dmChannel.flags).type.toBe<Readonly<ChannelFlagsBitField>>();
expect(categoryChannel.flags).type.toBe<Readonly<ChannelFlagsBitField>>();
expect(announcementChannel.flags).type.toBe<Readonly<ChannelFlagsBitField>>();
expect(categoryChannel.flags).type.toBe<Readonly<ChannelFlagsBitField>>();
expect(threadChannel.flags).type.toBe<Readonly<ChannelFlagsBitField>>();

expect(partialGroupDMChannel.flags).type.toBe<null>();

// Select menu type narrowing
if (interaction.isSelectMenu()) {
  expect(interaction).type.toBe<SelectMenuInteraction>();
}

declare const anySelectMenu: SelectMenuInteraction;

if (anySelectMenu.isStringSelectMenu()) {
  expect(anySelectMenu).type.toBe<StringSelectMenuInteraction>();
} else if (anySelectMenu.isUserSelectMenu()) {
  expect(anySelectMenu).type.toBe<UserSelectMenuInteraction>();
} else if (anySelectMenu.isRoleSelectMenu()) {
  expect(anySelectMenu).type.toBe<RoleSelectMenuInteraction>();
} else if (anySelectMenu.isChannelSelectMenu()) {
  expect(anySelectMenu).type.toBe<ChannelSelectMenuInteraction>();
} else if (anySelectMenu.isMentionableSelectMenu()) {
  expect(anySelectMenu).type.toBe<MentionableSelectMenuInteraction>();
}

client.on('guildAuditLogEntryCreate', (auditLogEntry, guild) => {
  expect(auditLogEntry).type.toBe<GuildAuditLogsEntry>();
  expect(guild).type.toBe<Guild>();
});

expect(guildMember.flags).type.toBe<Readonly<GuildMemberFlagsBitField>>();

declare const emojiResolvable: Emoji | GuildEmoji | string;

{
  const onboarding = await guild.fetchOnboarding();
  expect(onboarding).type.toBe<GuildOnboarding>();

  expect(await guild.editOnboarding(onboarding)).type.toBe<GuildOnboarding>();

  await guild.editOnboarding({
    defaultChannels: onboarding.defaultChannels,
    enabled: onboarding.enabled,
    mode: onboarding.mode,
    prompts: onboarding.prompts,
  });

  const prompt = onboarding.prompts.first()!;
  const option = prompt.options.first()!;

  await guild.editOnboarding({ prompts: [prompt] });
  await guild.editOnboarding({ prompts: [{ ...prompt, options: [option] }] });

  await guild.editOnboarding({ prompts: [{ ...prompt, options: [{ ...option, emoji: emojiResolvable }] }] });
}

declare const partialDMChannel: PartialDMChannel;
expect(partialDMChannel.partial).type.toBe<true>();
expect(partialDMChannel.lastMessageId).type.toBe<undefined>();

declare const partialGuildMember: PartialGuildMember;
expect(partialGuildMember.partial).type.toBe<true>();
expect(partialGuildMember.joinedAt).type.toBe<null>();
expect(partialGuildMember.joinedTimestamp).type.toBe<null>();
expect(partialGuildMember.pending).type.toBe<null>();

declare const partialMessage: PartialMessage;
expect(partialMessage.partial).type.toBe<true>();
expect(partialMessage.type).type.toBe<null>();
expect(partialMessage.system).type.toBe<null>();
expect(partialMessage.pinned).type.toBe<null>();
expect(partialMessage.tts).type.toBe<null>();
expect(partialMessage.content).type.toBeAssignableTo<Message['content'] | null>();
expect(partialMessage.cleanContent).type.toBeAssignableTo<Message['cleanContent'] | null>();
expect(partialMessage.author).type.toBeAssignableTo<Message['author'] | null>();

declare const partialMessageReaction: PartialMessageReaction;
expect(partialMessageReaction.partial).type.toBe<true>();
expect(partialMessageReaction.count).type.toBe<null>();

declare const partialThreadMember: PartialThreadMember;
expect(partialThreadMember.partial).type.toBe<true>();
expect(partialThreadMember.flags).type.toBe<null>();
expect(partialThreadMember.joinedAt).type.toBe<null>();
expect(partialThreadMember.joinedTimestamp).type.toBe<null>();

declare const partialUser: PartialUser;
expect(partialUser.partial).type.toBe<true>();
expect(partialUser.username).type.toBe<null>();
expect(partialUser.tag).type.toBe<null>();
expect(partialUser.discriminator).type.toBe<null>();

declare const application: ClientApplication;
declare const entitlement: Entitlement;
declare const sku: SKU;
{
  expect(await application.fetchSKUs()).type.toBe<Collection<Snowflake, SKU>>();
  expect(await application.entitlements.fetch()).type.toBe<Collection<Snowflake, Entitlement>>();

  await application.entitlements.fetch({
    guild,
    skus: ['12345678901234567', sku],
    user,
    excludeEnded: true,
    limit: 10,
  });

  await application.entitlements.createTest({ sku: '12345678901234567', user });
  await application.entitlements.createTest({ sku, guild });

  await application.entitlements.deleteTest(entitlement);

  await application.entitlements.consume(snowflake);

  expect(entitlement.isActive()).type.toBe<boolean>();

  if (entitlement.isUserSubscription()) {
    expect(entitlement.userId).type.toBe<Snowflake>();
    expect(await entitlement.fetchUser()).type.toBe<User>();
    expect(entitlement.guildId).type.toBe<null>();
    expect(entitlement.guild).type.toBe<null>();

    await application.entitlements.deleteTest(entitlement);
  } else if (entitlement.isGuildSubscription()) {
    expect(entitlement.guildId).type.toBe<Snowflake>();
    expect(entitlement.guild).type.toBe<Guild>();

    await application.entitlements.deleteTest(entitlement);
  }

  if (entitlement.isTest()) {
    expect(entitlement.startsTimestamp).type.toBe<null>();
    expect(entitlement.endsTimestamp).type.toBe<null>();
    expect(entitlement.startsAt).type.toBe<null>();
    expect(entitlement.endsAt).type.toBe<null>();
  }

  client.on(Events.InteractionCreate, async interaction => {
    expect(interaction.entitlements).type.toBe<Collection<Snowflake, Entitlement>>();
  });
}

await client.channels.createMessage('123', {
  poll: {
    question: {
      text: 'Question',
    },
    duration: 60,
    answers: [{ text: 'Answer 1' }, { text: 'Answer 2', emoji: '<:1blade:874989932983238726>' }],
    allowMultiselect: false,
  },
});

declare const partialPoll: PartialPoll;
{
  if (partialPoll.partial) {
    expect(partialPoll.question.text).type.toBe<null>();
    expect(partialPoll.message).type.toBe<PartialMessage>();
    expect(partialPoll.allowMultiselect).type.toBe<null>();
    expect(partialPoll.layoutType).type.toBe<null>();
    expect(partialPoll.expiresTimestamp).type.toBe<null>();
    expect(partialPoll.answers).type.toBe<Collection<number, PartialPollAnswer>>();
  }
}

declare const partialPollAnswer: PartialPollAnswer;
{
  if (partialPollAnswer.partial) {
    expect(partialPollAnswer.poll).type.toBe<PartialPoll>();
    expect(partialPollAnswer.emoji).type.toBe<null>();
    expect(partialPollAnswer.text).type.toBe<null>();
  }
}

declare const poll: Poll;
declare const message: Message;
declare const pollData: PollData;
{
  expect(await poll.end()).type.toBe<Message>();
  expect(poll.partial).type.toBe<false>();
  expect(poll.answers).type.not.toBe<Collection<number, PartialPollAnswer>>();

  const answer = poll.answers.first()!;

  if (!answer.partial) {
    expect(answer.voteCount).type.toBe<number>();
    expect(answer.id).type.toBe<number>();
    expect(answer.voters).type.toBe<PollAnswerVoterManager>();
    expect(await answer.voters.fetch({ after: snowflake, limit: 10 })).type.toBe<Collection<Snowflake, User>>();
  }

  await messageManager.endPoll(snowflake);
  await messageManager.fetchPollAnswerVoters({
    messageId: snowflake,
    answerId: 1,
  });

  expect(message.edit).type.not.toBeCallableWith({
    poll: pollData,
  });

  await chatInputInteraction.editReply({ poll: pollData });
}

expect(await client.fetchStickerPacks()).type.toBe<Collection<Snowflake, StickerPack>>();
expect(await client.fetchStickerPacks({})).type.toBe<Collection<Snowflake, StickerPack>>();
expect(await client.fetchStickerPacks({ packId: snowflake })).type.toBe<StickerPack>();

client.on('interactionCreate', async interaction => {
  if (!interaction.channel) {
    return;
  }

  expect(interaction.channel).type.not.toHaveProperty('send');

  if (interaction.channel.isSendable()) {
    expect(interaction.channel).type.toBe<SendableChannels>();
    await interaction.channel.send({ embeds: [] });
  }
});

declare const guildScheduledEventManager: GuildScheduledEventManager;
await guildScheduledEventManager.edit(snowflake, { recurrenceRule: null });

{
  expect({
    startAt: new Date(),
    frequency: GuildScheduledEventRecurrenceRuleFrequency.Yearly as const,
    interval: 1,
    byMonth: [GuildScheduledEventRecurrenceRuleMonth.May],
    byMonthDay: [4],
    // Invalid property
    byWeekday: [GuildScheduledEventRecurrenceRuleWeekday.Monday],
  }).type.not.toBeAssignableTo<GuildScheduledEventRecurrenceRuleOptions>();

  expect({
    startAt: new Date(),
    frequency: GuildScheduledEventRecurrenceRuleFrequency.Yearly as const,
    interval: 1,
    byMonth: [GuildScheduledEventRecurrenceRuleMonth.May],
    byMonthDay: [4],
    // Invalid property
    byNWeekday: [{ n: 1, day: GuildScheduledEventRecurrenceRuleWeekday.Monday }],
  }).type.not.toBeAssignableTo<GuildScheduledEventRecurrenceRuleOptions>();

  expect({
    startAt: new Date(),
    frequency: GuildScheduledEventRecurrenceRuleFrequency.Yearly as const,
    interval: 1,
    byMonth: [GuildScheduledEventRecurrenceRuleMonth.May],
    byMonthDay: [4],
  }).type.toBeAssignableTo<GuildScheduledEventRecurrenceRuleOptions>();
}

{
  expect({
    startAt: new Date(),
    frequency: GuildScheduledEventRecurrenceRuleFrequency.Monthly as const,
    interval: 1,
    byNWeekday: [{ n: 1, day: GuildScheduledEventRecurrenceRuleWeekday.Monday }],
  }).type.toBeAssignableTo<GuildScheduledEventRecurrenceRuleOptions>();

  expect({
    startAt: new Date(),
    frequency: GuildScheduledEventRecurrenceRuleFrequency.Monthly as const,
    interval: 1,
    byNWeekday: [{ n: 1, day: GuildScheduledEventRecurrenceRuleWeekday.Monday }],
    // Invalid property
    byWeekday: [GuildScheduledEventRecurrenceRuleWeekday.Monday],
  }).type.not.toBeAssignableTo<GuildScheduledEventRecurrenceRuleOptions>();
}

{
  expect({
    startAt: new Date(),
    frequency: GuildScheduledEventRecurrenceRuleFrequency.Weekly as const,
    interval: 1,
    byWeekday: [GuildScheduledEventRecurrenceRuleWeekday.Monday],
  }).type.toBeAssignableTo<GuildScheduledEventRecurrenceRuleOptions>();

  expect({
    startAt: new Date(),
    frequency: GuildScheduledEventRecurrenceRuleFrequency.Weekly as const,
    interval: 1,
    byWeekday: [GuildScheduledEventRecurrenceRuleWeekday.Monday],
    // Invalid property
    byNWeekday: [{ n: 1, day: GuildScheduledEventRecurrenceRuleWeekday.Monday }],
  }).type.not.toBeAssignableTo<GuildScheduledEventRecurrenceRuleOptions>();
}

{
  expect({
    startAt: new Date(),
    frequency: GuildScheduledEventRecurrenceRuleFrequency.Daily as const,
    interval: 1,
    byWeekday: [GuildScheduledEventRecurrenceRuleWeekday.Monday],
    // Invalid property
    byNWeekday: [{ n: 1, day: GuildScheduledEventRecurrenceRuleWeekday.Monday }],
  }).type.not.toBeAssignableTo<GuildScheduledEventRecurrenceRuleOptions>();

  expect({
    startAt: new Date(),
    frequency: GuildScheduledEventRecurrenceRuleFrequency.Daily as const,
    interval: 1,
    byWeekday: [GuildScheduledEventRecurrenceRuleWeekday.Monday],
    // Invalid property
    byMonth: [GuildScheduledEventRecurrenceRuleMonth.May],
  }).type.not.toBeAssignableTo<GuildScheduledEventRecurrenceRuleOptions>();
}

await textChannel.send(
  new MessageBuilder()
    .setContent(':)')
    .addAttachments(attachment => attachment.setId(1).setFileData(':)').setFilename('smiley.txt')),
);

await textChannel.send({
  files: [
    {
      attachment: 'https://example.com/voice-message.ogg',
      duration: 2,
      waveform: 'AFUqPDw3Eg2hh4+gopOYj4xthU4=',
    },
  ],
  flags: MessageFlags.IsVoiceMessage,
});

declare const authorizingIntegrationOwners: AuthorizingIntegrationOwners;
{
  expect(authorizingIntegrationOwners.guildId).type.toBe<Snowflake | null>();
  expect(authorizingIntegrationOwners.guild).type.toBe<Guild | null>();
  expect(authorizingIntegrationOwners.userId).type.toBe<Snowflake | null>();
  expect(authorizingIntegrationOwners.user).type.toBe<User | null>();
  expect(authorizingIntegrationOwners[ApplicationIntegrationType.GuildInstall]).type.toBe<Snowflake | undefined>();
}
