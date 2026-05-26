export type ColorResolvable = number | string | readonly [number, number, number];

const HEX_REGEX = /^#?[\da-f]{6}$/i;

export function resolveColor(color: ColorResolvable): number {
	if (typeof color === 'string') {
		if (color === 'Random') return Math.floor(Math.random() * (0xffffff + 1));
		if (color === 'Default') return 0;
		if (HEX_REGEX.test(color)) return Number.parseInt(color.replace('#', ''), 16);

		throw new RangeError(
			`Expected a color resolvable, but got "${color}". Accepted values: 0-16777215, hex strings, or RGB arrays.`,
		);
	}

	if (Array.isArray(color)) {
		return (color[0] << 16) + (color[1] << 8) + color[2];
	}

	if (!Number.isInteger(color) || color < 0 || color > 0xffffff) {
		throw new RangeError(
			`Expected a color resolvable, but got "${String(color)}". Accepted values: 0-16777215, hex strings, or RGB arrays.`,
		);
	}

	return color;
}
