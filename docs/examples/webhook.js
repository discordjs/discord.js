'use strict';

/**
 * Send a message using a webhook
 */

// Import the discord.js module
const Discord = require('discord.js');
/*
 * Create a new webhook
 * The Webbooks ID and token can be found in the URL, when you request that URL, or in the response body.
 * https://discordapp.com/api/webhooks/12345678910/T0kEn0fw3Bh00K
 *                                     ^^^^^^^^^^  ^^^^^^^^^^^^ 
 *                                     Webhook ID  Webhook Token
 */
const hook = new Discord.WebhookClient('webhook id', 'webhook token');

// Send a message using the webhook
hook.send('I am now alive!');
