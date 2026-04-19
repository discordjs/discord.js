/**
 * A tuple representing a color as red, green, and blue components, each in the range 0-255.
 */
export type RGBTuple = readonly [red: number, green: number, blue: number];

/**
 * A hex color string, prefixed with `#`.
 */
export type HexColorString = `#${string}`;

/**
 * Data that can be resolved to a numeric color value.
 */
export type ColorResolvable = HexColorString | RGBTuple | number;

/**
 * Resolves a color input to an integer color value.
 *
 * @param color - The color to resolve
 * @throws {@link RangeError} If the resolved color is outside the range of 0 to `0xffffff`,
 * or if an RGB tuple contains a component outside 0-255.
 * @throws {@link TypeError} If the input is an invalid hex string or malformed RGB tuple.
 */
export function resolveColor(color: ColorResolvable): number {
	let resolved: number;

	if (typeof color === 'string' && /^#?[\da-f]{6}$/i.test(color)) {
		resolved = Number.parseInt(color.replace('#', ''), 16);
	} else if (Array.isArray(color)) {
		if (color.length !== 3 || color.some((component) => typeof component !== 'number')) {
			throw new TypeError('Invalid color tuple: expected [red, green, blue] with numeric components.');
		}

		for (const component of color) {
			if (!Number.isInteger(component) || component < 0 || component > 0xff) {
				throw new RangeError('RGB tuple components must be integers within the range 0 to 255.');
			}
		}

		resolved = (color[0] << 16) + (color[1] << 8) + color[2];
	} else if (typeof color === 'number') {
		resolved = color;
	} else {
		throw new TypeError('Invalid color: expected a number, RGB tuple, or "#rrggbb" hex string.');
	}

	if (!Number.isInteger(resolved) || resolved < 0 || resolved > 0xffffff) {
		throw new RangeError('Color must be within the range 0 to 16777215 (0xFFFFFF).');
	}

	return resolved;
}
