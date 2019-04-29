'use strict';

const assert = require('assert').strict;
const Util = require('../src/util/Util');

function test(name, input, expected) {
  // eslint-disable-next-line no-console
  console.log(name);
  assert.strictEqual(input, expected);
}

const testString = '||__~~***```js\n`use strict`;\nrequire(\'discord.js\');```***~~__||';

test('escapeCodeblock',
  Util.escapeCodeBlock(testString),
  '||__~~***`\u200b``js\n`use strict`;\nrequire(\'discord.js\');`\u200b``***~~__||'
);

test('escapeInlineCode',
  Util.escapeInlineCode(testString),
  '||__~~***```js\n\\`use strict\\`;\nrequire(\'discord.js\');```***~~__||'
);

test('escapeBold',
  Util.escapeBold(testString),
  '||__~~*\\*\\*```js\n`use strict`;\nrequire(\'discord.js\');```\\*\\**~~__||'
);

test('escapeItalic',
  Util.escapeItalic(testString),
  '||__~~\\***```js\n`use strict`;\nrequire(\'discord.js\');```**\\*~~__||'
);

test('escapeUnderline',
  Util.escapeUnderline(testString),
  '||\\_\\_~~***```js\n`use strict`;\nrequire(\'discord.js\');```***~~\\_\\_||'
);

test('escapeStrikethrough',
  Util.escapeStrikethrough(testString),
  '||__\\~\\~***```js\n`use strict`;\nrequire(\'discord.js\');```***\\~\\~__||'
);

test('escapeSpoiler',
  Util.escapeSpoiler(testString),
  '\\|\\|__~~***```js\n`use strict`;\nrequire(\'discord.js\');```***~~__\\|\\|'
);

test('escapeMarkdown',
  Util.escapeMarkdown(testString),
  // eslint-disable-next-line max-len
  '\\|\\|\\_\\_\\~\\~\\*\\*\\*`\u200b``js\n\\`use strict\\`;\nrequire(\'discord.js\');`\u200b``\\*\\*\\*\\~\\~\\_\\_\\|\\|'
);
