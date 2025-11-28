import { cp } from 'node:fs/promises';

const rawIndexDTS = new URL('../typings/index.d.ts', import.meta.url);
const rawIndexMTS = new URL('../typings/index.d.mts', import.meta.url);

await cp(rawIndexDTS, rawIndexMTS);
