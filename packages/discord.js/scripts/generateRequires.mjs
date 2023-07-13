import { readdir, writeFile } from 'node:fs/promises';

async function writeWebsocketHandlerImports() {
  const lines = ["'use strict';\n", 'const handlers = Object.fromEntries(['];

  const handlersDirectory = new URL('../src/client/websocket/handlers', import.meta.url);

  for (const file of await (await readdir(handlersDirectory)).sort()) {
    if (file === 'index.js') continue;

    lines.push(`  ['${file.slice(0, -3)}', require('./${file.slice(0, -3)}')],`);
  }

  lines.push(']);\n\nmodule.exports = handlers;\n');

  const outputFile = new URL('../src/client/websocket/handlers/index.js', import.meta.url);

  await writeFile(outputFile, lines.join('\n'));
}

async function writeClientActionImports() {
  const lines = [
    "'use strict';\n",
    'class ActionsManager {',
    '  // These symbols represent fully built data that we inject at times when calling actions manually.',
    '  // Action#getUser, for example, will return the injected data (which is assumed to be a built structure)',
    '  // instead of trying to make it from provided data',
    "  injectedUser = Symbol('djs.actions.injectedUser');",
    "  injectedChannel = Symbol('djs.actions.injectedChannel');",
    "  injectedMessage = Symbol('djs.actions.injectedMessage');\n",
    '  constructor(client) {',
    '    this.client = client;\n',
  ];

  const actionsDirectory = new URL('../src/client/actions', import.meta.url);
  for (const file of (await readdir(actionsDirectory)).sort()) {
    if (file === 'Action.js' || file === 'ActionsManager.js') continue;

    lines.push(`    this.register(require('./${file.slice(0, -3)}'));`);
  }

  lines.push('  }\n');
  lines.push('  register(Action) {');
  lines.push("    this[Action.name.replace(/Action$/, '')] = new Action(this.client);");
  lines.push('  }');
  lines.push('}\n');
  lines.push('module.exports = ActionsManager;\n');

  const outputFile = new URL('../src/client/actions/ActionsManager.js', import.meta.url);

  await writeFile(outputFile, lines.join('\n'));
}

writeWebsocketHandlerImports();
writeClientActionImports();
