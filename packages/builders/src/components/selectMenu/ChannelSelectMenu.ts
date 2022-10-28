import type { APIChannelSelectComponent, ChannelType } from 'discord-api-types/v10';
import { ComponentType } from 'discord-api-types/v10';
import { normalizeArray, type RestOrArray } from '../../util/normalizeArray.js';
import { customIdValidator } from '../Assertions.js';
import { BaseSelectMenuBuilder } from './BaseSelectMenu.js';

export class ChannelSelectMenuBuilder extends BaseSelectMenuBuilder<APIChannelSelectComponent> {
	/**
	 * Creates a new select menu from API data
	 *
	 * @param data - The API data to create this select menu with
	 * @example
	 * Creating a select menu from an API data object
	 * ```ts
	 * const selectMenu = new ChannelSelectMenuBuilder({
	 * 	custom_id: 'a cool select menu',
	 * 	placeholder: 'select an option',
	 * 	max_values: 2,
	 * });
	 * ```
	 * @example
	 * Creating a select menu using setters and API data
	 * ```ts
	 * const selectMenu = new ChannelSelectMenuBuilder({
	 * 	custom_id: 'a cool select menu',
	 * })
	 * 	.addChannelTypes(ChannelType.GuildText, ChannelType.GuildAnnouncement)
	 * 	.setMinValues(2)
	 * ```
	 */
	public constructor(data?: Partial<APIChannelSelectComponent>) {
		const { channel_types = [], ...initData } = data ?? {};
		super({ ...initData, type: ComponentType.ChannelSelect, channel_types });
	}

	public addChannelTypes(...types: RestOrArray<ChannelType>) {
		// eslint-disable-next-line no-param-reassign
		types = normalizeArray(types);
		this.data.channel_types?.push(...types);
		return this;
	}

	public setChannelTypes(...types: RestOrArray<ChannelType>) {
		// eslint-disable-next-line no-param-reassign
		types = normalizeArray(types);

		this.data.channel_types?.splice(0, this.data.channel_types.length, ...types);
		return this;
	}

	/**
	 * {@inheritDoc ComponentBuilder.toJSON}
	 */
	public override toJSON(): APIChannelSelectComponent {
		customIdValidator.parse(this.data.custom_id);

		return {
			...this.data,
		} as APIChannelSelectComponent;
	}
}
