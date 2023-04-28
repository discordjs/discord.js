import type { APIChannelSelectComponent, ChannelType } from 'discord-api-types/v10';
import { ComponentType } from 'discord-api-types/v10';
import { normalizeArray, type RestOrArray } from '../../util/normalizeArray.js';
import { channelTypesValidator, customIdValidator } from '../Assertions.js';
import { BaseSelectMenuBuilder } from './BaseSelectMenu.js';

/**
 * A builder that creates API-compatible JSON data for channel select menus.
 */
export class ChannelSelectMenuBuilder extends BaseSelectMenuBuilder<APIChannelSelectComponent> {
	/**
	 * Creates a new select menu from API data.
	 *
	 * @param data - The API data to create this select menu with
	 * @example
	 * Creating a select menu from an API data object:
	 * ```ts
	 * const selectMenu = new ChannelSelectMenuBuilder({
	 * 	custom_id: 'a cool select menu',
	 * 	placeholder: 'select an option',
	 * 	max_values: 2,
	 * });
	 * ```
	 * @example
	 * Creating a select menu using setters and API data:
	 * ```ts
	 * const selectMenu = new ChannelSelectMenuBuilder({
	 * 	custom_id: 'a cool select menu',
	 * })
	 * 	.addChannelTypes(ChannelType.GuildText, ChannelType.GuildAnnouncement)
	 * 	.setMinValues(2);
	 * ```
	 */
	public constructor(data?: Partial<APIChannelSelectComponent>) {
		super({ ...data, type: ComponentType.ChannelSelect });
	}

	/**
	 * Adds channel types to this select menu.
	 *
	 * @param types - The channel types to use
	 */
	public addChannelTypes(...types: RestOrArray<ChannelType>) {
		const normalizedTypes = normalizeArray(types);
		this.data.channel_types ??= [];
		this.data.channel_types.push(...channelTypesValidator.parse(normalizedTypes));
		return this;
	}

	/**
	 * Sets channel types for this select menu.
	 *
	 * @param types - The channel types to use
	 */
	public setChannelTypes(...types: RestOrArray<ChannelType>) {
		const normalizedTypes = normalizeArray(types);
		this.data.channel_types ??= [];
		this.data.channel_types.splice(0, this.data.channel_types.length, ...channelTypesValidator.parse(normalizedTypes));
		return this;
	}

	/**
	 * {@inheritDoc BaseSelectMenuBuilder.toJSON}
	 */
	public override toJSON(): APIChannelSelectComponent {
		customIdValidator.parse(this.data.custom_id);

		return {
			...this.data,
		} as APIChannelSelectComponent;
	}
}
