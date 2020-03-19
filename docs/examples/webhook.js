'use strict';

/**
 * Send a message using a webhook
 */

// Import the discord.js module
const Discord = require('discord.js');
/*
 * Create a new webhook
 * The webhook's id and token can be found in the URL or when you request that URL, it can be found in the response body too.
 * https://discordapp.com/api/webhooks/12345678910/T0kEn0fw3Bh00K
 *                                     ^^^^^^^^^^  ^^^^^^^^^^^^ 
 *                                   Webhooks ID   Webhooks Token
 */
const hook = new Discord.WebhookClient('webhook id', 'webhook token');

// Send a message using the webhook
hook.send('I am now alive!');
