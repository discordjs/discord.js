import type { APITextDisplayComponent } from 'discord-api-types/v10';
import { ComponentType } from 'discord-api-types/v10';
import { validate } from '../../util/validation.js';
import { ComponentBuilder } from '../Component.js';
import { textDisplayPredicate } from './Assertions.js';

export class TextDisplayBuilder extends ComponentBuilder<APITextDisplayComponent> {
	private readonly data: Partial<APITextDisplayComponent>;

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
