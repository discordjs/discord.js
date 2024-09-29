import type { ChildProcess } from 'node:child_process';
import type { Worker } from 'node:worker_threads';
import {
  APIInteractionGuildMember,
  APIPartialChannel,
  APIPartialGuild,
  APIInteractionDataResolvedGuildMember,
  APIInteractionDataResolvedChannel,
  APIRole,
  APIButtonComponent,
  APISelectMenuComponent,
  ApplicationCommandOptionType,
  ComponentType,
  ApplicationCommandPermissionType,
  ChannelType,
  InteractionType,
  GatewayIntentBits,
  Locale,
  PermissionFlagsBits,
  AuditLogEvent,
  ButtonStyle,
  TextInputStyle,
  APITextInputComponent,
  APIEmbed,
  ApplicationCommandType,
  APIMessage,
  APIActionRowComponent,
  APIActionRowComponentTypes,
  APIStringSelectComponent,
  APIUserSelectComponent,
  APIRoleSelectComponent,
  APIChannelSelectComponent,
  APIMentionableSelectComponent,
  APIModalInteractionResponseCallbackData,
  WebhookType,
} from 'discord-api-types/v10';
import {
  ApplicationCommand,
  ApplicationCommandData,
  ApplicationCommandManager,
  ApplicationCommandOptionData,
  ApplicationCommandResolvable,
  ApplicationCommandSubCommandData,
  ApplicationCommandSubGroupData,
  CommandInteraction,
  ButtonInteraction,
  CacheType,
  CategoryChannel,
  Client,
  ClientApplication,
  ClientUser,
  CloseEvent,
  Collection,
  ChatInputCommandInteraction,
  CommandInteractionOption,
  CommandInteractionOptionResolver,
  CommandOptionNonChoiceResolvableType,
  ContextMenuCommandInteraction,
  DMChannel,
  Guild,
  GuildApplicationCommandManager,
  GuildChannelManager,
  GuildEmoji,
  GuildEmojiManager,
  GuildMember,
  GuildResolvable,
  IntentsBitField,
  Interaction,
  InteractionCollector,
  Message,
  AttachmentBuilder,
  MessageCollector,
  MessageComponentInteraction,
  MessageReaction,
  ModalBuilder,
  NewsChannel,
  Options,
  PartialTextBasedChannelFields,
  PartialUser,
  PermissionsBitField,
  ReactionCollector,
  Role,
  RoleManager,
  Serialized,
  ShardClientUtil,
  ShardingManager,
  Snowflake,
  StageChannel,
  TextBasedChannelFields,
  type TextBasedChannel,
  type TextBasedChannelTypes,
  type VoiceBasedChannel,
  type GuildBasedChannel,
  type NonThreadGuildBasedChannel,
  type GuildTextBasedChannel,
  TextChannel,
  ThreadChannel,
  ThreadMember,
  Typing,
  User,
  VoiceChannel,
  Shard,
  WebSocketShard,
  Collector,
  GuildAuditLogsEntry,
  GuildAuditLogs,
  type AuditLogChange,
  StageInstance,
  ActionRowBuilder,
  ButtonComponent,
  SelectMenuComponent,
  RepliableInteraction,
  ThreadChannelType,
  Events,
  WebSocketShardEvents,
  Status,
  CategoryChannelChildManager,
  ActionRowData,
  MessageActionRowComponentData,
  PartialThreadMember,
  ThreadMemberFlagsBitField,
  ButtonBuilder,
  EmbedBuilder,
  MessageActionRowComponent,
  StringSelectMenuBuilder,
  TextInputBuilder,
  TextInputComponent,
  Embed,
  MessageActionRowComponentBuilder,
  GuildBanManager,
  GuildBan,
  MessageManager,
  ChannelMention,
  UserMention,
  PartialGroupDMChannel,
  Attachment,
  MessageContextMenuCommandInteraction,
  UserContextMenuCommandInteraction,
  AnyThreadChannel,
  ThreadMemberManager,
  CollectedMessageInteraction,
  ShardEvents,
  Webhook,
  WebhookClient,
  InteractionWebhook,
  ActionRowComponent,
  ActionRow,
  GuildAuditLogsActionType,
  GuildAuditLogsTargetType,
  ModalSubmitInteraction,
  ForumChannel,
  ChannelFlagsBitField,
  GuildForumThreadManager,
  GuildTextThreadManager,
  AnySelectMenuInteraction,
  StringSelectMenuInteraction,
  StringSelectMenuComponent,
  UserSelectMenuInteraction,
  RoleSelectMenuInteraction,
  ChannelSelectMenuInteraction,
  MentionableSelectMenuInteraction,
  MessageMentions,
  AutoModerationActionExecution,
  AutoModerationRule,
  AutoModerationRuleManager,
  PrivateThreadChannel,
  PublicThreadChannel,
  GuildMemberManager,
  GuildMemberFlagsBitField,
  ThreadManager,
  FetchedThreads,
  FetchedThreadsMore,
  DMMessageManager,
  GuildMessageManager,
  ApplicationCommandChannelOptionData,
  ApplicationCommandChannelOption,
  ApplicationCommandChoicesOption,
  ApplicationCommandChoicesData,
  ApplicationCommandSubGroup,
  ApplicationCommandSubCommand,
  ChatInputApplicationCommandData,
  ApplicationCommandPermissionsManager,
  GuildOnboarding,
  StringSelectMenuComponentData,
  ButtonComponentData,
  MediaChannel,
  PartialDMChannel,
  PartialGuildMember,
  PartialMessage,
  PartialMessageReaction,
  resolvePartialEmoji,
  PartialEmojiOnlyId,
  Emoji,
  PartialEmoji,
  Awaitable,
  Channel,
  DirectoryChannel,
  Entitlement,
  SKU,
  UserSelectMenuBuilder,
  RoleSelectMenuBuilder,
  ChannelSelectMenuBuilder,
  MentionableSelectMenuBuilder,
  UserSelectMenuComponent,
  RoleSelectMenuComponent,
  ChannelSelectMenuComponent,
  MentionableSelectMenuComponent,
  Poll,
  ApplicationEmoji,
  ApplicationEmojiManager,
  StickerPack,
  SendableChannels,
  PollData,
} from '.';
import { expectAssignable, expectDeprecated, expectNotAssignable, expectNotType, expectType } from 'tsd';
import type { ContextMenuCommandBuilder, SlashCommandBuilder } from '@discordjs/builders';
import { ReadonlyCollection } from '@discordjs/collection';

// Test type transformation:
declare const serialize: <Value>(value: Value) => Serialized<Value>;
declare const notPropertyOf: <Value, Property extends PropertyKey>(
  value: Value,
  property: Property & Exclude<Property, keyof Value>,
) => void;

