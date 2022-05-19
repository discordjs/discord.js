import type {
	ButtonStyle,
	APIMessageComponentEmoji,
	APIButtonComponent,
	APIButtonComponentWithCustomId,
	APIButtonComponentWithURL,
} from 'discord-api-types/v10';
import { UnsafeButtonBuilder } from './UnsafeButton';
import {
	buttonLabelValidator,
	buttonStyleValidator,
	customIdValidator,
	disabledValidator,
	emojiValidator,
	urlValidator,
	validateRequiredButtonParameters,
} from '../Assertions';

/**
 * Represents a validated button component
 */
export class ButtonBuilder extends UnsafeButtonBuilder {
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

	public override setDisabled(disabled = true) {
		return super.setDisabled(disabledValidator.parse(disabled));
	}

	public override setLabel(label: string) {
		return super.setLabel(buttonLabelValidator.parse(label));
	}

	public override toJSON(): APIButtonComponent {
		validateRequiredButtonParameters(
			this.data.style,
			this.data.label,
			this.data.emoji,
			(this.data as APIButtonComponentWithCustomId).custom_id,
			(this.data as APIButtonComponentWithURL).url,
		);
		return super.toJSON();
	}
}
