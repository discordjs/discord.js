import type { APITextDisplayComponent } from 'discord-api-types/v10';
import { ComponentType } from 'discord-api-types/v10';
import { validate } from '../../util/validation.js';
import { ComponentBuilder } from '../Component.js';
import { textDisplayPredicate } from './Assertions.js';

/**
 * A builder that creates API-compatible JSON data for text displays.
 */
export class TextDisplayBuilder extends ComponentBuilder<APITextDisplayComponent> {
	/**
	 * @internal
	 */
	protected readonly data: Partial<APITextDisplayComponent>;

	/**
	 * Creates a new text display.
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
		super();
		this.data = {
			...structuredClone(data),
			type: ComponentType.TextDisplay,
		};
	}

	/**
	 * Sets the text of this text display.
	 *
	 * @param content - The text to use
	 */
	public setContent(content: string) {
		this.data.content = content;
		return this;
	}

	/**
	 * {@inheritDoc ComponentBuilder.toJSON}
	 */
	public override toJSON(validationOverride?: boolean): APITextDisplayComponent {
		const clone = structuredClone(this.data);
		validate(textDisplayPredicate, clone, validationOverride);

		return clone as APITextDisplayComponent;
	}
}
