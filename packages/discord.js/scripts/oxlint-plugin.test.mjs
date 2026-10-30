import assert from 'node:assert/strict';
import { execFile } from 'node:child_process';
import { mkdir, mkdtemp, rm, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { dirname, join, resolve } from 'node:path';
import process from 'node:process';
import { describe, it, test } from 'node:test';
import { fileURLToPath } from 'node:url';
import { promisify } from 'node:util';
import { RuleTester } from 'oxlint/plugins-dev';
import plugin from './oxlint-plugin.mjs';

RuleTester.describe = describe;
RuleTester.it = it;

const tester = new RuleTester({ languageOptions: { parserOptions: { lang: 'ts' } } });

tester.run('require-strict', plugin.rules['require-strict'], {
  valid: ['', "'use strict'; const value = 1;"],
  invalid: [
    { code: 'const value = 1;', errors: [/must begin with 'use strict'/] },
    { code: "'other'; 'use strict';", errors: [/must begin with 'use strict'/] },
  ],
});

tester.run('named-exports', plugin.rules['named-exports'], {
  valid: ['exports.value = 1;', 'module.exports.value = 1;', "module['exports'] = {};"],
  invalid: [{ code: 'module.exports = {};', errors: [/Use named exports/] }],
});

tester.run('destructure-local-require', plugin.rules['destructure-local-require'], {
  valid: ["const { value } = require('./local');", "const value = require('external');"],
  invalid: [
    { code: "const value = require('./local');", errors: [/Use object destructuring/] },
    { code: "const value = require('../local');", errors: [/Use object destructuring/] },
  ],
});

tester.run('readonly-arrays', plugin.rules['readonly-arrays'], {
  valid: [
    'declare class C { method(value: readonly string[]): string[]; }',
    'declare function f(value: readonly string[]): string[];',
    'interface I { value: readonly string[]; }',
    'declare class C { on(value: string[]): void; once(value: string[]): void; off(value: string[]): void; }',
    'declare class C { rest(...values: string[]): void; }',
  ],
  invalid: [
    { code: 'declare class C { method(value: string[]): void; }', errors: [/must be readonly/] },
    { code: 'declare function f(value: string[]): void;', errors: [/must be readonly/] },
    { code: 'interface I { value: string[]; }', errors: [/must be readonly/] },
    { code: 'declare function f(value: string[] | null): void;', errors: [/must be readonly/] },
    { code: 'interface I { value: { nested: string[] }; }', errors: [/must be readonly/] },
  ],
});

tester.run('readonly-collections', plugin.rules['readonly-collections'], {
  valid: [
    'declare class C { method(value: ReadonlyCollection<string, string>): Collection<string, string>; }',
    'declare function f(value: ReadonlyCollection<string, string>): Collection<string, string>;',
    'interface I { value: ReadonlyCollection<string, string>; }',
  ],
  invalid: [
    { code: 'declare class C { method(value: Collection<string, string>): void; }', errors: [/ReadonlyCollection/] },
    { code: 'declare class C { on(value: Collection<string, string>): void; }', errors: [/ReadonlyCollection/] },
    { code: 'declare function f(value: Collection<string, string>): void;', errors: [/ReadonlyCollection/] },
    { code: 'interface I { value: Collection<string, string>; }', errors: [/ReadonlyCollection/] },
  ],
});

const exec = promisify(execFile);
const repositoryRoot = resolve(import.meta.dirname, '../../..');
const oxlint = join(dirname(fileURLToPath(import.meta.resolve('oxlint/package.json'))), 'bin/oxlint');

test('repository config scopes rules, allows handler exports, and honors inline exceptions', async context => {
  const root = await mkdtemp(join(tmpdir(), 'discord-oxlint-'));
  context.after(() => rm(root, { recursive: true, force: true }));
  const files = {
    'packages/discord.js/src/client/websocket/handlers/READY.js': "'use strict'; module.exports = () => {};",
    'packages/discord.js/src/client/websocket/handlers-extra/invalid.js': "'use strict'; module.exports = {};",
    'packages/discord.js/typings/invalid.d.ts': 'declare function invalid(value: string[]): void;',
    'packages/discord.js/typings/invalid.d.mts': 'declare function invalid(value: Collection<string, string>): void;',
    'packages/discord.js/typings/exception.d.ts': `interface PartialPoll {
      // oxlint-disable-next-line discordjs/readonly-collections -- Retain the mutable answers collection.
      answers: Collection<number, PartialPollAnswer>;
    }`,
    'packages/other/src/unaffected.js': 'module.exports = {};',
  };
  for (const [path, code] of Object.entries(files)) {
    await mkdir(dirname(join(root, path)), { recursive: true });
    await writeFile(join(root, path), code);
  }
  // Keep the repository's file overrides while isolating these fixtures from preset rules.
  await writeFile(
    join(root, 'oxlint.config.ts'),
    `import config from ${JSON.stringify(join(repositoryRoot, 'oxlint.config.ts'))};
     export default {
       ...config, extends: [], rules: {},
       jsPlugins: [${JSON.stringify(join(repositoryRoot, 'packages/discord.js/scripts/oxlint-plugin.mjs'))}],
       overrides: config.overrides.map(override => ({
         files: override.files,
         rules: Object.fromEntries(Object.entries(override.rules).filter(([name]) => name.startsWith('discordjs/'))),
       })),
     };`,
  );
  await assert.rejects(
    exec(process.execPath, [oxlint, '-c', 'oxlint.config.ts', '-f', 'json', '.'], { cwd: root }),
    error => {
      assert.ok(error.stdout.startsWith('{'), error.stdout + error.stderr);
      const { diagnostics } = JSON.parse(error.stdout);
      assert.equal(error.code, 1);
      assert.deepEqual(
        diagnostics.map(diagnostic => [diagnostic.filename.replaceAll('\\', '/'), diagnostic.code]).sort(),
        [
          ['packages/discord.js/src/client/websocket/handlers-extra/invalid.js', 'discordjs(named-exports)'],
          ['packages/discord.js/typings/invalid.d.mts', 'discordjs(readonly-collections)'],
          ['packages/discord.js/typings/invalid.d.ts', 'discordjs(readonly-arrays)'],
        ],
      );
      return true;
    },
  );
});
