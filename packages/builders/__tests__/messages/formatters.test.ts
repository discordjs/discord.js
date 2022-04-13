import {
	blockQuote,
	bold,
	channelMention,
	codeBlock,
	Faces,
	formatEmoji,
	hideLinkEmbed,
	hyperlink,
	inlineCode,
	italic,
	quote,
	roleMention,
	spoiler,
	strikethrough,
	time,
	TimestampStyles,
	underscore,
	userMention,
} from '../../src';

describe('Message formatters', () => {
	describe('codeBlock', () => {
		test('GIVEN "discord.js" with no language THEN returns "```\\ndiscord.js```"', () => {
			expect<'```\ndiscord.js```'>(codeBlock('discord.js')).toBe('```\ndiscord.js```');
		});

		test('GIVEN "discord.js" with "js" as language THEN returns "```js\\ndiscord.js```"', () => {
			expect<'```js\ndiscord.js```'>(codeBlock('js', 'discord.js')).toBe('```js\ndiscord.js```');
		});
	});

	describe('inlineCode', () => {
		test('GIVEN "discord.js" THEN returns "`discord.js`"', () => {
			expect<'`discord.js`'>(inlineCode('discord.js')).toBe('`discord.js`');
		});
	});

	describe('italic', () => {
		test('GIVEN "discord.js" THEN returns "_discord.js_"', () => {
			expect<'_discord.js_'>(italic('discord.js')).toBe('_discord.js_');
		});
	});

	describe('bold', () => {
		test('GIVEN "discord.js" THEN returns "**discord.js**"', () => {
			expect<'**discord.js**'>(bold('discord.js')).toBe('**discord.js**');
		});
	});

	describe('underscore', () => {
		test('GIVEN "discord.js" THEN returns "__discord.js__"', () => {
			expect<'__discord.js__'>(underscore('discord.js')).toBe('__discord.js__');
		});
	});

	describe('strikethrough', () => {
		test('GIVEN "discord.js" THEN returns "~~discord.js~~"', () => {
			expect<'~~discord.js~~'>(strikethrough('discord.js')).toBe('~~discord.js~~');
		});
	});

	describe('quote', () => {
		test('GIVEN "discord.js" THEN returns "> discord.js"', () => {
			expect<'> discord.js'>(quote('discord.js')).toBe('> discord.js');
		});
	});

	describe('blockQuote', () => {
		test('GIVEN "discord.js" THEN returns ">>> discord.js"', () => {
			expect<'>>> discord.js'>(blockQuote('discord.js')).toBe('>>> discord.js');
		});
	});

	describe('hideLinkEmbed', () => {
		test('GIVEN "https://discord.js.org" THEN returns "<https://discord.js.org>"', () => {
			expect<'<https://discord.js.org>'>(hideLinkEmbed('https://discord.js.org')).toBe('<https://discord.js.org>');
		});

		test('GIVEN new URL("https://discord.js.org") THEN returns "<https://discord.js.org>"', () => {
			expect<`<${string}>`>(hideLinkEmbed(new URL('https://discord.js.org/'))).toBe('<https://discord.js.org/>');
		});
	});

	describe('hyperlink', () => {
		test('GIVEN content and string URL THEN returns "[content](url)"', () => {
			expect<'[discord.js](https://discord.js.org)'>(hyperlink('discord.js', 'https://discord.js.org')).toBe(
				'[discord.js](https://discord.js.org)',
			);
		});

		test('GIVEN content and URL THEN returns "[content](url)"', () => {
			expect<`[discord.js](${string})`>(hyperlink('discord.js', new URL('https://discord.js.org'))).toBe(
				'[discord.js](https://discord.js.org/)',
			);
		});

		test('GIVEN content, string URL, and title THEN returns "[content](url "title")"', () => {
			expect<'[discord.js](https://discord.js.org "Official Documentation")'>(
				hyperlink('discord.js', 'https://discord.js.org', 'Official Documentation'),
			).toBe('[discord.js](https://discord.js.org "Official Documentation")');
		});

		test('GIVEN content, URL, and title THEN returns "[content](url "title")"', () => {
			expect<`[discord.js](${string} "Official Documentation")`>(
				hyperlink('discord.js', new URL('https://discord.js.org'), 'Official Documentation'),
			).toBe('[discord.js](https://discord.js.org/ "Official Documentation")');
		});
	});

	describe('spoiler', () => {
		test('GIVEN "discord.js" THEN returns "||discord.js||"', () => {
			expect<'||discord.js||'>(spoiler('discord.js')).toBe('||discord.js||');
		});
	});

	describe('Mentions', () => {
		describe('userMention', () => {
			test('GIVEN userId THEN returns "<@[userId]>"', () => {
				expect(userMention('139836912335716352')).toBe('<@139836912335716352>');
			});
		});

		describe('channelMention', () => {
			test('GIVEN channelId THEN returns "<#[channelId]>"', () => {
				expect(channelMention('829924760309334087')).toBe('<#829924760309334087>');
			});
		});

		describe('roleMention', () => {
			test('GIVEN roleId THEN returns "<&[roleId]>"', () => {
				expect(roleMention('815434166602170409')).toBe('<@&815434166602170409>');
			});
		});
	});

	describe('formatEmoji', () => {
		test('GIVEN static emojiId THEN returns "<:_:${emojiId}>"', () => {
			expect<`<:_:851461487498493952>`>(formatEmoji('851461487498493952')).toBe('<:_:851461487498493952>');
		});

		test('GIVEN static emojiId WITH animated explicitly false THEN returns "<:_:[emojiId]>"', () => {
			expect<`<:_:851461487498493952>`>(formatEmoji('851461487498493952', false)).toBe('<:_:851461487498493952>');
		});

		test('GIVEN animated emojiId THEN returns "<a:_:${emojiId}>"', () => {
			expect<`<a:_:827220205352255549>`>(formatEmoji('827220205352255549', true)).toBe('<a:_:827220205352255549>');
		});
	});

	describe('time', () => {
		test('GIVEN no arguments THEN returns "<t:${bigint}>"', () => {
			jest.useFakeTimers('modern');
			jest.setSystemTime(1566424897579);

			expect<`<t:${bigint}>`>(time()).toBe('<t:1566424897>');

			jest.useRealTimers();
		});

		test('GIVEN a date THEN returns "<t:${bigint}>"', () => {
			expect<`<t:${bigint}>`>(time(new Date(1867424897579))).toBe('<t:1867424897>');
		});

		test('GIVEN a date and a style from string THEN returns "<t:${bigint}:${style}>"', () => {
			expect<`<t:${bigint}:d>`>(time(new Date(1867424897579), 'd')).toBe('<t:1867424897:d>');
		});

		test('GIVEN a date and a format from enum THEN returns "<t:${bigint}:${style}>"', () => {
			expect<`<t:${bigint}:R>`>(time(new Date(1867424897579), TimestampStyles.RelativeTime)).toBe('<t:1867424897:R>');
		});

		test('GIVEN a date THEN returns "<t:${time}>"', () => {
			expect<'<t:1867424897>'>(time(1867424897)).toBe('<t:1867424897>');
		});

		test('GIVEN a date and a style from string THEN returns "<t:${time}:${style}>"', () => {
			expect<'<t:1867424897:d>'>(time(1867424897, 'd')).toBe('<t:1867424897:d>');
		});

		test('GIVEN a date and a format from enum THEN returns "<t:${time}:${style}>"', () => {
			expect<'<t:1867424897:R>'>(time(1867424897, TimestampStyles.RelativeTime)).toBe('<t:1867424897:R>');
		});
	});

	describe('Faces', () => {
		test('GIVEN Faces.Shrug THEN returns "¯\\_(ツ)\\_/¯"', () => {
			expect<'¯\\_(ツ)\\_/¯'>(Faces.Shrug).toBe('¯\\_(ツ)\\_/¯');
		});

		test('GIVEN Faces.Tableflip THEN returns "(╯°□°）╯︵ ┻━┻"', () => {
			expect<'(╯°□°）╯︵ ┻━┻'>(Faces.Tableflip).toBe('(╯°□°）╯︵ ┻━┻');
		});

		test('GIVEN Faces.Unflip THEN returns "┬─┬ ノ( ゜-゜ノ)"', () => {
			expect<'┬─┬ ノ( ゜-゜ノ)'>(Faces.Unflip).toBe('┬─┬ ノ( ゜-゜ノ)');
		});
	});
});
