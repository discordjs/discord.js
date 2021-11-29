import {
  APIInteractionGuildMember,
  APIMessage,
  APIPartialChannel,
  APIPartialGuild,
  APIInteractionDataResolvedGuildMember,
  APIInteractionDataResolvedChannel,
  APIRole,
  ChannelType,
  ApplicationCommandOptionType,
  APIApplicationCommand,
  APIApplicationCommandOption,
  APIApplicationCommandSubCommandOptions,
} from 'discord-api-types/v9';
import type { ChildProcess } from 'node:child_process';
import {
  ApplicationCommand,
  ApplicationCommandChannelOptionData,
  ApplicationCommandChoicesData,
  ApplicationCommandManager,
  ApplicationCommandNonOptionsData,
  ApplicationCommandResolvable,
  ApplicationCommandSubCommandData,
  BaseCommandInteraction,
  ButtonInteraction,
  CacheType,
  CategoryChannel,
  Client,
  ClientApplication,
  ClientUser,
  CloseEvent,
  Collection,
  CommandInteraction,
  CommandInteractionOption,
  CommandInteractionOptionResolver,
  Constants,
  ContextMenuInteraction,
  DMChannel,
  Guild,
  GuildApplicationCommandManager,
  GuildChannel,
  GuildChannelManager,
  GuildEmoji,
  GuildEmojiManager,
  GuildMember,
  GuildResolvable,
  GuildTextBasedChannel,
  Intents,
  Interaction,
  InteractionCollector,
  LimitedCollection,
  Message,
  MessageActionRow,
  MessageAttachment,
  MessageButton,
  MessageCollector,
  MessageComponentInteraction,
  MessageEmbed,
  MessageReaction,
  NewsChannel,
  Options,
  PartialTextBasedChannelFields,
  PartialUser,
  Permissions,
  ReactionCollector,
  Role,
  RoleManager,
  SelectMenuInteraction,
  Serialized,
  ShardClientUtil,
  ShardingManager,
  Snowflake,
  StageChannel,
  StoreChannel,
  TextBasedChannelFields,
  TextBasedChannels,
  TextChannel,
  ThreadChannel,
  ThreadMember,
  Typing,
  User,
  VoiceChannel,
  Shard,
  Camelize,
  ApplicationCommandAutocompleteOption,
  ApplicationCommandNumericOptionData,
  WebSocketShard,
  Collector,
} from '.';
import type { ApplicationCommandOptionTypes } from './enums';
import { expectAssignable, expectDeprecated, expectNotAssignable, expectNotType, expectType } from 'tsd';

// Test type transformation:
declare const serialize: <T>(value: T) => Serialized<T>;
declare const notPropertyOf: <T, P extends PropertyKey>(value: T, property: P & Exclude<P, keyof T>) => void;

