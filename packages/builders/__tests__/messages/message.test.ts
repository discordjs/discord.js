import { AllowedMentionsTypes, BaseThemeType, MessageFlags } from 'discord-api-types/v10';
import { describe, test, expect } from 'vitest';
import { AllowedMentionsBuilder, EmbedBuilder, MessageBuilder, SharedClientThemeBuilder } from '../../src/index.js';

const base = {
	allowed_mentions: undefined,
	attachments: [],
	components: [],
	embeds: [],
	message_reference: undefined,
	poll: undefined,
	shared_client_theme: undefined,
};

describe('Message', () => {
	test('GIVEN a message with pre-defined content THEN return valid toJSON data', () => {
		const message = new MessageBuilder({ content: 'foo' });
		expect(message.toJSON()).toStrictEqual({ ...base, content: 'foo' });
	});

	test('GIVEN bad action row THEN it throws', () => {
		const message = new MessageBuilder().addActionRowComponents((row) =>
			row.addTextInputComponent((input) => input.setCustomId('abc')),
		);
		expect(() => message.toJSON()).toThrow();
	});

	test('GIVEN empty allowed mentions THEN return valid toJSON data', () => {
		const allowedMentions = new AllowedMentionsBuilder();
		expect(allowedMentions.toJSON()).toStrictEqual({});

		const message = new MessageBuilder().setContent('test').setAllowedMentions();

		expect(message.toJSON()).toStrictEqual({
			...base,
			allowed_mentions: {},
			content: 'test',
		});
	});

	test('GIVEN parse: [users] and empty users THEN return valid toJSON data', () => {
		const allowedMentions = new AllowedMentionsBuilder();
		allowedMentions.setUsers();
		allowedMentions.setParse(AllowedMentionsTypes.User);
		expect(allowedMentions.toJSON()).toStrictEqual({ parse: [AllowedMentionsTypes.User], users: [] });
	});

	test('GIVEN parse: [roles] and empty roles THEN return valid toJSON data', () => {
		const allowedMentions = new AllowedMentionsBuilder();
		allowedMentions.setRoles();
		allowedMentions.setParse(AllowedMentionsTypes.Role);
		expect(allowedMentions.toJSON()).toStrictEqual({ parse: [AllowedMentionsTypes.Role], roles: [] });
	});

	test('GIVEN specific users and parse: [users] THEN it throws', () => {
		const allowedMentions = new AllowedMentionsBuilder();
		allowedMentions.setUsers('123');
		allowedMentions.setParse(AllowedMentionsTypes.User);
		expect(() => allowedMentions.toJSON()).toThrow();
	});

	test('GIVEN specific roles and parse: [roles] THEN it throws', () => {
		const allowedMentions = new AllowedMentionsBuilder();
		allowedMentions.setRoles('123');
		allowedMentions.setParse(AllowedMentionsTypes.Role);
		expect(() => allowedMentions.toJSON()).toThrow();
	});

	test('GIVEN tons of data THEN return valid toJSON data', () => {
		const message = new MessageBuilder()
			.setContent('foo')
			.setNonce(123)
			.setTTS()
			.addEmbeds(new EmbedBuilder().setTitle('foo').setDescription('bar'))
			.setAllowedMentions({ parse: [AllowedMentionsTypes.Role] })
			.setMessageReference({ channel_id: '123', message_id: '123' })
			.addActionRowComponents((row) =>
				row.addPrimaryButtonComponents((button) => button.setCustomId('abc').setLabel('def')),
			)
			.setStickerIds('123', '456')
			.addAttachments((attachment) => attachment.setId(0).setFilename('abc'))
			.setFlags(MessageFlags.Ephemeral)
			.setEnforceNonce(false)
			.updatePoll((poll) => poll.addAnswers({ poll_media: { text: 'foo' } }).setQuestion({ text: 'foo' }));

		expect(message.toJSON()).toStrictEqual({
			content: 'foo',
			nonce: 123,
			tts: true,
			embeds: [{ title: 'foo', description: 'bar', author: undefined, fields: [], footer: undefined }],
			allowed_mentions: { parse: ['roles'] },
			message_reference: { channel_id: '123', message_id: '123' },
			components: [
				{
					type: 1,
					components: [{ type: 2, custom_id: 'abc', label: 'def', style: 1 }],
				},
			],
			sticker_ids: ['123', '456'],
			attachments: [{ id: 0, filename: 'abc' }],
			flags: 64,
			enforce_nonce: false,
			poll: {
				question: { text: 'foo' },
				answers: [{ poll_media: { text: 'foo' } }],
			},
			shared_client_theme: undefined,
		});
	});

	describe('SharedClientTheme', () => {
		test('GIVEN a message with a shared client theme THEN return valid toJSON data', () => {
			const message = new MessageBuilder().setSharedClientTheme(
				new SharedClientThemeBuilder()
					.setColors(['5865F2', '7258F2'])
					.setGradientAngle(0)
					.setBaseMix(58)
					.setBaseTheme(BaseThemeType.Dark),
			);

			expect(message.toJSON()).toStrictEqual({
				...base,
				shared_client_theme: {
					colors: ['5865F2', '7258F2'],
					gradient_angle: 0,
					base_mix: 58,
					base_theme: 1,
				},
			});
		});

		test('GIVEN a message with a function to update shared client theme THEN return valid toJSON data', () => {
			const message = new MessageBuilder().updateSharedClientTheme((theme) =>
				theme.setColors(['5865F2']).setGradientAngle(90).setBaseMix(100),
			);

			expect(message.toJSON()).toStrictEqual({
				...base,
				shared_client_theme: {
					colors: ['5865F2'],
					gradient_angle: 90,
					base_mix: 100,
					base_theme: undefined,
				},
			});
		});

		test('GIVEN a message with a shared client theme then cleared THEN shared_client_theme is undefined', () => {
			const message = new MessageBuilder()
				.setSharedClientTheme(new SharedClientThemeBuilder().setColors(['5865F2']).setGradientAngle(0).setBaseMix(50))
				.clearSharedClientTheme();

			expect(message.toJSON()).toStrictEqual(base);
		});

		test('GIVEN a SharedClientThemeBuilder with too many colors THEN it throws', () => {
			const theme = new SharedClientThemeBuilder()
				.setColors(['111111', '222222', '333333', '444444', '555555', '666666'])
				.setGradientAngle(0)
				.setBaseMix(50);

			expect(() => theme.toJSON()).toThrow();
		});

		test('GIVEN a SharedClientThemeBuilder with out of range gradient angle THEN it throws', () => {
			const theme = new SharedClientThemeBuilder().setColors(['5865F2']).setGradientAngle(400).setBaseMix(50);
			expect(() => theme.toJSON()).toThrow();
		});

		test('GIVEN a SharedClientThemeBuilder with out of range base mix THEN it throws', () => {
			const theme = new SharedClientThemeBuilder().setColors(['5865F2']).setGradientAngle(0).setBaseMix(150);
			expect(() => theme.toJSON()).toThrow();
		});

		test('GIVEN a shared client theme with base_theme set THEN clearBaseTheme works correctly', () => {
			const theme = new SharedClientThemeBuilder()
				.setColors(['5865F2'])
				.setGradientAngle(0)
				.setBaseMix(50)
				.setBaseTheme(BaseThemeType.Light)
				.clearBaseTheme();

			expect(theme.toJSON(false)).toStrictEqual({
				colors: ['5865F2'],
				gradient_angle: 0,
				base_mix: 50,
				base_theme: undefined,
			});
		});
	});
});
