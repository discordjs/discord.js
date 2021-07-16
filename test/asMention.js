'use strict';

const assert = require('assert');
const { token } = require('./auth');
const { Client, Intents } = require('../src');

const client = new Client({ intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES] });

client.on('ready', async () => {
  try {
    
    assert.strict(client.user.asMention, `<@${client.user.id}>`);
    
  } catch (error) {
    console.error(error);
  } finally {
    client.destroy();
  }
});

client.login(token).catch(console.error);
