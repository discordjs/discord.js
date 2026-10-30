import type {
	APIBan,
	APIChannel,
	APIGuild,
	APIGuildMember,
	APIMessage,
	APIRole,
	APIUser,
	Snowflake,
} from 'discord-api-types/v10';
import { resolveId, type IdResolvable } from '../util.js';
import type {
	AddBanOptions,
	AddMemberOptions,
	CreateChannelOptions,
	CreateMessageOptions,
	CreateRoleOptions,
	UpdateMemberOptions,
	World,
} from './World.js';

/**
 * A read-only view over a set of records in the world.
 */
export class RecordView<Value> implements Iterable<Value> {
	readonly #get: (id: Snowflake) => Value | undefined;

	readonly #list: () => Value[];

	public constructor(get: (id: Snowflake) => Value | undefined, list: () => Value[]) {
		this.#get = get;
		this.#list = list;
	}

	public get(id: IdResolvable): Value | undefined {
		return this.#get(resolveId(id));
	}

	public has(id: IdResolvable): boolean {
		return this.get(id) !== undefined;
	}

	public list(): Value[] {
		return this.#list();
	}

	public get size(): number {
		return this.#list().length;
	}

	public [Symbol.iterator](): Iterator<Value> {
		return this.#list()[Symbol.iterator]();
	}
}

/**
 * A user in the world
 */
export class UserHandle {
	public constructor(
		public readonly world: World,
		public readonly id: Snowflake,
	) {}

	public get data(): APIUser {
		return this.world.requireUser(this.id);
	}
}

/**
 * A guild in the world
 */
export class GuildHandle {
	public readonly bans: RecordView<APIBan>;

	public readonly channels: RecordView<APIChannel>;

	public readonly members: RecordView<APIGuildMember>;

	public readonly roles: RecordView<APIRole>;

	public constructor(
		public readonly world: World,
		public readonly id: Snowflake,
	) {
		this.bans = new RecordView(
			(userId) => world.getBan(id, userId),
			() => world.listBans(id),
		);
		this.channels = new RecordView(
			(channelId) => world.listChannels(id).find((channel) => channel.id === channelId),
			() => world.listChannels(id),
		);
		this.members = new RecordView(
			(userId) => world.getMember(id, userId),
			() => world.listMembers(id),
		);
		this.roles = new RecordView(
			(roleId) => world.getRole(id, roleId),
			() => world.listRoles(id),
		);
	}

	public get data(): APIGuild {
		return this.world.requireGuild(this.id);
	}

	public createChannel(options: CreateChannelOptions): ChannelHandle {
		return this.world.createChannel(this.id, options);
	}

	public createRole(options?: CreateRoleOptions): RoleHandle {
		return this.world.createRole(this.id, options);
	}

	public addMember(user: IdResolvable, options?: AddMemberOptions): MemberHandle {
		return this.world.addMember(this.id, user, options);
	}

	public member(user: IdResolvable): MemberHandle {
		return this.world.member(this.id, user);
	}

	public addBan(user: IdResolvable, options?: AddBanOptions): APIBan {
		return this.world.addBan(this.id, user, options);
	}

	public removeBan(user: IdResolvable): void {
		this.world.removeBan(this.id, user);
	}
}

/**
 * A message in the world
 */
export class MessageHandle {
	public constructor(
		public readonly world: World,
		public readonly channelId: Snowflake,
		public readonly id: Snowflake,
	) {}

	public get data(): APIMessage {
		return this.world.requireMessage(this.channelId, this.id);
	}

	public delete(): void {
		this.world.deleteMessage(this.channelId, this.id);
	}
}

/**
 * A channel in the world, and the mutations that make sense on it
 */
export class ChannelHandle {
	/**
	 * The channel's messages
	 */
	public readonly messages: RecordView<APIMessage>;

	public constructor(
		public readonly world: World,
		public readonly id: Snowflake,
	) {
		this.messages = new RecordView(
			(messageId) => world.getMessage(id, messageId),
			() => world.listMessages(id),
		);
	}

	public get data(): APIChannel {
		return this.world.requireChannel(this.id);
	}

	public createMessage(options: CreateMessageOptions): MessageHandle {
		return this.world.createMessage(this.id, options);
	}

	public message(message: IdResolvable): MessageHandle {
		return new MessageHandle(this.world, this.id, this.world.requireMessage(this.id, resolveId(message)).id);
	}
}

/**
 * A guild member in the world
 */
export class MemberHandle {
	public constructor(
		public readonly world: World,
		public readonly guildId: Snowflake,
		public readonly id: Snowflake,
	) {}

	public get data(): APIGuildMember {
		return this.world.requireMember(this.guildId, this.id);
	}

	public get user(): UserHandle {
		return new UserHandle(this.world, this.id);
	}

	public update(options: UpdateMemberOptions): this {
		this.world.updateMember(this.guildId, this.id, options);
		return this;
	}

	public addRole(role: IdResolvable): this {
		const roleId = resolveId(role);
		const { roles } = this.data;
		return roles.includes(roleId) ? this : this.update({ roles: [...roles, roleId] });
	}

	public removeRole(role: IdResolvable): this {
		const roleId = resolveId(role);
		const { roles } = this.data;
		return roles.includes(roleId) ? this.update({ roles: roles.filter((id) => id !== roleId) }) : this;
	}

	public timeout(until: Date | number | null): this {
		return this.update({ communication_disabled_until: until === null ? null : this.world.timestamp(until) });
	}

	public leave(): void {
		this.world.removeMember(this.guildId, this.id);
	}
}

export class RoleHandle {
	public constructor(
		public readonly world: World,
		public readonly guildId: Snowflake,
		public readonly id: Snowflake,
	) {}

	public get data(): APIRole {
		return this.world.requireRole(this.guildId, this.id);
	}
}
