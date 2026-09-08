import { ComponentType, type TextInputStyle, type APITextInputComponent } from 'discord-api-types/v10';
import { validate } from '../../util/validation.js';
import { ComponentBuilder } from '../Component.js';
import { textInputPredicate } from './Assertions.js';

/**
 * A builder that creates API-compatible JSON data for text inputs.
 */
export class TextInputBuilder extends ComponentBuilder<APITextInputComponent> {
	/**
	 * @internal
	 */
	protected readonly data: Partial<APITextInputComponent>;

	/**
	 * Creates a new text input.
	 *
	 * @param data - The API data to create this text input with
	 * @example
	 * Creating a text input from an API data object:
	 * ```ts
	 * const textInput = new TextInputBuilder({
	 * 	custom_id: 'a cool text input',
	 * 	placeholder: 'Type something',
	 * 	style: TextInputStyle.Short,
	 * });
	 * ```
	 * @example
	 * Creating a text input using setters and API data:
	 * ```ts
	 * const textInput = new TextInputBuilder({
	 * 	placeholder: 'Type something else',
	 * })
	 * 	.setCustomId('woah')
	 * 	.setStyle(TextInputStyle.Paragraph);
	 * ```
	 */
	public constructor(data: Partial<APITextInputComponent> = {}) {
		super();
		this.data = { ...structuredClone(data), type: ComponentType.TextInput };
	}

	/**
	 * Sets the custom id for this text input.
	 *
	 * @param customId - The custom id to use
	 */
	public setCustomId(customId: string) {
		this.data.custom_id = customId;
		return this;
	}

	/**
	 * Sets the style for this text input.
	 *
	 * @param style - The style to use
	 */
	public setStyle(style: TextInputStyle) {
		this.data.style = style;
		return this;
	}

	/**
	 * Sets the minimum length of text for this text input.
	 *
	 * @param minLength - The minimum length of text for this text input
	 */
	public setMinLength(minLength: number) {
		this.data.min_length = minLength;
		return this;
	}

	/**
	 * Clears the minimum length of text for this text input.
	 */
	public clearMinLength() {
		this.data.min_length = undefined;
		return this;
	}

	/**
	 * Sets the maximum length of text for this text input.
	 *
	 * @param maxLength - The maximum length of text for this text input
	 */
	public setMaxLength(maxLength: number) {
		this.data.max_length = maxLength;
		return this;
	}

	/**
	 * Clears the maximum length of text for this text input.
	 */
	public clearMaxLength() {
		this.data.max_length = undefined;
		return this;
	}

	/**
	 * Sets the placeholder for this text input.
	 *
	 * @param placeholder - The placeholder to use
	 */
	public setPlaceholder(placeholder: string) {
		this.data.placeholder = placeholder;
		return this;
	}

	/**
	 * Clears the placeholder for this text input.
	 */
	public clearPlaceholder() {
		this.data.placeholder = undefined;
		return this;
	}

	/**
	 * Sets the value for this text input.
	 *
	 * @param value - The value to use
	 */
	public setValue(value: string) {
		this.data.value = value;
		return this;
	}

	/**
	 * Clears the value for this text input.
	 */
	public clearValue() {
		this.data.value = undefined;
		return this;
	}

	/**
	 * Sets whether this text input is required.
	 *
	 * @param required - Whether this text input is required
	 */
	public setRequired(required = true) {
		this.data.required = required;
		return this;
	}

	/**
	 * {@inheritDoc ComponentBuilder.toJSON}
	 */
	public toJSON(validationOverride?: boolean): APITextInputComponent {
		const clone = structuredClone(this.data);
		validate(textInputPredicate, clone, validationOverride);

		return clone as APITextInputComponent;
	}
}
