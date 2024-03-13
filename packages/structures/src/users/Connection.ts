import type { APIConnection } from 'discord-api-types/v10';
import { Structure } from '../Structure.js';
import { kData } from '../utils/symbols.js';

/**
 * Represents a user's connection on Discord.
 *
 * @typeParam Omitted - Specify the propeties that will not be stored in the raw data field as a union, implement via `DataTemplate`
 */
export class Connection<Omitted extends keyof APIConnection | '' = ''> extends Structure<APIConnection, Omitted> {
	/**
	 * The template used for removing data from the raw data stored for each Connection
	 */
	public static override DataTemplate: Partial<APIConnection> = {};

	public constructor(
		/**
		 * The raw data received from the API for the connection
		 */
		data: Omit<APIConnection, Omitted>,
	) {
		super(data);
	}

	public override _patch(data: Partial<APIConnection>) {
		return super._patch(data);
	}

	/**
	 * The id of the connection account
	 */
	public get id() {
		return this[kData].id;
	}

	/**
	 * The username of the connection account
	 */
	public get name() {
		return this[kData].name;
	}

	/**
	 * The type of service this connection is for
	 */
	public get type() {
		return this[kData].type;
	}

	/**
	 * Whether the connection is revoked
	 */
	public get revoked() {
		return this[kData].revoked ?? false;
	}

	/**
	 * Whether the connection is verified
	 */
	public get verified() {
		return this[kData].verified;
	}

	/**
	 * Whether friend sync is enabled for this connection
	 */
	public get friendSync() {
		return this[kData].friend_sync;
	}

	/**
	 * Whether activities related to this connection are shown in the users presence
	 */
	public get showActivity() {
		return this[kData].show_activity;
	}

	/**
	 * Whether this connection has an Oauth2 token for console voice transfer
	 */
	public get twoWayLink() {
		return this[kData].two_way_link;
	}

	/**
	 * The visibilty state for this connection
	 */
	public get visibility() {
		return this[kData].visibility;
	}
}
