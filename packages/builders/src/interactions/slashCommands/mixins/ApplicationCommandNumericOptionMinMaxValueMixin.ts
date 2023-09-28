/**
 * This mixin holds minimum and maximum symbols used for options.
 */
export abstract class ApplicationCommandNumericOptionMinMaxValueMixin {
	/**
	 * The maximum value of this option.
	 */
	public readonly max_value?: number;

	/**
	 * The minimum value of this option.
	 */
	public readonly min_value?: number;

	/**
	 * Sets the maximum number value of this option.
	 *
	 * @param max - The maximum value this option can be
	 */
	public abstract setMaxValue(max: number): this;

	/**
	 * Sets the minimum number value of this option.
	 *
	 * @param min - The minimum value this option can be
	 */
	public abstract setMinValue(min: number): this;
}
