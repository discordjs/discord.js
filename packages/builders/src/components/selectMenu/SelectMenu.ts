import type { APISelectMenuComponent, APISelectMenuOption } from 'discord-api-types/v10';
import { UnsafeSelectMenuBuilder } from './UnsafeSelectMenu';
import { UnsafeSelectMenuOptionBuilder } from './UnsafeSelectMenuOption';
import { normalizeArray, type RestOrArray } from '../../util/normalizeArray';
import {
	customIdValidator,
	disabledValidator,
	minMaxValidator,
	optionsLengthValidator,
	optionValidator,
	placeholderValidator,
	validateRequiredSelectMenuParameters,
} from '../Assertions';

/**
 * Represents a validated select menu component
 */
export class SelectMenuBuilder extends UnsafeSelectMenuBuilder {
	public override setPlaceholder(placeholder: string) {
		return super.setPlaceholder(placeholderValidator.parse(placeholder));
	}

	public override setMinValues(minValues: number) {
		return super.setMinValues(minMaxValidator.parse(minValues));
	}

	public override setMaxValues(maxValues: number) {
		return super.setMaxValues(minMaxValidator.parse(maxValues));
	}

	public override setCustomId(customId: string) {
		return super.setCustomId(customIdValidator.parse(customId));
	}

	public override setDisabled(disabled = true) {
		return super.setDisabled(disabledValidator.parse(disabled));
	}

	public override addOptions(...options: RestOrArray<UnsafeSelectMenuOptionBuilder | APISelectMenuOption>) {
		options = normalizeArray(options);
		optionsLengthValidator.parse(this.options.length + options.length);
		this.options.push(
			...options.map((option) =>
				option instanceof UnsafeSelectMenuOptionBuilder
					? option
					: new UnsafeSelectMenuOptionBuilder(optionValidator.parse(option) as unknown as APISelectMenuOption),
			),
		);
		return this;
	}

	public override setOptions(...options: RestOrArray<UnsafeSelectMenuOptionBuilder | APISelectMenuOption>) {
		options = normalizeArray(options);
		optionsLengthValidator.parse(options.length);
		this.options.splice(
			0,
			this.options.length,
			...options.map((option) =>
				option instanceof UnsafeSelectMenuOptionBuilder
					? option
					: new UnsafeSelectMenuOptionBuilder(optionValidator.parse(option) as unknown as APISelectMenuOption),
			),
		);
		return this;
	}

	public override toJSON(): APISelectMenuComponent {
		validateRequiredSelectMenuParameters(this.options, this.data.custom_id);
		return super.toJSON();
	}
}
