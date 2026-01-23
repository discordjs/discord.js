import type { APIIncidentsData } from 'discord-api-types/v10';
import { Structure } from '../Structure';
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

	protected override optimizeData(data: Partial<APIIncidentsData>): void {
		if (data.dm_spam_detected_at) {
			this[kDmSpamDetectedAt] = Date.parse(data.dm_spam_detected_at);
		}

		if (data.dms_disabled_until) {
			this[kDmSpamDetectedAt] = Date.parse(data.dms_disabled_until);
		}

		if (data.invites_disabled_until) {
			this[kDmSpamDetectedAt] = Date.parse(data.invites_disabled_until);
		}

		if (data.raid_detected_at) {
			this[kDmSpamDetectedAt] = Date.parse(data.raid_detected_at);
		}
	}
}
