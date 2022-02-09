import { ComponentType, TextInputStyle, APITextInputComponent } from 'discord-api-types/v9';
import type { Component } from '..';
import { customIdValidator } from './Assertions';

export class TextInputComponent implements Component {
	public readonly type: ComponentType.TextInput = ComponentType.TextInput;
	public readonly custom_id!: string;
	public readonly label!: string;
	public readonly style!: TextInputStyle;
	public readonly min_length?: number;
	public readonly max_length?: number;
	public readonly placeholder?: string;
	public readonly value?: string;

	/**
	 * Sets the custom id for this input text
	 * @param customId The custom id of this input text
	 */
	public setCustomId(customId: string) {
		customIdValidator.parse(customId);
		Reflect.set(this, 'custom_id', customId);
		return this;
	}

	/**
	 * Sets the label for this input text
	 * @param label The label for this input text
	 */
	public setLabel(label: string) {
		Reflect.set(this, 'label', label);
		return this;
	}

	/**
	 * Sets the style for this input text
	 * @param style The style for this input text
	 */
	public setStyle(style: number) {
		Reflect.set(this, 'style', style);
		return this;
	}

	/**
	 * Sets the minimum length of text for this input text
	 * @param minLength The minimum length of text for this input text
	 */
	public setMinLength(minLength: number) {
		Reflect.set(this, 'min_length', minLength);
		return this;
	}

	/**
	 * Sets the maximum length of text for this input text
	 * @param maxLength The maximum length of text for this input text
	 */
	public setMaxLength(maxLength: number) {
		Reflect.set(this, 'max_length', maxLength);
		return this;
	}

	/**
	 * Sets the placeholder of this input text
	 * @param placeholder The placeholder of this input text
	 */
	public setPlaceholder(placeholder: string) {
		Reflect.set(this, 'placeholder', placeholder);
		return this;
	}

	/**
	 * Sets the value of this input text
	 * @param value The value for this input text
	 * @returns
	 */
	public setValue(value: string) {
		Reflect.set(this, 'value', value);
		return this;
	}

	// @ts-expect-error `style` conflicts with button `style` type ¯\_(ツ)_/¯
	public toJSON(): APITextInputComponent {
		return {
			...this,
		};
	}
}
