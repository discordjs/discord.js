import type { APIOverwrite } from 'discord-api-types/v10';
import { Structure } from '../Structure.js';
import { kAllow, kData, kDeny } from '../utils/symbols.js';

/**
 * Represents metadata of a thread channel on Discord.
 *
 * @typeParam Omitted - Specify the propeties that will not be stored in the raw data field as a union, implement via `DataTemplate`
 */
export class PermissionOverwrite<Omitted extends keyof APIOverwrite | '' = ''> extends Structure<
	APIOverwrite,
	Omitted
> {
	protected [kAllow]: bigint | null;

	protected [kDeny]: bigint | null;

	public constructor(data: Partial<APIOverwrite>) {
		super(data);
		this._optimizeData(data);
		this[kAllow] ??= null;
		this[kDeny] ??= null;
	}

	/**
	 * The template used for removing data from the raw data stored for each ThreadMetadata
	 *
	 * @remarks This template has defaults, if you want to remove additional data and keep the defaults,
	 * use `Object.defineProperties`. To override the defaults, set this value directly.
	 */
	public static override DataTemplate: Partial<APIOverwrite> = {
		set allow(_: string) {},
		set deny(_: string) {},
	};

	/**
	 * {@inheritDoc Structure._optimizeData}
	 */
	protected override _optimizeData(data: Partial<APIOverwrite>) {
		this[kAllow] = data.allow ? BigInt(data.allow) : (this[kAllow] ?? null);
		this[kDeny] = data.deny ? BigInt(data.deny) : (this[kDeny] ?? null);
	}

	/**
	 * The permission bit set allowed by this overwrite.
	 */
	public get allow() {
		return this[kAllow];
	}

	/**
	 * The permission bit set denied by this overwrite.
	 */
	public get deny() {
		return this[kDeny];
	}

	/**
	 * The role or user id for this overwrite.
	 */
	public get id() {
		return this[kData].id;
	}

	/**
	 * The type of this overwrite.
	 */
	public get type() {
		return this[kData].type;
	}

	/**
	 * {@inheritDoc Structure.toJSON}
	 */
	public override toJSON() {
		const clone = super.toJSON();
		if (this[kAllow]) {
			clone.allow = this[kAllow].toString();
		}

		if (this[kDeny]) {
			clone.deny = this[kDeny].toString();
		}

		return clone;
	}
}
