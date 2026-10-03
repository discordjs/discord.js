import { readdir, writeFile } from 'node:fs/promises';

async function writeWebsocketHandlerImports() {
  const imports = [];
  const lines = ['', 'export const PacketHandlers = {'];

  const handlersDirectory = new URL('../src/client/websocket/handlers', import.meta.url);

  for (const file of (await readdir(handlersDirectory)).sort()) {
    if (file === 'index.js') continue;

    imports.push(`import ${file.slice(0, -3)} from './${file}';`);
    lines.push(`  ${file.slice(0, -3)},`);
  }

  lines.push('};\n');

  const outputFile = new URL('../src/client/websocket/handlers/index.js', import.meta.url);

  await writeFile(outputFile, [...imports, ...lines].join('\n'));
}

async function writeClientActionImports() {
  const imports = [];
  const lines = [
    '',
    'export class ActionsManager {',
    '  // These symbols represent fully built data that we inject at times when calling actions manually.',
    '  // Action#getUser, for example, will return the injected data (which is assumed to be a built structure)',
    '  // instead of trying to make it from provided data',
    "  injectedUser = Symbol('djs.actions.injectedUser');\n",
    "  injectedChannel = Symbol('djs.actions.injectedChannel');\n",
    "  injectedMessage = Symbol('djs.actions.injectedMessage');\n",
    '  constructor(client) {',
    '    this.client = client;\n',
  ];

  const actionsDirectory = new URL('../src/client/actions', import.meta.url);
  for (const file of (await readdir(actionsDirectory)).sort()) {
    if (file === 'Action.js' || file === 'ActionsManager.js') continue;

    const actionName = file.slice(0, -3);

    imports.push(`import { ${actionName}Action } from './${file}';`);
    lines.push(`    this.${actionName} = this.load(${actionName}Action);`);
  }

  lines.push('  }\n');
  lines.push('  load(Action) {');
  lines.push('    return new Action(this.client);');
  lines.push('  }');
  lines.push('}\n');

  const outputFile = new URL('../src/client/actions/ActionsManager.js', import.meta.url);

  await writeFile(outputFile, [...imports, ...lines].join('\n'));
}

writeWebsocketHandlerImports();
writeClientActionImports();
