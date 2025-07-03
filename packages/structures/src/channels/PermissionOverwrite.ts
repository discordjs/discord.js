import type { APIOverwrite } from 'discord-api-types/v10';
import { Structure } from '../Structure.js';
import { PermissionsBitField } from '../bitfields/PermissionsBitField.js';
import { kAllow, kData, kDeny } from '../utils/symbols.js';
import type { Partialize } from '../utils/types.js';

/**
 * Represents metadata of a thread channel on Discord.
 *
 * @typeParam Omitted - Specify the properties that will not be stored in the raw data field as a union, implement via `DataTemplate`
 */
export class PermissionOverwrite<Omitted extends keyof APIOverwrite | '' = 'allow' | 'deny'> extends Structure<
	APIOverwrite,
	Omitted
> {
	protected [kAllow]: bigint | null = null;

	protected [kDeny]: bigint | null = null;

	public constructor(data: Partialize<APIOverwrite, Omitted>) {
		super(data);
		this.optimizeData(data);
	}

	/**
	 * The template used for removing data from the raw data stored for each ThreadMetadata
	 *
	 * @remarks This template has defaults, if you want to remove additional data and keep the defaults,
	 * use `Object.defineProperties`. To override the defaults, set this value directly.
	 */
	public static override readonly DataTemplate: Partial<APIOverwrite> = {
		set allow(_: string) {},
		set deny(_: string) {},
	};

	/**
	 * {@inheritDoc Structure.optimizeData}
	 */
	protected override optimizeData(data: Partial<APIOverwrite>) {
		if (data.allow) {
			this[kAllow] = BigInt(data.allow);
		}

		if (data.deny) {
			this[kDeny] = BigInt(data.deny);
		}
	}

	/**
	 * The permission bit set allowed by this overwrite.
	 */
	public get allow() {
		const allow = this[kAllow];
		return typeof allow === 'bigint' ? new PermissionsBitField(allow) : null;
	}

	/**
	 * The permission bit set denied by this overwrite.
	 */
	public get deny() {
		const deny = this[kDeny];
		return typeof deny === 'bigint' ? new PermissionsBitField(deny) : null;
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
