import type { JSONEncodable } from '@discordjs/util';
import type { APIMessageSharedClientTheme, BaseThemeType } from 'discord-api-types/v10';
import { validate } from '../util/validation.js';
import { sharedClientThemePredicate } from './Assertions.js';

/**
 * A builder that creates API-compatible JSON data for shared client themes.
 *
 * @see {@link https://discord.com/developers/docs/resources/message#shared-client-theme-object}
 */
export class SharedClientThemeBuilder implements JSONEncodable<APIMessageSharedClientTheme> {
	/**
	 * The API data associated with this shared client theme.
	 */
	private readonly data: Partial<APIMessageSharedClientTheme>;

	/**
	 * Creates a new shared client theme builder.
	 *
	 * @param data - The API data to create this shared client theme with
	 */
	public constructor(data: Partial<APIMessageSharedClientTheme> = {}) {
		this.data = structuredClone(data);
	}

	/**
	 * Sets the colors of this theme.
	 *
	 * @remarks
	 * A maximum of 5 hexadecimal-encoded colors may be provided.
	 * @param colors - The hexadecimal-encoded colors to set (e.g. `'5865F2'`)
	 */
	public setColors(colors: readonly string[]): this {
		this.data.colors = [...colors];
		return this;
	}

	/**
	 * Sets the gradient angle of this theme.
	 *
	 * @remarks
	 * The value must be between `0` and `360` (inclusive).
	 * @param angle - The gradient angle (direction of theme colors)
	 */
	public setGradientAngle(angle: number): this {
		this.data.gradient_angle = angle;
		return this;
	}

	/**
	 * Sets the base mix (intensity) of this theme.
	 *
	 * @remarks
	 * The value must be between `0` and `100` (inclusive).
	 * @param baseMix - The base mix intensity
	 */
	public setBaseMix(baseMix: number): this {
		this.data.base_mix = baseMix;
		return this;
	}

	/**
	 * Sets the base theme (mode) of this theme.
	 *
	 * @param baseTheme - The base theme mode, or `null` to clear
	 */
	public setBaseTheme(baseTheme: BaseThemeType | null): this {
		this.data.base_theme = baseTheme;
		return this;
	}

	/**
	 * Clears the base theme of this theme.
	 */
	public clearBaseTheme(): this {
		this.data.base_theme = undefined;
		return this;
	}

	/**
	 * Serializes this builder to API-compatible JSON data.
	 *
	 * Note that by disabling validation, there is no guarantee that the resulting object will be valid.
	 *
	 * @param validationOverride - Force validation to run/not run regardless of your global preference
	 */
	public toJSON(validationOverride?: boolean): APIMessageSharedClientTheme {
		const data = structuredClone(this.data);
		validate(sharedClientThemePredicate, data, validationOverride);
		return data as APIMessageSharedClientTheme;
	}
}
