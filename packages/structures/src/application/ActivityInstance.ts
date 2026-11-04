import type { APIActivityInstance } from 'discord-api-types/v10';
import { Structure } from '../Structure.js';
import { kData } from '../utils/symbols.js';
import type { Partialize } from '../utils/types.js';

/**
 * Represents an instance of an application activity on Discord.
 *
 * @typeParam Omitted - Specify the properties that will not be stored in the raw data field as a union, implement via `DataTemplate`
 * @remarks The raw `location` field contains an `ActivityLocation` substructure, which needs to be instantiated
 * and stored by an extending class. The raw `users` field contains IDs for `User` substructures, which an extending class
 * can resolve and store.
 * These fields are preserved in `toJSON()` without constructing substructures.
 * @see {@link https://docs.discord.com/developers/resources/application#activity-instance-object}
 */
export class ActivityInstance<Omitted extends keyof APIActivityInstance | '' = ''> extends Structure<
	APIActivityInstance,
	Omitted
> {
	/**
	 * The template used for removing data from the raw data stored for each activity instance
	 */
	public static override readonly DataTemplate: Partial<APIActivityInstance> = {};

	/**
	 * @param data - The raw data received from the API for the activity instance
	 */
	public constructor(data: Partialize<APIActivityInstance, Omitted>) {
		super(data);
	}

	/**
	 * The id of the application
	 */
	public get applicationId() {
		return this[kData].application_id;
	}

	/**
	 * The id of the activity instance
	 *
	 * @remarks This is not a Discord snowflake.
	 */
	public get instanceId() {
		return this[kData].instance_id;
	}

	/**
	 * The unique id of the launch
	 */
	public get launchId() {
		return this[kData].launch_id;
	}

	/**
	 * The ids of the users currently connected to the activity instance
	 */
	public get userIds() {
		const users = this[kData].users;
		return (Array.isArray(users) ? [...users] : users) as 'users' extends Omitted
			? unknown
			: Readonly<APIActivityInstance['users']>;
	}
}
