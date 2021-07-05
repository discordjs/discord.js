'use strict';

const { token } = require('./auth');
const { Client } = require('../src');

const client = new Client({ intents: ['GUILDS', 'GUILD_MESSAGES'] });
client
  .on('ready', () => console.log('ready'))
  .on('messageCreate', async message => {
    try {
      const templates = await message.guild.fetchTemplates();
      if (!templates.size) {
        console.log('no templates');
      } else {
        const guild = await templates.first().createGuild('guild name');
        console.log(`created guild with id ${guild.id}`);
        await guild.delete();
        console.log('deleted guild');
      }
    } catch (error) {
      console.error(error);
    } finally {
      client.destroy();
    }
  })
  .login(token)
  .catch(console.error);
