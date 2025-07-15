import type { APIChannelMention, APIMessage, APIUser } from 'discord-api-types/v10';
import { Structure } from '../Structure.js';
import { kData, kEditedTimestamp } from '../utils/symbols.js';
import type { Partialize } from '../utils/types.js';

export type APIMessageMentions = Pick<
	APIMessage,
	'mention_channels' | 'mention_everyone' | 'mention_roles' | 'mentions'
>;
// TODO: missing substructures: users, channels

/**
 * Represents mentions on a message on Discord.
 *
 * @typeParam Omitted - Specify the properties that will not be stored in the raw data field as a union, implement via `DataTemplate`
 * @remarks has substructures `MentionChannel`, `User` which need to be instantiated and stored by an extending class using it
 */
export class MessageMentions<Omitted extends keyof APIMessageMentions | '' = ''> extends Structure<
	APIMessageMentions,
	Omitted
> {
	/**
	 * The template used for removing data from the raw data stored for each Message
	 */
	public static override DataTemplate: Partial<APIMessageMentions> = {
		set mentions(_: APIUser[]) {},
		set mention_channels(_: APIChannelMention[]) {},
	};

	protected [kEditedTimestamp]: number | null = null;

	/**
	 * @param data - The raw data received from the API for the message
	 */
	public constructor(data: Partialize<APIMessageMentions, Omitted>) {
		super(data);
		this.optimizeData(data);
	}

	/**
	 * The mentioned roles
	 */
	public get roles(): readonly string[] | null {
		return Array.isArray(this[kData].mention_roles) ? this[kData].mention_roles : null;
	}

	/**
	 * The mentioned channels
	 */
	public get channels() {
		// TODO: this is an array of objects, should probably be a substructure or...?
		return this[kData].mention_channels;
	}

	/**
	 * Whether `@everyone` or `@here`were mentioned
	 */
	public get everyone() {
		return this[kData].mention_everyone;
	}
}
