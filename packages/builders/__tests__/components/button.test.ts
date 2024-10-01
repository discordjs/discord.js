import {
	ButtonStyle,
	ComponentType,
	type APIButtonComponentWithCustomId,
	type APIButtonComponentWithURL,
} from 'discord-api-types/v10';
import { describe, test, expect } from 'vitest';
import { ButtonBuilder } from '../../src/components/button/Button.js';
import { PrimaryButtonBuilder, PremiumButtonBuilder, LinkButtonBuilder } from '../../src/index.js';

const longStr =
	'looooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooong';

describe('Button Components', () => {
	describe('Assertion Tests', () => {
		test('GIVEN valid fields THEN builder does not throw', () => {
			expect(() => new PrimaryButtonBuilder().setCustomId('custom').setLabel('test')).not.toThrowError();

			expect(() => {
				const button = new PrimaryButtonBuilder()
					.setCustomId('custom')
					.setLabel('test')
					.setDisabled(true)
					.setEmoji({ name: 'test' });

				button.toJSON();
			}).not.toThrowError();

			expect(() => {
				const button = new PremiumButtonBuilder().setSKUId('123456789012345678');
				button.toJSON();
			}).not.toThrowError();

			expect(() => new LinkButtonBuilder().setURL('https://google.com')).not.toThrowError();
		});

		test('GIVEN invalid fields THEN build does throw', () => {
			expect(() => {
				new PrimaryButtonBuilder().setCustomId(longStr).toJSON();
			}).toThrowError();

			expect(() => {
				// @ts-expect-error: Invalid emoji
				const button = new PrimaryButtonBuilder().setEmoji('test');
				button.toJSON();
			}).toThrowError();

			expect(() => {
				const button = new PrimaryButtonBuilder();
				button.toJSON();
			}).toThrowError();

			expect(() => {
				const button = new PrimaryButtonBuilder().setCustomId('test');
				button.toJSON();
			}).toThrowError();

			// @ts-expect-error: Invalid style
			expect(() => new PrimaryButtonBuilder().setCustomId('hi').setStyle(24).toJSON()).toThrowError();
			expect(() => new PrimaryButtonBuilder().setCustomId('hi').setLabel(longStr).toJSON()).toThrowError();
			// @ts-expect-error: Invalid parameter for disabled
			expect(() => new PrimaryButtonBuilder().setCustomId('hi').setDisabled(0).toJSON()).toThrowError();
			// @ts-expect-error: Invalid emoji
			expect(() => new PrimaryButtonBuilder().setCustomId('hi').setEmoji('foo').toJSON()).toThrowError();
		});

		test('GiVEN valid input THEN valid JSON outputs are given', () => {
			const interactionData: APIButtonComponentWithCustomId = {
				type: ComponentType.Button,
				custom_id: 'test',
				label: 'test',
				style: ButtonStyle.Primary,
				disabled: true,
			};

			expect(new PrimaryButtonBuilder(interactionData).toJSON()).toEqual(interactionData);

			expect(
				new PrimaryButtonBuilder()
					.setCustomId(interactionData.custom_id)
					.setLabel(interactionData.label!)
					.setDisabled(interactionData.disabled)
					.toJSON(),
			).toEqual(interactionData);

			const linkData: APIButtonComponentWithURL = {
				type: ComponentType.Button,
				label: 'test',
				style: ButtonStyle.Link,
				disabled: true,
				url: 'https://google.com',
			};

			expect(new LinkButtonBuilder(linkData).toJSON()).toEqual(linkData);
		});
	});
});
