import type { APIApplicationIdentityProfilePrimaryData } from 'discord-api-types/v10';
import { Structure } from '../Structure.js';
import { kData } from '../utils/symbols.js';
import type { Partialize } from '../utils/types.js';

/**
 * Represents the pre-configured game stats in an application identity profile.
 *
 * @typeParam Omitted - Specify properties removed from raw data through `DataTemplate`.
 * @remarks `rank_image`, `highest_rank_image`, and `featured_played_character_image` contain
 * `ApplicationIdentityProfileMedia` substructures. They remain raw for an extending class to instantiate and expose,
 * and are preserved in `toJSON()`.
 */
export class ApplicationIdentityProfilePrimaryData<
	Omitted extends keyof APIApplicationIdentityProfilePrimaryData | '' = '',
> extends Structure<APIApplicationIdentityProfilePrimaryData, Omitted> {
	/** The template used to remove properties from the raw pre-configured game stats. */
	public static override readonly DataTemplate: Partial<APIApplicationIdentityProfilePrimaryData> = {};

	/**
	 * @param data - The raw pre-configured game stats received from the API.
	 */
	public constructor(data: Partialize<APIApplicationIdentityProfilePrimaryData, Omitted>) {
		super(data);
	}

	/** The current season name. */
	public get season() {
		return this[kData].season;
	}

	/** The current rank name. */
	public get rankName() {
		return this[kData].rank_name;
	}

	/** The highest rank achieved. */
	public get highestRank() {
		return this[kData].highest_rank;
	}

	/** The name of the featured played character. */
	public get featuredPlayedCharacter() {
		return this[kData].featured_played_character;
	}

	/** Total playtime in hours, including fractional hours. */
	public get playtimeHours() {
		return this[kData].playtime_hours;
	}

	/** The total number of wins. */
	public get totalWins() {
		return this[kData].total_wins;
	}

	/** Wins in the current period. */
	public get currentPeriodWins() {
		return this[kData].current_period_wins;
	}

	/** The total number of games played. */
	public get totalGames() {
		return this[kData].total_games;
	}

	/** Games played in the current period. */
	public get currentPeriodGames() {
		return this[kData].current_period_games;
	}

	/** The total number of kills. */
	public get totalKills() {
		return this[kData].total_kills;
	}

	/** Kills in the current period. */
	public get currentPeriodKills() {
		return this[kData].current_period_kills;
	}

	/** The total number of assists. */
	public get totalAssists() {
		return this[kData].total_assists;
	}

	/** Assists in the current period. */
	public get currentPeriodAssists() {
		return this[kData].current_period_assists;
	}

	/** The total number of deaths. */
	public get totalDeaths() {
		return this[kData].total_deaths;
	}

	/** Deaths in the current period. */
	public get currentPeriodDeaths() {
		return this[kData].current_period_deaths;
	}
}
