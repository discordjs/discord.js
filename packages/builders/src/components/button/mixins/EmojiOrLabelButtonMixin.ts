import type { APIButtonComponent, APIButtonComponentWithSKUId, APIMessageComponentEmoji } from 'discord-api-types/v10';

export interface EmojiOrLabelButtonData extends Pick<
	Exclude<APIButtonComponent, APIButtonComponentWithSKUId>,
	'emoji' | 'label'
> {}

/**
 * A mixin that adds emoji and label symbols to a button builder.
 */
export class EmojiOrLabelButtonMixin {
	/**
	 * @internal
	 */
	declare protected readonly data: EmojiOrLabelButtonData;

	/**
	 * Sets the emoji to display on this button.
	 *
	 * @param emoji - The emoji to use
	 */
	public setEmoji(emoji: APIMessageComponentEmoji) {
		this.data.emoji = emoji;
		return this;
	}

	/**
	 * Clears the emoji on this button.
	 */
	public clearEmoji() {
		this.data.emoji = undefined;
		return this;
	}

	/**
	 * Sets the label for this button.
	 *
	 * @param label - The label to use
	 */
	public setLabel(label: string) {
		this.data.label = label;
		return this;
	}

	/**
	 * Clears the label on this button.
	 */
	public clearLabel() {
		this.data.label = undefined;
		return this;
	}
}
