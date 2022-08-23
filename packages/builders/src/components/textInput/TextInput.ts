import { ComponentType, type TextInputStyle, type APITextInputComponent } from 'discord-api-types/v10';
import isEqual from 'fast-deep-equal';
import {
	maxLengthValidator,
	minLengthValidator,
	placeholderValidator,
	requiredValidator,
	valueValidator,
	validateRequiredParameters,
	labelValidator,
	textInputStyleValidator,
} from './Assertions';
import type { Equatable } from '../../util/equatable';
import { isJSONEncodable, type JSONEncodable } from '../../util/jsonEncodable';
import { customIdValidator } from '../Assertions';
import { ComponentBuilder } from '../Component';

export class TextInputBuilder
	extends ComponentBuilder<APITextInputComponent>
	implements Equatable<JSONEncodable<APITextInputComponent> | APITextInputComponent>
{
	public constructor(data?: APITextInputComponent & { type?: ComponentType.TextInput }) {
		super({ type: ComponentType.TextInput, ...data });
	}

	/**
	 * Sets the custom id for this text input
	 *
	 * @param customId - The custom id of this text input
	 */
	public setCustomId(customId: string) {
		this.data.custom_id = customIdValidator.parse(customId);
		return this;
	}

	/**
	 * Sets the label for this text input
	 *
	 * @param label - The label for this text input
	 */
	public setLabel(label: string) {
		this.data.label = labelValidator.parse(label);
		return this;
	}

	/**
	 * Sets the style for this text input
	 *
	 * @param style - The style for this text input
	 */
	public setStyle(style: TextInputStyle) {
		this.data.style = textInputStyleValidator.parse(style);
		return this;
	}

	/**
	 * Sets the minimum length of text for this text input
	 *
	 * @param minLength - The minimum length of text for this text input
	 */
	public setMinLength(minLength: number) {
		this.data.min_length = minLengthValidator.parse(minLength);
		return this;
	}

	/**
	 * Sets the maximum length of text for this text input
	 *
	 * @param maxLength - The maximum length of text for this text input
	 */
	public setMaxLength(maxLength: number) {
		this.data.max_length = maxLengthValidator.parse(maxLength);
		return this;
	}

	/**
	 * Sets the placeholder of this text input
	 *
	 * @param placeholder - The placeholder of this text input
	 */
	public setPlaceholder(placeholder: string) {
		this.data.placeholder = placeholderValidator.parse(placeholder);
		return this;
	}

	/**
	 * Sets the value of this text input
	 *
	 * @param value - The value for this text input
	 */
	public setValue(value: string) {
		this.data.value = valueValidator.parse(value);
		return this;
	}

	/**
	 * Sets whether this text input is required
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
		validateRequiredParameters(this.data.custom_id, this.data.style, this.data.label);
		// eslint-disable-next-line @typescript-eslint/consistent-type-assertions
		return {
			...this.data,
		} as APITextInputComponent;
	}

	/**
	 * {@inheritDoc Equatable.equals}
	 */
	public equals(other: JSONEncodable<APITextInputComponent> | APITextInputComponent): boolean {
		if (isJSONEncodable(other)) {
			return isEqual(other.toJSON(), this.data);
		}

		return isEqual(other, this.data);
	}
}
