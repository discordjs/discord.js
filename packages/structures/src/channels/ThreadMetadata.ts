import type { APIThreadMetadata } from 'discord-api-types/v10';
import { Structure } from '../Structure.js';
import { kArchiveTimestamp, kCreatedTimestamp, kData } from '../utils/symbols.js';

/**
 * Represents metadata of a thread channel on Discord.
 *
 * @typeParam Omitted - Specify the propeties that will not be stored in the raw data field as a union, implement via `DataTemplate`
 */
export class ThreadMetadata<Omitted extends keyof APIThreadMetadata | '' = ''> extends Structure<
	APIThreadMetadata,
	Omitted
> {
	protected [kArchiveTimestamp]: number | null;

	protected [kCreatedTimestamp]: number | null;

	public constructor(data: Partial<APIThreadMetadata>) {
		super(data);
		this._optimizeData(data);
		this[kArchiveTimestamp] ??= null;
		this[kCreatedTimestamp] ??= null;
	}

	/**
	 * The template used for removing data from the raw data stored for each ThreadMetadata
	 *
	 * @remarks This template has defaults, if you want to remove additional data and keep the defaults,
	 * use `Object.defineProperties`. To override the defaults, set this value directly.
	 */
	public static override DataTemplate: Partial<APIThreadMetadata> = {
		set create_timestamp(_: string) {},
		set archive_timestamp(_: string) {},
	};

	/**
	 * {@inheritDoc Structure._optimizeData}
	 */
	protected override _optimizeData(data: Partial<APIThreadMetadata>) {
		this[kCreatedTimestamp] = data.create_timestamp
			? Date.parse(data.create_timestamp)
			: (this[kCreatedTimestamp] ?? null);
		this[kArchiveTimestamp] = data.archive_timestamp
			? Date.parse(data.archive_timestamp)
			: (this[kArchiveTimestamp] ?? null);
	}

	/**
	 * Whether the thread is archived.
	 */
	public get archived() {
		return this[kData].archived;
	}

	/**
	 * The timestamp when the thread's archive status was last changed, used for calculating recent activity.
	 */
	public get archivedTimestamp() {
		return this[kArchiveTimestamp];
	}

	/**
	 * The timestamp when the thread was created; only populated for threads created after 2022-01-09.
	 */
	public get createdTimestamp() {
		return this[kCreatedTimestamp];
	}

	/**
	 * The thread will stop showing in the channel list after auto_archive_duration minutes of inactivity,
	 */
	public get autoArchiveDuration() {
		return this[kData].auto_archive_duration;
	}

	/**
	 * Whether non-moderators can add other non-moderators to a thread; only available on private threads.
	 */
	public get invitable() {
		return this[kData].invitable;
	}

	/**
	 * Whether the thread is locked; when a thread is locked, only users with {@link PermissionFlagsBits.ManageThreads} can unarchive it.
	 */
	public get locked() {
		return this[kData].locked;
	}

	/**
	 * The time the thread was archived at
	 */
	public get archivedAt() {
		const archivedTimestamp = this.archivedTimestamp;
		return archivedTimestamp ? new Date(archivedTimestamp) : null;
	}

	/**
	 * The time the thread was created at
	 */
	public get createdAt() {
		const createdTimestamp = this.createdTimestamp;
		return createdTimestamp ? new Date(createdTimestamp) : null;
	}

	/**
	 * {@inheritDoc Structure.toJSON}
	 */
	public override toJSON() {
		const data = super.toJSON();
		if (this[kArchiveTimestamp]) {
			data.archive_timestamp = new Date(this[kArchiveTimestamp]).toISOString();
		}

		if (this[kCreatedTimestamp]) {
			data.create_timestamp = new Date(this[kCreatedTimestamp]).toISOString();
		}

		return data;
	}
}
