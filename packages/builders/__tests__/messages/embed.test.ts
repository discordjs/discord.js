/* eslint-disable @typescript-eslint/ban-ts-comment */
import { describe, test, expect } from 'vitest';
import { EmbedBuilder, embedLength } from '../../src/index.js';

const alpha = 'abcdefghijklmnopqrstuvwxyz';

describe('Embed', () => {
	describe('Embed getters', () => {
		test('GIVEN an embed with specific amount of characters THEN returns amount of characters', () => {
			const embed = new EmbedBuilder({
				title: alpha,
				description: alpha,
				fields: [{ name: alpha, value: alpha }],
				author: { name: alpha },
				footer: { text: alpha },
			});

			expect(embedLength(embed.data)).toEqual(alpha.length * 6);
		});

		test('GIVEN an embed with zero characters THEN returns amount of characters', () => {
			const embed = new EmbedBuilder();

			expect(embedLength(embed.data)).toEqual(0);
		});
	});

	describe('Embed title', () => {
		test('GIVEN an embed with a pre-defined title THEN return valid toJSON data', () => {
			const embed = new EmbedBuilder({ title: 'foo' });
			expect(embed.toJSON()).toStrictEqual({ title: 'foo' });
		});

		test('GIVEN an embed using Embed#setTitle THEN return valid toJSON data', () => {
			const embed = new EmbedBuilder();
			embed.setTitle('foo');

			expect(embed.toJSON()).toStrictEqual({ title: 'foo' });
		});

		test('GIVEN an embed with a pre-defined title THEN unset title THEN return valid toJSON data', () => {
			const embed = new EmbedBuilder({ title: 'foo' });
			embed.setTitle(null);

			expect(embed.toJSON()).toStrictEqual({ title: undefined });
		});

		test('GIVEN an embed with an invalid title THEN throws error', () => {
			const embed = new EmbedBuilder();

			expect(() => embed.setTitle('a'.repeat(257))).toThrowError();
		});
	});

	describe('Embed description', () => {
		test('GIVEN an embed with a pre-defined description THEN return valid toJSON data', () => {
			const embed = new EmbedBuilder({ description: 'foo' });
			expect(embed.toJSON()).toStrictEqual({ description: 'foo' });
		});

		test('GIVEN an embed using Embed#setDescription THEN return valid toJSON data', () => {
			const embed = new EmbedBuilder();
			embed.setDescription('foo');

			expect(embed.toJSON()).toStrictEqual({ description: 'foo' });
		});

		test('GIVEN an embed with a pre-defined description THEN unset description THEN return valid toJSON data', () => {
			const embed = new EmbedBuilder({ description: 'foo' });
			embed.setDescription(null);

			expect(embed.toJSON()).toStrictEqual({ description: undefined });
		});

		test('GIVEN an embed with an invalid description THEN throws error', () => {
			const embed = new EmbedBuilder();

			expect(() => embed.setDescription('a'.repeat(4_097))).toThrowError();
		});
	});

	describe('Embed URL', () => {
		test('GIVEN an embed with a pre-defined url THEN returns valid toJSON data', () => {
			const embed = new EmbedBuilder({ url: 'https://discord.js.org/' });
			expect(embed.toJSON()).toStrictEqual({
				url: 'https://discord.js.org/',
			});
		});

		test('GIVEN an embed using Embed#setURL THEN returns valid toJSON data', () => {
			const embed = new EmbedBuilder();
			embed.setURL('https://discord.js.org/');

			expect(embed.toJSON()).toStrictEqual({
				url: 'https://discord.js.org/',
			});
		});

		test('GIVEN an embed with a pre-defined title THEN unset title THEN return valid toJSON data', () => {
			const embed = new EmbedBuilder({ url: 'https://discord.js.org' });
			embed.setURL(null);

			expect(embed.toJSON()).toStrictEqual({ url: undefined });
		});

		test.each(['owo', 'discord://user'])('GIVEN an embed with an invalid URL THEN throws error', (input) => {
			const embed = new EmbedBuilder();

			expect(() => embed.setURL(input)).toThrowError();
		});
	});

	describe('Embed Color', () => {
		test('GIVEN an embed with a pre-defined color THEN returns valid toJSON data', () => {
			const embed = new EmbedBuilder({ color: 0xff0000 });
			expect(embed.toJSON()).toStrictEqual({ color: 0xff0000 });
		});

		test('GIVEN an embed using Embed#setColor THEN returns valid toJSON data', () => {
			expect(new EmbedBuilder().setColor(0xff0000).toJSON()).toStrictEqual({ color: 0xff0000 });
			expect(new EmbedBuilder().setColor([242, 66, 245]).toJSON()).toStrictEqual({ color: 0xf242f5 });
		});

		test('GIVEN an embed with a pre-defined color THEN unset color THEN return valid toJSON data', () => {
			const embed = new EmbedBuilder({ color: 0xff0000 });
			embed.setColor(null);

			expect(embed.toJSON()).toStrictEqual({ color: undefined });
		});

		test('GIVEN an embed with an invalid color THEN throws error', () => {
			const embed = new EmbedBuilder();

			// @ts-expect-error
			expect(() => embed.setColor('RED')).toThrowError();
			// @ts-expect-error
			expect(() => embed.setColor([42, 36])).toThrowError();
			expect(() => embed.setColor([42, 36, 1_000])).toThrowError();
		});
	});

	describe('Embed Timestamp', () => {
		const now = new Date();

		test('GIVEN an embed with a pre-defined timestamp THEN returns valid toJSON data', () => {
			const embed = new EmbedBuilder({ timestamp: now.toISOString() });
			expect(embed.toJSON()).toStrictEqual({ timestamp: now.toISOString() });
		});

		test('given an embed using Embed#setTimestamp (with Date) THEN returns valid toJSON data', () => {
			const embed = new EmbedBuilder();
			embed.setTimestamp(now);

			expect(embed.toJSON()).toStrictEqual({ timestamp: now.toISOString() });
		});

		test('GIVEN an embed using Embed#setTimestamp (with int) THEN returns valid toJSON data', () => {
			const embed = new EmbedBuilder();
			embed.setTimestamp(now.getTime());

			expect(embed.toJSON()).toStrictEqual({ timestamp: now.toISOString() });
		});

		test('GIVEN an embed using Embed#setTimestamp (default) THEN returns valid toJSON data', () => {
			const embed = new EmbedBuilder();
			embed.setTimestamp();

			expect(embed.toJSON()).toStrictEqual({ timestamp: embed.data.timestamp });
		});

		test('GIVEN an embed with a pre-defined timestamp THEN unset timestamp THEN return valid toJSON data', () => {
			const embed = new EmbedBuilder({ timestamp: now.toISOString() });
			embed.setTimestamp(null);

			expect(embed.toJSON()).toStrictEqual({ timestamp: undefined });
		});
	});

	describe('Embed Thumbnail', () => {
		test('GIVEN an embed with a pre-defined thumbnail THEN returns valid toJSON data', () => {
			const embed = new EmbedBuilder({ thumbnail: { url: 'https://discord.js.org/static/logo.svg' } });
			expect(embed.toJSON()).toStrictEqual({
				thumbnail: { url: 'https://discord.js.org/static/logo.svg' },
			});
		});

		test('GIVEN an embed using Embed#setThumbnail THEN returns valid toJSON data', () => {
			const embed = new EmbedBuilder();
			embed.setThumbnail('https://discord.js.org/static/logo.svg');

			expect(embed.toJSON()).toStrictEqual({
				thumbnail: { url: 'https://discord.js.org/static/logo.svg' },
			});
		});

		test('GIVEN an embed with a pre-defined thumbnail THEN unset thumbnail THEN return valid toJSON data', () => {
			const embed = new EmbedBuilder({ thumbnail: { url: 'https://discord.js.org/static/logo.svg' } });
			embed.setThumbnail(null);

			expect(embed.toJSON()).toStrictEqual({ thumbnail: undefined });
		});

		test('GIVEN an embed with an invalid thumbnail THEN throws error', () => {
			const embed = new EmbedBuilder();

			expect(() => embed.setThumbnail('owo')).toThrowError();
		});
	});

	describe('Embed Image', () => {
		test('GIVEN an embed with a pre-defined image THEN returns valid toJSON data', () => {
			const embed = new EmbedBuilder({ image: { url: 'https://discord.js.org/static/logo.svg' } });
			expect(embed.toJSON()).toStrictEqual({
				image: { url: 'https://discord.js.org/static/logo.svg' },
			});
		});

		test('GIVEN an embed using Embed#setImage THEN returns valid toJSON data', () => {
			const embed = new EmbedBuilder();
			embed.setImage('https://discord.js.org/static/logo.svg');

			expect(embed.toJSON()).toStrictEqual({
				image: { url: 'https://discord.js.org/static/logo.svg' },
			});
		});

		test('GIVEN an embed with a pre-defined image THEN unset image THEN return valid toJSON data', () => {
			const embed = new EmbedBuilder({ image: { url: 'https://discord.js/org/static/logo.svg' } });
			embed.setImage(null);

			expect(embed.toJSON()).toStrictEqual({ image: undefined });
		});

		test('GIVEN an embed with an invalid image THEN throws error', () => {
			const embed = new EmbedBuilder();

			expect(() => embed.setImage('owo')).toThrowError();
		});
	});

	describe('Embed Author', () => {
		test('GIVEN an embed with a pre-defined author THEN returns valid toJSON data', () => {
			const embed = new EmbedBuilder({
				author: { name: 'Wumpus', icon_url: 'https://discord.js.org/static/logo.svg', url: 'https://discord.js.org' },
			});
			expect(embed.toJSON()).toStrictEqual({
				author: { name: 'Wumpus', icon_url: 'https://discord.js.org/static/logo.svg', url: 'https://discord.js.org' },
			});
		});

		test('GIVEN an embed using Embed#setAuthor THEN returns valid toJSON data', () => {
			const embed = new EmbedBuilder();
			embed.setAuthor({
				name: 'Wumpus',
				iconURL: 'https://discord.js.org/static/logo.svg',
				url: 'https://discord.js.org',
			});

			expect(embed.toJSON()).toStrictEqual({
				author: { name: 'Wumpus', icon_url: 'https://discord.js.org/static/logo.svg', url: 'https://discord.js.org' },
			});
		});

		test('GIVEN an embed with a pre-defined author THEN unset author THEN return valid toJSON data', () => {
			const embed = new EmbedBuilder({
				author: { name: 'Wumpus', icon_url: 'https://discord.js.org/static/logo.svg', url: 'https://discord.js.org' },
			});
			embed.setAuthor(null);

			expect(embed.toJSON()).toStrictEqual({ author: undefined });
		});

		test('GIVEN an embed with an invalid author name THEN throws error', () => {
			const embed = new EmbedBuilder();

			expect(() => embed.setAuthor({ name: 'a'.repeat(257) })).toThrowError();
		});
	});

	describe('Embed Footer', () => {
		test('GIVEN an embed with a pre-defined footer THEN returns valid toJSON data', () => {
			const embed = new EmbedBuilder({
				footer: { text: 'Wumpus', icon_url: 'https://discord.js.org/static/logo.svg' },
			});
			expect(embed.toJSON()).toStrictEqual({
				footer: { text: 'Wumpus', icon_url: 'https://discord.js.org/static/logo.svg' },
			});
		});

		test('GIVEN an embed using Embed#setAuthor THEN returns valid toJSON data', () => {
			const embed = new EmbedBuilder();
			embed.setFooter({ text: 'Wumpus', iconURL: 'https://discord.js.org/static/logo.svg' });

			expect(embed.toJSON()).toStrictEqual({
				footer: { text: 'Wumpus', icon_url: 'https://discord.js.org/static/logo.svg' },
			});
		});

		test('GIVEN an embed with a pre-defined footer THEN unset footer THEN return valid toJSON data', () => {
			const embed = new EmbedBuilder({
				footer: { text: 'Wumpus', icon_url: 'https://discord.js.org/static/logo.svg' },
			});
			embed.setFooter(null);

			expect(embed.toJSON()).toStrictEqual({ footer: undefined });
		});

		test('GIVEN an embed with invalid footer text THEN throws error', () => {
			const embed = new EmbedBuilder();

			expect(() => embed.setFooter({ text: 'a'.repeat(2_049) })).toThrowError();
		});
	});

	describe('Embed Fields', () => {
		test('GIVEN an embed with a pre-defined field THEN returns valid toJSON data', () => {
			const embed = new EmbedBuilder({
				fields: [{ name: 'foo', value: 'bar' }],
			});
			expect(embed.toJSON()).toStrictEqual({
				fields: [{ name: 'foo', value: 'bar' }],
			});
		});

		test('GIVEN an embed using Embed#addFields THEN returns valid toJSON data', () => {
			const embed = new EmbedBuilder();
			embed.addFields({ name: 'foo', value: 'bar' });
			embed.addFields([{ name: 'foo', value: 'bar' }]);

			expect(embed.toJSON()).toStrictEqual({
				fields: [
					{ name: 'foo', value: 'bar' },
					{ name: 'foo', value: 'bar' },
				],
			});
		});

		test('GIVEN an embed using Embed#spliceFields THEN returns valid toJSON data', () => {
			const embed = new EmbedBuilder();
			embed.addFields({ name: 'foo', value: 'bar' }, { name: 'foo', value: 'baz' });

			expect(embed.spliceFields(0, 1).toJSON()).toStrictEqual({
				fields: [{ name: 'foo', value: 'baz' }],
			});
		});

		test('GIVEN an embed using Embed#spliceFields THEN returns valid toJSON data 2', () => {
			const embed = new EmbedBuilder();
			embed.addFields(...Array.from({ length: 23 }, () => ({ name: 'foo', value: 'bar' })));

			expect(() =>
				embed.spliceFields(0, 3, ...Array.from({ length: 5 }, () => ({ name: 'foo', value: 'bar' }))),
			).not.toThrowError();
		});

		test('GIVEN an embed using Embed#spliceFields that adds additional fields resulting in fields > 25 THEN throws error', () => {
			const embed = new EmbedBuilder();
			embed.addFields(...Array.from({ length: 23 }, () => ({ name: 'foo', value: 'bar' })));

			expect(() =>
				embed.spliceFields(0, 3, ...Array.from({ length: 8 }, () => ({ name: 'foo', value: 'bar' }))),
			).toThrowError();
		});

		test('GIVEN an embed using Embed#setFields THEN returns valid toJSON data', () => {
			const embed = new EmbedBuilder();

			expect(() =>
				embed.setFields(...Array.from({ length: 25 }, () => ({ name: 'foo', value: 'bar' }))),
			).not.toThrowError();
			expect(() =>
				embed.setFields(Array.from({ length: 25 }, () => ({ name: 'foo', value: 'bar' }))),
			).not.toThrowError();
		});

		test('GIVEN an embed using Embed#setFields that sets more than 25 fields THEN throws error', () => {
			const embed = new EmbedBuilder();

			expect(() =>
				embed.setFields(...Array.from({ length: 26 }, () => ({ name: 'foo', value: 'bar' }))),
			).toThrowError();
			expect(() => embed.setFields(Array.from({ length: 26 }, () => ({ name: 'foo', value: 'bar' })))).toThrowError();
		});

		describe('GIVEN invalid field amount THEN throws error', () => {
			test('1', () => {
				const embed = new EmbedBuilder();

				expect(() =>
					embed.addFields(...Array.from({ length: 26 }, () => ({ name: 'foo', value: 'bar' }))),
				).toThrowError();
			});
		});

		describe('GIVEN invalid field name THEN throws error', () => {
			test('2', () => {
				const embed = new EmbedBuilder();

				expect(() => embed.addFields({ name: '', value: 'bar' })).toThrowError();
			});
		});

		describe('GIVEN invalid field name length THEN throws error', () => {
			test('3', () => {
				const embed = new EmbedBuilder();

				expect(() => embed.addFields({ name: 'a'.repeat(257), value: 'bar' })).toThrowError();
			});
		});

		describe('GIVEN invalid field value length THEN throws error', () => {
			test('4', () => {
				const embed = new EmbedBuilder();

				expect(() => embed.addFields({ name: '', value: 'a'.repeat(1_025) })).toThrowError();
			});
		});
	});
});
