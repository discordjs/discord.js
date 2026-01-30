import type { APITemplate } from 'discord-api-types/v10';
import { Structure } from '../Structure.js';
import { dateToDiscordISOTimestamp } from '../utils/optimization.js';
import { kCreatedAt, kData, kUpdatedAt } from '../utils/symbols.js';
import type { Partialize } from '../utils/types.js';

/**
 * Represents a guild template on Discord.
 *
 * @typeParam Omitted - Specify the properties that will not be stored in the raw data field as a union, implement via `DataTemplate`
 * @remarks has substructures User and Guild, which need to be instantiated and stored by any extending classes using it.
 */
export class GuildTemplate<Omitted extends keyof APITemplate | '' = 'created_at' | 'updated_at'> extends Structure<
	APITemplate,
	Omitted
> {
	/**
	 * The template used for removing data from the raw data stored for each `GuildTemplate`
	 *
	 * @remarks This template has defaults, if you want to remove additional data and keep the defaults,
	 * use `Object.defineProperties`.
	 */
	public static override readonly DataTemplate: Partial<APITemplate> = {
		set created_at(_: string) {},
		set updated_at(_: string) {},
	};

	protected [kCreatedAt]: number | null = null;

	protected [kUpdatedAt]: number | null = null;

	/**
	 * @param data - The raw data from the API for the guild template.
	 */

	public constructor(data: Partialize<APITemplate, Omitted>) {
		super(data);
		this.optimizeData(data);
	}

	/**
	 * The template code (unique ID)
	 */
	public get code() {
		return this[kData].code;
	}

	/**
	 * The name of the template.
	 */
	public get name() {
		return this[kData].name;
	}

	/**
	 * The description for the template.
	 */
	public get description() {
		return this[kData].description;
	}

	/**
	 * The number of times this template has been used.
	 */
	public get usageCount() {
		return this[kData].usage_count;
	}

	/**
	 * The id of the user who created the template.
	 */
	public get creatorId() {
		return this[kData].creator_id;
	}

	/**
	 * The id of the guild this template is based on.
	 */
	public get sourceGuildId() {
		return this[kData].source_guild_id;
	}

	/**
	 * Whether this template has unsynced changes.
	 */
	public get isDirty() {
		return this[kData].is_dirty;
	}

	/**
	 * The time when this template was created at.
	 */
	public get createdAt() {
		const timestamp = this.createdTimestamp;
		return timestamp ? new Date(timestamp) : null;
	}

	/**
	 * The timestamp when this template was created at.
	 */
	public get createdTimestamp() {
		return this[kCreatedAt];
	}

	/**
	 * The time when this template was last synced to the guild
	 */
	public get updatedAt() {
		const timestamp = this.updatedTimestamp;
		return timestamp ? new Date(timestamp) : null;
	}

	/**
	 * The timestamp when this template was last synced to the guild.
	 */
	public get updatedTimestamp() {
		return this[kUpdatedAt];
	}

	/**
	 * {@inheritDoc Structure.optimizeData}
	 */
	protected override optimizeData(data: Partial<APITemplate>) {
		if (data.created_at) {
			this[kCreatedAt] = Date.parse(data.created_at);
		}

		if (data.updated_at) {
			this[kUpdatedAt] = Date.parse(data.updated_at);
		}
	}

	/**
	 * {@inheritDoc Structure.toJSON}
	 */
	public override toJSON() {
		const clone = super.toJSON();

		const createdAt = this[kCreatedAt];
		const updatedAt = this[kUpdatedAt];

		if (createdAt) {
			clone.created_at = dateToDiscordISOTimestamp(new Date(createdAt));
		}

		if (updatedAt) {
			clone.updated_at = dateToDiscordISOTimestamp(new Date(updatedAt));
		}

		return clone;
	}
}
