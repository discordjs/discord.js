import { DiscordSnowflake } from '@sapphire/snowflake';
import type { APIAuditLogEntry } from 'discord-api-types/v10';
import { Structure } from '../Structure';
import { kData } from '../utils/symbols';
import { isIdSet } from '../utils/type-guards';
import type { Partialize } from '../utils/types';

/**
 * Represents an audit log entry on Discord.
 *
 * @typeParam Omitted - Specify the properties that will not be stored in the raw data field as a union, implement via `DataTemplate`
 * @remarks Intentionally does not export `changes` so that extending classes can resolve array to `AuditLogChange[]`
 * @remarks Has substructure `AuditLogOptions`,  which needs to be instantiated and stored by an extending class using it.
 */
export class AuditLogEntry<Omitted extends keyof APIAuditLogEntry | '' = ''> extends Structure<
	APIAuditLogEntry,
	Omitted
> {
	/**
	 * @param data - The raw data received from the API for the audit log entry.
	 */
	public constructor(data: Partialize<APIAuditLogEntry, Omitted>) {
		super(data);
	}

	/**
	 * The id of the affected entity (webhook, user, role, etc.)
	 */
	public get targetId() {
		return this[kData].target_id;
	}

	/**
	 * The user or app that made the changes.
	 */
	public get userId() {
		return this[kData].user_id;
	}

	/**
	 * The id of the entry.
	 */
	public get id() {
		return this[kData].id;
	}

	/**
	 * The type of action that occurred.
	 */
	public get actionType() {
		return this[kData].action_type;
	}

	/**
	 * The reason for the change (0-512 characters)
	 */
	public get reason() {
		return this[kData].reason;
	}

	/**
	 * The timestamp the entry was created at.
	 */
	public get createdTimestamp() {
		return isIdSet(this.id) ? DiscordSnowflake.timestampFrom(this.id) : null;
	}

	/**
	 * The date the entry was created at.
	 */
	public get createdDate() {
		const createdTimestamp = this.createdTimestamp;
		return createdTimestamp ? new Date(createdTimestamp) : null;
	}
}
