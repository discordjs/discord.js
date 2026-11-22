import { strictEqual } from 'node:assert/strict';
import { resolveGuildTemplateCode } from '../src/index.js';

strictEqual(await resolveGuildTemplateCode('https://discord.new/abc'), 'abc');
