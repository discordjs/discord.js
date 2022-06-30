export abstract class ApplicationCommandNumericOptionMinMaxValueMixin {
	public readonly max_value?: number;
	public readonly min_value?: number;

	/**
	 * Sets the maximum number value of this option
	 *
	 * @param max - The maximum value this option can be
	 */
	public abstract setMaxValue(max: number): this;

	/**
	 * Sets the minimum number value of this option
	 *
	 * @param min - The minimum value this option can be
	 */
	public abstract setMinValue(min: number): this;
}
