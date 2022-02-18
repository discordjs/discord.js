import type { APISelectMenuComponent } from 'discord-api-types/v10';
import {
	customIdValidator,
	disabledValidator,
	minMaxValidator,
	placeholderValidator,
	validateRequiredSelectMenuParameters,
} from '../Assertions';
import { UnsafeSelectMenuBuilder } from './UnsafeSelectMenu';

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

	public override toJSON(): APISelectMenuComponent {
		validateRequiredSelectMenuParameters(this.options, this.data.custom_id);
		return super.toJSON();
	}
}
