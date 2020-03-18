'use strict';

/**
 * Send a message using a webhook
 */

// Import the discord.js module
const Discord = require('discord.js');
/*
 * Create a new webhook
 * Your webhook's id and token can be found at the URL or in the response body
 * https://discordapp.com/api/webhooks/12345678910/T0kEn0fw3Bh00K
 *                                     ^^^^^^^^^^  ^^^^^^^^^^^^ 
 *                                   Webhook's ID   Webhook's Token
 */
const hook = new Discord.WebhookClient('webhook id', 'webhook token');

// Send a message using the webhook
hook.send('I am now alive!');
