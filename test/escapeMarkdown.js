'use strict';

const assert = require('assert').strict;
const Util = require('../src/util/Util');

function test(name, input, expected) {
  // eslint-disable-next-line no-console
  console.log(name);
  assert.strictEqual(input, expected);
}

const testString = '||___~~***```js\n`use strict`;\nrequire(\'discord.js\');```***~~___||';

test('escapeCodeblock',
  Util.escapeCodeBlock(testString),
  '||___~~***\\`\\`\\`js\n`use strict`;\nrequire(\'discord.js\');\\`\\`\\`***~~___||'
);

test('escapeInlineCode',
  Util.escapeInlineCode(testString),
  '||___~~***```js\n\\`use strict\\`;\nrequire(\'discord.js\');```***~~___||'
);

test('escapeBold',
  Util.escapeBold(testString),
  '||___~~*\\*\\*```js\n`use strict`;\nrequire(\'discord.js\');```\\*\\**~~___||'
);

test('escapeItalic',
  Util.escapeItalic(testString),
  '||\\___~~\\***```js\n`use strict`;\nrequire(\'discord.js\');```**\\*~~__\\_||'
);

test('escapeUnderline',
  Util.escapeUnderline(testString),
  '||_\\_\\_~~***```js\n`use strict`;\nrequire(\'discord.js\');```***~~\\_\\__||'
);

test('escapeStrikethrough',
  Util.escapeStrikethrough(testString),
  '||___\\~\\~***```js\n`use strict`;\nrequire(\'discord.js\');```***\\~\\~___||'
);

test('escapeSpoiler',
  Util.escapeSpoiler(testString),
  '\\|\\|___~~***```js\n`use strict`;\nrequire(\'discord.js\');```***~~___\\|\\|'
);

test('escapeMarkdown',
  Util.escapeMarkdown(testString),
  // eslint-disable-next-line max-len
  '\\|\\|\\_\\_\\_\\~\\~\\*\\*\\*\\`\\`\\`js\n\\`use strict\\`;\nrequire(\'discord.js\');\\`\\`\\`\\*\\*\\*\\~\\~\\_\\_\\_\\|\\|'
);
