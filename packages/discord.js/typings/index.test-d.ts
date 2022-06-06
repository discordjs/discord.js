import type { ChildProcess } from 'child_process';
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
  SelectMenuInteraction,
  Serialized,
  ShardClientUtil,
  ShardingManager,
  Snowflake,
  StageChannel,
  TextBasedChannelFields,
  TextBasedChannel,
  TextBasedChannelTypes,
  VoiceBasedChannel,
  GuildBasedChannel,
  NonThreadGuildBasedChannel,
  GuildTextBasedChannel,
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
  StageInstance,
  PartialDMChannel,
  ActionRowBuilder,
  ButtonComponent,
  SelectMenuComponent,
  InteractionResponseFields,
  ThreadChannelType,
  Events,
  ShardEvents,
  Status,
  CategoryChannelChildManager,
  ActionRowData,
  MessageActionRowComponentData,
  PartialThreadMember,
  ThreadMemberFlagsBitField,
  ButtonBuilder,
  EmbedBuilder,
  MessageActionRowComponent,
  SelectMenuBuilder,
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
} from '.';
import { expectAssignable, expectDeprecated, expectNotAssignable, expectNotType, expectType } from 'tsd';
import { UnsafeButtonBuilder, UnsafeEmbedBuilder, UnsafeSelectMenuBuilder } from '@discordjs/builders';

// Test type transformation:
declare const serialize: <T>(value: T) => Serialized<T>;
declare const notPropertyOf: <T, P extends PropertyKey>(value: T, property: P & Exclude<P, keyof T>) => void;

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
  }),
});

const testGuildId = '222078108977594368'; // DJS
const testUserId = '987654321098765432'; // example id
const globalCommandId = '123456789012345678'; // example id
const guildCommandId = '234567890123456789'; // example id

