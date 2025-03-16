import { AllowedMentionsTypes, MessageFlags } from 'discord-api-types/v10';
import { describe, test, expect } from 'vitest';
import { EmbedBuilder, MessageBuilder } from '../../src/index.js';

const base = {
	allowed_mentions: undefined,
	attachments: [],
	components: [],
	embeds: [],
	message_reference: undefined,
	poll: undefined,
};

describe('Message', () => {
	test('GIVEN a message with pre-defined content THEN return valid toJSON data', () => {
		const message = new MessageBuilder({ content: 'foo' });
		expect(message.toJSON()).toStrictEqual({ ...base, content: 'foo' });
	});

	test('GIVEN bad action row THEN it throws', () => {
		const message = new MessageBuilder().setComponents((row) =>
			row.addTextInputComponent((input) => input.setCustomId('abc').setLabel('def')),
		);
		expect(() => message.toJSON()).toThrow();
	});

	test('GIVEN tons of data THEN return valid toJSON data', () => {
		const message = new MessageBuilder()
			.setContent('foo')
			.setNonce(123)
			.setTTS()
			.addEmbeds(new EmbedBuilder().setTitle('foo').setDescription('bar'))
			.setAllowedMentions({ parse: [AllowedMentionsTypes.Role], roles: ['123'] })
			.setMessageReference({ channel_id: '123', message_id: '123' })
			.setComponents((row) => row.addPrimaryButtonComponents((button) => button.setCustomId('abc').setLabel('def')))
			.setStickerIds('123', '456')
			.addAttachments((attachment) => attachment.setId('hi!').setFilename('abc'))
			.setFlags(MessageFlags.Ephemeral)
			.setEnforceNonce(false)
			.updatePoll((poll) => poll.addAnswers({ poll_media: { text: 'foo' } }).setQuestion({ text: 'foo' }));

		expect(message.toJSON()).toStrictEqual({
			content: 'foo',
			nonce: 123,
			tts: true,
			embeds: [{ title: 'foo', description: 'bar', author: undefined, fields: [], footer: undefined }],
			allowed_mentions: { parse: ['roles'], roles: ['123'] },
			message_reference: { channel_id: '123', message_id: '123' },
			components: [
				{
					type: 1,
					components: [{ type: 2, custom_id: 'abc', label: 'def', style: 1 }],
				},
			],
			sticker_ids: ['123', '456'],
			attachments: [{ id: 'hi!', filename: 'abc' }],
			flags: 64,
			enforce_nonce: false,
			poll: {
				question: { text: 'foo' },
				answers: [{ poll_media: { text: 'foo' } }],
			},
		});
	});
});
