/* eslint no-console: 0 */

/**
 * This file tests ECMAScript Modules support in discord.js
 * https://nodejs.org/dist/latest-v10.x/docs/api/esm.html
 */
import { Client } from '../';
import { token } from './auth';

const client = new Client();

client.on('ready', () => {
  console.log(`Ready with ${client.users.size} users!`);
  console.log('Exiting proccess with code 0...');
  process.exit(0);
});

client.login(token).then(console.log, console.error);
