import { ComponentType, SeparatorSpacingSize } from 'discord-api-types/v10';
import { describe, expect, test } from 'vitest';
import { SeparatorBuilder } from '../../../src/components/v2/Separator';

describe('Separator', () => {
	describe('Divider', () => {
		test('GIVEN a separator with a pre-defined divider THEN return valid toJSON data', () => {
			const separator = new SeparatorBuilder({ divider: true });
			expect(separator.toJSON()).toEqual({ type: ComponentType.Separator, divider: true });
		});

		test('GIVEN a separator with a set divider THEN return valid toJSON data', () => {
			const separator = new SeparatorBuilder().setDivider(false);
			expect(separator.toJSON()).toEqual({ type: ComponentType.Separator, divider: false });
		});
	});

	describe('Spacing', () => {
		test('GIVEN a separator with a pre-defined spacing THEN return valid toJSON data', () => {
			const separator = new SeparatorBuilder({ spacing: SeparatorSpacingSize.Small });
			expect(separator.toJSON()).toEqual({ type: ComponentType.Separator, spacing: SeparatorSpacingSize.Small });
		});

		test('GIVEN a separator with a set spacing THEN return valid toJSON data', () => {
			const separator = new SeparatorBuilder().setSpacing(SeparatorSpacingSize.Large);
			expect(separator.toJSON()).toEqual({ type: ComponentType.Separator, spacing: SeparatorSpacingSize.Large });
		});

		test('GIVEN a separator with a set spacing THEN clear spacing THEN return valid toJSON data', () => {
			const separator = new SeparatorBuilder({ spacing: SeparatorSpacingSize.Small });
			separator.clearSpacing();
			expect(separator.toJSON()).toEqual({ type: ComponentType.Separator });
		});
	});

	describe('Invalid id', () => {
		test('GIVEN a separator with a set spacing and an invalid set id THEN throws error', () => {
			const separator = new SeparatorBuilder().setSpacing(SeparatorSpacingSize.Large).setId(-1);
			expect(() => separator.toJSON()).toThrowError();
		});
	});
});
