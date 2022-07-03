import type { APITextInputComponent, TextInputStyle } from 'discord-api-types/v10';
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
import { UnsafeTextInputBuilder } from './UnsafeTextInput';
import { customIdValidator } from '../Assertions';

export class TextInputBuilder extends UnsafeTextInputBuilder {
	public override setCustomId(customId: string): this {
		return super.setCustomId(customIdValidator.parse(customId));
	}

	public override setLabel(label: string): this {
		return super.setLabel(labelValidator.parse(label));
	}

	public override setStyle(style: TextInputStyle): this {
		return super.setStyle(textInputStyleValidator.parse(style));
	}

	public override setMinLength(minLength: number) {
		return super.setMinLength(minLengthValidator.parse(minLength));
	}

	public override setMaxLength(maxLength: number) {
		return super.setMaxLength(maxLengthValidator.parse(maxLength));
	}

	public override setPlaceholder(placeholder: string) {
		return super.setPlaceholder(placeholderValidator.parse(placeholder));
	}

	public override setValue(value: string) {
		return super.setValue(valueValidator.parse(value));
	}

	public override setRequired(required = true) {
		return super.setRequired(requiredValidator.parse(required));
	}

	public override toJSON(): APITextInputComponent {
		validateRequiredParameters(this.data.custom_id, this.data.style, this.data.label);
		return super.toJSON();
	}
}
