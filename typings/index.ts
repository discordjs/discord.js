/// <reference path="index.d.ts" />

import {
  Client,
  Collection,
  Intents,
  Message,
  MessageAttachment,
  MessageEmbed,
  Permissions,
  Serialized,
  ShardClientUtil,
  ShardingManager,
} from 'discord.js';

const client: Client = new Client({
  intents: Intents.NON_PRIVILEGED,
});

const testGuildID = '222078108977594368'; // DJS
const testUserID = '987654321098765432'; // example ID
const globalCommandID = '123456789012345678'; // example ID
const guildCommandID = '234567890123456789'; // example ID

client.on('ready', async () => {
  console.log(`Client is logged in as ${client.user!.tag} and ready!`);

  // Test command manager methods
  const globalCommand = await client.application?.commands.fetch(globalCommandID);
  const guildCommandFromGlobal = await client.application?.commands.fetch(guildCommandID, { guildID: testGuildID });
  const guildCommandFromGuild = await client.guilds.cache.get(testGuildID)?.commands.fetch(guildCommandID);

  // @ts-expect-error
  await client.guilds.cache.get(testGuildID)?.commands.fetch(guildCommandID, { guildID: testGuildID });

  // Test command permissions
  const globalPermissionsManager = client.application?.commands.permissions;
  const guildPermissionsManager = client.guilds.cache.get(testGuildID)?.commands.permissions;
  const originalPermissions = await client.application?.commands.permissions.fetch({ guild: testGuildID });

  // Permissions from global manager
  await globalPermissionsManager?.add({
    command: globalCommandID,
    guild: testGuildID,
    permissions: [{ type: 'ROLE', id: testGuildID, permission: true }],
  });
  await globalPermissionsManager?.has({ command: globalCommandID, guild: testGuildID, permissionsID: testGuildID });
  await globalPermissionsManager?.fetch({ guild: testGuildID });
  await globalPermissionsManager?.fetch({ command: globalCommandID, guild: testGuildID });
  await globalPermissionsManager?.remove({ command: globalCommandID, guild: testGuildID, roles: [testGuildID] });
  await globalPermissionsManager?.remove({ command: globalCommandID, guild: testGuildID, users: [testUserID] });
  await globalPermissionsManager?.remove({
    command: globalCommandID,
    guild: testGuildID,
    roles: [testGuildID],
    users: [testUserID],
  });
  await globalPermissionsManager?.set({
    command: globalCommandID,
    guild: testGuildID,
    permissions: [{ type: 'ROLE', id: testGuildID, permission: true }],
  });
  await globalPermissionsManager?.set({
    guild: testGuildID,
    fullPermissions: [{ id: globalCommandID, permissions: [{ type: 'ROLE', id: testGuildID, permission: true }] }],
  });

  // @ts-expect-error
  await globalPermissionsManager?.add({
    command: globalCommandID,
    permissions: [{ type: 'ROLE', id: testGuildID, permission: true }],
  });
  // @ts-expect-error
  await globalPermissionsManager?.has({ command: globalCommandID, permissionsID: testGuildID });
  // @ts-expect-error
  await globalPermissionsManager?.fetch();
  // @ts-expect-error
  await globalPermissionsManager?.fetch({ command: globalCommandID });
  // @ts-expect-error
  await globalPermissionsManager?.remove({ command: globalCommandID, roles: [testGuildID] });
  // @ts-expect-error
  await globalPermissionsManager?.remove({ command: globalCommandID, users: [testUserID] });
  // @ts-expect-error
  await globalPermissionsManager?.remove({ command: globalCommandID, roles: [testGuildID], users: [testUserID] });
  // @ts-expect-error
  await globalPermissionsManager?.set({
    command: globalCommandID,
    permissions: [{ type: 'ROLE', id: testGuildID, permission: true }],
  });
  // @ts-expect-error
  await globalPermissionsManager?.set({
    fullPermissions: [{ id: globalCommandID, permissions: [{ type: 'ROLE', id: testGuildID, permission: true }] }],
  });

  // @ts-expect-error
  await globalPermissionsManager?.add({
    guild: testGuildID,
    permissions: [{ type: 'ROLE', id: testGuildID, permission: true }],
  });
  // @ts-expect-error
  await globalPermissionsManager?.has({ guild: testGuildID, permissionsID: testGuildID });
  // @ts-expect-error
  await globalPermissionsManager?.remove({ guild: testGuildID, roles: [testGuildID] });
  // @ts-expect-error
  await globalPermissionsManager?.remove({ guild: testGuildID, users: [testUserID] });
  // @ts-expect-error
  await globalPermissionsManager?.remove({ guild: testGuildID, roles: [testGuildID], users: [testUserID] });
  // @ts-expect-error
  await globalPermissionsManager?.set({
    guild: testGuildID,
    permissions: [{ type: 'ROLE', id: testGuildID, permission: true }],
  });

  // Permissions from guild manager
  await guildPermissionsManager?.add({
    command: globalCommandID,
    permissions: [{ type: 'ROLE', id: testGuildID, permission: true }],
  });
  await guildPermissionsManager?.has({ command: globalCommandID, permissionsID: testGuildID });
  await guildPermissionsManager?.fetch({});
  await guildPermissionsManager?.fetch({ command: globalCommandID });
  await guildPermissionsManager?.remove({ command: globalCommandID, roles: [testGuildID] });
  await guildPermissionsManager?.remove({ command: globalCommandID, users: [testUserID] });
  await guildPermissionsManager?.remove({ command: globalCommandID, roles: [testGuildID], users: [testUserID] });
  await guildPermissionsManager?.set({
    command: globalCommandID,
    permissions: [{ type: 'ROLE', id: testGuildID, permission: true }],
  });
  await guildPermissionsManager?.set({
    fullPermissions: [{ id: globalCommandID, permissions: [{ type: 'ROLE', id: testGuildID, permission: true }] }],
  });

  await guildPermissionsManager?.add({
    command: globalCommandID,
    // @ts-expect-error
    guild: testGuildID,
    permissions: [{ type: 'ROLE', id: testGuildID, permission: true }],
  });
  // @ts-expect-error
  await guildPermissionsManager?.has({ command: globalCommandID, guild: testGuildID, permissionsID: testGuildID });
  // @ts-expect-error
  await guildPermissionsManager?.fetch({ guild: testGuildID });
  // @ts-expect-error
  await guildPermissionsManager?.fetch({ command: globalCommandID, guild: testGuildID });
  // @ts-expect-error
  await guildPermissionsManager?.remove({ command: globalCommandID, guild: testGuildID, roles: [testGuildID] });
  // @ts-expect-error
  await guildPermissionsManager?.remove({ command: globalCommandID, guild: testGuildID, users: [testUserID] });
  await guildPermissionsManager?.remove({
    command: globalCommandID,
    // @ts-expect-error
    guild: testGuildID,
    roles: [testGuildID],
    users: [testUserID],
  });
  await guildPermissionsManager?.set({
    command: globalCommandID,
    // @ts-expect-error
    guild: testGuildID,
    permissions: [{ type: 'ROLE', id: testGuildID, permission: true }],
  });
  await guildPermissionsManager?.set({
    // @ts-expect-error
    guild: testGuildID,
    fullPermissions: [{ id: globalCommandID, permissions: [{ type: 'ROLE', id: testGuildID, permission: true }] }],
  });

  // @ts-expect-error
  await guildPermissionsManager?.add({ permissions: [{ type: 'ROLE', id: testGuildID, permission: true }] });
  // @ts-expect-error
  await guildPermissionsManager?.has({ permissionsID: testGuildID });
  // @ts-expect-error
  await guildPermissionsManager?.remove({ roles: [testGuildID] });
  // @ts-expect-error
  await guildPermissionsManager?.remove({ users: [testUserID] });
  // @ts-expect-error
  await guildPermissionsManager?.remove({ roles: [testGuildID], users: [testUserID] });
  // @ts-expect-error
  await guildPermissionsManager?.set({ permissions: [{ type: 'ROLE', id: testGuildID, permission: true }] });

  // Permissions from cached global ApplicationCommand
  await globalCommand?.permissions.add({
    guild: testGuildID,
    permissions: [{ type: 'ROLE', id: testGuildID, permission: true }],
  });
  await globalCommand?.permissions.has({ guild: testGuildID, permissionsID: testGuildID });
  await globalCommand?.permissions.fetch({ guild: testGuildID });
  await globalCommand?.permissions.remove({ guild: testGuildID, roles: [testGuildID] });
  await globalCommand?.permissions.remove({ guild: testGuildID, users: [testUserID] });
  await globalCommand?.permissions.remove({ guild: testGuildID, roles: [testGuildID], users: [testUserID] });
  await globalCommand?.permissions.set({
    guild: testGuildID,
    permissions: [{ type: 'ROLE', id: testGuildID, permission: true }],
  });

  await globalCommand?.permissions.add({
    // @ts-expect-error
    command: globalCommandID,
    guild: testGuildID,
    permissions: [{ type: 'ROLE', id: testGuildID, permission: true }],
  });
  // @ts-expect-error
  await globalCommand?.permissions.has({ command: globalCommandID, guild: testGuildID, permissionsID: testGuildID });
  // @ts-expect-error
  await globalCommand?.permissions.fetch({ command: globalCommandID, guild: testGuildID });
  // @ts-expect-error
  await globalCommand?.permissions.remove({ command: globalCommandID, guild: testGuildID, roles: [testGuildID] });
  // @ts-expect-error
  await globalCommand?.permissions.remove({ command: globalCommandID, guild: testGuildID, users: [testUserID] });
  await globalCommand?.permissions.remove({
    // @ts-expect-error
    command: globalCommandID,
    guild: testGuildID,
    roles: [testGuildID],
    users: [testUserID],
  });
  await globalCommand?.permissions.set({
    // @ts-expect-error
    command: globalCommandID,
    guild: testGuildID,
    permissions: [{ type: 'ROLE', id: testGuildID, permission: true }],
  });

  // @ts-expect-error
  await globalCommand?.permissions.add({ permissions: [{ type: 'ROLE', id: testGuildID, permission: true }] });
  // @ts-expect-error
  await globalCommand?.permissions.has({ permissionsID: testGuildID });
  // @ts-expect-error
  await globalCommand?.permissions.fetch({});
  // @ts-expect-error
  await globalCommand?.permissions.remove({ roles: [testGuildID] });
  // @ts-expect-error
  await globalCommand?.permissions.remove({ users: [testUserID] });
  // @ts-expect-error
  await globalCommand?.permissions.remove({ roles: [testGuildID], users: [testUserID] });
  // @ts-expect-error
  await globalCommand?.permissions.set({ permissions: [{ type: 'ROLE', id: testGuildID, permission: true }] });

  // Permissions from cached guild ApplicationCommand
  await guildCommandFromGlobal?.permissions.add({ permissions: [{ type: 'ROLE', id: testGuildID, permission: true }] });
  await guildCommandFromGlobal?.permissions.has({ permissionsID: testGuildID });
  await guildCommandFromGlobal?.permissions.fetch({});
  await guildCommandFromGlobal?.permissions.remove({ roles: [testGuildID] });
  await guildCommandFromGlobal?.permissions.remove({ users: [testUserID] });
  await guildCommandFromGlobal?.permissions.remove({ roles: [testGuildID], users: [testUserID] });
  await guildCommandFromGlobal?.permissions.set({ permissions: [{ type: 'ROLE', id: testGuildID, permission: true }] });

  await guildCommandFromGlobal?.permissions.add({
    // @ts-expect-error
    command: globalCommandID,
    permissions: [{ type: 'ROLE', id: testGuildID, permission: true }],
  });
  // @ts-expect-error
  await guildCommandFromGlobal?.permissions.has({ command: guildCommandID, permissionsID: testGuildID });
  // @ts-expect-error
  await guildCommandFromGlobal?.permissions.remove({ command: guildCommandID, roles: [testGuildID] });
  // @ts-expect-error
  await guildCommandFromGlobal?.permissions.remove({ command: guildCommandID, users: [testUserID] });
  await guildCommandFromGlobal?.permissions.remove({
    // @ts-expect-error
    command: guildCommandID,
    roles: [testGuildID],
    users: [testUserID],
  });
  await guildCommandFromGlobal?.permissions.set({
    // @ts-expect-error
    command: guildCommandID,
    permissions: [{ type: 'ROLE', id: testGuildID, permission: true }],
  });

  await guildCommandFromGlobal?.permissions.add({
    // @ts-expect-error
    guild: testGuildID,
    permissions: [{ type: 'ROLE', id: testGuildID, permission: true }],
  });
  // @ts-expect-error
  await guildCommandFromGlobal?.permissions.has({ guild: testGuildID, permissionsID: testGuildID });
  // @ts-expect-error
  await guildCommandFromGlobal?.permissions.remove({ guild: testGuildID, roles: [testGuildID] });
  // @ts-expect-error
  await guildCommandFromGlobal?.permissions.remove({ guild: testGuildID, users: [testUserID] });
  // @ts-expect-error
  await guildCommandFromGlobal?.permissions.remove({ guild: testGuildID, roles: [testGuildID], users: [testUserID] });
  await guildCommandFromGlobal?.permissions.set({
    // @ts-expect-error
    guild: testGuildID,
    permissions: [{ type: 'ROLE', id: testGuildID, permission: true }],
  });

  await guildCommandFromGuild?.permissions.add({ permissions: [{ type: 'ROLE', id: testGuildID, permission: true }] });
  await guildCommandFromGuild?.permissions.has({ permissionsID: testGuildID });
  await guildCommandFromGuild?.permissions.fetch({});
  await guildCommandFromGuild?.permissions.remove({ roles: [testGuildID] });
  await guildCommandFromGuild?.permissions.remove({ users: [testUserID] });
  await guildCommandFromGuild?.permissions.remove({ roles: [testGuildID], users: [testUserID] });
  await guildCommandFromGuild?.permissions.set({ permissions: [{ type: 'ROLE', id: testGuildID, permission: true }] });

  await guildCommandFromGuild?.permissions.add({
    // @ts-expect-error
    command: globalCommandID,
    permissions: [{ type: 'ROLE', id: testGuildID, permission: true }],
  });
  // @ts-expect-error
  await guildCommandFromGuild?.permissions.has({ command: guildCommandID, permissionsID: testGuildID });
  // @ts-expect-error
  await guildCommandFromGuild?.permissions.remove({ command: guildCommandID, roles: [testGuildID] });
  // @ts-expect-error
  await guildCommandFromGuild?.permissions.remove({ command: guildCommandID, users: [testUserID] });
  await guildCommandFromGuild?.permissions.remove({
    // @ts-expect-error
    command: guildCommandID,
    roles: [testGuildID],
    users: [testUserID],
  });
  await guildCommandFromGuild?.permissions.set({
    // @ts-expect-error
    command: guildCommandID,
    permissions: [{ type: 'ROLE', id: testGuildID, permission: true }],
  });

  await guildCommandFromGuild?.permissions.add({
    // @ts-expect-error
    guild: testGuildID,
    permissions: [{ type: 'ROLE', id: testGuildID, permission: true }],
  });
  // @ts-expect-error
  await guildCommandFromGuild?.permissions.has({ guild: testGuildID, permissionsID: testGuildID });
  // @ts-expect-error
  await guildCommandFromGuild?.permissions.remove({ guild: testGuildID, roles: [testGuildID] });
  // @ts-expect-error
  await guildCommandFromGuild?.permissions.remove({ guild: testGuildID, users: [testUserID] });
  // @ts-expect-error
  await guildCommandFromGuild?.permissions.remove({ guild: testGuildID, roles: [testGuildID], users: [testUserID] });
  await guildCommandFromGuild?.permissions.set({
    // @ts-expect-error
    guild: testGuildID,
    permissions: [{ type: 'ROLE', id: testGuildID, permission: true }],
  });

  client.application?.commands.permissions.set({
    guild: testGuildID,
    fullPermissions: originalPermissions?.map((permissions, id) => ({ permissions, id })) ?? [],
  });
});

