import type { APISelectMenuComponent } from 'discord-api-types/v9';
import {
	customIdValidator,
	disabledValidator,
	minMaxValidator,
	placeholderValidator,
	validateRequiredSelectMenuParameters,
} from '../Assertions';
import { UnsafeSelectMenuComponent } from './UnsafeSelectMenu';

/**
 * Represents a validated select menu component
 */
export class SelectMenuComponent extends UnsafeSelectMenuComponent {
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

	public override setDisabled(disabled: boolean) {
		return super.setDisabled(disabledValidator.parse(disabled));
	}

	public override toJSON(): APISelectMenuComponent {
		validateRequiredSelectMenuParameters(this.options, this.customId);
		return super.toJSON();
	}
}