client.on('ready', async () => {
  console.log(`Client is logged in as ${client.user!.tag} and ready!`);

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

  // @ts-expect-error
  await client.guilds.cache.get(testGuildId)?.commands.fetch(guildCommandId, { guildId: testGuildId });

  // Test command permissions
  const globalPermissionsManager = client.application?.commands.permissions;
  const guildPermissionsManager = client.guilds.cache.get(testGuildId)?.commands.permissions;
  const originalPermissions = await client.application?.commands.permissions.fetch({ guild: testGuildId });

  // Permissions from global manager
  await globalPermissionsManager?.add({
    command: globalCommandId,
    guild: testGuildId,
    permissions: [{ type: ApplicationCommandPermissionType.Role, id: testGuildId, permission: true }],
  });
  await globalPermissionsManager?.has({ command: globalCommandId, guild: testGuildId, permissionId: testGuildId });
  await globalPermissionsManager?.fetch({ guild: testGuildId });
  await globalPermissionsManager?.fetch({ command: globalCommandId, guild: testGuildId });
  await globalPermissionsManager?.remove({ command: globalCommandId, guild: testGuildId, roles: [testGuildId] });
  await globalPermissionsManager?.remove({ command: globalCommandId, guild: testGuildId, users: [testUserId] });
  await globalPermissionsManager?.remove({
    command: globalCommandId,
    guild: testGuildId,
    roles: [testGuildId],
    users: [testUserId],
  });
  await globalPermissionsManager?.set({
    command: globalCommandId,
    guild: testGuildId,
    permissions: [{ type: ApplicationCommandPermissionType.Role, id: testGuildId, permission: true }],
  });
  await globalPermissionsManager?.set({
    guild: testGuildId,
    fullPermissions: [
      {
        id: globalCommandId,
        permissions: [{ type: ApplicationCommandPermissionType.Role, id: testGuildId, permission: true }],
      },
    ],
  });

  // @ts-expect-error
  await globalPermissionsManager?.add({
    command: globalCommandId,
    permissions: [{ type: ApplicationCommandPermissionType.Role, id: testGuildId, permission: true }],
  });
  // @ts-expect-error
  await globalPermissionsManager?.has({ command: globalCommandId, permissionId: testGuildId });
  // @ts-expect-error
  await globalPermissionsManager?.fetch();
  // @ts-expect-error
  await globalPermissionsManager?.fetch({ command: globalCommandId });
  // @ts-expect-error
  await globalPermissionsManager?.remove({ command: globalCommandId, roles: [testGuildId] });
  // @ts-expect-error
  await globalPermissionsManager?.remove({ command: globalCommandId, users: [testUserId] });
  // @ts-expect-error
  await globalPermissionsManager?.remove({ command: globalCommandId, roles: [testGuildId], users: [testUserId] });
  // @ts-expect-error
  await globalPermissionsManager?.set({
    command: globalCommandId,
    permissions: [{ type: 'Role', id: testGuildId, permission: true }],
  });
  // @ts-expect-error
  await globalPermissionsManager?.set({
    fullPermissions: [{ id: globalCommandId, permissions: [{ type: 'Role', id: testGuildId, permission: true }] }],
  });
  // @ts-expect-error
  await globalPermissionsManager?.set({
    command: globalCommandId,
    guild: testGuildId,
    fullPermissions: [{ id: globalCommandId, permissions: [{ type: 'Role', id: testGuildId, permission: true }] }],
  });

  // @ts-expect-error
  await globalPermissionsManager?.add({
    guild: testGuildId,
    permissions: [{ type: ApplicationCommandPermissionType.Role, id: testGuildId, permission: true }],
  });
  // @ts-expect-error
  await globalPermissionsManager?.has({ guild: testGuildId, permissionId: testGuildId });
  // @ts-expect-error
  await globalPermissionsManager?.remove({ guild: testGuildId, roles: [testGuildId] });
  // @ts-expect-error
  await globalPermissionsManager?.remove({ guild: testGuildId, users: [testUserId] });
  // @ts-expect-error
  await globalPermissionsManager?.remove({ guild: testGuildId, roles: [testGuildId], users: [testUserId] });
  // @ts-expect-error
  await globalPermissionsManager?.set({
    guild: testGuildId,
    permissions: [{ type: ApplicationCommandPermissionType.Role, id: testGuildId, permission: true }],
  });

  // Permissions from guild manager
  await guildPermissionsManager?.add({
    command: globalCommandId,
    permissions: [{ type: ApplicationCommandPermissionType.Role, id: testGuildId, permission: true }],
  });
  await guildPermissionsManager?.has({ command: globalCommandId, permissionId: testGuildId });
  await guildPermissionsManager?.fetch({});
  await guildPermissionsManager?.fetch({ command: globalCommandId });
  await guildPermissionsManager?.remove({ command: globalCommandId, roles: [testGuildId] });
  await guildPermissionsManager?.remove({ command: globalCommandId, users: [testUserId] });
  await guildPermissionsManager?.remove({ command: globalCommandId, roles: [testGuildId], users: [testUserId] });
  await guildPermissionsManager?.set({
    command: globalCommandId,
    permissions: [{ type: ApplicationCommandPermissionType.Role, id: testGuildId, permission: true }],
  });
  await guildPermissionsManager?.set({
    fullPermissions: [
      {
        id: globalCommandId,
        permissions: [{ type: ApplicationCommandPermissionType.Role, id: testGuildId, permission: true }],
      },
    ],
  });

  await guildPermissionsManager?.add({
    command: globalCommandId,
    // @ts-expect-error
    guild: testGuildId,
    permissions: [{ type: ApplicationCommandPermissionType.Role, id: testGuildId, permission: true }],
  });
  // @ts-expect-error
  await guildPermissionsManager?.has({ command: globalCommandId, guild: testGuildId, permissionId: testGuildId });
  // @ts-expect-error
  await guildPermissionsManager?.fetch({ guild: testGuildId });
  // @ts-expect-error
  await guildPermissionsManager?.fetch({ command: globalCommandId, guild: testGuildId });
  // @ts-expect-error
  await guildPermissionsManager?.remove({ command: globalCommandId, guild: testGuildId, roles: [testGuildId] });
  // @ts-expect-error
  await guildPermissionsManager?.remove({ command: globalCommandId, guild: testGuildId, users: [testUserId] });
  await guildPermissionsManager?.remove({
    command: globalCommandId,
    // @ts-expect-error
    guild: testGuildId,
    roles: [testGuildId],
    users: [testUserId],
  });
  // @ts-expect-error
  await guildPermissionsManager?.set({
    command: globalCommandId,
    guild: testGuildId,
    permissions: [{ type: 'Role', id: testGuildId, permission: true }],
  });
  await guildPermissionsManager?.set({
    // @ts-expect-error
    guild: testGuildId,
    fullPermissions: [
      {
        id: globalCommandId,
        permissions: [{ type: ApplicationCommandPermissionType.Role, id: testGuildId, permission: true }],
      },
    ],
  });

  // @ts-expect-error
  await guildPermissionsManager?.add({
    permissions: [{ type: ApplicationCommandPermissionType.Role, id: testGuildId, permission: true }],
  });
  // @ts-expect-error
  await guildPermissionsManager?.has({ permissionId: testGuildId });
  // @ts-expect-error
  await guildPermissionsManager?.remove({ roles: [testGuildId] });
  // @ts-expect-error
  await guildPermissionsManager?.remove({ users: [testUserId] });
  // @ts-expect-error
  await guildPermissionsManager?.remove({ roles: [testGuildId], users: [testUserId] });
  // @ts-expect-error
  await guildPermissionsManager?.set({
    permissions: [{ type: ApplicationCommandPermissionType.Role, id: testGuildId, permission: true }],
  });
  // @ts-expect-error
  await guildPermissionsManager?.set({
    command: globalCommandId,
    fullPermissions: [
      {
        id: globalCommandId,
        permissions: [{ type: ApplicationCommandPermissionType.Role, id: testGuildId, permission: true }],
      },
    ],
  });

  // Permissions from cached global ApplicationCommand
  await globalCommand?.permissions.add({
    guild: testGuildId,
    permissions: [{ type: ApplicationCommandPermissionType.Role, id: testGuildId, permission: true }],
  });
  await globalCommand?.permissions.has({ guild: testGuildId, permissionId: testGuildId });
  await globalCommand?.permissions.fetch({ guild: testGuildId });
  await globalCommand?.permissions.remove({ guild: testGuildId, roles: [testGuildId] });
  await globalCommand?.permissions.remove({ guild: testGuildId, users: [testUserId] });
  await globalCommand?.permissions.remove({ guild: testGuildId, roles: [testGuildId], users: [testUserId] });
  await globalCommand?.permissions.set({
    guild: testGuildId,
    permissions: [{ type: ApplicationCommandPermissionType.Role, id: testGuildId, permission: true }],
  });

  await globalCommand?.permissions.add({
    // @ts-expect-error
    command: globalCommandId,
    guild: testGuildId,
    permissions: [{ type: ApplicationCommandPermissionType.Role, id: testGuildId, permission: true }],
  });
  // @ts-expect-error
  await globalCommand?.permissions.has({ command: globalCommandId, guild: testGuildId, permissionId: testGuildId });
  // @ts-expect-error
  await globalCommand?.permissions.fetch({ command: globalCommandId, guild: testGuildId });
  // @ts-expect-error
  await globalCommand?.permissions.remove({ command: globalCommandId, guild: testGuildId, roles: [testGuildId] });
  // @ts-expect-error
  await globalCommand?.permissions.remove({ command: globalCommandId, guild: testGuildId, users: [testUserId] });
  await globalCommand?.permissions.remove({
    // @ts-expect-error
    command: globalCommandId,
    guild: testGuildId,
    roles: [testGuildId],
    users: [testUserId],
  });
  await globalCommand?.permissions.set({
    // @ts-expect-error
    command: globalCommandId,
    guild: testGuildId,
    permissions: [{ type: ApplicationCommandPermissionType.Role, id: testGuildId, permission: true }],
  });

  // @ts-expect-error
  await globalCommand?.permissions.add({
    permissions: [{ type: ApplicationCommandPermissionType.Role, id: testGuildId, permission: true }],
  });
  // @ts-expect-error
  await globalCommand?.permissions.has({ permissionId: testGuildId });
  // @ts-expect-error
  await globalCommand?.permissions.fetch({});
  // @ts-expect-error
  await globalCommand?.permissions.remove({ roles: [testGuildId] });
  // @ts-expect-error
  await globalCommand?.permissions.remove({ users: [testUserId] });
  // @ts-expect-error
  await globalCommand?.permissions.remove({ roles: [testGuildId], users: [testUserId] });
  // @ts-expect-error
  await globalCommand?.permissions.set({
    permissions: [{ type: ApplicationCommandPermissionType.Role, id: testGuildId, permission: true }],
  });

  // Permissions from cached guild ApplicationCommand
  await guildCommandFromGlobal?.permissions.add({
    permissions: [{ type: ApplicationCommandPermissionType.Role, id: testGuildId, permission: true }],
  });
  await guildCommandFromGlobal?.permissions.has({ permissionId: testGuildId });
  await guildCommandFromGlobal?.permissions.fetch({});
  await guildCommandFromGlobal?.permissions.remove({ roles: [testGuildId] });
  await guildCommandFromGlobal?.permissions.remove({ users: [testUserId] });
  await guildCommandFromGlobal?.permissions.remove({ roles: [testGuildId], users: [testUserId] });
  await guildCommandFromGlobal?.permissions.set({
    permissions: [{ type: ApplicationCommandPermissionType.Role, id: testGuildId, permission: true }],
  });

  await guildCommandFromGlobal?.permissions.add({
    // @ts-expect-error
    command: globalCommandId,
    permissions: [{ type: ApplicationCommandPermissionType.Role, id: testGuildId, permission: true }],
  });
  // @ts-expect-error
  await guildCommandFromGlobal?.permissions.has({ command: guildCommandId, permissionId: testGuildId });
  // @ts-expect-error
  await guildCommandFromGlobal?.permissions.remove({ command: guildCommandId, roles: [testGuildId] });
  // @ts-expect-error
  await guildCommandFromGlobal?.permissions.remove({ command: guildCommandId, users: [testUserId] });
  await guildCommandFromGlobal?.permissions.remove({
    // @ts-expect-error
    command: guildCommandId,
    roles: [testGuildId],
    users: [testUserId],
  });
  await guildCommandFromGlobal?.permissions.set({
    // @ts-expect-error
    command: guildCommandId,
    permissions: [{ type: ApplicationCommandPermissionType.Role, id: testGuildId, permission: true }],
  });

  await guildCommandFromGlobal?.permissions.add({
    // @ts-expect-error
    guild: testGuildId,
    permissions: [{ type: ApplicationCommandPermissionType.Role, id: testGuildId, permission: true }],
  });
  // @ts-expect-error
  await guildCommandFromGlobal?.permissions.has({ guild: testGuildId, permissionId: testGuildId });
  // @ts-expect-error
  await guildCommandFromGlobal?.permissions.remove({ guild: testGuildId, roles: [testGuildId] });
  // @ts-expect-error
  await guildCommandFromGlobal?.permissions.remove({ guild: testGuildId, users: [testUserId] });
  // @ts-expect-error
  await guildCommandFromGlobal?.permissions.remove({ guild: testGuildId, roles: [testGuildId], users: [testUserId] });
  await guildCommandFromGlobal?.permissions.set({
    // @ts-expect-error
    guild: testGuildId,
    permissions: [{ type: ApplicationCommandPermissionType.Role, id: testGuildId, permission: true }],
  });

  await guildCommandFromGuild?.permissions.add({
    permissions: [{ type: ApplicationCommandPermissionType.Role, id: testGuildId, permission: true }],
  });
  await guildCommandFromGuild?.permissions.has({ permissionId: testGuildId });
  await guildCommandFromGuild?.permissions.fetch({});
  await guildCommandFromGuild?.permissions.remove({ roles: [testGuildId] });
  await guildCommandFromGuild?.permissions.remove({ users: [testUserId] });
  await guildCommandFromGuild?.permissions.remove({ roles: [testGuildId], users: [testUserId] });
  await guildCommandFromGuild?.permissions.set({
    permissions: [{ type: ApplicationCommandPermissionType.Role, id: testGuildId, permission: true }],
  });

  await guildCommandFromGuild?.permissions.add({
    // @ts-expect-error
    command: globalCommandId,
    permissions: [{ type: ApplicationCommandPermissionType.Role, id: testGuildId, permission: true }],
  });
  // @ts-expect-error
  await guildCommandFromGuild?.permissions.has({ command: guildCommandId, permissionId: testGuildId });
  // @ts-expect-error
  await guildCommandFromGuild?.permissions.remove({ command: guildCommandId, roles: [testGuildId] });
  // @ts-expect-error
  await guildCommandFromGuild?.permissions.remove({ command: guildCommandId, users: [testUserId] });
  await guildCommandFromGuild?.permissions.remove({
    // @ts-expect-error
    command: guildCommandId,
    roles: [testGuildId],
    users: [testUserId],
  });
  await guildCommandFromGuild?.permissions.set({
    // @ts-expect-error
    command: guildCommandId,
    permissions: [{ type: ApplicationCommandPermissionType.Role, id: testGuildId, permission: true }],
  });

  await guildCommandFromGuild?.permissions.add({
    // @ts-expect-error
    guild: testGuildId,
    permissions: [{ type: ApplicationCommandPermissionType.Role, id: testGuildId, permission: true }],
  });
  // @ts-expect-error
  await guildCommandFromGuild?.permissions.has({ guild: testGuildId, permissionId: testGuildId });
  // @ts-expect-error
  await guildCommandFromGuild?.permissions.remove({ guild: testGuildId, roles: [testGuildId] });
  // @ts-expect-error
  await guildCommandFromGuild?.permissions.remove({ guild: testGuildId, users: [testUserId] });
  // @ts-expect-error
  await guildCommandFromGuild?.permissions.remove({ guild: testGuildId, roles: [testGuildId], users: [testUserId] });
  await guildCommandFromGuild?.permissions.set({
    // @ts-expect-error
    guild: testGuildId,
    permissions: [{ type: ApplicationCommandPermissionType.Role, id: testGuildId, permission: true }],
  });

  client.application?.commands.permissions.set({
    guild: testGuildId,
    fullPermissions: originalPermissions?.map((permissions, id) => ({ permissions, id })) ?? [],
  });
});

