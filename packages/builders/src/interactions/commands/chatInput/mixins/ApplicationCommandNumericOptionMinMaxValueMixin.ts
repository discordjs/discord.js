import type { APIApplicationCommandIntegerOption } from 'discord-api-types/v10';

export interface ApplicationCommandNumericOptionMinMaxValueData
	extends Pick<APIApplicationCommandIntegerOption, 'max_value' | 'min_value'> {}

/**
 * This mixin holds minimum and maximum symbols used for options.
 */
export abstract class ApplicationCommandNumericOptionMinMaxValueMixin {
	protected declare readonly data: ApplicationCommandNumericOptionMinMaxValueData;

	/**
	 * Sets the maximum number value of this option.
	 *
	 * @param max - The maximum value this option can be
	 */
	public setMaxValue(max: number): this {
		this.data.max_value = max;
		return this;
	}

	/**
	 * Removes the maximum number value of this option.
	 */
	public clearMaxValue(): this {
		this.data.max_value = undefined;
		return this;
	}

	/**
	 * Sets the minimum number value of this option.
	 *
	 * @param min - The minimum value this option can be
	 */
	public setMinValue(min: number): this {
		this.data.min_value = min;
		return this;
	}

	/**
	 * Removes the minimum number value of this option.
	 */
	public clearMinValue(): this {
		this.data.min_value = undefined;
		return this;
	}
}
