import { ComponentType } from 'discord-api-types/v10';
import { describe, expect, test } from 'vitest';
import { TextDisplayBuilder } from '../../../src/components/v2/TextDisplay';

describe('TextDisplay', () => {
	describe('TextDisplay content', () => {
		test('GIVEN a text display with a pre-defined content THEN return valid toJSON data', () => {
			const textDisplay = new TextDisplayBuilder({ content: 'foo' });
			expect(textDisplay.toJSON()).toEqual({ type: ComponentType.TextDisplay, content: 'foo' });
		});

		test('GIVEN a text display with a set content THEN return valid toJSON data', () => {
			const textDisplay = new TextDisplayBuilder().setContent('foo');
			expect(textDisplay.toJSON()).toEqual({ type: ComponentType.TextDisplay, content: 'foo' });
		});

		test('GIVEN a text display with a set content with an invalid id THEN throws error', () => {
			const textDisplay = new TextDisplayBuilder().setContent('foo').setId(5.5);
			expect(() => textDisplay.toJSON()).toThrowError();
		});

		test('GIVEN a text display with a pre-defined content THEN overwritten content THEN return valid toJSON data', () => {
			const textDisplay = new TextDisplayBuilder({ content: 'foo' });
			textDisplay.setContent('bar');
			expect(textDisplay.toJSON()).toEqual({ type: ComponentType.TextDisplay, content: 'bar' });
		});
	});
});
