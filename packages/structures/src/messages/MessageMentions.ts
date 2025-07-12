import type { APIChannelMention, APIMessage, APIUser } from 'discord-api-types/v10';
import { Structure } from '../Structure.js';
import { kData, kEditedTimestamp, kPatch } from '../utils/symbols.js';
import type { Partialize } from '../utils/types.js';

export type APIMessageMentions = Pick<
	APIMessage,
	'mention_channels' | 'mention_everyone' | 'mention_roles' | 'mentions'
>;

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
	 * {@inheritDoc Structure._patch}
	 *
	 * @internal
	 */
	public override [kPatch](data: Partial<APIMessageMentions>) {
		return super[kPatch](data);
	}

	/**
	 * The mentioned users
	 */
	public get users() {
		return this[kData].mentions;
	}

	/**
	 * The mentioned roles
	 */
	public get roles() {
		return this[kData].mention_roles;
	}

	/**
	 * The mentioned channels
	 */
	public get channels() {
		return this[kData].mention_channels;
	}

	/**
	 * Whether `@everyone` or `@here`were mentioned
	 */
	public get everyone() {
		return this[kData].mention_everyone;
	}
}
