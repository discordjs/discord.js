import type { ActivityFlags, GatewayActivity, ActivityType } from 'discord-api-types/v10';
import { Structure } from '../../Structure.js';
import { ActivityFlagsBitField } from '../../bitfields/ActivityFlagsBitField.js';
import { kData } from '../../utils/symbols.js';
import { isFieldSet } from '../../utils/type-guards.js';
import type { Partialize } from '../../utils/types.js';

/**
 * Represents any activity on Discord.
 *
 * @typeParam Omitted - Specify the properties that will not be stored in the raw data field as a union, implement via `DataTemplate`.
 * @remarks has substructures `ActivityTimestamps`, `ActivityParty`,`ActivityAssets`, `ActivitySecrets` which need to be instantiated
 * and stored by an extending class using it.
 * @remarks intentionally does not export `buttons` so that extending classes can resolve `string[]` to `ActivityButton[]`
 */
export class Activity<Omitted extends keyof GatewayActivity | '' = ''> extends Structure<GatewayActivity, Omitted> {
	/**
	 * The template used for removing data from the raw data stored for each activity
	 */
	public static override readonly DataTemplate: Partial<GatewayActivity> = {};

	/**
	 * @param data - The raw data received from the API for the activity
	 */
	public constructor(data: Partialize<GatewayActivity, Omitted>) {
		super(data);
	}

	/**
	 * The name of the activity
	 */
	public get name() {
		return this[kData].name;
	}

	/**
	 * The type of this activity
	 *
	 * @see {@link https://discord.com/developers/docs/events/gateway-events#activity-object-activity-types}
	 */
	public get type() {
		return this[kData].type;
	}

	/**
	 * Stream URL, is validated when type is {@link ActivityType.Streaming}
	 */
	public get url() {
		return this[kData].url;
	}

	/**
	 * Time of when the activity was added to the user's session
	 */
	public get createdAt() {
		const timestamp = this[kData].created_at;

		return timestamp ? new Date(timestamp as number) : null;
	}

	/**
	 * Unix timestamp (in milliseconds) of when the activity was added to the user's session
	 */
	public get createdTimestamp() {
		return this[kData].created_at;
	}

	/**
	 * Application id for the game
	 */
	public get applicationId() {
		return this[kData].application_id;
	}

	/**
	 * Controls which field is displayed in the user's status text in the member list
	 *
	 * @see {@link https://discord.com/developers/docs/events/gateway-events#activity-object-status-display-types}
	 */
	public get statusDisplayType() {
		return this[kData].status_display_type;
	}

	/**
	 * What the player is currently doing
	 */
	public get details() {
		return this[kData].details;
	}

	/**
	 * URL that is linked when clicking on the details text
	 */
	public get detailsURL() {
		return this[kData].details_url;
	}

	/**
	 * User's current party status, or text used for a custom status
	 */
	public get state() {
		return this[kData].state;
	}

	/**
	 * URL that is linked when clicking on the state text
	 */
	public get stateURL() {
		return this[kData].state_url;
	}

	/**
	 * Whether the activity is an instanced game session
	 */
	public get instance() {
		return this[kData].instance;
	}

	/**
	 * Activity flags `OR`d together, describes what the payload includes
	 *
	 * @see {@link https://discord.com/developers/docs/events/gateway-events#activity-object-activity-flags}
	 */
	public get flags() {
		return isFieldSet(this[kData], 'flags', 'number')
			? new ActivityFlagsBitField(this[kData].flags as ActivityFlags)
			: null;
	}
}
