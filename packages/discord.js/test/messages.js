'use strict';

const { Buffer } = require('node:buffer');
const { createReadStream } = require('node:fs');
const { readFile } = require('node:fs/promises');
const path = require('node:path');
const process = require('node:process');
const { setTimeout: sleep } = require('node:timers/promises');
const { fetch } = require('undici');
const {
  Client,
  GatewayIntentBits,
  AttachmentBuilder,
  EmbedBuilder,
  MessageFlags,
  ComponentType,
} = require('../src/index.js');

const client = new Client({
  intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages, GatewayIntentBits.MessageContent],
});

const buffer = l =>
  fetch(l)
    .then(res => res.arrayBuffer())
    .then(Buffer.from);

const linkA = 'https://discord.js.org/static/logo.svg';
const fileA = path.join(__dirname, 'blobReach.png');

const embed = () => new EmbedBuilder();
const attach = (attachment, name) => new AttachmentBuilder(attachment, { name });

const tests = [
  m => m.channel.send('x'),

  m => m.channel.send({ content: 'x', embeds: [{ description: 'a' }] }),
  m => m.channel.send({ embeds: [{ description: 'a' }] }),
  m => m.channel.send({ files: [{ attachment: fileA }] }),
  m =>
    m.channel.send({
      embeds: [{ description: 'a' }],
      files: [{ attachment: fileA, name: 'xyz.png' }],
    }),

  m => m.channel.send({ content: 'x', embeds: [embed().setDescription('a')] }),
  m => m.channel.send({ embeds: [embed().setDescription('a')] }),
  m => m.channel.send({ embeds: [embed().setDescription('a'), embed().setDescription('b')] }),

  m => m.channel.send({ content: 'x', files: [attach(fileA)] }),
  m => m.channel.send({ files: [fileA] }),
  m => m.channel.send({ files: [attach(fileA)] }),
  async m => m.channel.send({ files: [await buffer(linkA)] }),
  async m => m.channel.send({ files: [{ attachment: await buffer(linkA) }] }),
  m => m.channel.send({ files: [attach(fileA), attach(fileA)] }),

  m => m.channel.send({ embeds: [{ description: 'a' }] }).then(m2 => m2.edit('x')),
  m => m.channel.send({ embeds: [embed().setDescription('a')] }).then(m2 => m2.edit('x')),

  m => m.channel.send('x').then(m2 => m2.edit({ embeds: [{ description: 'a' }] })),
  m => m.channel.send('x').then(m2 => m2.edit({ embeds: [embed().setDescription('a')] })),

  m => m.channel.send({ embeds: [{ description: 'a' }] }).then(m2 => m2.edit({ content: 'x', embeds: [] })),
  m => m.channel.send({ embeds: [embed().setDescription('a')] }).then(m2 => m2.edit({ content: 'x', embeds: [] })),

  m => m.channel.send({ content: 'x', embeds: [embed().setDescription('a')], files: [attach(fileA)] }),
  m => m.channel.send({ content: 'x', files: [attach(fileA), attach(fileA)] }),

  m => m.channel.send({ embeds: [embed().setDescription('a')], files: [attach(fileA)] }),
  m =>
    m.channel.send({
      embeds: [embed().setImage('attachment://two.png')],
      files: [attach(fileA, 'two.png')],
    }),
  m => m.channel.send({ content: 'x', files: [attach(fileA)] }),
  m => m.channel.send({ files: [fileA] }),
  m => m.channel.send({ files: [attach(fileA)] }),
  async m => m.channel.send({ files: [await readFile(fileA)] }),

  m => m.channel.send({ content: 'x', files: [attach(createReadStream(fileA))] }),
  m => m.channel.send({ files: [createReadStream(fileA)] }),
  m => m.channel.send({ files: [{ attachment: createReadStream(fileA) }] }),

  m => m.reply({ content: 'x', allowedMentions: { repliedUser: false } }),
  m => m.reply({ content: 'x', allowedMentions: { repliedUser: true } }),
  m => m.reply({ content: 'x' }),
  m => m.reply({ content: `${m.author}`, allowedMentions: { repliedUser: false } }),
  m => m.reply({ content: `${m.author}`, allowedMentions: { parse: ['users'], repliedUser: false } }),
  m => m.reply({ content: `${m.author}`, allowedMentions: { parse: ['users'], repliedUser: true } }),
  m => m.reply({ content: `${m.author}` }),

  m => m.edit({ flags: MessageFlags.SuppressEmbeds }),
  m => m.edit({ flags: MessageFlags.SuppressEmbeds, allowedMentions: { repliedUser: false } }),

  m =>
    m
      .reply({ content: 'x', allowedMentions: { repliedUser: false } })
      .then(msg => msg.edit({ content: 'a', allowedMentions: { repliedUser: true } })),

  m =>
    m.channel.send({
      components: [{ type: ComponentType.TextDisplay, content: `${m.author}` }],
      flags: MessageFlags.IsComponentsV2,
    }),
  m =>
    m.channel.send({
      components: [{ type: ComponentType.TextDisplay, content: `${m.author}` }],
      flags: MessageFlags.IsComponentsV2,
      allowedMentions: { parse: ['users'] },
    }),
  m =>
    m.channel.send({
      components: [{ type: ComponentType.TextDisplay, content: `${m.author}` }],
      flags: MessageFlags.IsComponentsV2,
      allowedMentions: { parse: [] },
    }),
  m =>
    m.reply({
      components: [{ type: ComponentType.TextDisplay, content: `${m.author}` }],
      flags: MessageFlags.IsComponentsV2,
      allowedMentions: { parse: [], repliedUser: true },
    }),
  m =>
    m.reply({
      components: [{ type: ComponentType.TextDisplay, content: `${m.author}` }],
      flags: MessageFlags.IsComponentsV2,
      allowedMentions: { parse: [], repliedUser: false },
    }),

  m => m.channel.send('Done!'),
];

client.on('messageCreate', async message => {
  if (message.author.id !== process.env.OWNER) return;
  const match = message.content.match(/^do (.+)$/);
  if (match?.[1] === 'it') {
    /* eslint-disable no-await-in-loop */
    for (const [i, test] of tests.entries()) {
      await message.channel.send(`**#${i}**\n\`\`\`js\n${test.toString()}\`\`\``);
      await test(message).catch(e => message.channel.send(`Error!\n\`\`\`\n${e}\`\`\``));
      await sleep(1_000);
    }
    /* eslint-enable no-await-in-loop */
  } else if (match) {
    const n = parseInt(match[1]) || 0;
    const test = tests.slice(n)[0];
    const i = tests.indexOf(test);
    await message.channel.send(`**#${i}**\n\`\`\`js\n${test.toString()}\`\`\``);
    await test(message).catch(e => message.channel.send(`Error!\n\`\`\`\n${e}\`\`\``));
  }
});

client.login();

// eslint-disable-next-line no-console
process.on('unhandledRejection', console.error);
