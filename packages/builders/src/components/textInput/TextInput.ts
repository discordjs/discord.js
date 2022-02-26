import type { APITextInputComponent } from 'discord-api-types/v10';
import {
	maxLengthValidator,
	minLengthValidator,
	placeholderValidator,
	requiredValidator,
	valueValidator,
	validateRequiredParameters,
} from './Assertions';
import { UnsafeTextInputBuilder } from './UnsafeTextInput';

export class TextInputBuilder extends UnsafeTextInputBuilder {
	public override setMinLength(minLength: number) {
		return super.setMinLength(minLengthValidator.parse(minLength));
	}

	public override setMaxLength(maxLength: number) {
		return super.setMaxLength(maxLengthValidator.parse(maxLength));
	}

	public override setRequired(required = true) {
		return super.setRequired(requiredValidator.parse(required));
	}

	public override setValue(value: string) {
		return super.setValue(valueValidator.parse(value));
	}

	public override setPlaceholder(placeholder: string) {
		return super.setPlaceholder(placeholderValidator.parse(placeholder));
	}

	public override toJSON(): APITextInputComponent {
		validateRequiredParameters(this.data.custom_id, this.data.style, this.data.label);
		return super.toJSON();
	}
}
