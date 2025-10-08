import { isJSONEncodable, type Equatable, type JSONEncodable } from '@discordjs/util';
import { ComponentType, type TextInputStyle, type APITextInputComponent } from 'discord-api-types/v10';
import isEqual from 'fast-deep-equal';
import { customIdValidator } from '../Assertions.js';
import { ComponentBuilder } from '../Component.js';
import {
	maxLengthValidator,
	minLengthValidator,
	placeholderValidator,
	requiredValidator,
	valueValidator,
	validateRequiredParameters,
	labelValidator,
	textInputStyleValidator,
} from './Assertions.js';

/**
 * A builder that creates API-compatible JSON data for text inputs.
 */
export class TextInputBuilder
	extends ComponentBuilder<APITextInputComponent>
	implements Equatable<APITextInputComponent | JSONEncodable<APITextInputComponent>>
{
	/**
	 * Creates a new text input from API data.
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
	public constructor(data?: APITextInputComponent & { type?: ComponentType.TextInput }) {
		super({ type: ComponentType.TextInput, ...data });
	}

	/**
	 * Sets the custom id for this text input.
	 *
	 * @param customId - The custom id to use
	 */
	public setCustomId(customId: string) {
		this.data.custom_id = customIdValidator.parse(customId);
		return this;
	}

	/**
	 * Sets the label for this text input.
	 *
	 * @param label - The label to use
	 * @deprecated Use a label builder to create a label (and optionally a description) instead.
	 */
	public setLabel(label: string) {
		this.data.label = labelValidator.parse(label);
		return this;
	}

	/**
	 * Sets the style for this text input.
	 *
	 * @param style - The style to use
	 */
	public setStyle(style: TextInputStyle) {
		this.data.style = textInputStyleValidator.parse(style);
		return this;
	}

	/**
	 * Sets the minimum length of text for this text input.
	 *
	 * @param minLength - The minimum length of text for this text input
	 */
	public setMinLength(minLength: number) {
		this.data.min_length = minLengthValidator.parse(minLength);
		return this;
	}

	/**
	 * Sets the maximum length of text for this text input.
	 *
	 * @param maxLength - The maximum length of text for this text input
	 */
	public setMaxLength(maxLength: number) {
		this.data.max_length = maxLengthValidator.parse(maxLength);
		return this;
	}

	/**
	 * Sets the placeholder for this text input.
	 *
	 * @param placeholder - The placeholder to use
	 */
	public setPlaceholder(placeholder: string) {
		this.data.placeholder = placeholderValidator.parse(placeholder);
		return this;
	}

	/**
	 * Sets the value for this text input.
	 *
	 * @param value - The value to use
	 */
	public setValue(value: string) {
		this.data.value = valueValidator.parse(value);
		return this;
	}

	/**
	 * Sets whether this text input is required.
	 *
	 * @param required - Whether this text input is required
	 */
	public setRequired(required = true) {
		this.data.required = requiredValidator.parse(required);
		return this;
	}

	/**
	 * {@inheritDoc ComponentBuilder.toJSON}
	 */
	public toJSON(): APITextInputComponent {
		validateRequiredParameters(this.data.custom_id, this.data.style);

		return {
			...this.data,
		} as APITextInputComponent;
	}

	/**
	 * Whether this is equal to another structure.
	 */
	public equals(other: APITextInputComponent | JSONEncodable<APITextInputComponent>): boolean {
		if (isJSONEncodable(other)) {
			return isEqual(other.toJSON(), this.data);
		}

		return isEqual(other, this.data);
	}
}
