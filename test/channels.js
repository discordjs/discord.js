'use strict';

const assert = require('assert');
const { token, test_guild_id } = require('./auth');
const { Client } = require('../src');

// Create client
const client = new Client({});

// Test role create and deletion
client.on('ready', async () => {

  try {

    // Fetch guild to use
    const guild = await client.guilds.fetch(test_guild_id);

    // Create a new text channel
    let t_channel = await guild.channels.create('test-text-channel', {
        type: 'text',
        topic: 'A new super cool text channel'
    });
    // Check to make sure the channel was created successfully
    assert.strictEqual(t_channel.name, 'test-text-channel')
    assert.strictEqual(t_channel.type, 'text');
    assert.strictEqual(t_channel.topic, 'A new super cool text channel');

    // Create a new voice channel
    let vc_channel = await guild.channels.create('test voice channel', {
        type: 'voice'
    });
    // Check to make sure the channel was created successfully
    assert.strictEqual(vc_channel.name, 'test voice channel')
    assert.strictEqual(vc_channel.type, 'voice');

    // Edit the text channel
    await t_channel.edit({
        name: 'new-test-text-channel',
        topic: 'this is a new topic',
        nsfw: true
    });
    // Check to make sure the channel was edited successfully
    assert.strictEqual(t_channel.name, 'new-test-text-channel');
    assert.strictEqual(t_channel.topic, 'this is a new topic');
    assert.strictEqual(t_channel.nsfw, true);

    // Edit the voice channel
    await vc_channel.edit({
        name: 'new test voice channel'
    });
    // Check to make sure the channel was edited successfully
    assert.strictEqual(vc_channel.name, 'new test voice channel');

    // Delete both channels
    await t_channel.delete();
    await vc_channel.delete();

    // Check if both were deleted
    assert.strictEqual(t_channel.deleted, true);
    assert.strictEqual(vc_channel.deleted, true);

  } catch (error) {
    console.error(error);
  }

  // Destroy client and end test
  client.destroy();

});

client.login(token).catch(console.error);
