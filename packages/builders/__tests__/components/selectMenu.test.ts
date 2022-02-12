import { APISelectMenuComponent, APISelectMenuOption, ComponentType } from 'discord-api-types/v9';
import { SelectMenuComponent, SelectMenuOption } from '../../src/index';

const selectMenu = () => new SelectMenuComponent();
const selectMenuOption = () => new SelectMenuOption();

const longStr =
	'looooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooong';

describe('Button Components', () => {
	describe('Assertion Tests', () => {
		test('GIVEN valid inputs THEN Select Menu does not throw', () => {
			expect(() => selectMenu().setCustomId('foo')).not.toThrowError();
			expect(() => selectMenu().setMaxValues(10)).not.toThrowError();
			expect(() => selectMenu().setMinValues(3)).not.toThrowError();
			expect(() => selectMenu().setDisabled(true)).not.toThrowError();
			expect(() => selectMenu().setPlaceholder('description')).not.toThrowError();

			const option = selectMenuOption()
				.setLabel('test')
				.setValue('test')
				.setDefault(true)
				.setEmoji({ name: 'test' })
				.setDescription('description');
			expect(() => selectMenu().addOptions(option)).not.toThrowError();
			expect(() => selectMenu().setOptions(option)).not.toThrowError();
		});

		test('GIVEN invalid inputs THEN Select Menu does throw', () => {
			expect(() => selectMenu().setCustomId(longStr)).toThrowError();
			expect(() => selectMenu().setMaxValues(30)).toThrowError();
			expect(() => selectMenu().setMinValues(-20)).toThrowError();
			// @ts-expect-error
			expect(() => selectMenu().setDisabled(0)).toThrowError();
			expect(() => selectMenu().setPlaceholder(longStr)).toThrowError();

			expect(() => {
				selectMenuOption()
					.setLabel(longStr)
					.setValue(longStr)
					// @ts-expect-error
					.setDefault(-1)
					// @ts-expect-error
					.setEmoji({ name: 1 })
					.setDescription(longStr);
			}).toThrowError();
		});

		test('GIVEN valid JSON input THEN valid JSON history is correct', () => {
			const selectMenuOptionData: APISelectMenuOption = {
				label: 'test',
				value: 'test',
				emoji: { name: 'test' },
				default: true,
				description: 'test',
			};

			const selectMenuData: APISelectMenuComponent = {
				type: ComponentType.SelectMenu,
				custom_id: 'test',
				max_values: 10,
				min_values: 3,
				disabled: true,
				options: [selectMenuOptionData],
				placeholder: 'test',
			};

			expect(new SelectMenuComponent(selectMenuData).toJSON()).toEqual(selectMenuData);
			expect(new SelectMenuOption(selectMenuOptionData).toJSON()).toEqual(selectMenuOptionData);
		});
	});
});
