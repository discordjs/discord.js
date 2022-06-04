import { createServer } from 'node:http';
import { proxyRequests } from '@discordjs/proxy';
import { REST } from '@discordjs/rest';

// We want to let upstream handle retrying
const api = new REST({ rejectOnRateLimit: () => true, retries: 0 });
// eslint-disable-next-line @typescript-eslint/no-misused-promises
const server = createServer(proxyRequests(api));
server.listen(parseInt(process.env.PORT ?? '8080', 10));
