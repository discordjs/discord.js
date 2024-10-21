import { describe, test, expect } from 'vitest';
import { EmbedBuilder, embedLength } from '../../src/index.js';

const alpha = 'abcdefghijklmnopqrstuvwxyz';

const dummy = {
	title: 'ooooo aaaaa uuuuuu aaaa',
};

const base = {
	author: undefined,
	fields: [],
	footer: undefined,
};

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

			expect(embedLength(embed.toJSON())).toEqual(alpha.length * 6);
		});

		test('GIVEN an embed with zero characters THEN returns amount of characters', () => {
			const embed = new EmbedBuilder();

			expect(embedLength(embed.toJSON(false))).toEqual(0);
		});
	});

	describe('Embed title', () => {
		test('GIVEN an embed with a pre-defined title THEN return valid toJSON data', () => {
			const embed = new EmbedBuilder({ title: 'foo' });
			expect(embed.toJSON()).toStrictEqual({ ...base, title: 'foo' });
		});

		test('GIVEN an embed using Embed#setTitle THEN return valid toJSON data', () => {
			const embed = new EmbedBuilder();
			embed.setTitle('foo');

			expect(embed.toJSON()).toStrictEqual({ ...base, title: 'foo' });
		});

		test('GIVEN an embed with a pre-defined title THEN unset title THEN return valid toJSON data', () => {
			const embed = new EmbedBuilder({ title: 'foo', description: ':3' });
			embed.clearTitle();

			expect(embed.toJSON()).toStrictEqual({ ...base, description: ':3', title: undefined });
		});

		test('GIVEN an embed with an invalid title THEN throws error', () => {
			const embed = new EmbedBuilder();

			embed.setTitle('a'.repeat(257));

			expect(() => embed.toJSON()).toThrowError();
		});
	});

	describe('Embed description', () => {
		test('GIVEN an embed with a pre-defined description THEN return valid toJSON data', () => {
			const embed = new EmbedBuilder({ description: 'foo' });
			expect(embed.toJSON()).toStrictEqual({ ...base, description: 'foo' });
		});

		test('GIVEN an embed using Embed#setDescription THEN return valid toJSON data', () => {
			const embed = new EmbedBuilder();
			embed.setDescription('foo');

			expect(embed.toJSON()).toStrictEqual({ ...base, description: 'foo' });
		});

		test('GIVEN an embed with a pre-defined description THEN unset description THEN return valid toJSON data', () => {
			const embed = new EmbedBuilder({ description: 'foo', ...dummy });
			embed.clearDescription();

			expect(embed.toJSON()).toStrictEqual({ ...base, ...dummy, description: undefined });
		});

		test('GIVEN an embed with an invalid description THEN throws error', () => {
			const embed = new EmbedBuilder();

			embed.setDescription('a'.repeat(4_097));
			expect(() => embed.toJSON()).toThrowError();
		});
	});

	describe('Embed URL', () => {
		test('GIVEN an embed with a pre-defined url THEN returns valid toJSON data', () => {
			const embed = new EmbedBuilder({ url: 'https://discord.js.org/', ...dummy });
			expect(embed.toJSON()).toStrictEqual({
				...base,
				...dummy,
				url: 'https://discord.js.org/',
			});
		});

		test('GIVEN an embed using Embed#setURL THEN returns valid toJSON data', () => {
			const embed = new EmbedBuilder(dummy);
			embed.setURL('https://discord.js.org/');

			expect(embed.toJSON()).toStrictEqual({
				...base,
				...dummy,
				url: 'https://discord.js.org/',
			});
		});

		test('GIVEN an embed with a pre-defined title THEN unset title THEN return valid toJSON data', () => {
			const embed = new EmbedBuilder({ url: 'https://discord.js.org', ...dummy });
			embed.clearURL();

			expect(embed.toJSON()).toStrictEqual({ ...base, ...dummy, url: undefined });
		});

		test.each(['owo', 'discord://user'])('GIVEN an embed with an invalid URL THEN throws error', (input) => {
			const embed = new EmbedBuilder();

			embed.setURL(input);
			expect(() => embed.toJSON()).toThrowError();
		});
	});

	describe('Embed Color', () => {
		test('GIVEN an embed with a pre-defined color THEN returns valid toJSON data', () => {
			const embed = new EmbedBuilder({ color: 0xff0000, ...dummy });
			expect(embed.toJSON()).toStrictEqual({ ...base, ...dummy, color: 0xff0000 });
		});

		test('GIVEN an embed using Embed#setColor THEN returns valid toJSON data', () => {
			expect(new EmbedBuilder(dummy).setColor(0xff0000).toJSON()).toStrictEqual({ ...base, ...dummy, color: 0xff0000 });
		});

		test('GIVEN an embed with a pre-defined color THEN unset color THEN return valid toJSON data', () => {
			const embed = new EmbedBuilder({ ...dummy, color: 0xff0000 });
			embed.clearColor();

			expect(embed.toJSON()).toStrictEqual({ ...base, ...dummy, color: undefined });
		});

		test('GIVEN an embed with an invalid color THEN throws error', () => {
			const embed = new EmbedBuilder();

			// @ts-expect-error: Invalid color
			embed.setColor('RED');
			expect(() => embed.toJSON()).toThrowError();

			// @ts-expect-error: Invalid color
			embed.setColor([42, 36]);
			expect(() => embed.toJSON()).toThrowError();
		});
	});

	describe('Embed Timestamp', () => {
		const now = new Date();

		test('GIVEN an embed with a pre-defined timestamp THEN returns valid toJSON data', () => {
			const embed = new EmbedBuilder({ timestamp: now.toISOString(), ...dummy });
			expect(embed.toJSON()).toStrictEqual({ ...base, ...dummy, timestamp: now.toISOString() });
		});

		test('GIVEN an embed using Embed#setTimestamp (with Date) THEN returns valid toJSON data', () => {
			const embed = new EmbedBuilder(dummy);
			embed.setTimestamp(now);

			expect(embed.toJSON()).toStrictEqual({ ...base, ...dummy, timestamp: now.toISOString() });
		});

		test('GIVEN an embed using Embed#setTimestamp (with int) THEN returns valid toJSON data', () => {
			const embed = new EmbedBuilder(dummy);
			embed.setTimestamp(now.getTime());

			expect(embed.toJSON()).toStrictEqual({ ...base, ...dummy, timestamp: now.toISOString() });
		});

		test('GIVEN an embed using Embed#setTimestamp (default) THEN returns valid toJSON data', () => {
			const embed = new EmbedBuilder(dummy);
			embed.setTimestamp();

			expect(embed.toJSON()).toStrictEqual({ ...base, ...dummy, timestamp: embed.toJSON().timestamp });
		});

		test('GIVEN an embed with a pre-defined timestamp THEN unset timestamp THEN return valid toJSON data', () => {
			const embed = new EmbedBuilder({ timestamp: now.toISOString(), ...dummy });
			embed.clearTimestamp();

			expect(embed.toJSON()).toStrictEqual({ ...base, ...dummy, timestamp: undefined });
		});
	});

	describe('Embed Thumbnail', () => {
		test('GIVEN an embed with a pre-defined thumbnail THEN returns valid toJSON data', () => {
			const embed = new EmbedBuilder({ thumbnail: { url: 'https://discord.js.org/static/logo.svg' } });
			expect(embed.toJSON()).toStrictEqual({ ...base, thumbnail: { url: 'https://discord.js.org/static/logo.svg' } });
		});

		test('GIVEN an embed using Embed#setThumbnail THEN returns valid toJSON data', () => {
			const embed = new EmbedBuilder();
			embed.setThumbnail('https://discord.js.org/static/logo.svg');

			expect(embed.toJSON()).toStrictEqual({ ...base, thumbnail: { url: 'https://discord.js.org/static/logo.svg' } });
		});

		test('GIVEN an embed with a pre-defined thumbnail THEN unset thumbnail THEN return valid toJSON data', () => {
			const embed = new EmbedBuilder({ thumbnail: { url: 'https://discord.js.org/static/logo.svg' }, ...dummy });
			embed.clearThumbnail();

			expect(embed.toJSON()).toStrictEqual({ ...base, ...dummy, thumbnail: undefined });
		});

		test('GIVEN an embed with an invalid thumbnail THEN throws error', () => {
			const embed = new EmbedBuilder();

			embed.setThumbnail('owo');
			expect(() => embed.toJSON()).toThrowError();
		});
	});

	describe('Embed Image', () => {
		test('GIVEN an embed with a pre-defined image THEN returns valid toJSON data', () => {
			const embed = new EmbedBuilder({ image: { url: 'https://discord.js.org/static/logo.svg' } });
			expect(embed.toJSON()).toStrictEqual({ ...base, image: { url: 'https://discord.js.org/static/logo.svg' } });
		});

		test('GIVEN an embed using Embed#setImage THEN returns valid toJSON data', () => {
			const embed = new EmbedBuilder();
			embed.setImage('https://discord.js.org/static/logo.svg');

			expect(embed.toJSON()).toStrictEqual({ ...base, image: { url: 'https://discord.js.org/static/logo.svg' } });
		});

		test('GIVEN an embed with a pre-defined image THEN unset image THEN return valid toJSON data', () => {
			const embed = new EmbedBuilder({ image: { url: 'https://discord.js/org/static/logo.svg' }, ...dummy });
			embed.clearImage();

			expect(embed.toJSON()).toStrictEqual({ ...base, ...dummy, image: undefined });
		});

		test('GIVEN an embed with an invalid image THEN throws error', () => {
			const embed = new EmbedBuilder();

			embed.setImage('owo');
			expect(() => embed.toJSON()).toThrowError();
		});
	});

	describe('Embed Author', () => {
		test('GIVEN an embed with a pre-defined author THEN returns valid toJSON data', () => {
			const embed = new EmbedBuilder({
				author: { name: 'Wumpus', icon_url: 'https://discord.js.org/static/logo.svg', url: 'https://discord.js.org' },
			});
			expect(embed.toJSON()).toStrictEqual({
				...base,
				author: { name: 'Wumpus', icon_url: 'https://discord.js.org/static/logo.svg', url: 'https://discord.js.org' },
			});
		});

		test('GIVEN an embed using Embed#setAuthor THEN returns valid toJSON data', () => {
			const embed = new EmbedBuilder();
			embed.setAuthor((author) =>
				author.setName('Wumpus').setIconURL('https://discord.js.org/static/logo.svg').setURL('https://discord.js.org'),
			);

			expect(embed.toJSON()).toStrictEqual({
				...base,
				author: { name: 'Wumpus', icon_url: 'https://discord.js.org/static/logo.svg', url: 'https://discord.js.org' },
			});
		});

		test('GIVEN an embed with a pre-defined author THEN unset author THEN return valid toJSON data', () => {
			const embed = new EmbedBuilder({
				author: { name: 'Wumpus', icon_url: 'https://discord.js.org/static/logo.svg', url: 'https://discord.js.org' },
				...dummy,
			});
			embed.clearAuthor();

			expect(embed.toJSON()).toStrictEqual({ ...base, ...dummy, author: undefined });
		});

		test('GIVEN an embed with an invalid author name THEN throws error', () => {
			const embed = new EmbedBuilder();

			embed.setAuthor({ name: 'a'.repeat(257) });
			expect(() => embed.toJSON()).toThrowError();
		});
	});

	describe('Embed Footer', () => {
		test('GIVEN an embed with a pre-defined footer THEN returns valid toJSON data', () => {
			const embed = new EmbedBuilder({
				footer: { text: 'Wumpus', icon_url: 'https://discord.js.org/static/logo.svg' },
			});
			expect(embed.toJSON()).toStrictEqual({
				...base,
				footer: { text: 'Wumpus', icon_url: 'https://discord.js.org/static/logo.svg' },
			});
		});

		test('GIVEN an embed using Embed#setAuthor THEN returns valid toJSON data', () => {
			const embed = new EmbedBuilder();
			embed.setFooter({ text: 'Wumpus', icon_url: 'https://discord.js.org/static/logo.svg' });

			expect(embed.toJSON()).toStrictEqual({
				...base,
				footer: { text: 'Wumpus', icon_url: 'https://discord.js.org/static/logo.svg' },
			});
		});

		test('GIVEN an embed with a pre-defined footer THEN unset footer THEN return valid toJSON data', () => {
			const embed = new EmbedBuilder({
				...dummy,
				footer: { text: 'Wumpus', icon_url: 'https://discord.js.org/static/logo.svg' },
			});
			embed.clearFooter();

			expect(embed.toJSON()).toStrictEqual({ ...base, ...dummy, footer: undefined });
		});

		test('GIVEN an embed with invalid footer text THEN throws error', () => {
			const embed = new EmbedBuilder();

			embed.setFooter({ text: 'a'.repeat(2_049) });
			expect(() => embed.toJSON()).toThrowError();
		});
	});

	describe('Embed Fields', () => {
		test('GIVEN an embed with a pre-defined field THEN returns valid toJSON data', () => {
			const embed = new EmbedBuilder({
				fields: [{ name: 'foo', value: 'bar' }],
			});
			expect(embed.toJSON()).toStrictEqual({ ...base, fields: [{ name: 'foo', value: 'bar' }] });
		});

		test('GIVEN an embed using Embed#addFields THEN returns valid toJSON data', () => {
			const embed = new EmbedBuilder();
			embed.addFields({ name: 'foo', value: 'bar' });
			embed.addFields([{ name: 'foo', value: 'bar' }]);

			expect(embed.toJSON()).toStrictEqual({
				...base,
				fields: [
					{ name: 'foo', value: 'bar' },
					{ name: 'foo', value: 'bar' },
				],
			});
		});

		test('GIVEN an embed using Embed#spliceFields THEN returns valid toJSON data', () => {
			const embed = new EmbedBuilder();
			embed.addFields({ name: 'foo', value: 'bar' }, { name: 'foo', value: 'baz' });

			expect(embed.spliceFields(0, 1).toJSON()).toStrictEqual({ ...base, fields: [{ name: 'foo', value: 'baz' }] });
		});

		test('GIVEN an embed using Embed#spliceFields THEN returns valid toJSON data 2', () => {
			const embed = new EmbedBuilder();
			embed.addFields(...Array.from({ length: 23 }, () => ({ name: 'foo', value: 'bar' })));

			embed.spliceFields(0, 3, ...Array.from({ length: 5 }, () => ({ name: 'foo', value: 'bar' })));
			expect(() => embed.toJSON()).not.toThrowError();
		});

		test('GIVEN an embed using Embed#spliceFields that adds additional fields resulting in fields > 25 THEN throws error', () => {
			const embed = new EmbedBuilder();
			embed.addFields(...Array.from({ length: 23 }, () => ({ name: 'foo', value: 'bar' })));

			embed.spliceFields(0, 3, ...Array.from({ length: 8 }, () => ({ name: 'foo', value: 'bar' })));
			expect(() => embed.toJSON()).toThrowError();
		});

		test('GIVEN an embed using Embed#setFields THEN returns valid toJSON data', () => {
			const embed = new EmbedBuilder();

			embed.setFields(...Array.from({ length: 25 }, () => ({ name: 'foo', value: 'bar' })));
			expect(() => embed.toJSON()).not.toThrowError();

			embed.setFields(Array.from({ length: 25 }, () => ({ name: 'foo', value: 'bar' })));
			expect(() => embed.toJSON()).not.toThrowError();
		});

		test('GIVEN an embed using Embed#setFields that sets more than 25 fields THEN throws error', () => {
			const embed = new EmbedBuilder();

			embed.setFields(...Array.from({ length: 26 }, () => ({ name: 'foo', value: 'bar' })));
			expect(() => embed.toJSON()).toThrowError();

			embed.setFields(Array.from({ length: 26 }, () => ({ name: 'foo', value: 'bar' })));
			expect(() => embed.toJSON()).toThrowError();
		});

		describe('GIVEN invalid field amount THEN throws error', () => {
			test('1', () => {
				const embed = new EmbedBuilder();

				embed.addFields(...Array.from({ length: 26 }, () => ({ name: 'foo', value: 'bar' })));
				expect(() => embed.toJSON()).toThrowError();
			});
		});

		describe('GIVEN invalid field name THEN throws error', () => {
			test('2', () => {
				const embed = new EmbedBuilder();

				embed.addFields({ name: '', value: 'bar' });
				expect(() => embed.toJSON()).toThrowError();
			});
		});

		describe('GIVEN invalid field name length THEN throws error', () => {
			test('3', () => {
				const embed = new EmbedBuilder();

				embed.addFields({ name: 'a'.repeat(257), value: 'bar' });
				expect(() => embed.toJSON()).toThrowError();
			});
		});

		describe('GIVEN invalid field value length THEN throws error', () => {
			test('4', () => {
				const embed = new EmbedBuilder();

				embed.addFields({ name: '', value: 'a'.repeat(1_025) });
				expect(() => embed.toJSON()).toThrowError();
			});
		});
	});
});
