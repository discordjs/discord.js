const Discord = require('../src');
const { owner, token } = require('./auth.js');

const fetch = require('node-fetch');
const fs = require('fs');
const util = require('util');

const client = new Discord.Client();

const fill = c => Array(4).fill(c.repeat(1000));
const buffer = l => fetch(l).then(res => res.buffer());
const read = util.promisify(fs.readFile);
const readStream = fs.createReadStream;
const wait = util.promisify(setTimeout);

const linkA = 'https://lolisafe.moe/iiDMtAXA.png';
const linkB = 'https://lolisafe.moe/9hSpedPh.png';
const fileA = './test/blobReach.png';

const Embed = Discord.MessageEmbed;
const Attachment = Discord.MessageAttachment;

const tests = [
  m => m.channel.send('x'),
  m => m.channel.send(['x', 'y']),

  m => m.channel.send('x', { code: true }),
  m => m.channel.send('1', { code: 'js' }),
  m => m.channel.send('x', { code: '' }),

  m => m.channel.send(fill('x'), { split: true }),
  m => m.channel.send(fill('1'), { code: 'js', split: true }),
  m => m.channel.send(fill('x'), { reply: m.author, code: 'js', split: true }),
  m => m.channel.send(fill('xyz '), { split: { char: ' ' } }),

  m => m.channel.send('x', { embed: { description: 'a' } }),
  m => m.channel.send({ embed: { description: 'a' } }),
  m => m.channel.send({ files: [{ attachment: linkA }] }),
  m => m.channel.send({
    embed: { description: 'a' },
    files: [{ attachment: linkA, name: 'xyz.png' }],
  }),

  m => m.channel.send('x', new Embed().setDescription('a')),
  m => m.channel.send(new Embed().setDescription('a')),
  m => m.channel.send({ embed: new Embed().setDescription('a') }),
  m => m.channel.send([new Embed().setDescription('a'), new Embed().setDescription('b')]),

  m => m.channel.send('x', new Attachment(linkA)),
  m => m.channel.send(new Attachment(linkA)),
  m => m.channel.send({ files: [linkA] }),
  m => m.channel.send({ files: [new Attachment(linkA)] }),
  async m => m.channel.send(new Attachment(await buffer(linkA))),
  async m => m.channel.send({ files: [await buffer(linkA)] }),
  async m => m.channel.send({ files: [{ attachment: await buffer(linkA) }] }),
  m => m.channel.send([new Attachment(linkA), new Attachment(linkB)]),

  m => m.channel.send({ embed: { description: 'a' } }).then(m2 => m2.edit('x')),
  m => m.channel.send(new Embed().setDescription('a')).then(m2 => m2.edit('x')),
  m => m.channel.send({ embed: new Embed().setDescription('a') }).then(m2 => m2.edit('x')),

  m => m.channel.send('x').then(m2 => m2.edit({ embed: { description: 'a' } })),
  m => m.channel.send('x').then(m2 => m2.edit(new Embed().setDescription('a'))),
  m => m.channel.send('x').then(m2 => m2.edit({ embed: new Embed().setDescription('a') })),

  m => m.channel.send({ embed: { description: 'a' } }).then(m2 => m2.edit({ embed: null })),
  m => m.channel.send(new Embed().setDescription('a')).then(m2 => m2.edit({ embed: null })),

  m => m.channel.send(['x', 'y'], [new Embed().setDescription('a'), new Attachment(linkB)]),
  m => m.channel.send(['x', 'y'], [new Attachment(linkA), new Attachment(linkB)]),

  m => m.channel.send([new Embed().setDescription('a'), new Attachment(linkB)]),
  m => m.channel.send({
    embed: new Embed().setImage('attachment://two.png'),
    files: [new Attachment(linkB, 'two.png')],
  }),
  m => m.channel.send({
    embed: new Embed()
      .setImage('attachment://two.png')
      .attachFiles([new Attachment(linkB, 'two.png')]),
  }),
  async m =>
    m.channel.send(['x', 'y', 'z'], {
      code: 'js',
      embed: new Embed()
        .setImage('attachment://two.png')
        .attachFiles([new Attachment(linkB, 'two.png')]),
      files: [{ attachment: await buffer(linkA) }],
    }),

  m => m.channel.send('x', new Attachment(fileA)),
  m => m.channel.send({ files: [fileA] }),
  m => m.channel.send(new Attachment(fileA)),
  async m => m.channel.send({ files: [await read(fileA)] }),
  async m =>
    m.channel.send(fill('x').join('\n'), {
      reply: m.author,
      code: 'js',
      split: true,
      embed: new Embed().setImage('attachment://zero.png'),
      files: [new Attachment(await buffer(linkA), 'zero.png')],
    }),

  m => m.channel.send('x', new Attachment(readStream(fileA))),
  m => m.channel.send({ files: [readStream(fileA)] }),

  m => m.channel.send('Done!'),
];

client.on('message', async message => {
  if (message.author.id !== owner) return;
  const match = message.content.match(/^do (.+)$/);
  if (match && match[1] === 'it') {
    for (const [i, test] of tests.entries()) {
      await message.channel.send(`**#${i}**\n\`\`\`js\n${test.toString()}\`\`\``);
      await test(message).catch(e => message.channel.send(`Error!\n\`\`\`\n${e}\`\`\``));
      await wait(1000);
    }
  } else if (match) {
    const i = parseInt(match[1]) || 0;
    const test = tests.slice(i)[0];
    await message.channel.send(`**#${i}**\n\`\`\`js\n${test.toString()}\`\`\``);
    await test(message).catch(e => message.channel.send(`Error!\n\`\`\`\n${e}\`\`\``));
  }
});

client.login(token);

// eslint-disable-next-line no-console
process.on('unhandledRejection', console.error);
