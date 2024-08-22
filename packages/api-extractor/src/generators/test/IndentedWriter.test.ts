// Copyright (c) Microsoft Corporation. All rights reserved. Licensed under the MIT license.
// See LICENSE in the project root for license information.

import { IndentedWriter } from '../IndentedWriter.js';

test('01 Demo from docs', () => {
	const indentedWriter: IndentedWriter = new IndentedWriter();
	indentedWriter.write('begin\n');
	indentedWriter.increaseIndent();
	indentedWriter.write('one\ntwo\n');
	indentedWriter.decreaseIndent();
	indentedWriter.increaseIndent();
	indentedWriter.decreaseIndent();
	indentedWriter.write('end');

	expect(indentedWriter.toString()).toMatchSnapshot();
});

test('02 Indent something', () => {
	const indentedWriter: IndentedWriter = new IndentedWriter();
	indentedWriter.write('a');
	indentedWriter.write('b');
	indentedWriter.increaseIndent();
	indentedWriter.writeLine('c');
	indentedWriter.writeLine('d');
	indentedWriter.decreaseIndent();
	indentedWriter.writeLine('e');

	indentedWriter.increaseIndent('>>> ');
	indentedWriter.writeLine();
	indentedWriter.writeLine();
	indentedWriter.writeLine('g');
	indentedWriter.decreaseIndent();

	expect(indentedWriter.toString()).toMatchSnapshot();
});

test('03 Indent something with indentBlankLines=true', () => {
	const indentedWriter: IndentedWriter = new IndentedWriter();
	indentedWriter.indentBlankLines = true;

	indentedWriter.write('a');
	indentedWriter.write('b');
	indentedWriter.increaseIndent();
	indentedWriter.writeLine('c');
	indentedWriter.writeLine('d');
	indentedWriter.decreaseIndent();
	indentedWriter.writeLine('e');

	indentedWriter.increaseIndent('>>> ');
	indentedWriter.writeLine();
	indentedWriter.writeLine();
	indentedWriter.writeLine('g');
	indentedWriter.decreaseIndent();

	expect(indentedWriter.toString()).toMatchSnapshot();
});

test('04 Two kinds of indents', () => {
	const indentedWriter: IndentedWriter = new IndentedWriter();

	indentedWriter.writeLine('---');
	indentedWriter.indentScope(() => {
		indentedWriter.write('a\nb');
		indentedWriter.indentScope(() => {
			indentedWriter.write('c\nd\n');
		});
		indentedWriter.write('e\n');
	}, '> ');
	indentedWriter.writeLine('---');

	expect(indentedWriter.toString()).toMatchSnapshot();
});

test('05 Edge cases for ensureNewLine()', () => {
	let indentedWriter: IndentedWriter = new IndentedWriter();
	indentedWriter.ensureNewLine();
	indentedWriter.write('line');
	expect(indentedWriter.toString()).toMatchSnapshot();

	indentedWriter = new IndentedWriter();
	indentedWriter.write('previous');
	indentedWriter.ensureNewLine();
	indentedWriter.write('line');
	expect(indentedWriter.toString()).toMatchSnapshot();
});

test('06 Edge cases for ensureSkippedLine()', () => {
	let indentedWriter: IndentedWriter = new IndentedWriter();
	indentedWriter.ensureSkippedLine();
	indentedWriter.write('line');
	expect(indentedWriter.toString()).toMatchSnapshot();

	indentedWriter = new IndentedWriter();
	indentedWriter.write('previous');
	indentedWriter.ensureSkippedLine();
	indentedWriter.write('line');
	indentedWriter.ensureSkippedLine();
	expect(indentedWriter.toString()).toMatchSnapshot();
});

test('06 trimLeadingSpaces=true', () => {
	const indentedWriter: IndentedWriter = new IndentedWriter();
	indentedWriter.trimLeadingSpaces = true;

	// Example from doc comment
	indentedWriter.increaseIndent('    ');
	indentedWriter.write('  a\n  b  c\n');
	indentedWriter.decreaseIndent();
	indentedWriter.ensureSkippedLine();
	indentedWriter.increaseIndent('>>');
	indentedWriter.write(' ');
	indentedWriter.write('   ');
	indentedWriter.write(' a');
	indentedWriter.writeLine('   b');
	indentedWriter.writeLine('\ttab'); // does not get indented
	indentedWriter.writeLine('c  ');
	expect(indentedWriter.toString()).toMatchSnapshot();
});
