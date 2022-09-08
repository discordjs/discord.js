import { createServer } from 'node:http';
import process from 'node:process';
import { proxyRequests } from '@discordjs/proxy';
import { REST } from '@discordjs/rest';

if (!process.env.DISCORD_TOKEN) {
	throw new Error('A DISCORD_TOKEN env var is required');
}

// We want to let upstream handle retrying
const api = new REST({ rejectOnRateLimit: () => true, retries: 0 }).setToken(process.env.DISCORD_TOKEN);
const server = createServer(proxyRequests(api));

const port = Number.parseInt(process.env.PORT ?? '8080', 10);
server.listen(port, () => console.log(`Listening on port ${port}`));