const client: Client = new Client({
  intents: Intents.FLAGS.GUILDS,
  makeCache: Options.cacheWithLimits({
    MessageManager: 200,
    // @ts-expect-error
    Message: 100,
    ThreadManager: {
      maxSize: 1000,
      keepOverLimit: (x: ThreadChannel) => x.id === '123',
      sweepInterval: 5000,
      sweepFilter: LimitedCollection.filterByLifetime({
        getComparisonTimestamp: (x: ThreadChannel) => x.archiveTimestamp ?? 0,
        excludeFromSweep: (x: ThreadChannel) => !x.archived,
      }),
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
    permissions: [{ type: 'ROLE', id: testGuildId, permission: true }],
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
    permissions: [{ type: 'ROLE', id: testGuildId, permission: true }],
  });
  await globalPermissionsManager?.set({
    guild: testGuildId,
    fullPermissions: [{ id: globalCommandId, permissions: [{ type: 'ROLE', id: testGuildId, permission: true }] }],
  });

  // @ts-expect-error
  await globalPermissionsManager?.add({
    command: globalCommandId,
    permissions: [{ type: 'ROLE', id: testGuildId, permission: true }],
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
    permissions: [{ type: 'ROLE', id: testGuildId, permission: true }],
  });
  // @ts-expect-error
  await globalPermissionsManager?.set({
    fullPermissions: [{ id: globalCommandId, permissions: [{ type: 'ROLE', id: testGuildId, permission: true }] }],
  });
  // @ts-expect-error
  await globalPermissionsManager?.set({
    command: globalCommandId,
    guild: testGuildId,
    fullPermissions: [{ id: globalCommandId, permissions: [{ type: 'ROLE', id: testGuildId, permission: true }] }],
  });

  // @ts-expect-error
  await globalPermissionsManager?.add({
    guild: testGuildId,
    permissions: [{ type: 'ROLE', id: testGuildId, permission: true }],
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
    permissions: [{ type: 'ROLE', id: testGuildId, permission: true }],
  });

  // Permissions from guild manager
  await guildPermissionsManager?.add({
    command: globalCommandId,
    permissions: [{ type: 'ROLE', id: testGuildId, permission: true }],
  });
  await guildPermissionsManager?.has({ command: globalCommandId, permissionId: testGuildId });
  await guildPermissionsManager?.fetch({});
  await guildPermissionsManager?.fetch({ command: globalCommandId });
  await guildPermissionsManager?.remove({ command: globalCommandId, roles: [testGuildId] });
  await guildPermissionsManager?.remove({ command: globalCommandId, users: [testUserId] });
  await guildPermissionsManager?.remove({ command: globalCommandId, roles: [testGuildId], users: [testUserId] });
  await guildPermissionsManager?.set({
    command: globalCommandId,
    permissions: [{ type: 'ROLE', id: testGuildId, permission: true }],
  });
  await guildPermissionsManager?.set({
    fullPermissions: [{ id: globalCommandId, permissions: [{ type: 'ROLE', id: testGuildId, permission: true }] }],
  });

  await guildPermissionsManager?.add({
    command: globalCommandId,
    // @ts-expect-error
    guild: testGuildId,
    permissions: [{ type: 'ROLE', id: testGuildId, permission: true }],
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
    permissions: [{ type: 'ROLE', id: testGuildId, permission: true }],
  });
  await guildPermissionsManager?.set({
    // @ts-expect-error
    guild: testGuildId,
    fullPermissions: [{ id: globalCommandId, permissions: [{ type: 'ROLE', id: testGuildId, permission: true }] }],
  });

  // @ts-expect-error
  await guildPermissionsManager?.add({ permissions: [{ type: 'ROLE', id: testGuildId, permission: true }] });
  // @ts-expect-error
  await guildPermissionsManager?.has({ permissionId: testGuildId });
  // @ts-expect-error
  await guildPermissionsManager?.remove({ roles: [testGuildId] });
  // @ts-expect-error
  await guildPermissionsManager?.remove({ users: [testUserId] });
  // @ts-expect-error
  await guildPermissionsManager?.remove({ roles: [testGuildId], users: [testUserId] });
  // @ts-expect-error
  await guildPermissionsManager?.set({ permissions: [{ type: 'ROLE', id: testGuildId, permission: true }] });
  // @ts-expect-error
  await guildPermissionsManager?.set({
    command: globalCommandId,
    fullPermissions: [{ id: globalCommandId, permissions: [{ type: 'ROLE', id: testGuildId, permission: true }] }],
  });

  // Permissions from cached global ApplicationCommand
  await globalCommand?.permissions.add({
    guild: testGuildId,
    permissions: [{ type: 'ROLE', id: testGuildId, permission: true }],
  });
  await globalCommand?.permissions.has({ guild: testGuildId, permissionId: testGuildId });
  await globalCommand?.permissions.fetch({ guild: testGuildId });
  await globalCommand?.permissions.remove({ guild: testGuildId, roles: [testGuildId] });
  await globalCommand?.permissions.remove({ guild: testGuildId, users: [testUserId] });
  await globalCommand?.permissions.remove({ guild: testGuildId, roles: [testGuildId], users: [testUserId] });
  await globalCommand?.permissions.set({
    guild: testGuildId,
    permissions: [{ type: 'ROLE', id: testGuildId, permission: true }],
  });

  await globalCommand?.permissions.add({
    // @ts-expect-error
    command: globalCommandId,
    guild: testGuildId,
    permissions: [{ type: 'ROLE', id: testGuildId, permission: true }],
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
    permissions: [{ type: 'ROLE', id: testGuildId, permission: true }],
  });

  // @ts-expect-error
  await globalCommand?.permissions.add({ permissions: [{ type: 'ROLE', id: testGuildId, permission: true }] });
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
  await globalCommand?.permissions.set({ permissions: [{ type: 'ROLE', id: testGuildId, permission: true }] });

  // Permissions from cached guild ApplicationCommand
  await guildCommandFromGlobal?.permissions.add({ permissions: [{ type: 'ROLE', id: testGuildId, permission: true }] });
  await guildCommandFromGlobal?.permissions.has({ permissionId: testGuildId });
  await guildCommandFromGlobal?.permissions.fetch({});
  await guildCommandFromGlobal?.permissions.remove({ roles: [testGuildId] });
  await guildCommandFromGlobal?.permissions.remove({ users: [testUserId] });
  await guildCommandFromGlobal?.permissions.remove({ roles: [testGuildId], users: [testUserId] });
  await guildCommandFromGlobal?.permissions.set({ permissions: [{ type: 'ROLE', id: testGuildId, permission: true }] });

  await guildCommandFromGlobal?.permissions.add({
    // @ts-expect-error
    command: globalCommandId,
    permissions: [{ type: 'ROLE', id: testGuildId, permission: true }],
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
    permissions: [{ type: 'ROLE', id: testGuildId, permission: true }],
  });

  await guildCommandFromGlobal?.permissions.add({
    // @ts-expect-error
    guild: testGuildId,
    permissions: [{ type: 'ROLE', id: testGuildId, permission: true }],
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
    permissions: [{ type: 'ROLE', id: testGuildId, permission: true }],
  });

  await guildCommandFromGuild?.permissions.add({ permissions: [{ type: 'ROLE', id: testGuildId, permission: true }] });
  await guildCommandFromGuild?.permissions.has({ permissionId: testGuildId });
  await guildCommandFromGuild?.permissions.fetch({});
  await guildCommandFromGuild?.permissions.remove({ roles: [testGuildId] });
  await guildCommandFromGuild?.permissions.remove({ users: [testUserId] });
  await guildCommandFromGuild?.permissions.remove({ roles: [testGuildId], users: [testUserId] });
  await guildCommandFromGuild?.permissions.set({ permissions: [{ type: 'ROLE', id: testGuildId, permission: true }] });

  await guildCommandFromGuild?.permissions.add({
    // @ts-expect-error
    command: globalCommandId,
    permissions: [{ type: 'ROLE', id: testGuildId, permission: true }],
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
    permissions: [{ type: 'ROLE', id: testGuildId, permission: true }],
  });

  await guildCommandFromGuild?.permissions.add({
    // @ts-expect-error
    guild: testGuildId,
    permissions: [{ type: 'ROLE', id: testGuildId, permission: true }],
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
    permissions: [{ type: 'ROLE', id: testGuildId, permission: true }],
  });

  client.application?.commands.permissions.set({
    guild: testGuildId,
    fullPermissions: originalPermissions?.map((permissions, id) => ({ permissions, id })) ?? [],
  });
});

client.on('guildCreate', async g => {
  const channel = g.channels.cache.random();
  if (!channel) return;

  if (channel.isThread()) {
    const fetchedMember = await channel.members.fetch('12345678');
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

  const attachment = new MessageAttachment('file.png');
  const embed = new MessageEmbed();
  assertIsMessage(channel.send({ files: [attachment] }));
  assertIsMessage(channel.send({ embeds: [embed] }));
  assertIsMessage(channel.send({ embeds: [embed], files: [attachment] }));

  if (message.inGuild()) {
    expectAssignable<Message<true>>(message);
    const component = await message.awaitMessageComponent({ componentType: 'BUTTON' });
    expectType<ButtonInteraction<'cached'>>(component);
    expectType<Message<true>>(await component.reply({ fetchReply: true }));

    const buttonCollector = message.createMessageComponentCollector({ componentType: 'BUTTON' });
    expectType<InteractionCollector<ButtonInteraction<'cached'>>>(buttonCollector);
    expectType<GuildTextBasedChannel>(message.channel);
  }

  expectType<TextBasedChannels>(message.channel);
  expectNotType<GuildTextBasedChannel>(message.channel);

  // @ts-expect-error
  channel.send();
  // @ts-expect-error
  channel.send({ another: 'property' });

  // Check collector creations.

  // Verify that buttons interactions are inferred.
  const buttonCollector = message.createMessageComponentCollector({ componentType: 'BUTTON' });
  expectAssignable<Promise<ButtonInteraction>>(message.awaitMessageComponent({ componentType: 'BUTTON' }));
  expectAssignable<Promise<ButtonInteraction>>(channel.awaitMessageComponent({ componentType: 'BUTTON' }));
  expectAssignable<InteractionCollector<ButtonInteraction>>(buttonCollector);

  // Verify that select menus interaction are inferred.
  const selectMenuCollector = message.createMessageComponentCollector({ componentType: 'SELECT_MENU' });
  expectAssignable<Promise<SelectMenuInteraction>>(message.awaitMessageComponent({ componentType: 'SELECT_MENU' }));
  expectAssignable<Promise<SelectMenuInteraction>>(channel.awaitMessageComponent({ componentType: 'SELECT_MENU' }));
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

  // @ts-expect-error
  const interactionOptions = message.createMessageComponentCollector({ interactionType: 'APPLICATION_COMMAND' });

  // Make sure filter parameters are properly inferred.
  message.createMessageComponentCollector({
    filter: i => {
      expectType<MessageComponentInteraction>(i);
      return true;
    },
  });

  message.createMessageComponentCollector({
    componentType: 'BUTTON',
    filter: i => {
      expectType<ButtonInteraction>(i);
      return true;
    },
  });

  message.createMessageComponentCollector({
    componentType: 'SELECT_MENU',
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
    componentType: 'BUTTON',
    filter: i => {
      expectType<ButtonInteraction>(i);
      return true;
    },
  });

  message.awaitMessageComponent({
    componentType: 'SELECT_MENU',
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
      expectType<MessageComponentInteraction>(i);
      return true;
    },
  });

  channel.awaitMessageComponent({
    componentType: 'BUTTON',
    filter: i => {
      expectType<ButtonInteraction>(i);
      return true;
    },
  });

  channel.awaitMessageComponent({
    componentType: 'SELECT_MENU',
    filter: i => {
      expectType<SelectMenuInteraction>(i);
      return true;
    },
  });
});

client.on('interaction', async interaction => {
  expectType<Snowflake | null>(interaction.guildId);
  expectType<Snowflake | null>(interaction.channelId);
  expectType<GuildMember | APIInteractionGuildMember | null>(interaction.member);

  if (!interaction.isCommand()) return;

  void new MessageActionRow();

  const button = new MessageButton();

  const actionRow = new MessageActionRow({ components: [button] });

  await interaction.reply({ content: 'Hi!', components: [actionRow] });

  // @ts-expect-error
  interaction.reply({ content: 'Hi!', components: [[button]] });

  // @ts-expect-error
  void new MessageActionRow({});

  // @ts-expect-error
  await interaction.reply({ content: 'Hi!', components: [button] });

  if (interaction.isMessageComponent()) {
    expectType<Snowflake>(interaction.channelId);
  }
});

client.login('absolutely-valid-token');

// Test client conditional types
client.on('ready', client => {
  expectType<Client<true>>(client);

  // Test camelized post command data.
  client.application.commands.create({
    name: 'Foo',
    description: 'Bar',
    options: [
      {
        name: 'test',
        description: 'test',
        type: ApplicationCommandOptionType.Channel,
        channelTypes: [ChannelType.GuildCategory],
      },
    ],
  });
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
expectType<string>(serialize(new Permissions(Permissions.FLAGS.ATTACH_FILES)));
expectType<number>(serialize(new Intents(Intents.FLAGS.GUILDS)));
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
declare const user: User;
declare const guildMember: GuildMember;

// Test whether the structures implement send
expectType<TextBasedChannelFields['send']>(dmChannel.send);
expectType<ThreadChannel>(threadChannel);
expectType<NewsChannel>(newsChannel);
expectType<TextChannel>(textChannel);
expectAssignable<PartialTextBasedChannelFields>(user);
expectAssignable<PartialTextBasedChannelFields>(guildMember);

expectType<Message | null>(dmChannel.lastMessage);
expectType<Message | null>(threadChannel.lastMessage);
expectType<Message | null>(newsChannel.lastMessage);
expectType<Message | null>(textChannel.lastMessage);

notPropertyOf(user, 'lastMessage');
notPropertyOf(user, 'lastMessageId');
notPropertyOf(guildMember, 'lastMessage');
notPropertyOf(guildMember, 'lastMessageId');

// Test collector event parameters
declare const messageCollector: MessageCollector;
messageCollector.on('collect', (...args) => {
  expectType<[Message]>(args);
});

declare const reactionCollector: ReactionCollector;
reactionCollector.on('dispose', (...args) => {
  expectType<[MessageReaction, User]>(args);
});

// Make sure the properties are typed correctly, and that no backwards properties
// (K -> V and V -> K) exist:
expectType<'messageCreate'>(Constants.Events.MESSAGE_CREATE);
expectType<'close'>(Constants.ShardEvents.CLOSE);
expectType<1>(Constants.Status.CONNECTING);
expectType<0>(Constants.Opcodes.DISPATCH);
expectType<2>(Constants.ClientApplicationAssetTypes.BIG);

declare const applicationCommandData: Camelize<APIApplicationCommand>;
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

declare const applicationSubGroupCommandData: Camelize<APIApplicationCommandSubCommandOptions>;
{
  expectType<ApplicationCommandOptionType.Subcommand | ApplicationCommandOptionType.SubcommandGroup>(
    applicationSubGroupCommandData.type,
  );
  expectAssignable<APIApplicationCommandOption[] | undefined>(applicationSubGroupCommandData.options);
}

declare const applicationSubCommandData: ApplicationCommandSubCommandData;
{
  expectType<'SUB_COMMAND' | ApplicationCommandOptionTypes.SUB_COMMAND>(applicationSubCommandData.type);

  // Check that only subcommands can have no subcommand or subcommand group sub-options.
  expectType<
    | (
        | ApplicationCommandChoicesData
        | ApplicationCommandNonOptionsData
        | ApplicationCommandChannelOptionData
        | ApplicationCommandAutocompleteOption
        | ApplicationCommandNumericOptionData
      )[]
    | undefined
  >(applicationSubCommandData.options);
}

declare const guildApplicationCommandManager: GuildApplicationCommandManager;
expectType<Promise<Collection<Snowflake, ApplicationCommand>>>(guildApplicationCommandManager.fetch());
expectType<Promise<Collection<Snowflake, ApplicationCommand>>>(guildApplicationCommandManager.fetch(undefined, {}));
expectType<Promise<ApplicationCommand>>(guildApplicationCommandManager.fetch('0'));

declare const guildChannelManager: GuildChannelManager;
{
  type AnyChannel = TextChannel | VoiceChannel | CategoryChannel | NewsChannel | StoreChannel | StageChannel;

  expectType<Promise<VoiceChannel>>(guildChannelManager.create('name', { type: 'GUILD_VOICE' }));
  expectType<Promise<CategoryChannel>>(guildChannelManager.create('name', { type: 'GUILD_CATEGORY' }));
  expectType<Promise<TextChannel>>(guildChannelManager.create('name', { type: 'GUILD_TEXT' }));
  expectType<Promise<NewsChannel>>(guildChannelManager.create('name', { type: 'GUILD_NEWS' }));
  expectType<Promise<StoreChannel>>(guildChannelManager.create('name', { type: 'GUILD_STORE' }));
  expectType<Promise<StageChannel>>(guildChannelManager.create('name', { type: 'GUILD_STAGE_VOICE' }));

  expectType<Promise<Collection<Snowflake, AnyChannel>>>(guildChannelManager.fetch());
  expectType<Promise<Collection<Snowflake, AnyChannel>>>(guildChannelManager.fetch(undefined, {}));
  expectType<Promise<AnyChannel | null>>(guildChannelManager.fetch('0'));
}

declare const roleManager: RoleManager;
expectType<Promise<Collection<Snowflake, Role>>>(roleManager.fetch());
expectType<Promise<Collection<Snowflake, Role>>>(roleManager.fetch(undefined, {}));
expectType<Promise<Role | null>>(roleManager.fetch('0'));

declare const guildEmojiManager: GuildEmojiManager;
expectType<Promise<Collection<Snowflake, GuildEmoji>>>(guildEmojiManager.fetch());
expectType<Promise<Collection<Snowflake, GuildEmoji>>>(guildEmojiManager.fetch(undefined, {}));
expectType<Promise<GuildEmoji>>(guildEmojiManager.fetch('0'));

declare const typing: Typing;
expectType<PartialUser>(typing.user);
if (typing.user.partial) expectType<null>(typing.user.username);

expectType<TextBasedChannels>(typing.channel);
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
if (interaction.inGuild()) expectType<Snowflake>(interaction.guildId);

client.on('interactionCreate', async interaction => {
  if (interaction.inCachedGuild()) {
    expectAssignable<GuildMember>(interaction.member);
    expectNotType<CommandInteraction<'cached'>>(interaction);
    expectAssignable<Interaction>(interaction);
  } else if (interaction.inRawGuild()) {
    expectAssignable<APIInteractionGuildMember>(interaction.member);
    expectNotAssignable<Interaction<'cached'>>(interaction);
  } else {
    expectType<APIInteractionGuildMember | GuildMember | null>(interaction.member);
    expectNotAssignable<Interaction<'cached'>>(interaction);
  }

  if (interaction.isContextMenu()) {
    expectType<ContextMenuInteraction>(interaction);
    if (interaction.inCachedGuild()) {
      expectAssignable<ContextMenuInteraction>(interaction);
      expectAssignable<Guild>(interaction.guild);
      expectAssignable<BaseCommandInteraction<'cached'>>(interaction);
    } else if (interaction.inRawGuild()) {
      expectAssignable<ContextMenuInteraction>(interaction);
      expectType<null>(interaction.guild);
    } else if (interaction.inGuild()) {
      expectAssignable<ContextMenuInteraction>(interaction);
      expectType<Guild | null>(interaction.guild);
    }
  }

  if (interaction.isButton()) {
    expectType<ButtonInteraction>(interaction);
    if (interaction.inCachedGuild()) {
      expectAssignable<ButtonInteraction>(interaction);
      expectType<Guild>(interaction.guild);
      expectAssignable<Promise<Message>>(interaction.reply({ fetchReply: true }));
    } else if (interaction.inRawGuild()) {
      expectAssignable<ButtonInteraction>(interaction);
      expectType<null>(interaction.guild);
      expectType<Promise<APIMessage>>(interaction.reply({ fetchReply: true }));
    } else if (interaction.inGuild()) {
      expectAssignable<ButtonInteraction>(interaction);
      expectAssignable<Guild | null>(interaction.guild);
      expectType<Promise<APIMessage | Message>>(interaction.reply({ fetchReply: true }));
    }
  }

  if (interaction.isMessageComponent()) {
    expectType<MessageComponentInteraction>(interaction);
    if (interaction.inCachedGuild()) {
      expectAssignable<MessageComponentInteraction>(interaction);
      expectType<Guild>(interaction.guild);
      expectAssignable<Promise<Message>>(interaction.reply({ fetchReply: true }));
    } else if (interaction.inRawGuild()) {
      expectAssignable<MessageComponentInteraction>(interaction);
      expectType<null>(interaction.guild);
      expectType<Promise<APIMessage>>(interaction.reply({ fetchReply: true }));
    } else if (interaction.inGuild()) {
      expectAssignable<MessageComponentInteraction>(interaction);
      expectType<Guild | null>(interaction.guild);
      expectType<Promise<APIMessage | Message>>(interaction.reply({ fetchReply: true }));
    }
  }

  if (interaction.isSelectMenu()) {
    expectType<SelectMenuInteraction>(interaction);
    if (interaction.inCachedGuild()) {
      expectAssignable<SelectMenuInteraction>(interaction);
      expectType<Guild>(interaction.guild);
      expectType<Promise<Message<true>>>(interaction.reply({ fetchReply: true }));
    } else if (interaction.inRawGuild()) {
      expectAssignable<SelectMenuInteraction>(interaction);
      expectType<null>(interaction.guild);
      expectType<Promise<APIMessage>>(interaction.reply({ fetchReply: true }));
    } else if (interaction.inGuild()) {
      expectAssignable<SelectMenuInteraction>(interaction);
      expectType<Guild | null>(interaction.guild);
      expectType<Promise<Message | APIMessage>>(interaction.reply({ fetchReply: true }));
    }
  }

  if (interaction.isCommand()) {
    if (interaction.inRawGuild()) {
      expectNotAssignable<Interaction<'cached'>>(interaction);
      expectAssignable<CommandInteraction>(interaction);
      expectType<Promise<APIMessage>>(interaction.reply({ fetchReply: true }));
      expectType<APIInteractionDataResolvedGuildMember | null>(interaction.options.getMember('test'));
      expectType<APIInteractionDataResolvedGuildMember>(interaction.options.getMember('test', true));

      expectType<APIInteractionDataResolvedChannel>(interaction.options.getChannel('test', true));
      expectType<APIRole>(interaction.options.getRole('test', true));
    } else if (interaction.inCachedGuild()) {
      const msg = await interaction.reply({ fetchReply: true });
      const btn = await msg.awaitMessageComponent({ componentType: 'BUTTON' });

      expectType<Message<true>>(msg);
      expectType<ButtonInteraction<'cached'>>(btn);

      expectType<GuildMember | null>(interaction.options.getMember('test'));
      expectAssignable<CommandInteraction>(interaction);
      expectType<Promise<Message<true>>>(interaction.reply({ fetchReply: true }));

      expectType<GuildChannel | ThreadChannel>(interaction.options.getChannel('test', true));
      expectType<Role>(interaction.options.getRole('test', true));
    } else {
      // @ts-expect-error
      consumeCachedCommand(interaction);
      expectType<CommandInteraction>(interaction);
      expectType<Promise<Message | APIMessage>>(interaction.reply({ fetchReply: true }));
      expectType<APIInteractionDataResolvedGuildMember | GuildMember | null>(interaction.options.getMember('test'));
      expectType<APIInteractionDataResolvedGuildMember | GuildMember>(interaction.options.getMember('test', true));

      expectType<GuildChannel | ThreadChannel | APIInteractionDataResolvedChannel>(
        interaction.options.getChannel('test', true),
      );
      expectType<APIRole | Role>(interaction.options.getRole('test', true));
    }

    expectType<CommandInteraction>(interaction);
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

    expectType<string>(interaction.options.getSubcommandGroup());
    expectType<string>(interaction.options.getSubcommandGroup(true));
    expectType<string | null>(interaction.options.getSubcommandGroup(booleanValue));
    expectType<string | null>(interaction.options.getSubcommandGroup(false));
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

expectType<Promise<number | null>>(shard.eval(c => c.readyTimestamp));
