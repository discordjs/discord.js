import {
	ButtonStyle,
	ComponentType,
	type APIButtonComponentWithCustomId,
	type APIButtonComponentWithURL,
} from 'discord-api-types/v10';
import { describe, test, expect } from 'vitest';
import { buttonLabelValidator, buttonStyleValidator } from '../../src/components/Assertions.js';
import { ButtonBuilder } from '../../src/components/button/Button.js';

const buttonComponent = () => new ButtonBuilder();

const longStr =
	'looooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooong';

describe('Button Components', () => {
	describe('Assertion Tests', () => {
		test('GIVEN valid label THEN validator does not throw', () => {
			expect(() => buttonLabelValidator.parse('foobar')).not.toThrowError();
		});

		test('GIVEN invalid label THEN validator does throw', () => {
			expect(() => buttonLabelValidator.parse(null)).toThrowError();
			expect(() => buttonLabelValidator.parse('')).toThrowError();

			expect(() => buttonLabelValidator.parse(longStr)).toThrowError();
		});

		test('GIVEN valid style THEN validator does not throw', () => {
			expect(() => buttonStyleValidator.parse(3)).not.toThrowError();
			expect(() => buttonStyleValidator.parse(ButtonStyle.Secondary)).not.toThrowError();
		});

		test('GIVEN invalid style THEN validator does throw', () => {
			expect(() => buttonStyleValidator.parse(7)).toThrowError();
		});

		test('GIVEN valid fields THEN builder does not throw', () => {
			expect(() =>
				buttonComponent().setCustomId('custom').setStyle(ButtonStyle.Primary).setLabel('test'),
			).not.toThrowError();

			expect(() => {
				const button = buttonComponent()
					.setCustomId('custom')
					.setStyle(ButtonStyle.Primary)
					.setDisabled(true)
					.setEmoji({ name: 'test' });

				button.toJSON();
			}).not.toThrowError();

			expect(() => buttonComponent().setURL('https://google.com')).not.toThrowError();
		});

		test('GIVEN invalid fields THEN build does throw', () => {
			expect(() => {
				buttonComponent().setCustomId(longStr);
			}).toThrowError();

			expect(() => {
				const button = buttonComponent()
					.setCustomId('custom')
					.setStyle(ButtonStyle.Primary)
					.setDisabled(true)
					.setLabel('test')
					.setURL('https://google.com')
					.setEmoji({ name: 'test' });

				button.toJSON();
			}).toThrowError();

			expect(() => {
				// @ts-expect-error: Invalid emoji
				const button = buttonComponent().setEmoji('test');
				button.toJSON();
			}).toThrowError();

			expect(() => {
				const button = buttonComponent().setStyle(ButtonStyle.Primary);
				button.toJSON();
			}).toThrowError();

			expect(() => {
				const button = buttonComponent().setStyle(ButtonStyle.Primary).setCustomId('test');
				button.toJSON();
			}).toThrowError();

			expect(() => {
				const button = buttonComponent().setStyle(ButtonStyle.Link);
				button.toJSON();
			}).toThrowError();

			expect(() => {
				const button = buttonComponent().setStyle(ButtonStyle.Primary).setLabel('test').setURL('https://google.com');
				button.toJSON();
			}).toThrowError();

			expect(() => {
				const button = buttonComponent().setStyle(ButtonStyle.Link).setLabel('test');
				button.toJSON();
			}).toThrowError();

			// @ts-expect-error: Invalid style
			expect(() => buttonComponent().setStyle(24)).toThrowError();
			expect(() => buttonComponent().setLabel(longStr)).toThrowError();
			// @ts-expect-error: Invalid parameter for disabled
			expect(() => buttonComponent().setDisabled(0)).toThrowError();
			// @ts-expect-error: Invalid emoji
			expect(() => buttonComponent().setEmoji('foo')).toThrowError();

			expect(() => buttonComponent().setURL('foobar')).toThrowError();
		});

		test('GiVEN valid input THEN valid JSON outputs are given', () => {
			const interactionData: APIButtonComponentWithCustomId = {
				type: ComponentType.Button,
				custom_id: 'test',
				label: 'test',
				style: ButtonStyle.Primary,
				disabled: true,
			};

			expect(new ButtonBuilder(interactionData).toJSON()).toEqual(interactionData);

			expect(
				buttonComponent()
					.setCustomId(interactionData.custom_id)
					.setLabel(interactionData.label!)
					.setStyle(interactionData.style)
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

			expect(new ButtonBuilder(linkData).toJSON()).toEqual(linkData);

			expect(buttonComponent().setLabel(linkData.label!).setDisabled(true).setURL(linkData.url));
		});
	});
});