client.on('guildCreate', g => {
  const channel = g.channels.cache.random();
  if (!channel) return;

  channel.setName('foo').then(updatedChannel => {
    console.log(`New channel name: ${updatedChannel.name}`);
  });
});

client.on('messageReactionRemoveAll', async message => {
  console.log(`messageReactionRemoveAll - id: ${message.id} (${message.id.length})`);

  if (message.partial) message = await message.fetch();

  console.log(`messageReactionRemoveAll - content: ${message.content}`);
});

// This is to check that stuff is the right type
declare const assertIsMessage: (m: Promise<Message>) => void;

client.on('message', ({ channel }) => {
  assertIsMessage(channel.send('string'));
  assertIsMessage(channel.send({}));
  assertIsMessage(channel.send({ embeds: [] }));

  const attachment = new MessageAttachment('file.png');
  const embed = new MessageEmbed();
  assertIsMessage(channel.send({ files: [attachment] }));
  assertIsMessage(channel.send({ embeds: [embed] }));
  assertIsMessage(channel.send({ embeds: [embed], files: [attachment] }));

  // @ts-expect-error
  channel.send();
  // @ts-expect-error
  channel.send({ another: 'property' });
});

client.login('absolutely-valid-token');

// Test type transformation:
declare const assertType: <T>(value: T) => asserts value is T;
declare const serialize: <T>(value: T) => Serialized<T>;

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
