import { APISelectMenuOption, ComponentType, type APISelectMenuComponent } from 'discord-api-types/v9';
import { Component } from '../Component';
import { UnsafeSelectMenuOption } from './UnsafeSelectMenuOption';
import isEqual from 'fast-deep-equal';

/**
 * Represents a non-validated select menu component
 */
export class UnsafeSelectMenuComponent extends Component<
	Partial<Omit<APISelectMenuComponent, 'options'>> & { type: ComponentType.SelectMenu }
> {
	/**
	 * The options within this select menu
	 */
	public readonly options: UnsafeSelectMenuOption[];

	public constructor(data?: Partial<APISelectMenuComponent>) {
		const { options, ...initData } = data ?? {};
		super({ type: ComponentType.SelectMenu, ...initData });
		this.options = options?.map((o) => new UnsafeSelectMenuOption(o)) ?? [];
	}

	/**
	 * The placeholder for this select menu
	 */
	public get placeholder() {
		return this.data.placeholder;
	}

	/**
	 * The maximum amount of options that can be selected
	 */
	public get maxValues() {
		return this.data.max_values;
	}

	/**
	 * The minimum amount of options that must be selected
	 */
	public get minValues() {
		return this.data.min_values;
	}

	/**
	 * The custom id of this select menu
	 */
	public get customId() {
		return this.data.custom_id;
	}

	/**
	 * Whether this select menu is disabled
	 */
	public get disabled() {
		return this.data.disabled;
	}

	/**
	 * Sets the placeholder for this select menu
	 * @param placeholder The placeholder to use for this select menu
	 */
	public setPlaceholder(placeholder: string) {
		this.data.placeholder = placeholder;
		return this;
	}

	/**
	 * Sets the minimum values that must be selected in the select menu
	 * @param minValues The minimum values that must be selected
	 */
	public setMinValues(minValues: number) {
		this.data.min_values = minValues;
		return this;
	}

	/**
	 * Sets the maximum values that must be selected in the select menu
	 * @param minValues The maximum values that must be selected
	 */
	public setMaxValues(maxValues: number) {
		this.data.max_values = maxValues;
		return this;
	}

	/**
	 * Sets the custom Id for this select menu
	 * @param customId The custom id to use for this select menu
	 */
	public setCustomId(customId: string) {
		this.data.custom_id = customId;
		return this;
	}

	/**
	 * Sets whether or not this select menu is disabled
	 * @param disabled Whether or not this select menu is disabled
	 */
	public setDisabled(disabled = true) {
		this.data.disabled = disabled;
		return this;
	}

	/**
	 * Adds options to this select menu
	 * @param options The options to add to this select menu
	 * @returns
	 */
	public addOptions(...options: (UnsafeSelectMenuOption | APISelectMenuOption)[]) {
		this.options.push(
			...options.map((option) =>
				option instanceof UnsafeSelectMenuOption ? option : new UnsafeSelectMenuOption(option),
			),
		);
		return this;
	}

	/**
	 * Sets the options on this select menu
	 * @param options The options to set on this select menu
	 */
	public setOptions(...options: (UnsafeSelectMenuOption | APISelectMenuOption)[]) {
		this.options.splice(
			0,
			this.options.length,
			...options.map((option) =>
				option instanceof UnsafeSelectMenuOption ? option : new UnsafeSelectMenuOption(option),
			),
		);
		return this;
	}

	public toJSON(): APISelectMenuComponent {
		// eslint-disable-next-line @typescript-eslint/consistent-type-assertions
		return {
			...this.data,
			options: this.options.map((o) => o.toJSON()),
		} as APISelectMenuComponent;
	}

	public equals(other: APISelectMenuComponent | UnsafeSelectMenuComponent): boolean {
		if (other instanceof UnsafeSelectMenuComponent) {
			return isEqual(other.data, this.data) && isEqual(other.options, this.options);
		}
		return isEqual(other, {
			...this.data,
			options: this.options.map((o) => o.toJSON()),
		});
	}
}
