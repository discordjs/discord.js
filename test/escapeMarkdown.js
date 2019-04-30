'use strict';

const assert = require('assert').strict;
const Util = require('../src/util/Util');

function test(name, input, expected) {
  // eslint-disable-next-line no-console
  console.log(name);
  assert.strictEqual(input, expected);
}

const testString = '`_Behold!_`\n||___~~***```js\n`use strict`;\nrequire(\'discord.js\');```***~~___||';

test('escapeCodeblock',
  Util.escapeCodeBlock(testString),
  '`_Behold!_`\n||___~~***\\`\\`\\`js\n`use strict`;\nrequire(\'discord.js\');\\`\\`\\`***~~___||'
);

test('escapeInlineCode',
  Util.escapeInlineCode(testString),
  '\\`_Behold!_\\`\n||___~~***```js\n\\`use strict\\`;\nrequire(\'discord.js\');```***~~___||'
);

test('escapeBold',
  Util.escapeBold(testString),
  '`_Behold!_`\n||___~~*\\*\\*```js\n`use strict`;\nrequire(\'discord.js\');```\\*\\**~~___||'
);

test('escapeItalic',
  Util.escapeItalic(testString),
  '`\\_Behold!\\_`\n||\\___~~\\***```js\n`use strict`;\nrequire(\'discord.js\');```**\\*~~__\\_||'
);

test('escapeUnderline',
  Util.escapeUnderline(testString),
  '`_Behold!_`\n||_\\_\\_~~***```js\n`use strict`;\nrequire(\'discord.js\');```***~~\\_\\__||'
);

test('escapeStrikethrough',
  Util.escapeStrikethrough(testString),
  '`_Behold!_`\n||___\\~\\~***```js\n`use strict`;\nrequire(\'discord.js\');```***\\~\\~___||'
);

test('escapeSpoiler',
  Util.escapeSpoiler(testString),
  '`_Behold!_`\n\\|\\|___~~***```js\n`use strict`;\nrequire(\'discord.js\');```***~~___\\|\\|'
);

test('escapeMarkdown',
  Util.escapeMarkdown(testString),
  // eslint-disable-next-line max-len
  '\\`\\_Behold!\\_\\`\n\\|\\|\\_\\_\\_\\~\\~\\*\\*\\*\\`\\`\\`js\n\\`use strict\\`;\nrequire(\'discord.js\');\\`\\`\\`\\*\\*\\*\\~\\~\\_\\_\\_\\|\\|'
);

test('escapeMarkdown no code block content',
  Util.escapeMarkdown(testString, { codeBlockContent: false }),
  // eslint-disable-next-line max-len
  '\\`\\_Behold!\\_\\`\n\\|\\|\\_\\_\\_\\~\\~\\*\\*\\*\\`\\`\\`js\n`use strict`;\nrequire(\'discord.js\');\\`\\`\\`\\*\\*\\*\\~\\~\\_\\_\\_\\|\\|'
);

test('escapeMarkdown no inline code content',
  Util.escapeMarkdown(testString, { inlineCodeContent: false }),
  // eslint-disable-next-line max-len
  '\\`_Behold!_\\`\n\\|\\|\\_\\_\\_\\~\\~\\*\\*\\*\\`\\`\\`js\n\\`use strict\\`;\nrequire(\'discord.js\');\\`\\`\\`\\*\\*\\*\\~\\~\\_\\_\\_\\|\\|'
);

test('escapeMarkdown neither inline code or code block content',
  Util.escapeMarkdown(testString, { inlineCodeContent: false, codeBlockContent: false }),
  // eslint-disable-next-line max-len
  '\\`_Behold!_\\`\n\\|\\|\\_\\_\\_\\~\\~\\*\\*\\*\\`\\`\\`js\n`use strict`;\nrequire(\'discord.js\');\\`\\`\\`\\*\\*\\*\\~\\~\\_\\_\\_\\|\\|'
);

test('escapeMarkdown neither code blocks or code block content',
  Util.escapeMarkdown(testString, { codeBlock: false, codeBlockContent: false }),
  // eslint-disable-next-line max-len
  '\\`\\_Behold!\\_\\`\n\\|\\|\\_\\_\\_\\~\\~\\*\\*\\*```js\n`use strict`;\nrequire(\'discord.js\');```\\*\\*\\*\\~\\~\\_\\_\\_\\|\\|'
);

test('escapeMarkdown neither inline code or inline code content',
  Util.escapeMarkdown(testString, { inlineCode: false, inlineCodeContent: false }),
  // eslint-disable-next-line max-len
  '`_Behold!_`\n\\|\\|\\_\\_\\_\\~\\~\\*\\*\\*\\`\\`\\`js\n`use strict`;\nrequire(\'discord.js\');\\`\\`\\`\\*\\*\\*\\~\\~\\_\\_\\_\\|\\|'
);

test('escapeMarkdown edge odd number of fenses with no code block content',
  Util.escapeMarkdown('**foo** ```**bar**``` **fizz** ``` **buzz**', { codeBlock: false, codeBlockContent: false }),
  // eslint-disable-next-line max-len
  '\\*\\*foo\\*\\* ```**bar**``` \\*\\*fizz\\*\\* ``` \\*\\*buzz\\*\\*'
);

test('escapeMarkdown edge odd number of backticks with no code block content',
  Util.escapeMarkdown('**foo** `**bar**` **fizz** ` **buzz**', { inlineCode: false, inlineCodeContent: false }),
  // eslint-disable-next-line max-len
  '\\*\\*foo\\*\\* `**bar**` \\*\\*fizz\\*\\* ` \\*\\*buzz\\*\\*'
);
