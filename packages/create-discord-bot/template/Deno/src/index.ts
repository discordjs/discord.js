import 'https://deno.land/std@0.199.0/dotenv/load.ts';
import { URL } from 'node:url';
import { Client, GatewayIntentBits } from 'npm:discord.js@^14.13.0';
import { loadCommands, loadEvents } from './util/loaders.ts';
import { registerEvents } from './util/registerEvents.ts';

// Initialize the client
const client = new Client({ intents: [GatewayIntentBits.Guilds] });

// Load the events and commands
const events = await loadEvents(new URL('events/', import.meta.url));
const commands = await loadCommands(new URL('commands/', import.meta.url));

// Register the event handlers
registerEvents(commands, events, client);

// Login to the client
void client.login(Deno.env.get('DISCORD_TOKEN'));
