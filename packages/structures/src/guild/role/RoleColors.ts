import type { APIRoleColors } from 'discord-api-types/v10';
import { Structure } from '../../Structure';
import { kData } from '../../utils/symbols';
import type { Partialize } from '../../utils/types';

/**
 * Represents a role color on Discord.
 *
 * @typeParam Omitted - Specify the properties that will not be stored in the raw data field as a union, implement via `DataTemplate`
 */
export class RoleColors<Omitted extends keyof APIRoleColors | '' = ''> extends Structure<APIRoleColors, Omitted> {
	/**
	 * The template used for removing data from the raw data stored for each role color.
	 */
	public static override readonly DataTemplate: Partial<APIRoleColors> = {};

	/**
	 * @param data - The raw data from the API for the role color.
	 */
	public constructor(data: Partialize<APIRoleColors, Omitted>) {
		super(data);
	}

	/**
	 * The primary color for the role.
	 */
	public get primary_color() {
		return this[kData].primary_color;
	}

	/**
	 * The secondary color for the role, this will make the role a gradient between the other provided colors
	 */
	public get secondary_color() {
		return this[kData].secondary_color;
	}

	/**
	 * The tertiary color for the role, this will turn the gradient into a holographic style
	 *
	 * @remarks When sending `tertiary_color` the API enforces the role color to be a holographic style with values of `primary_color = 11127295`, `secondary_color = 16759788`, and `tertiary_color = 16761760`.
	 */
	public get tertiary_color() {
		return this[kData].tertiary_color;
	}
}
