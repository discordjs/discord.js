import type { APITextDisplayComponent } from 'discord-api-types/v10';
import { ComponentType } from 'discord-api-types/v10';
import { ComponentBuilder } from '../Component';
import { textDisplayContentPredicate } from './Assertions';

export class TextDisplayBuilder extends ComponentBuilder<APITextDisplayComponent> {
	/**
	 * Creates a new text display from API data.
	 *
	 * @param data - The API data to create this text display with
	 * @example
	 * Creating a text display from an API data object:
	 * ```ts
	 * const textDisplay = new TextDisplayBuilder({
	 * 	content: 'some text',
	 * });
	 * ```
	 * @example
	 * Creating a text display using setters and API data:
	 * ```ts
	 * const textDisplay = new TextDisplayBuilder({
	 * 	content: 'old text',
	 * })
	 * 	.setContent('new text');
	 * ```
	 */
	public constructor(data: Partial<APITextDisplayComponent> = {}) {
		super({
			type: ComponentType.TextDisplay,
			...data,
		});
	}

	/**
	 * Sets the text of this text display.
	 *
	 * @param content - The text to use
	 */
	public setContent(content: string) {
		this.data.content = textDisplayContentPredicate.parse(content);
		return this;
	}

	/**
	 * {@inheritDoc ComponentBuilder.toJSON}
	 */
	public override toJSON(): APITextDisplayComponent {
		textDisplayContentPredicate.parse(this.data.content);

		return { ...this.data } as APITextDisplayComponent;
	}
}