const client: Client = new Client({
  intents: GatewayIntentBits.Guilds,
  makeCache: Options.cacheWithLimits({
    MessageManager: 200,
    // @ts-expect-error
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
  expectType<Client<true>>(client);
} else {
  expectType<Client>(client);
}

const testGuildId = '222078108977594368'; // DJS
const testUserId = '987654321098765432'; // example id
const globalCommandId = '123456789012345678'; // example id
const guildCommandId = '234567890123456789'; // example id

client.on('autoModerationActionExecution', autoModerationActionExecution =>
  expectType<AutoModerationActionExecution>(autoModerationActionExecution),
);

client.on('autoModerationRuleCreate', ({ client }) => expectType<Client<true>>(client));
client.on('autoModerationRuleDelete', ({ client }) => expectType<Client<true>>(client));

client.on('autoModerationRuleUpdate', (oldAutoModerationRule, { client: newClient }) => {
  expectType<Client<true>>(oldAutoModerationRule!.client);
  expectType<Client<true>>(newClient);
});

client.on('channelCreate', ({ client }) => expectType<Client<true>>(client));
client.on('channelDelete', ({ client }) => expectType<Client<true>>(client));
client.on('channelPinsUpdate', ({ client }) => expectType<Client<true>>(client));

client.on('channelUpdate', ({ client: oldClient }, { client: newClient }) => {
  expectType<Client<true>>(oldClient);
  expectType<Client<true>>(newClient);
});

client.on('emojiCreate', ({ client }) => expectType<Client<true>>(client));
client.on('emojiDelete', ({ client }) => expectType<Client<true>>(client));

client.on('emojiUpdate', ({ client: oldClient }, { client: newClient }) => {
  expectType<Client<true>>(oldClient);
  expectType<Client<true>>(newClient);
});

client.on('guildBanAdd', ({ client }) => expectType<Client<true>>(client));
client.on('guildBanRemove', ({ client }) => expectType<Client<true>>(client));
client.on('guildDelete', ({ client }) => expectType<Client<true>>(client));
client.on('guildIntegrationsUpdate', ({ client }) => expectType<Client<true>>(client));
client.on('guildMemberAdd', ({ client }) => expectType<Client<true>>(client));
client.on('guildMemberAvailable', ({ client }) => expectType<Client<true>>(client));

client.on('guildMemberRemove', member => {
  expectType<Client<true>>(member.client);
  if (member.partial) return expectType<null>(member.joinedAt);
  expectType<Date | null>(member.joinedAt);
});

client.on('guildMembersChunk', (members, { client }) => {
  expectType<Client<true>>(members.first()!.client);
  expectType<Client<true>>(client);
});

client.on('guildMemberUpdate', ({ client: oldClient }, { client: newClient }) => {
  expectType<Client<true>>(oldClient);
  expectType<Client<true>>(newClient);
});

client.on('guildScheduledEventCreate', ({ client }) => expectType<Client<true>>(client));
client.on('guildScheduledEventDelete', ({ client }) => expectType<Client<true>>(client));

client.on('guildScheduledEventUpdate', (oldGuildScheduledEvent, { client }) => {
  expectType<Client<true>>(oldGuildScheduledEvent!.client);
  expectType<Client<true>>(client);
});

client.on('guildScheduledEventUserAdd', ({ client: oldClient }, { client: newClient }) => {
  expectType<Client<true>>(oldClient);
  expectType<Client<true>>(newClient);
});

client.on('guildScheduledEventUserRemove', ({ client: oldClient }, { client: newClient }) => {
  expectType<Client<true>>(oldClient);
  expectType<Client<true>>(newClient);
});

client.on('guildUnavailable', ({ client }) => expectType<Client<true>>(client));

client.on('guildUpdate', ({ client: oldClient }, { client: newClient }) => {
  expectType<Client<true>>(oldClient);
  expectType<Client<true>>(newClient);
});

client.on('interactionCreate', async interaction => {
  expectType<Client<true>>(interaction.client);
  expectType<Snowflake | null>(interaction.guildId);
  expectType<Snowflake | null>(interaction.channelId);
  expectType<GuildMember | APIInteractionGuildMember | null>(interaction.member);

  if (interaction.type === InteractionType.MessageComponent) {
    expectType<Snowflake>(interaction.channelId);
  }

  if (interaction.type !== InteractionType.ApplicationCommand) return;

  void new ActionRowBuilder<MessageActionRowComponentBuilder>();

  const button = new ButtonBuilder();

  const actionRow = new ActionRowBuilder<MessageActionRowComponentBuilder>({
    type: ComponentType.ActionRow,
    components: [button.toJSON()],
  });

  actionRow.toJSON();

  await interaction.reply({ content: 'Hi!', components: [actionRow] });

  // @ts-expect-error
  interaction.reply({ content: 'Hi!', components: [[button]] });

  void new ActionRowBuilder({});

  // @ts-expect-error
  await interaction.reply({ content: 'Hi!', components: [button] });

  await interaction.reply({
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
    expectNotType<never>(interaction);
    return;
  }

  if (interaction.inCachedGuild()) {
    expectNotType<never>(interaction);
    return;
  }
});

client.on('inviteCreate', ({ client }) => expectType<Client<true>>(client));
client.on('inviteDelete', ({ client }) => expectType<Client<true>>(client));

// This is to check that stuff is the right type
declare const assertIsMessage: (m: Promise<Message>) => void;

client.on('messageCreate', async message => {
  const { client, channel } = message;

  // https://github.com/discordjs/discord.js/issues/8545
  {
    // These should not throw any errors when comparing messages from any source.
    channel.messages.cache.filter(message => message);
    (await channel.messages.fetch()).filter(({ author }) => author.id === message.author.id);

    if (channel.isDMBased()) {
      expectType<DMMessageManager>(channel.messages.channel.messages);
    } else {
      expectType<GuildMessageManager>(channel.messages.channel.messages);
    }
  }

  if (!message.inGuild() && message.partial) {
    expectNotType<never>(message);
  }

  expectType<Client<true>>(client);
  assertIsMessage(channel.send('string'));
  assertIsMessage(channel.send({}));
  assertIsMessage(channel.send({ embeds: [] }));

  const attachment = new AttachmentBuilder('file.png');
  const embed = new EmbedBuilder();
  assertIsMessage(channel.send({ files: [attachment] }));
  assertIsMessage(channel.send({ embeds: [embed] }));
  assertIsMessage(channel.send({ embeds: [embed], files: [attachment] }));

  if (message.inGuild()) {
    expectAssignable<Message<true>>(message);
    const component = await message.awaitMessageComponent({ componentType: ComponentType.Button });
    expectType<ButtonInteraction<'cached'>>(component);
    expectType<Message<true>>(await component.reply({ fetchReply: true }));

    const buttonCollector = message.createMessageComponentCollector({ componentType: ComponentType.Button });
    expectType<InteractionCollector<ButtonInteraction<'cached'>>>(buttonCollector);
    expectAssignable<
      (
        test: ButtonInteraction<'cached'>,
        items: Collection<Snowflake, ButtonInteraction<'cached'>>,
      ) => Awaitable<boolean>
    >(buttonCollector.filter);
    expectType<GuildTextBasedChannel>(message.channel);
    expectType<Guild>(message.guild);
    expectType<GuildMember | null>(message.member);

    expectType<MessageMentions<true>>(message.mentions);
    expectType<Guild>(message.guild);
    expectType<Collection<Snowflake, GuildMember>>(message.mentions.members);
  }

  expectType<Exclude<TextBasedChannel, PartialGroupDMChannel>>(message.channel);
  expectNotType<GuildTextBasedChannel>(message.channel);

  // @ts-expect-error
  channel.send();
  // @ts-expect-error
  channel.send({ another: 'property' });

  // Check collector creations.

  // Verify that buttons interactions are inferred.
  const buttonCollector = message.createMessageComponentCollector({ componentType: ComponentType.Button });
  expectAssignable<Promise<ButtonInteraction>>(message.awaitMessageComponent({ componentType: ComponentType.Button }));
  expectAssignable<Promise<ButtonInteraction>>(channel.awaitMessageComponent({ componentType: ComponentType.Button }));
  expectAssignable<InteractionCollector<ButtonInteraction>>(buttonCollector);

  // Verify that select menus interaction are inferred.
  const selectMenuCollector = message.createMessageComponentCollector({ componentType: ComponentType.StringSelect });
  expectAssignable<Promise<StringSelectMenuInteraction>>(
    message.awaitMessageComponent({ componentType: ComponentType.StringSelect }),
  );
  expectAssignable<Promise<StringSelectMenuInteraction>>(
    channel.awaitMessageComponent({ componentType: ComponentType.StringSelect }),
  );
  expectAssignable<InteractionCollector<StringSelectMenuInteraction>>(selectMenuCollector);

  // Verify that message component interactions are default collected types.
  const defaultCollector = message.createMessageComponentCollector();
  expectAssignable<Promise<MessageComponentInteraction>>(message.awaitMessageComponent());
  expectAssignable<Promise<MessageComponentInteraction>>(channel.awaitMessageComponent());
  expectAssignable<InteractionCollector<CollectedMessageInteraction>>(defaultCollector);

  // Verify that additional options don't affect default collector types.
  const semiDefaultCollector = message.createMessageComponentCollector({ time: 10000 });
  expectType<InteractionCollector<CollectedMessageInteraction>>(semiDefaultCollector);
  const semiDefaultCollectorChannel = message.createMessageComponentCollector({ time: 10000 });
  expectType<InteractionCollector<CollectedMessageInteraction>>(semiDefaultCollectorChannel);

  // Verify that interaction collector options can't be used.
  message.createMessageComponentCollector({
    // @ts-expect-error
    interactionType: InteractionType.ApplicationCommand,
  });

  // Make sure filter parameters are properly inferred.
  message.createMessageComponentCollector({
    filter: i => {
      expectType<CollectedMessageInteraction>(i);
      return true;
    },
  });

  message.createMessageComponentCollector({
    componentType: ComponentType.Button,
    filter: i => {
      expectType<ButtonInteraction>(i);
      return true;
    },
  });

  message.createMessageComponentCollector({
    componentType: ComponentType.StringSelect,
    filter: i => {
      expectType<StringSelectMenuInteraction>(i);
      return true;
    },
  });

  message.awaitMessageComponent({
    filter: i => {
      expectType<CollectedMessageInteraction>(i);
      return true;
    },
  });

  message.awaitMessageComponent({
    componentType: ComponentType.Button,
    filter: i => {
      expectType<ButtonInteraction>(i);
      return true;
    },
  });

  message.awaitMessageComponent({
    componentType: ComponentType.StringSelect,
    filter: i => {
      expectType<StringSelectMenuInteraction>(i);
      return true;
    },
  });

  const webhook = await message.fetchWebhook();

  if (webhook.isChannelFollower()) {
    expectAssignable<Guild | APIPartialGuild>(webhook.sourceGuild);
    expectAssignable<NewsChannel | APIPartialChannel>(webhook.sourceChannel);
    expectType<Webhook<WebhookType.ChannelFollower>>(webhook);
  } else if (webhook.isIncoming()) {
    expectType<string>(webhook.token);
    expectType<Webhook<WebhookType.Incoming>>(webhook);
  }

  expectNotType<Guild | APIPartialGuild>(webhook.sourceGuild);
  expectNotType<NewsChannel | APIPartialChannel>(webhook.sourceChannel);
  expectNotType<string>(webhook.token);

  channel.awaitMessageComponent({
    filter: i => {
      expectType<CollectedMessageInteraction<'cached'>>(i);
      return true;
    },
  });

  channel.awaitMessageComponent({
    componentType: ComponentType.Button,
    filter: i => {
      expectType<ButtonInteraction<'cached'>>(i);
      return true;
    },
  });

  channel.awaitMessageComponent({
    componentType: ComponentType.StringSelect,
    filter: i => {
      expectType<StringSelectMenuInteraction<'cached'>>(i);
      return true;
    },
  });

  // Check that both builders and builder data can be sent in messages
  const row = new ActionRowBuilder<MessageActionRowComponentBuilder>();

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
    components: [new ButtonBuilder()],
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

  channel.send({
    components: [row, rawButtonsRow, buttonsRow, rawStringSelectMenuRow, stringSelectRow],
    embeds: [embed, embedData],
  });
});

client.on('messageDelete', ({ client }) => expectType<Client<true>>(client));

client.on('messageDeleteBulk', (messages, { client }) => {
  expectType<Client<true>>(messages.first()!.client);
  expectType<Client<true>>(client);
});

client.on('messageReactionAdd', async (reaction, { client }) => {
  expectType<Client<true>>(reaction.client);
  expectType<Client<true>>(client);

  if (reaction.partial) {
    expectType<null>(reaction.count);
    reaction = await reaction.fetch();
  }

  expectType<number>(reaction.count);
  if (reaction.message.partial) return expectType<string | null>(reaction.message.content);
  expectType<string>(reaction.message.content);
});

client.on('messageReactionRemove', ({ client: oldClient }, { client: newClient }) => {
  expectType<Client<true>>(oldClient);
  expectType<Client<true>>(newClient);
});

client.on('messageReactionRemoveAll', async (message, reactions) => {
  console.log(`messageReactionRemoveAll - id: ${message.id} (${message.id.length})`);
  if (message.partial) message = await message.fetch();
  console.log(`messageReactionRemoveAll - content: ${message.content}`);
  expectType<Client<true>>(message.client);
  expectType<Client<true>>(reactions.first()!.client);
});

client.on('messageReactionRemoveEmoji', ({ client }) => expectType<Client<true>>(client));

client.on('messageUpdate', ({ client: oldClient }, { client: newClient }) => {
  expectType<Client<true>>(oldClient);
  expectType<Client<true>>(newClient);
});

client.on('presenceUpdate', (oldPresence, { client }) => {
  expectType<Client<true>>(oldPresence!.client);
  expectType<Client<true>>(client);
});

declare const slashCommandBuilder: SlashCommandBuilder;
declare const contextMenuCommandBuilder: ContextMenuCommandBuilder;

client.on('ready', async client => {
  expectType<Client<true>>(client);
  console.log(`Client is logged in as ${client.user.tag} and ready!`);

  // Test fetching all global commands and ones from one guild
  expectType<Collection<string, ApplicationCommand<{ guild: GuildResolvable }>>>(
    await client.application!.commands.fetch(),
  );
  expectType<Collection<string, ApplicationCommand<{ guild: GuildResolvable }>>>(
    await client.application!.commands.fetch({ guildId: testGuildId }),
  );

  // Test command manager methods
  const globalCommand = await client.application?.commands.fetch(globalCommandId);
  const guildCommandFromGlobal = await client.application?.commands.fetch(guildCommandId, { guildId: testGuildId });
  const guildCommandFromGuild = await client.guilds.cache.get(testGuildId)?.commands.fetch(guildCommandId);

  await client.application?.commands.create(slashCommandBuilder);
  await client.application?.commands.create(contextMenuCommandBuilder);
  await guild.commands.create(slashCommandBuilder);
  await guild.commands.create(contextMenuCommandBuilder);

  await client.application?.commands.edit(globalCommandId, slashCommandBuilder);
  await client.application?.commands.edit(globalCommandId, contextMenuCommandBuilder);
  await guild.commands.edit(guildCommandId, slashCommandBuilder);
  await guild.commands.edit(guildCommandId, contextMenuCommandBuilder);

  await client.application?.commands.edit(globalCommandId, { defaultMemberPermissions: null });
  await globalCommand?.edit({ defaultMemberPermissions: null });
  await globalCommand?.setDefaultMemberPermissions(null);
  await guildCommandFromGlobal?.edit({ dmPermission: false });

  // @ts-expect-error
  await client.guilds.cache.get(testGuildId)?.commands.fetch(guildCommandId, { guildId: testGuildId });

  // Test command permissions
  const globalPermissionsManager = client.application?.commands.permissions;
  const guildPermissionsManager = client.guilds.cache.get(testGuildId)?.commands.permissions;

  // Permissions from global manager
  await globalPermissionsManager?.add({
    command: globalCommandId,
    guild: testGuildId,
    permissions: [{ type: ApplicationCommandPermissionType.Role, id: testGuildId, permission: true }],
    token: 'VeryRealToken',
  });
  await globalPermissionsManager?.has({ command: globalCommandId, guild: testGuildId, permissionId: testGuildId });
  await globalPermissionsManager?.fetch({ guild: testGuildId });
  await globalPermissionsManager?.fetch({ command: globalCommandId, guild: testGuildId });
  await globalPermissionsManager?.remove({
    command: globalCommandId,
    guild: testGuildId,
    roles: [testGuildId],
    token: 'VeryRealToken',
  });
  await globalPermissionsManager?.remove({
    command: globalCommandId,
    guild: testGuildId,
    users: [testUserId],
    token: 'VeryRealToken',
  });
  await globalPermissionsManager?.remove({
    command: globalCommandId,
    guild: testGuildId,
    channels: [testGuildId],
    token: 'VeryRealToken',
  });
  await globalPermissionsManager?.remove({
    command: globalCommandId,
    guild: testGuildId,
    roles: [testGuildId],
    users: [testUserId],
    channels: [testGuildId],
    token: 'VeryRealToken',
  });
  await globalPermissionsManager?.set({
    command: globalCommandId,
    guild: testGuildId,
    permissions: [{ type: ApplicationCommandPermissionType.Role, id: testGuildId, permission: true }],
    token: 'VeryRealToken',
  });

  // @ts-expect-error
  await globalPermissionsManager?.add({
    command: globalCommandId,
    permissions: [{ type: ApplicationCommandPermissionType.Role, id: testGuildId, permission: true }],
    token: 'VeryRealToken',
  });
  // @ts-expect-error
  await globalPermissionsManager?.has({ command: globalCommandId, permissionId: testGuildId });
  // @ts-expect-error
  await globalPermissionsManager?.fetch();
  // @ts-expect-error
  await globalPermissionsManager?.fetch({ command: globalCommandId });
  // @ts-expect-error
  await globalPermissionsManager?.remove({ command: globalCommandId, roles: [testGuildId], token: 'VeryRealToken' });
  // @ts-expect-error
  await globalPermissionsManager?.remove({ command: globalCommandId, users: [testUserId], token: 'VeryRealToken' });
  // @ts-expect-error
  await globalPermissionsManager?.remove({
    command: globalCommandId,
    roles: [testGuildId],
    users: [testUserId],
    token: 'VeryRealToken',
  });
  // @ts-expect-error
  await globalPermissionsManager?.set({
    command: globalCommandId,
    permissions: [{ type: ApplicationCommandPermissionType.Role, id: testGuildId, permission: true }],
    token: 'VeryRealToken',
  });

  // @ts-expect-error
  await globalPermissionsManager?.add({
    guild: testGuildId,
    permissions: [{ type: ApplicationCommandPermissionType.Role, id: testGuildId, permission: true }],
    token: 'VeryRealToken',
  });
  // @ts-expect-error
  await globalPermissionsManager?.has({ guild: testGuildId, permissionId: testGuildId });
  // @ts-expect-error
  await globalPermissionsManager?.remove({ guild: testGuildId, roles: [testGuildId], token: 'VeryRealToken' });
  // @ts-expect-error
  await globalPermissionsManager?.remove({ guild: testGuildId, users: [testUserId], token: 'VeryRealToken' });
  // @ts-expect-error
  await globalPermissionsManager?.remove({
    guild: testGuildId,
    roles: [testGuildId],
    users: [testUserId],
    token: 'VeryRealToken',
  });
  // @ts-expect-error
  await globalPermissionsManager?.set({
    guild: testGuildId,
    permissions: [{ type: ApplicationCommandPermissionType.Role, id: testGuildId, permission: true }],
    token: 'VeryRealToken',
  });

  // Permissions from guild manager
  await guildPermissionsManager?.add({
    command: globalCommandId,
    permissions: [{ type: ApplicationCommandPermissionType.Role, id: testGuildId, permission: true }],
    token: 'VeryRealToken',
  });
  await guildPermissionsManager?.has({ command: globalCommandId, permissionId: testGuildId });
  await guildPermissionsManager?.fetch({});
  await guildPermissionsManager?.fetch({ command: globalCommandId });
  await guildPermissionsManager?.remove({ command: globalCommandId, roles: [testGuildId], token: 'VeryRealToken' });
  await guildPermissionsManager?.remove({ command: globalCommandId, users: [testUserId], token: 'VeryRealToken' });
  await guildPermissionsManager?.remove({ command: globalCommandId, channels: [testGuildId], token: 'VeryRealToken' });
  await guildPermissionsManager?.remove({
    command: globalCommandId,
    roles: [testGuildId],
    users: [testUserId],
    channels: [testGuildId],
    token: 'VeryRealToken',
  });
  await guildPermissionsManager?.set({
    command: globalCommandId,
    permissions: [{ type: ApplicationCommandPermissionType.Role, id: testGuildId, permission: true }],
    token: 'VeryRealToken',
  });

  await guildPermissionsManager?.add({
    command: globalCommandId,
    // @ts-expect-error
    guild: testGuildId,
    permissions: [{ type: ApplicationCommandPermissionType.Role, id: testGuildId, permission: true }],
    token: 'VeryRealToken',
  });
  // @ts-expect-error
  await guildPermissionsManager?.has({ command: globalCommandId, guild: testGuildId, permissionId: testGuildId });
  // @ts-expect-error
  await guildPermissionsManager?.fetch({ guild: testGuildId });
  // @ts-expect-error
  await guildPermissionsManager?.fetch({ command: globalCommandId, guild: testGuildId });
  await guildPermissionsManager?.remove({
    command: globalCommandId,
    // @ts-expect-error
    guild: testGuildId,
    roles: [testGuildId],
    token: 'VeryRealToken',
  });
  await guildPermissionsManager?.remove({
    command: globalCommandId,
    // @ts-expect-error
    guild: testGuildId,
    users: [testUserId],
    token: 'VeryRealToken',
  });
  await guildPermissionsManager?.remove({
    command: globalCommandId,
    // @ts-expect-error
    guild: testGuildId,
    roles: [testGuildId],
    users: [testUserId],
    token: 'VeryRealToken',
  });
  await guildPermissionsManager?.set({
    command: globalCommandId,
    // @ts-expect-error
    guild: testGuildId,
    permissions: [{ type: ApplicationCommandPermissionType.Role, id: testGuildId, permission: true }],
    token: 'VeryRealToken',
  });

  // @ts-expect-error
  await guildPermissionsManager?.add({
    permissions: [{ type: ApplicationCommandPermissionType.Role, id: testGuildId, permission: true }],
    token: 'VeryRealToken',
  });
  // @ts-expect-error
  await guildPermissionsManager?.has({ permissionId: testGuildId });
  // @ts-expect-error
  await guildPermissionsManager?.remove({ roles: [testGuildId], token: 'VeryRealToken' });
  // @ts-expect-error
  await guildPermissionsManager?.remove({ users: [testUserId], token: 'VeryRealToken' });
  // @ts-expect-error
  await guildPermissionsManager?.remove({ roles: [testGuildId], users: [testUserId], token: 'VeryRealToken' });
  // @ts-expect-error
  await guildPermissionsManager?.set({
    permissions: [{ type: ApplicationCommandPermissionType.Role, id: testGuildId, permission: true }],
    token: 'VeryRealToken',
  });

  // Permissions from cached global ApplicationCommand
  await globalCommand?.permissions.add({
    guild: testGuildId,
    permissions: [{ type: ApplicationCommandPermissionType.Role, id: testGuildId, permission: true }],
    token: 'VeryRealToken',
  });
  await globalCommand?.permissions.has({ guild: testGuildId, permissionId: testGuildId });
  await globalCommand?.permissions.fetch({ guild: testGuildId });
  await globalCommand?.permissions.remove({ guild: testGuildId, roles: [testGuildId], token: 'VeryRealToken' });
  await globalCommand?.permissions.remove({ guild: testGuildId, users: [testUserId], token: 'VeryRealToken' });
  await globalCommand?.permissions.remove({
    guild: testGuildId,
    roles: [testGuildId],
    users: [testUserId],
    token: 'VeryRealToken',
  });
  await globalCommand?.permissions.set({
    guild: testGuildId,
    permissions: [{ type: ApplicationCommandPermissionType.Role, id: testGuildId, permission: true }],
    token: 'VeryRealToken',
  });

  await globalCommand?.permissions.add({
    // @ts-expect-error
    command: globalCommandId,
    guild: testGuildId,
    permissions: [{ type: ApplicationCommandPermissionType.Role, id: testGuildId, permission: true }],
    token: 'VeryRealToken',
  });
  await globalCommand?.permissions.has({
    // @ts-expect-error
    command: globalCommandId,
    guild: testGuildId,
    permissionId: testGuildId,
    token: 'VeryRealToken',
  });
  // @ts-expect-error
  await globalCommand?.permissions.fetch({ command: globalCommandId, guild: testGuildId, token: 'VeryRealToken' });
  await globalCommand?.permissions.remove({
    // @ts-expect-error
    command: globalCommandId,
    guild: testGuildId,
    roles: [testGuildId],
    token: 'VeryRealToken',
  });
  await globalCommand?.permissions.remove({
    // @ts-expect-error
    command: globalCommandId,
    guild: testGuildId,
    users: [testUserId],
    token: 'VeryRealToken',
  });
  await globalCommand?.permissions.remove({
    // @ts-expect-error
    command: globalCommandId,
    guild: testGuildId,
    roles: [testGuildId],
    users: [testUserId],
    token: 'VeryRealToken',
  });
  await globalCommand?.permissions.set({
    // @ts-expect-error
    command: globalCommandId,
    guild: testGuildId,
    permissions: [{ type: ApplicationCommandPermissionType.Role, id: testGuildId, permission: true }],
    token: 'VeryRealToken',
  });

  // @ts-expect-error
  await globalCommand?.permissions.add({
    permissions: [{ type: ApplicationCommandPermissionType.Role, id: testGuildId, permission: true }],
    token: 'VeryRealToken',
  });
  // @ts-expect-error
  await globalCommand?.permissions.has({ permissionId: testGuildId });
  // @ts-expect-error
  await globalCommand?.permissions.fetch({});
  // @ts-expect-error
  await globalCommand?.permissions.remove({ roles: [testGuildId], token: 'VeryRealToken' });
  // @ts-expect-error
  await globalCommand?.permissions.remove({ users: [testUserId], token: 'VeryRealToken' });
  // @ts-expect-error
  await globalCommand?.permissions.remove({ roles: [testGuildId], users: [testUserId], token: 'VeryRealToken' });
  // @ts-expect-error
  await globalCommand?.permissions.set({
    permissions: [{ type: ApplicationCommandPermissionType.Role, id: testGuildId, permission: true }],
  });

  // Permissions from cached guild ApplicationCommand
  await guildCommandFromGlobal?.permissions.add({
    permissions: [{ type: ApplicationCommandPermissionType.Role, id: testGuildId, permission: true }],
    token: 'VeryRealToken',
  });
  await guildCommandFromGlobal?.permissions.has({ permissionId: testGuildId });
  await guildCommandFromGlobal?.permissions.fetch({});
  await guildCommandFromGlobal?.permissions.remove({ roles: [testGuildId], token: 'VeryRealToken' });
  await guildCommandFromGlobal?.permissions.remove({ users: [testUserId], token: 'VeryRealToken' });
  await guildCommandFromGlobal?.permissions.remove({
    roles: [testGuildId],
    users: [testUserId],
    token: 'VeryRealToken',
  });
  await guildCommandFromGlobal?.permissions.set({
    permissions: [{ type: ApplicationCommandPermissionType.Role, id: testGuildId, permission: true }],
    token: 'VeryRealToken',
  });

  await guildCommandFromGlobal?.permissions.add({
    // @ts-expect-error
    command: globalCommandId,
    permissions: [{ type: ApplicationCommandPermissionType.Role, id: testGuildId, permission: true }],
    token: 'VeryRealToken',
  });
  // @ts-expect-error
  await guildCommandFromGlobal?.permissions.has({ command: guildCommandId, permissionId: testGuildId });
  await guildCommandFromGlobal?.permissions.remove({
    // @ts-expect-error
    command: guildCommandId,
    roles: [testGuildId],
    token: 'VeryRealToken',
  });
  await guildCommandFromGlobal?.permissions.remove({
    // @ts-expect-error
    command: guildCommandId,
    users: [testUserId],
    token: 'VeryRealToken',
  });
  await guildCommandFromGlobal?.permissions.remove({
    // @ts-expect-error
    command: guildCommandId,
    roles: [testGuildId],
    users: [testUserId],
    token: 'VeryRealToken',
  });
  await guildCommandFromGlobal?.permissions.set({
    // @ts-expect-error
    command: guildCommandId,
    permissions: [{ type: ApplicationCommandPermissionType.Role, id: testGuildId, permission: true }],
    token: 'VeryRealToken',
  });

  await guildCommandFromGlobal?.permissions.add({
    // @ts-expect-error
    guild: testGuildId,
    permissions: [{ type: ApplicationCommandPermissionType.Role, id: testGuildId, permission: true }],
    token: 'VeryRealToken',
  });
  // @ts-expect-error
  await guildCommandFromGlobal?.permissions.has({ guild: testGuildId, permissionId: testGuildId });
  await guildCommandFromGlobal?.permissions.remove({
    // @ts-expect-error
    guild: testGuildId,
    roles: [testGuildId],
    token: 'VeryRealToken',
  });
  // @ts-expect-error
  await guildCommandFromGlobal?.permissions.remove({ guild: testGuildId, users: [testUserId], token: 'VeryRealToken' });
  await guildCommandFromGlobal?.permissions.remove({
    // @ts-expect-error
    guild: testGuildId,
    roles: [testGuildId],
    users: [testUserId],
    token: 'VeryRealToken',
  });
  await guildCommandFromGlobal?.permissions.set({
    // @ts-expect-error
    guild: testGuildId,
    permissions: [{ type: ApplicationCommandPermissionType.Role, id: testGuildId, permission: true }],
    token: 'VeryRealToken',
  });

  await guildCommandFromGuild?.permissions.add({
    permissions: [{ type: ApplicationCommandPermissionType.Role, id: testGuildId, permission: true }],
    token: 'VeryRealToken',
  });
  await guildCommandFromGuild?.permissions.has({ permissionId: testGuildId });
  await guildCommandFromGuild?.permissions.fetch({});
  await guildCommandFromGuild?.permissions.remove({ roles: [testGuildId], token: 'VeryRealToken' });
  await guildCommandFromGuild?.permissions.remove({ users: [testUserId], token: 'VeryRealToken' });
  await guildCommandFromGuild?.permissions.remove({
    roles: [testGuildId],
    users: [testUserId],
    token: 'VeryRealToken',
  });
  await guildCommandFromGuild?.permissions.set({
    permissions: [{ type: ApplicationCommandPermissionType.Role, id: testGuildId, permission: true }],
    token: 'VeryRealToken',
  });

  await guildCommandFromGuild?.permissions.add({
    // @ts-expect-error
    command: globalCommandId,
    permissions: [{ type: ApplicationCommandPermissionType.Role, id: testGuildId, permission: true }],
    token: 'VeryRealToken',
  });
  // @ts-expect-error
  await guildCommandFromGuild?.permissions.has({ command: guildCommandId, permissionId: testGuildId });
  await guildCommandFromGuild?.permissions.remove({
    // @ts-expect-error
    command: guildCommandId,
    roles: [testGuildId],
    token: 'VeryRealToken',
  });
  await guildCommandFromGuild?.permissions.remove({
    // @ts-expect-error
    command: guildCommandId,
    users: [testUserId],
    token: 'VeryRealToken',
  });
  await guildCommandFromGuild?.permissions.remove({
    // @ts-expect-error
    command: guildCommandId,
    roles: [testGuildId],
    users: [testUserId],
    token: 'VeryRealToken',
  });
  await guildCommandFromGuild?.permissions.set({
    // @ts-expect-error
    command: guildCommandId,
    permissions: [{ type: ApplicationCommandPermissionType.Role, id: testGuildId, permission: true }],
    token: 'VeryRealToken',
  });

  await guildCommandFromGuild?.permissions.add({
    // @ts-expect-error
    guild: testGuildId,
    permissions: [{ type: ApplicationCommandPermissionType.Role, id: testGuildId, permission: true }],
    token: 'VeryRealToken',
  });
  // @ts-expect-error
  await guildCommandFromGuild?.permissions.has({ guild: testGuildId, permissionId: testGuildId });
  // @ts-expect-error
  await guildCommandFromGuild?.permissions.remove({ guild: testGuildId, roles: [testGuildId], token: 'VeryRealToken' });
  // @ts-expect-error
  await guildCommandFromGuild?.permissions.remove({ guild: testGuildId, users: [testUserId], token: 'VeryRealToken' });
  await guildCommandFromGuild?.permissions.remove({
    // @ts-expect-error
    guild: testGuildId,
    roles: [testGuildId],
    users: [testUserId],
    token: 'VeryRealToken',
  });
  await guildCommandFromGuild?.permissions.set({
    // @ts-expect-error
    guild: testGuildId,
    permissions: [{ type: ApplicationCommandPermissionType.Role, id: testGuildId, permission: true }],
    token: 'VeryRealToken',
  });
});

client.on('roleCreate', ({ client }) => expectType<Client<true>>(client));
client.on('roleDelete', ({ client }) => expectType<Client<true>>(client));

client.on('roleUpdate', ({ client: oldClient }, { client: newClient }) => {
  expectType<Client<true>>(oldClient);
  expectType<Client<true>>(newClient);
});

client.on('stageInstanceCreate', ({ client }) => expectType<Client<true>>(client));
client.on('stageInstanceDelete', ({ client }) => expectType<Client<true>>(client));

client.on('stageInstanceUpdate', (oldStageInstance, { client }) => {
  expectType<Client<true>>(oldStageInstance!.client);
  expectType<Client<true>>(client);
});

client.on('stickerCreate', ({ client }) => expectType<Client<true>>(client));
client.on('stickerDelete', ({ client }) => expectType<Client<true>>(client));

client.on('stickerUpdate', ({ client: oldClient }, { client: newClient }) => {
  expectType<Client<true>>(oldClient);
  expectType<Client<true>>(newClient);
});

client.on('threadCreate', thread => {
  expectType<Client<true>>(thread.client);

  if (thread.type === ChannelType.PrivateThread) {
    expectType<number>(thread.createdTimestamp);
    expectType<Date>(thread.createdAt);
  } else {
    expectType<number | null>(thread.createdTimestamp);
    expectType<Date | null>(thread.createdAt);
  }
});

client.on('threadDelete', ({ client }) => expectType<Client<true>>(client));

client.on('threadListSync', (threads, { client }) => {
  expectType<Client<true>>(threads.first()!.client);
  expectType<Client<true>>(client);
});

client.on('threadMembersUpdate', (addedMembers, removedMembers, thread) => {
  expectType<Client<true>>(addedMembers.first()!.client);
  expectType<Client<true>>(removedMembers.first()!.client);
  expectType<Client<true>>(thread.client);
  expectType<ReadonlyCollection<Snowflake, ThreadMember>>(addedMembers);
  expectType<ReadonlyCollection<Snowflake, ThreadMember | PartialThreadMember>>(removedMembers);
  expectType<AnyThreadChannel>(thread);
  const left = removedMembers.first();
  if (!left) return;

  if (left.partial) {
    expectType<PartialThreadMember>(left);
    expectType<null>(left.flags);
  } else {
    expectType<ThreadMember>(left);
    expectType<ThreadMemberFlagsBitField>(left.flags);
  }
});

client.on('threadMemberUpdate', ({ client: oldClient }, { client: newClient }) => {
  expectType<Client<true>>(oldClient);
  expectType<Client<true>>(newClient);
});

client.on('threadUpdate', ({ client: oldClient }, { client: newClient }) => {
  expectType<Client<true>>(oldClient);
  expectType<Client<true>>(newClient);
});

client.on('typingStart', ({ client }) => expectType<Client<true>>(client));

client.on('userUpdate', ({ client: oldClient }, { client: newClient }) => {
  expectType<Client<true>>(oldClient);
  expectType<Client<true>>(newClient);
});

client.on('voiceStateUpdate', ({ client: oldClient }, { client: newClient }) => {
  expectType<Client<true>>(oldClient);
  expectType<Client<true>>(newClient);
});

client.on('webhooksUpdate', ({ client }) => expectType<Client<true>>(client));

client.on('guildCreate', async g => {
  expectType<Client<true>>(g.client);
  const channel = g.channels.cache.random();
  if (!channel) return;

  if (channel.type === ChannelType.GuildText) {
    const row: ActionRowData<MessageActionRowComponentData> = {
      type: ComponentType.ActionRow,
      components: [
        new ButtonBuilder(),
        { type: ComponentType.Button, style: ButtonStyle.Primary, label: 'string', customId: 'foo' },
        { type: ComponentType.Button, style: ButtonStyle.Link, label: 'test', url: 'test' },
        { type: ComponentType.StringSelect, customId: 'foo', options: [{ label: 'label', value: 'value' }] },
        new StringSelectMenuBuilder(),
        // @ts-expect-error
        { type: ComponentType.TextInput, style: TextInputStyle.Paragraph, customId: 'foo', label: 'test' },
        // @ts-expect-error
        new TextInputBuilder(),
      ],
    };

    const row2 = new ActionRowBuilder<MessageActionRowComponentBuilder>({
      type: ComponentType.ActionRow,
      components: [
        { type: ComponentType.Button, style: ButtonStyle.Primary, label: 'string', customId: 'foo' },
        { type: ComponentType.Button, style: ButtonStyle.Link, label: 'test', url: 'test' },
        { type: ComponentType.StringSelect, customId: 'foo', options: [{ label: 'label', value: 'value' }] },
      ],
    });

    channel.send({ components: [row, row2] });
  }

  channel.setName('foo').then(updatedChannel => {
    console.log(`New channel name: ${updatedChannel.name}`);
  });

  // @ts-expect-error no options
  expectNotType<Promise<GuildMember>>(g.members.add(testUserId));

  // @ts-expect-error no access token
  expectNotType<Promise<GuildMember>>(g.members.add(testUserId, {}));

  expectNotType<Promise<GuildMember>>(
    // @ts-expect-error invalid role resolvable
    g.members.add(testUserId, { accessToken: 'totallyRealAccessToken', roles: [g.roles.cache] }),
  );

  expectType<Promise<GuildMember | null>>(
    g.members.add(testUserId, { accessToken: 'totallyRealAccessToken', fetchWhenExisting: false }),
  );

  expectType<Promise<GuildMember>>(g.members.add(testUserId, { accessToken: 'totallyRealAccessToken' }));

  expectType<Promise<GuildMember>>(
    g.members.add(testUserId, {
      accessToken: 'totallyRealAccessToken',
      mute: true,
      deaf: false,
      roles: [g.roles.cache.first()!],
      force: true,
      fetchWhenExisting: true,
    }),
  );
});

// EventEmitter static method overrides
expectType<Promise<[Client<true>]>>(Client.once(client, 'ready'));
expectType<AsyncIterableIterator<[Client<true>]>>(Client.on(client, 'ready'));

client.login('absolutely-valid-token');

declare const loggedInClient: Client<true>;
expectType<ClientApplication>(loggedInClient.application);
expectType<Date>(loggedInClient.readyAt);
expectType<number>(loggedInClient.readyTimestamp);
expectType<string>(loggedInClient.token);
expectType<number>(loggedInClient.uptime);
expectType<ClientUser>(loggedInClient.user);

declare const loggedOutClient: Client<false>;
expectType<null>(loggedOutClient.application);
expectType<null>(loggedOutClient.readyAt);
expectType<null>(loggedOutClient.readyTimestamp);
expectType<string | null>(loggedOutClient.token);
expectType<null>(loggedOutClient.uptime);
expectType<null>(loggedOutClient.user);

expectType<undefined>(serialize(undefined));
expectType<null>(serialize(null));
expectType<number[]>(serialize([1, 2, 3]));
expectType<{}>(serialize(new Set([1, 2, 3])));
expectType<{}>(
  serialize(
    new Map([
      [1, '2'],
      [2, '4'],
    ]),
  ),
);
expectType<string>(serialize(new PermissionsBitField(PermissionFlagsBits.AttachFiles)));
expectType<number>(serialize(new IntentsBitField(GatewayIntentBits.Guilds)));
expectAssignable<unknown>(
  serialize(
    new Collection([
      [1, '2'],
      [2, '4'],
    ]),
  ),
);
expectType<never>(serialize(Symbol('a')));
expectType<never>(serialize(() => {}));
expectType<never>(serialize(BigInt(42)));

// Test type return of broadcastEval:
declare const shardClientUtil: ShardClientUtil;
declare const shardingManager: ShardingManager;

expectType<Promise<number[]>>(shardingManager.broadcastEval(() => 1));
expectType<Promise<number[]>>(shardClientUtil.broadcastEval(() => 1));
expectType<Promise<number[]>>(shardingManager.broadcastEval(async () => 1));
expectType<Promise<number[]>>(shardClientUtil.broadcastEval(async () => 1));

declare const dmChannel: DMChannel;
declare const threadChannel: ThreadChannel;
declare const threadChannelFromForum: ThreadChannel<true>;
declare const threadChannelNotFromForum: ThreadChannel<false>;
declare const newsChannel: NewsChannel;
declare const textChannel: TextChannel;
declare const voiceChannel: VoiceChannel;
declare const guild: Guild;
declare const user: User;
declare const guildMember: GuildMember;

// Test thread channels' parent inference
expectType<TextChannel | NewsChannel | ForumChannel | MediaChannel | null>(threadChannel.parent);
expectType<ForumChannel | MediaChannel | null>(threadChannelFromForum.parent);
expectType<TextChannel | NewsChannel | null>(threadChannelNotFromForum.parent);

// Test whether the structures implement send
expectType<TextBasedChannelFields<false>['send']>(dmChannel.send);
expectType<TextBasedChannelFields<true>['send']>(threadChannel.send);
expectType<TextBasedChannelFields<true>['send']>(newsChannel.send);
expectType<TextBasedChannelFields<true>['send']>(textChannel.send);
expectType<TextBasedChannelFields<true>['send']>(voiceChannel.send);
expectAssignable<PartialTextBasedChannelFields>(user);
expectAssignable<PartialTextBasedChannelFields>(guildMember);

expectType<Promise<NewsChannel>>(textChannel.setType(ChannelType.GuildAnnouncement));
expectType<Promise<TextChannel>>(newsChannel.setType(ChannelType.GuildText));

expectType<Message | null>(dmChannel.lastMessage);
expectType<Message | null>(threadChannel.lastMessage);
expectType<Message | null>(newsChannel.lastMessage);
expectType<Message | null>(textChannel.lastMessage);
expectType<Message | null>(voiceChannel.lastMessage);

notPropertyOf(user, 'lastMessage');
notPropertyOf(user, 'lastMessageId');
notPropertyOf(guildMember, 'lastMessage');
notPropertyOf(guildMember, 'lastMessageId');

// Test collector event parameters
declare const messageCollector: MessageCollector;
messageCollector.on('collect', (...args) => {
  expectType<[Message, Collection<Snowflake, Message>]>(args);
});

(async () => {
  for await (const value of messageCollector) {
    expectType<[Message<boolean>, Collection<Snowflake, Message>]>(value);
  }
})();

declare const reactionCollector: ReactionCollector;
reactionCollector.on('dispose', (...args) => {
  expectType<[MessageReaction, User]>(args);
});

(async () => {
  for await (const value of reactionCollector) {
    expectType<[MessageReaction, User]>(value);
  }
})();

// Make sure the properties are typed correctly, and that no backwards properties
// (K -> V and V -> K) exist:
expectAssignable<'messageCreate'>(Events.MessageCreate);
expectAssignable<'close'>(WebSocketShardEvents.Close);
expectAssignable<'death'>(ShardEvents.Death);
expectAssignable<1>(Status.Connecting);

declare const applicationCommandData: ApplicationCommandData;
declare const applicationCommandOptionData: ApplicationCommandOptionData;
declare const applicationCommandResolvable: ApplicationCommandResolvable;
declare const applicationCommandManager: ApplicationCommandManager;
{
  type ApplicationCommandScope = ApplicationCommand<{ guild: GuildResolvable }>;

  expectType<Promise<ApplicationCommandScope>>(applicationCommandManager.create(applicationCommandData));
  expectAssignable<Promise<ApplicationCommand>>(applicationCommandManager.create(applicationCommandData, '0'));
  expectType<Promise<ApplicationCommandScope>>(
    applicationCommandManager.edit(applicationCommandResolvable, applicationCommandData),
  );
  expectType<Promise<ApplicationCommand>>(
    applicationCommandManager.edit(applicationCommandResolvable, applicationCommandData, '0'),
  );
  expectType<Promise<Collection<Snowflake, ApplicationCommandScope>>>(
    applicationCommandManager.set([applicationCommandData]),
  );
  expectType<Promise<Collection<Snowflake, ApplicationCommand>>>(
    applicationCommandManager.set([applicationCommandData] as const, '0'),
  );

  // Test inference of choice values.
  if ('choices' in applicationCommandOptionData) {
    if (applicationCommandOptionData.type === ApplicationCommandOptionType.String) {
      expectType<string>(applicationCommandOptionData.choices[0]!.value);
      expectNotType<number>(applicationCommandOptionData.choices[0]!.value);
    }

    if (applicationCommandOptionData.type === ApplicationCommandOptionType.Integer) {
      expectType<number>(applicationCommandOptionData.choices[0]!.value);
      expectNotType<string>(applicationCommandOptionData.choices[0]!.value);
    }

    if (applicationCommandOptionData.type === ApplicationCommandOptionType.Number) {
      expectType<number>(applicationCommandOptionData.choices[0]!.value);
      expectNotType<string>(applicationCommandOptionData.choices[0]!.value);
    }
  }
}

declare const applicationCommandPermissionsManager: ApplicationCommandPermissionsManager<
  {},
  {},
  Guild | null,
  Snowflake
>;
{
  applicationCommandPermissionsManager.add({ permissions: [], token: '' });
  applicationCommandPermissionsManager.add({ permissions: [] as const, token: '' });
  applicationCommandPermissionsManager.set({ permissions: [], token: '' });
  applicationCommandPermissionsManager.set({ permissions: [] as const, token: '' });
  applicationCommandPermissionsManager.remove({ channels: [], roles: [], users: [], token: '' });

  applicationCommandPermissionsManager.remove({
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

declare const applicationNonChoiceOptionData: ApplicationCommandOptionData & {
  type: CommandOptionNonChoiceResolvableType;
};
{
  // Options aren't allowed on this command type.

  // @ts-expect-error
  applicationNonChoiceOptionData.choices;
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
  expectType<ApplicationCommandOptionType.SubcommandGroup>(applicationSubGroupCommandData.type);
  applicationSubGroupCommandData.options = [];
  applicationSubGroupCommandData.options = [] as const;
  applicationCommandSubGroup.options = [];
  applicationCommandSubGroup.options = [] as const;
}

declare const autoModerationRuleManager: AutoModerationRuleManager;
{
  expectType<Promise<AutoModerationRule>>(autoModerationRuleManager.fetch('1234567890'));
  expectType<Promise<AutoModerationRule>>(autoModerationRuleManager.fetch({ autoModerationRule: '1234567890' }));
  expectType<Promise<AutoModerationRule>>(
    autoModerationRuleManager.fetch({ autoModerationRule: '1234567890', cache: false }),
  );
  expectType<Promise<AutoModerationRule>>(
    autoModerationRuleManager.fetch({ autoModerationRule: '1234567890', force: true }),
  );
  expectType<Promise<AutoModerationRule>>(
    autoModerationRuleManager.fetch({ autoModerationRule: '1234567890', cache: false, force: true }),
  );
  expectType<Promise<Collection<Snowflake, AutoModerationRule>>>(autoModerationRuleManager.fetch());
  expectType<Promise<Collection<Snowflake, AutoModerationRule>>>(autoModerationRuleManager.fetch({}));
  expectType<Promise<Collection<Snowflake, AutoModerationRule>>>(autoModerationRuleManager.fetch({ cache: false }));
  // @ts-expect-error The `force` option cannot be used alongside fetching all auto moderation rules.
  autoModerationRuleManager.fetch({ force: false });
}

declare const guildApplicationCommandManager: GuildApplicationCommandManager;
expectType<Promise<Collection<Snowflake, ApplicationCommand>>>(guildApplicationCommandManager.fetch());
expectType<Promise<Collection<Snowflake, ApplicationCommand>>>(guildApplicationCommandManager.fetch(undefined, {}));
expectType<Promise<ApplicationCommand>>(guildApplicationCommandManager.fetch('0'));

declare const categoryChannelChildManager: CategoryChannelChildManager;
{
  expectType<Promise<VoiceChannel>>(categoryChannelChildManager.create({ name: 'name', type: ChannelType.GuildVoice }));
  expectType<Promise<TextChannel>>(categoryChannelChildManager.create({ name: 'name', type: ChannelType.GuildText }));
  expectType<Promise<NewsChannel>>(
    categoryChannelChildManager.create({ name: 'name', type: ChannelType.GuildAnnouncement }),
  );
  expectType<Promise<StageChannel>>(
    categoryChannelChildManager.create({ name: 'name', type: ChannelType.GuildStageVoice }),
  );
  expectType<Promise<TextChannel>>(categoryChannelChildManager.create({ name: 'name' }));
  expectType<Promise<TextChannel>>(categoryChannelChildManager.create({ name: 'name' }));
}

declare const guildChannelManager: GuildChannelManager;
{
  expectType<Promise<TextChannel>>(guildChannelManager.create({ name: 'name' }));
  expectType<Promise<TextChannel>>(guildChannelManager.create({ name: 'name' }));
  expectType<Promise<VoiceChannel>>(guildChannelManager.create({ name: 'name', type: ChannelType.GuildVoice }));
  expectType<Promise<CategoryChannel>>(guildChannelManager.create({ name: 'name', type: ChannelType.GuildCategory }));
  expectType<Promise<TextChannel>>(guildChannelManager.create({ name: 'name', type: ChannelType.GuildText }));
  expectType<Promise<NewsChannel>>(guildChannelManager.create({ name: 'name', type: ChannelType.GuildAnnouncement }));
  expectType<Promise<StageChannel>>(guildChannelManager.create({ name: 'name', type: ChannelType.GuildStageVoice }));
  expectType<Promise<ForumChannel>>(guildChannelManager.create({ name: 'name', type: ChannelType.GuildForum }));
  expectType<Promise<MediaChannel>>(guildChannelManager.create({ name: 'name', type: ChannelType.GuildMedia }));

  expectType<Promise<Collection<Snowflake, NonThreadGuildBasedChannel | null>>>(guildChannelManager.fetch());
  expectType<Promise<Collection<Snowflake, NonThreadGuildBasedChannel | null>>>(
    guildChannelManager.fetch(undefined, {}),
  );
  expectType<Promise<GuildBasedChannel | null>>(guildChannelManager.fetch('0'));

  const channel = guildChannelManager.cache.first()!;

  if (channel.isTextBased()) {
    const { messages } = channel;
    const message = await messages.fetch('123');
    expectType<GuildMessageManager>(messages);
    expectType<Promise<Message<true>>>(messages.crosspost('1234567890'));
    expectType<Promise<Message<true>>>(messages.edit('1234567890', 'text'));
    expectType<Promise<Message<true>>>(messages.fetch('1234567890'));
    expectType<Promise<Collection<Snowflake, Message<true>>>>(messages.fetchPinned());
    expectType<Guild>(message.guild);
    expectType<Snowflake>(message.guildId);
    expectType<GuildTextBasedChannel>(message.channel.messages.channel);
  }
}

{
  const { messages } = dmChannel;
  const message = await messages.fetch('123');
  expectType<DMMessageManager>(messages);
  expectType<Promise<Message>>(messages.edit('1234567890', 'text'));
  expectType<Promise<Message>>(messages.fetch('1234567890'));
  expectType<Promise<Collection<Snowflake, Message>>>(messages.fetchPinned());
  expectType<Guild | null>(message.guild);
  expectType<Snowflake | null>(message.guildId);
  expectType<DMChannel | PartialGroupDMChannel | GuildTextBasedChannel>(message.channel.messages.channel);
  expectType<MessageMentions>(message.mentions);
  expectType<Guild | null>(message.mentions.guild);
  expectType<Collection<Snowflake, GuildMember> | null>(message.mentions.members);

  if (messages.channel.isDMBased()) {
    expectType<DMChannel>(messages.channel);
    expectType<DMChannel>(messages.channel.messages.channel);
  }

  // @ts-expect-error Crossposting is not possible in direct messages.
  messages.crosspost('1234567890');
}

declare const threadManager: ThreadManager;
{
  expectType<Promise<AnyThreadChannel | null>>(threadManager.fetch('12345678901234567'));
  expectType<Promise<AnyThreadChannel | null>>(threadManager.fetch('12345678901234567', { cache: true, force: false }));
  expectType<Promise<FetchedThreads>>(threadManager.fetch());
  expectType<Promise<FetchedThreads>>(threadManager.fetch({}));
  expectType<Promise<FetchedThreadsMore>>(threadManager.fetch({ archived: { limit: 4 } }));

  // @ts-expect-error The force option has no effect here.
  threadManager.fetch({ archived: {} }, { force: true });
}

declare const guildForumThreadManager: GuildForumThreadManager;
expectType<ForumChannel | MediaChannel>(guildForumThreadManager.channel);

declare const guildTextThreadManager: GuildTextThreadManager<
  ChannelType.PublicThread | ChannelType.PrivateThread | ChannelType.AnnouncementThread
>;
expectType<TextChannel | NewsChannel>(guildTextThreadManager.channel);

declare const guildMemberManager: GuildMemberManager;
{
  expectType<Promise<GuildMember>>(guildMemberManager.fetch('12345678901234567'));
  expectType<Promise<GuildMember>>(guildMemberManager.fetch({ user: '12345678901234567' }));
  expectType<Promise<GuildMember>>(guildMemberManager.fetch({ user: '12345678901234567', cache: true, force: false }));
  expectType<Promise<GuildMember>>(guildMemberManager.fetch({ user: '12345678901234567', cache: true, force: false }));
  expectType<Promise<Collection<Snowflake, GuildMember>>>(guildMemberManager.fetch());
  expectType<Promise<Collection<Snowflake, GuildMember>>>(guildMemberManager.fetch({}));
  expectType<Promise<Collection<Snowflake, GuildMember>>>(guildMemberManager.fetch({ user: ['12345678901234567'] }));
  expectType<Promise<Collection<Snowflake, GuildMember>>>(guildMemberManager.fetch({ withPresences: false }));
  expectType<Promise<GuildMember>>(guildMemberManager.fetch({ user: '12345678901234567', withPresences: true }));

  expectType<Promise<Collection<Snowflake, GuildMember>>>(
    guildMemberManager.fetch({ query: 'test', user: ['12345678901234567'], nonce: 'test' }),
  );

  // @ts-expect-error The cache & force options have no effect here.
  guildMemberManager.fetch({ cache: true, force: false });
  // @ts-expect-error The force option has no effect here.
  guildMemberManager.fetch({ user: ['12345678901234567'], cache: true, force: false });
}

declare const messageManager: MessageManager;
{
  expectType<Promise<Message>>(messageManager.fetch('1234567890'));
  expectType<Promise<Message>>(messageManager.fetch({ message: '1234567890' }));
  expectType<Promise<Message>>(messageManager.fetch({ message: '1234567890', cache: true, force: false }));
  expectType<Promise<Collection<Snowflake, Message>>>(messageManager.fetch());
  expectType<Promise<Collection<Snowflake, Message>>>(messageManager.fetch({}));
  expectType<Promise<Collection<Snowflake, Message>>>(
    messageManager.fetch({ limit: 100, before: '1234567890', cache: false }),
  );
  // @ts-expect-error
  messageManager.fetch({ cache: true, force: false });
  // @ts-expect-error
  messageManager.fetch({ message: '1234567890', after: '1234567890', cache: true, force: false });
}

declare const roleManager: RoleManager;
expectType<Promise<Collection<Snowflake, Role>>>(roleManager.fetch());
expectType<Promise<Collection<Snowflake, Role>>>(roleManager.fetch(undefined, {}));
expectType<Promise<Role | null>>(roleManager.fetch('0'));

declare const guildEmojiManager: GuildEmojiManager;
expectType<Promise<Collection<Snowflake, GuildEmoji>>>(guildEmojiManager.fetch());
expectType<Promise<Collection<Snowflake, GuildEmoji>>>(guildEmojiManager.fetch(undefined, {}));
expectType<Promise<GuildEmoji>>(guildEmojiManager.fetch('0'));

declare const applicationEmojiManager: ApplicationEmojiManager;
expectType<Promise<Collection<Snowflake, ApplicationEmoji>>>(applicationEmojiManager.fetch());
expectType<Promise<Collection<Snowflake, ApplicationEmoji>>>(applicationEmojiManager.fetch(undefined, {}));
expectType<Promise<ApplicationEmoji>>(applicationEmojiManager.fetch('0'));

declare const guildBanManager: GuildBanManager;
{
  expectType<Promise<GuildBan>>(guildBanManager.fetch('1234567890'));
  expectType<Promise<GuildBan>>(guildBanManager.fetch({ user: '1234567890' }));
  expectType<Promise<GuildBan>>(guildBanManager.fetch({ user: '1234567890', cache: true, force: false }));
  expectType<Promise<Collection<Snowflake, GuildBan>>>(guildBanManager.fetch());
  expectType<Promise<Collection<Snowflake, GuildBan>>>(guildBanManager.fetch({}));
  expectType<Promise<Collection<Snowflake, GuildBan>>>(guildBanManager.fetch({ limit: 100, before: '1234567890' }));
  // @ts-expect-error
  guildBanManager.fetch({ cache: true, force: false });
  // @ts-expect-error
  guildBanManager.fetch({ user: '1234567890', after: '1234567890', cache: true, force: false });
}

declare const threadMemberWithGuildMember: ThreadMember<true>;
declare const threadMemberManager: ThreadMemberManager;
{
  expectType<Promise<ThreadMember>>(threadMemberManager.fetch('12345678'));
  expectType<Promise<ThreadMember>>(threadMemberManager.fetch({ member: '12345678', cache: false }));
  expectType<Promise<ThreadMember>>(threadMemberManager.fetch({ member: '12345678', force: true }));
  expectType<Promise<ThreadMember<true>>>(threadMemberManager.fetch({ member: threadMemberWithGuildMember }));
  expectType<Promise<ThreadMember<true>>>(threadMemberManager.fetch({ member: '12345678901234567', withMember: true }));
  expectType<Promise<Collection<Snowflake, ThreadMember>>>(threadMemberManager.fetch());
  expectType<Promise<Collection<Snowflake, ThreadMember>>>(threadMemberManager.fetch({}));

  expectType<Promise<Collection<Snowflake, ThreadMember<true>>>>(
    threadMemberManager.fetch({ cache: true, limit: 50, withMember: true, after: '12345678901234567' }),
  );

  expectType<Promise<Collection<Snowflake, ThreadMember>>>(
    threadMemberManager.fetch({ cache: true, withMember: false }),
  );

  // @ts-expect-error The `force` option cannot be used alongside fetching all thread members.
  threadMemberManager.fetch({ cache: true, force: false });
  // @ts-expect-error `withMember` needs to be `true` to receive paginated results.
  threadMemberManager.fetch({ withMember: false, limit: 5, after: '12345678901234567' });
}

declare const typing: Typing;
expectType<User | PartialUser>(typing.user);
if (typing.user.partial) expectType<null>(typing.user.username);
if (!typing.user.partial) expectType<string>(typing.user.tag);

expectType<TextBasedChannel>(typing.channel);
if (typing.channel.partial) expectType<undefined>(typing.channel.lastMessageId);

expectType<GuildMember | null>(typing.member);
expectType<Guild | null>(typing.guild);

if (typing.inGuild()) {
  expectType<Guild>(typing.channel.guild);
  expectType<Guild>(typing.guild);
}

// Test interactions
declare const interaction: Interaction;
declare const booleanValue: boolean;
if (interaction.inGuild()) {
  expectType<Snowflake>(interaction.guildId);
} else {
  expectType<Snowflake | null>(interaction.guildId);
}

client.on('interactionCreate', async interaction => {
  if (interaction.type === InteractionType.MessageComponent) {
    expectType<AnySelectMenuInteraction | ButtonInteraction>(interaction);
    expectType<MessageActionRowComponent | APIButtonComponent | APISelectMenuComponent>(interaction.component);
    expectType<Message>(interaction.message);
    expectDeprecated(interaction.sendPremiumRequired());
    if (interaction.inCachedGuild()) {
      expectAssignable<MessageComponentInteraction>(interaction);
      expectType<MessageActionRowComponent>(interaction.component);
      expectType<Message<true>>(interaction.message);
      expectType<Guild>(interaction.guild);
      expectType<Promise<Message<true>>>(interaction.reply({ content: 'a', fetchReply: true }));
      expectType<Promise<Message<true>>>(interaction.deferReply({ fetchReply: true }));
      expectType<Promise<Message<true>>>(interaction.editReply({ content: 'a' }));
      expectType<Promise<Message<true>>>(interaction.fetchReply());
      expectType<Promise<Message<true>>>(interaction.update({ content: 'a', fetchReply: true }));
      expectType<Promise<Message<true>>>(interaction.deferUpdate({ fetchReply: true }));
      expectType<Promise<Message<true>>>(interaction.followUp({ content: 'a' }));
    } else if (interaction.inRawGuild()) {
      expectAssignable<MessageComponentInteraction>(interaction);
      expectType<APIButtonComponent | APISelectMenuComponent>(interaction.component);
      expectType<Message<false>>(interaction.message);
      expectType<null>(interaction.guild);
      expectType<Promise<Message<false>>>(interaction.reply({ content: 'a', fetchReply: true }));
      expectType<Promise<Message<false>>>(interaction.deferReply({ fetchReply: true }));
      expectType<Promise<Message<false>>>(interaction.editReply({ content: 'a' }));
      expectType<Promise<Message<false>>>(interaction.fetchReply());
      expectType<Promise<Message<false>>>(interaction.update({ content: 'a', fetchReply: true }));
      expectType<Promise<Message<false>>>(interaction.deferUpdate({ fetchReply: true }));
      expectType<Promise<Message<false>>>(interaction.followUp({ content: 'a' }));
    } else if (interaction.inGuild()) {
      expectAssignable<MessageComponentInteraction>(interaction);
      expectType<MessageActionRowComponent | APIButtonComponent | APISelectMenuComponent>(interaction.component);
      expectType<Message>(interaction.message);
      expectType<Guild | null>(interaction.guild);
      expectType<Promise<Message>>(interaction.reply({ content: 'a', fetchReply: true }));
      expectType<Promise<Message>>(interaction.deferReply({ fetchReply: true }));
      expectType<Promise<Message>>(interaction.editReply({ content: 'a' }));
      expectType<Promise<Message>>(interaction.fetchReply());
      expectType<Promise<Message>>(interaction.update({ content: 'a', fetchReply: true }));
      expectType<Promise<Message>>(interaction.deferUpdate({ fetchReply: true }));
      expectType<Promise<Message>>(interaction.followUp({ content: 'a' }));
    }
  }

  if (interaction.inCachedGuild()) {
    expectAssignable<GuildMember>(interaction.member);
    expectNotType<ChatInputCommandInteraction<'cached'>>(interaction);
    expectAssignable<Interaction>(interaction);
    expectType<Locale>(interaction.guildLocale);
  } else if (interaction.inRawGuild()) {
    expectAssignable<APIInteractionGuildMember>(interaction.member);
    expectNotAssignable<Interaction<'cached'>>(interaction);
    expectType<Locale>(interaction.guildLocale);
  } else if (interaction.inGuild()) {
    expectType<Locale>(interaction.guildLocale);
  } else {
    expectType<APIInteractionGuildMember | GuildMember | null>(interaction.member);
    expectNotAssignable<Interaction<'cached'>>(interaction);
    expectType<string | null>(interaction.guildId);
  }

  if (
    interaction.type === InteractionType.ApplicationCommand &&
    (interaction.commandType === ApplicationCommandType.User ||
      interaction.commandType === ApplicationCommandType.Message)
  ) {
    expectType<MessageContextMenuCommandInteraction | UserContextMenuCommandInteraction>(interaction);
    // @ts-expect-error No attachment options on contextmenu commands
    interaction.options.getAttachment('name');
    if (interaction.inCachedGuild()) {
      expectAssignable<ContextMenuCommandInteraction>(interaction);
      expectAssignable<Guild>(interaction.guild);
      expectAssignable<CommandInteraction<'cached'>>(interaction);
      expectType<Promise<Message<true>>>(interaction.reply({ content: 'a', fetchReply: true }));
      expectType<Promise<Message<true>>>(interaction.deferReply({ fetchReply: true }));
      expectType<Promise<Message<true>>>(interaction.editReply({ content: 'a' }));
      expectType<Promise<Message<true>>>(interaction.fetchReply());
      expectType<Promise<Message<true>>>(interaction.followUp({ content: 'a' }));
    } else if (interaction.inRawGuild()) {
      expectAssignable<ContextMenuCommandInteraction>(interaction);
      expectType<null>(interaction.guild);
      expectType<Promise<Message<false>>>(interaction.reply({ content: 'a', fetchReply: true }));
      expectType<Promise<Message<false>>>(interaction.deferReply({ fetchReply: true }));
      expectType<Promise<Message<false>>>(interaction.editReply({ content: 'a' }));
      expectType<Promise<Message<false>>>(interaction.fetchReply());
      expectType<Promise<Message<false>>>(interaction.followUp({ content: 'a' }));
    } else if (interaction.inGuild()) {
      expectAssignable<ContextMenuCommandInteraction>(interaction);
      expectType<Guild | null>(interaction.guild);
      expectType<Promise<Message>>(interaction.reply({ content: 'a', fetchReply: true }));
      expectType<Promise<Message>>(interaction.deferReply({ fetchReply: true }));
      expectType<Promise<Message>>(interaction.editReply({ content: 'a' }));
      expectType<Promise<Message>>(interaction.fetchReply());
      expectType<Promise<Message>>(interaction.followUp({ content: 'a' }));
    }
  }

  if (
    interaction.type === InteractionType.ApplicationCommand &&
    interaction.commandType === ApplicationCommandType.Message
  ) {
    expectType<Message>(interaction.targetMessage);
    expectType<Message | null>(interaction.options.getMessage('_MESSAGE'));
    if (interaction.inCachedGuild()) {
      expectType<Message<true>>(interaction.targetMessage);
      expectType<Message<true> | null>(interaction.options.getMessage('_MESSAGE'));
    } else if (interaction.inRawGuild()) {
      expectType<Message<false>>(interaction.targetMessage);
      expectType<Message<false> | null>(interaction.options.getMessage('_MESSAGE'));
    } else if (interaction.inGuild()) {
      expectType<Message>(interaction.targetMessage);
      expectType<Message | null>(interaction.options.getMessage('_MESSAGE'));
    }
  }

  if (
    interaction.type === InteractionType.ApplicationCommand &&
    interaction.commandType === ApplicationCommandType.User
  ) {
    expectType<User>(interaction.targetUser);
    expectType<GuildMember | APIInteractionGuildMember | null>(interaction.targetMember);
    expectType<User | null>(interaction.options.getUser('user'));
    expectType<GuildMember | APIInteractionDataResolvedGuildMember | null>(interaction.options.getMember('user'));
    if (interaction.inCachedGuild()) {
      expectType<GuildMember | null>(interaction.targetMember);
      expectType<GuildMember | null>(interaction.options.getMember('user'));
    } else if (interaction.inRawGuild()) {
      expectType<APIInteractionGuildMember | null>(interaction.targetMember);
      expectType<APIInteractionDataResolvedGuildMember | null>(interaction.options.getMember('user'));
    } else if (interaction.inGuild()) {
      expectType<GuildMember | APIInteractionGuildMember | null>(interaction.targetMember);
      expectType<GuildMember | APIInteractionDataResolvedGuildMember | null>(interaction.options.getMember('user'));
    }
  }

  if (interaction.type === InteractionType.MessageComponent && interaction.componentType === ComponentType.Button) {
    expectType<ButtonInteraction>(interaction);
    expectType<ButtonComponent | APIButtonComponent>(interaction.component);
    expectType<Message>(interaction.message);
    if (interaction.inCachedGuild()) {
      expectAssignable<ButtonInteraction>(interaction);
      expectType<ButtonComponent>(interaction.component);
      expectType<Message<true>>(interaction.message);
      expectType<Guild>(interaction.guild);
      expectType<Promise<Message<true>>>(interaction.reply({ fetchReply: true }));
    } else if (interaction.inRawGuild()) {
      expectAssignable<ButtonInteraction>(interaction);
      expectType<APIButtonComponent>(interaction.component);
      expectType<Message<false>>(interaction.message);
      expectType<null>(interaction.guild);
      expectType<Promise<Message<false>>>(interaction.reply({ fetchReply: true }));
    } else if (interaction.inGuild()) {
      expectAssignable<ButtonInteraction>(interaction);
      expectType<ButtonComponent | APIButtonComponent>(interaction.component);
      expectType<Message>(interaction.message);
      expectAssignable<Guild | null>(interaction.guild);
      expectType<Promise<Message>>(interaction.reply({ fetchReply: true }));
    }
  }

  if (
    interaction.type === InteractionType.MessageComponent &&
    interaction.componentType === ComponentType.StringSelect
  ) {
    expectType<StringSelectMenuInteraction>(interaction);
    expectType<StringSelectMenuComponent | APIStringSelectComponent>(interaction.component);
    expectType<Message>(interaction.message);
    if (interaction.inCachedGuild()) {
      expectAssignable<StringSelectMenuInteraction>(interaction);
      expectType<SelectMenuComponent>(interaction.component);
      expectType<Message<true>>(interaction.message);
      expectType<Guild>(interaction.guild);
      expectType<Promise<Message<true>>>(interaction.reply({ fetchReply: true }));
    } else if (interaction.inRawGuild()) {
      expectAssignable<StringSelectMenuInteraction>(interaction);
      expectType<APIStringSelectComponent>(interaction.component);
      expectType<Message<false>>(interaction.message);
      expectType<null>(interaction.guild);
      expectType<Promise<Message<false>>>(interaction.reply({ fetchReply: true }));
    } else if (interaction.inGuild()) {
      expectAssignable<StringSelectMenuInteraction>(interaction);
      expectType<SelectMenuComponent | APIStringSelectComponent>(interaction.component);
      expectType<Message>(interaction.message);
      expectType<Guild | null>(interaction.guild);
      expectType<Promise<Message>>(interaction.reply({ fetchReply: true }));
    }
  }

  if (
    interaction.type === InteractionType.ApplicationCommand &&
    interaction.commandType === ApplicationCommandType.ChatInput
  ) {
    expectDeprecated(interaction.sendPremiumRequired());
    if (interaction.inRawGuild()) {
      expectNotAssignable<Interaction<'cached'>>(interaction);
      expectAssignable<ChatInputCommandInteraction>(interaction);
      expectType<Promise<Message<false>>>(interaction.reply({ fetchReply: true }));
      expectType<APIInteractionDataResolvedGuildMember | null>(interaction.options.getMember('test'));

      expectType<APIInteractionDataResolvedChannel>(interaction.options.getChannel('test', true));
      expectType<APIRole>(interaction.options.getRole('test', true));
    } else if (interaction.inCachedGuild()) {
      const msg = await interaction.reply({ fetchReply: true });
      const btn = await msg.awaitMessageComponent({ componentType: ComponentType.Button });

      expectType<Message<true>>(msg);
      expectType<ButtonInteraction<'cached'>>(btn);

      expectType<GuildMember | null>(interaction.options.getMember('test'));
      expectAssignable<ChatInputCommandInteraction>(interaction);
      expectType<Promise<Message<true>>>(interaction.reply({ fetchReply: true }));

      expectType<GuildBasedChannel>(interaction.options.getChannel('test', true));
      expectType<Role>(interaction.options.getRole('test', true));

      expectType<PublicThreadChannel>(interaction.options.getChannel('test', true, [ChannelType.PublicThread]));
      expectType<PublicThreadChannel>(interaction.options.getChannel('test', true, [ChannelType.AnnouncementThread]));
      expectType<PublicThreadChannel>(
        interaction.options.getChannel('test', true, [ChannelType.PublicThread, ChannelType.AnnouncementThread]),
      );
      expectType<PrivateThreadChannel>(interaction.options.getChannel('test', true, [ChannelType.PrivateThread]));

      expectType<TextChannel>(interaction.options.getChannel('test', true, [ChannelType.GuildText]));
      expectType<TextChannel | null>(interaction.options.getChannel('test', false, [ChannelType.GuildText]));
      expectType<ForumChannel | VoiceChannel>(
        interaction.options.getChannel('test', true, [ChannelType.GuildForum, ChannelType.GuildVoice]),
      );
      expectType<TextChannel>(interaction.options.getChannel('test', true, [ChannelType.GuildText] as const));
      expectType<ForumChannel | VoiceChannel | null>(
        interaction.options.getChannel('test', false, [ChannelType.GuildForum, ChannelType.GuildVoice]),
      );
      expectType<MediaChannel>(interaction.options.getChannel('test', true, [ChannelType.GuildMedia]));
    } else {
      // @ts-expect-error
      consumeCachedCommand(interaction);
      expectType<ChatInputCommandInteraction>(interaction);
      expectType<Promise<Message>>(interaction.reply({ fetchReply: true }));
      expectType<APIInteractionDataResolvedGuildMember | GuildMember | null>(interaction.options.getMember('test'));

      expectType<GuildBasedChannel | APIInteractionDataResolvedChannel>(interaction.options.getChannel('test', true));
      expectType<APIRole | Role>(interaction.options.getRole('test', true));
    }

    expectType<ChatInputCommandInteraction>(interaction);
    expectType<Omit<CommandInteractionOptionResolver<CacheType>, 'getFocused' | 'getMessage'>>(interaction.options);
    expectType<readonly CommandInteractionOption[]>(interaction.options.data);

    const optionalOption = interaction.options.get('name');
    const requiredOption = interaction.options.get('name', true);
    expectType<CommandInteractionOption | null>(optionalOption);
    expectType<CommandInteractionOption>(requiredOption);
    expectType<readonly CommandInteractionOption[] | undefined>(requiredOption.options);

    expectType<string | null>(interaction.options.getString('name', booleanValue));
    expectType<string | null>(interaction.options.getString('name', false));
    expectType<string>(interaction.options.getString('name', true));

    expectType<string>(interaction.options.getSubcommand());
    expectType<string>(interaction.options.getSubcommand(true));
    expectType<string | null>(interaction.options.getSubcommand(booleanValue));
    expectType<string | null>(interaction.options.getSubcommand(false));

    expectType<string>(interaction.options.getSubcommandGroup(true));
    expectType<string | null>(interaction.options.getSubcommandGroup());
    expectType<string | null>(interaction.options.getSubcommandGroup(booleanValue));
    expectType<string | null>(interaction.options.getSubcommandGroup(false));

    // @ts-expect-error
    interaction.options.getMessage('name');
  }

  if (interaction.isRepliable()) {
    expectAssignable<RepliableInteraction>(interaction);
    interaction.reply('test');
  }

  if (
    interaction.type === InteractionType.ApplicationCommand &&
    interaction.commandType === ApplicationCommandType.ChatInput &&
    interaction.isRepliable()
  ) {
    expectAssignable<CommandInteraction>(interaction);
    expectAssignable<RepliableInteraction>(interaction);
  }

  if (interaction.type === InteractionType.ModalSubmit && interaction.isRepliable()) {
    expectType<ModalSubmitInteraction>(interaction);
    if (interaction.inCachedGuild()) {
      expectAssignable<ModalSubmitInteraction>(interaction);
      expectType<Guild>(interaction.guild);
      expectType<Promise<Message<true>>>(interaction.reply({ content: 'a', fetchReply: true }));
      expectType<Promise<Message<true>>>(interaction.deferReply({ fetchReply: true }));
      expectType<Promise<Message<true>>>(interaction.editReply({ content: 'a' }));
      expectType<Promise<Message<true>>>(interaction.fetchReply());
      expectType<Promise<Message<true>>>(interaction.deferUpdate({ fetchReply: true }));
      expectType<Promise<Message<true>>>(interaction.followUp({ content: 'a' }));
    } else if (interaction.inRawGuild()) {
      expectAssignable<ModalSubmitInteraction>(interaction);
      expectType<null>(interaction.guild);
      expectType<Promise<Message<false>>>(interaction.reply({ content: 'a', fetchReply: true }));
      expectType<Promise<Message<false>>>(interaction.deferReply({ fetchReply: true }));
      expectType<Promise<Message<false>>>(interaction.editReply({ content: 'a' }));
      expectType<Promise<Message<false>>>(interaction.fetchReply());
      expectType<Promise<Message<false>>>(interaction.deferUpdate({ fetchReply: true }));
      expectType<Promise<Message<false>>>(interaction.followUp({ content: 'a' }));
    } else if (interaction.inGuild()) {
      expectAssignable<ModalSubmitInteraction>(interaction);
      expectType<Guild | null>(interaction.guild);
      expectType<Promise<Message>>(interaction.reply({ content: 'a', fetchReply: true }));
      expectType<Promise<Message>>(interaction.deferReply({ fetchReply: true }));
      expectType<Promise<Message>>(interaction.editReply({ content: 'a' }));
      expectType<Promise<Message>>(interaction.fetchReply());
      expectType<Promise<Message>>(interaction.deferUpdate({ fetchReply: true }));
      expectType<Promise<Message>>(interaction.followUp({ content: 'a' }));
    }
  }

  if (interaction.isModalSubmit()) {
    expectDeprecated(interaction.sendPremiumRequired());
  }
});

declare const shard: Shard;

shard.on('death', process => {
  expectType<ChildProcess | Worker>(process);
});

declare const webSocketShard: WebSocketShard;

webSocketShard.on('close', event => {
  expectType<CloseEvent>(event);
});

declare const collector: Collector<string, Interaction, string[]>;

collector.on('collect', (collected, ...other) => {
  expectType<Interaction>(collected);
  expectType<string[]>(other);
});

collector.on('dispose', (vals, ...other) => {
  expectType<Interaction>(vals);
  expectType<string[]>(other);
});

collector.on('end', (collection, reason) => {
  expectType<ReadonlyCollection<string, Interaction>>(collection);
  expectType<string>(reason);
});

(async () => {
  for await (const value of collector) {
    expectType<[Interaction, ...string[]]>(value);
  }
})();

expectType<Promise<number | null>>(shard.eval(client => client.readyTimestamp));

// Test audit logs
expectType<Promise<GuildAuditLogs<AuditLogEvent.MemberKick>>>(guild.fetchAuditLogs({ type: AuditLogEvent.MemberKick }));

expectType<Promise<GuildAuditLogs<AuditLogEvent.ChannelCreate>>>(
  guild.fetchAuditLogs({ type: AuditLogEvent.ChannelCreate }),
);

expectType<Promise<GuildAuditLogs<AuditLogEvent.IntegrationUpdate>>>(
  guild.fetchAuditLogs({ type: AuditLogEvent.IntegrationUpdate }),
);

expectType<Promise<GuildAuditLogs<null>>>(guild.fetchAuditLogs({ type: null }));
expectType<Promise<GuildAuditLogs<AuditLogEvent>>>(guild.fetchAuditLogs());

expectType<Promise<GuildAuditLogsEntry<AuditLogEvent.MemberKick, 'Delete', 'User'> | undefined>>(
  guild.fetchAuditLogs({ type: AuditLogEvent.MemberKick }).then(al => al.entries.first()),
);
expectAssignable<Promise<GuildAuditLogsEntry<AuditLogEvent.MemberKick, 'Delete', 'User'> | undefined>>(
  guild.fetchAuditLogs({ type: AuditLogEvent.MemberKick }).then(al => al.entries.first()),
);

expectType<Promise<GuildAuditLogsEntry<null, GuildAuditLogsActionType, GuildAuditLogsTargetType> | undefined>>(
  guild.fetchAuditLogs({ type: null }).then(al => al.entries.first()),
);
expectType<Promise<GuildAuditLogsEntry<null, GuildAuditLogsActionType, GuildAuditLogsTargetType> | undefined>>(
  guild.fetchAuditLogs().then(al => al.entries.first()),
);

expectType<Promise<{ integrationType: string } | null | undefined>>(
  guild.fetchAuditLogs({ type: AuditLogEvent.MemberKick }).then(al => al.entries.first()?.extra),
);

expectType<Promise<{ integrationType: string } | null | undefined>>(
  guild.fetchAuditLogs({ type: AuditLogEvent.MemberRoleUpdate }).then(al => al.entries.first()?.extra),
);

expectType<Promise<StageChannel | { id: Snowflake } | undefined>>(
  guild.fetchAuditLogs({ type: AuditLogEvent.StageInstanceCreate }).then(al => al.entries.first()?.extra),
);
expectType<Promise<{ channel: GuildTextBasedChannel | { id: Snowflake }; count: number } | undefined>>(
  guild.fetchAuditLogs({ type: AuditLogEvent.MessageDelete }).then(al => al.entries.first()?.extra),
);

expectType<Promise<User | null | undefined>>(
  guild.fetchAuditLogs({ type: AuditLogEvent.MemberKick }).then(al => al.entries.first()?.target),
);
expectType<Promise<StageInstance | undefined>>(
  guild.fetchAuditLogs({ type: AuditLogEvent.StageInstanceCreate }).then(al => al.entries.first()?.target),
);
expectType<Promise<User | undefined>>(
  guild.fetchAuditLogs({ type: AuditLogEvent.MessageDelete }).then(al => al.entries.first()?.target),
);

declare const AuditLogChange: AuditLogChange;
// @ts-expect-error
expectType<boolean | undefined>(AuditLogChange.old);
// @ts-expect-error
expectType<boolean | undefined>(AuditLogChange.new);
if (AuditLogChange.key === 'available') {
  expectType<boolean | undefined>(AuditLogChange.old);
  expectType<boolean | undefined>(AuditLogChange.new);
}

declare const TextBasedChannel: TextBasedChannel;
declare const TextBasedChannelTypes: TextBasedChannelTypes;
declare const VoiceBasedChannel: VoiceBasedChannel;
declare const GuildBasedChannel: GuildBasedChannel;
declare const NonThreadGuildBasedChannel: NonThreadGuildBasedChannel;
declare const GuildTextBasedChannel: GuildTextBasedChannel;

expectType<TextBasedChannel>(TextBasedChannel);
expectType<
  | ChannelType.GuildText
  | ChannelType.DM
  | ChannelType.GroupDM
  | ChannelType.GuildAnnouncement
  | ChannelType.GuildVoice
  | ChannelType.GuildStageVoice
  | ThreadChannelType
>(TextBasedChannelTypes);
expectType<StageChannel | VoiceChannel>(VoiceBasedChannel);
expectType<GuildBasedChannel>(GuildBasedChannel);
expectType<CategoryChannel | NewsChannel | StageChannel | TextChannel | VoiceChannel | ForumChannel | MediaChannel>(
  NonThreadGuildBasedChannel,
);
expectType<GuildTextBasedChannel>(GuildTextBasedChannel);

const button = new ButtonBuilder({
  label: 'test',
  style: ButtonStyle.Primary,
  customId: 'test',
});

const selectMenu = new StringSelectMenuBuilder({
  maxValues: 10,
  minValues: 2,
  customId: 'test',
});

new ActionRowBuilder({
  components: [selectMenu.toJSON(), button.toJSON()],
});

new StringSelectMenuBuilder({
  customId: 'foo',
});

new ButtonBuilder({
  style: ButtonStyle.Danger,
})
  .setEmoji('<a:foo:123>')
  .setEmoji('<:foo:123>')
  .setEmoji('foobar:123')
  .setEmoji('😏')
  .setEmoji({
    name: 'test',
    id: '123',
    animated: false,
  });

// @ts-expect-error
new EmbedBuilder().setColor('abc');

new EmbedBuilder().setColor('#ffffff');

expectNotAssignable<ActionRowData<MessageActionRowComponentData>>({
  type: ComponentType.ActionRow,
  components: [
    {
      type: ComponentType.Button,
    },
  ],
});

declare const chatInputInteraction: ChatInputCommandInteraction;

expectType<Attachment>(chatInputInteraction.options.getAttachment('attachment', true));
expectType<Attachment | null>(chatInputInteraction.options.getAttachment('attachment'));

declare const modal: ModalBuilder;

chatInputInteraction.showModal(modal);

chatInputInteraction.showModal({
  title: 'abc',
  custom_id: 'abc',
  components: [
    {
      components: [
        {
          custom_id: 'aa',
          label: 'label',
          style: TextInputStyle.Short,
          type: ComponentType.TextInput,
        },
      ],
      type: ComponentType.ActionRow,
    },
  ],
});

declare const stringSelectMenuData: APIStringSelectComponent;
StringSelectMenuBuilder.from(stringSelectMenuData);

declare const userSelectMenuData: APIUserSelectComponent;
UserSelectMenuBuilder.from(userSelectMenuData);

declare const roleSelectMenuData: APIRoleSelectComponent;
RoleSelectMenuBuilder.from(roleSelectMenuData);

declare const channelSelectMenuData: APIChannelSelectComponent;
ChannelSelectMenuBuilder.from(channelSelectMenuData);

declare const mentionableSelectMenuData: APIMentionableSelectComponent;
MentionableSelectMenuBuilder.from(mentionableSelectMenuData);

declare const stringSelectMenuComp: StringSelectMenuComponent;
StringSelectMenuBuilder.from(stringSelectMenuComp);

declare const userSelectMenuComp: UserSelectMenuComponent;
UserSelectMenuBuilder.from(userSelectMenuComp);

declare const roleSelectMenuComp: RoleSelectMenuComponent;
RoleSelectMenuBuilder.from(roleSelectMenuComp);

declare const channelSelectMenuComp: ChannelSelectMenuComponent;
ChannelSelectMenuBuilder.from(channelSelectMenuComp);

declare const mentionableSelectMenuComp: MentionableSelectMenuComponent;
MentionableSelectMenuBuilder.from(mentionableSelectMenuComp);

declare const buttonData: APIButtonComponent;
ButtonBuilder.from(buttonData);

declare const buttonComp: ButtonComponent;
ButtonBuilder.from(buttonComp);

declare const modalData: APIModalInteractionResponseCallbackData;
ModalBuilder.from(modalData);

declare const textInputData: APITextInputComponent;
TextInputBuilder.from(textInputData);

declare const textInputComp: TextInputComponent;
TextInputBuilder.from(textInputComp);

declare const embedData: APIEmbed;
EmbedBuilder.from(embedData);

declare const embedComp: Embed;
EmbedBuilder.from(embedComp);

declare const actionRowData: APIActionRowComponent<APIActionRowComponentTypes>;
ActionRowBuilder.from(actionRowData);

declare const actionRowComp: ActionRow<ActionRowComponent>;
ActionRowBuilder.from(actionRowComp);

declare const buttonsActionRowData: APIActionRowComponent<APIButtonComponent>;
declare const buttonsActionRowComp: ActionRow<ButtonComponent>;

expectType<ActionRowBuilder<ButtonBuilder>>(ActionRowBuilder.from<ButtonBuilder>(buttonsActionRowData));
expectType<ActionRowBuilder<ButtonBuilder>>(ActionRowBuilder.from<ButtonBuilder>(buttonsActionRowComp));

declare const anyComponentsActionRowData: APIActionRowComponent<APIActionRowComponentTypes>;
declare const anyComponentsActionRowComp: ActionRow<ActionRowComponent>;

expectType<ActionRowBuilder>(ActionRowBuilder.from(anyComponentsActionRowData));
expectType<ActionRowBuilder>(ActionRowBuilder.from(anyComponentsActionRowComp));

type UserMentionChannels = DMChannel | PartialDMChannel;
declare const channelMentionChannels: Exclude<Channel | DirectoryChannel, UserMentionChannels>;
declare const userMentionChannels: UserMentionChannels;

expectType<ChannelMention>(channelMentionChannels.toString());
expectType<UserMention>(userMentionChannels.toString());
expectType<UserMention>(user.toString());
expectType<UserMention>(guildMember.toString());

declare const webhook: Webhook;
declare const webhookClient: WebhookClient;
declare const interactionWebhook: InteractionWebhook;
declare const snowflake: Snowflake;

expectType<Promise<Message>>(webhook.send('content'));
expectType<Promise<Message>>(webhook.editMessage(snowflake, 'content'));
expectType<Promise<Message>>(webhook.fetchMessage(snowflake));
expectType<Promise<Webhook>>(webhook.edit({ name: 'name' }));

expectType<Promise<APIMessage>>(webhookClient.send('content'));
expectType<Promise<APIMessage>>(webhookClient.editMessage(snowflake, 'content'));
expectType<Promise<APIMessage>>(webhookClient.fetchMessage(snowflake));

expectType<Client<true>>(interactionWebhook.client);
expectType<Promise<Message>>(interactionWebhook.send('content'));
expectType<Promise<Message>>(interactionWebhook.editMessage(snowflake, 'content'));
expectType<Promise<Message>>(interactionWebhook.fetchMessage(snowflake));

declare const partialGroupDMChannel: PartialGroupDMChannel;
declare const categoryChannel: CategoryChannel;
declare const stageChannel: StageChannel;
declare const forumChannel: ForumChannel;

await forumChannel.edit({
  availableTags: [...forumChannel.availableTags, { name: 'tag' }],
});

await forumChannel.setAvailableTags([{ ...forumChannel.availableTags, name: 'tag' }]);
await forumChannel.setAvailableTags([{ name: 'tag' }]);

expectType<Readonly<ChannelFlagsBitField>>(textChannel.flags);
expectType<Readonly<ChannelFlagsBitField>>(voiceChannel.flags);
expectType<Readonly<ChannelFlagsBitField>>(stageChannel.flags);
expectType<Readonly<ChannelFlagsBitField>>(forumChannel.flags);
expectType<Readonly<ChannelFlagsBitField>>(dmChannel.flags);
expectType<Readonly<ChannelFlagsBitField>>(categoryChannel.flags);
expectType<Readonly<ChannelFlagsBitField>>(newsChannel.flags);
expectType<Readonly<ChannelFlagsBitField>>(categoryChannel.flags);
expectType<Readonly<ChannelFlagsBitField>>(threadChannel.flags);

expectType<null>(partialGroupDMChannel.flags);

// Select menu type narrowing
if (interaction.isAnySelectMenu()) {
  expectType<AnySelectMenuInteraction>(interaction);
}

declare const anySelectMenu: AnySelectMenuInteraction;

if (anySelectMenu.isStringSelectMenu()) {
  expectType<StringSelectMenuInteraction>(anySelectMenu);
} else if (anySelectMenu.isUserSelectMenu()) {
  expectType<UserSelectMenuInteraction>(anySelectMenu);
} else if (anySelectMenu.isRoleSelectMenu()) {
  expectType<RoleSelectMenuInteraction>(anySelectMenu);
} else if (anySelectMenu.isChannelSelectMenu()) {
  expectType<ChannelSelectMenuInteraction>(anySelectMenu);
} else if (anySelectMenu.isMentionableSelectMenu()) {
  expectType<MentionableSelectMenuInteraction>(anySelectMenu);
}

client.on('guildAuditLogEntryCreate', (auditLogEntry, guild) => {
  expectType<GuildAuditLogsEntry>(auditLogEntry);
  expectType<Guild>(guild);
});

expectType<Readonly<GuildMemberFlagsBitField>>(guildMember.flags);

declare const emojiResolvable: GuildEmoji | Emoji | string;

{
  const onboarding = await guild.fetchOnboarding();
  expectType<GuildOnboarding>(onboarding);

  expectType<GuildOnboarding>(await guild.editOnboarding(onboarding));

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
expectType<true>(partialDMChannel.partial);
expectType<undefined>(partialDMChannel.lastMessageId);

declare const partialGuildMember: PartialGuildMember;
expectType<true>(partialGuildMember.partial);
expectType<null>(partialGuildMember.joinedAt);
expectType<null>(partialGuildMember.joinedTimestamp);
expectType<null>(partialGuildMember.pending);

declare const partialMessage: PartialMessage;
expectType<true>(partialMessage.partial);
expectType<null>(partialMessage.type);
expectType<null>(partialMessage.system);
expectType<null>(partialMessage.pinned);
expectType<null>(partialMessage.tts);
expectAssignable<null | Message['content']>(partialMessage.content);
expectAssignable<null | Message['cleanContent']>(partialMessage.cleanContent);
expectAssignable<null | Message['author']>(partialMessage.author);

declare const partialMessageReaction: PartialMessageReaction;
expectType<true>(partialMessageReaction.partial);
expectType<null>(partialMessageReaction.count);

declare const partialThreadMember: PartialThreadMember;
expectType<true>(partialThreadMember.partial);
expectType<null>(partialThreadMember.flags);
expectType<null>(partialThreadMember.joinedAt);
expectType<null>(partialThreadMember.joinedTimestamp);

declare const partialUser: PartialUser;
expectType<true>(partialUser.partial);
expectType<null>(partialUser.username);
expectType<null>(partialUser.tag);
expectType<null>(partialUser.discriminator);

declare const emoji: Emoji;
{
  expectType<PartialEmojiOnlyId>(resolvePartialEmoji('12345678901234567'));
  expectType<PartialEmoji | null>(resolvePartialEmoji(emoji));
}

declare const application: ClientApplication;
declare const entitlement: Entitlement;
declare const sku: SKU;
{
  expectType<Collection<Snowflake, SKU>>(await application.fetchSKUs());
  expectType<Collection<Snowflake, Entitlement>>(await application.entitlements.fetch());

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

  expectType<boolean>(entitlement.isActive());

  if (entitlement.isUserSubscription()) {
    expectType<Snowflake>(entitlement.userId);
    expectType<User>(await entitlement.fetchUser());
    expectType<null>(entitlement.guildId);
    expectType<null>(entitlement.guild);

    await application.entitlements.deleteTest(entitlement);
  } else if (entitlement.isGuildSubscription()) {
    expectType<Snowflake>(entitlement.guildId);
    expectType<Guild>(entitlement.guild);

    await application.entitlements.deleteTest(entitlement);
  }

  if (entitlement.isTest()) {
    expectType<null>(entitlement.startsTimestamp);
    expectType<null>(entitlement.endsTimestamp);
    expectType<null>(entitlement.startsAt);
    expectType<null>(entitlement.endsAt);
  }

  client.on(Events.InteractionCreate, async interaction => {
    expectType<Collection<Snowflake, Entitlement>>(interaction.entitlements);

    if (interaction.isRepliable()) {
      await interaction.sendPremiumRequired();
    }
  });
}

await textChannel.send({
  poll: {
    question: {
      text: 'Question',
    },
    duration: 60,
    answers: [{ text: 'Answer 1' }, { text: 'Answer 2', emoji: '<:1blade:874989932983238726>' }],
    allowMultiselect: false,
  },
});

declare const poll: Poll;
declare const message: Message;
declare const pollData: PollData;
{
  expectType<Message>(await poll.end());

  const answer = poll.answers.first()!;
  expectType<number>(answer.voteCount);

  expectType<Collection<Snowflake, User>>(await answer.fetchVoters({ after: snowflake, limit: 10 }));

  await messageManager.endPoll(snowflake);
  await messageManager.fetchPollAnswerVoters({
    messageId: snowflake,
    answerId: 1,
  });

  await message.edit({
    // @ts-expect-error
    poll: pollData,
  });

  await chatInputInteraction.editReply({ poll: pollData });
}

expectType<Collection<Snowflake, StickerPack>>(await client.fetchStickerPacks());
expectType<Collection<Snowflake, StickerPack>>(await client.fetchStickerPacks({}));
expectType<StickerPack>(await client.fetchStickerPacks({ packId: snowflake }));

client.on('interactionCreate', interaction => {
  if (!interaction.channel) {
    return;
  }

  // @ts-expect-error
  interaction.channel.send();

  if (interaction.channel.isSendable()) {
    expectType<SendableChannels>(interaction.channel);
    interaction.channel.send({ embeds: [] });
  }
});
