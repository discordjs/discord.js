import { ComponentType, type TextInputStyle, type APITextInputComponent } from 'discord-api-types/v10';
import { Component } from '../../index';
import type { TextInputComponent } from './TextInput';
import isEqual from 'fast-deep-equal';

export class UnsafeTextInputComponent extends Component<
	Partial<APITextInputComponent> & { type: ComponentType.TextInput }
> {
	public equals(other: TextInputComponent | APITextInputComponent): boolean {
		if (other instanceof UnsafeTextInputComponent) {
			return isEqual(other.data, this.data);
		}

		return isEqual(other, this.data);
	}

	public constructor(data?: APITextInputComponent & { type?: ComponentType.TextInput }) {
		super({ type: ComponentType.TextInput, ...data });
	}

	/**
	 * The style of this text input
	 */
	public get style() {
		return this.data.style;
	}

	/**
	 * The custom id of this text input
	 */
	public get customId() {
		return this.data.custom_id;
	}

	/**
	 * The label for this text input
	 */
	public get label() {
		return this.data.label;
	}

	/**
	 * The placeholder text for this text input
	 */
	public get placeholder() {
		return this.data.placeholder;
	}

	/**
	 * The default value for this text input
	 */
	public get value() {
		return this.data.value;
	}

	/**
	 * The minimum length of this text input
	 */
	public get minLength() {
		return this.data.min_length;
	}

	/**
	 * The maximum length of this text input
	 */
	public get maxLength() {
		return this.data.max_length;
	}

	/**
	 * Whether this text input is required
	 */
	public get required() {
		return this.data.required;
	}

	/**
	 * Sets the custom id for this input text
	 * @param customId The custom id of this input text
	 */
	public setCustomId(customId: string) {
		this.data.custom_id = customId;
		return this;
	}

	/**
	 * Sets the label for this input text
	 * @param label The label for this input text
	 */
	public setLabel(label: string) {
		this.data.label = label;
		return this;
	}

	/**
	 * Sets the style for this input text
	 * @param style The style for this input text
	 */
	public setStyle(style: TextInputStyle) {
		this.data.style = style;
		return this;
	}

	/**
	 * Sets the minimum length of text for this input text
	 * @param minLength The minimum length of text for this input text
	 */
	public setMinLength(minLength: number) {
		this.data.min_length = minLength;
		return this;
	}

	/**
	 * Sets the maximum length of text for this input text
	 * @param maxLength The maximum length of text for this input text
	 */
	public setMaxLength(maxLength: number) {
		this.data.max_length = maxLength;
		return this;
	}

	/**
	 * Sets the placeholder of this input text
	 * @param placeholder The placeholder of this input text
	 */
	public setPlaceholder(placeholder: string) {
		this.data.placeholder = placeholder;
		return this;
	}

	/**
	 * Sets the value of this input text
	 * @param value The value for this input text
	 */
	public setValue(value: string) {
		this.data.value = value;
		return this;
	}

	/**
	 * Sets whether this text input is required or not
	 * @param required Whether this text input is required or not
	 */
	public setRequired(required: boolean) {
		this.data.required = required;
		return this;
	}

	public toJSON(): APITextInputComponent {
		// eslint-disable-next-line @typescript-eslint/consistent-type-assertions
		return {
			...this.data,
		} as APITextInputComponent;
	}
}
