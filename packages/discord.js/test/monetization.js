'use strict';

const { token, owner } = require('./auth.js');
const { Client, Events, codeBlock, GatewayIntentBits } = require('../src');

const client = new Client({ intents: GatewayIntentBits.Guilds | GatewayIntentBits.GuildMessages });

client.on('raw', console.log);

client.on(Events.ClientReady, async () => {
  const commands = await client.application.commands.fetch();
  if (!commands.size) {
    await client.application.commands.set([
      {
        name: 'test',
        description: 'yeet',
      },
    ]);
  }

  const skus = await client.application.fetchSKUs();
  console.log('skus', skus);

  const entitlements = await client.application.entitlements.fetch();
  console.log('entitlements', entitlements);
});

client.on(Events.EntitlementCreate, entitlement => console.log('EntitlementCreate', entitlement));
client.on(Events.EntitlementDelete, entitlement => console.log('EntitlementDelete', entitlement));
client.on(Events.EntitlementUpdate, (oldEntitlement, newEntitlement) =>
  console.log('EntitlementUpdate', oldEntitlement, newEntitlement),
);

client.on(Events.InteractionCreate, async interaction => {
  console.log('interaction.entitlements', interaction.entitlements);

  if (interaction.commandName === 'test') {
    await interaction.sendPremiumRequired();
  }
});

client.on(Events.MessageCreate, async message => {
  const prefix = `<@${client.user.id}> `;

  if (message.author.id !== owner || !message.content.startsWith(prefix)) return;
  let res;
  try {
    res = await eval(message.content.slice(prefix.length));
    if (typeof res !== 'string') res = require('node:util').inspect(res);
  } catch (err) {
    // eslint-disable-next-line no-console
    console.error(err.stack);
    res = err.message;
  }

  await message.channel.send(codeBlock('js', res));
});

client.login(token);
