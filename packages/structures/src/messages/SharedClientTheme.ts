import type { APIMessageSharedClientTheme } from 'discord-api-types/v10';
import { Structure } from '../Structure.js';
import { kData } from '../utils/symbols.js';
import type { Partialize } from '../utils/types.js';

/**
 * Represents the shared client theme sent with a Discord message.
 *
 * @typeParam Omitted - Specify the properties that will not be stored in the raw data field as a union, implement via `DataTemplate`
 * @see {@link https://docs.discord.com/developers/resources/message#shared-client-theme-object}
 */
export class SharedClientTheme<Omitted extends keyof APIMessageSharedClientTheme | '' = ''> extends Structure<
	APIMessageSharedClientTheme,
	Omitted
> {
	/**
	 * The template used for removing data from the raw data stored for each SharedClientTheme.
	 */
	public static override DataTemplate: Partial<APIMessageSharedClientTheme> = {};

	/**
	 * @param data - The raw data received from the API for the shared client theme
	 */
	public constructor(data: Partialize<APIMessageSharedClientTheme, Omitted>) {
		super(data);
	}

	/**
	 * The hexadecimal-encoded colors of this theme (max of 5)
	 */
	public get colors() {
		return this[kData].colors;
	}

	/**
	 * The gradient angle (direction) of this theme's colors (0–360)
	 */
	public get gradientAngle() {
		return this[kData].gradient_angle;
	}

	/**
	 * The base mix (intensity) of this theme's colors (0–100)
	 */
	public get baseMix() {
		return this[kData].base_mix;
	}

	/**
	 * The base theme mode
	 *
	 * @see {@link https://docs.discord.com/developers/resources/message#base-theme-types}
	 */
	public get baseTheme() {
		return this[kData].base_theme;
	}
}
