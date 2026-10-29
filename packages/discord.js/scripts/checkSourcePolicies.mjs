import { readdir, readFile } from 'node:fs/promises';
import { relative, resolve } from 'node:path';
import process from 'node:process';
import ts from 'typescript';

const packageRoot = resolve(import.meta.dirname, '..');
const sourceRoot = resolve(packageRoot, 'src');
const violations = [];

function report(sourceFile, node, message) {
  const position = sourceFile.getLineAndCharacterOfPosition(node.getStart(sourceFile));
  violations.push(
    `${relative(packageRoot, sourceFile.fileName)}:${position.line + 1}:${position.character + 1} ${message}`,
  );
}

async function collectFiles(directory, predicate) {
  const entries = await readdir(directory, { withFileTypes: true });
  const files = [];

  for (const entry of entries) {
    const path = resolve(directory, entry.name);

    if (entry.isDirectory()) {
      files.push(...(await collectFiles(path, predicate)));
    } else if (predicate(path)) {
      files.push(path);
    }
  }

  return files;
}

function isIdentifier(node, text) {
  return ts.isIdentifier(node) && node.text === text;
}

function isModuleExports(node) {
  return ts.isPropertyAccessExpression(node) && isIdentifier(node.expression, 'module') && node.name.text === 'exports';
}

function isLocalRequire(node) {
  return (
    ts.isCallExpression(node) &&
    isIdentifier(node.expression, 'require') &&
    node.arguments.length === 1 &&
    ts.isStringLiteral(node.arguments[0]) &&
    node.arguments[0].text.startsWith('.')
  );
}

function inspectCommonJs(sourceFile) {
  const allowModuleExports = relative(sourceRoot, sourceFile.fileName)
    .replaceAll('\\', '/')
    .startsWith('client/websocket/handlers/');
  const firstStatement = sourceFile.statements[0];

  if (
    firstStatement &&
    (!ts.isExpressionStatement(firstStatement) ||
      !ts.isStringLiteral(firstStatement.expression) ||
      firstStatement.expression.text !== 'use strict')
  ) {
    report(sourceFile, sourceFile, "CommonJS source files must begin with 'use strict'");
  }

  function visit(node) {
    if (!allowModuleExports && ts.isBinaryExpression(node) && isModuleExports(node.left)) {
      report(sourceFile, node.left, 'Use named exports instead of module.exports');
    }

    if (
      ts.isVariableDeclaration(node) &&
      node.initializer &&
      isLocalRequire(node.initializer) &&
      !ts.isObjectBindingPattern(node.name)
    ) {
      report(sourceFile, node.name, 'Use object destructuring when requiring local modules');
    }

    ts.forEachChild(node, visit);
  }

  visit(sourceFile);
}

function inspectDeclarations(sourceFile) {
  function inspectType(node, allowMutableArrays = false) {
    if (
      !allowMutableArrays &&
      ts.isArrayTypeNode(node) &&
      !(ts.isTypeOperatorNode(node.parent) && node.parent.operator === ts.SyntaxKind.ReadonlyKeyword)
    ) {
      report(sourceFile, node, 'Array parameters and interface properties must be readonly');
    }

    if (ts.isTypeReferenceNode(node) && ts.isIdentifier(node.typeName) && node.typeName.text === 'Collection') {
      report(sourceFile, node, 'Parameters and interface properties must use ReadonlyCollection');
    }

    ts.forEachChild(node, child => inspectType(child, allowMutableArrays));
  }

  function visit(node) {
    if (ts.isMethodDeclaration(node) || ts.isFunctionDeclaration(node)) {
      const allowMutableArrays =
        !ts.isFunctionDeclaration(node) && ['on', 'once', 'off'].includes(node.name.getText(sourceFile));
      for (const parameter of node.parameters) {
        if (parameter.type && ts.isIdentifier(parameter.name) && !parameter.dotDotDotToken) {
          inspectType(parameter.type, allowMutableArrays);
        }
      }
    }

    if (ts.isPropertySignature(node) && node.type) {
      let ancestor = node.parent;
      while (ancestor && !ts.isInterfaceDeclaration(ancestor)) ancestor = ancestor.parent;
      // PartialPoll must retain Poll's mutable answers collection when narrowing its values.
      if (ancestor && (ancestor.name.text !== 'PartialPoll' || node.name.getText(sourceFile) !== 'answers')) {
        inspectType(node.type);
      }
    }

    ts.forEachChild(node, visit);
  }

  visit(sourceFile);
}

for (const file of await collectFiles(sourceRoot, path => path.endsWith('.js'))) {
  const sourceFile = ts.createSourceFile(
    file,
    await readFile(file, 'utf8'),
    ts.ScriptTarget.Latest,
    true,
    ts.ScriptKind.JS,
  );
  inspectCommonJs(sourceFile);
}

for (const file of await collectFiles(resolve(packageRoot, 'typings'), path =>
  /\.(?:d|test-d)\.(?:ts|mts)$/.test(path),
)) {
  const sourceFile = ts.createSourceFile(file, await readFile(file, 'utf8'), ts.ScriptTarget.Latest, true);
  inspectDeclarations(sourceFile);
}

if (violations.length > 0) {
  console.error(violations.sort().join('\n'));
  process.exitCode = 1;
}
