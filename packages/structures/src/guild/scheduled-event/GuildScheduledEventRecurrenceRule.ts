import type {
	APIGuildScheduledEventRecurrenceRule,
	GuildScheduledEventRecurrenceRuleFrequency,
} from 'discord-api-types/v10';
import { Structure } from '../../Structure';
import { dateToDiscordISOTimestamp } from '../../utils/optimization';
import { kData, kEnd, kStart } from '../../utils/symbols';
import type { Partialize } from '../../utils/types';

/**
 * Represents the recurrence rule of a scheduled event on Discord.
 *
 * @typeParam Omitted - Specify the properties that will not be stored in the raw data field as a union, implement via `DataTemplate`
 * @remarks Intentionally does not export `byNWeekday`, so that extending classes can resolve array to `GuildScheduledEventRecurenceRuleNWeekday[]`.
 */
export class GuildScheduledEventRecurrenceRule<
	Omitted extends keyof APIGuildScheduledEventRecurrenceRule | '' = 'end' | 'start',
> extends Structure<APIGuildScheduledEventRecurrenceRule, Omitted> {
	/**
	 * The template used for removing data from the raw data stored for each `GuildScheduledEventRecurrenceRule`
	 *
	 * @remarks This template has defaults, if you want to remove additional data and keep the defaults,
	 * use `Object.defineProperties`. To override the defaults, set this value directly.
	 */
	public static override readonly DataTemplate: Partial<APIGuildScheduledEventRecurrenceRule> = {
		set start(_: string) {},
		set end(_: string) {},
	};

	protected [kStart]: number | null = null;

	protected [kEnd]: number | null = null;

	/**
	 * @param data - The raw data from the API for the recurrence rule.
	 */
	public constructor(data: Partialize<APIGuildScheduledEventRecurrenceRule, Omitted>) {
		super(data);
		this.optimizeData(data);
	}

	/**
	 * How often the event occurs.
	 */
	public get frequency() {
		return this[kData].frequency;
	}

	/**
	 * The spacing between events, defined by `frequency`.
	 * For example, a `frequency` of {@link GuildScheduledEventRecurrenceRuleFrequency.Weekly} and an `interval` of `2` would be "every-other-week"
	 */
	public get interval() {
		return this[kData].interval;
	}

	/**
	 * Set of specific days within a week for the event to recur on.
	 */
	public get byWeekday() {
		return this[kData].by_weekday;
	}

	/**
	 * Set of specific months to recur on.
	 */
	public get byMonth() {
		return this[kData].by_month;
	}

	/**
	 * Set of specific dates within a month to recur on.
	 */
	public get byMonthDay() {
		return this[kData].by_month_day;
	}

	/**
	 * Set of days within a year to recur on. (1-364)
	 */
	public get byYearDay() {
		return this[kData].by_year_day;
	}

	/**
	 * The total amount of times that the event is allowed to recur before stopping.
	 */
	public get count() {
		return this[kData].count;
	}

	/**
	 * {@inheritDoc Structure.optimizeData}
	 */
	protected override optimizeData(data: Partial<APIGuildScheduledEventRecurrenceRule>) {
		if (data.start) {
			this[kStart] = Date.parse(data.start);
		}

		if (data.end) {
			this[kEnd] = Date.parse(data.end);
		}
	}

	/**
	 * {@inheritDoc Structure.toJSON}
	 */
	public override toJSON() {
		const clone = super.toJSON();

		const start = this[kStart];
		const end = this[kEnd];

		if (start) {
			clone.start = dateToDiscordISOTimestamp(new Date(start));
		}

		if (end) {
			clone.end = dateToDiscordISOTimestamp(new Date(end));
		}

		return clone;
	}
}
