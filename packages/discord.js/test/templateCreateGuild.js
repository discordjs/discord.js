'use strict';

const { token } = require('./auth');
const { Client, Events, GatewayIntentBits } = require('../src');

const client = new Client({ intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages] });

client
  .on(Events.ClientReady, () => console.log('ready'))
  .on(Events.MessageCreate, async message => {
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
      await client.destroy();
    }
  })
  .login(token)
  .catch(console.error);
