import type { ChannelType } from 'discord-api-types/v10';
import { ComponentType, type APISelectMenuComponent } from 'discord-api-types/v10';
import { normalizeArray, type RestOrArray } from '../../util/normalizeArray.js';
import { customIdValidator } from '../Assertions.js';
import { BaseSelectMenu } from './BaseSelectMenu.js';

export class ChannelSelectMenuBuilder extends BaseSelectMenu {
	public channel_types: ChannelType[];

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
	public constructor(data?: Partial<APISelectMenuComponent>) {
		const { channel_types, ...initData } = data ?? {};
		super({ type: ComponentType.ChannelSelect, ...initData });
		this.channel_types = channel_types ?? [];
	}

	public addChannelTypes(...types: RestOrArray<ChannelType>) {
		// eslint-disable-next-line no-param-reassign
		types = normalizeArray(types);

		this.channel_types.push(...types);
		return this;
	}

	public setChannelTypes(...types: RestOrArray<ChannelType>) {
		// eslint-disable-next-line no-param-reassign
		types = normalizeArray(types);

		this.channel_types.splice(0, this.channel_types.length, ...types);
		return this;
	}

	/**
	 * {@inheritDoc ComponentBuilder.toJSON}
	 */
	public override toJSON(): APISelectMenuComponent {
		customIdValidator.parse(this.data.custom_id);

		return {
			...this.data,
			channel_types: this.channel_types,
		} as APISelectMenuComponent;
	}
}
