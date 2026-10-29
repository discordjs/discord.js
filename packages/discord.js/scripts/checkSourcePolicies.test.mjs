import assert from 'node:assert/strict';
import { execFile } from 'node:child_process';
import { mkdir, mkdtemp, readFile, rm, symlink, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join, resolve } from 'node:path';
import process from 'node:process';
import { test } from 'node:test';
import { promisify } from 'node:util';

const exec = promisify(execFile);
const checker = await readFile(new URL('checkSourcePolicies.mjs', import.meta.url), 'utf8');

async function fixture(context, { declarations = '', source = '', path = 'example.js', windowsPaths = false } = {}) {
  const root = await mkdtemp(join(tmpdir(), 'discord-source-policies-'));
  context.after(() => rm(root, { recursive: true, force: true }));
  await mkdir(join(root, 'scripts'));
  await mkdir(join(root, 'typings'));
  await mkdir(join(root, 'src', path, '..'), { recursive: true });
  await symlink(resolve(import.meta.dirname, '../node_modules'), join(root, 'node_modules'), 'junction');
  const script = windowsPaths
    ? checker.replace(
        'relative(sourceRoot, sourceFile.fileName)',
        "relative(sourceRoot, sourceFile.fileName).replaceAll('/', String.fromCharCode(92))",
      )
    : checker;
  await writeFile(join(root, 'scripts/checkSourcePolicies.mjs'), script);
  await writeFile(join(root, 'typings/index.d.ts'), declarations);
  await writeFile(join(root, 'src', path), source);
  return () => exec(process.execPath, [join(root, 'scripts/checkSourcePolicies.mjs')]);
}

for (const [name, declarations, message] of [
  ['method arrays', 'declare class C { method(value: string[]): void; }', 'must be readonly'],
  ['method collections', 'declare class C { method(value: Collection<string, string>): void; }', 'ReadonlyCollection'],
  ['function arrays', 'declare function f(value: string[]): void;', 'must be readonly'],
  ['function collections', 'declare function f(value: Collection<string, string>): void;', 'ReadonlyCollection'],
  ['interface arrays', 'interface I { value: string[]; }', 'must be readonly'],
  ['interface collections', 'interface I { value: Collection<string, string>; }', 'ReadonlyCollection'],
]) {
  test(`rejects mutable ${name}`, async context => {
    const run = await fixture(context, { declarations });
    await assert.rejects(run(), error => error.code === 1 && error.stderr.includes(message));
  });
}

test('accepts readonly declarations and existing exceptions', async context => {
  const run = await fixture(context, {
    declarations: `
      declare class C {
        method(value: readonly string[], collection: ReadonlyCollection<string, string>): string[];
        on(value: string[]): void;
        once(value: string[]): void;
        off(value: string[]): void;
        rest(...values: string[]): void;
      }
      declare function f(value: readonly string[]): string[];
      interface I { value: readonly string[]; collection: ReadonlyCollection<string, string>; }
      interface PartialPoll { answers: Collection<number, PartialPollAnswer>; }
    `,
  });
  await run();
});

for (const windowsPaths of [false, true]) {
  test(`allows handler exports with ${windowsPaths ? 'Windows' : 'POSIX'} separators`, async context => {
    const run = await fixture(context, {
      source: "'use strict'; module.exports = () => {};",
      path: 'client/websocket/handlers/READY.js',
      windowsPaths,
    });
    await run();
  });
}

test('rejects module.exports outside handlers', async context => {
  const run = await fixture(context, { source: "'use strict'; module.exports = {};" });
  await assert.rejects(run(), error => error.code === 1 && error.stderr.includes('Use named exports'));
});
