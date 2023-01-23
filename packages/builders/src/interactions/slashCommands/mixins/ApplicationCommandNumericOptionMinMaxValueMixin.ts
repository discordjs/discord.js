export abstract class ApplicationCommandNumericOptionMinMaxValueMixin {
	public readonly maxValue?: number;

	public readonly minValuevalue?: number;

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
