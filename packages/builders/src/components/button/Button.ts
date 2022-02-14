import type { ButtonStyle, APIMessageComponentEmoji, APIButtonComponent } from 'discord-api-types/v9';
import {
	buttonLabelValidator,
	buttonStyleValidator,
	customIdValidator,
	disabledValidator,
	emojiValidator,
	urlValidator,
	validateRequiredButtonParameters,
} from '../Assertions';
import { UnsafeButtonComponent } from './UnsafeButton';

/**
 * Represents a validated button component
 */
export class ButtonComponent extends UnsafeButtonComponent {
	public override setStyle(style: ButtonStyle) {
		return super.setStyle(buttonStyleValidator.parse(style));
	}

	public override setURL(url: string) {
		return super.setURL(urlValidator.parse(url));
	}

	public override setCustomId(customId: string) {
		return super.setCustomId(customIdValidator.parse(customId));
	}

	public override setEmoji(emoji: APIMessageComponentEmoji) {
		return super.setEmoji(emojiValidator.parse(emoji));
	}

	public override setDisabled(disabled: boolean) {
		return super.setDisabled(disabledValidator.parse(disabled));
	}

	public override setLabel(label: string) {
		return super.setLabel(buttonLabelValidator.parse(label));
	}

	public override toJSON(): APIButtonComponent {
		validateRequiredButtonParameters(this.style, this.label, this.emoji, this.customId, this.url);
		return super.toJSON();
	}
}
