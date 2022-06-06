import { ComponentType, type TextInputStyle, type APITextInputComponent } from 'discord-api-types/v10';
import isEqual from 'fast-deep-equal';
import { ComponentBuilder } from '../../index';

export class UnsafeTextInputBuilder extends ComponentBuilder<APITextInputComponent> {
	public constructor(data?: APITextInputComponent & { type?: ComponentType.TextInput }) {
		super({ type: ComponentType.TextInput, ...data });
	}

	/**
	 * Sets the custom id for this text input
	 * @param customId The custom id of this text input
	 */
	public setCustomId(customId: string) {
		this.data.custom_id = customId;
		return this;
	}

	/**
	 * Sets the label for this text input
	 * @param label The label for this text input
	 */
	public setLabel(label: string) {
		this.data.label = label;
		return this;
	}

	/**
	 * Sets the style for this text input
	 * @param style The style for this text input
	 */
	public setStyle(style: TextInputStyle) {
		this.data.style = style;
		return this;
	}

	/**
	 * Sets the minimum length of text for this text input
	 * @param minLength The minimum length of text for this text input
	 */
	public setMinLength(minLength: number) {
		this.data.min_length = minLength;
		return this;
	}

	/**
	 * Sets the maximum length of text for this text input
	 * @param maxLength The maximum length of text for this text input
	 */
	public setMaxLength(maxLength: number) {
		this.data.max_length = maxLength;
		return this;
	}

	/**
	 * Sets the placeholder of this text input
	 * @param placeholder The placeholder of this text input
	 */
	public setPlaceholder(placeholder: string) {
		this.data.placeholder = placeholder;
		return this;
	}

	/**
	 * Sets the value of this text input
	 * @param value The value for this text input
	 */
	public setValue(value: string) {
		this.data.value = value;
		return this;
	}

	/**
	 * Sets whether this text input is required or not
	 * @param required Whether this text input is required or not
	 */
	public setRequired(required = true) {
		this.data.required = required;
		return this;
	}

	public toJSON(): APITextInputComponent {
		// eslint-disable-next-line @typescript-eslint/consistent-type-assertions
		return {
			...this.data,
		} as APITextInputComponent;
	}

	public equals(other: UnsafeTextInputBuilder | APITextInputComponent): boolean {
		if (other instanceof UnsafeTextInputBuilder) {
			return isEqual(other.data, this.data);
		}

		return isEqual(other, this.data);
	}
}
