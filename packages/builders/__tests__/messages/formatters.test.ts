import { URL } from 'node:url';
import { describe, test, expect, vitest } from 'vitest';
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
			expect<'```\ndiscord.js\n```'>(codeBlock('discord.js')).toEqual('```\ndiscord.js\n```');
		});

		test('GIVEN "discord.js" with "js" as language THEN returns "```js\\ndiscord.js```"', () => {
			expect<'```js\ndiscord.js\n```'>(codeBlock('js', 'discord.js')).toEqual('```js\ndiscord.js\n```');
		});
	});

	describe('inlineCode', () => {
		test('GIVEN "discord.js" THEN returns "`discord.js`"', () => {
			expect<'`discord.js`'>(inlineCode('discord.js')).toEqual('`discord.js`');
		});
	});

	describe('italic', () => {
		test('GIVEN "discord.js" THEN returns "_discord.js_"', () => {
			expect<'_discord.js_'>(italic('discord.js')).toEqual('_discord.js_');
		});
	});

	describe('bold', () => {
		test('GIVEN "discord.js" THEN returns "**discord.js**"', () => {
			expect<'**discord.js**'>(bold('discord.js')).toEqual('**discord.js**');
		});
	});

	describe('underscore', () => {
		test('GIVEN "discord.js" THEN returns "__discord.js__"', () => {
			expect<'__discord.js__'>(underscore('discord.js')).toEqual('__discord.js__');
		});
	});

	describe('strikethrough', () => {
		test('GIVEN "discord.js" THEN returns "~~discord.js~~"', () => {
			expect<'~~discord.js~~'>(strikethrough('discord.js')).toEqual('~~discord.js~~');
		});
	});

	describe('quote', () => {
		test('GIVEN "discord.js" THEN returns "> discord.js"', () => {
			expect<'> discord.js'>(quote('discord.js')).toEqual('> discord.js');
		});
	});

	describe('blockQuote', () => {
		test('GIVEN "discord.js" THEN returns ">>> discord.js"', () => {
			expect<'>>> discord.js'>(blockQuote('discord.js')).toEqual('>>> discord.js');
		});
	});

	describe('hideLinkEmbed', () => {
		test('GIVEN "https://discord.js.org" THEN returns "<https://discord.js.org>"', () => {
			expect<'<https://discord.js.org>'>(hideLinkEmbed('https://discord.js.org')).toEqual('<https://discord.js.org>');
		});

		test('GIVEN new URL("https://discord.js.org") THEN returns "<https://discord.js.org>"', () => {
			expect<`<${string}>`>(hideLinkEmbed(new URL('https://discord.js.org/'))).toEqual('<https://discord.js.org/>');
		});
	});

	describe('hyperlink', () => {
		test('GIVEN content and string URL THEN returns "[content](url)"', () => {
			expect<'[discord.js](https://discord.js.org)'>(hyperlink('discord.js', 'https://discord.js.org')).toEqual(
				'[discord.js](https://discord.js.org)',
			);
		});

		test('GIVEN content and URL THEN returns "[content](url)"', () => {
			expect<`[discord.js](${string})`>(hyperlink('discord.js', new URL('https://discord.js.org'))).toEqual(
				'[discord.js](https://discord.js.org/)',
			);
		});

		test('GIVEN content, string URL, and title THEN returns "[content](url "title")"', () => {
			expect<'[discord.js](https://discord.js.org "Official Documentation")'>(
				hyperlink('discord.js', 'https://discord.js.org', 'Official Documentation'),
			).toEqual('[discord.js](https://discord.js.org "Official Documentation")');
		});

		test('GIVEN content, URL, and title THEN returns "[content](url "title")"', () => {
			expect<`[discord.js](${string} "Official Documentation")`>(
				hyperlink('discord.js', new URL('https://discord.js.org'), 'Official Documentation'),
			).toEqual('[discord.js](https://discord.js.org/ "Official Documentation")');
		});
	});

	describe('spoiler', () => {
		test('GIVEN "discord.js" THEN returns "||discord.js||"', () => {
			expect<'||discord.js||'>(spoiler('discord.js')).toEqual('||discord.js||');
		});
	});

	describe('Mentions', () => {
		describe('userMention', () => {
			test('GIVEN userId THEN returns "<@[userId]>"', () => {
				expect(userMention('139836912335716352')).toEqual('<@139836912335716352>');
			});
		});

		describe('channelMention', () => {
			test('GIVEN channelId THEN returns "<#[channelId]>"', () => {
				expect(channelMention('829924760309334087')).toEqual('<#829924760309334087>');
			});
		});

		describe('roleMention', () => {
			test('GIVEN roleId THEN returns "<&[roleId]>"', () => {
				expect(roleMention('815434166602170409')).toEqual('<@&815434166602170409>');
			});
		});
	});

	describe('formatEmoji', () => {
		test('GIVEN static emojiId THEN returns "<:_:${emojiId}>"', () => {
			expect<`<:_:851461487498493952>`>(formatEmoji('851461487498493952')).toEqual('<:_:851461487498493952>');
		});

		test('GIVEN static emojiId WITH animated explicitly false THEN returns "<:_:[emojiId]>"', () => {
			expect<`<:_:851461487498493952>`>(formatEmoji('851461487498493952', false)).toEqual('<:_:851461487498493952>');
		});

		test('GIVEN animated emojiId THEN returns "<a:_:${emojiId}>"', () => {
			expect<`<a:_:827220205352255549>`>(formatEmoji('827220205352255549', true)).toEqual('<a:_:827220205352255549>');
		});
	});

	describe('time', () => {
		test('GIVEN no arguments THEN returns "<t:${bigint}>"', () => {
			vitest.useFakeTimers();
			vitest.setSystemTime(1566424897579);

			expect<`<t:${bigint}>`>(time()).toEqual('<t:1566424897>');

			vitest.useRealTimers();
		});

		test('GIVEN a date THEN returns "<t:${bigint}>"', () => {
			expect<`<t:${bigint}>`>(time(new Date(1867424897579))).toEqual('<t:1867424897>');
		});

		test('GIVEN a date and a style from string THEN returns "<t:${bigint}:${style}>"', () => {
			expect<`<t:${bigint}:d>`>(time(new Date(1867424897579), 'd')).toEqual('<t:1867424897:d>');
		});

		test('GIVEN a date and a format from enum THEN returns "<t:${bigint}:${style}>"', () => {
			expect<`<t:${bigint}:R>`>(time(new Date(1867424897579), TimestampStyles.RelativeTime)).toEqual(
				'<t:1867424897:R>',
			);
		});

		test('GIVEN a date THEN returns "<t:${time}>"', () => {
			expect<'<t:1867424897>'>(time(1867424897)).toEqual('<t:1867424897>');
		});

		test('GIVEN a date and a style from string THEN returns "<t:${time}:${style}>"', () => {
			expect<'<t:1867424897:d>'>(time(1867424897, 'd')).toEqual('<t:1867424897:d>');
		});

		test('GIVEN a date and a format from enum THEN returns "<t:${time}:${style}>"', () => {
			expect<'<t:1867424897:R>'>(time(1867424897, TimestampStyles.RelativeTime)).toEqual('<t:1867424897:R>');
		});
	});

	describe('Faces', () => {
		test('GIVEN Faces.Shrug THEN returns "¯\\_(ツ)\\_/¯"', () => {
			expect<'¯\\_(ツ)\\_/¯'>(Faces.Shrug).toEqual('¯\\_(ツ)\\_/¯');
		});

		test('GIVEN Faces.Tableflip THEN returns "(╯°□°）╯︵ ┻━┻"', () => {
			expect<'(╯°□°）╯︵ ┻━┻'>(Faces.Tableflip).toEqual('(╯°□°）╯︵ ┻━┻');
		});

		test('GIVEN Faces.Unflip THEN returns "┬─┬ ノ( ゜-゜ノ)"', () => {
			expect<'┬─┬ ノ( ゜-゜ノ)'>(Faces.Unflip).toEqual('┬─┬ ノ( ゜-゜ノ)');
		});
	});
});
