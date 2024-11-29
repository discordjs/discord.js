import type { APIButtonComponent } from 'discord-api-types/v10';
import { validate } from '../../util/validation.js';
import { buttonPredicate } from '../Assertions.js';
import { ComponentBuilder } from '../Component.js';

/**
 * A builder that creates API-compatible JSON data for buttons.
 */
export abstract class BaseButtonBuilder<ButtonData extends APIButtonComponent> extends ComponentBuilder<ButtonData> {
	protected declare readonly data: Partial<ButtonData>;

	/**
	 * Sets whether this button is disabled.
	 *
	 * @param disabled - Whether to disable this button
	 */
	public setDisabled(disabled = true) {
		this.data.disabled = disabled;
		return this;
	}

	/**
	 * {@inheritDoc ComponentBuilder.toJSON}
	 */
	public override toJSON(validationOverride?: boolean): ButtonData {
		const clone = structuredClone(this.data);
		validate(buttonPredicate, clone, validationOverride);

		return clone as ButtonData;
	}
}
