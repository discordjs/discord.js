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

	public get archived() {
		return this[kData].archived;
	}

	public get archivedTimestamp() {
		return this[kArchiveTimestamp];
	}

	public get createdTimestamp() {
		return this[kCreatedTimestamp];
	}

	public get autoArchiveDuration() {
		return this[kData].auto_archive_duration;
	}

	public get invitable() {
		return this[kData].invitable;
	}

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
}
