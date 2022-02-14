import { APIModalInteractionResponseCallbackData, ComponentType, TextInputStyle } from 'discord-api-types/v9';
import { ActionRow, ButtonComponent, Modal, ModalActionRowComponent, TextInputComponent } from '../../src';
import {
	componentsValidator,
	titleValidator,
	validateRequiredParameters,
} from '../../src/interactions/modals/Assertions';

const modal = () => new Modal();

describe('Modals', () => {
	describe('Assertion Tests', () => {
		test('GIVEN valid title THEN validator does not throw', () => {
			expect(() => titleValidator.parse('foobar')).not.toThrowError();
		});

		test('GIVEN invalid title THEN validator does throw', () => {
			expect(() => titleValidator.parse(42)).toThrowError();
		});

		test('GIVEN valid components THEN validator does not throw', () => {
			expect(() => componentsValidator.parse([new ActionRow(), new ActionRow()])).not.toThrowError();
		});

		test('GIVEN invalid components THEN validator does throw', () => {
			expect(() => componentsValidator.parse([new ButtonComponent(), new TextInputComponent()])).toThrowError();
		});

		test('GIVEN valid required parameters THEN validator does not throw', () => {
			expect(() => validateRequiredParameters('123', 'title', [new ActionRow(), new ActionRow()])).not.toThrowError();
		});

		test('GIVEN invalid required parameters THEN validator does throw', () => {
			expect(() =>
				// @ts-expect-error
				validateRequiredParameters('123', undefined, [new ActionRow(), new ButtonComponent()]),
			).toThrowError();
		});
	});

	test('GIVEN valid fields THEN builder does not throw', () => {
		expect(() => modal().setTitle('test').setCustomId('foobar').setComponents(new ActionRow())).not.toThrowError();
	});

	test('GIVEN invalid fields THEN builder does throw', () => {
		expect(() =>
			// @ts-expect-error
			modal().setTitle('test').setCustomId('foobar').setComponents([new ActionRow()]).toJSON(),
		).toThrowError();
		expect(() => modal().setTitle('test').setCustomId('foobar').toJSON()).toThrowError();
		// @ts-expect-error
		expect(() => modal().setTitle('test').setCustomId(42).toJSON()).toThrowError();
	});

	test('GIVEN valid input THEN valid JSON outputs are given', () => {
		const modalData: APIModalInteractionResponseCallbackData = {
			title: 'title',
			custom_id: 'custom id',
			components: [
				{
					type: ComponentType.ActionRow,
					components: [
						{
							type: ComponentType.TextInput,
							label: 'label',
							style: TextInputStyle.Paragraph,
							custom_id: 'custom id',
						},
					],
				},
			],
		};

		expect(new Modal(modalData).toJSON()).toEqual(modalData);

		expect(
			modal()
				.setTitle(modalData.title)
				.setCustomId('custom id')
				.setComponents(
					new ActionRow<ModalActionRowComponent>().addComponents(
						new TextInputComponent().setCustomId('custom id').setLabel('label').setStyle(TextInputStyle.Paragraph),
					),
				)
				.toJSON(),
		).toEqual(modalData);
	});
});
