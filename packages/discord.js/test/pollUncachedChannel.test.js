'use strict';

const { strictEqual, deepStrictEqual } = require('node:assert/strict');
const { Client, Message } = require('../src/index.js');

// Deterministic repro for #11645: a message with a poll whose channel is not cached.
const client = new Client({ intents: [] });
const channelId = '123456789012345678';
strictEqual(client.channels.cache.has(channelId), false);

const message = new Message(client, {
  id: '123456789012345679',
  channel_id: channelId,
  author: { id: '123456789012345680', username: 'test', discriminator: '0', avatar: null },
  type: 0,
  content: '',
  attachments: [],
  embeds: [],
  components: [],
  flags: 0,
  poll: {
    question: { text: 'Test question?' },
    answers: [
      { answer_id: 1, poll_media: { text: 'Yes' } },
      { answer_id: 2, poll_media: { text: 'No' } },
    ],
    expiry: '2026-10-02T00:00:00.000Z',
    allow_multiselect: false,
    layout_type: 1,
  },
});

strictEqual(message.poll.channelId, channelId);
strictEqual(message.poll.messageId, message.id);
strictEqual(message.poll.channel, null);
deepStrictEqual([...message.poll.answers.keys()], [1, 2]);
