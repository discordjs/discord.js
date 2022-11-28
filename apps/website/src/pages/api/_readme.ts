import { join } from 'node:path';
// eslint-disable-next-line n/prefer-global/process
import { cwd } from 'node:process';

join(cwd(), '..', '..', 'packages', 'brokers', 'README.md');
join(cwd(), '..', '..', 'packages', 'builders', 'README.md');
join(cwd(), '..', '..', 'packages', 'collection', 'README.md');
join(cwd(), '..', '..', 'packages', 'core', 'README.md');
join(cwd(), '..', '..', 'packages', 'proxy', 'README.md');
join(cwd(), '..', '..', 'packages', 'rest', 'README.md');
join(cwd(), '..', '..', 'packages', 'util', 'README.md');
join(cwd(), '..', '..', 'packages', 'voice', 'README.md');
join(cwd(), '..', '..', 'packages', 'ws', 'README.md');
