import { cp } from 'node:fs/promises';
import { URL } from 'node:url';

const rawIndexDTS = new URL('../typings/index.d.ts', import.meta.url);
const rawIndexMTS = new URL('../typings/index.d.mts', import.meta.url);

await cp(rawIndexDTS, rawIndexMTS);
