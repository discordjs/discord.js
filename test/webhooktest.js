'use strict';

const fs = require('fs');
const path = require('path');
const util = require('util');
const fetch = require('node-fetch');
const { owner, token, webhookChannel, webhookToken } = require('./auth.js');
const { Client, Intents, MessageAttachment, MessageEmbed, WebhookClient } = require('../src');

const client = new Client({ intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES] });

const buffer = l => fetch(l).then(res => res.buffer());
const read = util.promisify(fs.readFile);
const readStream = fs.createReadStream;
const wait = util.promisify(setTimeout);

const linkA = 'https://lolisafe.moe/iiDMtAXA.png';
const linkB = 'https://lolisafe.moe/9hSpedPh.png';
const fileA = path.join(__dirname, 'blobReach.png');

const embed = () => new MessageEmbed();
const attach = (attachment, name) => new MessageAttachment(attachment, name);

const tests = [
  (m, hook) => hook.send('x'),
  (m, hook) => hook.send('x', { code: true }),
  (m, hook) => hook.send('1', { code: 'js' }),
  (m, hook) => hook.send('x', { code: '' }),

  (m, hook) => hook.send({ embeds: [{ description: 'a' }] }),
  (m, hook) => hook.send({ files: [{ attachment: linkA }] }),
  (m, hook) =>
    hook.send({
      embeds: [{ description: 'a' }],
      files: [{ attachment: linkA, name: 'xyz.png' }],
    }),

  (m, hook) => hook.send('x', embed().setDescription('a')),
  (m, hook) => hook.send(embed().setDescription('a')),
  (m, hook) => hook.send({ embeds: [embed().setDescription('a')] }),
  (m, hook) => hook.send([embed().setDescription('a'), embed().setDescription('b')]),

  (m, hook) => hook.send('x', attach(linkA)),
  (m, hook) => hook.send(attach(linkA)),
  (m, hook) => hook.send({ files: [linkA] }),
  (m, hook) => hook.send({ files: [attach(linkA)] }),
  async (m, hook) => hook.send(attach(await buffer(linkA))),
  async (m, hook) => hook.send({ files: [await buffer(linkA)] }),
  async (m, hook) => hook.send({ files: [{ attachment: await buffer(linkA) }] }),
  (m, hook) => hook.send([attach(linkA), attach(linkB)]),

  (m, hook) => hook.send(embed().setDescription('a')),

  (m, hook) => hook.send({ embeds: [{ description: 'a' }] }),
  (m, hook) => hook.send(embed().setDescription('a')),

  (m, hook) => hook.send('x', [embed().setDescription('a'), attach(linkB)]),
  (m, hook) => hook.send('x', [attach(linkA), attach(linkB)]),

  (m, hook) => hook.send([embed().setDescription('a'), attach(linkB)]),
  (m, hook) =>
    hook.send({
      embeds: [embed().setImage('attachment://two.png')],
      files: [attach(linkB, 'two.png')],
    }),
  (m, hook) =>
    hook.send({
      embeds: [
        embed()
          .setImage('attachment://two.png')
          .attachFiles([attach(linkB, 'two.png')]),
      ],
    }),
  async (m, hook) =>
    hook.send(['x', 'y', 'z'], {
      code: 'js',
      embeds: [
        embed()
          .setImage('attachment://two.png')
          .attachFiles([attach(linkB, 'two.png')]),
      ],
      files: [{ attachment: await buffer(linkA) }],
    }),

  (m, hook) => hook.send('x', attach(fileA)),
  (m, hook) => hook.send({ files: [fileA] }),
  (m, hook) => hook.send(attach(fileA)),
  async (m, hook) => hook.send({ files: [await read(fileA)] }),

  (m, hook) => hook.send('x', attach(readStream(fileA))),
  (m, hook) => hook.send({ files: [readStream(fileA)] }),
  (m, hook) => hook.send({ files: [{ attachment: readStream(fileA) }] }),
  (m, hook) => hook.send('Done!'),
];

client.on('messageCreate', async message => {
  if (message.author.id !== owner) return;
  const match = message.content.match(/^do (.+)$/);
  const hooks = [
    { type: 'WebhookClient', hook: new WebhookClient(webhookChannel, webhookToken) },
    { type: 'TextChannel#fetchWebhooks', hook: await message.channel.fetchWebhooks().then(x => x.first()) },
    { type: 'Guild#fetchWebhooks', hook: await message.guild.fetchWebhooks().then(x => x.first()) },
  ];
  if (match && match[1] === 'it') {
    /* eslint-disable no-await-in-loop */
    for (const { type, hook } of hooks) {
      for (const [i, test] of tests.entries()) {
        await message.channel.send(`**#${i}-Hook: ${type}**\n\`\`\`js\n${test.toString()}\`\`\``);
        await test(message, hook).catch(e => message.channel.send(`Error!\n\`\`\`\n${e}\`\`\``));
        await wait(1000);
      }
    }
    /* eslint-enable no-await-in-loop */
  } else if (match) {
    const n = parseInt(match[1]) || 0;
    const test = tests.slice(n)[0];
    const i = tests.indexOf(test);
    /* eslint-disable no-await-in-loop */
    for (const { type, hook } of hooks) {
      await message.channel.send(`**#${i}-Hook: ${type}**\n\`\`\`js\n${test.toString()}\`\`\``);
      await test(message, hook).catch(e => message.channel.send(`Error!\n\`\`\`\n${e}\`\`\``));
    }
    /* eslint-enable no-await-in-loop */
  }
});

client.login(token);
