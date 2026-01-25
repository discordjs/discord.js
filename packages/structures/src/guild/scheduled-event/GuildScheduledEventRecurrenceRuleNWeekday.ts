/* eslint-disable id-length */
import type { APIGuildScheduledEventRecurrenceRuleNWeekday } from 'discord-api-types/v10';
import { Structure } from '../../Structure';
import { kData } from '../../utils/symbols';
import type { Partialize } from '../../utils/types';

/**
 * Represents the N_Weekday structure of a scheduled event's recurrence rule.
 *
 * @typeParam Omitted - Specify the properties that will not be stored in the raw data field as a union, implement via `DataTemplate`
 */
export class GuildScheduledEventRecurrenceRuleNWeekday<
	Omitted extends keyof APIGuildScheduledEventRecurrenceRuleNWeekday | '' = '' | '',
> extends Structure<APIGuildScheduledEventRecurrenceRuleNWeekday, Omitted> {
	/**
	 * The template used for removing data from the raw data stored from the N weekday.
	 */
	public static override readonly DataTemplate: Partial<APIGuildScheduledEventRecurrenceRuleNWeekday> = {};

	/**
	 * @param data - The raw data from the API for the recurrence rule's N weekday.
	 */
	public constructor(data: Partialize<APIGuildScheduledEventRecurrenceRuleNWeekday, Omitted>) {
		super(data);
	}

	/**
	 * The week to reoccur on. (1-5)
	 */
	public get n() {
		return this[kData].n;
	}

	/**
	 * The day within the week of reoccur on.
	 */
	public get day() {
		return this[kData].day;
	}
}
