import type {
  APIGuildMember,
  APIInteractionGuildMember,
  APIMessage,
  APIPartialChannel,
  APIPartialGuild,
  APIInteractionDataResolvedGuildMember,
  APIInteractionDataResolvedChannel,
  APIRole,
} from 'discord-api-types/v9';
import {
  ApplicationCommand,
  ApplicationCommandChannelOptionData,
  ApplicationCommandChoicesData,
  ApplicationCommandData,
  ApplicationCommandManager,
  ApplicationCommandNonOptionsData,
  ApplicationCommandOptionData,
  ApplicationCommandResolvable,
  ApplicationCommandSubCommandData,
  ApplicationCommandSubGroupData,
  BaseCommandInteraction,
  ButtonInteraction,
  CacheType,
  CategoryChannel,
  Client,
  ClientApplication,
  ClientUser,
  Collection,
  CommandInteraction,
  CommandInteractionOption,
  CommandInteractionOptionResolver,
  CommandOptionChoiceResolvableType,
  CommandOptionNonChoiceResolvableType,
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
} from '.';
import type { ApplicationCommandOptionTypes } from './enums';

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
  assertType<Collection<string, ApplicationCommand>>(await client.application!.commands.fetch());
  assertType<Collection<string, ApplicationCommand>>(
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

// This is to check that stuff is the right type
declare const assertIsPromiseMember: (m: Promise<GuildMember>) => void;

client.on('guildCreate', async g => {
  const channel = g.channels.cache.random();
  if (!channel) return;

  if (channel.isThread()) {
    const fetchedMember = await channel.members.fetch('12345678');
    assertType<ThreadMember>(fetchedMember);
    const fetchedMemberCol = await channel.members.fetch(true);
    assertType<Collection<Snowflake, ThreadMember>>(fetchedMemberCol);
  }

  channel.setName('foo').then(updatedChannel => {
    console.log(`New channel name: ${updatedChannel.name}`);
  });

  // @ts-expect-error no options
  assertIsPromiseMember(g.members.add(testUserId));

  // @ts-expect-error no access token
  assertIsPromiseMember(g.members.add(testUserId, {}));

  // @ts-expect-error invalid role resolvable
  assertIsPromiseMember(g.members.add(testUserId, { accessToken: 'totallyRealAccessToken', roles: [g.roles.cache] }));

  assertType<Promise<GuildMember | null>>(
    g.members.add(testUserId, { accessToken: 'totallyRealAccessToken', fetchWhenExisting: false }),
  );

  assertIsPromiseMember(g.members.add(testUserId, { accessToken: 'totallyRealAccessToken' }));

  assertIsPromiseMember(
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
    assertType<Message<true>>(message);
    const component = await message.awaitMessageComponent({ componentType: 'BUTTON' });
    assertType<ButtonInteraction<'cached'>>(component);
    assertType<Message<true>>(await component.reply({ fetchReply: true }));

    const buttonCollector = message.createMessageComponentCollector({ componentType: 'BUTTON' });
    assertType<InteractionCollector<ButtonInteraction<'cached'>>>(buttonCollector);
    assertType<GuildTextBasedChannel>(message.channel);
  }

  assertType<TextBasedChannels>(message.channel);

  // @ts-expect-error
  assertType<GuildTextBasedChannel>(message.channel);

  // @ts-expect-error
  channel.send();
  // @ts-expect-error
  channel.send({ another: 'property' });

  // Check collector creations.

  // Verify that buttons interactions are inferred.
  const buttonCollector = message.createMessageComponentCollector({ componentType: 'BUTTON' });
  assertType<Promise<ButtonInteraction>>(message.awaitMessageComponent({ componentType: 'BUTTON' }));
  assertType<Promise<ButtonInteraction>>(channel.awaitMessageComponent({ componentType: 'BUTTON' }));
  assertType<InteractionCollector<ButtonInteraction>>(buttonCollector);

  // Verify that select menus interaction are inferred.
  const selectMenuCollector = message.createMessageComponentCollector({ componentType: 'SELECT_MENU' });
  assertType<Promise<SelectMenuInteraction>>(message.awaitMessageComponent({ componentType: 'SELECT_MENU' }));
  assertType<Promise<SelectMenuInteraction>>(channel.awaitMessageComponent({ componentType: 'SELECT_MENU' }));
  assertType<InteractionCollector<SelectMenuInteraction>>(selectMenuCollector);

  // Verify that message component interactions are default collected types.
  const defaultCollector = message.createMessageComponentCollector();
  assertType<Promise<MessageComponentInteraction>>(message.awaitMessageComponent());
  assertType<Promise<MessageComponentInteraction>>(channel.awaitMessageComponent());
  assertType<InteractionCollector<MessageComponentInteraction>>(defaultCollector);

  // Verify that additional options don't affect default collector types.
  const semiDefaultCollector = message.createMessageComponentCollector({ time: 10000 });
  assertType<InteractionCollector<MessageComponentInteraction>>(semiDefaultCollector);
  const semiDefaultCollectorChannel = message.createMessageComponentCollector({ time: 10000 });
  assertType<InteractionCollector<MessageComponentInteraction>>(semiDefaultCollectorChannel);

  // Verify that interaction collector options can't be used.

  // @ts-expect-error
  const interactionOptions = message.createMessageComponentCollector({ interactionType: 'APPLICATION_COMMAND' });

  // Make sure filter parameters are properly inferred.
  message.createMessageComponentCollector({
    filter: i => {
      assertType<MessageComponentInteraction>(i);
      return true;
    },
  });

  message.createMessageComponentCollector({
    componentType: 'BUTTON',
    filter: i => {
      assertType<ButtonInteraction>(i);
      return true;
    },
  });

  message.createMessageComponentCollector({
    componentType: 'SELECT_MENU',
    filter: i => {
      assertType<SelectMenuInteraction>(i);
      return true;
    },
  });

  message.awaitMessageComponent({
    filter: i => {
      assertType<MessageComponentInteraction>(i);
      return true;
    },
  });

  message.awaitMessageComponent({
    componentType: 'BUTTON',
    filter: i => {
      assertType<ButtonInteraction>(i);
      return true;
    },
  });

  message.awaitMessageComponent({
    componentType: 'SELECT_MENU',
    filter: i => {
      assertType<SelectMenuInteraction>(i);
      return true;
    },
  });

  const webhook = await message.fetchWebhook();

  if (webhook.isChannelFollower()) {
    assertType<Guild | APIPartialGuild>(webhook.sourceGuild);
    assertType<NewsChannel | APIPartialChannel>(webhook.sourceChannel);
  } else if (webhook.isIncoming()) {
    assertType<string>(webhook.token);
  }

  // @ts-expect-error
  assertType<Guild | APIPartialGuild>(webhook.sourceGuild);
  // @ts-expect-error
  assertType<NewsChannel | APIPartialChannel>(webhook.sourceChannel);
  // @ts-expect-error
  assertType<string>(webhook.token);

  channel.awaitMessageComponent({
    filter: i => {
      assertType<MessageComponentInteraction>(i);
      return true;
    },
  });

  channel.awaitMessageComponent({
    componentType: 'BUTTON',
    filter: i => {
      assertType<ButtonInteraction>(i);
      return true;
    },
  });

  channel.awaitMessageComponent({
    componentType: 'SELECT_MENU',
    filter: i => {
      assertType<SelectMenuInteraction>(i);
      return true;
    },
  });
});

client.on('interaction', async interaction => {
  assertType<Snowflake | null>(interaction.guildId);
  assertType<Snowflake | null>(interaction.channelId);
  assertType<GuildMember | APIInteractionGuildMember | null>(interaction.member);

  if (!interaction.isCommand()) return;

  void new MessageActionRow();

  const button = new MessageButton();

  const actionRow = new MessageActionRow({ components: [button] });

  await interaction.reply({ content: 'Hi!', components: [actionRow] });

  // @ts-expect-error
  await interaction.reply({ content: 'Hi!', components: [[button]] });

  // @ts-expect-error
  void new MessageActionRow({});

  // @ts-expect-error
  await interaction.reply({ content: 'Hi!', components: [button] });

  if (interaction.isMessageComponent()) {
    assertType<Snowflake>(interaction.channelId);
  }
});

client.login('absolutely-valid-token');

// Test client conditional types
client.on('ready', client => {
  assertType<Client<true>>(client);
});

declare const loggedInClient: Client<true>;
assertType<ClientApplication>(loggedInClient.application);
assertType<Date>(loggedInClient.readyAt);
assertType<number>(loggedInClient.readyTimestamp);
assertType<string>(loggedInClient.token);
assertType<number>(loggedInClient.uptime);
assertType<ClientUser>(loggedInClient.user);

declare const loggedOutClient: Client<false>;
assertType<null>(loggedOutClient.application);
assertType<null>(loggedOutClient.readyAt);
assertType<null>(loggedOutClient.readyTimestamp);
assertType<string | null>(loggedOutClient.token);
assertType<null>(loggedOutClient.uptime);
assertType<null>(loggedOutClient.user);

// Test type transformation:
declare const assertType: <T>(value: T) => asserts value is T;
declare const serialize: <T>(value: T) => Serialized<T>;
declare const notPropertyOf: <T, P extends PropertyKey>(value: T, property: P & Exclude<P, keyof T>) => void;

assertType<undefined>(serialize(undefined));
assertType<null>(serialize(null));
assertType<number[]>(serialize([1, 2, 3]));
assertType<{}>(serialize(new Set([1, 2, 3])));
assertType<{}>(
  serialize(
    new Map([
      [1, '2'],
      [2, '4'],
    ]),
  ),
);
assertType<string>(serialize(new Permissions(Permissions.FLAGS.ATTACH_FILES)));
assertType<number>(serialize(new Intents(Intents.FLAGS.GUILDS)));
assertType<unknown>(
  serialize(
    new Collection([
      [1, '2'],
      [2, '4'],
    ]),
  ),
);
assertType<never>(serialize(Symbol('a')));
assertType<never>(serialize(() => {}));
assertType<never>(serialize(BigInt(42)));

// Test type return of broadcastEval:
declare const shardClientUtil: ShardClientUtil;
declare const shardingManager: ShardingManager;

assertType<Promise<number[]>>(shardingManager.broadcastEval(() => 1));
assertType<Promise<number[]>>(shardClientUtil.broadcastEval(() => 1));
assertType<Promise<number[]>>(shardingManager.broadcastEval(async () => 1));
assertType<Promise<number[]>>(shardClientUtil.broadcastEval(async () => 1));

declare const dmChannel: DMChannel;
declare const threadChannel: ThreadChannel;
declare const newsChannel: NewsChannel;
declare const textChannel: TextChannel;
declare const user: User;
declare const guildMember: GuildMember;

// Test whether the structures implement send
assertType<TextBasedChannelFields['send']>(dmChannel.send);
assertType<TextBasedChannelFields>(threadChannel);
assertType<TextBasedChannelFields>(newsChannel);
assertType<TextBasedChannelFields>(textChannel);
assertType<PartialTextBasedChannelFields>(user);
assertType<PartialTextBasedChannelFields>(guildMember);

assertType<Message | null>(dmChannel.lastMessage);
assertType<Message | null>(threadChannel.lastMessage);
assertType<Message | null>(newsChannel.lastMessage);
assertType<Message | null>(textChannel.lastMessage);

notPropertyOf(user, 'lastMessage');
notPropertyOf(user, 'lastMessageId');
notPropertyOf(guildMember, 'lastMessage');
notPropertyOf(guildMember, 'lastMessageId');

// Test collector event parameters
declare const messageCollector: MessageCollector;
messageCollector.on('collect', (...args) => {
  assertType<[Message]>(args);
});

declare const reactionCollector: ReactionCollector;
reactionCollector.on('dispose', (...args) => {
  assertType<[MessageReaction, User]>(args);
});

// Make sure the properties are typed correctly, and that no backwards properties
// (K -> V and V -> K) exist:
assertType<'messageCreate'>(Constants.Events.MESSAGE_CREATE);
assertType<'close'>(Constants.ShardEvents.CLOSE);
assertType<1>(Constants.Status.CONNECTING);
assertType<0>(Constants.Opcodes.DISPATCH);
assertType<2>(Constants.ClientApplicationAssetTypes.BIG);

declare const applicationCommandData: ApplicationCommandData;
declare const applicationCommandResolvable: ApplicationCommandResolvable;
declare const applicationCommandManager: ApplicationCommandManager;
{
  type ApplicationCommandScope = ApplicationCommand<{ guild: GuildResolvable }>;

  assertType<Promise<ApplicationCommandScope>>(applicationCommandManager.create(applicationCommandData));
  assertType<Promise<ApplicationCommand>>(applicationCommandManager.create(applicationCommandData, '0'));
  assertType<Promise<ApplicationCommandScope>>(
    applicationCommandManager.edit(applicationCommandResolvable, applicationCommandData),
  );
  assertType<Promise<ApplicationCommand>>(
    applicationCommandManager.edit(applicationCommandResolvable, applicationCommandData, '0'),
  );
  assertType<Promise<Collection<Snowflake, ApplicationCommandScope>>>(
    applicationCommandManager.set([applicationCommandData]),
  );
  assertType<Promise<Collection<Snowflake, ApplicationCommand>>>(
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

declare const applicationChoiceOptionData: ApplicationCommandOptionData & { type: CommandOptionChoiceResolvableType };
{
  // Choices should be available.
  applicationChoiceOptionData.choices;
}

declare const applicationSubGroupCommandData: ApplicationCommandSubGroupData;
{
  assertType<'SUB_COMMAND_GROUP' | ApplicationCommandOptionTypes.SUB_COMMAND_GROUP>(
    applicationSubGroupCommandData.type,
  );
  assertType<ApplicationCommandSubCommandData[] | undefined>(applicationSubGroupCommandData.options);
}

declare const applicationSubCommandData: ApplicationCommandSubCommandData;
{
  assertType<'SUB_COMMAND' | ApplicationCommandOptionTypes.SUB_COMMAND>(applicationSubCommandData.type);

  // Check that only subcommands can have no subcommand or subcommand group sub-options.
  assertType<
    | (ApplicationCommandChoicesData | ApplicationCommandNonOptionsData | ApplicationCommandChannelOptionData)[]
    | undefined
  >(applicationSubCommandData.options);
}

declare const guildApplicationCommandManager: GuildApplicationCommandManager;
assertType<Promise<Collection<Snowflake, ApplicationCommand>>>(guildApplicationCommandManager.fetch());
assertType<Promise<Collection<Snowflake, ApplicationCommand>>>(guildApplicationCommandManager.fetch(undefined, {}));
assertType<Promise<ApplicationCommand>>(guildApplicationCommandManager.fetch('0'));

declare const guildChannelManager: GuildChannelManager;
{
  type AnyChannel = TextChannel | VoiceChannel | CategoryChannel | NewsChannel | StoreChannel | StageChannel;

  assertType<Promise<VoiceChannel>>(guildChannelManager.create('name', { type: 'GUILD_VOICE' }));
  assertType<Promise<CategoryChannel>>(guildChannelManager.create('name', { type: 'GUILD_CATEGORY' }));
  assertType<Promise<TextChannel>>(guildChannelManager.create('name', { type: 'GUILD_TEXT' }));
  assertType<Promise<NewsChannel>>(guildChannelManager.create('name', { type: 'GUILD_NEWS' }));
  assertType<Promise<StoreChannel>>(guildChannelManager.create('name', { type: 'GUILD_STORE' }));
  assertType<Promise<StageChannel>>(guildChannelManager.create('name', { type: 'GUILD_STAGE_VOICE' }));

  assertType<Promise<Collection<Snowflake, AnyChannel>>>(guildChannelManager.fetch());
  assertType<Promise<Collection<Snowflake, AnyChannel>>>(guildChannelManager.fetch(undefined, {}));
  assertType<Promise<AnyChannel | null>>(guildChannelManager.fetch('0'));
}

declare const roleManager: RoleManager;
assertType<Promise<Collection<Snowflake, Role>>>(roleManager.fetch());
assertType<Promise<Collection<Snowflake, Role>>>(roleManager.fetch(undefined, {}));
assertType<Promise<Role | null>>(roleManager.fetch('0'));

declare const guildEmojiManager: GuildEmojiManager;
assertType<Promise<Collection<Snowflake, GuildEmoji>>>(guildEmojiManager.fetch());
assertType<Promise<Collection<Snowflake, GuildEmoji>>>(guildEmojiManager.fetch(undefined, {}));
assertType<Promise<GuildEmoji | null>>(guildEmojiManager.fetch('0'));

declare const typing: Typing;
assertType<PartialUser>(typing.user);
if (typing.user.partial) assertType<null>(typing.user.username);

assertType<TextBasedChannels>(typing.channel);
if (typing.channel.partial) assertType<undefined>(typing.channel.lastMessageId);

assertType<GuildMember | null>(typing.member);
assertType<Guild | null>(typing.guild);

if (typing.inGuild()) {
  assertType<Guild>(typing.channel.guild);
  assertType<Guild>(typing.guild);
}

// Test partials structures
client.on('guildMemberRemove', member => {
  if (member.partial) return assertType<null>(member.joinedAt);
  assertType<Date | null>(member.joinedAt);
});

client.on('messageReactionAdd', async reaction => {
  if (reaction.partial) {
    assertType<null>(reaction.count);
    reaction = await reaction.fetch();
  }
  assertType<number>(reaction.count);
  if (reaction.message.partial) return assertType<string | null>(reaction.message.content);
  assertType<string>(reaction.message.content);
});

// Test interactions
declare const interaction: Interaction;
declare const booleanValue: boolean;
if (interaction.inGuild()) assertType<Snowflake>(interaction.guildId);

client.on('interactionCreate', async interaction => {
  if (interaction.inCachedGuild()) {
    assertType<GuildMember>(interaction.member);
    // @ts-expect-error
    assertType<CommandInteraction<'cached'>>(interaction);
    assertType<Interaction>(interaction);
  } else if (interaction.inRawGuild()) {
    assertType<APIInteractionGuildMember>(interaction.member);
    // @ts-expect-error
    consumeCachedInteraction(interaction);
  } else {
    assertType<APIGuildMember | GuildMember | null>(interaction.member);
    // @ts-expect-error
    consumeCachedInteraction(interaction);
  }

  if (interaction.isContextMenu()) {
    assertType<ContextMenuInteraction>(interaction);
    if (interaction.inCachedGuild()) {
      assertType<ContextMenuInteraction>(interaction);
      assertType<Guild>(interaction.guild);
      assertType<BaseCommandInteraction<'cached'>>(interaction);
    } else if (interaction.inRawGuild()) {
      assertType<ContextMenuInteraction>(interaction);
      assertType<null>(interaction.guild);
    } else if (interaction.inGuild()) {
      assertType<ContextMenuInteraction>(interaction);
      assertType<Guild | null>(interaction.guild);
    }
  }

  if (interaction.isButton()) {
    assertType<ButtonInteraction>(interaction);
    if (interaction.inCachedGuild()) {
      assertType<ButtonInteraction>(interaction);
      assertType<Guild>(interaction.guild);
      assertType<Promise<Message>>(interaction.reply({ fetchReply: true }));
    } else if (interaction.inRawGuild()) {
      assertType<ButtonInteraction>(interaction);
      assertType<null>(interaction.guild);
      assertType<Promise<APIMessage>>(interaction.reply({ fetchReply: true }));
    } else if (interaction.inGuild()) {
      assertType<ButtonInteraction>(interaction);
      assertType<Guild | null>(interaction.guild);
      assertType<Promise<APIMessage | Message>>(interaction.reply({ fetchReply: true }));
    }
  }

  if (interaction.isMessageComponent()) {
    assertType<MessageComponentInteraction>(interaction);
    if (interaction.inCachedGuild()) {
      assertType<MessageComponentInteraction>(interaction);
      assertType<Guild>(interaction.guild);
      assertType<Promise<Message>>(interaction.reply({ fetchReply: true }));
    } else if (interaction.inRawGuild()) {
      assertType<MessageComponentInteraction>(interaction);
      assertType<null>(interaction.guild);
      assertType<Promise<APIMessage>>(interaction.reply({ fetchReply: true }));
    } else if (interaction.inGuild()) {
      assertType<MessageComponentInteraction>(interaction);
      assertType<Guild | null>(interaction.guild);
      assertType<Promise<APIMessage | Message>>(interaction.reply({ fetchReply: true }));
    }
  }

  if (interaction.isSelectMenu()) {
    assertType<SelectMenuInteraction>(interaction);
    if (interaction.inCachedGuild()) {
      assertType<SelectMenuInteraction>(interaction);
      assertType<Guild>(interaction.guild);
      assertType<Promise<Message>>(interaction.reply({ fetchReply: true }));
    } else if (interaction.inRawGuild()) {
      assertType<SelectMenuInteraction>(interaction);
      assertType<null>(interaction.guild);
      assertType<Promise<APIMessage>>(interaction.reply({ fetchReply: true }));
    } else if (interaction.inGuild()) {
      assertType<SelectMenuInteraction>(interaction);
      assertType<Guild | null>(interaction.guild);
      assertType<Promise<Message | APIMessage>>(interaction.reply({ fetchReply: true }));
    }
  }

  if (interaction.isCommand()) {
    if (interaction.inRawGuild()) {
      // @ts-expect-error
      consumeCachedCommand(interaction);
      assertType<CommandInteraction>(interaction);
      assertType<Promise<APIMessage>>(interaction.reply({ fetchReply: true }));
      assertType<APIInteractionDataResolvedGuildMember | null>(interaction.options.getMember('test'));
      assertType<APIInteractionDataResolvedGuildMember>(interaction.options.getMember('test', true));

      assertType<APIInteractionDataResolvedChannel>(interaction.options.getChannel('test', true));
      assertType<APIRole>(interaction.options.getRole('test', true));
    } else if (interaction.inCachedGuild()) {
      const msg = await interaction.reply({ fetchReply: true });
      const btn = await msg.awaitMessageComponent({ componentType: 'BUTTON' });

      assertType<Message>(msg);
      assertType<ButtonInteraction<'cached'>>(btn);

      assertType<CommandInteraction<'cached'>>(interaction);
      assertType<GuildMember>(interaction.options.getMember('test', true));
      assertType<GuildMember | null>(interaction.options.getMember('test'));
      assertType<CommandInteraction>(interaction);
      assertType<Promise<Message>>(interaction.reply({ fetchReply: true }));

      assertType<GuildChannel | ThreadChannel>(interaction.options.getChannel('test', true));
      assertType<Role>(interaction.options.getRole('test', true));
    } else {
      // @ts-expect-error
      consumeCachedCommand(interaction);
      assertType<CommandInteraction>(interaction);
      assertType<Promise<Message | APIMessage>>(interaction.reply({ fetchReply: true }));
      assertType<APIInteractionDataResolvedGuildMember | GuildMember | null>(interaction.options.getMember('test'));
      assertType<APIInteractionDataResolvedGuildMember | GuildMember>(interaction.options.getMember('test', true));

      assertType<GuildChannel | ThreadChannel | APIInteractionDataResolvedChannel>(
        interaction.options.getChannel('test', true),
      );
      assertType<APIRole | Role>(interaction.options.getRole('test', true));
    }

    assertType<CommandInteraction>(interaction);
    assertType<Omit<CommandInteractionOptionResolver<CacheType>, 'getFocused' | 'getMessage'>>(interaction.options);
    assertType<readonly CommandInteractionOption[]>(interaction.options.data);

    const optionalOption = interaction.options.get('name');
    const requiredOption = interaction.options.get('name', true);
    assertType<CommandInteractionOption | null>(optionalOption);
    assertType<CommandInteractionOption>(requiredOption);
    assertType<CommandInteractionOption[] | undefined>(requiredOption.options);

    assertType<string | null>(interaction.options.getString('name', booleanValue));
    assertType<string | null>(interaction.options.getString('name', false));
    assertType<string>(interaction.options.getString('name', true));

    assertType<string>(interaction.options.getSubcommand());
    assertType<string>(interaction.options.getSubcommand(true));
    assertType<string | null>(interaction.options.getSubcommand(booleanValue));
    assertType<string | null>(interaction.options.getSubcommand(false));

    assertType<string>(interaction.options.getSubcommandGroup());
    assertType<string>(interaction.options.getSubcommandGroup(true));
    assertType<string | null>(interaction.options.getSubcommandGroup(booleanValue));
    assertType<string | null>(interaction.options.getSubcommandGroup(false));
  }
});

declare const shard: Shard;

assertType<Promise<number | null>>(shard.eval(c => c.readyTimestamp));