client.on('guildCreate', async g => {
  const channel = g.channels.cache.random();
  if (!channel) return;

  if (channel.type === ChannelType.GuildText) {
    const row: ActionRowData<MessageActionRowComponentData> = {
      type: ComponentType.ActionRow,
      components: [
        new ButtonBuilder(),
        { type: ComponentType.Button, style: ButtonStyle.Primary, label: 'string', customId: 'foo' },
        { type: ComponentType.Button, style: ButtonStyle.Link, label: 'test', url: 'test' },
        { type: ComponentType.SelectMenu, customId: 'foo' },
        new SelectMenuBuilder(),
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
        { type: ComponentType.SelectMenu, customId: 'foo' },
      ],
    });

    channel.send({ components: [row, row2] });
  }

  if (channel.isThread()) {
    const fetchedMember = await channel.members.fetch({ member: '12345678' });
    expectType<ThreadMember>(fetchedMember);
    const fetchedMemberCol = await channel.members.fetch(true);
    expectDeprecated(await channel.members.fetch(true));
    expectType<Collection<Snowflake, ThreadMember>>(fetchedMemberCol);
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

client.on('messageReactionRemoveAll', async message => {
  console.log(`messageReactionRemoveAll - id: ${message.id} (${message.id.length})`);

  if (message.partial) message = await message.fetch();

  console.log(`messageReactionRemoveAll - content: ${message.content}`);
});

// This is to check that stuff is the right type
declare const assertIsMessage: (m: Promise<Message>) => void;

client.on('messageCreate', async message => {
  const { channel } = message;
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
      ) => boolean | Promise<boolean>
    >(buttonCollector.filter);
    expectType<GuildTextBasedChannel>(message.channel);
    expectType<Guild>(message.guild);
    expectType<GuildMember | null>(message.member);
  }

  expectType<TextBasedChannel>(message.channel);
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
  const selectMenuCollector = message.createMessageComponentCollector({ componentType: ComponentType.SelectMenu });
  expectAssignable<Promise<SelectMenuInteraction>>(
    message.awaitMessageComponent({ componentType: ComponentType.SelectMenu }),
  );
  expectAssignable<Promise<SelectMenuInteraction>>(
    channel.awaitMessageComponent({ componentType: ComponentType.SelectMenu }),
  );
  expectAssignable<InteractionCollector<SelectMenuInteraction>>(selectMenuCollector);

  // Verify that message component interactions are default collected types.
  const defaultCollector = message.createMessageComponentCollector();
  expectAssignable<Promise<MessageComponentInteraction>>(message.awaitMessageComponent());
  expectAssignable<Promise<MessageComponentInteraction>>(channel.awaitMessageComponent());
  expectAssignable<InteractionCollector<MessageComponentInteraction>>(defaultCollector);

  // Verify that additional options don't affect default collector types.
  const semiDefaultCollector = message.createMessageComponentCollector({ time: 10000 });
  expectType<InteractionCollector<MessageComponentInteraction>>(semiDefaultCollector);
  const semiDefaultCollectorChannel = message.createMessageComponentCollector({ time: 10000 });
  expectType<InteractionCollector<MessageComponentInteraction>>(semiDefaultCollectorChannel);

  // Verify that interaction collector options can't be used.
  message.createMessageComponentCollector({
    // @ts-expect-error
    interactionType: InteractionType.ApplicationCommand,
  });

  // Make sure filter parameters are properly inferred.
  message.createMessageComponentCollector({
    filter: i => {
      expectType<MessageComponentInteraction>(i);
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
    componentType: ComponentType.SelectMenu,
    filter: i => {
      expectType<SelectMenuInteraction>(i);
      return true;
    },
  });

  message.awaitMessageComponent({
    filter: i => {
      expectType<MessageComponentInteraction>(i);
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
    componentType: ComponentType.SelectMenu,
    filter: i => {
      expectType<SelectMenuInteraction>(i);
      return true;
    },
  });

  const webhook = await message.fetchWebhook();

  if (webhook.isChannelFollower()) {
    expectAssignable<Guild | APIPartialGuild>(webhook.sourceGuild);
    expectAssignable<NewsChannel | APIPartialChannel>(webhook.sourceChannel);
  } else if (webhook.isIncoming()) {
    expectType<string>(webhook.token);
  }

  expectNotType<Guild | APIPartialGuild>(webhook.sourceGuild);
  expectNotType<NewsChannel | APIPartialChannel>(webhook.sourceChannel);
  expectNotType<string>(webhook.token);

  channel.awaitMessageComponent({
    filter: i => {
      expectType<MessageComponentInteraction<'cached'>>(i);
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
    componentType: ComponentType.SelectMenu,
    filter: i => {
      expectType<SelectMenuInteraction<'cached'>>(i);
      return true;
    },
  });

  // Check that both builders and builder data can be sent in messages
  const row = new ActionRowBuilder<MessageActionRowComponentBuilder>();
  const buttonsRow: ActionRowData<MessageActionRowComponentData> = {
    type: ComponentType.ActionRow,
    components: [
      new ButtonBuilder(),
      new UnsafeButtonBuilder(),
      { type: ComponentType.Button, label: 'test', style: ButtonStyle.Primary, customId: 'test' },
      {
        type: ComponentType.Button,
        label: 'another test',
        style: ButtonStyle.Link,
        url: 'https://discord.js.org',
      },
    ],
  };
  const selectsRow: ActionRowData<MessageActionRowComponentData> = {
    type: ComponentType.ActionRow,
    components: [
      new SelectMenuBuilder(),
      new UnsafeSelectMenuBuilder(),
      {
        type: ComponentType.SelectMenu,
        label: 'select menu',
        options: [{ label: 'test', value: 'test' }],
        customId: 'test',
      },
    ],
  };

  const buildersEmbed = new UnsafeEmbedBuilder();
  const embedData = { description: 'test', color: 0xff0000 };
  channel.send({ components: [row, buttonsRow, selectsRow], embeds: [embed, buildersEmbed, embedData] });
});

client.on('threadMembersUpdate', (addedMembers, removedMembers, thread) => {
  expectType<Collection<Snowflake, ThreadMember>>(addedMembers);
  expectType<Collection<Snowflake, ThreadMember | PartialThreadMember>>(removedMembers);
  expectType<ThreadChannel>(thread);
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

client.on('interactionCreate', async interaction => {
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
});

client.login('absolutely-valid-token');

// Test client conditional types
client.on('ready', client => {
  expectType<Client<true>>(client);
});

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
declare const newsChannel: NewsChannel;
declare const textChannel: TextChannel;
declare const voiceChannel: VoiceChannel;
declare const guild: Guild;
declare const user: User;
declare const guildMember: GuildMember;

// Test whether the structures implement send
expectType<TextBasedChannelFields['send']>(dmChannel.send);
expectType<TextBasedChannelFields['send']>(threadChannel.send);
expectType<TextBasedChannelFields['send']>(newsChannel.send);
expectType<TextBasedChannelFields['send']>(textChannel.send);
expectType<TextBasedChannelFields['send']>(voiceChannel.send);
expectAssignable<PartialTextBasedChannelFields>(user);
expectAssignable<PartialTextBasedChannelFields>(guildMember);

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
expectAssignable<'close'>(ShardEvents.Close);
expectAssignable<1>(Status.Connecting);

declare const applicationCommandData: ApplicationCommandData;
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
    applicationCommandManager.set([applicationCommandData], '0'),
  );
}

declare const applicationNonChoiceOptionData: ApplicationCommandOptionData & {
  type: CommandOptionNonChoiceResolvableType;
};
{
  // Options aren't allowed on this command type.

  // @ts-expect-error
  applicationNonChoiceOptionData.choices;
}

declare const applicationSubGroupCommandData: ApplicationCommandSubGroupData;
{
  expectType<ApplicationCommandOptionType.SubcommandGroup>(applicationSubGroupCommandData.type);
  expectType<ApplicationCommandSubCommandData[] | undefined>(applicationSubGroupCommandData.options);
}

declare const guildApplicationCommandManager: GuildApplicationCommandManager;
expectType<Promise<Collection<Snowflake, ApplicationCommand>>>(guildApplicationCommandManager.fetch());
expectType<Promise<Collection<Snowflake, ApplicationCommand>>>(guildApplicationCommandManager.fetch(undefined, {}));
expectType<Promise<ApplicationCommand>>(guildApplicationCommandManager.fetch('0'));

declare const categoryChannelChildManager: CategoryChannelChildManager;
{
  expectType<Promise<VoiceChannel>>(categoryChannelChildManager.create('name', { type: ChannelType.GuildVoice }));
  expectType<Promise<TextChannel>>(categoryChannelChildManager.create('name', { type: ChannelType.GuildText }));
  expectType<Promise<NewsChannel>>(categoryChannelChildManager.create('name', { type: ChannelType.GuildNews }));
  expectType<Promise<StageChannel>>(categoryChannelChildManager.create('name', { type: ChannelType.GuildStageVoice }));
  expectType<Promise<TextChannel>>(categoryChannelChildManager.create('name', {}));
  expectType<Promise<TextChannel>>(categoryChannelChildManager.create('name'));
}

declare const guildChannelManager: GuildChannelManager;
{
  type AnyChannel = TextChannel | VoiceChannel | CategoryChannel | NewsChannel | StageChannel;

  expectType<Promise<TextChannel>>(guildChannelManager.create('name'));
  expectType<Promise<TextChannel>>(guildChannelManager.create('name', {}));
  expectType<Promise<VoiceChannel>>(guildChannelManager.create('name', { type: ChannelType.GuildVoice }));
  expectType<Promise<CategoryChannel>>(guildChannelManager.create('name', { type: ChannelType.GuildCategory }));
  expectType<Promise<TextChannel>>(guildChannelManager.create('name', { type: ChannelType.GuildText }));
  expectType<Promise<NewsChannel>>(guildChannelManager.create('name', { type: ChannelType.GuildNews }));
  expectType<Promise<StageChannel>>(guildChannelManager.create('name', { type: ChannelType.GuildStageVoice }));

  expectType<Promise<Collection<Snowflake, AnyChannel>>>(guildChannelManager.fetch());
  expectType<Promise<Collection<Snowflake, AnyChannel>>>(guildChannelManager.fetch(undefined, {}));
  expectType<Promise<AnyChannel | null>>(guildChannelManager.fetch('0'));
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

// Test partials structures
client.on('guildMemberRemove', member => {
  if (member.partial) return expectType<null>(member.joinedAt);
  expectType<Date | null>(member.joinedAt);
});

client.on('messageReactionAdd', async reaction => {
  if (reaction.partial) {
    expectType<null>(reaction.count);
    reaction = await reaction.fetch();
  }
  expectType<number>(reaction.count);
  if (reaction.message.partial) return expectType<string | null>(reaction.message.content);
  expectType<string>(reaction.message.content);
});

// Test interactions
declare const interaction: Interaction;
declare const booleanValue: boolean;
if (interaction.inGuild()) {
  expectType<Snowflake>(interaction.guildId);
} else {
  expectType<Snowflake | null>(interaction.guildId);
}

client.on('interactionCreate', interaction => {
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

client.on('interactionCreate', async interaction => {
  if (interaction.type === InteractionType.MessageComponent) {
    expectType<MessageComponentInteraction>(interaction);
    expectType<MessageActionRowComponent | APIButtonComponent | APISelectMenuComponent>(interaction.component);
    expectType<Message>(interaction.message);
    if (interaction.inCachedGuild()) {
      expectAssignable<MessageComponentInteraction>(interaction);
      expectType<MessageActionRowComponent>(interaction.component);
      expectType<Message<true>>(interaction.message);
      expectType<Guild>(interaction.guild);
      expectAssignable<Promise<Message>>(interaction.reply({ fetchReply: true }));
    } else if (interaction.inRawGuild()) {
      expectAssignable<MessageComponentInteraction>(interaction);
      expectType<APIButtonComponent | APISelectMenuComponent>(interaction.component);
      expectType<Message<false>>(interaction.message);
      expectType<null>(interaction.guild);
      expectType<Promise<Message<false>>>(interaction.reply({ fetchReply: true }));
    } else if (interaction.inGuild()) {
      expectAssignable<MessageComponentInteraction>(interaction);
      expectType<MessageActionRowComponent | APIButtonComponent | APISelectMenuComponent>(interaction.component);
      expectType<Message>(interaction.message);
      expectType<Guild | null>(interaction.guild);
      expectType<Promise<Message>>(interaction.reply({ fetchReply: true }));
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
    expectType<ContextMenuCommandInteraction>(interaction);
    if (interaction.inCachedGuild()) {
      expectAssignable<ContextMenuCommandInteraction>(interaction);
      expectAssignable<Guild>(interaction.guild);
      expectAssignable<CommandInteraction<'cached'>>(interaction);
    } else if (interaction.inRawGuild()) {
      expectAssignable<ContextMenuCommandInteraction>(interaction);
      expectType<null>(interaction.guild);
    } else if (interaction.inGuild()) {
      expectAssignable<ContextMenuCommandInteraction>(interaction);
      expectType<Guild | null>(interaction.guild);
    }
  }

  if (
    interaction.type === InteractionType.ApplicationCommand &&
    interaction.commandType === ApplicationCommandType.Message
  ) {
    expectType<Message>(interaction.targetMessage);
    if (interaction.inCachedGuild()) {
      expectType<Message<true>>(interaction.targetMessage);
    } else if (interaction.inRawGuild()) {
      expectType<Message<false>>(interaction.targetMessage);
    } else if (interaction.inGuild()) {
      expectType<Message>(interaction.targetMessage);
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
      expectAssignable<Promise<Message>>(interaction.reply({ fetchReply: true }));
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

  if (interaction.type === InteractionType.MessageComponent && interaction.componentType === ComponentType.SelectMenu) {
    expectType<SelectMenuInteraction>(interaction);
    expectType<SelectMenuComponent | APISelectMenuComponent>(interaction.component);
    expectType<Message>(interaction.message);
    if (interaction.inCachedGuild()) {
      expectAssignable<SelectMenuInteraction>(interaction);
      expectType<SelectMenuComponent>(interaction.component);
      expectType<Message<true>>(interaction.message);
      expectType<Guild>(interaction.guild);
      expectType<Promise<Message<true>>>(interaction.reply({ fetchReply: true }));
    } else if (interaction.inRawGuild()) {
      expectAssignable<SelectMenuInteraction>(interaction);
      expectType<APISelectMenuComponent>(interaction.component);
      expectType<Message<false>>(interaction.message);
      expectType<null>(interaction.guild);
      expectType<Promise<Message<false>>>(interaction.reply({ fetchReply: true }));
    } else if (interaction.inGuild()) {
      expectAssignable<SelectMenuInteraction>(interaction);
      expectType<SelectMenuComponent | APISelectMenuComponent>(interaction.component);
      expectType<Message>(interaction.message);
      expectType<Guild | null>(interaction.guild);
      expectType<Promise<Message>>(interaction.reply({ fetchReply: true }));
    }
  }

  if (
    interaction.type === InteractionType.ApplicationCommand &&
    interaction.commandType === ApplicationCommandType.ChatInput
  ) {
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
    expectType<CommandInteractionOption[] | undefined>(requiredOption.options);

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
  }

  if (interaction.isRepliable()) {
    expectAssignable<InteractionResponseFields>(interaction);
    interaction.reply('test');
  }

  if (
    interaction.type === InteractionType.ApplicationCommand &&
    interaction.commandType === ApplicationCommandType.ChatInput &&
    interaction.isRepliable()
  ) {
    expectAssignable<CommandInteraction>(interaction);
    expectAssignable<InteractionResponseFields>(interaction);
  }
});

declare const shard: Shard;

shard.on('death', process => {
  expectType<ChildProcess>(process);
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
  expectType<Collection<string, Interaction>>(collection);
  expectType<string>(reason);
});

(async () => {
  for await (const value of collector) {
    expectType<[Interaction, ...string[]]>(value);
  }
})();

expectType<Promise<number | null>>(shard.eval(c => c.readyTimestamp));

// Test audit logs
expectType<Promise<GuildAuditLogs<AuditLogEvent.MemberKick>>>(guild.fetchAuditLogs({ type: AuditLogEvent.MemberKick }));

expectType<Promise<GuildAuditLogs<AuditLogEvent.ChannelCreate>>>(
  guild.fetchAuditLogs({ type: AuditLogEvent.ChannelCreate }),
);

expectType<Promise<GuildAuditLogs<AuditLogEvent.IntegrationUpdate>>>(
  guild.fetchAuditLogs({ type: AuditLogEvent.IntegrationUpdate }),
);

expectType<Promise<GuildAuditLogs<null>>>(guild.fetchAuditLogs({ type: null }));
expectType<Promise<GuildAuditLogs<null>>>(guild.fetchAuditLogs());

expectType<Promise<GuildAuditLogsEntry<AuditLogEvent.MemberKick, 'Delete', 'User'> | undefined>>(
  guild.fetchAuditLogs({ type: AuditLogEvent.MemberKick }).then(al => al.entries.first()),
);
expectAssignable<Promise<GuildAuditLogsEntry<AuditLogEvent.MemberKick, 'Delete', 'User'> | undefined>>(
  guild.fetchAuditLogs({ type: AuditLogEvent.MemberKick }).then(al => al.entries.first()),
);

expectType<Promise<GuildAuditLogsEntry<null, 'All', 'Unknown'> | undefined>>(
  guild.fetchAuditLogs({ type: null }).then(al => al.entries.first()),
);
expectType<Promise<GuildAuditLogsEntry<null, 'All', 'Unknown'> | undefined>>(
  guild.fetchAuditLogs().then(al => al.entries.first()),
);

expectType<Promise<null | undefined>>(
  guild.fetchAuditLogs({ type: AuditLogEvent.MemberKick }).then(al => al.entries.first()?.extra),
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

declare const TextBasedChannel: TextBasedChannel;
declare const TextBasedChannelTypes: TextBasedChannelTypes;
declare const VoiceBasedChannel: VoiceBasedChannel;
declare const GuildBasedChannel: GuildBasedChannel;
declare const NonThreadGuildBasedChannel: NonThreadGuildBasedChannel;
declare const GuildTextBasedChannel: GuildTextBasedChannel;

expectType<DMChannel | PartialDMChannel | NewsChannel | TextChannel | ThreadChannel | VoiceChannel>(TextBasedChannel);
expectType<ChannelType.GuildText | ChannelType.DM | ChannelType.GuildNews | ChannelType.GuildVoice | ThreadChannelType>(
  TextBasedChannelTypes,
);
expectType<StageChannel | VoiceChannel>(VoiceBasedChannel);
expectType<CategoryChannel | NewsChannel | StageChannel | TextChannel | ThreadChannel | VoiceChannel>(
  GuildBasedChannel,
);
expectType<CategoryChannel | NewsChannel | StageChannel | TextChannel | VoiceChannel>(NonThreadGuildBasedChannel);
expectType<NewsChannel | TextChannel | ThreadChannel | VoiceChannel>(GuildTextBasedChannel);

const button = new ButtonBuilder({
  label: 'test',
  style: ButtonStyle.Primary,
  customId: 'test',
});

const selectMenu = new SelectMenuBuilder({
  maxValues: 10,
  minValues: 2,
  customId: 'test',
});

new ActionRowBuilder({
  components: [selectMenu.toJSON(), button.toJSON()],
});

new SelectMenuBuilder({
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

declare const selectMenuData: APISelectMenuComponent;
SelectMenuBuilder.from(selectMenuData);

declare const selectMenuComp: SelectMenuComponent;
SelectMenuBuilder.from(selectMenuComp);

declare const buttonData: APIButtonComponent;
ButtonBuilder.from(buttonData);

declare const buttonComp: ButtonComponent;
ButtonBuilder.from(buttonComp);

declare const textInputData: APITextInputComponent;
TextInputBuilder.from(textInputData);

declare const textInputComp: TextInputComponent;
TextInputBuilder.from(textInputComp);

declare const embedData: APIEmbed;
EmbedBuilder.from(embedData);

declare const embedComp: Embed;
EmbedBuilder.from(embedComp);

declare const stageChannel: StageChannel;
declare const partialGroupDMChannel: PartialGroupDMChannel;

expectType<ChannelMention>(textChannel.toString());
expectType<ChannelMention>(voiceChannel.toString());
expectType<ChannelMention>(newsChannel.toString());
expectType<ChannelMention>(threadChannel.toString());
expectType<ChannelMention>(stageChannel.toString());
expectType<ChannelMention>(partialGroupDMChannel.toString());
expectType<UserMention>(dmChannel.toString());
expectType<UserMention>(user.toString());
expectType<UserMention>(guildMember.toString());
