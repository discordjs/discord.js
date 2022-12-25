import { describe, test, expect } from 'vitest';
import {
	escapeCodeBlock,
	escapeInlineCode,
	escapeItalic,
	escapeBold,
	escapeUnderline,
	escapeStrikethrough,
	escapeMaskedLink,
	escapeSpoiler,
	escapeHeading,
	escapeBulletedList,
	escapeNumberedList,
	escapeMarkdown,
} from '../src/index.js';

const testString = "`_Behold!_`\n||___~~***```js\n`use strict`;\nrequire('discord.js');```***~~___||";
const testStringForums =
	'# Title\n## Subtitle\n### Subsubtitle\n- Bullet list\n - # Title with bullet\n * Subbullet\n1. Number list\n 1. Sub number list';

describe('Markdown escapers', () => {
	describe('escapeCodeblock', () => {
		test('shared', () => {
			expect(escapeCodeBlock(testString)).toEqual(
				"`_Behold!_`\n||___~~***\\`\\`\\`js\n`use strict`;\nrequire('discord.js');\\`\\`\\`***~~___||",
			);
		});

		test('basic', () => {
			expect(escapeCodeBlock('```test```')).toEqual('\\`\\`\\`test\\`\\`\\`');
		});
	});

	describe('escapeInlineCode', () => {
		test('shared', () => {
			expect(escapeInlineCode(testString)).toEqual(
				"\\`_Behold!_\\`\n||___~~***```js\n\\`use strict\\`;\nrequire('discord.js');```***~~___||",
			);
		});

		test('basic', () => {
			expect(escapeInlineCode('`test`')).toEqual('\\`test\\`');
		});
	});

	describe('escapeBold', () => {
		test('shared', () => {
			expect(escapeBold(testString)).toEqual(
				"`_Behold!_`\n||___~~*\\*\\*```js\n`use strict`;\nrequire('discord.js');```\\*\\**~~___||",
			);
		});

		test('basic', () => {
			expect(escapeBold('**test**')).toEqual('\\*\\*test\\*\\*');
		});
	});

	describe('escapeItalic', () => {
		test('shared', () => {
			expect(escapeItalic(testString)).toEqual(
				"`\\_Behold!\\_`\n||\\___~~\\***```js\n`use strict`;\nrequire('discord.js');```**\\*~~__\\_||",
			);
		});

		test('basic (_)', () => {
			expect(escapeItalic('_test_')).toEqual('\\_test\\_');
		});

		test('basic (*)', () => {
			expect(escapeItalic('*test*')).toEqual('\\*test\\*');
		});

		test('emoji', () => {
			const testOne = 'This is a test with _emojis_ <:Frost_ed_Wreath:1053399941210443826> and **bold text**.';
			expect(escapeItalic(testOne)).toEqual(
				'This is a test with \\_emojis\\_ <:Frost_ed_Wreath:1053399941210443826> and **bold text**.',
			);
		});
	});

	describe('escapeUnderline', () => {
		test('shared', () => {
			expect(escapeUnderline(testString)).toEqual(
				"`_Behold!_`\n||_\\_\\_~~***```js\n`use strict`;\nrequire('discord.js');```***~~\\_\\__||",
			);
		});

		test('basic', () => {
			expect(escapeUnderline('__test__')).toEqual('\\_\\_test\\_\\_');
		});

		test('emoji', () => {
			const testTwo = 'This is a test with __emojis__ <:Frost__ed__Wreath:1053399939654352978> and **bold text**.';
			expect(escapeUnderline(testTwo)).toBe(
				'This is a test with \\_\\_emojis\\_\\_ <:Frost__ed__Wreath:1053399939654352978> and **bold text**.',
			);
		});
	});

	describe('escapeStrikethrough', () => {
		test('shared', () => {
			expect(escapeStrikethrough(testString)).toEqual(
				"`_Behold!_`\n||___\\~\\~***```js\n`use strict`;\nrequire('discord.js');```***\\~\\~___||",
			);
		});

		test('basic', () => {
			expect(escapeStrikethrough('~~test~~')).toEqual('\\~\\~test\\~\\~');
		});
	});

	describe('escapeSpoiler', () => {
		test('shared', () => {
			expect(escapeSpoiler(testString)).toEqual(
				"`_Behold!_`\n\\|\\|___~~***```js\n`use strict`;\nrequire('discord.js');```***~~___\\|\\|",
			);
		});

		test('basic', () => {
			expect(escapeSpoiler('||test||')).toEqual('\\|\\|test\\|\\|');
		});
	});

	describe('escapeHeading', () => {
		test('shared', () => {
			expect(escapeHeading(testStringForums)).toEqual(
				'\\# Title\n\\## Subtitle\n\\### Subsubtitle\n- Bullet list\n - \\# Title with bullet\n * Subbullet\n1. Number list\n 1. Sub number list',
			);
		});

		test('basic', () => {
			expect(escapeHeading('# test')).toEqual('\\# test');
		});
	});

	describe('escapeBulletedList', () => {
		test('shared', () => {
			expect(escapeBulletedList(testStringForums)).toEqual(
				'# Title\n## Subtitle\n### Subsubtitle\n\\- Bullet list\n \\- # Title with bullet\n \\* Subbullet\n1. Number list\n 1. Sub number list',
			);
		});

		test('basic', () => {
			expect(escapeBulletedList('- test')).toEqual('\\- test');
		});
	});

	describe('escapeNumberedList', () => {
		test('shared', () => {
			expect(escapeNumberedList(testStringForums)).toEqual(
				'# Title\n## Subtitle\n### Subsubtitle\n- Bullet list\n - # Title with bullet\n * Subbullet\n1\\. Number list\n 1\\. Sub number list',
			);
		});

		test('basic', () => {
			expect(escapeNumberedList('1. test')).toEqual('1\\. test');
		});
	});

	describe('escapeMaskedLink', () => {
		test('basic', () => {
			expect(escapeMaskedLink('[test](https://discord.js.org)')).toEqual('\\[test](https://discord.js.org)');
		});
	});

	describe('escapeMarkdown', () => {
		test('shared', () => {
			expect(escapeMarkdown(testString)).toEqual(
				"\\`\\_Behold!\\_\\`\n\\|\\|\\_\\_\\_\\~\\~\\*\\*\\*\\`\\`\\`js\n\\`use strict\\`;\nrequire('discord.js');\\`\\`\\`\\*\\*\\*\\~\\~\\_\\_\\_\\|\\|",
			);
		});

		test('no codeBlock', () => {
			expect(escapeMarkdown(testString, { codeBlock: false })).toEqual(
				"\\`\\_Behold!\\_\\`\n\\|\\|\\_\\_\\_\\~\\~\\*\\*\\*```js\n\\`use strict\\`;\nrequire('discord.js');```\\*\\*\\*\\~\\~\\_\\_\\_\\|\\|",
			);
		});

		test('no inlineCode', () => {
			expect(escapeMarkdown(testString, { inlineCode: false })).toEqual(
				"`\\_Behold!\\_`\n\\|\\|\\_\\_\\_\\~\\~\\*\\*\\*\\`\\`\\`js\n`use strict`;\nrequire('discord.js');\\`\\`\\`\\*\\*\\*\\~\\~\\_\\_\\_\\|\\|",
			);
		});

		test('no bold', () => {
			expect(escapeMarkdown(testString, { bold: false })).toEqual(
				"\\`\\_Behold!\\_\\`\n\\|\\|\\_\\_\\_\\~\\~\\***\\`\\`\\`js\n\\`use strict\\`;\nrequire('discord.js');\\`\\`\\`**\\*\\~\\~\\_\\_\\_\\|\\|",
			);
		});

		test('no italic', () => {
			expect(escapeMarkdown(testString, { italic: false })).toEqual(
				"\\`_Behold!_\\`\n\\|\\|_\\_\\_\\~\\~*\\*\\*\\`\\`\\`js\n\\`use strict\\`;\nrequire('discord.js');\\`\\`\\`\\*\\**\\~\\~\\_\\__\\|\\|",
			);
		});

		test('no underline', () => {
			expect(escapeMarkdown(testString, { underline: false })).toEqual(
				"\\`\\_Behold!\\_\\`\n\\|\\|\\___\\~\\~\\*\\*\\*\\`\\`\\`js\n\\`use strict\\`;\nrequire('discord.js');\\`\\`\\`\\*\\*\\*\\~\\~__\\_\\|\\|",
			);
		});

		test('no strikethrough', () => {
			expect(escapeMarkdown(testString, { strikethrough: false })).toEqual(
				"\\`\\_Behold!\\_\\`\n\\|\\|\\_\\_\\_~~\\*\\*\\*\\`\\`\\`js\n\\`use strict\\`;\nrequire('discord.js');\\`\\`\\`\\*\\*\\*~~\\_\\_\\_\\|\\|",
			);
		});

		test('no spoiler', () => {
			expect(escapeMarkdown(testString, { spoiler: false })).toEqual(
				"\\`\\_Behold!\\_\\`\n||\\_\\_\\_\\~\\~\\*\\*\\*\\`\\`\\`js\n\\`use strict\\`;\nrequire('discord.js');\\`\\`\\`\\*\\*\\*\\~\\~\\_\\_\\_||",
			);
		});

		describe('code content', () => {
			test('no code block content', () => {
				expect(escapeMarkdown(testString, { codeBlockContent: false })).toEqual(
					"\\`\\_Behold!\\_\\`\n\\|\\|\\_\\_\\_\\~\\~\\*\\*\\*\\`\\`\\`js\n`use strict`;\nrequire('discord.js');\\`\\`\\`\\*\\*\\*\\~\\~\\_\\_\\_\\|\\|",
				);
			});

			test('no inline code content', () => {
				expect(escapeMarkdown(testString, { inlineCodeContent: false })).toEqual(
					"\\`_Behold!_\\`\n\\|\\|\\_\\_\\_\\~\\~\\*\\*\\*\\`\\`\\`js\n\\`use strict\\`;\nrequire('discord.js');\\`\\`\\`\\*\\*\\*\\~\\~\\_\\_\\_\\|\\|",
				);
			});

			test('neither inline code or code block content', () => {
				expect(escapeMarkdown(testString, { inlineCodeContent: false, codeBlockContent: false }))
					// eslint-disable-next-line max-len
					.toEqual(
						"\\`_Behold!_\\`\n\\|\\|\\_\\_\\_\\~\\~\\*\\*\\*\\`\\`\\`js\n`use strict`;\nrequire('discord.js');\\`\\`\\`\\*\\*\\*\\~\\~\\_\\_\\_\\|\\|",
					);
			});

			test('neither code blocks or code block content', () => {
				expect(escapeMarkdown(testString, { codeBlock: false, codeBlockContent: false })).toEqual(
					"\\`\\_Behold!\\_\\`\n\\|\\|\\_\\_\\_\\~\\~\\*\\*\\*```js\n`use strict`;\nrequire('discord.js');```\\*\\*\\*\\~\\~\\_\\_\\_\\|\\|",
				);
			});

			test('neither inline code or inline code content', () => {
				expect(escapeMarkdown(testString, { inlineCode: false, inlineCodeContent: false })).toEqual(
					"`_Behold!_`\n\\|\\|\\_\\_\\_\\~\\~\\*\\*\\*\\`\\`\\`js\n`use strict`;\nrequire('discord.js');\\`\\`\\`\\*\\*\\*\\~\\~\\_\\_\\_\\|\\|",
				);
			});

			test('edge-case odd number of fences with no code block content', () => {
				expect(
					escapeMarkdown('**foo** ```**bar**``` **fizz** ``` **buzz**', {
						codeBlock: false,
						codeBlockContent: false,
					}),
				).toEqual('\\*\\*foo\\*\\* ```**bar**``` \\*\\*fizz\\*\\* ``` \\*\\*buzz\\*\\*');
			});

			test('edge-case odd number of backticks with no inline code content', () => {
				expect(
					escapeMarkdown('**foo** `**bar**` **fizz** ` **buzz**', { inlineCode: false, inlineCodeContent: false }),
				).toEqual('\\*\\*foo\\*\\* `**bar**` \\*\\*fizz\\*\\* ` \\*\\*buzz\\*\\*');
			});
		});
	});
});
