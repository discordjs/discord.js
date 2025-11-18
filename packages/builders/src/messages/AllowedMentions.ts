import type { JSONEncodable } from '@discordjs/util';
import type { AllowedMentionsTypes, APIAllowedMentions, Snowflake } from 'discord-api-types/v10';
import { Refineable } from '../mixins/Refineable.js';
import { normalizeArray, type RestOrArray } from '../util/normalizeArray.js';
import { validate } from '../util/validation.js';
import { allowedMentionPredicate } from './Assertions.js';

/**
 * A builder that creates API-compatible JSON data for allowed mentions.
 */
export class AllowedMentionsBuilder extends Refineable implements JSONEncodable<APIAllowedMentions> {
	/**
	 * The API data associated with these allowed mentions.
	 */
	private readonly data: Partial<APIAllowedMentions>;

	/**
	 * Creates a new allowed mentions builder.
	 *
	 * @param data - The API data to create this allowed mentions with
	 */
	public constructor(data: Partial<APIAllowedMentions> = {}) {
		super();
		this.data = { ...structuredClone(data) };
	}

	/**
	 * Sets the types of mentions to parse from the content.
	 *
	 * @param parse - The types of mentions to parse from the content
	 */
	public setParse(...parse: RestOrArray<AllowedMentionsTypes>): this {
		this.data.parse = normalizeArray(parse);
		return this;
	}

	/**
	 * Clears the parse mention types.
	 */
	public clearParse(): this {
		this.data.parse = undefined;
		return this;
	}

	/**
	 * Sets the roles to mention.
	 *
	 * @param roles - The roles to mention
	 */
	public setRoles(...roles: RestOrArray<Snowflake>): this {
		this.data.roles = normalizeArray(roles);
		return this;
	}

	/**
	 * Adds roles to mention.
	 *
	 * @param roles - The roles to mention
	 */
	public addRoles(...roles: RestOrArray<Snowflake>): this {
		this.data.roles ??= [];
		this.data.roles.push(...normalizeArray(roles));

		return this;
	}

	/**
	 * Removes, replaces, or inserts roles.
	 *
	 * @remarks
	 * This method behaves similarly
	 * to {@link https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Array/splice | Array.prototype.splice()}.
	 *
	 * It's useful for modifying and adjusting order of the already-existing roles.
	 * @example
	 * Remove the first role:
	 * ```ts
	 * allowedMentions.spliceRoles(0, 1);
	 * ```
	 * @example
	 * Remove the first n roles:
	 * ```ts
	 * const n = 4;
	 * allowedMentions.spliceRoles(0, n);
	 * ```
	 * @example
	 * Remove the last role:
	 * ```ts
	 * allowedMentions.spliceRoles(-1, 1);
	 * ```
	 * @param index - The index to start at
	 * @param deleteCount - The number of roles to remove
	 * @param roles - The replacing role ids
	 */
	public spliceRoles(index: number, deleteCount: number, ...roles: RestOrArray<Snowflake>): this {
		this.data.roles ??= [];
		this.data.roles.splice(index, deleteCount, ...normalizeArray(roles));
		return this;
	}

	/**
	 * Clears the roles to mention.
	 */
	public clearRoles(): this {
		this.data.roles = undefined;
		return this;
	}

	/**
	 * Sets the users to mention.
	 *
	 * @param users - The users to mention
	 */
	public setUsers(...users: RestOrArray<Snowflake>): this {
		this.data.users = normalizeArray(users);
		return this;
	}

	/**
	 * Adds users to mention.
	 *
	 * @param users - The users to mention
	 */
	public addUsers(...users: RestOrArray<Snowflake>): this {
		this.data.users ??= [];
		this.data.users.push(...normalizeArray(users));
		return this;
	}

	/**
	 * Removes, replaces, or inserts users.
	 *
	 * @remarks
	 * This method behaves similarly
	 * to {@link https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Array/splice | Array.prototype.splice()}.
	 *
	 * It's useful for modifying and adjusting order of the already-existing users.
	 * @example
	 * Remove the first user:
	 * ```ts
	 * allowedMentions.spliceUsers(0, 1);
	 * ```
	 * @example
	 * Remove the first n users:
	 * ```ts
	 * const n = 4;
	 * allowedMentions.spliceUsers(0, n);
	 * ```
	 * @example
	 * Remove the last user:
	 * ```ts
	 * allowedMentions.spliceUsers(-1, 1);
	 * ```
	 * @param index - The index to start at
	 * @param deleteCount - The number of users to remove
	 * @param users - The replacing user ids
	 */
	public spliceUsers(index: number, deleteCount: number, ...users: RestOrArray<Snowflake>): this {
		this.data.users ??= [];
		this.data.users.splice(index, deleteCount, ...normalizeArray(users));
		return this;
	}

	/**
	 * Clears the users to mention.
	 */
	public clearUsers(): this {
		this.data.users = undefined;
		return this;
	}

	/**
	 * For replies, sets whether to mention the author of the message being replied to.
	 *
	 * @param repliedUser - Whether to mention the author of the message being replied to
	 */
	public setRepliedUser(repliedUser = true): this {
		this.data.replied_user = repliedUser;
		return this;
	}

	/**
	 * Serializes this builder to API-compatible JSON data.
	 *
	 * Note that by disabling validation, there is no guarantee that the resulting object will be valid.
	 *
	 * @param validationOverride - Force validation to run/not run regardless of your global preference
	 */
	public toJSON(validationOverride?: boolean): APIAllowedMentions {
		const clone = structuredClone(this.data);
		validate(allowedMentionPredicate, clone, validationOverride);

		return clone as APIAllowedMentions;
	}
}
