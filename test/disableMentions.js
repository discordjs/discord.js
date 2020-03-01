'use strict';

const { token, prefix } = require('./auth');
const Discord = require('../src');
const { Util } = Discord;

const client = new Discord.Client({
  // To see a difference, comment out disableMentions and run the same tests using disableEveryone
  // You will notice that all messages will mention @everyone
  // disableEveryone: true
  disableMentions: 'everyone',
});

const tests = [
  // Test 1
  // See https://github.com/discordapp/discord-api-docs/issues/1189
  '@\u202eeveryone @\u202ehere',

  // Test 2
  // See https://github.com/discordapp/discord-api-docs/issues/1241
  // TL;DR: Characters like \u0300 will only be stripped if more than 299 are present
  `${'\u0300@'.repeat(150)}@\u0300everyone @\u0300here`,

  // Test 3
  // Normal @everyone/@here mention
  '@everyone @here',
];

client.on('ready', () => console.log('Ready!'));

client.on('message', message => {
  // Check if message starts with prefix
  if (!message.content.startsWith(prefix)) return;
  const [command, ...args] = message.content.substr(prefix.length).split(' ');

  // Clean content and log each character
  console.log(Util.cleanContent(args.join(' '), message).split(''));

  if (command === 'test1') message.reply(tests[0]);
  else if (command === 'test2') message.reply(tests[1]);
  else if (command === 'test3') message.reply(tests[2]);
});

client.login(token).catch(console.error);
