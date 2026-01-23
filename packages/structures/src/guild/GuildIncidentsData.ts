import type { APIIncidentsData } from 'discord-api-types/v10';
import { Structure } from '../Structure';
import { dateToDiscordISOTimestamp } from '../utils/optimization';
import { kDmSpamDetectedAt, kDmsDisabledUntil, kInvitesDisabledUntil, kRaidDetectedAt } from '../utils/symbols';
import type { Partialize } from '../utils/types';

/**
 * Represents incident data on Discord.
 *
 * @typeParam Omitted - Specify the properties that will not be stored in the raw data field as a union, implement via `DataTemplate`
 */
export class GuildIncidentsData<
	Omitted extends keyof APIIncidentsData | '' =
		| 'dm_spam_detected_at'
		| 'dms_disabled_until'
		| 'invites_disabled_until'
		| 'raid_detected_at',
> extends Structure<APIIncidentsData, Omitted> {
	/**
	 * The template used for removing data from the raw data stored for each IncidentsData
	 *
	 * @remarks This template has defaults, if you want to remove additional data and keep the defaults,
	 * use `Object.defineProperties`. To override the defaults, set this value directly.
	 */
	public static override readonly DataTemplate: Partial<APIIncidentsData> = {
		set dm_spam_detected_at(_: string) {},
		set dms_disabled_until(_: string) {},
		set invites_disabled_until(_: string) {},
		set raid_detected_at(_: string) {},
	};

	protected [kDmSpamDetectedAt]: number | null = null;

	protected [kDmsDisabledUntil]: number | null = null;

	protected [kInvitesDisabledUntil]: number | null = null;

	protected [kRaidDetectedAt]: number | null = null;

	/**
	 * @param data - The raw data from the API for the incident data.
	 */
	public constructor(data: Partialize<APIIncidentsData, Omitted>) {
		super(data);
		this.optimizeData(data);
	}

	/**
	 * {@inheritDoc Structure.optimizeData}
	 */
	protected override optimizeData(data: Partial<APIIncidentsData>): void {
		if (data.dm_spam_detected_at) {
			this[kDmSpamDetectedAt] = Date.parse(data.dm_spam_detected_at);
		}

		if (data.dms_disabled_until) {
			this[kDmsDisabledUntil] = Date.parse(data.dms_disabled_until);
		}

		if (data.invites_disabled_until) {
			this[kInvitesDisabledUntil] = Date.parse(data.invites_disabled_until);
		}

		if (data.raid_detected_at) {
			this[kRaidDetectedAt] = Date.parse(data.raid_detected_at);
		}
	}

	/**
	 * {@inheritDoc Structure.toJSON}
	 */
	public override toJSON() {
		const clone = super.toJSON();

		const dmSpamDetectedAt = this[kDmSpamDetectedAt];
		const dmsDisabledUntil = this[kDmsDisabledUntil];
		const invitesDisabledUntil = this[kInvitesDisabledUntil];
		const raidDetectedAt = this[kRaidDetectedAt];

		if (dmSpamDetectedAt) {
			clone.dm_spam_detected_at = dateToDiscordISOTimestamp(new Date(dmSpamDetectedAt));
		}

		if (dmsDisabledUntil) {
			clone.dms_disabled_until = dateToDiscordISOTimestamp(new Date(dmsDisabledUntil));
		}

		if (invitesDisabledUntil) {
			clone.invites_disabled_until = dateToDiscordISOTimestamp(new Date(invitesDisabledUntil));
		}

		if (raidDetectedAt) {
			clone.raid_detected_at = dateToDiscordISOTimestamp(new Date(raidDetectedAt));
		}

		return clone;
	}
}
